import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clipboard, Search, X } from 'lucide-react'
import type { Block, LevelId, Lesson, ToolAutomation, ToolGuide, ToolPage } from '../types'
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

function toolContentSummary(tool: ToolPage) {
  const selected = tool.count || 0
  const itinerary = tool.itinerary?.length || 0
  const prompts = tool.guide?.prompts?.length || 0
  const automations = tool.guide?.automations?.length || 0
  const pieces = [
    itinerary ? `${itinerary} paso a paso` : '',
    selected ? `${selected} de consulta` : '',
    prompts ? `${prompts} prompts` : '',
    automations ? `${automations} automatizaciones` : '',
  ].filter(Boolean)
  if (pieces.length) return pieces.join(' · ')
  return tool.guide ? 'Guia manual' : 'Sin contenido curado'
}

function automationReality(automation: ToolAutomation) {
  const text = `${automation.platform} ${automation.credentials} ${automation.steps.join(' ')}`.toLowerCase()
  if (text.includes('workflow importable')) {
    return {
      label: 'Importable',
      detail: 'Puedes copiar el flujo, pero tienes que poner tus credenciales y probarlo con datos ficticios.',
    }
  }
  if (text.includes('whatsapp') || text.includes('cloud api') || text.includes('telegram')) {
    return {
      label: 'Requiere cuenta real',
      detail: 'La logica esta explicada; el funcionamiento depende de token, bot, webhook, permisos y prueba real.',
    }
  }
  if (text.includes('n8n')) {
    return {
      label: 'Guia n8n',
      detail: 'Recorrido para construirlo en n8n; no equivale a una ejecucion ya conectada.',
    }
  }
  return {
    label: 'Guia operativa',
    detail: 'Tiene pasos, prueba y recuperacion; valida primero con tus cuentas.',
  }
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
 * BIBLIOTECA: carpetas internas de consulta                           *
 * ------------------------------------------------------------------ */

export function Biblioteca() {
  const course = useCourse()

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">Consulta</span>
        <h1>Biblioteca</h1>
        <p>
          Las {course.folders.length} carpetas de contenido interno, organizadas como biblioteca de consulta. La ruta es para
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
        {course.toolPages.map((tool) => {
          const escritas = tool.itinerary?.length || 0
          return (
            <a key={tool.id} className="st-tool-card" href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}>
              <BrandMark icon={tool.icon} size={24} />
              <div>
                <strong>{tool.label}</strong>
                {tool.guide ? (
                  <span>{toolContentSummary(tool)}</span>
                ) : escritas > 0 ? (
                  <span className="st-tool-itinerary">Itinerario · {escritas} lecciones</span>
                ) : (
                  <span>{tool.count} lecciones seleccionadas</span>
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
  const [activePanel, setActivePanel] = useState('')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    setActivePanel('')
    setFocused(false)
  }, [toolId])

  const tool = course.toolPages.find((item) => item.id === toolId)
  const progress = useProgressOf(tool?.lessonSlugs || [])
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
  const totalAvailable = tool.totalCount ?? tool.count
  const hiddenCount = Math.max(0, totalAvailable - tool.count)
  const filters = 'filters' in route ? route.filters : {}
  const shown = applyFilters(all, filters, doneSlugs)
  const promptCount = tool.guide?.prompts?.length || 0
  const automationCount = tool.guide?.automations?.length || 0
  const toolMapItems = [
    ...(tool.guide ? [{
      id: 'guia-herramienta',
      title: 'Guía rápida',
      detail: 'Qué es, para qué sirve y qué no debes tocar todavía.',
    }] : []),
    ...(all.length ? [{
      id: 'lecciones-herramienta',
      title: 'Lecciones',
      detail: `${tool.count} de consulta${hiddenCount ? `, ${hiddenCount} internas fuera` : ''}`,
    }] : []),
    ...(promptCount ? [{
      id: 'prompts-herramienta',
      title: 'Prompts',
      detail: `${promptCount} listos para copiar`,
    }] : []),
    ...(tool.guide?.catalog?.items?.length ? [{
      id: 'piezas',
      title: 'Piezas internas',
      detail: `${tool.guide.catalog.items.length} funciones explicadas`,
    }] : []),
    ...(automationCount ? [{
      id: 'automatizaciones',
      title: 'Automatizaciones',
      detail: `${automationCount} flujos explicados`,
    }] : []),
  ]
  const defaultToolPanel = tool.guide ? 'guia-herramienta' : all.length ? 'lecciones-herramienta' : toolMapItems[0]?.id || 'guia-herramienta'
  const currentPanel = activePanel || defaultToolPanel
  const currentMapItem = toolMapItems.find((item) => item.id === currentPanel)

  function openPanel(id: string) {
    setActivePanel(id)
    setFocused(true)
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  }

  return (
    <div className={`st-page st-tool-page${focused ? ' is-focused' : ''}`}>
      <header className="st-area-head">
        <span><BrandMark icon={tool.icon} size={40} /></span>
        <div>
          <span className="st-kicker">Herramienta</span>
          <h1>{tool.label}</h1>
          <p>
            {tool.count
              ? `Lo esencial de ${tool.label}, curado como biblioteca de consulta. Si existe una ruta paso a paso, se marca aparte para no mezclar estudio con material de apoyo.`
              : `${tool.label} funciona como herramienta manual de consulta: primero entiendes qué hace y después la usas solo cuando te ayuda en tu trabajo real.`}
            {hiddenCount ? ` Hay ${hiddenCount} menciones internas más, pero no se muestran aquí para no crear una lista interminable.` : ''}
          </p>
        </div>
        <div className="st-area-stats">
          {tool.count ? (
            <>
              <div><strong>{tool.count}</strong><small>seleccionadas</small></div>
              <div><strong>{progress.percent}%</strong><small>completado</small></div>
              <div><strong>{tool.itinerary?.length || 'No'}</strong><small>paso a paso</small></div>
            </>
          ) : (
            <>
              <div><strong>Manual</strong><small>uso guiado</small></div>
              <div><strong>{automationCount}</strong><small>automatizaciones</small></div>
            </>
          )}
        </div>
      </header>

      {focused && (
        <div className="st-inline-focusbar">
          <button type="button" className="st-btn-ghost" onClick={() => setFocused(false)}>
            <ArrowLeft size={12} /> Volver al mapa de {tool.label}
          </button>
          <span>{currentMapItem?.title || tool.label}</span>
        </div>
      )}

      <div className={`st-tool-focus-layout${focused ? ' focused' : ''}`}>
      <section className="st-tool-map" aria-label={`Mapa de ${tool.label}`}>
        {toolMapItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={currentPanel === item.id ? 'on' : ''}
            onClick={() => openPanel(item.id)}
            aria-pressed={currentPanel === item.id}
          >
            <span>{index + 1}</span>
            <strong>{item.title}</strong>
            <small>{item.detail}</small>
          </button>
        ))}
      </section>

      <section className="st-tool-active-panel" aria-live="polite">
        {tool.guide && currentPanel === 'guia-herramienta' && (
          <section id="guia-herramienta" className="st-tool-guide">
            <div className="st-section-head">
              <div>
                <span className="st-kicker">Empieza aquí</span>
                <h2>Primero entiende la herramienta</h2>
              </div>
            </div>
            <Blocks blocks={guideBlocks(tool.guide, tool.label)} />
          </section>
        )}

        {all.length > 0 && currentPanel === 'lecciones-herramienta' && (
          <section id="lecciones-herramienta" className="st-tool-lessons">
            <div className="st-section-head">
              <div>
                <span className="st-kicker">Lecciones dentro de {tool.label}</span>
                <h2>Estudia solo estas piezas</h2>
                <p className="st-tool-inside-intro">
                  No son otra ruta obligatoria ni prometen ser un curso exacto de 20 lecciones. Son piezas de consulta seleccionadas para entender {tool.label} cuando tu proyecto la necesite.
                </p>
              </div>
              <span>{shown.length} de {all.length}{hiddenCount ? ` · ${hiddenCount} guardadas fuera` : ''}</span>
            </div>
            <Filters route={route} lessons={all} hide={['tool']} />
            <LessonList lessons={shown} level={level} />
          </section>
        )}

        {tool.guide && currentPanel === 'piezas' && <ToolInside guide={tool.guide} label={tool.label} toolId={tool.id} section="piezas" onSelectPanel={setActivePanel} />}
        {tool.guide && currentPanel === 'prompts-herramienta' && <ToolInside guide={tool.guide} label={tool.label} toolId={tool.id} section="prompts" onSelectPanel={setActivePanel} />}
        {tool.guide && currentPanel === 'automatizaciones' && <ToolInside guide={tool.guide} label={tool.label} toolId={tool.id} section="automatizaciones" onSelectPanel={setActivePanel} />}
      </section>
      </div>

      <section className="st-tool-context-strip" aria-label="Más secciones disponibles">
        {toolMapItems.filter((item) => item.id !== currentPanel).map((item) => (
          <button key={item.id} type="button" onClick={() => openPanel(item.id)}>
            <strong>{item.title}</strong>
            <span>{item.detail}</span>
          </button>
        ))}
      </section>

      <ToolConnections tool={tool.id} />
    </div>
  )
}

/** La guía de la herramienta, con los mismos bloques que usan las lecciones. */
function guideBlocks(guide: NonNullable<ToolPage['guide']>, label: string): Block[] {
  const blocks: Block[] = [
    { kind: 'idea', title: `Qué es ${label}, sin tecnicismos`, text: guide.plain },
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

  // Las secciones nuevas: atajos, lo del día a día, plantillas listas,
  // errores frecuentes y prompts propios de la herramienta.
  if (guide.shortcuts?.length) {
    blocks.push({
      kind: 'palabras',
      title: 'Atajos y botones que vas a usar cada día',
      items: guide.shortcuts.map(([term, meaning]) => ({ term, meaning })),
    })
  }

  if (guide.daily?.length) {
    blocks.push({
      kind: 'comprobar',
      title: `El 20% de ${label} que resuelve el 80% del trabajo`,
      items: guide.daily,
    })
  }

  for (const template of guide.templates || []) {
    blocks.push({
      kind: 'receta',
      title: `Listo para usar: ${template.name}`,
      text: `${template.what} ${template.how}`,
      code: template.code,
      lang: 'json',
      lines: template.fill,
    })
  }

  if (guide.errors?.length) {
    blocks.push({
      kind: 'palabras',
      title: 'Errores que te vas a encontrar, con su arreglo',
      items: guide.errors.map(([term, meaning]) => ({ term, meaning })),
    })
  }

  blocks.push({
    kind: 'comprobar',
    title: `Checklist antes de usar ${label} en un proyecto real`,
    items: [
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
    title: 'Precio, créditos, tareas y tokens',
    text: usageText(guide, label),
    items: usageItems(guide, label),
  })

  blocks.push({
    kind: 'cuenta',
    title: 'Cuenta, plan y acceso',
    account: {
      url: guide.account.url,
      free: guide.account.free,
      steps: guide.account.steps.map(([paso, como]) => `${paso} — ${como}`),
      warning: guide.account.warning,
    },
  })

  return blocks
}

function ToolInside({
  guide,
  label,
  toolId,
  section = 'all',
  onSelectPanel,
}: {
  guide: ToolGuide
  label: string
  toolId: string
  section?: 'all' | 'piezas' | 'prompts' | 'automatizaciones'
  onSelectPanel?: (panel: string) => void
}) {
  const [selected, setSelected] = useState<NonNullable<ToolGuide['catalog']>['items'][number] | null>(null)
  const showCatalog = section === 'all' || section === 'piezas'
  const showPrompts = section === 'all' || section === 'prompts'
  const showAutomations = section === 'all' || section === 'automatizaciones'

  function jumpToAutomations() {
    setSelected(null)
    onSelectPanel?.('automatizaciones')
  }

  return (
    <>
      {showCatalog && guide.catalog?.items?.length ? (
        <section className="st-tool-inside" id="piezas">
          <div className="st-section-head">
            <div><span className="st-kicker">Dentro de {label}</span><h2>Qué hay aquí y cuándo usarlo</h2></div>
            <span>{guide.catalog.items.length} piezas explicadas</span>
          </div>
          <p className="st-tool-inside-intro">{guide.catalog.intro}</p>
          <div className="st-inside-grid">
            {guide.catalog.items.map((item) => (
              <button key={`${item.group}-${item.name}`} type="button" className="st-inside-card" onClick={() => setSelected(item)}>
                <span>{item.group}</span>
                <h3>{item.name}</h3>
                <p>{item.what}</p>
                <div><strong>Úsalo cuando</strong><p>{item.useWhen}</p></div>
                <em className="st-card-action">Abrir ficha</em>
              </button>
            ))}
          </div>
          {selected && (
            <div className="st-focus-modal" role="dialog" aria-modal="true" aria-label={`Ficha de ${selected.name}`}>
              <button type="button" className="st-focus-backdrop" onClick={() => setSelected(null)} aria-label="Cerrar" />
              <article className="st-focus-sheet">
                <header>
                  <div>
                    <span className="st-kicker">{selected.group} · {label}</span>
                    <h3>{selected.name}</h3>
                    <p>{selected.what}</p>
                  </div>
                  <button type="button" className="st-icon-close" onClick={() => setSelected(null)} aria-label="Cerrar ficha"><X size={16} /></button>
                </header>
                <dl className="st-focus-dl">
                  <div><dt>Úsalo cuando</dt><dd>{selected.useWhen}</dd></div>
                  {selected.model && <div><dt>Cómo elegir</dt><dd>{selected.model}</dd></div>}
                  {selected.avoidWhen && <div><dt>No lo uses así</dt><dd>{selected.avoidWhen}</dd></div>}
                </dl>
                <div className="st-focus-actions">
                  {guide.prompts?.length ? <a className="st-btn" href={`#/prompts/herramienta-${encodeURIComponent(toolId)}`}>Ver prompts de {label}</a> : null}
                  {guide.automations?.length ? <button type="button" className="st-btn-ghost" onClick={jumpToAutomations}>Ver automatizaciones</button> : null}
                </div>
              </article>
            </div>
          )}
        </section>
      ) : null}
      {showPrompts && guide.prompts?.length ? <ToolPromptLibrary prompts={guide.prompts} label={label} defaultOpen /> : null}
      {showAutomations && guide.automations?.length ? <AutomationLibrary automations={guide.automations} label={label} /> : null}
    </>
  )
}

type ToolPrompt = NonNullable<ToolGuide['prompts']>[number]

function ToolPromptLibrary({ prompts, label, defaultOpen = false }: { prompts: ToolPrompt[]; label: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
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
          <small>Prompts de {label}</small>
          <strong>{prompts.length} prompts listos para copiar</strong>
        </span>
        <span>{open ? 'Ocultar' : 'Abrir'} <ChevronDown size={14} /></span>
      </button>
      {open && (
        <div className="st-tool-prompts-panel">
          <aside>
            <label className="st-tool-prompt-search">
              <Search size={13} />
              <input value={query} onChange={(event) => { setQuery(event.target.value); setSelected(0) }} placeholder="Filtrar prompts..." />
            </label>
            <div className="st-tool-prompt-list">
              {filtered.map((prompt, index) => (
                <button key={`${prompt.name}-${index}`} type="button" className={prompt === active ? 'on' : ''} onClick={() => setSelected(index)}>
                  <strong>{String(index + 1).padStart(2, '0')}</strong>
                  <span>{prompt.name}</span>
                </button>
              ))}
              {!filtered.length && <p>No hay prompts con ese filtro.</p>}
            </div>
          </aside>
          {active && (
            <article className="st-tool-prompt-detail">
              <header>
                <div>
                  <span className="st-kicker">Prompt seleccionado</span>
                  <h3>{active.name}</h3>
                  {(active.when || active.model) && <p>{[active.when, active.model ? `Elección recomendada: ${active.model}.` : ''].filter(Boolean).join(' ')}</p>}
                </div>
                <button type="button" className="st-btn" onClick={copyPrompt}>
                  {copied ? <Check size={13} /> : <Clipboard size={13} />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </header>
              <details>
                <summary>Ver el prompt completo</summary>
                <pre><code>{active.prompt}</code></pre>
              </details>
              <div className="st-tool-prompt-help">
                <strong>Cómo usarlo</strong>
                <span>Cópialo entero, rellena los huecos entre corchetes y pégalo en ChatGPT, Claude o Gemini. Lo importante se comprueba antes de usar datos reales.</span>
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
  return (
    <section className="st-automation-library" id="automatizaciones">
      <div className="st-section-head">
        <div><span className="st-kicker">Flujos dentro de la herramienta</span><h2>Automatizaciones que puedes construir con {label}</h2></div>
        <span>{automations.length} recorridos</span>
      </div>
      <p className="st-tool-inside-intro">Cada recorrido tiene un disparador, una validación, una acción observable y una ruta de recuperación. Las conexiones reales necesitan tus propias credenciales y primero se prueban con datos ficticios.</p>
      <div className="st-automation-grid">
        {automations.map((automation) => <AutomationCard key={automation.name} automation={automation} onOpen={() => setSelected(automation)} />)}
      </div>
      {selected && (
        <div className="st-focus-modal" role="dialog" aria-modal="true" aria-label={`Automatización ${selected.name}`}>
          <button type="button" className="st-focus-backdrop" onClick={() => setSelected(null)} aria-label="Cerrar" />
          <article className="st-focus-sheet st-focus-sheet-wide">
            <header>
              <div>
                <span className="st-kicker">{selected.difficulty} · {selected.platform}</span>
                <h3>{selected.name}</h3>
                <p>{selected.goal}</p>
                <p className="st-automation-reality">
                  <strong>{automationReality(selected).label}.</strong> {automationReality(selected).detail}
                </p>
              </div>
              <button type="button" className="st-icon-close" onClick={() => setSelected(null)} aria-label="Cerrar automatización"><X size={16} /></button>
            </header>
            <dl className="st-focus-dl">
              <div><dt>Disparador</dt><dd>{selected.trigger}</dd></div>
              <div><dt>Credenciales</dt><dd>{selected.credentials}</dd></div>
            </dl>
            <h4>Pasos del flujo</h4>
            <ol className="st-focus-steps">{selected.steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}</ol>
            {selected.code && <div className="st-code"><em>n8n · Code</em><pre><code>{selected.code}</code></pre></div>}
            <div className="st-automation-test"><strong>Prueba</strong><p>{selected.test}</p><strong>Si falla</strong><p>{selected.failure}</p></div>
          </article>
        </div>
      )}
    </section>
  )
}

function AutomationCard({ automation, onOpen }: { automation: ToolAutomation; onOpen: () => void }) {
  const reality = automationReality(automation)
  return (
    <article className="st-automation-card">
      <button type="button" className="st-automation-toggle" onClick={onOpen}>
        <span>
          <strong>{automation.name}</strong>
          <small>{automation.difficulty} · {automation.platform}</small>
          <em>{reality.label}</em>
        </span>
        <span>→</span>
      </button>
    </article>
  )
}

function usageText(guide: NonNullable<ToolPage['guide']>, label: string) {
  return guide.usage?.explanation || `Antes de pagar o activar nada, comprueba cómo mide el uso ${label}. Las herramientas de texto suelen contar tokens; las de vídeo suelen gastar créditos; las plataformas de automatización cuentan tareas o ejecuciones; y las herramientas locales no cobran por abrirlas, aunque las llamadas a APIs conectadas sí pueden tener coste. Las cifras cambian, así que esta guía enseña a medir el consumo dentro de la propia herramienta y a trabajar con un límite.`
}

function usageItems(guide: NonNullable<ToolPage['guide']>, label: string) {
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
  const connected = (CONNECTIONS[tool] || ['n8n', 'openai', 'github']).map((id) => course.toolPages.find((item) => item.id === id)).filter(Boolean) as ToolPage[]
  if (!connected.length) return null
  return (
    <section className="st-tool-connections">
      <div className="st-section-head"><div><span className="st-kicker">También puedes hacerlo con</span><h2>Herramientas relacionadas</h2></div><span>Selecciona una para ver su guía</span></div>
      <div className="st-tool-connection-grid">
        {connected.map((item) => <a key={item.id} href={href({ name: 'herramienta', toolId: item.id, filters: {} })}><strong>{item.label}</strong><span>{item.guide ? 'Guía disponible' : `${item.count} lecciones`}</span><ArrowRight size={13} /></a>)}
      </div>
    </section>
  )
}
