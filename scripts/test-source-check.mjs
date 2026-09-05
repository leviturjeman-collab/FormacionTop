import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {spawnSync} from 'node:child_process'
import assert from 'node:assert/strict'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const fixture=await fs.mkdtemp(path.join(os.tmpdir(),'academy-sources-'))
try {
  await Promise.all(['scripts','content/agentes','content/kits','public'].map(p=>fs.mkdir(path.join(fixture,p),{recursive:true})))
  await fs.copyFile(path.join(root,'scripts/source-check.mjs'),path.join(fixture,'scripts/source-check.mjs'))
  const manifest={sources:[{id:'python',url:'https://docs.python.org/3/',tools:['python'],purpose:'Python'}]}
  const writeManifest=()=>fs.writeFile(path.join(fixture,'content/source-manifest.json'),JSON.stringify(manifest))
  await writeManifest()
  const resource=path.join(fixture,'content/agentes/example.json')
  await fs.writeFile(resource,JSON.stringify({id:'example',title:'Example',tools:['python']}))
  const run=(...args)=>spawnSync(process.execPath,[path.join(fixture,'scripts/source-check.mjs'),...args],{encoding:'utf8'})
  assert.equal(run().status,0)
  assert.equal(run('--verify').status,0)
  let registry=JSON.parse(await fs.readFile(path.join(fixture,'public/resource-verification.json'),'utf8'))
  assert.equal(registry.sources[0].http.status,'not_checked')
  assert.equal(registry.sources[0].instructions.status,'not_reviewed')
  assert.equal(registry.resources[0].externalExecution,'not_verified')
  await fs.appendFile(resource,'\n')
  assert.notEqual(run('--verify').status,0,'changed bytes invalidate registry')
  assert.equal(run().status,0)
  assert.equal(run('--verify').status,0)
  manifest.sources[0].url='https://api.openai.com/v1/responses'
  await writeManifest()
  assert.notEqual(run().status,0,'API endpoints denied before requesting')
  manifest.sources[0].url='https://docs.python.org/3/?token=secret'
  await writeManifest()
  assert.notEqual(run().status,0,'query strings denied')
  console.log('PASS source registry: offline default, explicit unverified labels, hash drift, API/query denial')
} finally {
  const resolved=path.resolve(fixture)
  assert.equal(path.dirname(resolved),path.resolve(os.tmpdir()))
  assert(path.basename(resolved).startsWith('academy-sources-'))
  await fs.rm(resolved,{recursive:true,force:true})
}
