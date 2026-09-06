import { useState } from 'react'
import type { ToolPage } from '../types'
import { toolPath } from '../tool-path'
import { href } from '../router'
import { store, useStudent } from '../store'
import { useLocale } from '../i18n'
import SaveResourceButton from './SaveResourceButton'

export default function ToolLearningPath({ tool, lessonId }: { tool: ToolPage; lessonId?: string }) {
  const en = useLocale() === 'en'
  const student = useStudent()
  const [need, setNeed] = useState('all')
  const lessons = toolPath(tool, en)
  const url = (id?: string) => href({ name: 'herramienta', toolId: tool.id, tab: 'lecciones-herramienta', lessonId: id, filters: {} })
  const done = (id: string) => student.lessons[`tool-path:${tool.id}:${id}`]?.done.includes('intermedio')
  const active = lessons.find(item => item.id === lessonId)
  if (lessonId && !active) return <div className="st-page"><h1>{en ? 'Lesson not found' : 'Lección no encontrada'}</h1><a href={url()}>{en ? 'Back to lessons' : 'Volver a las lecciones'}</a></div>
  if (active) return <article className="st-page st-path-detail">
    <a className="st-btn-ghost" href={url()}>{en ? `Back to ${tool.label}` : `Volver a ${tool.label}`}</a>
    <header className="st-lesson-head"><span className="st-kicker">{tool.label} · {en ? 'Lesson' : 'Lección'} {active.id} / 10</span><h1>{active.title}</h1><p className="st-lesson-headline">{active.purpose}</p><SaveResourceButton resource={{ id: `tool-path:${tool.id}:${active.id}`, kind: 'lesson', title: `${tool.label} · ${active.title}`, href: url(active.id) }} /></header>
    <section className="st-panel"><h2>{en ? '1. Understand the idea' : '1. Entiende la idea'}</h2>{active.explanation.map((text, i) => <p key={i}>{text}</p>)}</section>
    <section className="st-panel"><h2>{en ? '2. Practice case' : '2. Caso de práctica'}</h2><p>{active.example}</p><p>{en ? 'Keep working on the same practice project throughout the ten lessons.' : 'Mantén el mismo proyecto de práctica durante las diez lecciones.'}</p></section>
    <section className="st-panel"><h2>{en ? '3. Step by step' : '3. Paso a paso'}</h2><ol className="st-path-steps">{active.steps.map((text, i) => <li key={i}>{text}</li>)}</ol></section>
    <section className="st-panel st-path-check"><h2>{en ? '4. Check the result' : '4. Comprueba el resultado'}</h2><p>{active.check}</p></section>
    <details className="st-panel"><summary>{en ? 'If something goes wrong' : 'Si algo falla'}</summary>{active.errors.map((text, i) => <p key={i}>{text}</p>)}</details>
    <p><a href={tool.guide?.account.url.startsWith('http') ? tool.guide.account.url : `https://${tool.guide?.account.url}`} target="_blank" rel="noreferrer">{en ? 'Official setup reference' : 'Referencia oficial de preparación'}</a></p>
    <button className="st-btn" type="button" aria-pressed={!!done(active.id)} onClick={() => store.toggleDone(`tool-path:${tool.id}:${active.id}`, 'intermedio')}>{done(active.id) ? (en ? 'Completed · undo' : 'Completada · deshacer') : (en ? 'Mark lesson completed' : 'Marcar lección completada')}</button>
    <nav className="st-lesson-nav" aria-label={en ? 'Lesson navigation' : 'Navegación de lecciones'}>{Number(active.id) > 1 && <a href={url(String(Number(active.id) - 1).padStart(2, '0'))}>{en ? 'Previous' : 'Anterior'}</a>}{Number(active.id) < 10 ? <a href={url(String(Number(active.id) + 1).padStart(2, '0'))}>{en ? 'Next lesson' : 'Siguiente lección'}</a> : <a href={href({ name: 'mi-proyecto' })}>{en ? 'Open my project' : 'Abrir mi proyecto'}</a>}</nav>
  </article>
  return <section className="st-tool-path"><div className="st-section-head"><div><span className="st-kicker">{en ? 'Your learning path' : 'Tu recorrido'}</span><h2>{en ? `Learn ${tool.label} in 10 lessons` : `Aprende ${tool.label} en 10 lecciones`}</h2><p>{en ? 'Start at 01, or jump to the lesson that solves your current need. Further reading is optional.' : 'Empieza por la 01 o entra en la lección que resuelve tu necesidad. Las ampliaciones son opcionales.'}</p></div><span>{lessons.filter(item => done(item.id)).length}/10</span></div>
    <div className="st-path-needs" role="group" aria-label={en ? 'What do you need?' : '¿Qué necesitas?'}>{[['all', en ? 'All lessons' : 'Todas'], ['start', en ? 'I am starting' : 'Estoy empezando'], ['build', en ? 'I want to create' : 'Quiero crear'], ['fix', en ? 'Fix an error' : 'Arreglar un error'], ['deliver', en ? 'Deliver my project' : 'Entregar mi proyecto']].map(([id, label]) => <button className="st-btn-ghost" type="button" key={id} aria-pressed={id === need} onClick={() => setNeed(id)}>{label}</button>)}</div>
    <ol className="st-path-list">{lessons.filter(item => need === 'all' || ({ start: [1,2,3], build: [4,5,6], fix: [7,8], deliver: [9,10] }[need] || []).includes(Number(item.id))).map(item => <li key={item.id}><a href={url(item.id)}><span className="st-path-number">{item.id}</span><div><h3>{item.title}</h3><p>{item.purpose}</p></div><span>{done(item.id) ? '✓' : '→'}</span></a></li>)}</ol>
    {!!tool.itinerary?.length && <details className="st-panel"><summary>{en ? 'Additional worked lessons' : 'Lecciones resueltas adicionales'}</summary>{tool.itinerary.map(item => <p key={item.id}><a href={href({ name: 'curso', lessonId: item.id })}>{item.title}</a></p>)}</details>}
  </section>
}
