import { promises as fs } from 'node:fs'
import path from 'node:path'

export async function writeCourseShards(course, publicDir, locale) {
  const directory = path.join(publicDir, 'course-data', locale)
  await fs.mkdir(path.join(directory, 'lessons'), { recursive: true })
  await fs.mkdir(path.join(directory, 'tools'), { recursive: true })
  const write = (name, data) => fs.writeFile(path.join(directory, name + '.json'), JSON.stringify({ schemaVersion: 1, generatedAt: course.generatedAt, data }), 'utf8')
  const index = {
    ...course,
    lessons: course.lessons.map(lesson => ({ ...lesson, interactive: [], levels: Object.fromEntries(Object.entries(lesson.levels).map(([level, data]) => [level, { ...data, blocks: [], quiz: [], practice: { ...data.practice, steps: [] } }])) })),
    prompts: course.prompts.map(family => ({ ...family, prompts: family.prompts.map(prompt => ({ ...prompt, prompt: '', fill: [], expect: '', next: '', when: prompt.when?.slice(0, 200) || '' })) })),
    toolPages: course.toolPages.map(tool => ({ ...tool, guide: tool.guide ? { ...tool.guide, counts: { prompts: tool.guide.prompts?.length || 0, automations: tool.guide.automations?.length || 0 }, prompts: [], automations: [], catalog: undefined } : undefined })),
    kits: course.kits.map(kit => ({ ...kit, phases: [], prompts: [], workflows: [] })),
  }
  await write('index', index)
  await write('prompts', course.prompts)
  await write('tools', course.toolPages)
  await write('kits', course.kits)
  for (const tool of course.toolPages) await write('tools/' + encodeURIComponent(tool.id), tool)
  for (const lesson of course.lessons) await write('lessons/' + encodeURIComponent(lesson.slug), lesson)
}
