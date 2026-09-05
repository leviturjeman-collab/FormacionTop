/**
 * Comprobaciones sobre el curso generado.
 *
 * Falla con código 1 si algo está roto, para poder encadenarlo en `npm test`
 * antes de compilar.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(projectDir, 'public')

const problems = []
const warnings = []
const check = (condition, message) => { if (!condition) problems.push(message) }

const course = JSON.parse(await fs.readFile(path.join(publicDir, 'course.json'), 'utf8'))

const countWords = (value) => String(value || '').trim().split(/\s+/).filter(Boolean).length
const MANUAL_ONLY_TOOLS = new Set(['wispr-flow'])

check(course.stages.length === 10, `Hay ${course.stages.length} etapas; se esperaban 10.`)
check(course.tools?.length > 0, 'Falta el catálogo de herramientas en course.json.')
check(course.lessons.length === 0, `El vault ha vuelto a generar ${course.lessons.length} lecciones; debería generar 0.`)

/* --- Voz: se le habla al alumno, no se habla de él ------------------ */

/**
 * El material del vault estaba escrito para quien imparte, y hablaba del
 * alumno en tercera persona: «el objetivo pedagógico es que el alumno
 * aprenda…». Al leerlo desde el curso, el alumno veía cómo hablaban de él.
 * Aquí se comprueba que eso no vuelve a entrar por ninguna puerta.
 */
const VOZ_DE_PROFESOR = /\b(?:el|la|los|las|al|del)\s+alumn[oa]s?\b|\bobjetivo pedag[oó]gic|\bcompetencias por nivel\b|\bb[oó]veda\b|\bvault\b|\besta nota\b|\beste documento (?:desarrolla|forma parte)/i

const revisarVoz = (donde, texto) => {
  if (typeof texto !== 'string' || !VOZ_DE_PROFESOR.test(texto)) return
  const frase = texto.match(new RegExp(`[^.]*(?:${VOZ_DE_PROFESOR.source})[^.]*\\.`, 'i'))?.[0]?.trim()
  problems.push(`${donde} habla del alumno en tercera persona: «${(frase || texto).slice(0, 120)}»`)
}

for (const leccion of course.curso || []) {
  const donde = `La lección ${leccion.number} «${leccion.title}»`
  revisarVoz(donde, leccion.promise)
  revisarVoz(donde, leccion.why)
  for (const bloque of leccion.theory || []) {
    revisarVoz(`${donde}, apartado «${bloque.title}»`, bloque.text)
    revisarVoz(`${donde}, analogía de «${bloque.title}»`, bloque.analogy)
    revisarVoz(`${donde}, ejemplo de «${bloque.title}»`, bloque.example)
  }
  for (const tarea of leccion.tasks || []) {
    revisarVoz(`${donde}, tarea «${tarea.title}»`, tarea.action)
    revisarVoz(`${donde}, tarea «${tarea.title}»`, tarea.expect)
  }
}
for (const guia of course.guides || []) {
  revisarVoz(`La guía «${guia.title}»`, guia.intro)
  for (const bloque of guia.theory || []) revisarVoz(`La guía «${guia.title}», apartado «${bloque.title}»`, bloque.text)
}
for (const tool of course.toolPages || []) {
  if (tool.guide) revisarVoz(`La guía de ${tool.label}`, tool.guide.plain)
}

/* --- El programa: las lecciones escritas a mano --------------------- */

const programa = (course.curso || []).filter((leccion) => !leccion.tool)

check(programa.length >= 45, `El programa tiene ${programa.length} lecciones; se esperaban al menos 45.`)

// Cada bloque tiene que tener lecciones: un bloque vacío en el menú es una
// promesa incumplida delante del alumno.
for (const stage of course.stages) {
  const enBloque = programa.filter((leccion) => leccion.stageId === stage.id)
  check(enBloque.length >= 4, `El bloque ${stage.number} «${stage.title}» solo tiene ${enBloque.length} lecciones.`)
}

// Los números ordenan el programa y salen en pantalla como «12 de 49».
const numeros = new Map()
for (const leccion of programa) {
  if (numeros.has(leccion.number)) {
    problems.push(`Dos lecciones con el número ${leccion.number}: «${numeros.get(leccion.number)}» y «${leccion.title}».`)
  }
  numeros.set(leccion.number, leccion.title)
}

// Un título que enumera palabras clave sin verbo es el nombre de una carpeta,
// no el tema de una lección. Fue el fallo que trajo aquí todo este trabajo.
const pareceCarpeta = (titulo) =>
  (titulo.match(/,/g) || []).length >= 3 && !/[.:?!]$/.test(titulo) && !/\b(?:es|son|hace|c[oó]mo|qu[eé]|cuando|sin|para)\b/i.test(titulo)

for (const leccion of programa) {
  const donde = `La lección ${leccion.number} «${leccion.title}»`
  check(!pareceCarpeta(leccion.title), `${donde} tiene un título con forma de nombre de carpeta.`)
  check(countWords(leccion.promise) >= 20, `${donde} tiene una promesa de ${countWords(leccion.promise)} palabras; se esperaban 20 o más.`)
  check(countWords(leccion.why) >= 40, `${donde} no explica por qué importa (${countWords(leccion.why)} palabras).`)
  check((leccion.theory || []).length >= 4, `${donde} tiene ${(leccion.theory || []).length} apartados de teoría; se esperaban 4 o más.`)
  check((leccion.tasks || []).length >= 4, `${donde} tiene ${(leccion.tasks || []).length} tareas; se esperaban 4 o más.`)
  check((leccion.words || []).length >= 4, `${donde} define ${(leccion.words || []).length} términos; se esperaban 4 o más.`)
  check(leccion.minutes > 0, `${donde} no dice cuánto dura.`)

  for (const bloque of leccion.theory || []) {
    // Se mide el apartado entero, que es lo que el alumno lee: un paso corto
    // con su analogía y su ejemplo enseña más que un párrafo largo y solo.
    const total = countWords(bloque.text) + countWords(bloque.analogy) + countWords(bloque.example)
    check(countWords(bloque.text) >= 40,
      `${donde}: el apartado «${bloque.title}» explica en ${countWords(bloque.text)} palabras; se queda corto.`)
    check(total >= 110,
      `${donde}: el apartado «${bloque.title}» suma ${total} palabras entre explicación, analogía y ejemplo; se queda corto.`)
  }
  for (const tarea of leccion.tasks || []) {
    check(Boolean(tarea.where), `${donde}: la tarea «${tarea.title}» no dice dónde se hace.`)
    check(Boolean(tarea.expect), `${donde}: la tarea «${tarea.title}» no dice qué hay que ver al terminar.`)
  }
  // La última de cada bloque puede no tener siguiente, pero el resto sí: es lo
  // que encadena el programa.
  const ultima = leccion.number === Math.max(...programa.map((item) => item.number))
  if (!ultima) check(Boolean(leccion.next), `${donde} no dice qué viene después.`)
}

for (const family of course.prompts || []) {
  check((family.prompts || []).length <= 50, `La categoria de prompts «${family.title}» tiene ${family.prompts?.length || 0}; debe tener como máximo 50.`)
  for (const prompt of family.prompts || []) {
    check(countWords(prompt.prompt) >= 450, `El prompt «${prompt.name}» tiene menos de 450 palabras.`)
    check(/\[[^\]]+\]/.test(prompt.prompt), `El prompt institucional «${prompt.name}» no tiene corchetes rellenables.`)
    check(/institucional/i.test(prompt.prompt), `El prompt «${prompt.name}» no está marcado como institucional.`)
  }
}
// Nombres de familia sin duplicados visibles («… · Programa» vs «… · Biblioteca anterior»).
const familyTitles = new Set()
for (const family of course.prompts || []) {
  check(!familyTitles.has(family.title), `Familia de prompts duplicada: «${family.title}».`)
  familyTitles.add(family.title)
}
const libraryPrompts = (course.prompts || []).flatMap((family) => family.prompts || [])
for (const tool of course.toolPages || []) {
  const maxLessons = tool.maxLessons || 25
  check((tool.lessonSlugs || []).length <= maxLessons, `${tool.label} muestra ${tool.lessonSlugs?.length || 0} lecciones; el máximo es ${maxLessons}.`)
  if (MANUAL_ONLY_TOOLS.has(tool.id)) continue

  const count = libraryPrompts.filter((prompt) => prompt.toolId === tool.id).length
  check(count >= 15, `La biblioteca solo tiene ${count} prompts para ${tool.label}; se esperaban al menos 15 pertinentes.`)
}
for (const tool of course.toolPages || []) {
  for (const prompt of tool.guide?.prompts || []) {
    check(countWords(prompt.prompt) >= 400, `El prompt de ${tool.label} «${prompt.name}» tiene menos de 400 palabras.`)
  }
}

/* --- Kits institucionales: completos y sin clones ------------------- */

const KIT_REQUIRED = ['id', 'title', 'kicker', 'promise', 'audience', 'plain', 'fits', 'notFor', 'scopes', 'brief', 'architecture', 'stack', 'data', 'phases', 'prompts', 'workflows', 'testData', 'costs', 'legal', 'risks', 'delivery', 'pricing', 'defend', 'tools', 'deliverables']
check((course.kits || []).length >= 20, `Hay ${course.kits?.length || 0} kits institucionales; se esperaban al menos 20.`)
const kitFingerprints = { architecture: new Set(), legal: new Set(), pricing: new Set(), defend: new Set(), flow: new Set() }
for (const kit of course.kits || []) {
  for (const field of KIT_REQUIRED) {
    const value = kit[field]
    const empty = value == null || (Array.isArray(value) && !value.length)
    check(!empty, `El kit «${kit.id}» no tiene el campo ${field}.`)
  }
  const flow = kit.workflows?.[0]?.flow
  if (flow) check((flow.nodes || []).length >= 6, `El flujo del kit «${kit.id}» tiene ${flow.nodes?.length || 0} nodos; se esperaban al menos 6.`)
  const marks = {
    architecture: JSON.stringify(kit.architecture || ''),
    legal: JSON.stringify(kit.legal || ''),
    pricing: JSON.stringify(kit.pricing || ''),
    defend: JSON.stringify(kit.defend || ''),
    flow: JSON.stringify(flow?.nodes?.map((node) => [node.name, node.type]) || kit.id),
  }
  for (const [aspect, mark] of Object.entries(marks)) {
    check(!kitFingerprints[aspect].has(mark), `El kit «${kit.id}» comparte ${aspect} idéntico con otro kit: cada kit debe tener contenido propio.`)
    kitFingerprints[aspect].add(mark)
  }
}

/* --- Agentes listos para usar --------------------------------------- */

check((course.agents || []).length >= 12, `Hay ${course.agents?.length || 0} agentes; se esperaban al menos 12.`)
const agentIds = new Set()
for (const agent of course.agents || []) {
  check(!agentIds.has(agent.id), `Agente duplicado: «${agent.id}».`)
  agentIds.add(agent.id)
  for (const field of ['title', 'platform', 'what', 'forWho', 'files', 'setup', 'test']) {
    const value = agent[field]
    const empty = value == null || (Array.isArray(value) && !value.length)
    check(!empty, `El agente «${agent.id}» no tiene el campo ${field}.`)
  }
  for (const file of agent.files || []) {
    check(Boolean(file.name && file.content), `El agente «${agent.id}» tiene un archivo sin nombre o sin contenido.`)
  }
}

check((course.stats?.workflows || 0) >= 40, `Hay ${course.stats?.workflows || 0} workflows importables; se esperaban al menos 40.`)
check((course.guides || []).length >= 7, `Hay ${course.guides?.length || 0} guías fundamentales; se esperaban al menos 7.`)

// Cada lección tiene sus tres niveles completos.
const LEVELS = ['basico', 'intermedio', 'avanzado']
const slugs = new Set()
for (const lesson of course.lessons) {
  if (slugs.has(lesson.slug)) problems.push(`Slug duplicado: ${lesson.slug}`)
  slugs.add(lesson.slug)

  // Una lección y una ficha de consulta no se miden igual. La lección
  // enseña, así que necesita objetivos y práctica; la ficha se consulta,
  // y lo que se le exige es tener contenido y algo que comprobar.
  const esLeccion = lesson.format !== 'ficha'

  for (const level of LEVELS) {
    const content = lesson.levels?.[level]
    if (!content) { problems.push(`${lesson.slug}: falta el nivel ${level}.`); continue }
    if (!content.headline) problems.push(`${lesson.slug} (${level}): sin titular.`)
    if (!content.blocks?.length) problems.push(`${lesson.slug} (${level}): sin contenido.`)
    if (!content.checklist?.length) problems.push(`${lesson.slug} (${level}): sin checklist.`)
    if (esLeccion && !content.objectives?.length) problems.push(`${lesson.slug} (${level}): sin objetivos.`)
    if (esLeccion && !content.practice?.steps?.length) problems.push(`${lesson.slug} (${level}): sin práctica.`)
  }
}

// Las etapas y carpetas apuntan a lecciones que existen.
for (const stage of course.stages) {
  for (const slug of stage.lessonSlugs) {
    if (!slugs.has(slug)) problems.push(`La etapa ${stage.id} apunta a «${slug}», que no existe.`)
  }
}
for (const folder of course.folders) {
  for (const slug of folder.lessonSlugs) {
    if (!slugs.has(slug)) problems.push(`La carpeta ${folder.id} apunta a «${slug}», que no existe.`)
  }
}
for (const lesson of course.lessons) {
  for (const slug of lesson.related || []) {
    if (!slugs.has(slug)) problems.push(`${lesson.slug} enlaza con «${slug}», que no existe.`)
  }
}

// Toda lección pertenece a una etapa real y aparece en ella.
const stageIds = new Set(course.stages.map((stage) => stage.id))
for (const lesson of course.lessons) {
  if (!stageIds.has(lesson.stageId)) problems.push(`${lesson.slug}: etapa desconocida «${lesson.stageId}».`)

  // Las automatizaciones con código deben enseñar el archivo que se ejecuta;
  // una ficha sin su fuente real es un fallo de contenido, no de diseño.
  if (/automatizaciones_codigo_40\/docs\//i.test(lesson.sourcePath)) {
    const codeAssets = (lesson.assets || []).filter((asset) => asset.kind === 'code' && asset.code?.trim())
    if (!codeAssets.length) problems.push(`${lesson.slug}: la documentación de código no tiene archivo ejecutable asociado.`)
  }
  for (const asset of lesson.assets || []) {
    if (!asset.code?.trim()) problems.push(`${lesson.slug}: el asset ${asset.name} está vacío.`)
    if (!asset.sourcePath || !asset.language) problems.push(`${lesson.slug}: el asset ${asset.name} no tiene origen o lenguaje.`)
    if (asset.downloadPath) {
      const target = path.join(publicDir, asset.downloadPath.replace(/^\//, ''))
      try { await fs.access(target) } catch { problems.push(`${lesson.slug}: el asset ${asset.name} no tiene descarga generada.`) }
    }
  }
}

// El Programa curado es la ruta que se presenta a una persona que empieza de cero.
const cursoIds = new Set()
for (const lesson of course.curso || []) {
  if (cursoIds.has(lesson.id)) problems.push(`Programa: id duplicado «${lesson.id}».`)
  cursoIds.add(lesson.id)
  if (!lesson.title || !lesson.promise || !lesson.why) problems.push(`Programa ${lesson.id}: falta título, promesa o motivo.`)
  for (const task of lesson.tasks || []) {
    if (!task.title || !task.where || !task.action || !task.expect) problems.push(`Programa ${lesson.id}: tarea incompleta.`)
  }
}

// Los diagramas de workflow apuntan a un JSON descargable que existe.
let downloads = 0
for (const lesson of course.lessons) {
  for (const piece of lesson.interactive || []) {
    if (piece.kind !== 'flow' || !piece.download) continue
    downloads += 1
    const target = path.join(publicDir, piece.download.replace(/^\//, ''))
    try { await fs.access(target) } catch { problems.push(`${lesson.slug}: el diagrama enlaza con ${piece.download}, que no existe.`) }
  }
  for (const piece of lesson.interactive || []) {
    if (piece.kind !== 'flow') continue
    const ids = new Set(piece.nodes.map((node) => node.id))
    for (const edge of piece.edges) {
      if (!ids.has(edge.from) || !ids.has(edge.to)) problems.push(`${lesson.slug}: el diagrama tiene una conexión hacia un nodo inexistente.`)
    }
  }
}

// Los iconos de marca referenciados existen en el módulo generado.
const iconModule = await fs.readFile(path.join(projectDir, 'src', 'brand-icons.ts'), 'utf8')
for (const tool of course.tools || []) {
  if (!iconModule.includes(`"${tool.icon}":`)) warnings.push(`La herramienta ${tool.id} usa el icono «${tool.icon}», que no está descargado.`)
}

const delPrograma = (course.curso || []).filter((leccion) => !leccion.tool)
const minutosTotales = delPrograma.reduce((suma, leccion) => suma + (leccion.minutes || 0), 0)
const tareasTotales = delPrograma.reduce((suma, leccion) => suma + (leccion.tasks?.length || 0), 0)
console.log(
  `Programa: ${delPrograma.length} lecciones · ${Math.round(minutosTotales / 60)} h · ${tareasTotales} tareas · ` +
    `${course.guides.length} guías · ${course.kits.length} kits · ${course.toolPages.length} herramientas · ` +
    `${downloads} diagramas descargables`,
)
for (const warning of warnings.slice(0, 10)) console.warn(`  aviso: ${warning}`)
if (warnings.length > 10) console.warn(`  … y ${warnings.length - 10} avisos más.`)

if (problems.length) {
  console.error(`\n${problems.length} problemas:`)
  for (const problem of problems.slice(0, 25)) console.error(`  ✗ ${problem}`)
  if (problems.length > 25) console.error(`  … y ${problems.length - 25} más.`)
  process.exit(1)
}

console.log('Validación correcta.')
