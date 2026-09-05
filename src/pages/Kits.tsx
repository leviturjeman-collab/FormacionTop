import { copyText, downloadPackage } from '../downloads'
import { useMemo, useState } from 'react'
import {
  AlertTriangle, ArrowRight, BookMarked, Check, Clipboard, Coins, Download, FileText,
  Gavel, Layers, Lightbulb, ListChecks, Save, Scale, Shield, Sparkles, Target, Workflow, Wrench,
} from 'lucide-react'
import { useCourse } from '../course'
import { useLocale } from '../i18n'
import type { Locale } from '../i18n'
import { href, navigate } from '../router'
import { store, useStudent } from '../store'
import type { Course, InstitutionalKit, KitPrompt, Lesson, PromptFamily, ToolAutomation, ToolPage } from '../types'
import { BrandMark } from '../components/Brand'
import ResourceVerification from '../components/ResourceVerification'

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

const TABS = (locale: Locale): { id: TabId; label: string }[] =>
  locale === 'en'
    ? [
        { id: 'resumen', label: 'What it is and who it’s for' },
        { id: 'arranque', label: 'Define your project' },
        { id: 'arquitectura', label: 'Architecture and stack' },
        { id: 'fases', label: 'Phases step by step' },
        { id: 'prompts', label: 'Kit prompts' },
        { id: 'flujo', label: 'Importable flow' },
        { id: 'pruebas', label: 'Tests and risks' },
        { id: 'coste', label: 'Cost and legal' },
        { id: 'entrega', label: 'Delivery and price' },
        { id: 'recursos', label: 'Rest of the portal' },
      ]
    : [
        { id: 'resumen', label: 'Qué es y para quién' },
        { id: 'arranque', label: 'Define tu proyecto' },
        { id: 'arquitectura', label: 'Arquitectura y stack' },
        { id: 'fases', label: 'Fases paso a paso' },
        { id: 'prompts', label: 'Prompts del kit' },
        { id: 'flujo', label: 'Flujo importable' },
        { id: 'pruebas', label: 'Pruebas y riesgos' },
        { id: 'coste', label: 'Coste y legal' },
        { id: 'entrega', label: 'Entrega y precio' },
        { id: 'recursos', label: 'Resto del portal' },
      ]

function toolById(course: Course, id: string) {
  return course.toolPages.find((tool) => tool.id === id)
}

function relevantSkills(course: Course, kit: InstitutionalKit): Lesson[] {
  const needles = [...(kit.skillKeywords || []), ...(kit.tools || [])].map((item) => item.toLowerCase())
  const skillish = course.lessons.filter((lesson) => {
    const haystack = `${lesson.title} ${lesson.folder} ${lesson.sourcePath} ${lesson.tags.join(' ')} ${lesson.search}`.toLowerCase()
    const isSkill = /skill|workflow|automatiz|proceso|auditoria|entregable|plantilla/.test(haystack)
    return isSkill && needles.some((needle) => haystack.includes(needle))
  })
  if (skillish.length) return skillish.slice(0, 20)
  return course.lessons
    .filter((lesson) => /35_AUTOMATIZACIONES|skills|workflow/i.test(`${lesson.sourcePath} ${lesson.folder}`))
    .slice(0, 20)
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
function CopyButton({ text, label, ghost }: { text: string; label?: string; ghost?: boolean }) {
  const locale = useLocale()
  const [done, setDone] = useState(false)
  const defaultLabel = locale === 'en' ? 'Copy' : 'Copiar'
  return (
    <button
      type="button"
      className={ghost ? 'st-btn-ghost' : 'st-btn'}
      onClick={() => {
        void copyText(text).then(() => { setDone(true); window.setTimeout(() => setDone(false), 1600) }, () => setDone(false))
      }}
    >
      {done ? <Check size={12} /> : <Clipboard size={12} />} {done ? (locale === 'en' ? 'Copied' : 'Copiado') : (label ?? defaultLabel)}
    </button>
  )
}

/** Un prompt del kit: el texto literal, sus huecos y que esperar de vuelta. */
function PromptCard({ prompt, open }: { prompt: KitPrompt; open?: boolean }) {
  const locale = useLocale()
  const [shown, setShown] = useState(Boolean(open))
  return (
    <article className="st-kit-prompt">
      <header>
        <div>
          <strong>{prompt.name}</strong>
          <small>{prompt.when}</small>
        </div>
        <div className="st-kit-prompt-actions">
          <CopyButton text={prompt.prompt} label={locale === 'en' ? 'Copy prompt' : 'Copiar prompt'} />
          <button type="button" className="st-btn-ghost" onClick={() => setShown((value) => !value)}>
            {shown ? (locale === 'en' ? 'Hide' : 'Ocultar') : (locale === 'en' ? 'View text' : 'Ver texto')}
          </button>
        </div>
      </header>

      {shown && <pre className="st-kit-pre">{prompt.prompt}</pre>}

      {prompt.fill?.length > 0 && (
        <div className="st-kit-fill">
          <span className="st-kicker">{locale === 'en' ? 'Blanks you fill in' : 'Huecos que rellenas tú'}</span>
          <div className="st-kit-table-wrap">
            <table className="st-kit-table">
              <thead><tr><th>{locale === 'en' ? 'Blank' : 'Hueco'}</th><th>{locale === 'en' ? 'What to put' : 'Qué pones'}</th><th>{locale === 'en' ? 'Example' : 'Ejemplo'}</th></tr></thead>
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
        <p><strong>{locale === 'en' ? 'What it must return.' : 'Lo que te tiene que devolver.'}</strong> {prompt.expect}</p>
        {prompt.stuck && <p className="st-kit-stuck"><strong>{locale === 'en' ? 'If it doesn’t work.' : 'Si no sale.'}</strong> {prompt.stuck}</p>}
      </div>
    </article>
  )
}

export default function Kits({ kitId, tabId }: { kitId?: string; tabId?: string }) {
  const course = useCourse()
  const locale = useLocale()
  const student = useStudent()
  const kits = course.kits || []
  const active = kitId || kits[0]?.id || ''
  const tab = TABS(locale).some(t => t.id === tabId) ? tabId as TabId : 'resumen'
  const setTab = (next: TabId) => navigate({ name: 'kits', kitId: active, tab: next })
  const [saved, setSaved] = useState(false)
  const kit = kits.find((item) => item.id === active)

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

  if (!kit) {
    return (
      <div className="st-page">
        <div className="st-page-title">
          <h1>{locale === 'en' ? 'Institutional kits' : 'Kits institucionales'}</h1>
          <p>
            {locale === 'en'
                ? <>This kit is unavailable. <a href={href({ name: 'kits' })}>See all kits</a>.</>
                : <>Este kit no está disponible. <a href={href({ name: 'kits' })}>Ver todos los kits</a>.</>}
          </p>
        </div>
      </div>
    )
  }

  function saveToProject() {
    if (!kit) return
    const previous = student.project
    store.setProject({
      ...previous,
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
        ...(previous?.savedPrompts || []).filter(p => p.id !== `kit-${kit.id}`),
        {
          id: `kit-${kit.id}`,
          family: locale === 'en' ? 'Institutional kit' : 'Kit institucional',
          name: `${locale === 'en' ? 'Define your project' : 'Define tu proyecto'} · ${kit.title}`,
          prompt: kit.brief.prompt,
          savedAt: new Date().toISOString(),
          source: locale === 'en' ? 'Institutional kits' : 'Kits institucionales',
        },
      ],
      updatedAt: new Date().toISOString(),
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  const flowText = (index: number) => JSON.stringify(kit.workflows[index].flow, null, 2)
  const tabs = TABS(locale)

  return (
    <div className="st-page">
      <ResourceVerification id={kit.id} kind="kits" />
      <div className="st-page-title">
        <span className="st-kicker"><Sparkles size={12} /> {locale === 'en' ? 'Large projects' : 'Proyectos grandes'}</span>
        <h1>{locale === 'en' ? 'Institutional kits' : 'Kits institucionales'}</h1>
        <p>
          {locale === 'en'
            ? 'Each kit is a complete project: define your case with the brief, follow the phases, copy the prompts and build the system without leaving this page. The main path does not require coding; the code is below for anyone who wants to dig in.'
            : 'Cada kit es un proyecto completo: define tu caso con el brief, sigue las fases, copia los prompts y monta el sistema sin salir de esta página. La ruta principal no exige programar; el código está debajo para quien quiera bajar.'}
        </p>
      </div>

      <div className="st-kit-layout">
        <aside className="st-kit-index" aria-label={locale === 'en' ? 'Available kits' : 'Kits disponibles'}>
          {kits.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === kit.id ? 'on' : ''}
              onClick={() => navigate({ name: 'kits', kitId: item.id, tab: 'resumen' })}
            >
              <span>{item.kicker}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </aside>

        <section className="st-kit-board">
          <header className="st-kit-head">
            <span className="st-kicker">{kit.kicker}</span>
            <h2>{kit.title}</h2>
            <p>{kit.promise}</p>
            <div className="st-kit-actions">
              <button type="button" className="st-btn-ghost" onClick={() => downloadPackage(kit.id, [{ name: 'README.md', content: '# ' + kit.title + '\n\n' + kit.plain + '\n\n' + kit.phases.map(p => '## ' + p.title + '\n' + p.steps.map(s => s.title + '\n' + s.action + '\nComprobar: ' + s.expect).join('\n\n')).join('\n\n') }, { name: 'kit.json', content: JSON.stringify(kit, null, 2) }, ...kit.workflows.map((w,i) => ({ name: 'workflow-' + (i+1) + '.json', content: JSON.stringify(w.flow, null, 2) }))])}>{locale === 'en' ? 'Download project package' : 'Descargar paquete del proyecto'}</button>
              <CopyButton text={kit.brief.prompt} label={locale === 'en' ? 'Copy the starter brief' : 'Copiar el brief de arranque'} />
              <button type="button" className="st-btn-ghost" onClick={saveToProject}>
                {saved ? <Check size={12} /> : <Save size={12} />} {saved ? (locale === 'en' ? 'Saved' : 'Guardado') : (locale === 'en' ? 'Save to my project' : 'Guardar en mi proyecto')}
              </button>
            </div>
          </header>

          <div className="st-kit-metrics">
            <div><span>{locale === 'en' ? 'Phases' : 'Fases'}</span><strong>{kit.phases.length}</strong></div>
            <div><span>{locale === 'en' ? 'Steps' : 'Pasos'}</span><strong>{totalSteps}</strong></div>
            <div><span>{locale === 'en' ? 'Own prompts' : 'Prompts propios'}</span><strong>{kit.prompts.length + 1}</strong></div>
            <div><span>{locale === 'en' ? 'Estimated hours' : 'Horas estimadas'}</span><strong>{Math.round(totalMinutes / 60)}</strong></div>
          </div>

          <nav className="st-kit-tabs" aria-label={locale === 'en' ? 'Kit sections' : 'Secciones del kit'}>
            {tabs.map((item) => (
              <button key={item.id} type="button" className={item.id === tab ? 'on' : ''} onClick={() => setTab(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>

          {tab === 'resumen' && (
            <div className="st-kit-panel">
              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker">{locale === 'en' ? 'In plain terms' : 'En cristiano'}</span><h2>{locale === 'en' ? 'What this is' : 'Qué es esto'}</h2></div></div>
                <p className="st-kit-plain">{kit.plain}</p>
              </section>

              <div className="st-kit-columns">
                <section className="st-kit-block">
                  <div className="st-section-head"><div><span className="st-kicker"><Target size={11} /> {locale === 'en' ? 'Good for' : 'Sirve para'}</span><h2>{locale === 'en' ? 'Projects that come out of this' : 'Proyectos que salen de aquí'}</h2></div></div>
                  <ul className="st-kit-list">{kit.fits.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
                <section className="st-kit-block st-kit-danger">
                  <div className="st-section-head"><div><span className="st-kicker"><AlertTriangle size={11} /> {locale === 'en' ? 'Not good for' : 'No sirve para'}</span><h2>{locale === 'en' ? 'When not to build this' : 'Cuándo no montes esto'}</h2></div></div>
                  <ul className="st-kit-list">{kit.notFor.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
              </div>

              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker">{locale === 'en' ? 'Scope' : 'Alcance'}</span><h2>{locale === 'en' ? 'Choose how far you go' : 'Elige hasta dónde llegas'}</h2></div></div>
                <div className="st-kit-scopes">
                  {kit.scopes.map((scope) => (
                    <article key={scope.id}>
                      <strong>{scope.label}</strong>
                      <p>{scope.what}</p>
                      <dl>
                        <div><dt>{locale === 'en' ? 'Time' : 'Tiempo'}</dt><dd>{scope.time}</dd></div>
                        <div><dt>{locale === 'en' ? 'Cost' : 'Coste'}</dt><dd>{scope.cost}</dd></div>
                        <div><dt>{locale === 'en' ? 'What you skip' : 'Qué te saltas'}</dt><dd>{scope.skip}</dd></div>
                      </dl>
                    </article>
                  ))}
                </div>
              </section>

              {kit.words?.length > 0 && (
                <section className="st-kit-block">
                  <div className="st-section-head"><div><span className="st-kicker">{locale === 'en' ? 'Vocabulary' : 'Vocabulario'}</span><h2>{locale === 'en' ? 'Words you’ll read here' : 'Palabras que vas a leer aquí'}</h2></div></div>
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
                <div className="st-section-head"><div><span className="st-kicker">{locale === 'en' ? 'Start here' : 'Empieza aquí'}</span><h2>{locale === 'en' ? 'Turn "I want something" into a defined project' : 'Convierte «quiero algo» en un proyecto definido'}</h2></div></div>
                <p className="st-kit-plain">
                  {locale === 'en'
                    ? 'This kit doesn’t tell you what to build: it asks you. Fill in the blanks, paste the prompt and answer what it asks. You leave here with the process written down, with what shouldn’t be automated, and with a scope that fits your time. Without this, the next phases have nothing to work with.'
                    : 'Este kit no te dice qué construir: te lo pregunta. Rellena los huecos, pega el prompt y contesta a lo que te pregunte. Sales de aquí con el proceso escrito, con lo que no se debe automatizar y con un alcance que cabe en tu tiempo. Sin esto, las fases siguientes no tienen sobre qué trabajar.'}
                </p>
                <PromptCard prompt={kit.brief} open />
              </section>
            </div>
          )}

          {tab === 'arquitectura' && (
            <div className="st-kit-panel">
              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker"><Layers size={11} /> {locale === 'en' ? 'Layers' : 'Capas'}</span><h2>{locale === 'en' ? 'How it’s built inside' : 'Cómo se monta por dentro'}</h2></div></div>
                <div className="st-kit-layers">
                  {kit.architecture.map((layer) => (
                    <article key={layer.layer}>
                      <strong>{layer.layer}</strong>
                      <p>{layer.what}</p>
                      <dl>
                        <div><dt>{locale === 'en' ? 'No-code' : 'Sin programar'}</dt><dd>{layer.nocode}</dd></div>
                        <div><dt>{locale === 'en' ? 'In code' : 'En código'}</dt><dd>{layer.code}</dd></div>
                      </dl>
                      <p className="st-kit-why">{layer.why}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker"><Scale size={11} /> {locale === 'en' ? 'Decisions' : 'Decisiones'}</span><h2>{locale === 'en' ? 'Which tool for each thing' : 'Qué herramienta para cada cosa'}</h2></div></div>
                <div className="st-kit-table-wrap">
                  <table className="st-kit-table">
                    <thead><tr><th>{locale === 'en' ? 'You need' : 'Necesitas'}</th><th>{locale === 'en' ? 'No-code' : 'Sin programar'}</th><th>{locale === 'en' ? 'In code' : 'En código'}</th><th>{locale === 'en' ? 'What I pick and why' : 'Qué elijo y por qué'}</th></tr></thead>
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
                <div className="st-section-head"><div><span className="st-kicker">{locale === 'en' ? 'Data' : 'Datos'}</span><h2>{locale === 'en' ? 'What you store for each case' : 'Qué guardas de cada caso'}</h2></div></div>
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
                      <span className="st-kicker">
                        {locale === 'en'
                          ? `Phase ${phaseIndex + 1} · about ${Math.round(phase.minutes / 60)} h`
                          : `Fase ${phaseIndex + 1} · unas ${Math.round(phase.minutes / 60)} h`}
                      </span>
                      <h2>{phase.title}</h2>
                    </div>
                    <span>{phase.steps.length} {locale === 'en' ? 'steps' : 'pasos'}</span>
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
                            <p className="st-kit-nocode"><strong>{locale === 'en' ? 'No-code.' : 'Sin programar.'}</strong> {step.nocode}</p>
                          )}
                          {step.code && (
                            <details className="st-kit-code">
                              <summary>{locale === 'en' ? 'See the code version' : 'Ver la versión en código'} · {step.code.file || step.code.lang}</summary>
                              <pre><code>{step.code.code}</code></pre>
                              <p>{step.code.note}</p>
                              <CopyButton text={step.code.code} label={locale === 'en' ? 'Copy code' : 'Copiar código'} ghost />
                            </details>
                          )}
                          {prompt && (
                            <details className="st-kit-step-prompt">
                              <summary>{locale === 'en' ? 'Prompt for this step' : 'Prompt de este paso'} · {prompt.name}</summary>
                              <PromptCard prompt={prompt} />
                            </details>
                          )}
                          <p className="st-kit-check"><Check size={12} /> <strong>{locale === 'en' ? 'You should see.' : 'Tienes que ver.'}</strong> {step.expect}</p>
                          {step.stuck && (
                            <p className="st-kit-stuck"><AlertTriangle size={12} /> <strong>{locale === 'en' ? 'If it gets stuck.' : 'Si se atasca.'}</strong> {step.stuck}</p>
                          )}
                        </li>
                      )
                    })}
                  </ol>

                  <div className="st-kit-phase-end">
                    <p><strong>{locale === 'en' ? 'Phase deliverable.' : 'Entregable de la fase.'}</strong> {phase.deliverable}</p>
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
                  <div><span className="st-kicker">{locale === 'en' ? 'Literal' : 'Literales'}</span><h2>{locale === 'en' ? 'This kit’s prompts' : 'Los prompts de este kit'}</h2></div>
                  <span>{kit.prompts.length + 1} prompts</span>
                </div>
                <p className="st-kit-plain">
                  {locale === 'en'
                    ? 'They’re written for this system, with their blanks marked. Fill in, copy and paste. No need to go out to the prompt library: that’s for expanding, not for building.'
                    : 'Están escritos para este sistema, con sus huecos marcados. Rellena, copia y pega. No hace falta que salgas a la biblioteca de prompts: eso es para ampliar, no para montar.'}
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
                <section className="st-kit-block"><p className="st-kit-plain">{locale === 'en' ? 'This kit doesn’t have an importable flow yet.' : 'Este kit todavía no trae flujo importable.'}</p></section>
              )}
              {kit.workflows.map((workflow, index) => (
                <section key={workflow.name} className="st-kit-block">
                  <div className="st-section-head">
                    <div><span className="st-kicker"><Workflow size={11} /> {locale === 'en' ? 'Importable' : 'Importable'}</span><h2>{workflow.name}</h2></div>
                    <CopyButton text={flowText(index)} label={locale === 'en' ? 'Copy the flow' : 'Copiar el flujo'} />
                  </div>
                  <p className="st-kit-plain">{workflow.what}</p>

                  <div className="st-kit-columns">
                    <div>
                      <span className="st-kicker">{locale === 'en' ? 'You need beforehand' : 'Necesitas antes'}</span>
                      <ul className="st-kit-list">{workflow.needs.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                    <div>
                      <span className="st-kicker">{locale === 'en' ? 'Blanks you fill in' : 'Huecos que rellenas'}</span>
                      <dl className="st-kit-words">
                        {workflow.fill.map(([slot, what]) => (
                          <div key={slot}><dt><code>{slot}</code></dt><dd>{what}</dd></div>
                        ))}
                      </dl>
                    </div>
                  </div>

                  <div className="st-kit-careful">
                    <span className="st-kicker"><Shield size={11} /> {locale === 'en' ? 'Watch out for this' : 'Cuidado con esto'}</span>
                    <ul>{workflow.careful.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>

                  <details className="st-kit-code">
                    <summary><Download size={12} /> {locale === 'en' ? 'View the full JSON' : 'Ver el JSON completo'}</summary>
                    <pre><code>{flowText(index)}</code></pre>
                  </details>
                  <p className="st-kit-nocode">
                    {locale === 'en'
                      ? <><strong>How to import it.</strong> In n8n, the three-dot menu at the top right of the canvas: <em>Import from clipboard</em>. Paste and confirm. The nodes appear grayed out until you add credentials.</>
                      : <><strong>Cómo se importa.</strong> En n8n, menú de los tres puntos arriba a la derecha del lienzo: <em>Import from clipboard</em> (importar desde el portapapeles). Pega y acepta. Los nodos salen en gris hasta que les pongas credenciales.</>}
                  </p>
                </section>
              ))}
            </div>
          )}

          {tab === 'pruebas' && (
            <div className="st-kit-panel">
              <section className="st-kit-block">
                <div className="st-section-head"><div><span className="st-kicker"><ListChecks size={11} /> {locale === 'en' ? 'Before activating' : 'Antes de activar'}</span><h2>{locale === 'en' ? 'Cases you have to test' : 'Los casos que tienes que probar'}</h2></div></div>
                <div className="st-kit-table-wrap">
                  <table className="st-kit-table">
                    <thead><tr><th>{locale === 'en' ? 'Case' : 'Caso'}</th><th>{locale === 'en' ? 'What you feed it' : 'Qué le metes'}</th><th>{locale === 'en' ? 'What should happen' : 'Qué tiene que pasar'}</th></tr></thead>
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
                <div className="st-section-head"><div><span className="st-kicker"><AlertTriangle size={11} /> {locale === 'en' ? 'Risks' : 'Riesgos'}</span><h2>{locale === 'en' ? 'Where this breaks' : 'Por dónde se rompe esto'}</h2></div></div>
                <div className="st-kit-table-wrap">
                  <table className="st-kit-table">
                    <thead><tr><th>{locale === 'en' ? 'Risk' : 'Riesgo'}</th><th>{locale === 'en' ? 'How you notice it' : 'Cómo lo notas'}</th><th>{locale === 'en' ? 'What prevents it' : 'Qué lo evita'}</th></tr></thead>
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
                <div className="st-section-head"><div><span className="st-kicker"><Coins size={11} /> {locale === 'en' ? 'Money' : 'Dinero'}</span><h2>{locale === 'en' ? 'What it costs to run this' : 'Qué cuesta tener esto en marcha'}</h2></div></div>
                <div className="st-kit-table-wrap">
                  <table className="st-kit-table">
                    <thead><tr><th>{locale === 'en' ? 'Item' : 'Concepto'}</th><th>{locale === 'en' ? 'Free' : 'Gratis'}</th><th>{locale === 'en' ? 'Paid' : 'De pago'}</th><th>{locale === 'en' ? 'Note' : 'Aviso'}</th></tr></thead>
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
                <div className="st-section-head"><div><span className="st-kicker"><Gavel size={11} /> {locale === 'en' ? 'Legal' : 'Legal'}</span><h2>{locale === 'en' ? 'What you can’t skip' : 'Lo que no puedes saltarte'}</h2></div></div>
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
                  <div><span className="st-kicker">{locale === 'en' ? 'Combined stack' : 'Stack combinado'}</span><h2>{locale === 'en' ? 'Tools that complement each other' : 'Herramientas que se complementan'}</h2></div>
                  <span>{tools.length} {locale === 'en' ? 'pieces' : 'piezas'}</span>
                </div>
                <div className="st-kit-tools">
                  {tools.map((tool) => (
                    <a key={tool.id} href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}>
                      <BrandMark icon={tool.icon} size={20} />
                      <strong>{tool.label}</strong>
                      <small>{tool.guide?.prompts?.length || 0} prompts · {tool.guide?.automations?.length || 0} {locale === 'en' ? 'flows' : 'flujos'}</small>
                    </a>
                  ))}
                </div>
              </section>

              <div className="st-kit-columns">
                <section>
                  <div className="st-section-head"><div><span className="st-kicker">{locale === 'en' ? 'Prompts' : 'Prompts'}</span><h2>{locale === 'en' ? 'To expand' : 'Para ampliar'}</h2></div></div>
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
                  <div className="st-section-head"><div><span className="st-kicker">{locale === 'en' ? 'Automations' : 'Automatizaciones'}</span><h2>{locale === 'en' ? 'Candidate flows' : 'Flujos candidatos'}</h2></div></div>
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
                  <div><span className="st-kicker">{locale === 'en' ? 'Skills and processes' : 'Skills y procesos'}</span><h2>{locale === 'en' ? 'Lessons that back this up' : 'Lecciones que lo sostienen'}</h2></div>
                  <span>{skills.length} {locale === 'en' ? 'suggested' : 'sugeridos'}</span>
                </div>
                <div className="st-kit-skill-grid">
                  {skills.map((lesson) => (
                    <a key={lesson.slug} href={href({ name: 'leccion', slug: lesson.slug, level: 'intermedio' })}>
                      <BookMarked size={14} />
                      <strong>{lesson.title}</strong>
                      <small>{lesson.folderLabel}</small>
                    </a>
                  ))}
                </div>
              </section>
            </div>
          )}

          <section className="st-kit-master">
            <Lightbulb size={15} />
            <div>
              <strong>{locale === 'en' ? 'How to use this kit' : 'Cómo se usa este kit'}</strong>
              <p>
                {locale === 'en'
                  ? 'Run the brief and answer what it asks. Choose your scope. Follow the phases in order and don’t skip the checks: each step says what you should see on screen. Each phase leaves a deliverable, and those deliverables are the project.'
                  : 'Pasa el brief y contesta a lo que te pregunte. Elige alcance. Sigue las fases en orden y no te saltes las comprobaciones: cada paso dice lo que tienes que ver en pantalla. Cada fase deja un entregable, y esos entregables son el proyecto.'}
              </p>
            </div>
            <Wrench size={15} />
          </section>
        </section>
      </div>
    </div>
  )
}
