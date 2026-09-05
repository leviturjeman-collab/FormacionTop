import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
let checks = 0
for (const locale of ['es', 'en']) {
  const raw = await fs.readFile(`public/course${locale === 'en' ? '.en' : ''}.json`)
  const full = JSON.parse(raw)
  const directory = `public/course-data/${locale}`
  const read = async name => {
    const shard = JSON.parse(await fs.readFile(`${directory}/${name}.json`, 'utf8'))
    assert.equal(shard.schemaVersion, 1)
    assert.equal(shard.generatedAt, full.generatedAt)
    checks += 2
    return shard.data
  }
  const index = await read('index')
  assert.deepEqual(index.lessons.map(l => l.slug), full.lessons.map(l => l.slug)); checks++
  for (const tool of full.toolPages) {
    if (!tool.guide) continue
    assert.deepEqual(index.toolPages.find(item => item.id === tool.id).guide.counts, { prompts: tool.guide.prompts?.length || 0, automations: tool.guide.automations?.length || 0 }); checks++
  }
  for (const name of ['prompts', 'tools', 'kits']) { assert.deepEqual(await read(name), full[name === 'tools' ? 'toolPages' : name]); checks++ }
  for (const lesson of full.lessons) { assert.deepEqual(await read('lessons/' + encodeURIComponent(lesson.slug)), lesson); checks++ }
  for (const tool of full.toolPages) { assert.deepEqual(await read('tools/' + encodeURIComponent(tool.id)), tool); checks++ }
  for (const key of ['curso', 'agents', 'projects', 'guides', 'preguntas', 'decks', 'glossaryIndex']) { assert.deepEqual(index[key], full[key]); checks++ }
  const manifest = await fs.readFile(`${directory}/index.json`)
  assert.ok(manifest.length < raw.length * 0.3, 'Initial course index must stay below 30% of full payload'); checks++
  console.log(`${locale}: ${full.lessons.length} lessons and ${full.toolPages.length} tools preserved; initial index ${manifest.length} bytes (${gzipSync(manifest).length} gzip), full course ${raw.length} bytes.`)
}
console.log(`PASS content shards: ${checks} assertions; exact content and consistent versions.`)
