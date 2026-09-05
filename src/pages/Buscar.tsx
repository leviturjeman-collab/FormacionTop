import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, BookOpen, Compass, Languages, Puzzle, Search, Sparkles } from 'lucide-react'
import type { GlossaryEntry, Guide, LevelId, Lesson, PromptFamily, PromptItem, ToolPage } from '../types'
import { searchLessons, useCourse } from '../course'
import { href, navigate, type Route } from '../router'
import { useStudent } from '../store'
import Filters, { applyFilters } from '../components/Filters'
import { LessonRow } from '../components/LessonList'
import { BrandMark } from '../components/Brand'
import { useLocale } from '../i18n'

/**
 * Búsqueda con resultados agrupados.
 *
 * Buscar "n8n" en una lista plana devuelve cien filas indistinguibles. Aquí los
 * resultados se agrupan por categoría, con el recuento de cada grupo, para que
 * se vea de un vistazo dónde vive lo que buscas.
 */
function normalized(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function includesAll(haystack: string, words: string[]) {
  const text = normalized(haystack)
  return words.every((word) => text.includes(word))
}

function highlightSource(lesson: Lesson) {
  return `${lesson.title} ${lesson.kindLabel} ${lesson.folderLabel} ${lesson.tools.join(' ')} ${lesson.tags.join(' ')} ${lesson.search}`
}

function SearchHit({
  icon,
  title,
  text,
  href: target,
  meta,
}: {
  icon: ReactNode
  title: string
  text: string
  href: string
  meta: string
}) {
  return (
    <a className="st-search-hit" href={target}>
      <span className="st-search-hit-icon">{icon}</span>
      <div>
        <small>{meta}</small>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <ArrowRight size={14} />
    </a>
  )
}

type PromptMatch = { prompt: PromptItem; family: PromptFamily }

export default function Buscar({ query, route }: { query: string; route: Route }) {
  const course = useCourse()
  const student = useStudent()
  const locale = useLocale()
  const [value, setValue] = useState(query)
  const [groupBy, setGroupBy] = useState<'categoria' | 'area' | 'tipo'>('categoria')
  const [shown, setShown] = useState(12)
  useEffect(() => setShown(12), [value])
  const level: LevelId = student.preferredLevel || 'basico'

  useEffect(() => setValue(query), [query])

  const doneSlugs = new Set(
    Object.entries(student.lessons).filter(([, progress]) => progress.done.length > 0 || Object.values(progress.tasks || {}).some(v => v && v.length > 0) || Object.values(progress.checks).some(v => v && v.length > 0) || Object.values(progress.notes).some(v => v && Object.values(v).some(Boolean))).map(([slug]) => slug),
  )

  const liveQuery = value.trim()
  const activeQuery = liveQuery
  const words = useMemo(() => normalized(activeQuery).split(/\s+/).filter(Boolean), [activeQuery])
  const found = useMemo(() => searchLessons(course.lessons, activeQuery), [course.lessons, activeQuery])
  const filters = 'filters' in route ? route.filters : {}
  const results = applyFilters(found, filters, doneSlugs)

  const toolMatches = useMemo<ToolPage[]>(() => {
    if (words.length < 1) return course.toolPages.filter((tool) => tool.guide)
    return course.toolPages
      .filter((tool) => includesAll(`${tool.label} ${tool.id} ${tool.guide?.plain || ''} ${tool.guide?.matters?.join(' ') || ''}`, words))

  }, [course.toolPages, words])

  const promptMatches = useMemo<PromptMatch[]>(() => {
    if (activeQuery.length < 2) return []
    return (course.prompts || [])
      .flatMap((family) => family.prompts.map((prompt) => ({ family, prompt })))
      .filter(({ family, prompt }) =>
        includesAll(`${family.title} ${family.intro} ${prompt.name} ${prompt.when} ${prompt.prompt} ${prompt.toolLabel || ''}`, words),
      )

  }, [course.prompts, words])

  const glossaryMatches = useMemo<GlossaryEntry[]>(() => {
    if (words.length < 1) return []
    return course.glossaryIndex
      .filter((entry) => includesAll(`${entry.term} ${entry.meaning} ${entry.long || ''} ${entry.seeAlso?.join(' ') || ''}`, words))

  }, [course.glossaryIndex, words])

  const guideMatches = useMemo<Guide[]>(() => {
    if (words.length < 1) return []
    return (course.guides || [])
      .filter((guide) =>
        includesAll(`${guide.title} ${guide.kicker} ${guide.intro} ${guide.theory.map((item) => item.text).join(' ')}`, words),
      )

  }, [course.guides, words])

  const extraMatches = useMemo(() => {
    if (activeQuery.length < 2) return []
    const items = [
      ...course.curso.map(x => ({ title: x.title, text: x.promise, search: JSON.stringify(x), target: href({ name: 'curso', lessonId: x.id }), meta: locale === 'en' ? 'Program' : 'Programa' })),
      ...course.kits.map(x => ({ title: x.title, text: x.promise, search: JSON.stringify(x), target: href({ name: 'kits', kitId: x.id }), meta: 'Kit' })),
      ...course.agents.map(x => ({ title: x.title, text: x.what, search: JSON.stringify(x), target: href({ name: 'agentes', agentId: x.id }), meta: locale === 'en' ? 'Agent' : 'Agente' })),
      ...course.projects.map(x => ({ title: x.title, text: x.pitch, search: JSON.stringify(x), target: href({ name: 'proyecto', stageId: x.stageId }), meta: locale === 'en' ? 'Project' : 'Proyecto' })),
      ...course.decks.map(x => ({ title: x.title, text: x.subtitle, search: JSON.stringify(x), target: href({ name: 'deck', deckId: x.id }), meta: locale === 'en' ? 'Presentation' : 'Presentación' })),
      ...course.preguntas.flatMap(g => g.preguntas.map(x => ({ title: x.q, text: x.corta || x.a, search: JSON.stringify(x), target: href({ name: 'preguntas', question: x.q }), meta: 'FAQ' }))),
    ]
    return items.filter(x => includesAll(x.search, words))
  }, [course, activeQuery, words, locale])
  const quickTotal = results.length + toolMatches.length + promptMatches.length + glossaryMatches.length + guideMatches.length + extraMatches.length

  const groups = useMemo(() => {
    const map = new Map<string, { label: string; sub: string; lessons: Lesson[]; link: string }>()
    for (const lesson of results) {
      let key: string
      let label: string
      let sub = ''
      let link = ''

      if (groupBy === 'categoria') {
        const category = course.categories.find((item) => item.id === lesson.categoryId)
        key = lesson.categoryId
        label = category?.label || lesson.folderLabel
        sub = category?.parentLabel || ''
        link = href({ name: 'categoria', categoryId: lesson.categoryId, filters: {} })
      } else if (groupBy === 'area') {
        const stage = course.stages.find((item) => item.id === lesson.stageId)
        key = lesson.stageId
        label = stage ? `${stage.number}. ${stage.title}` : lesson.stageId
        sub = stage?.tagline || ''
        link = href({ name: 'area', stageId: lesson.stageId, filters: {} })
      } else {
        key = lesson.kind
        label = lesson.kindLabel
        sub = course.kinds[lesson.kind]?.hint || ''
      }

      if (!map.has(key)) map.set(key, { label, sub, lessons: [], link })
      map.get(key)!.lessons.push(lesson)
    }
    // Los grupos con una sola coincidencia se juntan al final: setenta grupos
    // de un resultado cada uno no ayudan a nadie a encontrar nada.
    const list = [...map.values()].sort((a, b) => b.lessons.length - a.lessons.length)
    const strong = list.filter((group) => group.lessons.length > 1)
    const singles = list.filter((group) => group.lessons.length === 1)
    if (singles.length > 2) {
      strong.push({
        label: locale === 'en' ? 'Scattered mentions' : 'Menciones sueltas',
        sub: locale === 'en'
          ? `In ${singles.length} more categories, with one result each`
          : `En ${singles.length} categorías más, con un resultado en cada una`,
        lessons: singles.flatMap((group) => group.lessons),
        link: '',
      })
    } else {
      strong.push(...singles)
    }
    return strong
  }, [results, groupBy, course, locale])

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">{locale === 'en' ? 'Search' : 'Búsqueda'}</span>
        <h1>{locale === 'en' ? 'Super search' : 'Súper búsqueda'}</h1>
        <form
          className="st-super-search"
          onSubmit={(event) => {
            event.preventDefault()
            navigate({ name: 'buscar', query: value.trim(), filters })
          }}
        >
          <div className="st-super-input">
            <Search size={14} />
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={locale === 'en' ? 'Search lessons, tools, prompts, guides or concepts…' : 'Busca lecciones, herramientas, prompts, guías o conceptos…'}
              aria-label={locale === 'en' ? 'Search the whole academy' : 'Buscar en toda la academia'}
              autoFocus
            />
            <button type="submit" className="st-btn">{locale === 'en' ? 'Search' : 'Buscar'}</button>
          </div>
          <div className="st-super-tags" aria-label={locale === 'en' ? 'Quick searches' : 'Búsquedas rápidas'}>
            {['Wispr Flow', 'n8n', 'prompts', 'automatizaciones', 'privacidad', 'RAG'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setValue(term)
                  navigate({ name: 'buscar', query: term, filters: {} })
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </form>
      </div>

      {activeQuery.length < 2 ? (
        <p className="st-empty">
          {locale === 'en'
            ? 'Type at least two letters, or use a shortcut. Search looks through lessons, tools, prompts, guides and glossary.'
            : 'Escribe al menos dos letras, o usa un atajo. La búsqueda mira lecciones, herramientas, prompts, guías y diccionario.'}
        </p>
      ) : quickTotal === 0 ? (
        <div className="st-empty">
          <h2>{locale === 'en' ? `Nothing for "${activeQuery}"` : `Nada para «${activeQuery}»`}</h2>
          <p>{locale === 'en' ? 'Try a shorter term, or search by tool: n8n, Claude, OpenAI, Docker, RAG or Wispr Flow.' : 'Prueba con un término más corto, o busca por herramienta: n8n, Claude, OpenAI, Docker, RAG o Wispr Flow.'}</p>
          <a className="st-btn" href={href({ name: 'indice' })}>{locale === 'en' ? 'See the concept index' : 'Ver el índice de conceptos'}</a>
        </div>
      ) : (
        <>
          {extraMatches.length > 0 && <section className="st-search-kind"><h2>{locale === 'en' ? 'Program, projects, kits, agents and answers' : 'Programa, proyectos, kits, agentes y respuestas'} ({extraMatches.length})</h2>{extraMatches.slice(0, shown).map(hit => <SearchHit key={hit.target} icon={<BookOpen size={17} />} title={hit.title} text={hit.text} href={hit.target} meta={hit.meta} />)}</section>}
          <section className="st-search-overview" aria-label={locale === 'en' ? 'Search summary' : 'Resumen de búsqueda'}>
            <div><strong>{results.length}</strong><span>{locale === 'en' ? 'Lessons' : 'Lecciones'}</span></div>
            <div><strong>{toolMatches.length}</strong><span>{locale === 'en' ? 'Tools' : 'Herramientas'}</span></div>
            <div><strong>{promptMatches.length}</strong><span>Prompts</span></div>
            <div><strong>{glossaryMatches.length}</strong><span>{locale === 'en' ? 'Concepts' : 'Conceptos'}</span></div>
            <div><strong>{guideMatches.length}</strong><span>{locale === 'en' ? 'Guides' : 'Guías'}</span></div>
          </section>

          {(toolMatches.length > 0 || promptMatches.length > 0 || glossaryMatches.length > 0 || guideMatches.length > 0) && (
            <section className="st-search-kind-grid">
              {toolMatches.length > 0 && (
                <div className="st-search-kind">
                  <div className="st-section-head">
                    <div><span className="st-kicker">{locale === 'en' ? 'Tools' : 'Herramientas'}</span><h2>{locale === 'en' ? 'Related guides' : 'Guías relacionadas'}</h2></div>
                    <span>{toolMatches.length}</span>
                  </div>
                  {toolMatches.slice(0, shown).map((tool) => (
                    <SearchHit
                      key={tool.id}
                      icon={<BrandMark icon={tool.icon} size={18} />}
                      title={tool.label}
                      text={tool.guide?.plain || (locale === 'en' ? `${tool.count} associated lessons` : `${tool.count} lecciones asociadas`)}
                      href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}
                      meta={locale === 'en'
                        ? `${tool.guide?.prompts?.length || 0} prompts · ${tool.guide?.automations?.length || 0} automations`
                        : `${tool.guide?.prompts?.length || 0} prompts · ${tool.guide?.automations?.length || 0} automatizaciones`}
                    />
                  ))}
                </div>
              )}

              {promptMatches.length > 0 && (
                <div className="st-search-kind">
                  <div className="st-section-head">
                    <div><span className="st-kicker">Prompts</span><h2>{locale === 'en' ? 'Ready to copy' : 'Listos para copiar'}</h2></div>
                    <span>{promptMatches.length}</span>
                  </div>
                  {promptMatches.slice(0, shown).map(({ prompt, family }) => (
                    <SearchHit
                      key={`${family.id}-${prompt.id || prompt.name}`}
                      icon={<Sparkles size={17} />}
                      title={prompt.name}
                      text={prompt.when}
                      href={href({ name: 'prompts', familyId: family.id, promptId: prompt.id || prompt.name })}
                      meta={prompt.toolLabel || family.title}
                    />
                  ))}
                </div>
              )}

              {glossaryMatches.length > 0 && (
                <div className="st-search-kind">
                  <div className="st-section-head">
                    <div><span className="st-kicker">{locale === 'en' ? 'Glossary' : 'Diccionario'}</span><h2>{locale === 'en' ? 'Concepts' : 'Conceptos'}</h2></div>
                    <span>{glossaryMatches.length}</span>
                  </div>
                  {glossaryMatches.slice(0, shown).map((entry) => (
                    <SearchHit
                      key={entry.term}
                      icon={<Languages size={17} />}
                      title={entry.term}
                      text={entry.meaning}
                      href={href({ name: 'indice', letter: entry.letter, term: entry.term })}
                      meta={locale === 'en' ? 'Concept' : 'Concepto'}
                    />
                  ))}
                </div>
              )}

              {guideMatches.length > 0 && (
                <div className="st-search-kind">
                  <div className="st-section-head">
                    <div><span className="st-kicker">{locale === 'en' ? 'Guides' : 'Guías'}</span><h2>{locale === 'en' ? 'Essentials' : 'Fundamentales'}</h2></div>
                    <span>{guideMatches.length}</span>
                  </div>
                  {guideMatches.slice(0, shown).map((guide) => (
                    <SearchHit
                      key={guide.id}
                      icon={<Compass size={17} />}
                      title={guide.title}
                      text={guide.intro}
                      href={href({ name: 'guia', guideId: guide.id })}
                      meta={`${guide.minutes} min`}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {found.length > 0 && <Filters route={route} lessons={found} />}

          <div className="st-filter-row" style={{ marginTop: 12 }}>
            <span style={{ minWidth: 74, color: '#68706a', fontSize: 7, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.07em' }}>
              {locale === 'en' ? 'Group by' : 'Agrupar por'}
            </span>
            {(['categoria', 'area', 'tipo'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                className={`st-chip${groupBy === mode ? ' on' : ''}`}
                onClick={() => setGroupBy(mode)}
              >
                {locale === 'en'
                  ? (mode === 'categoria' ? 'Category' : mode === 'area' ? 'Area' : 'Type')
                  : (mode === 'categoria' ? 'Categoría' : mode === 'area' ? 'Área' : 'Tipo')}
              </button>
            ))}
          </div>

          <p className="st-result-count">
            {locale === 'en' ? (
              <><strong>{results.length}</strong> {results.length === 1 ? 'lesson' : 'lessons'} for "{activeQuery}",
              in {groups.length} {groups.length === 1 ? 'group' : 'groups'}.</>
            ) : (
              <><strong>{results.length}</strong> {results.length === 1 ? 'lección' : 'lecciones'} para «{activeQuery}»,
              en {groups.length} {groups.length === 1 ? 'grupo' : 'grupos'}.</>
            )}
          </p>

          {!found.length && (
            <p className="st-empty">
              {locale === 'en'
                ? 'There are no lessons with that term, but there are matches in tools, prompts, guides or glossary.'
                : 'No hay lecciones con ese término, pero sí hay coincidencias en herramientas, prompts, guías o diccionario.'}
            </p>
          )}

          {groups.map((group) => (
            <section key={group.label} style={{ marginBottom: 22 }}>
              <div className="st-section-head" style={{ marginTop: 0 }}>
                <div>
                  {group.sub && <span className="st-kicker">{group.sub}</span>}
                  <h2>{group.label}</h2>
                </div>
                <span>{group.lessons.length} {locale === 'en' ? (group.lessons.length === 1 ? 'result' : 'results') : (group.lessons.length === 1 ? 'resultado' : 'resultados')}</span>
                {group.link && <a href={group.link}>{locale === 'en' ? 'See the full category' : 'Ver la categoría completa'}</a>}
              </div>
              <div className="st-lesson-rows" style={{ marginTop: 10 }}>
                {group.lessons.map((lesson) => (
                  <LessonRow key={lesson.slug} lesson={lesson} level={level} showCategory={groupBy !== 'categoria'} />
                ))}
              </div>
            </section>
          ))}

          {Math.max(extraMatches.length, toolMatches.length, promptMatches.length, glossaryMatches.length, guideMatches.length) > shown && <button type="button" className="st-btn" onClick={() => setShown(n => n + 24)}>{locale === 'en' ? 'Show more results' : 'Mostrar más resultados'}</button>}
        </>
      )}
    </div>
  )
}
