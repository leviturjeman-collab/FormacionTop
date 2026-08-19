import { useEffect, useState } from 'react'
import { CircleCheck, TriangleAlert } from 'lucide-react'
import type { Block } from '../types'
import { Code } from './Parts'

const KEY = 'academia.sistema'

/** Detecta el sistema del alumno para abrir su pestaña por defecto. */
function detectOs(): string {
  const stored = localStorage.getItem(KEY)
  if (stored) return stored
  const agent = navigator.userAgent
  if (/Mac/i.test(agent)) return 'mac'
  if (/Linux|X11/i.test(agent) && !/Android/i.test(agent)) return 'linux'
  return 'windows'
}

/**
 * Bloque de instalación.
 *
 * Copiar, pegar y ejecutar. Una pestaña por sistema operativo, con el comando
 * de comprobación y los fallos típicos con su arreglo.
 */
export default function Install({ block }: { block: Block }) {
  const [os, setOs] = useState(detectOs)
  const variants = block.variants || []

  useEffect(() => localStorage.setItem(KEY, os), [os])

  const current = variants.find((item) => item.os === os) || variants[0]
  if (!current) return null

  return (
    <section className="st-block st-block-instalar">
      <h3>{block.title}</h3>
      {block.text && <p>{block.text}</p>}

      <div className="st-os-tabs" role="tablist" aria-label="Sistema operativo">
        {variants.map((item) => (
          <button
            key={item.os}
            type="button"
            role="tab"
            aria-selected={item.os === os}
            className={item.os === os ? 'on' : ''}
            onClick={() => setOs(item.os)}
          >
            {item.label}
          </button>
        ))}
        <em>{current.shell}</em>
      </div>

      <Code code={current.code} lang={current.shell.toLowerCase()} />

      {block.verify && (
        <p className="st-install-verify">
          <CircleCheck size={12} />
          <span><b>Está bien si:</b> {block.verify}</span>
        </p>
      )}

      {block.warning && (
        <p className="st-install-warning">
          <TriangleAlert size={12} />
          <span>{block.warning}</span>
        </p>
      )}

      {block.fails && block.fails.length > 0 && (
        <div className="st-install-fails">
          <strong>Si algo falla</strong>
          <dl>
            {block.fails.map(([problem, fix]) => (
              <div key={problem}>
                <dt>{problem}</dt>
                <dd>{fix}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  )
}
