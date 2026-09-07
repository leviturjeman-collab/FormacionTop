import fs from 'node:fs/promises'
const course=JSON.parse(await fs.readFile('public/course.json','utf8')),links=new Map()
function walk(x,label=''){
 if(!x||typeof x!=='object')return
 const context=x.title||x.name||label
 if(Array.isArray(x.sources))for(const s of x.sources){if(!s.url?.startsWith('https://'))continue;if(!links.has(s.url))links.set(s.url,[]);links.get(s.url).push(context)}
 for(const value of Object.values(x))if(value&&typeof value==='object')walk(value,context)
}
walk(course.toolPages);walk(course.curso);walk(course.kits)
const pending=[...links],results=[]
async function worker(){for(let item;item=pending.shift();){const [url,contexts]=item;try{const r=await fetch(url,{signal:AbortSignal.timeout(20000),redirect:'follow'}),body=await r.text();const missing=/(?:<title>[^<]*(?:404|page not found)|^# Page Not Found)/im.test(body);results.push({url,status:r.status,finalUrl:r.url,state:r.status===404||missing?'missing':r.ok?'reachable':'unverified',contexts:[...new Set(contexts)]})}catch(e){results.push({url,state:'unverified',reason:e.message,contexts:[...new Set(contexts)]})}}}
await Promise.all(Array.from({length:6},()=>worker()))
await fs.mkdir('audit-output',{recursive:true});await fs.writeFile('audit-output/practice-links.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2))
console.log(JSON.stringify({total:results.length,reachable:results.filter(x=>x.state==='reachable').length,missing:results.filter(x=>x.state==='missing').map(x=>x.url),unverified:results.filter(x=>x.state==='unverified').map(x=>({url:x.url,status:x.status,reason:x.reason}))},null,2))
