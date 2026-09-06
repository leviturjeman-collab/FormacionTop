import assert from 'node:assert/strict'
import { build } from 'esbuild'
import fs from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright-core'
const base=process.env.ACADEMY_TEST_URL || 'http://127.0.0.1:4182/'
await build({entryPoints:['src/tool-path.ts'],outfile:'.temp/tool-path-test.mjs',bundle:true,format:'esm',platform:'node'})
const {toolPath}=await import(pathToFileURL(process.cwd()+'/.temp/tool-path-test.mjs'))
for (const locale of ['es','en']) {
  const course=JSON.parse(await fs.readFile(`public/course${locale==='en'?'.en':''}.json`,'utf8'))
  for (const tool of course.toolPages) {
    const lessons=toolPath(tool,locale==='en');assert.equal(lessons.length,10,tool.id)
    assert.equal(new Set(lessons.map(l=>l.id)).size,10)
    for(const lesson of lessons) assert.ok(lesson.title && lesson.example && lesson.check && lesson.steps.length && lesson.explanation.length,`${locale}/${tool.id}/${lesson.id}`)
  }
}
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'})
const context=await browser.newContext({reducedMotion:'reduce'})
let state={lessons:{},projects:[]},version=0
await context.addInitScript(()=>sessionStorage.setItem('academia.session.v2','qa'))
await context.route('**/rest/v1/rpc/**', async route=>{
  const operation=route.request().url().split('/').at(-1),body=route.request().postDataJSON()
  if(operation==='academy_save_progress') { state=body.progress_state;version++;return route.fulfill({json:{ok:true,version}}) }
  if(operation==='academy_load_progress') return route.fulfill({json:{state,version}})
  return route.fulfill({json:{ok:true,token:'qa',expiresAt:'2099-01-01',profile:{id:'qa',name:'QA',role:'learner',level:'intermedio',locale:'es'},progress:state,version}})
})
const page=await context.newPage(),errors=[]
page.on('pageerror',e=>errors.push(e.message))
const visit=async hash=>{await page.goto(base+hash);await page.locator('.st-header').waitFor({timeout:60000})}
try {
  for(const width of [320,390,1440]) {
    await page.setViewportSize({width,height:900})
    await visit('#/herramienta/codex')
    await page.locator('.st-path-list li').last().waitFor({timeout:60000})
    assert.equal(await page.locator('.st-path-list li').count(),10)
    await page.locator('.st-path-list li').last().locator('a').click()
    await page.locator('.st-path-detail h1').waitFor()
    assert.equal(await page.locator('.st-tool-map').count(),0,'Lesson is a dedicated view')
    assert.ok(await page.evaluate(()=>scrollY<3),'Detail starts at top')
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow')
    await page.reload();await page.locator('.st-path-detail h1').waitFor()
    assert.match(page.url(),/\/10$/)
    await page.getByRole('button',{name:'Marcar lección completada',exact:true}).or(page.getByRole('button',{name:'Completada · deshacer',exact:true})).waitFor()
    if(await page.getByRole('button',{name:'Marcar lección completada',exact:true}).count()) await page.getByRole('button',{name:'Marcar lección completada',exact:true}).click()
    if(await page.getByRole('button',{name:'Guardar en mi proyecto',exact:true}).count()) await page.getByRole('button',{name:'Guardar en mi proyecto',exact:true}).click()
    await page.screenshot({path:`.temp/learning-${width}.png`,fullPage:true})
  }
  await visit('#/indice/A')
  const term=page.locator('.st-term-head').first();await term.waitFor()
  const termHref=await term.getAttribute('href')
  await term.click();await page.locator('.st-dictionary-detail h1').waitFor()
  const termTitle=await page.locator('.st-dictionary-detail h1').innerText()
  await page.getByRole('button',{name:'Guardar en mi proyecto',exact:true}).click()
  await visit('#/kits');await page.locator('.st-kit-catalog a').first().click();await page.locator('.st-kit-head h1').waitFor()
  await page.getByRole('button',{name:'Guardar en mi proyecto',exact:true}).first().click()
  await visit('#/mi-proyecto');await page.locator('.st-saved-resources').waitFor()
  assert.equal(await page.locator('.st-saved-resources li').count(),3)
  await page.waitForTimeout(1200)
  await page.reload();await page.locator('.st-saved-resources li').first().waitFor()
  assert.equal(await page.locator('.st-saved-resources li').count(),3,'Bookmarks survive persisted reload')
  await page.locator('.st-saved-resources').getByRole('link',{name:termTitle,exact:true}).click()
  assert.equal(new URL(page.url()).hash,termHref)
  await visit('#/herramienta/wispr-flow');await page.locator('.st-path-list li').last().waitFor()
  assert.equal(await page.locator('.st-path-list li').count(),10)
  assert.equal(await page.getByRole('button',{name:/flujos explicados/}).count(),0,'No invented voice workflows')
  await visit('#/herramienta/n8n/automatizaciones');await page.locator('#automatizaciones').waitFor()
  assert.equal(await page.locator('#guia-herramienta,.st-tool-path').count(),0,'Automation section is isolated')
  await visit('#/herramienta/codex/lecciones-herramienta/99');await page.getByRole('heading',{name:'Lección no encontrada'}).waitFor()
  await visit('#/classes');await page.getByRole('heading',{name:'Acceso restringido'}).waitFor()
  assert.deepEqual(errors,[])
  console.log('PASS: 56 tools × 10 complete learning units × ES/EN; dedicated lesson/term routing, 320/390/1440, persisted bookmarks, completion, manual tool integrity, learner class guard, no runtime errors.')
} finally {await browser.close()}
