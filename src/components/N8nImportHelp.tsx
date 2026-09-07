import {useState} from 'react'
import {copyText} from '../clipboard'
import {useLocale} from '../i18n'
import type {ProjectManual} from '../types'

export function isN8nFile(file:{name:string;content?:string;url?:string}){
 if(file.content){try{const value=JSON.parse(file.content);return Array.isArray(value.nodes)&&value.connections&&typeof value.connections==='object'}catch{return false}}
 return Boolean(file.url&&file.name.endsWith('.n8n.json'))
}

export default function N8nImportHelp({file}:{file:ProjectManual['files'][number]}){
 const en=useLocale()==='en',t=(es:string,english:string)=>en?english:es
 const [state,setState]=useState<'idle'|'copying'|'done'|'error'>('idle')
 let nodes:{name:string;type:string;credentials?:unknown}[]=[]
 try{nodes=JSON.parse(file.content||'{}').nodes||[]}catch{}
 const copy=async()=>{
  setState('copying')
  try{
   let text=file.content
   if(!text&&file.url){const url=new URL(file.url,location.href);if(url.origin!==location.origin)throw new Error('External workflow');const r=await fetch(url,{credentials:'same-origin'});if(!r.ok)throw new Error('Download failed');text=await r.text()}
   const value=JSON.parse(text||'');if(!Array.isArray(value.nodes)||!value.connections)throw new Error('Not a workflow')
   await copyText(JSON.stringify(value,null,2));setState('done')
  }catch{setState('error')}
 }
 return <div className="st-n8n-import"><h4>{t('Este archivo es el flujo completo de n8n','This file is the complete n8n workflow')}</h4>{file.verification&&<p className="st-unit-evidence">{file.verification.status==='passed'?t(`Ejemplo ejecutado y comprobado en n8n ${file.verification.version}. La comprobación corresponde a los datos incluidos en este archivo.`,`Example executed and checked in n8n ${file.verification.version}. The check applies to the data included in this file.`):t(`Prueba de error comprobada en n8n ${file.verification.version}: debe detenerse con «${file.verification.expectedError}». En este archivo, detenerse es el comportamiento esperado.`,`Error test checked in n8n ${file.verification.version}: it must stop with “${file.verification.expectedError}”. Stopping is expected for this file.`)}</p>}<p>{t('El JSON contiene las cajas y sus conexiones. Copia el flujo completo para pegarlo en el lienzo de n8n; el código de una caja Code se pega dentro de esa caja y no sustituye este archivo.','The JSON contains the nodes and their connections. Copy the complete workflow to paste into the n8n canvas; a Code node’s code belongs inside that node and does not replace this file.')}</p><ol>
  <li>{t('Abre n8n y crea un workflow vacío, un espacio nuevo para esta práctica.','Open n8n and create an empty workflow, a new workspace for this practice.')}</li>
  <li>{t('Pulsa «Copiar flujo completo». Haz clic en una zona vacía del lienzo y pega con Ctrl+V en Windows o Cmd+V en Mac. Deben aparecer las cajas conectadas.','Select “Copy complete workflow”. Click an empty area of the canvas and paste with Ctrl+V on Windows or Cmd+V on Mac. Connected nodes should appear.')}</li>
  <li>{t(`Si no se pega, descarga ${file.name}. En el menú del workflow utiliza «Import from File» y selecciona ese archivo JSON, no el ZIP que lo contiene.`,`If pasting fails, download ${file.name}. In the workflow menu choose “Import from File” and select that JSON file, not its containing ZIP.`)}</li>
  <li>{t('Compara los nombres con los pasos de esta guía. Lee la preparación antes de ejecutar. Si una caja pide una cuenta, conecta la cuenta de ensayo indicada y elige el destino; importar no conecta cuentas automáticamente.','Compare names with this guide’s steps. Read preparation before running. If a node requests an account, connect the specified practice account and choose its destination; importing does not connect accounts automatically.')}</li>
  <li>{t('Ejecuta la prueba que indica esta guía. Abre la última caja y compara su salida con el resultado esperado. Si falla, abre la primera caja con error y conserva su mensaje antes de cambiar nada.','Run the test specified in this guide. Open the final node and compare its output with the expected result. If it fails, open the first failing node and keep its message before changing anything.')}</li>
 </ol>{nodes.length>0&&<><strong>{t('Nombres que debes encontrar en el lienzo','Names to find on the canvas')}</strong><ol>{nodes.map((n,i)=><li key={i}><code>{n.name}</code>{n.credentials?' · '+t('requiere conexión de cuenta','requires an account connection'):''}</li>)}</ol></>}<button type="button" className="st-btn" onClick={copy} disabled={state==='copying'}>{state==='copying'?t('Preparando…','Preparing…'):t('Copiar flujo completo','Copy complete workflow')}</button><p role="status">{state==='done'?t('Flujo copiado. Pégalo en una zona vacía del lienzo de n8n.','Workflow copied. Paste it into an empty area of the n8n canvas.'):state==='error'?t('No se pudo copiar el flujo. Descarga el archivo y utiliza Import from File.','Could not copy the workflow. Download the file and use Import from File.'):''}</p><p><a href="https://docs.n8n.io/build/manage-workflows/export-and-import" target="_blank" rel="noreferrer">{t('Instrucciones oficiales para importar en n8n','Official n8n import instructions')}</a></p></div>
}
