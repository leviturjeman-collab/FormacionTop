import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import vm from 'node:vm'
import {execFileSync} from 'node:child_process'
import {scenarios,labWorkflow,scenarioCode} from './lib/automation-projects.mjs'
const run=(code,input)=>vm.runInNewContext(`(function(){${code}\n})()`,{$input:{first:()=>({json:structuredClone(input)})}},{timeout:1000})
for(const s of scenarios){
 const workflow=labWorkflow(s)
 const sample=run(workflow.nodes[1].parameters.jsCode,{})[0].json
 const result=run(workflow.nodes[2].parameters.jsCode,sample)[0].json
 assert.equal(run(workflow.nodes[3].parameters.jsCode,result)[0].json.passed,true,s.id)
 const missing={...sample};delete missing[s.required[0]]
 assert.throws(()=>run(scenarioCode(s),missing),/Falta/)
 const wrong={...result,[Object.keys(s.expected)[0]]:'incorrect'}
 assert.throws(()=>run(workflow.nodes[3].parameters.jsCode,wrong),/No coincide/)
}
for(const locale of ['es','en']){
 const course=JSON.parse(await fs.readFile(`public/course${locale==='en'?'.en':''}.json`,'utf8'))
 assert.equal(course.toolPages.length,56)
 assert.ok(course.lessons.every(l=>!/^\.temp\//.test(l.sourcePath)),'Private working materials excluded')
 for(const t of course.toolPages){
  assert.equal(t.guide.projectLessons.length,10,t.id)
  assert.equal(new Set(t.guide.projectLessons.map(m=>m.prompts[0].text)).size,10)
  for(const m of t.guide.projectLessons){
   assert.ok(m.steps.length>=5&&m.tests.length>=3&&m.prompts.length>=2,t.id)
   for(const step of m.steps)assert.ok(step.instruction&&step.expected&&step.why)
   for(const prompt of m.prompts)assert.ok(prompt.where&&prompt.replace&&prompt.expected&&prompt.followUp)
   for(const file of m.files)if(file.url)await fs.access('public'+file.url)
  }
 }
 assert.equal(course.curso.length,38)
 for(const lesson of course.curso){
  assert.equal(lesson.instructionalLocale,locale,lesson.id)
  assert.ok(lesson.projectWorkbook?.steps.length>=5||lesson.theory.length>=5,lesson.id)
  assert.ok(lesson.tasks.every(t=>t.action&&t.expect&&t.where),lesson.id)
 }
}
// Open the delivered archive, check CRCs and run its actual files, not source replicas.
execFileSync('python',['-c',`import pathlib,zipfile,subprocess,json
root=pathlib.Path('.temp/project-tests');root.mkdir(parents=True,exist_ok=True)
for package in pathlib.Path('public/project-assets/tools').glob('*.zip'):
 with zipfile.ZipFile(package) as z:
  assert z.testzip() is None
  assert 'README.md' in z.namelist()
for name in ['codex','python']:
 target=root/name;target.mkdir(exist_ok=True)
 with zipfile.ZipFile('public/project-assets/tools/'+name+'.zip') as z:z.extractall(target)
 if name=='codex':subprocess.run(['node','--test','server.test.mjs'],cwd=target,check=True)
 else:
  result=json.loads(subprocess.check_output(['python','summarize.py','requests.csv'],cwd=target))
  assert result=={'accepted':3,'courses':{'inicial':2,'avanzado':1},'errors':[]},result
  with (target/'requests.csv').open('a',encoding='utf-8') as f:f.write('SOL-001,Ana,ana@example.com,inicial,pending\\n')
  result=json.loads(subprocess.check_output(['python','summarize.py','requests.csv'],cwd=target))
  assert result['accepted']==3 and len(result['errors'])==1,result
`],{stdio:'inherit'})
console.log('PASS: 560 workbooks, 38 Programme units, bilingual ZIP packages, API persistence/conflict/concurrency/restart, CSV duplicate rejection; 25 n8n logic labs with positive, missing-input and failing-assertion checks. External integrations not executed.')
