"""GitHub webhook gateway: signature, repository allowlist, durable inbox, retries.

pip install fastapi uvicorn
Configure WEBHOOK_SECRET, N8N_GATEWAY_TOKEN, ALLOWED_REPOS (owner/repo,comma-separated),
and N8N_ISSUE_URL / N8N_PR_URL / N8N_PUSH_URL (loopback only).
uvicorn webhook:app --host 127.0.0.1 --port 8000
python webhook.py --drain retries queued events after restart. Schedule that command
with your server's job runner. 202 means persisted pending, not executed.
"""
import argparse, hashlib, hmac, json, os, sqlite3, time
import urllib.request, urllib.parse
from fastapi import BackgroundTasks, FastAPI, Header, HTTPException, Request

DB=os.environ.get('WEBHOOK_DB','webhook-inbox.sqlite3')
SECRET=os.environ.get('WEBHOOK_SECRET','')
TOKEN=os.environ.get('N8N_GATEWAY_TOKEN','')
REPOS={v.strip() for v in os.environ.get('ALLOWED_REPOS','').split(',') if v.strip()}
if len(SECRET)<32 or len(TOKEN)<32 or not REPOS:
    raise RuntimeError('Configure secrets of at least 32 characters and ALLOWED_REPOS')
app=FastAPI(title='Verified GitHub gateway')

class ClosingConnection(sqlite3.Connection):
    def __exit__(self, *args):
        try:
            return super().__exit__(*args)
        finally:
            self.close()

def database():
    db=sqlite3.connect(DB,timeout=10,factory=ClosingConnection)
    db.execute('CREATE TABLE IF NOT EXISTS inbox(id TEXT PRIMARY KEY, route TEXT NOT NULL, payload TEXT NOT NULL, status TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, updated REAL NOT NULL)')
    return db

def valid_signature(body,signature):
    expected='sha256='+hmac.new(SECRET.encode(),body,hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected,signature)

def forward_one(ident):
    with database() as db:
        db.execute('BEGIN IMMEDIATE')
        row=db.execute("SELECT route,payload,attempts FROM inbox WHERE id=? AND status='pending'",(ident,)).fetchone()
        if not row:return
        route,payload,attempts=row
        db.execute("UPDATE inbox SET status='processing',attempts=attempts+1,updated=? WHERE id=?",(time.time(),ident));db.commit()
    try:
        url=os.environ.get('N8N_'+route.upper()+'_URL','')
        parsed=urllib.parse.urlparse(url)
        if parsed.scheme!='http' or parsed.hostname not in {'127.0.0.1','localhost','::1'}:
            raise ValueError('Forward target must be configured loopback n8n')
        request=urllib.request.Request(url,data=payload.encode(),method='POST',headers={'content-type':'application/json','X-Academy-Gateway':TOKEN,'X-GitHub-Delivery':ident})
        class NoRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self,*args,**kwargs):raise ValueError('Forward redirect forbidden')
        with urllib.request.build_opener(NoRedirect).open(request,timeout=20) as response:
            if not 200<=response.status<300:raise ValueError('Upstream rejected')
        status='delivered'
    except Exception:status='dead_letter' if attempts>=4 else 'pending'
    with database() as db:db.execute('UPDATE inbox SET status=?,updated=? WHERE id=?',(status,time.time(),ident))

@app.post('/webhook/{route}',status_code=202)
async def receive(route: str,request: Request,tasks: BackgroundTasks,x_hub_signature_256: str=Header(default=''),x_github_delivery: str=Header(default='')):
    if route not in {'issue','pr','push'}:raise HTTPException(404,'unknown_route')
    if not 8<=len(x_github_delivery)<=100 or not all(c.isalnum() or c in '-_' for c in x_github_delivery):raise HTTPException(400,'delivery_id_required')
    parts=[]; size=0
    async for chunk in request.stream():
        size+=len(chunk)
        if size>1000000:raise HTTPException(413,'too_large')
        parts.append(chunk)
    body=b''.join(parts)
    if not valid_signature(body,x_hub_signature_256):raise HTTPException(401,'invalid_signature')
    try:event=json.loads(body)
    except (ValueError,UnicodeError):raise HTTPException(400,'invalid_json')
    if not isinstance(event,dict) or not isinstance(event.get('repository'),dict):raise HTTPException(400,'invalid_event')
    if event['repository'].get('full_name') not in REPOS:raise HTTPException(403,'repository_not_allowed')
    with database() as db:
        db.execute('INSERT OR IGNORE INTO inbox(id,route,payload,status,updated) VALUES (?,?,?,?,?)',(x_github_delivery,route,json.dumps(event),'pending',time.time()))
        state=db.execute('SELECT status FROM inbox WHERE id=?',(x_github_delivery,)).fetchone()[0]
    if state=='pending':tasks.add_task(forward_one,x_github_delivery)
    return {'received':True,'id':x_github_delivery,'status':state}

def drain():
    with database() as db:
        db.execute("UPDATE inbox SET status='pending' WHERE status='processing' AND updated<?",(time.time()-120,))
        ids=[r[0] for r in db.execute("SELECT id FROM inbox WHERE status='pending' ORDER BY updated LIMIT 100")]
    for ident in ids:forward_one(ident)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--drain',action='store_true');args=parser.parse_args()
    if args.drain:drain()
    else:parser.print_help()
