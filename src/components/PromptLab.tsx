import { tabKeys } from './tabs'
import { useState, useId } from 'react'
import { Check, Columns2, Sparkles, ThumbsDown, X } from 'lucide-react'
import type { PromptLabPiece } from '../types'
import { useLocale } from '../i18n'

/**
 * Laboratorio de prompts.
 *
 * Comparación lado a lado entre la petición floja y la profesional, con la
 * respuesta que produce cada una. Las respuestas están escritas de antemano:
 * no hay llamada a ninguna API ni hace falta ninguna clave.
 */
export default function PromptLab({ piece }: { piece: PromptLabPiece }) {
  const locale = useLocale()
  const tabId = useId()
  const [view, setView] = useState<'weak' | 'strong' | 'both'>('weak')

  const panel = (variant: 'weak' | 'strong') => {
    const data = variant === 'weak' ? piece.weak : piece.strong
    const points = variant === 'weak' ? piece.weak.problems : piece.strong.wins
    return (
      <article className={`st-lab-panel ${variant}`}>
        <header>
          <span className="st-lab-tag">
            {variant === 'weak' ? <ThumbsDown size={13} /> : <Sparkles size={13} />}
            {data.label}
          </span>
        </header>

        <section className="st-lab-block">
          <h6>{locale === 'en' ? 'What is written' : 'Lo que se escribe'}</h6>
          <pre className="st-lab-prompt">{data.prompt}</pre>
        </section>

        <section className="st-lab-block">
          <h6>{locale === 'en' ? 'What it returns' : 'Lo que devuelve'}</h6>
          <pre className="st-lab-response">{data.response}</pre>
        </section>

        <ul className="st-lab-points">
          {points.map((point) => (
            <li key={point}>
              {variant === 'weak' ? <X size={13} /> : <Check size={13} />}
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </article>
    )
  }

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <div className="st-piece-actions" role="tablist" aria-label={locale === 'en' ? 'Prompt comparison' : 'Comparación de prompts'}>
          <button type="button" id={`${tabId}-weak`} aria-controls={`${tabId}-panel`} role="tab" onKeyDown={tabKeys} aria-selected={view === 'weak'} tabIndex={view === 'weak' ? 0 : -1} className={`st-btn-ghost${view === 'weak' ? ' on' : ''}`} onClick={() => setView('weak')}>
            {piece.weak.label}
          </button>
          <button type="button" id={`${tabId}-strong`} aria-controls={`${tabId}-panel`} role="tab" onKeyDown={tabKeys} aria-selected={view === 'strong'} tabIndex={view === 'strong' ? 0 : -1} className={`st-btn-ghost${view === 'strong' ? ' on' : ''}`} onClick={() => setView('strong')}>
            {piece.strong.label}
          </button>
          <button type="button" id={`${tabId}-both`} aria-controls={`${tabId}-panel`} role="tab" onKeyDown={tabKeys} aria-selected={view === 'both'} tabIndex={view === 'both' ? 0 : -1} className={`st-btn-ghost${view === 'both' ? ' on' : ''}`} onClick={() => setView('both')}>
            <Columns2 size={15} />
            {locale === 'en' ? 'Compare' : 'Comparar'}
          </button>
        </div>
      </header>

      <div role="tabpanel" id={`${tabId}-panel`} aria-labelledby={`${tabId}-${view}`} className={`st-lab-grid${view === 'both' ? ' split' : ''}`}>
        {(view === 'weak' || view === 'both') && panel('weak')}
        {(view === 'strong' || view === 'both') && panel('strong')}
      </div>
    </figure>
  )
}
