const CATEGORY_META = [
  {
    id: 'aprender-desde-cero',
    title: 'Aprender desde cero',
    intro: 'Prompts institucionales para entender una herramienta, explicar su valor a personas no técnicas y decidir por dónde empezar sin convertir la formación en una lista de botones.',
  },
  {
    id: 'elegir-herramienta',
    title: 'Elegir herramienta',
    intro: 'Prompts para comparar opciones, justificar una decisión y evitar elegir tecnología por moda cuando el proyecto necesita criterio, coste y mantenimiento.',
  },
  {
    id: 'crear-proyecto',
    title: 'Crear proyecto',
    intro: 'Prompts para convertir una necesidad institucional en una primera versión, con usuarios, alcance, pantallas, datos, estados y criterio de terminado.',
  },
  {
    id: 'automatizar',
    title: 'Automatizar',
    intro: 'Prompts para diseñar flujos institucionales con disparador, validación, aprobación, registro, recuperación y parada controlada.',
  },
  {
    id: 'crear-contenido',
    title: 'Crear contenido',
    intro: 'Prompts para crear piezas de comunicación, documentación, imagen, vídeo o presentación con revisión, tono, trazabilidad y uso aprobado.',
  },
  {
    id: 'programar',
    title: 'Programar',
    intro: 'Prompts para pedir cambios técnicos, prototipos, integraciones y revisiones de código sin romper lo que ya funciona.',
  },
  {
    id: 'conectar-datos',
    title: 'Conectar datos',
    intro: 'Prompts para ordenar documentos, datos, tablas y fuentes propias antes de usarlos en sistemas internos o respuestas asistidas por IA.',
  },
  {
    id: 'crear-agentes',
    title: 'Crear agentes',
    intro: 'Prompts para diseñar agentes con herramientas permitidas, límites, permisos mínimos, dudas escaladas y aprobación humana.',
  },
  {
    id: 'probar-reparar',
    title: 'Probar y reparar',
    intro: 'Prompts para diagnosticar fallos, diseñar pruebas, medir calidad, comparar versiones y dejar evidencia de reparación.',
  },
  {
    id: 'seguridad-coste-privacidad',
    title: 'Seguridad, coste y privacidad',
    intro: 'Prompts para revisar datos sensibles, permisos, presupuesto, planes, acciones irreversibles, cumplimiento y riesgos antes de activar nada.',
  },
  {
    id: 'entregar-equipo-cliente',
    title: 'Entregar a cliente o equipo',
    intro: 'Prompts para convertir un trabajo en una entrega repetible: manual, demo, responsables, límites, evidencias, recuperación y siguiente versión.',
  },
  {
    id: 'proyecto-institucional',
    title: 'Proyecto institucional',
    intro: 'Prompts para montar sistemas grandes que combinan herramientas, prompts, automatizaciones, skills, datos, gobierno y operación.',
  },
]

const CATEGORY_BY_ID = new Map(CATEGORY_META.map((meta) => [meta.id, meta]))
const MANUAL_ONLY_TOOLS = new Set(['wispr-flow'])

const TOOL_SECTIONS = [
  {
    id: 'asistentes-modelos',
    title: 'Asistentes IA y modelos',
    description: 'Herramientas para pensar, redactar, revisar, comparar modelos y trabajar con asistentes sin perder criterio.',
    toolIds: ['openai', 'claude', 'anthropic', 'gemini', 'codex', 'claude-code', 'copilot', 'perplexity', 'ollama', 'huggingface', 'notebooklm', 'replicate'],
    useCase: 'Decidir, redactar, analizar, revisar y documentar trabajo institucional con IA.',
    audience: 'Alumnos, docentes, dirección, consultores y equipos mixtos.',
  },
  {
    id: 'automatizacion-comunicacion',
    title: 'Automatización y comunicación',
    description: 'Herramientas que conectan formularios, correos, avisos, aprobaciones, mensajes y tareas repetidas.',
    toolIds: ['n8n', 'zapier', 'make', 'pipedream', 'slack', 'gmail', 'telegram', 'whatsapp'],
    useCase: 'Convertir procesos repetidos en flujos medibles, auditables y con freno humano.',
    audience: 'Operaciones, soporte, ventas, administración, atención al cliente y backoffice.',
  },
  {
    id: 'apps-codigo-deploy',
    title: 'Apps, código y despliegue',
    description: 'Herramientas para construir interfaces, repositorios, integraciones, pruebas y publicaciones reales.',
    toolIds: ['lovable', 'base44', 'bolt', 'replit', 'framer', 'v0', 'cursor', 'github', 'python', 'node', 'typescript', 'react', 'vscode', 'tailwind', 'docker', 'vercel', 'colab'],
    useCase: 'Pasar de idea a producto navegable, probado, versionado y desplegado.',
    audience: 'Builders, perfiles técnicos, founders, alumnos avanzados y equipos que entregan software.',
  },
  {
    id: 'datos-conocimiento',
    title: 'Datos, documentos y conocimiento',
    description: 'Herramientas para ordenar fuentes, tablas, bases de datos, documentos y conocimiento interno.',
    toolIds: ['airtable', 'sheets', 'supabase', 'postgres', 'langchain', 'obsidian', 'notion'],
    useCase: 'Preparar datos institucionales para búsqueda, reporting, RAG, auditoría y toma de decisiones.',
    audience: 'Equipos con documentación, CRM, operaciones, reporting, investigación o bases de conocimiento.',
  },
  {
    id: 'contenido-visual',
    title: 'Contenido, imagen, vídeo y venta',
    description: 'Herramientas para piezas visuales, presentaciones, vídeo, voz, campañas y comunicación profesional.',
    toolIds: ['higgsfield', 'nano-banana', 'seedance-2-5', 'canva', 'heygen', 'descript', 'gamma', 'elevenlabs', 'midjourney', 'runway', 'figma'],
    useCase: 'Crear piezas revisables, coherentes con la marca y listas para enseñar o vender.',
    audience: 'Marketing, formación, agencias, creadores, consultores y equipos comerciales.',
  },
]

const GENERAL_SECTION = {
  id: 'prompts-generales',
  title: 'Prompts generales del curso',
  description: 'Prompts que vienen de la biblioteca anterior, del programa y de los kits maestros, separados en lotes pequenos.',
  useCase: 'Trabajar por intención cuando todavía no sabes qué herramienta toca.',
  audience: 'Cualquier alumno o responsable que quiera copiar, pegar y rellenar corchetes.',
}

const BASE_FILL = [
  ['[INSTITUCION]', 'Nombre o tipo de organización: academia, despacho, clínica, administración, pyme, departamento interno o cliente.'],
  ['[AREA_EQUIPO]', 'Área que usará el resultado: dirección, operaciones, marketing, ventas, soporte, formación, legal, producto, tecnología o administración.'],
  ['[PERFIL_PERSONA]', 'Persona que recibirá la explicación: principiante, docente, técnico, responsable de negocio, cliente, alumno o equipo mixto.'],
  ['[PROCESO_O_PROBLEMA]', 'Proceso, necesidad o problema real que quieres resolver. Escríbelo sin nombrar todavía una herramienta.'],
  ['[ENTRADA_REAL]', 'Qué información entra: formularios, documentos, tickets, correos, llamadas, imágenes, código, datos o decisiones.'],
  ['[SALIDA_ESPERADA]', 'Qué debe existir al terminar: informe, flujo, web, ficha, tabla, borrador, dashboard, automatización o entrega.'],
  ['[VOLUMEN_Y_FRECUENCIA]', 'Cuántos casos habrá y cada cuánto ocurre: al día, semana, mes, campaña, curso o proyecto.'],
  ['[RESTRICCIONES]', 'Límites de tiempo, presupuesto, permisos, herramientas disponibles, idioma, formato, normativa o personas que aprueban.'],
  ['[DATOS_SENSIBLES]', 'Datos que no deben pegarse o que exigen cuidado: clientes, alumnos, salud, menores, contratos, claves, facturas o información interna.'],
  ['[FECHA_REVISION]', 'Fecha en la que se revisa la respuesta para no depender de precios, planes o funciones desactualizadas.'],
]

const BASE_MODEL =
  'Usa una IA capaz de razonar y trabajar con contexto largo. Para decisiones importantes, compara la salida con una segunda IA y conserva la evidencia.'

const FAMILY_GUIDANCE = {
  canDo: [
    'Convertir una necesidad institucional en una ficha, plan, prueba o entrega que otra persona pueda revisar.',
    'Adaptar la explicación a perfiles distintos sin perder criterios de seguridad, coste y mantenimiento.',
    'Dejar trazabilidad: qué se sabe, qué se supone, qué se debe comprobar y qué evidencia se guarda.',
  ],
  cantDo: [
    'No sustituye la aprobación de una persona responsable cuando hay datos sensibles, dinero, clientes o publicación.',
    'No confirma precios, límites legales ni cambios recientes del proveedor: obliga a marcarlos para revisión oficial.',
    'No convierte una mala entrada en una decisión fiable; si faltan datos, debe preguntar antes de inventar.',
  ],
  tips: [
    'Rellena los corchetes antes de enviar. Si un campo no aplica, escribe NO APLICA y explica por qué.',
    'Pide siempre una prueba con datos ficticios antes de usar información real de la institución.',
    'Guarda el resultado útil en Mi proyecto junto con fecha, versión, responsable y decisión tomada.',
  ],
}

const EXTRA_TASKS = [
  ['aprender-desde-cero', 'Mapa institucional de primeros pasos', 'entender qué lugar ocupa la herramienta en una organización y qué debe aprender primero cada perfil', 'No expliques botones sueltos: separa propósito, entradas, salidas, riesgos y primera práctica segura.'],
  ['aprender-desde-cero', 'Guía para formar a un equipo mixto', 'preparar una explicación para personas con niveles distintos sin perder precisión operativa', 'Incluye versión para principiante, responsable y persona técnica, con una evidencia distinta para cada una.'],
  ['aprender-desde-cero', 'Glosario institucional aplicado', 'traducir el vocabulario de la herramienta a lenguaje de trabajo y decisiones reales', 'Cada término debe tener ejemplo, error típico, señal de revisión y relación con el proceso institucional.'],

  ['elegir-herramienta', 'Matriz de decisión institucional', 'comparar esta herramienta con alternativas y decidir si entra o no en el sistema', 'Puntúa ajuste, coste, privacidad, dependencia, mantenimiento, reversibilidad y curva de aprendizaje.'],
  ['elegir-herramienta', 'Decisión de comprar, probar o descartar', 'decidir si se abre cuenta, se hace piloto o se descarta la herramienta', 'Termina con una recomendación única y las condiciones que harían cambiar esa decisión.'],
  ['elegir-herramienta', 'Comparativa para comité no técnico', 'explicar la elección a dirección, cliente o equipo sin vender humo ni esconder riesgos', 'Usa lenguaje ejecutivo, costes visibles, riesgos claros y una prueba pequeña antes de comprometerse.'],

  ['crear-proyecto', 'Ficha institucional de proyecto', 'convertir una necesidad en una ficha de proyecto que sirva para construir, revisar y delegar', 'Incluye objetivo, usuarios, entradas, salidas, límites, responsable, cadencia y criterio de éxito observable.'],
  ['crear-proyecto', 'Versión mínima institucional', 'recortar el proyecto hasta una primera versión que se pueda usar sin sobredimensionarla', 'Separa imprescindible, manual temporal, fuera de alcance y condición concreta para pasar a la versión dos.'],
  ['crear-proyecto', 'Mapa de pantallas, estados y permisos', 'diseñar la experiencia, estados vacíos, errores y permisos antes de pedir construcción', 'Incluye qué ve cada rol, qué puede hacer, qué no puede tocar y cómo se recupera un cambio.'],

  ['automatizar', 'Flujo institucional con aprobación', 'diseñar un proceso automatizado con freno humano antes de cualquier acción sensible', 'Incluye disparador, validación, decisión, aprobación, acción, registro, error y parada.'],
  ['automatizar', 'Automatización semanal de equipo', 'convertir una tarea repetida en un flujo recurrente controlado y auditable', 'Evita bucles infinitos, duplicados, mensajes automáticos sin revisión y consumo sin límite.'],
  ['automatizar', 'Diseño de reintentos y recuperación', 'preparar qué pasa cuando una automatización falla, se duplica o encuentra datos incompletos', 'Cada fallo debe conservar entrada, motivo, responsable, siguiente acción y estado final.'],
  ['automatizar', 'Conexión entre herramientas institucionales', 'definir cómo esta herramienta se conecta con otras sin perder datos ni permisos', 'Especifica campos que viajan, credenciales mínimas, logs, pruebas y alternativa manual.'],

  ['crear-contenido', 'Calendario editorial institucional', 'planificar contenido útil para una organización con propósito, revisión y evidencia', 'Cada pieza debe tener audiencia, canal, fuente, responsable, estado de aprobación y métrica.'],

  ['programar', 'Cambio técnico pequeño y reversible', 'pedir una modificación técnica acotada con pruebas y forma de volver atrás', 'Exige archivos afectados, diff pequeño, prueba antes/después y nada de reescrituras completas sin motivo.'],
  ['programar', 'Integración técnica institucional', 'diseñar cómo conectar la herramienta con un producto, web, API, repositorio o base de datos', 'Incluye contrato de datos, secretos, entorno de prueba, errores esperados y observabilidad mínima.'],
  ['programar', 'Revisión de implementación antes de publicar', 'auditar una implementación para detectar riesgos antes de que la use un equipo real', 'Ordena hallazgos por severidad y pide evidencia concreta, no opiniones de estilo.'],

  ['conectar-datos', 'Inventario de datos institucionales', 'saber qué datos existen, dónde viven, quién los puede usar y qué salida permiten', 'Distingue fuente oficial, copia, dato sensible, dato incompleto, duplicado y dato que no debe salir.'],
  ['conectar-datos', 'Preparar una base de conocimiento', 'convertir documentos internos en una base consultable con fuentes y límites claros', 'Incluye troceado, metadatos, permisos, preguntas de prueba, respuestas sin fuente y actualización.'],

  ['crear-agentes', 'Agente institucional con permisos mínimos', 'diseñar un agente que consulta o actúa sin salirse de su mandato', 'Define herramientas permitidas, acciones prohibidas, memoria, escalado, límite de pasos y aprobación humana.'],
  ['crear-agentes', 'Ficha de herramientas para un agente', 'describir cada herramienta que podrá usar un agente para que elija bien y se detenga cuando toque', 'Cada herramienta necesita cuándo usarla, cuándo no, entrada, salida, error y coste.'],
  ['crear-agentes', 'Escalado humano y trazabilidad del agente', 'preparar cuándo el agente debe parar, preguntar o enviar el caso a una persona responsable', 'Incluye dudas, conflictos, datos sensibles, baja confianza, acciones irreversibles y registro de decisión.'],

  ['probar-reparar', 'Plan de pruebas institucional', 'crear casos de prueba que bloqueen la entrega si el sistema no responde con calidad suficiente', 'Incluye normal, incompleto, duplicado, extremo, malicioso y cambio de proveedor.'],
  ['probar-reparar', 'Postmortem de fallo operativo', 'analizar una incidencia sin buscar culpables y convertirla en mejora del sistema', 'Separa línea temporal, impacto, causa raíz, detección, reparación, prevención y responsable.'],

  ['seguridad-coste-privacidad', 'Revisión de datos sensibles y permisos', 'detectar qué información no debe pegarse, compartirse o automatizarse sin control', 'Clasifica datos, permisos, base legal, retención, exportación, borrado, responsable y revisión humana.'],
  ['seguridad-coste-privacidad', 'Presupuesto y límites de consumo', 'estimar coste antes de escalar el uso de la herramienta en una institución', 'Calcula prueba, diez casos, cien casos, mil casos, margen de error y señal de parada.'],
  ['seguridad-coste-privacidad', 'Acciones irreversibles y control humano', 'marcar qué acciones no pueden quedar totalmente automatizadas', 'Incluye enviar, publicar, borrar, cobrar, cambiar permisos, contactar personas y compartir datos.'],
  ['seguridad-coste-privacidad', 'Checklist de cumplimiento operativo', 'revisar privacidad, seguridad, propiedad, licencias y política interna antes de una entrega', 'Distingue lo técnico, lo legal, lo contractual, lo reputacional y lo que debe revisar una persona experta.'],

  ['entregar-equipo-cliente', 'Manual de uso institucional', 'crear una guía para que otra persona pueda usar el sistema sin preguntar al constructor', 'Incluye instalación, acceso, uso diario, errores, recuperación, límites, coste y responsable.'],

  ['proyecto-institucional', 'Arquitectura institucional completa', 'diseñar un sistema grande que combine herramienta, prompts, automatizaciones, datos, agentes y gobierno', 'Divide la propuesta en fases, entregables, riesgos, pruebas, operación y criterios para crecer sin desorden.'],
]

const BASE_FAMILY_CATEGORY = {
  'definir-idea': 'crear-proyecto',
  'organizar-proyecto': 'crear-proyecto',
  'trabajo-diario': 'aprender-desde-cero',
  'crear-web': 'crear-proyecto',
  'datos-propios': 'conectar-datos',
  'arreglar-errores': 'probar-reparar',
  'pedir-cambios': 'programar',
  'contenido-negocio': 'crear-contenido',
}

const KIT_SCENARIOS = [
  ['Sistema operativo de IA para equipo', 'coordinar herramientas, prompts, automatizaciones, permisos y evidencias para que un equipo trabaje con IA de forma consistente'],
  ['Portal web o app institucional', 'diseñar una web o aplicación institucional con contenido real, rutas claras, despliegue, QA y mantenimiento'],
  ['Sistema documental y RAG', 'convertir documentos internos en respuestas con fuentes, permisos, actualización y prueba de calidad'],
  ['Máquina de contenido y presentaciones', 'crear un sistema de contenido, decks, guiones y piezas visuales con revisión editorial y calendario'],
  ['Agentes de código, QA y producción', 'organizar agentes y asistentes de código con repositorio, tests, revisión humana, deploy y recuperación'],
  ['CRM, datos y reporting institucional', 'conectar captación, datos, seguimiento, reporting y decisiones comerciales sin perder trazabilidad'],
]

const SOURCE_LABELS = {
  'Biblioteca anterior': 'Biblioteca anterior',
  Programa: 'Programa',
  'Kits institucionales': 'Kits institucionales',
}

function wordCount(value) {
  return String(value || '').trim().split(/\s+/).filter(Boolean).length
}

function compact(value, max = 280) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}...`
}

function categoryForToolPrompt(name) {
  const text = String(name || '').toLowerCase()
  if (/investigar|comparar|opciones|decisi/.test(text)) return 'elegir-herramienta'
  if (/automatizar|workflow|flujo/.test(text)) return 'automatizar'
  if (/agente|l[ií]mites|permisos/.test(text)) return 'crear-agentes'
  if (/calidad|error|diagnosticar|evaluar|reparar/.test(text)) return 'probar-reparar'
  if (/dato|documento|extraer|informaci[oó]n/.test(text)) return 'conectar-datos'
  if (/c[oó]digo|cambio|programar/.test(text)) return 'programar'
  if (/texto|imagen|v[ií]deo|storyboard|pieza/.test(text)) return 'crear-contenido'
  if (/documentar|entregar/.test(text)) return 'entregar-equipo-cliente'
  if (/web|aplicaci[oó]n|interfaz|proyecto/.test(text)) return 'crear-proyecto'
  return 'aprender-desde-cero'
}

function slug(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'general'
}

function chunks(items, size = 50) {
  const out = []
  for (let index = 0; index < items.length; index += size) out.push(items.slice(index, index + size))
  return out
}

function sectionForTool(tool) {
  return TOOL_SECTIONS.find((section) => section.toolIds.includes(tool.id)) || TOOL_SECTIONS[0]
}

function summarizeCategories(entries) {
  const counts = new Map()
  for (const entry of entries) {
    const title = CATEGORY_BY_ID.get(entry.categoryId)?.title || entry.categoryId || 'General'
    counts.set(title, (counts.get(title) || 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'))
    .slice(0, 5)
    .map(([title, count]) => `${title} (${count})`)
    .join(', ')
}

function promptCore(tool, task, index) {
  const [categoryId, name, outcome, rule] = task
  const guide = tool.guide || {}
  const internalPieces = (guide.catalog?.items || [])
    .slice(0, 5)
    .map((item) => `${item.name}: ${item.what}`)
    .join('; ')
  const toolRole = compact(guide.plain || `Herramienta institucional: ${tool.label}.`, 340)
  const usage = compact(guide.usage?.explanation || `Revisa cómo ${tool.label} mide uso, límites, créditos, tokens, tareas, ejecuciones o almacenamiento antes de escalar.`, 260)

  let text = `Actúa como arquitecta institucional de sistemas de IA y operaciones. Tu tarea es ayudarme a usar ${tool.label} dentro de una organización real, con criterio de gobierno, privacidad, coste, mantenimiento y evidencia. No escribas una explicación genérica de la herramienta ni una lista bonita de posibilidades: convierte mi caso en una decisión, una prueba y una entrega que otra persona pueda revisar.\n\n## Contexto que debes usar\nInstitución: [INSTITUCION]. Área o equipo: [AREA_EQUIPO]. Persona que necesita entenderlo: [PERFIL_PERSONA]. Proceso o problema: [PROCESO_O_PROBLEMA]. Entrada real: [ENTRADA_REAL]. Salida esperada: [SALIDA_ESPERADA]. Volumen y frecuencia: [VOLUMEN_Y_FRECUENCIA]. Restricciones: [RESTRICCIONES]. Datos sensibles o prohibidos: [DATOS_SENSIBLES]. Fecha de revisión: [FECHA_REVISION].\n\n## Encargo institucional\nNecesito ${outcome} usando ${tool.label} solo si encaja. En esta herramienta, el papel de partida es este: ${toolRole} Piezas internas que debes tener presentes: ${internalPieces || 'entrada, salida, permisos, historial, exportación y forma de revisar resultados'}. Regla específica del encargo: ${rule}\n\n## Cómo debes trabajar\nPrimero revisa si los corchetes están completos. Si falta un dato que cambie la decisión, hazme una sola pregunta y espera mi respuesta. Si puedes avanzar con un supuesto menor, márcalo como SUPUESTO y explica cómo se comprobaría. Adapta el lenguaje a [PERFIL_PERSONA]: si es principiante, traduce cada palabra técnica; si es dirección, resume impacto, riesgo y coste; si es equipo técnico, añade contratos de datos, permisos y pruebas. No uses datos reales en ejemplos: inventa datos ficticios realistas y señala que son ficticios.\n\n## Salida obligatoria\nDevuelve la respuesta en este orden. Uno: ficha institucional de menos de 180 palabras con objetivo, usuario, entrada, salida, límite y criterio de éxito. Dos: decisión sobre si ${tool.label} es suficiente, excesiva o insuficiente, comparándola con una alternativa más simple y con la opción de hacerlo manualmente en la primera versión. Tres: pasos concretos para ejecutar el encargo, indicando pantalla, botón, campo, archivo, nodo o espacio de trabajo cuando aplique. Cuatro: prueba de aceptación con caso normal, incompleto, duplicado y extremo. Cinco: riesgos de privacidad, permisos, coste, dependencia del proveedor y mantenimiento. Seis: evidencia que debo guardar: archivo, captura, enlace, log, tabla o decisión escrita.\n\n## Control institucional\nAntes de recomendar activar, publicar, enviar, borrar, cobrar, cambiar permisos o compartir datos, marca APROBACIÓN HUMANA OBLIGATORIA. Define cómo se detiene el proceso si algo falla. Explica cómo se mide el consumo en ${tool.label}: ${usage} No inventes precios ni límites; si pueden haber cambiado, escribe COMPROBAR EN LA WEB OFICIAL. Termina con una siguiente acción de menos de treinta minutos y una frase de cierre que empiece por: La decisión institucional es.`

  while (wordCount(text) < 590) {
    text += `\n\nAñade también una mini matriz RACI con responsable, aprobador, persona consultada e informada. Incluye una versión para piloto con datos ficticios y una versión para uso real, separadas claramente. Si el uso real exige contrato, licencia, revisión legal, política interna o validación de seguridad, no lo des por resuelto: déjalo como bloqueo visible.`
  }

  return {
    id: `${categoryId}:${tool.id}:extra-${String(index + 1).padStart(2, '0')}`,
    categoryId,
    toolId: tool.id,
    toolLabel: tool.label,
    source: 'Banco institucional',
    name: `${tool.label} · ${name}`,
    when: `Úsalo cuando necesites ${outcome}.`,
    prompt: text,
    fill: BASE_FILL,
    expect: `Una salida institucional con decisión, pasos, prueba, riesgos, evidencia y siguiente acción para ${tool.label}.`,
    next: 'Guarda la decisión en Mi proyecto y usa la prueba con datos ficticios antes de tocar cuentas o datos reales.',
  }
}

function importToolPrompt(tool, prompt, index) {
  const categoryId = categoryForToolPrompt(prompt.name)
  let text = `Actúa como responsable institucional y adapta este encargo de ${tool.label} a una organización real. Mantén el objetivo del prompt original, pero añade gobierno, privacidad, coste, evidencia, revisión humana y prueba con datos ficticios. Contexto obligatorio: institución [INSTITUCION], área [AREA_EQUIPO], persona [PERFIL_PERSONA], proceso [PROCESO_O_PROBLEMA], entrada [ENTRADA_REAL], salida [SALIDA_ESPERADA], volumen [VOLUMEN_Y_FRECUENCIA], restricciones [RESTRICCIONES], datos sensibles [DATOS_SENSIBLES] y fecha [FECHA_REVISION].\n\n## Prompt base que debes ejecutar\n${prompt.prompt}\n\n## Cierre institucional obligatorio\nAntes de terminar, convierte la respuesta en una ficha verificable: decisión, pasos, riesgos, prueba normal/incompleta/duplicada/extrema, evidencia que se guarda, responsable, coste o consumo que se mide y condición para no activar. Si algo depende de precios, planes, permisos o funciones actuales, escribe COMPROBAR EN LA WEB OFICIAL. No des el trabajo por listo para producción sin aprobación humana cuando haya datos sensibles, publicación, dinero o contacto con personas.`

  while (wordCount(text) < 590) {
    text += `\n\nSi el resultado va dirigido a alguien que empieza desde cero, traduce cada término técnico y limita el siguiente paso a menos de treinta minutos. Si va dirigido a dirección, resume decisión, impacto, riesgo y coste. Si va dirigido a un equipo técnico, añade entrada, salida, contrato de datos y prueba repetible.`
  }

  return {
    id: `${categoryId}:${tool.id}:tool-${String(index + 1).padStart(2, '0')}`,
    categoryId,
    toolId: tool.id,
    toolLabel: tool.label,
    source: 'Ficha de herramienta',
    name: `${tool.label} · ${prompt.name}`,
    when: prompt.when || `Úsalo cuando trabajes con ${tool.label} dentro de un proyecto institucional.`,
    prompt: text,
    fill: BASE_FILL,
    expect: `El prompt de ${tool.label} convertido en salida institucional con prueba, evidencia, coste y límites.`,
    next: 'Si el resultado sirve, guárdalo en Mi proyecto y deja marcada la fecha de revisión.',
  }
}

function importBasePrompt(family, prompt, index) {
  const categoryId = BASE_FAMILY_CATEGORY[family.id] || 'proyecto-institucional'
  let text = `Actúa como responsable institucional y usa el siguiente prompt base dentro de una organización real. No respondas como si fuera una tarea personal suelta: adapta la salida a equipo, evidencias, permisos, coste, mantenimiento, revisión humana y trazabilidad. Contexto obligatorio antes de responder: institución [INSTITUCION], área [AREA_EQUIPO], persona [PERFIL_PERSONA], proceso [PROCESO_O_PROBLEMA], entrada [ENTRADA_REAL], salida [SALIDA_ESPERADA], volumen [VOLUMEN_Y_FRECUENCIA], restricciones [RESTRICCIONES], datos sensibles [DATOS_SENSIBLES] y fecha [FECHA_REVISION].\n\n## Prompt base de la biblioteca anterior\n${prompt.prompt}\n\n## Reglas institucionales\nConserva la intención del prompt base, pero termina siempre con una ficha de decisión, una prueba con datos ficticios, una evidencia que se guarda, un responsable, riesgos de privacidad y coste, una alternativa manual y una condición de parada. Si faltan datos, pregunta una sola cosa. Si algo puede haber cambiado, escribe COMPROBAR EN LA WEB OFICIAL.`

  while (wordCount(text) < 590) {
    text += `\n\nAdapta la explicación a [PERFIL_PERSONA]. Si es principiante, da instrucciones concretas sin jerga; si es dirección, prioriza decisión y riesgo; si es equipo técnico, añade formato de datos, permisos y comprobación. No uses datos reales en ejemplos; usa datos ficticios y dilo claramente.`
  }

  return {
    id: `${categoryId}:general:base-${family.id}-${index + 1}`,
    categoryId,
    toolId: 'general',
    toolLabel: 'General institucional',
    source: 'Biblioteca anterior',
    name: `${family.title} · ${prompt.name}`,
    when: prompt.when || `Úsalo como prompt institucional general para ${family.title.toLowerCase()}.`,
    prompt: text,
    fill: [...BASE_FILL, ...(prompt.fill || [])],
    expect: prompt.expect || 'Una salida institucional con decisión, prueba, evidencia, riesgos y siguiente paso.',
    next: prompt.next || 'Guarda el resultado útil en Mi proyecto y revisa qué dato falta antes de construir.',
  }
}

function importCoursePrompt(lesson, task, index, toolById) {
  const tool = lesson.tool ? toolById.get(lesson.tool) : null
  const categoryId = categoryForToolPrompt(`${lesson.title} ${task.title} ${task.action}`)
  let text = `Actúa como responsable institucional de formación aplicada. Vas a usar un prompt que aparece dentro del Programa del curso, pero debes convertirlo en una tarea institucional completa: con contexto, salida verificable, evidencia, seguridad, coste, responsable y criterio de terminado. No respondas como ejercicio aislado ni como conversación informal.\n\n## Contexto obligatorio\nInstitución: [INSTITUCION]. Área o equipo: [AREA_EQUIPO]. Persona que aprende o ejecuta: [PERFIL_PERSONA]. Proceso o problema: [PROCESO_O_PROBLEMA]. Entrada real: [ENTRADA_REAL]. Salida esperada: [SALIDA_ESPERADA]. Volumen y frecuencia: [VOLUMEN_Y_FRECUENCIA]. Restricciones: [RESTRICCIONES]. Datos sensibles: [DATOS_SENSIBLES]. Fecha de revisión: [FECHA_REVISION].\n\n## Origen del prompt\nLección del Programa: ${lesson.title}. Tarea: ${task.title}. Dónde se trabaja: ${task.where}. Acción esperada: ${task.action}. Resultado que debería verse: ${task.expect}.${task.stuck ? ` Si no sale: ${task.stuck}.` : ''}${tool ? ` Herramienta relacionada: ${tool.label}.` : ''}\n\n## Prompt base del Programa\n${task.prompt}\n\n## Adaptación institucional obligatoria\nAntes de responder, comprueba si todos los corchetes están rellenados. Si falta un dato crítico, haz una sola pregunta y espera. Después devuelve: uno, explicación para [PERFIL_PERSONA] sin jerga innecesaria; dos, salida concreta que debe producirse; tres, pasos numerados para ejecutarlo; cuatro, prueba con caso normal, incompleto, duplicado y extremo; cinco, datos que no deben usarse todavía; seis, quién aprueba y quién conserva la evidencia; siete, cómo se mide el consumo o esfuerzo; ocho, qué haría manualmente si la herramienta o el proveedor falla.\n\nNo des por terminada la tarea porque la respuesta suene bien. Debe existir una evidencia: texto, captura, archivo, log, enlace, tabla o decisión escrita. Si toca activar, publicar, enviar, borrar, cobrar, conectar credenciales o compartir datos, marca APROBACIÓN HUMANA OBLIGATORIA. Termina con una siguiente acción de menos de treinta minutos.`

  while (wordCount(text) < 590) {
    text += `\n\nIncluye una nota de transferencia: cómo explicaría este resultado una persona principiante, cómo lo revisaría una persona responsable y qué necesitaría una persona técnica para mantenerlo. Separa hechos, supuestos y puntos por comprobar. Si hay precios, límites o funciones de producto, escribe COMPROBAR EN LA WEB OFICIAL.`
  }

  return {
    id: `${categoryId}:${tool?.id || 'general'}:programa-${lesson.id}-${index + 1}`,
    categoryId,
    toolId: tool?.id || 'general',
    toolLabel: tool?.label || 'General institucional',
    source: 'Programa',
    name: `${tool ? `${tool.label} · ` : ''}${lesson.title} · ${task.title}`,
    when: `Úsalo cuando quieras repetir fuera de la lección la tarea «${task.title}» con formato institucional.`,
    prompt: text,
    fill: BASE_FILL,
    expect: 'Una versión institucional del prompt del Programa con pasos, prueba, evidencia, aprobación y siguiente acción.',
    next: 'Guarda el resultado en Mi proyecto como evidencia de la lección o como decisión del proyecto.',
  }
}

function importKitPrompt([title, outcome], index) {
  let text = `Actúa como arquitecta institucional de sistemas de IA. Quiero diseñar el kit "${title}" para una organización real. No me des una colección de ideas sueltas: necesito una arquitectura de trabajo que combine prompts, herramientas, automatizaciones, datos, skills o procedimientos, gobierno, seguridad, coste, documentación y operación.\n\n## Contexto obligatorio\nInstitución: [INSTITUCION]. Área o equipo dueño del sistema: [AREA_EQUIPO]. Personas usuarias: [PERFIL_PERSONA]. Proceso o problema principal: [PROCESO_O_PROBLEMA]. Entradas disponibles: [ENTRADA_REAL]. Salida esperada: [SALIDA_ESPERADA]. Volumen y frecuencia: [VOLUMEN_Y_FRECUENCIA]. Restricciones de tiempo, presupuesto y herramientas: [RESTRICCIONES]. Datos sensibles o prohibidos: [DATOS_SENSIBLES]. Fecha de revisión: [FECHA_REVISION].\n\n## Objetivo del kit\nNecesito ${outcome}. Diseña el sistema como si tuviera que explicarlo a dirección, a una persona principiante y a un equipo técnico. La respuesta debe ayudar a decidir qué se hace primero, qué se automatiza, qué se deja manual, qué se prueba con datos ficticios y qué queda bloqueado hasta tener aprobación.\n\n## Salida obligatoria\nDevuelve: uno, mapa del sistema con módulos y responsabilidades; dos, lista de herramientas candidatas y por qué entra cada una; tres, familias de prompts que se necesitan y cuándo se usan; cuatro, automatizaciones posibles con disparador, validación, acción, registro y ruta de error; cinco, skills o procedimientos reutilizables que conviene documentar; seis, datos que entran, datos que salen y permisos mínimos; siete, fases de implantación de piloto a uso real; ocho, entregables que deben conservarse; nueve, riesgos de privacidad, coste, dependencia del proveedor y mantenimiento; diez, criterios para decir que el kit está listo o que debe seguir en pruebas.\n\n## Gobierno y prueba\nAntes de usar datos reales, diseña una prueba con cuatro casos: normal, incompleto, duplicado y extremo. Para cada caso indica entrada ficticia, resultado esperado, dónde se comprueba, quién aprueba y qué se guarda como evidencia. Marca APROBACIÓN HUMANA OBLIGATORIA si el kit publica, envía mensajes, cambia permisos, borra datos, cobra dinero o afecta a personas. No inventes precios ni límites de planes: escribe COMPROBAR EN LA WEB OFICIAL. Termina con un primer paso de menos de treinta minutos y una decisión que pueda quedar pegada en Mi proyecto.`

  while (wordCount(text) < 590) {
    text += `\n\nAñade una matriz de operación con responsable, aprobador, frecuencia de revisión, señal de fallo, canal de aviso y plan de vuelta atrás. Si alguna parte puede hacerse manualmente durante el piloto, recomiéndala antes que una automatización compleja. Si hay una herramienta que parece atractiva pero no aporta evidencia o control, propón descartarla por ahora.`
  }

  return {
    id: `proyecto-institucional:general:kit-${index + 1}`,
    categoryId: 'proyecto-institucional',
    toolId: 'general',
    toolLabel: 'General institucional',
    source: 'Kits institucionales',
    name: `Kit institucional · ${title}`,
    when: `Úsalo cuando quieras montar o revisar el kit «${title}» como sistema completo.`,
    prompt: text,
    fill: BASE_FILL,
    expect: 'Una arquitectura institucional completa con herramientas, prompts, automatizaciones, gobierno, pruebas y entregables.',
    next: 'Guarda el mapa del sistema en Mi proyecto y convierte la primera fase en tareas pequeñas.',
  }
}

function makeFamily(meta, extra = {}) {
  return {
    id: meta.id,
    title: meta.title,
    intro: meta.intro,
    model: BASE_MODEL,
    prompts: [],
    categoryId: meta.categoryId || meta.id,
    ...FAMILY_GUIDANCE,
    ...extra,
  }
}

export function buildInstitutionalPromptLibrary(baseFamilies, toolPages, cursoFiles = []) {
  const toolById = new Map((toolPages || []).map((tool) => [tool.id, tool]))
  const generalEntries = []
  const output = []

  const pushGeneral = (entry) => {
    if (CATEGORY_BY_ID.has(entry.categoryId)) generalEntries.push(entry)
  }

  for (const family of baseFamilies || []) {
    for (const [index, prompt] of (family.prompts || []).entries()) {
      pushGeneral(importBasePrompt(family, prompt, index))
    }
  }

  for (const [index, kit] of KIT_SCENARIOS.entries()) {
    pushGeneral(importKitPrompt(kit, index))
  }

  for (const lesson of cursoFiles || []) {
    for (const [index, task] of (lesson.tasks || []).filter((item) => item.prompt).entries()) {
      pushGeneral(importCoursePrompt(lesson, task, index, toolById))
    }
  }

  for (const meta of CATEGORY_META) {
    const entries = generalEntries.filter((entry) => entry.categoryId === meta.id)
    if (!entries.length) continue
    const bySource = new Map()
    for (const entry of entries) {
      const source = SOURCE_LABELS[entry.source] || entry.source || 'General'
      if (!bySource.has(source)) bySource.set(source, [])
      bySource.get(source).push(entry)
    }
    for (const [source, sourceEntries] of bySource.entries()) {
      const sourceChunks = chunks(sourceEntries, 50)
      for (const [index, group] of sourceChunks.entries()) {
        const suffix = sourceChunks.length > 1 ? ` ${index + 1}` : ''
        output.push(makeFamily(
          {
            id: `general-${meta.id}-${slug(source)}${suffix ? `-${index + 1}` : ''}`,
            title: `${meta.title} · ${source}${suffix}`,
            intro: `${group.length} prompts institucionales de ${source.toLowerCase()} para ${meta.intro.toLowerCase()}`,
            categoryId: meta.id,
          },
          {
            sectionId: GENERAL_SECTION.id,
            sectionTitle: GENERAL_SECTION.title,
            sectionDescription: GENERAL_SECTION.description,
            blockTitle: `${meta.title}: ${source}${suffix}`,
            blockDescription: `Lote pequeno con ${group.length} prompts. Contiene ${meta.intro.toLowerCase()}`,
            useCase: GENERAL_SECTION.useCase,
            audience: GENERAL_SECTION.audience,
            toolId: 'general',
            toolLabel: 'General institucional',
            source,
            prompts: group,
          },
        ))
      }
    }
  }

  for (const tool of toolPages || []) {
    if (MANUAL_ONLY_TOOLS.has(tool.id)) continue

    const imported = (tool.guide?.prompts || [])
      .slice(0, 20)
      .map((prompt, index) => importToolPrompt(tool, prompt, index))
    const extras = EXTRA_TASKS.map((task, index) => promptCore(tool, task, index))
    const entries = [...imported, ...extras]

    let fallbackIndex = 0
    while (entries.length < 50) {
      const task = EXTRA_TASKS[fallbackIndex % EXTRA_TASKS.length]
      entries.push(promptCore(tool, task, EXTRA_TASKS.length + fallbackIndex))
      fallbackIndex += 1
    }

    const section = sectionForTool(tool)
    const prompts = entries.slice(0, 50)
    output.push(makeFamily(
      {
        id: `herramienta-${tool.id}`,
        title: `${tool.label} · 50 prompts`,
        intro: `50 prompts institucionales para usar ${tool.label} dentro de proyectos reales, con corchetes rellenables, prueba, evidencia, coste, privacidad y entrega.`,
        categoryId: 'herramienta',
      },
      {
        sectionId: section.id,
        sectionTitle: section.title,
        sectionDescription: section.description,
        blockTitle: tool.label,
        blockDescription: `Lote cerrado de 50 prompts. Reparte el trabajo entre ${summarizeCategories(prompts)}.`,
        useCase: section.useCase,
        audience: section.audience,
        toolId: tool.id,
        toolLabel: tool.label,
        source: 'Herramienta',
        prompts,
        canDo: [
          `Trabajar con ${tool.label} sin empezar por botones sueltos: primero problema, entrada, salida, prueba y evidencia.`,
          'Elegir el prompt por intención concreta y adaptar el lenguaje a principiantes, dirección o equipo técnico.',
          'Conectar la herramienta con el resto del proyecto institucional sin olvidar privacidad, coste y mantenimiento.',
        ],
        cantDo: [
          'No sustituye la revisión oficial de precios, planes, permisos o funciones recientes del proveedor.',
          'No convierte una cuenta personal en sistema institucional sin política de datos, aprobación y registro.',
          'No activa acciones sensibles sin prueba con datos ficticios y aprobación humana.',
        ],
        tips: [
          `Si no sabes por dónde empezar con ${tool.label}, usa primero los prompts de aprender, comparar y definir proyecto.`,
          'Después filtra dentro del lote por automatizar, datos, agentes, seguridad, prueba o entrega.',
          'Guarda solo los prompts que produzcan una evidencia útil para Mi proyecto.',
        ],
      },
    ))
  }

  return output.filter((family) => family.prompts.length)
}
