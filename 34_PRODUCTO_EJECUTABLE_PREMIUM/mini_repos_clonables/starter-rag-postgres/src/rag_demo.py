#!/usr/bin/env python3
"""Grounded retrieval with citations. --demo uses in-memory SQLite, no API.

Real mode uses PostgreSQL and DATABASE_URL. Answer is an extract of source text,
not generated prose. No embeddings or LLM are claimed by this starter.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import sqlite3


class Corpus:
    def __init__(self, db, postgres=False):
        self.db = db
        self.postgres = postgres

    def execute(self, sql, args=()):
        return self.db.execute(sql.replace('?', '%s') if self.postgres else sql, args)

    def initialize(self):
        self.execute('CREATE TABLE IF NOT EXISTS document_chunks (owner_id TEXT NOT NULL, document_id TEXT NOT NULL, version TEXT NOT NULL, position INTEGER NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, PRIMARY KEY(owner_id,document_id,position))')
        self.db.commit()

    def ingest(self, owner, document_id, title, text):
        if not all(isinstance(v, str) and v.strip() for v in (owner, document_id, title, text)):
            raise ValueError('owner, document_id, title and text are required')
        version = hashlib.sha256(text.encode()).hexdigest()
        previous = self.execute('SELECT version FROM document_chunks WHERE owner_id=? AND document_id=? LIMIT 1', (owner, document_id)).fetchone()
        if previous and previous[0] == version:
            return {'changed': False, 'document_id': document_id, 'version': version}
        chunks = [text[i:i + 1200] for i in range(0, len(text), 1000)]
        try:
            self.execute('DELETE FROM document_chunks WHERE owner_id=? AND document_id=?', (owner, document_id))
            for position, body in enumerate(chunks):
                self.execute('INSERT INTO document_chunks VALUES (?,?,?,?,?,?)', (owner, document_id, version, position, title, body))
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise
        return {'changed': True, 'document_id': document_id, 'version': version, 'chunks': len(chunks)}

    def answer(self, owner, question, limit=3):
        if not owner or not isinstance(question, str) or not question.strip():
            raise ValueError('owner and question required')
        terms = set(re.findall(r'\w{3,}', question.casefold())) - {'que', 'qué', 'para', 'con', 'los', 'las', 'una', 'del', 'por', 'cuál', 'como', 'cómo'}
        rows = self.execute('SELECT document_id,position,title,body,version FROM document_chunks WHERE owner_id=?', (owner,)).fetchall()
        ranked = sorted(((len(terms & set(re.findall(r'\w{3,}', r[3].casefold()))), r) for r in rows), key=lambda pair: pair[0], reverse=True)
        evidence = [{'document_id': r[0], 'position': r[1], 'title': r[2], 'quote': r[3], 'version': r[4]} for score, r in ranked if score > 0][:limit]
        return {'question': question, 'answer': '\n\n'.join(f"[{e['document_id']}:{e['position']}] {e['quote']}" for e in evidence) if evidence else 'No hay evidencia pertinente en el corpus autorizado.', 'evidence': evidence, 'abstained': not evidence, 'method': 'lexical_retrieval_extract', 'review_required': True}


def demo():
    corpus = Corpus(sqlite3.connect(':memory:'))
    corpus.initialize()
    corpus.ingest('alumno-a', 'horarios', 'Horario público', 'Horario de atención: de 9 a 17 de lunes a viernes.')
    corpus.ingest('alumno-b', 'privado', 'Otro usuario', 'La clave privada es secreta.')
    return corpus.answer('alumno-a', '¿Cuál es el horario de atención?')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--demo', action='store_true')
    parser.add_argument('--owner')
    parser.add_argument('--question')
    parser.add_argument('--file')
    parser.add_argument('--document-id')
    parser.add_argument('--title')
    args = parser.parse_args()
    if args.demo:
        print(json.dumps(demo(), ensure_ascii=False, indent=2))
        return
    if not args.owner:
        parser.error('--owner required for CLI; derive it from authentication in a service')
    import psycopg
    with psycopg.connect(os.environ['DATABASE_URL']) as db:
        corpus = Corpus(db, postgres=True)
        corpus.initialize()
        if args.file:
            result = corpus.ingest(args.owner, args.document_id, args.title, Path(args.file).read_text(encoding='utf-8'))
        else:
            result = corpus.answer(args.owner, args.question)
        print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
