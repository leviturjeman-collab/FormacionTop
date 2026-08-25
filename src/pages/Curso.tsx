import { useState } from 'react'
import {
  ArrowLeft, ArrowRight, Ban, Check, CheckCircle2, Circle, Clock, Copy,
  HelpCircle, Languages, Lightbulb, Quote, Scale, Sparkles,
 AlertTriangle } from 'lucide-react'
import type { CursoLesson } from '../types'
import { useCourse } from '../course'
import { href } from '../router'
import { store, useLessonProgress } from '../store'
import Notebook from '../components/Notebook'
import Piece from '../components/Piece'

/**
 * El programa curado: lecciones escritas a mano, en orden.
 *
 * Cada una es teoría corta y bien explicada, y después una guía de tareas que
 * el alumno va marcando, con el prompt exacto donde hace falta.
 */

function Prompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="st-task-prompt">
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(text).then(
            () => {
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1800)
            },
            () => setCopied(false),
          )
        }}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? 'Copiado' : 'Copiar y pegarlo en la IA'}
      </button>
      <pre>{text}</pre>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * ÍNDICE DEL CURSO                                                    *
 * ------------------------------------------------------------------ */

export function CursoIndice() {
  const course = useCourse()
  const lecciones = [...(course.curso || [])].sort((a, b) => a.number - b.number)

  if (!lecciones.length) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>El curso se está escribiendo</h2>
          <p>Las lecciones se están preparando. Vuelve en un rato.</p>
        </div>
      </div>
    )
  }

  // Las lecciones de itinerario se agrupan por herramienta; el resto, por área.
  const conHerramienta = lecciones.filter((item) => item.tool)
  const sueltas = lecciones.filter((item) => !item.tool)

  const porHerramienta = [...new Set(conHerramienta.map((item) => item.tool))].map((toolId) => {
    const pagina = course.toolPages.find((page) => page.id === toolId)
    return {
      id: toolId as string,
      label: pagina?.label || toolId,
      items: conHerramienta
        .filter((item) => item.tool === toolId)
        .sort((a, b) => (a.slot || 0) - (b.slot || 0)),
    }
  })

  const porArea = course.stages
    .map((stage) => ({ stage, items: sueltas.filter((item) => item.stageId === stage.id) }))
    .filter((group) => group.items.length)

  const totalMin = lecciones.reduce((sum, item) => sum + item.minutes, 0)

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">El curso</span>
        <h1>Tu programa, paso a paso</h1>
        <p>
          Empieza por la base común y avanza hacia un proyecto real. Cada lección mezcla explicación, una tarea
          concreta y una forma de comprobar que lo has entendido. Las especializaciones de herramientas aparecen
          aparte para que puedas elegirlas cuando sepas qué quieres construir. Son {Math.round(totalMin / 60)} horas aproximadas.
        </p>
      </div>

      <section className="st-program-guide">
        <div><span>01</span><strong>Entender</strong><small>Qué puede hacer la IA y dónde se equivoca.</small></div>
        <div><span>02</span><strong>Definir</strong><small>Qué problema quieres resolver y qué resultado esperas.</small></div>
        <div><span>03</span><strong>Construir</strong><small>Una primera versión pequeña y comprobable.</small></div>
        <div><span>04</span><strong>Entregar</strong><small>Pruebas, documentación, seguridad y siguiente versión.</small></div>
      </section>

      {porHerramienta.map(({ id, label, items }) => (
        <section key={id} className="st-curso-area">
          <div className="st-section-head">
            <div>
              <span className="st-kicker">Especialización opcional</span>
              <h2>{label}</h2>
            </div>
            <span>{items.length} de 20 lecciones</span>
          </div>

          <ol className="st-curso-list">
            {items.map((item) => (
              <li key={item.id}>
                <a href={href({ name: 'curso', lessonId: item.id })}>
                  <span className="st-curso-num">{String(item.slot || item.number).padStart(2, '0')}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.promise}</p>
                  </div>
                  <span className="st-curso-min"><Clock size={11} /> {item.minutes}′</span>
                  <ArrowRight size={14} />
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}

      {porArea.map(({ stage, items }) => (
        <section key={stage.id} className="st-curso-area">
          <div className="st-section-head">
            <div>
              <span className="st-kicker">{stage.number} · {stage.tagline}</span>
              <h2>{stage.title}</h2>
            </div>
            <span>{items.length} lecciones</span>
          </div>

          <ol className="st-curso-list">
            {items.map((item) => (
              <li key={item.id}>
                <a href={href({ name: 'curso', lessonId: item.id })}>
                  <span className="st-curso-num">{String(item.number).padStart(2, '0')}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.promise}</p>
                  </div>
                  <span className="st-curso-min"><Clock size={11} /> {item.minutes}′</span>
                  <ArrowRight size={14} />
                </a>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * UNA LECCIÓN                                                         *
 * ------------------------------------------------------------------ */

export function CursoLeccion({ lessonId }: { lessonId: string }) {
  const course = useCourse()
  const progress = useLessonProgress(`curso:${lessonId}`)
  const hechas = progress.checks.intermedio || []

  const lecciones = [...(course.curso || [])].sort((a, b) => a.number - b.number)
  const leccion = lecciones.find((item) => item.id === lessonId) as CursoLesson | undefined

  if (!leccion) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>Esa lección todavía no está</h2>
          <a className="st-btn" href={href({ name: 'curso' })}>Ver el curso</a>
        </div>
      </div>
    )
  }

  const posicion = lecciones.indexOf(leccion)
  const anterior = posicion > 0 ? lecciones[posicion - 1] : null
  const siguiente = posicion < lecciones.length - 1 ? lecciones[posicion + 1] : null
  const stage = course.stages.find((item) => item.id === leccion.stageId)
  const percent = Math.round((hechas.length / Math.max(1, leccion.tasks.length)) * 100)

  return (
    <article className="st-lesson">
      <header className="st-lesson-head">
        <span className="st-kicker">
          Lección {String(leccion.number).padStart(2, '0')}{stage ? ` · ${stage.title}` : ''}
        </span>
        <h1>{leccion.title}</h1>
        <p className="st-lesson-headline">{leccion.promise}</p>
        <div className="st-lesson-meta">
          <span><Clock size={11} /> {leccion.minutes} min</span>
          <span>{leccion.tasks.length} tareas</span>
          <span>{leccion.theory.length} apartados</span>
        </div>
      </header>

      <section className="st-curso-why">
        <Sparkles size={14} />
        <p>{leccion.why}</p>
      </section>

      <div className="st-blocks">
        {leccion.theory.map((part, index) => (
          <section key={index} className="st-block st-block-seccion">
            <h3><Lightbulb size={15} /> {part.title}</h3>
            <p className="st-part-text">{part.text}</p>
            {part.analogy && (
              <p className="st-guide-analogy"><Quote size={13} /> <span>{part.analogy}</span></p>
            )}
            {part.example && (
              <p className="st-curso-example"><b>Por ejemplo:</b> {part.example}</p>
            )}
            {/* El dibujo va pegado al concepto que explica, no en un anexo. */}
            {part.visual && <Piece piece={part.visual} />}
          </section>
        ))}
      </div>

      {leccion.words?.length > 0 && (
        <section className="st-block st-block-palabras">
          <h3><Languages size={15} /> Las palabras que vas a leer, en cristiano</h3>
          <dl className="st-words">
            {leccion.words.map(([term, meaning]) => (
              <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>
            ))}
          </dl>
        </section>
      )}

      <section className="st-tasks">
        <div className="st-tasks-head">
          <div>
            <span className="st-kicker">Tu turno</span>
            <h2>Hazlo paso a paso</h2>
          </div>
          <span className="st-piece-badge" data-full={percent === 100 ? 'true' : undefined}>
            {hechas.length}/{leccion.tasks.length} tareas
          </span>
        </div>
        <div className="st-checkbar"><span style={{ width: `${percent}%` }} /></div>

        <ol className="st-task-list">
          {leccion.tasks.map((task, index) => {
            const hecha = hechas.includes(index)
            return (
              <li key={index} className={hecha ? 'done' : ''}>
                <div className="st-task-head">
                  <button
                    type="button"
                    className="st-task-tick"
                    onClick={() => store.toggleCheck(`curso:${lessonId}`, 'intermedio', index)}
                    aria-pressed={hecha}
                    aria-label={hecha ? 'Marcar como pendiente' : 'Marcar como hecha'}
                  >
                    {hecha ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                  <div>
                    <span className="st-task-where">{task.where}</span>
                    <h3>{task.title}</h3>
                  </div>
                </div>

                <p className="st-task-action">{task.action}</p>
                {task.prompt && <Prompt text={task.prompt} />}
                <p className="st-task-expected"><b>Tienes que ver:</b> {task.expect}</p>
                {task.stuck && (
                  <p className="st-task-stuck">
                    <HelpCircle size={12} />
                    <span><b>Si no te sale:</b> {task.stuck}</span>
                  </p>
                )}
                <Notebook
                  slug={`curso:${lessonId}`}
                  level="intermedio"
                  noteKey={String(index)}
                  label="Qué te ha salido"
                  placeholder="Pega aquí el resultado o apunta lo que has decidido…"
                />
              </li>
            )
          })}
        </ol>
      </section>

      <section className="st-block st-block-importa">
        <h3><Scale size={15} /> Lo que importa y lo que no</h3>
        <div className="st-matters">
          <div className="st-matters-yes">
            <strong><Check size={11} /> Presta atención a esto</strong>
            <ul>{leccion.matters.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="st-matters-no">
            <strong><Ban size={11} /> Puedes ignorar esto</strong>
            <ul>{leccion.ignore.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      {leccion.pieces?.length ? (
        <section className="st-interactive">
          <h2>Practica con esto</h2>
          {leccion.pieces.map((piece, index) => <Piece key={index} piece={piece} />)}
        </section>
      ) : null}

      {leccion.errors?.length > 0 && (
        <section className="st-errors">
          <h3><AlertTriangle size={12} /> Lo que se te va a romper</h3>
          <p className="st-errors-intro">
            El mensaje tal y como sale en pantalla, qué significa en castellano y qué hacer.
          </p>
          <ol>
            {leccion.errors.map((fallo) => (
              <li key={fallo.message}>
                <code>{fallo.message}</code>
                <p className="st-error-means"><b>Qué significa</b> {fallo.means}</p>
                <p className="st-error-fix"><b>Qué haces</b> {fallo.fix}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="st-matters">
        <div className="st-matters-yes">
          <strong><Check size={11} /> Esto la IA sí lo hace bien</strong>
          <ul>{leccion.canDo.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="st-matters-no">
          <strong><Ban size={11} /> Esto no lo hace</strong>
          <ul>{leccion.cantDo.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>

      {leccion.next && (
        <p className="st-curso-next"><ArrowRight size={13} /> <span>{leccion.next}</span></p>
      )}

      <nav className="st-lesson-nav">
        {anterior ? (
          <a href={href({ name: 'curso', lessonId: anterior.id })}>
            <ArrowLeft size={14} />
            <span><em>Anterior</em><b>{anterior.title}</b></span>
          </a>
        ) : <span />}
        {siguiente && (
          <a className="next" href={href({ name: 'curso', lessonId: siguiente.id })}>
            <span><em>Siguiente</em><b>{siguiente.title}</b></span>
            <ArrowRight size={14} />
          </a>
        )}
      </nav>
    </article>
  )
}
