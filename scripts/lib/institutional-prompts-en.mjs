/**
 * La biblioteca de prompts en inglés.
 *
 * Los 2.629 prompts no se escriben uno a uno: salen de unas pocas plantillas
 * que combinan la herramienta, la lección o el kit con un encargo concreto.
 * Esas plantillas estaban solo en español, así que un alumno que ponía la
 * aplicación en inglés abría la biblioteca y encontraba 2.629 prompts en
 * español. Aquí está la otra mitad: las mismas plantillas y las mismas
 * tablas, en inglés.
 *
 * Regla al tocar este archivo: cada tabla tiene que tener exactamente las
 * mismas filas, en el mismo orden, que su gemela española. Si en español
 * hay 31 encargos, aquí hay 31. `npm run validate` lo comprueba.
 */

export const TOOL_SECTIONS_EN = {
  'asistentes-modelos': {
    title: 'AI assistants and models',
    description: 'Tools to think, draft, review, compare models and work with assistants without losing your own judgement.',
    useCase: 'Decide, draft, analyse, review and document institutional work with AI.',
    audience: 'Students, teachers, management, consultants and mixed teams.',
  },
  'automatizacion-comunicacion': {
    title: 'Automation and communication',
    description: 'Tools that connect forms, email, alerts, approvals, messages and repeated tasks.',
    useCase: 'Turn repeated processes into flows that can be measured, audited and stopped by a human.',
    audience: 'Operations, support, sales, administration, customer service and back office.',
  },
  'apps-codigo-deploy': {
    title: 'Apps, code and deployment',
    description: 'Tools to build interfaces, repositories, integrations, tests and real releases.',
    useCase: 'Go from an idea to a product you can navigate, test, version and deploy.',
    audience: 'Builders, technical profiles, founders, advanced students and teams that ship software.',
  },
  'datos-conocimiento': {
    title: 'Data, documents and knowledge',
    description: 'Tools to organise sources, tables, databases, documents and internal knowledge.',
    useCase: 'Prepare institutional data for search, reporting, RAG, auditing and decision-making.',
    audience: 'Teams with documentation, CRM, operations, reporting, research or knowledge bases.',
  },
  'contenido-visual': {
    title: 'Content, image, video and sales',
    description: 'Tools for visuals, presentations, video, voice, campaigns and professional communication.',
    useCase: 'Create reviewable pieces that match the brand and are ready to teach or sell with.',
    audience: 'Marketing, training, agencies, creators, consultants and sales teams.',
  },
}

export const GENERAL_SECTION_EN = {
  title: 'General prompts of the course',
  description: 'Prompts from the earlier library, the programme and the master kits, split into small batches.',
  useCase: 'Work by intent when you do not yet know which tool the job needs.',
  audience: 'Any student or manager who wants to copy, paste and fill in the brackets.',
}

export const BASE_FILL_EN = [
  ['[INSTITUCION]', 'Name or type of organisation: an academy, a law firm, a clinic, a public body, a small business, an internal department or a client.'],
  ['[AREA_EQUIPO]', 'The area that will use the result: management, operations, marketing, sales, support, training, legal, product, technology or administration.'],
  ['[PERFIL_PERSONA]', 'The person who will read the explanation: a beginner, a teacher, a technical profile, a business owner, a client, a student or a mixed team.'],
  ['[PROCESO_O_PROBLEMA]', 'The real process, need or problem you want to solve. Write it without naming a tool yet.'],
  ['[ENTRADA_REAL]', 'What comes in: forms, documents, tickets, emails, calls, images, code, data or decisions.'],
  ['[SALIDA_ESPERADA]', 'What has to exist when you finish: a report, a flow, a website, a record, a table, a draft, a dashboard, an automation or a delivery.'],
  ['[VOLUMEN_Y_FRECUENCIA]', 'How many cases there will be and how often: per day, week, month, campaign, course or project.'],
  ['[RESTRICCIONES]', 'Limits on time, budget, permissions, available tools, language, format, regulations or who signs off.'],
  ['[DATOS_SENSIBLES]', 'Data that must not be pasted in or that needs care: clients, students, health, minors, contracts, keys, invoices or internal information.'],
  ['[FECHA_REVISION]', 'The date this answer gets reviewed, so it does not end up resting on outdated prices, plans or features.'],
]

export const BASE_MODEL_EN =
  'Use an AI that can reason and handle long context. For important decisions, compare the output against a second AI and keep the evidence.'

export const FAMILY_GUIDANCE_EN = {
  canDo: [
    'Turn an institutional need into a record, a plan, a test or a delivery that someone else can review.',
    'Adapt the explanation to different profiles without losing the criteria on safety, cost and maintenance.',
    'Leave a trail: what is known, what is assumed, what has to be checked and what evidence gets kept.',
  ],
  cantDo: [
    'It does not replace sign-off by a responsible person when sensitive data, money, clients or publishing are involved.',
    'It does not confirm prices, legal limits or recent provider changes: it forces you to flag them for official review.',
    'It does not turn a bad input into a reliable decision; when data is missing, it has to ask instead of inventing.',
  ],
  tips: [
    'Fill in the brackets before you send it. If a field does not apply, write NOT APPLICABLE and say why.',
    'Always ask for a test with made-up data before using real information from the organisation.',
    'Save anything useful to My project along with the date, version, owner and the decision you made.',
  ],
}

/** Mismos 31 encargos que EXTRA_TASKS, en el mismo orden. */
export const EXTRA_TASKS_EN = [
  ['aprender-desde-cero', 'Institutional map of first steps', 'understand what place the tool takes in an organisation and what each profile has to learn first', 'Do not explain loose buttons: separate purpose, inputs, outputs, risks and the first safe piece of practice.'],
  ['aprender-desde-cero', 'A guide for training a mixed team', 'prepare an explanation for people at different levels without losing operational precision', 'Include a version for a beginner, a manager and a technical person, each with its own piece of evidence.'],
  ['aprender-desde-cero', 'Applied institutional glossary', 'translate the tool’s vocabulary into working language and real decisions', 'Every term needs an example, a typical mistake, a sign that it needs review and how it relates to the process.'],

  ['elegir-herramienta', 'Institutional decision matrix', 'compare this tool with the alternatives and decide whether it belongs in the system', 'Score fit, cost, privacy, lock-in, maintenance, reversibility and learning curve.'],
  ['elegir-herramienta', 'Buy, pilot or drop', 'decide whether to open an account, run a pilot or drop the tool', 'End with a single recommendation and the conditions that would change it.'],
  ['elegir-herramienta', 'Comparison for a non-technical committee', 'explain the choice to management, a client or a team without overselling or hiding risks', 'Use executive language, visible costs, clear risks and a small test before committing.'],

  ['crear-proyecto', 'Institutional project record', 'turn a need into a project record you can build from, review and hand over', 'Include the goal, users, inputs, outputs, limits, owner, cadence and an observable success criterion.'],
  ['crear-proyecto', 'Minimum institutional version', 'cut the project back to a first version that can be used without being oversized', 'Separate the essential, what stays manual for now, what is out of scope and the condition for moving to version two.'],
  ['crear-proyecto', 'Map of screens, states and permissions', 'design the experience, empty states, errors and permissions before asking anyone to build', 'Include what each role sees, what they can do, what they must not touch and how a change is undone.'],

  ['automatizar', 'Institutional flow with an approval step', 'design an automated process with a human brake before any sensitive action', 'Include trigger, validation, decision, approval, action, log, error and stop.'],
  ['automatizar', 'Weekly team automation', 'turn a repeated task into a recurring flow that stays controlled and auditable', 'Avoid infinite loops, duplicates, automatic messages nobody reviewed and unlimited consumption.'],
  ['automatizar', 'Retry and recovery design', 'work out what happens when an automation fails, duplicates or hits incomplete data', 'Every failure must keep the input, the reason, the owner, the next action and the final state.'],
  ['automatizar', 'Connecting institutional tools', 'define how this tool connects to others without losing data or permissions', 'Specify which fields travel, the minimum credentials, logs, tests and the manual fallback.'],

  ['crear-contenido', 'Institutional editorial calendar', 'plan content that is useful to an organisation, with purpose, review and evidence', 'Every piece needs an audience, channel, source, owner, approval state and a metric.'],

  ['programar', 'A small, reversible technical change', 'ask for a narrow technical change with tests and a way back', 'Require the files affected, a small diff, a before/after test and no full rewrites without a reason.'],
  ['programar', 'Institutional technical integration', 'design how to connect the tool to a product, website, API, repository or database', 'Include the data contract, secrets, a test environment, expected errors and minimum observability.'],
  ['programar', 'Reviewing an implementation before release', 'audit an implementation to catch risks before a real team uses it', 'Order the findings by severity and ask for concrete evidence, not style opinions.'],

  ['conectar-datos', 'Inventory of institutional data', 'know what data exists, where it lives, who may use it and what may leave', 'Tell apart the official source, a copy, sensitive data, incomplete data, duplicates and data that must not leave.'],
  ['conectar-datos', 'Preparing a knowledge base', 'turn internal documents into something you can query, with clear sources and limits', 'Include chunking, metadata, permissions, test questions, answers without a source and how it gets updated.'],

  ['crear-agentes', 'Institutional agent with minimum permissions', 'design an agent that reads or acts without stepping outside its mandate', 'Define allowed tools, forbidden actions, memory, escalation, a step limit and human approval.'],
  ['crear-agentes', 'Tool sheet for an agent', 'describe every tool an agent may use so it chooses well and stops when it should', 'Each tool needs when to use it, when not to, its input, output, errors and cost.'],
  ['crear-agentes', 'Human escalation and agent traceability', 'set out when the agent has to stop, ask, or hand the case to a responsible person', 'Cover doubts, conflicts, sensitive data, low confidence, irreversible actions and logging the decision.'],

  ['probar-reparar', 'Institutional test plan', 'write test cases that block the delivery if the system is not good enough', 'Include normal, incomplete, duplicate, extreme, malicious and a change of provider.'],
  ['probar-reparar', 'Postmortem of an operational failure', 'analyse an incident without hunting for someone to blame and turn it into a better system', 'Separate timeline, impact, root cause, detection, repair, prevention and owner.'],

  ['seguridad-coste-privacidad', 'Review of sensitive data and permissions', 'find out what information must not be pasted, shared or automated without control', 'Classify data, permissions, legal basis, retention, export, deletion, owner and human review.'],
  ['seguridad-coste-privacidad', 'Budget and consumption limits', 'estimate the cost before scaling the tool up inside an organisation', 'Work out one test, ten cases, a hundred cases, a thousand cases, the margin of error and the signal to stop.'],
  ['seguridad-coste-privacidad', 'Irreversible actions and human control', 'mark which actions can never be left fully automated', 'Cover sending, publishing, deleting, charging money, changing permissions, contacting people and sharing data.'],
  ['seguridad-coste-privacidad', 'Operational compliance checklist', 'review privacy, security, ownership, licences and internal policy before a delivery', 'Separate the technical, the legal, the contractual, the reputational and what an expert has to review.'],

  ['entregar-equipo-cliente', 'Institutional user manual', 'write a guide so someone else can use the system without asking whoever built it', 'Include installation, access, daily use, errors, recovery, limits, cost and owner.'],

  ['proyecto-institucional', 'Full institutional architecture', 'design a large system combining the tool, prompts, automations, data, agents and governance', 'Split the proposal into phases, deliverables, risks, tests, operation and criteria for growing without chaos.'],
]

/* --- Las cinco plantillas que redactan el cuerpo de cada prompt ------ */

const CONTEXT_EN =
  'Organisation: [INSTITUCION]. Area or team: [AREA_EQUIPO]. Person who needs to understand it: [PERFIL_PERSONA]. ' +
  'Process or problem: [PROCESO_O_PROBLEMA]. Real input: [ENTRADA_REAL]. Expected output: [SALIDA_ESPERADA]. ' +
  'Volume and frequency: [VOLUMEN_Y_FRECUENCIA]. Constraints: [RESTRICCIONES]. Sensitive or forbidden data: [DATOS_SENSIBLES]. ' +
  'Review date: [FECHA_REVISION].'

export const TEMPLATES_EN = {
  /** El banco institucional: un encargo concreto sobre una herramienta. */
  core({ tool, name, outcome, rule, toolRole, internalPieces, usage }) {
    return `Act as an institutional architect of AI systems and operations. Your job is to help me use ${tool.label} inside a real organisation, with judgement about governance, privacy, cost, maintenance and evidence. Do not write a generic explanation of the tool or a pretty list of possibilities: turn my case into a decision, a test and a delivery that someone else can review.\n\n## Context you must use\n${CONTEXT_EN}\n\n## The assignment\nI need to ${outcome} using ${tool.label}, but only if it fits. In this tool, the starting role is this: ${toolRole} Internal pieces you should keep in mind: ${internalPieces || 'input, output, permissions, history, export and how results get reviewed'}. Specific rule for this assignment: ${rule}\n\n## How to work\nFirst check whether the brackets are filled in. If a missing fact would change the decision, ask me one single question and wait for my answer. If you can move on with a minor assumption, label it ASSUMPTION and explain how it would be checked. Match your language to [PERFIL_PERSONA]: for a beginner, translate every technical word; for management, lead with impact, risk and cost; for a technical team, add data contracts, permissions and tests. Do not use real data in examples: invent realistic made-up data and say clearly that it is made up.\n\n## Required output\nAnswer in this order. One: an institutional summary of under 180 words with the goal, the user, the input, the output, the limit and the success criterion. Two: a decision on whether ${tool.label} is enough, too much or not enough, compared against a simpler alternative and against doing the first version by hand. Three: concrete steps to carry out the assignment, naming the screen, button, field, file, node or workspace where it applies. Four: an acceptance test with a normal, incomplete, duplicate and extreme case. Five: risks around privacy, permissions, cost, provider lock-in and maintenance. Six: the evidence I should keep: a file, screenshot, link, log, table or written decision.\n\n## Institutional control\nBefore recommending that anything be switched on, published, sent, deleted, charged for, or that permissions be changed or data shared, mark it HUMAN APPROVAL REQUIRED. Define how the process is stopped if something goes wrong. Explain how consumption is measured in ${tool.label}: ${usage} Do not invent prices or limits; if they may have changed, write CHECK THE OFFICIAL WEBSITE. Finish with a next action that takes under thirty minutes and a closing sentence that starts with: The institutional decision is.`
  },
  coreExtra:
    '\n\nAdd a small RACI matrix too, with who is responsible, who approves, who is consulted and who is informed. Include one version for a pilot with made-up data and one for real use, clearly separated. If real use requires a contract, a licence, legal review, an internal policy or a security sign-off, do not treat it as solved: leave it as a visible blocker.',

  /** Prompts que vienen de la ficha de una herramienta. */
  tool({ tool, basePrompt }) {
    return `Act as the person responsible inside an organisation and adapt this ${tool.label} assignment to a real one. Keep the goal of the original prompt, but add governance, privacy, cost, evidence, human review and a test with made-up data. Required context: organisation [INSTITUCION], area [AREA_EQUIPO], person [PERFIL_PERSONA], process [PROCESO_O_PROBLEMA], input [ENTRADA_REAL], output [SALIDA_ESPERADA], volume [VOLUMEN_Y_FRECUENCIA], constraints [RESTRICCIONES], sensitive data [DATOS_SENSIBLES] and date [FECHA_REVISION].\n\n## The base prompt you have to run\n${basePrompt}\n\n## Required institutional closing\nBefore you finish, turn the answer into something verifiable: decision, steps, risks, a normal/incomplete/duplicate/extreme test, the evidence that gets kept, who is responsible, the cost or consumption that gets measured, and the condition for not switching it on. If anything depends on current prices, plans, permissions or features, write CHECK THE OFFICIAL WEBSITE. Do not call the work production-ready without human approval when sensitive data, publishing, money or contact with people is involved.`
  },
  toolExtra:
    '\n\nIf the result is aimed at someone starting from zero, translate every technical term and keep the next step under thirty minutes. If it is aimed at management, summarise decision, impact, risk and cost. If it is aimed at a technical team, add the input, the output, the data contract and a repeatable test.',

  /** Prompts que vienen de la biblioteca escrita en content/prompts. */
  base({ basePrompt }) {
    return `Act as the person responsible inside an organisation and use the following base prompt in a real one. Do not answer as if this were a loose personal task: fit the output to a team, with evidence, permissions, cost, maintenance, human review and traceability. Required context before you answer: organisation [INSTITUCION], area [AREA_EQUIPO], person [PERFIL_PERSONA], process [PROCESO_O_PROBLEMA], input [ENTRADA_REAL], output [SALIDA_ESPERADA], volume [VOLUMEN_Y_FRECUENCIA], constraints [RESTRICCIONES], sensitive data [DATOS_SENSIBLES] and date [FECHA_REVISION].\n\n## Base prompt from the library\n${basePrompt}\n\n## Institutional rules\nKeep the intent of the base prompt, but always end with a decision record, a test with made-up data, the evidence that gets kept, an owner, privacy and cost risks, a manual fallback and a stopping condition. If facts are missing, ask one single thing. If something may have changed, write CHECK THE OFFICIAL WEBSITE.`
  },
  baseExtra:
    '\n\nAdapt the explanation to [PERFIL_PERSONA]. For a beginner, give concrete instructions without jargon; for management, lead with the decision and the risk; for a technical team, add the data format, the permissions and the check. Do not use real data in examples; use made-up data and say so clearly.',

  /** Prompts que vienen de una tarea del Programa. */
  course({ lesson, task, tool }) {
    return `Act as the person responsible for applied training inside an organisation. You are going to use a prompt that appears inside the course programme, but you must turn it into a complete institutional task: with context, a verifiable output, evidence, security, cost, an owner and a definition of done. Do not answer as an isolated exercise or as an informal chat.\n\n## Required context\n${CONTEXT_EN}\n\n## Where the prompt comes from\nLesson: ${lesson.title}. Task: ${task.title}. Where it is done: ${task.where}. Expected action: ${task.action}. What should be visible: ${task.expect}.${task.stuck ? ` If it does not work: ${task.stuck}.` : ''}${tool ? ` Related tool: ${tool.label}.` : ''}\n\n## Base prompt from the programme\n${task.prompt}\n\n## Required institutional adaptation\nBefore answering, check that every bracket is filled in. If a critical fact is missing, ask one single question and wait. Then return: one, an explanation for [PERFIL_PERSONA] without unnecessary jargon; two, the concrete output that has to be produced; three, numbered steps to carry it out; four, a test with a normal, incomplete, duplicate and extreme case; five, data that must not be used yet; six, who approves and who keeps the evidence; seven, how the consumption or effort gets measured; eight, what you would do by hand if the tool or the provider fails.\n\nDo not treat the task as finished because the answer sounds good. There has to be evidence: text, a screenshot, a file, a log, a link, a table or a written decision. If it involves switching something on, publishing, sending, deleting, charging money, connecting credentials or sharing data, mark it HUMAN APPROVAL REQUIRED. Finish with a next action that takes under thirty minutes.`
  },
  courseExtra:
    '\n\nInclude a handover note: how a beginner would explain this result, how a manager would review it, and what a technical person would need to maintain it. Separate facts, assumptions and things still to check. If prices, limits or product features come up, write CHECK THE OFFICIAL WEBSITE.',

  /** Prompt de arranque de un kit institucional. */
  kit({ title, outcome }) {
    return `Act as an institutional architect of AI systems. I want to design the "${title}" kit for a real organisation. Do not give me a collection of loose ideas: I need a working architecture that combines prompts, tools, automations, data, skills or procedures, governance, security, cost, documentation and operation.\n\n## Required context\nOrganisation: [INSTITUCION]. Area or team that owns the system: [AREA_EQUIPO]. People who will use it: [PERFIL_PERSONA]. Main process or problem: [PROCESO_O_PROBLEMA]. Available inputs: [ENTRADA_REAL]. Expected output: [SALIDA_ESPERADA]. Volume and frequency: [VOLUMEN_Y_FRECUENCIA]. Limits on time, budget and tools: [RESTRICCIONES]. Sensitive or forbidden data: [DATOS_SENSIBLES]. Review date: [FECHA_REVISION].\n\n## Goal of the kit\nI need to ${outcome}. Design the system as if you had to explain it to management, to a complete beginner and to a technical team. The answer has to help decide what gets done first, what gets automated, what stays manual, what gets tested with made-up data and what stays blocked until it is approved.\n\n## Required output\nReturn: one, a map of the system with its modules and responsibilities; two, the candidate tools and why each one is in; three, the families of prompts needed and when they are used; four, possible automations with trigger, validation, action, log and error path; five, reusable skills or procedures worth documenting; six, the data that goes in, the data that comes out and the minimum permissions; seven, rollout phases from pilot to real use; eight, the deliverables that have to be kept; nine, risks around privacy, cost, provider lock-in and maintenance; ten, the criteria for saying the kit is ready or that it should stay in testing.\n\n## Governance and testing\nBefore any real data is used, design a test with four cases: normal, incomplete, duplicate and extreme. For each one give the made-up input, the expected result, where it is checked, who approves it and what gets kept as evidence. Mark it HUMAN APPROVAL REQUIRED if the kit publishes, sends messages, changes permissions, deletes data, charges money or affects people. Do not invent prices or plan limits: write CHECK THE OFFICIAL WEBSITE. Finish with a first step that takes under thirty minutes and a decision that can be pinned in My project.`
  },
  kitExtra:
    '\n\nAdd an operations matrix with the owner, the approver, how often it gets reviewed, the failure signal, the alert channel and the rollback plan. If any part can be done by hand during the pilot, recommend that over a complex automation. If a tool looks attractive but adds no evidence or control, propose dropping it for now.',
}

/* --- Frases sueltas que también salen a pantalla -------------------- */

export const LABELS_EN = {
  sourceBank: 'Institutional bank',
  sourceTool: 'Tool sheet',
  sourceLibrary: 'Prompt library',
  sourceProgram: 'Programme',
  sourceKits: 'Institutional kits',
  generalTool: 'General institutional',
  kitName: (title) => `Institutional kit · ${title}`,
  whenCore: (outcome) => `Use it when you need to ${outcome}.`,
  whenTool: (label) => `Use it when you work with ${label} inside an institutional project.`,
  whenBase: (family) => `Use it as a general institutional prompt for ${family.toLowerCase()}.`,
  whenCourse: (task) => `Use it when you want to redo the task «${task}» outside the lesson, in institutional form.`,
  whenKit: (title) => `Use it when you want to build or review the «${title}» kit as a complete system.`,
  expectCore: (label) => `An institutional output with a decision, steps, a test, risks, evidence and a next action for ${label}.`,
  expectTool: (label) => `The ${label} prompt turned into an institutional output with a test, evidence, cost and limits.`,
  expectBase: 'An institutional output with a decision, a test, evidence, risks and a next step.',
  expectCourse: 'An institutional version of the programme prompt with steps, a test, evidence, approval and a next action.',
  expectKit: 'A complete institutional architecture with tools, prompts, automations, governance, tests and deliverables.',
  nextCore: 'Save the decision in My project and run the test with made-up data before touching real accounts or data.',
  nextTool: 'If the result is useful, save it in My project and note the review date.',
  nextBase: 'Save anything useful in My project and check which fact is missing before you build.',
  nextCourse: 'Save the result in My project as evidence for the lesson or as a project decision.',
  nextKit: 'Save the system map in My project and turn the first phase into small tasks.',
}
