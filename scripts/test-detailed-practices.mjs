import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import {scenarios} from './lib/automation-projects.mjs'
import {attachWorkflowEvidence} from './lib/workflow-evidence.mjs'
const report=JSON.parse(await fs.readFile('content/verification/n8n-runtime.json','utf8'))
const proven=new Map(report.workflows.map(w=>[w.hash,w]))
const original=JSON.parse(await fs.readFile(`public/project-assets/automations/${scenarios[0].id}.n8n.json`,'utf8'))
const candidate={name:'test.n8n.json',content:JSON.stringify(original)}
attachWorkflowEvidence({files:[candidate]})
assert.ok(candidate.verification,'Unmodified executed workflow receives evidence')
original.nodes[0].name+=' changed'
candidate.content=JSON.stringify(original)
attachWorkflowEvidence({files:[candidate]})
assert.equal(candidate.verification,undefined,'Changed workflow loses previous evidence')
let manuals=0,programmes=0,kits=0,agents=0,verifiedFiles=0
for(const locale of ['es','en']){
 const course=JSON.parse(await fs.readFile(`public/course${locale==='en'?'.en':''}.json`,'utf8'))
 const lab=(p,name)=>{
  assert.ok(p?.source&&p.answer&&p.challenge?.answer,name)
  assert.equal(p.walkthrough.length,3,name)
  assert.ok(p.walkthrough.every(s=>s.title&&s.action&&s.result),name)
  assert.ok(p.materials.length>0&&p.adaptation.length===3,name)
  assert.ok(p.prompt.includes(p.source)&&p.prompt.includes(p.answer),name+' prompt uses its own case')
 }
 const manual=async(m,name)=>{
  lab(m.practiceLab,name);manuals++
  const worksheet=m.files.find(f=>f.name===(locale==='en'?'WORKED-CASE.txt':'CASO-RESUELTO.txt'))
  assert.ok(worksheet?.content.includes(m.practiceLab.answer),name+' complete downloaded answer')
  for(const file of m.files){
   if(file.url)await fs.access('public'+file.url)
   if(file.verification){
    const value=JSON.parse(file.content||await fs.readFile('public'+file.url,'utf8'))
    const hash=crypto.createHash('sha256').update(JSON.stringify({nodes:value.nodes,connections:value.connections,settings:value.settings})).digest('hex')
    assert.equal(file.verification.status,proven.get(hash)?.status,name+' exact executed file')
    assert.equal(file.verification.version,report.version)
    verifiedFiles++
   }
  }
 }
 for(const tool of course.toolPages){
  for(const [i,m] of tool.guide.projectLessons.entries()){
   await manual(m,`${tool.id}/${i+1}`)
   const nav=m.practiceLab.navigation
   assert.equal(nav[0].href,`#/herramienta/${tool.id}/lecciones-herramienta/${String(i+1).padStart(2,'0')}`)
   if(i)assert.equal(nav[1].href,`#/herramienta/${tool.id}/lecciones-herramienta/${String(i).padStart(2,'0')}`)
  }
  for(const a of tool.guide.automations||[])if(a.project)await manual(a.project,tool.id+'/'+a.name)
 }
 for(const lesson of course.curso){if(lesson.projectWorkbook)await manual(lesson.projectWorkbook,lesson.id);else {
  lab(lesson.practiceLab,lesson.id)
  assert.ok(lesson.tasks[0].action.includes(lesson.practiceLab.source),lesson.id+' same source in task and lab')
  assert.ok(lesson.tasks[1].prompt.includes(lesson.practiceLab.answer),lesson.id+' same answer in prompt and lab')
  assert.ok(lesson.tasks[3].action.includes(lesson.practiceLab.challenge.task),lesson.id+' same second attempt')
 };programmes++}
 for(const kit of course.kits){await manual(kit.workbook,kit.id);kits++}
 for(const agent of course.agents){lab(agent.practiceLab,agent.id);agents++}
 const automations=course.toolPages.find(t=>t.id==='n8n').guide.automations
 for(const s of scenarios){
  const m=automations.find(a=>a.project.files.some(f=>f.name===s.id+'.n8n.json')).project
  for(const suffix of ['', '-variation','-missing'])assert.ok(m.files.find(f=>f.name===s.id+suffix+'.n8n.json')?.verification,s.id+suffix+' real execution evidence')
  assert.ok(m.steps[0].instruction.includes('Comprobar resultado'))
  assert.ok(m.steps[2].instruction.includes(s.id+'-variation.n8n.json'))
 }
 const index=JSON.parse(await fs.readFile(`public/course-data/${locale}/index.json`,'utf8')).data
 assert.ok(index.curso.every(x=>!x.practiceLab&&!x.projectWorkbook))
 assert.ok(index.agents.every(x=>!x.practiceLab))
}
assert.equal(programmes,76);assert.equal(kits,70);assert.equal(agents,30)
console.log(`PASS: ${manuals} ES/EN manual instances, 38 Programme lessons, 35 kits and 15 agents; own-case answers, worksheets, exact lesson links and ${verifiedFiles} workflow references matched to actual n8n executions. Rich material stays out of the initial index.`)
