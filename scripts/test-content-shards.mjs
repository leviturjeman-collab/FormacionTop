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
  for (const name of ['prompts', 'tools', 'kits','projects','glossaryIndex']) { assert.deepEqual(await read(name), full[name === 'tools' ? 'toolPages' : name]); checks++ }
  for (const lesson of full.lessons) { assert.deepEqual(await read('lessons/' + encodeURIComponent(lesson.slug)), lesson); checks++ }
  for (const tool of full.toolPages) {
    const shell=await read('tools/'+encodeURIComponent(tool.id))
    assert.equal(shell.id,tool.id)
    assert.deepEqual(shell.guide?.projectLessons?.map(m=>m.title),tool.guide?.projectLessons?.map(m=>m.title))
    assert.ok(shell.guide?.projectLessons?.every(m=>m.steps.length===0))
    for(const [i,manual] of (tool.guide?.projectLessons||[]).entries()){
      const lesson=await read('tool-lessons/'+encodeURIComponent(tool.id)+'-'+String(i+1).padStart(2,'0'))
      assert.equal(lesson.toolId,tool.id);assert.deepEqual(lesson.manual,manual);checks++
    }
    checks++
  }
  for (const key of ['guides', 'preguntas', 'decks']) { assert.deepEqual(index[key], full[key]); checks++ }
  for (const key of ['curso','kits','agents']) for (const item of full[key]) { assert.deepEqual(await read(key + '/' + encodeURIComponent(item.id)), item); checks++ }
  for (const tool of full.toolPages) { assert.deepEqual((await read('automations/' + encodeURIComponent(tool.id))).guide.automations, tool.guide?.automations || []); checks++ }
  for (const item of full.curso) assert.equal(index.curso.find(x => x.id === item.id).tasks.length, item.tasks.length, 'Task totals survive light indexing')
  const manifest = await fs.readFile(`${directory}/index.json`)
  assert.ok(gzipSync(manifest).length < 450000, 'Initial compressed index stays below 450 KB')
  assert.ok(manifest.length < raw.length * 0.3, 'Initial course index must stay below 30% of full payload'); checks++
  console.log(`${locale}: ${full.lessons.length} lessons and ${full.toolPages.length} tools preserved; initial index ${manifest.length} bytes (${gzipSync(manifest).length} gzip), full course ${raw.length} bytes.`)
}
console.log(`PASS content shards: ${checks} assertions; exact content and consistent versions.`)
