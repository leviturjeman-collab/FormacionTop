import { useState } from 'react'
import { ArrowLeft, ArrowRight, Ban, Check, CheckCircle2, Circle, Clock, Copy, HelpCircle, Languages, Lightbulb, List, Quote } from 'lucide-react'
import type { Guide } from '../types'
import { useCourse } from '../course'
import { href } from '../router'

/**
 * Guía fundamental.
 *
 * Un poco de teoría bien explicada y, debajo, la guía de tareas: qué hacer,
 * dónde, el prompt exacto si hay que pedirle algo a la IA, y qué tienes que ver
 * para saber que ha salido bien.
 */
function TaskPrompt({ text }: { text: string }) {
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

export default function Guia({ guideId }: { guideId?: string }) {
  const course = useCourse()
  const guias = course.guides || []
  const [done, setDone] = useState<number[]>([])

  const guia = guideId ? guias.find((item) => item.id === guideId) : null

  // Sin id, se muestra el índice de guías.
  if (!guia) {
    if (!guias.length) {
      return (
        <div className="st-page">
          <div className="st-empty">
            <h2>Las guías se están escribiendo</h2>
            <p>Vuelve en un momento.</p>
          </div>
        </div>
      )
    }
    return (
      <div className="st-page">
        <div className="st-page-title">
          <span className="st-kicker">Empieza por aquí</span>
          <h1>Guías fundamentales</h1>
          <p>
            Lo que hay que entender antes de nada, explicado desde cero y sin dar por sabido nada.
            Cada guía termina con tareas concretas que haces tú.
          </p>
        </div>
        <div className="st-cat-grid">
          {guias.map((item) => (
            <a key={item.id} className="st-cat-card" href={href({ name: 'guia', guideId: item.id })}>
              <small>{item.kicker}</small>
              <strong>{item.title}</strong>
              <span>{item.tasks.length} tareas · {item.minutes} min</span>
            </a>
          ))}
        </div>
      </div>
    )
  }

  const percent = Math.round((done.length / Math.max(1, guia.tasks.length)) * 100)

  /* Las guias son una secuencia, asi que se puede ir a la de al lado sin
   * pasar por el indice. Antes no habia forma de avanzar. */
  const todas = course.guides || []
  const puesto = todas.findIndex((item) => item.id === guia.id)
  const anterior = puesto > 0 ? todas[puesto - 1] : null
  const siguiente = puesto >= 0 && puesto < todas.length - 1 ? todas[puesto + 1] : null

  return (
    <article className="st-lesson">
      <header className="st-lesson-head">
        <span className="st-kicker">{guia.kicker}</span>
        <h1>{guia.title}</h1>
        <p className="st-lesson-hook">{guia.intro}</p>
        <div className="st-lesson-meta">
          <span><Clock size={11} /> {guia.minutes} min</span>
          <span>{guia.tasks.length} tareas</span>
          {puesto >= 0 && <span>Guía {puesto + 1} de {todas.length}</span>}
          <a className="st-volver" href={href({ name: 'guia' })}><List size={11} /> Todas las guías</a>
        </div>
      </header>

      <div className="st-blocks">
        {guia.theory.map((part, index) => (
          <details key={index} className="st-block st-block-seccion" open={index === 0}>
            <summary>
              <span><Lightbulb size={15} /><strong>{part.title}</strong></span>
              <span className="st-block-summary-meta"><i>Abrir</i></span>
            </summary>
            <div className="st-block-body">
              <p className="st-part-text">{part.text}</p>
              {part.analogy && (
                <p className="st-guide-analogy"><Quote size={13} /> <span>{part.analogy}</span></p>
              )}
            </div>
          </details>
        ))}
      </div>

      {guia.words?.length > 0 && (
        <details className="st-block st-block-palabras">
          <summary>
            <span><Languages size={15} /><strong>Las palabras que vas a leer, en cristiano</strong></span>
            <span className="st-block-summary-meta"><b>{guia.words.length}</b><i>Abrir</i></span>
          </summary>
          <div className="st-block-body">
            <dl className="st-words">
              {guia.words.map(([term, meaning]) => (
                <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>
              ))}
            </dl>
          </div>
        </details>
      )}

      <section className="st-tasks">
        <div className="st-tasks-head">
          <div>
            <span className="st-kicker">Tu turno</span>
            <h2>Hazlo paso a paso</h2>
          </div>
          <span className="st-piece-badge" data-full={percent === 100 ? 'true' : undefined}>
            {done.length}/{guia.tasks.length} tareas
          </span>
        </div>
        <div className="st-checkbar"><span style={{ width: `${percent}%` }} /></div>

        <ol className="st-task-list">
          {guia.tasks.map((task, index) => {
            const hecha = done.includes(index)
            return (
              <li key={index} className={hecha ? 'done' : ''}>
                <div className="st-task-head">
                  <button
                    type="button"
                    className="st-task-tick"
                    onClick={() => setDone((current) =>
                      current.includes(index) ? current.filter((value) => value !== index) : [...current, index],
                    )}
                    aria-pressed={hecha}
                  >
                    {hecha ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                  <div>
                    <span className="st-task-where">{task.where}</span>
                    <h3>{task.title}</h3>
                  </div>
                </div>

                <details className="st-task-detail" open={index === 0 || hecha}>
                  <summary>Abrir ejemplo paso a paso</summary>
                  <div>
                    <div className="st-step-guide">
                      <section>
                        <b>Ejemplo real</b>
                        <p>{task.title}</p>
                      </section>
                      <section>
                        <b>Paso a paso</b>
                        <ol>
                          <li>{task.where}</li>
                          <li>{task.action}</li>
                          {task.prompt && <li>Copia el prompt de abajo, cambia los datos entre corchetes y pégalo en la IA.</li>}
                        </ol>
                      </section>
                    </div>
                    {task.prompt && <TaskPrompt text={task.prompt} />}
                    <div className="st-step-guide">
                      <section>
                        <b>Qué mirar al final</b>
                        <p>{task.expect}</p>
                      </section>
                    </div>
                    {task.stuck && (
                      <p className="st-task-stuck">
                        <HelpCircle size={12} />
                        <span><b>Si no te sale:</b> {task.stuck}</span>
                      </p>
                    )}
                    <button
                      type="button"
                      className={`st-task-ok${hecha ? ' done' : ''}`}
                      onClick={() => setDone((current) => current.includes(index) ? current : [...current, index])}
                      disabled={hecha}
                    >
                      {hecha ? <CheckCircle2 size={14} /> : <Check size={14} />}
                      {hecha ? 'Hecho' : 'OK, hecho'}
                    </button>
                  </div>
                </details>
              </li>
            )
          })}
        </ol>
      </section>

      <details className="st-block st-block-importa">
        <summary>
          <span><Check size={15} /><strong>Atajos y cosas que importan</strong></span>
          <span className="st-block-summary-meta"><b>{guia.canDo.length + guia.cantDo.length}</b><i>Abrir</i></span>
        </summary>
        <div className="st-block-body">
          <div className="st-matters">
            <div className="st-matters-yes">
              <strong><Check size={11} /> Esto sí puedes hacerlo</strong>
              <ul>{guia.canDo.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="st-matters-no">
              <strong><Ban size={11} /> Esto todavía no</strong>
              <ul>{guia.cantDo.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      </details>

      <nav className="st-lesson-nav">
        {anterior ? (
          <a href={href({ name: 'guia', guideId: anterior.id })}>
            <ArrowLeft size={14} />
            <span><em>Anterior</em><b>{anterior.title}</b></span>
          </a>
        ) : <span />}
        {siguiente && (
          <a className="next" href={href({ name: 'guia', guideId: siguiente.id })}>
            <span><em>Siguiente</em><b>{siguiente.title}</b></span>
            <ArrowRight size={14} />
          </a>
        )}
      </nav>
    </article>
  )
}
