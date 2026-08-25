import { useState } from 'react'
import {
  ArrowRight, Check, ChevronRight, CircleDot, Play, X,
} from 'lucide-react'
import type {
  BeforeAfterPiece, CanvasPiece, DataFlowPiece, DecisionPiece, ScreenMapPiece,
} from '../types'

/* ------------------------------------------------------------------ *
 * LIENZO DE NODOS                                                     *
 * ------------------------------------------------------------------ */

/**
 * El lienzo tal y como se ve en n8n, Make o Zapier: cajas conectadas por
 * flechas, en filas. Se pulsa una caja y se abre lo que hace, qué recibe y
 * qué devuelve.
 *
 * Existe porque un diagrama de flujo genérico no enseña lo que hay que
 * aprender aquí: que cada caja tiene una entrada, una salida y una
 * configuración, y que el trabajo consiste en mirar esas tres cosas.
 */
export function Canvas({ piece }: { piece: CanvasPiece }) {
  const [open, setOpen] = useState<number | null>(0)
  const abierto = open !== null ? piece.nodes[open] : null

  return (
    <figure className="st-piece st-canvas">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <span className="st-piece-badge">{piece.nodes.length} nodos</span>
      </header>

      <div className="st-canvas-track" role="list">
        {piece.nodes.map((node, index) => (
          <div className="st-canvas-slot" key={node.label} role="listitem">
            <button
              className={`st-canvas-node${open === index ? ' open' : ''}${node.role ? ` role-${node.role}` : ''}`}
              onClick={() => setOpen(open === index ? null : index)}
              aria-expanded={open === index}
            >
              <span className="st-canvas-kind">{node.kind}</span>
              <strong>{node.label}</strong>
              {node.note && <em>{node.note}</em>}
            </button>
            {index < piece.nodes.length - 1 && (
              <ArrowRight className="st-canvas-arrow" size={13} aria-hidden />
            )}
          </div>
        ))}
      </div>

      {abierto && (
        <div className="st-canvas-detail">
          <h5>{abierto.label}</h5>
          <p>{abierto.does}</p>
          <dl>
            <div><dt>Recibe</dt><dd>{abierto.input}</dd></div>
            <div><dt>Devuelve</dt><dd>{abierto.output}</dd></div>
            {abierto.breaks && <div className="breaks"><dt>Se rompe si</dt><dd>{abierto.breaks}</dd></div>}
          </dl>
        </div>
      )}
    </figure>
  )
}

/* ------------------------------------------------------------------ *
 * CÓMO VIAJAN LOS DATOS                                               *
 * ------------------------------------------------------------------ */

/**
 * Fichas que entran en una caja y salen cambiadas, con el número de fichas a
 * cada lado. Es el concepto que más cuesta y el que menos se dibuja: que un
 * paso puede recibir cuatro elementos y devolver dos, o recibir uno y
 * devolver cincuenta.
 */
export function DataFlow({ piece }: { piece: DataFlowPiece }) {
  const [paso, setPaso] = useState(0)
  const actual = piece.steps[paso]

  return (
    <figure className="st-piece st-dataflow">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <span className="st-piece-badge">paso {paso + 1} de {piece.steps.length}</span>
      </header>

      <div className="st-dataflow-stage">
        <div className="st-dataflow-side">
          <span className="st-dataflow-label">Entran</span>
          <div className="st-dataflow-items">
            {Array.from({ length: Math.min(actual.in, 8) }).map((unused, i) => (
              <span className="st-dataflow-item" key={i} />
            ))}
          </div>
          <b>{actual.in}</b>
        </div>

        <div className="st-dataflow-box">
          <strong>{actual.label}</strong>
          <span>{actual.does}</span>
        </div>

        <div className="st-dataflow-side">
          <span className="st-dataflow-label">Salen</span>
          <div className="st-dataflow-items">
            {Array.from({ length: Math.min(actual.out, 8) }).map((unused, i) => (
              <span className="st-dataflow-item out" key={i} />
            ))}
          </div>
          <b>{actual.out}</b>
        </div>
      </div>

      {actual.why && <p className="st-dataflow-why">{actual.why}</p>}

      <div className="st-dataflow-nav">
        {piece.steps.map((step, i) => (
          <button
            key={step.label}
            className={i === paso ? 'on' : ''}
            onClick={() => setPaso(i)}
            aria-label={`Paso ${i + 1}: ${step.label}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </figure>
  )
}

/* ------------------------------------------------------------------ *
 * ÁRBOL DE DECISIÓN                                                   *
 * ------------------------------------------------------------------ */

/**
 * Una pregunta con dos o tres salidas, y cada salida lleva a su consecuencia.
 * Sirve para las decisiones que en el curso se toman una vez y condicionan
 * todo lo demás: qué herramienta, qué plan, dónde alojarlo.
 */
export function Decision({ piece }: { piece: DecisionPiece }) {
  const [elegido, setElegido] = useState<number | null>(null)

  return (
    <figure className="st-piece st-decision">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
      </header>

      <p className="st-decision-q">{piece.question}</p>

      <div className="st-decision-options">
        {piece.branches.map((branch, index) => (
          <button
            key={branch.answer}
            className={`st-decision-option${elegido === index ? ' on' : ''}`}
            onClick={() => setElegido(elegido === index ? null : index)}
            aria-expanded={elegido === index}
          >
            <ChevronRight size={12} aria-hidden />
            <span>{branch.answer}</span>
          </button>
        ))}
      </div>

      {elegido !== null && (
        <div className="st-decision-result">
          <strong>{piece.branches[elegido].then}</strong>
          <p>{piece.branches[elegido].why}</p>
          {piece.branches[elegido].cost && (
            <span className="st-decision-cost">{piece.branches[elegido].cost}</span>
          )}
        </div>
      )}
    </figure>
  )
}

/* ------------------------------------------------------------------ *
 * MAPA DE PANTALLA                                                    *
 * ------------------------------------------------------------------ */

/**
 * Las zonas de una pantalla, numeradas, con lo que hace cada una. Sustituye a
 * la captura: no envejece cuando la herramienta cambia de color y se lee igual
 * de bien.
 */
export function ScreenMap({ piece }: { piece: ScreenMapPiece }) {
  const [zona, setZona] = useState(0)

  return (
    <figure className="st-piece st-screenmap">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <span className="st-piece-badge">{piece.areas.length} zonas</span>
      </header>

      <div className="st-screenmap-frame">
        {piece.areas.map((area, index) => (
          <button
            key={area.name}
            className={`st-screenmap-area area-${area.place}${zona === index ? ' on' : ''}`}
            onClick={() => setZona(index)}
            aria-label={area.name}
          >
            <span className="st-screenmap-num">{index + 1}</span>
            <span className="st-screenmap-name">{area.name}</span>
          </button>
        ))}
      </div>

      <div className="st-screenmap-detail">
        <strong>{zona + 1}. {piece.areas[zona].name}</strong>
        <p>{piece.areas[zona].what}</p>
        {piece.areas[zona].tip && <p className="st-screenmap-tip">{piece.areas[zona].tip}</p>}
      </div>
    </figure>
  )
}

/* ------------------------------------------------------------------ *
 * ANTES Y DESPUÉS                                                     *
 * ------------------------------------------------------------------ */

/**
 * Dos columnas enfrentadas, línea a línea. Se usa para enseñar el cambio
 * concreto que produce lo que se acaba de aprender: el proceso antes y
 * después, el prompt antes y después, el flujo antes y después.
 */
export function BeforeAfter({ piece }: { piece: BeforeAfterPiece }) {
  return (
    <figure className="st-piece st-beforeafter">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
      </header>

      <div className="st-ba-grid">
        <div className="st-ba-col before">
          <h5><X size={12} aria-hidden /> {piece.beforeLabel || 'Antes'}</h5>
          <ul>
            {piece.rows.map((row) => (
              <li key={row.before}><CircleDot size={9} aria-hidden />{row.before}</li>
            ))}
          </ul>
        </div>
        <div className="st-ba-col after">
          <h5><Check size={12} aria-hidden /> {piece.afterLabel || 'Después'}</h5>
          <ul>
            {piece.rows.map((row) => (
              <li key={row.after}><Play size={9} aria-hidden />{row.after}</li>
            ))}
          </ul>
        </div>
      </div>

      {piece.gain && <p className="st-ba-gain">{piece.gain}</p>}
    </figure>
  )
}
