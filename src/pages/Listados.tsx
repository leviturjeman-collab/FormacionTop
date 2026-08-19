import type { Block, LevelId, Lesson, ToolPage } from '../types'
import { useCourse, useIndexes } from '../course'
import { href, type Route } from '../router'
import { useStudent } from '../store'
import Filters, { applyFilters } from '../components/Filters'
import LessonList from '../components/LessonList'
import { BrandMark } from '../components/Brand'
import Blocks from '../components/Blocks'

/** Progreso de un conjunto de lecciones, contando los tres niveles. */
function useProgressOf(slugs: string[]) {
  const student = useStudent()
  const total = slugs.length * 3
  const done = slugs.reduce((sum, slug) => sum + (student.lessons[slug]?.done.length || 0), 0)
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 }
}

function useDoneSet() {
  const student = useStudent()
  return new Set(
    Object.entries(student.lessons).filter(([, progress]) => progress.done.length > 0).map(([slug]) => slug),
  )
}

/* ------------------------------------------------------------------ *
 * RUTA: las diez áreas                                                *
 * ------------------------------------------------------------------ */

export function Ruta() {
  const course = useCourse()
  const student = useStudent()

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">Itinerario</span>
        <h1>La ruta completa</h1>
        <p>
          Diez áreas en el orden en que se aprende, divididas en {course.stats.categories} categorías.
          Cada lección existe en tres niveles y puedes cambiar de nivel dentro de la propia lección.
        </p>
      </div>

      <div className="st-area-preview">
        <div>
          {course.stages.map((stage) => {
            const total = stage.lessonSlugs.length * 3
            const done = stage.lessonSlugs.reduce((sum, slug) => sum + (student.lessons[slug]?.done.length || 0), 0)
            const percent = total ? Math.round((done / total) * 100) : 0
            return (
              <a key={stage.id} href={href({ name: 'area', stageId: stage.id, filters: {} })}>
                <span>{stage.number}</span>
                <div>
                  <strong>{stage.title}</strong>
                  <small>{stage.tagline} · {stage.categoryIds.length} categorías · {stage.lessonSlugs.length} lecciones</small>
                </div>
                <i><b style={{ width: `${percent}%` }} /></i>
                <b>{percent}%</b>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * ÁREA: sus categorías y, debajo, sus lecciones filtrables            *
 * ------------------------------------------------------------------ */

export function Area({ stageId, route }: { stageId: string; route: Route }) {
  const course = useCourse()
  const { bySlug, stageById } = useIndexes()
  const student = useStudent()
  const doneSlugs = useDoneSet()
  const level: LevelId = student.preferredLevel || 'basico'

  const stage = stageById.get(stageId)
  const progress = useProgressOf(stage?.lessonSlugs || [])

  if (!stage) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>Esa área no existe</h2>
          <a className="st-btn" href={href({ name: 'ruta' })}>Volver a la ruta</a>
        </div>
      </div>
    )
  }

  const categories = course.categories.filter((category) => stage.categoryIds.includes(category.id))
  const all = stage.lessonSlugs.map((slug) => bySlug.get(slug)).filter(Boolean) as Lesson[]
  const filters = 'filters' in route ? route.filters : {}
  const shown = applyFilters(all, filters, doneSlugs)
  const filtering = Object.keys(filters).length > 0

  return (
    <div className="st-page">
      <header className="st-area-head">
        <span>{stage.number}</span>
        <div>
          <span className="st-kicker">{stage.tagline}</span>
          <h1>{stage.title}</h1>
          <p>{stage.description}</p>
          <p><strong>Meta del área:</strong> {stage.milestone}</p>
        </div>
        <div className="st-area-stats">
          <div><strong>{categories.length}</strong><small>categorías</small></div>
          <div><strong>{stage.lessonSlugs.length}</strong><small>lecciones</small></div>
          <div><strong>{progress.percent}%</strong><small>completado</small></div>
        </div>
      </header>

      {(() => {
        const project = (course.projects || []).find((item) => item.stageId === stage.id)
        return project ? (
          <a className="st-project-cta" href={href({ name: 'proyecto', stageId: stage.id })}>
            <span className="st-kicker">Proyecto final del área · {project.time}</span>
            <strong>{project.title}</strong>
            <em>{project.pitch}</em>
          </a>
        ) : null
      })()}

      <div className="st-section-head">
        <h2>Categorías de esta área</h2>
        <span>{categories.length} grupos</span>
      </div>
      <CategoryGrid categoryIds={categories.map((category) => category.id)} />

      <div className="st-section-head">
        <h2>Todas las lecciones del área</h2>
        <span>{shown.length} de {all.length}</span>
      </div>
      <Filters route={route} lessons={all} hide={['stage']} />
      {filtering && <p className="st-result-count">Mostrando <strong>{shown.length}</strong> de {all.length} lecciones.</p>}
      <LessonList lessons={shown} level={level} />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * REJILLA DE CATEGORÍAS                                               *
 * ------------------------------------------------------------------ */

export function CategoryGrid({ categoryIds }: { categoryIds: string[] }) {
  const course = useCourse()
  const student = useStudent()
  const categories = categoryIds
    .map((id) => course.categories.find((category) => category.id === id))
    .filter(Boolean) as typeof course.categories

  if (!categories.length) return <p className="st-empty">Esta área no tiene categorías propias.</p>

  return (
    <div className="st-cat-grid">
      {categories.map((category) => {
        const total = category.lessonSlugs.length * 3
        const done = category.lessonSlugs.reduce((sum, slug) => sum + (student.lessons[slug]?.done.length || 0), 0)
        const percent = total ? Math.round((done / total) * 100) : 0
        return (
          <a key={category.id} className="st-cat-card" href={href({ name: 'categoria', categoryId: category.id, filters: {} })}>
            {category.parentLabel && <small>{category.parentLabel}</small>}
            <strong>{category.label}</strong>
            <span>{category.count} {category.count === 1 ? 'lección' : 'lecciones'} · {Math.round(category.minutes / 60)} h</span>
            <div>
              <i><b style={{ width: `${percent}%` }} /></i>
              <span>{percent}%</span>
            </div>
          </a>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * CATEGORÍA                                                           *
 * ------------------------------------------------------------------ */

export function Categoria({ categoryId, route }: { categoryId: string; route: Route }) {
  const course = useCourse()
  const { bySlug, stageById } = useIndexes()
  const student = useStudent()
  const doneSlugs = useDoneSet()
  const level: LevelId = student.preferredLevel || 'basico'

  const category = course.categories.find((item) => item.id === categoryId)
  const progress = useProgressOf(category?.lessonSlugs || [])

  if (!category) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>Esa categoría no existe</h2>
          <a className="st-btn" href={href({ name: 'ruta' })}>Volver a la ruta</a>
        </div>
      </div>
    )
  }

  const stage = stageById.get(category.stageId)
  const all = category.lessonSlugs.map((slug) => bySlug.get(slug)).filter(Boolean) as Lesson[]
  const filters = 'filters' in route ? route.filters : {}
  const shown = applyFilters(all, filters, doneSlugs)

  return (
    <div className="st-page">
      <header className="st-area-head">
        <span>{stage?.number}</span>
        <div>
          <span className="st-kicker">{category.parentLabel || stage?.title}</span>
          <h1>{category.label}</h1>
          <p><code>{category.key}</code></p>
          {stage && (
            <p>
              Pertenece al área{' '}
              <a href={href({ name: 'area', stageId: stage.id, filters: {} })}>{stage.number}. {stage.title}</a>.
            </p>
          )}
        </div>
        <div className="st-area-stats">
          <div><strong>{category.count}</strong><small>lecciones</small></div>
          <div><strong>{Math.round(category.minutes / 60)} h</strong><small>nivel medio</small></div>
          <div><strong>{progress.percent}%</strong><small>completado</small></div>
        </div>
      </header>

      <Filters route={route} lessons={all} hide={['stage']} />
      <p className="st-result-count">Mostrando <strong>{shown.length}</strong> de {all.length} lecciones.</p>
      <LessonList lessons={shown} level={level} showCategory={false} />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * BIBLIOTECA: las carpetas del vault                                  *
 * ------------------------------------------------------------------ */

export function Biblioteca() {
  const course = useCourse()

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">Consulta</span>
        <h1>Biblioteca</h1>
        <p>
          Las {course.folders.length} carpetas de tu vault, tal y como las tienes organizadas. La ruta es para
          aprender en orden; esto es para encontrar algo concreto cuando ya sabes qué buscas.
        </p>
      </div>

      <div className="st-cat-grid">
        {course.folders.map((folder) => (
          <a key={folder.id} className="st-cat-card" href={href({ name: 'carpeta', folderId: folder.id, filters: {} })}>
            <small>Carpeta</small>
            <strong>{folder.label}</strong>
            <span>{folder.count} {folder.count === 1 ? 'lección' : 'lecciones'}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export function Carpeta({ folderId, route }: { folderId: string; route: Route }) {
  const course = useCourse()
  const { bySlug } = useIndexes()
  const student = useStudent()
  const doneSlugs = useDoneSet()
  const level: LevelId = student.preferredLevel || 'basico'

  const folder = course.folders.find((item) => item.id === folderId)
  if (!folder) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>Esa carpeta no existe</h2>
          <a className="st-btn" href={href({ name: 'biblioteca' })}>Volver a la biblioteca</a>
        </div>
      </div>
    )
  }

  const all = folder.lessonSlugs.map((slug) => bySlug.get(slug)).filter(Boolean) as Lesson[]
  const filters = 'filters' in route ? route.filters : {}
  const shown = applyFilters(all, filters, doneSlugs)

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">Biblioteca</span>
        <h1>{folder.label}</h1>
        <p><code>{folder.folder}</code> · {folder.count} {folder.count === 1 ? 'lección' : 'lecciones'}</p>
      </div>

      <Filters route={route} lessons={all} />
      <p className="st-result-count">Mostrando <strong>{shown.length}</strong> de {all.length} lecciones.</p>
      <LessonList lessons={shown} level={level} />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * HERRAMIENTAS                                                        *
 * ------------------------------------------------------------------ */

export function Herramientas() {
  const course = useCourse()

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">Por herramienta</span>
        <h1>Herramientas del curso</h1>
        <p>
          Todo lo que la academia enseña sobre cada herramienta, reunido en un sitio. Útil cuando la pregunta
          no es «¿por dónde sigo?» sino «¿qué sabe este curso sobre n8n?».
        </p>
      </div>

      <div className="st-tool-grid">
        {course.toolPages.map((tool) => (
          <a key={tool.id} className="st-tool-card" href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}>
            <BrandMark icon={tool.icon} size={24} />
            <div>
              <strong>{tool.label}</strong>
              <span>{tool.count} {tool.count === 1 ? 'lección' : 'lecciones'} · {tool.stageIds.length} áreas</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export function Herramienta({ toolId, route }: { toolId: string; route: Route }) {
  const course = useCourse()
  const { bySlug } = useIndexes()
  const student = useStudent()
  const doneSlugs = useDoneSet()
  const level: LevelId = student.preferredLevel || 'basico'

  const tool = course.toolPages.find((item) => item.id === toolId)
  if (!tool) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>Esa herramienta no está en el curso</h2>
          <a className="st-btn" href={href({ name: 'herramientas' })}>Ver todas</a>
        </div>
      </div>
    )
  }

  const all = tool.lessonSlugs.map((slug) => bySlug.get(slug)).filter(Boolean) as Lesson[]
  const filters = 'filters' in route ? route.filters : {}
  const shown = applyFilters(all, filters, doneSlugs)
  const progress = useProgressOf(tool.lessonSlugs)

  return (
    <div className="st-page">
      <header className="st-area-head">
        <span><BrandMark icon={tool.icon} size={40} /></span>
        <div>
          <span className="st-kicker">Herramienta</span>
          <h1>{tool.label}</h1>
          <p>Todo lo que el curso cubre sobre {tool.label}, repartido en {tool.stageIds.length} áreas.</p>
        </div>
        <div className="st-area-stats">
          <div><strong>{tool.count}</strong><small>lecciones</small></div>
          <div><strong>{progress.percent}%</strong><small>completado</small></div>
        </div>
      </header>

      {tool.guide && (
        <>
          <div className="st-section-head">
            <div>
              <span className="st-kicker">Empieza aquí</span>
              <h2>Todo lo que necesitas para arrancar</h2>
            </div>
          </div>
          <Blocks blocks={guideBlocks(tool.guide, tool.label)} />
        </>
      )}

      <div className="st-section-head">
        <h2>Lecciones sobre {tool.label}</h2>
        <span>{shown.length} de {all.length}</span>
      </div>
      <Filters route={route} lessons={all} hide={['tool']} />
      <LessonList lessons={shown} level={level} />
    </div>
  )
}

/** La guía de la herramienta, con los mismos bloques que usan las lecciones. */
function guideBlocks(guide: NonNullable<ToolPage['guide']>, label: string): Block[] {
  const blocks: Block[] = [
    { kind: 'idea', title: `Qué es ${label}, sin tecnicismos`, text: guide.plain },
    {
      kind: 'cuenta',
      title: 'Cómo crear tu cuenta, paso a paso',
      account: {
        url: guide.account.url,
        free: guide.account.free,
        steps: guide.account.steps.map(([paso, como]) => `${paso} — ${como}`),
        warning: guide.account.warning,
      },
    },
    {
      kind: 'primeros',
      title: 'Lo primero que tienes que hacer dentro',
      text: 'En este orden. Cada paso te prepara para el siguiente.',
      items: guide.first,
    },
    {
      kind: 'palabras',
      title: 'Las palabras que vas a leer, en cristiano',
      text: 'Ninguna es tan complicada como suena.',
      items: guide.words.map(([term, meaning]) => ({ term, meaning })),
    },
    {
      kind: 'importa',
      title: 'Lo que importa y lo que no',
      text: 'Lo de la izquierda te va a costar tiempo o dinero si lo ignoras. Lo de la derecha te lo puedes saltar entero mientras aprendes.',
      matters: guide.matters,
      ignore: guide.ignore,
    },
  ]
  return blocks
}
