import { MessageCircleQuestion, Presentation, Timer } from 'lucide-react'
import type { Lesson, LevelId } from '../types'
import { href } from '../router'
import { buildScript } from '../teacher'

/**
 * Guion de clase. Solo se ve con el modo profesor activado; el alumno nunca
 * lo carga.
 */
export default function TeacherPanel({ lesson, level }: { lesson: Lesson; level: LevelId }) {
  const script = buildScript(lesson, level)

  return (
    <section className="st-teacher">
      <header>
        <div>
          <span className="st-kicker">Modo profesor</span>
          <h2>Guion de clase</h2>
        </div>
        <div className="st-teacher-actions">
          <span className="st-piece-badge"><Timer size={11} /> {script.minutes} min</span>
          <a className="st-btn-ghost" href={href({ name: 'presentar', slug: lesson.slug, level })}>
            <Presentation size={13} /> Presentar
          </a>
        </div>
      </header>

      <p className="st-teacher-opener"><b>Para abrir:</b> {script.opener}</p>

      <ol className="st-teacher-beats">
        {script.beats.map((beat, index) => (
          <li key={index}>
            <span>{beat.minutes}′</span>
            <div>
              <strong>{beat.title}</strong>
              <p>{beat.say}</p>
              {beat.ask && (
                <p className="st-teacher-ask">
                  <MessageCircleQuestion size={11} /> {beat.ask}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {script.mistakes.length > 0 && (
        <div className="st-teacher-mistakes">
          <strong>Se van a equivocar en esto</strong>
          <ul>
            {script.mistakes.map((mistake, index) => (
              <li key={index}>{mistake.error}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="st-teacher-opener"><b>Para cerrar:</b> {script.closer}</p>
    </section>
  )
}
