/**
 * Construcción de los tres niveles de una lección.
 *
 * Entrada: la señal extraída del documento del vault (extract.mjs) más el
 * material pedagógico propio del área (teaching.mjs).
 * Salida: tres lecciones distintas y largas, con objetivos, recorrido completo
 * del tema, práctica, quiz y checklist propios de cada nivel.
 *
 * El documento original NO se muestra literal: de él salen los conceptos, el
 * procedimiento, los comandos, las tablas y los riesgos; la redacción y el
 * andamiaje pedagógico se construyen aquí.
 */

import { STAGES, analogyFor, detectTools } from './taxonomy.mjs'
import { teachingFor } from './teaching.mjs'
import { bankFor } from './quizbank.mjs'
import { recipesFor } from './recipes.mjs'
import { appGuideFor } from './apps.mjs'
import { installersFor } from './installers.mjs'
import { toolGuideFor } from './toolguides.mjs'
import { analyzeSections, sanitize } from './sections.mjs'

export const LEVELS = ['basico', 'intermedio', 'avanzado']

export const LEVEL_META = {
  basico: {
    label: 'Básico',
    promise: 'Entender qué es y por qué importa',
    audience: 'Nunca lo has tocado. Sales sabiendo explicarlo con tus palabras.',
  },
  intermedio: {
    label: 'Intermedio',
    promise: 'Hacerlo tú, paso a paso',
    audience: 'Ya sabes qué es. Sales habiéndolo hecho una vez de principio a fin.',
  },
  avanzado: {
    label: 'Avanzado',
    promise: 'Decidir, romper y defender',
    audience: 'Ya lo has hecho. Sales sabiendo cuándo NO usarlo y qué falla a escala.',
  },
}

const stageById = (id) => STAGES.find((stage) => stage.id === id) || STAGES[0]

function trim(value = '', max = 260) {
  const text = value.trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '), cut.lastIndexOf(', '))
  return `${(stop > max * 0.55 ? cut.slice(0, stop) : cut).trim()}…`
}

/** Las primeras frases completas de un texto, hasta un límite. */
function firstSentences(text, count, max) {
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 25)
  if (!parts.length) return trim(text, max)
  return trim(parts.slice(0, count).join(' '), max)
}

/** Secciones con contenido propio suficiente para convertirse en una tarjeta. */
function contentSections(signal, { minLength = 140, limit = 8, exclude } = {}) {
  return signal.sections
    .filter((section) => section.depth >= 2 && section.depth <= 3)
    .filter((section) => section.title.length > 3 && section.text.length >= minLength)
    .filter((section) => !/^(?:fuentes|referencias|enlaces|bibliograf|changelog|metadatos)/i.test(section.title))
    .filter((section) => !exclude || !exclude.test(section.title))
    .slice(0, limit)
}

function oneLiner(signal, stage) {
  const source = signal.purpose || signal.intro
  const first = source
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .find((item) => item.length > 40 && item.length < 300 && !/^(?:esta|este|aqu[ií]|en esta carpeta|este documento)/i.test(item))
  if (first) return trim(first, 300)
  return `${stage.tagline}, aplicado a un caso concreto de tu proyecto.`
}

function glossary(signal, limit) {
  return signal.definitions
    .filter((item) => item.term.length < 44 && item.meaning.length > 30)
    .slice(0, limit)
    .map((item) => ({ term: item.term, meaning: trim(item.meaning, 240) }))
}

function procedureSteps(signal, limit) {
  const numbered = signal.steps.sort((a, b) => a.order - b.order).map((item) => item.text)
  const source = numbered.length >= 3 ? numbered : signal.bullets
  return source.filter((item) => item.length > 20).slice(0, limit)
}

const EVIDENCE = {
  basico: 'Escribe con tus palabras, en cinco líneas, qué es esto, en qué caso de tu trabajo lo usarías y qué parte NO delegarías.',
  intermedio: 'Pega el resultado que has obtenido: la salida del comando, la captura del flujo o el archivo generado. Y añade qué paso te costó más.',
  avanzado: 'Escribe la decisión que has tomado, la alternativa que descartaste, el coste estimado y el límite que sigue teniendo.',
}

/** Los minutos salen del contenido real de la lección, no de una fórmula fija. */
function minutesFor(blocks, practice, base) {
  const reading = blocks.reduce((sum, block) => {
    if (block.text) sum += block.text.length / 900
    if (block.items) sum += block.items.length * 0.4
    if (block.code) sum += 1.5
    if (block.table) sum += 1.5
    return sum
  }, 0)
  // Se lee más rápido de lo que estimaba: menos base y menos peso por tarea.
  return Math.max(base, Math.round(base + reading * 0.7 + practice.steps.length * 1.5))
}



/**
 * Título para un bloque de código del vault. "Ejemplo en json" repetido cinco
 * veces no dice nada; el contenido casi siempre sí.
 */
function codeTitle(block, index) {
  const first = block.code.split('\n').find((line) => line.trim().length > 3) || ''
  const clean = first.replace(/^[#/*\-\s]+/, '').trim()

  if (/^\{/.test(first.trim())) {
    const key = block.code.match(/"([a-zA-Z_][\w-]{2,30})"\s*:/)
    return key ? `Estructura del JSON: ${key[1]}` : 'Estructura del JSON'
  }
  if (/^(?:def |class |function |const |export )/.test(clean)) {
    const name = clean.match(/(?:def|class|function|const|export(?: default)?)\s+([A-Za-z_$][\w$]*)/)
    return name ? `Código: ${name[1]}` : `Código en ${block.lang}`
  }
  if (clean.length > 8 && clean.length < 70 && /^[A-ZÁÉÍÓÚÑ]/.test(clean)) return clean
  if (/^-{3,}|^\|/.test(first.trim())) return 'Plantilla de la lección'
  return `Fragmento ${index + 1} (${block.lang})`
}


/** Instaladores de copiar y pegar, con su versión por sistema operativo. */
function installBlocks(installers) {
  return installers.map((item) => ({
    kind: 'instalar',
    title: item.title,
    text: item.what,
    variants: item.variants,
    verify: item.verify,
    fails: item.fails,
    warning: item.warning || null,
  }))
}

/**
 * Las secciones del documento, enteras y con su estructura real.
 * Es el contenido propio de cada lección: lo que la hace distinta a las demás.
 */
function sectionBlocks(analysis, limit) {
  // Se recortan las secciones larguísimas: en pantalla, un muro no se lee.
  const podar = (parts) => parts.slice(0, 6)
  const seen = new Map()
  return analysis.blocks.slice(0, limit).map((section) => {
    const count = (seen.get(section.title) || 0) + 1
    seen.set(section.title, count)
    return { section, title: count > 1 ? `${section.title} (${count})` : section.title }
  }).map(({ section, title }) => ({
    kind: 'seccion',
    title,
    icon: section.icon,
    parts: podar(section.parts),
  }))
}


/**
 * Bloques para quien empieza de cero: cómo crear la cuenta de la herramienta
 * principal de la lección y qué significan las palabras que va a leer.
 * Se añaden a CUALQUIER lección que mencione una herramienta, no solo a las de
 * la sección de herramientas.
 */
function beginnerBlocks(guide) {
  if (!guide) return []
  const out = []

  out.push({
    kind: 'cuenta',
    title: `Cómo crear tu cuenta, paso a paso`,
    text: guide.plain,
    account: {
      url: guide.account.url,
      free: guide.account.free,
      steps: guide.account.steps.map(([paso, como]) => `${paso} — ${como}`),
      warning: guide.account.warning,
    },
  })

  if (guide.words?.length) {
    out.push({
      kind: 'palabras',
      title: 'Las palabras que vas a leer, en cristiano',
      text: 'Ninguna es tan complicada como suena. Con reconocerlas cuando aparezcan en pantalla, vas servido.',
      items: guide.words.map(([term, meaning]) => ({ term, meaning })),
    })
  }

  if (guide.first?.length) {
    out.push({
      kind: 'primeros',
      title: 'Lo primero que tienes que hacer dentro',
      text: 'En este orden. Cada paso te prepara para el siguiente.',
      items: guide.first,
    })
  }

  return out
}

/* ------------------------------------------------------------------ *
 * BLOQUES DE APLICACION Y CODIGO                                      *
 * ------------------------------------------------------------------ */

/** "Qué se hace dentro de <app>": pasos reales con los nombres de los botones. */
function appBlocks(app, { withExample = true } = {}) {
  if (!app) return []
  const out = [{
    kind: 'app',
    title: `Qué se hace dentro de ${app.label}`,
    text: `${app.what} ${app.open}`,
    app: { label: app.label, icon: app.icon },
    items: app.steps.map(([paso, como]) => `${paso} — ${como}`),
  }, {
    kind: 'importa',
    title: 'Lo que importa y lo que no',
    matters: app.matters,
    ignore: app.ignore,
    text: 'Lo de la izquierda te va a costar tiempo o dinero si lo ignoras. Lo de la derecha te lo puedes saltar entero mientras aprendes.',
  }]

  if (withExample && app.example) {
    out.push({
      kind: 'ejemplo',
      title: app.example.title,
      items: app.example.steps,
      text: `Tiempo aproximado: ${app.example.time}`,
    })
  }
  return out
}

/** Recetas de código: copiar, pegar y entender qué hace cada línea. */
function recipeBlocks(recipes) {
  return recipes.map((recipe) => ({
    kind: 'receta',
    title: recipe.title,
    text: `${recipe.what} ${recipe.why}`,
    lang: recipe.lang,
    code: recipe.code,
    install: recipe.install,
    lines: recipe.lines,
    errors: recipe.errors,
    adapt: recipe.adapt,
  }))
}

/* ------------------------------------------------------------------ *
 * NIVEL BÁSICO                                                        *
 * ------------------------------------------------------------------ */

function buildBasico(signal, stage, tools) {
  const teaching = teachingFor(stage.id)
  const app = appGuideFor(tools, stage.id, signal.title)
  // La guía de cuenta solo cuando la lección va de esa herramienta.
  const guide = app ? tools.map((tool) => toolGuideFor(tool)).find(Boolean) : null
  const analogy = analogyFor(`${signal.title} ${signal.intro}`, stage.id)
  const terms = glossary(signal, 5)
  const blocks = []

  blocks.push({ kind: 'idea', title: 'En una frase', text: sanitize(oneLiner(signal, stage)) })

  if (analogy) blocks.push({ kind: 'analogia', title: analogy.title, text: analogy.text })

  if (terms.length >= 2) {
    blocks.push({
      kind: 'glosario',
      title: 'Las palabras que vas a oír',
      items: terms,
      text: 'No hace falta que te las aprendas de memoria. Con reconocerlas cuando aparezcan, vas servido.',
    })
  }

  // El contenido propio de esta lección, entero y con su estructura.
  blocks.push(...sectionBlocks(signal.analysis, 5))

  // Para quien empieza de cero: cuenta, vocabulario y primeros pasos.
  blocks.push(...beginnerBlocks(guide))

  // Qué se hace dentro de la aplicación: es lo específico de cada lección.
  blocks.push(...appBlocks(app, { withExample: false }))

  if (tools.length) {
    blocks.push({
      kind: 'herramientas',
      title: 'Con qué se hace esto',
      items: tools,
      text: 'Las herramientas que aparecen en este tema. Ninguna es obligatoria todavía: primero se entiende, luego se instala.',
    })
  }

  const practice = {
    goal: 'Aterrizarlo a tu caso, sin instalar nada',
    steps: [
      {
        title: 'Busca el caso en tu día a día',
        where: 'En una nota, en papel o donde escribas',
        action: `Piensa en una tarea que repites y que se parece a lo que acabas de leer en «${signal.title}». Descríbela en dos líneas: qué entra, qué haces y qué sale.`,
        expected: 'Una tarea concreta, con nombre y apellidos. No "gestionar correos", sino "clasificar los pedidos que llegan por correo cada mañana".',
      },
      {
        title: 'Marca la frontera',
        where: 'En la misma nota',
        action: 'Escribe una cosa de esa tarea que SÍ delegarías y una que NO delegarías nunca. Y sobre todo, el motivo de la segunda.',
        expected: 'El motivo suele ser uno de tres: es irreversible, lo ve un cliente, o hay dinero de por medio. Ese motivo te va a acompañar todo el curso.',
      },
      {
        title: 'Ponle una cifra',
        where: 'En la misma nota',
        action: 'Calcula cuántas veces al mes haces esa tarea y cuántos minutos te lleva cada vez. Multiplica.',
        expected: 'Un número de horas al mes. Es lo que justifica (o no) el trabajo de automatizarlo, y lo que le enseñarás a un cliente.',
      },
      {
        title: 'Explícalo en voz alta',
        where: 'A alguien que no sea del sector, o a la pared',
        action: 'Cuenta en un minuto qué es este tema y para qué sirve, sin leer y sin usar una sola palabra en inglés que no traduzcas.',
        expected: 'Si te atascas en algún punto, ahí está lo que no has entendido. Vuelve a esa parte antes de pasar a intermedio.',
      },
    ],
    evidence: EVIDENCE.basico,
  }

  return {
    level: 'basico',
    headline: `«${signal.title}», explicado desde cero`,
    hook: 'Vamos a explicarlo sin una sola palabra técnica sin traducir. Si algo no se entiende, es culpa de la explicación, no tuya.',
    minutes: minutesFor(blocks, practice, 6),
    objectives: [
      'Explicar con tus palabras de qué va este tema y qué problema resuelve',
      'Reconocer una situación de tu trabajo donde esto aplica, con una cifra al lado',
      'Distinguir lo que sí hace de lo que la gente cree que hace',
      'Saber qué parte de la tarea no delegarías nunca, y por qué',
    ],
    blocks,
    practice,
    pitfalls: [
      { error: 'Saltar directo a la herramienta sin entender qué resuelve', fix: 'Si no sabes decir qué problema tenías antes, no vas a saber si la herramienta lo arregló.' },
      { error: 'Creer que entender la idea equivale a saber hacerlo', fix: 'Son dos cosas distintas y hacen falta las dos. Este nivel te da la primera; el intermedio, la segunda.' },
      { error: 'Aprender el vocabulario sin aprender el concepto', fix: 'Saber decir "embedding" no es saber qué hace. Si no puedes explicarlo con tus palabras, todavía no lo tienes.' },
    ],
    checklist: [
      'Sabes explicarlo en voz alta sin leer',
      'Tienes identificado un caso propio donde aplica',
      'Le has puesto una cifra de horas al mes',
      'Sabes nombrar una cosa que esto NO hace',
      'Sabes qué parte no delegarías y por qué',
    ],
  }
}

/* ------------------------------------------------------------------ *
 * NIVEL INTERMEDIO                                                    *
 * ------------------------------------------------------------------ */

function buildIntermedio(signal, stage, tools) {
  const teaching = teachingFor(stage.id)
  const app = appGuideFor(tools, stage.id, signal.title)
  const recipes = recipesFor({ title: signal.title, text: signal.body, stageId: stage.id, tools })
  // Ninguna lección se queda sin código que copiar y pegar.
  if (!recipes.length) recipes.push(...recipesFor({ title: '', text: '', stageId: stage.id, tools: tools.length ? tools : ['python'] }).slice(0, 1))
  const steps = procedureSteps(signal, 7)
  const blocks = []

  blocks.push({
    kind: 'idea',
    title: 'Lo que vas a construir',
    text: signal.deliverable
      ? trim(signal.deliverable, 380)
      : `Una versión pequeña y funcionando de lo que explica «${signal.title}», con datos de prueba y un resultado que puedas enseñar a otra persona.`,
  })

  blocks.push({
    kind: 'requisitos',
    title: 'Antes de empezar',
    items: [
      'Ten el nivel básico de esta lección hecho: aquí se asume que ya sabes qué es y para qué sirve.',
      tools.length ? 'Ten a mano las herramientas de la lección, con sesión iniciada donde haga falta.' : 'No necesitas instalar nada nuevo para esta práctica.',
      signal.commands.length ? 'Abre una terminal en la carpeta de tu proyecto. Vas a ejecutar comandos reales.' : 'Ten abierto el documento de tu proyecto para ir anotando.',
      'Usa datos ficticios. Aquí no se trabaja con información real de nadie.',
    ],
    text: 'Cinco minutos de preparación te ahorran media hora de atascos a mitad de la práctica.',
  })

  if (steps.length >= 3) {
    blocks.push({
      kind: 'pasos',
      title: 'El procedimiento, en orden',
      items: steps,
      text: 'Hazlos en este orden. Si uno falla, para: no sigas con el siguiente esperando que se arregle solo.',
    })
  }

  // Instalación de copiar y pegar, antes de nada.
  blocks.push(...installBlocks(installersFor({ stageId: stage.id, tools, title: signal.title })))

  // Todo el contenido de la lección, entero.
  blocks.push(...sectionBlocks(signal.analysis, 8))

  // El código real de la lección: copiable y explicado línea a línea.
  blocks.push(...recipeBlocks(recipes))

  blocks.push(...appBlocks(app, { withExample: false }))

  if (signal.commands.length) {
    blocks.push({
      kind: 'comandos',
      title: 'Comandos que vas a usar',
      items: signal.commands.slice(0, 5),
      text: 'Léelos antes de ejecutarlos. Cambia rutas y nombres de ejemplo por los tuyos, y no pegues nunca una clave real dentro de un comando: acaba en el historial.',
    })
  }

  for (const table of signal.tables.slice(0, 1)) {
    blocks.push({ kind: 'tabla', title: 'Referencia de la lección', table })
  }

  blocks.push({
    kind: 'comprobar',
    title: 'Comprobaciones mientras trabajas',
    items: [
      'Después de cada paso, mira el resultado antes de continuar. Encadenar pasos a ciegas convierte un error pequeño en una hora de búsqueda.',
      'Si algo falla, lee el mensaje entero. La causa suele estar en la primera línea, no en la última.',
      'Ejecuta dos veces con la misma entrada. Si el resultado cambia, tienes una dependencia oculta que localizar.',
      'Anota el comando o la acción exacta que funcionó. Mañana no te vas a acordar.',
    ],
  })

  if (tools.length) blocks.push({ kind: 'herramientas', title: 'Herramientas de esta práctica', items: tools })

  const practice = {
    goal: 'Hacerlo entero, con datos de prueba',
    steps: [
      {
        title: 'Prepara el caso de prueba',
        where: 'En tu proyecto',
        action: 'Crea una entrada ficticia pero realista: los mismos campos que tendrá la de verdad, con valores inventados. Guárdala en un archivo para poder reutilizarla.',
        expected: 'Una entrada que puedas volver a usar mañana exactamente igual, para comparar resultados entre ejecuciones.',
      },
      {
        title: 'Escribe qué esperas ANTES de ejecutar',
        where: 'En tu documento de proyecto',
        action: 'Describe en una línea qué resultado deberías obtener. Hazlo antes de ver la salida real.',
        expected: 'Una expectativa escrita. Es la única forma de que "funciona" signifique algo y no sea lo que decidas al ver el resultado.',
      },
      ...steps.slice(0, 4).map((step, index) => ({
        title: `Ejecuta la parte ${index + 1}`,
        where: 'En la herramienta de esta lección',
        action: trim(step, 340),
        expected: 'Un resultado visible antes de pasar al siguiente paso. Si no ves nada, no continúes: para y averigua por qué.',
      })),
      {
        title: 'Comprueba y repite',
        where: 'Donde acabes de trabajar',
        action: 'Repite la ejecución completa desde cero con la misma entrada y compara con lo que habías escrito que esperabas.',
        expected: 'Dos ejecuciones idénticas dan el mismo resultado, y coincide con tu expectativa. Si no coincide, ahí tienes lo que no habías entendido.',
      },
      {
        title: 'Rompe una cosa a propósito',
        where: 'En la misma práctica',
        action: 'Quita un campo obligatorio, cambia un nombre o corta la conexión. Observa qué mensaje da y en qué punto se para.',
        expected: 'Saber cómo se ve el fallo. Reconocer un error conocido te ahorrará horas la próxima vez que aparezca de verdad.',
      },
    ],
    evidence: EVIDENCE.intermedio,
  }

  return {
    level: 'intermedio',
    headline: `«${signal.title}», paso a paso`,
    hook: 'Aquí se trabaja con las manos. Al final tienes que tener algo que funcione, aunque sea pequeño y feo. Feo y funcionando gana a bonito y teórico.',
    minutes: minutesFor(blocks, practice, 10),
    objectives: [
      'Ejecutar el procedimiento completo al menos una vez, de principio a fin',
      'Reconocer el resultado correcto y distinguirlo de uno a medias',
      'Reparar el error más frecuente sin ayuda',
      'Dejarlo documentado para poder repetirlo dentro de un mes',
    ],
    blocks,
    practice,
    pitfalls: buildPitfalls(signal, 'intermedio'),
    checklist: [
      'Lo has ejecutado entero sin copiar y pegar a ciegas',
      'Sabes qué hace cada paso, no solo que funciona',
      'Has escrito qué esperabas antes de ver el resultado',
      'Has provocado un fallo y sabes cómo se ve',
      'Puedes repetirlo mañana sin volver a leer la lección',
      'Tienes guardada una evidencia del resultado',
    ],
  }
}

/* ------------------------------------------------------------------ *
 * NIVEL AVANZADO                                                      *
 * ------------------------------------------------------------------ */

function buildAvanzado(signal, stage, tools) {
  const teaching = teachingFor(stage.id)
  const recipes = recipesFor({ title: signal.title, text: signal.body, stageId: stage.id, tools })
  const blocks = []

  blocks.push({
    kind: 'idea',
    title: 'La decisión de fondo',
    text: 'A este nivel la pregunta ya no es cómo se hace, sino cuándo merece la pena y qué se rompe cuando crece. Todo lo que sigue son compromisos, no recetas: si alguien te da una respuesta única sin preguntarte por tu contexto, desconfía.',
  })

  blocks.push({ kind: 'coste', title: 'Lo que cuesta de verdad', text: teaching.cost })

  blocks.push({
    kind: 'tabla',
    title: 'Alternativas y cuándo elegir cada una',
    table: {
      header: ['Opción', 'Cuándo es la correcta'],
      rows: teaching.alternatives,
    },
  })

  blocks.push({
    kind: 'riesgos',
    title: 'Cómo se rompe esto en producción',
    items: teaching.failures.map(([error, fix]) => `${error} — ${fix}`),
    text: 'Tres modos de fallo reales de esta área. No son hipótesis: son las llamadas que recibe alguien un lunes por la mañana.',
  })

  blocks.push(...recipeBlocks(recipes))

  if (signal.risks.length) {
    blocks.push({
      kind: 'riesgos',
      title: 'Avisos concretos de este material',
      items: signal.risks.slice(0, 4),
      text: 'Salidos de tu propia documentación. Compruébalos de forma explícita antes de dar el trabajo por terminado.',
    })
  }

  // Las secciones del documento que tratan límites, coste, escala o decisiones.
  const deep = {
    blocks: signal.analysis.blocks.filter((section) =>
      /l[ií]mite|riesgo|coste|escala|seguridad|avanzad|producci[oó]n|troubleshoot|error|alternativ|decisi[oó]n|arquitectur|rendimiento|optimiz|diagn[oó]stico|defensa|evalua/i.test(section.title),
    ),
  }
  blocks.push(...sectionBlocks(deep, 5))

  for (const table of signal.tables.slice(0, 1)) {
    blocks.push({ kind: 'tabla', title: 'Comparativa del material', table })
  }

  blocks.push({
    kind: 'decisiones',
    title: 'Preguntas que tienes que saber responder',
    items: [
      `¿En qué caso NO aplicarías lo de «${signal.title}»? Nombra la alternativa concreta y por qué sería mejor ahí.`,
      '¿Qué pasa cuando el volumen se multiplica por cien? ¿Qué se rompe primero: el coste, la latencia o la exactitud?',
      '¿Cuánto cuesta esto al mes con uso real, y qué parte del gasto es evitable con caché, lotes o un modelo menor?',
      '¿Qué dato sensible pasa por aquí, quién puede verlo y cuánto tiempo se conserva?',
      '¿Cómo te enteras de que ha fallado sin que te lo diga un usuario?',
      '¿Qué decisión tomaste que otra persona razonable habría tomado distinta, y con qué argumento la defiendes?',
    ],
    text: 'Estas seis son las preguntas de una defensa de proyecto o una entrevista técnica. Si dudas en alguna, ahí tienes el trabajo pendiente.',
  })

  if (tools.length) blocks.push({ kind: 'herramientas', title: 'Stack implicado', items: tools })

  const practice = {
    goal: 'Romperlo, medirlo y defenderlo',
    steps: [
      {
        title: 'Diseña sin plantilla',
        where: 'En papel o en tu editor',
        action: 'Dibuja tu versión desde cero, sin mirar la lección. Marca entradas, decisiones, acciones irreversibles y puntos de registro.',
        expected: 'Un diagrama donde se distingue de un vistazo qué es automático y qué necesita una persona.',
      },
      {
        title: 'Elige la alternativa que descartas',
        where: 'En tu documento de proyecto',
        action: 'De la tabla de alternativas, elige la que NO has usado y escribe en tres líneas por qué no encaja en tu caso.',
        expected: 'Un argumento con datos de tu contexto: volumen, presupuesto, sensibilidad de los datos o plazo. No "porque sí".',
      },
      {
        title: 'Provoca el fallo',
        where: 'En tu implementación',
        action: 'Elige el punto más frágil y rómpelo a propósito: quita un campo obligatorio, invalida una credencial, mete el doble de volumen o corta la red.',
        expected: 'El sistema falla de forma controlada: no ejecuta la acción externa, deja un registro legible y se puede reanudar sin duplicar nada.',
      },
      {
        title: 'Pon número al coste',
        where: 'En tu documento de proyecto',
        action: 'Calcula el coste mensual con un volumen realista, incluyendo reintentos y errores. Marca qué parte del gasto es evitable.',
        expected: 'Una cifra defendible, con el supuesto de volumen escrito al lado. Sin el supuesto, la cifra no vale nada.',
      },
      {
        title: 'Define cómo te enteras',
        where: 'En tu implementación',
        action: 'Decide qué señal te avisa de que esto ha fallado, dónde llega y quién la mira. Si la respuesta es "lo veré en los logs", no vale.',
        expected: 'Una alerta concreta con destinatario, o la admisión honesta de que ahora mismo no te enterarías.',
      },
      {
        title: 'Defiéndelo',
        where: 'En voz alta, dos minutos',
        action: 'Explica la decisión, la alternativa descartada y el límite conocido. Sin adornos y sin decir que funciona perfecto.',
        expected: 'Una explicación que aguanta la pregunta "¿y por qué no lo hiciste de la otra forma?" sin que tengas que improvisar.',
      },
    ],
    evidence: EVIDENCE.avanzado,
  }

  return {
    level: 'avanzado',
    headline: `«${signal.title}»: límites, coste y decisiones`,
    hook: 'Aquí se rompe a propósito. El objetivo no es que funcione: es saber exactamente cómo se comporta cuando deja de funcionar, y poder explicarlo.',
    minutes: minutesFor(blocks, practice, 14),
    objectives: [
      'Justificar la elección frente a al menos una alternativa real',
      'Anticipar el modo de fallo más probable y cómo se detecta',
      'Estimar coste, riesgo de datos y esfuerzo de mantenimiento',
      'Defender las decisiones ante alguien que pregunte por qué no lo hiciste de otra forma',
    ],
    blocks,
    practice,
    pitfalls: buildPitfalls(signal, 'avanzado'),
    checklist: [
      'Puedes nombrar la alternativa que descartaste y por qué',
      'Has provocado un fallo y lo has documentado',
      'Tienes una cifra de coste con su supuesto de volumen',
      'Sabes qué dato sensible atraviesa el sistema',
      'Tienes definido cómo te enteras de un fallo sin que te lo cuenten',
      'Has explicado el diseño en voz alta sin leer',
    ],
  }
}

/* ------------------------------------------------------------------ */

const GENERIC_PITFALLS = {
  intermedio: [
    { error: 'Copiar los comandos sin leer las rutas', fix: 'Los ejemplos llevan rutas y nombres de otro proyecto. Cámbialos antes de pulsar intro, no después de ver el error.' },
    { error: 'Dar por bueno el primer resultado que no da error', fix: '"Sin error" no es "correcto". Comprueba el contenido de la salida, no solo que el proceso terminara.' },
    { error: 'Avanzar con un paso a medias', fix: 'Un paso incompleto no se arregla en el siguiente: se multiplica. Para y ciérralo antes de seguir.' },
  ],
  avanzado: [
    { error: 'Optimizar antes de tener una medida', fix: 'Sin una cifra de partida, cualquier cambio parece una mejora. Mide, cambia, vuelve a medir.' },
    { error: 'Diseñar solo el camino correcto', fix: 'El camino feliz es el 20% del trabajo. El resto es qué pasa con datos basura, eventos repetidos y servicios caídos.' },
    { error: 'Confundir "no ha fallado todavía" con "es robusto"', fix: 'Un sistema sin incidentes puede ser sólido o simplemente joven. La diferencia la marca haberlo roto tú antes.' },
  ],
}

const RISK_FIX = [
  [/clave|secret|credencial|token|api[_ ]?key|\.env/i, 'Un secreto filtrado no se arregla borrándolo: hay que revocarlo y emitir uno nuevo. Compruébalo antes de compartir nada.'],
  [/dato personal|\bpii\b|rgpd|gdpr|privacidad|consentimiento/i, 'Aquí hay datos de una persona real. Antes de seguir: qué recoges, con qué permiso y cuándo se borra.'],
  [/coste|token|gasto|factura|l[ií]mite de uso/i, 'Esto tiene precio por uso. Pon el tope antes de la primera ejecución larga, no después de verlo en la factura.'],
  [/borr|elimin|destruct|irreversible|producci[oó]n/i, 'Es irreversible. Hazlo primero contra datos de prueba y ten claro cómo volver atrás.'],
]

function buildPitfalls(signal, level) {
  const fromSource = signal.risks
    .filter((item) => item.length < 200 && !/^[A-ZÁÉÍÓÚÑ][^.]{0,40}\s+[A-ZÁÉÍÓÚÑ]/.test(item))
    .slice(0, 3)
    .map((item) => ({
      error: trim(item, 170),
      fix: (RISK_FIX.find(([pattern]) => pattern.test(item)) || [])[1]
        || 'Señalado como riesgo en el material de la academia. Compruébalo de forma explícita antes de dar la práctica por terminada.',
    }))
  return [...fromSource, ...GENERIC_PITFALLS[level]].slice(0, 6)
}

/* ------------------------------------------------------------------ *
 * QUIZ                                                                *
 * ------------------------------------------------------------------ */

function glossaryQuestions(signal, max) {
  const pool = signal.definitions.filter((item) => item.meaning.length > 45 && item.term.length < 44)
  if (pool.length < 3) return []
  const out = []
  for (let index = 0; index < pool.length && out.length < max; index += 1) {
    const target = pool[index]
    const others = pool.filter((item) => item.term !== target.term)
    if (others.length < 2) break
    const wrong = [others[(index + 1) % others.length], others[(index + 2) % others.length]]
    if (wrong[0].term === wrong[1].term) break
    out.push({
      prompt: `¿Qué es «${target.term}» en este contexto?`,
      options: [
        { text: trim(target.meaning, 180), correct: true, why: `Correcto. Así se define «${target.term}» en el material de la academia.` },
        ...wrong.map((item) => ({
          text: trim(item.meaning, 180),
          correct: false,
          why: `Eso describe «${item.term}», que aparece en esta misma lección. Se confunden con facilidad: fíjate en qué hace cada uno, no en cómo suenan.`,
        })),
      ],
      explain: 'Las tres opciones son definiciones reales de esta lección. Distinguirlas es media lección aprendida.',
      source: 'glosario',
    })
  }
  return out
}

function buildQuiz(signal, stageId, level, tools = []) {
  // Las preguntas de la herramienta van primero: son las más concretas.
  const guide = tools.map((tool) => toolGuideFor(tool)).find(Boolean)
  const fromTool = level === 'basico' ? (guide?.questions || []).map((item) => ({ ...item, source: 'herramienta' })) : []
  const authored = bankFor(stageId, level).map((item) => ({ ...item, source: 'academia' }))
  const derived = glossaryQuestions(signal, level === 'basico' ? 2 : 2)
  return [...fromTool, ...authored, ...derived].slice(0, 6)
}

/* ------------------------------------------------------------------ */

export function buildLevels(signal, stageId) {
  const stage = stageById(stageId)
  const tools = detectTools(signal.body, 6, signal.title)
  const builders = { basico: buildBasico, intermedio: buildIntermedio, avanzado: buildAvanzado }
  const levels = {}
  for (const level of LEVELS) {
    // Sin quiz: el alumno avanza haciendo tareas, no respondiendo tipo test.
    levels[level] = { ...builders[level](signal, stage, tools), quiz: [] }
  }
  return { levels, tools }
}
