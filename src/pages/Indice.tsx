import { useMemo, useState } from 'react'
import { BookOpen, ChevronRight, Search } from 'lucide-react'
import type { GlossaryEntry } from '../types'
import { useCourse } from '../course'
import { href } from '../router'
import { useLocale } from '../i18n'

const LETTERS = ['#', ...'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')]

type Entry = GlossaryEntry


/**
 * Índice alfabético de conceptos.
 *
 * Se lee como un diccionario: la letra entera cabe en pantalla porque de cada
 * término solo se ve el nombre y una línea. El desarrollo (explicación,
 * analogía, con qué no confundirlo y dónde se estudia) se abre al pulsar.
 */
export default function Indice({ letter }: { letter?: string }) {
  const course = useCourse()
  const locale = useLocale()
  const active = letter?.toUpperCase()
  const [open, setOpen] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const entries = course.glossaryIndex

  const groups = useMemo(() => {
    const map = new Map<string, Entry[]>()
    const needle = query.trim().toLowerCase()
    for (const entry of entries) {
      if (needle && !`${entry.term} ${entry.meaning} ${entry.long || ''}`.toLowerCase().includes(needle)) continue
      if (!map.has(entry.letter)) map.set(entry.letter, [])
      map.get(entry.letter)!.push(entry)
    }
    return map
  }, [entries, query])

  const buscando = query.trim().length > 0
  /* Sin letra elegida y sin buscar, se ensena solo la primera letra con
   * contenido. Antes se pintaban las 555 palabras de golpe. */
  const conContenido = LETTERS.filter((item) => groups.has(item))
  const shown = buscando
    ? conContenido
    : conContenido.filter((item) => item === (active || conContenido[0]))

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><BookOpen size={12} /> {locale === 'en' ? 'Academy dictionary' : 'Diccionario de la academia'}</span>
        <h1>{locale === 'en' ? 'The words that stall the project' : 'Las palabras que frenan el proyecto'}</h1>
        <p>
          {locale === 'en' ? (
            <>Technical vocabulary explained in plain language: what it means, what it gets confused with and
            when it affects you. Search for a word, or go in by its letter. There are {entries.length} words: the search box is faster.</>
          ) : (
            <>Aquí se explica el vocabulario técnico en lenguaje normal: qué significa, con qué se confunde y
            cuándo te afecta. Busca una palabra, o entra por su letra. Son {entries.length} palabras: usa el buscador, es más rápido.</>
          )}
        </p>
      </div>

      <label className="st-dictionary-search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === 'en' ? 'Search localhost, clipboard, tokens, API…' : 'Busca localhost, portapapeles, tokens, API…'} aria-label={locale === 'en' ? 'Search a word' : 'Buscar una palabra'} /></label>

      <div className="st-dictionary-note"><strong>{entries.length} {locale === 'en' ? 'words available.' : 'palabras disponibles.'}</strong><span>{locale === 'en' ? 'New words that appear in the guides are added here so you don\'t have to memorize them.' : 'Las nuevas palabras que aparecen en las guías se incorporan aquí para que no tengas que aprenderlas de memoria.'}</span></div>

      <nav className="st-alphabet" aria-label={locale === 'en' ? 'Alphabet navigation' : 'Navegación alfabética'}>
        <a className={active ? '' : 'off'} href={href({ name: 'indice' })}>{locale === 'en' ? 'Home' : 'Inicio'}</a>
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

      {active && !groups.has(active) && !query && (
        <p className="st-empty">{locale === 'en' ? <>No concepts indexed under the letter "{active}".</> : <>No hay conceptos indexados bajo la letra «{active}».</>}</p>
      )}
      {query && !groups.size && <p className="st-empty">{locale === 'en' ? <>Can't find "{query}". Try a shorter word or "local".</> : <>No encuentro «{query}». Prueba con una palabra más corta o con "local".</>}</p>}
    </div>
  )
}

function Term({ entry, open, onToggle }: { entry: Entry; open: boolean; onToggle: () => void }) {
  const locale = useLocale()
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
              <b>{locale === 'en' ? "It's like saying" : 'Como si dijéramos'}</b>
              {entry.analogy}
            </p>
          )}

          {entry.confusion && (
            <p className="st-term-note st-term-confusion">
              <b>{locale === 'en' ? "Don't confuse it with" : 'No lo confundas'}</b>
              {entry.confusion}
            </p>
          )}

          {(entry.seeAlso?.length ?? 0) > 0 && (
            <div className="st-term-links">
              <span>{locale === 'en' ? 'See also' : 'Ver también'}</span>
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
              <span>{locale === 'en' ? 'Explained in' : 'Se explica en'}</span>
              <div>
                {entry.lessons.map((lesson) => (
                  <a key={lesson.id} href={href({ name: 'curso', lessonId: lesson.id })}>
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
