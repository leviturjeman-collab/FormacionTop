import { useEffect, useRef, useState } from 'react'
import { CornerDownLeft, TriangleAlert } from 'lucide-react'
import type { TerminalPiece } from '../types'

interface Line {
  kind: 'command' | 'output' | 'error' | 'note'
  text: string
}

/**
 * Terminal simulada.
 *
 * El alumno escribe el comando (o lo pulsa en la lista) y ve la salida que
 * debería obtener. No se ejecuta nada: es una maqueta para practicar el gesto
 * y reconocer una salida correcta antes de tocar su propia máquina.
 */
export default function Terminal({ piece }: { piece: TerminalPiece }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: 'note', text: 'Simulación. Aquí no se ejecuta nada en tu ordenador.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [doneCommands, setDoneCommands] = useState<string[]>([])
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines])

  const run = (raw: string) => {
    const command = raw.trim()
    if (!command || typing) return

    const step = piece.steps.find((item) => item.command === command)
      || piece.steps.find((item) => item.command.startsWith(command) || command.startsWith(item.command.split(' ').slice(0, 2).join(' ')))

    setLines((current) => [...current, { kind: 'command', text: command }])
    setInput('')
    setTyping(true)

    window.setTimeout(() => {
      if (!step) {
        setLines((current) => [
          ...current,
          { kind: 'error', text: `Ese comando no está en esta práctica.\nPrueba con uno de los de la derecha: son los que aparecen en esta lección.` },
        ])
        setTyping(false)
        return
      }
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

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <span className="st-piece-badge">{doneCommands.length}/{piece.steps.length} probados</span>
      </header>

      <div className="st-term-grid">
        <div className="st-term-window" onClick={() => inputRef.current?.focus()}>
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
            <form
              className="st-term-input"
              onSubmit={(event) => {
                event.preventDefault()
                run(input)
              }}
            >
              <span>{piece.prompt}</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="escribe un comando y pulsa intro"
                spellCheck={false}
                autoComplete="off"
                aria-label="Comando"
              />
              <button type="submit" aria-label="Ejecutar" disabled={typing}>
                <CornerDownLeft size={14} />
              </button>
            </form>
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
