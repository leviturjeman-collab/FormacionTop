import { useEffect, useState } from 'react'
import { store, useLessonProgress } from '../store'
import { taskKey, emptyWorkspace } from '../project-workspace'
import { CheckCircle2, ChevronRight, Circle, Clock, FileCode, Folder, PackageCheck, Rocket, TriangleAlert } from 'lucide-react'
import type { AreaProject } from '../types'
import { useCourse } from '../course'
import { href } from '../router'
import { Code } from '../components/Parts'
import { useLocale } from '../i18n'

/**
 * Proyecto final de un área.
 *
 * Es lo que el alumno construye al terminar el área juntando todo lo aprendido:
 * código completo, paso a paso, que se copia y funciona.
 */
export default function Proyecto({ stageId }: { stageId: string }) {
  const course = useCourse()
  const locale = useLocale()
  const [transferred, setTransferred] = useState(false)
  useEffect(() => setTransferred(false), [stageId])
  const progress = useLessonProgress('project:' + stageId)
  const taskIds = progress.tasks?.intermedio || []

  const project = (course.projects || []).find((item) => item.stageId === stageId) as AreaProject | undefined
  const stage = course.stages.find((item) => item.id === stageId)

  if (!project) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>{locale === 'en' ? 'There is no project for this area yet' : 'Todavía no hay proyecto para esta área'}</h2>
          <p>{locale === 'en' ? 'It is being written. In the meantime, the lessons in this area are already complete.' : 'Se está escribiendo. Mientras tanto, las lecciones del área ya están completas.'}</p>
          <a className="st-btn" href={href({ name: 'ruta' })}>{locale === 'en' ? 'Back to the path' : 'Volver a la ruta'}</a>
        </div>
      </div>
    )
  }

  const readiness = project as AreaProject & { requirementIds?: string[]; acceptanceIds?: string[] }
  const requirementId = (item: string, index: number) => readiness.requirementIds?.[index] || taskKey({ title: item })
  const acceptanceId = (item: string, index: number) => readiness.acceptanceIds?.[index] || taskKey({ title: item })
  const done = project.steps.flatMap((step, index) => taskIds.includes(taskKey(step)) ? [index] : [])
  const percent = Math.round((done.length / project.steps.length) * 100)

  return (
    <div className="st-page">
      <nav className="breadcrumb st-lesson-meta">
        {stage && (
          <a href={href({ name: 'area', stageId, filters: {} })}>
            {stage.number}. {stage.title}
          </a>
        )}
        <ChevronRight size={11} />
        <span>{locale === 'en' ? 'Final project' : 'Proyecto final'}</span>
      </nav>

      <header className="st-project-head">
        <span className="st-kicker"><Rocket size={11} /> {locale === 'en' ? 'Final project of the area' : 'Proyecto final del área'}</span>
        <h1>{project.title}</h1>
        <p className="st-lesson-headline">{project.pitch}</p>
        <p className="st-lesson-hook">{project.outcome}</p>
        <div className="st-lesson-meta">
          <span><Clock size={11} /> {project.time}</span>
          <span>{project.steps.length} {locale === 'en' ? 'steps' : 'pasos'}</span>
          <span>{project.structure.length} {locale === 'en' ? 'files' : 'archivos'}</span>
        </div>
      </header>

      <div className="st-project-grid">
        <section className="st-block st-block-requisitos">
          <h3><PackageCheck size={15} /> {locale === 'en' ? 'You need to have this before you start' : 'Necesitas tener esto antes'}</h3>
          <ul className="st-plain">
            {project.requires.map((item, index) => <li key={item}><label><input type="checkbox" checked={Boolean(progress.tasks?.basico?.includes(requirementId(item, index)))} onChange={() => store.toggleTask('project:' + stageId, 'basico', requirementId(item, index))} />{item}</label></li>)}
          </ul>
        </section>

        <section className="st-block st-block-app">
          <h3><Folder size={15} /> {locale === 'en' ? 'How the project ends up' : 'Cómo queda el proyecto'}</h3>
          <ul className="st-tree st-tree-light">
            {project.structure.map((item) => (
              <li key={item.path} className="file">
                <span><FileCode size={12} /><code>{item.path}</code></span>
                <em>{item.what}</em>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="st-section-head">
        <h2>{locale === 'en' ? 'Step-by-step build' : 'Construcción paso a paso'}</h2>
        <span>{done.length}/{project.steps.length} {locale === 'en' ? 'done' : 'hechos'}</span>
      </div>
      <div className="st-checkbar"><span style={{ width: `${percent}%` }} /></div>

      <ol className="st-project-steps">
        {project.steps.map((step, index) => (
          <li key={index} className={done.includes(index) ? 'done' : ''}>
            <div className="st-project-step-head">
              <button
                type="button"
                className="st-project-tick"
                onClick={() => store.toggleTask('project:' + stageId, 'intermedio', taskKey(step))}
                aria-label={'Marcar paso ' + (index + 1) + ': ' + step.title}
                aria-pressed={done.includes(index)}
              >
                {done.includes(index) ? <CheckCircle2 size={17} /> : <Circle size={17} />}
              </button>
              <div>
                <span className="st-kicker">{locale === 'en' ? 'Step' : 'Paso'} {index + 1}</span>
                <h3>{step.title}</h3>
              </div>
            </div>

            <p className="st-project-why">{step.why}</p>
            <Code code={step.code} lang={step.lang} />
            <p className="st-practice-expected"><b>{locale === 'en' ? 'You should see:' : 'Tienes que ver:'}</b> {step.expected}</p>
            {step.trouble && (
              <p className="st-project-trouble">
                <TriangleAlert size={12} />
                <span>{step.trouble}</span>
              </p>
            )}
          </li>
        ))}
      </ol>

      <section className="st-block"><h3>{locale === 'en' ? 'Project evidence' : 'Evidencia del proyecto'}</h3><label>{locale === 'en' ? 'Outcome, tests and next improvement' : 'Resultado, pruebas y siguiente mejora'}<textarea aria-label={locale === 'en' ? 'Outcome, tests and next improvement' : 'Resultado, pruebas y siguiente mejora'} value={progress.notes.intermedio?.evidencia || ''} onChange={e => { store.setNote('project:' + stageId, 'intermedio', 'evidencia', e.target.value); setTransferred(false) }} /></label><a href={href({ name: 'mi-proyecto' })}>{locale === 'en' ? 'Open deliverables, reviews and impact in My project' : 'Abrir entregables, revisiones e impacto en Mi proyecto'}</a></section>
      <section className="st-block st-block-comprobar">
        <h3><CheckCircle2 size={15} /> {locale === 'en' ? 'It is done right if' : 'Está bien hecho si'}</h3>
        <ul className="st-plain">{project.checks.map((item, index) => <li key={item}><label><input type="checkbox" checked={Boolean(progress.tasks?.avanzado?.includes(acceptanceId(item, index)))} onChange={() => store.toggleTask('project:' + stageId, 'avanzado', acceptanceId(item, index))} />{item}</label></li>)}</ul>
      </section>

      <section className="st-block"><button type="button" className="st-btn" disabled={!progress.notes.intermedio?.evidencia?.trim() || transferred} onClick={() => {
        if (!store.get().project) store.createProject(project.title)
        const current = store.get().project!
        const workspace = { ...emptyWorkspace(), ...current.workspace }
        store.setProject({ ...current, workspace: { ...workspace, artifacts: [...workspace.artifacts, { id: crypto.randomUUID(), title: project.title, url: '', notes: (locale === 'en' ? 'Self-reported project evidence.\n' : 'Evidencia de proyecto declarada por el alumno.\n') + progress.notes.intermedio!.evidencia + '\n\n' + (progress.notes.intermedio?.defensa || ''), createdAt: new Date().toISOString() }] } })
        setTransferred(true)
      }}>{transferred ? (locale === 'en' ? 'Evidence added to My project' : 'Evidencia añadida a Mi proyecto') : (locale === 'en' ? 'Add this evidence to My project' : 'Añadir esta evidencia a Mi proyecto')}</button></section>
      <section className="st-block st-block-ejemplo">
        <h3><Rocket size={15} /> {locale === 'en' ? 'How to extend it' : 'Cómo ampliarlo'}</h3>
        <ol className="st-example">
          {project.extend.map((item, index) => (
            <li key={item}><span>{index + 1}</span>{item}</li>
          ))}
        </ol>
      </section>

      <section className="st-block st-block-decisiones">
        <h3>{locale === 'en' ? "This is how they'll ask you about it" : 'Te lo van a preguntar así'}</h3>
        <ul className="st-plain">{project.defend.map((item) => <li key={item}>{item}</li>)}</ul>
        <label>{locale === 'en' ? 'Defense rehearsal: answers and evidence' : 'Ensayo de defensa: respuestas y evidencias'}<textarea aria-label={locale === 'en' ? 'Defense rehearsal: answers and evidence' : 'Ensayo de defensa: respuestas y evidencias'} value={progress.notes.intermedio?.defensa || ''} onChange={e => { store.setNote('project:' + stageId, 'intermedio', 'defensa', e.target.value); setTransferred(false) }} /></label>
      </section>
    </div>
  )
}
