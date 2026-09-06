export const requests = [
 {id:'SOL-001',name:'Ana',email:'ana@example.com',course:'inicial',status:'pending'},
 {id:'SOL-002',name:'Luis',email:'luis@example.com',course:'avanzado',status:'pending'},
 {id:'SOL-003',name:'Marta',email:'marta@example.com',course:'inicial',status:'review'},
]
export const requestContract = {
 type:'object',additionalProperties:false,required:['id','name','email','course'],
 properties:{id:{type:'string',pattern:'^[A-Za-z0-9_-]{1,64}$'},name:{type:'string',minLength:1,maxLength:100},email:{type:'string',maxLength:254},course:{enum:['inicial','avanzado']}}
}
const validator = `export function validateRequest(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return ['body'];
  const errors=[];
  if(typeof value.id!=='string'||!/^[A-Za-z0-9_-]{1,64}$/.test(value.id)) errors.push('id');
  if(typeof value.name!=='string'||!value.name.trim()||value.name.length>100) errors.push('name');
  if(typeof value.email!=='string'||value.email.length>254||!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value.email)) errors.push('email');
  if(!['inicial','avanzado'].includes(value.course)) errors.push('course');
  if(Object.keys(value).some(key=>!['id','name','email','course'].includes(key))) errors.push('unexpected_field');
  return errors;
}
export function normalizeRequest(value) {
 return {id:value.id,name:value.name.trim(),email:value.email.trim().toLowerCase(),course:value.course};
}
`
const api = `import http from 'node:http';
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateRequest,normalizeRequest} from './validate.mjs';

export function createServer({file=resolve('data/requests.json')}={}) {
 let queue=Promise.resolve();
 const serial=fn=>{const job=queue.then(fn);queue=job.catch(()=>{});return job;};
 async function records(){try{return JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT')return [];throw e;}}
 async function save(rows){await mkdir(dirname(file),{recursive:true});await writeFile(file+'.tmp',JSON.stringify(rows,null,2));await rename(file+'.tmp',file);}
 const reply=(res,status,data)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(data));};
 return http.createServer(async(req,res)=>{
  try {
   const url=new URL(req.url,'http://localhost');
   if(req.method==='GET'&&url.pathname==='/health')return reply(res,200,{ok:true});
   if(req.method==='GET'&&url.pathname==='/requests')return reply(res,200,await serial(records));
   if(req.method!=='POST'||url.pathname!=='/requests')return reply(res,404,{error:'not_found'});
   let raw='';for await(const part of req){raw+=part;if(Buffer.byteLength(raw)>8192)return reply(res,413,{error:'body_too_large'});}
   let body;try{body=JSON.parse(raw);}catch{return reply(res,400,{error:'invalid_json'});}
   const errors=validateRequest(body);if(errors.length)return reply(res,422,{errors});
   const normalized=normalizeRequest(body);
   const result=await serial(async()=>{
    const rows=await records();const old=rows.find(r=>r.id===normalized.id);
    if(old)return JSON.stringify(old)===JSON.stringify(normalized)?{status:200,body:{state:'duplicate',record:old}}:{status:409,body:{error:'id_conflict'}};
    rows.push(normalized);await save(rows);return {status:201,body:{state:'created',record:normalized}};
   });
   reply(res,result.status,result.body);
  }catch(error){console.error(error.message);reply(res,500,{error:'internal_error'});}
 });
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const port=Number(process.env.PORT||4300),host=process.env.HOST||'127.0.0.1';
 createServer().listen(port,host,()=>console.log('API local en http://'+host+':'+port));
}
`
const apiTest = `import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {once} from 'node:events';
import {createServer} from './server.mjs';
test('crear, repetir, rechazar conflicto y conservar tras reinicio',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'aula-project-'));
 let server=createServer({file:join(dir,'requests.json')});server.listen(0,'127.0.0.1');await once(server,'listening');
 let base='http://127.0.0.1:'+server.address().port;
 const post=value=>fetch(base+'/requests',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(value)});
 const row={id:'SOL-001',name:'Ana',email:'ana@example.com',course:'inicial'};
 try {
  assert.equal((await post(row)).status,201);
  assert.equal((await post(row)).status,200);
  assert.equal((await post({...row,name:'Otra persona'})).status,409);
  assert.equal((await post({...row,id:'SOL-002',email:'mal'})).status,422);
  const concurrent=await Promise.all([post({...row,id:'SOL-003'}),post({...row,id:'SOL-003'})]);
  assert.deepEqual(concurrent.map(r=>r.status).sort(),[200,201]);
  assert.equal((await (await fetch(base+'/requests')).json()).length,2);
  await new Promise(r=>server.close(r));server=createServer({file:join(dir,'requests.json')});server.listen(0,'127.0.0.1');await once(server,'listening');base='http://127.0.0.1:'+server.address().port;
  assert.equal((await (await fetch(base+'/requests')).json()).length,2);
 }finally{await new Promise(r=>server.close(r));await rm(dir,{recursive:true,force:true});}
});
`
const csv=`id,name,email,course,status\n${requests.map(r=>Object.values(r).join(',')).join('\n')}\n`
const python = `import csv, json, sys
from collections import Counter

def summarize(filename):
    seen, accepted, errors = set(), [], []
    with open(filename, newline='', encoding='utf-8-sig') as source:
        reader = csv.DictReader(source)
        required = {'id', 'name', 'email', 'course', 'status'}
        if not required.issubset(reader.fieldnames or []):
            raise ValueError('Faltan encabezados: ' + ', '.join(sorted(required - set(reader.fieldnames or []))))
        for line, row in enumerate(reader, start=2):
            row = {key: (row.get(key) or '').strip() for key in required}
            if not row['id'] or row['course'] not in ('inicial','avanzado') or '@' not in row['email']:
                errors.append({'line': line, 'reason': 'datos invalidos'})
            elif row['id'] in seen:
                errors.append({'line': line, 'reason': 'id repetido'})
            else:
                seen.add(row['id']); accepted.append(row)
    return {'accepted': len(accepted), 'courses': dict(Counter(row['course'] for row in accepted)), 'errors': errors}

if __name__ == '__main__':
    try:
        result=summarize(sys.argv[1] if len(sys.argv)>1 else 'requests.csv')
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except (OSError, ValueError) as error:
        print(str(error), file=sys.stderr); sys.exit(1)
`
const html = `<!doctype html>
<html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aula Norte · Solicitudes</title>
<style>body{font:18px/1.6 system-ui;max-width:720px;margin:auto;padding:24px;color:#163d32;background:#f4f6f3}label{display:block;margin-top:18px}input,select,button{box-sizing:border-box;font:inherit;padding:12px;max-width:100%;width:100%}button{margin-top:24px;background:#174d3d;color:white;border:0}li{overflow-wrap:anywhere}#feedback{min-height:2em}</style>
<main><h1>Solicita información de un curso</h1><p>Prototipo de aprendizaje. Conserva los registros solo en este navegador; no envía mensajes ni reserva plazas.</p>
<form id="request"><label for="name">Nombre</label><input id="name" name="name" maxlength="100" required autocomplete="name"><label for="email">Correo</label><input id="email" name="email" type="email" required autocomplete="email"><label for="course">Curso</label><select id="course" name="course"><option value="inicial">Inicial</option><option value="avanzado">Avanzado</option></select><button>Guardar solicitud de ensayo</button></form><p id="feedback" role="status" aria-live="polite"></p><h2>Solicitudes de este navegador</h2><ul id="list"></ul></main>
<script>
const form=document.querySelector('form'),list=document.querySelector('#list'),feedback=document.querySelector('#feedback');
function read(){try{return JSON.parse(localStorage.getItem('aula-requests-v1')||'[]');}catch{return [];}}
function render(){list.replaceChildren();for(const row of read()){const li=document.createElement('li');li.textContent=row.name+' · '+row.course+' · '+row.email;list.append(li);}}
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const row={name:String(data.get('name')).trim(),email:String(data.get('email')).trim().toLowerCase(),course:String(data.get('course'))};if(!row.name){feedback.textContent='Escribe un nombre.';return;}const rows=read();if(rows.some(r=>r.email===row.email&&r.course===row.course)){feedback.textContent='Ya existe esta solicitud de ensayo para el mismo correo y curso.';return;}rows.push({...row,id:crypto.randomUUID()});try{localStorage.setItem('aula-requests-v1',JSON.stringify(rows));feedback.textContent='Solicitud guardada en este navegador.';render();}catch{feedback.textContent='No se pudo guardar. Comprueba el almacenamiento del navegador.';}});render();
</script></html>`

export const basicFiles = {
 'requests.csv':csv,
 'create-request.json':JSON.stringify({id:'SOL-001',name:'Ana',email:'ana@example.com',course:'inicial'},null,2),
 'requests.json':JSON.stringify(requests,null,2),
 'contract.json':JSON.stringify(requestContract,null,2),
 'reference.md':'# Resultado de referencia\n3 solicitudes: 2 del curso inicial y 1 del avanzado. Dos pendientes y una en revisión. No se confirma ninguna plaza.\n',
}
export function starterFiles(kind) {
 const files={...basicFiles}
 if(['image','video','audio','slides'].includes(kind))Object.assign(files,{
 'brief.md':'# Aula Norte · práctica ficticia\nDestinatario: persona que quiere información sobre formación.\nObjetivo: explicar cómo enviar una solicitud, sin prometer plaza ni fechas.\nMensaje: elige un curso, revisa tus datos y envía la solicitud por el canal definido.\nTono: claro, educativo y sobrio.\nEntregas: pieza principal y fuente editable o configuración documentada.\nRevisión: legibilidad, mensaje correcto, inicio y cierre completos; ninguna cifra de ahorro inventada.\n',
 'guion.txt':'Primero revisa la solicitud. Después comprueba los datos. Si falta información, pide una aclaración. No confirmes una plaza.\n',
 'revision.csv':'criterio,esperado,observado\nmensaje,No confirma plazas,\ncontenido,Conserva los pasos y la excepción,\nlegibilidad,Textos completos y comprensibles,\nexportacion,Se abre fuera del editor,\n'
 })
 if(['code','node','docker'].includes(kind)) Object.assign(files,{'validate.mjs':validator,'server.mjs':api,'server.test.mjs':apiTest,'package.json':JSON.stringify({name:'aula-norte-project',private:true,type:'module',scripts:{start:'node server.mjs',test:'node --test server.test.mjs'}},null,2),'.gitignore':'data/\nnode_modules/\n.env\n'})
 if(kind==='docker')Object.assign(files,{'Dockerfile':'FROM node:24-alpine\nWORKDIR /app\nCOPY package.json server.mjs validate.mjs ./\nENV HOST=0.0.0.0 PORT=4300\nEXPOSE 4300\nCMD ["node","server.mjs"]\n','compose.yaml':'services:\n  api:\n    build: .\n    ports:\n      - "127.0.0.1:4300:4300"\n    volumes:\n      - aula_data:/app/data\nvolumes:\n  aula_data:\n'})
 if(['python','colab'].includes(kind))files['summarize.py']=python
 if(['web','react','tailwind','vscode','vercel'].includes(kind))files['index.html']=html
 if(kind==='typescript')Object.assign(files,{'validate.mjs':validator,'contract.ts':'export type Course = "inicial" | "avanzado";\nexport type Request = {id:string;name:string;email:string;course:Course};\nexport const sample: Request = {id:"SOL-001",name:"Ana",email:"ana@example.com",course:"inicial"};\n','tsconfig.json':'{"compilerOptions":{"strict":true,"noEmit":true,"target":"ES2022"},"include":["contract.ts"]}'})
 if(['postgres','supabase'].includes(kind))files['schema.sql']=`CREATE TABLE IF NOT EXISTS public.academy_requests (\n id text PRIMARY KEY,\n owner_id uuid NOT NULL,\n name text NOT NULL CHECK(length(trim(name))>0),\n email text NOT NULL,\n course text NOT NULL CHECK(course IN ('inicial','avanzado')),\n status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','review','done')),\n created_at timestamptz NOT NULL DEFAULT now()\n);\n`+(kind==='supabase'?`ALTER TABLE public.academy_requests ENABLE ROW LEVEL SECURITY;\nCREATE POLICY "owners_read" ON public.academy_requests FOR SELECT TO authenticated USING (auth.uid()=owner_id);\nCREATE POLICY "owners_insert" ON public.academy_requests FOR INSERT TO authenticated WITH CHECK (auth.uid()=owner_id);\nCREATE POLICY "owners_update" ON public.academy_requests FOR UPDATE TO authenticated USING (auth.uid()=owner_id) WITH CHECK (auth.uid()=owner_id);\n-- Ejecutar una sola vez en un proyecto de ensayo: las políticas tienen nombres únicos.\n`:``)
 return files
}
