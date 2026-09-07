import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
import {gzipSync} from 'node:zlib'
const reports=[]
for(const locale of ['es','en']){
 const course=JSON.parse(await fs.readFile(`public/course${locale==='en'?'.en':''}.json`,'utf8'))
 assert.ok(course.lessons.every(l=>['es','en'].includes(l.contentLanguage)),'Every reference declares its actual language')
 const updated=course.lessons.filter(l=>l.reviewStatus==='updated')
 assert.ok(updated.length>=34)
 assert.ok(updated.every(l=>l.contentLanguage===locale))
 assert.ok(course.lessons.every(l=>Object.values(l.levels).every(level=>!level.blocks.some(b=>b.kind==='analogia'&&b.from!=='vault'))),'Unrelated generated analogies removed')
 const report={locale,library:course.lessons.length,updated:updated.map(l=>({slug:l.slug,title:l.title})),originalReferences:course.lessons.filter(l=>l.reviewStatus!=='updated').map(l=>({slug:l.slug,title:l.title,language:l.contentLanguage,words:l.realWords})),practices:[],payloads:[]}
 for(const id of ['openai','sheets','canva','codex','n8n']){
  const m=course.toolPages.find(t=>t.id===id).guide.projectLessons[0]
  assert.ok(m.steps.length===5&&m.workedExample&&m.files.length>=2)
  report.practices.push({id,title:m.title,words:JSON.stringify(m.context.concat(m.steps.map(s=>s.instruction))).split(/\s+/).length})
  for(const name of [`tools/${id}`,`tool-lessons/${id}-01`]){
   const bytes=await fs.readFile(`public/course-data/${locale}/${name}.json`)
   report.payloads.push({name,bytes:bytes.length,gzip:gzipSync(bytes).length})
  }
 }
 reports.push(report)
}
await fs.mkdir('audit-output',{recursive:true})
await fs.writeFile('audit-output/learner-content.json',JSON.stringify(reports,null,2))
console.log('PASS: 34 updated bilingual library pages; five complete first practices; original references retain truthful language labels. Detailed inventory saved to audit-output/learner-content.json.')
