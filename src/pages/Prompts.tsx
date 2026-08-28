import { useMemo, useState } from 'react'
import { Ban, Check, Copy, Lightbulb, Save, Search, Sparkles } from 'lucide-react'
import type { PromptFamily, PromptItem } from '../types'
import { useCourse } from '../course'
import { store, useStudent } from '../store'

/**
 * Biblioteca de prompts.
 *
 * Prompts escritos para copiar y pegar en la caja de texto de ChatGPT, Claude
 * o Gemini. Cada uno dice cuándo se usa, qué hay que sustituir, qué te va a
 * devolver y qué hacer después con esa respuesta.
 */
function PromptCard({ prompt, familyTitle }: { prompt: PromptItem; familyTitle: string }) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [open, setOpen] = useState(false)
  const student = useStudent()

  function saveToProject() {
    const previous = student.project
    const savedPrompts = [
      ...(previous?.savedPrompts || []),
      {
        id: prompt.id || `${Date.now()}-${prompt.name}`,
        family: familyTitle,
        name: prompt.name,
        prompt: prompt.prompt,
        savedAt: new Date().toISOString(),
        source: prompt.source ? `Biblioteca de prompts · ${prompt.source}` : 'Biblioteca de prompts',
      },
    ]
    store.setProject({
      name: previous?.name || '',
      goal: previous?.goal || 'Usar un prompt profesional',
      audience: previous?.audience || '',
      problem: previous?.problem || '',
      outcome: previous?.outcome || 'Guardar una evidencia del resultado',
      tools: previous?.tools || 'ChatGPT, Claude o Gemini',
      toolIds: previous?.toolIds || [],
      projectType: previous?.projectType || 'aprender',
      promptBrief: previous?.promptBrief || '',
      savedPrompts,
      updatedAt: new Date().toISOString(),
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <article className={`st-prompt${open ? ' open' : ''}`}>
      <button type="button" className="st-prompt-head" onClick={() => setOpen((value) => !value)}>
        <div>
          {(prompt.toolLabel || prompt.source) && (
            <span className="st-prompt-card-meta">
              {prompt.toolLabel && <b>{prompt.toolLabel}</b>}
              {prompt.source && <b>{prompt.source}</b>}
            </span>
          )}
          <strong>{prompt.name}</strong>
          <span>{prompt.when}</span>
        </div>
        <em>{open ? 'Ocultar' : 'Ver el prompt'}</em>
      </button>

      {open && (
        <div className="st-prompt-body">
          <div className="st-prompt-text">
            <button
              type="button"
              className="st-prompt-copy"
              onClick={() => {
                navigator.clipboard?.writeText(prompt.prompt).then(
                  () => {
                    setCopied(true)
                    window.setTimeout(() => setCopied(false), 1800)
                  },
                  () => setCopied(false),
                )
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copiado' : 'Copiar el prompt'}
            </button>
            <button type="button" className="st-prompt-save" onClick={saveToProject}>
              {saved ? <Check size={12} /> : <Save size={12} />}
              {saved ? 'Guardado' : 'Guardar en mi proyecto'}
            </button>
            <pre>{prompt.prompt}</pre>
            <small className="st-prompt-length">{prompt.prompt.trim().split(/\s+/).filter(Boolean).length} palabras · encargo completo con contexto, pruebas, coste y entrega</small>
          </div>

          {prompt.fill?.length > 0 && (
            <dl className="st-prompt-fill">
              <dt className="st-prompt-fill-title">Lo que tienes que sustituir</dt>
              {prompt.fill.map(([hueco, que]) => (
                <div key={hueco}>
                  <dt><code>{hueco}</code></dt>
                  <dd>{que}</dd>
                </div>
              ))}
            </dl>
          )}

          <p className="st-prompt-expect"><b>Te va a devolver:</b> {prompt.expect}</p>
          {prompt.next && <p className="st-prompt-next"><b>Y después:</b> {prompt.next}</p>}
          <div className="st-prompt-flow">
            <span>1. Copia</span>
            <span>2. Pega en tu IA</span>
            <span>3. Guarda resultado</span>
            <span>4. Llévalo a Mi proyecto</span>
          </div>
        </div>
      )}
    </article>
  )
}

export default function Prompts({ familyId }: { familyId?: string }) {
  const course = useCourse()
  const baseFamilias = course.prompts || []
  const allPromptsFamily = useMemo<PromptFamily>(() => ({
    id: 'todo-banco-institucional',
    title: 'Todo el banco',
    intro: 'Vista completa de la biblioteca institucional. Usa el filtro de herramienta para ver los 50 prompts de una herramienta concreta o busca por tarea, riesgo, entrega o proceso.',
    model: 'Usa una IA con buen razonamiento y contexto largo. Para decisiones sensibles, compara con otra IA y conserva evidencia.',
    prompts: baseFamilias.flatMap((item) => item.prompts),
    canDo: [
      'Reunir en una sola vista los prompts de todas las categorías, herramientas y fuentes.',
      'Filtrar por herramienta para ver el banco completo de una tecnología concreta.',
      'Buscar por proceso, entrega, riesgo, dato o tarea cuando no sabes en qué categoría cae.',
    ],
    cantDo: [
      'No sustituye la elección de categoría cuando quieres trabajar con foco.',
      'No evita revisar privacidad, coste y aprobación humana antes de usar datos reales.',
      'No confirma precios ni funciones recientes del proveedor.',
    ],
    tips: [
      'Para ver los 50 prompts de una herramienta, elige esta vista y después selecciona la herramienta.',
      'Para estudiar por intención, usa una categoría concreta como Automatizar o Seguridad.',
      'Guarda en Mi proyecto solo los prompts que de verdad vayas a usar.',
    ],
  }), [baseFamilias])
  const familias = useMemo(() => [allPromptsFamily, ...baseFamilias], [allPromptsFamily, baseFamilias])
  const [query, setQuery] = useState('')
  const [selectedTool, setSelectedTool] = useState('all')
  const [active, setActive] = useState(familyId || allPromptsFamily.id)

  const familia = familias.find((item) => item.id === active) || familias[0]
  const totalPrompts = baseFamilias.reduce((sum, item) => sum + item.prompts.length, 0)

  const toolOptions = useMemo(() => {
    if (!familia) return []
    const byId = new Map<string, string>()
    for (const item of familia.prompts) {
      if (!item.toolId || !item.toolLabel) continue
      byId.set(item.toolId, item.toolLabel)
    }
    return [...byId.entries()]
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => (a.id === 'general' ? -1 : b.id === 'general' ? 1 : a.label.localeCompare(b.label, 'es')))
  }, [familia])

  const activeTool = selectedTool === 'all' || toolOptions.some((item) => item.id === selectedTool)
    ? selectedTool
    : 'all'

  const encontrados = useMemo(() => {
    if (!familia) return []
    const needle = query.trim().toLowerCase()
    return familia.prompts.filter((item) => {
      if (activeTool !== 'all' && item.toolId !== activeTool) return false
      if (!needle) return true
      return `${item.name} ${item.when} ${item.prompt} ${item.toolLabel || ''} ${item.source || ''}`.toLowerCase().includes(needle)
    })
  }, [activeTool, familia, query])

  if (!baseFamilias.length) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>La biblioteca de prompts se está escribiendo</h2>
          <p>Vuelve en un momento.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><Sparkles size={12} /> Listos para copiar</span>
        <h1>Biblioteca de prompts</h1>
        <p>
          Banco institucional centralizado: {totalPrompts} prompts para copiar, pegar y rellenar con corchetes.
          Elige qué quieres hacer, filtra por herramienta y guarda el resultado como evidencia.
        </p>
      </div>

      <section className="st-prompt-steps" aria-label="Flujo recomendado para usar prompts">
        <div><span>01</span><strong>Elige situación</strong><small>No busques por herramienta: empieza por lo que quieres resolver.</small></div>
        <div><span>02</span><strong>Rellena huecos</strong><small>Cambia solo los campos entre corchetes o los datos de tu caso.</small></div>
        <div><span>03</span><strong>Guarda evidencia</strong><small>Copia el resultado útil en Mi proyecto para no perderlo.</small></div>
      </section>

      <div className="st-filters">
        <div className="st-filter-row">
          <span>Qué quieres hacer</span>
          {familias.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`st-chip${item.id === familia?.id ? ' on' : ''}`}
              onClick={() => { setActive(item.id); setQuery('') }}
            >
              {item.title}
              <b>{item.prompts.length}</b>
            </button>
          ))}
        </div>
        <div className="st-filter-row">
          <span>Herramienta</span>
          <label className="st-prompt-tool-select">
            <select value={activeTool} onChange={(event) => setSelectedTool(event.target.value)}>
              <option value="all">Todas las herramientas ({familia?.prompts.length || 0})</option>
              {toolOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} ({familia?.prompts.filter((prompt) => prompt.toolId === item.id).length || 0})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="st-filter-row">
          <span>Buscar</span>
          <label className="st-piece-search" style={{ flex: 1 }}>
            <Search size={13} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="correo, propuesta, error, web…"
              style={{ width: '100%' }}
            />
          </label>
        </div>
      </div>

      {familia && (
        <>
          <section className="st-prompt-intro">
            <h2>{familia.title}</h2>
            <p>{familia.intro}</p>
            <p className="st-prompt-model"><Lightbulb size={12} /> {familia.model}</p>
          </section>

          <div className="st-matters">
            <div className="st-matters-yes">
              <strong><Check size={11} /> Esto sí lo hace bien</strong>
              <ul>{familia.canDo.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="st-matters-no">
              <strong><Ban size={11} /> Esto no lo hace</strong>
              <ul>{familia.cantDo.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>

          <div className="st-section-head">
            <h2>Los prompts</h2>
            <span>{encontrados.length} de {familia.prompts.length}</span>
          </div>

          <div className="st-prompt-list">
            {encontrados.map((item) => <PromptCard key={item.id || item.name} prompt={item} familyTitle={familia.title} />)}
          </div>

          {familia.tips?.length > 0 && (
            <section className="st-block st-block-ejemplo">
              <h3><Lightbulb size={15} /> Tres cosas que cambian el resultado</h3>
              <ol className="st-example">
                {familia.tips.map((tip, index) => <li key={tip}><span>{index + 1}</span>{tip}</li>)}
              </ol>
            </section>
          )}
        </>
      )}
    </div>
  )
}
