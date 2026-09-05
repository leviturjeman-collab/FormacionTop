import { useEffect, useState } from 'react'
import { useLocale } from '../i18n'
type Source = {id:string;url:string;purpose:string;http:{status:string;code?:number;checkedAt?:string}}
type Resource = {id:string;kind:string;locale:string;sourcePath:string;sha256:string;checkedAt:string;checks:{name:string;passed:boolean}[];sources:string[]}
type Registry = {resources:Resource[];sources:Source[]}
export default function ResourceVerification({id,kind}:{id:string;kind:'agentes'|'kits'}) {
  const locale = useLocale()
  const en = locale === 'en'
  const [registry,setRegistry] = useState<Registry | null>(null)
  const [error,setError] = useState(false)
  useEffect(()=>{const controller=new AbortController(); fetch(`${import.meta.env.BASE_URL}resource-verification.json`,{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('registry');return r.json()}).then(data=>{if(!Array.isArray(data.resources)||!Array.isArray(data.sources))throw Error('registry');setRegistry(data)},()=>setError(true)).catch(()=>setError(true));return()=>controller.abort()},[])
  const record = registry?.resources.find(r=>r.id===id&&r.kind===kind&&r.locale===locale)
  const labels:Record<string,string> = en ? {reachable:'HTTP reachable',redirect_review:'Redirect: review destination',http_error:'HTTP error or access restriction',network_error:'Network check failed',not_checked:'Not checked'} : {reachable:'HTTP accesible',redirect_review:'Redirección: revisar destino',http_error:'Error HTTP o restricción de acceso',network_error:'Falló comprobación de red',not_checked:'Sin comprobar'}
  return <details className="st-project-workspace"><summary>{en?'Verification record and sources':'Registro de verificación y fuentes'}</summary>
    <p>{en?'These checks cover the published source structure. They do not certify external execution, current instructions, or your credentials and environment.':'Estas pruebas cubren la estructura del recurso publicado. No certifican ejecución externa, vigencia de instrucciones ni tus credenciales y entorno.'}</p>
    {!record ? <p role="status">{error ? (en?'Verification record unavailable.':'Registro no disponible.') : registry ? (en?'This resource has no verification record.':'Este recurso no tiene registro de verificación.') : (en?'Loading record…':'Cargando registro…')}</p> : <>
      <p>{en?'Local check date':'Fecha de prueba local'}: <time dateTime={record.checkedAt}>{record.checkedAt}</time></p>
      <p>{en?'Source version (SHA-256)':'Versión fuente (SHA-256)'}: <code style={{overflowWrap:'anywhere'}}>{record.sha256}</code></p>
      <p><code>{record.sourcePath}</code></p>
      <ul>{record.checks.map(c=><li key={c.name}>{c.passed?'✓':'✕'} {c.name}</li>)}</ul>
      <p>{en?'External execution: unverified. Validate this version with your test cases and record the results in My project.':'Ejecución externa: sin verificar. Valida esta versión con tus casos de prueba y registra los resultados en Mi proyecto.'}</p>
      <ul>{record.sources.map(id=>registry?.sources.find(s=>s.id===id)).filter((s):s is Source=>!!s).map(s=><li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.purpose}</a> — {labels[s.http.status]||s.http.status}{s.http.code ? ` (${s.http.code})`:''}{s.http.checkedAt ? ` · ${s.http.checkedAt}`:''}. {en?'Instruction correctness: not reviewed.':'Corrección de instrucciones: sin revisar.'}</li>)}</ul>
      {!record.sources.length&&<p>{en?'No mapped documentation sources yet.':'Aún no hay fuentes documentales asociadas.'}</p>}
      <p>{en?'An HTTP response only shows availability at the stated date. These are general documentation sources, not a line-by-line review of this resource.':'Una respuesta HTTP solo demuestra disponibilidad en la fecha indicada. Son fuentes documentales generales, no una revisión de cada instrucción del recurso.'}</p>
    </>}
  </details>
}
