import { ArrowRight, BookMarked, BookOpen, Clock, PlayCircle, Puzzle, Search, Workflow } from 'lucide-react'
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
          <h1>{last ? 'Sigue donde lo dejaste.' : 'Aprende IA aplicada al trabajo real.'}</h1>
          <p>
            <strong>{course.stats.lessons} lecciones</strong> en {course.stats.categories} categorías, cada una en
            tres niveles. Elige tu nivel y cámbialo cuando quieras: la misma idea explicada para quien empieza,
            para quien construye y para quien tiene que responder por el resultado.
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
            <span className="st-kicker">Elige tu objetivo</span>
            <h2>¿Qué quieres hacer hoy?</h2>
          </div>
          <span>Te llevamos al sitio correcto</span>
        </div>
        <div className="st-start-grid">
          <a href={href({ name: 'curso' })}><BookMarked size={19} /><strong>Aprender desde cero</strong><small>Una ruta guiada, en orden y sin suponer conocimientos.</small><ArrowRight size={13} /></a>
          <a href={href({ name: 'mi-proyecto' })}><Puzzle size={19} /><strong>Crear mi proyecto</strong><small>Define el problema y conviértelo en algo que puedas construir.</small><ArrowRight size={13} /></a>
          <a href={href({ name: 'automatizaciones' })}><Workflow size={19} /><strong>Automatizar un proceso</strong><small>Leads, contenido, datos, soporte, avisos y operaciones.</small><ArrowRight size={13} /></a>
          <a href={href({ name: 'herramienta', toolId: 'higgsfield', filters: {} })}><PlayCircle size={19} /><strong>Crear vídeo con IA</strong><small>Higgsfield, Runway, ElevenLabs y el flujo completo.</small><ArrowRight size={13} /></a>
          <a href={href({ name: 'herramientas' })}><Search size={19} /><strong>Elegir una herramienta</strong><small>Compara qué hace cada una y con qué puedes combinarla.</small><ArrowRight size={13} /></a>
          <a href={href({ name: 'indice' })}><BookOpen size={19} /><strong>Entender una palabra</strong><small>Localhost, tokens, portapapeles, API y todo el vocabulario.</small><ArrowRight size={13} /></a>
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
          <h2>En números</h2>
          <dl className="st-stat-list">
            <div><dt>Lecciones</dt><dd>{course.stats.lessons}</dd></div>
            <div><dt>Categorías</dt><dd>{course.stats.categories}</dd></div>
            <div><dt>Bloques de contenido</dt><dd>{course.stats.blocks.toLocaleString('es-ES')}</dd></div>
            <div><dt>Preguntas</dt><dd>{course.stats.quizQuestions.toLocaleString('es-ES')}</dd></div>
            <div><dt>Piezas interactivas</dt><dd>{course.stats.interactivePieces.toLocaleString('es-ES')}</dd></div>
            <div><dt>Workflows importables</dt><dd>{course.stats.workflows}</dd></div>
            <div><dt>Conceptos indexados</dt><dd>{course.stats.terms}</dd></div>
          </dl>
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
