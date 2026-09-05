#!/usr/bin/env node
// Offline tests. Setup once: node scripts/test-executable-assets.mjs --setup
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const environment=path.join(root,'node_modules','automation-python');
const python=process.platform==='win32'?path.join(environment,'Scripts','python.exe'):path.join(environment,'bin','python');
function command(exe,args){const result=spawnSync(exe,args,{cwd:root,stdio:'inherit',env:{...process.env,PYTHONIOENCODING:'utf-8'}});if(result.error)throw result.error;if(result.status!==0)process.exit(result.status||1);}
if(process.argv.includes('--setup')){
  if(!fs.existsSync(python))command(process.env.PYTHON||'python',['-m','venv',environment]);
  command(python,['-m','pip','install','-r','scripts/automation-test-requirements.txt']);
}
if(!fs.existsSync(python)){console.error('Run once: node scripts/test-executable-assets.mjs --setup (pinned requirements; isolated in node_modules).');process.exit(1);}
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const dir='35_AUTOMATIZACIONES_SKILLS_BIBLIOTECA/workflows_n8n_40';
const flow=id=>read(dir+'/'+fs.readdirSync(path.join(root,dir)).find(f=>f.startsWith(id+'_')&&f.endsWith('.json')));
const code=(f,name)=>f.nodes.find(n=>n.name===name).parameters.jsCode;
const execute=(source,context)=>vm.runInNewContext('(function(){'+source+'})()',{URL,...context},{timeout:1000});
let checks=0;
function check(name,test){test();checks++;console.log('PASS '+name);}
check('negative token usage rejected',()=>{const result=execute(code(flow('35'),'Validar registro'),{$json:{body:{app:'x',modelo:'claude-opus-5',tokens_entrada:-1000000,tokens_salida:0}}});assert.equal(result.json.valido,false);});
check('Spanish phone removed before provider',()=>{const result=execute(code(flow('25'),'Redactar con regex y preparar IA'),{$json:{id_caso:'x',texto:'Llámame al 612345678'}});assert(!result.json.texto_regex.includes('612345678'));});
check('PII invalid provider output fails closed',()=>{assert.throws(()=>execute(code(flow('25'),'Combinar resultados'),{$json:{content:[{type:'text',text:'invalid'}]},$:()=>({item:{json:{texto_regex:'Nombre personal',contadores:{}}}})}));});
check('invalid JSON cannot pass JSON regression',()=>{const result=execute(code(flow('36'),'Puntuar caso'),{$json:{content:[{type:'text',text:'not JSON but "ok" true'}]},$:()=>({item:{json:{id:'formato-json',esperado:['"ok"','true']}}})});assert.equal(result.json.pasa,false);});
check('valid JSON passes JSON regression',()=>{const result=execute(code(flow('36'),'Puntuar caso'),{$json:{content:[{type:'text',text:'{"ok":true}'}]},$:()=>({item:{json:{id:'formato-json',esperado:['"ok"','true']}}})});assert.equal(result.json.pasa,true);});
check('price locale and numeric inputs',()=>{for(const value of ['1.234,56',1234.56]){const result=execute(code(flow('20'),'Extraer y comparar precio'),{$json:{data:'OTHER 99,00 EUR <price>1.234,56 EUR</price>'},$:()=>({item:{json:{precio_anterior:value,selector_inicio:'<price>',selector_fin:'</price>'}}})});assert.equal(result.json.cambio,false);assert.equal(result.json.precio_anterior,1234.56);}});
check('malformed categorization becomes review',()=>{const result=execute(code(flow('05'),'Interpretar categorías'),{$json:{content:[{type:'text',text:'{}'}]},$:()=>({item:{json:{pendientes:[{id:'x'}],procesado_en:'fixture'}}})});assert.equal(result[0].json.categoria,'revisar');});
check('alert on transport, HTTP and invalid health schema',()=>{const f=read('content/agentes/agente-alertas-operativas.json').flow;for(const response of [{error:{message:'timeout'}},{statusCode:500,body:{estado:'ok'}},{statusCode:200,body:{mensaje:'bad'}}])assert(execute(code(f,'Evaluar umbrales'),{$json:response})[0].json.alerta);assert.equal(execute(code(f,'Evaluar umbrales'),{$json:{statusCode:200,body:{estado:'ok',pendientes:0}}})[0].json.alerta,false);});
check('source URLs deny loopback and unlisted domains',()=>{for(const url of ['http://127.0.0.1','https://127.0.0.1','https://example.com.evil.test','https://example.com@evil.test']){const result=execute(code(flow('39'),'Validar fuente'),{$json:{body:{url,afirmacion:'test'}}});assert.equal(result.json.valido,false);}});
check('webhooks require trusted gateway auth',()=>{for(const id of ['27','28','30']){const n=flow(id).nodes.find(n=>n.type.endsWith('.webhook'));assert.equal(n.parameters.authentication,'headerAuth');assert(n.credentials.httpHeaderAuth);}});
const C='35_AUTOMATIZACIONES_SKILLS_BIBLIOTECA/automatizaciones_codigo_40';
check('n8n PII snippet removes raw payload',()=>{const src=fs.readFileSync(path.join(root,C,'13_n8n_code_node_redact_pii.js'),'utf8');const r=execute(src,{$input:{all:()=>[{json:{text:'ana@example.com 612345678',secret:'not_to_forward'}}]}});assert(!JSON.stringify(r).includes('ana@example.com'));assert(!JSON.stringify(r).includes('612345678'));assert(!JSON.stringify(r).includes('not_to_forward'));});
check('retry policy terminates and computes wait',()=>{const src=fs.readFileSync(path.join(root,C,'14_n8n_code_node_retry.js'),'utf8');const r=execute(src,{$input:{all:()=>[{json:{statusCode:429,attempt:2}},{json:{statusCode:500,attempt:5}},{json:{statusCode:400,attempt:0}}]}});assert.equal(r[0].json.delay_seconds,4);assert.equal(r[1].json.retry,false);assert.equal(r[2].json.retry,false);});
check('slug duplicates disambiguated',()=>{const src=fs.readFileSync(path.join(root,C,'15_slugify_titles.js'),'utf8');const r=execute(src,{$input:{all:()=>[{json:{title:'Título Uno'}},{json:{title:'Título Uno'}}]}});assert.equal(r[0].json.slug,'titulo-uno');assert.equal(r[1].json.slug,'titulo-uno-2');});
check('all source node JavaScript compiles',()=>{
 const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
 const flows=[];
 for(const file of fs.readdirSync(path.join(root,dir)).filter(f=>f.endsWith('.json')))flows.push(read(dir+'/'+file));
 for(const sub of ['content/agentes','content/kits'])for(const file of fs.readdirSync(path.join(root,sub)).filter(f=>f.endsWith('.json'))){const x=read(sub+'/'+file);if(x.flow)flows.push(x.flow);for(const w of x.workflows||[])if(w.flow)flows.push(w.flow);}
 for(const f of flows)for(const n of f.nodes)if(n.parameters?.jsCode)new AsyncFunction(n.parameters.jsCode);
});
check('price selectors fail closed on absence and ambiguity',()=>{
 for(const data of ['other 1,00 EUR','<p>1,00 EUR 2,00 EUR</p>','<p>1,00 EUR</p><p>2,00 EUR</p>']){
  const r=execute(code(flow('20'),'Extraer y comparar precio'),{$json:{data},$:()=>({item:{json:{precio_anterior:3,selector_inicio:'<p>',selector_fin:'</p>'}}})});assert.equal(r.json.leido,false);assert.equal(r.json.cambio,false);
 }
});
check('Vercel pagination aggregates historical errors and retains failed cursor',()=>{
 const state={};const src=code(flow('31'),'Evaluar deploys');
 const pages=[{json:{deployments:[{uid:'a',state:'READY'}],pagination:{next:10}}},{json:{deployments:[{uid:'b',state:'ERROR',createdAt:1}],pagination:{next:null}}}];
 const ctx={$input:{all:()=>pages},$getWorkflowStaticData:()=>state};
 assert.equal(execute(src,ctx)[0].json.total_fallidos,1);assert.equal(execute(src,ctx)[0].json.total_fallidos,0);
 const before=JSON.stringify(state);assert.equal(execute(src,{$input:{all:()=>pages.slice(0,1)},$getWorkflowStaticData:()=>state})[0].json.api_ok,false);assert.equal(JSON.stringify(state),before);
});
check('invoice attachments keep identity and fail closed on unreadable PDF',()=>{
 const f=read('content/kits/finanzas-facturacion.json').workflows[0].flow;
 const selected=execute(code(f,'Seleccionar facturas PDF'),{$input:{all:()=>[{json:{id:'message-a'},binary:{attachment_0:{mimeType:'application/pdf',fileName:'one.pdf'},attachment_1:{mimeType:'application/pdf',fileName:'two.pdf'}}}]}});
 assert.equal(selected.length,2);assert.notEqual(selected[0].json.invoice_id,selected[1].json.invoice_id);
 const r=execute(code(f,'Preparar texto de la factura'),{$json:{error:'encrypted'},$:()=>({item:selected[0]})});assert.equal(r.json.texto_valido,false);assert.equal(r.json.texto_factura,'');assert.equal(r.json.id,'message-a:attachment_0');
 const good=execute(code(f,'Preparar texto de la factura'),{$json:{text:'Invoice 123 Total 100'},$:()=>({item:selected[1]})});assert.equal(good.json.texto_valido,true);
});
check('query is blocked without trusted collection and uses literal sources',()=>{
 const f=read('content/kits/rag-documental.json').workflows[1].flow;
 assert.throws(()=>execute(code(f,'Validar pregunta y ámbito'),{$json:{body:{pregunta:'question'}}}));
 const empty=execute(code(f,'Responder con evidencia recuperada'),{$json:{fuentes:[]}});assert.equal(empty.json.encontrado,false);
 const r=execute(code(f,'Responder con evidencia recuperada'),{$json:{fuentes:[{titulo:'Policy',texto:'Exact quote',apartado:'One',similarity:.9}]}});assert(r.json.respuesta.includes('Exact quote'));assert.equal(r.json.fuentes[0].cita,'Exact quote');
});
check('GitHub partial inputs block before paid review or publication',()=>{
 assert.throws(()=>execute(code(flow('28'),'Preparar revisión'),{$json:{diff:'x'.repeat(20001)},$:()=>({item:{json:{}}})}));
 assert.throws(()=>execute(code(flow('30'),'Validar push'),{$input:{first:()=>({json:{body:{repository:{full_name:'a/b'},size:3,commits:[{id:'a'.repeat(40)}],after:'a'.repeat(40)}}})}}));
 const f=code(flow('29'),'Preparar redacción');const request={propietario:'a',repo:'b',desde_tag:'v1',hasta_tag:'v2'};
 const pages=[{json:{total_commits:2,commits:[{sha:'a',commit:{message:'fix a'}}]}},{json:{total_commits:2,commits:[{sha:'b',commit:{message:'feat b'}}]}}];
 const r=execute(f,{$input:{all:()=>pages},$:()=>({first:()=>({json:request})})});assert.equal(r[0].json.total_commits,2);
 assert.throws(()=>execute(f,{$input:{all:()=>pages.slice(0,1)},$:()=>({first:()=>({json:request})})}));
});
command(python,['scripts/test-executable-assets.py']);
// Execute PL/pgSQL locally, without a running service or account credentials.
const {PGlite}=await import('@electric-sql/pglite');
const db=new PGlite();
try {
 await db.exec(fs.readFileSync(path.join(root,dir,'rag_storage.sql'),'utf8'));
 const ingest=(text,chunks)=>db.query('select * from academy_ingest_document($1,$2,$3,$4,$5::jsonb)',['source','Title','es',text,JSON.stringify(chunks)]);
 assert.equal((await ingest('old',[{indice:1,trozo:'old'},{indice:2,trozo:'extra'}])).rows[0].changed,true);
 assert.equal((await ingest('old',[{indice:1,trozo:'old'}])).rows[0].changed,false);
 await ingest('new',[{indice:1,trozo:'new'}]);
 assert.equal((await db.query('select count(*)::int n from documentos_rag')).rows[0].n,1);
 await assert.rejects(ingest('broken',[{indice:'not-an-int',trozo:'bad'}]));
 assert.equal((await db.query('select trozo from documentos_rag')).rows[0].trozo,'new');
 await db.exec('create table documentos(id text primary key,titulo text,coleccion text,dueno text,version text,vigente boolean); create table fragmentos(id bigserial primary key,id_documento text references documentos(id),apartado text,posicion int,texto text);');
 await db.exec(fs.readFileSync(path.join(root,'34_PRODUCTO_EJECUTABLE_PREMIUM/mini_repos_clonables/starter-rag-postgres/kit-ingestion-migration.sql'),'utf8'));
 const replace=fragmentos=>db.query('select * from academy_replace_fragments($1::jsonb)',[JSON.stringify({id_documento:'doc',titulo:'Title',coleccion:'ops',dueno:'owner',version:'1',fragmentos})]);
 assert.equal((await replace([{apartado:'one',posicion:1,texto:'one'},{apartado:'two',posicion:2,texto:'two'}])).rows.length,2);
 assert.equal((await replace([{apartado:'new',posicion:1,texto:'new'}])).rows.length,1);
 await assert.rejects(replace([{apartado:'bad',posicion:'bad',texto:'bad'}]));
 assert.equal((await db.query('select texto from fragmentos')).rows[0].texto,'new');
 await replace([{apartado:'semantic',posicion:1,texto:'authorized quote',embedding_json:[1,0,0],modelo_vector:'fixture'}]);
 const semantic=await db.query('select * from academy_search_fragments($1::jsonb,$2,$3,$4)',['[1,0,0]','ops','owner','fixture']);assert.equal(semantic.rows[0].texto,'authorized quote');
 assert.equal((await db.query('select * from academy_search_fragments($1::jsonb,$2,$3,$4)',['[1,0,0]','ops','other-owner','fixture'])).rows.length,0);
 assert.equal((await db.query('select * from academy_search_fragments($1::jsonb,$2,$3,$4)',['[0,1,0]','ops','owner','fixture'])).rows.length,0);
 console.log('PASS semantic retrieval, owner isolation and abstention in PostgreSQL');checks++;
 console.log('PASS real PostgreSQL atomic ingest, duplicate, replacement and rollback (PGlite)');checks++;
} finally {await db.close();}
console.log('Executable assets: '+checks+' JS contracts plus Python suite passed; no external provider calls.');
