import { Download, Trash2 } from 'lucide-react'
import { useCourse, useIndexes } from '../course'
import { href } from '../router'
import { store, useStudent } from '../store'

export default function Progreso() {
  const course = useCourse()
  const { bySlug } = useIndexes()
  const student = useStudent()

  const entries = Object.entries(student.lessons)
    .filter(([, progress]) =>
      progress.done.length > 0 ||
      Object.values(progress.checks || {}).some((checks) => (checks || []).length > 0)
    )
    .sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt))

  const totalDone = Object.values(student.lessons).reduce((sum, item) => sum + item.done.length, 0)
  const totalChecks = Object.values(student.lessons).reduce(
    (sum, item) => sum + Object.values(item.checks || {}).reduce((acc, checks) => acc + (checks || []).length, 0),
    0,
  )

  const lessonInfo = (slug: string) => {
    if (slug.startsWith('curso:')) {
      const lessonId = slug.slice('curso:'.length)
      const lesson = course.curso.find((item) => item.id === lessonId)
      return lesson
        ? { title: lesson.title, link: href({ name: 'curso', lessonId }) }
        : null
    }
    // Solo quedan lecciones del programa: lo demás son restos de progreso viejo.
    return null
  }

  const download = () => {
    const blob = new Blob([store.export()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'progreso-academia.json'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">Tu recorrido</span>
        <h1>Progreso</h1>
        <p>
          Todo esto vive únicamente en este navegador. No hay cuentas ni servidor: si borras los datos del
          navegador, se pierde. Descárgalo si quieres conservarlo o llevarlo a otro equipo.
        </p>
      </div>

      <div className="st-stat-row">
        <div>
          <strong>{totalDone}</strong>
          <span>niveles completados de {course.stats.lessons * 3}</span>
        </div>
        <div>
          <strong>{entries.length}</strong>
          <span>lecciones tocadas</span>
        </div>
        <div>
          <strong>{totalChecks}</strong>
          <span>tareas marcadas con OK</span>
        </div>
        <div>
          <strong>{course.stages.length}</strong>
          <span>bloques de la ruta</span>
        </div>
      </div>

      <div className="st-actions">
        <button type="button" className="st-btn-ghost" onClick={download}>
          <Download size={13} />
          Descargar mi progreso
        </button>
        <button
          type="button"
          className="st-btn-danger"
          onClick={() => {
            if (window.confirm('Se borrará todo tu progreso en este navegador. Esta acción no se puede deshacer. ¿Seguro?')) {
              store.reset()
            }
          }}
        >
          <Trash2 size={13} />
          Borrar todo
        </button>
      </div>

      {entries.length ? (
        <table className="st-progress-table">
          <thead>
            <tr>
              <th>Lección</th>
              <th>Niveles</th>
              <th>Tareas OK</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([slug, progress]) => {
              const lesson = lessonInfo(slug)
              if (!lesson) return null
              const checks = Object.values(progress.checks || {}).reduce((sum, list) => sum + (list || []).length, 0)
              return (
                <tr key={slug}>
                  <td><a href={lesson.link}>{lesson.title}</a></td>
                  <td>
                    {progress.done.length
                      ? progress.done.map((level) => <span key={level} className="st-pill">{level}</span>)
                      : '—'}
                  </td>
                  <td>
                    {checks ? <span className="st-pill">{checks} OK</span> : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <div className="st-empty">
          <h2>Todavía no hay nada registrado</h2>
          <p>En cuanto completes el primer nivel de una lección, aparecerá aquí.</p>
          <a className="st-btn" href={href({ name: 'curso' })}>Ir a la ruta</a>
        </div>
      )}
    </div>
  )
}
