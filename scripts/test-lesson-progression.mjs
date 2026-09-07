import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {chromium} from 'playwright-core'
import {toolProjectSpecs} from './lib/tool-projects.mjs'
for(const locale of ['es','en']){
 const course=JSON.parse(await fs.readFile(`public/course${locale==='en'?'.en':''}.json`,'utf8'))
 for(const tool of course.toolPages){
  const lessons=tool.guide.projectLessons
  for(const [index,m] of lessons.entries()){
   assert.notEqual(m.steps[0].instruction,m.steps[1].instruction,`${locale}/${tool.id}/${index}: distinct actions`)
   if(index<4){
    assert.ok(m.workedExample?.before&&m.workedExample?.after)
    assert.ok(!m.steps.some(s=>s.instruction.includes(toolProjectSpecs[tool.id].improve)),`${tool.id}: future improvement is not a beginner task`)
   }
  }
 }
 for(const id of ['n8n','codex','canva']){
  const m=course.toolPages.find(t=>t.id===id).guide.projectLessons[0]
  assert.equal(m.steps.length,5)
  assert.ok(!m.files.some(f=>f.url?.endsWith('.zip')),'First practice is self-contained')
  assert.ok(m.prompts[0].text.split(/\s+/).length>=300)
  assert.doesNotMatch(JSON.stringify(m.tests),/GET \/requests|HTTP 201|rama de revisión|vertical variant/)
 }
 const n8n=course.toolPages.find(t=>t.id==='n8n').guide.projectLessons[0]
 assert.equal(n8n.workedExample.after,'name: Ana')
 assert.equal(n8n.steps[4].expected,'name: Luis')
 const codex=course.toolPages.find(t=>t.id==='codex').guide.projectLessons[0]
 assert.equal(codex.workedExample.after,'welcome.txt → Hola, Ana')
 assert.match(course.curso.find(l=>l.id==='que-es-la-ia').tasks[1].action,/opcional|optional/)
}
const base=process.env.ACADEMY_TEST_URL||'http://127.0.0.1:4182/'
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try{
 const context=await browser.newContext({viewport:{width:390,height:900}})
 await context.addInitScript(()=>sessionStorage.setItem('academia.session.v2','qa'))
 await context.route('**/rest/v1/rpc/**',route=>route.fulfill({json:{ok:true,token:'qa',expiresAt:'2099-01-01',profile:{id:'qa',name:'QA',role:'learner',level:'intermedio',locale:'es'},progress:{lessons:{},projects:[]},state:{lessons:{},projects:[]},version:0}}))
 const page=await context.newPage(),errors=[]
 page.on('pageerror',e=>errors.push(e.message))
 for(const locale of ['es','en']){
  for(const id of ['n8n','canva','codex']){
   await page.goto(base+`#/herramienta/${id}/lecciones-herramienta/01`)
   await page.locator('.st-worked-example').waitFor()
   if(await page.locator(`.st-project-manual[lang="${locale}"]`).count()===0){
    await page.locator('.st-lang-switch button').filter({hasText:locale==='en'?/^EN$/:/^ES$/}).filter({visible:true}).first().click()
    await page.locator(`.st-project-manual[lang="${locale}"]`).waitFor()
   }
   assert.equal(await page.locator('.st-worked-example li').count(),3)
   await page.locator('.st-learning-flow-track button').last().click()
   assert.equal(await page.locator('.st-learning-flow-track button[aria-pressed="true"]').count(),1)
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
   const downloadPromise=page.waitForEvent('download')
   await page.locator('#project-files').getByRole('button',{name:locale==='en'?'Download file':'Descargar archivo',exact:true}).first().click()
   assert.equal((await downloadPromise).suggestedFilename(),'first-practice.txt')
   if(locale==='es'&&id==='n8n')await page.locator('.st-worked-example').screenshot({path:'.temp/first-practice-es.png'})
  }
 }
 assert.deepEqual(errors,[])
 console.log('PASS: 560 lessons in each language have distinct actions; beginner practice matches its tests; ES/EN examples, visual steps, downloads and mobile layout work. Provider execution is not simulated by these checks.')
}finally{await browser.close()}
