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

  const totalDone = Object.values(student.lessons).reduce((sum, item) => sum + item.done.length, 0)
  const totalLevels = course.stats.lessons * 3
  const percent = totalLevels ? Math.round((totalDone / totalLevels) * 100) : 0
  const coreLessons = (course.curso || []).filter((item) => !item.tool).length
  const toolLessons = (course.curso || []).filter((item) => item.tool).length

  const last = student.lastLesson ? bySlug.get(student.lastLesson) : null
  const firstStage = course.stages[0]
  const suggested = last || bySlug.get(firstStage.coreSlugs[0] || firstStage.lessonSlugs[0])
  const content = suggested?.levels[level]
  const suggestedCategory = suggested ? course.categories.find((item) => item.id === suggested.categoryId) : null

  return (
    <div className="st-page">
      <section className="st-welcome">
        <div>
          <span className="st-kicker">Espacio de trabajo</span>
          <h1>{last ? 'Sigue donde lo dejaste.' : 'Empieza por una ruta simple.'}</h1>
          <p>
            La ruta principal tiene <strong>{coreLessons} lecciones obligatorias</strong>. El resto de la academia queda
            como apoyo: herramientas, prompts, automatizaciones, diccionario y materiales para cuando los necesites.
          </p>
        </div>
        <div className="st-overall">
          <span>{percent}%</span>
          <small>{totalDone} de {totalLevels} niveles</small>
        </div>
      </section>

      <section className="st-start-panel">
        <div className="st-section-head">
          <div>
            <span className="st-kicker">Primer paso</span>
            <h2>Elige una de estas tres entradas</h2>
          </div>
          <span>Lo demás puede esperar</span>
        </div>
        <div className="st-start-grid st-start-grid-main">
          <a href={href({ name: 'curso' })}><BookMarked size={19} /><strong>Seguir la ruta guiada</strong><small>{coreLessons} lecciones en orden para entender, construir y entregar sin perderte.</small><ArrowRight size={13} /></a>
          <a href={href({ name: 'mi-proyecto' })}><Puzzle size={19} /><strong>Crear mi proyecto</strong><small>Define tu idea y recibe una ruta, herramientas y un prompt específico.</small><ArrowRight size={13} /></a>
          <a href={href({ name: 'prompts' })}><Sparkles size={19} /><strong>Usar un prompt</strong><small>Elige una situación, copia el prompt y guarda el resultado como evidencia.</small><ArrowRight size={13} /></a>
        </div>
        <div className="st-support-strip" aria-label="Recursos de apoyo">
          <a href={href({ name: 'kits' })}><Sparkles size={14} /> Kits institucionales</a>
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
              <h2>{last ? 'Tu última lección' : 'Tu primera lección'}</h2>
            </div>
          </div>

          {suggested && content && (
            <a className="st-next-card" href={href({ name: 'leccion', slug: suggested.slug, level })}>
              <div className="st-next-type">
                <PlayCircle size={20} />
                <span>{suggested.kindLabel}</span>
              </div>
              <div>
                <h3>{suggested.title}</h3>
                <p>{content.headline}</p>
                <div className="st-meta">
                  <span><Clock size={10} /> {content.minutes} min</span>
                  {suggestedCategory && <span>{suggestedCategory.label}</span>}
                  <span>Nivel {level}</span>
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
            <a href={href({ name: 'herramientas' })}><FolderSearch size={14} /><span><strong>{toolLessons} especializaciones</strong><small>Solo cuando ya sabes qué quieres construir.</small></span></a>
            <a href={href({ name: 'buscar', query: '', filters: {} })}><Search size={14} /><span><strong>{course.stats.lessons} recursos de apoyo</strong><small>Biblioteca para buscar cuando te bloquees.</small></span></a>
            <a href={href({ name: 'herramienta', toolId: 'n8n', filters: {} })}><Workflow size={14} /><span><strong>{course.stats.workflows} workflows y demos</strong><small>Material ejecutable para practicar.</small></span></a>
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
