import { Download, Trash2 } from 'lucide-react'
import { useCourse, useIndexes } from '../course'
import { href } from '../router'
import { store, useStudent } from '../store'
import { useLocale } from '../i18n'

export default function Progreso() {
  const course = useCourse()
  const { bySlug } = useIndexes()
  const student = useStudent()
  const locale = useLocale()

  const entries = Object.entries(student.lessons)
    .filter(([slug, progress]) => !slug.startsWith('curso:') && progress.done.length > 0)
    .sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt))

  const totalDone = Object.values(student.lessons).reduce((sum, item) => sum + item.done.length, 0)

  // Avance del Programa (la ruta guiada): lecciones con todas sus tareas marcadas.
  const cursoBase = (course.curso || []).filter((lesson) => !lesson.tool)
  const cursoDone = cursoBase.filter((lesson) => {
    const progress = student.lessons['curso:' + lesson.id]
    if (progress?.done?.includes('intermedio')) return true
    const marked = progress?.checks?.intermedio || []
    return lesson.tasks.length > 0 && marked.length >= lesson.tasks.length
  }).length

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
        <span className="st-kicker">{locale === 'en' ? 'Your journey' : 'Tu recorrido'}</span>
        <h1>{locale === 'en' ? 'Progress' : 'Progreso'}</h1>
        <p>
          {locale === 'en' ? (
            <>All of this lives only in this browser. There are no accounts or server: if you clear your
            browser data, it's lost. Download it if you want to keep it or move it to another computer.</>
          ) : (
            <>Todo esto vive únicamente en este navegador. No hay cuentas ni servidor: si borras los datos del
            navegador, se pierde. Descárgalo si quieres conservarlo o llevarlo a otro equipo.</>
          )}
        </p>
      </div>

      <div className="st-stat-row">
        <div>
          <strong>{totalDone}</strong>
          <span>{locale === 'en' ? `levels completed out of ${course.stats.lessons * 3}` : `niveles completados de ${course.stats.lessons * 3}`}</span>
        </div>
        <div>
          <strong>{entries.length}</strong>
          <span>{locale === 'en' ? 'lessons touched' : 'lecciones tocadas'}</span>
        </div>
        <div>
          <strong>{cursoDone}/{cursoBase.length}</strong>
          <span>{locale === 'en' ? 'Program lessons completed' : 'lecciones del Programa completadas'}</span>
        </div>
      </div>

      <div className="st-actions">
        <button type="button" className="st-btn-ghost" onClick={download}>
          <Download size={13} />
          {locale === 'en' ? 'Download my progress' : 'Descargar mi progreso'}
        </button>
        <button
          type="button"
          className="st-btn-danger"
          onClick={() => {
            if (window.confirm(locale === 'en'
              ? 'This will delete all your progress in this browser. This action cannot be undone. Are you sure?'
              : 'Se borrará todo tu progreso en este navegador. Esta acción no se puede deshacer. ¿Seguro?')) {
              store.reset()
            }
          }}
        >
          <Trash2 size={13} />
          {locale === 'en' ? 'Delete all' : 'Borrar todo'}
        </button>
      </div>

      {entries.length ? (
        <table className="st-progress-table">
          <thead>
            <tr>
              <th>{locale === 'en' ? 'Lesson' : 'Lección'}</th>
              <th>{locale === 'en' ? 'Levels completed' : 'Niveles completados'}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([slug, progress]) => {
              const lesson = bySlug.get(slug)
              if (!lesson) return null
              return (
                <tr key={slug}>
                  <td><a href={href({ name: 'leccion', slug })}>{lesson.title}</a></td>
                  <td>
                    {progress.done.length
                      ? progress.done.map((level) => <span key={level} className="st-pill">{level}</span>)
                      : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <div className="st-empty">
          <h2>{locale === 'en' ? 'Nothing recorded yet' : 'Todavía no hay nada registrado'}</h2>
          <p>{locale === 'en' ? 'As soon as you complete the first level of a lesson, it will show up here.' : 'En cuanto completes el primer nivel de una lección, aparecerá aquí.'}</p>
          <a className="st-btn" href={href({ name: 'ruta' })}>{locale === 'en' ? 'Go to the path' : 'Ir a la ruta'}</a>
        </div>
      )}
    </div>
  )
}
