import {useId,useState} from 'react'
import {useLocale} from '../i18n'
import {copyText} from '../clipboard'
import {downloadTextFile} from '../editable-template'
export default function EditableFile({name,content}:{name:string;content:string}){
 const en=useLocale()==='en',t=(es:string,eng:string)=>en?eng:es,id=useId()
 const [text,setText]=useState(content),[open,setOpen]=useState(false),[status,setStatus]=useState('')
 const act=async(copy:boolean)=>{
  if(name.endsWith('.json')){try{JSON.parse(text)}catch{setStatus(t('Comprueba el formato JSON. Si cambiaste una coma o comilla, vuelve al ejemplo y modifica solo los valores.','Check the JSON format. If you changed a comma or quote, return to the example and edit only values.'));return}}
  try{if(copy)await copyText(text);else downloadTextFile('my-'+name,text);setStatus(t('Tu copia está preparada.','Your copy is ready.'))}catch{setStatus(copy?t('No se pudo copiar. Utiliza la descarga.','Could not copy. Use the download.'):t('No se pudo descargar. Prueba a copiar el contenido.','Could not download. Try copying the contents.'))}
 }
 return <details className="st-template-editor st-editable-file" onToggle={e=>setOpen(e.currentTarget.open)}><summary>{t('Editar una copia de este archivo','Edit a copy of this file')}</summary>{open&&<><p>{t('Modifica esta copia y descárgala para utilizarla fuera de la academia. El ejemplo original sigue disponible arriba. Revisa el contenido antes de usarlo.','Edit this copy and download it for use outside the academy. The original example remains available above. Check the contents before using it.')}</p><div className="st-template-fields"><label htmlFor={id}>{name}</label><textarea id={id} rows={12} value={text} onChange={e=>{setText(e.target.value);setStatus('')}}/></div><div className="st-template-actions"><button type="button" className="st-btn" onClick={()=>act(false)}>{t('Descargar mi archivo','Download my file')}</button><button type="button" className="st-btn-ghost" onClick={()=>act(true)}>{t('Copiar mi archivo','Copy my file')}</button></div><p role="status">{status}</p></>}</details>
}
