import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
const proof=JSON.parse(await fs.readFile('content/verification/personalization-runtime.json','utf8'))
assert.equal(proof.generatorHash,crypto.createHash('sha256').update(await fs.readFile('src/workflow-personalization.ts')).digest('hex'),'Personalization changes require a new runtime check')
assert.equal(proof.executed,50);assert.equal(proof.successful,49);assert.equal(proof.expectedErrors,1)
for(const lang of ['es','en']){
 const c=JSON.parse(await fs.readFile(`public/course${lang==='en'?'.en':''}.json`,'utf8'))
 const prompts=c.prompts.flatMap(f=>f.prompts)
 assert.ok(prompts.length>1000)
 for(const p of prompts){
  assert.ok(p.where&&p.expect&&p.prompt,p.id)
  assert.ok(!p.id.includes(':extra-'),'Generic bank combinations are not advertised as authored tasks')
  assert.ok(!/## (Reglas institucionales|Institutional rules|Cierre institucional obligatorio|Required institutional close)/.test(p.prompt),p.id)
  assert.ok(p.fill.every(([slot])=>p.prompt.includes(slot)),p.id+' fields belong to its own prompt')
  if(p.practiceHref){
   const parts=p.practiceHref.split('/')
   if(parts[1]==='herramienta'){const tool=c.toolPages.find(t=>t.id===parts[2]);assert.ok(tool?.guide.projectLessons[Number(parts[4])-1])}
   else if(parts[1]==='automatizaciones'){const tool=c.toolPages.find(t=>t.id===parts[2]);assert.ok(tool?.guide.automations.find(a=>a.id===parts[3]))}
   else if(parts[1]==='kits')assert.ok(c.kits.find(k=>k.id===parts[2]))
   else if(parts[1]==='curso')assert.ok(c.curso.find(l=>l.id===parts[2]))
   else assert.fail('Unknown practice route '+p.practiceHref)
  }
 }
 const daily=prompts.filter(p=>p.id.includes('base-trabajo-diario'))
 assert.equal(daily.length,8)
 for(const p of daily){assert.ok(p.example.input&&p.example.output&&p.example.why);assert.equal(Object.keys(p.exampleValues).length,p.fill.length);assert.ok(p.fill.every(([key])=>p.exampleValues[key]))}
 const flows=c.toolPages.find(t=>t.id==='n8n').guide.automations.flatMap(a=>a.project.files).filter(f=>f.personalization)
 assert.equal(flows.length,25)
 for(const f of flows){assert.ok(f.personalization.required.every(k=>Object.hasOwn(f.personalization.sample,k)));assert.ok(f.verification)}
 const index=JSON.parse(await fs.readFile(`public/course-data/${lang}/index.json`,'utf8')).data
 assert.ok(index.prompts.flatMap(f=>f.prompts).every(p=>!p.example&&!p.exampleValues&&!p.prompt))
 console.log(`PASS ${lang}: ${prompts.length} task prompts, 8 worked daily examples, valid editable fields and connected practice routes, 25 n8n input forms and runtime proof. Examples stay out of the initial index.`)
}
const ids=async file=>JSON.parse(await fs.readFile(file,'utf8')).prompts.flatMap(f=>f.prompts).map(p=>p.id).sort()
assert.deepEqual(await ids('public/course.json'),await ids('public/course.en.json'),'The practical library offers the same tasks in both languages')
