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
import Notebook from '../components/Notebook'
import Piece from '../components/Piece'
import { useLocale } from '../i18n'

/**
 * El programa curado: lecciones escritas a mano, en orden.
 *
 * Cada una es teoría corta y bien explicada, y después una guía de tareas que
 * el alumno va marcando, con el prompt exacto donde hace falta.
 */

function Prompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const locale = useLocale()
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
        {copied
          ? (locale === 'en' ? 'Copied' : 'Copiado')
          : (locale === 'en' ? 'Copy and paste it into the AI' : 'Copiar y pegarlo en la IA')}
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
  const locale = useLocale()
  const lecciones = [...(course.curso || [])].sort((a, b) => a.number - b.number)

  if (!lecciones.length) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>{locale === 'en' ? 'The course is being written' : 'El curso se está escribiendo'}</h2>
          <p>{locale === 'en' ? 'Lessons are being prepared. Check back soon.' : 'Las lecciones se están preparando. Vuelve en un rato.'}</p>
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
    .filter((group) => group.items.length)

  const requiredMin = sueltas.reduce((sum, item) => sum + item.minutes, 0)

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">{locale === 'en' ? 'The course' : 'El curso'}</span>
        <h1>{locale === 'en' ? 'Program means the main path' : 'Programa significa ruta principal'}</h1>
        <p>
          {locale === 'en' ? (
            <>You don't have to study everything that exists on the web. Programa is the main path: {sueltas.length} lessons
            to learn the method. Tools, prompts and automations are support for when a lesson or your project ask you to use them.</>
          ) : (
            <>Aquí no tienes que estudiar todo lo que existe en la web. Programa es la ruta principal: {sueltas.length}
            lecciones para aprender el método. Las herramientas, prompts y automatizaciones son apoyo para cuando una
            lección o tu proyecto te pidan usarlas.</>
          )}
        </p>
      </div>

      <section className="st-program-now">
        <div>
          <span className="st-kicker">{locale === 'en' ? 'What to do now' : 'Qué hago ahora'}</span>
          <h2>{siguienteBase ? (locale === 'en' ? `Next: ${siguienteBase.title}` : `Siguiente: ${siguienteBase.title}`) : (locale === 'en' ? 'Start with the first lesson' : 'Empieza por la primera lección')}</h2>
          <p>
            {locale === 'en'
              ? 'Open a lesson, read only the blocks you need, do the checkable tasks and come back to the program. If a tool interests you, open its page from the optional section.'
              : 'Abre una lección, lee solo los bloques que necesites, haz las tareas marcables y vuelve al programa. Si una herramienta te interesa, entra en su ficha desde la zona opcional.'}
          </p>
        </div>
        <a className="st-btn" href={href({ name: 'curso', lessonId: siguienteBase?.id || sueltas[0]?.id || '' })}>
          {locale === 'en' ? 'Go to the lesson' : 'Ir a la lección'}
          <ArrowRight size={13} />
        </a>
      </section>

      <section className="st-course-scope">
        <div>
          <span>{locale === 'en' ? '1. Main path' : '1. Ruta principal'}</span>
          <strong>{hechas}/{sueltas.length} {locale === 'en' ? 'done' : 'hechas'}</strong>
          <small>{locale === 'en' ? 'The only thing worth following in order.' : 'Lo único que conviene seguir en orden.'}</small>
        </div>
        <div>
          <span>{locale === 'en' ? '2. Tools' : '2. Herramientas'}</span>
          <strong>{porHerramienta.length} {locale === 'en' ? 'pages' : 'fichas'}</strong>
          <small>{locale === 'en' ? 'Come in only when a lesson or project mentions a tool.' : 'Entras solo cuando una lección o proyecto menciona una herramienta.'}</small>
        </div>
        <div>
          <span>{locale === 'en' ? '3. Extras' : '3. Extras'}</span>
          <strong>{locale === 'en' ? 'Prompts and flows' : 'Prompts y flujos'}</strong>
          <small>{locale === 'en' ? "They're not homework: they're templates to copy once you already know what you want to do." : 'No son deberes: son plantillas para copiar cuando ya sabes qué quieres hacer.'}</small>
        </div>
      </section>

      <section className="st-program-guide">
        <div><span>1</span><strong>{locale === 'en' ? 'Read' : 'Lee'}</strong><small>{locale === 'en' ? 'First understand the idea with simple examples.' : 'Primero entiende la idea con ejemplos sencillos.'}</small></div>
        <div><span>2</span><strong>{locale === 'en' ? 'Do' : 'Haz'}</strong><small>{locale === 'en' ? 'Then complete the tasks you can check off.' : 'Después completa las tareas que se pueden marcar.'}</small></div>
        <div><span>3</span><strong>{locale === 'en' ? 'Save' : 'Guarda'}</strong><small>{locale === 'en' ? 'Note the evidence so you don’t lose the result.' : 'Apunta la evidencia para no perder el resultado.'}</small></div>
        <div><span>4</span><strong>{locale === 'en' ? 'Continue' : 'Sigue'}</strong><small>{locale === 'en' ? 'Come back here and open the next lesson.' : 'Vuelve aquí y abre la siguiente lección.'}</small></div>
      </section>

      <section className="st-curso-divider">
        <span className="st-kicker">{locale === 'en' ? 'Main path' : 'Ruta principal'}</span>
        <h2>{locale === 'en' ? 'Open a block and follow its lessons' : 'Abre un bloque y sigue sus lecciones'}</h2>
        <p>{locale === 'en' ? "Blocks are collapsed so this doesn't look like an endless library. Open the current block and work through it top to bottom." : 'Los bloques están plegados para que no parezca una biblioteca infinita. Abre el bloque actual y avanza de arriba abajo.'}</p>
      </section>
      {porArea.map(({ stage, items }) => (
        <details key={stage.id} className="st-curso-area" open={stage.id === etapaActual}>
          <summary className="st-curso-area-head">
            <div>
              <span className="st-kicker">{locale === 'en' ? 'Block' : 'Bloque'} {stage.number} · {stage.tagline}</span>
              <h2>{stage.title}</h2>
              <p>{items.length} {locale === 'en' ? 'lessons in this block.' : 'lecciones de este bloque.'}</p>
            </div>
            <span>
              {items.length > 1
                ? (locale === 'en'
                    ? `Lessons ${String(items[0].number).padStart(2, '0')} to ${String(items[items.length - 1].number).padStart(2, '0')}`
                    : `Lecciones ${String(items[0].number).padStart(2, '0')} a ${String(items[items.length - 1].number).padStart(2, '0')}`)
                : (locale === 'en'
                    ? `Lesson ${String(items[0].number).padStart(2, '0')}`
                    : `Lección ${String(items[0].number).padStart(2, '0')}`)}
            </span>
          </summary>

          <ol className="st-curso-list">
            {items.map((item) => {
              const done = isDone(item)
              return (
              <li key={item.id} className={done ? 'done' : ''}>
                <a href={href({ name: 'curso', lessonId: item.id })}>
                  <span className="st-curso-num" aria-label={locale === 'en' ? `Lesson ${item.number} of ${sueltas.length}` : `Lección ${item.number} de ${sueltas.length}`}>
                    {String(item.number).padStart(2, '0')}
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.promise}</p>
                  </div>
                  <span className="st-curso-state">{done ? (locale === 'en' ? 'Done' : 'Hecha') : (locale === 'en' ? 'Pending' : 'Pendiente')}</span>
                  <span className="st-curso-min"><Clock size={11} /> {item.minutes}′</span>
                  <ArrowRight size={14} />
                </a>
              </li>
              )
            })}
          </ol>
        </details>
      ))}

      <details className="st-curso-optional">
        <summary>
          <div>
            <span className="st-kicker">{locale === 'en' ? 'Optional support' : 'Apoyo opcional'}</span>
            <h2>{locale === 'en' ? 'Tools, prompts and automations' : 'Herramientas, prompts y automatizaciones'}</h2>
            <p>{locale === 'en' ? "Open this only when you need a specific tool. It's not part of the main path." : 'Abre esto solo cuando necesites una herramienta concreta. No forma parte de la ruta principal.'}</p>
          </div>
          <span>{porHerramienta.length} {locale === 'en' ? 'pages' : 'fichas'}</span>
        </summary>
        <section className="st-program-tools" aria-label={locale === 'en' ? 'Available tools' : 'Herramientas disponibles'}>
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
            <span className="st-kicker">{locale === 'en' ? 'Specializations' : 'Especializaciones'}</span>
            <h2>{locale === 'en' ? 'Ready-made tool paths' : 'Rutas de herramienta ya escritas'}</h2>
            <p>{locale === 'en' ? "These are separate tracks. Use them once your project actually asks you to work with that tool." : 'Son recorridos aparte. Úsalos cuando tu proyecto ya pida trabajar con esa herramienta.'}</p>
          </div>
          <span>{herramientasConRuta.length} {locale === 'en' ? 'paths' : 'rutas'}</span>
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
  const locale = useLocale()
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
      <a className="st-lesson-back" href={href({ name: 'curso' })}><ArrowLeft size={13} /> {locale === 'en' ? 'Back to the program' : 'Volver al programa'}</a>
      <header className="st-lesson-head">
        <span className="st-kicker">
          {leccion.tool
            ? (locale === 'en' ? `Specialization · ${toolMeta?.label || leccion.tool}` : `Especialización · ${toolMeta?.label || leccion.tool}`)
            : (locale === 'en' ? 'Main path' : 'Ruta principal')} · {posicion + 1} {locale === 'en' ? 'of' : 'de'} {rutaActual.length}{stage ? ` · ${stage.title}` : ''}
        </span>
        <h1>{leccion.title}</h1>
        <p className="st-lesson-headline">{leccion.promise}</p>
        <div className="st-lesson-meta">
          <span><Clock size={11} /> {leccion.minutes} min</span>
          <span>{leccion.tasks.length} {locale === 'en' ? 'tasks' : 'tareas'}</span>
          <span>{leccion.theory.length} {locale === 'en' ? 'sections' : 'apartados'}</span>
        </div>
      </header>

      <section className="st-lesson-map">
        <div>
          <BookOpen size={15} />
          <strong>{locale === 'en' ? '1. Understand' : '1. Entiende'}</strong>
          <small>{locale === 'en' ? 'Read the first open block. The others open if you need more context.' : 'Lee el primer bloque abierto. Los demás se abren si necesitas más contexto.'}</small>
        </div>
        <div>
          <ListChecks size={15} />
          <strong>{locale === 'en' ? '2. Do' : '2. Haz'}</strong>
          <small>{locale === 'en' ? 'Complete the tasks in “Your turn” and check each one off once you see the result.' : 'Completa las tareas de “Tu turno” y marca cada una cuando veas el resultado.'}</small>
        </div>
        <div>
          <Wrench size={15} />
          <strong>{locale === 'en' ? '3. Continue' : '3. Sigue'}</strong>
          <small>{siguiente ? (locale === 'en' ? 'Use the “Next” button at the end.' : 'Usa el botón “Siguiente” al final.') : (locale === 'en' ? 'This is the last lesson in this path.' : 'Esta es la última de esta ruta.')}</small>
        </div>
      </section>

      <section className="st-curso-why">
        <Sparkles size={14} />
        <p>{leccion.why}</p>
      </section>

      <section className="st-lesson-section-intro">
        <span className="st-kicker">{locale === 'en' ? 'First understand this' : 'Primero entiende esto'}</span>
        <h2>{locale === 'en' ? 'The explanation is in collapsible blocks' : 'La explicación está en bloques plegables'}</h2>
        <p>{locale === 'en' ? 'Open only what you need. The first block comes open so you know where to start.' : 'Abre solo lo que necesites. El primer bloque viene abierto para que sepas por dónde empezar.'}</p>
      </section>

      <div className="st-blocks">
        {leccion.theory.map((part, index) => (
          <details key={index} className="st-block st-block-seccion" open={index === 0}>
            <summary>
              <span><Lightbulb size={15} /><strong>{part.title}</strong></span>
              <span className="st-block-summary-meta"><i>{locale === 'en' ? 'Open' : 'Abrir'}</i></span>
            </summary>
            <div className="st-block-body">
              <p className="st-part-text">{part.text}</p>
              {part.analogy && (
                <p className="st-guide-analogy"><Quote size={13} /> <span>{part.analogy}</span></p>
              )}
              {part.example && (
                <p className="st-curso-example"><b>{locale === 'en' ? 'For example:' : 'Por ejemplo:'}</b> {part.example}</p>
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
            <span><Languages size={15} /><strong>{locale === 'en' ? 'The words you’re about to read, in plain terms' : 'Las palabras que vas a leer, en cristiano'}</strong></span>
            <span className="st-block-summary-meta"><b>{leccion.words.length}</b><i>{locale === 'en' ? 'Open' : 'Abrir'}</i></span>
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
            <span className="st-kicker">{locale === 'en' ? 'Your turn' : 'Tu turno'}</span>
            <h2>{locale === 'en' ? 'Do it step by step' : 'Hazlo paso a paso'}</h2>
            <p>{locale === 'en' ? 'First open the instruction, then do the action, and finally check the circle once you see it on screen.' : 'Primero abre la instrucción, después haz la acción y al final marca el círculo cuando lo hayas visto en pantalla.'}</p>
          </div>
          <span className="st-piece-badge" data-full={percent === 100 ? 'true' : undefined}>
            {hechas.length}/{leccion.tasks.length} {locale === 'en' ? 'tasks' : 'tareas'}
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
                    aria-label={hecha ? (locale === 'en' ? 'Mark as pending' : 'Marcar como pendiente') : (locale === 'en' ? 'Mark as done' : 'Marcar como hecha')}
                  >
                    {hecha ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                  <div>
                    <span className="st-task-where">{task.where}</span>
                    <h3>{task.title}</h3>
                  </div>
                </div>

                <details className="st-task-detail" open={index === 0 || hecha}>
                  <summary>{locale === 'en' ? 'See instructions, prompt and evidence' : 'Ver instrucciones, prompt y evidencia'}</summary>
                  <div>
                    <p className="st-task-action">{task.action}</p>
                    {task.prompt && <Prompt text={task.prompt} />}
                    <p className="st-task-expected"><b>{locale === 'en' ? 'You should see:' : 'Tienes que ver:'}</b> {task.expect}</p>
                    {task.stuck && (
                      <p className="st-task-stuck">
                        <HelpCircle size={12} />
                        <span><b>{locale === 'en' ? "If it doesn't work:" : 'Si no te sale:'}</b> {task.stuck}</span>
                      </p>
                    )}
                    <Notebook
                      slug={`curso:${lessonId}`}
                      level="intermedio"
                      noteKey={String(index)}
                      label={locale === 'en' ? 'What you got' : 'Qué te ha salido'}
                      placeholder={locale === 'en' ? 'Paste the result here or note what you decided…' : 'Pega aquí el resultado o apunta lo que has decidido…'}
                    />
                  </div>
                </details>
              </li>
            )
          })}
        </ol>
      </section>

      <details className="st-block st-block-importa">
        <summary>
          <span><Scale size={15} /><strong>{locale === 'en' ? 'What matters and what doesn’t' : 'Lo que importa y lo que no'}</strong></span>
          <span className="st-block-summary-meta"><b>{leccion.matters.length + leccion.ignore.length}</b><i>{locale === 'en' ? 'Open' : 'Abrir'}</i></span>
        </summary>
        <div className="st-block-body">
          <div className="st-matters">
            <div className="st-matters-yes">
              <strong><Check size={11} /> {locale === 'en' ? 'Pay attention to this' : 'Presta atención a esto'}</strong>
              <ul>{leccion.matters.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="st-matters-no">
              <strong><Ban size={11} /> {locale === 'en' ? 'You can ignore this' : 'Puedes ignorar esto'}</strong>
              <ul>{leccion.ignore.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </div>
      </details>

      {leccion.pieces?.length ? (
        <section className="st-interactive">
          <h2>{locale === 'en' ? 'Practice with this' : 'Practica con esto'}</h2>
          {leccion.pieces.map((piece, index) => <Piece key={index} piece={piece} />)}
        </section>
      ) : null}

      {leccion.errors?.length > 0 && (
        <section className="st-errors">
          <h3><AlertTriangle size={12} /> {locale === 'en' ? "What's going to break on you" : 'Lo que se te va a romper'}</h3>
          <p className="st-errors-intro">
            {locale === 'en' ? 'The message exactly as it appears on screen, what it means in plain terms, and what to do.' : 'El mensaje tal y como sale en pantalla, qué significa en castellano y qué hacer.'}
          </p>
          <ol>
            {leccion.errors.map((fallo) => (
              <li key={fallo.message}>
                <code>{fallo.message}</code>
                <p className="st-error-means"><b>{locale === 'en' ? 'What it means' : 'Qué significa'}</b> {fallo.means}</p>
                <p className="st-error-fix"><b>{locale === 'en' ? 'What to do' : 'Qué haces'}</b> {fallo.fix}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <details className="st-block st-block-importa">
        <summary>
          <span><Check size={15} /><strong>{locale === 'en' ? 'Practical shortcuts and limits' : 'Atajos prácticos y límites'}</strong></span>
          <span className="st-block-summary-meta"><b>{leccion.canDo.length + leccion.cantDo.length}</b><i>{locale === 'en' ? 'Open' : 'Abrir'}</i></span>
        </summary>
        <div className="st-block-body">
          <div className="st-matters">
            <div className="st-matters-yes">
              <strong><Check size={11} /> {locale === 'en' ? 'The AI does this well' : 'Esto la IA sí lo hace bien'}</strong>
              <ul>{leccion.canDo.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="st-matters-no">
              <strong><Ban size={11} /> {locale === 'en' ? "It doesn't do this" : 'Esto no lo hace'}</strong>
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
          <span className="st-kicker">{locale === 'en' ? 'Lesson wrap-up' : 'Cierre de la lección'}</span>
          <h2>{leccionCompleta ? (locale === 'en' ? 'Lesson completed' : 'Lección completada') : (locale === 'en' ? 'When you finish, mark the lesson' : 'Cuando termines, marca la lección')}</h2>
          <p>
            {locale === 'en'
              ? 'Use this button once you finish the whole lesson. It lets Programa mark this piece as done and know where you need to go next.'
              : 'Usa este botón al terminar toda la lección. Sirve para que el Programa marque esta pieza como hecha y sepa por dónde tienes que seguir.'}
          </p>
        </div>
        <button
          type="button"
          className="st-btn"
          onClick={() => store.toggleDone(`curso:${lessonId}`, 'intermedio')}
          aria-pressed={leccionCompleta}
        >
          {leccionCompleta ? <CheckCircle2 size={15} /> : <Circle size={15} />}
          {leccionCompleta ? (locale === 'en' ? 'Remove completion' : 'Quitar completado') : (locale === 'en' ? 'Mark lesson completed' : 'Marcar lección completada')}
        </button>
      </section>

      <nav className="st-lesson-nav">
        {anterior ? (
          <a href={href({ name: 'curso', lessonId: anterior.id })}>
            <ArrowLeft size={14} />
            <span><em>{locale === 'en' ? 'Previous' : 'Anterior'}</em><b>{anterior.title}</b></span>
          </a>
        ) : <span />}
        {siguiente && (
          <a className="next" href={href({ name: 'curso', lessonId: siguiente.id })}>
            <span><em>{locale === 'en' ? 'Next' : 'Siguiente'}</em><b>{siguiente.title}</b></span>
            <ArrowRight size={14} />
          </a>
        )}
      </nav>
    </article>
  )
}
