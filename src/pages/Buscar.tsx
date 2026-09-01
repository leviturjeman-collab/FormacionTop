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
  const [value, setValue] = useState(query)
  const [groupBy, setGroupBy] = useState<'categoria' | 'area' | 'tipo'>('categoria')
  const level: LevelId = student.preferredLevel || 'basico'

  useEffect(() => setValue(query), [query])

  const doneSlugs = new Set(
    Object.entries(student.lessons).filter(([, progress]) => progress.done.length > 0).map(([slug]) => slug),
  )

  const liveQuery = value.trim()
  const activeQuery = liveQuery || query.trim()
  const words = useMemo(() => normalized(activeQuery).split(/\s+/).filter(Boolean), [activeQuery])
  const found = useMemo(() => searchLessons(course.lessons, activeQuery, 240), [course.lessons, activeQuery])
  const filters = 'filters' in route ? route.filters : {}
  const results = applyFilters(found, filters, doneSlugs)

  const toolMatches = useMemo<ToolPage[]>(() => {
    if (words.length < 1) return course.toolPages.filter((tool) => tool.guide).slice(0, 8)
    return course.toolPages
      .filter((tool) => includesAll(`${tool.label} ${tool.id} ${tool.guide?.plain || ''} ${tool.guide?.matters?.join(' ') || ''}`, words))
      .slice(0, 8)
  }, [course.toolPages, words])

  const promptMatches = useMemo<PromptMatch[]>(() => {
    if (words.length < 2) return []
    return (course.prompts || [])
      .flatMap((family) => family.prompts.map((prompt) => ({ family, prompt })))
      .filter(({ family, prompt }) =>
        includesAll(`${family.title} ${family.intro} ${prompt.name} ${prompt.when} ${prompt.prompt} ${prompt.toolLabel || ''}`, words),
      )
      .slice(0, 8)
  }, [course.prompts, words])

  const glossaryMatches = useMemo<GlossaryEntry[]>(() => {
    if (words.length < 1) return []
    return course.glossaryIndex
      .filter((entry) => includesAll(`${entry.term} ${entry.meaning} ${entry.long || ''} ${entry.seeAlso?.join(' ') || ''}`, words))
      .slice(0, 8)
  }, [course.glossaryIndex, words])

  const guideMatches = useMemo<Guide[]>(() => {
    if (words.length < 1) return []
    return (course.guides || [])
      .filter((guide) =>
        includesAll(`${guide.title} ${guide.kicker} ${guide.intro} ${guide.theory.map((item) => item.text).join(' ')}`, words),
      )
      .slice(0, 6)
  }, [course.guides, words])

  const quickTotal = found.length + toolMatches.length + promptMatches.length + glossaryMatches.length + guideMatches.length

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
        label: 'Menciones sueltas',
        sub: `En ${singles.length} categorías más, con un resultado en cada una`,
        lessons: singles.flatMap((group) => group.lessons),
        link: '',
      })
    } else {
      strong.push(...singles)
    }
    return strong
  }, [results, groupBy, course])

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">Búsqueda</span>
        <h1>Súper búsqueda</h1>
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
              placeholder="Busca lecciones, herramientas, prompts, guías o conceptos…"
              aria-label="Buscar en toda la academia"
              autoFocus
            />
            <button type="submit" className="st-btn">Buscar</button>
          </div>
          <div className="st-super-tags" aria-label="Búsquedas rápidas">
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
          Escribe al menos dos letras, o usa un atajo. La búsqueda mira lecciones, herramientas, prompts, guías y diccionario.
        </p>
      ) : quickTotal === 0 ? (
        <div className="st-empty">
          <h2>Nada para «{activeQuery}»</h2>
          <p>Prueba con un término más corto, o busca por herramienta: n8n, Claude, OpenAI, Docker, RAG o Wispr Flow.</p>
          <a className="st-btn" href={href({ name: 'indice' })}>Ver el índice de conceptos</a>
        </div>
      ) : (
        <>
          <section className="st-search-overview" aria-label="Resumen de búsqueda">
            <div><strong>{found.length}</strong><span>Lecciones</span></div>
            <div><strong>{toolMatches.length}</strong><span>Herramientas</span></div>
            <div><strong>{promptMatches.length}</strong><span>Prompts</span></div>
            <div><strong>{glossaryMatches.length}</strong><span>Conceptos</span></div>
            <div><strong>{guideMatches.length}</strong><span>Guías</span></div>
          </section>

          {(toolMatches.length > 0 || promptMatches.length > 0 || glossaryMatches.length > 0 || guideMatches.length > 0) && (
            <section className="st-search-kind-grid">
              {toolMatches.length > 0 && (
                <div className="st-search-kind">
                  <div className="st-section-head">
                    <div><span className="st-kicker">Herramientas</span><h2>Guías relacionadas</h2></div>
                    <span>{toolMatches.length}</span>
                  </div>
                  {toolMatches.map((tool) => (
                    <SearchHit
                      key={tool.id}
                      icon={<BrandMark icon={tool.icon} size={18} />}
                      title={tool.label}
                      text={tool.guide?.plain || `${tool.count} lecciones asociadas`}
                      href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}
                      meta={`${tool.guide?.prompts?.length || 0} prompts · ${tool.guide?.automations?.length || 0} automatizaciones`}
                    />
                  ))}
                </div>
              )}

              {promptMatches.length > 0 && (
                <div className="st-search-kind">
                  <div className="st-section-head">
                    <div><span className="st-kicker">Prompts</span><h2>Listos para copiar</h2></div>
                    <span>{promptMatches.length}</span>
                  </div>
                  {promptMatches.map(({ prompt, family }) => (
                    <SearchHit
                      key={`${family.id}-${prompt.id || prompt.name}`}
                      icon={<Sparkles size={17} />}
                      title={prompt.name}
                      text={prompt.when}
                      href={href({ name: 'prompts', familyId: family.id })}
                      meta={prompt.toolLabel || family.title}
                    />
                  ))}
                </div>
              )}

              {glossaryMatches.length > 0 && (
                <div className="st-search-kind">
                  <div className="st-section-head">
                    <div><span className="st-kicker">Diccionario</span><h2>Conceptos</h2></div>
                    <span>{glossaryMatches.length}</span>
                  </div>
                  {glossaryMatches.map((entry) => (
                    <SearchHit
                      key={entry.term}
                      icon={<Languages size={17} />}
                      title={entry.term}
                      text={entry.meaning}
                      href={href({ name: 'indice', letter: entry.letter })}
                      meta="Concepto"
                    />
                  ))}
                </div>
              )}

              {guideMatches.length > 0 && (
                <div className="st-search-kind">
                  <div className="st-section-head">
                    <div><span className="st-kicker">Guías</span><h2>Fundamentales</h2></div>
                    <span>{guideMatches.length}</span>
                  </div>
                  {guideMatches.map((guide) => (
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
              Agrupar por
            </span>
            {(['categoria', 'area', 'tipo'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                className={`st-chip${groupBy === mode ? ' on' : ''}`}
                onClick={() => setGroupBy(mode)}
              >
                {mode === 'categoria' ? 'Categoría' : mode === 'area' ? 'Área' : 'Tipo'}
              </button>
            ))}
          </div>

          <p className="st-result-count">
            <strong>{results.length}</strong> {results.length === 1 ? 'lección' : 'lecciones'} para «{activeQuery}»,
            en {groups.length} {groups.length === 1 ? 'grupo' : 'grupos'}.
          </p>

          {!found.length && (
            <p className="st-empty">
              No hay lecciones con ese término, pero sí hay coincidencias en herramientas, prompts, guías o diccionario.
            </p>
          )}

          {groups.slice(0, 12).map((group) => (
            <section key={group.label} style={{ marginBottom: 22 }}>
              <div className="st-section-head" style={{ marginTop: 0 }}>
                <div>
                  {group.sub && <span className="st-kicker">{group.sub}</span>}
                  <h2>{group.label}</h2>
                </div>
                <span>{group.lessons.length} {group.lessons.length === 1 ? 'resultado' : 'resultados'}</span>
                {group.link && <a href={group.link}>Ver la categoría completa</a>}
              </div>
              <div className="st-lesson-rows" style={{ marginTop: 10 }}>
                {group.lessons.map((lesson) => (
                  <LessonRow key={lesson.slug} lesson={lesson} level={level} showCategory={groupBy !== 'categoria'} />
                ))}
              </div>
            </section>
          ))}

          {groups.length > 12 && (
            <p className="st-result-count">
              Y {groups.length - 12} grupos más. Afina con los filtros de arriba o busca un término más concreto.
            </p>
          )}
        </>
      )}
    </div>
  )
}
