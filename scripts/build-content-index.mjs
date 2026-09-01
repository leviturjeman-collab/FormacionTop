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
const kitFiles = await loadContent('kits')
const faqFiles = await loadContent('preguntas')

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

const EXTRA_INSTITUTIONAL_KITS = [
  {
    id: 'portal-app-institucional',
    order: 2,
    title: 'Portal web o app institucional',
    kicker: 'Web, app y publicación',
    audience: 'equipos que necesitan una web, portal interno, dashboard o aplicación pequeña',
    promise: 'Convierte una necesidad de negocio en una interfaz publicada, con contenido real, rutas claras, QA y mantenimiento.',
    focus: 'diseñar, construir, revisar y publicar un portal o aplicación institucional',
    entry: 'brief, contenidos, usuarios, permisos y pantallas necesarias',
    output: 'web o app navegable, checklist de QA, README, deploy y plan de mantenimiento',
    tools: ['openai', 'claude', 'v0', 'lovable', 'github', 'vercel', 'figma', 'supabase'],
    promptFamilies: ['crear-proyecto', 'programar', 'probar-reparar', 'entregar-equipo-cliente'],
    skillKeywords: ['web', 'app', 'deploy', 'qa', 'frontend', 'github', 'vercel'],
    deliverables: ['Mapa de pantallas', 'Repositorio o versión publicada', 'Plan de QA', 'Manual de actualización'],
    fits: ['Landing o web corporativa con contenidos reales', 'Portal interno con roles y estados', 'Dashboard de seguimiento para dirección', 'Prototipo que debe enseñarse a cliente sin parecer maqueta'],
    notFor: ['Apps críticas sin equipo técnico responsable', 'Productos que manejan pagos o salud sin revisión legal', 'Sustituir investigación de usuarios por una pantalla bonita'],
  },
  {
    id: 'rag-documental',
    order: 3,
    title: 'Sistema documental y RAG',
    kicker: 'Datos y conocimiento',
    audience: 'equipos con manuales, documentos, normativa, contratos o conocimiento interno',
    promise: 'Convierte documentos dispersos en respuestas con fuente, permisos, actualización y prueba de calidad.',
    focus: 'organizar documentos y montar una base consultable con respuestas verificables',
    entry: 'PDF, docs, carpetas, hojas y preguntas frecuentes internas',
    output: 'inventario documental, base de conocimiento, preguntas de prueba y criterio de respuesta con fuente',
    tools: ['openai', 'claude', 'notebooklm', 'supabase', 'postgres', 'langchain', 'sheets', 'notion'],
    promptFamilies: ['conectar-datos', 'probar-reparar', 'seguridad-coste-privacidad'],
    skillKeywords: ['rag', 'documentos', 'fuentes', 'conocimiento', 'datos'],
    deliverables: ['Inventario documental', 'Política de fuentes', 'Set de preguntas de prueba', 'Registro de actualización'],
    fits: ['Manuales internos que nadie encuentra', 'Normativa que debe citar fuente', 'Onboarding con respuestas repetidas', 'Soporte interno con documentación dispersa'],
    notFor: ['Responder sin fuente visible', 'Meter documentos sensibles sin permisos', 'Usar documentos desactualizados como si fueran verdad vigente'],
  },
  {
    id: 'contenido-presentaciones',
    order: 4,
    title: 'Máquina de contenido y presentaciones',
    kicker: 'Contenido y venta',
    audience: 'marketing, formación, ventas, agencias, docentes y equipos comerciales',
    promise: 'Convierte ideas, clases o campañas en guiones, decks, piezas visuales y calendario con revisión editorial.',
    focus: 'crear contenido institucional reutilizable sin perder tono, fuentes ni aprobación',
    entry: 'objetivos, audiencia, materiales fuente, calendario y guía de marca',
    output: 'calendario editorial, guiones, presentaciones, piezas visuales y checklist de aprobación',
    tools: ['openai', 'claude', 'gamma', 'canva', 'figma', 'midjourney', 'runway', 'higgsfield', 'elevenlabs'],
    promptFamilies: ['crear-contenido', 'entregar-equipo-cliente', 'seguridad-coste-privacidad'],
    skillKeywords: ['contenido', 'deck', 'presentacion', 'video', 'imagen', 'marca'],
    deliverables: ['Calendario editorial', 'Guiones aprobados', 'Deck reutilizable', 'Banco de piezas visuales'],
    fits: ['Cursos y webinars', 'Presentaciones comerciales', 'Campañas con varias piezas', 'Documentación convertida en materiales enseñables'],
    notFor: ['Publicar sin revisión de marca', 'Usar imágenes con derechos dudosos', 'Crear mucho contenido sin una métrica o audiencia concreta'],
  },
  {
    id: 'agentes-codigo-produccion',
    order: 5,
    title: 'Agentes de código, QA y producción',
    kicker: 'Código y mantenimiento',
    audience: 'builders, equipos técnicos, founders y alumnos avanzados',
    promise: 'Organiza asistentes de código con repositorio, tareas pequeñas, pruebas, revisión humana, deploy y recuperación.',
    focus: 'construir y mantener software con agentes sin romper producción',
    entry: 'repositorio, issue, rama, entorno local, pruebas y criterio de aceptación',
    output: 'tarea técnica acotada, diff revisable, tests, deploy y plan de rollback',
    tools: ['codex', 'claude-code', 'cursor', 'github', 'typescript', 'react', 'node', 'python', 'docker', 'vercel'],
    promptFamilies: ['programar', 'probar-reparar', 'entregar-equipo-cliente'],
    skillKeywords: ['codigo', 'qa', 'tests', 'pull request', 'deploy', 'rollback'],
    deliverables: ['Issue técnico', 'Pull request revisable', 'Plan de pruebas', 'Notas de despliegue'],
    fits: ['Cambios pequeños en una app existente', 'Corrección de bugs con test', 'Refactor acotado', 'Deploy controlado a producción'],
    notFor: ['Reescribir un producto entero sin contexto', 'Dar permisos de producción sin revisión', 'Aceptar un diff sin probarlo'],
  },
  {
    id: 'crm-reporting-institucional',
    order: 6,
    title: 'CRM, datos y reporting institucional',
    kicker: 'Ventas y dirección',
    audience: 'ventas, dirección, operaciones comerciales y administración',
    promise: 'Conecta captación, seguimiento, reporting y decisiones comerciales con trazabilidad y datos limpios.',
    focus: 'pasar de leads dispersos a seguimiento medible y reportes de dirección',
    entry: 'formularios, emails, llamadas, hojas, CRM y estados comerciales',
    output: 'pipeline limpio, alertas, informe semanal y reglas de seguimiento',
    tools: ['airtable', 'sheets', 'hubspot', 'gmail', 'slack', 'n8n', 'make', 'openai'],
    promptFamilies: ['automatizar', 'conectar-datos', 'probar-reparar', 'entregar-equipo-cliente'],
    skillKeywords: ['crm', 'ventas', 'reporting', 'pipeline', 'lead'],
    deliverables: ['Modelo de datos comercial', 'Workflow de seguimiento', 'Dashboard semanal', 'Manual de estados'],
    fits: ['Leads que llegan por varios canales', 'Seguimiento comercial que depende de memoria', 'Reportes semanales hechos a mano', 'Carteras de clientes con estados poco claros'],
    notFor: ['Mandar mensajes comerciales sin consentimiento', 'Automatizar descuentos o cobros sin aprobación', 'Reportar datos que nadie mantiene limpios'],
  },
  {
    id: 'campus-onboarding-ia',
    order: 7,
    title: 'Campus de formación y onboarding con IA',
    kicker: 'Formación interna',
    audience: 'academias, equipos de formación, RR. HH. y responsables de adopción',
    promise: 'Convierte conocimiento interno en ruta de aprendizaje, ejercicios, evaluación, evidencias y soporte al alumno.',
    focus: 'diseñar formación práctica con IA, tareas verificables y seguimiento de progreso',
    entry: 'temario, perfiles de alumno, materiales fuente, calendario y criterios de evaluación',
    output: 'programa por niveles, ejercicios, banco de preguntas, evidencias y panel de progreso',
    tools: ['openai', 'claude', 'notion', 'sheets', 'gamma', 'canva', 'wispr-flow', 'n8n'],
    promptFamilies: ['aprender-desde-cero', 'crear-contenido', 'probar-reparar', 'entregar-equipo-cliente'],
    skillKeywords: ['formacion', 'onboarding', 'evaluacion', 'alumnos', 'curso'],
    deliverables: ['Ruta formativa', 'Ejercicios por nivel', 'Banco de preguntas', 'Sistema de evidencias'],
    fits: ['Formar equipos no técnicos', 'Onboarding de nuevas personas', 'Cursos con prácticas reales', 'Soporte al alumno con dudas repetidas'],
    notFor: ['Evaluar personas solo con IA', 'Usar datos de menores sin política clara', 'Convertir formación en vídeos sin práctica'],
  },
  {
    id: 'atencion-cliente-multicanal',
    order: 8,
    title: 'Atención al cliente multicanal',
    kicker: 'Soporte y comunicación',
    audience: 'soporte, recepción, ventas internas y equipos de atención',
    promise: 'Ordena mensajes de email, WhatsApp, formularios y chat en una cola con prioridad, borrador y aprobación.',
    focus: 'atender mejor sin responder automáticamente a ciegas',
    entry: 'mensajes entrantes, datos de cliente, historial y política de respuesta',
    output: 'cola priorizada, borradores, escalado humano, registro y métricas de respuesta',
    tools: ['gmail', 'whatsapp', 'telegram', 'slack', 'n8n', 'zapier', 'openai', 'sheets'],
    promptFamilies: ['automatizar', 'crear-agentes', 'probar-reparar', 'seguridad-coste-privacidad'],
    skillKeywords: ['soporte', 'cliente', 'whatsapp', 'correo', 'ticket', 'prioridad'],
    deliverables: ['Mapa de canales', 'Cola de casos', 'Plantillas de respuesta', 'Protocolo de escalado'],
    fits: ['Bandejas compartidas saturadas', 'WhatsApp de negocio sin seguimiento', 'Tickets sin prioridad', 'Respuestas repetidas que deben revisarse'],
    notFor: ['Responder temas legales o médicos sin persona responsable', 'Enviar mensajes masivos sin permiso', 'Prometer plazos que el equipo no puede cumplir'],
  },
  {
    id: 'gobierno-costes-ia',
    order: 9,
    title: 'Gobierno, seguridad y costes de IA',
    kicker: 'Control institucional',
    audience: 'dirección, legal, seguridad, tecnología y responsables de adopción',
    promise: 'Define qué se puede usar, con qué datos, cuánto cuesta, quién aprueba y cómo se audita.',
    focus: 'crear una política operativa de IA que permita avanzar sin perder control',
    entry: 'herramientas en uso, tipos de datos, casos de uso, riesgos y presupuesto',
    output: 'política de uso, matriz de permisos, límites de gasto, registro de riesgos y cadencia de revisión',
    tools: ['openai', 'claude', 'github', 'notion', 'sheets', 'n8n', 'supabase', 'vercel'],
    promptFamilies: ['seguridad-coste-privacidad', 'probar-reparar', 'entregar-equipo-cliente'],
    skillKeywords: ['seguridad', 'coste', 'privacidad', 'politica', 'gobierno', 'auditoria'],
    deliverables: ['Política de IA', 'Matriz de permisos', 'Registro de riesgos', 'Plan de auditoría'],
    fits: ['Equipos que ya usan IA sin reglas comunes', 'Dirección que necesita aprobar pilotos', 'Proveedores que piden tratamiento de datos', 'Proyectos que pueden gastar crédito o publicar contenido'],
    notFor: ['Bloquear todo por miedo', 'Aprobar herramientas sin revisar datos', 'Confundir checklist interna con asesoramiento legal completo'],
  },
]

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value))
}

function scenarioBrief(scenario, basePrompt) {
  return `Actúa como arquitecta institucional de sistemas de IA. Vamos a diseñar el kit "${scenario.title}" para una organización real. El foco no es montar botones sueltos: es ${scenario.focus}.

Contexto obligatorio:
- Institución o cliente: [INSTITUCION]
- Área responsable: [AREA_EQUIPO]
- Personas usuarias: [PERFIL_PERSONA]
- Problema o proceso: [PROCESO_O_PROBLEMA]
- Entrada real: ${scenario.entry}. Ajusta esto con [ENTRADA_REAL].
- Salida esperada: ${scenario.output}. Ajusta esto con [SALIDA_ESPERADA].
- Volumen y frecuencia: [VOLUMEN_Y_FRECUENCIA]
- Restricciones: [RESTRICCIONES]
- Datos sensibles: [DATOS_SENSIBLES]
- Fecha de revisión: [FECHA_REVISION]

Primero devuelve el proceso actual en pasos, después hazme solo las tres preguntas que más cambiarían el diseño y espera mi respuesta. Cuando conteste, separa qué va manual, qué se automatiza, qué se prueba con datos ficticios, quién aprueba y qué evidencia se guarda. No recomiendes usar datos reales hasta que existan permisos, pruebas y criterio de parada.

Si necesitas una base más estricta, conserva esta lógica de trabajo:

${basePrompt}`
}

function adaptPrompt(prompt, scenario, index) {
  return {
    ...prompt,
    id: `${scenario.id}-${prompt.id || `prompt-${index + 1}`}`,
    name: `${scenario.title} · ${prompt.name}`,
    when: `Úsalo dentro del kit "${scenario.title}" cuando toque ${String(prompt.when || 'preparar una decisión verificable').toLowerCase()}`,
    prompt: `Adapta este paso al kit "${scenario.title}". Foco: ${scenario.focus}. Entrada principal: ${scenario.entry}. Salida esperada: ${scenario.output}. Mantén revisión humana, prueba con datos ficticios, coste visible, privacidad y evidencia.\n\n${prompt.prompt}`,
    expect: `${prompt.expect} Adaptado a ${scenario.title}, con evidencia y siguiente acción claras.`,
  }
}

function adaptWorkflow(workflow, scenario) {
  return {
    ...workflow,
    name: `${scenario.title} · circuito base`,
    what: `Circuito base para ${scenario.focus}. Está pensado como esqueleto importable: entrada, normalización, validación, IA si aporta valor, registro, aviso y aprobación humana antes de cualquier acción sensible.`,
    needs: [
      `Una entrada definida: ${scenario.entry}.`,
      `Una salida aprobada: ${scenario.output}.`,
      'Credenciales de prueba, no credenciales definitivas, hasta pasar los casos normal, incompleto, duplicado y extremo.',
    ],
    fill: [
      ['[ENTRADA_REAL]', scenario.entry],
      ['[SALIDA_ESPERADA]', scenario.output],
      ['[CANAL_AVISO]', 'Dónde se avisa a la persona responsable: Slack, correo, Telegram o panel interno.'],
      ['[APROBADOR]', 'Persona que revisa antes de publicar, enviar, borrar, cobrar o cambiar permisos.'],
    ],
    careful: [
      'No actives el circuito con datos reales hasta tener prueba con datos ficticios y aprobación humana.',
      'No conectes cuentas personales si el kit pertenece a una institución o cliente.',
      'Si publica, envía mensajes, cambia permisos o consume crédito, debe existir un punto de parada visible.',
    ],
  }
}

function expandInstitutionalKits(files) {
  if (!files.length) return files
  const base = files.find((kit) => kit.id === 'operaciones-ia') || files[0]
  const generated = EXTRA_INSTITUTIONAL_KITS.map((scenario) => {
    const kit = cloneJson(base)
    kit.id = scenario.id
    kit.order = scenario.order
    kit.title = scenario.title
    kit.kicker = scenario.kicker
    kit.promise = scenario.promise
    kit.audience = scenario.audience
    kit.plain = `Este kit sirve para ${scenario.focus}. Trabaja con ${scenario.entry} y busca terminar con ${scenario.output}. No es una colección de prompts sueltos: combina alcance, herramientas, datos, fases, pruebas, riesgos, entrega y mantenimiento. La versión mínima debe funcionar con datos ficticios antes de tocar cuentas reales; la versión real necesita responsable, aprobación y evidencia guardada.`
    kit.fits = scenario.fits
    kit.notFor = scenario.notFor
    kit.tools = scenario.tools
    kit.promptFamilies = scenario.promptFamilies
    kit.skillKeywords = scenario.skillKeywords
    kit.deliverables = scenario.deliverables
    kit.brief = {
      ...kit.brief,
      name: `Define el kit de ${scenario.title}`,
      when: 'Lo primero: antes de elegir herramienta, automatización o pantalla.',
      prompt: scenarioBrief(scenario, kit.brief.prompt),
      expect: `Un alcance inicial para ${scenario.title}: proceso, preguntas críticas, límites, prueba con datos ficticios y criterio de éxito.`,
    }
    kit.scopes = (kit.scopes || []).map((scope) => ({
      ...scope,
      what: scope.id === 'minimo'
        ? `Piloto pequeño de ${scenario.focus}: una entrada, una salida, una revisión humana y evidencia guardada.`
        : scope.id === 'estandar'
          ? `Sistema operativo de ${scenario.focus}: varios casos, estados, pruebas, responsables y documentación.`
          : `Versión avanzada de ${scenario.focus}: métricas, alertas, recuperación, histórico y revisión periódica.`,
    }))
    kit.prompts = (kit.prompts || []).slice(0, 10).map((prompt, index) => adaptPrompt(prompt, scenario, index))
    kit.workflows = (kit.workflows || []).slice(0, 1).map((workflow) => adaptWorkflow(workflow, scenario))
    kit.phases = (kit.phases || []).map((phase) => ({
      ...phase,
      goal: `${phase.goal} En este kit se aplica a: ${scenario.focus}.`,
      deliverable: `${phase.deliverable} · Adaptado a ${scenario.output}.`,
    }))
    kit.testData = [
      { name: 'Normal', input: `Caso ficticio completo para ${scenario.title}: ${scenario.entry}.`, expect: `Se genera ${scenario.output} con responsable, estado y evidencia.` },
      { name: 'Incompleto', input: `Falta un dato clave en ${scenario.entry}.`, expect: 'El sistema no inventa: pide el dato, marca bloqueo y conserva registro.' },
      { name: 'Duplicado', input: `El mismo caso llega dos veces por canales distintos.`, expect: 'Se detecta duplicado y no se crean dos acciones reales.' },
      { name: 'Extremo', input: `Caso sensible, urgente o con coste dentro de ${scenario.focus}.`, expect: 'Se detiene, escala a una persona y marca aprobación humana obligatoria.' },
    ]
    kit.delivery = (kit.delivery || []).map((item) => ({
      ...item,
      what: `${item.what} En este kit debe dejar claro cómo operar ${scenario.title}.`,
    }))
    return kit
  })
  const existingIds = new Set(files.map((kit) => kit.id))
  return [...files, ...generated.filter((kit) => !existingIds.has(kit.id))]
}

const institutionalKits = expandInstitutionalKits(kitFiles)

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
    kits: institutionalKits.length,
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
  stages,
  categories,
  projects: areaProjects,
  decks: deckFiles,
  prompts: promptLibrary,
  guides: guideFiles,
  curso: cursoFiles.sort((a, b) => (a.number || 0) - (b.number || 0)),
  kits: institutionalKits.sort((a, b) => (a.order || 0) - (b.order || 0)),
  preguntas: faqFiles,
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
