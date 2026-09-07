import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import {spawn,execFileSync} from 'node:child_process'
import assert from 'node:assert/strict'
import {scenarios,labWorkflow} from './lib/automation-projects.mjs'
import {scenarioVariation} from './lib/automation-variations.mjs'

// Only an isolated test database is used. Nothing is imported into a user's instance.
const root=process.cwd(),target=path.resolve('.temp/n8n-verification'),runtime=path.resolve(process.env.N8N_TEST_RUNTIME||'.temp/n8n-runtime/node_modules/n8n/bin/n8n')
await fs.mkdir(target,{recursive:true});await fs.mkdir(path.join(target,'output'),{recursive:true})
const env={...process.env,DB_TYPE:'sqlite',N8N_USER_FOLDER:path.join(target,'profile'),N8N_DIAGNOSTICS_ENABLED:'false',N8N_VERSION_NOTIFICATIONS_ENABLED:'false',N8N_TEMPLATES_ENABLED:'false',N8N_RUNNERS_ENABLED:'true',N8N_RUNNERS_MODE:'internal',N8N_RUNNERS_TASK_BROKER_PORT:'5689',N8N_RUNNERS_BROKER_LISTEN_ADDRESS:'127.0.0.1',N8N_LOG_LEVEL:'warn'}
const inventory=new Map()
const workflowHash=w=>crypto.createHash('sha256').update(JSON.stringify({nodes:w.nodes,connections:w.connections,settings:w.settings})).digest('hex')
const expectedErrors=new Map()
for(const s of scenarios){
 const v=scenarioVariation(s)
 if(v.expectedError)expectedErrors.set(workflowHash(labWorkflow(v)),v.expectedError)
 const missing=structuredClone(s);delete missing.sample[s.required[0]];missing.name+=' · dato ausente'
 expectedErrors.set(workflowHash(labWorkflow(missing)),'Falta '+s.required[0])
}
function collect(value,source){
 if(!value||typeof value!=='object')return
 if(Array.isArray(value.nodes)&&value.connections&&typeof value.connections==='object'){
  const digest=workflowHash(value)
  if(inventory.has(digest)){inventory.get(digest).sources.push(source);return}
  inventory.set(digest,{hash:digest,id:'qa'+digest.slice(0,14),workflow:value,sources:[source]});return
 }
 for(const [key,v] of Object.entries(value)){
  if(typeof v==='string'&&v.trim().startsWith('{')){try{const parsed=JSON.parse(v);if(parsed.nodes)collect(parsed,source+'.'+key)}catch{}}
  else if(v&&typeof v==='object')collect(v,source+'.'+key)
 }
}
for(const locale of ['es','en'])collect(JSON.parse(await fs.readFile(`public/course${locale==='en'?'.en':''}.json`,'utf8')),locale)
async function collectFiles(dir){
 for(const entry of await fs.readdir(dir,{withFileTypes:true}).catch(()=>[])){
  const filename=path.join(dir,entry.name)
  if(entry.isDirectory())await collectFiles(filename)
  else if(entry.name.endsWith('.json')){try{collect(JSON.parse(await fs.readFile(filename,'utf8')),filename)}catch(error){if(error instanceof SyntaxError)throw new Error('Invalid downloadable JSON: '+filename);throw error}}
 }
}
await collectFiles('public/project-assets')
await collectFiles('public/generated')
// Read the exact JSON files inside the delivered tool archives without extracting paths.
const zipped=JSON.parse(execFileSync('py',['-3.12','-c',`import pathlib,zipfile,json
out=[]
for p in pathlib.Path('public/project-assets').rglob('*.zip'):
 with zipfile.ZipFile(p) as z:
  for n in z.namelist():
   if n.endswith('.json'):
    try:
     d=json.loads(z.read(n))
     if isinstance(d,dict) and 'nodes' in d and 'connections' in d: out.append({'source':str(p)+'!'+n,'data':d})
    except (ValueError,UnicodeDecodeError): pass
print(json.dumps(out))`],{encoding:'utf8',maxBuffer:30*1024*1024}))
for(const x of zipped)collect(x.data,x.source)
const localTypes=new Set(['manualTrigger','code','set','if','switch','merge','noOp','stickyNote'].map(x=>'n8n-nodes-base.'+x))
const rows=[...inventory.values()]
await fs.writeFile(path.join(target,'collected.json'),JSON.stringify(rows.map(r=>({id:r.id,name:r.workflow.name,sources:r.sources,nodes:r.workflow.nodes.map(n=>({name:n.name,type:n.type}))})),null,2))
if(process.env.N8N_INVENTORY_ONLY==='true'){console.log('Inventory written without running n8n.');process.exit(0)}
for(const row of rows){
 row.expectedError=expectedErrors.get(row.hash)
 row.executable=row.workflow.nodes.some(n=>n.type==='n8n-nodes-base.manualTrigger')&&row.workflow.nodes.every(n=>localTypes.has(n.type)&&!n.credentials)
 if(row.executable){
  for(const n of row.workflow.nodes)if(n.parameters?.jsCode)assert.ok(!/\b(fetch|require|process|child_process)\s*[.(]/.test(n.parameters.jsCode),'Review external code before runtime execution: '+row.workflow.name)
 }
}
const runnable=rows.filter(x=>x.executable)
assert.ok(runnable.length>=25,'Must include the actual automation labs')
assert.equal(runnable.filter(r=>r.sources.some(s=>/project-assets[\\/]automations/.test(s))).length>=25,true,'Downloadable automation labs must be included')
// Unnamed snippets are editor fragments in the legacy project, not complete workflow exports.
const complete=rows.filter(r=>r.workflow.name)
await fs.writeFile(path.join(target,'imports.json'),JSON.stringify(complete.map(r=>({...r.workflow,id:r.id,active:false}))))
await fs.writeFile(path.join(target,'ids.txt'),runnable.map(r=>r.id).join(','))
async function run(args,log,allowed=[0]){
 const handle=await fs.open(path.join(target,log),'w')
 try{await new Promise((resolve,reject)=>{
  const p=spawn(process.execPath,[runtime,...args],{cwd:target,env,windowsHide:true,stdio:['ignore',handle.fd,handle.fd]})
  p.on('error',reject);p.on('exit',code=>allowed.includes(code)?resolve():reject(new Error(`n8n ${args[0]} exited ${code}; inspect ${log}`)))
 })}finally{await handle.close()}
}
console.log(`Collected ${rows.length} distinct workflows; ${runnable.length} need no external connections. Importing into isolated n8n.`)
await run(['import:workflow','--input='+path.join(target,'imports.json')],'import.log')
await run(['execute-batch','--ids='+path.join(target,'ids.txt'),'--concurrency=1','--retries=0','--snapshot='+path.join(target,'output'),'--output='+path.join(target,'batch.json')],'execute.log',[0,1])
// Read actual execution JSON; a successful CLI exit is not sufficient evidence.
const files=await fs.readdir(path.join(target,'output'))
const executions=[]
for(const file of files)if(file.endsWith('.json'))executions.push(JSON.parse(await fs.readFile(path.join(target,'output',file),'utf8')))
const batch=JSON.parse(await fs.readFile(path.join(target,'batch.json'),'utf8'))
const intentionalFailures=runnable.filter(r=>r.expectedError)
assert.equal(intentionalFailures.length,26,'25 missing-field tests and the invalid-time test are required')
assert.equal(batch.summary.successfulExecutions,runnable.length-intentionalFailures.length,'Every normal case must execute successfully')
assert.equal(batch.summary.failedExecutions,intentionalFailures.length)
assert.equal(batch.summary.warningExecutions,0)
assert.equal(batch.executions.length,runnable.length)
for(const row of runnable){
 const entry=batch.executions.find(x=>x.workflowId===row.id)
 assert.ok(entry,'Missing execution: '+row.workflow.name)
 if(row.expectedError){assert.equal(entry.executionStatus,'error',row.workflow.name);assert.ok(entry.error.includes(row.expectedError),row.workflow.name+': '+entry.error);continue}
 assert.equal(entry.executionStatus,'success',row.workflow.name)
 const execution=JSON.parse(await fs.readFile(path.join(target,'output',row.id+'-snapshot.json'),'utf8'))
 assert.equal(execution.status,'success',row.workflow.name)
 const result=execution.data.resultData
 assert.ok(!result.error,row.workflow.name)
 const last=result.runData[result.lastNodeExecuted]?.at(-1)?.data?.main?.flat().filter(Boolean)
 assert.ok(last?.length,'Actual final output required: '+row.workflow.name)
 if(row.workflow.nodes.some(n=>n.name==='Comprobar resultado'))assert.equal(last[0].json.passed,true,row.workflow.name)
 if(row.workflow.name==='First practice')assert.equal(last[0].json.name,'Ana')
}
await fs.writeFile(path.join(target,'inventory.json'),JSON.stringify(rows.map(({workflow,...row})=>({...row,name:workflow.name,nodes:workflow.nodes.map(n=>({name:n.name,type:n.type,typeVersion:n.typeVersion}))})),null,2))
await fs.writeFile(path.join(target,'raw-executions.json'),JSON.stringify(executions,null,2))
const version=JSON.parse(await fs.readFile(path.resolve(path.dirname(runtime),'../package.json'),'utf8')).version
await fs.mkdir('content/verification',{recursive:true})
await fs.writeFile('content/verification/n8n-runtime.json',JSON.stringify({version,checkedAt:new Date().toISOString(),imported:complete.length,executed:runnable.length,successful:batch.summary.successfulExecutions,expectedFailures:intentionalFailures.length,externalConnectionsExecuted:false,workflows:runnable.map(r=>({hash:r.hash,status:r.expectedError?'expected-error':'passed',expectedError:r.expectedError,name:r.workflow.name}))},null,2))
console.log(`PASS: imported ${complete.length} complete workflows into n8n ${version}; ${runnable.length} executions checked (${batch.summary.successfulExecutions} successful and ${intentionalFailures.length} intentional errors matched). External connections were not executed.`)
