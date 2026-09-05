import { useRef, useState } from 'react'
import { Download, Trash2, Upload } from 'lucide-react'
import { useCourse, useIndexes } from '../course'
import { href } from '../router'
import { store, useStudent, usePersistence } from '../store'
import { useLocale } from '../i18n'

export default function Progreso() {
  const course = useCourse()
  const { bySlug } = useIndexes()
  const student = useStudent()
  const persistence = usePersistence()
  const locale = useLocale()
  const fileInput = useRef<HTMLInputElement>(null)
  const [importMessage, setImportMessage] = useState('')
  const [importing, setImporting] = useState(false)

  const entries = Object.entries(student.lessons)
    .filter(([slug, progress]) => !slug.startsWith('curso:') && bySlug.has(slug) && progress.done.length > 0)
    .sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt))

  const totalDone = Object.entries(student.lessons).filter(([slug]) => !slug.startsWith('curso:') && bySlug.has(slug)).reduce((sum, [, item]) => sum + item.done.length, 0)

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
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">{locale === 'en' ? 'Your journey' : 'Tu recorrido'}</span>
        <h1>{locale === 'en' ? 'Progress' : 'Progreso'}</h1>
        <p>
          {locale === 'en' ? (
            <>Your progress and projects sync with your account. Wait for the saved status before switching devices. You can also download a backup and import it later.</>
          ) : (
            <>Tu progreso y tus proyectos se sincronizan con tu cuenta. Espera a que aparezcan guardados antes de cambiar de dispositivo. También puedes descargar una copia e importarla después.</>
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
        <p role="status">{persistence.message}</p>
        <input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={async (event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (!file) return
          setImportMessage('')
          setImporting(true)
          try {
            if (file.size > 5_000_000) throw new Error(locale === 'en' ? 'The backup exceeds 5 MB.' : 'La copia supera los 5 MB.')
            const result = store.import(await file.text())
            setImportMessage(locale === 'en' ? `Imported: ${result.lessons} lessons and ${result.projects} projects. Changes will sync with your account.` : `Importados: ${result.lessons} lecciones y ${result.projects} proyectos. Los cambios se sincronizarán con tu cuenta.`)
          } catch (error) {
            setImportMessage(locale === 'en' ? 'Could not import the backup. Check that it is a valid academy export with no conflicting lesson versions.' : error instanceof Error ? error.message : 'No se pudo importar la copia.')
          } finally { setImporting(false) }
        }} />
        <button type="button" className="st-btn-ghost" disabled={importing} onClick={() => fileInput.current?.click()}>
          <Upload size={13} /> {importing ? (locale === 'en' ? 'Importing…' : 'Importando…') : (locale === 'en' ? 'Import a backup' : 'Importar una copia')}
        </button>
        <button type="button" className="st-btn-ghost" onClick={download}>
          <Download size={13} />
          {locale === 'en' ? 'Download my progress' : 'Descargar mi progreso'}
        </button>
        <button
          type="button"
          className="st-btn-danger"
          onClick={() => {
            if (window.confirm(locale === 'en'
              ? 'This will delete ALL progress and projects from your account and sync the deletion to your devices. Download a backup first. This cannot be undone. Continue?'
              : 'Se borrarán TODO tu progreso y tus proyectos de tu cuenta y el borrado se sincronizará con tus dispositivos. Descarga antes una copia. No se puede deshacer. ¿Continuar?')) {
              store.reset()
            }
          }}
        >
          <Trash2 size={13} />
          {locale === 'en' ? 'Delete all' : 'Borrar todo'}
        </button>
      </div>

      {importMessage && <p role="status">{importMessage}</p>}

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
