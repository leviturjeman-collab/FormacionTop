import assert from 'node:assert/strict'
import vm from 'node:vm'
import {scenarios} from './lib/automation-projects.mjs'
import {platformCode} from './lib/platform-recipes.mjs'
async function execute(code,platform,input){
 const context={input:{payload:JSON.stringify(input)},inputData:{payload:JSON.stringify(input)},steps:{trigger:{event:{body:input}}},defineComponent:x=>x}
 if(platform==='pipedream')return vm.runInNewContext(`(${code.replace('export default ','').replace(/;\s*$/,'')}).run({steps,$:{}})`,context)
 return vm.runInNewContext(`(function(){${code}})()`,context)
}
let count=0
for(const platform of ['make','zapier','pipedream'])for(const s of scenarios){
 for(const live of [false,true]){
  const actual=await execute(platformCode(s,platform,live),platform,s.sample)
  const result=JSON.parse(actual.result_json)
  for(const [key,value]of Object.entries(s.expected))assert.deepEqual(result[key],value,`${platform}/${s.id}/${key}`)
  assert.deepEqual(JSON.parse(actual.source_json),s.sample)
  assert.equal(actual.practice_only,true)
  count++
 }
 const incomplete={...s.sample};delete incomplete[s.required[0]]
 await assert.rejects(()=>execute(platformCode(s,platform,true),platform,incomplete),/Missing/)
}
console.log(`PASS: ${count} native Make/Zapier/Pipedream code examples, fixed and incoming data; 75 missing-field checks. External services were not executed.`)
