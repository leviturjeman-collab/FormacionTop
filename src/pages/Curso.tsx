import { useState } from 'react'
import {
  ArrowLeft, ArrowRight, Ban, BookOpen, Check, CheckCircle2, Circle, Clock, Copy,
  HelpCircle, Languages, Lightbulb, ListChecks, Quote, Scale, Sparkles, Wrench,
  AlertTriangle } from 'lucide-react'
import type { CursoLesson } from '../types'
import { useCourse } from '../course'
import { href } from '../router'
import { store, useLessonProgress, useStudent } from '../store'
import { BrandMark } from '../components/Brand'
import Piece from '../components/Piece'

/**
 * El programa curado: lecciones escritas a mano, en orden.
 *
 * Cada una es teoría corta y bien explicada, y después una guía de tareas que
 * el alumno va marcando, con el prompt exacto donde hace falta.
 */

function Prompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="st-task-prompt">
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(text).then(
            () => {
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1800)
            },
            () => setCopied(false),
          )
        }}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? 'Copiado' : 'Copiar y pegarlo en la IA'}
      </button>
      <pre>{text}</pre>
    </div>
  )
}

const countText = (count: number, singular: string, plural: string) => `${count} ${count === 1 ? singular : plural}`

/* ------------------------------------------------------------------ *
 * ÍNDICE DEL CURSO                                                    *
 * ------------------------------------------------------------------ */

export function CursoIndice() {
  const course = useCourse()
  const student = useStudent()
  const lecciones = [...(course.curso || [])].sort((a, b) => a.number - b.number)
  const [focusedStage, setFocusedStage] = useState<string | null>(null)
  const [openStages, setOpenStages] = useState<Set<string>>(() => new Set())

  if (!lecciones.length) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>El curso se está escribiendo</h2>
          <p>Las lecciones se están preparando. Vuelve en un rato.</p>
        </div>
      </div>
    )
  }

  // La ruta común va primero. Las especializaciones se consultan después,
  // cuando el alumno ya entiende qué quiere construir.
  const conHerramienta = lecciones.filter((item) => item.tool)
  const sueltas = lecciones.filter((item) => !item.tool)
  const isDone = (item: CursoLesson) => {
    const progress = student.lessons['curso:' + item.id]
    const marked = progress?.checks?.intermedio || []
    if (progress?.done?.includes('intermedio')) return true
    return item.tasks.length > 0 && marked.length >= item.tasks.length
  }
  const hechas = sueltas.filter(isDone).length
  const siguienteBase = sueltas.find((item) => !isDone(item)) || sueltas[0]
  const etapaActual = siguienteBase?.stageId || porAreaPrimera(course)

  const porHerramienta = course.toolPages
    .map((pagina) => {
      const items = conHerramienta
        .filter((item) => item.tool === pagina.id)
        .sort((a, b) => (a.slot || 0) - (b.slot || 0))
      return {
        id: pagina.id,
        label: pagina.label,
        icon: pagina.icon,
        count: pagina.count,
        totalCount: pagina.totalCount ?? pagina.count,
        maxLessons: pagina.maxLessons ?? 25,
        guidePrompts: pagina.guide?.prompts?.length || 0,
        automations: pagina.guide?.automations?.length || 0,
        hasGuide: Boolean(pagina.guide),
        items,
      }
    })
    .filter((tool) => tool.items.length || tool.count || tool.hasGuide)
    .sort((a, b) => Number(Boolean(b.items.length)) - Number(Boolean(a.items.length)) || b.count - a.count || a.label.localeCompare(b.label, 'es'))

  const herramientasConRuta = porHerramienta.filter((tool) => tool.items.length)

  const porArea = course.stages
    .map((stage) => ({ stage, items: sueltas.filter((item) => item.stageId === stage.id) }))
  const areasConLecciones = porArea.filter((group) => group.items.length)
  const areasBiblioteca = porArea.filter((group) => !group.items.length)
  const focusedStageMeta = focusedStage ? areasConLecciones.find(({ stage }) => stage.id === focusedStage)?.stage : null

  const requiredMin = sueltas.reduce((sum, item) => sum + item.minutes, 0)

  function syncStageOpen(id: string, open: boolean) {
    setOpenStages((current) => {
      const next = new Set(current)
      if (open) next.add(id)
      else next.delete(id)
      return next
    })
    if (open) {
      setFocusedStage(id)
      window.requestAnimationFrame(() => {
        document.querySelector('.st-curso-area-stack')?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior })
      })
    } else if (focusedStage === id) {
      setFocusedStage(null)
    }
  }

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">El curso</span>
        <h1>Programa significa ruta principal</h1>
        <p>
          Aquí no tienes que estudiar todo lo que existe en la web. Programa es la ruta principal: {sueltas.length}
          lecciones para aprender el método. Las herramientas, prompts y automatizaciones son apoyo para cuando una
          lección o tu proyecto te pidan usarlas.
        </p>
      </div>

      <section className="st-program-now">
        <div>
          <span className="st-kicker">Qué hago ahora</span>
          <h2>{siguienteBase ? `Siguiente: ${siguienteBase.title}` : 'Empieza por la primera lección'}</h2>
          <p>
            Abre una lección, lee solo los bloques que necesites, haz las tareas marcables y vuelve al programa.
            Si una herramienta te interesa, entra en su ficha desde la zona opcional.
          </p>
        </div>
        <a className="st-btn" href={href({ name: 'curso', lessonId: siguienteBase?.id || sueltas[0]?.id || '' })}>
          Ir a la lección
          <ArrowRight size={13} />
        </a>
      </section>

      <section className="st-course-scope">
        <div>
          <span>1. Ruta principal</span>
          <strong>{hechas}/{sueltas.length} hechas</strong>
          <small>Lo único que conviene seguir en orden.</small>
        </div>
        <div>
          <span>2. Herramientas</span>
          <strong>{porHerramienta.length} fichas</strong>
          <small>Entras solo cuando una lección o proyecto menciona una herramienta.</small>
        </div>
        <div>
          <span>3. Extras</span>
          <strong>Prompts y flujos</strong>
          <small>No son deberes: son plantillas para copiar cuando ya sabes qué quieres hacer.</small>
        </div>
        <div>
          <span>4. Pendiente de curar</span>
          <strong>{areasBiblioteca.length} bloques</strong>
          <small>Tienen biblioteca, pero aún no forman parte de la ruta principal.</small>
        </div>
      </section>

      <section className="st-program-guide">
        <div><span>1</span><strong>Lee</strong><small>Primero entiende la idea con ejemplos sencillos.</small></div>
        <div><span>2</span><strong>Haz</strong><small>Después completa las tareas que se pueden marcar.</small></div>
        <div><span>3</span><strong>Comprueba</strong><small>Mira que coincide con el ejemplo y marca OK.</small></div>
        <div><span>4</span><strong>Sigue</strong><small>Vuelve aquí y abre la siguiente lección.</small></div>
      </section>

      <section className="st-curso-divider">
        <span className="st-kicker">Ruta principal</span>
        <h2>Abre un bloque y sigue sus lecciones</h2>
        <p>Los bloques están plegados para que no parezca una biblioteca infinita. Abre el bloque actual y avanza de arriba abajo.</p>
      </section>
      {focusedStageMeta && (
        <div className="st-inline-focusbar">
          <button type="button" className="st-btn-ghost" onClick={() => setFocusedStage(null)}>
            <ArrowLeft size={12} /> Volver a todos los bloques
          </button>
          <span>Bloque {focusedStageMeta.number} · {focusedStageMeta.title}</span>
        </div>
      )}
      <div className={`st-curso-area-stack${focusedStage ? ' is-focused' : ''}`}>
      {areasConLecciones.map(({ stage, items }) => (
        <details
          key={stage.id}
          className={`st-curso-area${focusedStage === stage.id ? ' is-active-focus' : ''}`}
          open={focusedStage ? focusedStage === stage.id : openStages.has(stage.id) || stage.id === etapaActual}
          onToggle={(event) => syncStageOpen(stage.id, event.currentTarget.open)}
        >
          <summary className="st-curso-area-head">
            <div>
              <span className="st-kicker">Bloque {stage.number} · {stage.tagline}</span>
              <h2>{stage.title}</h2>
              <p>{items.length} lecciones de este bloque.</p>
            </div>
            <span>
              {items.length > 1
                ? `Lecciones ${String(items[0].number).padStart(2, '0')} a ${String(items[items.length - 1].number).padStart(2, '0')}`
                : `Lección ${String(items[0].number).padStart(2, '0')}`}
            </span>
          </summary>

          <ol className="st-curso-list">
            {items.map((item) => {
              const done = isDone(item)
              return (
              <li key={item.id} className={done ? 'done' : ''}>
                <a href={href({ name: 'curso', lessonId: item.id })}>
                  <span className="st-curso-num" aria-label={`Lección ${item.number} de ${sueltas.length}`}>
                    {String(item.number).padStart(2, '0')}
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.promise}</p>
                  </div>
                  <span className="st-curso-state">{done ? 'Hecha' : 'Pendiente'}</span>
                  <span className="st-curso-min"><Clock size={11} /> {item.minutes}′</span>
                  <ArrowRight size={14} />
                </a>
              </li>
              )
            })}
          </ol>
        </details>
      ))}
      </div>

      {areasBiblioteca.length > 0 && (
        <section className="st-curso-pending">
          <div className="st-section-head">
            <div>
              <span className="st-kicker">Biblioteca de apoyo</span>
              <h2>Bloques que todavía no tienen ruta principal</h2>
              <p>
                No se muestran como deberes porque aún no tienen lecciones principales curadas. El alumno puede consultarlos desde la biblioteca del bloque.
              </p>
            </div>
            <span>{areasBiblioteca.length} bloques</span>
          </div>
          <div className="st-program-tools-grid">
            {areasBiblioteca.map(({ stage }) => (
              <a key={stage.id} className="st-program-tool-card" href={href({ name: 'area', stageId: stage.id, filters: {} })}>
                <span className="st-curso-num">{String(stage.number).padStart(2, '0')}</span>
                <span>
                  <strong>{stage.title}</strong>
                  <small>{stage.categoryIds.length} categorías disponibles como consulta.</small>
                </span>
                <em><b>Biblioteca</b></em>
                <ArrowRight size={13} />
              </a>
            ))}
          </div>
        </section>
      )}

      <details className="st-curso-optional">
        <summary>
          <div>
            <span className="st-kicker">Apoyo opcional</span>
            <h2>Herramientas, prompts y automatizaciones</h2>
            <p>Abre esto solo cuando necesites una herramienta concreta. No forma parte de la ruta principal.</p>
          </div>
          <span>{porHerramienta.length} fichas</span>
        </summary>
        <section className="st-program-tools" aria-label="Herramientas disponibles">
          <div className="st-program-tools-grid">
            {porHerramienta.map(({ id, label, icon, count, totalCount, maxLessons, guidePrompts, automations, items }) => (
              <a
                key={id}
                className="st-program-tool-card"
                data-itinerary={items.length ? 'true' : undefined}
                href={href({ name: 'herramienta', toolId: id, filters: {} })}
              >
                <BrandMark icon={icon} size={22} />
                <span>
                  <strong>{label}</strong>
                  <small>
                    {items.length
                      ? `${countText(items.length, 'lección', 'lecciones')} paso a paso`
                      : count
                        ? `${countText(count, 'lección seleccionada', 'lecciones seleccionadas')}${totalCount > count ? ` de ${totalCount}` : ''}`
                        : 'Guía práctica disponible'}
                  </small>
                </span>
                <em>
                  {guidePrompts ? <b>{guidePrompts} prompts</b> : null}
                  {automations ? <b>{automations} automatizaciones</b> : null}
                  {count ? <b>máx. {maxLessons} lecciones</b> : null}
                </em>
                <ArrowRight size={13} />
              </a>
            ))}
          </div>
        </section>
      </details>

      <details className="st-curso-optional">
        <summary>
          <div>
            <span className="st-kicker">Especializaciones</span>
            <h2>Rutas de herramienta ya escritas</h2>
            <p>Son recorridos aparte. Úsalos cuando tu proyecto ya pida trabajar con esa herramienta.</p>
          </div>
          <span>{herramientasConRuta.length} rutas</span>
        </summary>

        {herramientasConRuta.map(({ id, label, items }) => (
          <section key={id} className="st-curso-tool-route">
            <div className="st-section-head">
              <div>
                <span className="st-kicker">Ruta de herramienta</span>
                <h2>{label}</h2>
              </div>
              <span>{countText(items.length, 'lección disponible', 'lecciones disponibles')}</span>
            </div>

            <ol className="st-curso-list">
              {items.map((item) => (
                <li key={item.id}>
                  <a href={href({ name: 'curso', lessonId: item.id })}>
                    <span className="st-curso-num st-curso-num-paso">
                      Paso {String(item.slot || item.number).padStart(2, '0')}
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.promise}</p>
                    </div>
                    <span className="st-curso-min"><Clock size={11} /> {item.minutes}′</span>
                    <ArrowRight size={14} />
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </details>
    </div>
  )
}

function porAreaPrimera(course: ReturnType<typeof useCourse>) {
  return course.stages[0]?.id || ''
}

/* ------------------------------------------------------------------ *
 * UNA LECCIÓN                                                         *
 * ------------------------------------------------------------------ */

export function CursoLeccion({ lessonId }: { lessonId: string }) {
  const course = useCourse()
  const progress = useLessonProgress(`curso:${lessonId}`)
  const hechas = progress.checks.intermedio || []

  const lecciones = [...(course.curso || [])].sort((a, b) => a.number - b.number)
  const leccion = lecciones.find((item) => item.id === lessonId) as CursoLesson | undefined

  if (!leccion) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>Esa lección todavía no está</h2>
          <a className="st-btn" href={href({ name: 'curso' })}>Ver el curso</a>
        </div>
      </div>
    )
  }

  const rutaActual = leccion.tool
    ? lecciones.filter((item) => item.tool === leccion.tool).sort((a, b) => (a.slot || a.number) - (b.slot || b.number))
    : lecciones.filter((item) => !item.tool).sort((a, b) => a.number - b.number)
  const posicion = rutaActual.findIndex((item) => item.id === leccion.id)
  const anterior = posicion > 0 ? rutaActual[posicion - 1] : null
  const siguiente = posicion >= 0 && posicion < rutaActual.length - 1 ? rutaActual[posicion + 1] : null
  const stage = course.stages.find((item) => item.id === leccion.stageId)
  const percent = Math.round((hechas.length / Math.max(1, leccion.tasks.length)) * 100)
  const toolMeta = leccion.tool ? course.toolPages.find((tool) => tool.id === leccion.tool) : null
  const leccionCompleta = progress.done.includes('intermedio')

  return (
    <article className="st-lesson">
      <a className="st-lesson-back" href={href({ name: 'curso' })}><ArrowLeft size={13} /> Volver al programa</a>
      <header className="st-lesson-head">
        <span className="st-kicker">
          {leccion.tool ? `Especialización · ${toolMeta?.label || leccion.tool}` : 'Ruta principal'} · {posicion + 1} de {rutaActual.length}{stage ? ` · ${stage.title}` : ''}
        </span>
        <h1>{leccion.title}</h1>
        <p className="st-lesson-headline">{leccion.promise}</p>
        <div className="st-lesson-meta">
          <span><Clock size={11} /> {leccion.minutes} min</span>
          <span>{leccion.tasks.length} tareas</span>
          <span>{leccion.theory.length} apartados</span>
        </div>
      </header>

      <section className="st-lesson-map">
        <div>
          <BookOpen size={15} />
          <strong>1. Entiende</strong>
          <small>Lee el primer bloque abierto. Los demás se abren si necesitas más contexto.</small>
        </div>
        <div>
          <ListChecks size={15} />
          <strong>2. Haz</strong>
          <small>Completa las tareas de “Tu turno” y marca cada una cuando lo veas en pantalla.</small>
        </div>
        <div>
          <Wrench size={15} />
          <strong>3. Sigue</strong>
          <small>{siguiente ? 'Usa el botón “Siguiente” al final.' : 'Esta es la última de esta ruta.'}</small>
        </div>
      </section>

      <section className="st-curso-why">
        <Sparkles size={14} />
        <p>{leccion.why}</p>
      </section>

      <section className="st-lesson-section-intro">
        <span className="st-kicker">Primero entiende esto</span>
        <h2>La explicación está en bloques plegables</h2>
        <p>Abre solo lo que necesites. El primer bloque viene abierto para que sepas por dónde empezar.</p>
      </section>

      <div className="st-blocks">
        {leccion.theory.map((part, index) => (
          <details key={index} className="st-block st-block-seccion" open={index === 0}>
            <summary>
              <span><Lightbulb size={15} /><strong>{part.title}</strong></span>
              <span className="st-block-summary-meta"><i>Abrir</i></span>
            </summary>
            <div className="st-block-body">
              <p className="st-part-text">{part.text}</p>
              {part.analogy && (
                <p className="st-guide-analogy"><Quote size={13} /> <span>{part.analogy}</span></p>
              )}
              {part.example && (
                <p className="st-curso-example"><b>Por ejemplo:</b> {part.example}</p>
              )}
              {/* El dibujo va pegado al concepto que explica, no en un anexo. */}
              {part.visual && <Piece piece={part.visual} />}
            </div>
          </details>
        ))}
      </div>

      {leccion.words?.length > 0 && (
        <details className="st-block st-block-palabras">
          <summary>
            <span><Languages size={15} /><strong>Las palabras que vas a leer, en cristiano</strong></span>
            <span className="st-block-summary-meta"><b>{leccion.words.length}</b><i>Abrir</i></span>
          </summary>
          <div className="st-block-body">
            <dl className="st-words">
              {leccion.words.map(([term, meaning]) => (
                <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>
              ))}
            </dl>
          </div>
        </details>
      )}

      <section className="st-tasks">
        <div className="st-tasks-head">
          <div>
            <span className="st-kicker">Tu turno</span>
            <h2>Hazlo paso a paso</h2>
            <p>Primero abre la instrucción, después haz la acción y al final marca el círculo cuando lo hayas visto en pantalla.</p>
          </div>
          <span className="st-piece-badge" data-full={percent === 100 ? 'true' : undefined}>
            {hechas.length}/{leccion.tasks.length} tareas
          </span>
        </div>
        <div className="st-checkbar"><span style={{ width: `${percent}%` }} /></div>

        <ol className="st-task-list">
          {leccion.tasks.map((task, index) => {
            const hecha = hechas.includes(index)
            return (
              <li key={index} className={hecha ? 'done' : ''}>
                <div className="st-task-head">
                  <button
                    type="button"
                    className="st-task-tick"
                    onClick={() => store.toggleCheck(`curso:${lessonId}`, 'intermedio', index)}
                    aria-pressed={hecha}
                    aria-label={hecha ? 'Marcar como pendiente' : 'Marcar como hecha'}
                  >
                    {hecha ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                  <div>
                    <span className="st-task-where">{task.where}</span>
                    <h3>{task.title}</h3>
                  </div>
                </div>

                <details className="st-task-detail" open={index === 0 || hecha}>
                  <summary>Abrir pasos</summary>
                  <div>
                    <div className="st-step-guide">
                      <section>
                        <b>Ejemplo real</b>
                        <p>{task.title}</p>
                      </section>
                      <section>
                        <b>Paso a paso</b>
                        <ol>
                          <li>{task.where}</li>
                          <li>{task.action}</li>
                          {task.prompt && <li>Copia el prompt de abajo, pégalo en la IA y cambia los huecos por tus datos.</li>}
                        </ol>
                      </section>
                    </div>
                    {task.prompt && <Prompt text={task.prompt} />}
                    <div className="st-step-guide">
                      <section>
                        <b>Qué mirar al final</b>
                        <p>{task.expect}</p>
                      </section>
                    </div>
                    {task.stuck && (
                      <p className="st-task-stuck">
                        <HelpCircle size={12} />
                        <span><b>Si algo no encaja:</b> {task.stuck}</span>
                      </p>
                    )}
                    <button
                      type="button"
                      className={`st-task-ok${hecha ? ' done' : ''}`}
                      onClick={() => {
                        if (!hecha) store.toggleCheck(`curso:${lessonId}`, 'intermedio', index)
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
      </section>

      <details className="st-block st-block-importa">
        <summary>
          <span><Scale size={15} /><strong>Lo que importa y lo que no</strong></span>
          <span className="st-block-summary-meta"><b>{leccion.matters.length + leccion.ignore.length}</b><i>Abrir</i></span>
        </summary>
        <div className="st-block-body">
          <div className="st-matters">
            <div className="st-matters-yes">
              <strong><Check size={11} /> Presta atención a esto</strong>
              <ul>{leccion.matters.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="st-matters-no">
              <strong><Ban size={11} /> Puedes ignorar esto</strong>
              <ul>{leccion.ignore.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      </details>

      {leccion.pieces?.length ? (
        <section className="st-interactive">
          <h2>Practica con esto</h2>
          {leccion.pieces.map((piece, index) => <Piece key={index} piece={piece} />)}
        </section>
      ) : null}

      {leccion.errors?.length > 0 && (
        <section className="st-errors">
          <h3><AlertTriangle size={12} /> Lo que se te va a romper</h3>
          <p className="st-errors-intro">
            El mensaje tal y como sale en pantalla, qué significa en castellano y qué hacer.
          </p>
          <ol>
            {leccion.errors.map((fallo) => (
              <li key={fallo.message}>
                <code>{fallo.message}</code>
                <p className="st-error-means"><b>Qué significa</b> {fallo.means}</p>
                <p className="st-error-fix"><b>Qué haces</b> {fallo.fix}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <details className="st-block st-block-importa">
        <summary>
          <span><Check size={15} /><strong>Atajos prácticos y límites</strong></span>
          <span className="st-block-summary-meta"><b>{leccion.canDo.length + leccion.cantDo.length}</b><i>Abrir</i></span>
        </summary>
        <div className="st-block-body">
          <div className="st-matters">
            <div className="st-matters-yes">
              <strong><Check size={11} /> Esto la IA sí lo hace bien</strong>
              <ul>{leccion.canDo.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="st-matters-no">
              <strong><Ban size={11} /> Esto no lo hace</strong>
              <ul>{leccion.cantDo.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      </details>

      {leccion.next && (
        <p className="st-curso-next"><ArrowRight size={13} /> <span>{leccion.next}</span></p>
      )}

      <section className="st-lesson-complete" data-done={leccionCompleta ? 'true' : undefined}>
        <div>
          <span className="st-kicker">Cierre de la lección</span>
          <h2>{leccionCompleta ? 'Lección completada' : 'Cuando termines, marca la lección'}</h2>
          <p>
            Usa este botón al terminar toda la lección. Sirve para que el Programa marque esta pieza como hecha y sepa
            por dónde tienes que seguir.
          </p>
        </div>
        <button
          type="button"
          className="st-btn"
          onClick={() => store.toggleDone(`curso:${lessonId}`, 'intermedio')}
          aria-pressed={leccionCompleta}
        >
          {leccionCompleta ? <CheckCircle2 size={15} /> : <Circle size={15} />}
          {leccionCompleta ? 'Quitar completado' : 'Marcar lección completada'}
        </button>
      </section>

      <nav className="st-lesson-nav">
        {anterior ? (
          <a href={href({ name: 'curso', lessonId: anterior.id })}>
            <ArrowLeft size={14} />
            <span><em>Anterior</em><b>{anterior.title}</b></span>
          </a>
        ) : <span />}
        {siguiente && (
          <a className="next" href={href({ name: 'curso', lessonId: siguiente.id })}>
            <span><em>Siguiente</em><b>{siguiente.title}</b></span>
            <ArrowRight size={14} />
          </a>
        )}
      </nav>
    </article>
  )
}
