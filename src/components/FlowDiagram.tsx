import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, Pause, Play, RotateCcw } from 'lucide-react'
import type { FlowPiece } from '../types'
import { useLocale } from '../i18n'

const NODE_W = 178
const NODE_H = 74
const PAD = 42

/**
 * Diagrama de flujo interactivo.
 *
 * Cuando la lección tiene un workflow de n8n, los nodos y las conexiones son
 * los reales del archivo, colocados donde estaban en el lienzo original.
 * El alumno puede pulsar cada nodo o reproducir el recorrido en orden.
 */
export default function FlowDiagram({ piece }: { piece: FlowPiece }) {
  const locale = useLocale()
  const [selected, setSelected] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [cursor, setCursor] = useState(-1)
  const timer = useRef<number | null>(null)

  const layout = useMemo(() => {
    const xs = piece.nodes.map((node) => node.x)
    const ys = piece.nodes.map((node) => node.y)
    const minX = Math.min(...xs)
    const minY = Math.min(...ys)
    const spanX = Math.max(...xs) - minX || 1
    const spanY = Math.max(...ys) - minY || 1

    // Se normalizan las posiciones del lienzo original a una rejilla legible.
    const columns = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(piece.nodes.length))))
    const useSource = spanX > 100
    const positions = new Map<string, { x: number; y: number }>()

    piece.nodes.forEach((node, index) => {
      const x = useSource
        ? ((node.x - minX) / spanX) * (columns - 1) * (NODE_W + 62)
        : (index % columns) * (NODE_W + 62)
      const y = useSource
        ? ((node.y - minY) / spanY) * Math.max(1, Math.ceil(piece.nodes.length / columns) - 1) * (NODE_H + 58)
        : Math.floor(index / columns) * (NODE_H + 58)
      positions.set(node.id, { x: x + PAD, y: y + PAD })
    })

    // Se separan los nodos que caen encima de otro tras normalizar.
    const seen: { x: number; y: number }[] = []
    for (const node of piece.nodes) {
      const position = positions.get(node.id)!
      while (seen.some((item) => Math.abs(item.x - position.x) < NODE_W && Math.abs(item.y - position.y) < NODE_H)) {
        position.y += NODE_H + 22
      }
      seen.push({ ...position })
    }

    const width = Math.max(...[...positions.values()].map((item) => item.x)) + NODE_W + PAD
    const height = Math.max(...[...positions.values()].map((item) => item.y)) + NODE_H + PAD
    return { positions, width, height }
  }, [piece])

  useEffect(() => {
    if (!playing) return
    timer.current = window.setInterval(() => {
      setCursor((current) => {
        if (current + 1 >= piece.nodes.length) {
          setPlaying(false)
          return current
        }
        return current + 1
      })
    }, 1150)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [playing, piece.nodes.length])

  useEffect(() => {
    if (cursor >= 0 && piece.nodes[cursor]) setSelected(piece.nodes[cursor].id)
  }, [cursor, piece.nodes])

  const active = piece.nodes.find((node) => node.id === selected) || null
  const activeIndex = active ? piece.nodes.indexOf(active) : -1

  const edgePath = (from: string, to: string) => {
    const a = layout.positions.get(from)
    const b = layout.positions.get(to)
    if (!a || !b) return ''
    const x1 = a.x + NODE_W
    const y1 = a.y + NODE_H / 2
    const x2 = b.x
    const y2 = b.y + NODE_H / 2
    if (x2 <= x1 + 8) {
      // Conexión hacia atrás o hacia abajo: se dibuja rodeando por debajo.
      const drop = Math.max(y1, y2) + NODE_H * 0.9
      return `M ${x1} ${y1} C ${x1 + 50} ${y1}, ${x1 + 50} ${drop}, ${(x1 + x2) / 2} ${drop} C ${x2 - 50} ${drop}, ${x2 - 50} ${y2}, ${x2} ${y2}`
    }
    const mid = (x1 + x2) / 2
    return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`
  }

  const reset = () => {
    setPlaying(false)
    setCursor(-1)
    setSelected(null)
  }

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <div className="st-piece-actions">
          <button type="button" className="st-btn-ghost" onClick={() => { setPlaying((value) => !value); if (cursor < 0) setCursor(0) }}>
            {playing ? <Pause size={15} /> : <Play size={15} />}
            {playing
              ? (locale === 'en' ? 'Pause' : 'Pausar')
              : (locale === 'en' ? 'Walk through' : 'Recorrer')}
          </button>
          <button type="button" className="st-btn-ghost" onClick={reset}>
            <RotateCcw size={15} />
            {locale === 'en' ? 'Reset' : 'Reiniciar'}
          </button>
          {piece.download && (
            <a className="st-btn-ghost" href={piece.download} download>
              <Download size={15} />
              JSON
            </a>
          )}
        </div>
      </header>

      <div className="st-flow-canvas">
        <svg viewBox={`0 0 ${layout.width} ${layout.height}`} style={{ minWidth: Math.min(layout.width, 1100) }} role="img" aria-label={piece.title}>
          <defs>
            <marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>

          <g className="st-flow-edges">
            {piece.edges.map((edge, index) => {
              const fromIndex = piece.nodes.findIndex((node) => node.id === edge.from)
              const lit = cursor >= 0 && fromIndex >= 0 && fromIndex < cursor
              return (
                <path
                  key={`${edge.from}-${edge.to}-${index}`}
                  d={edgePath(edge.from, edge.to)}
                  className={`st-flow-edge${lit ? ' lit' : ''}${edge.branch > 0 ? ' branch' : ''}`}
                  markerEnd="url(#flow-arrow)"
                />
              )
            })}
          </g>

          <g className="st-flow-nodes">
            {piece.nodes.map((node, index) => {
              const position = layout.positions.get(node.id)!
              const isActive = node.id === selected
              const isPast = cursor >= 0 && index <= cursor
              return (
                <g
                  key={node.id}
                  transform={`translate(${position.x} ${position.y})`}
                  className={`st-flow-node role-${node.role}${isActive ? ' active' : ''}${isPast ? ' past' : ''}`}
                  onClick={() => { setPlaying(false); setSelected(node.id === selected ? null : node.id) }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelected(node.id === selected ? null : node.id)
                    }
                  }}
                >
                  <rect width={NODE_W} height={NODE_H} rx={13} />
                  <text className="st-flow-role" x={13} y={22}>{node.roleLabel || node.role}</text>
                  <text className="st-flow-label" x={13} y={46}>
                    {node.label.length > 24 ? `${node.label.slice(0, 23)}…` : node.label}
                  </text>
                  <text className="st-flow-index" x={NODE_W - 13} y={22} textAnchor="end">{index + 1}</text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      <figcaption className={"st-flow-detail"}>
        {active ? (
          <>
            <span className={`role-${active.role}`}>
              {activeIndex + 1}. {active.roleLabel || active.role}
            </span>
            <strong>{active.label}</strong>
            <p>{active.hint}</p>
            {active.type && <code >{active.type}</code>}
          </>
        ) : (
          <p >
            {locale === 'en'
              ? 'Click any node to see what it does and what to check inside. Or click "Walk through" to see it in order.'
              : 'Pulsa cualquier nodo para ver qué hace y qué revisar dentro. O pulsa «Recorrer» para verlo en orden.'}
          </p>
        )}
      </figcaption>
    </figure>
  )
}
