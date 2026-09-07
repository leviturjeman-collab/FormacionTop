export type TemplateField = {key:string;label:string;help:string}
const tokens=/\[([^\]\n]{1,120})\]/g
const fixed=new Set(['PENDIENTE','PENDING','RELLENAR','FILL IN','NO INDICADO','NO INDICADA','NOT SPECIFIED','ALTA','BAJA','HIGH','LOW'])
export function templateFields(text:string,hints:[string,string][]=[]):TemplateField[]{
 const help=new Map(hints),seen=new Set<string>(),fields:TemplateField[]=[]
 for(const match of text.matchAll(tokens)){
  const key=match[0],inner=match[1]
  if(seen.has(key)||fixed.has(inner)||(!help.has(key)&&(!/^[\p{L}\p{N} _.,/()¿?¡!:-]+$/u.test(inner)||inner!==inner.toUpperCase()||inner.length<3)))continue
  seen.add(key);const words=inner.replaceAll('_',' ');fields.push({key,label:words[0]+words.slice(1).toLowerCase(),help:help.get(key)||''})
 }
 return fields
}
/** Replace original slots exactly once: user text containing another slot remains literal. */
export function fillTemplate(text:string,values:Record<string,string>):string{
 return text.replace(tokens,key=>Object.hasOwn(values,key)&&values[key].trim()?values[key]:key)
}
export function downloadTextFile(name:string,text:string){
 const url=URL.createObjectURL(new Blob([text],{type:name.endsWith('.json')?'application/json;charset=utf-8':'text/plain;charset=utf-8'})),a=document.createElement('a')
 a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
}
