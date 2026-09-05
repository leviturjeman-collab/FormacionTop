import { tabKeys } from './tabs'
import { useEffect, useState, useId } from 'react'
import { CircleCheck, TriangleAlert } from 'lucide-react'
import type { Block } from '../types'
import { Code } from './Parts'
import { useLocale } from '../i18n'

const KEY = 'academia.sistema'

/** Detecta el sistema del alumno para abrir su pestaña por defecto. */
function detectOs(): string {
  let stored: string | null = null
  try { stored = localStorage.getItem(KEY) } catch { /* Use browser detection when storage is unavailable. */ }
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
  const locale = useLocale()
  const tabId = useId()
  const [os, setOs] = useState(detectOs)
  const variants = block.variants || []

  useEffect(() => { try { localStorage.setItem(KEY, os) } catch { /* Preference remains in memory. */ } }, [os])

  const current = variants.find((item) => item.os === os) || variants[0]
  if (!current) return null

  return (
    <section className="st-block st-block-instalar">
      <h3>{block.title}</h3>
      {block.text && <p>{block.text}</p>}

      <div className="st-os-tabs" role="tablist" aria-label={locale === 'en' ? 'Operating system' : 'Sistema operativo'}>
        {variants.map((item) => (
          <button
            key={item.os}
            type="button"
            id={`${tabId}-${item.os}`} aria-controls={`${tabId}-panel`} role="tab" onKeyDown={tabKeys}
            aria-selected={item.os === current.os} tabIndex={item.os === current.os ? 0 : -1}
            className={item.os === os ? 'on' : ''}
            onClick={() => setOs(item.os)}
          >
            {item.label}
          </button>
        ))}
        <em>{current.shell}</em>
      </div>

      <div role="tabpanel" id={`${tabId}-panel`} aria-labelledby={`${tabId}-${current.os}`}><Code code={current.code} lang={current.shell.toLowerCase()} /></div>

      {block.verify && (
        <p className="st-install-verify">
          <CircleCheck size={12} />
          <span><b>{locale === 'en' ? "It's working if:" : 'Está bien si:'}</b> {block.verify}</span>
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
          <strong>{locale === 'en' ? 'If something fails' : 'Si algo falla'}</strong>
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
