import { useState } from 'react'
import { ArrowDown, Ban, Brain, Database, Filter, Play, Send, Shuffle, User, Wrench } from 'lucide-react'
import type { PipelinePiece } from '../types'
import { useLocale } from '../i18n'

/**
 * Tubería de trabajo.
 *
 * El dato entra por arriba y baja cambiando en cada estación. Es la forma
 * natural de un procedimiento y se lee mucho mejor que un diagrama de nodos
 * cuando los pasos van en orden.
 */
function shapesFor(locale: 'es' | 'en'): Record<string, { icon: typeof Play; label: string }> {
  return locale === 'en'
    ? {
        entrada: { icon: Play, label: 'Enters' },
        filtro: { icon: Filter, label: 'Is checked' },
        transforma: { icon: Shuffle, label: 'Is transformed' },
        decide: { icon: Brain, label: 'Is decided' },
        guarda: { icon: Database, label: 'Is stored' },
        envia: { icon: Send, label: 'Is sent' },
        persona: { icon: User, label: 'A person approves' },
        salida: { icon: Ban, label: 'Exits' },
        paso: { icon: Wrench, label: 'Step' },
      }
    : {
        entrada: { icon: Play, label: 'Entra' },
        filtro: { icon: Filter, label: 'Se comprueba' },
        transforma: { icon: Shuffle, label: 'Se transforma' },
        decide: { icon: Brain, label: 'Se decide' },
        guarda: { icon: Database, label: 'Se guarda' },
        envia: { icon: Send, label: 'Se envía' },
        persona: { icon: User, label: 'Aprueba una persona' },
        salida: { icon: Ban, label: 'Sale' },
        paso: { icon: Wrench, label: 'Paso' },
      }
}

export default function Pipeline({ piece }: { piece: PipelinePiece }) {
  const locale = useLocale()
  const SHAPES = shapesFor(locale)
  const [open, setOpen] = useState<number | null>(0)

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <span className="st-piece-badge">{piece.stations.length} {locale === 'en' ? 'stations' : 'estaciones'}</span>
      </header>

      <ol className="st-pipeline">
        {piece.stations.map((station, index) => {
          const shape = SHAPES[station.shape] || SHAPES.paso
          const Icon = shape.icon
          const isOpen = open === index
          return (
            <li key={index} className={`st-station shape-${station.shape}${isOpen ? ' on' : ''}`}>
              <button type="button" onClick={() => setOpen(isOpen ? null : index)} aria-expanded={isOpen}>
                <span className="st-station-icon"><Icon size={15} /></span>
                <span className="st-station-body">
                  <em>{shape.label}</em>
                  <strong>{station.label}</strong>
                </span>
                <span className="st-station-number">{station.order}</span>
              </button>

              {isOpen && station.detail && station.detail !== station.label && (
                <p className="st-station-detail">{station.detail}</p>
              )}

              {index < piece.stations.length - 1 && (
                <span className="st-station-arrow" aria-hidden="true"><ArrowDown size={13} /></span>
              )}
            </li>
          )
        })}
      </ol>
    </figure>
  )
}
