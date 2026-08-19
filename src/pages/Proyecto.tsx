import { useState } from 'react'
import { CheckCircle2, ChevronRight, Circle, Clock, FileCode, Folder, PackageCheck, Rocket, TriangleAlert } from 'lucide-react'
import type { AreaProject } from '../types'
import { useCourse } from '../course'
import { href } from '../router'
import { Code } from '../components/Parts'

/**
 * Proyecto final de un área.
 *
 * Es lo que el alumno construye al terminar el área juntando todo lo aprendido:
 * código completo, paso a paso, que se copia y funciona.
 */
export default function Proyecto({ stageId }: { stageId: string }) {
  const course = useCourse()
  const [done, setDone] = useState<number[]>([])

  const project = (course.projects || []).find((item) => item.stageId === stageId) as AreaProject | undefined
  const stage = course.stages.find((item) => item.id === stageId)

  if (!project) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>Todavía no hay proyecto para esta área</h2>
          <p>Se está escribiendo. Mientras tanto, las lecciones del área ya están completas.</p>
          <a className="st-btn" href={href({ name: 'ruta' })}>Volver a la ruta</a>
        </div>
      </div>
    )
  }

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
        <span>Proyecto final</span>
      </nav>

      <header className="st-project-head">
        <span className="st-kicker"><Rocket size={11} /> Proyecto final del área</span>
        <h1>{project.title}</h1>
        <p className="st-lesson-headline">{project.pitch}</p>
        <p className="st-lesson-hook">{project.outcome}</p>
        <div className="st-lesson-meta">
          <span><Clock size={11} /> {project.time}</span>
          <span>{project.steps.length} pasos</span>
          <span>{project.structure.length} archivos</span>
        </div>
      </header>

      <div className="st-project-grid">
        <section className="st-block st-block-requisitos">
          <h3><PackageCheck size={15} /> Necesitas tener esto antes</h3>
          <ul className="st-plain">
            {project.requires.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="st-block st-block-app">
          <h3><Folder size={15} /> Cómo queda el proyecto</h3>
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
        <h2>Construcción paso a paso</h2>
        <span>{done.length}/{project.steps.length} hechos</span>
      </div>
      <div className="st-checkbar"><span style={{ width: `${percent}%` }} /></div>

      <ol className="st-project-steps">
        {project.steps.map((step, index) => (
          <li key={index} className={done.includes(index) ? 'done' : ''}>
            <div className="st-project-step-head">
              <button
                type="button"
                className="st-project-tick"
                onClick={() => setDone((current) =>
                  current.includes(index) ? current.filter((value) => value !== index) : [...current, index],
                )}
                aria-pressed={done.includes(index)}
              >
                {done.includes(index) ? <CheckCircle2 size={17} /> : <Circle size={17} />}
              </button>
              <div>
                <span className="st-kicker">Paso {index + 1}</span>
                <h3>{step.title}</h3>
              </div>
            </div>

            <p className="st-project-why">{step.why}</p>
            <Code code={step.code} lang={step.lang} />
            <p className="st-practice-expected"><b>Tienes que ver:</b> {step.expected}</p>
            {step.trouble && (
              <p className="st-project-trouble">
                <TriangleAlert size={12} />
                <span>{step.trouble}</span>
              </p>
            )}
          </li>
        ))}
      </ol>

      <section className="st-block st-block-comprobar">
        <h3><CheckCircle2 size={15} /> Está bien hecho si</h3>
        <ul className="st-plain">{project.checks.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>

      <section className="st-block st-block-ejemplo">
        <h3><Rocket size={15} /> Cómo ampliarlo</h3>
        <ol className="st-example">
          {project.extend.map((item, index) => (
            <li key={item}><span>{index + 1}</span>{item}</li>
          ))}
        </ol>
      </section>

      <section className="st-block st-block-decisiones">
        <h3>Te lo van a preguntar así</h3>
        <ul className="st-plain">{project.defend.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
    </div>
  )
}
