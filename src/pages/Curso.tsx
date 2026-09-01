import { useState } from 'react'
import {
  ArrowLeft, ArrowRight, Ban, Check, CheckCircle2, Circle, Clock, Copy,
  HelpCircle, Languages, Lightbulb, Quote, Scale, Sparkles,
 AlertTriangle } from 'lucide-react'
import type { CursoLesson } from '../types'
import { useCourse } from '../course'
import { href } from '../router'
import { store, useLessonProgress } from '../store'
import { BrandMark } from '../components/Brand'
import Notebook from '../components/Notebook'
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
  const lecciones = [...(course.curso || [])].sort((a, b) => a.number - b.number)

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
    .filter((group) => group.items.length)

  const totalMin = lecciones.reduce((sum, item) => sum + item.minutes, 0)
  const requiredMin = sueltas.reduce((sum, item) => sum + item.minutes, 0)

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">El curso</span>
        <h1>Tu programa, paso a paso</h1>
        <p>
          Son {sueltas.length} lecciones, en orden, unas {Math.round(requiredMin / 60)} horas en total. Hazlas de una
          en una. Luego hay una ficha por cada herramienta ({porHerramienta.length} en total), con sus prompts y sus
          errores típicos: no las mires hasta que tu proyecto te pida una.
        </p>
      </div>

      <section className="st-course-scope">
        <div>
          <span>Ruta obligatoria</span>
          <strong>{sueltas.length} lecciones</strong>
          <small>Lo que haría cualquier alumno para empezar sin perderse.</small>
        </div>
        <div>
          <span>Herramientas</span>
          <strong>{porHerramienta.length} fichas</strong>
          <small>{conHerramienta.length} lecciones de itinerario, más guías, prompts y automatizaciones.</small>
        </div>
        <div>
          <span>Tiempo estimado</span>
          <strong>{Math.round(totalMin / 60)} h total</strong>
          <small>La ruta base tarda unas {Math.round(requiredMin / 60)} h.</small>
        </div>
      </section>

      <section className="st-program-guide">
        <div><span>→</span><strong>Entender</strong><small>Qué puede hacer la IA y dónde se equivoca.</small></div>
        <div><span>→</span><strong>Definir</strong><small>Qué problema quieres resolver y qué resultado esperas.</small></div>
        <div><span>→</span><strong>Construir</strong><small>Una primera versión pequeña y comprobable.</small></div>
        <div><span>✓</span><strong>Entregar</strong><small>Pruebas, documentación, seguridad y siguiente versión.</small></div>
      </section>

      <section className="st-curso-divider">
        <span className="st-kicker">Ruta principal · obligatoria</span>
        <h2>Aprende el método antes de elegir herramientas</h2>
        <p>Estas {sueltas.length} lecciones construyen la base: entender, definir, construir, automatizar y comprobar.</p>
      </section>
      {porArea.map(({ stage, items }) => (
        <section key={stage.id} className="st-curso-area">
          <div className="st-section-head">
            <div>
              <span className="st-kicker">Bloque {stage.number} · {stage.tagline}</span>
              <h2>{stage.title}</h2>
            </div>
            <span>
              {items.length > 1
                ? `Lecciones ${String(items[0].number).padStart(2, '0')} a ${String(items[items.length - 1].number).padStart(2, '0')}`
                : `Lección ${String(items[0].number).padStart(2, '0')}`}
            </span>
          </div>

          <ol className="st-curso-list">
            {items.map((item) => (
              <li key={item.id}>
                <a href={href({ name: 'curso', lessonId: item.id })}>
                  <span className="st-curso-num" aria-label={`Lección ${item.number} de ${sueltas.length}`}>
                    {String(item.number).padStart(2, '0')}
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

      <section className="st-curso-divider">
        <span className="st-kicker">Especializaciones · opcionales</span>
        <h2>Ahora sí: elige una herramienta concreta</h2>
        <p>
          Aquí sí aparece todo el catálogo. Si una herramienta ya tiene ruta paso a paso, verás sus lecciones debajo.
          Si todavía no tiene itinerario, entra en su ficha: allí están sus prompts, automatizaciones, primeros pasos y errores típicos.
        </p>
      </section>

      <section className="st-program-tools" aria-label="Herramientas disponibles">
        <div className="st-program-tools-grid">
          {porHerramienta.map(({ id, label, icon, count, guidePrompts, automations, items }) => (
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
                      ? `${countText(count, 'recurso', 'recursos')} de consulta`
                      : 'Guía práctica disponible'}
                </small>
              </span>
              <em>
                {guidePrompts ? <b>{guidePrompts} prompts</b> : null}
                {automations ? <b>{automations} automatizaciones</b> : null}
                {count ? <b>{count} recursos</b> : null}
              </em>
              <ArrowRight size={13} />
            </a>
          ))}
        </div>
      </section>

      <section className="st-curso-divider st-curso-divider-sub">
        <span className="st-kicker">Rutas ya escritas</span>
        <h2>Lecciones paso a paso</h2>
        <p>Estas herramientas ya tienen sus lecciones puestas en orden. Las demás se estudian desde su ficha, cuando te hagan falta.</p>
      </section>

      {herramientasConRuta.map(({ id, label, items }) => (
        <section key={id} className="st-curso-area">
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
    </div>
  )
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

  const posicion = lecciones.indexOf(leccion)
  const anterior = posicion > 0 ? lecciones[posicion - 1] : null
  const siguiente = posicion < lecciones.length - 1 ? lecciones[posicion + 1] : null
  const stage = course.stages.find((item) => item.id === leccion.stageId)
  const percent = Math.round((hechas.length / Math.max(1, leccion.tasks.length)) * 100)

  return (
    <article className="st-lesson">
      <header className="st-lesson-head">
        <span className="st-kicker">
          {leccion.tool ? 'Especialización' : 'Ruta principal'} · lección {String(leccion.number).padStart(2, '0')}{stage ? ` · ${stage.title}` : ''}
        </span>
        <h1>{leccion.title}</h1>
        <p className="st-lesson-headline">{leccion.promise}</p>
        <div className="st-lesson-meta">
          <span><Clock size={11} /> {leccion.minutes} min</span>
          <span>{leccion.tasks.length} tareas</span>
          <span>{leccion.theory.length} apartados</span>
        </div>
      </header>

      <section className="st-curso-why">
        <Sparkles size={14} />
        <p>{leccion.why}</p>
      </section>

      <div className="st-blocks">
        {leccion.theory.map((part, index) => (
          <section key={index} className="st-block st-block-seccion">
            <h3><Lightbulb size={15} /> {part.title}</h3>
            <p className="st-part-text">{part.text}</p>
            {part.analogy && (
              <p className="st-guide-analogy"><Quote size={13} /> <span>{part.analogy}</span></p>
            )}
            {part.example && (
              <p className="st-curso-example"><b>Por ejemplo:</b> {part.example}</p>
            )}
            {/* El dibujo va pegado al concepto que explica, no en un anexo. */}
            {part.visual && <Piece piece={part.visual} />}
          </section>
        ))}
      </div>

      {leccion.words?.length > 0 && (
        <section className="st-block st-block-palabras">
          <h3><Languages size={15} /> Las palabras que vas a leer, en cristiano</h3>
          <dl className="st-words">
            {leccion.words.map(([term, meaning]) => (
              <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>
            ))}
          </dl>
        </section>
      )}

      <section className="st-tasks">
        <div className="st-tasks-head">
          <div>
            <span className="st-kicker">Tu turno</span>
            <h2>Hazlo paso a paso</h2>
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

                <p className="st-task-action">{task.action}</p>
                {task.prompt && <Prompt text={task.prompt} />}
                <p className="st-task-expected"><b>Tienes que ver:</b> {task.expect}</p>
                {task.stuck && (
                  <p className="st-task-stuck">
                    <HelpCircle size={12} />
                    <span><b>Si no te sale:</b> {task.stuck}</span>
                  </p>
                )}
                <Notebook
                  slug={`curso:${lessonId}`}
                  level="intermedio"
                  noteKey={String(index)}
                  label="Qué te ha salido"
                  placeholder="Pega aquí el resultado o apunta lo que has decidido…"
                />
              </li>
            )
          })}
        </ol>
      </section>

      <section className="st-block st-block-importa">
        <h3><Scale size={15} /> Lo que importa y lo que no</h3>
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
      </section>

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

      {leccion.next && (
        <p className="st-curso-next"><ArrowRight size={13} /> <span>{leccion.next}</span></p>
      )}

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
