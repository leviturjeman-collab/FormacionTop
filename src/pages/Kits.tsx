import { useMemo, useState } from 'react'
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookMarked, Check, Clipboard, Coins, Download, FileText,
  Gavel, Layers, Lightbulb, ListChecks, Save, Scale, Shield, Sparkles, Target, Workflow, Wrench,
} from 'lucide-react'
import { useCourse } from '../course'
import { href } from '../router'
import { store, useStudent } from '../store'
import type { Course, CursoLesson, InstitutionalKit, KitPrompt, PromptFamily, ToolAutomation, ToolPage } from '../types'
import { BrandMark } from '../components/Brand'

/**
 * Kits institucionales.
 *
 * El contenido ya no vive aqui: viene de `content/kits/*.json`. Un kit tiene que
 * bastarse solo, asi que la pagina pinta todo lo que trae (brief, arquitectura,
 * fases con pasos, prompts literales, flujo de n8n, pruebas, coste, legal,
 * entrega y defensa) y ademas cose los enlaces al resto del portal.
 */

type TabId =
  | 'resumen' | 'arranque' | 'arquitectura' | 'fases' | 'prompts'
  | 'flujo' | 'pruebas' | 'coste' | 'entrega' | 'recursos'

const TABS: { id: TabId; label: string }[] = [
  { id: 'resumen', label: '1. Encaje' },
  { id: 'arranque', label: '2. Brief' },
  { id: 'arquitectura', label: '3. Stack' },
  { id: 'fases', label: '4. Fases' },
  { id: 'prompts', label: '5. Prompts' },
  { id: 'flujo', label: '6. Flujo' },
  { id: 'pruebas', label: '7. Pruebas' },
  { id: 'coste', label: '8. Coste' },
  { id: 'entrega', label: '9. Entrega' },
  { id: 'recursos', label: '10. Portal' },
]

function toolById(course: Course, id: string) {
  return course.toolPages.find((tool) => tool.id === id)
}

/**
 * Lecciones del programa que preparan para este kit. Se buscan por las
 * herramientas del kit y por sus palabras clave, dentro del texto que ve el
 * alumno: título, promesa, teoría y vocabulario.
 */
function relevantSkills(course: Course, kit: InstitutionalKit): CursoLesson[] {
  const agujas = [...(kit.skillKeywords || []), ...(kit.tools || [])]
    .map((item) => item.toLowerCase())
    .filter((item) => item.length > 2)
  if (!agujas.length) return []

  const texto = (leccion: CursoLesson) => [
    leccion.title,
    leccion.promise,
    ...(leccion.theory || []).map((bloque) => `${bloque.title} ${bloque.text}`),
    ...(leccion.words || []).map(([palabra, sentido]) => `${palabra} ${sentido}`),
    leccion.tool || '',
  ].join(' ').toLowerCase()

  return (course.curso || [])
    .map((leccion) => {
      const cuerpo = texto(leccion)
      const aciertos = agujas.filter((aguja) => cuerpo.includes(aguja)).length
      return { leccion, aciertos }
    })
    .filter((item) => item.aciertos > 0)
    .sort((a, b) => b.aciertos - a.aciertos || a.leccion.number - b.leccion.number)
    .slice(0, 8)
    .map((item) => item.leccion)
}

function kitTools(course: Course, kit: InstitutionalKit): ToolPage[] {
  return (kit.tools || []).map((id) => toolById(course, id)).filter(Boolean) as ToolPage[]
}

function kitPromptFamilies(course: Course, kit: InstitutionalKit): PromptFamily[] {
  const wantedTools = new Set(kit.tools || [])
  const wantedCategories = new Set(kit.promptFamilies || [])
  const scored = course.prompts
    .map((family) => {
      let score = 0
      if (family.toolId && wantedTools.has(family.toolId)) score += 20
      if (family.categoryId && wantedCategories.has(family.categoryId)) score += 12
      return { family, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.family.title.localeCompare(b.family.title, 'es'))
  const seen = new Set<string>()
  return scored
    .map((item) => item.family)
    .filter((family) => {
      if (seen.has(family.id)) return false
      seen.add(family.id)
      return true
    })
}

function kitAutomations(tools: ToolPage[]) {
  return tools.flatMap((tool) => (tool.guide?.automations || []).map((automation) => ({ tool, automation })))
}

/** Un boton de copiar que avisa de que ha copiado. */
function CopyButton({ text, label = 'Copiar', ghost }: { text: string; label?: string; ghost?: boolean }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className={ghost ? 'st-btn-ghost' : 'st-btn'}
      onClick={() => {
        navigator.clipboard?.writeText(text)
        setDone(true)
        window.setTimeout(() => setDone(false), 1600)
      }}
    >
      {done ? <Check size={12} /> : <Clipboard size={12} />} {done ? 'Copiado' : label}
    </button>
  )
}

/** Un prompt del kit: el texto literal, sus huecos y que esperar de vuelta. */
function PromptCard({ prompt, open }: { prompt: KitPrompt; open?: boolean }) {
  const [shown, setShown] = useState(Boolean(open))
  return (
    <article className="st-kit-prompt">
      <header>
        <div>
          <strong>{prompt.name}</strong>
          <small>{prompt.when}</small>
        </div>
        <div className="st-kit-prompt-actions">
          <CopyButton text={prompt.prompt} label="Copiar prompt" />
          <button type="button" className="st-btn-ghost" onClick={() => setShown((value) => !value)}>
            {shown ? 'Ocultar' : 'Ver texto'}
          </button>
        </div>
      </header>

      {shown && <pre className="st-kit-pre">{prompt.prompt}</pre>}

      {prompt.fill?.length > 0 && (
        <div className="st-kit-fill">
          <span className="st-kicker">Huecos que rellenas tú</span>
          <div className="st-kit-table-wrap">
            <table className="st-kit-table">
              <thead><tr><th>Hueco</th><th>Qué pones</th><th>Ejemplo</th></tr></thead>
              <tbody>
                {prompt.fill.map((item) => (
                  <tr key={item.slot}>
                    <td><code>{item.slot}</code></td>
                    <td>{item.what}</td>
                    <td className="st-kit-example">{item.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="st-kit-expect">
        <p><strong>Lo que te tiene que devolver.</strong> {prompt.expect}</p>
        {prompt.stuck && <p className="st-kit-stuck"><strong>Si no sale.</strong> {prompt.stuck}</p>}
      </div>
    </article>
  )
}

export default function Kits({ kitId }: { kitId?: string }) {
  const course = useCourse()
  const student = useStudent()
  const kits = course.kits || []
  const [tab, setTab] = useState<TabId>('resumen')
  const [saved, setSaved] = useState(false)
  // El kit abierto se decide por la URL, no por estado interno: asi cada kit
  // tiene su propia pantalla, se puede enlazar y el movil no obliga a bajar
  // por toda la lista antes de llegar al contenido.
  const kit = kitId ? kits.find((item) => item.id === kitId) || null : null

  const tools = useMemo(() => (kit ? kitTools(course, kit) : []), [course, kit])
  const promptFamilies = useMemo(() => (kit ? kitPromptFamilies(course, kit) : []), [course, kit])
  const automations = useMemo(() => kitAutomations(tools), [tools])
  const skills = useMemo(() => (kit ? relevantSkills(course, kit) : []), [course, kit])

  const totalSteps = useMemo(
    () => (kit?.phases || []).reduce((sum, phase) => sum + phase.steps.length, 0),
    [kit],
  )
  const totalMinutes = useMemo(
    () => (kit?.phases || []).reduce((sum, phase) => sum + (phase.minutes || 0), 0),
    [kit],
  )

  if (!kits.length) {
    return (
      <div className="st-page">
        <div className="st-page-title">
          <h1>Kits institucionales</h1>
          <p>No hay ningún kit en <code>content/kits/</code>. Añade un archivo .json y vuelve a generar el índice.</p>
        </div>
      </div>
    )
  }

  // Sin kit en la URL se muestra solo el índice. Nada de contenido debajo: el
  // alumno elige un caso y entra en su pantalla.
  if (!kit) {
    return (
      <div className="st-page">
        <div className="st-page-title">
          <span className="st-kicker"><Sparkles size={12} /> Proyectos grandes</span>
          <h1>Kits institucionales</h1>
          <p>
            Cada kit es un proyecto completo, de principio a fin. Elige el que se parezca a lo que
            necesitas y se abre entero: el brief para definir tu caso, las fases en orden, los prompts
            listos para copiar y lo que tienes que ver en pantalla para saber que va bien.
          </p>
        </div>
        <div className="st-kit-cards">
          {kits.map((item) => {
            const pasos = (item.phases || []).reduce((sum, phase) => sum + phase.steps.length, 0)
            return (
              <a key={item.id} className="st-kit-card" href={href({ name: 'kits', kitId: item.id })}>
                <span className="st-kicker">{item.kicker}</span>
                <strong>{item.title}</strong>
                <p>{item.promise}</p>
                <small>
                  {item.phases.length} fases · {pasos} pasos
                  {item.workflows.length ? ' · flujo importable' : ''}
                </small>
                <i aria-hidden="true"><ArrowRight size={14} /></i>
              </a>
            )
          })}
        </div>
      </div>
    )
  }

  const saveToProject = () => {
    const previous = student.project
    store.setProject({
      name: previous?.name || kit.title,
      goal: previous?.goal || kit.title,
      audience: previous?.audience || kit.audience,
      problem: previous?.problem || kit.promise,
      outcome: previous?.outcome || (kit.deliverables || []).join(', '),
      tools: previous?.tools || tools.map((tool) => tool.label).join(', '),
      toolIds: previous?.toolIds || tools.map((tool) => tool.id),
      projectType: previous?.projectType || 'institucional',
      promptBrief: previous?.promptBrief || '',
      savedPrompts: [
        ...(previous?.savedPrompts || []),
        {
          id: `kit-${kit.id}-${Date.now()}`,
          family: 'Kit institucional',
          name: `Define tu proyecto · ${kit.title}`,
          prompt: kit.brief.prompt,
          savedAt: new Date().toISOString(),
          source: 'Kits institucionales',
        },
      ],
      updatedAt: new Date().toISOString(),
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  const flowText = (index: number) => JSON.stringify(kit.workflows[index].flow, null, 2)

  return (
    <div className="st-page st-kit-page">
      <a className="st-volver" href={href({ name: 'kits' })}><ArrowLeft size={11} /> Todos los kits</a>

      <div className="st-kit-layout">
        <section className="st-kit-board">
          <header className="st-kit-head">
            <span className="st-kicker">{kit.kicker}</span>
            <h2>{kit.title}</h2>
            <p>{kit.promise}</p>
            <div className="st-kit-actions">
              <CopyButton text={kit.brief.prompt} label="Copiar el brief de arranque" />
              <button type="button" className="st-btn-ghost" onClick={saveToProject}>
                {saved ? <Check size={12} /> : <Save size={12} />} {saved ? 'Guardado' : 'Guardar en mi proyecto'}
              </button>
            </div>
          </header>

          <div className="st-kit-metrics">
            <div><span>Fases</span><strong>{kit.phases.length}</strong></div>
            <div><span>Pasos</span><strong>{totalSteps}</strong></div>
            <div><span>Prompts propios</span><strong>{kit.prompts.length + 1}</strong></div>
            <div><span>Horas estimadas</span><strong>{Math.round(totalMinutes / 60)}</strong></div>
            <div><span>Estado</span><strong>{kit.workflows.length ? 'Importable' : 'Guia'}</strong></div>
          </div>

          <nav className="st-kit-tabs" aria-label="Secciones del kit">
            {TABS.map((item) => (
              <button key={item.id} type="button" className={item.id === tab ? 'on' : ''} onClick={() => setTab(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>

          {tab === 'resumen' && (
            <div className="st-kit-panel">
              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker">En cristiano</span><h2>Qué es esto</h2></div></div>
                <p className="st-kit-plain">{kit.plain}</p>
              </section>

              <div className="st-kit-columns">
                <section className="st-kit-block">
                  <div className="st-section-head"><div><span className="st-kicker"><Target size={11} /> Sirve para</span><h2>Proyectos que salen de aquí</h2></div></div>
                  <ul className="st-kit-list">{kit.fits.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
                <section className="st-kit-block st-kit-danger">
                  <div className="st-section-head"><div><span className="st-kicker"><AlertTriangle size={11} /> No sirve para</span><h2>Cuándo no montes esto</h2></div></div>
                  <ul className="st-kit-list">{kit.notFor.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
              </div>

              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker">Alcance</span><h2>Elige hasta dónde llegas</h2></div></div>
                <div className="st-kit-scopes">
                  {kit.scopes.map((scope) => (
                    <article key={scope.id}>
                      <strong>{scope.label}</strong>
                      <p>{scope.what}</p>
                      <dl>
                        <div><dt>Tiempo</dt><dd>{scope.time}</dd></div>
                        <div><dt>Coste</dt><dd>{scope.cost}</dd></div>
                        <div><dt>Qué te saltas</dt><dd>{scope.skip}</dd></div>
                      </dl>
                    </article>
                  ))}
                </div>
              </section>

              {kit.words?.length > 0 && (
                <section className="st-kit-block">
                  <div className="st-section-head"><div><span className="st-kicker">Vocabulario</span><h2>Palabras que vas a leer aquí</h2></div></div>
                  <dl className="st-kit-words">
                    {kit.words.map(([term, meaning]) => (
                      <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>
                    ))}
                  </dl>
                </section>
              )}
            </div>
          )}

          {tab === 'arranque' && (
            <div className="st-kit-panel">
              <section className="st-kit-block st-kit-accent">
                <div className="st-section-head"><div><span className="st-kicker">Empieza aquí</span><h2>Convierte «quiero algo» en un proyecto definido</h2></div></div>
                <p className="st-kit-plain">
                  Este kit no te dice qué construir: te lo pregunta. Rellena los huecos, pega el prompt y contesta
                  a lo que te pregunte. Sales de aquí con el proceso escrito, con lo que no se debe automatizar y
                  con un alcance que cabe en tu tiempo. Sin esto, las fases siguientes no tienen sobre qué trabajar.
                </p>
                <PromptCard prompt={kit.brief} open />
              </section>
            </div>
          )}

          {tab === 'arquitectura' && (
            <div className="st-kit-panel">
              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker"><Layers size={11} /> Capas</span><h2>Cómo se monta por dentro</h2></div></div>
                <div className="st-kit-layers">
                  {kit.architecture.map((layer) => (
                    <article key={layer.layer}>
                      <strong>{layer.layer}</strong>
                      <p>{layer.what}</p>
                      <dl>
                        <div><dt>Sin programar</dt><dd>{layer.nocode}</dd></div>
                        <div><dt>En código</dt><dd>{layer.code}</dd></div>
                      </dl>
                      <p className="st-kit-why">{layer.why}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker"><Scale size={11} /> Decisiones</span><h2>Qué herramienta para cada cosa</h2></div></div>
                <div className="st-kit-table-wrap">
                  <table className="st-kit-table">
                    <thead><tr><th>Necesitas</th><th>Sin programar</th><th>En código</th><th>Qué elijo y por qué</th></tr></thead>
                    <tbody>
                      {kit.stack.map((row) => (
                        <tr key={row.need}>
                          <td><strong>{row.need}</strong></td>
                          <td>{row.nocode}</td>
                          <td>{row.code}</td>
                          <td className="st-kit-pick">{row.pick}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker">Datos</span><h2>Qué guardas de cada caso</h2></div></div>
                <div className="st-kit-entities">
                  {kit.data.map((entity) => (
                    <article key={entity.entity}>
                      <strong>{entity.entity}</strong>
                      <dl>
                        {entity.fields.map(([field, what]) => (
                          <div key={field}><dt><code>{field}</code></dt><dd>{what}</dd></div>
                        ))}
                      </dl>
                      <p className="st-kit-why">{entity.note}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}

          {tab === 'fases' && (
            <div className="st-kit-panel">
              {kit.phases.map((phase, phaseIndex) => (
                <section key={phase.id} className="st-kit-block">
                  <div className="st-section-head">
                    <div>
                      <span className="st-kicker">Fase {phaseIndex + 1} · unas {Math.round(phase.minutes / 60)} h</span>
                      <h2>{phase.title}</h2>
                    </div>
                    <span>{phase.steps.length} pasos</span>
                  </div>
                  <p className="st-kit-plain">{phase.goal}</p>

                  <ol className="st-kit-steps">
                    {phase.steps.map((step, stepIndex) => {
                      const prompt = step.promptId === 'brief'
                        ? kit.brief
                        : kit.prompts.find((item) => item.id === step.promptId)
                      return (
                        <li key={step.title}>
                          <div className="st-kit-step-head">
                            <span>{phaseIndex + 1}.{stepIndex + 1}</span>
                            <div>
                              <strong>{step.title}</strong>
                              <small>{step.where} · {step.minutes} min</small>
                            </div>
                          </div>
                          <p>{step.action}</p>
                          {step.nocode && (
                            <p className="st-kit-nocode"><strong>Sin programar.</strong> {step.nocode}</p>
                          )}
                          {step.code && (
                            <details className="st-kit-code">
                              <summary>Ver la versión en código · {step.code.file || step.code.lang}</summary>
                              <pre><code>{step.code.code}</code></pre>
                              <p>{step.code.note}</p>
                              <CopyButton text={step.code.code} label="Copiar código" ghost />
                            </details>
                          )}
                          {prompt && (
                            <details className="st-kit-step-prompt">
                              <summary>Prompt de este paso · {prompt.name}</summary>
                              <PromptCard prompt={prompt} />
                            </details>
                          )}
                          <p className="st-kit-check"><Check size={12} /> <strong>Tienes que ver.</strong> {step.expect}</p>
                          {step.stuck && (
                            <p className="st-kit-stuck"><AlertTriangle size={12} /> <strong>Si se atasca.</strong> {step.stuck}</p>
                          )}
                        </li>
                      )
                    })}
                  </ol>

                  <div className="st-kit-phase-end">
                    <p><strong>Entregable de la fase.</strong> {phase.deliverable}</p>
                    <ul>{phase.done.map((item) => <li key={item}><Check size={11} /> {item}</li>)}</ul>
                  </div>
                </section>
              ))}
            </div>
          )}

          {tab === 'prompts' && (
            <div className="st-kit-panel">
              <section className="st-kit-block">
                <div className="st-section-head">
                  <div><span className="st-kicker">Literales</span><h2>Los prompts de este kit</h2></div>
                  <span>{kit.prompts.length + 1} prompts</span>
                </div>
                <p className="st-kit-plain">
                  Están escritos para este sistema, con sus huecos marcados. Rellena, copia y pega. No hace falta
                  que salgas a la biblioteca de prompts: eso es para ampliar, no para montar.
                </p>
                <div className="st-kit-prompt-list">
                  <PromptCard prompt={kit.brief} />
                  {kit.prompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} />)}
                </div>
              </section>
            </div>
          )}

          {tab === 'flujo' && (
            <div className="st-kit-panel">
              {kit.workflows.length === 0 && (
                <section className="st-kit-block"><p className="st-kit-plain">Este kit todavía no trae flujo importable.</p></section>
              )}
              {kit.workflows.map((workflow, index) => (
                <section key={workflow.name} className="st-kit-block">
                  <div className="st-section-head">
                    <div><span className="st-kicker"><Workflow size={11} /> Importable</span><h2>{workflow.name}</h2></div>
                    <CopyButton text={flowText(index)} label="Copiar el flujo" />
                  </div>
                  <p className="st-kit-plain">{workflow.what}</p>
                  <p className="st-kit-nocode">
                    <strong>Estado real.</strong> Este flujo se puede copiar, pero no queda funcionando hasta conectar credenciales,
                    probar webhook, ejecutar con datos ficticios y revisar que no manda mensajes reales por error.
                  </p>

                  <div className="st-kit-columns">
                    <div>
                      <span className="st-kicker">Necesitas antes</span>
                      <ul className="st-kit-list">{workflow.needs.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                    <div>
                      <span className="st-kicker">Huecos que rellenas</span>
                      <dl className="st-kit-words">
                        {workflow.fill.map(([slot, what]) => (
                          <div key={slot}><dt><code>{slot}</code></dt><dd>{what}</dd></div>
                        ))}
                      </dl>
                    </div>
                  </div>

                  <div className="st-kit-careful">
                    <span className="st-kicker"><Shield size={11} /> Cuidado con esto</span>
                    <ul>{workflow.careful.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>

                  <details className="st-kit-code">
                    <summary><Download size={12} /> Ver el JSON completo</summary>
                    <pre><code>{flowText(index)}</code></pre>
                  </details>
                  <p className="st-kit-nocode">
                    <strong>Cómo se importa.</strong> En n8n, menú de los tres puntos arriba a la derecha del
                    lienzo: <em>Import from clipboard</em> (importar desde el portapapeles). Pega y acepta. Los
                    nodos salen en gris hasta que les pongas credenciales.
                  </p>
                </section>
              ))}
            </div>
          )}

          {tab === 'pruebas' && (
            <div className="st-kit-panel">
              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker"><ListChecks size={11} /> Antes de activar</span><h2>Los casos que tienes que probar</h2></div></div>
                <div className="st-kit-table-wrap">
                  <table className="st-kit-table">
                    <thead><tr><th>Caso</th><th>Qué le metes</th><th>Qué tiene que pasar</th></tr></thead>
                    <tbody>
                      {kit.testData.map((test) => (
                        <tr key={test.name}>
                          <td><strong>{test.name}</strong></td>
                          <td><code className="st-kit-input">{test.input}</code></td>
                          <td>{test.expect}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="st-kit-block st-kit-danger">
                <div className="st-section-head"><div><span className="st-kicker"><AlertTriangle size={11} /> Riesgos</span><h2>Por dónde se rompe esto</h2></div></div>
                <div className="st-kit-table-wrap">
                  <table className="st-kit-table">
                    <thead><tr><th>Riesgo</th><th>Cómo lo notas</th><th>Qué lo evita</th></tr></thead>
                    <tbody>
                      {kit.risks.map((risk) => (
                        <tr key={risk.risk}>
                          <td><strong>{risk.risk}</strong></td>
                          <td>{risk.sign}</td>
                          <td>{risk.fix}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {tab === 'coste' && (
            <div className="st-kit-panel">
              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker"><Coins size={11} /> Dinero</span><h2>Qué cuesta tener esto en marcha</h2></div></div>
                <div className="st-kit-table-wrap">
                  <table className="st-kit-table">
                    <thead><tr><th>Concepto</th><th>Gratis</th><th>De pago</th><th>Aviso</th></tr></thead>
                    <tbody>
                      {kit.costs.map((cost) => (
                        <tr key={cost.item}>
                          <td><strong>{cost.item}</strong></td>
                          <td>{cost.free}</td>
                          <td>{cost.paid}</td>
                          <td className="st-kit-pick">{cost.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="st-kit-block st-kit-legal">
                <div className="st-section-head"><div><span className="st-kicker"><Gavel size={11} /> Legal</span><h2>Lo que no puedes saltarte</h2></div></div>
                <ul className="st-kit-list">{kit.legal.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
            </div>
          )}

          {tab === 'entrega' && (
            <div className="st-kit-panel">
              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker"><FileText size={11} /> Entregables</span><h2>Qué sale de aquí</h2></div></div>
                <div className="st-kit-deliverables">
                  {kit.delivery.map((item) => (
                    <article key={item.name}>
                      <strong>{item.name}</strong>
                      <p>{item.what}</p>
                      <pre className="st-kit-template">{item.template}</pre>
                    </article>
                  ))}
                </div>
              </section>

              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker">Negocio</span><h2>Cómo ponerle precio</h2></div></div>
                <div className="st-kit-table-wrap">
                  <table className="st-kit-table">
                    <thead><tr><th>Servicio</th><th>Qué incluye</th><th>Precio</th><th>Aviso</th></tr></thead>
                    <tbody>
                      {kit.pricing.map((price) => (
                        <tr key={price.tier}>
                          <td><strong>{price.tier}</strong></td>
                          <td>{price.what}</td>
                          <td className="st-kit-price">{price.price}</td>
                          <td className="st-kit-pick">{price.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker">Defensa</span><h2>Lo que te van a preguntar</h2></div></div>
                <dl className="st-kit-defend">
                  {kit.defend.map((item) => (
                    <div key={item.question}><dt>{item.question}</dt><dd>{item.answer}</dd></div>
                  ))}
                </dl>
              </section>
            </div>
          )}

          {tab === 'recursos' && (
            <div className="st-kit-panel">
              <section className="st-kit-block">
                <div className="st-section-head">
                  <div><span className="st-kicker">Stack combinado</span><h2>Herramientas que se complementan</h2></div>
                  <span>{tools.length} piezas</span>
                </div>
                <div className="st-kit-tools">
                  {tools.map((tool) => (
                    <a key={tool.id} href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}>
                      <BrandMark icon={tool.icon} size={20} />
                      <strong>{tool.label}</strong>
                      <small>{tool.guide?.prompts?.length || 0} prompts · {tool.guide?.automations?.length || 0} flujos</small>
                    </a>
                  ))}
                </div>
              </section>

              <div className="st-kit-columns">
                <section>
                  <div className="st-section-head"><div><span className="st-kicker">Prompts</span><h2>Para ampliar</h2></div></div>
                  <div className="st-kit-resource-list">
                    {promptFamilies.slice(0, 20).map((family) => (
                      <a key={family.id} href={href({ name: 'prompts', familyId: family.id })}>
                        <Sparkles size={14} />
                        <span><strong>{family.title}</strong><small>{family.prompts.length} prompts · {family.blockDescription || family.intro}</small></span>
                        <ArrowRight size={13} />
                      </a>
                    ))}
                  </div>
                </section>
                <section>
                  <div className="st-section-head"><div><span className="st-kicker">Automatizaciones</span><h2>Flujos candidatos</h2></div></div>
                  <div className="st-kit-resource-list">
                    {automations.slice(0, 20).map(({ tool, automation }: { tool: ToolPage; automation: ToolAutomation }) => (
                      <a key={`${tool.id}-${automation.name}`} href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}>
                        <Workflow size={14} />
                        <span><strong>{automation.name}</strong><small>{tool.label} · {automation.difficulty} · {automation.trigger}</small></span>
                        <ArrowRight size={13} />
                      </a>
                    ))}
                  </div>
                </section>
              </div>

              <section className="st-kit-block">
                <div className="st-section-head">
                  <div><span className="st-kicker">Skills y procesos</span><h2>Lecciones que lo sostienen</h2></div>
                  <span>{skills.length} sugeridos</span>
                </div>
                <div className="st-kit-skill-grid">
                  {skills.map((lesson) => (
                    <a key={lesson.id} href={href({ name: 'curso', lessonId: lesson.id })}>
                      <BookMarked size={14} />
                      <strong>{lesson.title}</strong>
                      <small>{lesson.minutes} min</small>
                    </a>
                  ))}
                </div>
              </section>
            </div>
          )}

          <section className="st-kit-master">
            <Lightbulb size={15} />
            <div>
              <strong>Cómo se usa este kit</strong>
              <p>
                Pasa el brief y contesta a lo que te pregunte. Elige alcance. Sigue las fases en orden y no te
                saltes las comprobaciones: cada paso dice lo que tienes que ver en pantalla. Cada fase deja un
                entregable, y esos entregables son el proyecto.
              </p>
            </div>
            <Wrench size={15} />
          </section>
        </section>
      </div>
    </div>
  )
}
