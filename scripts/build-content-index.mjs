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

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectDir = path.resolve(scriptDir, '..')
const publicDir = path.join(projectDir, 'public')
const generatedDir = path.join(publicDir, 'generated')

const IGNORED = new Set(['node_modules', 'dist', 'public', '.git', '.obsidian', '.vscode', '36_PORTAL_WEB_FORMACION'])

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
  for (const name of (await fs.readdir(dir)).filter((file) => file.endsWith('.json'))) {
    try {
      out.push(JSON.parse(await fs.readFile(path.join(dir, name), 'utf8')))
    } catch (error) {
      console.warn(`  aviso: ${folder}/${name} no es JSON válido (${error.message}). Se ignora.`)
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

const lessons = []
const usedSlugs = new Set()

for (const absolute of markdownFiles) {
  const relativePath = toPosix(path.relative(vaultDir, absolute))
  const raw = await fs.readFile(absolute, 'utf8')
  const signal = extract(raw, relativePath)

  // Documentos vacíos o casi vacíos no llegan a ser lección.
  if (signal.words < 60) continue

  // Los archivos que solo sirven para navegar por el material no se enseñan.
  if (isMetaDocument(signal.title, relativePath)) continue

  // Secciones clasificadas y los tres casos, para el simulador.
  signal.analysis = analyzeSections(signal.sections)

  const extractedTitle = signal.title
    .replace(/^Desarrollo completo\s*[-–—]\s*/i, '')
    .replace(/^Documentaci[oó]n\s*[-–—]\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
  const title = titleOverrides.get(relativePath) || extractedTitle

  const stageId = stageFor(relativePath, title)
  const kind = kindFor(relativePath, title)
  const { levels, tools } = buildLevels(signal, stageId)

  // Cuánto contenido REAL tiene, ya sin la plantilla repetida. Es lo que decide
  // si esto es una lección de verdad o una ficha de consulta.
  const realWords = levels.intermedio.blocks
    .filter((block) => block.kind === 'seccion')
    .reduce((sum, block) => sum + (block.parts || []).reduce(
      (acc, part) => acc + `${part.text || ''} ${(part.items || []).join(' ')}`.split(/\s+/).filter(Boolean).length, 0), 0)
  const assetSources = assetSourcesFor(relativePath)
  // Un archivo ejecutable o importable necesita una lección completa aunque
  // su documentación sea breve. La longitud del texto no puede ocultar la práctica.
  const format = realWords < 400 && assetSources.length === 0 ? 'ficha' : 'leccion'

  // Una ficha es consulta rápida: se queda con su contenido propio y nada más.
  // Sin instaladores, sin recetas y sin el andamiaje de una lección larga.
  if (format === 'ficha') {
    const CONSULTA = new Set(['idea', 'seccion', 'tabla', 'herramientas', 'receta', 'codigo', 'comandos', 'instalar'])
    const compacto = levels.intermedio.blocks
      .filter((block) => CONSULTA.has(block.kind))
      // Los títulos genéricos de lección no pintan nada en una ficha.
      .filter((block) => !/^(?:lo que vas a construir|referencia de la lecci[oó]n|herramientas de esta pr[aá]ctica)$/i.test(block.title))
      .map((block) => (block.kind === 'herramientas' ? { ...block, title: 'Herramientas' } : block))
    for (const level of LEVELS) {
      levels[level] = {
        ...levels[level],
        headline: `${title}, en una pantalla`,
        hook: 'Ficha de consulta: lo esencial de este tema, para mirarlo cuando lo necesites.',
        blocks: compacto,
        objectives: [],
        pitfalls: [],
        minutes: Math.max(3, Math.round(realWords / 190)),
      }
    }
  }

  let slug = slugify(title)
  if (usedSlugs.has(slug)) {
    const folder = slugify(relativePath.split('/')[0])
    slug = usedSlugs.has(`${folder}-${slug}`) ? `${slug}-${usedSlugs.size}` : `${folder}-${slug}`
  }
  usedSlugs.add(slug)

  const assets = []
  for (const sourcePath of assetSources) {
    const absoluteAsset = fileByRelative.get(sourcePath)
    if (!absoluteAsset) continue
    const stat = await fs.stat(absoluteAsset)
    if (stat.size > 120000) continue
    const code = await fs.readFile(absoluteAsset, 'utf8')
    const fileName = `${slug}-${path.basename(sourcePath)}`
    const generatedAssetPath = path.join(generatedDir, 'assets', fileName)
    await fs.mkdir(path.dirname(generatedAssetPath), { recursive: true })
    await fs.writeFile(generatedAssetPath, code, 'utf8')
    assets.push({
      kind: assetKind(sourcePath),
      name: path.basename(sourcePath),
      language: assetLanguage(sourcePath),
      sourcePath,
      downloadPath: `/generated/assets/${fileName}`,
      code,
    })
  }

  const workflowFile = path.basename(relativePath).replace(/\.md$/i, '.json')
  const relatedWorkflow = assets.find((asset) => asset.kind === 'workflow')
  const interactive = buildInteractive({
    signal,
    stageId,
    workflow: workflowJson.get(workflowFile) || (relatedWorkflow ? workflowJson.get(relatedWorkflow.name) : undefined),
    workflowFile: relatedWorkflow?.name || workflowFile,
    slug,
  })

  lessons.push({
    id: slug,
    slug,
    title,
    stageId,
    kind,
    kindLabel: KINDS[kind].label,
    folder: relativePath.split('/')[0],
    folderLabel: folderLabel(relativePath.split('/')[0]),
    sourcePath: relativePath,
    sourceWords: signal.words,
    realWords,
    format,
    categoryKey: categoryKeyFor(relativePath),
    sectionId: sectionFor(relativePath),
    tools,
    tags: Array.isArray(signal.front.tags) ? signal.front.tags.slice(0, 6) : [],
    search: `${title} ${signal.keyTerms.join(' ')} ${signal.intro}`.slice(0, 900).toLowerCase(),
    levels,
    interactive,
    assets,
    relatedTitles: signal.links,
    // Alimenta el indice A-Z: definiciones con significado y terminos destacados.
    indexTerms: [
      ...signal.definitions.filter((item) => item.meaning.length > 30).slice(0, 12),
      ...signal.keyTerms.map((term) => ({ term, meaning: '' })),
    ],
    authored: false,
  })
}

/* --- Contenido escrito a mano, que pisa al generado ---------------- */

const authoredDir = path.join(projectDir, 'content', 'authored')
let authoredCount = 0
if (await exists(authoredDir)) {
  for (const name of (await fs.readdir(authoredDir)).filter((file) => file.endsWith('.json'))) {
    const override = JSON.parse(await fs.readFile(path.join(authoredDir, name), 'utf8'))
    const target = lessons.find(
      (lesson) => lesson.sourcePath === override.sourcePath || lesson.slug === override.slug,
    )
    if (!target) {
      console.warn(`  aviso: ${name} no encaja con ninguna lección (${override.sourcePath || override.slug}).`)
      continue
    }
    for (const level of LEVELS) {
      if (override.levels?.[level]) target.levels[level] = { ...target.levels[level], ...override.levels[level] }
    }
    if (override.interactive) target.interactive = override.interactive
    if (override.title) target.title = override.title
    target.authored = true
    authoredCount += 1
  }
}

/* --- Relaciones entre lecciones ------------------------------------ */

const byTitle = new Map(lessons.map((lesson) => [lesson.title.toLowerCase(), lesson.slug]))
for (const lesson of lessons) {
  lesson.related = (lesson.relatedTitles || [])
    .map((title) => byTitle.get(title.toLowerCase()))
    .filter((slug) => slug && slug !== lesson.slug)
    .slice(0, 5)
  delete lesson.relatedTitles
}

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

/* --- Preguntas escritas a mano por categoria ----------------------- */

const quizDir = path.join(projectDir, 'content', 'quiz')
let categoryQuizCount = 0
if (await exists(quizDir)) {
  const byCategory = new Map()
  for (const name of (await fs.readdir(quizDir)).filter((file) => file.endsWith('.json'))) {
    const pack = JSON.parse(await fs.readFile(path.join(quizDir, name), 'utf8'))
    const id = pack.categoryId || name.replace(/\.json$/, '')
    if (!categories.some((category) => category.id === id)) {
      console.warn(`  aviso: ${name} no encaja con ninguna categoria (${id}).`)
      continue
    }
    byCategory.set(id, pack)
  }

  // Los quiz quedan fuera del curso: el alumno avanza haciendo tareas.
  // Los archivos se conservan en content/quiz por si vuelven a hacer falta.
  categoryQuizCount = 0
  console.log(`  Preguntas por categoria: ${byCategory.size} archivos en reserva (no se muestran).`)
}

/* --- Fuera el relleno que se repite -------------------------------- */

/**
 * Hay texto en la boveda que se copio igual en decenas de archivos cambiando
 * solo el titulo: capas metodologicas, apartados de "para que sirve" y
 * listas de requisitos identicas. Al alumno le llegan como si fueran
 * contenido de esa leccion, y no lo son: son plantilla.
 *
 * Aqui no se toca ningun archivo. Se detecta que un bloque aparece con el
 * MISMO texto en demasiadas lecciones y se deja de mostrar. Solo se mira lo
 * que viene de los .md; lo que generan las guias de herramienta se repite a
 * proposito, porque es la misma guia enseñada en cada leccion de esa
 * herramienta.
 */
const REPETICIONES_ADMITIDAS = 12

function huellaDeBloque(bloque) {
  const cuerpo = { ...bloque }
  delete cuerpo.title
  return `${bloque.title || ''}::${JSON.stringify(cuerpo)}`
}

const vecesQueApareceCadaBloque = new Map()
for (const lesson of lessons) {
  const vistosEnEstaLeccion = new Set()
  for (const level of LEVELS) {
    for (const bloque of lesson.levels[level].blocks || []) {
      if (bloque.from !== 'vault') continue
      const huella = huellaDeBloque(bloque)
      // Cuenta una vez por leccion, no una por nivel.
      if (vistosEnEstaLeccion.has(huella)) continue
      vistosEnEstaLeccion.add(huella)
      vecesQueApareceCadaBloque.set(huella, (vecesQueApareceCadaBloque.get(huella) || 0) + 1)
    }
  }
}

let bloquesDeRellenoFuera = 0
const rellenoDistinto = new Set()
for (const lesson of lessons) {
  for (const level of LEVELS) {
    const antes = lesson.levels[level].blocks || []
    const despues = antes.filter((bloque) => {
      if (bloque.from !== 'vault') return true
      const huella = huellaDeBloque(bloque)
      const veces = vecesQueApareceCadaBloque.get(huella) || 0
      if (veces <= REPETICIONES_ADMITIDAS) return true
      rellenoDistinto.add(huella)
      return false
    })
    // Nunca se deja una leccion en blanco: si TODO lo que tenia era relleno,
    // se conserva el primer bloque para que siga diciendo algo. Esa leccion
    // no esta bien, pero una pagina vacia esta peor.
    const finales = despues.length || !antes.length ? despues : antes.slice(0, 1)
    bloquesDeRellenoFuera += antes.length - finales.length
    lesson.levels[level].blocks = finales
  }
}
console.log(
  `  Relleno retirado de las lecciones: ${bloquesDeRellenoFuera} bloques ` +
    `(${rellenoDistinto.size} textos distintos repetidos en mas de ${REPETICIONES_ADMITIDAS} lecciones).`,
)

/* --- Indice alfabetico de conceptos -------------------------------- */

// El glosario escrito a mano (content/glosario/) sustituye por completo al
// automático: el automático recogía nombres de archivo sin definición.
const glosarioManual = (await loadContent('glosario'))[0]
// Cada termino del glosario enlaza con las lecciones donde de verdad sale.
const sinTildes = (valor) =>
  valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function leccionesDelTermino(termino) {
  // "Chunk (trozo)" busca por "chunk": lo de los parentesis es la traduccion.
  const aguja = sinTildes(termino.split(' (')[0]).trim()
  if (aguja.length < 3) return []
  const patron = new RegExp(`(^|[^a-z0-9])${aguja.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`)
  const marcadas = []
  for (const leccion of lessons) {
    const enTitulo = patron.test(sinTildes(leccion.title))
    const enCuerpo = patron.test(sinTildes(leccion.search || ''))
    if (enTitulo || enCuerpo) marcadas.push({ leccion, peso: enTitulo ? 0 : 1 })
  }
  return marcadas
    .sort((a, b) => a.peso - b.peso || a.leccion.title.localeCompare(b.leccion.title, 'es'))
    .slice(0, 4)
    .map(({ leccion }) => ({ slug: leccion.slug, title: leccion.title }))
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

const toolPages = TOOLS
  .map((tool) => {
    const inTool = lessons.filter((lesson) => lesson.tools.includes(tool.id))
    const guide = completeToolGuide(toolGuideFor(tool.id), tool)
    return {
      id: tool.id,
      label: tool.label,
      icon: tool.icon,
      count: inTool.length,
      // Las lecciones del itinerario escrito a mano cuentan aparte.
      itinerary: cursoFiles
        .filter((leccion) => leccion.tool === tool.id)
        .sort((a, b) => (a.slot || 0) - (b.slot || 0))
        .map((leccion) => ({ id: leccion.id, slot: leccion.slot, title: leccion.title, minutes: leccion.minutes })),
      lessonSlugs: inTool.map((lesson) => lesson.slug),
      stageIds: [...new Set(inTool.map((lesson) => lesson.stageId))],
      guide,
    }
  })
  // Una herramienta tiene página si el material la menciona, si tiene guía
  // escrita, o si tiene itinerario propio de lecciones en content/lecciones.
  .filter((tool) => tool.count > 0 || tool.guide || conItinerario.has(tool.id))
  .sort((a, b) => b.count - a.count)

const promptLibrary = buildInstitutionalPromptLibrary(promptFiles, toolPages, cursoFiles)
for (const family of promptLibrary) enrichPrompts(family.prompts, family.title)

/* --- Biblioteca: carpetas del vault -------------------------------- */

const folders = [...new Set(lessons.map((lesson) => lesson.folder))]
  .sort((a, b) => a.localeCompare(b, 'es'))
  .map((folder) => ({
    id: slugify(folder),
    folder,
    label: folderLabel(folder),
    count: lessons.filter((lesson) => lesson.folder === folder).length,
    lessonSlugs: lessons.filter((lesson) => lesson.folder === folder).map((lesson) => lesson.slug),
  }))

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
  kinds: KINDS,
  sections: SECTIONS.map(({ id, label, hint }) => ({ id, label, hint })),
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
  stages,
  categories,
  projects: areaProjects,
  decks: deckFiles,
  prompts: promptLibrary,
  guides: guideFiles,
  curso: cursoFiles.sort((a, b) => (a.number || 0) - (b.number || 0)),
  toolPages,
  glossaryIndex,
  folders,
  lessons,
}

await fs.writeFile(path.join(publicDir, 'course.json'), JSON.stringify(course), 'utf8')

console.log(
  `Curso generado: ${lessons.length} lecciones x 3 niveles en ${categories.length} categorias.
` +
    `  ${course.stats.blocks} bloques de contenido, ${course.stats.quizQuestions} preguntas, ` +
    `${course.stats.interactivePieces} piezas interactivas, ${glossaryIndex.length} terminos indexados.`,
)
for (const stage of stages) {
  console.log(
    `  ${stage.number} ${stage.title.padEnd(40)} ${String(stage.categoryIds.length).padStart(3)} categorias  ` +
      `${String(stage.lessonSlugs.length).padStart(3)} lecciones`,
  )
}
