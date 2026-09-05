import fs from 'node:fs'
import path from 'node:path'
import { RECIPES } from './lib/recipes.mjs'
import { usageFor, TECHNICAL_TOOLS } from './lib/tool-usage.mjs'

const course = JSON.parse(fs.readFileSync('public/course.json', 'utf8'))
const extraRecipes = fs.readdirSync('content/recipes').filter(file => file.endsWith('.json') && !file.endsWith('.en.json')).map(file => ({ ...JSON.parse(fs.readFileSync(`content/recipes/${file}`, 'utf8')), sourceFile: `content/recipes/${file}` }))
const recipes = [...RECIPES.map(recipe => ({ ...recipe, sourceFile: 'scripts/lib/recipes.mjs' })), ...extraRecipes]
const tools = course.toolPages.map(page => {
  const guide = page.guide || {}
  const usage = usageFor(page.id, guide)
  const existingRecipes = recipes.filter(recipe => recipe.tools?.includes(page.id)).map(recipe => ({ id: recipe.id, title: recipe.title, source: recipe.sourceFile, status: 'Existing code recipe; configure and test before use' }))
  const assets = course.lessons.filter(lesson => lesson.tools?.includes(page.id)).flatMap(lesson => (lesson.assets || []).filter(asset => asset.downloadPath && fs.existsSync(path.join('public', asset.downloadPath))).map(asset => {
    let nativeWorkflow = false
    try { const value = JSON.parse(asset.code || '{}'); nativeWorkflow = Array.isArray(value.nodes) && Boolean(value.connections) } catch {}
    return { lesson: lesson.slug, lessonUrl: `#/leccion/${lesson.slug}`, name: asset.name, source: asset.sourcePath, download: asset.downloadPath, kind: nativeWorkflow ? 'workflow_template' : 'code_or_configuration', status: 'Existing downloadable lesson asset; not an active connection' }
  }))
  const uniqueAssets = [...new Map(assets.map(asset => [asset.download, asset])).values()]
  const missingAutomationSection = !guide.automations?.length
  return {
    id: page.id, label: page.label, ...usage,
    automationRecipeCount: guide.automations?.length || 0,
    missingAutomationSection,
    applicationGap: missingAutomationSection && !TECHNICAL_TOOLS.has(page.id),
    resolution: missingAutomationSection
      ? `${usage.action} ${existingRecipes.length || uniqueAssets.length ? 'Hay material reutilizable existente indicado abajo; no demuestra que exista una conexión activa.' : 'La entrega manual es el recorrido disponible; no se ha inventado una integración.'}`
      : 'Las recetas existentes requieren credenciales, destinatarios y prueba de ejecución. Su lectura en el portal no activa servicios.',
    failureClassification: 'No automation section or unconfigured credentials alone is not a software defect.',
    existingRecipes,
    existingDownloadableAssets: uniqueAssets,
    accountReference: guide.account?.url || null,
    verifiedLive: false,
  }
})
const output = {
  checkedAt: new Date().toISOString(),
  basis: 'Repository evidence only. No external account connected, no paid execution, no live integration certified.',
  counts: { tools: tools.length, withAutomationRecipes: tools.filter(tool => !tool.missingAutomationSection).length, withoutAutomationSection: tools.filter(tool => tool.missingAutomationSection).length, technicalToolsWithoutSection: tools.filter(tool => tool.missingAutomationSection && !tool.applicationGap).length, applicationGaps: tools.filter(tool => tool.applicationGap).length },
  explanation: 'The 32 application gaps exclude 9 technical tools/runtimes from the 41 pages without guide.automations. All 56 pages remain listed. Existing recipes and downloads are indexed by exact tool metadata; they require human review and configuration.',
  tools,
}
fs.mkdirSync('audit-output', { recursive: true })
fs.writeFileSync('audit-output/tool-automation-status.json', JSON.stringify(output, null, 2) + '\n')
console.log(output.counts)
