import { useState } from 'react'
import { ArrowRight, Check, ChevronDown, Clipboard, Search, X } from 'lucide-react'
import type { Block, LevelId, Lesson, ToolAutomation, ToolGuide, ToolPage } from '../types'
import { useCourse, useIndexes } from '../course'
import { href, type Route } from '../router'
import { useStudent } from '../store'
import { useLocale, type Locale } from '../i18n'
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
  const locale = useLocale()

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">{locale === 'en' ? 'Itinerary' : 'Itinerario'}</span>
        <h1>{locale === 'en' ? 'The full path' : 'La ruta completa'}</h1>
        <p>
          {locale === 'en'
            ? <>Ten areas in the order you learn them, split into {course.stats.categories} categories. Every lesson exists at three levels, and you can switch levels within the lesson itself.</>
            : <>Diez áreas en el orden en que se aprende, divididas en {course.stats.categories} categorías. Cada lección existe en tres niveles y puedes cambiar de nivel dentro de la propia lección.</>}
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
                  <small>{stage.tagline} · {stage.categoryIds.length} {locale === 'en' ? 'categories' : 'categorías'} · {stage.lessonSlugs.length} {locale === 'en' ? 'lessons' : 'lecciones'}</small>
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
  const locale = useLocale()

  const stage = stageById.get(stageId)
  const progress = useProgressOf(stage?.lessonSlugs || [])

  if (!stage) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>{locale === 'en' ? "That area doesn't exist" : 'Esa área no existe'}</h2>
          <a className="st-btn" href={href({ name: 'ruta' })}>{locale === 'en' ? 'Back to the path' : 'Volver a la ruta'}</a>
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
          <p><strong>{locale === 'en' ? 'Area goal:' : 'Meta del área:'}</strong> {stage.milestone}</p>
        </div>
        <div className="st-area-stats">
          <div><strong>{categories.length}</strong><small>{locale === 'en' ? 'categories' : 'categorías'}</small></div>
          <div><strong>{stage.lessonSlugs.length}</strong><small>{locale === 'en' ? 'lessons' : 'lecciones'}</small></div>
          <div><strong>{progress.percent}%</strong><small>{locale === 'en' ? 'complete' : 'completado'}</small></div>
        </div>
      </header>

      {(() => {
        const project = (course.projects || []).find((item) => item.stageId === stage.id)
        return project ? (
          <a className="st-project-cta" href={href({ name: 'proyecto', stageId: stage.id })}>
            <span className="st-kicker">{locale === 'en' ? 'Final area project' : 'Proyecto final del área'} · {project.time}</span>
            <strong>{project.title}</strong>
            <em>{project.pitch}</em>
          </a>
        ) : null
      })()}

      <div className="st-section-head">
        <h2>{locale === 'en' ? 'Categories in this area' : 'Categorías de esta área'}</h2>
        <span>{categories.length} {locale === 'en' ? 'groups' : 'grupos'}</span>
      </div>
      <CategoryGrid categoryIds={categories.map((category) => category.id)} />

      <div className="st-section-head">
        <h2>{locale === 'en' ? 'All lessons in the area' : 'Todas las lecciones del área'}</h2>
        <span>{shown.length} {locale === 'en' ? 'of' : 'de'} {all.length}</span>
      </div>
      <Filters route={route} lessons={all} hide={['stage']} />
      {filtering && <p className="st-result-count">{locale === 'en' ? <>Showing <strong>{shown.length}</strong> of {all.length} lessons.</> : <>Mostrando <strong>{shown.length}</strong> de {all.length} lecciones.</>}</p>}
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
  const locale = useLocale()
  const categories = categoryIds
    .map((id) => course.categories.find((category) => category.id === id))
    .filter(Boolean) as typeof course.categories

  if (!categories.length) return <p className="st-empty">{locale === 'en' ? 'This area has no categories of its own.' : 'Esta área no tiene categorías propias.'}</p>

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
            <span>{category.count} {locale === 'en' ? (category.count === 1 ? 'lesson' : 'lessons') : (category.count === 1 ? 'lección' : 'lecciones')} · {Math.round(category.minutes / 60)} h</span>
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
  const locale = useLocale()

  const category = course.categories.find((item) => item.id === categoryId)
  const progress = useProgressOf(category?.lessonSlugs || [])

  if (!category) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>{locale === 'en' ? "That category doesn't exist" : 'Esa categoría no existe'}</h2>
          <a className="st-btn" href={href({ name: 'ruta' })}>{locale === 'en' ? 'Back to the path' : 'Volver a la ruta'}</a>
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
              {locale === 'en' ? 'Part of the ' : 'Pertenece al área'}{' '}
              <a href={href({ name: 'area', stageId: stage.id, filters: {} })}>{stage.number}. {stage.title}</a>{locale === 'en' ? ' area' : ''}.
            </p>
          )}
        </div>
        <div className="st-area-stats">
          <div><strong>{category.count}</strong><small>{locale === 'en' ? 'lessons' : 'lecciones'}</small></div>
          <div><strong>{Math.round(category.minutes / 60)} h</strong><small>{locale === 'en' ? 'average level' : 'nivel medio'}</small></div>
          <div><strong>{progress.percent}%</strong><small>{locale === 'en' ? 'complete' : 'completado'}</small></div>
        </div>
      </header>

      <Filters route={route} lessons={all} hide={['stage']} />
      <p className="st-result-count">{locale === 'en' ? <>Showing <strong>{shown.length}</strong> of {all.length} lessons.</> : <>Mostrando <strong>{shown.length}</strong> de {all.length} lecciones.</>}</p>
      <LessonList lessons={shown} level={level} showCategory={false} />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * BIBLIOTECA: las carpetas del vault                                  *
 * ------------------------------------------------------------------ */

export function Biblioteca() {
  const course = useCourse()
  const locale = useLocale()

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">{locale === 'en' ? 'Reference' : 'Consulta'}</span>
        <h1>{locale === 'en' ? 'Library' : 'Biblioteca'}</h1>
        <p>
          {locale === 'en'
            ? <>The {course.folders.length} folders of your vault, organized exactly as you have them. The path is for learning in order; this is for finding something specific once you already know what you're looking for.</>
            : <>Las {course.folders.length} carpetas de tu vault, tal y como las tienes organizadas. La ruta es para aprender en orden; esto es para encontrar algo concreto cuando ya sabes qué buscas.</>}
        </p>
      </div>

      <div className="st-cat-grid">
        {course.folders.map((folder) => (
          <a key={folder.id} className="st-cat-card" href={href({ name: 'carpeta', folderId: folder.id, filters: {} })}>
            <small>{locale === 'en' ? 'Folder' : 'Carpeta'}</small>
            <strong>{folder.label}</strong>
            <span>{folder.count} {locale === 'en' ? (folder.count === 1 ? 'lesson' : 'lessons') : (folder.count === 1 ? 'lección' : 'lecciones')}</span>
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
  const locale = useLocale()

  const folder = course.folders.find((item) => item.id === folderId)
  if (!folder) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>{locale === 'en' ? "That folder doesn't exist" : 'Esa carpeta no existe'}</h2>
          <a className="st-btn" href={href({ name: 'biblioteca' })}>{locale === 'en' ? 'Back to the library' : 'Volver a la biblioteca'}</a>
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
        <span className="st-kicker">{locale === 'en' ? 'Library' : 'Biblioteca'}</span>
        <h1>{folder.label}</h1>
        <p><code>{folder.folder}</code> · {folder.count} {locale === 'en' ? (folder.count === 1 ? 'lesson' : 'lessons') : (folder.count === 1 ? 'lección' : 'lecciones')}</p>
      </div>

      <Filters route={route} lessons={all} />
      <p className="st-result-count">{locale === 'en' ? <>Showing <strong>{shown.length}</strong> of {all.length} lessons.</> : <>Mostrando <strong>{shown.length}</strong> de {all.length} lecciones.</>}</p>
      <LessonList lessons={shown} level={level} />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * HERRAMIENTAS                                                        *
 * ------------------------------------------------------------------ */

export function Herramientas() {
  const course = useCourse()
  const locale = useLocale()

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">{locale === 'en' ? 'By tool' : 'Por herramienta'}</span>
        <h1>{locale === 'en' ? 'Course tools' : 'Herramientas del curso'}</h1>
        <p>
          {locale === 'en'
            ? 'Everything the academy teaches about each tool, gathered in one place. Useful when the question isn\'t "what comes next?" but "what does this course know about n8n?".'
            : 'Todo lo que la academia enseña sobre cada herramienta, reunido en un sitio. Útil cuando la pregunta no es «¿por dónde sigo?» sino «¿qué sabe este curso sobre n8n?».'}
        </p>
      </div>

      <div className="st-tool-grid">
        {course.toolPages.map((tool) => {
          const escritas = tool.itinerary?.length || 0
          const promptCount = tool.guide?.prompts?.length || 0
          const automationCount = tool.guide?.automations?.length || 0
          return (
            <a key={tool.id} className="st-tool-card" href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}>
              <BrandMark icon={tool.icon} size={24} />
              <div>
                <strong>{tool.label}</strong>
                {tool.guide ? (
                  <span>
                    {locale === 'en'
                      ? [
                          tool.count ? `${tool.count} lessons` : '',
                          promptCount ? `${promptCount} prompts` : '',
                          automationCount ? `${automationCount} automations` : '',
                          tool.count || promptCount || automationCount ? 'full guide' : 'manual guide',
                        ].filter(Boolean).join(' · ')
                      : [
                          tool.count ? `${tool.count} lecciones` : '',
                          promptCount ? `${promptCount} prompts` : '',
                          automationCount ? `${automationCount} automatizaciones` : '',
                          tool.count || promptCount || automationCount ? 'guía completa' : 'guía manual',
                        ].filter(Boolean).join(' · ')}
                  </span>
                ) : escritas > 0 ? (
                  <span className="st-tool-itinerary">{locale === 'en' ? 'Itinerary' : 'Itinerario'} · {escritas} {locale === 'en' ? 'lessons' : 'lecciones'}</span>
                ) : (
                  <span>{tool.count} {locale === 'en' ? 'lessons selected' : 'lecciones seleccionadas'}</span>
                )}
              </div>
            </a>
          )
        })}
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
  const locale = useLocale()

  const tool = course.toolPages.find((item) => item.id === toolId)
  if (!tool) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>{locale === 'en' ? "That tool isn't in the course" : 'Esa herramienta no está en el curso'}</h2>
          <a className="st-btn" href={href({ name: 'herramientas' })}>{locale === 'en' ? 'See all' : 'Ver todas'}</a>
        </div>
      </div>
    )
  }

  const all = tool.lessonSlugs.map((slug) => bySlug.get(slug)).filter(Boolean) as Lesson[]
  const totalAvailable = tool.totalCount ?? tool.count
  const hiddenCount = Math.max(0, totalAvailable - tool.count)
  const filters = 'filters' in route ? route.filters : {}
  const shown = applyFilters(all, filters, doneSlugs)
  const progress = useProgressOf(tool.lessonSlugs)
  const promptCount = tool.guide?.prompts?.length || 0
  const automationCount = tool.guide?.automations?.length || 0
  const toolMapItems = [
    {
      id: 'guia-herramienta',
      title: locale === 'en' ? 'Quick guide' : 'Guía rápida',
      detail: locale === 'en' ? "What it is, what it's for, and what not to touch yet." : 'Qué es, para qué sirve y qué no debes tocar todavía.',
    },
    ...(all.length ? [{
      id: 'lecciones-herramienta',
      title: locale === 'en' ? 'Lessons' : 'Lecciones',
      detail: locale === 'en'
        ? `${tool.count} selected${hiddenCount ? ` of ${totalAvailable}` : ''}`
        : `${tool.count} seleccionadas${hiddenCount ? ` de ${totalAvailable}` : ''}`,
    }] : []),
    ...(promptCount ? [{
      id: 'prompts-herramienta',
      title: 'Prompts',
      detail: locale === 'en' ? `${promptCount} ready to copy` : `${promptCount} listos para copiar`,
    }] : []),
    ...(automationCount ? [{
      id: 'automatizaciones',
      title: locale === 'en' ? 'Automations' : 'Automatizaciones',
      detail: locale === 'en' ? `${automationCount} explained flows` : `${automationCount} flujos explicados`,
    }] : []),
  ]
  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="st-page">
      <header className="st-area-head">
        <span><BrandMark icon={tool.icon} size={40} /></span>
        <div>
          <span className="st-kicker">{locale === 'en' ? 'Tool' : 'Herramienta'}</span>
          <h1>{tool.label}</h1>
          <p>
            {locale === 'en'
              ? (tool.count
                  ? `The essentials of ${tool.label}, curated into up to ${tool.maxLessons || 25} reference lessons.`
                  : `${tool.label} works as a manual reference tool: first you understand what it does, then you use it only when it helps your real work.`)
              : (tool.count
                  ? `Lo esencial de ${tool.label}, curado en un máximo de ${tool.maxLessons || 25} lecciones de consulta.`
                  : `${tool.label} funciona como herramienta manual de consulta: primero entiendes qué hace y después la usas solo cuando te ayuda en tu trabajo real.`)}
            {hiddenCount ? (locale === 'en'
              ? ` There are ${hiddenCount} more internal mentions, but they aren't shown here to avoid an endless list.`
              : ` Hay ${hiddenCount} menciones internas más, pero no se muestran aquí para no crear una lista interminable.`) : ''}
          </p>
        </div>
        <div className="st-area-stats">
          {tool.count ? (
            <>
              <div><strong>{tool.count}</strong><small>{locale === 'en' ? 'selected' : 'seleccionadas'}</small></div>
              <div><strong>{progress.percent}%</strong><small>{locale === 'en' ? 'complete' : 'completado'}</small></div>
            </>
          ) : (
            <>
              <div><strong>{locale === 'en' ? 'Manual' : 'Manual'}</strong><small>{locale === 'en' ? 'guided use' : 'uso guiado'}</small></div>
              <div><strong>{automationCount}</strong><small>{locale === 'en' ? 'automations' : 'automatizaciones'}</small></div>
            </>
          )}
        </div>
      </header>

      <section className="st-tool-map" aria-label={locale === 'en' ? `Map of ${tool.label}` : `Mapa de ${tool.label}`}>
        {toolMapItems.map((item, index) => (
          <button key={item.id} type="button" onClick={() => jumpTo(item.id)}>
            <span>{index + 1}</span>
            <strong>{item.title}</strong>
            <small>{item.detail}</small>
          </button>
        ))}
      </section>

      {tool.guide && (
        <section id="guia-herramienta" className="st-tool-guide">
          <div className="st-section-head">
            <div>
              <span className="st-kicker">{locale === 'en' ? 'Start here' : 'Empieza aquí'}</span>
              <h2>{locale === 'en' ? 'Understand the tool first' : 'Primero entiende la herramienta'}</h2>
            </div>
          </div>
          <Blocks blocks={guideBlocks(tool.guide, tool.label, locale)} />
        </section>
      )}

      {all.length > 0 && (
        <section id="lecciones-herramienta" className="st-tool-lessons">
          <div className="st-section-head">
            <div>
              <span className="st-kicker">{locale === 'en' ? `Lessons inside ${tool.label}` : `Lecciones dentro de ${tool.label}`}</span>
              <h2>{locale === 'en' ? 'Study only these pieces' : 'Estudia solo estas piezas'}</h2>
              <p className="st-tool-inside-intro">
                {locale === 'en'
                  ? <>These aren't another mandatory path. They're the lessons selected to help you understand {tool.label} whenever your project needs it.</>
                  : <>No son otra ruta obligatoria. Son las lecciones seleccionadas para entender {tool.label} cuando tu proyecto la necesite.</>}
              </p>
            </div>
            <span>{shown.length} {locale === 'en' ? 'of' : 'de'} {all.length}{hiddenCount ? (locale === 'en' ? ` · ${hiddenCount} saved outside` : ` · ${hiddenCount} guardadas fuera`) : ''}</span>
          </div>
          <Filters route={route} lessons={all} hide={['tool']} />
          <LessonList lessons={shown} level={level} />
        </section>
      )}

      {tool.guide && <ToolInside guide={tool.guide} label={tool.label} toolId={tool.id} />}

      <ToolConnections tool={tool.id} />
    </div>
  )
}

/** La guía de la herramienta, con los mismos bloques que usan las lecciones. */
function guideBlocks(guide: NonNullable<ToolPage['guide']>, label: string, locale: Locale): Block[] {
  const en = locale === 'en'
  const blocks: Block[] = [
    { kind: 'idea', title: en ? `What ${label} is, without jargon` : `Qué es ${label}, sin tecnicismos`, text: guide.plain },
    {
      kind: 'primeros',
      title: en ? 'The first things to do inside' : 'Lo primero que tienes que hacer dentro',
      text: en ? 'In this order. Each step prepares you for the next.' : 'En este orden. Cada paso te prepara para el siguiente.',
      items: guide.first,
    },
    {
      kind: 'palabras',
      title: en ? "The words you'll read, in plain language" : 'Las palabras que vas a leer, en cristiano',
      text: en ? "None of them are as complicated as they sound." : 'Ninguna es tan complicada como suena.',
      items: guide.words.map(([term, meaning]) => ({ term, meaning })),
    },
    {
      kind: 'importa',
      title: en ? "What matters and what doesn't" : 'Lo que importa y lo que no',
      text: en
        ? 'The left column will cost you time or money if you ignore it. The right column you can skip entirely while you learn.'
        : 'Lo de la izquierda te va a costar tiempo o dinero si lo ignoras. Lo de la derecha te lo puedes saltar entero mientras aprendes.',
      matters: guide.matters,
      ignore: guide.ignore,
    },
  ]

  // Las secciones nuevas: atajos, lo del día a día, plantillas listas,
  // errores frecuentes y prompts propios de la herramienta.
  if (guide.shortcuts?.length) {
    blocks.push({
      kind: 'palabras',
      title: en ? "Shortcuts and buttons you'll use every day" : 'Atajos y botones que vas a usar cada día',
      items: guide.shortcuts.map(([term, meaning]) => ({ term, meaning })),
    })
  }

  if (guide.daily?.length) {
    blocks.push({
      kind: 'comprobar',
      title: en ? `The 20% of ${label} that solves 80% of the work` : `El 20% de ${label} que resuelve el 80% del trabajo`,
      items: guide.daily,
    })
  }

  for (const template of guide.templates || []) {
    blocks.push({
      kind: 'receta',
      title: en ? `Ready to use: ${template.name}` : `Listo para usar: ${template.name}`,
      text: `${template.what} ${template.how}`,
      code: template.code,
      lang: 'json',
      lines: template.fill,
    })
  }

  if (guide.errors?.length) {
    blocks.push({
      kind: 'palabras',
      title: en ? "Errors you'll run into, with the fix" : 'Errores que te vas a encontrar, con su arreglo',
      items: guide.errors.map(([term, meaning]) => ({ term, meaning })),
    })
  }

  blocks.push({
    kind: 'comprobar',
    title: en ? `Checklist before using ${label} on a real project` : `Checklist antes de usar ${label} en un proyecto real`,
    items: en
      ? [
        `I know which problem ${label} solves and which it doesn't.`,
        'I tested first with fake data or a copy.',
        'I know where to look at the result, the history, or the error.',
        "I'm clear on how to stop it, undo it, or recover a copy.",
        'I checked permissions, privacy and commercial use.',
        'I noted how the cost is measured before repeating it many times.',
      ]
      : [
        `Sé qué problema resuelve ${label} y cuál no.`,
        'He probado primero con datos ficticios o una copia.',
        'Sé dónde mirar el resultado, el historial o el error.',
        'Tengo claro cómo detenerlo, deshacerlo o recuperar una copia.',
        'He comprobado permisos, privacidad y uso comercial.',
        'He apuntado cómo se mide el coste antes de repetirlo muchas veces.',
      ],
  })

  blocks.push({
    kind: 'coste',
    title: en ? 'Price, credits, tasks and tokens' : 'Precio, créditos, tareas y tokens',
    text: usageText(guide, label, locale),
    items: usageItems(guide, label, locale),
  })

  blocks.push({
    kind: 'cuenta',
    title: en ? 'Account, plan and access' : 'Cuenta, plan y acceso',
    account: {
      url: guide.account.url,
      free: guide.account.free,
      steps: guide.account.steps.map(([paso, como]) => `${paso} — ${como}`),
      warning: guide.account.warning,
    },
  })

  return blocks
}

function ToolInside({ guide, label, toolId }: { guide: ToolGuide; label: string; toolId: string }) {
  const [selected, setSelected] = useState<NonNullable<ToolGuide['catalog']>['items'][number] | null>(null)
  const locale = useLocale()

  function jumpToAutomations() {
    setSelected(null)
    window.setTimeout(() => {
      document.getElementById('automatizaciones')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }

  return (
    <>
      {guide.catalog?.items?.length ? (
        <section className="st-tool-inside" id="piezas">
          <div className="st-section-head">
            <div><span className="st-kicker">{locale === 'en' ? `Inside ${label}` : `Dentro de ${label}`}</span><h2>{locale === 'en' ? "What's here and when to use it" : 'Qué hay aquí y cuándo usarlo'}</h2></div>
            <span>{guide.catalog.items.length} {locale === 'en' ? 'pieces explained' : 'piezas explicadas'}</span>
          </div>
          <p className="st-tool-inside-intro">{guide.catalog.intro}</p>
          <div className="st-inside-grid">
            {guide.catalog.items.map((item) => (
              <button key={`${item.group}-${item.name}`} type="button" className="st-inside-card" onClick={() => setSelected(item)}>
                <span>{item.group}</span>
                <h3>{item.name}</h3>
                <p>{item.what}</p>
                <div><strong>{locale === 'en' ? 'Use it when' : 'Úsalo cuando'}</strong><p>{item.useWhen}</p></div>
                <em className="st-card-action">{locale === 'en' ? 'Open card' : 'Abrir ficha'}</em>
              </button>
            ))}
          </div>
          {selected && (
            <div className="st-focus-modal" role="dialog" aria-modal="true" aria-label={locale === 'en' ? `Card for ${selected.name}` : `Ficha de ${selected.name}`}>
              <button type="button" className="st-focus-backdrop" onClick={() => setSelected(null)} aria-label={locale === 'en' ? 'Close' : 'Cerrar'} />
              <article className="st-focus-sheet">
                <header>
                  <div>
                    <span className="st-kicker">{selected.group} · {label}</span>
                    <h3>{selected.name}</h3>
                    <p>{selected.what}</p>
                  </div>
                  <button type="button" className="st-icon-close" onClick={() => setSelected(null)} aria-label={locale === 'en' ? 'Close card' : 'Cerrar ficha'}><X size={16} /></button>
                </header>
                <dl className="st-focus-dl">
                  <div><dt>{locale === 'en' ? 'Use it when' : 'Úsalo cuando'}</dt><dd>{selected.useWhen}</dd></div>
                  {selected.model && <div><dt>{locale === 'en' ? 'How to choose' : 'Cómo elegir'}</dt><dd>{selected.model}</dd></div>}
                  {selected.avoidWhen && <div><dt>{locale === 'en' ? "Don't use it like this" : 'No lo uses así'}</dt><dd>{selected.avoidWhen}</dd></div>}
                </dl>
                <div className="st-focus-actions">
                  {guide.prompts?.length ? <a className="st-btn" href={`#/prompts/herramienta-${encodeURIComponent(toolId)}`}>{locale === 'en' ? `See ${label} prompts` : `Ver prompts de ${label}`}</a> : null}
                  {guide.automations?.length ? <button type="button" className="st-btn-ghost" onClick={jumpToAutomations}>{locale === 'en' ? 'See automations' : 'Ver automatizaciones'}</button> : null}
                </div>
              </article>
            </div>
          )}
        </section>
      ) : null}
      {guide.prompts?.length ? <ToolPromptLibrary prompts={guide.prompts} label={label} /> : null}
      {guide.automations?.length ? <AutomationLibrary automations={guide.automations} label={label} /> : null}
    </>
  )
}

type ToolPrompt = NonNullable<ToolGuide['prompts']>[number]

function ToolPromptLibrary({ prompts, label }: { prompts: ToolPrompt[]; label: string }) {
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [copied, setCopied] = useState(false)
  const filtered = prompts.filter((prompt) => {
    const needle = query.trim().toLowerCase()
    if (!needle) return true
    return `${prompt.name} ${prompt.when || ''} ${prompt.model || ''} ${prompt.prompt}`.toLowerCase().includes(needle)
  })
  const active = filtered[Math.min(selected, Math.max(0, filtered.length - 1))] || filtered[0] || prompts[0]

  function copyPrompt() {
    if (!active?.prompt) return
    navigator.clipboard?.writeText(active.prompt)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <section className={`st-tool-prompts${open ? ' open' : ''}`} id="prompts-herramienta">
      <button type="button" className="st-tool-prompts-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span>
          <small>{locale === 'en' ? `${label} prompts` : `Prompts de ${label}`}</small>
          <strong>{prompts.length} {locale === 'en' ? 'prompts ready to copy' : 'prompts listos para copiar'}</strong>
        </span>
        <span>{locale === 'en' ? (open ? 'Hide' : 'Open') : (open ? 'Ocultar' : 'Abrir')} <ChevronDown size={14} /></span>
      </button>
      {open && (
        <div className="st-tool-prompts-panel">
          <aside>
            <label className="st-tool-prompt-search">
              <Search size={13} />
              <input value={query} onChange={(event) => { setQuery(event.target.value); setSelected(0) }} placeholder={locale === 'en' ? 'Filter prompts...' : 'Filtrar prompts...'} />
            </label>
            <div className="st-tool-prompt-list">
              {filtered.map((prompt, index) => (
                <button key={`${prompt.name}-${index}`} type="button" className={prompt === active ? 'on' : ''} onClick={() => setSelected(index)}>
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  <span>{prompt.name}</span>
                </button>
              ))}
              {!filtered.length && <p>{locale === 'en' ? 'No prompts match that filter.' : 'No hay prompts con ese filtro.'}</p>}
            </div>
          </aside>
          {active && (
            <article className="st-tool-prompt-detail">
              <header>
                <div>
                  <span className="st-kicker">{locale === 'en' ? 'Selected prompt' : 'Prompt seleccionado'}</span>
                  <h3>{active.name}</h3>
                  {(active.when || active.model) && <p>{[active.when, active.model ? (locale === 'en' ? `Recommended choice: ${active.model}.` : `Elección recomendada: ${active.model}.`) : ''].filter(Boolean).join(' ')}</p>}
                </div>
                <button type="button" className="st-btn" onClick={copyPrompt}>
                  {copied ? <Check size={13} /> : <Clipboard size={13} />}
                  {locale === 'en' ? (copied ? 'Copied' : 'Copy') : (copied ? 'Copiado' : 'Copiar')}
                </button>
              </header>
              <details>
                <summary>{locale === 'en' ? 'View the full prompt' : 'Ver el prompt completo'}</summary>
                <pre><code>{active.prompt}</code></pre>
              </details>
              <div className="st-tool-prompt-help">
                <strong>{locale === 'en' ? 'How to use it' : 'Cómo usarlo'}</strong>
                <span>{locale === 'en'
                  ? 'Copy it in full, fill in the placeholders in brackets, and paste it into ChatGPT, Claude, or Gemini. Check anything important before using real data.'
                  : 'Cópialo entero, rellena los huecos entre corchetes y pégalo en ChatGPT, Claude o Gemini. Lo importante se comprueba antes de usar datos reales.'}</span>
              </div>
            </article>
          )}
        </div>
      )}
    </section>
  )
}

function AutomationLibrary({ automations, label }: { automations: ToolAutomation[]; label: string }) {
  const [selected, setSelected] = useState<ToolAutomation | null>(null)
  const locale = useLocale()
  return (
    <section className="st-automation-library" id="automatizaciones">
      <div className="st-section-head">
        <div><span className="st-kicker">{locale === 'en' ? 'Flows inside the tool' : 'Flujos dentro de la herramienta'}</span><h2>{locale === 'en' ? `Automations you can build with ${label}` : `Automatizaciones que puedes construir con ${label}`}</h2></div>
        <span>{automations.length} {locale === 'en' ? 'walkthroughs' : 'recorridos'}</span>
      </div>
      <p className="st-tool-inside-intro">{locale === 'en'
        ? 'Every walkthrough has a trigger, a validation step, an observable action, and a recovery path. Real connections need your own credentials and are tested first with fake data.'
        : 'Cada recorrido tiene un disparador, una validación, una acción observable y una ruta de recuperación. Las conexiones reales necesitan tus propias credenciales y primero se prueban con datos ficticios.'}</p>
      <div className="st-automation-grid">
        {automations.map((automation) => <AutomationCard key={automation.name} automation={automation} onOpen={() => setSelected(automation)} />)}
      </div>
      {selected && (
        <div className="st-focus-modal" role="dialog" aria-modal="true" aria-label={locale === 'en' ? `Automation ${selected.name}` : `Automatización ${selected.name}`}>
          <button type="button" className="st-focus-backdrop" onClick={() => setSelected(null)} aria-label={locale === 'en' ? 'Close' : 'Cerrar'} />
          <article className="st-focus-sheet st-focus-sheet-wide">
            <header>
              <div>
                <span className="st-kicker">{selected.difficulty} · {selected.platform}</span>
                <h3>{selected.name}</h3>
                <p>{selected.goal}</p>
              </div>
              <button type="button" className="st-icon-close" onClick={() => setSelected(null)} aria-label={locale === 'en' ? 'Close automation' : 'Cerrar automatización'}><X size={16} /></button>
            </header>
            <dl className="st-focus-dl">
              <div><dt>{locale === 'en' ? 'Trigger' : 'Disparador'}</dt><dd>{selected.trigger}</dd></div>
              <div><dt>{locale === 'en' ? 'Credentials' : 'Credenciales'}</dt><dd>{selected.credentials}</dd></div>
            </dl>
            <h4>{locale === 'en' ? 'Flow steps' : 'Pasos del flujo'}</h4>
            <ol className="st-focus-steps">{selected.steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
            {selected.code && <div className="st-code"><em>n8n · Code</em><pre><code>{selected.code}</code></pre></div>}
            <div className="st-automation-test"><strong>{locale === 'en' ? 'Test' : 'Prueba'}</strong><p>{selected.test}</p><strong>{locale === 'en' ? 'If it fails' : 'Si falla'}</strong><p>{selected.failure}</p></div>
          </article>
        </div>
      )}
    </section>
  )
}

function AutomationCard({ automation, onOpen }: { automation: ToolAutomation; onOpen: () => void }) {
  return (
    <article className="st-automation-card">
      <button type="button" className="st-automation-toggle" onClick={onOpen}>
        <span><strong>{automation.name}</strong><small>{automation.difficulty} · {automation.platform}</small></span>
        <span>→</span>
      </button>
    </article>
  )
}

function usageText(guide: NonNullable<ToolPage['guide']>, label: string, locale: Locale) {
  if (locale === 'en') {
    return guide.usage?.explanation || `Before paying or activating anything, check how ${label} measures usage. Text tools tend to count tokens; video tools tend to spend credits; automation platforms count tasks or runs; and local tools don't charge to open them, though calls to connected APIs can still have a cost. Numbers change, so this guide teaches you to measure consumption inside the tool itself and to work with a limit.`
  }
  return guide.usage?.explanation || `Antes de pagar o activar nada, comprueba cómo mide el uso ${label}. Las herramientas de texto suelen contar tokens; las de vídeo suelen gastar créditos; las plataformas de automatización cuentan tareas o ejecuciones; y las herramientas locales no cobran por abrirlas, aunque las llamadas a APIs conectadas sí pueden tener coste. Las cifras cambian, así que esta guía enseña a medir el consumo dentro de la propia herramienta y a trabajar con un límite.`
}

function usageItems(guide: NonNullable<ToolPage['guide']>, label: string, locale: Locale) {
  if (locale === 'en') {
    return guide.usage?.examples || [
      `${label}: a short test with fake data before doing a real run.`,
      `A controlled repetition to check how much a single unit of work consumes.`,
      `A log with date, model or plan, input, output and approximate consumption.`,
      `A spending or run limit before letting it run on its own.`,
      `The date of the last check: prices, limits and plan names can change.`,
    ]
  }
  return guide.usage?.examples || [
    `${label}: una prueba corta con datos ficticios antes de hacer una ejecución real.`,
    `Una repetición controlada para comprobar cuánto consume una unidad de trabajo.`,
    `Un registro con fecha, modelo o plan, entrada, salida y consumo aproximado.`,
    `Un límite de gasto o de ejecuciones antes de dejarlo funcionando solo.`,
    `La fecha de la última comprobación: precios, límites y nombres de planes pueden cambiar.`,
  ]
}

const CONNECTIONS: Record<string, string[]> = {
  higgsfield: ['seedance-2-5', 'runway', 'elevenlabs', 'n8n'],
  'nano-banana': ['seedance-2-5', 'canva', 'figma', 'higgsfield', 'runway'],
  'seedance-2-5': ['nano-banana', 'higgsfield', 'runway', 'elevenlabs', 'canva'],
  n8n: ['openai', 'gmail', 'sheets', 'slack', 'supabase', 'github'],
  openai: ['n8n', 'supabase', 'github', 'higgsfield'],
  'wispr-flow': ['openai', 'claude', 'gemini', 'gmail', 'slack'],
  base44: ['openai', 'supabase', 'github', 'vercel'],
  lovable: ['supabase', 'github', 'vercel'],
  v0: ['github', 'vercel', 'supabase'],
}

function ToolConnections({ tool }: { tool: string }) {
  const course = useCourse()
  const locale = useLocale()
  const connected = (CONNECTIONS[tool] || ['n8n', 'openai', 'github']).map((id) => course.toolPages.find((item) => item.id === id)).filter(Boolean) as ToolPage[]
  if (!connected.length) return null
  return (
    <section className="st-tool-connections">
      <div className="st-section-head"><div><span className="st-kicker">{locale === 'en' ? 'You can also do it with' : 'También puedes hacerlo con'}</span><h2>{locale === 'en' ? 'Related tools' : 'Herramientas relacionadas'}</h2></div><span>{locale === 'en' ? 'Select one to see its guide' : 'Selecciona una para ver su guía'}</span></div>
      <div className="st-tool-connection-grid">
        {connected.map((item) => <a key={item.id} href={href({ name: 'herramienta', toolId: item.id, filters: {} })}><strong>{item.label}</strong><span>{item.guide ? (locale === 'en' ? 'Guide available' : 'Guía disponible') : `${item.count} ${locale === 'en' ? 'lessons' : 'lecciones'}`}</span><ArrowRight size={13} /></a>)}
      </div>
    </section>
  )
}
