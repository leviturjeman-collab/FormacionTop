import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const portalDir = path.resolve(scriptDir, '..')
const vaultDir = portalDir
const publicDir = path.join(portalDir, 'public')
const generatedDir = path.join(publicDir, 'generated')

const normalize = (value) => value.split(path.sep).join('/')
const titleFromName = (name) => name.replace(/\.md$/i, '').replace(/^\d+[-_ ]*/, '').replace(/[_-]+/g, ' ').trim()

async function walk(directory, output = []) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    if (['node_modules', 'dist', '.git', '.obsidian', 'public'].includes(entry.name)) continue
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) await walk(absolute, output)
    else output.push(absolute)
  }
  return output
}

function stripFrontmatter(content) {
  return content.replace(/^\uFEFF/, '').replace(/^---\s*[\s\S]*?\s*---\s*/m, '').trim()
}

function getTitle(content, fileName) {
  const match = stripFrontmatter(content).match(/^#\s+(.+)$/m)
  return match?.[1]?.trim() || titleFromName(fileName)
}

function getExcerpt(content) {
  return stripFrontmatter(content)
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/[`*_>\[\]#|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 210)
}

function categoryFor(relativePath) {
  const root = relativePath.split('/')[0] || 'General'
  return root.replace(/^\d+_?/, '').replace(/_/g, ' ').toLowerCase()
}

const moduleDefinitions = [
  { id: 'fundamentos', number: '01', title: 'Pensar antes de automatizar', description: 'Define el problema, la entrada, la salida y cómo sabrás que funciona.', milestone: 'Mapa del problema y criterio de éxito' },
  { id: 'herramientas', number: '02', title: 'Preparar el entorno de trabajo', description: 'Conoce, instala o identifica las herramientas mínimas cuando decidas practicar.', milestone: 'Entorno, checklist o mapa de herramientas' },
  { id: 'diseno', number: '03', title: 'Diseñar el sistema', description: 'Convierte la idea en un flujo con datos, decisiones y responsabilidades claras.', milestone: 'Arquitectura y contrato de datos' },
  { id: 'construccion', number: '04', title: 'Practicar una primera versión', description: 'Convierte la idea en una nota, plantilla, flujo, demo o prototipo cuando tenga sentido.', milestone: 'Artefacto, demo o decisión comprobable' },
  { id: 'calidad', number: '05', title: 'Probar y reparar', description: 'Provoca errores, mide calidad y documenta cómo recuperar el sistema.', milestone: 'Pruebas, logs y caso roto resuelto' },
  { id: 'seguridad', number: '06', title: 'Operar con seguridad', description: 'Protege datos, credenciales, permisos, costes y acciones sensibles.', milestone: 'Checklist de producción y riesgos' },
  { id: 'entrega', number: '07', title: 'Convertirlo en una entrega profesional', description: 'Prepara documentación, demostración y traspaso para otra persona.', milestone: 'Paquete de entrega y demo' },
  { id: 'defensa', number: '08', title: 'Medir y defender lo aprendido', description: 'Explica decisiones, evidencia resultados y propone la siguiente versión si existe proyecto.', milestone: 'Caso de estudio, síntesis o defensa final' },
]

function moduleForPath(relativePath, documentTitle = '') {
  const normalizedTitle = documentTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  if (/setup terminal|homebrew|github cli|vercel|docker|supabase auth|environment|variables de entorno|deploy plataformas/.test(normalizedTitle)) return 'herramientas'
  if (/arquitectura|api contract|json schema|contrato de datos|human approval|vector db/.test(normalizedTitle)) return 'diseno'
  if (/playwright|testing|observabilidad|postmortem|regression|health monitor|evaluador|evaluator/.test(normalizedTitle)) return 'calidad'
  if (/seguridad|gdpr|rgpd|pii|secret|permission|consent|safety/.test(normalizedTitle)) return 'seguridad'
  if (/entrega cliente|propuesta a cliente|onboarding cliente|portfolio|documentacion de entrega/.test(normalizedTitle)) return 'entrega'
  if (/capstone|rubrica|defensa|certificacion/.test(normalizedTitle)) return 'defensa'
  const prefix = Number(relativePath.match(/^(\d+)/)?.[1] || 0)
  if ([0, 1, 2, 3, 9, 12, 14].includes(prefix)) return 'fundamentos'
  if ([4, 10, 15].includes(prefix)) return 'herramientas'
  if ([8, 11, 13, 18].includes(prefix)) return 'diseno'
  if ([5, 27, 34, 35].includes(prefix)) return 'construccion'
  if ([7, 21, 23, 25, 33].includes(prefix)) return 'calidad'
  if ([28].includes(prefix)) return 'seguridad'
  if ([6, 16, 19, 22, 26, 29, 30].includes(prefix)) return 'entrega'
  if ([17, 20, 24].includes(prefix)) return 'defensa'
  return 'construccion'
}

function cleanMarkdown(value) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[`*_>|#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractSection(content, names) {
  const escaped = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const pattern = new RegExp(`^#{1,4}\\s+(?:${escaped})[^\\n]*\\n([\\s\\S]*?)(?=^#{1,4}\\s+|$)`, 'im')
  const match = stripFrontmatter(content).match(pattern)
  return match ? cleanMarkdown(match[1]).slice(0, 520) : ''
}

const fallbackSteps = {
  fundamentos: ['Escribe el problema sin mencionar ninguna herramienta.', 'Define una entrada realista y la salida que necesita el usuario.', 'Fija una métrica y un ejemplo que demostrarán que funciona.', 'Anota una decisión que todavía no puedes tomar.'],
  herramientas: ['Instala únicamente las dependencias necesarias para esta práctica.', 'Crea variables de entorno con valores ficticios.', 'Ejecuta una comprobación mínima desde la terminal.', 'Documenta el comando y el resultado que otra persona debe obtener.'],
  diseno: ['Dibuja el flujo desde la entrada hasta el resultado.', 'Define los campos obligatorios del payload.', 'Marca qué decisiones son automáticas y cuáles requieren una persona.', 'Revisa el diseño contra el objetivo de la actividad o de tu proyecto opcional.'],
  construccion: ['Prepara un caso de prueba con datos ficticios.', 'Implementa primero el camino principal.', 'Guarda la entrada, la decisión y la salida.', 'Ejecuta el flujo y captura una evidencia reproducible.'],
  calidad: ['Define el comportamiento esperado antes de probar.', 'Ejecuta un caso correcto y registra el resultado.', 'Provoca un fallo concreto y localiza su causa.', 'Repara el fallo y añade una prueba que evite su regreso.'],
  seguridad: ['Identifica datos personales, secretos y acciones sensibles.', 'Reduce permisos y elimina datos que no sean necesarios.', 'Añade límite de coste, aprobación o rate limit donde corresponda.', 'Escribe cómo detener y recuperar el sistema.'],
  entrega: ['Ordena código, configuración y documentación.', 'Prepara una demo que otra persona pueda repetir.', 'Explica instalación, uso, límites y solución de errores.', 'Realiza un traspaso usando únicamente el paquete entregado.'],
  defensa: ['Resume el problema y el resultado en una frase.', 'Muestra una evidencia antes y después.', 'Defiende dos decisiones y un descarte.', 'Propón la siguiente versión con coste y criterio de éxito.'],
}

const moduleApplications = {
  fundamentos: 'Utiliza este recurso para comprender la idea, tomar una decisión o elegir si quieres practicarla.',
  herramientas: 'Aplícalo como checklist de estudio o, si tienes proyecto, al entorno real que quieras repetir.',
  diseno: 'Conviértelo en una decisión concreta de arquitectura, datos o interacción para una actividad o proyecto opcional.',
  construccion: 'Úsalo para producir una nota, plantilla, demo, workflow o pieza ejecutable cuando quieras practicar.',
  calidad: 'Aplícalo a un ejemplo, fallo probable o caso de estudio y conserva la evidencia de diagnóstico.',
  seguridad: 'Revísalo contra datos, permisos, costes y acciones sensibles, aunque sea en un caso simulado.',
  entrega: 'Incorpóralo al paquete que recibiría un cliente, profesor o miembro nuevo del equipo.',
  defensa: 'Úsalo como evidencia para explicar qué has aprendido, qué has probado y qué límites todavía existen.',
}

function extractCodeBlocks(content) {
  return [...stripFrontmatter(content).matchAll(/```(?:[a-zA-Z0-9_-]+)?\s*\r?\n([\s\S]*?)```/g)]
    .map((match) => match[1].trim())
    .filter((block) => block.length > 3 && block.length < 650 && !/BEGIN (?:RSA|OPENSSH) PRIVATE KEY/.test(block))
    .filter((block) => /(?:^|\s)(?:npm|npx|pnpm|yarn|pip|python|node|brew|git|gh|docker|vercel|curl|ffmpeg|whisper|export|setx|powershell|bash)(?:\s|$)/im.test(block))
    .slice(0, 3)
}

function walkthroughFor(document, kind, moduleId, title, workflowData) {
  const codeBlocks = extractCodeBlocks(document.content)
  const module = moduleDefinitions.find((item) => item.id === moduleId)
  const commonStart = {
    id: 'prepare', phase: 'Preparar', title: 'Define cómo quieres trabajar esta lección',
    where: 'En tu cuaderno, notas de estudio o proyecto opcional',
    action: `Elige si vas a estudiar “${title}” como lectura guiada, nota, plantilla, práctica o pieza de un proyecto. Escribe una frase con el resultado que quieres obtener.`,
    expected: 'Una frase concreta que conecta esta lección con una idea, decisión, práctica o necesidad real.',
    evidenceLabel: 'Modo de trabajo y objetivo', projectField: 'decision',
  }
  const commonFinish = {
    id: 'document', phase: 'Documentar', title: 'Guarda la nota o evidencia final',
    where: 'En el panel Evidencia de este walkthrough',
    action: 'Describe qué entendiste, qué hiciste si practicaste y qué límite o duda queda abierta.',
    expected: 'Una evidencia comprensible sin necesidad de ver tu pantalla o preguntarte qué hiciste.',
    evidenceLabel: 'Resultado, límite y siguiente acción', projectField: 'evidence',
  }

  if (kind === 'Workflow guiado' && workflowData) {
    const fileName = document.path.split('/').at(-1).replace(/\.md$/i, '.json')
    const nodeSteps = (workflowData.nodes || []).slice(0, 8).map((node, index) => ({
      id: `node-${index + 1}`, phase: 'Construir', title: `Configura el nodo ${index + 1}: ${node.name}`,
      where: `n8n > workflow “${workflowData.name || title}” > nodo “${node.name}”`,
      action: node.type?.includes('webhook') ? 'Abre el nodo, usa la URL de prueba y copia el payload de ejemplo antes de escuchar el evento.' : node.type?.includes('function') || node.type?.includes('code') ? 'Abre el código del nodo, identifica qué campos recibe y comprueba que siempre devuelve un objeto estructurado.' : node.type?.includes('respond') ? 'Define el código HTTP y devuelve únicamente los campos que necesita quien llamó al webhook.' : 'Abre el nodo, selecciona credenciales de prueba y revisa cada campo obligatorio antes de ejecutarlo.',
      expected: `El nodo “${node.name}” termina en verde y muestra una salida que puede utilizar el siguiente nodo.`,
      evidenceLabel: `Salida del nodo ${node.name}`, projectField: index === 0 ? 'input' : index === (workflowData.nodes || []).length - 1 ? 'output' : 'implementation',
    }))
    return [
      commonStart,
      { id: 'import', phase: 'Preparar', title: 'Importa el workflow de trabajo si quieres practicar', where: 'n8n > Workflows > menú de tres puntos > Import from File', action: `Si quieres ejecutarlo, descarga “${fileName}”, impórtalo y ponle un nombre de práctica. Si solo estás estudiando, revisa el diagrama y anota qué nodos contiene.`, expected: `El lienzo muestra ${(workflowData.nodes || []).length} nodos conectados, o tienes una nota clara de qué hace cada tramo.`, evidenceLabel: 'Copia de práctica o resumen del workflow', projectField: 'asset', downloadPath: `/generated/workflows/${fileName}` },
      ...nodeSteps,
      { id: 'test-happy', phase: 'Verificar', title: 'Ejecuta el caso correcto de principio a fin', where: 'n8n > Execute workflow', action: 'Usa un payload ficticio completo. Recorre cada nodo y compara su salida con la entrada del siguiente.', expected: 'Todos los nodos terminan en verde y la respuesta final contiene estado, decisión y siguiente acción.', evidenceLabel: 'Resultado del caso correcto', projectField: 'test' },
      { id: 'test-broken', phase: 'Verificar', title: 'Provoca y controla un fallo', where: 'El mismo workflow, con datos ficticios', action: 'Elimina un campo obligatorio o utiliza una credencial de prueba inválida. Añade una rama que detenga el proceso y explique el error.', expected: 'El workflow no ejecuta una acción externa y devuelve un error que indica qué debe corregirse.', evidenceLabel: 'Fallo provocado y reparación', projectField: 'risk' },
      commonFinish,
    ]
  }

  const exactCommandSteps = codeBlocks.map((command, index) => ({
    id: `command-${index + 1}`, phase: 'Construir', title: `Ejecuta la comprobación ${index + 1}`,
    where: 'Terminal abierta en una carpeta de práctica o en tu proyecto opcional',
    action: 'Revisa rutas y nombres antes de ejecutar. Sustituye únicamente los valores de ejemplo; no pegues secretos en el comando.',
    command,
    expected: 'El comando termina sin errores y puedes explicar qué archivo, servicio o salida ha creado.',
    evidenceLabel: `Salida del comando ${index + 1}`, projectField: 'implementation',
  }))
  const genericSteps = kindStepsForWalkthrough(kind, moduleId, title)
  const middleSteps = exactCommandSteps.length ? [...exactCommandSteps, ...genericSteps].slice(0, 4) : genericSteps
  return [commonStart, ...middleSteps, {
    id: 'verify', phase: 'Verificar', title: 'Comprueba el resultado con un criterio observable',
    where: 'En la aplicación, terminal o herramienta donde acabas de trabajar',
    action: `Repite la acción principal de “${title}” con datos ficticios y compárala con el resultado esperado de la actividad o de tu proyecto opcional.`,
    expected: module.milestone,
    evidenceLabel: 'Comprobación y resultado obtenido', projectField: 'test',
  }, commonFinish]
}

function kindStepsForWalkthrough(kind, moduleId, title) {
  const steps = kindStepsTemplate(kind, moduleId)
  return steps.map((action, index) => ({
    id: `apply-${index + 1}`,
    phase: index < 2 ? 'Practicar' : 'Aplicar',
    title: `${index + 1}. ${action.replace(/[.!]$/, '')}`,
    where: index === 0 ? 'En tus notas de estudio o ficha opcional' : 'En la herramienta, cuaderno o repositorio que elijas',
    action: `${action} Hazlo utilizando “${title}” como referencia, pero conserva únicamente lo que responda al objetivo de la actividad.`,
    expected: index === steps.length - 1 ? 'Una salida lista para revisar: nota, tabla, checklist, decisión, demo o prototipo.' : 'Un avance pequeño, visible y reversible.',
    evidenceLabel: index === steps.length - 1 ? 'Salida aplicada' : `Resultado del paso ${index + 1}`,
    projectField: index === 0 ? 'decision' : index === steps.length - 1 ? 'output' : 'implementation',
  }))
}

function kindStepsTemplate(kind, moduleId) {
  const templates = {
    'Procedimiento': ['Define la señal que activa el procedimiento.', 'Ejecuta el procedimiento sobre una tarea pequeña.', 'Compara la salida con un criterio escrito previamente.', 'Anota cuándo debes detenerlo o pedir revisión humana.'],
    'Proyecto': ['Compara el caso con un problema real o hipotético.', 'Selecciona dos decisiones reutilizables y una que cambiarías.', 'Si quieres practicar, construye la versión más pequeña que produzca una salida.', 'Prueba un caso correcto o escribe el límite del diseño.'],
    'Guía': ['Comprueba requisitos y versiones en la terminal.', 'Realiza la configuración con datos ficticios.', 'Ejecuta una prueba mínima reproducible.', 'Documenta el comando y la reparación del error más probable.'],
    'Lección': fallbackSteps[moduleId],
  }
  return templates[kind] || fallbackSteps[moduleId]
}

function adaptDocument(document, workflowJsonByName) {
  const source = document.content
  const purpose = extractSection(source, ['Para qué sirve', 'Para que sirve', 'Objetivo', 'Propósito', 'Proposito'])
  const deliverableSource = extractSection(source, ['Entregable final', 'Entregable', 'Salida esperada', 'Resultado'])
  const title = document.title
    .replace(/^Desarrollo completo\s*-\s*/i, '')
    .replace(/^Documentacion\s*-\s*/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const moduleId = moduleForPath(document.path, title)
  const module = moduleDefinitions.find((item) => item.id === moduleId)
  const kind = document.type === 'workflow' ? 'Workflow guiado' : document.type === 'skill' ? 'Procedimiento' : /proyecto|caso/i.test(title) ? 'Proyecto' : /instal|setup|gu[ií]a/i.test(title) ? 'Guía' : 'Lección'
  const kindSummaries = {
    'Workflow guiado': `Construirás una versión controlada de “${title}”, definirás su payload y comprobarás un caso correcto y otro roto.`,
    'Procedimiento': `Aprenderás cuándo utilizar “${title}”, cómo aplicarlo con límites claros y qué salida debes conservar como evidencia.`,
    'Proyecto': `Usarás “${title}” como caso de trabajo: puedes estudiarlo, adaptarlo a un proyecto opcional o convertirlo en una plantilla.`,
    'Guía': `Prepararás “${title}” dentro de tu entorno y dejarás una comprobación que otra persona pueda repetir.`,
    'Lección': `Entenderás la idea central de “${title}” y la convertirás en una nota, decisión o práctica opcional.`,
  }
  const kindSteps = {
    'Workflow guiado': ['Define el evento que inicia el flujo y crea un payload ficticio.', 'Dibuja los nodos necesarios antes de importar o programar nada.', 'Configura credenciales de prueba y ejecuta el camino principal.', 'Provoca un error, añade su manejo y conserva el registro.'],
    'Procedimiento': ['Escribe la situación exacta que debería activar este procedimiento.', 'Aplícalo a una tarea pequeña, real o simulada.', 'Revisa la salida contra un criterio observable.', 'Anota cuándo no debería utilizarse y guarda una evidencia.'],
    'Proyecto': ['Compara el caso con un contexto real o hipotético y marca diferencias importantes.', 'Elige dos decisiones que puedes reutilizar y una que debes cambiar.', 'Construye una versión pequeña con datos ficticios solo si quieres practicar.', 'Documenta resultado, límite y siguiente mejora.'],
    'Guía': ['Comprueba requisitos y versiones antes de instalar.', 'Ejecuta la instalación con variables ficticias.', 'Realiza una prueba mínima y captura el resultado.', 'Escribe la reparación del error más probable.'],
    'Lección': fallbackSteps[moduleId],
  }
  const summary = kindSummaries[kind]
  const context = purpose && !/b[oó]veda|carpeta|archivo existe/i.test(purpose) ? purpose.split(/(?<=[.!?])\s+/)[0].slice(0, 240) : module.description
  const deliverable = deliverableSource ? deliverableSource.split(/(?<=[.!?])\s+/)[0].slice(0, 180) : module.milestone
  const workflowFileName = document.path.split('/').at(-1).replace(/\.md$/i, '.json')
  const workflowData = workflowJsonByName.get(workflowFileName)
  return {
    id: document.id,
    title,
    moduleId,
    kind,
    duration: Math.min(45, Math.max(15, document.minutes)),
    summary,
    studentOutcome: `Al terminar habrás convertido “${title}” en una nota, decisión, evidencia o práctica verificable.`,
    projectApplication: moduleApplications[moduleId],
    context,
    steps: kindSteps[kind],
    deliverable,
    checks: [
      'La salida está vinculada a una necesidad, pregunta o práctica concreta.',
      'Existe una evidencia que otra persona puede revisar.',
      'Has anotado al menos un límite, riesgo o caso que todavía falla.',
    ],
    walkthrough: walkthroughFor(document, kind, moduleId, title, workflowData),
    sourcePath: document.path,
    sourceWords: document.words,
  }
}

await fs.mkdir(generatedDir, { recursive: true })
const files = await walk(vaultDir)
const markdownFiles = files.filter((file) => file.endsWith('.md'))
const documents = []

for (const absolutePath of markdownFiles) {
  const content = await fs.readFile(absolutePath, 'utf8')
  const relativePath = normalize(path.relative(vaultDir, absolutePath))
  const plain = stripFrontmatter(content)
  const id = Buffer.from(relativePath).toString('base64url')
  documents.push({
    id,
    title: getTitle(content, path.basename(absolutePath)),
    path: relativePath,
    folder: relativePath.split('/')[0],
    category: categoryFor(relativePath),
    excerpt: getExcerpt(content),
    words: plain.split(/\s+/).filter(Boolean).length,
    minutes: Math.max(1, Math.ceil(plain.split(/\s+/).filter(Boolean).length / 210)),
    content,
    type: relativePath.includes('workflows_n8n_40') ? 'workflow' : relativePath.includes('skills_40') ? 'skill' : 'document',
  })
}

documents.sort((a, b) => a.path.localeCompare(b.path, 'es'))
const workflows = documents.filter((doc) => doc.type === 'workflow' && !doc.path.endsWith('/README.md'))
const skills = documents.filter((doc) => doc.type === 'skill' && !doc.path.endsWith('/README.md'))
const workflowJsonByName = new Map()
for (const file of files.filter((file) => file.endsWith('.json') && file.includes('workflows_n8n_40'))) {
  try { workflowJsonByName.set(path.basename(file), JSON.parse(await fs.readFile(file, 'utf8'))) } catch { /* Invalid workflows are reported by validation. */ }
}
const studentResources = documents.map((document) => adaptDocument(document, workflowJsonByName))
const curationQueries = {
  fundamentos: ['mapa de la formacion', 'fase 00 orientacion y diagnostico', 'matriz por objetivo de alumno', 'roadmap 30 dias fundamentos', 'onboarding mapa de boveda diagnostico', 'prompting profesional formatos fuentes'],
  herramientas: ['setup terminal', 'docker bases de datos y apis', 'deploy por plataforma', 'starter next vercel env', 'starter supabase auth', 'starter docker stack'],
  diseno: ['arquitecturas y mini repos', 'api contract writer', 'json schema', 'human approval designer', 'vector db rag y mcp', 'workflow designer'],
  construccion: ['01 lead qualification crm', 'proyecto 04 sistema rag', 'starter multi llm router', 'starter video remotion', 'browser research agent', 'starter n8n lead triage'],
  calidad: ['starter playwright e2e', 'ci cd testing y observabilidad', 'prompt regression eval', 'postmortem', 'api health monitor', 'rag answer evaluator'],
  seguridad: ['rgpd gdpr', 'pii redaction pipeline', 'mcp permission auditor', 'consent checker gdpr', 'env secret auditor', 'agent safety reviewer'],
  entrega: ['entrega cliente', 'plantilla de propuesta a cliente', 'onboarding cliente', 'demos casos de estudio y portfolio', 'contrato alcance', 'pagina oferta'],
  defensa: ['capstone final sistema completo', 'rubrica capstone', 'defensa final', 'guion de defensa oral', 'portfolio caso de estudio propuesta capstone', 'certificacion'],
}

function normalizeForCuration(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, ' ').toLowerCase().trim()
}

const studentModules = moduleDefinitions.map((module) => {
  const candidates = studentResources
    .filter((resource) => resource.moduleId === module.id)
    .map((resource) => {
      const title = resource.title.toLowerCase()
      let score = resource.sourceWords >= 900 ? 3 : 0
      if (/gu[ií]a|skill|workflow|proyecto|caso|automatiza|seguridad|entrega|defensa/.test(title)) score += 3
      if (/readme|solucionario|documentacion|decisiones/.test(title)) score -= 3
      return { resource, score }
    })
    .sort((a, b) => b.score - a.score || a.resource.title.localeCompare(b.resource.title, 'es'))
    .slice(0, 6)
    .map((item) => item.resource.id)
  const selected = []
  for (const query of curationQueries[module.id]) {
    const normalizedQuery = normalizeForCuration(query)
    const match = studentResources.find((resource) => !selected.includes(resource.id) && normalizeForCuration(resource.title).includes(normalizedQuery))
    if (match) selected.push(match.id)
  }
  for (const candidate of candidates) {
    if (selected.length >= 6) break
    if (!selected.includes(candidate)) selected.push(candidate)
  }
  return { ...module, lessonIds: selected.slice(0, 6) }
})

const workflowSource = path.join(vaultDir, '35_AUTOMATIZACIONES_SKILLS_BIBLIOTECA', 'workflows_n8n_40')
const workflowTarget = path.join(generatedDir, 'workflows')
await fs.mkdir(workflowTarget, { recursive: true })
try {
  const workflowFiles = (await fs.readdir(workflowSource)).filter((name) => name.endsWith('.json'))
  for (const name of workflowFiles) await fs.copyFile(path.join(workflowSource, name), path.join(workflowTarget, name))
} catch {
  // The portal still works when the optional workflow library is absent.
}

const payload = {
  generatedAt: new Date().toISOString(),
  stats: {
    documents: documents.length,
    workflows: workflows.length,
    skills: skills.length,
    words: documents.reduce((sum, doc) => sum + doc.words, 0),
  },
  documents,
  workflows,
  skills,
}

await fs.writeFile(path.join(publicDir, 'catalog.json'), JSON.stringify(payload), 'utf8')
await fs.writeFile(path.join(publicDir, 'student-catalog.json'), JSON.stringify({
  generatedAt: payload.generatedAt,
  stats: { resources: studentResources.length, lessons: studentModules.reduce((sum, module) => sum + module.lessonIds.length, 0), modules: studentModules.length },
  modules: studentModules,
  resources: studentResources,
}), 'utf8')
console.log(`Catalogo generado: ${documents.length} documentos, ${workflows.length} workflows y ${skills.length} skills.`)
