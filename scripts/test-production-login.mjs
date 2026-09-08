import {chromium} from 'playwright-core'
import {loadEnv} from 'vite'
import assert from 'node:assert/strict'
const env=loadEnv('production',process.cwd(),'')
const pin=process.env.ACADEMY_TEST_ADMIN_PIN||env.ADMIN_PIN
if(!pin)throw new Error('The local owner test credential is required; never print it.')
const urls=process.env.ACADEMY_TEST_URL?[process.env.ACADEMY_TEST_URL]:['https://formacion-top.vercel.app/','https://www.aibylevi.com/']
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'})
try{
 for(const base of urls){
  const context=await browser.newContext({viewport:{width:1280,height:900}})
  const page=await context.newPage()
  await page.goto(base,{waitUntil:'domcontentloaded'})
  await page.locator('.st-access-form input').fill(pin)
  await page.locator('.st-access-form button[type=submit]').click()
  await page.locator('.st-header').waitFor({timeout:45000})
  const cookie=(await context.cookies()).find(c=>c.name==='__Host-academia-session')
  assert.ok(cookie?.httpOnly,'Login installs the protected content session')
  await page.goto(base+'#/curso/que-es-la-ia',{waitUntil:'domcontentloaded'})
  await page.locator('.st-curso-why').waitFor({timeout:30000})
  assert.match(await page.locator('.st-curso-why').innerText(),/Marta/)
  await page.getByRole('button',{name:/^(Salir|Sign out)$/}).click()
  await page.locator('.st-access-form input').waitFor({timeout:15000})
  console.log('PASS published login, protected lesson and logout: '+base)
  await context.close()
 }
}finally{await browser.close()}
