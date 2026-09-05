/**
 * Generador del curso.
 *
 * Lee el vault de Obsidian, extrae la señal de cada documento y produce
 * public/course.json: la Ruta, la Biblioteca y cada lección en tres niveles
 * con sus piezas interactivas.
 *
 * El vault NO se modifica nunca. Este script solo lee.
 *
 * Ruta del vault, por orden de prioridad:
 *   1. variable de entorno VAULT_DIR
 *   2. course.config.json en la raíz del proyecto  { "vaultDir": "…" }
 *   3. rutas candidatas conocidas
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { STAGES, stageFor, KINDS, TOOLS } from './lib/taxonomy.mjs'
import { extract } from './lib/extract.mjs'
import { analyzeSections, isMetaDocument } from './lib/sections.mjs'
import { completeToolGuide, registerGuides, toolGuideFor } from './lib/toolguides.mjs'
import { registerRecipes } from './lib/recipes.mjs'
import { buildLevels, LEVELS, LEVEL_META } from './lib/levels.mjs'
import { buildInteractive } from './lib/interactive.mjs'
import { buildCategories, buildGlossaryIndex, categoryKeyFor, sectionFor, SECTIONS } from './lib/categories.mjs'
import { buildInstitutionalPromptLibrary } from './lib/institutional-prompts.mjs'
import { STAGE_EN, KIND_EN, SECTION_EN, translateFolderLabel } from './lib/i18n-taxonomy.mjs'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectDir = path.resolve(scriptDir, '..')
const publicDir = path.join(projectDir, 'public')
const generatedDir = path.join(publicDir, 'generated')

/*
 * Idioma de este build. 'es' (por defecto) escribe public/course.json desde
 * el contenido original. 'en' escribe public/course.en.json: usa el archivo
 * <nombre>.en.json cuando existe junto al original, y si no existe se queda
 * con el español antes que dejar un hueco vacío en la app.
 */
const LOCALE = process.env.LOCALE === 'en' || process.argv.includes('--locale=en') ? 'en' : 'es'
const outputFile = LOCALE === 'en' ? 'course.en.json' : 'course.json'

/*
 * Carpetas que no forman parte del curso: infraestructura, documentación
 * interna del proyecto (backlog, auditorías, planes de QA) y `content/`,
 * que se carga de forma explícita con loadContent(). Lo que está aquí no
 * llega nunca al alumno como lección.
 */
const IGNORED = new Set([
  'node_modules', 'dist', 'public', '.git', '.obsidian', '.vscode', '.claude',
  '36_PORTAL_WEB_FORMACION', '99_PENDIENTE_Y_MEJORAS', '23_AUDITORIA_PROFESIONAL',
  'content', 'scripts', 'src',
])

async function exists(target) {
  try { await fs.access(target); return true } catch { return false }
}

async function resolveVaultDir() {
  if (process.env.VAULT_DIR) {
    const dir = path.resolve(process.env.VAULT_DIR)
    if (await exists(dir)) return dir
    throw new Error(`VAULT_DIR apunta a una carpeta que no existe: ${dir}`)
  }

  const configPath = path.join(projectDir, 'course.config.json')
  if (await exists(configPath)) {
    const config = JSON.parse(await fs.readFile(configPath, 'utf8'))
    if (config.vaultDir) {
      const dir = path.resolve(projectDir, config.vaultDir)
      if (await exists(dir)) return dir
      throw new Error(`course.config.json apunta a una carpeta que no existe: ${dir}`)
    }
  }

  const candidates = [
    path.resolve(projectDir, '..', 'Formacion', 'Formacion'),
    path.resolve(projectDir, '..', 'Formacion'),
    path.resolve(projectDir, '..'),
  ]
  for (const candidate of candidates) {
    if (await exists(path.join(candidate, '00_EMPIEZA_AQUI'))) return candidate
  }

  throw new Error(
    'No encuentro el vault de Obsidian.\n' +
      'Crea course.config.json en la raíz del proyecto con:\n' +
      '  { "vaultDir": "../Formacion/Formacion" }\n' +
      'o define la variable de entorno VAULT_DIR.',
  )
}

async function walk(directory, output = []) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    if (IGNORED.has(entry.name)) continue
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) await walk(absolute, output)
    else output.push(absolute)
  }
  return output
}

const toPosix = (value) => value.split(path.sep).join('/')

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'leccion'
}

/** Nombre legible de una carpeta del vault. */
function folderLabel(name) {
  return name
    .replace(/^\d+_?/, '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase())
    .trim()
}

/**
 * Tipo de lección. El orden importa: las señales más específicas primero.
 * Lo que sea índice, resumen o listado de fuentes se marca como referencia
 * para que no abra una etapa por delante del material que sí enseña.
 */
function kindFor(relativePath, title) {
  if (/workflows_n8n_40/.test(relativePath)) return 'workflow'
  if (/skills_40|skills\//i.test(relativePath)) return 'skill'
  if (/^(?:fuentes|readme|resumen|[ií]ndice|mapa|documento maestro|changelog|decisiones|inicio|qu[eé] es cada|estructura)/i.test(title)) return 'referencia'
  if (/diccionario|glosario|plantilla|matriz|r[uú]brica|checklist|solucionario|importables/i.test(title)) return 'referencia'
  if (/proyecto|capstone|caso[_ ]/i.test(title)) return 'proyecto'
  if (/gu[ií]a|setup|instal|configur/i.test(title)) return 'guia'
  if (/laboratorio|sesi[oó]n|clase|lecci[oó]n|pr[aá]ctica|ejercicio|evaluaci[oó]n|examen/i.test(title)) return 'practica'
  return 'concepto'
}

/* ------------------------------------------------------------------ */

const vaultDir = await resolveVaultDir()
console.log(`Vault: ${vaultDir}`)


/* --- Contenido escrito por fuera del código ------------------------ */

/**
 * Carga todos los .json de una carpeta de `content/`. Es el mecanismo con el
 * que se amplía el curso sin tocar el generador: guías de herramienta, recetas
 * de código, proyectos de área y presentaciones.
 */
async function loadContent(folder) {
  const dir = path.join(projectDir, 'content', folder)
  if (!(await exists(dir))) return []
  const out = []
  const names = (await fs.readdir(dir)).filter((file) => file.endsWith('.json') && !file.endsWith('.en.json'))
  for (const name of names) {
    // En build en inglés, si existe "nombre.en.json" se usa esa traducción;
    // si no existe todavía, se sirve el español antes que dejar un hueco.
    const target = LOCALE === 'en' && (await exists(path.join(dir, name.replace(/\.json$/, '.en.json'))))
      ? name.replace(/\.json$/, '.en.json')
      : name
    try {
      out.push(JSON.parse(await fs.readFile(path.join(dir, target), 'utf8')))
    } catch (error) {
      console.warn(`  aviso: ${folder}/${target} no es JSON válido (${error.message}). Se ignora.`)
    }
  }
  return out
}

const extraGuides = await loadContent('toolguides')
const extraRecipes = await loadContent('recipes')
const areaProjects = await loadContent('projects')
const deckFiles = await loadContent('decks')
const promptFiles = await loadContent('prompts')
const guideFiles = await loadContent('guias')
const cursoFiles = await loadContent('lecciones')
const kitFiles = await loadContent('kits')
const agentFiles = await loadContent('agentes')
const faqFiles = await loadContent('preguntas')

// Las guías fundamentales siguen un orden pedagógico, no el del sistema de archivos.
guideFiles.sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || String(a.title).localeCompare(String(b.title), 'es'))
agentFiles.sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || String(a.title).localeCompare(String(b.title), 'es'))

/* El orden de las preguntas sigue el recorrido del alumno, no el alfabetico
 * del sistema de archivos: primero lo que se pregunta antes de empezar. */
const ORDEN_FAQ = ['antes', 'primeros-pasos', 'publicar', 'automatizar', 'dinero-legal']
for (const grupo of faqFiles) {
  const puesto = ORDEN_FAQ.indexOf(grupo.id)
  grupo.orden = puesto === -1 ? ORDEN_FAQ.length : puesto
}
faqFiles.sort((a, b) => a.orden - b.orden)

registerGuides(extraGuides)
registerRecipes(extraRecipes)

/* Los prompts son piezas de trabajo, no eslóganes. Si uno es demasiado corto,
 * se completa con el protocolo profesional que evita adivinar, gastar dinero
 * o poner datos reales en una prueba. La ampliación se hace en build para que
 * las fuentes editoriales sigan siendo legibles y fáciles de revisar. */
const promptWords = (value) => String(value || '').trim().split(/\s+/).filter(Boolean).length
const qualitySections = (context) => [
  `\n\n## Antes de empezar\nTrabaja con este contexto: ${context}. No rellenes huecos con imaginación. Si falta un dato que cambie la decisión, hazme una pregunta concreta y espera la respuesta. Si hay varias interpretaciones posibles, enuméralas y dime qué dato separa una de otra. Distingue siempre entre lo que te he contado, lo que estás deduciendo y lo que todavía hay que comprobar. No uses una palabra técnica sin traducirla primero.`,
  `\n\n## Criterio de calidad\nNo me entregues una respuesta que solo suene bien. Convierte cada recomendación en una acción que pueda realizar, una salida que pueda observar y una condición que me permita decir si ha funcionado. Señala qué queda fuera de esta versión. Si recomiendas una herramienta, explica por qué encaja con la entrada, la salida, el volumen, el presupuesto y la persona que tendrá que mantenerla. Compara al menos una alternativa más sencilla y la opción de no automatizar todavía.`,
  `\n\n## Prueba antes de usarlo\nDiseña una prueba con datos ficticios y cuatro casos: uno normal, uno incompleto, uno duplicado y uno extremo. Explica qué debería aparecer después de cada paso y en qué pantalla o registro lo compruebo. Si algo falla, dime cómo distinguir si el problema está en la entrada, en la instrucción, en un permiso, en un límite o en la herramienta de destino. No me digas que vuelva a intentarlo sin explicar qué variable debo cambiar.`,
  `\n\n## Seguridad y coste\nMarca con claridad cada acción irreversible: enviar un mensaje, publicar, borrar, cobrar, compartir datos o consumir crédito. Propón una forma de probarla sin afectar a nadie y un punto en el que una persona tenga que aprobarla. Explica cómo se mide el consumo de tokens, créditos, tareas, ejecuciones o almacenamiento, qué dato debo anotar antes y después y cómo calculo el coste mensual. Si el precio o una función puede haber cambiado, escribe COMPROBAR EN LA WEB OFICIAL en vez de inventar una cifra.`,
  `\n\n## Entrega y continuidad\nTermina con una ficha breve que otra persona pueda entender sin haber visto esta conversación: objetivo, entradas, salida, pasos, herramientas, permisos, casos que no cubre, prueba realizada, resultado, coste aproximado y cómo detenerlo. Añade qué archivo, captura, enlace o registro debo guardar como evidencia. Incluye una siguiente acción pequeña que pueda completar en menos de treinta minutos y una señal clara de que ya es momento de pasar al siguiente paso.`,
]

function enrichPrompts(items, context) {
  for (const item of items || []) {
    if (!item?.prompt || promptWords(item.prompt) >= 520) continue
    for (const section of qualitySections(`${context} · ${item.name || 'este encargo'}`)) {
      if (promptWords(item.prompt) >= 520) break
      item.prompt += section
    }
  }
}

for (const family of promptFiles) enrichPrompts(family.prompts, family.title)

/*
 * Los kits institucionales viven en content/kits/*.json, un archivo por kit,
 * escritos a mano y completos. Aqui solo se ordenan: no se genera ni se clona
 * ningun kit en build. Si falta contenido, se nota en la pagina y se escribe
 * en su archivo, no aqui.
 */
const institutionalKits = [...kitFiles].sort((a, b) => (a.order || 0) - (b.order || 0))

// Se regenera todo desde cero: sin esto, los archivos de lecciones o
// workflows retirados se quedarían huérfanos en public/generated.
await fs.rm(generatedDir, { recursive: true, force: true })
await fs.mkdir(generatedDir, { recursive: true })
const allFiles = await walk(vaultDir)
const markdownFiles = allFiles.filter((file) => file.toLowerCase().endsWith('.md'))
const fileByRelative = new Map(allFiles.map((file) => [toPosix(path.relative(vaultDir, file)), file]))

if (!markdownFiles.length) {
  throw new Error(`No hay archivos .md en ${vaultDir}. ¿Es la carpeta correcta?`)
}

// Workflows de n8n: se leen para construir los diagramas reales.
const workflowJson = new Map()
for (const file of allFiles) {
  if (!file.toLowerCase().endsWith('.json')) continue
  if (!/workflows_n8n_40|workflows_n8n_importables|workflows[\\/]/.test(file)) continue
  try {
    workflowJson.set(path.basename(file), JSON.parse(await fs.readFile(file, 'utf8')))
  } catch {
    console.warn(`  aviso: ${path.basename(file)} no es JSON válido, se ignora en los diagramas.`)
  }
}

const ASSET_EXTENSIONS = new Set(['.py', '.js', '.mjs', '.ts', '.tsx', '.sh', '.sql', '.json'])
const assetLanguage = (relativePath) => {
  const extension = path.extname(relativePath).toLowerCase()
  return ({ '.py': 'python', '.js': 'javascript', '.mjs': 'javascript', '.ts': 'typescript', '.tsx': 'tsx', '.sh': 'bash', '.sql': 'sql', '.json': 'json' })[extension] || 'text'
}
const assetKind = (relativePath) => /workflows_n8n_40|workflows_n8n_importables|workflows[\\/]/i.test(relativePath) && path.extname(relativePath).toLowerCase() === '.json' ? 'workflow' : 'code'
const assetStem = (relativePath) => path.basename(relativePath)
  .replace(/\.md$/i, '')
  .replace(/\.(py|js|mjs|ts|tsx|sh|sql|json)$/i, '')
  .replace(/^\d+[_-]/, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '_')
const assetSourcesFor = (relativePath) => {
  const sources = new Set()
  const base = path.basename(relativePath).replace(/\.md$/i, '')
  const parent = path.dirname(relativePath)
  if (parent.endsWith('/docs') || parent.endsWith('\\docs')) {
    const sibling = toPosix(path.join(parent.replace(/[\\/]docs$/, ''), base))
    if (fileByRelative.has(sibling)) sources.add(sibling)
  }
  const stem = assetStem(relativePath)
  for (const candidate of fileByRelative.keys()) {
    const extension = path.extname(candidate).toLowerCase()
    if (!ASSET_EXTENSIONS.has(extension) || assetStem(candidate) !== stem) continue
    if (/node_modules|\.git|36_PORTAL_WEB_FORMACION/i.test(candidate)) continue
    sources.add(candidate)
  }
  return [...sources]
}

const titleOverrides = new Map([
  ['35_AUTOMATIZACIONES_SKILLS_BIBLIOTECA/automatizaciones_codigo_40/docs/02_email_summarizer.py.md', 'Email summarizer: resumen y acciones desde Python'],
])

/**
 * El vault dejó de ser fuente de lecciones.
 *
 * Durante mucho tiempo, cada .md de las carpetas numeradas se convertía en una
 * lección de tres niveles. Salían 432, y no eran lecciones: eran índices de
 * módulo, plantillas, rúbricas, bibliografías y notas escritas para quien
 * imparte, con el nombre de la carpeta por título. El propio generador tenía
 * que retirar después casi 3.000 bloques de texto repetido para que no se
 * notara tanto, y aun así el alumno abría «la guía de Claude Code» y leía
 * «Anthropic, Claude, Claude Code, prompt engineering, skills, hooks y
 * subagents» como encabezado.
 *
 * Ahora el curso del alumno son las lecciones escritas a mano de
 * `content/lecciones/`, las guías, los kits, las herramientas, los prompts y
 * los agentes. Los archivos del vault siguen en el repositorio como material
 * de origen para escribir lecciones nuevas, pero no se publican como tales.
 */
const lessons = []
const authoredCount = 0

/* --- Ruta: etapas ordenadas ---------------------------------------- */

const KIND_ORDER = { concepto: 0, guia: 1, practica: 2, workflow: 3, skill: 4, proyecto: 5, referencia: 6 }

const baseStages = STAGES.map((stage) => {
  const inStage = lessons
    .filter((lesson) => lesson.stageId === stage.id)
    .sort((a, b) =>
      (KIND_ORDER[a.kind] - KIND_ORDER[b.kind]) ||
      (b.sourceWords - a.sourceWords) ||
      a.title.localeCompare(b.title, 'es'),
    )
  return {
    ...stage,
    lessonSlugs: inStage.map((lesson) => lesson.slug),
    // Las esenciales abren la etapa; el resto queda como ampliacion.
    coreSlugs: inStage.filter((lesson) => lesson.kind !== 'referencia').slice(0, 8).map((lesson) => lesson.slug),
    minutes: inStage.reduce((sum, lesson) => sum + lesson.levels.intermedio.minutes, 0),
  }
})

/* --- Categorias: el nivel intermedio del arbol --------------------- */

const { categories, stages } = buildCategories(lessons, baseStages)

const categoryQuizCount = 0

/* --- Indice alfabetico de conceptos -------------------------------- */

// El glosario escrito a mano (content/glosario/) sustituye por completo al
// automático: el automático recogía nombres de archivo sin definición.
const glosarioManual = (await loadContent('glosario'))[0]
// Cada termino del glosario enlaza con las lecciones donde de verdad sale.
const sinTildes = (valor) =>
  valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

/**
 * Cada termino enlaza con las lecciones del programa donde de verdad sale.
 * Se busca en el titulo, en la promesa, en la teoria y en el vocabulario de
 * cada leccion escrita a mano, que es lo unico que ve el alumno.
 */
const textoDeLeccion = (leccion) => sinTildes([
  leccion.title,
  leccion.promise || '',
  ...(leccion.theory || []).map((bloque) => `${bloque.title} ${bloque.text}`),
  ...(leccion.words || []).map(([palabra, sentido]) => `${palabra} ${sentido}`),
].join(' '))

function leccionesDelTermino(termino) {
  // "Chunk (trozo)" busca por "chunk": lo de los parentesis es la traduccion.
  const aguja = sinTildes(termino.split(' (')[0]).trim()
  if (aguja.length < 3) return []
  const patron = new RegExp(`(^|[^a-z0-9])${aguja.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`)
  const marcadas = []
  for (const leccion of cursoFiles) {
    const enTitulo = patron.test(sinTildes(leccion.title))
    // El vocabulario de la leccion pesa mas que una mencion de pasada.
    const enVocabulario = (leccion.words || []).some(([palabra]) => patron.test(sinTildes(palabra)))
    const enCuerpo = patron.test(textoDeLeccion(leccion))
    if (enTitulo || enVocabulario || enCuerpo) {
      marcadas.push({ leccion, peso: enTitulo ? 0 : enVocabulario ? 1 : 2 })
    }
  }
  return marcadas
    .sort((a, b) => a.peso - b.peso || (a.leccion.number || 0) - (b.leccion.number || 0))
    .slice(0, 4)
    .map(({ leccion }) => ({ id: leccion.id, title: leccion.title }))
}

const glossaryIndex = glosarioManual?.terms?.length
  ? glosarioManual.terms.map((entry) => ({
      term: entry.term,
      letter: entry.letter || entry.term[0].toUpperCase(),
      meaning: entry.short,
      long: entry.long,
      analogy: entry.analogy || null,
      confusion: entry.confusion || null,
      seeAlso: entry.seeAlso || [],
      lessons: leccionesDelTermino(entry.term),
    }))
  : buildGlossaryIndex(
      lessons.map((lesson) => ({ slug: lesson.slug, title: lesson.title, terms: lesson.indexTerms || [] })),
    )
for (const lesson of lessons) delete lesson.indexTerms

/* --- Paginas por herramienta --------------------------------------- */

const conItinerario = new Set(cursoFiles.map((leccion) => leccion.tool).filter(Boolean))
const MAX_TOOL_LESSONS = 25

function toolLessonScore(lesson) {
  let score = 0
  if (lesson.authored) score += 1000
  if (lesson.format === 'leccion') score += 260
  if (lesson.kind === 'workflow') score += 220
  if (lesson.assets?.some((asset) => asset.kind === 'workflow')) score += 180
  if (lesson.interactive?.some((piece) => piece.kind === 'flow' || piece.kind === 'canvas')) score += 120
  if (/automatizaci[oó]n|workflow|n8n|webhook|agente|deploy|datos/i.test(`${lesson.title} ${lesson.search}`)) score += 70
  score += Math.min(lesson.realWords || 0, 2000) / 10
  return score
}

const toolPages = TOOLS
  .map((tool) => {
    const inTool = lessons.filter((lesson) => lesson.tools.includes(tool.id))
    const selectedLessons = [...inTool]
      .sort((a, b) =>
        toolLessonScore(b) - toolLessonScore(a) ||
        (b.sourceWords - a.sourceWords) ||
        a.title.localeCompare(b.title, 'es'),
      )
      .slice(0, MAX_TOOL_LESSONS)
    const guide = completeToolGuide(toolGuideFor(tool.id), tool)
    return {
      id: tool.id,
      label: tool.label,
      icon: tool.icon,
      count: selectedLessons.length,
      totalCount: inTool.length,
      maxLessons: MAX_TOOL_LESSONS,
      // Las lecciones del itinerario escrito a mano cuentan aparte.
      itinerary: cursoFiles
        .filter((leccion) => leccion.tool === tool.id)
        .sort((a, b) => (a.slot || 0) - (b.slot || 0))
        .map((leccion) => ({ id: leccion.id, slot: leccion.slot, title: leccion.title, minutes: leccion.minutes })),
      lessonSlugs: selectedLessons.map((lesson) => lesson.slug),
      stageIds: [...new Set(selectedLessons.map((lesson) => lesson.stageId))],
      guide,
    }
  })
  // Una herramienta tiene página si el material la menciona, si tiene guía
  // escrita, o si tiene itinerario propio de lecciones en content/lecciones.
  .filter((tool) => tool.count > 0 || tool.guide || conItinerario.has(tool.id))
  .sort((a, b) => b.count - a.count)

const promptLibrary = buildInstitutionalPromptLibrary(promptFiles, toolPages, cursoFiles, institutionalKits, LOCALE)
for (const family of promptLibrary) enrichPrompts(family.prompts, family.title)

/* --- Biblioteca: carpetas del vault -------------------------------- */

const folders = [...new Set(lessons.map((lesson) => lesson.folder))]
  .sort((a, b) => a.localeCompare(b, 'es'))
  .map((folder) => ({
    id: slugify(folder),
    folder,
    label: LOCALE === 'en' ? translateFolderLabel(folderLabel(folder)) : folderLabel(folder),
    count: lessons.filter((lesson) => lesson.folder === folder).length,
    lessonSlugs: lessons.filter((lesson) => lesson.folder === folder).map((lesson) => lesson.slug),
  }))

/* --- Traducción de la taxonomía fija (solo texto de código) --------- */

const localizedStages = LOCALE === 'en'
  ? stages.map((stage) => ({ ...stage, ...(STAGE_EN[stage.id] || {}) }))
  : stages
const localizedKinds = LOCALE === 'en'
  ? Object.fromEntries(Object.entries(KINDS).map(([id, value]) => [id, { ...value, ...(KIND_EN[id] || {}) }]))
  : KINDS
const localizedSections = SECTIONS.map(({ id, label, hint }) =>
  LOCALE === 'en' && SECTION_EN[id] ? { id, ...SECTION_EN[id] } : { id, label, hint },
)

/* --- Workflows importables ----------------------------------------- */

let copiedWorkflows = 0
const workflowTarget = path.join(generatedDir, 'workflows')
await fs.mkdir(workflowTarget, { recursive: true })
for (const file of allFiles) {
  if (!file.toLowerCase().endsWith('.json')) continue
  if (!/workflows_n8n_40|workflows_n8n_importables|workflows[\\/]/.test(file)) continue
  await fs.copyFile(file, path.join(workflowTarget, path.basename(file)))
  copiedWorkflows += 1
}

/* --- Escritura ------------------------------------------------------ */

const course = {
  generatedAt: new Date().toISOString(),
  vaultName: path.basename(vaultDir),
  levels: LEVELS.map((id) => ({ id, ...LEVEL_META[id] })),
  locale: LOCALE,
  kinds: localizedKinds,
  sections: localizedSections,
  tools: TOOLS.map(({ id, label, icon }) => ({ id, label, icon })),
  stats: {
    lessons: lessons.filter((lesson) => lesson.format === 'leccion').length,
    fichas: lessons.filter((lesson) => lesson.format === 'ficha').length,
    stages: stages.length,
    categories: categories.length,
    folders: folders.length,
    workflows: copiedWorkflows,
    authored: authoredCount,
    terms: glossaryIndex.length,
    projects: areaProjects.length,
    decks: deckFiles.length,
    kits: institutionalKits.length,
    agents: agentFiles.length,
    preguntas: faqFiles.reduce((suma, grupo) => suma + (grupo.preguntas?.length || 0), 0),
    sourceWords: lessons.reduce((sum, lesson) => sum + lesson.sourceWords, 0),
    quizQuestions: lessons.reduce(
      (sum, lesson) => sum + LEVELS.reduce((acc, level) => acc + lesson.levels[level].quiz.length, 0),
      0,
    ),
    blocks: lessons.reduce(
      (sum, lesson) => sum + LEVELS.reduce((acc, level) => acc + lesson.levels[level].blocks.length, 0),
      0,
    ),
    interactivePieces: lessons.reduce((sum, lesson) => sum + lesson.interactive.length, 0),
  },
  stages: localizedStages,
  categories,
  projects: areaProjects,
  decks: deckFiles,
  prompts: promptLibrary,
  guides: guideFiles,
  curso: cursoFiles.sort((a, b) => (a.number || 0) - (b.number || 0)),
  kits: institutionalKits,
  agents: agentFiles,
  preguntas: faqFiles,
  toolPages,
  glossaryIndex,
  folders,
  lessons,
}

await fs.writeFile(path.join(publicDir, outputFile), JSON.stringify(course), 'utf8')

const leccionesDelPrograma = cursoFiles.filter((leccion) => !leccion.tool)
const sinEnlace = glossaryIndex.filter((entrada) => !entrada.lessons.length).length

console.log(
  `Curso generado: ${leccionesDelPrograma.length} lecciones del programa ` +
    `y ${cursoFiles.length - leccionesDelPrograma.length} de itinerario por herramienta.`,
)
console.log(
  `  ${guideFiles.length} guias, ${institutionalKits.length} kits, ${toolPages.length} herramientas, ` +
    `${agentFiles.length} agentes, ${promptLibrary.reduce((suma, familia) => suma + familia.prompts.length, 0)} prompts.`,
)
console.log(
  `  ${glossaryIndex.length} terminos en el diccionario` +
    (sinEnlace ? `, ${sinEnlace} sin ninguna leccion que los explique.` : '.'),
)
for (const stage of stages) {
  const enEtapa = leccionesDelPrograma.filter((leccion) => leccion.stageId === stage.id)
  const minutos = enEtapa.reduce((suma, leccion) => suma + (leccion.minutes || 0), 0)
  console.log(
    `  ${stage.number} ${stage.title.padEnd(40)} ${String(enEtapa.length).padStart(2)} lecciones  ` +
      `${String(minutos).padStart(4)} min` + (enEtapa.length ? '' : '   <-- SIN LECCIONES'),
  )
}
