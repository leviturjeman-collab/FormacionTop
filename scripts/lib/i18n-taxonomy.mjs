/**
 * Traducción al inglés de la taxonomía fija del curso: etapas de la Ruta,
 * tipos de lección y secciones de la biblioteca. Las lecciones generadas
 * desde el vault (markdown) siguen en español; esto traduce la navegación
 * y las cabeceras que sí son texto de código, no de contenido.
 */

export const STAGE_EN = {
  fundamentos: {
    title: 'How a language model thinks',
    tagline: 'Understand the machine before you give it orders',
    description:
      "What's really inside a model, why it makes things up, what context is and where its limits are. Without this, everything else is magic.",
    milestone: 'You can explain in your own words why a model fails',
  },
  prompting: {
    title: 'Asking for things professionally',
    tagline: 'From chatting to a verifiable instruction',
    description:
      'Turning a vague request into an instruction with format, a success criterion and a way to check the answer is actually useful.',
    milestone: 'You have reusable prompts with verifiable output',
  },
  entorno: {
    title: 'Setting up your work environment',
    tagline: 'Terminal, versions, keys and folders',
    description:
      'Getting your computer ready to work for real: terminal, version control, environment variables and a project structure someone else could repeat.',
    milestone: 'A reproducible, documented environment',
  },
  asistentes: {
    title: 'Coding alongside AI',
    tagline: 'Claude Code, Codex, Copilot and Cursor',
    description:
      'Using code assistants for what they are: a fast partner that gets things wrong. When to delegate, how to review, and how not to break what already works.',
    milestone: 'A real change made with an assistant and reviewed by you',
  },
  automatizacion: {
    title: 'Automating processes with n8n',
    tagline: 'From the repeated click to the flow that runs itself',
    description:
      'Designing, building and breaking real workflows: trigger, data, decision, action and a record of what happened.',
    milestone: 'A workflow that works, and that you know how to fix',
  },
  agentes: {
    title: 'Agents, MCP and tools',
    tagline: 'When the model stops just answering and starts acting',
    description:
      'The difference between a chat and an agent, how you give it tools, what MCP is, and where to put the human brake.',
    milestone: 'An agent with tools and explicit limits',
  },
  datos: {
    title: 'Connecting AI to your data',
    tagline: 'RAG, embeddings and your own documents',
    description:
      "How to make the model answer with YOUR information: chunk it, index it, retrieve it and check the answer comes from a source, not from imagination.",
    milestone: 'Answers with a cited, verifiable source',
  },
  calidad: {
    title: 'Testing, measuring and fixing',
    tagline: "What isn't measured doesn't ship",
    description:
      'Tests, evaluations, logs and postmortems. Triggering the failure on purpose to know how the system behaves when it breaks.',
    milestone: 'A broken case diagnosed and fixed with evidence',
  },
  seguridad: {
    title: 'Security, privacy and cost',
    tagline: 'What separates a demo from a system in production',
    description:
      'Personal data, secrets, permissions, spending limits and actions that need human approval before they run.',
    milestone: 'A signed-off production checklist',
  },
  entrega: {
    title: 'Delivering, defending and selling',
    tagline: 'Turning the work into something someone else can use and pay for',
    description:
      'Documentation, a repeatable demo, a case study, defending your decisions and a commercial proposal.',
    milestone: 'A delivery package and project defense',
  },
}

export const KIND_EN = {
  concepto: { label: 'Concept', hint: 'An idea you need to understand before touching anything' },
  practica: { label: 'Guided practice', hint: 'Hands-on, step by step' },
  workflow: { label: 'Workflow', hint: 'A real, importable automation flow' },
  skill: { label: 'Skill', hint: 'A reusable procedure you can install' },
  proyecto: { label: 'Project', hint: 'A complete case from start to finish' },
  guia: { label: 'Guide', hint: 'Reproducible installation and setup' },
  referencia: { label: 'Reference', hint: 'Reference material, not linear' },
}

export const SECTION_EN = {
  resumen: { label: 'Summary', hint: 'Overview of the topic' },
  lecciones: { label: 'Lessons', hint: 'Main explanation' },
  laboratorios: { label: 'Labs', hint: 'Hands-on practice' },
  evaluacion: { label: 'Evaluation', hint: 'Check what you learned' },
  fuentes: { label: 'Sources', hint: 'Reference documentation' },
  solucionarios: { label: 'Answer keys', hint: 'Answers and corrections' },
  plantillas: { label: 'Templates', hint: 'Reusable material' },
  casos: { label: 'Cases', hint: 'Real examples' },
  workflows: { label: 'Workflows', hint: 'Importable flows' },
  skills: { label: 'Skills', hint: 'Installable procedures' },
  general: { label: 'General', hint: 'Topic material' },
}

const FOLDER_LABEL_EN = {
  'Empieza aqui': 'Start here',
  'Investigacion oficial': 'Official research',
  'Metodo de ensenanza': 'Teaching method',
  'Ruta del curso': 'Course path',
  'Clases por herramienta': 'Classes by tool',
  'Practicas y ejercicios': 'Practice and exercises',
  'Proyectos para portfolio': 'Portfolio projects',
  'Examenes rubricas defensa': 'Exams, rubrics and defense',
  'Plantillas reutilizables': 'Reusable templates',
  'Diccionario de ia': 'AI glossary',
  'Guias windows mac linux': 'Windows, Mac and Linux guides',
  'Manual para crear proyectos': 'Manual for building projects',
  'Fases del aprendizaje': 'Learning phases',
}

/** Traduce lo que es texto de código (no contenido del vault). Devuelve tal
 * cual cuando no hay traducción, para no dejar huecos vacíos. */
export function translateFolderLabel(label) {
  return FOLDER_LABEL_EN[label] || label
}
