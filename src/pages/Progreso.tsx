import { workspaceText } from '../project-workspace-i18n'
import { useState } from 'react'
import { Download, Trash2 } from 'lucide-react'
import { useCourse, useIndexes } from '../course'
import { href } from '../router'
import { store, useStudent, usePersistence, validateStudent } from '../store'
import { useLocale } from '../i18n'

export default function Progreso() {
  const course = useCourse()
  const { bySlug } = useIndexes()
  const student = useStudent()
  const locale = useLocale()
  const t = workspaceText(locale)
  const persistence = usePersistence()
  const [importText, setImportText] = useState('')
  const [importName, setImportName] = useState('')
  const [importMessage, setImportMessage] = useState('')
  const [importPreview, setImportPreview] = useState({ lessons: 0, projects: 0 })
  const legacy = store.exportLegacy()

  const entries = Object.entries(student.lessons)
    .filter(([slug]) => Boolean(bySlug.get(slug)))
    .sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt))

  const totalDone = entries.reduce((sum, [slug, item]) => sum + (bySlug.get(slug)?.format === 'ficha' ? Math.min(1, item.done.length) : item.done.length), 0)
  const totalUnits = course.lessons.reduce((sum, lesson) => sum + (lesson.format === 'ficha' ? 1 : 3), 0)

  // Avance del Programa (la ruta guiada): lecciones con todas sus tareas marcadas.
  const cursoBase = (course.curso || []).filter((lesson) => !lesson.tool)
  const cursoDone = cursoBase.filter((lesson) => {
    const progress = student.lessons['curso:' + lesson.id]
    return Boolean(progress?.done?.includes('intermedio'))
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
            <>Your account synchronizes this work with the server and keeps a local recovery copy. Download a backup when needed. The current save status appears below.</>
          ) : (
            <>Tu cuenta sincroniza este trabajo con el servidor y conserva una copia local de recuperación. Puedes descargar una copia adicional. El estado actual del guardado aparece debajo.</>
          )}
        </p>
      </div>

      <p role="status">{persistence.message}</p>{persistence.status === 'error' && <button className="st-btn" onClick={() => store.retrySave()}>{t("Reintentar guardado")}</button>}
      {persistence.conflict && <section className="st-block"><h2>{locale === 'en' ? 'Resolve simultaneous edits' : 'Resolver cambios simultáneos'}</h2><p>{locale === 'en' ? 'Download a backup before choosing which version to keep. This changes the active version; the other version is preserved as a local recovery copy.' : 'Descarga una copia antes de elegir qué versión conservar. Esto cambia la versión activa; la otra se conserva como copia local de recuperación.'}</p>{(['keep-local', 'use-remote'] as const).map(mode => <button key={mode} className="st-btn-ghost" onClick={async () => { if (!window.confirm(locale === 'en' ? 'Download a backup and use the selected version?' : '¿Descargar una copia y usar la versión seleccionada?')) return; download(); try { await store.resolveRemoteConflict(mode) } catch (error) { setImportMessage(error instanceof Error ? error.message : 'No se pudo resolver el conflicto') } }}>{mode === 'keep-local' ? (locale === 'en' ? 'Keep my local version' : 'Conservar mi versión local') : (locale === 'en' ? 'Use server version' : 'Usar versión del servidor')}</button>)}</section>}
      <div className="st-stat-row">
        <div>
          <strong>{totalDone}</strong>
          <span>{locale === 'en' ? `library units completed out of ${totalUnits}` : `unidades de biblioteca completadas de ${totalUnits}`}</span>
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

      {legacy && <section className="st-block"><h2>{t("Copia anterior encontrada")}</h2><p>{t("Este navegador contiene una copia del formato anterior. Descárgala y revisa si es tu trabajo antes de importarla en tu perfil.")}</p><button className="st-btn" onClick={() => { const url = URL.createObjectURL(new Blob([legacy], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = 'progreso-anterior.json'; link.click(); URL.revokeObjectURL(url) }}>{t("Descargar copia anterior")}</button></section>}
      <section className="st-block"><h2>{t("Restaurar una copia")}</h2><p>{t("Selecciona")} tu JSON de progreso. Puedes combinarlo con lo actual o sustituir el trabajo de este perfil. La validación se realiza antes de cambiar datos.</p><label>{t("Archivo de progreso")}<input aria-label={t("Archivo de progreso")} type="file" accept=".json,application/json" onChange={async e => { const file = e.target.files?.[0]; setImportText(''); setImportMessage(''); if (!file) return; if (file.size > 5_000_000) { setImportMessage(t("El archivo supera 5 MB.")); return } try { const raw = await file.text(); const parsed = validateStudent(JSON.parse(raw)); setImportPreview({ lessons: Object.keys(parsed.lessons).length, projects: parsed.projects.length }); setImportText(raw); setImportName(file.name) } catch { setImportMessage(t("No se pudo leer un JSON válido.")) } }} /></label>{importText && <><p>{t("Archivo preparado:")} {importName} · {importPreview.lessons} lecciones · {importPreview.projects} {t("proyectos")}</p><button className="st-btn" onClick={() => { try { const result = store.import(importText, 'merge'); setImportMessage(`Importados ${result.lessons} registros de lección y ${result.projects} proyectos.`); setImportText('') } catch (error) { setImportMessage(error instanceof Error ? error.message : t("Importación rechazada")) } }}>{t("Combinar con mi progreso")}</button><button className="st-btn-danger" onClick={() => { if (!window.confirm(t("¿Sustituir el progreso de este perfil por la copia seleccionada? Descarga antes una copia de lo actual."))) return; try { store.import(importText, 'replace'); setImportMessage(t("Copia restaurada.")); setImportText('') } catch (error) { setImportMessage(error instanceof Error ? error.message : t("Importación rechazada")) } }}>{t("Sustituir por la copia")}</button></>}<p role="status">{importMessage}</p></section>
      <section className="st-block"><h2>{t("Proyectos")}</h2><p>{(student.projects || []).length} proyectos personales. {Object.keys(student.lessons).filter(key => key.startsWith('project:')).length} {t("proyectos de área con actividad.")}</p><a href={href({ name: 'mi-proyecto' })}>{t("Ver entregables, pruebas e impacto")}</a></section>
      {entries.length ? (
        <table className="st-progress-table">
          <thead>
            <tr>
              <th>{locale === 'en' ? 'Lesson' : 'Lección'}</th>
              <th>{locale === 'en' ? 'Levels completed' : 'Niveles completados'}</th>
              <th>{locale === 'en' ? 'Self-check attempts' : 'Intentos de autoevaluación'}</th>
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
                      : (locale === 'en' ? 'In progress' : 'En curso')}
                  </td>
                  <td>{Object.entries(progress.quizAttempts || {}).map(([level, attempts]) => { const last = attempts?.at(-1); return last ? <p key={level}>{level}: {last.correct}/{last.total} · {attempts?.length} {locale === 'en' ? 'attempts' : 'intentos'} · {new Date(last.at).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES')}</p> : null })}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <div className="st-empty">
          <h2>{locale === 'en' ? 'Nothing recorded yet' : 'Todavía no hay nada registrado'}</h2>
          <p>{locale === 'en' ? 'As soon as you complete the first level of a lesson, it will show up here.' : 'Las lecciones aparecen cuando registras tareas, notas o completados. El Programa y los proyectos tienen su resumen propio.'}</p>
          <a className="st-btn" href={href({ name: 'ruta' })}>{locale === 'en' ? 'Go to the path' : 'Ir a la ruta'}</a>
        </div>
      )}
    </div>
  )
}
