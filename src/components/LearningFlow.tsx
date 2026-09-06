import {useState} from 'react'
import type {ProjectManual} from '../types'
import {useLocale} from '../i18n'

export default function LearningFlow({manual}:{manual:ProjectManual}) {
 const en=useLocale()==='en'
 const [selected,setSelected]=useState(0)
 const current=manual.steps[selected]||manual.steps[0]
 if(!current)return null
 return <section className="st-learning-flow" aria-label={en?'Visual walkthrough':'Recorrido visual'}>
  <header><span className="st-kicker">{en?'Follow the process':'Sigue el proceso'}</span><h2>{en?'Your steps at a glance':'Tus pasos de un vistazo'}</h2><p>{en?'Select a box to see what to do and what should appear. Read the full instructions below when you are ready to try it.':'Pulsa una caja para ver qué hacer y qué debería aparecer. Cuando vayas a probarlo, lee las instrucciones completas de abajo.'}</p></header>
  <ol className="st-learning-flow-track">{manual.steps.map((step,index)=><li key={index}><button type="button" aria-pressed={selected===index} onClick={()=>setSelected(index)}><span>{String(index+1).padStart(2,'0')}</span><strong>{step.title}</strong></button>{index<manual.steps.length-1&&<span className="st-flow-arrow" aria-hidden="true">→</span>}</li>)}</ol>
  <div className="st-learning-flow-result" aria-live="polite"><div><span className="st-kicker">{en?'Action':'Acción'} {selected+1}</span><h3>{current.title}</h3><p>{current.instruction}</p></div><div><span className="st-kicker">{en?'Expected evidence':'Evidencia esperada'}</span><p>{current.expected}</p><button type="button" className="st-btn-ghost" onClick={()=>document.getElementById('project-step-'+selected)?.scrollIntoView({block:'start'})}>{en?'Read this step in full':'Leer este paso completo'}</button></div></div>
 </section>
}
