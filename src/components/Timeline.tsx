import { useState } from 'react'
import { AlertTriangle, Check, User } from 'lucide-react'
import type { TimelinePiece } from '../types'
import { useLocale } from '../i18n'

/**
 * Línea de tiempo de una ejecución.
 *
 * Muestra qué pasa, en qué orden y cuánto tarda cada parte, incluyendo dónde
 * puede fallar y dónde hace falta una persona. Sirve para que el alumno vea el
 * proceso como una secuencia con coste, no como una caja negra.
 */
export default function Timeline({ piece }: { piece: TimelinePiece }) {
  const locale = useLocale()
  const [open, setOpen] = useState<number | null>(0)

  const total = piece.steps.reduce((sum, step) => sum + step.ms, 0)

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <span className="st-piece-badge">{(total / 1000).toFixed(1)} s {locale === 'en' ? 'start to finish' : 'de principio a fin'}</span>
      </header>

      <div className="st-timeline">
        <div className="st-timeline-bar">
          {piece.steps.map((step, index) => (
            <button
              key={index}
              type="button"
              className={`st-timeline-slot risk-${step.risk}${open === index ? ' on' : ''}`}
              style={{ flexGrow: step.ms }}
              onClick={() => setOpen(open === index ? null : index)}
              title={`${step.label} · ${step.ms} ms`}
            >
              <span>{index + 1}</span>
            </button>
          ))}
        </div>

        <ol className="st-timeline-list">
          {piece.steps.map((step, index) => (
            <li key={index} className={open === index ? 'on' : ''}>
              <button type="button" onClick={() => setOpen(open === index ? null : index)}>
                <span className={`st-timeline-dot risk-${step.risk}`}>
                  {step.risk === 'humano' ? <User size={10} /> : step.risk === 'alto' ? <AlertTriangle size={10} /> : <Check size={10} />}
                </span>
                <strong>{step.label}</strong>
                <em>{step.ms >= 1000 ? `${(step.ms / 1000).toFixed(1)} s` : `${step.ms} ms`}</em>
                <b>{Math.round((step.ms / total) * 100)}%</b>
              </button>
              {open === index && (
                <div className="st-timeline-detail">
                  <p>{step.detail}</p>
                  {step.fails && <p className="st-timeline-fail"><AlertTriangle size={11} /> {locale === 'en' ? 'If it fails here:' : 'Si falla aquí:'} {step.fails}</p>}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>

      <p className="st-calc-note">{piece.note}</p>
    </figure>
  )
}
