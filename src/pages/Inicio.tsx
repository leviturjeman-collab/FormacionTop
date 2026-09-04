import { ArrowRight, BookMarked, BookOpen, Bot, Boxes, Clock, FolderSearch, PlayCircle, Puzzle, Search, Sparkles, Workflow } from 'lucide-react'
import type { LevelId } from '../types'
import { useCourse, useIndexes } from '../course'
import { href } from '../router'
import { useStudent } from '../store'
import { BrandMark } from '../components/Brand'
import { useLocale } from '../i18n'

const SHOWCASE = ['claude', 'openai', 'n8n', 'github', 'googlegemini', 'githubcopilot', 'docker', 'python', 'supabase', 'vercel']

export default function Inicio() {
  const locale = useLocale()
  const course = useCourse()
  const { bySlug } = useIndexes()
  const student = useStudent()
  const level: LevelId = student.preferredLevel || 'basico'

  const cursoLessons = course.curso || []
  const core = cursoLessons.filter((item) => !item.tool)
  /** Una lección del programa está hecha cuando el alumno ha marcado todas sus tareas. */
  const isDone = (item: { id: string; tasks: unknown[] }) => {
    const progress = student.lessons['curso:' + item.id]
    const marked = progress?.checks?.intermedio || []
    if (progress?.done?.includes('intermedio')) return true
    return item.tasks.length > 0 && marked.length >= item.tasks.length
  }
  const doneCount = core.filter(isDone).length
  const percent = core.length ? Math.round((doneCount / core.length) * 100) : 0
  const coreLessons = core.length
  const organizedTools = course.toolPages.length

  /* La tarjeta grande de la portada apuntaba a coreSlugs[0] del área 01, que es
   * un README interno del vault. Ahora apunta a la primera lección del programa
   * que el alumno no haya terminado, que es lo que de verdad le toca hacer. */
  const nextLesson = core.find((item) => !isDone(item)) || core[core.length - 1]
  const started = doneCount > 0


  return (
    <div className="st-page">
      <section className="st-welcome">
        <div>
          <span className="st-kicker">{locale === 'en' ? 'Workspace' : 'Espacio de trabajo'}</span>
          <h1>{started ? (locale === 'en' ? 'Pick up where you left off.' : 'Sigue donde lo dejaste.') : (locale === 'en' ? 'Start here.' : 'Empieza por aquí.')}</h1>
          <p>
            {locale === 'en' ? (
              <>The course is <strong>{coreLessons} lessons</strong>, in order. Everything else (tools, prompts,
              kits, agents, automations, and glossary) is there for whenever you need it. No need to look at it first.</>
            ) : (
              <>El curso son <strong>{coreLessons} lecciones</strong>, en orden. Todo lo demás (herramientas, prompts,
              kits, agentes, automatizaciones y diccionario) está ahí para cuando lo necesites. No hace falta mirarlo antes.</>
            )}
          </p>
        </div>
        <div className="st-overall">
          <span>{percent}%</span>
          <small>{locale === 'en' ? `You've completed ${doneCount} of ${coreLessons} lessons` : `Llevas ${doneCount} de ${coreLessons} lecciones`}</small>
        </div>
      </section>

      <section className="st-start-panel">
        <div className="st-section-head">
          <div>
            <span className="st-kicker">{locale === 'en' ? 'First step' : 'Primer paso'}</span>
            <h2>{locale === 'en' ? 'Choose where to start' : 'Elige por dónde entras'}</h2>
          </div>
          <span>{locale === 'en' ? 'Everything else can wait' : 'Lo demás puede esperar'}</span>
        </div>
        <div className="st-start-grid st-start-grid-main">
          <a href={href({ name: 'curso' })}><BookMarked size={19} /><strong>{locale === 'en' ? 'Follow the guided path' : 'Seguir la ruta guiada'}</strong><small>{locale === 'en' ? `${coreLessons} lessons in order. If you don't know where to start, this is it.` : `${coreLessons} lecciones en orden. Si no sabes por dónde empezar, es por aquí.`}</small><ArrowRight size={13} /></a>
          <a href={href({ name: 'mi-proyecto' })}><Puzzle size={19} /><strong>{locale === 'en' ? 'Create my project' : 'Crear mi proyecto'}</strong><small>{locale === 'en' ? "Tell us your idea and we'll tell you which lessons and tools you need." : 'Cuéntanos tu idea y te decimos qué lecciones y qué herramientas te tocan.'}</small><ArrowRight size={13} /></a>
          <a href={href({ name: 'prompts' })}><Sparkles size={19} /><strong>{locale === 'en' ? 'Use a prompt' : 'Usar un prompt'}</strong><small>{locale === 'en' ? 'Choose what you want to ask the AI and copy the text already written.' : 'Elige lo que quieres pedirle a la IA y copia el texto ya escrito.'}</small><ArrowRight size={13} /></a>
        </div>
        <div className="st-support-strip" aria-label={locale === 'en' ? 'Support resources' : 'Recursos de apoyo'}>
          <a href={href({ name: 'kits' })}><Sparkles size={14} /> {locale === 'en' ? 'Big projects' : 'Proyectos grandes'}</a>
          <a href={href({ name: 'herramienta', toolId: 'n8n', filters: {} })}><Workflow size={14} /> {locale === 'en' ? 'Automate' : 'Automatizar'}</a>
          <a href={href({ name: 'herramienta', toolId: 'higgsfield', filters: {} })}><PlayCircle size={14} /> {locale === 'en' ? 'Create video' : 'Crear vídeo'}</a>
          <a href={href({ name: 'herramientas' })}><Search size={14} /> {locale === 'en' ? 'Tools' : 'Herramientas'}</a>
          <a href={href({ name: 'indice' })}><BookOpen size={14} /> {locale === 'en' ? 'Glossary' : 'Diccionario'}</a>
        </div>
      </section>

      <div className="st-home-grid">
        <section className="st-next">
          <div className="st-section-head" style={{ marginTop: 0 }}>
            <div>
              <span className="st-kicker">{locale === 'en' ? 'Continue here' : 'Continúa por aquí'}</span>
              <h2>{started ? (locale === 'en' ? 'Your next lesson' : 'Tu siguiente lección') : (locale === 'en' ? 'Start with this one' : 'Empieza por esta')}</h2>
            </div>
          </div>

          {nextLesson && (
            <a className="st-next-card" href={href({ name: 'curso', lessonId: nextLesson.id })}>
              <div className="st-next-type">
                <PlayCircle size={20} />
                <span>{locale === 'en' ? `Lesson ${nextLesson.number}` : `Lección ${nextLesson.number}`}</span>
              </div>
              <div>
                <h3>{nextLesson.title}</h3>
                <p>{nextLesson.promise}</p>
                <div className="st-meta">
                  <span><Clock size={10} /> {nextLesson.minutes} {locale === 'en' ? 'min' : 'min'}</span>
                  <span>{locale === 'en' ? `${doneCount} of ${coreLessons} done` : `${doneCount} de ${coreLessons} hechas`}</span>
                </div>
              </div>
              <ArrowRight size={16} />
            </a>
          )}
        </section>

        <aside className="st-panel">
          <span className="st-kicker">{locale === 'en' ? 'The academy' : 'La academia'}</span>
          <h2>{locale === 'en' ? "What's behind it" : 'Qué hay detrás'}</h2>
          <div className="st-support-map">
            <a href={href({ name: 'curso' })}><BookMarked size={14} /><span><strong>{locale === 'en' ? `${coreLessons} guided lessons` : `${coreLessons} lecciones guiadas`}</strong><small>{locale === 'en' ? "The path that's actually worth following in order." : 'La ruta que sí conviene seguir en orden.'}</small></span></a>
            <a href={href({ name: 'herramientas' })}><FolderSearch size={14} /><span><strong>{locale === 'en' ? `${organizedTools} organized tools` : `${organizedTools} herramientas organizadas`}</strong><small>{locale === 'en' ? 'Each page shows at most 25 lessons to avoid endless scrolling.' : 'Cada ficha muestra como máximo 25 lecciones para evitar paredes de scroll.'}</small></span></a>
            <a href={href({ name: 'buscar', query: '', filters: {} })}><Search size={14} /><span><strong>{locale === 'en' ? `${course.stats.fichas} reference pages` : `${course.stats.fichas} fichas de consulta`}</strong><small>{locale === 'en' ? "To search for something specific when you're stuck." : 'Para buscar algo concreto cuando te atasques.'}</small></span></a>
            <a href={href({ name: 'herramienta', toolId: 'n8n', filters: {} })}><Workflow size={14} /><span><strong>{locale === 'en' ? `${course.stats.workflows} importable automations` : `${course.stats.workflows} automatizaciones importables`}</strong><small>{locale === 'en' ? 'n8n flows with their credentials guide, ready to use.' : 'Flujos de n8n con su guía de credenciales, listos para usar.'}</small></span></a>
            <a href={href({ name: 'kits' })}><Boxes size={14} /><span><strong>{locale === 'en' ? `${(course.kits || []).length} institutional kits` : `${(course.kits || []).length} kits institucionales`}</strong><small>{locale === 'en' ? 'Complete projects: brief, phases, prompts, workflow, and delivery.' : 'Proyectos completos: brief, fases, prompts, flujo y entrega.'}</small></span></a>
            <a href={href({ name: 'agentes' })}><Bot size={14} /><span><strong>{locale === 'en' ? `${(course.agents || []).length} agents ready to install` : `${(course.agents || []).length} agentes listos para instalar`}</strong><small>{locale === 'en' ? 'Claude Code, GPTs, n8n, and API, with install and test steps.' : 'Claude Code, GPTs, n8n y API, con instalación y prueba.'}</small></span></a>
          </div>
          <div className="st-brand-row" aria-label={locale === 'en' ? 'Tools covered by the course' : 'Herramientas que cubre el curso'}>
            {SHOWCASE.map((icon) => <BrandMark key={icon} icon={icon} size={16} />)}
          </div>
        </aside>
      </div>

      <section className="st-area-preview">
        <div className="st-section-head">
          <div>
            <span className="st-kicker">{locale === 'en' ? 'Program' : 'Programa'}</span>
            <h2>{locale === 'en' ? 'The ten areas' : 'Las diez áreas'}</h2>
          </div>
          <a href={href({ name: 'ruta' })}>{locale === 'en' ? 'View the full path' : 'Ver la ruta completa'}</a>
        </div>
        <p className="st-area-preview-note">{locale === 'en' ? 'These areas are the complete map. To get started, use Program or My project; come back here when you want to go deeper.' : 'Estas áreas son el mapa completo. Para empezar, usa Programa o Mi proyecto; vuelve aquí cuando quieras profundizar.'}</p>
        <div>
          {course.stages.map((stage) => {
            const total = stage.lessonSlugs.length * 3
            const done = stage.lessonSlugs.reduce((sum, slug) => sum + (student.lessons[slug]?.done.length || 0), 0)
            const stagePercent = total ? Math.round((done / total) * 100) : 0
            return (
              <a key={stage.id} href={href({ name: 'area', stageId: stage.id, filters: {} })}>
                <span>{stage.number}</span>
                <div>
                  <strong>{stage.title}</strong>
                  <small>{locale === 'en' ? `${stage.categoryIds.length} categories · ${stage.lessonSlugs.length} lessons · ${stage.tagline}` : `${stage.categoryIds.length} categorías · ${stage.lessonSlugs.length} lecciones · ${stage.tagline}`}</small>
                </div>
                <i><b style={{ width: `${stagePercent}%` }} /></i>
                <b>{stagePercent}%</b>
              </a>
            )
          })}
        </div>
      </section>
    </div>
  )
}
