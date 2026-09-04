import { MessageCircleQuestion, Presentation, Timer } from 'lucide-react'
import type { Lesson, LevelId } from '../types'
import { href } from '../router'
import { buildScript } from '../teacher'
import { useLocale } from '../i18n'

/**
 * Guion de clase. Solo se ve con el modo profesor activado; el alumno nunca
 * lo carga.
 */
export default function TeacherPanel({ lesson, level }: { lesson: Lesson; level: LevelId }) {
  const locale = useLocale()
  const script = buildScript(lesson, level)

  return (
    <section className="st-teacher">
      <header>
        <div>
          <span className="st-kicker">{locale === 'en' ? 'Teacher mode' : 'Modo profesor'}</span>
          <h2>{locale === 'en' ? 'Class script' : 'Guion de clase'}</h2>
        </div>
        <div className="st-teacher-actions">
          <span className="st-piece-badge"><Timer size={11} /> {script.minutes} min</span>
          <a className="st-btn-ghost" href={href({ name: 'presentar', slug: lesson.slug, level })}>
            <Presentation size={13} /> {locale === 'en' ? 'Present' : 'Presentar'}
          </a>
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
    </section>
  )
}
