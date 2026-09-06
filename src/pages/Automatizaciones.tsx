import { useState } from 'react'
import { useCourse } from '../course'
import { useLocale } from '../i18n'
import { href } from '../router'

export default function Automatizaciones({ toolId, automationId }: { toolId?: string; automationId?: string }) {
  const course = useCourse()
  const en = useLocale() === 'en'
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState('all')
  const tools = course.toolPages.filter(t => t.guide?.automations?.length)
  const entries = tools.flatMap(tool => (tool.guide?.automations || []).map(automation => ({ tool, automation })))
  const active = entries.find(e => e.tool.id === toolId && e.automation.name === automationId)
  if (automationId && !active) return <div className="st-page"><h1>{en ? 'Automation not found' : 'Automatización no encontrada'}</h1><a href={href({name:'automatizaciones'})}>{en ? 'Open catalog' : 'Abrir catálogo'}</a></div>
  if (active) {
    const a = active.automation
    return <article className="st-page st-path-detail"><a className="st-btn-ghost" href={href({name:'automatizaciones'})}>{en ? 'Back to automations' : 'Volver a automatizaciones'}</a><header className="st-lesson-head"><span className="st-kicker">{active.tool.label}</span><h1>{a.name}</h1><p>{a.goal}</p></header>
      <section className="st-panel"><h2>{en ? 'Before you start' : 'Antes de empezar'}</h2><p>{en ? 'This is a learning recipe. First configure a test destination; the academy does not execute it on your behalf.' : 'Esta es una receta de aprendizaje. Prepara primero un destino de prueba; la academia no ejecuta el flujo por ti.'}</p><h3>{en ? 'What starts it' : 'Qué lo pone en marcha'}</h3><p>{a.trigger}</p><h3>{en ? 'Required connections' : 'Conexiones necesarias'}</h3><p>{a.credentials}</p></section>
      <section className="st-panel"><h2>{en ? 'Build the flow step by step' : 'Construye el flujo paso a paso'}</h2><ol className="st-path-steps">{a.steps.map((step,i)=><li key={i}>{step}</li>)}</ol>{a.code && <pre className="st-institutional-code"><code>{a.code}</code></pre>}</section>
      <section className="st-panel st-path-check"><h2>{en ? 'Test and verify' : 'Prueba y comprueba'}</h2><p>{a.test}</p></section><section className="st-panel"><h2>{en ? 'If it fails' : 'Si falla'}</h2><p>{a.failure}</p></section><a className="st-btn" href={href({name:'herramienta',toolId:active.tool.id,filters:{}})}>{en ? `Learn ${active.tool.label}` : `Aprender ${active.tool.label}`}</a>
    </article>
  }
  const filtered=entries.filter(e=>(platform==='all'||e.tool.id===platform) && `${e.tool.label} ${e.automation.name} ${e.automation.goal}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="st-page"><header className="st-page-title"><span className="st-kicker">{en ? 'Applied learning' : 'Aprendizaje aplicado'}</span><h1>{en ? 'Automations' : 'Automatizaciones'}</h1><p>{en ? 'Choose the process you want to learn. Each recipe explains its trigger, connections, construction, test and recovery.' : 'Elige el proceso que quieres aprender. Cada receta explica qué la activa, qué conexiones necesita, cómo construirla, cómo probarla y qué hacer si falla.'}</p></header>
    <div className="st-automation-filters"><label>{en ? 'Find a process' : 'Buscar un proceso'}<input value={query} onChange={e=>setQuery(e.target.value)} placeholder={en ? 'Bookings, email, data…' : 'Reservas, correo, datos…'}/></label><label>{en ? 'Tool' : 'Herramienta'}<select value={platform} onChange={e=>setPlatform(e.target.value)}><option value="all">{en ? 'All tools' : 'Todas las herramientas'}</option>{tools.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select></label></div><p>{filtered.length} {en ? 'learning recipes' : 'recetas de aprendizaje'}</p>
    <div className="st-automation-catalog">{filtered.map(({tool,automation:a})=><a key={`${tool.id}:${a.name}`} href={href({name:'automatizaciones',toolId:tool.id,automationId:a.name})}><span className="st-kicker">{tool.label}</span><h2>{a.name}</h2><p>{a.goal}</p><span>{en ? 'Open the step-by-step guide →' : 'Abrir la guía paso a paso →'}</span></a>)}</div>{!filtered.length&&<p>{en ? 'No matching recipes. Try another word or tool.' : 'No hay recetas con ese filtro. Prueba otra palabra o herramienta.'}</p>}
  </div>
}
