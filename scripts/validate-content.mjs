import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const portalDir = path.resolve(scriptDir, '..')
const catalogPath = path.join(portalDir, 'public', 'catalog.json')
const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'))
const studentCatalogPath = path.join(portalDir, 'public', 'student-catalog.json')
const studentCatalog = JSON.parse(await fs.readFile(studentCatalogPath, 'utf8'))
const failures = []

if (catalog.stats.documents < 400) failures.push(`Solo se indexaron ${catalog.stats.documents} documentos; se esperaban al menos 400.`)
if (catalog.stats.workflows < 40) failures.push(`Solo se indexaron ${catalog.stats.workflows} workflows; se esperaban 40.`)
if (catalog.stats.skills < 40) failures.push(`Solo se indexaron ${catalog.stats.skills} skills; se esperaban 40.`)
if (studentCatalog.stats.resources !== catalog.stats.documents) failures.push(`La capa del alumno tiene ${studentCatalog.stats.resources} recursos, pero la fuente contiene ${catalog.stats.documents}.`)
if (studentCatalog.stats.lessons !== 48) failures.push(`El programa curado tiene ${studentCatalog.stats.lessons} lecciones; se esperaban 48.`)
if (studentCatalog.stats.modules !== 8) failures.push(`El programa tiene ${studentCatalog.stats.modules} módulos; se esperaban 8.`)

for (const resource of studentCatalog.resources) {
  if (!Array.isArray(resource.walkthrough) || resource.walkthrough.length < 5) failures.push(`${resource.title} no tiene un walkthrough suficiente.`)
  for (const level of ['basic', 'medium', 'advanced']) {
    const track = resource.levels?.[level]
    if (!track) failures.push(`${resource.title} no tiene nivel ${level}.`)
    else if (!track.summary || !track.outcome || !track.activity || !track.evidence || !Array.isArray(track.checks) || track.checks.length < 3) failures.push(`${resource.title}/${level} no tiene una ruta de nivel completa.`)
  }
  if ('content' in resource) failures.push(`${resource.title} expone contenido Markdown crudo.`)
  for (const step of resource.walkthrough || []) {
    if (!step.where || !step.action || !step.expected || !step.evidenceLabel) failures.push(`${resource.title}/${step.id} no define dónde, acción, resultado y evidencia.`)
  }
}

for (const workflow of catalog.workflows) {
  const jsonName = workflow.path.split('/').at(-1).replace(/\.md$/, '.json')
  const jsonPath = path.join(portalDir, 'public', 'generated', 'workflows', jsonName)
  try {
    const data = JSON.parse(await fs.readFile(jsonPath, 'utf8'))
    if (!data.nodes || !Array.isArray(data.nodes)) failures.push(`${jsonName} no contiene un array nodes.`)
  } catch (error) {
    failures.push(`${jsonName} no es un workflow JSON válido: ${error.message}`)
  }
}

const duplicatePaths = catalog.documents
  .map((document) => document.path)
  .filter((value, index, values) => values.indexOf(value) !== index)
if (duplicatePaths.length) failures.push(`Rutas duplicadas: ${duplicatePaths.join(', ')}`)

if (failures.length) {
  console.error('Validación fallida:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log(`Validación correcta: ${catalog.stats.documents} fuentes, ${studentCatalog.stats.lessons} lecciones curadas y ${studentCatalog.stats.resources} walkthroughs adaptados.`)
