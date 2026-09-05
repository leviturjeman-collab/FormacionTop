import { copyText } from '../clipboard'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { AnatomyPiece } from '../types'
import { useLocale } from '../i18n'

/**
 * Anatomía del código.
 *
 * El código real de la lección con sus líneas numeradas y una lista de
 * anotaciones al lado. Al pasar por una anotación se resalta su línea, así que
 * el alumno ve exactamente de qué se está hablando.
 */
const KIND_LABEL_ES: Record<string, string> = {
  nota: 'Comentario',
  import: 'Dependencia',
  def: 'Definición',
  decision: 'Bifurcación',
  bucle: 'Repetición',
  error: 'Errores',
  salida: 'Salida',
  secreto: 'Secreto',
  log: 'Registro',
  campo: 'Campo',
}

const KIND_LABEL_EN: Record<string, string> = {
  nota: 'Comment',
  import: 'Dependency',
  def: 'Definition',
  decision: 'Branch',
  bucle: 'Loop',
  error: 'Errors',
  salida: 'Output',
  secreto: 'Secret',
  log: 'Log',
  campo: 'Field',
}

export default function Anatomy({ piece }: { piece: AnatomyPiece }) {
  const locale = useLocale()
  const KIND_LABEL = locale === 'en' ? KIND_LABEL_EN : KIND_LABEL_ES
  const [active, setActive] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const lines = piece.code.split('\n')

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <button
          type="button"
          className="st-btn-ghost"
          onClick={() => {
            copyText(piece.code).then(
              () => {
                setCopied(true)
                window.setTimeout(() => setCopied(false), 1600)
              },
              () => setCopied(false),
            )
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? (locale === 'en' ? 'Copied' : 'Copiado') : (locale === 'en' ? 'Copy code' : 'Copiar el código')}
        </button>
      </header>

      <div className="st-anatomy">
        <div className="st-anatomy-code">
          {lines.map((line, index) => {
            const number = index + 1
            const note = piece.notes.find((item) => item.line === number)
            return (
              <div
                key={index}
                className={`st-anatomy-line${active === number ? ' on' : ''}${note ? ' marked' : ''}`}
                onMouseEnter={() => note && setActive(number)}
                onMouseLeave={() => note && setActive(null)}
              >
                <span className="st-anatomy-number">{number}</span>
                <code>{line || ' '}</code>
              </div>
            )
          })}
        </div>

        <ol className="st-anatomy-notes">
          {piece.notes.map((note) => (
            <li
              key={note.line}
              className={active === note.line ? 'on' : ''}
              onMouseEnter={() => setActive(note.line)}
              onMouseLeave={() => setActive(null)}
            >
              <button type="button" onClick={() => setActive(active === note.line ? null : note.line)}>
                <span className={`st-anatomy-tag kind-${note.kind}`}>{KIND_LABEL[note.kind] || note.kind}</span>
                <em>{locale === 'en' ? `line ${note.line}` : `línea ${note.line}`}</em>
                <p>{note.text}</p>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  )
}
