import {projectLessons} from './tool-projects.mjs'

// Replace old module scaffolds with the maintained curriculum. Keep specialist source
// documents intact and explicitly identify their original language for the reader.
export function reviewLibrary(lessons,programme,en=false){
 const t=(es,english)=>en?english:es
 const groups=[
  [/^(?:modulo-01-chatgpt-y-workflows|(?:lecciones|laboratorios|evaluacion|fuentes)-chatgpt-y-workflows)$/,'openai','ChatGPT'],
  [/^(?:modulo-02-codex|(?:lecciones|laboratorios|evaluacion|fuentes)-codex)$/,'codex','Codex'],
  [/^(?:modulo-06-n8n-automatizacion-e-ia|(?:lecciones|laboratorios|evaluacion|fuentes)-n8n)$/,'n8n','n8n'],
  [/^(?:modulo-03-claude-y-claude-code|(?:lecciones|laboratorios|evaluacion|fuentes)-claude-y-claude-code)$/,'claude-code','Claude Code'],
  [/^(?:modulo-04-gemini|(?:lecciones|laboratorios|evaluacion|fuentes)-gemini)$/,'gemini','Gemini'],
  [/^(?:modulo-05-github-skills-y-copilot|(?:lecciones|laboratorios|evaluacion|fuentes)-github-skills-y-copilot)$/,'copilot','GitHub Copilot'],
 ]
 const cached=new Map()
 const section=(title,text,configuration)=>({kind:'seccion',title,parts:[{type:'p',text},...(configuration?[{type:'code',lang:'text',code:configuration}]:[])]})
 for(const lesson of lessons){
  lesson.contentLanguage=lesson.contentLanguage||'es'
  lesson.reviewStatus='reference'
  for(const data of Object.values(lesson.levels))data.blocks=data.blocks.filter(b=>b.kind!=='analogia'||b.from==='vault')
  const group=groups.find(([pattern])=>pattern.test(lesson.slug))
  if(!group)continue
  const [,id,label]=group
  if(!cached.has(id))cached.set(id,projectLessons({id,label},en))
  const index=lesson.slug.startsWith('laboratorios-')?4:lesson.slug.startsWith('evaluacion-')?7:lesson.slug.startsWith('fuentes-')?9:lesson.slug.startsWith('lecciones-')?1:0
  const m=cached.get(id)[index]
  lesson.contentLanguage=en?'en':'es';lesson.reviewStatus='updated';lesson.authored=true
  lesson.title=`${label} · ${m.title.replace(/^\d+ · /,'')}`
  lesson.search=[lesson.title,m.outcome,label].join(' ').toLowerCase()
  lesson.interactive=[];lesson.indexTerms=[]
  lesson.format='leccion'
  for(const [level,old] of Object.entries(lesson.levels)){
   const extension=level==='basico'?[]:level==='intermedio'?m.tests.map(p=>section(p.name,p.input+' '+p.expected+' '+p.inspect)):m.production.map((p,i)=>section(t('En tu actividad','In your activity')+' '+(i+1),p))
   lesson.levels[level]={...old,headline:m.outcome,hook:t('Primero sigue el ejemplo. Después comprueba el resultado y pruébalo con un dato de tu actividad.','First follow the example. Then check the result and try it with a detail from your activity.'),objectives:[m.outcome],blocks:[...m.context.map((p,i)=>section(t('Antes de empezar','Before starting')+' '+(i+1),p)),...m.steps.map((s,i)=>section(`${i+1}. ${s.title}`,s.instruction+' '+t('Debes ver: ','You should see: ')+s.expected,s.configuration)),...m.prompts.map(p=>section(p.title,p.where+' '+p.replace,p.text)),...extension],practice:{goal:t('Repite el ejemplo en la herramienta','Repeat the example in the tool'),steps:m.steps.map(s=>({title:s.title,where:label,action:s.instruction,expected:s.expected})),evidence:m.outcome},pitfalls:m.troubleshooting.map(p=>({error:p.symptom,fix:p.fix})),checklist:m.tests.map(p=>p.expected),quiz:[],minutes:level==='basico'?25:40}
  }
  lesson.realWords=lesson.levels.intermedio.blocks.flatMap(b=>b.parts).map(p=>p.text||p.code||'').join(' ').split(/\s+/).length
 }
 // These are navigation/reference pages, so replace internal file paths with a usable
 // bilingual route explanation rather than presenting directory names as instructions.
 for(const lesson of lessons.filter(l=>['ruta-maestra-de-lecciones','itinerario-general','prerrequisitos','curriculo'].includes(l.slug))){
  const titles={ 'ruta-maestra-de-lecciones':t('Cómo seguir el programa','How to follow the programme'),'itinerario-general':t('Organiza tu recorrido de aprendizaje','Organise your learning path'),'prerrequisitos':t('Qué preparar antes de empezar','What to prepare before starting'),'curriculo':t('Qué aprenderás en el programa','What you will learn in the programme')}
  lesson.title=titles[lesson.slug];lesson.contentLanguage=en?'en':'es';lesson.reviewStatus='updated';lesson.authored=true;lesson.interactive=[];lesson.indexTerms=[]
  const blocks=[section(t('Empieza con una tarea pequeña','Start with one small task'),t('Abre Programa desde el menú. Si empiezas de cero, comienza por la primera lección y sigue sus tareas en orden. El resultado de una práctica puede ser un correo guardado, una tabla o un cartel. Elige una tarea que puedas terminar y comprobar antes de pasar a otra herramienta.','Open Programme from the menu. If you are starting from zero, begin with the first lesson and follow its tasks in order. A practice result might be a saved email, a table or a poster. Choose something you can finish and check before moving to another tool.')),section(t('Prepara lo necesario','Prepare what you need'),t('Ten una aplicación donde puedas guardar notas y una carpeta para los archivos de práctica. Cada lección explica qué cuenta o aplicación necesita. Abre la preparación antes de descargar archivos. Cuando haya un ZIP, extráelo y lee EMPIEZA-AQUI.txt. Si te falta acceso a una herramienta, resuelve ese paso antes de marcar la práctica como terminada.','Have an app for saving notes and a folder for practice files. Each lesson explains which account or application it needs. Read preparation before downloading files. When there is a ZIP, extract it and read START-HERE.txt. If you lack access to a tool, resolve that step before marking the practice finished.')),section(t('Sigue el ejemplo y comprueba','Follow the example and check'),t('Lee primero cómo debe quedar el resultado. Realiza una acción y mira qué ha aparecido. Guarda una copia del primer intento. Después cambia un solo dato, repite y explica la diferencia. Un mensaje de IA que dice «hecho» no demuestra que un archivo exista: abre el archivo o la aplicación de destino para comprobarlo.','First read what the result should look like. Perform one action and inspect what appeared. Keep a copy of the first attempt. Then change one detail, repeat and explain the difference. An AI message saying “done” does not prove that a file exists: open the file or destination application to check.')),section(t('Llévalo a tu actividad','Use it in your activity'),t('Después del ejemplo, elige un caso propio parecido. Cambia el nombre, la información y el destinatario que correspondan. Comprueba otra vez los datos importantes y anota qué sigue pendiente. Marca la lección cuando puedas mostrar el resultado. Al terminar verás qué has practicado y un enlace a la siguiente lección.','After the example, choose a similar case of your own. Change the relevant name, information and recipient. Recheck the important details and record anything still pending. Mark the lesson when you can show the result. At the end you will see what you practised and a link to the next lesson.'))]
  for(const [level,old] of Object.entries(lesson.levels))lesson.levels[level]={...old,headline:lesson.title,hook:t('Una ruta corta para empezar, practicar y continuar.','A short route to start, practise and continue.'),blocks,objectives:[t('Encontrar tu primera práctica y preparar sus materiales.','Find your first practice and prepare its materials.')],practice:{goal:t('Prepara tu primera sesión','Prepare your first session'),steps:[{title:t('Abre Programa','Open Programme'),where:t('En el menú de la academia','In the academy menu'),action:t('Abre Programa y selecciona la primera lección. Lee su resultado antes de empezar.','Open Programme and select the first lesson. Read its outcome before starting.'),expected:programme[0]?.title||t('Ves la primera lección.','You see the first lesson.')}],evidence:t('Sabes qué vas a hacer y dónde guardarás el resultado.','You know what you will do and where you will save the result.')},quiz:[],checklist:[t('He encontrado mi primera lección.','I found my first lesson.'),t('Sé qué material necesito y dónde guardarlo.','I know which material I need and where to save it.')],pitfalls:[],minutes:10}
  lesson.search=lesson.title.toLowerCase()
 }
 return lessons
}
