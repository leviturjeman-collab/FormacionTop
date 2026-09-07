import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {chromium} from 'playwright-core'
const base=process.env.ACADEMY_TEST_URL||'http://127.0.0.1:4182/'
const course=JSON.parse(await fs.readFile('public/course.json','utf8'))
const automation=course.toolPages.find(t=>t.id==='n8n').guide.automations[0]
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'})
await fs.mkdir('.temp/lab-ui',{recursive:true})
try{
 const context=await browser.newContext({viewport:{width:390,height:844},permissions:['clipboard-read','clipboard-write'],reducedMotion:'reduce'})
 await context.addInitScript(()=>sessionStorage.setItem('academia.session.v2','qa'))
 await context.route('**/rest/v1/rpc/**',r=>r.fulfill({json:{ok:true,token:'qa',expiresAt:'2099-01-01',profile:{id:'qa',name:'QA',role:'learner',level:'intermedio',locale:'es'},progress:{lessons:{},projects:[]},state:{lessons:{},projects:[]},version:0}}))
 const page=await context.newPage(),errors=[]
 page.on('pageerror',e=>errors.push(e.message))
 for(const locale of ['es','en']){
  for(const route of ['#/curso/que-es-la-ia','#/kits/operaciones-ia','#/herramienta/n8n/lecciones-herramienta/01','#/herramienta/make/lecciones-herramienta/05',`#/agentes/${course.agents[0].id}`,`#/automatizaciones/n8n/${automation.id}`]){
   await page.goto(base+route)
   await page.locator('.st-lang-switch').filter({visible:true}).first().waitFor()
   await page.locator('.st-lang-switch button').filter({hasText:locale==='en'?/^EN$/:/^ES$/}).filter({visible:true}).first().click()
   const lab=page.locator('.st-practice-lab').first()
   await lab.waitFor()
   await lab.getByRole('heading',{name:locale==='en'?'An explained case you can do yourself':'Un caso explicado para que puedas hacerlo tú',exact:true}).waitFor()
   const answer=lab.locator('.st-lab-challenge details').last()
   assert.equal(await answer.getAttribute('open'),null,'Answer starts closed')
   await answer.locator('summary').click()
   assert.notEqual(await answer.getAttribute('open'),null)
   assert.ok((await answer.innerText()).length>90)
   await answer.locator('summary').click()
   const hint=lab.locator('.st-lab-challenge details').first()
   await hint.locator('summary').click();assert.equal(await hint.locator('li').count(),2)
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' mobile overflow')
   const download=page.waitForEvent('download')
   await lab.getByRole('button',{name:locale==='en'?'Download the case, hints and answers':'Descargar el caso, las pistas y las soluciones',exact:true}).click()
   const file=await download,path=`.temp/lab-ui/${locale}-${route.split('/').at(-1)}.txt`
   await file.saveAs(path)
   const text=await fs.readFile(path,'utf8')
   assert.ok(text.includes(locale==='en'?'MY ANSWER:':'MI RESPUESTA:')&&text.length>500)
   if(route.includes('kits/')&&locale==='es')await lab.locator('.st-lab-source').screenshot({path:'.temp/lab-ui/mobile-case.png'})
   if(route.includes('automatizaciones/')){
    const boxes=page.locator('.st-n8n-import')
    assert.equal(await boxes.count(),3)
    for(let i=0;i<3;i++){
     const box=boxes.nth(i),fileEntry=automation.project.files.filter(f=>f.name.endsWith('.n8n.json'))[i]
     await box.getByRole('button',{name:locale==='en'?'Copy complete workflow':'Copiar flujo completo',exact:true}).click()
     await box.getByRole('status').filter({hasText:locale==='en'?'Workflow copied':'Flujo copiado'}).waitFor()
     const copied=JSON.parse(await page.evaluate(()=>navigator.clipboard.readText()))
     const expected=JSON.parse(fileEntry.content||await fs.readFile('public'+fileEntry.url,'utf8'))
     assert.deepEqual(copied,expected,'Copies the correct complete file')
     assert.ok((await box.locator('.st-unit-evidence').innerText()).includes('2.37.10'))
    }
    if(locale==='es'){
     await page.setViewportSize({width:1440,height:1000})
     await boxes.first().screenshot({path:'.temp/lab-ui/desktop-n8n.png'})
     await page.setViewportSize({width:390,height:844})
    }
   }
  }
 }
 assert.deepEqual(errors,[])
 console.log('PASS: ES/EN programme, kit, n8n, Make, agent and automation views; closed answers, hints, actual worksheets, exact JSON clipboard contents for all three files, runtime evidence, mobile layout and no browser errors. Progress mocked; no production learner data changed.')
}finally{await browser.close()}
