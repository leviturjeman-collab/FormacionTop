import { MessageCircleQuestion, Timer } from 'lucide-react'
import type { Lesson, LevelId } from '../types'
import { buildScript } from '../teacher'
import { useLocale } from '../i18n'

/**
 * Notas docentes. La lección solo renderiza este apartado para el profesor.
 */
export default function TeacherPanel({ lesson, level }: { lesson: Lesson; level: LevelId }) {
  const locale = useLocale()
  const script = buildScript(lesson, level)

  return (
    <details className="st-teacher st-teacher-notes">
      <summary>{locale === 'en' ? 'Teacher notes' : 'Notas del profesor'}</summary>
      <header>
        <div>
          <span className="st-kicker">{locale === 'en' ? 'Teacher material' : 'Material docente'}</span>
          <h2>{locale === 'en' ? 'Class script' : 'Guion de clase'}</h2>
        </div>
        <div className="st-teacher-actions">
          <span className="st-piece-badge"><Timer size={11} /> {script.minutes} min</span>
        </div>
      </header>

      <p className="st-teacher-opener"><b>{locale === 'en' ? 'To open:' : 'Para abrir:'}</b> {script.opener}</p>

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
          <strong>{locale === 'en' ? "They'll get this wrong" : 'Se van a equivocar en esto'}</strong>
          <ul>
            {script.mistakes.map((mistake, index) => (
              <li key={index}>{mistake.error}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="st-teacher-opener"><b>{locale === 'en' ? 'To close:' : 'Para cerrar:'}</b> {script.closer}</p>
    </details>
  )
}
