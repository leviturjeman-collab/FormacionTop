import { workspaceText } from '../project-workspace-i18n'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowLeft, ArrowRight, BookMarked, Check, Clipboard, Compass, Lightbulb,
  MousePointer2, Save, Sparkles, Target, Wrench,
} from 'lucide-react'
import { href } from '../router'
import { ProjectProfile, SavedPrompt, store, useStudent } from '../store'
import { useCourse } from '../course'
import type { ToolPage } from '../types'
import { useLocale } from '../i18n'
import type { Locale } from '../i18n'
import ProjectWorkspace from '../components/ProjectWorkspace'
import ProjectAssessment from '../components/ProjectAssessment'
import ProjectBudget from '../components/ProjectBudget'

type GoalId = 'aprender' | 'web' | 'app' | 'automatizar' | 'contenido' | 'datos' | 'no-se'
type Choice = { id: string; label: string; description: string }

function goalsFor(locale: Locale): Array<Choice & { id: GoalId; tools: string[] }> {
  if (locale === 'en') {
    return [
      { id: 'aprender', label: 'Learn from scratch', description: 'I want to understand the process and build a first guided project.', tools: ['openai', 'claude', 'gemini'] },
      { id: 'web', label: 'Build a website', description: 'A page, portfolio, store, or professional presence.', tools: ['framer', 'lovable', 'v0', 'base44'] },
      { id: 'app', label: 'Build an app', description: 'A tool with screens, users, data, or logic.', tools: ['base44', 'lovable', 'bolt', 'replit', 'v0'] },
      { id: 'automatizar', label: 'Automate a process', description: 'Make something happen automatically when an email, form, or piece of data arrives.', tools: ['n8n', 'make', 'zapier', 'pipedream'] },
      { id: 'contenido', label: 'Create content', description: 'Text, images, presentations, audio, or video.', tools: ['openai', 'nano-banana', 'seedance-2-5', 'higgsfield', 'canva', 'gamma'] },
      { id: 'datos', label: 'Work with documents and data', description: 'Research, organize, query, or convert your own information.', tools: ['notebooklm', 'claude', 'openai', 'airtable', 'supabase'] },
      { id: 'no-se', label: "I don't know yet", description: 'I want the academy to help me find the right path.', tools: ['openai', 'claude', 'n8n'] },
    ]
  }
  return [
    { id: 'aprender', label: 'Aprender desde cero', description: 'Quiero entender el proceso y hacer un primer proyecto guiado.', tools: ['openai', 'claude', 'gemini'] },
    { id: 'web', label: 'Crear una web', description: 'Una página, portfolio, tienda o presencia profesional.', tools: ['framer', 'lovable', 'v0', 'base44'] },
    { id: 'app', label: 'Crear una aplicación', description: 'Una herramienta con pantallas, usuarios, datos o lógica.', tools: ['base44', 'lovable', 'bolt', 'replit', 'v0'] },
    { id: 'automatizar', label: 'Automatizar un proceso', description: 'Que algo ocurra solo cuando llegue un correo, formulario o dato.', tools: ['n8n', 'make', 'zapier', 'pipedream'] },
    { id: 'contenido', label: 'Crear contenido', description: 'Textos, imágenes, presentaciones, audio o vídeo.', tools: ['openai', 'nano-banana', 'seedance-2-5', 'higgsfield', 'canva', 'gamma'] },
    { id: 'datos', label: 'Trabajar con documentos y datos', description: 'Investigar, ordenar, consultar o convertir información propia.', tools: ['notebooklm', 'claude', 'openai', 'airtable', 'supabase'] },
    { id: 'no-se', label: 'Todavía no lo sé', description: 'Quiero que la academia me ayude a descubrir el camino.', tools: ['openai', 'claude', 'n8n'] },
  ]
}

function audiencesFor(locale: Locale): Choice[] {
  if (locale === 'en') {
    return [
      { id: 'yo', label: 'Myself', description: 'To save time or learn a new skill.' },
      { id: 'equipo', label: 'My team', description: 'So several people can work the same way.' },
      { id: 'clientes', label: 'My clients', description: 'To deliver an experience or service.' },
      { id: 'publico', label: 'Anyone', description: 'To publish it and get users.' },
    ]
  }
  return [
    { id: 'yo', label: 'Yo mismo', description: 'Para ahorrar tiempo o aprender una capacidad nueva.' },
    { id: 'equipo', label: 'Mi equipo', description: 'Para que varias personas trabajen de la misma manera.' },
    { id: 'clientes', label: 'Mis clientes', description: 'Para entregar una experiencia o servicio.' },
    { id: 'publico', label: 'Cualquier persona', description: 'Para publicarlo y recibir usuarios.' },
  ]
}

function outcomesFor(locale: Locale): Choice[] {
  if (locale === 'en') {
    return [
      { id: 'demo', label: 'A first visible version', description: 'Something small I can show and test.' },
      { id: 'ahorro', label: 'Save time every week', description: 'Cut out repetitive work and check the result.' },
      { id: 'entrega', label: 'A project ready to deliver', description: 'With tests, documentation, and a maintenance path.' },
      { id: 'aprendizaje', label: 'Learn by doing', description: 'I want to understand every decision as I go.' },
    ]
  }
  return [
    { id: 'demo', label: 'Una primera versión visible', description: 'Algo pequeño que pueda enseñar y probar.' },
    { id: 'ahorro', label: 'Ahorrar tiempo cada semana', description: 'Eliminar trabajo repetido y comprobar el resultado.' },
    { id: 'entrega', label: 'Un proyecto listo para entregar', description: 'Con pruebas, documentación y una ruta de mantenimiento.' },
    { id: 'aprendizaje', label: 'Aprender haciéndolo', description: 'Quiero entender cada decisión mientras avanzo.' },
  ]
}

const EMPTY: ProjectProfile = {
  name: '', goal: '', audience: '', problem: '', outcome: '', tools: '', toolIds: [], projectType: '', promptBrief: '', savedPrompts: [], updatedAt: '',
}

function selectedLabel(options: Choice[], id: string) {
  return options.find((item) => item.id === id)?.label || id
}

function toolSuggestion(goals: Array<Choice & { id: GoalId; tools: string[] }>, goal: GoalId, tools: ToolPage[]) {
  const ids = goals.find((item) => item.id === goal)?.tools || []
  return ids.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean) as ToolPage[]
}

function buildPrompt(locale: Locale, draft: ProjectProfile, goals: Array<Choice & { id: GoalId; tools: string[] }>, audiences: Choice[], outcomes: Choice[], goal: GoalId, audience: string, outcome: string, tools: ToolPage[]) {
  const toolNames = tools.length ? tools.map((tool) => tool.label).join(', ') : (locale === 'en' ? 'recommend the right tools for me' : 'recomiéndame las herramientas adecuadas')

  if (locale === 'en') {
    return `Act as my project director and teacher. I want to build: ${draft.name || '[PROJECT NAME]'}.

GOAL
I want to ${selectedLabel(goals, goal).toLowerCase()}. My description is still in plain language: ${draft.problem || '[EXPLAIN WHAT YOU WANT TO ACHIEVE]'}.

AUDIENCE AND OUTCOME
It will be used by: ${selectedLabel(audiences, audience).toLowerCase()}. The first version must achieve: ${selectedLabel(outcomes, outcome).toLowerCase()}.

TOOLS I'M CONSIDERING
${toolNames}.

Before building the project, ask me the essential questions one at a time. Don't invent details about my business, users, budget, permissions, privacy, or volume. When information is missing, point out exactly which decision is blocked and wait for my answer.

Then compare the chosen tools against a simpler alternative. For each one, explain what part of the work it solves, which model or feature to pick, what data it receives, what output it produces, how much maintenance it requires, and what could go wrong. If a tool is unnecessary, say so clearly.

First give me a short brief with goal, users, input, output, limits, success criteria, and next step. Then write a build plan in visible stages. Each stage must end with something I can review on screen. Include the exact prompt I should use in the next tool, the result I should expect, and a test with a normal case, an incomplete one, a repeated one, and an extreme one.

Don't move to production yet. Flag any irreversible action, connection to real data, publishing, sending, or spending that needs my approval. Explain technical terms in plain English and finish with a review checklist.`
  }

  return `Actúa como mi directora de proyecto y profesora. Quiero construir: ${draft.name || '[NOMBRE DEL PROYECTO]'}.

OBJETIVO
Quiero ${selectedLabel(goals, goal).toLowerCase()}. Mi descripción todavía está en lenguaje normal: ${draft.problem || '[EXPLICA QUÉ QUIERES CONSEGUIR]'}.

PERSONA Y RESULTADO
Lo utilizará: ${selectedLabel(audiences, audience).toLowerCase()}. La primera versión debe conseguir: ${selectedLabel(outcomes, outcome).toLowerCase()}.

HERRAMIENTAS QUE ESTOY CONSIDERANDO
${toolNames}.

Antes de construir el proyecto, hazme las preguntas imprescindibles de una en una. No inventes datos sobre mi negocio, usuarios, presupuesto, permisos, privacidad o volumen. Cuando falte información, señala exactamente qué decisión queda bloqueada y espera mi respuesta.

Después, compara las herramientas elegidas con una alternativa más sencilla. Para cada una explica qué parte del trabajo resuelve, qué modelo o función conviene elegir, qué datos recibe, qué salida produce, cuánto trabajo de mantenimiento exige y qué puede fallar. Si una herramienta sobra, dilo claramente.

Devuélveme primero una ficha breve con objetivo, usuarios, entrada, salida, límites, criterio de éxito y siguiente paso. Después escribe un plan de construcción en etapas visibles. Cada etapa debe terminar con algo que pueda revisar en pantalla. Incluye el prompt específico que debo usar en la siguiente herramienta, el resultado que espero obtener y una prueba con un caso normal, uno incompleto, uno repetido y uno extremo.

No pases todavía a producción. Marca cualquier acción irreversible, conexión con datos reales, publicación, envío o gasto que necesite mi aprobación. Explícame las palabras técnicas en español sencillo y termina con una checklist de revisión.`
}

function legacySavedPrompts(locale: Locale, project?: ProjectProfile): SavedPrompt[] {
  const raw = project?.promptBrief || ''
  if (!raw.includes('Prompt guardado desde la biblioteca:')) return []
  return raw
    .split(/\n\n---\nPrompt guardado desde la biblioteca: /)
    .slice(1)
    .map((chunk, index) => {
      const [heading, ...rest] = chunk.split('\n\n')
      const [family, name] = heading.split(' / ')
      return {
        id: `legacy-${index}-${name || 'prompt'}`,
        family: family || (locale === 'en' ? 'Library' : 'Biblioteca'),
        name: name || (locale === 'en' ? 'Saved prompt' : 'Prompt guardado'),
        prompt: rest.join('\n\n').trim(),
        savedAt: project?.updatedAt || new Date().toISOString(),
        source: locale === 'en' ? 'Saved before the new organization' : 'Guardado antes de la organización nueva',
      }
    })
    .filter((item) => item.prompt)
}

function projectSavedPrompts(locale: Locale, project?: ProjectProfile): SavedPrompt[] {
  const seen = new Set<string>()
  return [...legacySavedPrompts(locale, project), ...(project?.savedPrompts || [])].filter((item) => {
    const key = `${item.family}-${item.name}-${item.prompt.slice(0, 120)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export default function MiProyecto() {
  const locale = useLocale()
  const t = workspaceText(locale)
  const student = useStudent()
  const course = useCourse()
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState<GoalId>((student.project?.projectType as GoalId) || 'no-se')
  const [audience, setAudience] = useState(student.project?.audience || '')
  const [outcome, setOutcome] = useState(student.project?.outcome || '')
  const [draft, setDraft] = useState<ProjectProfile>(student.project || EMPTY)
  const [selectedTools, setSelectedTools] = useState<string[]>(student.project?.toolIds || [])
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const GOALS = useMemo(() => goalsFor(locale), [locale])
  const AUDIENCES = useMemo(() => audiencesFor(locale), [locale])
  const OUTCOMES = useMemo(() => outcomesFor(locale), [locale])

  const suggestions = useMemo(() => toolSuggestion(GOALS, goal, course.toolPages), [GOALS, goal, course.toolPages])
  const chosenTools = useMemo(() => selectedTools.map((id) => course.toolPages.find((tool) => tool.id === id)).filter(Boolean) as ToolPage[], [course.toolPages, selectedTools])
  const prompt = useMemo(() => buildPrompt(locale, draft, GOALS, AUDIENCES, OUTCOMES, goal, audience, outcome, chosenTools), [locale, draft, GOALS, AUDIENCES, OUTCOMES, goal, audience, outcome, chosenTools])
  const savedPrompts = useMemo(() => projectSavedPrompts(locale, student.project), [locale, student.project])

  useEffect(() => {
    if (student.project) {
      setGoal((student.project.projectType as GoalId) || 'no-se')
      setDraft(student.project)
      setSelectedTools(student.project.toolIds || [])
      setAudience(student.project.audience || '')
      setOutcome(student.project.outcome || '')
    }
  }, [student.project?.id])

  function save() {
    store.setProject({ ...student.project, ...draft, workspace: student.project?.workspace, audience, outcome, goal: selectedLabel(GOALS, goal), tools: chosenTools.map((tool) => tool.label).join(', '), toolIds: selectedTools, projectType: goal, promptBrief: prompt, savedPrompts: student.project?.savedPrompts || draft.savedPrompts || [], updatedAt: new Date().toISOString() })
    setSaved(true)
  }

  function next() {
    if (step === 4) save()
    setStep((current) => Math.min(5, current + 1))
  }

  function toggleTool(toolId: string) {
    setSelectedTools((current) => current.includes(toolId) ? current.filter((id) => id !== toolId) : [...current, toolId])
    setSaved(false)
  }

  const canContinue = step === 0 || step === 1 ? Boolean(step === 0 ? goal : audience) : step === 2 ? Boolean(outcome) : true

  const stepLabels = locale === 'en'
    ? ['Goal', 'Audience', 'Outcome', 'Tools', 'Prompt', 'Path']
    : ['Objetivo', 'Persona', 'Resultado', 'Herramientas', 'Prompt', 'Ruta']

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><BookMarked size={12} /> {locale === 'en' ? 'Project assistant' : 'Asistente de proyecto'}</span>
        <h1>{locale === 'en' ? "Let's turn your idea into a project" : 'Vamos a convertir tu idea en un proyecto'}</h1>
        <p>{locale === 'en' ? 'Choose the options and let the academy prepare a path. First we define the right prompt; then we build the first version.' : 'Elige opciones y deja que la academia prepare una ruta. Primero se define el prompt correcto; después se construye la primera versión.'}</p>
      </div>

      <section className="st-actions" aria-label="Mis proyectos">
        <label>{t("Proyecto activo")}<select value={student.activeProjectId || ''} onChange={e => { store.selectProject(e.target.value); setStep(0); setSaved(false) }}>{(student.projects || []).map(item => <option key={item.id} value={item.id}>{item.name || t("Sin nombre")}</option>)}</select></label>
        <button type="button" className="st-btn-ghost" onClick={() => { store.createProject(t("Nuevo proyecto")); setStep(0); setSaved(false) }}>{t("Crear otro proyecto")}</button>
      </section>
      <div className="st-project-progress" aria-label={locale === 'en' ? 'Assistant progress' : 'Progreso del asistente'}>
        {stepLabels.map((label, index) => <button key={label} type="button" className={index === step ? 'on' : index < step ? 'done' : ''} onClick={() => index <= step && setStep(index)}><span>{index < step ? <Check size={11} /> : index + 1}</span>{label}</button>)}
      </div>

      <section className="st-project-wizard">
        {step === 0 && <WizardChoice title={locale === 'en' ? 'What do you want to achieve?' : '¿Qué quieres conseguir?'} hint={locale === 'en' ? "You don't need to know which tool to use yet." : 'No necesitas saber todavía qué herramienta usar.'} options={GOALS} value={goal} onChange={(value) => { setGoal(value as GoalId); setSelectedTools([]); setSaved(false) }} />}

        {step === 1 && <div><WizardHeading icon={<Target size={16} />} title={locale === 'en' ? 'Who is going to use it?' : '¿Quién va a utilizarlo?'} hint={locale === 'en' ? 'This changes the level of explanation, the permissions, and the type of delivery.' : 'Esto cambia el nivel de explicación, los permisos y el tipo de entrega.'} /><ChoiceGrid options={AUDIENCES} value={audience} onChange={setAudience} /><label className="st-wizard-input"><span>{locale === 'en' ? 'Working name for your project' : 'Nombre provisional del proyecto'}</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder={locale === 'en' ? 'E.g. Request classifier' : 'Ej. Clasificador de solicitudes'} /></label></div>}

        {step === 2 && <div><WizardHeading icon={<Compass size={16} />} title={locale === 'en' ? 'What has to exist once the first version is done?' : '¿Qué tiene que existir al terminar la primera versión?'} hint={locale === 'en' ? 'Pick the outcome you can check with your own eyes.' : 'Escoge el resultado que puedas comprobar con tus propios ojos.'} /><ChoiceGrid options={OUTCOMES} value={outcome} onChange={setOutcome} /><label className="st-wizard-input"><span>{locale === 'en' ? 'Put it in one sentence, if you already know' : 'Cuéntalo en una frase, si ya lo sabes'}</span><textarea rows={3} value={draft.problem} onChange={(event) => setDraft({ ...draft, problem: event.target.value })} placeholder={locale === 'en' ? 'E.g. Receive requests, classify them, and keep a record the team can review.' : 'Ej. Recibir solicitudes, clasificarlas y dejar un registro que el equipo pueda revisar.'} /></label></div>}

        {step === 3 && <div><WizardHeading icon={<Wrench size={16} />} title={locale === 'en' ? 'Choose the tools you want to explore' : 'Elige las herramientas que quieres explorar'} hint={locale === 'en' ? 'You can pick several. The academy will tell you which fit and which to use first.' : 'Puedes seleccionar varias. La academia te dirá cuáles encajan y cuál usar primero.'} /><div className="st-tool-pick-note"><Lightbulb size={14} /><span>{locale === 'en' ? 'Recommended for your goal: ' : 'Recomendadas para tu objetivo: '}{suggestions.map((tool) => tool.label).join(', ') || (locale === 'en' ? 'pick one so recommendations appear' : 'elige una para que aparezcan recomendaciones')}.</span></div><div className="st-tool-picker">{course.toolPages.map((tool) => <ToolChoice key={tool.id} tool={tool} selected={selectedTools.includes(tool.id)} recommended={suggestions.some((item) => item.id === tool.id)} onClick={() => toggleTool(tool.id)} locale={locale} />)}</div></div>}

        {step === 4 && <div><WizardHeading icon={<Sparkles size={16} />} title={locale === 'en' ? 'This is the specific prompt for your project' : 'Este es el prompt específico de tu proyecto'} hint={locale === 'en' ? 'Read it, copy it, and use it before building anything. It forces you to clarify the important decisions.' : 'Léelo, cópialo y úsalo antes de construir nada. Te obliga a aclarar las decisiones importantes.'} /><div className="st-prompt-prep"><strong>{locale === 'en' ? 'Before pasting it' : 'Antes de pegarlo'}</strong><span>{locale === 'en' ? 'Have a real description ready, no sensitive data. The prompt will ask you questions one at a time and compare the selected tools.' : 'Ten preparada una descripción real, no datos sensibles. El prompt te hará preguntas una a una y comparará las herramientas seleccionadas.'}</span></div><div className="st-code st-project-prompt"><button type="button" onClick={() => { navigator.clipboard?.writeText(prompt).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1600) }, () => setCopied(false)) }}><Clipboard size={11} /> {copied ? (locale === 'en' ? 'Copied' : 'Copiado') : (locale === 'en' ? 'Copy prompt' : 'Copiar prompt')}</button><pre><code>{prompt}</code></pre></div><small className="st-prompt-length">{prompt.trim().split(/\s+/).length} {locale === 'en' ? 'words · questions, tool choice, testing and limits' : 'palabras · preguntas, elección de herramienta, prueba y límites'}</small></div>}

        {step === 5 && <div><WizardHeading icon={<Save size={16} />} title={locale === 'en' ? 'Your path is ready' : 'Tu ruta está preparada'} hint={locale === 'en' ? 'The profile is saved in this browser and you can come back and change it whenever you learn something new.' : 'La ficha queda guardada en este navegador y puedes volver a cambiarla cuando aprendas algo nuevo.'} /><div className="st-project-summary"><div><span>{locale === 'en' ? 'Goal' : 'Objetivo'}</span><strong>{selectedLabel(GOALS, goal)}</strong></div><div><span>{locale === 'en' ? 'Audience' : 'Persona'}</span><strong>{selectedLabel(AUDIENCES, audience)}</strong></div><div><span>{locale === 'en' ? 'Outcome' : 'Resultado'}</span><strong>{selectedLabel(OUTCOMES, outcome)}</strong></div><div><span>{locale === 'en' ? 'Tools' : 'Herramientas'}</span><strong>{chosenTools.map((tool) => tool.label).join(', ')}</strong></div></div><div className="st-project-route"><a href={href({ name: 'curso', lessonId: ({ web: 'primera-web', app: 'primera-web', automatizar: 'que-automatizar', contenido: 'encargo-comprobable', datos: 'datos-del-proyecto' } as Record<string, string>)[goal] || 'que-es-la-ia' })}><BookMarked size={16} /><span><strong>{locale === 'en' ? '1. Follow the Program' : '1. Seguir el Programa'}</strong><small>{locale === 'en' ? 'Learn first the stage that matches your goal.' : 'Aprende primero la etapa que corresponde a tu objetivo.'}</small></span><ArrowRight size={13} /></a>{chosenTools.map((tool) => <a key={tool.id} href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}><Wrench size={16} /><span><strong>{locale === 'en' ? `2. Open ${tool.label}` : `2. Abrir ${tool.label}`}</strong><small>{locale === 'en' ? 'See its models, features, prompts, and automations.' : 'Ve sus modelos, funciones, prompts y automatizaciones.'}</small></span><ArrowRight size={13} /></a>)}</div>{saved && <p className="st-project-saved"><Check size={12} /> {locale === 'en' ? 'Saved in this browser.' : 'Guardado en este navegador.'}</p>}</div>}

        <footer className="st-wizard-actions"><button type="button" className="st-btn-ghost" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}><ArrowLeft size={13} /> {locale === 'en' ? 'Back' : 'Atrás'}</button>{step < 5 ? <button type="button" className="st-btn" onClick={next} disabled={!canContinue}>{step === 4 ? (locale === 'en' ? 'Prepare my path' : 'Preparar mi ruta') : (locale === 'en' ? 'Continue' : 'Continuar')} <ArrowRight size={13} /></button> : <button type="button" className="st-btn" onClick={save}><Save size={13} /> {locale === 'en' ? 'Save path' : 'Guardar ruta'}</button>}</footer>
      </section>

      <ProjectWorkspace key={student.activeProjectId || "draft"} />
      <ProjectAssessment />
      <ProjectBudget />
      <SavedPromptsPanel prompts={savedPrompts} locale={locale} />

      <p className="st-project-storage">{locale === 'en' ? 'Your project has a local recovery copy and synchronizes with your signed-in account. Check the save status before closing.' : 'Tu proyecto tiene una copia local de recuperación y se sincroniza con tu cuenta. Comprueba el estado de guardado antes de cerrar.'}</p>
    </div>
  )
}

function SavedPromptsPanel({ prompts, locale }: { prompts: SavedPrompt[]; locale: Locale }) {
  const t = workspaceText(locale)
  const [openId, setOpenId] = useState<string | null>(prompts[0]?.id || null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (!prompts.some(prompt => prompt.id === openId)) setOpenId(prompts[0]?.id || null)
  }, [openId, prompts])

  return (
    <section className="st-project-prompts">
      <div className="st-section-head">
        <div>
          <span className="st-kicker">{locale === 'en' ? 'Project library' : 'Biblioteca del proyecto'}</span>
          <h2>{locale === 'en' ? 'Saved prompts' : 'Prompts guardados'}</h2>
        </div>
        <a href={href({ name: 'kits' })}>{locale === 'en' ? 'View institutional kits' : 'Ver kits institucionales'} <ArrowRight size={13} /></a>
      </div>
      {prompts.length ? (
        <div className="st-saved-prompts">
          <div className="st-saved-prompt-list">
            {prompts.map((prompt) => (
              <button key={prompt.id} type="button" className={openId === prompt.id ? 'on' : ''} onClick={() => setOpenId(prompt.id)}>
                <span>{prompt.family}</span>
                <strong>{prompt.name}</strong>
                <small>{new Date(prompt.savedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES')}</small>
              </button>
            ))}
          </div>
          {prompts.map((prompt) => openId === prompt.id ? (
            <article key={prompt.id} className="st-saved-prompt-detail">
              <span className="st-kicker">{prompt.source || (locale === 'en' ? 'Saved prompt' : 'Prompt guardado')}</span>
              <h3>{prompt.name}</h3>
              <p>{prompt.family}</p>
              <button
                type="button"
                className="st-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(prompt.prompt).then(() => { setCopied(prompt.id); window.setTimeout(() => setCopied(null), 1600) }, () => setCopied(null))
                }}
              >
                <Clipboard size={12} /> {copied === prompt.id ? (locale === 'en' ? 'Copied' : 'Copiado') : (locale === 'en' ? 'Copy prompt' : 'Copiar prompt')}
              </button>
              <pre>{prompt.prompt}</pre>
              <label>{t("Editar plantilla")}<textarea defaultValue={prompt.prompt} key={prompt.id + prompt.savedAt} onBlur={e => { const current = store.get().project; if (current && e.target.value !== prompt.prompt) store.setProject({ ...current, savedPrompts: (current.savedPrompts || []).map(item => item.id === prompt.id ? { ...item, prompt: e.target.value, savedAt: new Date().toISOString() } : item) }) }} /></label>
              <button type="button" className="st-btn-danger" onClick={() => { const current = store.get().project; if (current && window.confirm(t("¿Eliminar esta plantilla guardada?"))) store.setProject({ ...current, savedPrompts: (current.savedPrompts || []).filter(item => item.id !== prompt.id) }) }}>{t("Eliminar plantilla")}</button>
            </article>
          ) : null)}
        </div>
      ) : (
        <div className="st-empty">
          <h2>{locale === 'en' ? "You haven't saved any prompts yet" : 'Aún no has guardado prompts'}</h2>
          <p>{locale === 'en' ? 'Save prompts from the library or from an institutional kit and they will show up here, inside your project.' : 'Guarda prompts desde la biblioteca o desde un kit institucional y aparecerán aquí, dentro de tu proyecto.'}</p>
          <a className="st-btn" href={href({ name: 'prompts' })}>{locale === 'en' ? 'Go to Prompts' : 'Ir a Prompts'}</a>
        </div>
      )}
    </section>
  )
}

function WizardHeading({ icon, title, hint }: { icon: ReactNode; title: string; hint: string }) { return <div className="st-wizard-heading"><span>{icon}</span><div><h2>{title}</h2><p>{hint}</p></div></div> }
function ChoiceGrid({ options, value, onChange }: { options: Choice[]; value: string; onChange: (value: string) => void }) { return <div className="st-choice-grid">{options.map((option) => <button key={option.id} type="button" className={value === option.id ? 'selected' : ''} onClick={() => onChange(option.id)}><span>{value === option.id ? <Check size={14} /> : <MousePointer2 size={14} />}</span><strong>{option.label}</strong><small>{option.description}</small></button>)}</div> }
function WizardChoice({ title, hint, options, value, onChange }: { title: string; hint: string; options: Choice[]; value: string; onChange: (value: string) => void }) { return <div><WizardHeading icon={<Target size={16} />} title={title} hint={hint} /><ChoiceGrid options={options} value={value} onChange={onChange} /></div> }
function ToolChoice({ tool, selected, recommended, onClick, locale }: { tool: ToolPage; selected: boolean; recommended: boolean; onClick: () => void; locale: Locale }) { return <button type="button" className={`st-tool-choice${selected ? ' selected' : ''}`} onClick={onClick}><span className="st-tool-choice-mark">{selected ? <Check size={13} /> : <Wrench size={13} />}</span><span><strong>{tool.label}</strong><small>{recommended ? (locale === 'en' ? 'Recommended for this goal' : 'Recomendada para este objetivo') : tool.guide ? (locale === 'en' ? 'Full guide available' : 'Guía completa disponible') : (locale === 'en' ? `${tool.count} lessons selected` : `${tool.count} lecciones seleccionadas`)}</small></span></button> }
