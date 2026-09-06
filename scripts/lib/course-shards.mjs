import { promises as fs } from 'node:fs'
import path from 'node:path'

export async function writeCourseShards(course, publicDir, locale) {
  if (!['es','en'].includes(locale)) throw new Error('Unsupported content locale')
  const directory = path.join(publicDir, 'course-data', locale)
  await fs.mkdir(path.join(directory, 'lessons'), { recursive: true })
  for (const folder of ['tools','curso','kits','agents','automations']) await fs.mkdir(path.join(directory, folder), { recursive: true })
  const write = (name, data) => fs.writeFile(path.join(directory, name + '.json'), JSON.stringify({ schemaVersion: 1, generatedAt: course.generatedAt, data }), 'utf8')
  const index = {
    ...course,
    lessons: course.lessons.map(lesson => ({ ...lesson, interactive: [], assets: [], levels: Object.fromEntries(Object.entries(lesson.levels).map(([level, data]) => [level, { ...data, blocks: [], quiz: [], objectives: [], pitfalls: [], checklist: [], practice: { goal: data.practice.goal, evidence: "", steps: [] } }])) })),
    prompts: course.prompts.map(family => ({ ...family, intro: family.intro.slice(0,240), canDo: [], cantDo: [], tips: [], prompts: family.prompts.map(prompt => ({ ...prompt, prompt: '', fill: [], expect: '', next: '', source: '', categoryId: '', when: '' })) })),
    toolPages: course.toolPages.map(tool => ({ ...tool, guide: tool.guide ? { ...tool.guide, account: undefined, first: [], shortcuts: [], daily: [], templates: [], errors: [], words: [], ignore: [], usage: undefined, counts: { prompts: tool.guide.prompts?.length || 0, automations: tool.guide.automations?.length || 0 }, prompts: [], automations: [], projectLessons: undefined, catalog: undefined } : undefined })),
    kits: course.kits.map(kit => ({ ...kit, workbook: undefined, plain: '', fits: [], notFor: [], brief: { ...kit.brief, prompt: '', fill: [] }, architecture: [], stack: [], data: [], phases: [], prompts: [], workflows: [], testData: [], costs: [], legal: [], risks: [], delivery: [], pricing: [], defend: [], words: [] })),
    curso: course.curso.map(item => ({ ...item, why: '', theory: [], projectWorkbook: undefined, tasks: item.tasks.map(task => ({ title: task.title, where: '', action: '', expect: '' })), errors: [], matters: [], ignore: [], canDo: [], cantDo: [], words: [], pieces: [] })),
    glossaryIndex: course.glossaryIndex.map(item => ({ ...item, long: '', analogy: '', confusion: '', examples: [], seeAlso: [] })),
    projects: course.projects.map(item => ({ ...item, steps: [], requires: [], structure: [], checks: [], extend: [], defend: [], phases: [], theory: [], tasks: [], prompts: [], deliverables: [], rubric: [], tests: [] })),
    agents: course.agents.map(item => ({ ...item, files: [], setup: item.setup.map(step => ({ title: step.title, action: '', expect: '' })), tests: [], prompts: [] })),
  }
  await write('index', index)
  await write('automations', course.toolPages.map(tool => ({ id: tool.id, guide: { automations: (tool.guide?.automations || []).map(a => ({ ...a, project: undefined, code: undefined, steps: [], trigger: '', credentials: '', test: '', failure: '' })) } })))
  for (const tool of course.toolPages) await write('automations/' + encodeURIComponent(tool.id), { id: tool.id, guide: { automations: tool.guide?.automations || [] } })
  for (const key of ['curso','kits','agents']) for (const item of course[key]) await write(key + '/' + encodeURIComponent(item.id), item)
  for (const key of ['projects','glossaryIndex']) await write(key, course[key])
  await write('prompts', course.prompts)
  await write('tools', course.toolPages)
  await write('kits', course.kits)
  for (const tool of course.toolPages) await write('tools/' + encodeURIComponent(tool.id), tool)
  for (const lesson of course.lessons) await write('lessons/' + encodeURIComponent(lesson.slug), lesson)
  // Retired generated shards must not remain addressable after a curriculum change.
  for (const [folder, ids] of [['lessons', course.lessons.map(item => item.slug)], ['tools', course.toolPages.map(item => item.id)], ['automations', course.toolPages.map(item => item.id)], ...['curso','kits','agents'].map(key => [key,course[key].map(item => item.id)])]) {
    const expected = new Set(ids.map(id => encodeURIComponent(id) + '.json'))
    const target = path.join(directory, folder)
    for (const entry of await fs.readdir(target, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.json') && !expected.has(entry.name)) await fs.unlink(path.join(target, entry.name))
    }
  }
}
