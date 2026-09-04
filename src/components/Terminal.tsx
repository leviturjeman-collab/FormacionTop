import { useEffect, useRef, useState } from 'react'
import { Play, TriangleAlert } from 'lucide-react'
import type { TerminalPiece } from '../types'

interface Line {
  kind: 'command' | 'output' | 'error' | 'note'
  text: string
}

/**
 * Terminal simulada.
 *
 * El alumno pulsa comandos ya preparados y ve la salida que debería obtener.
 * No se ejecuta nada: es una maqueta para reconocer una salida correcta antes
 * de tocar su propia máquina.
 */
export default function Terminal({ piece }: { piece: TerminalPiece }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: 'note', text: 'Simulación. Aquí no se ejecuta nada en tu ordenador.' },
  ])
  const [typing, setTyping] = useState(false)
  const [doneCommands, setDoneCommands] = useState<string[]>([])
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  const run = (command: string) => {
    if (!command || typing) return

    const step = piece.steps.find((item) => item.command === command)
    if (!step) return

    setLines((current) => [...current, { kind: 'command', text: command }])
    setTyping(true)

    window.setTimeout(() => {
      const output = step.output || '(sin salida: este comando no imprime nada cuando funciona)'
      setLines((current) => [
        ...current,
        { kind: 'output', text: output },
        ...(step.note ? [{ kind: 'note' as const, text: step.note }] : []),
      ])
      setDoneCommands((current) => (current.includes(step.command) ? current : [...current, step.command]))
      setTyping(false)
  }, 420)
  }

  const progress = Math.round((doneCommands.length / piece.steps.length) * 100)
  const caption = piece.caption
    .replace(/Escribe el comando o p[uú]lsalo en la lista:?/i, 'Pulsa un comando de la lista:')
    .replace(/escribe el comando/i, 'pulsa un comando')

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{caption}</p>
        </div>
        <span className="st-piece-badge">{doneCommands.length}/{piece.steps.length} probados</span>
      </header>

      <div className="st-term-grid">
        <div className="st-term-window">
          <div className="st-term-bar">
            <i style={{ background: "#ff5f57" }} />
            <i style={{ background: "#febc2e" }} />
            <i style={{ background: "#28c840" }} />
            <em>{piece.prompt.replace(/\s*\$$/, '')} — simulación</em>
          </div>
          <div className="st-term-body" ref={bodyRef}>
            {lines.map((line, index) => (
              <pre key={index} className={`st-term-line ${line.kind === 'command' ? 'cmd' : line.kind === 'error' ? 'err' : line.kind === 'note' ? 'note' : ''}`}>
                {line.kind === 'command' ? `${piece.prompt} ${line.text}` : line.text}
              </pre>
            ))}
            {typing && <pre className="st-term-line">▍</pre>}
            <div className="st-term-input st-term-input-readonly">
              <span>{piece.prompt}</span>
              <code>Elige un comando de la lista</code>
            </div>
          </div>
        </div>

        <aside className="st-term-list">
          <h5>Comandos de esta lección</h5>
          <ol>
            {piece.steps.map((step) => (
              <li key={step.command}>
                <button
                  type="button"
                  className={doneCommands.includes(step.command) ? 'done' : ''}
                  onClick={() => run(step.command)}
                  disabled={typing}
                >
                  <Play size={11} />
                  <code>{step.command}</code>
                </button>
                {step.note && (
                  <span className="st-term-warn">
                    <TriangleAlert size={12} /> {step.note}
                  </span>
                )}
              </li>
            ))}
          </ol>
          <div className="st-term-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <span style={{ width: `${progress}%` }} />
          </div>
        </aside>
      </div>
    </figure>
  )
}
