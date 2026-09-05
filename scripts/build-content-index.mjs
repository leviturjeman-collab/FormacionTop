/**
 * Generador del curso.
 *
 * Lee el contenido escrito a mano de `content/` (lecciones, guías, kits,
 * agentes, prompts, preguntas, glosario, proyectos y decks) y escribe
 * public/course.json, que es lo único que carga la aplicación.
 *
 * Aquí no se genera contenido: si algo tiene que salir en pantalla, alguien
 * lo ha escrito antes en `content/`. Este script lo ordena, lo enlaza y
 * cuenta lo que hay.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { STAGES, TOOLS } from './lib/taxonomy.mjs'
import { completeToolGuide, registerGuides, toolGuideFor } from './lib/toolguides.mjs'
import { buildInstitutionalPromptLibrary } from './lib/institutional-prompts.mjs'
import { STAGE_EN } from './lib/i18n-taxonomy.mjs'

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

async function exists(target) {
  try { await fs.access(target); return true } catch { return false }
}


/* --- Contenido escrito por fuera del código ------------------------ */

/**
 * Carga todos los .json de una carpeta de `content/`. Es el único mecanismo
 * por el que entra contenido: lecciones, guías, kits, agentes, prompts,
 * preguntas, glosario, proyectos de área y presentaciones.
 */
/**
 * Campos que NO se traducen: son la misma pieza en los dos idiomas, así que
 * una duración, un orden o un identificador distinto en la traducción es
 * siempre un error. Se toman del archivo original y la traducción no los pisa.
 *
 * Sin esto, 55 de 58 lecciones anunciaban una duración en español y otra en
 * inglés (la lección 1 decía 50 minutos en español y 25 en inglés).
 */
const NO_SE_TRADUCE = ['id', 'number', 'slot', 'order', 'minutes', 'stageId', 'tool', 'categoryId', 'toolId', 'level']

async function loadContent(folder, forzarLocale = null) {
  const idioma = forzarLocale || LOCALE
  const dir = path.join(projectDir, 'content', folder)
  if (!(await exists(dir))) return []
  const out = []
  const names = (await fs.readdir(dir)).filter((file) => file.endsWith('.json') && !file.endsWith('.en.json'))
  for (const name of names) {
    try {
      const original = JSON.parse(await fs.readFile(path.join(dir, name), 'utf8'))
      if (idioma !== 'en') { out.push(original); continue }

      // En inglés se sirve la traducción si existe; si no, el español antes
      // que dejar un hueco vacío en la aplicación.
      const enName = name.replace(/\.json$/, '.en.json')
      if (!(await exists(path.join(dir, enName)))) { out.push(original); continue }

      const traducido = JSON.parse(await fs.readFile(path.join(dir, enName), 'utf8'))
      for (const campo of NO_SE_TRADUCE) {
        if (campo in original) traducido[campo] = original[campo]
      }
      out.push(traducido)
    } catch (error) {
      console.warn(`  aviso: ${folder}/${name} no se pudo leer (${error.message}). Se ignora.`)
    }
  }
  return out
}

const extraGuides = await loadContent('toolguides')
const areaProjects = await loadContent('projects')
const deckFiles = await loadContent('decks')
const promptFiles = await loadContent('prompts')
const guideFiles = await loadContent('guias')
const cursoFiles = await loadContent('lecciones')
/* Las lecciones en español, siempre. Se usan para clasificar los prompts por
 * categoría: la categoría de una lección no puede depender del idioma. */
const cursoEnEspanol = LOCALE === 'en' ? await loadContent('lecciones', 'es') : cursoFiles
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

/* Los prompts son piezas de trabajo, no eslóganes. Si uno es demasiado corto,
 * se completa con el protocolo profesional que evita adivinar, gastar dinero
 * o poner datos reales en una prueba. La ampliación se hace en build para que
 * las fuentes editoriales sigan siendo legibles y fáciles de revisar. */
const promptWords = (value) => String(value || '').trim().split(/\s+/).filter(Boolean).length
const QUALITY_SECTIONS_EN = (context) => [
  `\n\n## Before you start\nWork with this context: ${context}. Do not fill gaps with imagination. If a fact is missing that would change the decision, ask me a specific question and wait for the answer. If several readings are possible, list them and tell me which fact separates one from another. Always separate what I have told you, what you are inferring, and what still has to be checked. Do not use a technical word without translating it first.`,
  `\n\n## Quality bar\nDo not hand me an answer that merely sounds good. Turn every recommendation into an action I can take, an output I can observe, and a condition that lets me say whether it worked. Say what is out of scope for this version. If you recommend a tool, explain why it fits the input, the output, the volume, the budget and the person who will have to maintain it. Compare at least one simpler alternative and the option of not automating yet.`,
  `\n\n## Test it before using it\nDesign a test with made-up data and four cases: a normal one, an incomplete one, a duplicate and an extreme one. Explain what should appear after each step and on which screen or in which record I check it. If something fails, tell me how to tell whether the problem is in the input, the instruction, a permission, a limit or the destination tool. Do not tell me to try again without saying which variable to change.`,
  `\n\n## Security and cost\nClearly mark every irreversible action: sending a message, publishing, deleting, charging money, sharing data or spending credit. Propose a way to test it without affecting anyone, and a point where a person has to approve it. Explain how tokens, credits, tasks, runs or storage get measured, which figure I should note before and after, and how I work out the monthly cost. If a price or a feature may have changed, write CHECK THE OFFICIAL WEBSITE instead of inventing a number.`,
  `\n\n## Handover and continuity\nFinish with a short record someone else can understand without having seen this conversation: the goal, the inputs, the output, the steps, the tools, the permissions, the cases it does not cover, the test you ran, the result, the rough cost and how to stop it. Add which file, screenshot, link or log I should keep as evidence. Include one small next action I can finish in under thirty minutes, and a clear signal that it is time to move on.`,
]

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
    const secciones = LOCALE === 'en' ? QUALITY_SECTIONS_EN : qualitySections
    for (const section of secciones(`${context} · ${item.name || (LOCALE === 'en' ? 'this assignment' : 'este encargo')}`)) {
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
/* --- Ruta: las diez etapas ----------------------------------------- */

/* Las etapas son las diez del programa, tal cual. Lo que cuelga de cada una
 * son las lecciones de content/lecciones, y eso lo resuelve la interfaz
 * filtrando por stageId: aqui no hace falta precalcular listas. */
const stages = STAGES

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

/**
 * El diccionario escrito a mano no cubría el vocabulario que las propias
 * lecciones definen: 235 de sus términos no estaban. Aquí se completan con la
 * definición que el alumno ya ha leído en la lección, para que buscar una
 * palabra en el diccionario no dependa de que alguien se acordara de añadirla.
 */
function terminosDeLasLecciones(yaPuestos) {
  const nuevos = new Map()
  for (const leccion of cursoFiles) {
    for (const [palabra, sentido] of leccion.words || []) {
      const clave = sinTildes(palabra.split(' (')[0]).trim()
      if (!clave || yaPuestos.has(clave) || nuevos.has(clave)) continue
      nuevos.set(clave, {
        term: palabra,
        letter: palabra[0].toUpperCase(),
        meaning: sentido,
        long: null,
        analogy: null,
        confusion: null,
        seeAlso: [],
        lessons: [{ id: leccion.id, title: leccion.title }],
        fromLesson: true,
      })
    }
  }
  return [...nuevos.values()]
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
  : []

// Se completa con el vocabulario de las lecciones y se reordena alfabéticamente.
const yaEnDiccionario = new Set(glossaryIndex.map((entrada) => sinTildes(entrada.term.split(' (')[0]).trim()))
glossaryIndex.push(...terminosDeLasLecciones(yaEnDiccionario))
glossaryIndex.sort((a, b) => a.term.localeCompare(b.term, 'es'))

/* --- Paginas por herramienta --------------------------------------- */

/* Una herramienta tiene pagina si alguien le escribio una guia o un itinerario
 * de lecciones (content/lecciones con `tool: <id>`). No hay otra fuente: el
 * baul ya no genera lecciones, asi que tampoco puede llenar estas fichas. */
const toolPages = TOOLS
  .map((tool) => {
    const itinerary = cursoFiles
      .filter((leccion) => leccion.tool === tool.id)
      .sort((a, b) => (a.slot || 0) - (b.slot || 0))
      .map((leccion) => ({ id: leccion.id, slot: leccion.slot, title: leccion.title, minutes: leccion.minutes }))
    return {
      id: tool.id,
      label: tool.label,
      icon: tool.icon,
      itinerary,
      guide: completeToolGuide(toolGuideFor(tool.id), tool, LOCALE),
    }
  })
  .filter((tool) => tool.guide || tool.itinerary.length)
  .sort((a, b) => b.itinerary.length - a.itinerary.length || a.label.localeCompare(b.label, 'es'))

const promptLibrary = buildInstitutionalPromptLibrary(promptFiles, toolPages, cursoFiles, institutionalKits, LOCALE, cursoEnEspanol)
for (const family of promptLibrary) enrichPrompts(family.prompts, family.title)

/* --- Traducción de la taxonomía fija (solo texto de código) --------- */

const localizedStages = LOCALE === 'en'
  ? stages.map((stage) => ({ ...stage, ...(STAGE_EN[stage.id] || {}) }))
  : stages
/* --- Escritura ------------------------------------------------------ */

const leccionesDelPrograma = cursoFiles.filter((leccion) => !leccion.tool)

const course = {
  generatedAt: new Date().toISOString(),
  locale: LOCALE,
  tools: TOOLS.map(({ id, label, icon }) => ({ id, label, icon })),
  stats: {
    /* Todos estos numeros salen a pantalla, asi que cuentan contenido real que
     * el alumno puede abrir. Nada de contadores heredados del baul. */
    lecciones: leccionesDelPrograma.length,
    itinerarios: cursoFiles.length - leccionesDelPrograma.length,
    fichas:
      toolPages.length +
      guideFiles.length +
      institutionalKits.length +
      agentFiles.length +
      promptLibrary.reduce((suma, familia) => suma + familia.prompts.length, 0),
    stages: stages.length,
    workflows: institutionalKits.reduce((suma, kit) => suma + (kit.workflows?.length || 0), 0),
    terms: glossaryIndex.length,
    projects: areaProjects.length,
    decks: deckFiles.length,
    kits: institutionalKits.length,
    agents: agentFiles.length,
    guias: guideFiles.length,
    herramientas: toolPages.length,
    prompts: promptLibrary.reduce((suma, familia) => suma + familia.prompts.length, 0),
    preguntas: faqFiles.reduce((suma, grupo) => suma + (grupo.preguntas?.length || 0), 0),
  },
  stages: localizedStages,
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
}

await fs.writeFile(path.join(publicDir, outputFile), JSON.stringify(course), 'utf8')

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
