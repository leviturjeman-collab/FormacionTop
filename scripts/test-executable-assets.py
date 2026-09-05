"""Offline executable contracts; fictional inputs, temporary DBs, no provider calls."""
import ast
from concurrent.futures import ThreadPoolExecutor
from datetime import date
import hashlib
import hmac
import json
import os
from pathlib import Path
import re
import runpy
import sqlite3
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent.parent
C = ROOT / '35_AUTOMATIZACIONES_SKILLS_BIBLIOTECA/automatizaciones_codigo_40'
M = ROOT / '34_PRODUCTO_EJECUTABLE_PREMIUM/mini_repos_clonables'


def module(filename):
    return runpy.run_path(str(C / filename))


def embedded_function(agent, function, scope):
    x = json.loads((ROOT / 'content/agentes' / (agent + '.json')).read_text(encoding='utf-8'))
    source = next(f['content'] for f in x['files'] if f['name'].endswith('.py'))
    fn = next(n for n in ast.parse(source).body if isinstance(n, ast.FunctionDef) and n.name == function)
    exec(compile(ast.Module(body=[fn], type_ignores=[]), agent, 'exec'), scope)
    return scope[function]


class ExecutableContracts(unittest.TestCase):
    def test_all_standalone_demos_and_type_rejection(self):
        count = 0
        for file in C.glob('*.py'):
            if 'DEMO=' not in file.read_text(encoding='utf-8'):
                continue
            with self.subTest(asset=file.name):
                g = module(file.name)
                result = g['run'](g['DEMO'])
                self.assertTrue(result['ok'], result)
                self.assertFalse(g['run'](None)['ok'])
                count += 1
        self.assertEqual(count, 27)

    def test_lead_invoice_and_ticket_effects(self):
        self.assertEqual(module('01_lead_scoring.py')['run']({'email':'a@b.com','budget':1200,'need':'Automatizar pedidos'})['segment'], 'hot')
        invoice = module('03_invoice_parser.py')['run']({'text':'Proveedor: Uno\nFecha: 2026-99-99\nTotal: 1.234,56 EUR'})
        self.assertEqual(invoice['total'], 1234.56)
        self.assertIsNone(invoice['date'])
        self.assertEqual(module('04_ticket_router.py')['run']({'message':'Error: pago bloqueado'})['queue'], 'billing')

    def test_csv_detects_collisions_and_truncated_rows(self):
        run = module('05_csv_cleaner.py')['run']
        self.assertFalse(run({'csv':'Nombre,nombre\nA,B'})['ok'])
        self.assertFalse(run({'csv':'a,b\n1'})['ok'])
        self.assertEqual(run({'csv':' EMAIL \n ANA@EXAMPLE.COM '})['rows'][0]['email'], 'ana@example.com')

    def test_schema_and_secret_guard(self):
        run = module('06_json_schema_guard.py')['run']
        self.assertFalse(run({'schema':{'type':'object','required':['id']},'payload':{}})['valid'])
        scan = module('07_secret_scanner.py')['run']({'text':'x ghp_abcdefghijklmnopqrstuvwxyz'})
        self.assertFalse(scan['clean'])
        self.assertNotIn('abcdefghijklmnopqrstuvwxyz',json.dumps(scan))

    def test_budget_rejects_negative_and_overrun(self):
        run=module('08_cost_guard.py')['run']
        self.assertFalse(run({'budget':-1,'items':[]})['ok'])
        value=run({'budget':1,'items':[{'id':'a','estimated_cost':0.7},{'id':'b','estimated_cost':0.7}]})
        self.assertEqual(len(value['accepted']),1)
        self.assertEqual(len(value['rejected']),1)

    def test_price_and_progress_no_false_effect(self):
        self.assertFalse(module('34_competitor_price_diff.py')['run']({'previous':'1.234,56','current':'1.234,56'})['changed'])
        self.assertIsNone(module('34_competitor_price_diff.py')['run']({'previous':'0','current':'1'})['percent'])
        self.assertEqual(module('35_student_progress.py')['run']({'required':['a','b'],'completed':['a','a','fake']})['percent'],50)

    def test_email_null_rejected(self):
        self.assertFalse(module('02_email_summarizer.py')['run']({'body':None})['ok'])

    def test_judge_rejects_missing_reordered_and_invalid_scores(self):
        fn=embedded_function('evaluador-de-calidad-api','veredicto_final',{'sys':sys,'NOTA_APTO':7,'NOTA_REVISAR':5})
        criteria=[{'texto':'tono','eliminatorio':False},{'texto':'hechos','eliminatorio':True}]
        self.assertEqual(fn({'criterios':[{'criterio':'tono','nota':10}]},criteria)['veredicto'],'revisar')
        self.assertEqual(fn({'criterios':[{'criterio':'hechos','nota':10},{'criterio':'tono','nota':10}]},criteria)['veredicto'],'revisar')
        self.assertEqual(fn({'criterios':[{'criterio':'tono','nota':10},{'criterio':'hechos','nota':4}]},criteria)['veredicto'],'no_apto')
        self.assertEqual(fn({'criterios':[{'criterio':'tono','nota':10},{'criterio':'hechos','nota':10}]},criteria)['veredicto'],'apto')

    def test_extractor_invalid_dates_and_invented_quotes(self):
        fn=embedded_function('extractor-de-datos-de-documentos-api','validar',{'sys':sys,'re':re,'date':date})
        out=fn({'fecha':{'valor':'2026-99-99','cita':'inventada'},'importe_total':{'valor':10,'cita':'TOTAL 10'}},'fixture','TOTAL 10')
        self.assertIsNone(out['fecha']['valor'])
        out=fn({'fecha':{'valor':'2026-01-01','cita':'inventada'}},'fixture','sin fecha')
        self.assertTrue(out['_avisos_validacion'])

    def test_router_fallback_and_total_failure(self):
        g=runpy.run_path(str(M/'starter-multi-llm-router/router.py'))
        def transport(provider,prompt):
            if provider=='anthropic':raise TimeoutError()
            return {'text':'resultado','model':'fixture'}
        self.assertTrue(g['route']('hola',transport)['fallback'])
        self.assertFalse(g['route']('',transport)['ok'])
        def fail(provider,prompt):raise TimeoutError()
        self.assertFalse(g['route']('hola',fail)['ok'])

    def test_rag_quotes_dedup_and_owner_filter(self):
        g=runpy.run_path(str(M/'starter-rag-postgres/src/rag_demo.py'))
        corpus=g['Corpus'](sqlite3.connect(':memory:'));corpus.initialize()
        self.assertTrue(corpus.ingest('a','d1','Horario','Horario de nueve a cinco')['changed'])
        self.assertFalse(corpus.ingest('a','d1','Horario','Horario de nueve a cinco')['changed'])
        corpus.ingest('b','d2','Secreto','Secreto de cliente')
        self.assertTrue(corpus.answer('a','horario')['evidence'])
        self.assertTrue(corpus.answer('a','secreto')['abstained'])
        self.assertEqual(corpus.execute('SELECT COUNT(*) FROM document_chunks').fetchone()[0],2)

    def test_all_embedded_python_compiles(self):
        for p in (ROOT/'content/agentes').glob('*.json'):
            for f in json.loads(p.read_text(encoding='utf-8')).get('files',[]):
                if f['name'].endswith('.py'):
                    with self.subTest(source=str(p),file=f['name']):compile(f['content'],f['name'],'exec')
        for p in (ROOT/'content/recipes').glob('*.json'):
            obj=json.loads(p.read_text(encoding='utf-8'))
            if obj.get('lang') in ('python','py') or obj['id']!='ci-github':
                with self.subTest(recipe=p.name):compile(obj['code'],p.name,'exec')

    def test_capacity_concurrency_dedup_expiration_and_auth(self):
        from fastapi import HTTPException
        from fastapi.testclient import TestClient
        with tempfile.TemporaryDirectory() as folder:
            os.environ.update(OPERATIONS_TOKEN='x'*40,OPERATIONS_DB=str(Path(folder)/'capacity.db'),CAPACITY_LIMITS='{"event:demo":3}')
            g=runpy.run_path(str(M/'starter-operations-store/store.py'))
            # Initialize before concurrent readers contend for the first migration.
            g['connect']().close()
            def attempt(i):return g['reserve_capacity'](g['Reservation'](id=f'customer-{i}',scope='event:demo',units=1,payload={'customer':i}))
            with ThreadPoolExecutor(max_workers=8) as pool:results=list(pool.map(attempt,range(12)))
            self.assertEqual(sum(r['accepted'] for r in results),3)
            accepted=next(r for r in results if r['accepted'])
            i=int(accepted['id'].split('-')[1]);self.assertTrue(attempt(i)['duplicate'])
            g['decide_capacity'](g['Decision'](id=accepted['id'],decision='cancelled'))
            self.assertTrue(attempt(99)['accepted'])
            with g['connect']() as db:db.execute("UPDATE reservations SET expires=0 WHERE id='customer-99'")
            with self.assertRaises(HTTPException):g['decide_capacity'](g['Decision'](id='customer-99',decision='confirmed'))
            client=TestClient(g['app'])
            self.assertEqual(client.post('/capacity/reserve',json={'id':'bad-auth','scope':'event:demo','units':1,'payload':{}}).status_code,401)
            self.assertEqual(client.post('/capacity/reserve',headers={'X-Operations-Token':'x'*40},json={'id':'bad-units','scope':'event:demo','units':-1,'payload':{}}).status_code,422)

    def test_budget_blocks_before_effect_and_duplicate(self):
        from fastapi import HTTPException
        from fastapi.testclient import TestClient
        with tempfile.TemporaryDirectory() as folder:
            os.environ.update(OPERATIONS_TOKEN='x'*40,OPERATIONS_DB=str(Path(folder)/'budget.db'),BUDGET_LIMITS_MICRO_USD='{"demo":300}')
            g=runpy.run_path(str(M/'starter-operations-store/store.py'));g['connect']().close()
            effects=[]
            def attempt(i):
                try:
                    result=g['budget_reserve'](g['BudgetReservation'](id=f'call-{i}',app='demo',ceiling_micro_usd=100),'x'*40)
                    if result['authorized']:effects.append(i)
                    return 200
                except HTTPException as error:return error.status_code
            with ThreadPoolExecutor(max_workers=8) as pool:results=list(pool.map(attempt,range(12)))
            self.assertEqual(results.count(200),3);self.assertEqual(len(effects),3)
            self.assertEqual(attempt(effects[0]),409);self.assertEqual(len(effects),3)
            client=TestClient(g['app']);headers={'X-Operations-Token':'x'*40}
            self.assertEqual(client.post('/budget/settle',headers=headers,json={'id':f'call-{effects[0]}','actual_micro_usd':40}).status_code,200)
            self.assertEqual(client.post('/budget/settle',headers=headers,json={'id':f'call-{effects[0]}','actual_micro_usd':41}).status_code,409)
            self.assertEqual(client.post('/budget/reserve',headers=headers,json={'id':'negative','app':'demo','ceiling_micro_usd':-1}).status_code,422)
            self.assertEqual(client.get('/budget/call-0').status_code,401)

    def test_gateway_signature_allowlist_and_durable_dedup(self):
        from fastapi.testclient import TestClient
        with tempfile.TemporaryDirectory() as folder:
            os.environ.update(WEBHOOK_SECRET='s'*40,N8N_GATEWAY_TOKEN='g'*40,ALLOWED_REPOS='demo/repo',WEBHOOK_DB=str(Path(folder)/'inbox.db'))
            g=runpy.run_path(str(M/'starter-webhook-gateway/webhook.py'))
            client=TestClient(g['app'])
            body=json.dumps({'repository':{'full_name':'demo/repo'},'action':'opened'}).encode()
            signature='sha256='+hmac.new(b's'*40,body,hashlib.sha256).hexdigest()
            headers={'x-hub-signature-256':signature,'x-github-delivery':'fixture-1234','content-type':'application/json'}
            self.assertEqual(client.post('/webhook/issue',content=body,headers={**headers,'x-hub-signature-256':'bad'}).status_code,401)
            self.assertEqual(client.post('/webhook/issue',content=body,headers=headers).status_code,202)
            self.assertEqual(client.post('/webhook/issue',content=body,headers=headers).status_code,202)
            with g['database']() as db:self.assertEqual(db.execute('SELECT COUNT(*) FROM inbox').fetchone()[0],1)
            wrong=json.dumps({'repository':{'full_name':'other/repo'}}).encode()
            headers['x-hub-signature-256']='sha256='+hmac.new(b's'*40,wrong,hashlib.sha256).hexdigest()
            self.assertEqual(client.post('/webhook/issue',content=wrong,headers=headers).status_code,403)


if __name__=='__main__':unittest.main(verbosity=2)
