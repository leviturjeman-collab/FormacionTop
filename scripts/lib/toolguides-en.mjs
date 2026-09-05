/**
 * Las fichas de herramienta en inglés.
 *
 * Igual que con los prompts, las 58 fichas no se escriben una a una: las que
 * no tienen archivo propio en `content/toolguides/` salen de una plantilla, y
 * a todas se les añaden encargos y automatizaciones generados. Esa parte
 * estaba solo en español, así que la versión inglesa mezclaba una ficha
 * traducida con encargos en español debajo.
 *
 * Regla al tocar este archivo: las tablas se indexan por el texto español
 * original, para que traducir no cambie qué encargo recibe cada herramienta.
 */

/** Unidad de consumo, por tipo de herramienta. */
export const UNIT_EN = {
  video: 'credits or minutes of generation',
  automation: 'tasks or runs',
  data: 'rows, records or automations',
  knowledge: 'documents and queries',
  default: 'tokens, credits or plan limits',
}

/** El `plain` de cada herramienta que no tiene ficha escrita a mano. */
export const DISCOVERED_PLAIN_EN = {
  'nano-banana': 'Nano Banana appears here as a standalone tool for creating and editing images from instructions and reference pictures. Current documentation treats it as the image family inside Gemini, including Gemini 2.5 Flash Image and later versions, which is why this course insists you check the exact model before quoting a price or delivering. It takes you from a visual idea to controlled variants, but check composition, text, likeness, rights, watermarks and consumption before publishing.',
  'seedance-2-5': 'Seedance 2.5 appears here as a standalone generative video tool. It turns an idea, an image or a sequence of shots into video with motion, audio and continuity, but check credits, rights, identifiable people, consistency between shots, sound and commercial use before you show it or publish it.',
  base44: 'An app builder that turns a description into a working application with screens, data and logic. Good for prototypes and small products, but review what it has built before using it with real data.',
  bolt: 'A web builder that works from the browser: you describe a page or an app and it generates a first version you can see, edit and publish. Useful for fast prototypes, as long as you keep the code and review every change.',
  replit: 'A coding environment in the browser with an agent that can build applications from a conversation. It gives you a quick path from idea to demo, but whatever you hand over should be backed up in GitHub and tested outside the chat.',
  framer: 'A visual editor for designing and publishing websites. It is especially good for brand pages, portfolios and marketing sites, where visual control matters more than complex logic.',
  canva: 'A visual editor for communication pieces, presentations, documents and short videos. Its value is being able to produce consistent material without starting from a blank canvas.',
  heygen: 'A video platform with AI avatars and assisted dubbing. It can turn a script into a piece presented by a digital person, but it needs checks on consent, pronunciation, tone and commercial use.',
  descript: 'An audio and video editor that lets you edit a recording by working on its transcript. Useful for turning a long conversation into clips, subtitles or a corrected version.',
  gamma: 'A tool for creating presentations, documents and pages from a written outline. It speeds up the first draft, but the judgement, the data and the final review are still yours.',
  pipedream: 'An automation platform aimed at connecting APIs and services with visual steps and optional code. Powerful for integrations that need more control than a simple connector.',
  notebooklm: 'A space for talking to documents you supply, with answers grounded in those sources. Useful for studying and summarising material, but always check the citation and what the documents actually cover.',
  airtable: 'A visual database that looks like a spreadsheet but supports relations, views, permissions and automations. A good middle step for projects that have outgrown a sheet.',
  notion: 'A space for organising documents, light databases, projects and knowledge. It works well as a hub, as long as you decide what information lives there and how it gets updated.',
  'wispr-flow': 'Wispr Flow is an AI dictation app: you speak naturally and it turns your voice into clean text inside other apps. It helps you write emails, prompts, notes, messages and drafts faster, but it is not an automation platform or a standalone content generator.',
}

/** La ficha inicial de una herramienta sin archivo propio. */
export function discoveredGuideEn(meta, unit) {
  return {
    account: {
      free: `Start on the trial or free plan if there is one, and check inside ${meta.label} what its limits are before connecting real data. Prices, credits and plan names change; note the date you last checked in the project.`,
      steps: [
        [`Go to ${meta.url}`, 'Use the official address and check the domain matches before creating an account.'],
        ['Create a trial account', 'Use a separate account while you are still evaluating the tool.'],
        ['Look at the usage panel', `Find the credits, limits or consumption ${meta.label} shows before you create anything.`],
        ['Create a test workspace', 'Give it a name that says it holds made-up data, and keep it away from production.'],
        ['Run a small test', 'Try a single input, review the result and note what you would change.'],
      ],
      warning: 'Do not connect client data or production permissions until you have tested the flow, read the privacy policy and decided how to stop it.',
    },
    first: [
      `Look at two ${meta.label} examples and write down what result they produce, not just what they look like.`,
      'Run a test with made-up data and a concrete result you can compare against.',
      'Change one single variable between one test and the next, so you know what improved.',
      'Keep a copy of the result and of the instruction that produced it.',
      'Note which part you would do by hand if the tool stopped being available.',
    ],
    words: [
      ['Input', 'The information the tool receives so it can work.'],
      ['Output', 'The result it produces, which someone else can review.'],
      ['Template', 'A ready-made structure so you do not always start from zero.'],
      ['History', 'The record of earlier changes, tests or runs.'],
      ['Production', 'The version that touches real data or real users.'],
      ['Limit', `The maximum amount of ${unit} your plan or account allows.`],
    ],
    matters: [
      'Deciding the result before you open the tool.',
      'Keeping a copy of the work that can be exported or reproduced.',
      'Testing with a normal case, an empty one, a repeated one and an extreme one.',
      'Checking permissions, privacy, commercial use and who owns the results.',
    ],
    ignore: [
      'The advanced options that do not affect your first test.',
      'Chasing a perfect design before checking the result is any use.',
      'Connecting five tools at once when you still do not know which one fails.',
    ],
    daily: [
      `Write down what has to exist at the end first, and let ${meta.label} help only with the steps that add something.`,
      'Use clear names and save a version before every important change.',
      'Review the result against a fixed list, not against how you feel at the time.',
      'Keep the test account separate from the account that holds real data.',
      `Measure how much ${unit} you use before automating a repetitive task.`,
    ],
    errors: [
      ['The result looks right, but it is no use for my case', 'The instruction was too general, or it had no real example in it.', 'Write a concrete input, the output you expect, and two things that must not happen.'],
      ['The tool changed something I did not want changed', 'The request left too much room, or there was no earlier copy.', 'Work in small changes, review the diff or the history, and accept one modification at a time.'],
      ['The project works in testing and fails with real data', 'Real data has gaps, odd formats or different permissions.', 'Test first with incomplete, repeated and extreme cases, and write down how to recover.'],
    ],
    prompts: [{
      name: `Design professional work with ${meta.label}`,
      prompt: `I want to use ${meta.label} to solve a real problem, and I need you to work with me with professional judgement. I do not want a pretty idea that is impossible to maintain. First understand my situation, then help me decide whether this tool is the right one, and only then propose a small first version. My situation is: [DESCRIBE THE PROBLEM, WHO HAS IT, WHAT THEY DO TODAY AND WHAT RESULT THEY WANT]. Work in plain natural English, explaining every technical word the first time it appears. Start by asking one question at a time and wait for my answer. Ask about the real input, the exact output, the volume, personal data, permissions, the budget, who will maintain the work and what happens if the tool stops working. Once you have enough information, summarise the project in a record with the problem, users, input, output, steps, limits and success criterion. Then compare three paths for me: doing it with ${meta.label}, doing it with an alternative, and doing it by hand for the first version. For each path explain the time, the cost, the lock-in, how easy it is to repair, and what data would have to leave my team. Recommend one and justify the decision. If you recommend ${meta.label}, design a ten-minute test with made-up data. Say exactly what I have to prepare, which button or area to look for, what I should see at the end, and what signal would show something has gone wrong. Do not connect real accounts or send messages yet. Then prepare a five-step plan: prepare, build, test, document and deliver. Every step needs an observable result and a way back. Add a list of hard cases: empty input, duplicate record, long text, expired permission, service outage and someone who changes their mind. For each one, tell me what the system should do and what I should do. Finish with a production checklist and an explanation of how to measure the tokens, credits, tasks, runs or plan limits ${meta.label} uses. Do not invent prices or features you cannot confirm: mark whatever I have to check on the official website.`,
    }],
    usage: {
      unit,
      explanation: `With ${meta.label}, looking at the plan price is not enough. You need to know which unit gets deducted by each action: ${unit}. Run a controlled test, note the panel reading before and after, and multiply that consumption by your monthly volume. Recheck the figure whenever the plan or the model changes.`,
      examples: [
        'A test with a single input and made-up data.',
        'The consumption before and after an identical repeat.',
        'The approximate cost of ten, a hundred and a thousand uses.',
        'A monthly limit and an alert before you reach it.',
        'The date the information was checked.',
      ],
    },
  }
}

/**
 * Los encargos, indexados por su nombre en español.
 *
 * La clave NO se traduce: TASK_KINDS y TOOL_PROMPT_TASKS la usan para decidir
 * qué encargo recibe cada herramienta. Si se tradujera la clave, «Crear una
 * imagen» dejaría de emparejar y Docker acabaría ofreciendo storyboards.
 */
export const PROMPT_TASKS_EN = {
  'Definir un problema real': ['Define a real problem', 'turn a vague idea into a record with the problem, the users, the input, the output and the success criterion', 'Do not build anything until you separate what I know from what I am assuming.'],
  'Investigar y comparar opciones': ['Research and compare options', 'research the alternatives and end with a recommendation I can defend', 'Separate sources, facts, inferences and things I still have to check.'],
  'Analizar información propia': ['Analyse my own information', 'analyse the data or documents I bring and find patterns without inventing values', 'Flag the empty fields, the duplicates and the data that supports no conclusion.'],
  'Extraer datos de documentos': ['Pull data out of documents', 'turn messy documents into a consistent table or record', 'Keep the reference to the source and return empty when the value is not there.'],
  'Escribir una pieza profesional': ['Write a professional piece', 'create a text that is useful to a specific audience, in a defined voice', 'Before writing, fix the purpose, the reader, the tone, the length and the next action.'],
  'Revisar y mejorar un texto': ['Review and improve a text', 'audit a text that already exists and propose changes you can justify', 'Do not change the voice because you prefer it: separate errors, risks, unclear bits and preferences.'],
  'Crear una imagen': ['Create an image', 'design an image that does a specific job inside a project', 'Describe the subject, the framing, the light, the composition, any visible text and what must stay out.'],
  'Editar una imagen de referencia': ['Edit a reference image', 'change an image while keeping whatever has to stay recognisable', 'List which pixels or elements may change and which have to stay put.'],
  'Planificar un vídeo': ['Plan a video', 'go from an idea to a script with shots, sound, pace and deliverables', 'Every shot needs an intention, a duration and a way to review it.'],
  'Crear un storyboard': ['Create a storyboard', 'order an audiovisual sequence before spending credits or shooting', 'Return a table of shots and flag the transitions that are hard to generate.'],
  'Diseñar una web': ['Design a website', 'define a website that can be built, tested and published', 'Put the visitor’s task first, then mobile, accessibility and real content.'],
  'Diseñar una aplicación': ['Design an application', 'turn a process into screens, states, data and rules', 'Do not hide error states, permissions, empty data or how a change gets undone.'],
  'Hacer un cambio de código': ['Make a code change', 'change a codebase without breaking what already works', 'Ask first for the context, the files affected, the current tests and the smallest possible change.'],
  'Diagnosticar un error': ['Diagnose an error', 'find the cause of a failure and fix it with evidence', 'Tell apart the symptom, the cause, the hypothesis and the test; do not propose five changes at once.'],
  'Diseñar una interfaz': ['Design an interface', 'create a clear interface for someone who does not know the tool', 'Every control needs an action, a state, a hint and a visible result.'],
  'Preparar datos y estructura': ['Prepare data and structure', 'design fields, relations and rules so the data does not become useless', 'Include the identifier, types, empty values, duplicates, permissions and export.'],
  'Automatizar un proceso': ['Automate a process', 'design a flow that starts with an event and ends with a result you can check', 'Include idempotency, human approval, retries, logging, a stop and the cost.'],
  'Crear un agente con límites': ['Create an agent with limits', 'decide what a system may read or do, and what a person has to approve', 'Define the allowed tools, the data it must not touch, and what happens when it is unsure.'],
  'Evaluar calidad': ['Evaluate quality', 'create test cases and a way to compare versions', 'Include a normal, incomplete, repeated and extreme case, and a threshold that blocks the delivery.'],
  'Documentar y entregar': ['Document and hand over', 'prepare a delivery someone else can use, review and maintain', 'Include install, use, limits, cost, secrets, recovery and who is responsible.'],

  'Elegir herramienta antes de empezar': ['Choose the tool before you start', 'decide whether this tool fits or whether a simpler alternative is better', 'Compare the real need, cost, permissions, maintenance and evidence before choosing.'],
  'Preparar un briefing reutilizable': ['Prepare a reusable brief', 'turn an idea into a short document you can reuse on new work', 'Include the fixed context, the decisions already made, the limits and the approval criteria.'],
  'Crear una checklist de revisión': ['Create a review checklist', 'have a short list for approving or rejecting the output before using it', 'The checklist has to catch visible errors, permissions, sensitive data, cost and incomplete output.'],
  'Convertir una salida en plantilla': ['Turn an output into a template', 'turn a good result into a template someone else can repeat', 'Separate what is fixed from what varies, and leave clear gaps in brackets.'],
  'Diseñar una prueba con datos ficticios': ['Design a test with made-up data', 'rehearse the whole process without touching real data or publishing anything', 'Use a normal, incomplete, duplicate and extreme case, plus one that has to stop.'],
  'Comparar dos versiones': ['Compare two versions', 'decide which version is better on observable criteria rather than a hunch', 'Set the criteria before you look at the results, and keep both pieces of evidence.'],
  'Preparar una demo para cliente': ['Prepare a client demo', 'show the result without exposing secrets, real data or false promises', 'Include the script, the happy path, a controlled failure and the known limits.'],
  'Reducir coste sin perder calidad': ['Cut cost without losing quality', 'work out which parts cost most and how to use less without breaking the result', 'Separate volume, model, credits, retries, input size and repeated work.'],
  'Crear documentación para mantenimiento': ['Write documentation for maintenance', 'leave instructions for fixing or repeating the work when you are not around', 'Include the owner, credentials, tests, common errors and recovery.'],
  'Auditar privacidad y permisos': ['Audit privacy and permissions', 'review what data goes in, who sees it and what permissions you have granted', 'Flag personal data, secrets, retention, public links and irreversible actions.'],
}

/** Las automatizaciones, también indexadas por su nombre en español. */
export const TASK_AUTOMATIONS_EN = {
  'Clasificar entradas y registrar el resultado': ['Classify incoming items and log the result', 'when a form, email or message arrives'],
  'Enviar un aviso solo cuando requiere atención': ['Send an alert only when it needs attention', 'when a priority condition is met'],
  'Crear un resumen diario con fuentes': ['Build a daily summary with sources', 'at a fixed time, from that day’s items'],
  'Detectar duplicados antes de crear un registro': ['Catch duplicates before creating a record', 'when an item arrives with an identifier already seen'],
  'Pedir aprobación antes de enviar o publicar': ['Ask for approval before sending or publishing', 'when an action changes data or goes outside'],
  'Reintentar una llamada y alertar si sigue fallando': ['Retry a call and alert if it keeps failing', 'when an API returns a temporary error'],
  'Convertir un archivo en una ficha estructurada': ['Turn a file into a structured record', 'when a new document appears in a folder'],
  'Crear tareas de seguimiento y fechas límite': ['Create follow-up tasks and deadlines', 'when a sale, meeting or request is completed'],
  'Sincronizar dos sistemas sin pisar cambios': ['Sync two systems without overwriting changes', 'when a record is created or updated'],
  'Guardar una auditoría de cada ejecución': ['Keep an audit trail of every run', 'every time the flow processes a case'],
  'Parar y avisar cuando falta un dato obligatorio': ['Stop and alert when a required field is missing', 'when an input is incomplete'],
  'Preparar un informe semanal de consumo': ['Prepare a weekly consumption report', 'at the end of each working period'],
  'Crear un borrador y dejarlo para revisión humana': ['Draft a reply and leave it for human review', 'when a request arrives that needs an answer but not an automatic send'],
  'Mover adjuntos a una carpeta ordenada': ['Move attachments into a tidy folder', 'when an email or form arrives with files'],
  'Extraer facturas y marcar excepciones': ['Extract invoices and flag exceptions', 'when a new invoice appears in a folder or inbox'],
  'Actualizar un CRM desde una conversación': ['Update a CRM from a conversation', 'when a call, meeting or chat with a client ends'],
  'Crear un ticket de soporte con prioridad': ['Create a support ticket with a priority', 'when an issue arrives by email, form or chat'],
  'Escalar un caso si no hay respuesta': ['Escalate a case if nobody answers', 'when a task has gone too many hours without moving'],
  'Publicar contenido solo después de aprobarlo': ['Publish content only after approval', 'when a piece has been reviewed by a person'],
  'Generar variantes de contenido y elegir la mejor': ['Generate content variants and pick the best', 'when a base campaign idea is approved'],
  'Vigilar una web o API y abrir incidente': ['Watch a site or API and open an incident', 'every few minutes, or when a monitor detects an outage'],
  'Limpiar y normalizar una base de datos': ['Clean and normalise a database', 'when a CSV, sheet or external export is imported'],
  'Enviar onboarding personalizado': ['Send personalised onboarding', 'when a new user, client or student is created'],
  'Preparar una reunión con contexto': ['Prepare a meeting with context', 'before a calendar event'],
  'Cerrar el día con pendientes y bloqueos': ['Close the day with open items and blockers', 'at the end of the working day'],
  'Rotar secretos y comprobar credenciales': ['Rotate secrets and check credentials', 'on a schedule, or on an expiry warning'],
}

/** El perfil por defecto: lo usan las 51 herramientas sin perfil propio. */
export const PROFILE_DEFAULT_EN = {
  intro: 'This page does not stop at the product name: it shows you the pieces inside, which decision each one solves, and how it fits into a complete project.',
  units: 'tokens, credits, tasks or runs',
  selection: 'pick the simplest option that covers your input, your output, your volume and how much reviewing you need',
  catalog: [
    ['Input', 'what information it receives', 'preparing and checking the information before you open the tool', 'do not use real data until you know its permissions'],
    ['Output', 'what it delivers and how it gets saved', 'deciding the result before you start', 'do not accept a pretty output you cannot verify'],
    ['Templates', 'reusable structures so you do not start from zero', 'repeating a format you have already tested', 'do not copy a template without understanding what it depends on'],
    ['History', 'earlier versions, runs or changes', 'comparing one test against another and going back', 'do not clear the history while you are investigating a failure'],
    ['Permissions', 'what it can read or change', 'connecting only the minimum needed', 'do not grant full access for convenience'],
    ['Export', 'how to get your work out if you change provider', 'keeping a copy before you depend on the service', 'do not confuse sharing a view with exporting the data'],
  ],
}

/** El encargo generado para una herramienta. */
export function promptForEn({ tool, name, outcome, rule, model, inside, index }) {
  return `Act as an expert in ${tool.label} guiding someone starting from zero. This piece of work is about: ${name.toLowerCase()}. I want to ${outcome}. Do not give me a generic answer or an undecided list of possibilities: work with my case and point out whatever you cannot know.\n\nHere is my context. Project: [NAME]. What I do or what problem I have: [DESCRIPTION]. Who will use it: [PERSON]. What information goes in: [INPUT]. What has to exist at the end: [OUTPUT]. Rough volume: [NUMBER OF CASES]. Budget and time available: [LIMITS]. Tools I already have: [LIST]. Sensitive data or permissions involved: [DATA AND PERMISSIONS].\n\nStart by asking me only the first question that would genuinely change the solution. Wait for my answer before going on. If a technical word is unavoidable, translate it into plain English the first time. Do not fill gaps with a silent assumption. ${rule}\n\nOnce you have enough information, first work out whether ${tool.label} is the right tool. Explain which part of the job it solves and which part it does not. Inside ${tool.label}, consider these pieces: ${inside}. Then choose the feature, model, mode or workspace you would use. Use this as your selection rule: ${model}. If two options are reasonable, compare quality, speed, cost, privacy, how reviewable it is and how easily you can get an earlier version back. Do not pick an option just because it is the most powerful.\n\nReturn the work in this order. One: a record of the problem with the goal, the user, the input, the output and the success criterion. Two: a preparation plan with the files, data, permissions and decisions I need to gather. Three: concrete instructions inside ${tool.label}, saying which screen, button, field, node or file to open and what value to put in. Four: the expected result and the signs that something has gone wrong. Five: a manual alternative or another tool, and why you are ruling it out or recommending it.\n\nDesign a test before any real data is used. The test needs a normal case, an incomplete one, a duplicate and an extreme one. For each, tell me the exact input, the output I should see, where to check it, and what to decide if it does not match. If the result can produce an image, video, text, code, record, message or run, tell me how to save the approved version and how to go back.\n\nInclude a security section: data I must not paste, the minimum permissions, which actions are irreversible, where human approval is needed and how to stop the work if it goes wrong. Include a consumption section too: which unit ${tool.label} may deduct, how to measure it before and after a test, how to estimate ten, a hundred and a thousand uses, and which figure has to be checked on the official website because it can change.\n\nFinish with a handover someone else can repeat: the version name, the files or links they should keep, usage instructions, known limits, possible errors, who is responsible, and a next step of under thirty minutes. Do not call it production-ready until the test has a result and evidence. This is assignment number ${index + 1} in my working library and it should be written in plain natural English.`
}

export const PROMPT_DETAILS_EN = ({ tool, name }) =>
  `\n\nSpecific to ${tool.label}: separate the decision about ${name.toLowerCase()} from the work that follows. Write the visible name of each feature, which field goes in, which field comes out and how a doubtful case gets reviewed. If it is not available, mark it CHECK AVAILABILITY and offer an alternative.`

export const PROMPT_PADDING_EN =
  '\n\nBefore you finish, look at the concrete case again and add a worked example with made-up data, a decision you would not take yet, and the question a responsible person would have to answer before the result gets shared.'

/** Las secciones que se añaden a un encargo que se ha quedado corto. */
export const ENRICH_SECTIONS_EN = (tool, units) => [
  `\n\n## Before using it in ${tool.label}\nWork with my concrete case and do not fill gaps with imagination. If a decision that changes the result is missing, ask me a short question before going on. Translate any technical word the first time it appears, and clearly separate what you know, what you are assuming, and what I have to check in the real tool.`,
  `\n\n## Minimum test\nBefore touching real data, design a test with made-up data. Include a normal case, an incomplete one, a duplicate and an extreme one. For each, tell me what input to prepare, what output I should see, where to check it inside ${tool.label}, and what to do if it does not match.`,
  `\n\n## Security, cost and limits\nSay which data I must not paste, which permissions are needed, which actions would be irreversible, and how I would stop the work if it goes wrong. Explain how to measure consumption in terms of ${units || 'the tool’s plan'} and mark as CHECK THE OFFICIAL WEBSITE any price, limit or feature name that may have changed.`,
  `\n\n## Reusable handover\nFinish with a short record to keep in my project: the goal, the input, the expected output, the steps inside ${tool.label}, the approval criterion, possible errors, the evidence I should keep, and a next action of under thirty minutes. If ${tool.label} is not the right tool for my case, say so plainly and recommend the smallest alternative.`,
]

export const ENRICH_PADDING_EN =
  '\n\nAdd a full worked example with made-up data, written as if I were about to do it right now. The example should include a concrete input, the exact output that should appear, the point where I have to check it, a decision you would not take yet, and a clear signal to stop before spending money, publishing, sending or connecting real data.'

/** La automatización generada para una herramienta. */
export function automationForEn({ tool, name, trigger, difficulty, platform, index, code }) {
  return {
    name: `${name} in ${tool.label}`,
    goal: `Use ${tool.label} inside a flow that can be watched, stopped and repaired.`,
    difficulty,
    platform,
    trigger: `${trigger}. Decide the unique identifier before switching the flow on.`,
    steps: [
      'Receive the input and save a test record with the date, the source and a unique identifier.',
      'Check the required fields; if one is missing, stop the case and raise an alert without running the final action.',
      `Prepare the data for ${tool.label}: field names, format, size and the plan's limits.`,
      `Run the ${tool.label} operation in a test account or workspace.`,
      'Check the output against an observable condition and save the link, id or full response.',
      'Send the alert or create the final record only after that check passes.',
      'Log the success, error, consumption, duration and owner in an audit table.',
      'Set up an error path with limited retries and a human alert; never retry forever.',
    ],
    code,
    test: `Run ${name.toLowerCase()} with a normal case, an incomplete one, a repeated one and an extreme one. Check that ${tool.label} receives only the fields it needs, that a duplicate does not create a second output, and that the error shows up in the history.`,
    failure: `If ${tool.label} changes its format, runs out of credit or returns an error, keep the input, do not repeat the irreversible action, and raise an alert with the case identifier. Check credentials, limits, data and the service response first.`,
    credentials: `A ${tool.label} test account, a credential with minimum permissions, an n8n account and an audit table or log. Never keep the key inside the code or in a public repository.`,
    index,
  }
}

export const AUTOMATION_CODE_EN =
  "// n8n Code node: avoid duplicates and leave an auditable output\nconst item = $json;\nconst id = item.id || item.email || item.externalId;\nif (!id) throw new Error('A unique identifier is missing');\nreturn [{ json: { ...item, workflowKey: String(id), receivedAt: new Date().toISOString(), needsReview: Boolean(item.needsReview) } }];"

export const PLATFORM_EN = (tool) =>
  tool.id === 'n8n' ? 'n8n · importable workflow and a manual test' : `n8n connected to ${tool.label}`

/**
 * Los siete perfiles escritos a mano.
 *
 * Solo se traduce lo que sale a pantalla: intro, units, selection y catalog.
 * El resto lo hereda del perfil español, así que si allí se añade un campo
 * nuevo, aquí no hay que tocar nada.
 */
export const TOOL_PROFILES_EN = {
  openai: {
    intro: 'Here ChatGPT and OpenAI are studied as two layers: the app you use on screen, and the models and services other programs can call. The visible name and what is available change with the plan.',
    units: 'tokens, messages, files, image credits or minutes of audio',
    selection: 'ChatGPT: Instant to move fast, Thinking to reason, Pro if the plan allows it; API: GPT-5.1, GPT-5 mini/nano, Codex, Image, Sora, realtime and deep-research. GPT-5.6 Sol, Luna and Pro may appear depending on the account; check the selector and the documentation',
    catalog: [
      ['Model selector', 'fast modes or Instant, Thinking and Pro; in the API you get families like GPT-5.1, GPT-5 mini/nano, Codex, GPT Image, Sora, realtime and deep-research. GPT-5.6 Sol, Luna and Pro may appear depending on the account', 'switching model only when the task needs it, and comparing quality, time and cost', 'do not pick by the highest number without testing the result'],
      ['Files and analysis', 'upload documents, sheets or images to analyse them', 'extracting, comparing, calculating or reviewing your own material', 'do not upload secrets or personal data without checking permissions'],
    ],
  },
  claude: {
    selection: 'Claude Opus 4.1 for architecture and demanding analysis, Claude Sonnet 4 for building and reviewing day to day, and Claude Haiku for classification and quick tasks; names and limits can change, so check the visible selector and the official documentation',
    catalog: [
      ['Opus', 'Claude Opus 4.1: the highest-capability family, for hard problems and complex projects', 'architecture, deep analysis and decisions with many constraints', 'do not use it to classify thousands of simple entries if another model is enough'],
      ['Sonnet', 'Claude Sonnet 4: the balanced option for building, writing and reviewing', 'most course work and prototypes', 'do not assume it replaces a real test'],
      ['Haiku', 'the fast, cheap family for short tasks; check the current number in the selector', 'classification, extraction and repetitive drafts', 'do not hand it an architecture decision without review'],
      ['Projects', 'a space with persistent instructions and documents', 'keeping a project’s context between conversations', 'do not use it as the only place a deliverable version lives'],
      ['Artifacts', 'a panel for seeing and touching generated deliverables', 'websites, components, documents and visible prototypes', 'do not publish without checking data, permissions and dependencies'],
      ['Vision and files', 'read images and documents alongside the conversation', 'reviewing screenshots, contracts, designs or tables', 'do not invent a page the document does not contain'],
      ['Workbench and API', 'test instructions and connect Claude to programs', 'comparing versions and preparing integrations', 'do not copy a key into a frontend or a repository'],
      ['Claude Code', 'work on a repository from a terminal', 'real changes with tests, a diff and version control', 'do not give it access without a backup and a working branch'],
    ],
  },
  'nano-banana': {
    intro: 'Nano Banana is the course’s practical page on generative images: creating and editing images with instructions, references and institutional control. Inside Gemini it may appear under different models, so the first decision is to note the exact model and the date. It focuses on visual identity, composition, text, variants, review, watermarking and rights, rather than hiding inside the general Gemini page.',
    units: 'generations, edits, resolution, credits and plan limits',
    selection: 'generation mode for a new image, editing to keep a reference, composition to control the subject and the camera, visible text for posters, and controlled variants to compare changes without losing the approved version',
    catalog: [
      ['Text to image', 'create an image from a description', 'concepts, campaigns, backgrounds and new scenes', 'do not expect small text to come out perfect without checking it'],
      ['Reference image', 'use an image to keep a subject, product or style', 'variants of a piece that already exists', 'do not use an image without permission or without checking its licence'],
      ['Local editing', 'change only one area and keep the rest', 'cleaning backgrounds, replacing objects or fixing a composition', 'do not ask for five incompatible changes in one instruction'],
      ['Consistency', 'keep features, clothing, product or palette across images', 'series, catalogues and recurring characters', 'do not rely on a vague phrase for an exact likeness'],
      ['Composition and camera', 'control framing, scale, lens, light and depth', 'making images ready for a specific piece', 'do not confuse style with framing instructions'],
      ['Visible text', 'ask for labels, posters, covers or tags', 'mockups and pieces where the text is part of the scene', 'if the text matters, check every character and prepare a fallback'],
      ['Variants and selection', 'generate comparable options and choose with judgement', 'exploring without losing an approved version', 'do not burn credits without naming and saving the tests'],
      ['Export and rights', 'get the final file out and document where it came from', 'delivering a piece with a clear size and format', 'do not publish without checking marks, faces and commercial use'],
    ],
  },
  'seedance-2-5': {
    intro: 'Seedance 2.5 is a generative video tool, and it should be learned like an editing desk: brief, shot, movement, duration, continuity, audio, review and export. This page avoids treating video as magic; every generation has a cost, a discard rate and an approval criterion.',
    units: 'credits, seconds generated, resolution, audio, variants and plan limits',
    selection: 'start with a short shot and a visual reference when you have one; use text to video only to explore, image to video when you need visual continuity, and sequence/storyboard when the result has several connected shots',
    catalog: [
      ['Text to video', 'create a shot from a written description', 'testing a quick visual idea or a shot that does not exist yet', 'do not use it for a final campaign without references or tests'],
      ['Image to video', 'animate an image keeping the starting subject, style and framing', 'a product, portrait, venue, graphic piece or approved scene', 'do not expect perfect continuity if the base image is badly composed'],
      ['Storyboard', 'order several shots before generating', 'ads, training pieces, reels, demos and institutional videos', 'do not generate shot by shot without knowing how they will join up'],
      ['Camera movement', 'set a tracking shot, zoom, turn, pan or a static frame', 'giving the video intent and avoiding random movement', 'do not mix three strong movements in five seconds'],
      ['Audio and pace', 'plan voice, music, silence, cuts and speed', 'when the video has to explain or sell something', 'do not leave audio to the end if it decides the duration'],
      ['Visual continuity', 'keep the character, object, colour, light and direction across shots', 'series, brand, product and campaigns', 'do not change visual reference on every generation'],
      ['Artefact review', 'spot warping, hands, text, logos, flicker and odd changes', 'before showing a client or publishing', 'do not approve a video on general impression without watching it frame by frame'],
      ['Export and rights', 'save the version, format, permitted use, source and cost', 'delivering a professional piece', 'do not publish identifiable people, brands or client material without permission'],
    ],
  },
  n8n: {
    intro: 'n8n is the main automation lab: every flow has a trigger, data, decisions, actions, a log and a way to stop. The course teaches you to build it and to repair it, not just to connect boxes.',
    units: 'runs, server time, API calls, service tasks and model tokens',
    selection: 'a webhook or event to start, Edit Fields to tidy the data, IF or Switch to decide, HTTP Request for APIs, and human approval before anything irreversible',
    catalog: [
      ['Trigger', 'the event that sets the workflow going', 'a form, webhook, schedule, email or change in an app', 'do not poll if the service can call a webhook'],
      ['Edit Fields', 'select, rename and prepare fields', 'normalising data before comparing or sending it', 'do not pass the whole object when you only need three fields'],
      ['IF and Switch', 'split paths depending on conditions', 'filtering inputs, priorities or states', 'do not bury a critical rule inside an unreadable expression'],
      ['HTTP Request', 'call an API even when there is no dedicated node', 'connecting services and testing endpoints', 'do not store keys in plain text or ignore error codes'],
      ['AI models', 'interpret text, images or documents inside the flow', 'classifying cases a fixed rule cannot resolve', 'do not put AI where a stable condition is enough'],
      ['Data and memory', 'keep state, identifiers and results', 'avoiding duplicates and continuing processes', 'do not use a row’s position as an identifier'],
      ['Human approval', 'stop the flow so someone can confirm', 'sending, publishing, charging or deleting', 'do not automate an irreversible action without a brake'],
      ['Errors and runs', 'see what happened and recover a flow', 'retries, alerts, traceability and maintenance', 'do not mark a workflow as ready without testing a failure'],
    ],
  },
  base44: {
    intro: 'Base44 turns a specification into an application with screens, data and behaviour. The learning is in writing the specification, reviewing what it generates, testing the states and keeping a way out.',
    selection: 'start with the smallest version that has a visible input and a visible output, and add data, users and automations after you have tested the journey',
    catalog: [
      ['Specification', 'describe screens, data and rules', 'turning an idea into a first version you can check', 'do not ask for a whole application in one vague sentence'],
      ['Screens', 'where the user sees and changes information', 'designing the main journey', 'do not hide errors or empty states'],
      ['Data', 'the fields and records that hold the app up', 'storing information that has to come back', 'do not store sensitive data without clear permissions'],
      ['Logic', 'rules that change what happens', 'validating, filtering and calculating', 'do not accept rules without test cases'],
      ['Users', 'identity, access and permissions', 'separating what each person can see', 'do not use a single user for everything'],
      ['Integrations', 'connections to outside services', 'email, payments, AI or automations', 'do not connect production before testing'],
      ['Publishing', 'make a version other people can reach', 'showing a demo or handing over the product', 'do not publish without checking the test data'],
      ['Export', 'save the code, data and documentation', 'keeping control if you change tool', 'do not confuse a URL with a copy of the project'],
    ],
  },
  'wispr-flow': {
    intro: 'Wispr Flow is not learned like an automation: it is learned as a new way of writing. This page focuses on installation, the dictation button, editing afterwards, your own vocabulary, privacy, languages, and when it is better to go back to the keyboard.',
    units: 'minutes dictated, words generated, plan limits and connected devices',
    selection: 'use it when the bottleneck is typing, or turning a spoken idea into text; avoid it for sensitive content, meetings without consent, or tasks that need exact formatting first time',
    catalog: [
      ['Dictation in any app', 'turn speech into text in the field you were already typing in', 'email, Slack, WhatsApp, ChatGPT, documents and quick notes', 'do not treat it as a chatbot: it does not decide for you, it writes what you say, tidied up'],
      ['Speak button or shortcut', 'start and stop listening when you decide', 'capturing ideas without switching windows', 'do not leave the microphone open during private conversations'],
      ['Automatic clean-up', 'remove filler words, punctuate and tidy spoken sentences', 'turning a spoken explanation into presentable text', 'do not accept names, figures or technical terms without checking them'],
      ['Personal vocabulary', 'learn names, jargon and words you repeat', 'work involving clients, brands, products or technical terms', 'do not add sensitive data just to make it more convenient'],
      ['Languages and code-switching', 'dictate in many languages and switch depending on context', 'bilingual teams, students and creators who speak faster than they write', 'do not assume every language punctuates equally well'],
      ['Privacy and permissions', 'manage the microphone, voice data and what happens to the text', 'before using it with clients, students or calls', 'do not record or transcribe people without a legal basis or explicit permission'],
    ],
  },
}
