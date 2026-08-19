import { useMemo, useState } from 'react'
import { Ban, Check, Copy, Lightbulb, Search, Sparkles } from 'lucide-react'
import type { PromptFamily } from '../types'
import { useCourse } from '../course'

/**
 * Biblioteca de prompts.
 *
 * Prompts escritos para copiar y pegar en la caja de texto de ChatGPT, Claude
 * o Gemini. Cada uno dice cuándo se usa, qué hay que sustituir, qué te va a
 * devolver y qué hacer después con esa respuesta.
 */
function PromptCard({ prompt }: { prompt: PromptFamily['prompts'][number] }) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <article className={`st-prompt${open ? ' open' : ''}`}>
      <button type="button" className="st-prompt-head" onClick={() => setOpen((value) => !value)}>
        <div>
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
            <pre>{prompt.prompt}</pre>
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
        </div>
      )}
    </article>
  )
}

export default function Prompts({ familyId }: { familyId?: string }) {
  const course = useCourse()
  const familias = course.prompts || []
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(familyId || familias[0]?.id)

  const familia = familias.find((item) => item.id === active) || familias[0]

  const encontrados = useMemo(() => {
    if (!familia) return []
    const needle = query.trim().toLowerCase()
    if (!needle) return familia.prompts
    return familia.prompts.filter((item) =>
      `${item.name} ${item.when} ${item.prompt}`.toLowerCase().includes(needle),
    )
  }, [familia, query])

  if (!familias.length) {
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
          Prompts escritos para pegarlos tal cual en ChatGPT, Claude o Gemini. Cada uno te dice cuándo usarlo,
          qué tienes que cambiar y qué esperar de vuelta. No hace falta que sepas programar: escribe y pega.
        </p>
      </div>

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
            {encontrados.map((item) => <PromptCard key={item.name} prompt={item} />)}
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
