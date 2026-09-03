/**
 * Taxonomía de la academia.
 *
 * Define el itinerario que ve el alumno (la "Ruta"), cómo se reparten las
 * carpetas del vault dentro de ese itinerario, qué herramientas reconocemos
 * para pintar su logo real, y el banco de analogías del nivel básico.
 *
 * Este archivo es contenido editorial, no lógica. Se edita a mano.
 */

/** Etapas de la Ruta. El orden es el orden en que se aprende. */
export const STAGES = [
  {
    id: 'fundamentos',
    number: '01',
    title: 'Cómo piensa un modelo de lenguaje',
    tagline: 'Entender la máquina antes de darle órdenes',
    description:
      'Qué hay realmente dentro de un modelo, por qué inventa, qué es el contexto y dónde están sus límites. Sin esto, todo lo demás es magia.',
    milestone: 'Sabes explicar con tus palabras por qué un modelo falla',
    accent: 'violet',
  },
  {
    id: 'prompting',
    number: '02',
    title: 'Pedir las cosas de forma profesional',
    tagline: 'De la charla a la instrucción verificable',
    description:
      'Convertir una petición vaga en una instrucción con formato, criterio de éxito y forma de comprobar que la respuesta sirve.',
    milestone: 'Tienes prompts reutilizables con salida verificable',
    accent: 'blue',
  },
  {
    id: 'entorno',
    number: '03',
    title: 'Montar el entorno de trabajo',
    tagline: 'Terminal, versiones, claves y carpetas',
    description:
      'Dejar el ordenador preparado para trabajar de verdad: terminal, control de versiones, variables de entorno y una estructura de proyecto que otra persona pueda repetir.',
    milestone: 'Entorno reproducible y documentado',
    accent: 'slate',
  },
  {
    id: 'asistentes',
    number: '04',
    title: 'Programar acompañado por IA',
    tagline: 'Claude Code, Codex, Copilot y Cursor',
    description:
      'Usar asistentes de código como lo que son: un compañero rápido que se equivoca. Cuándo delegar, cómo revisar y cómo no romper lo que ya funciona.',
    milestone: 'Un cambio real hecho con asistente y revisado por ti',
    accent: 'amber',
  },
  {
    id: 'automatizacion',
    number: '05',
    title: 'Automatizar procesos con n8n',
    tagline: 'Del clic repetido al flujo que se ejecuta solo',
    description:
      'Diseñar, construir y romper flujos de trabajo reales: disparador, datos, decisión, acción y registro de lo que pasó.',
    milestone: 'Un workflow que funciona y que sabes reparar',
    accent: 'rose',
  },
  {
    id: 'agentes',
    number: '06',
    title: 'Agentes, MCP y herramientas',
    tagline: 'Cuando el modelo deja de responder y empieza a actuar',
    description:
      'La diferencia entre un chat y un agente, cómo se le dan herramientas, qué es MCP y dónde poner el freno humano.',
    milestone: 'Un agente con herramientas y límites explícitos',
    accent: 'teal',
  },
  {
    id: 'datos',
    number: '07',
    title: 'Conectar la IA a tus datos',
    tagline: 'RAG, embeddings y documentos propios',
    description:
      'Cómo hacer que el modelo responda con TU información: trocear, indexar, recuperar y comprobar que la respuesta viene de una fuente y no de la imaginación.',
    milestone: 'Respuestas con fuente citada y verificable',
    accent: 'indigo',
  },
  {
    id: 'calidad',
    number: '08',
    title: 'Probar, medir y reparar',
    tagline: 'Lo que no se mide, no se entrega',
    description:
      'Pruebas, evaluaciones, registros y postmortems. Provocar el fallo a propósito para saber cómo se comporta el sistema cuando se rompe.',
    milestone: 'Un caso roto diagnosticado y reparado con evidencia',
    accent: 'orange',
  },
  {
    id: 'seguridad',
    number: '09',
    title: 'Seguridad, privacidad y coste',
    tagline: 'Lo que separa una demo de un sistema en producción',
    description:
      'Datos personales, secretos, permisos, límites de gasto y acciones que necesitan aprobación humana antes de ejecutarse.',
    milestone: 'Checklist de producción firmado',
    accent: 'red',
  },
  {
    id: 'entrega',
    number: '10',
    title: 'Entregar, defender y vender',
    tagline: 'Convertir el trabajo en algo que otro puede usar y pagar',
    description:
      'Documentación, demo repetible, caso de estudio, defensa de decisiones y propuesta comercial.',
    milestone: 'Paquete de entrega y defensa del proyecto',
    accent: 'green',
  },
]

export const STAGE_IDS = STAGES.map((stage) => stage.id)

/**
 * Reparto de las carpetas del vault dentro de las etapas.
 * La clave es el prefijo numérico de la carpeta raíz.
 */
const FOLDER_STAGE = {
  0: 'fundamentos',
  1: 'fundamentos',
  2: 'fundamentos',
  3: 'fundamentos',
  4: 'asistentes',
  5: 'calidad',
  6: 'entrega',
  7: 'calidad',
  8: 'prompting',
  9: 'fundamentos',
  10: 'entorno',
  11: 'entrega',
  12: 'fundamentos',
  13: 'agentes',
  14: 'calidad',
  15: 'asistentes',
  16: 'entrega',
  17: 'fundamentos',
  18: 'prompting',
  19: 'entrega',
  20: 'entrega',
  21: 'calidad',
  22: 'entrega',
  23: 'calidad',
  24: 'entrega',
  25: 'calidad',
  26: 'fundamentos',
  27: 'automatizacion',
  28: 'seguridad',
  29: 'entrega',
  30: 'fundamentos',
  33: 'entorno',
  34: 'entrega',
  35: 'automatizacion',
  99: 'calidad',
}

/**
 * Subcarpetas de 04_CLASES_POR_HERRAMIENTA que merecen etapa propia,
 * porque la carpeta agrupa herramientas de mundos muy distintos.
 */
const SUBFOLDER_STAGE = [
  [/00_AI_Foundations/i, 'fundamentos'],
  [/01_ChatGPT_Workflows/i, 'prompting'],
  [/02_Codex/i, 'asistentes'],
  [/03_Claude/i, 'asistentes'],
  [/04_Gemini/i, 'asistentes'],
  [/05_GitHub_Skills_Copilot/i, 'asistentes'],
  [/06_n8n/i, 'automatizacion'],
  [/07_Agentes_MCP_Skills/i, 'agentes'],
  [/08_Produccion_Seguridad_Evals/i, 'seguridad'],
  [/workflows_n8n_40/i, 'automatizacion'],
  [/skills_40/i, 'agentes'],
  [/automatizaciones_codigo/i, 'automatizacion'],
]

/** Señales en el título que mandan por encima de la carpeta. */
const TITLE_STAGE = [
  [/\brag\b|embedding|vector|chunk|recuperaci[oó]n|knowledge base/i, 'datos'],
  [/\bmcp\b|agente|agent |tool use|skills?\b|orquestaci[oó]n/i, 'agentes'],
  [/\bn8n\b|workflow|automatizaci[oó]n|webhook|zapier|make\b/i, 'automatizacion'],
  [/prompt|instrucci[oó]n|few[- ]shot|system message|plantilla de prompt/i, 'prompting'],
  [/rgpd|gdpr|\bpii\b|secret|privacidad|seguridad|consentimiento|permission|coste|budget|guardrail/i, 'seguridad'],
  [/test|prueba|eval|playwright|observabilidad|postmortem|monitor|regresi[oó]n|logs?\b/i, 'calidad'],
  [/docker|terminal|homebrew|instalaci[oó]n|setup|variables de entorno|\benv\b|deploy|vercel|supabase/i, 'entorno'],
  [/claude code|codex|copilot|cursor|gemini cli|asistente de c[oó]digo/i, 'asistentes'],
  [/portfolio|cliente|propuesta|factura|precio|venta|negocio|capstone|defensa|certificaci[oó]n|rúbrica|rubrica/i, 'entrega'],
  [/token|contexto|alucina|temperatura|par[aá]metro|c[oó]mo funciona un modelo|transformer|llm\b/i, 'fundamentos'],
]

export function stageFor(relativePath, title = '') {
  for (const [pattern, stage] of TITLE_STAGE) {
    if (pattern.test(title)) return stage
  }
  for (const [pattern, stage] of SUBFOLDER_STAGE) {
    if (pattern.test(relativePath)) return stage
  }
  const prefix = Number(relativePath.match(/^(\d+)/)?.[1] ?? -1)
  return FOLDER_STAGE[prefix] || 'fundamentos'
}

/**
 * Herramientas reconocidas. `icon` es el nombre del SVG en /brand,
 * descargado de los repositorios oficiales de marca.
 */
export const TOOLS = [
  { id: 'higgsfield', label: 'Higgsfield', icon: 'higgsfield', match: /higgs?field/i },
  { id: 'nano-banana', label: 'Nano Banana', icon: 'replicate', match: /nano ?banana/i },
  { id: 'seedance-2-5', label: 'Seedance 2.5', icon: 'replicate', match: /seedance(?:\s|-)2\.?5|seedance|sidans(?:\s|-)2\.?5|sidans/i },
  { id: 'base44', label: 'Base44', icon: 'react', match: /base ?44/i },
  { id: 'bolt', label: 'Bolt.new', icon: 'react', match: /bolt\.new|bolts+ai/i },
  { id: 'replit', label: 'Replit', icon: 'nodedotjs', match: /replit|replit agent/i },
  { id: 'framer', label: 'Framer', icon: 'figma', match: /framer/i },
  { id: 'canva', label: 'Canva', icon: 'figma', match: /canva/i },
  { id: 'heygen', label: 'HeyGen', icon: 'replicate', match: /heygen/i },
  { id: 'descript', label: 'Descript', icon: 'replicate', match: /descript/i },
  { id: 'wispr-flow', label: 'Wispr Flow', icon: 'wisprflow', match: /wispr\s*flow|\bwispr\b|dictado\s+por\s+voz|voice[- ]to[- ]text/i },
  { id: 'gamma', label: 'Gamma', icon: 'replicate', match: /gamma\.app|gamma ai/i },
  { id: 'pipedream', label: 'Pipedream', icon: 'n8n', match: /pipedream/i },
  { id: 'notebooklm', label: 'NotebookLM', icon: 'googlegemini', match: /notebooklm/i },
  { id: 'airtable', label: 'Airtable', icon: 'airtable', match: /airtable/i },
  // Herramientas de construccion y creacion con IA que entran en el itinerario.
  { id: 'lovable', label: 'Lovable', icon: 'react', match: /\blovable\b/i },
  { id: 'v0', label: 'v0', icon: 'vercel', match: /\bv0\.dev\b|\bv0\b(?= de vercel)/i },
  { id: 'cursor', label: 'Cursor', icon: 'vscode', match: /\bcursor\b(?!\s*(?:de|del)\s*rat[oó]n)/i },
  { id: 'elevenlabs', label: 'ElevenLabs', icon: 'replicate', match: /eleven ?labs/i },
  { id: 'midjourney', label: 'Midjourney', icon: 'replicate', match: /mid ?journey/i },
  { id: 'runway', label: 'Runway', icon: 'replicate', match: /\brunway\b|\bgen-?[34]\b/i },
  { id: 'openai', label: 'OpenAI', icon: 'openai', match: /\bopenai\b|\bgpt-?[45]|\bchatgpt\b|\bo[13]\b/i },
  { id: 'anthropic', label: 'Anthropic', icon: 'anthropic', match: /\banthropic\b/i },
  { id: 'claude', label: 'Claude', icon: 'claude', match: /\bclaude\b/i },
  { id: 'claude-code', label: 'Claude Code', icon: 'claude', match: /claude ?code/i },
  { id: 'codex', label: 'Codex', icon: 'openai', match: /\bcodex\b/i },
  { id: 'gemini', label: 'Gemini', icon: 'googlegemini', match: /\bgemini\b|\bbard\b/i },
  { id: 'copilot', label: 'GitHub Copilot', icon: 'githubcopilot', match: /copilot/i },
  { id: 'github', label: 'GitHub', icon: 'github', match: /\bgithub\b|\bgh\b\s|\bgit\b/i },
  { id: 'n8n', label: 'n8n', icon: 'n8n', match: /\bn8n\b/i },
  { id: 'zapier', label: 'Zapier', icon: 'zapier', match: /\bzapier\b/i },
  { id: 'make', label: 'Make', icon: 'make', match: /\bmake\.com\b|\bintegromat\b/i },
  { id: 'docker', label: 'Docker', icon: 'docker', match: /\bdocker\b|contenedor/i },
  { id: 'vercel', label: 'Vercel', icon: 'vercel', match: /\bvercel\b/i },
  { id: 'supabase', label: 'Supabase', icon: 'supabase', match: /\bsupabase\b/i },
  { id: 'postgres', label: 'PostgreSQL', icon: 'postgresql', match: /\bpostgres|\bpgvector\b|\bsql\b/i },
  { id: 'python', label: 'Python', icon: 'python', match: /\bpython\b|\bpip\b|\.py\b/i },
  { id: 'node', label: 'Node.js', icon: 'nodedotjs', match: /\bnode(?:\.js)?\b|\bnpm\b|\bnpx\b/i },
  { id: 'typescript', label: 'TypeScript', icon: 'typescript', match: /\btypescript\b|\.tsx?\b/i },
  { id: 'react', label: 'React', icon: 'react', match: /\breact\b/i },
  { id: 'vscode', label: 'VS Code', icon: 'vscode', match: /\bvs ?code\b|visual studio code/i },
  { id: 'obsidian', label: 'Obsidian', icon: 'obsidian', match: /\bobsidian\b/i },
  { id: 'notion', label: 'Notion', icon: 'notion', match: /\bnotion\b/i },
  { id: 'slack', label: 'Slack', icon: 'slack', match: /\bslack\b/i },
  { id: 'gmail', label: 'Gmail', icon: 'gmail', match: /\bgmail\b/i },
  { id: 'sheets', label: 'Google Sheets', icon: 'googlesheets', match: /google sheets|hoja de c[aá]lculo/i },
  { id: 'telegram', label: 'Telegram', icon: 'telegram', match: /\btelegram\b/i },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', match: /\bwhatsapp\b/i },
  { id: 'huggingface', label: 'Hugging Face', icon: 'huggingface', match: /hugging ?face/i },
  { id: 'langchain', label: 'LangChain', icon: 'langchain', match: /langchain|langgraph/i },
  { id: 'ollama', label: 'Ollama', icon: 'ollama', match: /\bollama\b/i },
  { id: 'perplexity', label: 'Perplexity', icon: 'perplexity', match: /\bperplexity\b/i },
  { id: 'figma', label: 'Figma', icon: 'figma', match: /\bfigma\b/i },
  { id: 'colab', label: 'Google Colab', icon: 'googlecolab', match: /\bcolab\b/i },
  { id: 'tailwind', label: 'Tailwind', icon: 'tailwindcss', match: /\btailwind\b/i },
  { id: 'replicate', label: 'Replicate', icon: 'replicate', match: /\breplicate\b/i },
]

/**
 * Devuelve los ids de herramienta de las que la lección va DE VERDAD.
 *
 * Antes bastaba una mención en cualquier parte del texto, y n8n acababa
 * "presente" en casi todas las lecciones: la página de la herramienta era un
 * listado inútil. Ahora una herramienta cuenta solo si se nombra en el título
 * o si se repite lo suficiente como para ser protagonista.
 */
export function detectTools(text, limit = 6, title = '') {
  const scored = []
  for (const tool of TOOLS) {
    const enTitulo = new RegExp(tool.match.source, 'i').test(title)
    const hits = text.match(new RegExp(tool.match.source, 'gi'))?.length || 0
    // Protagonista: está en el título, o aparece 5+ veces en el cuerpo.
    if (enTitulo || hits >= 5) scored.push({ id: tool.id, hits: hits + (enTitulo ? 100 : 0) })
  }
  return scored
    .sort((a, b) => b.hits - a.hits)
    .slice(0, limit)
    .map((item) => item.id)
}

/**
 * Analogías del nivel básico. Se eligen por tema, no al azar:
 * cada una traduce un concepto técnico a algo que el alumno ya conoce.
 */
export const ANALOGIES = [
  {
    match: /token|contexto|ventana de contexto|memoria/i,
    title: 'La mesa de trabajo',
    text: 'El contexto es la mesa donde el modelo trabaja. Cabe lo que cabe. Si metes un libro entero, lo primero que dejaste se cae por el borde y deja de existir para él. Por eso "se le olvida" lo que dijiste al principio de una conversación larga.',
  },
  {
    match: /alucina|invent|verificar|fuente|hallucinat/i,
    title: 'El alumno que nunca dice "no lo sé"',
    text: 'Imagina a alguien que ha leído medio internet pero al que le han enseñado que quedarse callado está mal. Ante una pregunta que no domina, no calla: rellena. Y lo rellena con la forma correcta, que es lo peligroso. Suena a verdad porque tiene la estructura de la verdad.',
  },
  {
    match: /prompt|instrucci[oó]n|few[- ]shot/i,
    title: 'El encargo al proveedor',
    text: 'Un prompt es un encargo. "Hazme algo bonito" y "necesito 500 unidades, en azul Pantone 286, entregadas el día 12, con esta plantilla de factura" son el mismo encargo con distinto resultado. La diferencia no es educación: es que el segundo se puede comprobar.',
  },
  {
    match: /\brag\b|embedding|vector|recuperaci[oó]n|chunk/i,
    title: 'El archivador con buen bibliotecario',
    text: 'RAG no le enseña nada nuevo al modelo. Le pone al lado un bibliotecario que, antes de que responda, corre al archivo, saca las tres fichas relevantes y se las deja encima de la mesa. El modelo sigue sin saber; simplemente ahora tiene la ficha delante.',
  },
  {
    match: /agente|\bmcp\b|tool use|herramienta/i,
    title: 'El becario con llaves',
    text: 'Un chat opina. Un agente tiene llaves: puede abrir el correo, entrar en la base de datos y mandar cosas. La pregunta deja de ser "¿acierta?" y pasa a ser "¿qué pasa el día que se equivoque con las llaves puestas?".',
  },
  {
    match: /\bn8n\b|workflow|automatizaci[oó]n|webhook/i,
    title: 'La cadena de montaje',
    text: 'Un workflow es una cinta transportadora. En un extremo entra una pieza (un email, un formulario), pasa por estaciones que la revisan, la marcan o la transforman, y sale por el otro convertida en otra cosa. Si una estación se para, se para todo: por eso importa saber cuál falló.',
  },
  {
    match: /api|clave|token de acceso|credencial|secret/i,
    title: 'La llave del hotel',
    text: 'Una clave API es la tarjeta de tu habitación de hotel. Abre solo lo tuyo, se puede desactivar sin cambiar la cerradura, y si la dejas en la barra del bar, quien la coja entra a tu cuarto y el hotel te cobra el minibar a ti.',
  },
  {
    match: /test|prueba|eval|regresi[oó]n|calidad/i,
    title: 'El simulacro de incendio',
    text: 'Probar no es comprobar que funciona cuando todo va bien. Eso ya lo sabes. Probar es prender fuego a propósito, con el extintor en la mano, para descubrir que la salida de emergencia estaba cerrada con llave.',
  },
  {
    match: /rgpd|gdpr|\bpii\b|privacidad|dato personal/i,
    title: 'La fotocopia del DNI',
    text: 'Cada dato personal que metes en un sistema es una fotocopia de un DNI que alguien te confió. La pregunta legal y la humana son la misma: ¿cuántas copias has hecho, dónde están, y quién las va a romper cuando ya no hagan falta?',
  },
  {
    match: /terminal|comando|bash|powershell|shell/i,
    title: 'La puerta de servicio',
    text: 'La terminal es la puerta de servicio del ordenador. No es más difícil que la de delante: es que no tiene carteles. Una vez sabes los cuatro nombres de las salas, se llega antes por aquí que dando la vuelta por el vestíbulo.',
  },
  {
    match: /git\b|versiones|commit|repositorio/i,
    title: 'La partida guardada',
    text: 'Git son los puntos de guardado de un videojuego. Puedes probar la ruta suicida sabiendo que, si sale mal, vuelves al último guardado sin haber perdido nada. Sin eso, cada cambio es jugar en modo difícil sin guardar.',
  },
  {
    match: /coste|token|precio|budget|gasto/i,
    title: 'El taxímetro',
    text: 'Cada palabra que entra y sale del modelo tiene precio. Es un taxímetro corriendo. Un bucle mal cerrado no es un error de código: es un taxi dando vueltas a la manzana toda la noche con la factura a tu nombre.',
  },
  {
    match: /docker|contenedor|entorno/i,
    title: 'La maleta preparada',
    text: 'Un contenedor es una maleta con todo dentro: la ropa, el enchufe y el adaptador. Da igual en qué hotel la abras, funciona igual. Es la respuesta a "en mi ordenador sí iba".',
  },
  {
    match: /copilot|cursor|asistente de c[oó]digo|autocompletado|pair programming/i,
    title: 'El copiloto que no mira la carretera',
    text: 'Un asistente de código va a tu lado y sugiere sin parar, con una seguridad absoluta y sin mirar por la ventanilla. Acierta muchísimo, y precisamente por eso el día que se equivoca no lo ves venir: llevabas veinte sugerencias buenas seguidas y habías dejado de comprobar.',
  },
  {
    match: /entrega|cliente|portfolio|propuesta|traspaso|documentaci[oó]n de/i,
    title: 'El mueble con instrucciones',
    text: 'Entregar no es dejar el mueble montado en el salón. Es dejarlo montado, con las instrucciones, la llave allen, los tornillos que sobraron y una nota que diga qué hacer si cojea. Si tienen que llamarte para usarlo, no lo has entregado: lo has prestado.',
  },
  {
    match: /modelo|llm|transformer|entrenamiento/i,
    title: 'El autocompletado con estudios',
    text: 'En el fondo, un modelo hace lo mismo que el teclado del móvil cuando adivina la siguiente palabra. La diferencia es que ha leído muchísimo más y mira mucho más atrás. No razona como tú: calcula qué palabra encaja después. Que a menudo acierte no cambia lo que está haciendo.',
  },
]

/**
 * Analogía por defecto de cada etapa. Garantiza que ninguna lección de nivel
 * básico se quede sin una imagen mental con la que agarrarse.
 */
const STAGE_ANALOGY = {
  fundamentos: 'El autocompletado con estudios',
  prompting: 'El encargo al proveedor',
  entorno: 'La puerta de servicio',
  asistentes: 'El copiloto que no mira la carretera',
  automatizacion: 'La cadena de montaje',
  agentes: 'El becario con llaves',
  datos: 'El archivador con buen bibliotecario',
  calidad: 'El simulacro de incendio',
  seguridad: 'La fotocopia del DNI',
  entrega: 'El mueble con instrucciones',
}

export function analogyFor(text, stageId) {
  const direct = ANALOGIES.find((item) => item.match.test(text))
  if (direct) return direct
  const fallback = STAGE_ANALOGY[stageId]
  return ANALOGIES.find((item) => item.title === fallback) || null
}

/** Etiquetas de tipo de lección, con su color e icono conceptual. */
export const KINDS = {
  concepto: { label: 'Concepto', hint: 'Idea que tienes que entender antes de tocar nada' },
  practica: { label: 'Práctica guiada', hint: 'Se hace con las manos, paso a paso' },
  workflow: { label: 'Workflow', hint: 'Flujo de automatización real, importable' },
  skill: { label: 'Skill', hint: 'Procedimiento reutilizable que puedes instalar' },
  proyecto: { label: 'Proyecto', hint: 'Caso completo de principio a fin' },
  guia: { label: 'Guía', hint: 'Instalación y configuración reproducible' },
  referencia: { label: 'Referencia', hint: 'Material de consulta, no lineal' },
}
