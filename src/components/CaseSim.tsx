import { useState } from 'react'
import { AlertTriangle, CircleAlert, CircleCheck } from 'lucide-react'
import type { CasesPiece } from '../types'
import Parts from './Parts'
import { useLocale } from '../i18n'

const ICONS = { feliz: CircleCheck, ambiguo: CircleAlert, roto: AlertTriangle }

/**
 * Simulador de los tres casos de la lección.
 *
 * Los datos son los de esta lección concreta, así que el simulador es distinto
 * en cada una. El caso roto es el que enseña de verdad.
 */
export default function CaseSim({ piece }: { piece: CasesPiece }) {
  const locale = useLocale()
  const [active, setActive] = useState(piece.cases[0].id)
  const current = piece.cases.find((item) => item.id === active) || piece.cases[0]

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
      </header>

      <div className="st-cases">
        <div className="st-cases-tabs" role="tablist" aria-label={locale === 'en' ? 'Lesson cases' : 'Casos de la lección'}>
          {piece.cases.map((item) => {
            const Icon = ICONS[item.id as keyof typeof ICONS] || CircleCheck
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === active}
                className={`st-case-tab case-${item.id}${item.id === active ? ' on' : ''}`}
                onClick={() => setActive(item.id)}
              >
                <Icon size={14} />
                <strong>{item.label}</strong>
              </button>
            )
          })}
        </div>

        <div className={`st-case-body case-${current.id}`}>
          <p className="st-case-hint">{current.hint}</p>
          <Parts parts={current.parts} />
        </div>
      </div>
    </figure>
  )
}
