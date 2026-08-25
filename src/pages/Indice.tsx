import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useCourse } from '../course'
import { href } from '../router'

const LETTERS = ['#', ...'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')]

type Entry = ReturnType<typeof useCourse>['glossaryIndex'][number]

/**
 * Índice alfabético de conceptos.
 *
 * Se lee como un diccionario: la letra entera cabe en pantalla porque de cada
 * término solo se ve el nombre y una línea. El desarrollo (explicación,
 * analogía, con qué no confundirlo y dónde se estudia) se abre al pulsar.
 */
export default function Indice({ letter }: { letter?: string }) {
  const course = useCourse()
  const active = letter?.toUpperCase()
  const [open, setOpen] = useState<string | null>(null)

  const groups = useMemo(() => {
    const map = new Map<string, Entry[]>()
    for (const entry of course.glossaryIndex) {
      if (!map.has(entry.letter)) map.set(entry.letter, [])
      map.get(entry.letter)!.push(entry)
    }
    return map
  }, [course.glossaryIndex])

  const shown = (active ? LETTERS.filter((item) => item === active) : LETTERS).filter((item) => groups.has(item))

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">Referencia</span>
        <h1>Índice de conceptos</h1>
        <p>
          Los {course.stats.terms} términos que atraviesan el curso. Cada uno en una línea; pulsa
          para ver la explicación, la analogía y dónde se estudia.
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

      {shown.map((item) => (
        <section className="st-index-group" key={item}>
          <h2>{item}</h2>
          <ul className="st-index-list">
            {groups.get(item)!.map((entry) => (
              <Term
                key={entry.term}
                entry={entry}
                open={open === entry.term}
                onToggle={() => setOpen(open === entry.term ? null : entry.term)}
              />
            ))}
          </ul>
        </section>
      ))}

      {active && !groups.has(active) && (
        <p className="st-empty">No hay conceptos indexados bajo la letra «{active}».</p>
      )}
    </div>
  )
}

function Term({ entry, open, onToggle }: { entry: Entry; open: boolean; onToggle: () => void }) {
  const hasDetail = Boolean(entry.long || entry.analogy || entry.confusion || entry.seeAlso?.length || entry.lessons.length)

  return (
    <li className={`st-term${open ? ' open' : ''}`}>
      <button className="st-term-head" onClick={onToggle} aria-expanded={open} disabled={!hasDetail}>
        <ChevronRight size={11} className="st-term-caret" aria-hidden />
        <span className="st-term-name">{entry.term}</span>
        <span className="st-term-short">{entry.meaning}</span>
      </button>

      {open && hasDetail && (
        <div className="st-term-body">
          {entry.long && <p className="st-term-long">{entry.long}</p>}

          {entry.analogy && (
            <p className="st-term-note st-term-analogy">
              <b>Como si dijéramos</b>
              {entry.analogy}
            </p>
          )}

          {entry.confusion && (
            <p className="st-term-note st-term-confusion">
              <b>No lo confundas</b>
              {entry.confusion}
            </p>
          )}

          {(entry.seeAlso?.length ?? 0) > 0 && (
            <div className="st-term-links">
              <span>Ver también</span>
              <div>
                {(entry.seeAlso || []).map((related) => (
                  <a key={related} href={href({ name: 'indice', letter: related[0].toUpperCase() })}>
                    {related}
                  </a>
                ))}
              </div>
            </div>
          )}

          {entry.lessons.length > 0 && (
            <div className="st-term-links">
              <span>Se explica en</span>
              <div>
                {entry.lessons.map((lesson) => (
                  <a key={lesson.slug} href={href({ name: 'leccion', slug: lesson.slug })}>
                    {lesson.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  )
}
