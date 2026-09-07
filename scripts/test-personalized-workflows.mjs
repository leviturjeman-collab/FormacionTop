import fs from 'node:fs/promises'
import path from 'node:path'
import {spawn} from 'node:child_process'
import {pathToFileURL} from 'node:url'
import {build} from 'esbuild'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import {scenarios,labWorkflow} from './lib/automation-projects.mjs'
import {scenarioVariation} from './lib/automation-variations.mjs'
const target=path.resolve('.temp/personalized-n8n'),runtime=path.resolve('.temp/n8n-runtime/node_modules/n8n/bin/n8n')
await fs.mkdir(target,{recursive:true});await fs.mkdir(path.join(target,'output'),{recursive:true})
await build({entryPoints:['src/workflow-personalization.ts'],outfile:path.join(target,'personalize.mjs'),bundle:true,format:'esm',platform:'node'})
const {personalizeWorkflow}=await import(pathToFileURL(path.join(target,'personalize.mjs')))
const cases=[]
for(const s of scenarios)for(const [i,sample] of [s,scenarioVariation(s)].entries()){
 const original=labWorkflow(s),config={sample:s.sample,required:s.required}
 const workflow=personalizeWorkflow(original,sample.sample,config),id='personal'+s.id.replaceAll('-','')+i
 assert.equal(original.nodes.length,4);assert.equal(workflow.nodes.length,3)
 assert.equal(workflow.nodes.find(n=>n.name==='Resolver').parameters.jsCode,original.nodes.find(n=>n.name==='Resolver').parameters.jsCode)
 cases.push({workflow:{...workflow,id},expected:sample.expected,error:sample.expectedError})
}
const first=scenarios[0]
assert.throws(()=>personalizeWorkflow(labWorkflow(first),{}, {sample:first.sample,required:first.required}),/Missing/)
assert.throws(()=>personalizeWorkflow(labWorkflow(first),{...first.sample,amount:NaN},{sample:first.sample,required:first.required}),/invalid number/)
await fs.writeFile(path.join(target,'imports.json'),JSON.stringify(cases.map(c=>c.workflow)))
await fs.writeFile(path.join(target,'ids.txt'),cases.map(c=>c.workflow.id).join(','))
const env={...process.env,DB_TYPE:'sqlite',N8N_USER_FOLDER:path.join(target,'profile'),N8N_DIAGNOSTICS_ENABLED:'false',N8N_VERSION_NOTIFICATIONS_ENABLED:'false',N8N_TEMPLATES_ENABLED:'false',N8N_RUNNERS_ENABLED:'true',N8N_RUNNERS_MODE:'internal',N8N_RUNNERS_TASK_BROKER_PORT:'5689',N8N_RUNNERS_BROKER_LISTEN_ADDRESS:'127.0.0.1',N8N_LOG_LEVEL:'warn'}
async function run(args,log,allowed=[0]){
 const handle=await fs.open(path.join(target,log),'w')
 try{await new Promise((resolve,reject)=>{const p=spawn(process.execPath,[runtime,...args],{cwd:target,env,windowsHide:true,stdio:['ignore',handle.fd,handle.fd]});p.on('error',reject);p.on('exit',c=>allowed.includes(c)?resolve():reject(new Error('n8n '+args[0]+' failed: '+log)))})}finally{await handle.close()}
}
console.log('Importing and executing 50 personalised copies in isolated n8n; no external connections.')
await run(['import:workflow','--input='+path.join(target,'imports.json')],'import.log')
await run(['execute-batch','--ids='+path.join(target,'ids.txt'),'--concurrency=1','--retries=0','--snapshot='+path.join(target,'output'),'--output='+path.join(target,'batch.json')],'execute.log',[0,1])
const batch=JSON.parse(await fs.readFile(path.join(target,'batch.json'),'utf8'))
assert.equal(batch.executions.length,50);assert.equal(batch.summary.successfulExecutions,49);assert.equal(batch.summary.failedExecutions,1)
for(const c of cases){
 const actual=batch.executions.find(x=>x.workflowId===c.workflow.id)
 if(c.error){assert.equal(actual.executionStatus,'error');assert.ok(actual.error.includes(c.error));continue}
 assert.equal(actual.executionStatus,'success')
 const snapshot=JSON.parse(await fs.readFile(path.join(target,'output',c.workflow.id+'-snapshot.json'),'utf8'))
 const data=snapshot.data.resultData
 assert.equal(data.lastNodeExecuted,'Resolver')
 const actualResult=data.runData.Resolver.at(-1).data.main[0][0].json
 for(const [key,value] of Object.entries(c.expected))assert.deepEqual(actualResult[key],value,c.workflow.id+' '+key)
}
const hash=crypto.createHash('sha256').update(await fs.readFile('src/workflow-personalization.ts')).digest('hex')
await fs.writeFile('content/verification/personalization-runtime.json',JSON.stringify({checkedAt:new Date().toISOString(),version:JSON.parse(await fs.readFile(path.resolve(path.dirname(runtime),'../package.json'),'utf8')).version,generatorHash:hash,executed:50,successful:49,expectedErrors:1,externalConnectionsExecuted:false,scope:'25 original sample inputs and 25 changed inputs through the actual browser personalization function; arbitrary user data requires its own check.'},null,2))
console.log('PASS: 50 actual personalised n8n executions; 49 results match and 1 expected invalid-time error matches. Original resolver preserved; example-only assertion removed; missing fields and invalid numbers rejected.')
