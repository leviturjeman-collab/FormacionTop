import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import type { Part } from '../types'

/**
 * Contenido de una sección, con su forma real.
 *
 * Los párrafos son párrafos, las listas son listas, el código es código y las
 * tablas son tablas. Nada se aplasta en un bloque de texto corrido.
 */

export function Code({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="st-code">
      {lang && lang !== 'text' && <em>{lang}</em>}
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(code).then(
            () => {
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1600)
            },
            () => setCopied(false),
          )
        }}
      >
        {copied ? <Check size={11} /> : <Copy size={11} />}
        {copied ? 'Copiado' : 'Copiar'}
      </button>
      <pre><code>{code}</code></pre>
    </div>
  )
}

export default function Parts({ parts }: { parts: Part[] }) {
  return (
    <>
      {parts.map((part, index) => {
        switch (part.type) {
          case 'p':
            return <p key={index} className="st-part-text">{part.text}</p>

          case 'sub':
            return <h4 key={index} className="st-part-sub">{part.text}</h4>

          case 'ul':
            return (
              <ul key={index} className="st-part-list">
                {(part.items || []).map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
              </ul>
            )

          case 'ol':
            return (
              <ol key={index} className="st-part-ordered">
                {(part.items || []).map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <span>{itemIndex + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            )

          case 'code':
            return <Code key={index} code={part.code || ''} lang={part.lang} />

          case 'table':
            return (
              <div key={index} className="st-table">
                <table>
                  <thead>
                    <tr>{(part.header || []).map((cell, cellIndex) => <th key={cellIndex}>{cell || '—'}</th>)}</tr>
                  </thead>
                  <tbody>
                    {(part.rows || []).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {(part.header || []).map((_, cellIndex) => <td key={cellIndex}>{row[cellIndex] || '—'}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

          default:
            return null
        }
      })}
    </>
  )
}
