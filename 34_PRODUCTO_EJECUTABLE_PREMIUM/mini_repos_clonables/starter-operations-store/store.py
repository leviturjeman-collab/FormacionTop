"""Local durable capacity and budget store for n8n.

Set OPERATIONS_TOKEN (32+ random characters), OPERATIONS_DB and CAPACITY_LIMITS.
Example CAPACITY_LIMITS: {"event:demo":80,"restaurant:*:comida_1330":52}
Run: uvicorn store:app --host 127.0.0.1 --port 8081
The database is authoritative. Spreadsheet mirrors never decide remaining seats.
"""
import fnmatch
import hmac
import json
import os
import sqlite3
import time
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, ConfigDict, Field

TOKEN = os.environ.get('OPERATIONS_TOKEN', '')
if len(TOKEN) < 32:
    raise RuntimeError('OPERATIONS_TOKEN must contain at least 32 characters')
DB = os.environ.get('OPERATIONS_DB', 'operations.sqlite3')
LIMITS = json.loads(os.environ.get('CAPACITY_LIMITS', '{}'))
BUDGETS = json.loads(os.environ.get('BUDGET_LIMITS_MICRO_USD', '{}'))
app = FastAPI(title='Durable operations store', version='1.0')


class ClosingConnection(sqlite3.Connection):
    def __exit__(self, *args):
        try:
            return super().__exit__(*args)
        finally:
            self.close()

def connect():
    db = sqlite3.connect(DB, timeout=20, factory=ClosingConnection)
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA journal_mode=WAL')
    db.execute('CREATE TABLE IF NOT EXISTS reservations (id TEXT PRIMARY KEY, scope TEXT NOT NULL, units INTEGER NOT NULL CHECK(units>0), status TEXT NOT NULL, expires REAL NOT NULL, payload TEXT NOT NULL, created REAL NOT NULL)')
    db.execute('CREATE TABLE IF NOT EXISTS budgets (id TEXT PRIMARY KEY, app TEXT NOT NULL, day TEXT NOT NULL, ceiling INTEGER NOT NULL, charged INTEGER NOT NULL, status TEXT NOT NULL)')
    return db


def authorize(token):
    if not hmac.compare_digest(token, TOKEN):
        raise HTTPException(401, 'unauthorized')


class BudgetReservation(BaseModel):
    model_config = ConfigDict(extra='forbid')
    id: str = Field(min_length=3, max_length=200)
    app: str = Field(min_length=1, max_length=100)
    ceiling_micro_usd: int = Field(ge=1, le=1000000000000, strict=True)


class BudgetSettlement(BaseModel):
    model_config = ConfigDict(extra='forbid')
    id: str = Field(min_length=3, max_length=200)
    actual_micro_usd: int = Field(ge=0, le=1000000000000, strict=True)


@app.post('/budget/reserve')
def budget_reserve(value: BudgetReservation, x_operations_token: str = Header(default='')):
    authorize(x_operations_token)
    limit = BUDGETS.get(value.app)
    if type(limit) is not int or limit < 1:
        raise HTTPException(422, 'application budget not configured')
    day = time.strftime('%Y-%m-%d', time.gmtime())
    with connect() as db:
        db.execute('BEGIN IMMEDIATE')
        existing = db.execute('SELECT * FROM budgets WHERE id=?', (value.id,)).fetchone()
        if existing:
            # A replay must not dispatch the paid operation again, even after a timeout.
            raise HTTPException(409, 'request already reserved; inspect status before retrying provider')
        used = db.execute('SELECT coalesce(sum(charged),0) FROM budgets WHERE app=? AND day=?', (value.app, day)).fetchone()[0]
        if used + value.ceiling_micro_usd > limit:
            raise HTTPException(429, 'budget exhausted; provider must not be called')
        db.execute('INSERT INTO budgets VALUES(?,?,?,?,?,?)', (value.id, value.app, day, value.ceiling_micro_usd, value.ceiling_micro_usd, 'reserved'))
    return {'id': value.id, 'authorized': True, 'ceiling_micro_usd': value.ceiling_micro_usd, 'remaining_micro_usd': limit-used-value.ceiling_micro_usd}


@app.post('/budget/settle')
def budget_settle(value: BudgetSettlement, x_operations_token: str = Header(default='')):
    authorize(x_operations_token)
    with connect() as db:
        db.execute('BEGIN IMMEDIATE')
        row = db.execute('SELECT * FROM budgets WHERE id=?', (value.id,)).fetchone()
        if not row:
            raise HTTPException(404, 'unknown reservation')
        if row['status'] == 'settled':
            if row['charged'] != value.actual_micro_usd:
                raise HTTPException(409, 'conflicting settlement')
        else:
            # Record actual overspend too; never hide a violated provider ceiling.
            db.execute("UPDATE budgets SET charged=?,status='settled' WHERE id=?", (value.actual_micro_usd, value.id))
    return {'id': value.id, 'settled': True, 'ceiling_violated': value.actual_micro_usd > row['ceiling']}


@app.get('/budget/{ident}')
def budget_status(ident: str, x_operations_token: str = Header(default='')):
    authorize(x_operations_token)
    with connect() as db:
        row = db.execute('SELECT * FROM budgets WHERE id=?', (ident,)).fetchone()
    if not row:
        raise HTTPException(404, 'unknown reservation')
    return dict(row)


def scope_limit(scope):
    matches = [v for pattern, v in LIMITS.items() if fnmatch.fnmatchcase(scope, pattern)]
    if len(matches) != 1 or not isinstance(matches[0], int) or matches[0] < 1:
        raise HTTPException(422, 'scope must match exactly one configured capacity')
    return matches[0]


class Reservation(BaseModel):
    model_config = ConfigDict(extra='forbid')
    id: str = Field(min_length=3, max_length=200)
    scope: str = Field(min_length=3, max_length=200)
    units: int = Field(ge=1, le=1000, strict=True)
    hold_seconds: int = Field(default=1800, ge=60, le=86400, strict=True)
    payload: dict


class Decision(BaseModel):
    model_config = ConfigDict(extra='forbid')
    id: str = Field(min_length=3, max_length=200)
    decision: str = Field(pattern='^(confirmed|cancelled)$')


def reserve_capacity(value: Reservation):
    capacity = scope_limit(value.scope)
    now = time.time()
    with connect() as db:
        db.execute('BEGIN IMMEDIATE')
        db.execute("UPDATE reservations SET status='expired' WHERE status='held' AND expires<=?", (now,))
        existing = db.execute('SELECT * FROM reservations WHERE id=?', (value.id,)).fetchone()
        if existing:
            if existing['scope'] != value.scope or existing['units'] != value.units:
                raise HTTPException(409, 'idempotency key conflicts with original request')
            return {'id': existing['id'], 'accepted': existing['status'] in ('held', 'confirmed'), 'duplicate': True, 'status': existing['status'], 'payload': json.loads(existing['payload'])}
        occupied = db.execute("SELECT COALESCE(SUM(units),0) FROM reservations WHERE scope=? AND status IN ('held','confirmed')", (value.scope,)).fetchone()[0]
        accepted = occupied + value.units <= capacity
        status = 'held' if accepted else 'waitlisted'
        db.execute('INSERT INTO reservations VALUES (?,?,?,?,?,?,?)', (value.id, value.scope, value.units, status, now + value.hold_seconds, json.dumps(value.payload), now))
        return {'id': value.id, 'accepted': accepted, 'duplicate': False, 'status': status, 'remaining': max(0, capacity - occupied - (value.units if accepted else 0)), 'payload': value.payload}


def decide_capacity(value: Decision):
    now = time.time()
    with connect() as db:
        db.execute('BEGIN IMMEDIATE')
        current = db.execute('SELECT * FROM reservations WHERE id=?', (value.id,)).fetchone()
        if not current:
            raise HTTPException(404, 'reservation_not_found')
        if value.decision == 'confirmed' and current['status'] != 'confirmed':
            if current['status'] != 'held' or current['expires'] <= now:
                raise HTTPException(409, 'hold expired or unavailable; do not send confirmation')
        db.execute('UPDATE reservations SET status=? WHERE id=?', (value.decision, value.id))
        return {'id': value.id, 'status': value.decision, 'payload': json.loads(current['payload'])}


@app.post('/capacity/reserve')
def reserve(value: Reservation, x_operations_token: str = Header(default='')):
    authorize(x_operations_token)
    return reserve_capacity(value)


@app.post('/capacity/decide')
def decide(value: Decision, x_operations_token: str = Header(default='')):
    authorize(x_operations_token)
    return decide_capacity(value)


@app.get('/capacity/{ident}')
def status(ident: str, x_operations_token: str = Header(default='')):
    authorize(x_operations_token)
    with connect() as db:
        row = db.execute('SELECT id,status,scope,units FROM reservations WHERE id=?', (ident,)).fetchone()
    if not row:
        raise HTTPException(404, 'reservation_not_found')
    return dict(row)
