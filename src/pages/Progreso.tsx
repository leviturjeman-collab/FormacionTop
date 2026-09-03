import { Download, FileText, Trash2 } from 'lucide-react'
import { useCourse, useIndexes } from '../course'
import { href } from '../router'
import { store, useStudent } from '../store'

export default function Progreso() {
  const course = useCourse()
  const { bySlug } = useIndexes()
  const student = useStudent()

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

  // El cuaderno se exporta como texto legible, no como JSON: es lo que el
  // alumno enseña a un cliente o entrega al profesor.
  const downloadNotebook = () => {
    const parts: string[] = ['CUADERNO DEL CURSO', '='.repeat(60), '']
    for (const [slug, progress] of entries) {
      const lesson = bySlug.get(slug)
      if (!lesson || !progress.notes) continue
      for (const [level, notes] of Object.entries(progress.notes)) {
        const written = Object.entries(notes || {}).filter(([, text]) => text.trim())
        if (!written.length) continue
        parts.push(`${lesson.title}  ·  nivel ${level}`, '-'.repeat(60))
        for (const [key, text] of written) {
          parts.push(key === 'evidencia' ? 'EVIDENCIA:' : `Paso ${Number(key) + 1}:`, text.trim(), '')
        }
        parts.push('')
      }
    }
    const blob = new Blob([parts.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'cuaderno-del-curso.txt'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const notesWritten = Object.values(student.lessons).reduce(
    (sum, item) => sum + Object.values(item.notes || {}).reduce(
      (acc, level) => acc + Object.values(level || {}).filter((text) => text.trim()).length, 0,
    ),
    0,
  )

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
          <strong>{cursoDone}/{cursoBase.length}</strong>
          <span>lecciones del Programa completadas</span>
        </div>
        <div>
          <strong>{notesWritten}</strong>
          <span>notas en el cuaderno</span>
        </div>
      </div>

      <div className="st-actions">
        <button type="button" className="st-btn-ghost" onClick={download}>
          <Download size={13} />
          Descargar mi progreso
        </button>
        <button type="button" className="st-btn-ghost" onClick={downloadNotebook} disabled={!notesWritten}>
          <FileText size={13} />
          Descargar mi cuaderno
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
              <th>Niveles completados</th>
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
          <h2>Todavía no hay nada registrado</h2>
          <p>En cuanto completes el primer nivel de una lección, aparecerá aquí.</p>
          <a className="st-btn" href={href({ name: 'ruta' })}>Ir a la ruta</a>
        </div>
      )}
    </div>
  )
}
