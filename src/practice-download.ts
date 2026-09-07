import type {ProjectManual} from './types'

/** Small UTF-8 ZIP writer using stored entries: loaded only on download. */
export function practiceZip(files:{name:string;bytes:Uint8Array}[]):Uint8Array {
 const chunks:Uint8Array[]=[],central:Uint8Array[]=[];let offset=0
 const encoder=new TextEncoder()
 const crc32=(bytes:Uint8Array)=>{let c=0xffffffff;for(const b of bytes){c^=b;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^0xffffffff)>>>0}
 for(const file of files){
  const name=encoder.encode(file.name),crc=crc32(file.bytes),head=new Uint8Array(30),h=new DataView(head.buffer)
  h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x800,true);h.setUint16(12,33,true);h.setUint32(14,crc,true);h.setUint32(18,file.bytes.length,true);h.setUint32(22,file.bytes.length,true);h.setUint16(26,name.length,true)
  const entry=new Uint8Array(46),e=new DataView(entry.buffer)
  e.setUint32(0,0x02014b50,true);e.setUint16(4,20,true);e.setUint16(6,20,true);e.setUint16(8,0x800,true);e.setUint16(14,33,true);e.setUint32(16,crc,true);e.setUint32(20,file.bytes.length,true);e.setUint32(24,file.bytes.length,true);e.setUint16(28,name.length,true);e.setUint32(42,offset,true)
  chunks.push(head,name,file.bytes);central.push(entry,name);offset+=head.length+name.length+file.bytes.length
 }
 const centralSize=central.reduce((n,c)=>n+c.length,0),end=new Uint8Array(22),v=new DataView(end.buffer)
 v.setUint32(0,0x06054b50,true);v.setUint16(8,files.length,true);v.setUint16(10,files.length,true);v.setUint32(12,centralSize,true);v.setUint32(16,offset,true)
 const all=[...chunks,...central,end],output=new Uint8Array(offset+centralSize+end.length);let pos=0
 for(const chunk of all){output.set(chunk,pos);pos+=chunk.length}return output
}

export async function downloadPractice(manual:ProjectManual,en:boolean){
 const encoder=new TextEncoder(),files:{name:string;bytes:Uint8Array}[]=[]
 const t=(es:string,english:string)=>en?english:es
 const names=new Set<string>()
 const add=(name:string,bytes:Uint8Array)=>{const safe=name.replaceAll('\\','/').split('/').pop()||'file.txt';let unique=safe;let i=2;while(names.has(unique))unique=`${i++}-${safe}`;names.add(unique);files.push({name:unique,bytes})}
 add(en?'START-HERE.txt':'EMPIEZA-AQUI.txt',encoder.encode(`${manual.title}\n\n${manual.outcome}\n\n${t('PREPARACIÓN','PREPARATION')}\n${manual.prerequisites.map(p=>p.name+'\n'+p.instruction+'\n'+p.check).join('\n\n')}\n\n${t('PASOS','STEPS')}\n${manual.steps.map((s,i)=>`${i+1}. ${s.title}\n${s.instruction}\n${s.configuration||''}\n${t('Debes ver:','You should see:')} ${s.expected}`).join('\n\n')}\n\n${t('COMPRUEBA EL RESULTADO','CHECK THE RESULT')}\n${manual.tests.map(p=>p.name+'\n'+p.input+'\n'+p.expected+'\n'+p.inspect).join('\n\n')}\n\n${t('QUÉ CONTIENE CADA ARCHIVO','WHAT EACH FILE CONTAINS')}\n${manual.files.map(f=>f.name+': '+f.purpose).join('\n')}\n\n${t('Si hay otro ZIP dentro, extráelo también. Las cuentas y conexiones se preparan en la herramienta; este paquete no las crea.','If another ZIP is inside, extract that too. Accounts and connections must be prepared in the tool; this package does not create them.')}\n`))
 add(en?'HELP-MESSAGES.txt':'MENSAJES-DE-AYUDA.txt',encoder.encode(manual.prompts.map(p=>`${p.title}\n${p.where}\n${p.replace}\n\n${p.text}`).join('\n\n---\n\n')))
 for(const file of manual.files){
  if(file.content!==undefined)add(file.name,encoder.encode(file.content))
  else if(file.url){const url=new URL(file.url,location.href);if(url.origin!==location.origin)throw new Error('External file');const r=await fetch(url,{credentials:'same-origin'});if(!r.ok)throw new Error('Download failed');add(file.name,new Uint8Array(await r.arrayBuffer()))}
 }
 const bytes=practiceZip(files),url=URL.createObjectURL(new Blob([bytes as BlobPart],{type:'application/zip'})),a=document.createElement('a')
 a.href=url;a.download=en?'practice-materials.zip':'materiales-practica.zip';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000)
}
