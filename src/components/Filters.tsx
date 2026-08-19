import type { Lesson } from '../types'
import { useCourse } from '../course'
import { href, navigate, toggleFilter, type Filters as FilterState, type Route } from '../router'
import { useStudent } from '../store'

/**
 * Barra de filtros combinables.
 *
 * Cada filtro muestra cuántas lecciones quedarían si se aplicara, contando ya
 * los demás filtros activos. Los que dejarían la lista vacía no se muestran:
 * así no hay callejones sin salida.
 */

export function applyFilters(lessons: Lesson[], filters: FilterState, doneSlugs: Set<string>): Lesson[] {
  return lessons.filter((lesson) => {
    if (filters.tool && !lesson.tools.includes(filters.tool)) return false
    if (filters.section && lesson.sectionId !== filters.section) return false
    if (filters.kind && lesson.kind !== filters.kind) return false
    if (filters.stage && lesson.stageId !== filters.stage) return false
    if (filters.done === 'si' && !doneSlugs.has(lesson.slug)) return false
    if (filters.done === 'no' && doneSlugs.has(lesson.slug)) return false
    return true
  })
}

interface Props {
  route: Route
  lessons: Lesson[]
  /** Filtros que no tienen sentido en esta pantalla (p. ej. el área dentro de un área). */
  hide?: (keyof FilterState)[]
}

export default function Filters({ route, lessons, hide = [] }: Props) {
  const course = useCourse()
  const student = useStudent()
  if (!('filters' in route)) return null

  const filters = route.filters
  const doneSlugs = new Set(
    Object.entries(student.lessons).filter(([, progress]) => progress.done.length > 0).map(([slug]) => slug),
  )

  /** Cuántas lecciones quedarían si se activara este valor, con el resto de filtros puestos. */
  const countWith = (key: keyof FilterState, value: string) =>
    applyFilters(lessons, { ...filters, [key]: value }, doneSlugs).length

  const go = (key: keyof FilterState, value: string) => navigate(toggleFilter(route, key, value))

  const rows: { key: keyof FilterState; label: string; options: { value: string; label: string }[] }[] = []

  if (!hide.includes('tool')) {
    const tools = course.toolPages
      .filter((tool) => lessons.some((lesson) => lesson.tools.includes(tool.id)))
      .slice(0, 12)
      .map((tool) => ({ value: tool.id, label: tool.label }))
    if (tools.length > 1) rows.push({ key: 'tool', label: 'Herramienta', options: tools })
  }

  if (!hide.includes('section')) {
    const sections = course.sections
      .filter((section) => lessons.some((lesson) => lesson.sectionId === section.id))
      .map((section) => ({ value: section.id, label: section.label }))
    if (sections.length > 1) rows.push({ key: 'section', label: 'Sección', options: sections })
  }

  if (!hide.includes('kind')) {
    const kinds = Object.entries(course.kinds)
      .filter(([id]) => lessons.some((lesson) => lesson.kind === id))
      .map(([id, meta]) => ({ value: id, label: meta.label }))
    if (kinds.length > 1) rows.push({ key: 'kind', label: 'Tipo', options: kinds })
  }

  if (!hide.includes('stage')) {
    const stages = course.stages
      .filter((stage) => lessons.some((lesson) => lesson.stageId === stage.id))
      .map((stage) => ({ value: stage.id, label: `${stage.number}. ${stage.title}` }))
    if (stages.length > 1) rows.push({ key: 'stage', label: 'Área', options: stages })
  }

  rows.push({
    key: 'done',
    label: 'Estado',
    options: [
      { value: 'no', label: 'Pendientes' },
      { value: 'si', label: 'Empezadas' },
    ],
  })

  const active = Object.keys(filters).length

  if (!rows.length) return null

  return (
    <div className="st-filters">
      {rows.map((row) => (
        <div className="st-filter-row" key={row.key}>
          <span>{row.label}</span>
          {row.options.map((option) => {
            const on = filters[row.key] === option.value
            const count = countWith(row.key, option.value)
            if (!on && count === 0) return null
            return (
              <button
                key={option.value}
                type="button"
                className={`st-chip${on ? ' on' : ''}`}
                onClick={() => go(row.key, option.value)}
                aria-pressed={on}
              >
                {option.label}
                <b>{count}</b>
              </button>
            )
          })}
        </div>
      ))}

      {active > 0 && (
        <div className="st-filter-row">
          <span />
          <a
            className="st-filter-clear"
            href={href({ ...route, filters: {} } as Route)}
          >
            Quitar los {active} filtros
          </a>
        </div>
      )}
    </div>
  )
}
