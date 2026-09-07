import {englishProfiles} from './lib/tool-projects.en.mjs'
import fs from 'node:fs/promises'
import path from 'node:path'
import {scenarios,labWorkflow,eventSchema} from './lib/automation-projects.mjs'
import {scenarioVariation} from './lib/automation-variations.mjs'
import {toolProjectSpecs,projectReadme} from './lib/tool-projects.mjs'
import {starterFiles} from './lib/project-starters.mjs'
import {deflateRawSync} from 'node:zlib'

const out=path.resolve('public/project-assets')
await fs.mkdir(path.join(out,'automations'),{recursive:true})
await fs.mkdir(path.join(out,'tools'),{recursive:true})
for(const s of scenarios){
 await fs.writeFile(path.join(out,'automations',s.id+'.n8n.json'),JSON.stringify(labWorkflow(s),null,2))
 const variation=scenarioVariation(s)
 await fs.writeFile(path.join(out,'automations',s.id+'-variation.n8n.json'),JSON.stringify(labWorkflow(variation),null,2))
 const missing=structuredClone(s);delete missing.sample[s.required[0]];missing.name+=' · dato ausente'
 await fs.writeFile(path.join(out,'automations',s.id+'-missing.n8n.json'),JSON.stringify(labWorkflow(missing),null,2))
}
await fs.writeFile(path.join(out,'automations','schema.sql'),eventSchema)
const packages={}
for(const [id,s] of Object.entries(toolProjectSpecs))packages[id]={...starterFiles(s.kind),'README.md':projectReadme(s)}
const requestLab={id:'request-validation',name:'Validar solicitudes de Aula Norte',sample:{id:'SOL-001',name:'Ana',email:'ana@example.com',course:'inicial'},expected:{id:'SOL-001',valid:true,course:'inicial'},required:['id','name','email','course'],body:`if(typeof x.id!=='string'||typeof x.name!=='string'||typeof x.email!=='string'||!x.name.trim()||!x.email.includes('@')||!['inicial','avanzado'].includes(x.course))throw new Error('Campos inválidos');return {...x,name:x.name.trim(),email:x.email.trim().toLowerCase(),valid:true};`}
packages.n8n['solicitudes.n8n.json']=JSON.stringify(labWorkflow(requestLab),null,2)
packages.n8n['schema.sql']=eventSchema
packages.n8n['IMPLEMENTACION.md']=`# Del laboratorio a un endpoint\n1. Importa solicitudes.n8n.json y ejecuta: passed debe ser true.\n2. Sustituye Inicio manual y Muestra del proyecto por Webhook POST. Durante el ensayo selecciona Listen for test event y usa Test URL.\n3. Añade Edit Fields, llamado Entrada normalizada: id={{$json.body.id}}, name={{$json.body.name}}, email={{$json.body.email}}, course={{$json.body.course}}. Conserva los tipos de texto.\n4. Conecta Resolver y revisa su salida. Elimina Comprobar resultado del flujo conectado: compara la muestra fija y no sirve para cualquier usuario. Conserva el laboratorio original separado.\n5. Ejecuta schema.sql en Postgres de ensayo y añade Postgres Execute Query después de Resolver.\n6. Consulta: SELECT state FROM academy_projects.persist_result($1,$2,$3::jsonb,$4::jsonb);\n7. Query Parameters, como expresión: {{ ["requests", $("Entrada normalizada").first().json.id, JSON.stringify($("Entrada normalizada").first().json), JSON.stringify($json)] }}\n8. Añade Switch sobre state: created responde 201, duplicate 200, conflict 409. Configura Webhook Respond usando Respond to Webhook Node y coloca ese nodo en cada rama con el código y cuerpo JSON correspondientes.\n9. Para una validación inválida, configura Resolver para continuar por salida de error y conéctala a Respond to Webhook con 422 y un mensaje de campos inválidos. Comprueba ambas ramas con eventos distintos.\n10. Repite SOL-001 igual (200), cambia su curso (409), envía SOL-002 (201) y un curso otro (422). Consulta la tabla y comprueba los registros.\n11. Protege el Webhook con la autenticación adecuada a tu cliente, publica y cambia a Production URL. Este ejemplo registra solicitudes; no envía correo ni confirma plazas.\n`
for(const [id,profile] of Object.entries(englishProfiles)) {
 const files={...packages[id]}
 files['README.en.md']=`# ${profile.title}\n\nFictional Aula Norte practice project.\n\n## Preparation\n${profile.open}\n\n## Implementation\n${profile.build}\n\n## Reference result\n${profile.expected}\n\n## Improvement\n${profile.improve}\n\n## Handoff\n${profile.deliver}\n\nTechnical field names and values remain identical in both languages so examples and tests stay compatible.\n`
 files['README.md']=files['README.en.md']
 files['reference.md']='# Reference result\nThree requests: two inicial and one avanzado. Two pending and one review. No place is confirmed.\n'
 if(files['brief.md'])files['brief.md']='# Fictional Aula Norte practice\nAudience: a person seeking course information.\nGoal: explain how to submit a request without promising a place or a date.\nMessage: choose a course, check your details and submit through the specified channel.\nTone: clear and educational.\nDeliver the main asset and its editable source or documented configuration. Check legibility, accuracy and complete opening and ending. Do not invent savings.\n'
 if(files['guion.txt'])files['guion.txt']='First review the request. Then check the details. If information is missing, ask for clarification. Do not confirm a place.\n'
 if(files['revision.csv'])files['revision.csv']='criterion,expected,observed\nmessage,No confirmed place,\ncontent,Steps and exception preserved,\nlegibility,Complete understandable text,\nexport,Opens outside the editor,\n'
 if(files['index.html'])for(const [a,b] of Object.entries({'lang="es"':'lang="en"','Solicita información de un curso':'Request course information','Prototipo de aprendizaje. Conserva los registros solo en este navegador; no envía mensajes ni reserva plazas.':'Learning prototype. Records stay in this browser; it sends no messages and reserves no places.','Solicitudes de este navegador':'Requests in this browser','Guardar solicitud de ensayo':'Save practice request','Nombre':'Name','Correo':'Email','Curso':'Course','Inicial':'Initial','Avanzado':'Advanced','Escribe un nombre.':'Enter a name.','Ya existe esta solicitud de ensayo para el mismo correo y curso.':'A practice request already exists for this email and course.','Solicitud guardada en este navegador.':'Request saved in this browser.','No se pudo guardar. Comprueba el almacenamiento del navegador.':'Could not save. Check browser storage.'}))files['index.html']=files['index.html'].replaceAll(a,b)
 if(id==='n8n')files['IMPLEMENTACION.md']=`# From lab to request endpoint\n1. Import solicitudes.n8n.json. Run manually and inspect passed:true.\n2. Keep the lab separately. Replace its first two nodes with a POST Webhook in a connected copy.\n3. Add Edit Fields named Entrada normalizada. Map id, name, email and course from $json.body using expressions. Keep technical node names unchanged because later expressions reference them.\n4. Connect Resolver. Remove the fixed assertion node from the connected flow; it compares one fixed sample, not arbitrary requests.\n5. Run schema.sql in a practice PostgreSQL database. Add Postgres Execute Query: SELECT state FROM academy_projects.persist_result($1,$2,$3::jsonb,$4::jsonb);\n6. Query Parameters expression: {{ ["requests", $("Entrada normalizada").first().json.id, JSON.stringify($("Entrada normalizada").first().json), JSON.stringify($json)] }}\n7. Switch on state: created responds 201, duplicate 200, conflict 409. Set Webhook to respond using Respond to Webhook Node and add that node to each branch.\n8. Configure Resolver to continue using its error output and connect that branch to a 422 response.\n9. Test original input, identical retry, same id with changed course, and unsupported course. Inspect both responses and stored rows.\n10. Protect the endpoint for its intended client. Publish the checked flow and use Production URL. This workflow records requests; it sends no mail and confirms no bookings.\n`
 packages[id+'.en']=files
}
// Portable ZIP writer: no Python or extra runtime required on the build host.
function crc32(data) { let crc=0xffffffff; for(const b of data){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^0xffffffff)>>>0 }
function zip(files) {
 const chunks=[],directory=[];let offset=0
 for(const [filename,content] of Object.entries(files)) {
  const name=Buffer.from(filename),raw=Buffer.from(content),compressed=deflateRawSync(raw),crc=crc32(raw)
  const head=Buffer.alloc(30);head.writeUInt32LE(0x04034b50);head.writeUInt16LE(20,4);head.writeUInt16LE(0x800,6);head.writeUInt16LE(8,8);head.writeUInt16LE(33,12);head.writeUInt32LE(crc,14);head.writeUInt32LE(compressed.length,18);head.writeUInt32LE(raw.length,22);head.writeUInt16LE(name.length,26)
  const entry=Buffer.alloc(46);entry.writeUInt32LE(0x02014b50);entry.writeUInt16LE(20,4);entry.writeUInt16LE(20,6);entry.writeUInt16LE(0x800,8);entry.writeUInt16LE(8,10);entry.writeUInt16LE(33,14);entry.writeUInt32LE(crc,16);entry.writeUInt32LE(compressed.length,20);entry.writeUInt32LE(raw.length,24);entry.writeUInt16LE(name.length,28);entry.writeUInt32LE(offset,42)
  chunks.push(head,name,compressed);directory.push(entry,name);offset+=head.length+name.length+compressed.length
 }
 const central=Buffer.concat(directory),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(Object.keys(files).length,8);end.writeUInt16LE(Object.keys(files).length,10);end.writeUInt32LE(central.length,12);end.writeUInt32LE(offset,16)
 return Buffer.concat([...chunks,central,end])
}
for(const [id,files] of Object.entries(packages))await fs.writeFile(path.join(out,'tools',id+'.zip'),zip(files))
console.log(`Project materials: ${Object.keys(packages).length} tool packages and ${scenarios.length} n8n logic labs.`)
