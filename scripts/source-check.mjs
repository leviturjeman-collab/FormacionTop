import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(await fs.readFile(path.join(root, 'content/source-manifest.json'), 'utf8'))
const destination = path.join(root, 'public/resource-verification.json')
// Explicitly reviewed documentation pages only. Never discover URLs from workflows,
// follow redirects, or request API/webhook endpoints during link checking.
const allowed = new Set(['https://docs.n8n.io/','https://code.claude.com/docs/en/overview','https://platform.openai.com/docs/overview','https://docs.python.org/3/','https://docs.github.com/en','https://core.telegram.org/bots'])
const digest = value => crypto.createHash('sha256').update(value).digest('hex')
const now = new Date().toISOString()
let previous = { sources: [], resources: [] }
try { previous = JSON.parse(await fs.readFile(destination, 'utf8')) } catch {}
const sources = []
for (const source of manifest.sources) {
  const url = new URL(source.url)
  if (url.protocol !== 'https:' || !allowed.has(url.href) || url.username || url.password || url.port || url.search || url.hash) throw Error(`Unsafe documentation URL: ${source.id}`)
  const old = previous.sources.find(s => s.id === source.id && s.url === source.url)
  const result = {...source, http: old?.http || {status:'not_checked'}, instructions: {status:'not_reviewed'}}
  if (process.argv.includes('--network')) {
    try {
      const response = await fetch(source.url, {method:'HEAD',redirect:'manual',signal:AbortSignal.timeout(12000)})
      result.http = {status: response.ok ? 'reachable' : response.status >= 300 && response.status < 400 ? 'redirect_review' : 'http_error', code:response.status, checkedAt:now}
      await response.body?.cancel()
    } catch (error) { result.http = {status:'network_error',checkedAt:now,message:String(error.message).slice(0,160)} }
  }
  sources.push(result)
}
const resources = []
for (const kind of ['agentes','kits']) {
  for (const filename of (await fs.readdir(path.join(root,'content',kind))).filter(x => x.endsWith('.json')).sort()) {
    const sourcePath = `content/${kind}/${filename}`
    const raw = await fs.readFile(path.join(root,sourcePath),'utf8')
    const data = JSON.parse(raw)
    const sha256 = digest(raw)
    const tools = [...(data.tools || []), data.platform].filter(Boolean)
    const checks = [
      {name:'JSON parse',passed:true},
      {name:'Resource identity and title',passed:typeof data.id === 'string' && !!data.id && typeof data.title === 'string' && !!data.title},
      {name:'Tool identifiers are strings',passed:Array.isArray(data.tools) && data.tools.every(x=>typeof x==='string' && !!x)}
    ]
    const flows = [data.flow,...(data.workflows||[]).map(w=>w.flow)].filter(Boolean)
    for (const [index,flow] of flows.entries()) {
      const nodes = flow.nodes || []
      const names = new Set(nodes.map(n=>n.name))
      const connections = Object.entries(flow.connections || {})
      checks.push({name:`Workflow ${index+1}: unique nodes and existing connection targets`,passed:Array.isArray(flow.nodes) && nodes.length>0 && names.size===nodes.length && nodes.every(n=>typeof n.name==='string' && typeof n.type==='string') && connections.every(([name,channels])=>names.has(name) && Object.values(channels).flat(2).every(c=>names.has(c.node)))})
    }
    const old = previous.resources.find(r=>r.sourcePath===sourcePath && r.sha256===sha256)
    resources.push({id:data.id,kind,locale:filename.endsWith('.en.json')?'en':'es',sourcePath,sha256,checkedAt:old?.checkedAt || now,checks,sources:sources.filter(s=>s.tools.some(t=>tools.includes(t))).map(s=>s.id),externalExecution:'not_verified'})
  }
}
if (resources.some(r=>r.checks.some(c=>!c.passed))) { console.error(JSON.stringify(resources.filter(r=>r.checks.some(c=>!c.passed)),null,2)); process.exitCode=1 }
if (process.argv.includes('--verify')) {
  if (JSON.stringify(resources)!==JSON.stringify(previous.resources) || digest(JSON.stringify(manifest))!==previous.manifestHash) throw Error('Verification registry is stale. Run node scripts/source-check.mjs and review changed resources.')
} else {
  await fs.mkdir(path.dirname(destination),{recursive:true})
  await fs.writeFile(destination,JSON.stringify({schemaVersion:1,generatedAt:now,manifestHash:digest(JSON.stringify(manifest)),sources,resources},null,2)+'\n')
}
console.log(`${resources.length} resources checked locally; ${sources.length} public documentation sources; external execution remains unverified.`)
