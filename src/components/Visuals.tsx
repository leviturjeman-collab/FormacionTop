import { useMemo, useState } from 'react'
import { ArrowDownUp, CircleCheck, Circle, FileCode, Folder, RotateCw, Sparkles, User, Wrench } from 'lucide-react'
import type { BarsPiece, ChatPiece, ChecklistPiece, FileTreePiece, FlashcardsPiece } from '../types'
import { useLocale } from '../i18n'

/* ------------------------------------------------------------------ *
 * ÁRBOL DE ARCHIVOS                                                   *
 * ------------------------------------------------------------------ */

/** La estructura de carpetas del proyecto, sacada de las rutas de la lección. */
export function FileTree({ piece }: { piece: FileTreePiece }) {
  const locale = useLocale()
  const [copied, setCopied] = useState<string | null>(null)

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <span className="st-piece-badge">{piece.nodes.filter((node) => node.isFile).length} {locale === 'en' ? 'files' : 'archivos'}</span>
      </header>

      <ul className="st-tree">
        {piece.nodes.map((node, index) => (
          <li key={index} style={{ paddingLeft: `${node.depth * 18 + 16}px` }} className={node.isFile ? 'file' : 'dir'}>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(node.path).then(() => {
                  setCopied(node.path)
                  window.setTimeout(() => setCopied(null), 1400)
                }, () => undefined)
              }}
              title={locale === 'en' ? `Copy ${node.path}` : `Copiar ${node.path}`}
            >
              {node.isFile ? <FileCode size={12} /> : <Folder size={12} />}
              <code>{node.name}</code>
              {copied === node.path && <em>{locale === 'en' ? 'copied' : 'copiado'}</em>}
            </button>
          </li>
        ))}
      </ul>
    </figure>
  )
}

/* ------------------------------------------------------------------ *
 * CHECKLIST                                                           *
 * ------------------------------------------------------------------ */

export function Checklist({ piece }: { piece: ChecklistPiece }) {
  const [done, setDone] = useState<number[]>([])
  const percent = Math.round((done.length / piece.items.length) * 100)

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <span className="st-piece-badge" data-full={percent === 100 ? 'true' : undefined}>
          {done.length}/{piece.items.length}
        </span>
      </header>

      <div className="st-checkbar"><span style={{ width: `${percent}%` }} /></div>

      <ul className="st-checkitems">
        {piece.items.map((item, index) => (
          <li key={index}>
            <button
              type="button"
              className={done.includes(index) ? 'on' : ''}
              onClick={() => setDone((current) =>
                current.includes(index) ? current.filter((value) => value !== index) : [...current, index],
              )}
              aria-pressed={done.includes(index)}
            >
              {done.includes(index) ? <CircleCheck size={14} /> : <Circle size={14} />}
              <span>{item}</span>
            </button>
          </li>
        ))}
      </ul>
    </figure>
  )
}

/* ------------------------------------------------------------------ *
 * BARRAS COMPARATIVAS                                                 *
 * ------------------------------------------------------------------ */

export function Bars({ piece }: { piece: BarsPiece }) {
  const locale = useLocale()
  const [sorted, setSorted] = useState(false)
  const items = useMemo(
    () => (sorted ? [...piece.items].sort((a, b) => b.value - a.value) : piece.items),
    [piece.items, sorted],
  )

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <button type="button" className="st-btn-ghost" onClick={() => setSorted((value) => !value)}>
          <ArrowDownUp size={13} />
          {locale === 'en' ? (sorted ? 'Original order' : 'Sort') : (sorted ? 'Orden original' : 'Ordenar')}
        </button>
      </header>

      <ul className="st-bars">
        {items.map((item) => (
          <li key={item.label}>
            <span className="st-bar-label">{item.label}</span>
            <span className="st-bar-track"><b style={{ width: `${Math.max(2, item.percent)}%` }} /></span>
            <span className="st-bar-value">{item.display}</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}

/* ------------------------------------------------------------------ *
 * TARJETAS DE REPASO                                                  *
 * ------------------------------------------------------------------ */

export function Flashcards({ piece }: { piece: FlashcardsPiece }) {
  const locale = useLocale()
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = piece.cards[index]

  const move = (delta: number) => {
    setFlipped(false)
    setIndex((current) => (current + delta + piece.cards.length) % piece.cards.length)
  }

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <span className="st-piece-badge">{index + 1} / {piece.cards.length}</span>
      </header>

      <div className="st-flash">
        <button type="button" className={`st-flash-card${flipped ? ' flipped' : ''}`} onClick={() => setFlipped((value) => !value)}>
          {flipped ? (
            <>
              <em>{locale === 'en' ? 'What it means' : 'Qué significa'}</em>
              <p>{card.meaning}</p>
            </>
          ) : (
            <>
              <em>{locale === 'en' ? 'Explain it out loud' : 'Explícalo en voz alta'}</em>
              <strong>{card.term}</strong>
              <span><RotateCw size={12} /> {locale === 'en' ? 'Tap to check' : 'Pulsa para comprobar'}</span>
            </>
          )}
        </button>

        <div className="st-flash-nav">
          <button type="button" className="st-btn-ghost" onClick={() => move(-1)}>{locale === 'en' ? 'Previous' : 'Anterior'}</button>
          <button type="button" className="st-btn-ghost" onClick={() => move(1)}>{locale === 'en' ? 'Next' : 'Siguiente'}</button>
        </div>
      </div>
    </figure>
  )
}

/* ------------------------------------------------------------------ *
 * CONVERSACIÓN                                                        *
 * ------------------------------------------------------------------ */

function roleFor(locale: 'es' | 'en') {
  return locale === 'en'
    ? {
        sistema: { icon: Wrench, label: 'System instructions' },
        usuario: { icon: User, label: 'You' },
        asistente: { icon: Sparkles, label: 'The model' },
      }
    : {
        sistema: { icon: Wrench, label: 'Instrucciones del sistema' },
        usuario: { icon: User, label: 'Tú' },
        asistente: { icon: Sparkles, label: 'El modelo' },
      }
}

export function Chat({ piece }: { piece: ChatPiece }) {
  const locale = useLocale()
  const ROLE = roleFor(locale)
  const [shown, setShown] = useState(2)

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        {shown < piece.turns.length && (
          <button type="button" className="st-btn-ghost" onClick={() => setShown((value) => value + 1)}>
            {locale === 'en' ? 'Next turn' : 'Siguiente turno'}
          </button>
        )}
      </header>

      <div className="st-chat">
        {piece.turns.slice(0, shown).map((turn, index) => {
          const meta = ROLE[turn.role as keyof typeof ROLE] || ROLE.usuario
          const Icon = meta.icon
          return (
            <div key={index} className={`st-turn role-${turn.role}`}>
              <span className="st-turn-role"><Icon size={11} /> {meta.label}</span>
              <p>{turn.text}</p>
            </div>
          )
        })}
        {shown >= piece.turns.length && (
          <p className="st-chat-end">
            {locale === 'en'
              ? 'End of the conversation. Notice the turn where it stops guessing and starts checking.'
              : 'Fin de la conversación. Fíjate en el turno donde deja de adivinar y empieza a comprobar.'}
          </p>
        )}
      </div>
    </figure>
  )
}
