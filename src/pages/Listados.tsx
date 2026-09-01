import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
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
        {course.toolPages.map((tool) => {
          const escritas = tool.itinerary?.length || 0
          return (
            <a key={tool.id} className="st-tool-card" href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}>
              <BrandMark icon={tool.icon} size={24} />
              <div>
                <strong>{tool.label}</strong>
                {tool.guide ? (
                  <span>{tool.guide.prompts?.length || 0} prompts{tool.guide.automations?.length ? ` · ${tool.guide.automations.length} automatizaciones` : ''} · guía completa</span>
                ) : escritas > 0 ? (
                  <span className="st-tool-itinerary">Itinerario · {escritas} lecciones</span>
                ) : (
                  <span>{tool.count} lecciones de consulta</span>
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
          <ToolInside guide={tool.guide} label={tool.label} />
        </>
      )}

      <ToolConnections tool={tool.id} />

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

  // Antes de la lista de prompts, el modo de empleo: la gente no sabe que
  // esto se pega en un chat de IA, ni en cual, hasta que alguien se lo dice.
  if (guide.prompts?.length) {
    blocks.push({
      kind: 'comprobar',
      title: 'Cómo se usan estos prompts',
      text: 'Un prompt es un encargo escrito para una inteligencia artificial. No se ejecuta aquí: se copia y se pega en un chat de IA. Así:',
      items: [
        'Copia el prompt entero con su botón, sin recortarlo: cada línea evita una respuesta genérica.',
        'Pégalo en el chat de una IA: ChatGPT (chatgpt.com), Claude (claude.ai) o Gemini (gemini.google.com). Cualquiera de los tres vale; abajo tienes cuándo conviene cada uno.',
        'Antes de enviar, rellena los huecos [ENTRE CORCHETES] con tu caso real. Un hueco sin rellenar es una respuesta inventada.',
        'Lee la respuesta con criterio: es un borrador de trabajo, no una verdad. Lo que afirme sobre precios, leyes o datos concretos, compruébalo.',
        'Si el resultado te sirve, guarda el prompt rellenado en tu archivo de prompts: los buenos se reutilizan.',
      ],
    })
    blocks.push({
      kind: 'palabras',
      title: 'Qué IA elegir para cada encargo',
      text: 'Los nombres de los modelos cambian cada pocos meses; esta regla, no. Dentro de cada chat, el selector de modelo distingue el rápido (barato, para lo mecánico) del grande (para razonar).',
      items: [
        { term: 'Documentos largos o criterio fino', meaning: 'Claude. Sostiene textos grandes y respuestas con matiz mejor que la media.' },
        { term: 'Buscar información actual en internet', meaning: 'ChatGPT o Gemini con la búsqueda activada. Claude también busca; comprueba que la función esté activa antes de fiarte de fechas y precios.' },
        { term: 'Trabajar con lo que ya usas de Google', meaning: 'Gemini, que vive dentro de Gmail, Drive y Docs.' },
        { term: 'Tarea mecánica y repetitiva', meaning: 'El modelo rápido de cualquiera de los tres: más barato y de sobra para clasificar, resumir o reformatear.' },
        { term: 'Razonamiento difícil o decisión importante', meaning: 'El modelo grande del chat que uses. Y para lo importante de verdad: pásalo por dos IA distintas y compara.' },
      ],
    })
  }

  for (const item of guide.prompts || []) {
    blocks.push({
      kind: 'codigo',
      title: `Prompt: ${item.name}`,
      text: [item.when, item.model ? `Elección recomendada: ${item.model}.` : ''].filter(Boolean).join(' '),
      code: item.prompt,
      lang: 'prompt',
    })
  }

  return blocks
}

function ToolInside({ guide, label }: { guide: ToolGuide; label: string }) {
  return (
    <>
      {guide.catalog?.items?.length ? (
        <section className="st-tool-inside">
          <div className="st-section-head">
            <div><span className="st-kicker">Dentro de {label}</span><h2>Qué hay aquí y cuándo usarlo</h2></div>
            <span>{guide.catalog.items.length} piezas explicadas</span>
          </div>
          <p className="st-tool-inside-intro">{guide.catalog.intro}</p>
          <div className="st-inside-grid">
            {guide.catalog.items.map((item) => (
              <article key={`${item.group}-${item.name}`} className="st-inside-card">
                <span>{item.group}</span>
                <h3>{item.name}</h3>
                <p>{item.what}</p>
                <div><strong>Úsalo cuando</strong><p>{item.useWhen}</p></div>
                {item.model && <div><strong>Cómo elegir</strong><p>{item.model}</p></div>}
                {item.avoidWhen && <div className="st-inside-avoid"><strong>No lo uses así</strong><p>{item.avoidWhen}</p></div>}
              </article>
            ))}
          </div>
        </section>
      ) : null}
      {guide.automations?.length ? <AutomationLibrary automations={guide.automations} label={label} /> : null}
    </>
  )
}

function AutomationLibrary({ automations, label }: { automations: ToolAutomation[]; label: string }) {
  return (
    <section className="st-automation-library">
      <div className="st-section-head">
        <div><span className="st-kicker">Flujos dentro de la herramienta</span><h2>Automatizaciones que puedes construir con {label}</h2></div>
        <span>{automations.length} recorridos</span>
      </div>
      <p className="st-tool-inside-intro">Cada recorrido tiene un disparador, una validación, una acción observable y una ruta de recuperación. Las conexiones reales necesitan tus propias credenciales y primero se prueban con datos ficticios.</p>
      <div className="st-automation-grid">
        {automations.map((automation) => <AutomationCard key={automation.name} automation={automation} />)}
      </div>
    </section>
  )
}

function AutomationCard({ automation }: { automation: ToolAutomation }) {
  const [open, setOpen] = useState(false)
  return (
    <article className={`st-automation-card${open ? ' open' : ''}`}>
      <button type="button" className="st-automation-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span><strong>{automation.name}</strong><small>{automation.difficulty} · {automation.platform}</small></span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && <div className="st-automation-body"><p>{automation.goal}</p><dl><div><dt>Disparador</dt><dd>{automation.trigger}</dd></div><div><dt>Credenciales</dt><dd>{automation.credentials}</dd></div></dl><h4>Pasos del flujo</h4><ol>{automation.steps.map((step, index) => <li key={index}><span>{index + 1}</span>{step}</li>)}</ol>{automation.code && <div className="st-code"><em>n8n · Code</em><pre><code>{automation.code}</code></pre></div>}<div className="st-automation-test"><strong>Prueba</strong><p>{automation.test}</p><strong>Si falla</strong><p>{automation.failure}</p></div></div>}
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
