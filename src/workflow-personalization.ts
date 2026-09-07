export type JsonValue = string|number|boolean|null|JsonValue[]|{[key:string]:JsonValue}
export interface WorkflowPersonalization {sample:{[key:string]:JsonValue};required:string[]}
type Node={id?:string;name:string;type:string;parameters:Record<string,unknown>}
type Workflow={name:string;nodes:Node[];connections:Record<string,unknown>;active?:boolean;[key:string]:unknown}
/** A separate working copy keeps the resolver, replacing only its input and removing the example-only assertion. */
export function personalizeWorkflow(original:Workflow,input:Record<string,JsonValue>,config:WorkflowPersonalization):Workflow{
 const checkNumbers=(value:JsonValue):void=>{if(typeof value==='number'&&!Number.isFinite(value))throw new Error('Número pendiente o inválido / Missing or invalid number');if(value&&typeof value==='object')Object.values(value).forEach(checkNumbers)}
 checkNumbers(input)
 for(const key of config.required)if(input[key]===undefined||input[key]===null||input[key]==='')throw new Error('Falta / Missing: '+key)
 const result=structuredClone(original),source=result.nodes.find(n=>n.name==='Muestra del proyecto'),resolver=result.nodes.find(n=>n.name==='Resolver')
 if(!source||!resolver||source.type!=='n8n-nodes-base.code'||resolver.type!=='n8n-nodes-base.code')throw new Error('Unsupported workflow')
 source.parameters={...source.parameters,jsCode:'return [{json:'+JSON.stringify(input)+'}];'}
 result.nodes=result.nodes.filter(n=>n.name!=='Comprobar resultado')
 delete result.connections.Resolver
 delete result.connections['Comprobar resultado']
 delete result.id;delete result.versionId;delete result.verification;delete result.meta
 result.name=original.name+' · personalizado / personalised';result.active=false;result.pinData={}
 return result
}
