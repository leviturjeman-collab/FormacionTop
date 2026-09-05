import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { unzipSync } from 'fflate'

let checks = 0
for (const filename of await fs.readdir('public/generated/starters')) {
  const archive = unzipSync(await fs.readFile(path.join('public/generated/starters', filename)))
  const names = Object.keys(archive)
  assert.ok(names.length > 0)
  assert.ok(names.every(name => !/(^|\/)(node_modules|\.env(?:\.(?!example$).*)?|\.git|test-results|__pycache__)(\/|$)/.test(name) && !/\.(db|sqlite|mp4|pyc)$/.test(name)), 'Starter contains runtime/private data: ' + filename)
  if (filename === 'starter-next-vercel-env.zip') assert.ok(names.includes('app/layout.tsx') && names.includes('package-lock.json'))
  if (filename === 'starter-video-remotion.zip') assert.ok(names.includes('src/Root.tsx') && names.includes('src/index.ts'))
  checks++
}
for (const locale of ['es', 'en']) {
  const full = JSON.parse(await fs.readFile(`public/course${locale === 'en' ? '.en' : ''}.json`, 'utf8'))
  const dir = `public/course-data/${locale}`
  const read = async name => {
    const shard = JSON.parse(await fs.readFile(path.join(dir, name + '.json'), 'utf8'))
    assert.equal(shard.schemaVersion, 1); assert.equal(shard.generatedAt, full.generatedAt); checks += 2
    return shard.data
  }
  const index = await read('index')
  assert.deepEqual(index.lessons.map(l => l.slug), full.lessons.map(l => l.slug)); checks++
  for (const name of ['prompts', 'tools', 'kits']) { assert.deepEqual(await read(name), full[name === 'tools' ? 'toolPages' : name]); checks++ }
  for (const lesson of full.lessons) { assert.deepEqual(await read('lessons/' + encodeURIComponent(lesson.slug)), lesson); checks++ }
  for (const agent of full.agents) {
    const names = [...agent.files.map(f => f.name), ...(agent.flow ? ['workflow.json'] : []), 'ACADEMY-SETUP.md']
    assert.equal(new Set(names).size, names.length, 'Duplicate ZIP member: ' + agent.id)
    for (const name of names) assert.ok(!name.startsWith('/') && !name.includes('..') && !/^[a-z]:/i.test(name), 'Unsafe ZIP member ' + name)
    checks++
  }
  const downloads = new Set()
  function collect(value) {
    if (typeof value === 'string' && /^\/?generated\//.test(value)) downloads.add(value)
    else if (value && typeof value === 'object') Object.values(value).forEach(collect)
  }
  collect(full)
  for (const url of downloads) { await fs.access(path.join('public', decodeURIComponent(url))); checks++ }
  const bytes = await fs.readFile(path.join(dir, 'index.json'))
  console.log(`${locale}: ${full.lessons.length} lesson shards verified; index ${bytes.length} bytes / ${gzipSync(bytes).length} gzip`)
}
console.log(`PASS content shards: ${checks} assertions; locale parity, exact payloads and download paths.`)
