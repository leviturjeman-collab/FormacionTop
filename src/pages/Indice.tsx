import { useMemo } from 'react'
import { useCourse } from '../course'
import { href } from '../router'

const LETTERS = ['#', ...'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')]

/**
 * Índice alfabético de conceptos.
 *
 * Entrada para el alumno que busca una palabra suelta y no sabe en qué área
 * cae. Cada término enlaza con las lecciones donde aparece definido o destacado.
 */
export default function Indice({ letter }: { letter?: string }) {
  const course = useCourse()
  const active = letter?.toUpperCase()

  const groups = useMemo(() => {
    const map = new Map<string, typeof course.glossaryIndex>()
    for (const entry of course.glossaryIndex) {
      if (!map.has(entry.letter)) map.set(entry.letter, [])
      map.get(entry.letter)!.push(entry)
    }
    return map
  }, [course.glossaryIndex])

  const shown = active ? LETTERS.filter((item) => item === active) : LETTERS

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">Referencia</span>
        <h1>Índice de conceptos</h1>
        <p>
          Los {course.stats.terms} términos que atraviesan el curso, con dónde se explica cada uno.
          Si has oído una palabra y no sabes por dónde empezar, empieza aquí.
        </p>
      </div>

      <nav className="st-alphabet" aria-label="Navegación alfabética">
        <a className={active ? '' : 'off'} href={href({ name: 'indice' })}>Todo</a>
        {LETTERS.map((item) => (
          <a
            key={item}
            className={groups.has(item) ? '' : 'off'}
            href={href({ name: 'indice', letter: item })}
          >
            {item}
          </a>
        ))}
      </nav>

      {shown.filter((item) => groups.has(item)).map((item) => (
        <section className="st-index-group" key={item}>
          <h2>{item}</h2>
          <dl>
            {groups.get(item)!.map((entry) => (
              <div className="st-index-entry" key={entry.term}>
                <dt>{entry.term}</dt>
                <dd>
                  {entry.meaning && <p>{entry.meaning}</p>}
                  <div className="st-index-links">
                    {entry.lessons.map((lesson) => (
                      <a key={lesson.slug} href={href({ name: 'leccion', slug: lesson.slug })}>{lesson.title}</a>
                    ))}
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      {active && !groups.has(active) && (
        <p className="st-empty">No hay conceptos indexados bajo la letra «{active}».</p>
      )}
    </div>
  )
}
