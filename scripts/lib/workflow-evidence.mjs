import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

// Only an exact match to the nodes, connections and settings of a real run receives a claim.
export function attachWorkflowEvidence(course){
 let report
 try{report=JSON.parse(fs.readFileSync('content/verification/n8n-runtime.json','utf8'))}catch(error){if(error.code==='ENOENT')return;throw error}
 const verified=new Map(report.workflows.map(w=>[w.hash,w])),publicRoot=path.resolve('public')+path.sep
 function walk(value){
  if(!value||typeof value!=='object')return
  if(typeof value.name==='string'&&(typeof value.content==='string'||typeof value.url==='string')){
   delete value.verification
   let text=value.content
   if(!text&&value.url?.startsWith('/project-assets/')&&value.url.endsWith('.json')){
    const target=path.resolve('public',value.url.slice(1))
    if(!target.startsWith(publicRoot))throw new Error('Workflow path escapes public')
    text=fs.readFileSync(target,'utf8')
   }
   if(text?.trim().startsWith('{')){
    let w;try{w=JSON.parse(text)}catch{}
    if(w?.nodes&&w?.connections){
     const hash=crypto.createHash('sha256').update(JSON.stringify({nodes:w.nodes,connections:w.connections,settings:w.settings})).digest('hex'),evidence=verified.get(hash)
     if(evidence)value.verification={version:report.version,checkedAt:report.checkedAt,status:evidence.status,expectedError:evidence.expectedError}
    }
   }
  }
  for(const child of Object.values(value))if(child&&typeof child==='object')walk(child)
 }
 walk(course)
}
