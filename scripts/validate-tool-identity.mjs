import assert from 'node:assert/strict'
import fs from 'node:fs'
import { appGuideFor } from './lib/apps.mjs'
import { installersFor } from './lib/installers.mjs'

for (const file of ['public/course.json', 'public/course.en.json']) {
  const course = JSON.parse(fs.readFileSync(file, 'utf8'))
  for (const id of ['codex', 'claude', 'higgsfield']) {
    const page = course.toolPages.find(page => page.id === id)
    assert.ok(page?.guide, `${file}: missing ${id} guide`)
    assert.equal(page.guide.id, id, `${file}: ${id} uses another product's guide`)
    assert.ok(page.guide.catalog.sources?.every(source => source.url.startsWith('https://')), `${file}: ${id} needs source links`)
  }
  const codex = course.toolPages.find(page => page.id === 'codex').guide
  assert.match(codex.plain, /^Codex /)
  assert.doesNotMatch(JSON.stringify(codex.account), /claude-code|CLAUDE\.md/)
  assert.ok(codex.catalog.items.some(item => item.name === 'GPT-6 Astra'))
}
assert.equal(appGuideFor(['codex'], 'asistentes', 'Guía de Codex')?.label, 'Codex')
assert.equal(appGuideFor(['postgres'], 'datos', 'PostgreSQL'), null)
for (const id of ['codex', 'supabase', 'higgsfield']) {
  const result = installersFor({ tools: [id], stageId: 'fundamentos', title: `Instalar ${id}` })
  assert.ok(result.every(installer => installer.tools.includes(id)), `${id}: unrelated installer`)
}
assert.ok(installersFor({ tools: ['codex'], stageId: 'asistentes', title: 'Instalar Codex' }).some(installer => installer.id === 'codex'))
console.log('Tool identity, model sources and installer isolation verified in ES and EN.')
