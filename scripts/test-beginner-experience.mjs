import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import vm from 'node:vm'
import { chromium } from 'playwright-core'
import { newKitCases } from './lib/kit-classroom-cases.mjs'

const changedExamples={ 'biblioteca-prestamos':{returned:true}, 'prestamo-material':{available:5}, 'reservas-aulas':{start:'12:00',end:'13:00'}, 'avisos-mantenimiento':{safetyRisk:true}, 'turnos-voluntariado':{confirmed:4}, 'rutas-transporte':{seats:30}, 'tutorias-seguimiento':{preferredTime:'10:00'}, 'documentos-accesibles':{imageDescriptions:true}, 'compras-material':{budget:100}, 'salidas-educativas':{permissionsComplete:true}, 'ayudas-documentos':{proofAttached:true}, 'encuestas-mejora':{rating:5}, 'archivo-fotografico':{usageChecked:true}, 'huerto-comunitario':{checkedToday:true,wateringNeeded:false}, 'objetos-perdidos':{ownershipChecked:true} }

// Execute the actual published practice code, including invalid and repeated inputs.
for (const en of [false,true]) for (const [id] of newKitCases) {
  const kit=JSON.parse(await fs.readFile(`content/kits/${id}${en?'.en':''}.json`,'utf8'))
  const nodes=kit.workflows[0].flow.nodes
  let items=[]
  const run=(node,data)=>vm.runInNewContext(`(function(){${node.parameters.jsCode}})()`,{$input:{all:()=>data}})
  for (const node of nodes.slice(1)) items=run(node,items)
  assert.equal(items.length,1,id)
  assert.equal(items[0].json.result,id==='avisos-mantenimiento'?'ready':'review',id+' original decision')
  assert.equal(items[0].json.approved,false,id)
  assert.equal(items[0].json.savedExternally,false,id)
  const sample=run(nodes[1],[])
  let changed=[{json:{...sample[0].json,...changedExamples[id]}}]
  for (const node of nodes.slice(2)) changed=run(node,changed)
  assert.equal(changed[0].json.result,id==='biblioteca-prestamos'?'closed':id==='avisos-mantenimiento'?'review':'ready',id+' changed decision')
  assert.throws(()=>run(nodes[2],[{json:{...sample[0].json,id:''}}]),/Missing id/)
  assert.throws(()=>run(nodes[2],[sample[0],sample[0]]),/Repeated id/)
  const missing={...sample[0].json}; delete missing[Object.keys(missing)[1]]
  assert.throws(()=>run(nodes[2],[{json:missing}]),/Missing field/)
}

const base=process.env.ACADEMY_TEST_URL || 'http://127.0.0.1:4182/'
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'})
const errors=[],resources=[]
try {
 for (const locale of ['es','en']) {
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'})
  let state={lessons:{},projects:[]},version=0
  await context.addInitScript(()=>sessionStorage.setItem('academia.session.v2','qa'))
  await context.route('**/rest/v1/rpc/**',async route=>{
   const op=route.request().url().split('/').at(-1),body=route.request().postDataJSON()
   if(op==='academy_save_progress'){state=body.progress_state;version++;return route.fulfill({json:{ok:true,version}})}
   if(op==='academy_load_progress')return route.fulfill({json:{state,version}})
   return route.fulfill({json:{ok:true,token:'qa',expiresAt:'2099-01-01',profile:{id:'qa',name:'QA',role:'learner',level:'basico',locale},progress:state,version}})
  })
  const page=await context.newPage()
  page.on('pageerror',e=>errors.push(e.message))
  page.on('request',r=>{if(r.url().includes('/course-data/'))resources.push(r.url())})
  await page.goto(base+'#/curso/que-es-la-ia')
  const task=page.locator('.st-task-list > li').first(), toggle=task.locator('.st-task-toggle')
  await toggle.waitFor({timeout:60000})
  assert.equal(await toggle.getAttribute('aria-expanded'),'true')
  assert.ok(await task.locator('.st-step-guide p').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize)>=16),'Readable task text')
  assert.match(await task.innerText(),locale==='en'?/notes app/:/aplicación de notas/)
  await task.locator('.st-task-ok').click()
  await page.waitForTimeout(350)
  assert.equal(await toggle.getAttribute('aria-expanded'),'false','Done closes task')
  assert.ok(await task.locator('.st-task-fold').evaluate(el=>el.getBoundingClientRect().height<2))
  assert.equal(await toggle.evaluate(el=>el===document.activeElement),true,'Focus returns to visible button')
  await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true','Completed task can reopen')
  await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'false','Manual close works')
  await task.locator('.st-task-tick').click();assert.equal(await toggle.getAttribute('aria-expanded'),'true','Pending task reopens')
  await page.emulateMedia({reducedMotion:'reduce'})
  assert.ok(await task.locator('.st-task-fold').evaluate(el=>parseFloat(getComputedStyle(el).transitionDuration)<0.001),'Reduced motion avoids a visible animation')
  await task.locator('.st-task-ok').click()
  await page.waitForTimeout(1300)
  await page.reload();await toggle.waitFor()
  assert.equal(await toggle.getAttribute('aria-expanded'),'false','Completion stays folded after reload')
  await toggle.click()
  await task.scrollIntoViewIfNeeded();await page.screenshot({path:`.temp/task-reopened-${locale}.png`})
  await page.goto(base+'#/kits');await page.locator('.st-kit-catalog a').last().waitFor()
  assert.equal(await page.locator('.st-kit-catalog a').count(),35)
  await page.goto(base+'#/kits/prestamo-material');await page.locator('#project-build').waitFor()
  assert.ok(await page.locator('.st-learning-flow').count() || await page.locator('.st-project-manual').count())
  assert.match(await page.locator('#project-brief').innerText(),locale==='en'?/Three laptops/:/tres portátiles/)
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Kit fits mobile')
  await page.locator('.st-learning-flow-track').scrollIntoViewIfNeeded();await page.screenshot({path:`.temp/kit-beginner-${locale}.png`})
  const downloadPromise=page.waitForEvent('download')
  await page.locator('#project-files .st-project-step').last().getByRole('button',{name:locale==='en'?'Download file':'Descargar archivo',exact:true}).click()
  const download=await downloadPromise
  assert.equal(download.suggestedFilename(),'prestamo-material.n8n.json')
  await page.goto(base+'#/automatizaciones');await page.locator('.st-automation-catalog > a').first().waitFor()
  assert.ok(await page.locator('.st-automation-catalog > a').count()>=146)
  await page.locator('.st-automation-filters select').selectOption('n8n')
  await page.locator('.st-automation-catalog > a').first().click()
  await page.locator('#project-build').waitFor()
  const stableHash=new URL(page.url()).hash
  assert.match(stableHash,/n8n-01$/)
  await page.locator('.st-lang-switch button').filter({hasText:locale==='es'?/^EN$/:/^ES$/}).filter({visible:true}).first().click()
  await page.locator('#project-build').waitFor()
  await page.locator('.st-project-manual[lang="'+(locale==='es'?'en':'es')+'"]').waitFor()
  assert.equal(new URL(page.url()).hash,stableHash,'Automation link survives changing language')
  await context.close()
 }
 assert.deepEqual(errors,[])
 assert.ok(!resources.some(url=>/\/(tools|kits)\.json$/.test(url)),'Lists never load every full tool or kit')
 assert.ok(resources.some(url=>url.includes('/curso/que-es-la-ia.json')))
 await fs.writeFile('.temp/beginner-ui-report.json',JSON.stringify({resources,errors},null,2))
 console.log('PASS: 30 bilingual kit labs, missing/repeated data, 35 kits, task animation/reopen/persistence/focus/reduced motion, mobile layout, actual JSON download and lightweight list requests.')
} finally {await browser.close()}
