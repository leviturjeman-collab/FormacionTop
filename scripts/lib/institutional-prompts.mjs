const CATEGORY_META_ES = [
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

const CATEGORY_META_EN = [
  {
    id: 'aprender-desde-cero',
    title: 'Learning from scratch',
    intro: 'Institutional prompts to understand a tool, explain its value to non-technical people and decide where to start without turning training into a list of buttons.',
  },
  {
    id: 'elegir-herramienta',
    title: 'Choosing a tool',
    intro: 'Prompts to compare options, justify a decision and avoid picking technology by trend when the project needs judgment, cost and maintenance criteria.',
  },
  {
    id: 'crear-proyecto',
    title: 'Building a project',
    intro: 'Prompts to turn an institutional need into a first version, with users, scope, screens, data, states and a definition of done.',
  },
  {
    id: 'automatizar',
    title: 'Automating',
    intro: 'Prompts to design institutional workflows with trigger, validation, approval, logging, recovery and controlled shutdown.',
  },
  {
    id: 'crear-contenido',
    title: 'Creating content',
    intro: 'Prompts to create communication pieces, documentation, image, video or presentations with review, tone, traceability and approved use.',
  },
  {
    id: 'programar',
    title: 'Coding',
    intro: 'Prompts to request technical changes, prototypes, integrations and code reviews without breaking what already works.',
  },
  {
    id: 'conectar-datos',
    title: 'Connecting data',
    intro: 'Prompts to organize documents, data, tables and your own sources before using them in internal systems or AI-assisted answers.',
  },
  {
    id: 'crear-agentes',
    title: 'Building agents',
    intro: 'Prompts to design agents with allowed tools, limits, minimal permissions, escalated doubts and human approval.',
  },
  {
    id: 'probar-reparar',
    title: 'Testing and fixing',
    intro: 'Prompts to diagnose failures, design tests, measure quality, compare versions and leave evidence of a fix.',
  },
  {
    id: 'seguridad-coste-privacidad',
    title: 'Security, cost and privacy',
    intro: 'Prompts to review sensitive data, permissions, budget, plans, irreversible actions, compliance and risks before activating anything.',
  },
  {
    id: 'entregar-equipo-cliente',
    title: 'Delivering to client or team',
    intro: 'Prompts to turn a piece of work into a repeatable delivery: manual, demo, owners, limits, evidence, recovery and next version.',
  },
  {
    id: 'proyecto-institucional',
    title: 'Institutional project',
    intro: 'Prompts to build large systems that combine tools, prompts, automations, skills, data, governance and operation.',
  },
]

const CATEGORY_META_BY_LOCALE = { es: CATEGORY_META_ES, en: CATEGORY_META_EN }
const CATEGORY_BY_ID_BY_LOCALE = {
  es: new Map(CATEGORY_META_ES.map((meta) => [meta.id, meta])),
  en: new Map(CATEGORY_META_EN.map((meta) => [meta.id, meta])),
}
const MANUAL_ONLY_TOOLS = new Set(['wispr-flow'])

const TOOL_SECTIONS_ES = [
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
    description: 'Tools for thinking, drafting, reviewing, comparing models and working with assistants without losing judgment.',
    toolIds: ['openai', 'claude', 'anthropic', 'gemini', 'codex', 'claude-code', 'copilot', 'perplexity', 'ollama', 'huggingface', 'notebooklm', 'replicate'],
    useCase: 'Decide, draft, analyze, review and document institutional work with AI.',
    audience: 'Students, instructors, leadership, consultants and mixed teams.',
  },
  {
    id: 'automatizacion-comunicacion',
    title: 'Automation and communication',
    description: 'Tools that connect forms, emails, notices, approvals, messages and repeated tasks.',
    toolIds: ['n8n', 'zapier', 'make', 'pipedream', 'slack', 'gmail', 'telegram', 'whatsapp'],
    useCase: 'Turn repeated processes into measurable, auditable flows with a human brake.',
    audience: 'Operations, support, sales, administration, customer service and back office.',
  },
  {
    id: 'apps-codigo-deploy',
    title: 'Apps, code and deployment',
    description: 'Tools for building interfaces, repositories, integrations, tests and real releases.',
    toolIds: ['lovable', 'base44', 'bolt', 'replit', 'framer', 'v0', 'cursor', 'github', 'python', 'node', 'typescript', 'react', 'vscode', 'tailwind', 'docker', 'vercel', 'colab'],
    useCase: 'Go from idea to a navigable product that is tested, versioned and deployed.',
    audience: 'Builders, technical profiles, founders, advanced students and teams shipping software.',
  },
  {
    id: 'datos-conocimiento',
    title: 'Data, documents and knowledge',
    description: 'Tools for organizing sources, tables, databases, documents and internal knowledge.',
    toolIds: ['airtable', 'sheets', 'supabase', 'postgres', 'langchain', 'obsidian', 'notion'],
    useCase: 'Prepare institutional data for search, reporting, RAG, auditing and decision-making.',
    audience: 'Teams with documentation, CRM, operations, reporting, research or knowledge bases.',
  },
  {
    id: 'contenido-visual',
    title: 'Content, image, video and sales',
    description: 'Tools for visual pieces, presentations, video, voice, campaigns and professional communication.',
    toolIds: ['higgsfield', 'nano-banana', 'seedance-2-5', 'canva', 'heygen', 'descript', 'gamma', 'elevenlabs', 'midjourney', 'runway', 'figma'],
    useCase: 'Create reviewable pieces, on-brand and ready to present or sell.',
    audience: 'Marketing, training, agencies, creators, consultants and sales teams.',
  },
]

const TOOL_SECTIONS_BY_LOCALE = { es: TOOL_SECTIONS_ES, en: TOOL_SECTIONS_EN }

const GENERAL_SECTION_ES = {
  id: 'prompts-generales',
  title: 'Prompts generales del curso',
  description: 'Prompts que vienen de la biblioteca anterior, del programa y de los kits maestros, separados en lotes pequenos.',
  useCase: 'Trabajar por intención cuando todavía no sabes qué herramienta toca.',
  audience: 'Cualquier alumno o responsable que quiera copiar, pegar y rellenar corchetes.',
}

const GENERAL_SECTION_EN = {
  id: 'prompts-generales',
  title: 'General course prompts',
  description: 'Prompts that come from the previous library, the program and the master kits, split into small batches.',
  useCase: 'Work by intent when you still do not know which tool to use.',
  audience: 'Any student or manager who wants to copy, paste and fill in the brackets.',
}

const GENERAL_SECTION_BY_LOCALE = { es: GENERAL_SECTION_ES, en: GENERAL_SECTION_EN }

const BASE_FILL_ES = [
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
  ['[INSTITUTION]', 'Name or type of organization: academy, firm, clinic, administration, SME, internal department or client.'],
  ['[TEAM_AREA]', 'Area that will use the result: leadership, operations, marketing, sales, support, training, legal, product, technology or administration.'],
  ['[PERSON_PROFILE]', 'Person who will receive the explanation: beginner, instructor, technical, business owner, client, student or mixed team.'],
  ['[PROCESS_OR_PROBLEM]', 'The real process, need or problem you want to solve. Write it without naming a tool yet.'],
  ['[REAL_INPUT]', 'What information goes in: forms, documents, tickets, emails, calls, images, code, data or decisions.'],
  ['[EXPECTED_OUTPUT]', 'What must exist at the end: report, workflow, website, record, table, draft, dashboard, automation or deliverable.'],
  ['[VOLUME_AND_FREQUENCY]', 'How many cases there will be and how often it happens: per day, week, month, campaign, course or project.'],
  ['[CONSTRAINTS]', 'Time, budget, permission, available-tool, language, format, regulatory or approver limits.'],
  ['[SENSITIVE_DATA]', 'Data that must not be pasted or that needs care: customers, students, health, minors, contracts, credentials, invoices or internal information.'],
  ['[REVIEW_DATE]', 'Date on which the answer is reviewed so it does not rely on outdated prices, plans or features.'],
]

const BASE_FILL_BY_LOCALE = { es: BASE_FILL_ES, en: BASE_FILL_EN }

const BASE_MODEL_ES =
  'Usa una IA capaz de razonar y trabajar con contexto largo. Para decisiones importantes, compara la salida con una segunda IA y conserva la evidencia.'

const BASE_MODEL_EN =
  'Use an AI capable of reasoning and working with long context. For important decisions, compare the output with a second AI and keep the evidence.'

const BASE_MODEL_BY_LOCALE = { es: BASE_MODEL_ES, en: BASE_MODEL_EN }

const FAMILY_GUIDANCE_ES = {
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
    'Turn an institutional need into a record, plan, test or deliverable that someone else can review.',
    'Adapt the explanation to different profiles without losing security, cost and maintenance criteria.',
    'Leave traceability: what is known, what is assumed, what must be checked and what evidence is kept.',
  ],
  cantDo: [
    'It does not replace the approval of a responsible person when there is sensitive data, money, clients or publication involved.',
    'It does not confirm prices, legal limits or recent provider changes: it forces you to flag them for official review.',
    'It does not turn poor input into a reliable decision; if data is missing, it must ask before inventing anything.',
  ],
  tips: [
    'Fill in the brackets before sending. If a field does not apply, write NOT APPLICABLE and explain why.',
    'Always ask for a test with fictitious data before using real information from the institution.',
    'Save the useful result in My project together with date, version, owner and decision made.',
  ],
}

const FAMILY_GUIDANCE_BY_LOCALE = { es: FAMILY_GUIDANCE_ES, en: FAMILY_GUIDANCE_EN }

const EXTRA_TASKS_ES = [
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
  ['aprender-desde-cero', 'Institutional first-steps map', 'understand what place the tool occupies in an organization and what each profile should learn first', 'Do not explain loose buttons: separate purpose, inputs, outputs, risks and the first safe practice.'],
  ['aprender-desde-cero', 'Guide to train a mixed team', 'prepare an explanation for people at different levels without losing operational precision', 'Include a version for beginner, manager and technical person, with a distinct piece of evidence for each.'],
  ['aprender-desde-cero', 'Applied institutional glossary', 'translate the tool vocabulary into working language and real decisions', 'Each term needs an example, a typical mistake, a review signal and a link to the institutional process.'],

  ['elegir-herramienta', 'Institutional decision matrix', 'compare this tool with alternatives and decide whether it enters the system or not', 'Score fit, cost, privacy, dependency, maintenance, reversibility and learning curve.'],
  ['elegir-herramienta', 'Buy, trial or discard decision', 'decide whether to open an account, run a pilot or discard the tool', 'End with a single recommendation and the conditions that would change that decision.'],
  ['elegir-herramienta', 'Comparison for a non-technical committee', 'explain the choice to leadership, client or team without overselling or hiding risks', 'Use executive language, visible costs, clear risks and a small test before committing.'],

  ['crear-proyecto', 'Institutional project record', 'turn a need into a project record useful for building, reviewing and delegating', 'Include objective, users, inputs, outputs, limits, owner, cadence and an observable success criterion.'],
  ['crear-proyecto', 'Minimal institutional version', 'trim the project down to a first version that can be used without oversizing it', 'Separate must-have, temporary manual workaround, out of scope and the specific condition to move to version two.'],
  ['crear-proyecto', 'Screen, state and permission map', 'design the experience, empty states, errors and permissions before requesting a build', 'Include what each role sees, what they can do, what they cannot touch and how a change is recovered.'],

  ['automatizar', 'Institutional workflow with approval', 'design an automated process with a human brake before any sensitive action', 'Include trigger, validation, decision, approval, action, logging, error handling and stop.'],
  ['automatizar', 'Weekly team automation', 'turn a repeated task into a controlled, auditable recurring workflow', 'Avoid infinite loops, duplicates, unreviewed automatic messages and unlimited consumption.'],
  ['automatizar', 'Retry and recovery design', 'prepare what happens when an automation fails, duplicates or finds incomplete data', 'Each failure must keep the input, reason, owner, next action and final status.'],
  ['automatizar', 'Connection between institutional tools', 'define how this tool connects with others without losing data or permissions', 'Specify fields that travel, minimal credentials, logs, tests and a manual fallback.'],

  ['crear-contenido', 'Institutional editorial calendar', 'plan useful content for an organization with purpose, review and evidence', 'Each piece needs audience, channel, source, owner, approval status and metric.'],

  ['programar', 'Small, reversible technical change', 'request a scoped technical change with tests and a way to roll back', 'Require affected files, a small diff, a before/after test and no full rewrites without a reason.'],
  ['programar', 'Institutional technical integration', 'design how to connect the tool with a product, website, API, repository or database', 'Include a data contract, secrets, test environment, expected errors and minimal observability.'],
  ['programar', 'Implementation review before release', 'audit an implementation to catch risks before a real team uses it', 'Rank findings by severity and require concrete evidence, not style opinions.'],

  ['conectar-datos', 'Institutional data inventory', 'know what data exists, where it lives, who can use it and what output it allows', 'Distinguish official source, copy, sensitive data, incomplete data, duplicate and data that must not leave.'],
  ['conectar-datos', 'Prepare a knowledge base', 'turn internal documents into a queryable base with clear sources and limits', 'Include chunking, metadata, permissions, test questions, answers without a source and updates.'],

  ['crear-agentes', 'Institutional agent with minimal permissions', 'design an agent that queries or acts without stepping outside its mandate', 'Define allowed tools, prohibited actions, memory, escalation, step limit and human approval.'],
  ['crear-agentes', 'Tool sheet for an agent', 'describe every tool an agent can use so it chooses well and stops when it should', 'Each tool needs when to use it, when not to, input, output, error and cost.'],
  ['crear-agentes', 'Human escalation and agent traceability', 'prepare when the agent must stop, ask or hand the case to a responsible person', 'Include doubts, conflicts, sensitive data, low confidence, irreversible actions and decision logging.'],

  ['probar-reparar', 'Institutional test plan', 'create test cases that block the release if the system does not respond with enough quality', 'Include normal, incomplete, duplicate, extreme, malicious and provider-change cases.'],
  ['probar-reparar', 'Operational failure postmortem', 'analyze an incident without blaming anyone and turn it into a system improvement', 'Separate timeline, impact, root cause, detection, fix, prevention and owner.'],

  ['seguridad-coste-privacidad', 'Sensitive data and permissions review', 'detect what information must not be pasted, shared or automated without control', 'Classify data, permissions, legal basis, retention, export, deletion, owner and human review.'],
  ['seguridad-coste-privacidad', 'Budget and consumption limits', 'estimate cost before scaling up the use of the tool in an institution', 'Calculate test, ten cases, a hundred cases, a thousand cases, margin of error and stop signal.'],
  ['seguridad-coste-privacidad', 'Irreversible actions and human control', 'flag which actions cannot be left fully automated', 'Include send, publish, delete, charge, change permissions, contact people and share data.'],
  ['seguridad-coste-privacidad', 'Operational compliance checklist', 'review privacy, security, ownership, licenses and internal policy before a delivery', 'Distinguish the technical, the legal, the contractual, the reputational and what an expert must review.'],

  ['entregar-equipo-cliente', 'Institutional user manual', 'create a guide so someone else can use the system without asking the builder', 'Include installation, access, daily use, errors, recovery, limits, cost and owner.'],

  ['proyecto-institucional', 'Complete institutional architecture', 'design a large system that combines tool, prompts, automations, data, agents and governance', 'Split the proposal into phases, deliverables, risks, tests, operation and criteria to grow without chaos.'],
]

const EXTRA_TASKS_BY_LOCALE = { es: EXTRA_TASKS_ES, en: EXTRA_TASKS_EN }

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
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'general'
}

function chunks(items, size = 50) {
  const out = []
  for (let index = 0; index < items.length; index += size) out.push(items.slice(index, index + size))
  return out
}

function sectionForTool(tool, locale) {
  const sections = TOOL_SECTIONS_BY_LOCALE[locale] || TOOL_SECTIONS_ES
  return sections.find((section) => section.toolIds.includes(tool.id)) || sections[0]
}

function summarizeCategories(entries, locale) {
  const categoryById = CATEGORY_BY_ID_BY_LOCALE[locale] || CATEGORY_BY_ID_BY_LOCALE.es
  const generalLabel = locale === 'en' ? 'General' : 'General'
  const counts = new Map()
  for (const entry of entries) {
    const title = categoryById.get(entry.categoryId)?.title || entry.categoryId || generalLabel
    counts.set(title, (counts.get(title) || 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], locale === 'en' ? 'en' : 'es'))
    .slice(0, 5)
    .map(([title, count]) => `${title} (${count})`)
    .join(', ')
}

function promptCore(tool, task, index, locale) {
  const [categoryId, name, outcome, rule] = task
  const guide = tool.guide || {}
  const internalPieces = (guide.catalog?.items || [])
    .slice(0, 5)
    .map((item) => `${item.name}: ${item.what}`)
    .join('; ')

  if (locale === 'en') {
    const toolRole = compact(guide.plain || `Institutional tool: ${tool.label}.`, 340)
    const usage = compact(guide.usage?.explanation || `Check how ${tool.label} measures usage, limits, credits, tokens, tasks, runs or storage before scaling.`, 260)

    let text = `Act as an institutional architect of AI systems and operations. Your task is to help me use ${tool.label} inside a real organization, with governance, privacy, cost, maintenance and evidence criteria. Do not write a generic explanation of the tool or a pretty list of possibilities: turn my case into a decision, a test and a deliverable that someone else can review.\n\n## Context you must use\nInstitution: [INSTITUTION]. Area or team: [TEAM_AREA]. Person who needs to understand it: [PERSON_PROFILE]. Process or problem: [PROCESS_OR_PROBLEM]. Real input: [REAL_INPUT]. Expected output: [EXPECTED_OUTPUT]. Volume and frequency: [VOLUME_AND_FREQUENCY]. Constraints: [CONSTRAINTS]. Sensitive or forbidden data: [SENSITIVE_DATA]. Review date: [REVIEW_DATE].\n\n## Institutional assignment\nI need to ${outcome} using ${tool.label} only if it fits. In this tool, the starting role is this: ${toolRole} Internal pieces you must keep in mind: ${internalPieces || 'input, output, permissions, history, export and how to review results'}. Specific rule for this assignment: ${rule}\n\n## How you must work\nFirst check whether the brackets are fully filled in. If a data point that would change the decision is missing, ask me a single question and wait for my answer. If you can move forward with a minor assumption, mark it as ASSUMPTION and explain how it would be checked. Adapt the language to [PERSON_PROFILE]: if beginner, translate every technical word; if leadership, summarize impact, risk and cost; if a technical team, add data contracts, permissions and tests. Do not use real data in examples: invent realistic fictitious data and label it as fictitious.\n\n## Required output\nReturn the answer in this order. One: an institutional record under 180 words with objective, user, input, output, limit and success criterion. Two: a decision on whether ${tool.label} is sufficient, excessive or insufficient, comparing it with a simpler alternative and with the option of doing it manually in the first version. Three: concrete steps to execute the assignment, naming screen, button, field, file, node or workspace where relevant. Four: an acceptance test with a normal, incomplete, duplicate and extreme case. Five: privacy, permission, cost, provider-dependency and maintenance risks. Six: evidence I must keep: file, screenshot, link, log, table or written decision.\n\n## Institutional control\nBefore recommending to activate, publish, send, delete, charge, change permissions or share data, mark HUMAN APPROVAL REQUIRED. Define how the process stops if something fails. Explain how consumption is measured in ${tool.label}: ${usage} Do not invent prices or limits; if they may have changed, write CHECK THE OFFICIAL WEBSITE. End with a next action under thirty minutes and a closing sentence that starts with: The institutional decision is.`

    if (wordCount(text) < 560) {
      text += `\n\nAlso add a mini RACI matrix with responsible, approver, consulted and informed person. Include a version for a pilot with fictitious data and a version for real use, clearly separated. If real use requires a contract, license, legal review, internal policy or security validation, do not consider it resolved: leave it as a visible blocker.`
    }

    return {
      id: `${categoryId}:${tool.id}:extra-${String(index + 1).padStart(2, '0')}`,
      categoryId,
      toolId: tool.id,
      toolLabel: tool.label,
      source: 'Institutional bank',
      name: `${tool.label} · ${name}`,
      when: `Use it when you need to ${outcome}.`,
      prompt: text,
      fill: BASE_FILL_EN,
      expect: `An institutional output with decision, steps, test, risks, evidence and next action for ${tool.label}.`,
      next: 'Save the decision in My project and use the test with fictitious data before touching real accounts or data.',
    }
  }

  const toolRole = compact(guide.plain || `Herramienta institucional: ${tool.label}.`, 340)
  const usage = compact(guide.usage?.explanation || `Revisa cómo ${tool.label} mide uso, límites, créditos, tokens, tareas, ejecuciones o almacenamiento antes de escalar.`, 260)

  let text = `Actúa como arquitecta institucional de sistemas de IA y operaciones. Tu tarea es ayudarme a usar ${tool.label} dentro de una organización real, con criterio de gobierno, privacidad, coste, mantenimiento y evidencia. No escribas una explicación genérica de la herramienta ni una lista bonita de posibilidades: convierte mi caso en una decisión, una prueba y una entrega que otra persona pueda revisar.\n\n## Contexto que debes usar\nInstitución: [INSTITUCION]. Área o equipo: [AREA_EQUIPO]. Persona que necesita entenderlo: [PERFIL_PERSONA]. Proceso o problema: [PROCESO_O_PROBLEMA]. Entrada real: [ENTRADA_REAL]. Salida esperada: [SALIDA_ESPERADA]. Volumen y frecuencia: [VOLUMEN_Y_FRECUENCIA]. Restricciones: [RESTRICCIONES]. Datos sensibles o prohibidos: [DATOS_SENSIBLES]. Fecha de revisión: [FECHA_REVISION].\n\n## Encargo institucional\nNecesito ${outcome} usando ${tool.label} solo si encaja. En esta herramienta, el papel de partida es este: ${toolRole} Piezas internas que debes tener presentes: ${internalPieces || 'entrada, salida, permisos, historial, exportación y forma de revisar resultados'}. Regla específica del encargo: ${rule}\n\n## Cómo debes trabajar\nPrimero revisa si los corchetes están completos. Si falta un dato que cambie la decisión, hazme una sola pregunta y espera mi respuesta. Si puedes avanzar con un supuesto menor, márcalo como SUPUESTO y explica cómo se comprobaría. Adapta el lenguaje a [PERFIL_PERSONA]: si es principiante, traduce cada palabra técnica; si es dirección, resume impacto, riesgo y coste; si es equipo técnico, añade contratos de datos, permisos y pruebas. No uses datos reales en ejemplos: inventa datos ficticios realistas y señala que son ficticios.\n\n## Salida obligatoria\nDevuelve la respuesta en este orden. Uno: ficha institucional de menos de 180 palabras con objetivo, usuario, entrada, salida, límite y criterio de éxito. Dos: decisión sobre si ${tool.label} es suficiente, excesiva o insuficiente, comparándola con una alternativa más simple y con la opción de hacerlo manualmente en la primera versión. Tres: pasos concretos para ejecutar el encargo, indicando pantalla, botón, campo, archivo, nodo o espacio de trabajo cuando aplique. Cuatro: prueba de aceptación con caso normal, incompleto, duplicado y extremo. Cinco: riesgos de privacidad, permisos, coste, dependencia del proveedor y mantenimiento. Seis: evidencia que debo guardar: archivo, captura, enlace, log, tabla o decisión escrita.\n\n## Control institucional\nAntes de recomendar activar, publicar, enviar, borrar, cobrar, cambiar permisos o compartir datos, marca APROBACIÓN HUMANA OBLIGATORIA. Define cómo se detiene el proceso si algo falla. Explica cómo se mide el consumo en ${tool.label}: ${usage} No inventes precios ni límites; si pueden haber cambiado, escribe COMPROBAR EN LA WEB OFICIAL. Termina con una siguiente acción de menos de treinta minutos y una frase de cierre que empiece por: La decisión institucional es.`

  if (wordCount(text) < 560) {
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
    fill: BASE_FILL_ES,
    expect: `Una salida institucional con decisión, pasos, prueba, riesgos, evidencia y siguiente acción para ${tool.label}.`,
    next: 'Guarda la decisión en Mi proyecto y usa la prueba con datos ficticios antes de tocar cuentas o datos reales.',
  }
}

function importToolPrompt(tool, prompt, index, locale) {
  const categoryId = categoryForToolPrompt(prompt.name)

  if (locale === 'en') {
    let text = `Act as the institutional owner and adapt this ${tool.label} assignment to a real organization. Keep the goal of the original prompt, but add governance, privacy, cost, evidence, human review and a test with fictitious data. Required context: institution [INSTITUTION], area [TEAM_AREA], person [PERSON_PROFILE], process [PROCESS_OR_PROBLEM], input [REAL_INPUT], output [EXPECTED_OUTPUT], volume [VOLUME_AND_FREQUENCY], constraints [CONSTRAINTS], sensitive data [SENSITIVE_DATA] and date [REVIEW_DATE].\n\n## Base prompt you must execute\n${prompt.prompt}\n\n## Required institutional closing\nBefore finishing, turn the answer into a verifiable record: decision, steps, risks, normal/incomplete/duplicate/extreme test, evidence to keep, owner, cost or consumption measured and a condition for not activating it. If anything depends on prices, plans, permissions or current features, write CHECK THE OFFICIAL WEBSITE. Do not consider the work production-ready without human approval when there is sensitive data, publication, money or contact with people involved.`

    if (wordCount(text) < 560) {
      text += `\n\nIf the result is aimed at someone starting from scratch, translate every technical term and keep the next step under thirty minutes. If it is aimed at leadership, summarize decision, impact, risk and cost. If it is aimed at a technical team, add input, output, data contract and a repeatable test.`
    }

    return {
      id: `${categoryId}:${tool.id}:tool-${String(index + 1).padStart(2, '0')}`,
      categoryId,
      toolId: tool.id,
      toolLabel: tool.label,
      source: 'Tool guide',
      name: `${tool.label} · ${prompt.name}`,
      when: prompt.when || `Use it when working with ${tool.label} inside an institutional project.`,
      prompt: text,
      fill: BASE_FILL_EN,
      expect: `The ${tool.label} prompt turned into an institutional output with test, evidence, cost and limits.`,
      next: 'If the result is useful, save it in My project and mark the review date.',
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
    fill: BASE_FILL_ES,
    expect: `El prompt de ${tool.label} convertido en salida institucional con prueba, evidencia, coste y límites.`,
    next: 'Si el resultado sirve, guárdalo en Mi proyecto y deja marcada la fecha de revisión.',
  }
}

function importBasePrompt(family, prompt, index, locale) {
  const categoryId = BASE_FAMILY_CATEGORY[family.id] || 'proyecto-institucional'

  if (locale === 'en') {
    let text = `Act as the institutional owner and use the following base prompt inside a real organization. Do not answer as if it were a standalone personal task: adapt the output to a team, evidence, permissions, cost, maintenance, human review and traceability. Required context before answering: institution [INSTITUTION], area [TEAM_AREA], person [PERSON_PROFILE], process [PROCESS_OR_PROBLEM], input [REAL_INPUT], output [EXPECTED_OUTPUT], volume [VOLUME_AND_FREQUENCY], constraints [CONSTRAINTS], sensitive data [SENSITIVE_DATA] and date [REVIEW_DATE].\n\n## Base prompt from the previous library\n${prompt.prompt}\n\n## Institutional rules\nKeep the intent of the base prompt, but always end with a decision record, a test with fictitious data, evidence to keep, an owner, privacy and cost risks, a manual alternative and a stop condition. If data is missing, ask a single question. If something may have changed, write CHECK THE OFFICIAL WEBSITE.`

    if (wordCount(text) < 560) {
      text += `\n\nAdapt the explanation to [PERSON_PROFILE]. If beginner, give concrete instructions without jargon; if leadership, prioritize decision and risk; if a technical team, add data format, permissions and verification. Do not use real data in examples; use fictitious data and say so clearly.`
    }

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
      expect: prompt.expect || 'An institutional output with decision, test, evidence, risks and next step.',
      next: prompt.next || 'Save the useful result in My project and check what data is missing before building.',
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
    fill: [...BASE_FILL_ES, ...(prompt.fill || [])],
    expect: prompt.expect || 'Una salida institucional con decisión, prueba, evidencia, riesgos y siguiente paso.',
    next: prompt.next || 'Guarda el resultado útil en Mi proyecto y revisa qué dato falta antes de construir.',
  }
}

function importCoursePrompt(lesson, task, index, toolById, locale) {
  const tool = lesson.tool ? toolById.get(lesson.tool) : null
  const categoryId = categoryForToolPrompt(`${lesson.title} ${task.title} ${task.action}`)

  if (locale === 'en') {
    let text = `Act as the institutional owner of applied training. You are going to use a prompt that appears inside the course Program, but you must turn it into a complete institutional task: with context, a verifiable output, evidence, security, cost, an owner and a definition of done. Do not answer as an isolated exercise or as an informal conversation.\n\n## Required context\nInstitution: [INSTITUTION]. Area or team: [TEAM_AREA]. Person learning or executing: [PERSON_PROFILE]. Process or problem: [PROCESS_OR_PROBLEM]. Real input: [REAL_INPUT]. Expected output: [EXPECTED_OUTPUT]. Volume and frequency: [VOLUME_AND_FREQUENCY]. Constraints: [CONSTRAINTS]. Sensitive data: [SENSITIVE_DATA]. Review date: [REVIEW_DATE].\n\n## Origin of the prompt\nProgram lesson: ${lesson.title}. Task: ${task.title}. Where it is done: ${task.where}. Expected action: ${task.action}. Result you should see: ${task.expect}.${task.stuck ? ` If it does not work: ${task.stuck}.` : ''}${tool ? ` Related tool: ${tool.label}.` : ''}\n\n## Base prompt from the Program\n${task.prompt}\n\n## Required institutional adaptation\nBefore answering, check whether all the brackets are filled in. If a critical data point is missing, ask a single question and wait. Then return: one, an explanation for [PERSON_PROFILE] without unnecessary jargon; two, the concrete output that must be produced; three, numbered steps to execute it; four, a test with a normal, incomplete, duplicate and extreme case; five, data that must not be used yet; six, who approves and who keeps the evidence; seven, how consumption or effort is measured; eight, what you would do manually if the tool or the provider fails.\n\nDo not consider the task done just because the answer sounds good. There must be evidence: text, screenshot, file, log, link, table or written decision. If it involves activating, publishing, sending, deleting, charging, connecting credentials or sharing data, mark HUMAN APPROVAL REQUIRED. End with a next action under thirty minutes.`

    if (wordCount(text) < 560) {
      text += `\n\nInclude a handover note: how a beginner would explain this result, how a responsible person would review it and what a technical person would need to maintain it. Separate facts, assumptions and points to check. If there are prices, limits or product features, write CHECK THE OFFICIAL WEBSITE.`
    }

    return {
      id: `${categoryId}:${tool?.id || 'general'}:programa-${lesson.id}-${index + 1}`,
      categoryId,
      toolId: tool?.id || 'general',
      toolLabel: tool?.label || 'Institutional general',
      source: 'Program',
      name: `${tool ? `${tool.label} · ` : ''}${lesson.title} · ${task.title}`,
      when: `Use it when you want to redo the task "${task.title}" outside the lesson in institutional format.`,
      prompt: text,
      fill: BASE_FILL_EN,
      expect: 'An institutional version of the Program prompt with steps, test, evidence, approval and next action.',
      next: 'Save the result in My project as evidence of the lesson or as a project decision.',
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
    fill: BASE_FILL_ES,
    expect: 'Una versión institucional del prompt del Programa con pasos, prueba, evidencia, aprobación y siguiente acción.',
    next: 'Guarda el resultado en Mi proyecto como evidencia de la lección o como decisión del proyecto.',
  }
}

function importKitPrompt(kit, index, locale) {
  const title = kit.title

  if (locale === 'en') {
    const outcome = `design and implement this system: ${kit.promise || kit.title}`
    let text = `Act as an institutional architect of AI systems. I want to design the kit "${title}" for a real organization. Do not give me a collection of loose ideas: I need a working architecture that combines prompts, tools, automations, data, skills or procedures, governance, security, cost, documentation and operation.\n\n## Required context\nInstitution: [INSTITUTION]. Area or team that owns the system: [TEAM_AREA]. User profiles: [PERSON_PROFILE]. Main process or problem: [PROCESS_OR_PROBLEM]. Available inputs: [REAL_INPUT]. Expected output: [EXPECTED_OUTPUT]. Volume and frequency: [VOLUME_AND_FREQUENCY]. Time, budget and tool constraints: [CONSTRAINTS]. Sensitive or forbidden data: [SENSITIVE_DATA]. Review date: [REVIEW_DATE].\n\n## Kit objective\nI need to ${outcome}. Design the system as if you had to explain it to leadership, to a beginner and to a technical team. The answer should help decide what gets done first, what gets automated, what stays manual, what gets tested with fictitious data and what stays blocked until approved.\n\n## Required output\nReturn: one, a system map with modules and responsibilities; two, a list of candidate tools and why each one is included; three, prompt families needed and when they are used; four, possible automations with trigger, validation, action, logging and error path; five, reusable skills or procedures worth documenting; six, data that goes in, data that goes out and minimal permissions; seven, implementation phases from pilot to real use; eight, deliverables that must be kept; nine, privacy, cost, provider-dependency and maintenance risks; ten, criteria to say the kit is ready or must stay in testing.\n\n## Governance and testing\nBefore using real data, design a test with four cases: normal, incomplete, duplicate and extreme. For each case give a fictitious input, expected result, where it is checked, who approves it and what is kept as evidence. Mark HUMAN APPROVAL REQUIRED if the kit publishes, sends messages, changes permissions, deletes data, charges money or affects people. Do not invent prices or plan limits: write CHECK THE OFFICIAL WEBSITE. End with a first step under thirty minutes and a decision that can be pinned in My project.`

    if (wordCount(text) < 560) {
      text += `\n\nAdd an operation matrix with owner, approver, review frequency, failure signal, alert channel and rollback plan. If any part can be done manually during the pilot, recommend that before a complex automation. If a tool looks attractive but does not add evidence or control, propose discarding it for now.`
    }

    return {
      id: `proyecto-institucional:general:kit-${index + 1}`,
      categoryId: 'proyecto-institucional',
      toolId: 'general',
      toolLabel: 'Institutional general',
      source: 'Institutional kits',
      name: `Institutional kit · ${title}`,
      when: `Use it when you want to set up or review the "${title}" kit as a complete system.`,
      prompt: text,
      fill: BASE_FILL_EN,
      expect: 'A complete institutional architecture with tools, prompts, automations, governance, tests and deliverables.',
      next: 'Save the system map in My project and turn the first phase into small tasks.',
    }
  }

  const outcome = `diseñar e implantar este sistema: ${kit.promise || kit.title}`
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
    fill: BASE_FILL_ES,
    expect: 'Una arquitectura institucional completa con herramientas, prompts, automatizaciones, gobierno, pruebas y entregables.',
    next: 'Guarda el mapa del sistema en Mi proyecto y convierte la primera fase en tareas pequeñas.',
  }
}

function makeFamily(meta, extra = {}, locale = 'es') {
  return {
    id: meta.id,
    title: meta.title,
    intro: meta.intro,
    model: BASE_MODEL_BY_LOCALE[locale] || BASE_MODEL_ES,
    prompts: [],
    categoryId: meta.categoryId || meta.id,
    ...(FAMILY_GUIDANCE_BY_LOCALE[locale] || FAMILY_GUIDANCE_ES),
    ...extra,
  }
}

export function buildInstitutionalPromptLibrary(baseFamilies, toolPages, cursoFiles = [], kits = [], locale = 'es') {
  const loc = locale === 'en' ? 'en' : 'es'
  const categoryMeta = CATEGORY_META_BY_LOCALE[loc]
  const categoryById = CATEGORY_BY_ID_BY_LOCALE[loc]
  const generalSection = GENERAL_SECTION_BY_LOCALE[loc]
  const extraTasks = EXTRA_TASKS_BY_LOCALE[loc]

  const toolById = new Map((toolPages || []).map((tool) => [tool.id, tool]))
  const generalEntries = []
  const output = []

  const pushGeneral = (entry) => {
    if (categoryById.has(entry.categoryId)) generalEntries.push(entry)
  }

  for (const family of baseFamilies || []) {
    for (const [index, prompt] of (family.prompts || []).entries()) {
      pushGeneral(importBasePrompt(family, prompt, index, loc))
    }
  }

  // Un prompt de arranque por cada kit institucional real, sin lista paralela
  // que se desincronice cuando se añadan kits.
  for (const [index, kit] of (kits || []).entries()) {
    pushGeneral(importKitPrompt(kit, index, loc))
  }

  for (const lesson of cursoFiles || []) {
    for (const [index, task] of (lesson.tasks || []).filter((item) => item.prompt).entries()) {
      pushGeneral(importCoursePrompt(lesson, task, index, toolById, loc))
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
    const purposePrefix = loc === 'en' ? /^Institutional prompts to /i : /^Prompts (institucionales )?para /i
    const purpose = meta.intro.replace(purposePrefix, '').toLowerCase()
    for (const [index, group] of groups.entries()) {
      const suffix = groups.length > 1 ? (loc === 'en' ? ` · batch ${index + 1} of ${groups.length}` : ` · lote ${index + 1} de ${groups.length}`) : ''
      output.push(makeFamily(
        {
          id: `general-${meta.id}${groups.length > 1 ? `-${index + 1}` : ''}`,
          title: `${meta.title}${suffix}`,
          intro: loc === 'en'
            ? `${group.length} institutional prompts to ${purpose}`
            : `${group.length} prompts institucionales para ${purpose}`,
          categoryId: meta.id,
        },
        {
          sectionId: generalSection.id,
          sectionTitle: generalSection.title,
          sectionDescription: generalSection.description,
          blockTitle: `${meta.title}${suffix}`,
          blockDescription: loc === 'en'
            ? `${group.length} ready-to-copy prompts to ${purpose}`
            : `${group.length} prompts listos para copiar, para ${purpose}`,
          useCase: generalSection.useCase,
          audience: generalSection.audience,
          toolId: 'general',
          toolLabel: loc === 'en' ? 'Institutional general' : 'General institucional',
          source: loc === 'en' ? 'General' : 'General',
          prompts: group,
        },
        loc,
      ))
    }
  }

  for (const tool of toolPages || []) {
    if (MANUAL_ONLY_TOOLS.has(tool.id)) continue

    const section = sectionForTool(tool, loc)
    const allowedCategories = SECTION_CATEGORY_IDS[section.id] || SECTION_CATEGORY_IDS['asistentes-modelos']

    const imported = (tool.guide?.prompts || [])
      .slice(0, 20)
      .map((prompt, index) => importToolPrompt(tool, prompt, index, loc))
    // Solo los encargos que tienen sentido con esta herramienta: nada de
    // rellenar hasta una cifra fija con combinaciones absurdas.
    const extras = extraTasks
      .filter((task) => allowedCategories.has(task[0]))
      .map((task, index) => promptCore(tool, task, index, loc))
    const prompts = [...imported, ...extras].slice(0, 50)

    output.push(makeFamily(
      {
        id: `herramienta-${tool.id}`,
        title: loc === 'en' ? `${tool.label} · ${prompts.length} prompts` : `${tool.label} · ${prompts.length} prompts`,
        intro: loc === 'en'
          ? `${prompts.length} institutional prompts to use ${tool.label} in real projects, with fillable brackets, testing, evidence, cost, privacy and delivery.`
          : `${prompts.length} prompts institucionales para usar ${tool.label} dentro de proyectos reales, con corchetes rellenables, prueba, evidencia, coste, privacidad y entrega.`,
        categoryId: 'herramienta',
      },
      {
        sectionId: section.id,
        sectionTitle: section.title,
        sectionDescription: section.description,
        blockTitle: tool.label,
        blockDescription: loc === 'en'
          ? `${prompts.length} prompts relevant to ${tool.label}. Work is split across ${summarizeCategories(prompts, loc)}.`
          : `${prompts.length} prompts pertinentes para ${tool.label}. Reparte el trabajo entre ${summarizeCategories(prompts, loc)}.`,
        useCase: section.useCase,
        audience: section.audience,
        toolId: tool.id,
        toolLabel: tool.label,
        source: loc === 'en' ? 'Tool' : 'Herramienta',
        prompts,
        canDo: loc === 'en' ? [
          `Work with ${tool.label} without starting from loose buttons: problem, input, output, test and evidence first.`,
          'Pick the prompt by concrete intent and adapt the language to beginners, leadership or a technical team.',
          'Connect the tool with the rest of the institutional project without forgetting privacy, cost and maintenance.',
        ] : [
          `Trabajar con ${tool.label} sin empezar por botones sueltos: primero problema, entrada, salida, prueba y evidencia.`,
          'Elegir el prompt por intención concreta y adaptar el lenguaje a principiantes, dirección o equipo técnico.',
          'Conectar la herramienta con el resto del proyecto institucional sin olvidar privacidad, coste y mantenimiento.',
        ],
        cantDo: loc === 'en' ? [
          'It does not replace an official review of prices, plans, permissions or recent provider features.',
          'It does not turn a personal account into an institutional system without a data policy, approval and logging.',
          'It does not activate sensitive actions without a test with fictitious data and human approval.',
        ] : [
          'No sustituye la revisión oficial de precios, planes, permisos o funciones recientes del proveedor.',
          'No convierte una cuenta personal en sistema institucional sin política de datos, aprobación y registro.',
          'No activa acciones sensibles sin prueba con datos ficticios y aprobación humana.',
        ],
        tips: loc === 'en' ? [
          `If you do not know where to start with ${tool.label}, use the learning, comparing and project-definition prompts first.`,
          'Then filter within the batch by automating, data, agents, security, testing or delivery.',
          'Only keep prompts that produce evidence useful for My project.',
        ] : [
          `Si no sabes por dónde empezar con ${tool.label}, usa primero los prompts de aprender, comparar y definir proyecto.`,
          'Después filtra dentro del lote por automatizar, datos, agentes, seguridad, prueba o entrega.',
          'Guarda solo los prompts que produzcan una evidencia útil para Mi proyecto.',
        ],
      },
      loc,
    ))
  }

  return output.filter((family) => family.prompts.length)
}
