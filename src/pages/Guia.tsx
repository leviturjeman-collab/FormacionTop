import { useState } from 'react'
import { Ban, Check, CheckCircle2, Circle, Clock, Copy, HelpCircle, Languages, Lightbulb, Quote } from 'lucide-react'
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

  return (
    <article className="st-lesson">
      <header className="st-lesson-head">
        <span className="st-kicker">{guia.kicker}</span>
        <h1>{guia.title}</h1>
        <p className="st-lesson-hook">{guia.intro}</p>
        <div className="st-lesson-meta">
          <span><Clock size={11} /> {guia.minutes} min</span>
          <span>{guia.tasks.length} tareas</span>
        </div>
      </header>

      <div className="st-blocks">
        {guia.theory.map((part, index) => (
          <section key={index} className="st-block st-block-seccion">
            <h3><Lightbulb size={15} /> {part.title}</h3>
            <p className="st-part-text">{part.text}</p>
            {part.analogy && (
              <p className="st-guide-analogy"><Quote size={13} /> <span>{part.analogy}</span></p>
            )}
          </section>
        ))}
      </div>

      {guia.words?.length > 0 && (
        <section className="st-block st-block-palabras">
          <h3><Languages size={15} /> Las palabras que vas a leer, en cristiano</h3>
          <dl className="st-words">
            {guia.words.map(([term, meaning]) => (
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

                <p className="st-task-action">{task.action}</p>
                {task.prompt && <TaskPrompt text={task.prompt} />}
                <p className="st-task-expected"><b>Tienes que ver:</b> {task.expect}</p>
                {task.stuck && (
                  <p className="st-task-stuck">
                    <HelpCircle size={12} />
                    <span><b>Si no te sale:</b> {task.stuck}</span>
                  </p>
                )}
              </li>
            )
          })}
        </ol>
      </section>

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
    </article>
  )
}
