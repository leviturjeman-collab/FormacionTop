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
const CATEGORY_META_EN = [
  {
    id: 'aprender-desde-cero',
    title: 'Learn from scratch',
    intro: 'Institutional prompts to understand a tool, explain its value to non-technical people, and decide where to start without turning training into a list of buttons.',
  },
  {
    id: 'elegir-herramienta',
    title: 'Choose a tool',
    intro: 'Prompts to compare options, justify a decision, and avoid choosing technology because it is fashionable when the project needs judgment, cost control, and maintenance.',
  },
  {
    id: 'crear-proyecto',
    title: 'Create a project',
    intro: 'Prompts to turn an institutional need into a first version with users, scope, screens, data, states, and a clear definition of done.',
  },
  {
    id: 'automatizar',
    title: 'Automate',
    intro: 'Prompts to design institutional flows with trigger, validation, approval, logging, recovery, and controlled stopping.',
  },
  {
    id: 'crear-contenido',
    title: 'Create content',
    intro: 'Prompts to create communication, documentation, image, video, or presentation assets with review, tone, traceability, and approved use.',
  },
  {
    id: 'programar',
    title: 'Code and build',
    intro: 'Prompts to request technical changes, prototypes, integrations, and code reviews without breaking what already works.',
  },
  {
    id: 'conectar-datos',
    title: 'Connect data',
    intro: 'Prompts to organize documents, data, tables, and internal sources before using them in internal systems or AI-assisted answers.',
  },
  {
    id: 'crear-agentes',
    title: 'Create agents',
    intro: 'Prompts to design agents with allowed tools, limits, minimum permissions, escalated doubts, and human approval.',
  },
  {
    id: 'probar-reparar',
    title: 'Test and fix',
    intro: 'Prompts to diagnose failures, design tests, measure quality, compare versions, and leave repair evidence.',
  },
  {
    id: 'seguridad-coste-privacidad',
    title: 'Security, cost, and privacy',
    intro: 'Prompts to review sensitive data, permissions, budget, plans, irreversible actions, compliance, and risks before activating anything.',
  },
  {
    id: 'entregar-equipo-cliente',
    title: 'Deliver to a client or team',
    intro: 'Prompts to turn work into a repeatable delivery: manual, demo, owners, limits, evidence, recovery, and next version.',
  },
  {
    id: 'proyecto-institucional',
    title: 'Institutional project',
    intro: 'Prompts to build larger systems that combine tools, prompts, automations, skills, data, governance, and operations.',
  },
]
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
const TOOL_SECTIONS_EN = [
  {
    id: 'asistentes-modelos',
    title: 'AI assistants and models',
    description: 'Tools for thinking, writing, reviewing, comparing models, and working with assistants without losing judgment.',
    toolIds: ['openai', 'claude', 'anthropic', 'gemini', 'codex', 'claude-code', 'copilot', 'perplexity', 'ollama', 'huggingface', 'notebooklm', 'replicate'],
    useCase: 'Decide, write, analyze, review, and document institutional work with AI.',
    audience: 'Students, teachers, leadership, consultants, and mixed teams.',
  },
  {
    id: 'automatizacion-comunicacion',
    title: 'Automation and communication',
    description: 'Tools that connect forms, emails, alerts, approvals, messages, and repeated tasks.',
    toolIds: ['n8n', 'zapier', 'make', 'pipedream', 'slack', 'gmail', 'telegram', 'whatsapp'],
    useCase: 'Turn repeated processes into measurable, auditable flows with a human brake.',
    audience: 'Operations, support, sales, administration, customer service, and back office.',
  },
  {
    id: 'apps-codigo-deploy',
    title: 'Apps, code, and deployment',
    description: 'Tools for building interfaces, repositories, integrations, tests, and real publications.',
    toolIds: ['lovable', 'base44', 'bolt', 'replit', 'framer', 'v0', 'cursor', 'github', 'python', 'node', 'typescript', 'react', 'vscode', 'tailwind', 'docker', 'vercel', 'colab'],
    useCase: 'Move from idea to browsable, tested, versioned, and deployed product.',
    audience: 'Builders, technical profiles, founders, advanced students, and teams that ship software.',
  },
  {
    id: 'datos-conocimiento',
    title: 'Data, documents, and knowledge',
    description: 'Tools for organizing sources, tables, databases, documents, and internal knowledge.',
    toolIds: ['airtable', 'sheets', 'supabase', 'postgres', 'langchain', 'obsidian', 'notion'],
    useCase: 'Prepare institutional data for search, reporting, RAG, auditing, and decision-making.',
    audience: 'Teams with documentation, CRM, operations, reporting, research, or knowledge bases.',
  },
  {
    id: 'contenido-visual',
    title: 'Content, image, video, and sales',
    description: 'Tools for visual assets, presentations, video, voice, campaigns, and professional communication.',
    toolIds: ['higgsfield', 'nano-banana', 'seedance-2-5', 'canva', 'heygen', 'descript', 'gamma', 'elevenlabs', 'midjourney', 'runway', 'figma'],
    useCase: 'Create reviewable assets that match the brand and are ready to show or sell.',
    audience: 'Marketing, training, agencies, creators, consultants, and sales teams.',
  },
]

const GENERAL_SECTION = {
  id: 'prompts-generales',
  title: 'Prompts generales del curso',
  description: 'Prompts que vienen de la biblioteca anterior, del programa y de los kits maestros, separados en lotes pequenos.',
  useCase: 'Trabajar por intención cuando todavía no sabes qué herramienta toca.',
  audience: 'Cualquier alumno o responsable que quiera copiar, pegar y rellenar corchetes.',
}
const GENERAL_SECTION_EN = {
  id: 'prompts-generales',
  title: 'General course prompts',
  description: 'Prompts from the previous library, the program, and the master kits, split into smaller batches.',
  useCase: 'Work by intention when you still do not know which tool you need.',
  audience: 'Any student or lead who wants to copy, paste, and fill bracketed fields.',
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
const BASE_FILL_EN = [
  ['[INSTITUCION]', 'Name or type of organization: academy, firm, clinic, administration, small business, internal department, or client.'],
  ['[AREA_EQUIPO]', 'Area that will use the result: leadership, operations, marketing, sales, support, training, legal, product, technology, or administration.'],
  ['[PERFIL_PERSONA]', 'Person receiving the explanation: beginner, teacher, technical profile, business lead, client, student, or mixed team.'],
  ['[PROCESO_O_PROBLEMA]', 'Real process, need, or problem you want to solve. Write it before naming a tool.'],
  ['[ENTRADA_REAL]', 'What information comes in: forms, documents, tickets, emails, calls, images, code, data, or decisions.'],
  ['[SALIDA_ESPERADA]', 'What must exist at the end: report, flow, website, brief, table, draft, dashboard, automation, or delivery.'],
  ['[VOLUMEN_Y_FRECUENCIA]', 'How many cases there will be and how often: per day, week, month, campaign, course, or project.'],
  ['[RESTRICCIONES]', 'Limits around time, budget, permissions, available tools, language, format, policy, or approvers.'],
  ['[DATOS_SENSIBLES]', 'Data that must not be pasted or requires care: clients, students, health, minors, contracts, keys, invoices, or internal information.'],
  ['[FECHA_REVISION]', 'Date when the answer is reviewed so it does not depend on outdated prices, plans, or features.'],
]

const BASE_MODEL =
  'Usa una IA capaz de razonar y trabajar con contexto largo. Para decisiones importantes, compara la salida con una segunda IA y conserva la evidencia.'
const BASE_MODEL_EN =
  'Use an AI that can reason and work with long context. For important decisions, compare the output with a second AI and keep the evidence.'

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
const FAMILY_GUIDANCE_EN = {
  canDo: [
    'Turn an institutional need into a brief, plan, test, or delivery that another person can review.',
    'Adapt the explanation to different profiles without losing security, cost, and maintenance criteria.',
    'Leave traceability: what is known, what is assumed, what must be checked, and what evidence is kept.',
  ],
  cantDo: [
    'It does not replace approval from a responsible person when sensitive data, money, clients, or publishing are involved.',
    'It does not confirm current prices, legal limits, or recent provider changes: it marks them for official review.',
    'It does not turn a poor input into a reliable decision; if data is missing, it must ask before inventing.',
  ],
  tips: [
    'Fill the brackets before sending. If a field does not apply, write NOT APPLICABLE and explain why.',
    'Always ask for a test with fictional data before using real institutional information.',
    'Save the useful result in My project with date, version, owner, and decision taken.',
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
const EXTRA_TASKS_EN = [
  ['aprender-desde-cero', 'Institutional first-steps map', 'understand where the tool fits in an organization and what each profile should learn first', 'Do not explain loose buttons: separate purpose, inputs, outputs, risks, and the first safe practice.'],
  ['aprender-desde-cero', 'Guide for training a mixed team', 'prepare an explanation for people at different levels without losing operational precision', 'Include a beginner version, a leadership version, and a technical version, each with different evidence.'],
  ['aprender-desde-cero', 'Applied institutional glossary', 'translate the tool vocabulary into work language and real decisions', 'Every term must include an example, a typical mistake, a review signal, and its link to the institutional process.'],
  ['elegir-herramienta', 'Institutional decision matrix', 'compare this tool with alternatives and decide whether it belongs in the system', 'Score fit, cost, privacy, dependency, maintenance, reversibility, and learning curve.'],
  ['elegir-herramienta', 'Buy, test, or discard decision', 'decide whether to open an account, run a pilot, or discard the tool', 'End with one recommendation and the conditions that would change it.'],
  ['elegir-herramienta', 'Comparison for a non-technical committee', 'explain the choice to leadership, a client, or a team without hype or hidden risks', 'Use executive language, visible costs, clear risks, and a small test before committing.'],
  ['crear-proyecto', 'Institutional project brief', 'turn a need into a project brief that can be built, reviewed, and delegated', 'Include objective, users, inputs, outputs, limits, owner, cadence, and observable success criteria.'],
  ['crear-proyecto', 'Minimum institutional version', 'cut the project down to a first version that can be used without overbuilding it', 'Separate essential, temporary manual work, out of scope, and the exact condition for version two.'],
  ['crear-proyecto', 'Screens, states, and permissions map', 'design the experience, empty states, errors, and permissions before requesting the build', 'Include what each role sees, what each role can do, what they cannot touch, and how a change is recovered.'],
  ['automatizar', 'Institutional flow with approval', 'design an automated process with a human brake before any sensitive action', 'Include trigger, validation, decision, approval, action, log, error, and stop.'],
  ['automatizar', 'Weekly team automation', 'turn a repeated task into a recurring controlled and auditable flow', 'Avoid infinite loops, duplicates, automatic messages without review, and unlimited consumption.'],
  ['automatizar', 'Retry and recovery design', 'prepare what happens when an automation fails, duplicates, or receives incomplete data', 'Every failure must keep the input, reason, owner, next action, and final state.'],
  ['automatizar', 'Connection between institutional tools', 'define how this tool connects with others without losing data or permissions', 'Specify fields that travel, minimum credentials, logs, tests, and the manual alternative.'],
  ['crear-contenido', 'Institutional editorial calendar', 'plan useful content for an organization with purpose, review, and evidence', 'Each asset must have audience, channel, source, owner, approval state, and metric.'],
  ['programar', 'Small reversible technical change', 'request a scoped technical modification with tests and a rollback path', 'Require affected files, a small diff, before/after test, and no full rewrites without reason.'],
  ['programar', 'Institutional technical integration', 'design how to connect the tool with a product, website, API, repository, or database', 'Include data contract, secrets, test environment, expected errors, and minimum observability.'],
  ['programar', 'Implementation review before publishing', 'audit an implementation to detect risks before a real team uses it', 'Order findings by severity and require concrete evidence, not style opinions.'],
  ['conectar-datos', 'Institutional data inventory', 'know what data exists, where it lives, who can use it, and what output it enables', 'Distinguish official source, copy, sensitive data, incomplete data, duplicate, and data that must not leave.'],
  ['conectar-datos', 'Prepare a knowledge base', 'turn internal documents into a searchable base with sources and clear limits', 'Include chunking, metadata, permissions, test questions, answers without source, and updating.'],
  ['crear-agentes', 'Institutional agent with minimum permissions', 'design an agent that reads or acts without exceeding its mandate', 'Define allowed tools, forbidden actions, memory, escalation, step limit, and human approval.'],
  ['crear-agentes', 'Tool brief for an agent', 'describe each tool an agent can use so it chooses well and stops when needed', 'Each tool needs when to use it, when not to, input, output, error, and cost.'],
  ['crear-agentes', 'Human escalation and agent traceability', 'prepare when the agent must stop, ask, or send the case to a responsible person', 'Include doubts, conflicts, sensitive data, low confidence, irreversible actions, and decision log.'],
  ['probar-reparar', 'Institutional test plan', 'create test cases that block delivery if the system does not respond with enough quality', 'Include normal, incomplete, duplicate, extreme, malicious, and provider-change cases.'],
  ['probar-reparar', 'Operational failure postmortem', 'analyze an incident without blaming people and turn it into system improvement', 'Separate timeline, impact, root cause, detection, repair, prevention, and owner.'],
  ['seguridad-coste-privacidad', 'Sensitive data and permissions review', 'detect what information must not be pasted, shared, or automated without control', 'Classify data, permissions, legal basis, retention, export, deletion, owner, and human review.'],
  ['seguridad-coste-privacidad', 'Budget and consumption limits', 'estimate cost before scaling tool usage inside an institution', 'Calculate pilot, ten cases, one hundred cases, one thousand cases, error margin, and stop signal.'],
  ['seguridad-coste-privacidad', 'Irreversible actions and human control', 'mark which actions cannot be fully automated', 'Include sending, publishing, deleting, charging, changing permissions, contacting people, and sharing data.'],
  ['seguridad-coste-privacidad', 'Operational compliance checklist', 'review privacy, security, ownership, licenses, and internal policy before delivery', 'Distinguish technical, legal, contractual, reputational, and what an expert must review.'],
  ['entregar-equipo-cliente', 'Institutional user manual', 'create a guide so another person can use the system without asking the builder', 'Include setup, access, daily use, errors, recovery, limits, cost, and owner.'],
  ['proyecto-institucional', 'Complete institutional architecture', 'design a large system that combines tool, prompts, automations, data, agents, and governance', 'Split the proposal into phases, deliverables, risks, tests, operations, and growth criteria.'],
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

/*
 * Qué categorías de encargo tienen sentido para cada sección de herramientas.
 * Es lo que evita generar «Calendario editorial con PostgreSQL» o «Agente con
 * permisos para Midjourney»: cada herramienta solo recibe los encargos que de
 * verdad se hacen con ella.
 */
const SECTION_CATEGORY_IDS = {
  'asistentes-modelos': new Set(['aprender-desde-cero', 'elegir-herramienta', 'crear-proyecto', 'automatizar', 'crear-contenido', 'programar', 'conectar-datos', 'crear-agentes', 'probar-reparar', 'seguridad-coste-privacidad', 'entregar-equipo-cliente', 'proyecto-institucional']),
  'automatizacion-comunicacion': new Set(['aprender-desde-cero', 'elegir-herramienta', 'automatizar', 'conectar-datos', 'crear-agentes', 'probar-reparar', 'seguridad-coste-privacidad', 'entregar-equipo-cliente']),
  'apps-codigo-deploy': new Set(['aprender-desde-cero', 'elegir-herramienta', 'crear-proyecto', 'programar', 'probar-reparar', 'seguridad-coste-privacidad', 'entregar-equipo-cliente']),
  'datos-conocimiento': new Set(['aprender-desde-cero', 'elegir-herramienta', 'conectar-datos', 'automatizar', 'probar-reparar', 'seguridad-coste-privacidad', 'entregar-equipo-cliente']),
  'contenido-visual': new Set(['aprender-desde-cero', 'elegir-herramienta', 'crear-proyecto', 'crear-contenido', 'probar-reparar', 'seguridad-coste-privacidad', 'entregar-equipo-cliente']),
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

function isEnglish(locale) {
  return locale === 'en'
}

function promptText(locale, es, en) {
  return isEnglish(locale) ? en : es
}

function metaFor(locale) {
  return isEnglish(locale) ? CATEGORY_META_EN : CATEGORY_META
}

function categoryTitle(categoryId, locale) {
  return (metaFor(locale).find((meta) => meta.id === categoryId) || CATEGORY_BY_ID.get(categoryId))?.title || categoryId || 'General'
}

function summarizeCategories(entries, locale = 'es') {
  const counts = new Map()
  for (const entry of entries) {
    const title = categoryTitle(entry.categoryId, locale)
    counts.set(title, (counts.get(title) || 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], isEnglish(locale) ? 'en' : 'es'))
    .slice(0, 5)
    .map(([title, count]) => `${title} (${count})`)
    .join(', ')
}

function promptCore(tool, task, index, locale = 'es') {
  const [categoryId, name, outcome, rule] = task
  const guide = tool.guide || {}
  const internalPieces = (guide.catalog?.items || [])
    .slice(0, 5)
    .map((item) => `${item.name}: ${item.what}`)
    .join('; ')
  const toolRole = compact(guide.plain || promptText(locale, `Herramienta institucional: ${tool.label}.`, `Institutional tool: ${tool.label}.`), 340)
  const usage = compact(guide.usage?.explanation || promptText(locale, `Revisa cómo ${tool.label} mide uso, límites, créditos, tokens, tareas, ejecuciones o almacenamiento antes de escalar.`, `Review how ${tool.label} measures usage, limits, credits, tokens, tasks, executions, or storage before scaling.`), 260)

  let text = promptText(locale,
    `Actúa como arquitecta institucional de sistemas de IA y operaciones. Tu tarea es ayudarme a usar ${tool.label} dentro de una organización real, con criterio de gobierno, privacidad, coste, mantenimiento y evidencia. No escribas una explicación genérica de la herramienta ni una lista bonita de posibilidades: convierte mi caso en una decisión, una prueba y una entrega que otra persona pueda revisar.\n\n## Contexto que debes usar\nInstitución: [INSTITUCION]. Área o equipo: [AREA_EQUIPO]. Persona que necesita entenderlo: [PERFIL_PERSONA]. Proceso o problema: [PROCESO_O_PROBLEMA]. Entrada real: [ENTRADA_REAL]. Salida esperada: [SALIDA_ESPERADA]. Volumen y frecuencia: [VOLUMEN_Y_FRECUENCIA]. Restricciones: [RESTRICCIONES]. Datos sensibles o prohibidos: [DATOS_SENSIBLES]. Fecha de revisión: [FECHA_REVISION].\n\n## Encargo institucional\nNecesito ${outcome} usando ${tool.label} solo si encaja. En esta herramienta, el papel de partida es este: ${toolRole} Piezas internas que debes tener presentes: ${internalPieces || 'entrada, salida, permisos, historial, exportación y forma de revisar resultados'}. Regla específica del encargo: ${rule}\n\n## Cómo debes trabajar\nPrimero revisa si los corchetes están completos. Si falta un dato que cambie la decisión, hazme una sola pregunta y espera mi respuesta. Si puedes avanzar con un supuesto menor, márcalo como SUPUESTO y explica cómo se comprobaría. Adapta el lenguaje a [PERFIL_PERSONA]: si es principiante, traduce cada palabra técnica; si es dirección, resume impacto, riesgo y coste; si es equipo técnico, añade contratos de datos, permisos y pruebas. No uses datos reales en ejemplos: inventa datos ficticios realistas y señala que son ficticios.\n\n## Salida obligatoria\nDevuelve la respuesta en este orden. Uno: ficha institucional de menos de 180 palabras con objetivo, usuario, entrada, salida, límite y criterio de éxito. Dos: decisión sobre si ${tool.label} es suficiente, excesiva o insuficiente, comparándola con una alternativa más simple y con la opción de hacerlo manualmente en la primera versión. Tres: pasos concretos para ejecutar el encargo, indicando pantalla, botón, campo, archivo, nodo o espacio de trabajo cuando aplique. Cuatro: prueba de aceptación con caso normal, incompleto, duplicado y extremo. Cinco: riesgos de privacidad, permisos, coste, dependencia del proveedor y mantenimiento. Seis: evidencia que debo guardar: archivo, captura, enlace, log, tabla o decisión escrita.\n\n## Control institucional\nAntes de recomendar activar, publicar, enviar, borrar, cobrar, cambiar permisos o compartir datos, marca APROBACIÓN HUMANA OBLIGATORIA. Define cómo se detiene el proceso si algo falla. Explica cómo se mide el consumo en ${tool.label}: ${usage} No inventes precios ni límites; si pueden haber cambiado, escribe COMPROBAR EN LA WEB OFICIAL. Termina con una siguiente acción de menos de treinta minutos y una frase de cierre que empiece por: La decisión institucional es.`,
    `Act as an institutional AI systems and operations architect. Your task is to help me use ${tool.label} inside a real organization, with governance, privacy, cost, maintenance, and evidence in mind. Do not write a generic explanation of the tool or a nice list of possibilities: turn my case into a decision, a test, and a delivery another person can review.\n\n## Context to use\nInstitution: [INSTITUCION]. Area or team: [AREA_EQUIPO]. Person who needs to understand it: [PERFIL_PERSONA]. Process or problem: [PROCESO_O_PROBLEMA]. Real input: [ENTRADA_REAL]. Expected output: [SALIDA_ESPERADA]. Volume and frequency: [VOLUMEN_Y_FRECUENCIA]. Constraints: [RESTRICCIONES]. Sensitive or forbidden data: [DATOS_SENSIBLES]. Review date: [FECHA_REVISION].\n\n## Institutional task\nI need to ${outcome} using ${tool.label} only if it fits. For this tool, the starting role is: ${toolRole} Internal pieces to keep in mind: ${internalPieces || 'input, output, permissions, history, export, and review method'}. Specific rule for the task: ${rule}\n\n## How to work\nFirst check whether the brackets are complete. If a missing detail changes the decision, ask me one question and wait. If you can move forward with a small assumption, mark it as ASSUMPTION and explain how it would be checked. Adapt the language to [PERFIL_PERSONA]: if they are a beginner, translate every technical word; if they are leadership, summarize impact, risk, and cost; if they are technical, add data contracts, permissions, and tests. Do not use real data in examples: invent realistic fictional data and say it is fictional.\n\n## Required output\nReturn the answer in this order. One: an institutional brief under 180 words with goal, user, input, output, limit, and success criterion. Two: decision on whether ${tool.label} is enough, excessive, or insufficient, compared with a simpler alternative and with doing it manually in the first version. Three: concrete steps to execute the task, naming screen, button, field, file, node, or workspace where relevant. Four: acceptance test with normal, incomplete, duplicate, and extreme cases. Five: privacy, permission, cost, provider-dependency, and maintenance risks. Six: evidence I should keep: file, screenshot, link, log, table, or written decision.\n\n## Institutional control\nBefore recommending activation, publishing, sending, deleting, charging, changing permissions, or sharing data, mark HUMAN APPROVAL REQUIRED. Define how the process stops if something fails. Explain how consumption is measured in ${tool.label}: ${usage} Do not invent prices or limits; if they may have changed, write CHECK THE OFFICIAL WEBSITE. End with a next action under thirty minutes and a closing sentence that starts with: The institutional decision is.`)

  if (wordCount(text) < 560) {
    text += promptText(locale,
      `\n\nAñade también una mini matriz RACI con responsable, aprobador, persona consultada e informada. Incluye una versión para piloto con datos ficticios y una versión para uso real, separadas claramente. Si el uso real exige contrato, licencia, revisión legal, política interna o validación de seguridad, no lo des por resuelto: déjalo como bloqueo visible.`,
      `\n\nAlso add a small RACI matrix with responsible person, approver, consulted person, and informed person. Include a pilot version with fictional data and a real-use version, clearly separated. If real use requires a contract, license, legal review, internal policy, or security validation, do not treat it as solved: leave it as a visible blocker.`)
  }

  return {
    id: `${categoryId}:${tool.id}:extra-${String(index + 1).padStart(2, '0')}`,
    categoryId,
    toolId: tool.id,
    toolLabel: tool.label,
    source: promptText(locale, 'Banco institucional', 'Institutional bank'),
    name: `${tool.label} · ${name}`,
    when: promptText(locale, `Úsalo cuando necesites ${outcome}.`, `Use it when you need to ${outcome}.`),
    prompt: text,
    fill: isEnglish(locale) ? BASE_FILL_EN : BASE_FILL,
    expect: promptText(locale, `Una salida institucional con decisión, pasos, prueba, riesgos, evidencia y siguiente acción para ${tool.label}.`, `An institutional output with decision, steps, test, risks, evidence, and next action for ${tool.label}.`),
    next: promptText(locale, 'Guarda la decisión en Mi proyecto y usa la prueba con datos ficticios antes de tocar cuentas o datos reales.', 'Save the decision in My project and use the fictional-data test before touching real accounts or real data.'),
  }
}

function importToolPrompt(tool, prompt, index, locale = 'es') {
  const categoryId = categoryForToolPrompt(prompt.name)
  if (isEnglish(locale)) {
    const text = `Act as the institutional owner of this ${tool.label} task. Keep the goal of the base prompt, but adapt the result to a real organization: governance, privacy, cost, evidence, human review, and a test with fictional data.\n\n## Mandatory context\nInstitution: [INSTITUCION]. Area: [AREA_EQUIPO]. Person: [PERFIL_PERSONA]. Process: [PROCESO_O_PROBLEMA]. Input: [ENTRADA_REAL]. Expected output: [SALIDA_ESPERADA]. Volume: [VOLUMEN_Y_FRECUENCIA]. Constraints: [RESTRICCIONES]. Sensitive data: [DATOS_SENSIBLES]. Review date: [FECHA_REVISION].\n\n## Base prompt to run\n${prompt.prompt}\n\n## Required institutional close\nBefore finishing, turn the answer into a verifiable brief: decision, steps, risks, normal/incomplete/duplicate/extreme test, evidence to keep, owner, cost or consumption to measure, and condition for not activating. If anything depends on current prices, plans, permissions, or features, write CHECK THE OFFICIAL WEBSITE. Do not mark the work as production-ready without human approval when sensitive data, publishing, money, or contact with people is involved.`
    return {
      id: `${categoryId}:${tool.id}:tool-${String(index + 1).padStart(2, '0')}`,
      categoryId,
      toolId: tool.id,
      toolLabel: tool.label,
      source: 'Tool brief',
      name: `${tool.label} · ${prompt.name}`,
      when: prompt.when || `Use it when working with ${tool.label} inside an institutional project.`,
      prompt: text,
      fill: BASE_FILL_EN,
      expect: `The ${tool.label} prompt converted into an institutional output with test, evidence, cost, and limits.`,
      next: 'If the result is useful, save it in My project and leave the review date visible.',
    }
  }
  let text = `Actúa como responsable institucional y adapta este encargo de ${tool.label} a una organización real. Mantén el objetivo del prompt original, pero añade gobierno, privacidad, coste, evidencia, revisión humana y prueba con datos ficticios. Contexto obligatorio: institución [INSTITUCION], área [AREA_EQUIPO], persona [PERFIL_PERSONA], proceso [PROCESO_O_PROBLEMA], entrada [ENTRADA_REAL], salida [SALIDA_ESPERADA], volumen [VOLUMEN_Y_FRECUENCIA], restricciones [RESTRICCIONES], datos sensibles [DATOS_SENSIBLES] y fecha [FECHA_REVISION].\n\n## Prompt base que debes ejecutar\n${prompt.prompt}\n\n## Cierre institucional obligatorio\nAntes de terminar, convierte la respuesta en una ficha verificable: decisión, pasos, riesgos, prueba normal/incompleta/duplicada/extrema, evidencia que se guarda, responsable, coste o consumo que se mide y condición para no activar. Si algo depende de precios, planes, permisos o funciones actuales, escribe COMPROBAR EN LA WEB OFICIAL. No des el trabajo por listo para producción sin aprobación humana cuando haya datos sensibles, publicación, dinero o contacto con personas.`

  if (wordCount(text) < 560) {
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

function importBasePrompt(family, prompt, index, locale = 'es') {
  const categoryId = BASE_FAMILY_CATEGORY[family.id] || 'proyecto-institucional'
  if (isEnglish(locale)) {
    const text = `Act as an institutional owner and use the following base prompt inside a real organization. Do not answer as if this were a loose personal task: adapt the output to team use, evidence, permissions, cost, maintenance, human review, and traceability.\n\nMandatory context before answering: institution [INSTITUCION], area [AREA_EQUIPO], person [PERFIL_PERSONA], process [PROCESO_O_PROBLEMA], input [ENTRADA_REAL], expected output [SALIDA_ESPERADA], volume [VOLUMEN_Y_FRECUENCIA], constraints [RESTRICCIONES], sensitive data [DATOS_SENSIBLES], and date [FECHA_REVISION].\n\n## Base prompt from the previous library\n${prompt.prompt}\n\n## Institutional rules\nKeep the intention of the base prompt, but always finish with a decision brief, a test with fictional data, evidence to keep, an owner, privacy and cost risks, a manual alternative, and a stopping condition. If data is missing, ask one question. If something may have changed, write CHECK THE OFFICIAL WEBSITE.`
    return {
      id: `${categoryId}:general:base-${family.id}-${index + 1}`,
      categoryId,
      toolId: 'general',
      toolLabel: 'Institutional general',
      source: 'Previous library',
      name: `${family.title} · ${prompt.name}`,
      when: prompt.when || `Use it as a general institutional prompt for ${family.title.toLowerCase()}.`,
      prompt: text,
      fill: [...BASE_FILL_EN, ...(prompt.fill || [])],
      expect: prompt.expect || 'An institutional output with decision, test, evidence, risks, and next step.',
      next: prompt.next || 'Save the useful result in My project and review what data is missing before building.',
    }
  }
  let text = `Actúa como responsable institucional y usa el siguiente prompt base dentro de una organización real. No respondas como si fuera una tarea personal suelta: adapta la salida a equipo, evidencias, permisos, coste, mantenimiento, revisión humana y trazabilidad. Contexto obligatorio antes de responder: institución [INSTITUCION], área [AREA_EQUIPO], persona [PERFIL_PERSONA], proceso [PROCESO_O_PROBLEMA], entrada [ENTRADA_REAL], salida [SALIDA_ESPERADA], volumen [VOLUMEN_Y_FRECUENCIA], restricciones [RESTRICCIONES], datos sensibles [DATOS_SENSIBLES] y fecha [FECHA_REVISION].\n\n## Prompt base de la biblioteca anterior\n${prompt.prompt}\n\n## Reglas institucionales\nConserva la intención del prompt base, pero termina siempre con una ficha de decisión, una prueba con datos ficticios, una evidencia que se guarda, un responsable, riesgos de privacidad y coste, una alternativa manual y una condición de parada. Si faltan datos, pregunta una sola cosa. Si algo puede haber cambiado, escribe COMPROBAR EN LA WEB OFICIAL.`

  if (wordCount(text) < 560) {
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

function importCoursePrompt(lesson, task, index, toolById, locale = 'es') {
  const tool = lesson.tool ? toolById.get(lesson.tool) : null
  const categoryId = categoryForToolPrompt(`${lesson.title} ${task.title} ${task.action}`)
  if (isEnglish(locale)) {
    const text = `Act as the institutional owner of applied training. You are going to use a prompt from the course Program, but you must turn it into a complete institutional task: context, verifiable output, evidence, security, cost, owner, and definition of done.\n\n## Mandatory context\nInstitution: [INSTITUCION]. Area or team: [AREA_EQUIPO]. Person learning or executing: [PERFIL_PERSONA]. Process or problem: [PROCESO_O_PROBLEMA]. Real input: [ENTRADA_REAL]. Expected output: [SALIDA_ESPERADA]. Volume and frequency: [VOLUMEN_Y_FRECUENCIA]. Constraints: [RESTRICCIONES]. Sensitive data: [DATOS_SENSIBLES]. Review date: [FECHA_REVISION].\n\n## Prompt origin\nProgram lesson: ${lesson.title}. Task: ${task.title}. Where it is done: ${task.where}. Expected action: ${task.action}. What should be visible: ${task.expect}.${task.stuck ? ` If it does not work: ${task.stuck}.` : ''}${tool ? ` Related tool: ${tool.label}.` : ''}\n\n## Base Program prompt\n${task.prompt}\n\n## Required institutional adaptation\nFirst check whether all brackets are filled. If critical data is missing, ask one question and wait. Then return: one, an explanation for [PERFIL_PERSONA] without unnecessary jargon; two, the concrete output that must be produced; three, numbered steps to execute it; four, tests with normal, incomplete, duplicate, and extreme cases; five, data that must not be used yet; six, who approves and who keeps the evidence; seven, how consumption or effort is measured; eight, what should be done manually if the tool or provider fails.\n\nDo not treat the task as complete just because the answer sounds good. Evidence must exist: text, screenshot, file, log, link, table, or written decision. If the task involves activating, publishing, sending, deleting, charging, connecting credentials, or sharing data, mark HUMAN APPROVAL REQUIRED. End with a next action under thirty minutes.`
    return {
      id: `${categoryId}:${tool?.id || 'general'}:programa-${lesson.id}-${index + 1}`,
      categoryId,
      toolId: tool?.id || 'general',
      toolLabel: tool?.label || 'Institutional general',
      source: 'Program',
      name: `${tool ? `${tool.label} · ` : ''}${lesson.title} · ${task.title}`,
      when: `Use it when you want to repeat the task "${task.title}" outside the lesson with an institutional format.`,
      prompt: text,
      fill: BASE_FILL_EN,
      expect: 'An institutional version of the Program prompt with steps, test, evidence, approval, and next action.',
      next: 'Save the result in My project as lesson evidence or as a project decision.',
    }
  }
  let text = `Actúa como responsable institucional de formación aplicada. Vas a usar un prompt que aparece dentro del Programa del curso, pero debes convertirlo en una tarea institucional completa: con contexto, salida verificable, evidencia, seguridad, coste, responsable y criterio de terminado. No respondas como ejercicio aislado ni como conversación informal.\n\n## Contexto obligatorio\nInstitución: [INSTITUCION]. Área o equipo: [AREA_EQUIPO]. Persona que aprende o ejecuta: [PERFIL_PERSONA]. Proceso o problema: [PROCESO_O_PROBLEMA]. Entrada real: [ENTRADA_REAL]. Salida esperada: [SALIDA_ESPERADA]. Volumen y frecuencia: [VOLUMEN_Y_FRECUENCIA]. Restricciones: [RESTRICCIONES]. Datos sensibles: [DATOS_SENSIBLES]. Fecha de revisión: [FECHA_REVISION].\n\n## Origen del prompt\nLección del Programa: ${lesson.title}. Tarea: ${task.title}. Dónde se trabaja: ${task.where}. Acción esperada: ${task.action}. Resultado que debería verse: ${task.expect}.${task.stuck ? ` Si no sale: ${task.stuck}.` : ''}${tool ? ` Herramienta relacionada: ${tool.label}.` : ''}\n\n## Prompt base del Programa\n${task.prompt}\n\n## Adaptación institucional obligatoria\nAntes de responder, comprueba si todos los corchetes están rellenados. Si falta un dato crítico, haz una sola pregunta y espera. Después devuelve: uno, explicación para [PERFIL_PERSONA] sin jerga innecesaria; dos, salida concreta que debe producirse; tres, pasos numerados para ejecutarlo; cuatro, prueba con caso normal, incompleto, duplicado y extremo; cinco, datos que no deben usarse todavía; seis, quién aprueba y quién conserva la evidencia; siete, cómo se mide el consumo o esfuerzo; ocho, qué haría manualmente si la herramienta o el proveedor falla.\n\nNo des por terminada la tarea porque la respuesta suene bien. Debe existir una evidencia: texto, captura, archivo, log, enlace, tabla o decisión escrita. Si toca activar, publicar, enviar, borrar, cobrar, conectar credenciales o compartir datos, marca APROBACIÓN HUMANA OBLIGATORIA. Termina con una siguiente acción de menos de treinta minutos.`

  if (wordCount(text) < 560) {
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

function importKitPrompt(kit, index, locale = 'es') {
  const title = kit.title
  const outcome = `diseñar e implantar este sistema: ${kit.promise || kit.title}`
  if (isEnglish(locale)) {
    const text = `Act as an institutional AI systems architect. I want to design the kit "${title}" for a real organization. Do not give me a collection of loose ideas: I need a work architecture that combines prompts, tools, automations, data, skills or procedures, governance, security, cost, documentation, and operations.\n\n## Mandatory context\nInstitution: [INSTITUCION]. Area or team owning the system: [AREA_EQUIPO]. Users: [PERFIL_PERSONA]. Main process or problem: [PROCESO_O_PROBLEMA]. Available inputs: [ENTRADA_REAL]. Expected output: [SALIDA_ESPERADA]. Volume and frequency: [VOLUMEN_Y_FRECUENCIA]. Time, budget, and tool constraints: [RESTRICCIONES]. Sensitive or forbidden data: [DATOS_SENSIBLES]. Review date: [FECHA_REVISION].\n\n## Kit objective\nI need to design and implement this system: ${kit.promise || kit.title}. Design it so it can be explained to leadership, to a beginner, and to a technical team. The answer must help decide what is done first, what is automated, what stays manual, what is tested with fictional data, and what remains blocked until approval.\n\n## Required output\nReturn: one, system map with modules and responsibilities; two, candidate tools and why each one belongs; three, prompt families needed and when they are used; four, possible automations with trigger, validation, action, log, and error path; five, reusable skills or procedures to document; six, input data, output data, and minimum permissions; seven, rollout phases from pilot to real use; eight, deliverables to keep; nine, privacy, cost, provider-dependency, and maintenance risks; ten, criteria for saying the kit is ready or must remain in testing.\n\n## Governance and test\nBefore using real data, design a four-case test: normal, incomplete, duplicate, and extreme. For each case, specify fictional input, expected result, where it is checked, who approves, and what is saved as evidence. Mark HUMAN APPROVAL REQUIRED if the kit publishes, sends messages, changes permissions, deletes data, charges money, or affects people. Do not invent plan prices or limits: write CHECK THE OFFICIAL WEBSITE. End with a first step under thirty minutes and a decision that can be pasted into My project.`
    return {
      id: `proyecto-institucional:general:kit-${index + 1}`,
      categoryId: 'proyecto-institucional',
      toolId: 'general',
      toolLabel: 'Institutional general',
      source: 'Institutional kits',
      name: `Institutional kit · ${title}`,
      when: `Use it when you want to build or review the kit "${title}" as a complete system.`,
      prompt: text,
      fill: BASE_FILL_EN,
      expect: 'A complete institutional architecture with tools, prompts, automations, governance, tests, and deliverables.',
      next: 'Save the system map in My project and turn the first phase into small tasks.',
    }
  }
  let text = `Actúa como arquitecta institucional de sistemas de IA. Quiero diseñar el kit "${title}" para una organización real. No me des una colección de ideas sueltas: necesito una arquitectura de trabajo que combine prompts, herramientas, automatizaciones, datos, skills o procedimientos, gobierno, seguridad, coste, documentación y operación.\n\n## Contexto obligatorio\nInstitución: [INSTITUCION]. Área o equipo dueño del sistema: [AREA_EQUIPO]. Personas usuarias: [PERFIL_PERSONA]. Proceso o problema principal: [PROCESO_O_PROBLEMA]. Entradas disponibles: [ENTRADA_REAL]. Salida esperada: [SALIDA_ESPERADA]. Volumen y frecuencia: [VOLUMEN_Y_FRECUENCIA]. Restricciones de tiempo, presupuesto y herramientas: [RESTRICCIONES]. Datos sensibles o prohibidos: [DATOS_SENSIBLES]. Fecha de revisión: [FECHA_REVISION].\n\n## Objetivo del kit\nNecesito ${outcome}. Diseña el sistema como si tuviera que explicarlo a dirección, a una persona principiante y a un equipo técnico. La respuesta debe ayudar a decidir qué se hace primero, qué se automatiza, qué se deja manual, qué se prueba con datos ficticios y qué queda bloqueado hasta tener aprobación.\n\n## Salida obligatoria\nDevuelve: uno, mapa del sistema con módulos y responsabilidades; dos, lista de herramientas candidatas y por qué entra cada una; tres, familias de prompts que se necesitan y cuándo se usan; cuatro, automatizaciones posibles con disparador, validación, acción, registro y ruta de error; cinco, skills o procedimientos reutilizables que conviene documentar; seis, datos que entran, datos que salen y permisos mínimos; siete, fases de implantación de piloto a uso real; ocho, entregables que deben conservarse; nueve, riesgos de privacidad, coste, dependencia del proveedor y mantenimiento; diez, criterios para decir que el kit está listo o que debe seguir en pruebas.\n\n## Gobierno y prueba\nAntes de usar datos reales, diseña una prueba con cuatro casos: normal, incompleto, duplicado y extremo. Para cada caso indica entrada ficticia, resultado esperado, dónde se comprueba, quién aprueba y qué se guarda como evidencia. Marca APROBACIÓN HUMANA OBLIGATORIA si el kit publica, envía mensajes, cambia permisos, borra datos, cobra dinero o afecta a personas. No inventes precios ni límites de planes: escribe COMPROBAR EN LA WEB OFICIAL. Termina con un primer paso de menos de treinta minutos y una decisión que pueda quedar pegada en Mi proyecto.`

  if (wordCount(text) < 560) {
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

function makeFamily(meta, extra = {}, locale = 'es') {
  return {
    id: meta.id,
    title: meta.title,
    intro: meta.intro,
    model: isEnglish(locale) ? BASE_MODEL_EN : BASE_MODEL,
    prompts: [],
    categoryId: meta.categoryId || meta.id,
    ...(isEnglish(locale) ? FAMILY_GUIDANCE_EN : FAMILY_GUIDANCE),
    ...extra,
  }
}

export function buildInstitutionalPromptLibrary(baseFamilies, toolPages, cursoFiles = [], kits = [], locale = 'es') {
  const toolById = new Map((toolPages || []).map((tool) => [tool.id, tool]))
  const generalEntries = []
  const output = []
  const categoryMeta = metaFor(locale)
  const generalSection = isEnglish(locale) ? GENERAL_SECTION_EN : GENERAL_SECTION
  const toolSections = isEnglish(locale) ? TOOL_SECTIONS_EN : TOOL_SECTIONS
  const extraTasks = isEnglish(locale) ? EXTRA_TASKS_EN : EXTRA_TASKS

  const pushGeneral = (entry) => {
    if (CATEGORY_BY_ID.has(entry.categoryId)) generalEntries.push(entry)
  }

  for (const family of baseFamilies || []) {
    for (const [index, prompt] of (family.prompts || []).entries()) {
      pushGeneral(importBasePrompt(family, prompt, index, locale))
    }
  }

  // Un prompt de arranque por cada kit institucional real, sin lista paralela
  // que se desincronice cuando se añadan kits.
  for (const [index, kit] of (kits || []).entries()) {
    pushGeneral(importKitPrompt(kit, index, locale))
  }

  for (const lesson of cursoFiles || []) {
    for (const [index, task] of (lesson.tasks || []).filter((item) => item.prompt).entries()) {
      pushGeneral(importCoursePrompt(lesson, task, index, toolById, locale))
    }
  }

  /*
   * Antes cada tema aparecia dos o tres veces («Programa», «Biblioteca
   * anterior»...) con el mismo contenido de fondo. Ahora hay UNA familia por
   * tema; solo se parte en lotes numerados cuando supera los 50 prompts.
   */
  for (const meta of categoryMeta) {
    const entries = generalEntries.filter((entry) => entry.categoryId === meta.id)
    if (!entries.length) continue
    const groups = chunks(entries, 50)
    // «Prompts institucionales para entender…» → «entender…», para no repetirse
    // al componer las frases de la ficha.
    const purpose = meta.intro
      .replace(/^Institutional prompts to /i, '')
      .replace(/^Prompts to /i, '')
      .replace(/^Prompts (institucionales )?para /i, '')
      .toLowerCase()
    for (const [index, group] of groups.entries()) {
      const suffix = groups.length > 1
        ? promptText(locale, ` · lote ${index + 1} de ${groups.length}`, ` · batch ${index + 1} of ${groups.length}`)
        : ''
      output.push(makeFamily(
        {
          id: `general-${meta.id}${groups.length > 1 ? `-${index + 1}` : ''}`,
          title: `${meta.title}${suffix}`,
          intro: promptText(locale, `${group.length} prompts institucionales para ${purpose}`, `${group.length} institutional prompts to ${purpose}`),
          categoryId: meta.id,
        },
        {
          sectionId: generalSection.id,
          sectionTitle: generalSection.title,
          sectionDescription: generalSection.description,
          blockTitle: `${meta.title}${suffix}`,
          blockDescription: promptText(locale, `${group.length} prompts listos para copiar, para ${purpose}`, `${group.length} ready-to-copy prompts to ${purpose}`),
          useCase: generalSection.useCase,
          audience: generalSection.audience,
          toolId: 'general',
          toolLabel: promptText(locale, 'General institucional', 'Institutional general'),
          source: promptText(locale, 'General', 'General'),
          prompts: group,
        },
        locale,
      ))
    }
  }

  for (const tool of toolPages || []) {
    if (MANUAL_ONLY_TOOLS.has(tool.id)) continue

    const section = toolSections.find((item) => item.toolIds.includes(tool.id)) || toolSections[0]
    const allowedCategories = SECTION_CATEGORY_IDS[section.id] || SECTION_CATEGORY_IDS['asistentes-modelos']

    const imported = (tool.guide?.prompts || [])
      .slice(0, 20)
      .map((prompt, index) => importToolPrompt(tool, prompt, index, locale))
    // Solo los encargos que tienen sentido con esta herramienta: nada de
    // rellenar hasta una cifra fija con combinaciones absurdas.
    const extras = EXTRA_TASKS
      .filter((task) => allowedCategories.has(task[0]))
      .map((task, index) => promptCore(tool, task, index, locale))
    const prompts = [...imported, ...extras].slice(0, 50)

    output.push(makeFamily(
      {
        id: `herramienta-${tool.id}`,
        title: `${tool.label} · ${prompts.length} prompts`,
        intro: promptText(locale, `${prompts.length} prompts institucionales para usar ${tool.label} dentro de proyectos reales, con corchetes rellenables, prueba, evidencia, coste, privacidad y entrega.`, `${prompts.length} institutional prompts for using ${tool.label} inside real projects, with bracket fields, testing, evidence, cost, privacy, and delivery.`),
        categoryId: 'herramienta',
      },
      {
        sectionId: section.id,
        sectionTitle: section.title,
        sectionDescription: section.description,
        blockTitle: tool.label,
        blockDescription: promptText(locale, `${prompts.length} prompts pertinentes para ${tool.label}. Reparte el trabajo entre ${summarizeCategories(prompts, locale)}.`, `${prompts.length} relevant prompts for ${tool.label}. Work is split across ${summarizeCategories(prompts, locale)}.`),
        useCase: section.useCase,
        audience: section.audience,
        toolId: tool.id,
        toolLabel: tool.label,
        source: promptText(locale, 'Herramienta', 'Tool'),
        prompts,
        canDo: isEnglish(locale) ? [
          `Work with ${tool.label} without starting from loose buttons: first problem, input, output, test, and evidence.`,
          'Choose the prompt by concrete intention and adapt the language to beginners, leadership, or technical teams.',
          'Connect the tool with the rest of the institutional project without forgetting privacy, cost, and maintenance.',
        ] : [
          `Trabajar con ${tool.label} sin empezar por botones sueltos: primero problema, entrada, salida, prueba y evidencia.`,
          'Elegir el prompt por intención concreta y adaptar el lenguaje a principiantes, dirección o equipo técnico.',
          'Conectar la herramienta con el resto del proyecto institucional sin olvidar privacidad, coste y mantenimiento.',
        ],
        cantDo: isEnglish(locale) ? [
          'It does not replace official review of prices, plans, permissions, or recent provider features.',
          'It does not turn a personal account into an institutional system without data policy, approval, and logging.',
          'It does not activate sensitive actions without fictional-data testing and human approval.',
        ] : [
          'No sustituye la revisión oficial de precios, planes, permisos o funciones recientes del proveedor.',
          'No convierte una cuenta personal en sistema institucional sin política de datos, aprobación y registro.',
          'No activa acciones sensibles sin prueba con datos ficticios y aprobación humana.',
        ],
        tips: isEnglish(locale) ? [
          `If you do not know where to start with ${tool.label}, use the learn, compare, and define-project prompts first.`,
          'Then filter inside the batch by automation, data, agents, security, testing, or delivery.',
          'Save only the prompts that produce useful evidence for My project.',
        ] : [
          `Si no sabes por dónde empezar con ${tool.label}, usa primero los prompts de aprender, comparar y definir proyecto.`,
          'Después filtra dentro del lote por automatizar, datos, agentes, seguridad, prueba o entrega.',
          'Guarda solo los prompts que produzcan una evidencia útil para Mi proyecto.',
        ],
      },
      locale,
    ))
  }

  return output.filter((family) => family.prompts.length)
}
