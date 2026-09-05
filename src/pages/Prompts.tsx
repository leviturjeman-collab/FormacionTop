import { copyText } from '../clipboard'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Ban, Check, Copy, Lightbulb, Save, Search, Sparkles, X } from 'lucide-react'
import type { PromptFamily, PromptItem } from '../types'
import { useCourse } from '../course'
import { store, useStudent } from '../store'
import { useLocale } from '../i18n'

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
  const dialogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]') || [])
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    focusable()[0]?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false) }
      if (event.key !== 'Tab') return
      const elements = focusable()
      const first = elements[0], last = elements[elements.length - 1]
      if (!first) { event.preventDefault(); return }
      if (event.shiftKey && (document.activeElement === first || !dialog?.contains(document.activeElement))) {
        event.preventDefault(); last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !dialog?.contains(document.activeElement))) {
        event.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [open])
  const student = useStudent()
  const locale = useLocale()

  function saveToProject() {
    const previous = student.project
    const savedPrompts = [
      ...(previous?.savedPrompts || []).filter((saved) => saved.prompt !== prompt.prompt),
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
        <em>{locale === 'en' ? 'View prompt' : 'Ver el prompt'}</em>
      </button>

      {open && (
        <div ref={dialogRef} className="st-focus-modal" role="dialog" aria-modal="true" aria-label={`Prompt ${prompt.name}`}>
          <button type="button" className="st-focus-backdrop" onClick={() => setOpen(false)} aria-label={locale === 'en' ? 'Close' : 'Cerrar'} />
          <div className="st-focus-sheet st-prompt-modal">
            <header>
              <div>
                <span className="st-kicker">{familyTitle}</span>
                <h3>{prompt.name}</h3>
                <p>{prompt.when}</p>
              </div>
              <button type="button" className="st-icon-close" onClick={() => setOpen(false)} aria-label={locale === 'en' ? 'Close prompt' : 'Cerrar prompt'}><X size={16} /></button>
            </header>
            <div className="st-prompt-body">
              <div className="st-prompt-text">
                <button
                  type="button"
                  className="st-prompt-copy"
                  onClick={() => {
                    copyText(prompt.prompt).then(
                      () => {
                        setCopied(true)
                        window.setTimeout(() => setCopied(false), 1800)
                      },
                      () => setCopied(false),
                    )
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? (locale === 'en' ? 'Copied' : 'Copiado') : (locale === 'en' ? 'Copy prompt' : 'Copiar el prompt')}
                </button>
                <button type="button" className="st-prompt-save" onClick={saveToProject}>
                  {saved ? <Check size={12} /> : <Save size={12} />}
                  {saved ? (locale === 'en' ? 'Saved' : 'Guardado') : (locale === 'en' ? 'Save to my project' : 'Guardar en mi proyecto')}
                </button>
                <pre>{prompt.prompt}</pre>
                <small className="st-prompt-length">{prompt.prompt.trim().split(/\s+/).filter(Boolean).length} {locale === 'en' ? 'words · full brief with context, tests, cost and delivery' : 'palabras · encargo completo con contexto, pruebas, coste y entrega'}</small>
              </div>

              {prompt.fill?.length > 0 && (
                <dl className="st-prompt-fill">
                  <dt className="st-prompt-fill-title">{locale === 'en' ? 'What you need to replace' : 'Lo que tienes que sustituir'}</dt>
                  {prompt.fill.map(([hueco, que]) => (
                    <div key={hueco}>
                      <dt><code>{hueco}</code></dt>
                      <dd>{que}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <p className="st-prompt-expect"><b>{locale === 'en' ? "It'll give you:" : 'Te va a devolver:'}</b> {prompt.expect}</p>
              {prompt.next && <p className="st-prompt-next"><b>{locale === 'en' ? 'And then:' : 'Y después:'}</b> {prompt.next}</p>}
              <div className="st-prompt-flow">
                <span>{locale === 'en' ? '1. Copy' : '1. Copia'}</span>
                <span>{locale === 'en' ? '2. Paste into your AI' : '2. Pega en tu IA'}</span>
                <span>{locale === 'en' ? '3. Save the result' : '3. Guarda resultado'}</span>
                <span>{locale === 'en' ? '4. Bring it to My project' : '4. Llévalo a Mi proyecto'}</span>
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
  const locale = useLocale()
  const baseFamilias = course.prompts || []
  const [query, setQuery] = useState('')
  const [selectedTool, setSelectedTool] = useState('all')
  const [active, setActive] = useState(familyId || '')
  const firstFamily = baseFamilias.find((item) => item.id === familyId) || baseFamilias[0]
  const [activeSection, setActiveSection] = useState(firstFamily?.sectionId || 'otros')
  const [cuantos, setCuantos] = useState(12)

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
        title: family.sectionTitle || (locale === 'en' ? 'Other blocks' : 'Otros bloques'),
        description: family.sectionDescription || (locale === 'en' ? 'Blocks of institutional prompts grouped by use.' : 'Bloques de prompts institucionales agrupados por uso.'),
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
  }, [baseFamilias, locale])
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
    const family = baseFamilias.find((item) => item.id === id)
    if (family?.sectionId) setActiveSection(family.sectionId)
  }

  function selectSection(id: string) {
    const section = promptSections.find((item) => item.id === id)
    const first = section?.families[0]
    setActiveSection(id)
    setCuantos(12)
    setQuery('')
    setSelectedTool('all')
    if (first) setActive(first.id)
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
          <h2>{locale === 'en' ? 'The prompt library is being written' : 'La biblioteca de prompts se está escribiendo'}</h2>
          <p>{locale === 'en' ? 'Check back in a moment.' : 'Vuelve en un momento.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><Sparkles size={12} /> {locale === 'en' ? 'Ready to copy' : 'Listos para copiar'}</span>
        <h1>{locale === 'en' ? 'Prompt library' : 'Biblioteca de prompts'}</h1>
        <p>
          {locale === 'en'
            ? `${totalPrompts} prompts written to copy, paste and fill in the blanks between brackets. They're split into blocks: open only the one you need. If you're not sure which one, search for a word.`
            : `${totalPrompts} prompts escritos para copiar, pegar y rellenar los huecos entre corchetes. Están repartidos en bloques: abre solo el que necesites. Si no sabes en cuál mirar, busca por una palabra.`}
        </p>
      </div>

      <section className="st-prompt-steps" aria-label={locale === 'en' ? 'Recommended workflow for using prompts' : 'Flujo recomendado para usar prompts'}>
        <div><span>01</span><strong>{locale === 'en' ? 'Open a block' : 'Abre un bloque'}</strong><small>{locale === 'en' ? 'Each block covers one thing: a task or a tool. Click the title to expand it.' : 'Cada bloque va de una cosa: una tarea o una herramienta. Pulsa el título para desplegarlo.'}</small></div>
        <div><span>02</span><strong>{locale === 'en' ? 'Search if unsure' : 'Busca si dudas'}</strong><small>{locale === 'en' ? 'Type any word: email, error, privacy, video, RAG, web, proposal...' : 'Escribe cualquier palabra: correo, error, privacidad, vídeo, RAG, web, propuesta...'}</small></div>
        <div><span>03</span><strong>{locale === 'en' ? 'Save evidence' : 'Guarda evidencia'}</strong><small>{locale === 'en' ? 'Copy the prompt, fill in the brackets and save the useful result to My project.' : 'Copia el prompt, rellena corchetes y guarda el resultado útil en Mi proyecto.'}</small></div>
      </section>

      <section className="st-prompt-refine st-prompt-refine-top" aria-label={locale === 'en' ? 'Search the whole library' : 'Buscar en toda la biblioteca'}>
        <label className="st-prompt-refine-field">
          <span>{locale === 'en' ? 'Search the whole bank' : 'Buscar en todo el banco'}</span>
          <span className="st-piece-search">
            <Search size={13} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale === 'en' ? 'email, error, web, privacy, RAG, video...' : 'correo, error, web, privacidad, RAG, vídeo...'}
            />
          </span>
        </label>
        <label className="st-prompt-refine-field">
          <span>{locale === 'en' ? 'Tool or context' : 'Herramienta o contexto'}</span>
          <span className="st-prompt-tool-select">
            <select value={activeTool} onChange={(event) => setSelectedTool(event.target.value)}>
              <option value="all">{locale === 'en' ? `All tools (${totalPrompts})` : `Todas las herramientas (${totalPrompts})`}</option>
              {toolOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} ({allPromptEntries.filter(({ prompt }) => prompt.toolId === item.id).length})
                </option>
              ))}
            </select>
          </span>
        </label>
      </section>

      <section className="st-prompt-category-strip" aria-label={locale === 'en' ? 'Prompt categories' : 'Categorías de prompts'}>
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
              <small>{section.families.length} {locale === 'en' ? 'blocks' : 'bloques'} · {sectionCount} prompts</small>
            </button>
          )
        })}
      </section>

      <section className="st-prompt-workbench">
        <aside className="st-prompt-family-rail" aria-label={locale === 'en' ? 'Blocks in the selected category' : 'Bloques de la categoría seleccionada'}>
          <div className="st-prompt-family-head">
            <span className="st-kicker">{locale === 'en' ? 'Active category' : 'Categoría activa'}</span>
            <h2>{selectedSection?.title || 'Prompts'}</h2>
            <p>{selectedSection?.description || (locale === 'en' ? 'Pick a specific block to see only its prompts.' : 'Elige un bloque concreto para ver solo sus prompts.')}</p>
          </div>
          <div className="st-prompt-family-list">
            {(selectedSection?.families || []).map((family) => (
              <a
                key={family.id}
                href={`#/prompts/${encodeURIComponent(family.id)}`}
                className={`st-prompt-family-card${family.id === familia?.id ? ' on' : ''}`}
                onClick={() => selectFamily(family.id)}
              >
                <span>{family.source || family.sectionTitle || (locale === 'en' ? 'Institutional block' : 'Bloque institucional')}</span>
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
                <span className="st-kicker">{showingGlobalResults ? (locale === 'en' ? 'Results' : 'Resultados') : familia.sectionTitle || (locale === 'en' ? 'Selected block' : 'Bloque seleccionado')}</span>
                <h2>{showingGlobalResults ? (locale === 'en' ? 'Search results' : 'Resultados de búsqueda') : familia.title}</h2>
                <p>
                  {showingGlobalResults
                    ? (locale === 'en'
                      ? `Searching the whole library. ${activeTool !== 'all' ? `Active filter: ${toolOptions.find((item) => item.id === activeTool)?.label || activeTool}, ${exactToolCount} prompts available.` : 'You can combine free text and a tool.'}`
                      : `Se está buscando en toda la biblioteca. ${activeTool !== 'all' ? `Filtro activo: ${toolOptions.find((item) => item.id === activeTool)?.label || activeTool}, ${exactToolCount} prompts disponibles.` : 'Puedes combinar texto libre y herramienta.'}`)
                    : familia.intro}
                </p>
                <p className="st-prompt-model"><Lightbulb size={12} /> {familia.model}</p>
              </section>

              {!showingGlobalResults && (
                <div className="st-matters">
                  <div className="st-matters-yes">
                    <strong><Check size={11} /> {locale === 'en' ? 'This it does well' : 'Esto sí lo hace bien'}</strong>
                    <ul>{familia.canDo.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div className="st-matters-no">
                    <strong><Ban size={11} /> {locale === 'en' ? "This it doesn't do" : 'Esto no lo hace'}</strong>
                    <ul>{familia.cantDo.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>
              )}

              <div className="st-section-head">
                <h2>{showingGlobalResults ? (locale === 'en' ? 'Prompts found' : 'Prompts encontrados') : (locale === 'en' ? `The ${encontrados.length} prompts in this block` : `Los ${encontrados.length} prompts de este bloque`)}</h2>
                <span>{quedan > 0 ? (locale === 'en' ? `Showing ${visibles.length} of ${encontrados.length}` : `Viendo ${visibles.length} de ${encontrados.length}`) : `${encontrados.length} prompts`}</span>
              </div>

              <div className="st-prompt-list">
                {visibles.map(({ prompt, family }) => (
                  <PromptCard key={`${family.id}-${prompt.id || prompt.name}`} prompt={prompt} familyTitle={family.title} />
                ))}
              </div>

              {quedan > 0 && (
                <button type="button" className="st-prompt-mas" onClick={() => setCuantos((v) => v + 12)}>
                  {locale === 'en' ? `View ${Math.min(12, quedan)} more prompts · ${quedan} left` : `Ver ${Math.min(12, quedan)} prompts más · quedan ${quedan}`}
                </button>
              )}

              {!visibles.length && (
                <div className="st-empty">
                  <h2>{locale === 'en' ? "I can't find anything for that search" : 'No encuentro nada con esa búsqueda'}</h2>
                  <p>{locale === 'en' ? 'Try a broader word: error, data, email, project, web, cost, security or delivery.' : 'Prueba con una palabra más amplia: error, datos, correo, proyecto, web, coste, seguridad o entrega.'}</p>
                </div>
              )}

              {!showingGlobalResults && familia.tips?.length > 0 && (
                <section className="st-block st-block-ejemplo">
                  <h3><Lightbulb size={15} /> {locale === 'en' ? 'Three things that change the result' : 'Tres cosas que cambian el resultado'}</h3>
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
