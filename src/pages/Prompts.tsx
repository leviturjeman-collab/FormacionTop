import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Ban, Check, Copy, Lightbulb, Save, Search, Sparkles, X } from 'lucide-react'
import type { PromptFamily, PromptItem } from '../types'
import { useCourse } from '../course'
import { store, useStudent } from '../store'

type SearchResult = { prompt: PromptItem; family: PromptFamily }

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
        <em>Ver el prompt</em>
      </button>

      {open && (
        <div className="st-focus-modal" role="dialog" aria-modal="true" aria-label={`Prompt ${prompt.name}`}>
          <button type="button" className="st-focus-backdrop" onClick={() => setOpen(false)} aria-label="Cerrar" />
          <div className="st-focus-sheet st-prompt-modal">
            <header>
              <div>
                <span className="st-kicker">{familyTitle}</span>
                <h3>{prompt.name}</h3>
                <p>{prompt.when}</p>
              </div>
              <button type="button" className="st-icon-close" onClick={() => setOpen(false)} aria-label="Cerrar prompt"><X size={16} /></button>
            </header>
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
                <small className="st-prompt-length">{prompt.prompt.trim().split(/\s+/).filter(Boolean).length} palabras · listo para copiar y rellenar</small>
              </div>

              {prompt.fill?.length > 0 && (
                <dl className="st-prompt-fill">
                  <dt className="st-prompt-fill-title">2. Rellena estos huecos</dt>
                  {prompt.fill.map(([hueco, que]) => (
                    <div key={hueco}>
                      <dt><code>{hueco}</code></dt>
                      <dd>{que}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <p className="st-prompt-expect"><b>3. Al terminar mira esto:</b> {prompt.expect}</p>
              {prompt.next && <p className="st-prompt-next"><b>4. Siguiente paso:</b> {prompt.next}</p>}
              <div className="st-prompt-flow">
                <span>1. Entra en ChatGPT, Claude o Gemini</span>
                <span>2. Copia y pega el prompt</span>
                <span>3. Cambia los huecos entre corchetes</span>
                <span>4. Guarda lo útil en Mi proyecto</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default function Prompts({ familyId }: { familyId?: string }) {
  const course = useCourse()
  const baseFamilias = course.prompts || []
  const [query, setQuery] = useState('')
  const [selectedTool, setSelectedTool] = useState('all')
  const [active, setActive] = useState(familyId || '')
  const firstFamily = baseFamilias.find((item) => item.id === familyId) || baseFamilias[0]
  const [activeSection, setActiveSection] = useState(firstFamily?.sectionId || 'otros')
  const [cuantos, setCuantos] = useState(12)
  const [focused, setFocused] = useState(false)

  const activeId = active || familyId || baseFamilias[0]?.id || ''
  const familia = baseFamilias.find((item) => item.id === activeId) || baseFamilias[0]
  const totalPrompts = baseFamilias.reduce((sum, item) => sum + item.prompts.length, 0)

  const promptSections = useMemo(() => {
    const byId = new Map<string, {
      id: string
      title: string
      description: string
      families: PromptFamily[]
    }>()
    for (const family of baseFamilias) {
      const id = family.sectionId || 'otros'
      const current = byId.get(id) || {
        id,
        title: family.sectionTitle || 'Otros bloques',
        description: family.sectionDescription || 'Bloques de prompts institucionales agrupados por uso.',
        families: [],
      }
      current.families.push(family)
      byId.set(id, current)
    }
    return [...byId.values()].map((section) => ({
      ...section,
      families: section.families.sort((a, b) =>
        (a.toolLabel || a.blockTitle || a.title).localeCompare(b.toolLabel || b.blockTitle || b.title, 'es'),
      ),
    }))
  }, [baseFamilias])
  const selectedSection = promptSections.find((section) => section.id === activeSection) || promptSections[0]

  const allPromptEntries = useMemo<SearchResult[]>(
    () => baseFamilias.flatMap((family) => family.prompts.map((prompt) => ({ prompt, family }))),
    [baseFamilias],
  )

  const toolOptions = useMemo(() => {
    const byId = new Map<string, string>()
    for (const { prompt } of allPromptEntries) {
      if (!prompt.toolId || !prompt.toolLabel) continue
      byId.set(prompt.toolId, prompt.toolLabel)
    }
    return [...byId.entries()]
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => (a.id === 'general' ? -1 : b.id === 'general' ? 1 : a.label.localeCompare(b.label, 'es')))
  }, [allPromptEntries])

  const activeTool = selectedTool === 'all' || toolOptions.some((item) => item.id === selectedTool)
    ? selectedTool
    : 'all'

  function selectFamily(id: string) {
    setCuantos(12)
    setActive(id)
    setQuery('')
    setSelectedTool('all')
    setFocused(true)
    const family = baseFamilias.find((item) => item.id === id)
    if (family?.sectionId) setActiveSection(family.sectionId)
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  }

  function selectSection(id: string) {
    const section = promptSections.find((item) => item.id === id)
    const first = section?.families[0]
    setActiveSection(id)
    setCuantos(12)
    setQuery('')
    setSelectedTool('all')
    setFocused(true)
    if (first) setActive(first.id)
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  }

  const searchResults = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return allPromptEntries.filter(({ prompt, family }) => {
      if (activeTool !== 'all' && prompt.toolId !== activeTool) return false
      if (!needle) return true
      return `${prompt.name} ${prompt.when} ${prompt.prompt} ${prompt.toolLabel || ''} ${prompt.source || ''} ${family.title} ${family.blockDescription || ''}`.toLowerCase().includes(needle)
    })
  }, [activeTool, allPromptEntries, query])

  const familyPrompts = useMemo<SearchResult[]>(() => {
    if (!familia) return []
    return familia.prompts.map((prompt) => ({ prompt, family: familia }))
  }, [familia])

  useEffect(() => {
    if (!familyId || familyId === active) return
    setActive(familyId)
    const family = baseFamilias.find((item) => item.id === familyId)
    if (family?.sectionId) setActiveSection(family.sectionId)
  }, [active, baseFamilias, familyId])

  const showingGlobalResults = query.trim().length > 0 || activeTool !== 'all'
  const encontrados = showingGlobalResults ? searchResults : familyPrompts
  const visibles = encontrados.slice(0, cuantos)
  const quedan = encontrados.length - visibles.length
  const exactToolCount = activeTool === 'all' ? 0 : allPromptEntries.filter(({ prompt }) => prompt.toolId === activeTool).length

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
    <div className={`st-page st-prompt-page${focused ? ' is-focused' : ''}`}>
      <div className="st-page-title">
        <span className="st-kicker"><Sparkles size={12} /> Listos para copiar</span>
        <h1>Biblioteca de prompts</h1>
        <p>
          {totalPrompts} prompts escritos para copiar, pegar y rellenar los huecos entre corchetes. Están
          repartidos en bloques: abre solo el que necesites. Si no sabes en cuál mirar, busca por una palabra.
        </p>
      </div>

      <section className="st-prompt-steps" aria-label="Flujo recomendado para usar prompts">
        <div><span>01</span><strong>Abre un bloque</strong><small>Cada bloque va de una cosa: una tarea o una herramienta. Pulsa el título para desplegarlo.</small></div>
        <div><span>02</span><strong>Busca si dudas</strong><small>Escribe cualquier palabra: correo, error, privacidad, vídeo, RAG, web, propuesta...</small></div>
        <div><span>03</span><strong>Guarda evidencia</strong><small>Copia el prompt, rellena corchetes y guarda el resultado útil en Mi proyecto.</small></div>
      </section>

      <section className="st-prompt-refine st-prompt-refine-top" aria-label="Buscar en toda la biblioteca">
        <label className="st-prompt-refine-field">
          <span>Buscar en todo el banco</span>
          <span className="st-piece-search">
            <Search size={13} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="correo, error, web, privacidad, RAG, vídeo..."
            />
          </span>
        </label>
        <label className="st-prompt-refine-field">
          <span>Herramienta o contexto</span>
          <span className="st-prompt-tool-select">
            <select value={activeTool} onChange={(event) => setSelectedTool(event.target.value)}>
              <option value="all">Todas las herramientas ({totalPrompts})</option>
              {toolOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} ({allPromptEntries.filter(({ prompt }) => prompt.toolId === item.id).length})
                </option>
              ))}
            </select>
          </span>
        </label>
      </section>

      <section className="st-prompt-category-strip" aria-label="Categorías de prompts">
        {promptSections.map((section, sectionIndex) => {
          const sectionCount = section.families.reduce((sum, family) => sum + family.prompts.length, 0)
          const selected = section.id === selectedSection?.id
          return (
            <button
              key={section.id}
              type="button"
              className={selected ? 'on' : ''}
              onClick={() => selectSection(section.id)}
              aria-pressed={selected}
            >
              <span>{String(sectionIndex + 1).padStart(2, '0')}</span>
              <strong>{section.title}</strong>
              <small>{section.families.length} bloques · {sectionCount} prompts</small>
            </button>
          )
        })}
      </section>

      {focused && (
        <div className="st-inline-focusbar">
          <button type="button" className="st-btn-ghost" onClick={() => setFocused(false)}>
            <ArrowLeft size={12} /> Volver a todos los bloques
          </button>
          <span>{familia?.title || selectedSection?.title || 'Prompts'}</span>
        </div>
      )}

      <section className={`st-prompt-workbench${focused ? ' focused' : ''}`}>
        <aside className="st-prompt-family-rail" aria-label="Bloques de la categoría seleccionada">
          <div className="st-prompt-family-head">
            <span className="st-kicker">Categoría activa</span>
            <h2>{selectedSection?.title || 'Prompts'}</h2>
            <p>{selectedSection?.description || 'Elige un bloque concreto para ver solo sus prompts.'}</p>
          </div>
          <div className="st-prompt-family-list">
            {(selectedSection?.families || []).map((family) => (
              <a
                key={family.id}
                href={`#/prompts/${encodeURIComponent(family.id)}`}
                className={`st-prompt-family-card${family.id === familia?.id ? ' on' : ''}`}
                onClick={() => selectFamily(family.id)}
              >
                <span>{family.source || family.sectionTitle || 'Bloque institucional'}</span>
                <strong>{family.blockTitle || family.title}</strong>
                <small>{family.useCase || family.intro}</small>
                <i>{family.prompts.length} prompts</i>
              </a>
            ))}
          </div>
        </aside>

        <div className="st-prompt-results-panel">
          {familia && (
            <>
              <section className="st-prompt-intro">
                <span className="st-kicker">{showingGlobalResults ? 'Resultados' : familia.sectionTitle || 'Bloque seleccionado'}</span>
                <h2>{showingGlobalResults ? 'Resultados de búsqueda' : familia.title}</h2>
                <p>
                  {showingGlobalResults
                    ? `Se está buscando en toda la biblioteca. ${activeTool !== 'all' ? `Filtro activo: ${toolOptions.find((item) => item.id === activeTool)?.label || activeTool}, ${exactToolCount} prompts disponibles.` : 'Puedes combinar texto libre y herramienta.'}`
                    : familia.intro}
                </p>
                <p className="st-prompt-model"><Lightbulb size={12} /> {familia.model}</p>
              </section>

              {!showingGlobalResults && (
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
              )}

              <div className="st-section-head">
                <h2>{showingGlobalResults ? 'Prompts encontrados' : `Los ${encontrados.length} prompts de este bloque`}</h2>
                <span>{quedan > 0 ? `Viendo ${visibles.length} de ${encontrados.length}` : `${encontrados.length} prompts`}</span>
              </div>

              <div className="st-prompt-list">
                {visibles.map(({ prompt, family }) => (
                  <PromptCard key={`${family.id}-${prompt.id || prompt.name}`} prompt={prompt} familyTitle={family.title} />
                ))}
              </div>

              {quedan > 0 && (
                <button type="button" className="st-prompt-mas" onClick={() => setCuantos((v) => v + 12)}>
                  Ver {Math.min(12, quedan)} prompts más · quedan {quedan}
                </button>
              )}

              {!visibles.length && (
                <div className="st-empty">
                  <h2>No encuentro nada con esa búsqueda</h2>
                  <p>Prueba con una palabra más amplia: error, datos, correo, proyecto, web, coste, seguridad o entrega.</p>
                </div>
              )}

              {!showingGlobalResults && familia.tips?.length > 0 && (
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
      </section>
    </div>
  )
}
