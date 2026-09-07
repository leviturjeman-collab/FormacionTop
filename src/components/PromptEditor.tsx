import {useId,useMemo,useState} from 'react'
import {useLocale} from '../i18n'
import {templateFields,fillTemplate,downloadTextFile} from '../editable-template'
import {copyText} from '../clipboard'

export default function PromptEditor({text,hints=[],name,onSave,exampleValues}:{text:string;hints?:[string,string][];name:string;onSave?:(text:string)=>void;exampleValues?:Record<string,string>}){
 const en=useLocale()==='en',t=(es:string,english:string)=>en?english:es,id=useId()
 const fields=useMemo(()=>templateFields(text,hints),[text,hints]),[values,setValues]=useState<Record<string,string>>({}),[status,setStatus]=useState('')
 const result=fillTemplate(text,values),remaining=fields.filter(f=>!values[f.key]?.trim()).length
 const copy=async()=>{try{await copyText(result);setStatus(t('Mensaje copiado. Pégalo en el asistente indicado.','Message copied. Paste it into the indicated assistant.'))}catch{setStatus(t('No se pudo copiar. Selecciona el texto de la vista previa y cópialo.','Could not copy. Select and copy the preview text.'))}}
 return <section className="st-template-editor" aria-label={t('Prepara el prompt con tus datos','Prepare the prompt with your details')}>
  <h3>{t('Rellena, revisa y copia','Fill in, check and copy')}</h3>
  <p>{t('Completa los campos que necesite tu tarea. La vista previa cambia mientras escribes. Si todavía no sabes un dato, deja el hueco para que el asistente lo pregunte.','Complete the fields your task needs. The preview changes as you type. If a detail is unknown, leave the slot so the assistant can ask for it.')}</p>
  {exampleValues&&<button type="button" className="st-btn-ghost" onClick={()=>{setValues({...exampleValues});setStatus(t('Ejemplo ficticio cargado. Puedes probarlo y después cambiar los campos.','Fictional example loaded. Try it, then change the fields.'))}}>{t('Rellenar con el ejemplo resuelto','Fill with the worked example')}</button>}
  <div className="st-template-fields">{fields.map((f,i)=><div key={f.key}><label htmlFor={`${id}-${i}`}>{f.label}</label>{f.help&&<p id={`${id}-${i}-help`}>{f.help}</p>}<textarea id={`${id}-${i}`} aria-describedby={f.help?`${id}-${i}-help`:undefined} rows={3} value={values[f.key]||''} onChange={e=>{setValues(v=>({...v,[f.key]:e.target.value}));setStatus('')}}/></div>)}</div>
  <p className="st-template-count">{fields.length?remaining?t(`${remaining} campos siguen pendientes. Al copiar conservarán sus corchetes.`,`${remaining} fields are still empty. Copying will keep their bracket slots.`):t('Todos los campos están completos. Revisa el mensaje antes de usarlo.','Every field is filled. Check the message before using it.'):t('Este mensaje ya incluye el ejemplo. Puedes copiarlo y realizar la práctica.','This message already includes the example. Copy it to do the practice.')}</p>
  <details className="st-template-preview"><summary>{t('Ver el mensaje que vas a copiar','Preview the message you will copy')}</summary><pre>{result}</pre></details>
  <div className="st-template-actions"><button className="st-btn" type="button" onClick={copy}>{t('Copiar mi prompt','Copy my prompt')}</button><button className="st-btn-ghost" type="button" onClick={()=>downloadTextFile('prompt.txt',name+'\n\n'+result)}>{t('Descargar mi prompt','Download my prompt')}</button>{onSave&&<button className="st-btn-ghost" type="button" onClick={()=>{onSave(result);setStatus(t('Prompt guardado en Mi proyecto.','Prompt saved to My project.'))}}>{t('Guardar mi prompt en Mi proyecto','Save my prompt to My project')}</button>}</div>
  <p role="status">{status}</p>
 </section>
}
