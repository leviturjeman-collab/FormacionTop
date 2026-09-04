import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Circle, Clock, Copy, Download, FileText, FolderTree, ListChecks, Target, TriangleAlert, Wrench } from 'lucide-react'
import type { LessonAsset, LevelId } from '../types'
import { useCourse, useIndexes } from '../course'
import { href, navigate } from '../router'
import { store, useLessonProgress, useStudent } from '../store'
import Blocks from '../components/Blocks'
import FlowDiagram from '../components/FlowDiagram'
import Terminal from '../components/Terminal'
import PromptLab from '../components/PromptLab'
import Compare from '../components/Compare'
import CostCalc from '../components/CostCalc'
import Chunking from '../components/Chunking'
import Timeline from '../components/Timeline'
import CaseSim from '../components/CaseSim'
import Anatomy from '../components/Anatomy'
import Pipeline from '../components/Pipeline'
import { Bars, Chat, Checklist, FileTree, Flashcards } from '../components/Visuals'
import { ToolStrip } from '../components/Brand'
import TeacherPanel from '../components/TeacherPanel'
import Piece from '../components/Piece'

function AssetCode({ asset }: { asset: LessonAsset }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(asset.code).then(
      () => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
      },
      () => setCopied(false),
    )
  }

  return (
    <div className="st-asset-code">
      <div className="st-asset-code-head">
        <div>
          <span className="st-kicker">{asset.kind === 'workflow' ? 'Workflow importable' : 'Código real de la lección'}</span>
          <strong>{asset.name}</strong>
          <small>{asset.sourcePath}</small>
        </div>
        <div className="st-asset-actions">
          <button type="button" onClick={copy}><Copy size={13} /> {copied ? 'Copiado' : 'Copiar código'}</button>
          {asset.downloadPath && <a href={asset.downloadPath} download={asset.name}><Download size={13} /> Descargar</a>}
        </div>
      </div>
      <pre><code>{asset.code}</code></pre>
    </div>
  )
}

export default function Leccion({ slug, level }: { slug: string; level?: LevelId }) {
  const course = useCourse()
  const { bySlug, stageById } = useIndexes()
  const student = useStudent()
  const progress = useLessonProgress(slug)

  const lesson = bySlug.get(slug)
  const active: LevelId = level || student.preferredLevel || 'basico'

  useEffect(() => {
    if (lesson) store.visit(slug)
  }, [slug, lesson])

  if (!lesson) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>Esa lección no existe</h2>
          <p>El enlace apunta a «{slug}», que no está en el curso. Puede que el contenido se haya reorganizado y haya que regenerar el índice.</p>
          <a className="st-btn" href={href({ name: 'ruta' })}>Volver a la ruta</a>
        </div>
      </div>
    )
  }

  const esFicha = lesson.format === 'ficha'
  // Una ficha no tiene niveles: es consulta rápida, se lee y ya.
  const content = lesson.levels[esFicha ? 'intermedio' : active]
  const stage = stageById.get(lesson.stageId)
  const category = course.categories.find((item) => item.id === lesson.categoryId)
  const section = course.sections.find((item) => item.id === lesson.sectionId)
  const isDone = progress.done.includes(active)
  const checks = progress.checks[active] || []
  // Las tareas comparten almacén con el checklist, desplazadas para no chocar.
  const taskDone = checks.filter((item) => item >= 100).map((item) => item - 100)

  /* Anterior y siguiente. Se recorre la categoría, que es el orden natural,
   * pero cuando se acaba (o cuando la categoría tiene una sola lección) se
   * sigue por el área. Así ninguna lección queda sin salida. */
  const catSlugs = category?.lessonSlugs || []
  const stageSlugs = stage?.lessonSlugs || []
  const siblings = catSlugs.length > 1 && catSlugs.includes(slug) ? catSlugs : stageSlugs
  const position = siblings.indexOf(slug)
  const stagePosition = stageSlugs.indexOf(slug)
  const previous =
    (position > 0 ? bySlug.get(siblings[position - 1]) : null) ||
    (stagePosition > 0 ? bySlug.get(stageSlugs[stagePosition - 1]) : null) ||
    null
  const next =
    (position >= 0 && position < siblings.length - 1 ? bySlug.get(siblings[position + 1]) : null) ||
    (stagePosition >= 0 && stagePosition < stageSlugs.length - 1 ? bySlug.get(stageSlugs[stagePosition + 1]) : null) ||
    null

  const setLevel = (nextLevel: LevelId) => {
    store.setPreferredLevel(nextLevel)
    navigate({ name: 'leccion', slug, level: nextLevel })
  }

  return (
    <article className="st-lesson">
      <header className="st-lesson-head">
        <span className="st-kicker">{esFicha ? 'Ficha de consulta' : lesson.kindLabel}</span>
        <h1>{lesson.title}</h1>
        <p className="st-lesson-headline">{content.headline}</p>
        <p className="st-lesson-hook">{content.hook}</p>

        <div className="st-lesson-meta">
          {stage && (
            <a href={href({ name: 'area', stageId: stage.id, filters: {} })}>
              <FolderTree size={11} /> {stage.number}. {stage.title}
            </a>
          )}
          {category && (
            <a href={href({ name: 'categoria', categoryId: category.id, filters: {} })}>
              <FileText size={11} /> {category.label}
            </a>
          )}
          {section && <span>{section.label}</span>}
          <span><Clock size={11} /> {content.minutes} min en este nivel</span>
          {position >= 0 && <span>{position + 1} de {siblings.length} en la categoría</span>}
        </div>

        <ToolStrip tools={lesson.tools} size={14} />
      </header>

      <section className={`st-lesson-map${esFicha ? ' st-lesson-map-support' : ''}`}>
        <div>
          <BookOpen size={15} />
          <strong>{esFicha ? '1. Consulta' : '1. Elige nivel'}</strong>
          <small>{esFicha ? 'Esta página es apoyo puntual. No tienes que estudiarla en orden.' : 'Básico, intermedio o avanzado cambian la profundidad de la explicación.'}</small>
        </div>
        <div>
          <ListChecks size={15} />
          <strong>{esFicha ? '2. Usa lo necesario' : '2. Haz práctica'}</strong>
          <small>{esFicha ? 'Copia el archivo, dato o idea que necesites y vuelve a tu tarea.' : 'Lee el ejemplo, sigue los pasos y marca OK cuando lo hayas visto.'}</small>
        </div>
        <div>
          <Wrench size={15} />
          <strong>{esFicha ? '3. Vuelve al programa' : '3. No mezcles rutas'}</strong>
          <small>{esFicha ? 'Si te pierdes, vuelve a Programa o a Mi proyecto.' : 'Esta lección pertenece a su categoría; las herramientas son apoyo aparte.'}</small>
        </div>
      </section>

      {!esFicha && (
      <div className="st-level-tabs" role="tablist" aria-label="Nivel de la lección">
        {course.levels.map((meta) => {
          const levelDone = progress.done.includes(meta.id)
          return (
            <button
              key={meta.id}
              type="button"
              role="tab"
              aria-selected={meta.id === active}
              className={`st-level-tab${meta.id === active ? ' active' : ''}${levelDone ? ' done' : ''}`}
              onClick={() => setLevel(meta.id)}
            >
              <strong>{meta.label}</strong>
              <em>{meta.promise}</em>
              <span>{meta.audience}</span>
            </button>
          )
        })}
      </div>
      )}

      {!esFicha && (
      <section className="st-objectives">
        <strong><Target size={11} /> Al terminar este nivel</strong>
        <ul>
          {content.objectives.map((objective) => <li key={objective}>{objective}</li>)}
        </ul>
      </section>
      )}

      {student.teacher && <TeacherPanel lesson={lesson} level={active} />}

      {lesson.assets && lesson.assets.length > 0 && (
        <section className="st-lesson-assets">
          <div className="st-section-head">
            <div>
              <span className="st-kicker">Material ejecutable</span>
              <h2>Lo que tienes que usar</h2>
            </div>
            <span>{lesson.assets.length} archivos asociados</span>
          </div>
          <p className="st-assets-intro">Estos son los archivos reales vinculados a esta lección. Lee primero la explicación, después copia el archivo y prueba el caso de ejemplo con datos ficticios.</p>
          <div className="st-assets-list">
            {lesson.assets.map((asset) => <AssetCode key={asset.sourcePath} asset={asset} />)}
          </div>
        </section>
      )}

      <Blocks blocks={content.blocks} />

      {lesson.interactive.length > 0 && (
        <section className="st-interactive">
          <h2>Practica con esto</h2>
          {lesson.interactive.map((piece, index) => <Piece key={index} piece={piece} />)}
        </section>
      )}

      {!esFicha && (
      <section className="st-tasks">
        <div className="st-tasks-head">
          <div>
            <span className="st-kicker">Tu turno</span>
            <h2>{content.practice.goal}</h2>
          </div>
          <span className="st-piece-badge" data-full={taskDone.length === content.practice.steps.length ? 'true' : undefined}>
            {taskDone.length}/{content.practice.steps.length} tareas
          </span>
        </div>
        <div className="st-checkbar">
          <span style={{ width: `${(taskDone.length / content.practice.steps.length) * 100}%` }} />
        </div>

        <ol className="st-task-list">
          {content.practice.steps.map((step, index) => {
            const hecha = taskDone.includes(index)
            return (
              <li key={index} className={hecha ? 'done' : ''}>
                <div className="st-task-head">
                  <button
                    type="button"
                    className="st-task-tick"
                    onClick={() => store.toggleCheck(slug, active, 100 + index)}
                    aria-pressed={hecha}
                    aria-label={hecha ? 'Marcar como pendiente' : 'Marcar como hecha'}
                  >
                    {hecha ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                  <div>
                    <span className="st-task-where">{step.where}</span>
                    <h3>{step.title}</h3>
                  </div>
                </div>

                <details className="st-task-detail" open={index === 0 || hecha}>
                  <summary>Abrir pasos</summary>
                  <div>
                    <div className="st-step-guide">
                      <section>
                        <b>Ejemplo real</b>
                        <p>{step.title}</p>
                      </section>
                      <section>
                        <b>Paso a paso</b>
                        <ol>
                          <li>{step.where}</li>
                          <li>{step.action}</li>
                        </ol>
                      </section>
                      <section>
                        <b>Qué mirar al final</b>
                        <p>{step.expected}</p>
                      </section>
                    </div>

                    <button
                      type="button"
                      className={`st-task-ok${hecha ? ' done' : ''}`}
                      onClick={() => {
                        if (!hecha) store.toggleCheck(slug, active, 100 + index)
                      }}
                      disabled={hecha}
                    >
                      <CheckCircle2 size={14} />
                      {hecha ? 'Hecho' : 'OK, hecho'}
                    </button>
                  </div>
                </details>
              </li>
            )
          })}
        </ol>

        <div className="st-final-check">
          <CheckCircle2 size={15} />
          <div>
            <b>Al final deberías ver esto</b>
            <p>{content.practice.evidence}</p>
          </div>
        </div>
      </section>
      )}

      {content.pitfalls.length > 0 && (
        <section className="st-pitfalls">
          <h2><TriangleAlert size={16} /> Dónde se atasca todo el mundo</h2>
          <ul>
            {content.pitfalls.map((pitfall, index) => (
              <li key={index}>
                <strong>{pitfall.error}</strong>
                <p>{pitfall.fix}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="st-checklist">
        <h2>Antes de darlo por hecho</h2>
        <ul>
          {content.checklist.map((item, index) => (
            <li key={item}>
              <button type="button" onClick={() => store.toggleCheck(slug, active, index)} aria-pressed={checks.includes(index)}>
                {checks.includes(index) ? <CheckCircle2 size={15} /> : <Circle size={15} />}
                <span>{item}</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`st-btn st-complete${isDone ? ' done' : ''}`}
          onClick={() => store.toggleDone(slug, active)}
        >
          {isDone ? <CheckCircle2 size={15} /> : <Circle size={15} />}
          {isDone ? `Nivel ${active} completado` : `Marcar nivel ${active} como completado`}
        </button>
      </section>

      {lesson.related.length > 0 && (
        <section className="st-related">
          <h2>Relacionado en la academia</h2>
          <ul>
            {lesson.related.map((relatedSlug) => {
              const related = bySlug.get(relatedSlug)
              return related ? (
                <li key={relatedSlug}>
                  <a href={href({ name: 'leccion', slug: relatedSlug, level: active })}>{related.title}</a>
                </li>
              ) : null
            })}
          </ul>
        </section>
      )}

      <nav className="st-lesson-nav">
        {previous ? (
          <a href={href({ name: 'leccion', slug: previous.slug, level: active })}>
            <ArrowLeft size={14} />
            <span><em>Anterior</em><b>{previous.title}</b></span>
          </a>
        ) : <span />}
        {next && (
          <a className="next" href={href({ name: 'leccion', slug: next.slug, level: active })}>
            <span><em>Siguiente</em><b>{next.title}</b></span>
            <ArrowRight size={14} />
          </a>
        )}
      </nav>
    </article>
  )
}
