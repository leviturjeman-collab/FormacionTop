import { ArrowRight, BookMarked, BookOpen, Clock, FolderSearch, PlayCircle, Puzzle, Search, Sparkles, Workflow } from 'lucide-react'
import type { LevelId } from '../types'
import { useCourse, useIndexes } from '../course'
import { href } from '../router'
import { useStudent } from '../store'
import { BrandMark } from '../components/Brand'

const SHOWCASE = ['claude', 'openai', 'n8n', 'github', 'googlegemini', 'githubcopilot', 'docker', 'python', 'supabase', 'vercel']

export default function Inicio() {
  const course = useCourse()
  const { bySlug } = useIndexes()
  const student = useStudent()
  const level: LevelId = student.preferredLevel || 'basico'

  const cursoLessons = course.curso || []
  const core = cursoLessons.filter((item) => !item.tool)
  /** Una lección del programa está hecha cuando el alumno ha marcado todas sus tareas. */
  const isDone = (item: { id: string; tasks: unknown[] }) => {
    const marked = student.lessons['curso:' + item.id]?.checks?.intermedio || []
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
          <span className="st-kicker">Espacio de trabajo</span>
          <h1>{started ? 'Sigue donde lo dejaste.' : 'Empieza por aquí.'}</h1>
          <p>
            El curso son <strong>{coreLessons} lecciones</strong>, en orden. Todo lo demás (herramientas, prompts,
            automatizaciones y diccionario) está ahí para cuando lo necesites. No hace falta mirarlo antes.
          </p>
        </div>
        <div className="st-overall">
          <span>{percent}%</span>
          <small>Llevas {doneCount} de {coreLessons} lecciones</small>
        </div>
      </section>

      <section className="st-start-panel">
        <div className="st-section-head">
          <div>
            <span className="st-kicker">Primer paso</span>
            <h2>Elige por dónde entras</h2>
          </div>
          <span>Lo demás puede esperar</span>
        </div>
        <div className="st-start-grid st-start-grid-main">
          <a href={href({ name: 'curso' })}><BookMarked size={19} /><strong>Seguir la ruta guiada</strong><small>{coreLessons} lecciones en orden. Si no sabes por dónde empezar, es por aquí.</small><ArrowRight size={13} /></a>
          <a href={href({ name: 'mi-proyecto' })}><Puzzle size={19} /><strong>Crear mi proyecto</strong><small>Cuéntanos tu idea y te decimos qué lecciones y qué herramientas te tocan.</small><ArrowRight size={13} /></a>
          <a href={href({ name: 'prompts' })}><Sparkles size={19} /><strong>Usar un prompt</strong><small>Elige lo que quieres pedirle a la IA y copia el texto ya escrito.</small><ArrowRight size={13} /></a>
        </div>
        <div className="st-support-strip" aria-label="Recursos de apoyo">
          <a href={href({ name: 'kits' })}><Sparkles size={14} /> Proyectos grandes</a>
          <a href={href({ name: 'herramienta', toolId: 'n8n', filters: {} })}><Workflow size={14} /> Automatizar</a>
          <a href={href({ name: 'herramienta', toolId: 'higgsfield', filters: {} })}><PlayCircle size={14} /> Crear vídeo</a>
          <a href={href({ name: 'herramientas' })}><Search size={14} /> Herramientas</a>
          <a href={href({ name: 'indice' })}><BookOpen size={14} /> Diccionario</a>
        </div>
      </section>

      <div className="st-home-grid">
        <section className="st-next">
          <div className="st-section-head" style={{ marginTop: 0 }}>
            <div>
              <span className="st-kicker">Continúa por aquí</span>
              <h2>{started ? 'Tu siguiente lección' : 'Empieza por esta'}</h2>
            </div>
          </div>

          {nextLesson && (
            <a className="st-next-card" href={href({ name: 'curso', lessonId: nextLesson.id })}>
              <div className="st-next-type">
                <PlayCircle size={20} />
                <span>Lección {nextLesson.number}</span>
              </div>
              <div>
                <h3>{nextLesson.title}</h3>
                <p>{nextLesson.promise}</p>
                <div className="st-meta">
                  <span><Clock size={10} /> {nextLesson.minutes} min</span>
                  <span>{doneCount} de {coreLessons} hechas</span>
                </div>
              </div>
              <ArrowRight size={16} />
            </a>
          )}
        </section>

        <aside className="st-panel">
          <span className="st-kicker">La academia</span>
          <h2>Qué hay detrás</h2>
          <div className="st-support-map">
            <a href={href({ name: 'curso' })}><BookMarked size={14} /><span><strong>{coreLessons} lecciones guiadas</strong><small>La ruta que sí conviene seguir en orden.</small></span></a>
            <a href={href({ name: 'herramientas' })}><FolderSearch size={14} /><span><strong>{organizedTools} herramientas organizadas</strong><small>Cada ficha muestra como máximo 25 lecciones para evitar paredes de scroll.</small></span></a>
            <a href={href({ name: 'buscar', query: '', filters: {} })}><Search size={14} /><span><strong>{course.stats.fichas} fichas de consulta</strong><small>Para buscar algo concreto cuando te atasques.</small></span></a>
            <a href={href({ name: 'herramienta', toolId: 'n8n', filters: {} })}><Workflow size={14} /><span><strong>{course.stats.workflows} ejemplos ya hechos</strong><small>Automatizaciones que puedes copiar y usar.</small></span></a>
          </div>
          <div className="st-brand-row" aria-label="Herramientas que cubre el curso">
            {SHOWCASE.map((icon) => <BrandMark key={icon} icon={icon} size={16} />)}
          </div>
        </aside>
      </div>

      <section className="st-area-preview">
        <div className="st-section-head">
          <div>
            <span className="st-kicker">Programa</span>
            <h2>Las diez áreas</h2>
          </div>
          <a href={href({ name: 'ruta' })}>Ver la ruta completa</a>
        </div>
        <p className="st-area-preview-note">Estas áreas son el mapa completo. Para empezar, usa Programa o Mi proyecto; vuelve aquí cuando quieras profundizar.</p>
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
                  <small>{stage.categoryIds.length} categorías · {stage.lessonSlugs.length} lecciones · {stage.tagline}</small>
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
