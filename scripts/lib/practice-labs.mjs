import {practicalExplanation} from './practical-explanations.mjs'

/** The same schema supports a worked example and a separately revealed learner answer. */
export function makePracticeLab({title,fixture,notes=[],materials=[],where='',action='',en=false}){
 const t=(es,english)=>en?english:es
 const [input,answer,reason,challenge,challengeAnswer]=fixture
 if([input,answer,reason,challenge,challengeAnswer].some(x=>!x?.trim()))throw new Error(`Incomplete worked practice: ${title}`)
 return {
  title,
  introduction:t('Vamos a seguir un caso ficticio desde el principio: qué información llega, qué hacemos con ella y por qué obtenemos esa respuesta. Después cambiarás un dato y podrás comprobar si has entendido la regla.','Follow a fictional case from the beginning: what arrives, what we do with it and why we get that answer. Then change one detail and check whether you have understood the rule.'),
  materials,
  notes,
  source:input,
  walkthrough:[
   {title:t('Encuentra los datos que vas a utilizar','Find the details you will use'),action:t(`Lee la muestra completa de abajo. Separa los datos escritos de las decisiones que todavía están pendientes. Trabaja en ${where||'tu documento de práctica'}. Conserva una copia de la muestra para comparar después.`,`Read the complete sample below. Separate written details from decisions still pending. Work in ${where||'your practice document'}. Keep a copy of the sample for later comparison.`),result:input},
   {title:t('Haz la tarea con la muestra a la vista','Perform the task with the sample visible'),action:action||t('Escribe una primera respuesta usando la información de la muestra. Si la solución tiene filas, resuelve una fila cada vez; si contiene un cálculo, escribe la operación antes del total. Si describe una acción en una herramienta, realiza los pasos de la lección y mira el resultado allí.','Write a first answer using the sample. For a table, work through one row at a time; for a calculation, write the operation before the total. If it describes a tool action, perform the lesson steps and inspect the result there.'),result:answer},
   {title:t('Entiende por qué esa respuesta encaja','Understand why the answer fits'),action:reason,result:t('Compara tu resultado con la referencia, dato por dato. Puedes usar otras palabras, pero los nombres, cantidades, reglas y acciones deben conservar el significado. Anota cualquier diferencia que cambie el resultado.','Compare your answer with the reference detail by detail. Different wording is fine, but names, quantities, rules and actions must preserve their meaning. Record any difference that changes the result.')},
  ],
  answer,
  challenge:{task:challenge,hints:[t('Vuelve a leer qué dato cambia en este segundo intento. Márcalo en una copia; conserva los demás datos del ejemplo.','Read which detail changes in this second attempt. Mark it in a copy and preserve the other example details.'),reason],answer:challengeAnswer},
  adaptation:[
   t('Elige una tarea tuya que produzca el mismo tipo de resultado. Por ejemplo, sustituye una consulta de curso por una consulta sobre tu servicio; conserva la regla que has aprendido. Escribe quién utilizará el resultado y para qué.','Choose one of your tasks that produces the same kind of result. For example, replace a course enquiry with an enquiry about your service while keeping the rule you learned. Write who will use the result and why.'),
   t('Prepara tres ejemplos pequeños que puedas revisar completos. En el primero incluye toda la información; en el segundo cambia un dato importante; en el tercero deja fuera un dato necesario. Escribe qué debería ocurrir antes de probar cada uno.','Prepare three small examples you can review completely. Include all details in the first, change one important detail in the second and omit a required detail in the third. Write what should happen before trying each.'),
   t('Guarda tu primera versión y la adaptada por separado. Anota lo que viste de verdad, dónde lo comprobaste y qué sigue pendiente. Si otra persona abre tu trabajo, debe poder encontrar la muestra, repetir las acciones y comparar el resultado sin leer tu conversación.','Save the original and adapted versions separately. Record what you actually observed, where you checked it and what remains pending. Someone opening your work should find the sample, repeat the actions and compare the result without reading your conversation.'),
  ],
  prompt:t(`Estoy practicando desde cero: ${title}. Ayúdame a entender este caso con palabras sencillas.\n\nDÓNDE TRABAJO\n${where||'En un documento de práctica y en la herramienta indicada por la lección.'}\n\nMUESTRA\n${input}\n\nRESPUESTA DE REFERENCIA\n${answer}\n\nPOR QUÉ ENCAJA\n${reason}\n\nMI INTENTO\n[PEGA AQUÍ TU RESPUESTA O DESCRIBE LO QUE VES]\n\nCompara mi intento con la muestra. Señala primero una diferencia concreta y explica por qué importa. No te limites a decir «revisa la configuración»: indica el dato, el valor esperado y dónde debo comprobarlo. Si no puedes ver un archivo o una pantalla, pídeme solo la información que te falte. No afirmes haber guardado, enviado o ejecutado algo si no lo has comprobado.\n\nQuiero aprender a corregirlo: dame una pista y una acción pequeña. Espera a que pruebe antes de resolver todo por mí. Cuando termine, comprueba este segundo caso: ${challenge}\n\nDespués ayúdame a usar la misma regla en una tarea de mi proyecto. Distingue qué datos debo cambiar, qué regla se mantiene y qué resultado debería poder mostrar.`,
   `I am practising from zero: ${title}. Help me understand this case in simple language.\n\nWORKSPACE\n${where||'A practice document and the tool specified by the lesson.'}\n\nSAMPLE\n${input}\n\nREFERENCE ANSWER\n${answer}\n\nWHY IT FITS\n${reason}\n\nMY ATTEMPT\n[PASTE YOUR ANSWER OR DESCRIBE WHAT YOU SEE]\n\nCompare my attempt with the sample. Start with one concrete difference and explain why it matters. Instead of “check the settings”, identify the detail, expected value and where to inspect it. If you cannot see a file or screen, ask only for the missing information. Do not claim to save, send or execute anything without checking.\n\nHelp me learn to correct it: give one hint and one small action. Wait for my attempt before solving everything. Afterwards check this second case: ${challenge}\n\nThen help me apply the same rule to one task in my project. Distinguish which details change, which rule stays and what result I should be able to show.`),
 }
}

export function practiceLabText(lab,en=false){
 const t=(es,english)=>en?english:es
 return [lab.title,lab.introduction,...lab.notes,t('MATERIALES','MATERIALS'),...lab.materials,t('MUESTRA','SAMPLE'),lab.source,...lab.walkthrough.map((s,i)=>`${i+1}. ${s.title}\n${s.action}\n${s.result}`),t('AHORA INTÉNTALO TÚ','NOW TRY IT YOURSELF'),lab.challenge.task,t('MI RESPUESTA (COMPLETAR)','MY ANSWER (FILL IN)'), '\n\n',t('PISTAS','HINTS'),...lab.challenge.hints,t('SOLUCIÓN DEL SEGUNDO INTENTO: CONSULTA DESPUÉS DE PROBAR','SECOND ATTEMPT ANSWER: CHECK AFTER TRYING'),lab.challenge.answer,t('EN MI PROYECTO','IN MY PROJECT'),...lab.adaptation,t('MENSAJE DE AYUDA','HELP MESSAGE'),lab.prompt].join('\n\n')+'\n'
}

export function enrichManualPractice(manual,{kind,en=false,fixture,notes}={}){
 if(manual.practiceLab)return manual
 const t=(es,english)=>en?english:es
 const first=manual.tests[0],second=manual.tests[1]||first
 const source=manual.workedExample?.before||manual.inputs.map(x=>`${x.field}: ${x.example}`).join('\n')||first.input
 const specific=fixture||[source,manual.workedExample?.after||first.expected,manual.steps.map(s=>s.why).filter(Boolean).join(' '),second.input,second.expected]
 const lab=makePracticeLab({title:manual.title,fixture:specific,notes:notes||[...manual.context.slice(0,1),...practicalExplanation(kind||'text',en)],materials:manual.prerequisites.map(p=>p.name+': '+p.instruction),where:t('el espacio de práctica indicado en la preparación','the practice workspace specified in preparation'),action:fixture?undefined:manual.workedExample?.action||manual.steps[1]?.instruction,en})
 return {...manual,practiceLab:lab,files:[...manual.files,{name:en?'WORKED-CASE.txt':'CASO-RESUELTO.txt',purpose:t('Caso explicado, segundo intento con pistas y solución, y una guía para aplicarlo a tu proyecto.','Explained case, second attempt with hints and answer, and guidance for your own project.'),content:practiceLabText(lab,en)}]}
}
