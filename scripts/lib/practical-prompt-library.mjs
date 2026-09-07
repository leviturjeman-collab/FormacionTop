import {dailyPromptExample} from './daily-prompt-examples.mjs'
// Keep each task's authored prompt; remove the generic institution-wide wrapper.
const wrappers=[['## Prompt base de la biblioteca anterior','## Reglas institucionales'],['## Base prompt from the previous library','## Institutional rules'],['## Prompt base que debes ejecutar','## Cierre institucional obligatorio'],['## Base prompt to run','## Required institutional close'],['## Prompt base del Programa','## Adaptación institucional obligatoria'],['## Base Program prompt','## Required institutional adaptation']]
function unwrap(text){
 for(const [start,end] of wrappers)if(text.includes(start)){text=text.split(start)[1].split(end)[0].trim();break}
 // These sections were appended mechanically only to meet a word quota.
 for(const marker of ['\n\n## Antes de empezar\nTrabaja con este contexto:','\n\n## Before you start\nWork with this context:'])if(text.includes(marker))text=text.split(marker)[0].trim()
 return text
}
function editable(prompt,en){
 prompt.prompt=unwrap(prompt.prompt)
 const unique=new Map()
 for(const pair of prompt.fill||[])if(prompt.prompt.includes(pair[0]))unique.set(pair[0],pair[1])
 for(const match of prompt.prompt.matchAll(/\[([^\]\n]{3,100})\]/g)){
  const name=match[1]
  if(name!==name.toUpperCase()||!/^[\p{L}\p{N} _.,/()¿?¡!:-]+$/u.test(name)||['PENDIENTE','PENDING','RELLENAR','FILL IN','ALTA','BAJA','NOT SPECIFIED'].includes(name))continue
  if(!unique.has(match[0]))unique.set(match[0],en?'Enter the detail requested by this field. Leave it empty if you need help finding it.':'Escribe el dato que pide este campo. Déjalo vacío si necesitas ayuda para encontrarlo.')
 }
 prompt.fill=[...unique]
 return prompt
}
const example=m=>m?.practiceLab?{input:m.practiceLab.source,output:m.practiceLab.answer,why:m.practiceLab.walkthrough[2].action}:undefined
export function makePromptLibraryPractical(course,en=false){
 const t=(es,eng)=>en?eng:es,tools=new Map(course.toolPages.map(x=>[x.id,x])),output=[]
 for(const family of course.prompts){
  let prompts=family.prompts.filter(p=>!p.id?.includes(':extra-')).map(p=>{
   p={...p}
   const tool=tools.get(p.toolId),toolMatch=p.id?.match(/:tool-(\d+)$/),kitMatch=p.id?.match(/:kit-(\d+)$/),lessonMatch=p.id?.match(/:programa-(.+)-\d+$/)
   if(toolMatch&&tool){
    const index=Number(toolMatch[1])-1,original=tool.guide.prompts[index],m=tool.guide.projectLessons[Math.floor(index/2)]
    if(original){p.prompt=original.prompt;p.expect=original.expected||p.expect;p.where=original.where;p.next=original.replace||original.when}
    p.example=example(m)
    if(m)p.practiceHref=`#/herramienta/${tool.id}/lecciones-herramienta/${String(Math.floor(index/2)+1).padStart(2,'0')}`
   }else if(kitMatch){
    const kit=course.kits[Number(kitMatch[1])-1],m=kit?.workbook
    if(m){p.prompt=m.practiceLab.prompt;p.expect=m.practiceLab.answer;p.name=kit.title;p.where=m.prompts[0]?.where;p.example=example(m);p.practiceHref=`#/kits/${kit.id}`;p.next=t('Abre el kit para ver los pasos, las plantillas y la automatización.','Open the kit for its steps, templates and automation.')}
   }else if(lessonMatch){
    const l=course.curso.find(x=>x.id===lessonMatch[1])
    if(l?.practiceLab){p.example={input:l.practiceLab.source,output:l.practiceLab.answer,why:l.practiceLab.walkthrough[2].action};p.practiceHref=`#/curso/${l.id}`;p.expect=l.practiceLab.answer;p.where=l.tasks.find(x=>x.prompt)?.where}
   }
   p.where||=t('En un asistente de texto compatible con esta tarea. Lee los requisitos de la práctica si necesita archivos o herramientas.','In a text assistant supporting this task. Read the practice requirements if it needs files or tools.')
   p=editable(p,en)
   const daily=p.id?.match(/base-trabajo-diario-(\d+)$/),worked=daily&&dailyPromptExample(Number(daily[1])-1,en)
   if(worked){
    const fields=p.fill.filter(([slot])=>!['[PENDIENTE]','[PENDING]','[RELLENAR]','[FILL IN]'].includes(slot))
    if(fields.length!==worked.values.length)throw new Error('Daily example does not match its fields: '+p.id)
    p.fill=fields;p.exampleValues=Object.fromEntries(fields.map(([key],i)=>[key,worked.values[i]]));p.example={input:fields.map(([key],i)=>key+': '+worked.values[i]).join('\n'),output:worked.output,why:worked.why}
   }
   return p
  })
  const tool=tools.get(family.toolId)
  if(tool)for(const automation of tool.guide.automations||[]){
   const m=automation.project;if(!m)continue
   for(const [i,p] of m.prompts.entries())prompts.push(editable({id:`automatizar:${tool.id}:${automation.id}:${i}`,name:automation.name+' · '+p.title,when:automation.name,prompt:p.text,fill:[],expect:p.expected,next:p.replace,where:p.where,toolId:tool.id,toolLabel:tool.label,categoryId:'automatizar',source:t('Automatización con práctica','Automation with practice'),practiceHref:`#/automatizaciones/${tool.id}/${automation.id}`,example:example(m)},en))
  }
  for(let i=0;i<prompts.length;i+=50){
   const group=prompts.slice(i,i+50),part=Math.floor(i/50)+1
   output.push({...family,id:i?family.id+'-'+part:family.id,title:tool?`${tool.label} · ${group.length} prompts${i?' · '+part:''}`:family.title,prompts:group,intro:t('Elige una tarea, completa sus datos y copia el mensaje preparado. Abre la práctica enlazada para seguir el ejemplo y comprobar el resultado.','Choose a task, fill in its details and copy the prepared message. Open the linked practice to follow the example and check the result.'),model:t('Utiliza el asistente que indique la práctica. Comprueba que tu cuenta permite los archivos o funciones necesarios.','Use the assistant named by the practice. Check that your account supports the required files or features.'),blockDescription:t('Mensajes para tareas concretas, con campos editables y acceso a sus prácticas.','Messages for specific tasks, with editable fields and links to their practices.'),audience:t('Personas que están aprendiendo a usar IA en tareas reales.','People learning to use AI for real tasks.'),tips:[t('Completa los campos y revisa la vista previa antes de copiar.','Fill in the fields and check the preview before copying.'),t('Empieza con la muestra de la práctica y después utiliza tus datos.','Start with the practice sample, then use your details.')],canDo:[t('Preparar un mensaje personalizado y guardarlo para repetir la tarea.','Prepare a personalised message and save it to repeat the task.')],cantDo:[t('Pegar un prompt no conecta cuentas ni ejecuta acciones en otras aplicaciones.','Pasting a prompt does not connect accounts or run actions in other applications.')]})
  }
 }
 course.prompts=output
}
