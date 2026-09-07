// Hand-authored changes and independently stated expectations for each classroom case.
const cases={
 classify:[{text:'Necesito ayuda con algo'},{category:'otros',review:true}],
 'priority-alert':[{priority:'baja'},{notify:false,text:null}],
 'daily-summary':[{items:[]},{total:0,pending:0,text:'Sin pendientes'}],
 deduplicate:[{items:[{id:'R1',amount:20},{id:'R1',amount:20},{id:'R2',amount:30},{id:'R2',amount:30}]},{accepted:2,duplicates:2}],
 approval:[{version:4},{allowed:false}],
 retry:[{status:401},{retry:false,delaySeconds:0,nextAttempt:1}],
 'document-record':[{text:'Cliente: Ana Pérez\nServicio: Limpieza'},{client:'Ana Pérez',service:'Limpieza',date:null,review:true}],
 'follow-up':[{delayHours:24},{dueAt:'2026-09-02T10:00:00.000Z'}],
 sync:[{currentVersion:3},{apply:false,patch:null}],
 audit:[{startedAt:'2026-09-01T10:00:02Z',endedAt:'2026-09-01T10:00:00Z'},null,'Intervalo inválido'],
 validation:[{email:'mal',quantity:0},{valid:false,errors:['email','quantity']}],
 usage:[{runs:[{costCents:12},{costCents:18},{costCents:null},{costCents:5}]},{knownCostCents:35,runs:4,unpriced:1}],
 draft:[{requestedDay:'jueves'},{status:'draft'}],
 attachments:[{attachments:[{id:'A1',name:'../factura.pdf'},{id:'A2',name:'foto local.png'},{id:'A3',name:'factura.pdf'}]},{count:3}],
 invoice:[{totalCents:12000},{valid:false,deltaCents:-100}],
 crm:[{confirmed:{phone:''}},{changed:[]}],
 ticket:[{affectedUsers:2},{priority:'P2'}],
 escalate:[{escalated:true},{escalate:false}],
 publish:[{version:3},{publish:false}],
 variants:[{variants:[{id:'A',text:'Aprende a organizar tus tareas',score:8,unsupported:true},{id:'B',text:'El mejor curso del universo',score:9,unsupported:true},{id:'C',text:'Convierte notas en acciones',score:7,unsupported:true}]},{selected:null,review:true}],
 monitor:[{status:200,openIncident:true},{failures:0,recovered:true}],
 normalize:[{rows:[{email:' ANA@EXAMPLE.COM ',name:' Ana '},{email:'ana@example.com',name:'Ana'},{email:'mal',name:'Luis'},{email:'marta@example.com',name:'Marta'}]},{accepted:2,rejected:1,duplicates:1}],
 onboarding:[{role:'unknown'},{template:null,review:true}],
 meeting:[{tasks:[{id:'T1',text:'Validar presupuesto',done:true},{id:'T2',text:'Enviar agenda',done:true}]},{openTasks:0,brief:'Sin tareas pendientes'}],
 'day-close':[{tasks:[]},{pending:0,blocked:0,lines:[]}],
}
export function scenarioVariation(s){
 const row=cases[s.id]
 if(!row)throw new Error('No explicit variation for '+s.id)
 return {...s,sample:{...structuredClone(s.sample),...structuredClone(row[0])},expected:row[1]||{},expectedError:row[2],name:s.name+' · segundo intento'}
}
