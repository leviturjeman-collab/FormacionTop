import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { LevelId, Lesson } from '../types'
import { searchLessons, useCourse } from '../course'
import { href, navigate, type Route } from '../router'
import { useStudent } from '../store'
import Filters, { applyFilters } from '../components/Filters'
import { LessonRow } from '../components/LessonList'

/**
 * Búsqueda con resultados agrupados.
 *
 * Buscar "n8n" en una lista plana devuelve cien filas indistinguibles. Aquí los
 * resultados se agrupan por categoría, con el recuento de cada grupo, para que
 * se vea de un vistazo dónde vive lo que buscas.
 */
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

  const found = useMemo(() => searchLessons(course.lessons, query, 240), [course.lessons, query])
  const filters = 'filters' in route ? route.filters : {}
  const results = applyFilters(found, filters, doneSlugs)

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
        <h1>Buscar en el curso</h1>
        <form
          className="st-filters"
          onSubmit={(event) => {
            event.preventDefault()
            navigate({ name: 'buscar', query: value, filters })
          }}
        >
          <div className="st-filter-row">
            <Search size={14} />
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="n8n, RAG, seguridad, Claude Code…"
              aria-label="Buscar lecciones"
              autoFocus
              style={{ flex: 1, minWidth: 180, border: 0, background: 'none', outline: 'none', fontSize: 11 }}
            />
            <button type="submit" className="st-btn">Buscar</button>
          </div>
        </form>
      </div>

      {query.trim().length < 2 ? (
        <p className="st-empty">
          Escribe al menos dos letras. Se busca en títulos, conceptos y herramientas de las {course.stats.lessons} lecciones.
        </p>
      ) : !found.length ? (
        <div className="st-empty">
          <h2>Nada para «{query}»</h2>
          <p>Prueba con un término más corto, o busca por herramienta: n8n, Claude, OpenAI, Docker, RAG.</p>
          <a className="st-btn" href={href({ name: 'indice' })}>Ver el índice de conceptos</a>
        </div>
      ) : (
        <>
          <Filters route={route} lessons={found} />

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
            <strong>{results.length}</strong> {results.length === 1 ? 'resultado' : 'resultados'} para «{query}»,
            en {groups.length} {groups.length === 1 ? 'grupo' : 'grupos'}.
          </p>

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
