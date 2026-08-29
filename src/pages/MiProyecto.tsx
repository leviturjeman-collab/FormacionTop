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

type GoalId = 'aprender' | 'web' | 'app' | 'automatizar' | 'contenido' | 'datos' | 'no-se'
type Choice = { id: string; label: string; description: string }

const GOALS: Array<Choice & { id: GoalId; tools: string[] }> = [
  { id: 'aprender', label: 'Aprender desde cero', description: 'Quiero entender el proceso y hacer un primer proyecto guiado.', tools: ['openai', 'claude', 'gemini'] },
  { id: 'web', label: 'Crear una web', description: 'Una página, portfolio, tienda o presencia profesional.', tools: ['framer', 'lovable', 'v0', 'base44'] },
  { id: 'app', label: 'Crear una aplicación', description: 'Una herramienta con pantallas, usuarios, datos o lógica.', tools: ['base44', 'lovable', 'bolt', 'replit', 'v0'] },
  { id: 'automatizar', label: 'Automatizar un proceso', description: 'Que algo ocurra solo cuando llegue un correo, formulario o dato.', tools: ['n8n', 'make', 'zapier', 'pipedream'] },
  { id: 'contenido', label: 'Crear contenido', description: 'Textos, imágenes, presentaciones, audio o vídeo.', tools: ['openai', 'nano-banana', 'seedance-2-5', 'higgsfield', 'canva', 'gamma'] },
  { id: 'datos', label: 'Trabajar con documentos y datos', description: 'Investigar, ordenar, consultar o convertir información propia.', tools: ['notebooklm', 'claude', 'openai', 'airtable', 'supabase'] },
  { id: 'no-se', label: 'Todavía no lo sé', description: 'Quiero que la academia me ayude a descubrir el camino.', tools: ['openai', 'claude', 'n8n'] },
]

const AUDIENCES: Choice[] = [
  { id: 'yo', label: 'Yo mismo', description: 'Para ahorrar tiempo o aprender una capacidad nueva.' },
  { id: 'equipo', label: 'Mi equipo', description: 'Para que varias personas trabajen de la misma manera.' },
  { id: 'clientes', label: 'Mis clientes', description: 'Para entregar una experiencia o servicio.' },
  { id: 'publico', label: 'Cualquier persona', description: 'Para publicarlo y recibir usuarios.' },
]

const OUTCOMES: Choice[] = [
  { id: 'demo', label: 'Una primera versión visible', description: 'Algo pequeño que pueda enseñar y probar.' },
  { id: 'ahorro', label: 'Ahorrar tiempo cada semana', description: 'Eliminar trabajo repetido y comprobar el resultado.' },
  { id: 'entrega', label: 'Un proyecto listo para entregar', description: 'Con pruebas, documentación y una ruta de mantenimiento.' },
  { id: 'aprendizaje', label: 'Aprender haciéndolo', description: 'Quiero entender cada decisión mientras avanzo.' },
]

const EMPTY: ProjectProfile = {
  name: '', goal: '', audience: '', problem: '', outcome: '', tools: '', toolIds: [], projectType: '', promptBrief: '', savedPrompts: [], updatedAt: '',
}

function selectedLabel(options: Choice[], id: string) {
  return options.find((item) => item.id === id)?.label || id
}

function toolSuggestion(goal: GoalId, tools: ToolPage[]) {
  const ids = GOALS.find((item) => item.id === goal)?.tools || []
  return ids.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean) as ToolPage[]
}

function buildPrompt(draft: ProjectProfile, goal: GoalId, audience: string, outcome: string, tools: ToolPage[]) {
  const toolNames = tools.length ? tools.map((tool) => tool.label).join(', ') : 'recomiéndame las herramientas adecuadas'
  return `Actúa como mi directora de proyecto y profesora. Quiero construir: ${draft.name || '[NOMBRE DEL PROYECTO]'}.

OBJETIVO
Quiero ${selectedLabel(GOALS, goal).toLowerCase()}. Mi descripción todavía está en lenguaje normal: ${draft.problem || '[EXPLICA QUÉ QUIERES CONSEGUIR]'}.

PERSONA Y RESULTADO
Lo utilizará: ${selectedLabel(AUDIENCES, audience).toLowerCase()}. La primera versión debe conseguir: ${selectedLabel(OUTCOMES, outcome).toLowerCase()}.

HERRAMIENTAS QUE ESTOY CONSIDERANDO
${toolNames}.

Antes de construir el proyecto, hazme las preguntas imprescindibles de una en una. No inventes datos sobre mi negocio, usuarios, presupuesto, permisos, privacidad o volumen. Cuando falte información, señala exactamente qué decisión queda bloqueada y espera mi respuesta.

Después, compara las herramientas elegidas con una alternativa más sencilla. Para cada una explica qué parte del trabajo resuelve, qué modelo o función conviene elegir, qué datos recibe, qué salida produce, cuánto trabajo de mantenimiento exige y qué puede fallar. Si una herramienta sobra, dilo claramente.

Devuélveme primero una ficha breve con objetivo, usuarios, entrada, salida, límites, criterio de éxito y siguiente paso. Después escribe un plan de construcción en etapas visibles. Cada etapa debe terminar con algo que pueda revisar en pantalla. Incluye el prompt específico que debo usar en la siguiente herramienta, el resultado que espero obtener y una prueba con un caso normal, uno incompleto, uno repetido y uno extremo.

No pases todavía a producción. Marca cualquier acción irreversible, conexión con datos reales, publicación, envío o gasto que necesite mi aprobación. Explícame las palabras técnicas en español sencillo y termina con una checklist de revisión.`
}

function legacySavedPrompts(project?: ProjectProfile): SavedPrompt[] {
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
        family: family || 'Biblioteca',
        name: name || 'Prompt guardado',
        prompt: rest.join('\n\n').trim(),
        savedAt: project?.updatedAt || new Date().toISOString(),
        source: 'Guardado antes de la organización nueva',
      }
    })
    .filter((item) => item.prompt)
}

function projectSavedPrompts(project?: ProjectProfile): SavedPrompt[] {
  const seen = new Set<string>()
  return [...legacySavedPrompts(project), ...(project?.savedPrompts || [])].filter((item) => {
    const key = `${item.family}-${item.name}-${item.prompt.slice(0, 120)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export default function MiProyecto() {
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

  const suggestions = useMemo(() => toolSuggestion(goal, course.toolPages), [goal, course.toolPages])
  const chosenTools = useMemo(() => selectedTools.map((id) => course.toolPages.find((tool) => tool.id === id)).filter(Boolean) as ToolPage[], [course.toolPages, selectedTools])
  const prompt = useMemo(() => buildPrompt(draft, goal, audience, outcome, chosenTools), [draft, goal, audience, outcome, chosenTools])
  const savedPrompts = useMemo(() => projectSavedPrompts(student.project), [student.project])

  useEffect(() => {
    if (student.project) {
      setDraft(student.project)
      setSelectedTools(student.project.toolIds || [])
      setAudience(student.project.audience || '')
      setOutcome(student.project.outcome || '')
    }
  }, [student.project])

  function save() {
    store.setProject({ ...draft, audience, outcome, goal: selectedLabel(GOALS, goal), tools: chosenTools.map((tool) => tool.label).join(', '), toolIds: selectedTools, projectType: goal, promptBrief: prompt, savedPrompts: student.project?.savedPrompts || draft.savedPrompts || [], updatedAt: new Date().toISOString() })
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

  const canContinue = step === 0 || step === 1 ? Boolean(step === 0 ? goal : audience) : step === 2 ? Boolean(outcome) : step === 3 ? selectedTools.length > 0 : true

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><BookMarked size={12} /> Asistente de proyecto</span>
        <h1>Vamos a convertir tu idea en un proyecto</h1>
        <p>Elige opciones y deja que la academia prepare una ruta. Primero se define el prompt correcto; después se construye la primera versión.</p>
      </div>

      <div className="st-project-progress" aria-label="Progreso del asistente">
        {['Objetivo', 'Persona', 'Resultado', 'Herramientas', 'Prompt', 'Ruta'].map((label, index) => <button key={label} type="button" className={index === step ? 'on' : index < step ? 'done' : ''} onClick={() => index <= step && setStep(index)}><span>{index < step ? <Check size={11} /> : index + 1}</span>{label}</button>)}
      </div>

      <section className="st-project-wizard">
        {step === 0 && <WizardChoice title="¿Qué quieres conseguir?" hint="No necesitas saber todavía qué herramienta usar." options={GOALS} value={goal} onChange={(value) => { setGoal(value as GoalId); setSelectedTools([]); setSaved(false) }} />}

        {step === 1 && <div><WizardHeading icon={<Target size={16} />} title="¿Quién va a utilizarlo?" hint="Esto cambia el nivel de explicación, los permisos y el tipo de entrega." /><ChoiceGrid options={AUDIENCES} value={audience} onChange={setAudience} /><label className="st-wizard-input"><span>Nombre provisional del proyecto</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ej. Clasificador de solicitudes" /></label></div>}

        {step === 2 && <div><WizardHeading icon={<Compass size={16} />} title="¿Qué tiene que existir al terminar la primera versión?" hint="Escoge el resultado que puedas comprobar con tus propios ojos." /><ChoiceGrid options={OUTCOMES} value={outcome} onChange={setOutcome} /><label className="st-wizard-input"><span>Cuéntalo en una frase, si ya lo sabes</span><textarea rows={3} value={draft.problem} onChange={(event) => setDraft({ ...draft, problem: event.target.value })} placeholder="Ej. Recibir solicitudes, clasificarlas y dejar un registro que el equipo pueda revisar." /></label></div>}

        {step === 3 && <div><WizardHeading icon={<Wrench size={16} />} title="Elige las herramientas que quieres explorar" hint="Puedes seleccionar varias. La academia te dirá cuáles encajan y cuál usar primero." /><div className="st-tool-pick-note"><Lightbulb size={14} /><span>Recomendadas para tu objetivo: {suggestions.map((tool) => tool.label).join(', ') || 'elige una para que aparezcan recomendaciones'}.</span></div><div className="st-tool-picker">{course.toolPages.map((tool) => <ToolChoice key={tool.id} tool={tool} selected={selectedTools.includes(tool.id)} recommended={suggestions.some((item) => item.id === tool.id)} onClick={() => toggleTool(tool.id)} />)}</div></div>}

        {step === 4 && <div><WizardHeading icon={<Sparkles size={16} />} title="Este es el prompt específico de tu proyecto" hint="Léelo, cópialo y úsalo antes de construir nada. Te obliga a aclarar las decisiones importantes." /><div className="st-prompt-prep"><strong>Antes de pegarlo</strong><span>Ten preparada una descripción real, no datos sensibles. El prompt te hará preguntas una a una y comparará las herramientas seleccionadas.</span></div><div className="st-code st-project-prompt"><button type="button" onClick={() => { navigator.clipboard?.writeText(prompt); setCopied(true); window.setTimeout(() => setCopied(false), 1600) }}><Clipboard size={11} /> {copied ? 'Copiado' : 'Copiar prompt'}</button><pre><code>{prompt}</code></pre></div><small className="st-prompt-length">{prompt.trim().split(/\s+/).length} palabras · preguntas, elección de herramienta, prueba y límites</small></div>}

        {step === 5 && <div><WizardHeading icon={<Save size={16} />} title="Tu ruta está preparada" hint="La ficha queda guardada en este navegador y puedes volver a cambiarla cuando aprendas algo nuevo." /><div className="st-project-summary"><div><span>Objetivo</span><strong>{selectedLabel(GOALS, goal)}</strong></div><div><span>Persona</span><strong>{selectedLabel(AUDIENCES, audience)}</strong></div><div><span>Resultado</span><strong>{selectedLabel(OUTCOMES, outcome)}</strong></div><div><span>Herramientas</span><strong>{chosenTools.map((tool) => tool.label).join(', ')}</strong></div></div><div className="st-project-route"><a href={href({ name: 'curso' })}><BookMarked size={16} /><span><strong>1. Seguir el Programa</strong><small>Aprende primero la etapa que corresponde a tu objetivo.</small></span><ArrowRight size={13} /></a>{chosenTools.slice(0, 3).map((tool) => <a key={tool.id} href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}><Wrench size={16} /><span><strong>2. Abrir {tool.label}</strong><small>Ve sus modelos, funciones, prompts y automatizaciones.</small></span><ArrowRight size={13} /></a>)}</div>{saved && <p className="st-project-saved"><Check size={12} /> Guardado en este navegador.</p>}</div>}

        <footer className="st-wizard-actions"><button type="button" className="st-btn-ghost" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}><ArrowLeft size={13} /> Atrás</button>{step < 5 ? <button type="button" className="st-btn" onClick={next} disabled={!canContinue}>{step === 4 ? 'Preparar mi ruta' : 'Continuar'} <ArrowRight size={13} /></button> : <button type="button" className="st-btn" onClick={save}><Save size={13} /> Guardar ruta</button>}</footer>
      </section>

      <SavedPromptsPanel prompts={savedPrompts} />

      <p className="st-project-storage">Por ahora la ficha se guarda solo en este navegador. La estructura queda preparada para sincronizarla con una cuenta online más adelante.</p>
    </div>
  )
}

function SavedPromptsPanel({ prompts }: { prompts: SavedPrompt[] }) {
  const [openId, setOpenId] = useState<string | null>(prompts[0]?.id || null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (!openId && prompts[0]) setOpenId(prompts[0].id)
  }, [openId, prompts])

  return (
    <section className="st-project-prompts">
      <div className="st-section-head">
        <div>
          <span className="st-kicker">Biblioteca del proyecto</span>
          <h2>Prompts guardados</h2>
        </div>
        <a href={href({ name: 'kits' })}>Ver kits institucionales <ArrowRight size={13} /></a>
      </div>
      {prompts.length ? (
        <div className="st-saved-prompts">
          <div className="st-saved-prompt-list">
            {prompts.map((prompt) => (
              <button key={prompt.id} type="button" className={openId === prompt.id ? 'on' : ''} onClick={() => setOpenId(prompt.id)}>
                <span>{prompt.family}</span>
                <strong>{prompt.name}</strong>
                <small>{new Date(prompt.savedAt).toLocaleDateString('es-ES')}</small>
              </button>
            ))}
          </div>
          {prompts.map((prompt) => openId === prompt.id ? (
            <article key={prompt.id} className="st-saved-prompt-detail">
              <span className="st-kicker">{prompt.source || 'Prompt guardado'}</span>
              <h3>{prompt.name}</h3>
              <p>{prompt.family}</p>
              <button
                type="button"
                className="st-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(prompt.prompt)
                  setCopied(prompt.id)
                  window.setTimeout(() => setCopied(null), 1600)
                }}
              >
                <Clipboard size={12} /> {copied === prompt.id ? 'Copiado' : 'Copiar prompt'}
              </button>
              <pre>{prompt.prompt}</pre>
            </article>
          ) : null)}
        </div>
      ) : (
        <div className="st-empty">
          <h2>Aún no has guardado prompts</h2>
          <p>Guarda prompts desde la biblioteca o desde un kit institucional y aparecerán aquí, dentro de tu proyecto.</p>
          <a className="st-btn" href={href({ name: 'prompts' })}>Ir a Prompts</a>
        </div>
      )}
    </section>
  )
}

function WizardHeading({ icon, title, hint }: { icon: ReactNode; title: string; hint: string }) { return <div className="st-wizard-heading"><span>{icon}</span><div><h2>{title}</h2><p>{hint}</p></div></div> }
function ChoiceGrid({ options, value, onChange }: { options: Choice[]; value: string; onChange: (value: string) => void }) { return <div className="st-choice-grid">{options.map((option) => <button key={option.id} type="button" className={value === option.id ? 'selected' : ''} onClick={() => onChange(option.id)}><span>{value === option.id ? <Check size={14} /> : <MousePointer2 size={14} />}</span><strong>{option.label}</strong><small>{option.description}</small></button>)}</div> }
function WizardChoice({ title, hint, options, value, onChange }: { title: string; hint: string; options: Choice[]; value: string; onChange: (value: string) => void }) { return <div><WizardHeading icon={<Target size={16} />} title={title} hint={hint} /><ChoiceGrid options={options} value={value} onChange={onChange} /></div> }
function ToolChoice({ tool, selected, recommended, onClick }: { tool: ToolPage; selected: boolean; recommended: boolean; onClick: () => void }) { return <button type="button" className={`st-tool-choice${selected ? ' selected' : ''}`} onClick={onClick}><span className="st-tool-choice-mark">{selected ? <Check size={13} /> : <Wrench size={13} />}</span><span><strong>{tool.label}</strong><small>{recommended ? 'Recomendada para este objetivo' : tool.guide ? 'Guía completa disponible' : `${tool.count} lecciones`}</small></span></button> }
