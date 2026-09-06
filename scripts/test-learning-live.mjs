import assert from 'node:assert/strict'
import {loadEnv} from 'vite'
import {chromium} from 'playwright-core'
const env=loadEnv('production',process.cwd(),'')
const base=process.env.ACADEMY_TEST_URL || 'https://www.aibylevi.com/'
const pin=process.env.ACADEMY_TEST_ADMIN_PIN || env.ADMIN_PIN
if(!pin) throw new Error('An authorized administrator credential is required')
const rpc=async (name,args)=>{
  const r=await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/rpc/${name}`,{method:'POST',headers:{apikey:env.VITE_SUPABASE_ANON_KEY,'Content-Type':'application/json'},body:JSON.stringify(args),signal:AbortSignal.timeout(20000)})
  if(!r.ok) throw new Error(`${name}: HTTP ${r.status}`)
  const text=await r.text();return text?JSON.parse(text):null
}
let admin,learner,browser
try {
  admin=await rpc('academy_sign_in_code',{access_code:pin});assert.equal(admin.profile?.role,'admin')
  learner=await rpc('academy_admin_issue_learner',{session_token:admin.token,learner:{name:`QA learning release ${Date.now()}`,locale:'es',goal:'Temporary release verification'}})
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'})
  const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'})
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message))
  const login=async(code)=>{await page.locator('.st-access-form input').fill(code);await page.locator('.st-access-form button[type=submit]').click();await page.locator('.st-header').waitFor({timeout:60000})}
  await page.goto(base+'#/herramienta/codex/lecciones-herramienta/05');await login(learner.pin)
  await page.getByRole('heading',{name:'Construir la primera versión completa',exact:true}).waitFor({timeout:60000})
  await page.getByRole('button',{name:'Guardar en mi proyecto',exact:true}).click()
  await page.getByRole('button',{name:'Marcar lección completada',exact:true}).click()
  await page.waitForTimeout(2000)
  await page.getByRole('button',{name:/^(Salir|Exit)$/}).click();await login(learner.pin)
  await page.getByRole('button',{name:'Completada · deshacer',exact:true}).waitFor({timeout:60000})
  await page.goto(base+'#/mi-proyecto');await page.locator('.st-saved-resources li').waitFor({timeout:60000})
  assert.match(await page.locator('.st-saved-resources').innerText(),/Construir la primera versión/)
  await page.goto(base+'#/leccion/fases-de-la-formacion');await page.locator('.st-phase-guide h1').waitFor();assert.doesNotMatch(await page.locator('.st-phase-guide').innerText(),/\.\.\//)
  for(const asset of ['tools/codex.zip','automations/classify.n8n.json']) { const response=await context.request.get(base+'project-assets/'+asset);assert.equal(response.status(),200,'Authenticated material '+asset) }
  await page.goto(base+'#/curso/que-es-la-ia');await page.locator('.st-task-prompt pre').waitFor({timeout:60000});assert.equal(await page.locator('.st-block-seccion[open]').count(),5)
  await page.goto(base+'#/curso/n8n-01');await page.locator('.st-project-manual').waitFor({timeout:60000})
  await page.getByRole('button',{name:/^(Salir|Exit)$/}).click();await login(pin)
  await page.locator('.st-header').waitFor({timeout:60000})
  assert.equal(await page.locator('a[href="#/classes"]').count(),0)
  await page.goto(base+'#/automatizaciones');await page.locator('.st-automation-catalog > a').first().waitFor({timeout:60000})
  assert.ok(await page.locator('.st-automation-catalog > a').count()>100)
  assert.deepEqual(errors,[])
  await page.getByRole('button',{name:/^(Salir|Exit)$/}).click()
  console.log('PASS production: Codex lesson, remote bookmark and completion survive sign-out/sign-in, student phases, removed Classes, administrator automation catalog, no runtime errors. Temporary learner archived.')
} finally {
  if(browser) await browser.close()
  if(learner?.id&&admin?.token) await rpc('academy_admin_update',{session_token:admin.token,learner_id:learner.id,changes:{status:'archived'}})
  if(admin?.token) await rpc('academy_sign_out',{session_token:admin.token})
}
