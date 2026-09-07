import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {execFileSync} from 'node:child_process'
import {chromium} from 'playwright-core'
const base=process.env.ACADEMY_TEST_URL||'http://127.0.0.1:4182/'
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'})
await fs.mkdir('.temp/practice-downloads',{recursive:true})
try{
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'})
 let state={lessons:{},projects:[]},version=0
 await context.addInitScript(()=>sessionStorage.setItem('academia.session.v2','qa'))
 await context.route('**/rest/v1/rpc/**',route=>{
  const op=route.request().url().split('/').at(-1),body=route.request().postDataJSON()
  if(op==='academy_save_progress'){state=body.progress_state;return route.fulfill({json:{ok:true,version:++version}})}
  if(op==='academy_load_progress')return route.fulfill({json:{state,version}})
  return route.fulfill({json:{ok:true,token:'qa',expiresAt:'2099-01-01',profile:{id:'qa',name:'QA',role:'learner',level:'intermedio',locale:'es'},progress:state,version}})
 })
 const page=await context.newPage(),requests=[],errors=[]
 page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message))
 for(const locale of ['es','en'])for(const id of ['openai','sheets','canva','codex','n8n']){
  const start=requests.length
  await page.goto(base+`#/herramienta/${id}/lecciones-herramienta/01`)
  await page.locator('#project-build').waitFor()
  if(!await page.locator(`.st-project-manual[lang="${locale}"]`).count()){
   await page.locator('.st-lang-switch button').filter({hasText:locale==='en'?/^EN$/:/^ES$/}).filter({visible:true}).first().click()
   await page.locator(`.st-project-manual[lang="${locale}"]`).waitFor()
  }
  assert.ok(requests.slice(start).some(url=>url.includes(`/tool-lessons/${id}-01.json`)),'Only the selected lesson is requested')
  assert.ok(!requests.slice(start).some(url=>/\/tool-path\.(ts|js)/.test(url)),'Authored lessons do not load the legacy curriculum module')
  const wait=page.waitForEvent('download')
  await page.getByRole('button',{name:locale==='en'?'Download this practice':'Descargar esta práctica',exact:true}).click()
  const download=await wait;await download.saveAs(`.temp/practice-downloads/${id}-${locale}.zip`)
  assert.match(download.suggestedFilename(),/^(practice-materials|materiales-practica)\.zip$/)
  const complete=page.getByRole('button',{name:locale==='en'?'Mark lesson completed':'Marcar lección completada',exact:true})
  if(await complete.count())await complete.click()
  await page.locator('.st-completion-result').waitFor()
  assert.ok((await page.locator('.st-completion-result a').getAttribute('href')).endsWith('/02'))
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
  if(id==='sheets'&&locale==='es')await page.locator('.st-worked-example').screenshot({path:'.temp/sheets-worked-example.png'})
 }
 await page.locator('.st-visual-guide summary').click()
 await page.waitForFunction(()=>{const img=document.querySelector('.st-visual-guide img');return img?.complete&&img.naturalWidth>0},{},{timeout:30000})
 await page.locator('.st-visual-guide').screenshot({path:'.temp/n8n-official-visual.png'})
 await page.goto(base+'#/herramienta/codex/lecciones-herramienta/02');await page.locator('#project-build').waitFor()
 // A missing protected file must show a recoverable error, never produce a partial ZIP.
 await page.route('**/project-assets/tools/codex*.zip',route=>route.fulfill({status:401,body:'Unauthorized'}))
 await page.getByRole('button',{name:'Download this practice',exact:true}).click()
 await page.locator('.st-practice-download [role="status"]').filter({hasText:'could not be prepared'}).waitFor()
 await page.unroute('**/project-assets/tools/codex*.zip')
 const nested=page.waitForEvent('download');await page.getByRole('button',{name:'Download this practice',exact:true}).click();await(await nested).saveAs('.temp/practice-downloads/codex-full.zip')
 assert.deepEqual(errors,[])
 assert.ok(!requests.some(url=>/\/(tools|kits)\.json$/.test(url)))
 execFileSync('py',['-3.12','-c',`import pathlib,zipfile,io,csv,json
for p in pathlib.Path('.temp/practice-downloads').glob('*.zip'):
 with zipfile.ZipFile(p) as z:
  assert z.testzip() is None
  assert any(n in z.namelist() for n in ['START-HERE.txt','EMPIEZA-AQUI.txt'])
  for name in z.namelist():
   assert '/' not in name and '\\\\' not in name
  if p.name.startswith('sheets-'):
   rows=list(csv.reader(io.StringIO(z.read('requests.csv').decode('utf-8'))));assert len(rows)==4
   assert [r[0] for r in rows[1:]]==['Ana','Luis','Marta']
  if p.name.startswith('n8n-'):
   workflow=json.loads(z.read('first-workflow.n8n.json'));assert len(workflow['nodes'])==2
   assert workflow['active']==False
   assert workflow['nodes'][1]['parameters']['assignments']['assignments'][0]['value']=='Ana'
  if p.name=='codex-full.zip':
   inner=next(n for n in z.namelist() if n.endswith('.zip'))
   with zipfile.ZipFile(io.BytesIO(z.read(inner))) as full:assert full.testzip() is None and 'server.mjs' in full.namelist()
`],{stdio:'inherit'})
 console.log('PASS: five ES/EN practices, actual UTF-8 ZIP contents and nested code package, recoverable download failure, outcome/next-step completion, single lesson loading, mobile layout, no runtime errors. No provider executions or human sessions claimed.')
}finally{await browser.close()}
