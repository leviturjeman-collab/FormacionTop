import {useId, useState} from 'react'
import type {PracticeLab} from '../types'
import {useLocale} from '../i18n'
import {copyText} from '../clipboard'

function Result({text}:{text:string}){
 const lines=text.split('\n'),rows=lines.map(line=>line.split('|').map(x=>x.trim()))
 if(rows.length>1&&rows[0].length>1&&rows.every(r=>r.length===rows[0].length))return <div className="st-project-table"><table><thead><tr>{rows[0].map((x,i)=><th scope="col" key={i}>{x}</th>)}</tr></thead><tbody>{rows.slice(1).map((r,i)=><tr key={i}>{r.map((x,j)=><td key={j}>{x}</td>)}</tr>)}</tbody></table></div>
 return <pre className="st-lab-answer">{text}</pre>
}

export default function PracticeLabView({lab}:{lab:PracticeLab}){
 const en=useLocale()==='en',t=(es:string,english:string)=>en?english:es,id=useId()
 const [copy,setCopy]=useState<'idle'|'done'|'error'>('idle')
 const copyPrompt=async()=>{try{await copyText(lab.prompt);setCopy('done')}catch{setCopy('error')}}
 const download=()=>{
  const text=[lab.title,lab.introduction,...lab.notes,t('MUESTRA','SAMPLE'),lab.source,...lab.walkthrough.map((s,i)=>`${i+1}. ${s.title}\n${s.action}\n${s.result}`),t('AHORA TÚ','YOUR TURN'),lab.challenge.task,t('MI RESPUESTA:','MY ANSWER:'),'\n\n',t('PISTAS','HINTS'),...lab.challenge.hints,t('SOLUCIÓN: CONSULTA DESPUÉS DE PROBAR','ANSWER: CHECK AFTER TRYING'),lab.challenge.answer,...lab.adaptation,lab.prompt].join('\n\n')
  const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a')
  a.href=url;a.download=en?'worked-case.txt':'caso-resuelto.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
 }
 return <section className="st-panel st-practice-lab" aria-labelledby={id}>
  <span className="st-kicker">{t('Entiende · Repite · Úsalo','Understand · Repeat · Use it')}</span>
  <h2 id={id}>{lab.title}</h2>
  <p>{lab.introduction}</p>
  {lab.navigation&&<nav className="st-lab-navigation" aria-label={t('Dónde entrar y cuándo','Where to go and when')}>{lab.navigation.map(link=><p key={link.href}><a href={link.href}>{link.label}</a><br/>{link.when}</p>)}</nav>}
  <div className="st-lab-route" aria-label={t('Recorrido de la práctica','Practice journey')}><span>1 · {t('Datos','Details')}</span><span aria-hidden="true">→</span><span>2 · {t('Resolución','Solution')}</span><span aria-hidden="true">→</span><span>3 · {t('Tu intento','Your attempt')}</span></div>
  <details className="st-lab-materials"><summary>{t('Qué tener abierto para seguirlo','What to have open to follow along')}</summary><ul>{lab.materials.map((m,i)=><li key={i}>{m}</li>)}</ul></details>
  {lab.notes.length>0&&<div className="st-lab-explanation"><h3>{t('Vamos a verlo con un ejemplo','Let’s look at an example')}</h3>{lab.notes.map((p,i)=><p key={i}>{p}</p>)}</div>}
  <div className="st-lab-source"><h3>{t('Estos son los datos para empezar','Here are your starting details')}</h3><Result text={lab.source}/></div>
  <ol className="st-lab-walkthrough">{lab.walkthrough.map((s,i)=><li key={i}><span className="st-kicker">{t('Paso explicado','Explained step')} {i+1}</span><h3>{s.title}</h3><p>{s.action}</p><div className="st-lab-reference"><strong>{i===2?t('Cómo comprobarlo','How to check'):t('Mira cómo queda','See the result')}</strong><Result text={s.result}/></div></li>)}</ol>
  <div className="st-lab-challenge"><span className="st-kicker">{t('Ahora te toca a ti','Now it is your turn')}</span><h3>{t('Prueba este cambio sin mirar la solución','Try this change before looking at the answer')}</h3><p>{lab.challenge.task}</p><p>{t('Escribe tu respuesta o haz la prueba en la herramienta. Cuando termines, compara con la solución. Si no coincide, busca el primer dato diferente; no necesitas empezar todo de nuevo.','Write your answer or try it in the tool. When finished, compare with the solution. If it differs, find the first changed detail; you do not need to start everything again.')}</p><details><summary>{t('Necesito una pista','I need a hint')}</summary><ol>{lab.challenge.hints.map((hint,i)=><li key={i}>{hint}</li>)}</ol></details><details><summary>{t('Ver la solución y comparar','View the answer and compare')}</summary><Result text={lab.challenge.answer}/><p>{t('Esta es la respuesta esperada. Comprueba tú lo que ocurre en tu documento o aplicación antes de dar la práctica por terminada.','This is the expected answer. Check what happens in your document or application before considering the practice finished.')}</p></details></div>
  <h3>{t('Cómo repetirlo en tu propio proyecto','How to repeat it in your project')}</h3><ol className="st-path-steps">{lab.adaptation.map((p,i)=><li key={i}>{p}</li>)}</ol>
  <details className="st-lab-help"><summary>{t('Si te atascas: un mensaje preparado para pedir ayuda','If you get stuck: a ready message for help')}</summary><p>{t('Cambia el apartado MI INTENTO por lo que has hecho. Pégalo en tu asistente de texto; pide una pista antes de pedir la respuesta completa.','Replace MY ATTEMPT with your work. Paste it into your text assistant; request a hint before asking for the complete answer.')}</p><pre className="st-lab-answer">{lab.prompt}</pre><button type="button" className="st-btn-ghost" onClick={copyPrompt}>{t('Copiar mensaje de ayuda','Copy help message')}</button><p role="status">{copy==='done'?t('Mensaje copiado.','Message copied.'):copy==='error'?t('No se pudo copiar. Selecciona el texto y cópialo manualmente.','Could not copy. Select the text and copy it manually.'):''}</p></details>
  <button type="button" className="st-btn" onClick={download}>{t('Descargar el caso, las pistas y las soluciones','Download the case, hints and answers')}</button>
 </section>
}
