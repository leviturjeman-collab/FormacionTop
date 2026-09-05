import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
import { loadEnv } from 'vite'
import fs from 'node:fs/promises'
const env = loadEnv('production', process.cwd(), '')
const pin = process.env.ACADEMY_TEST_ADMIN_PIN
if (!pin) throw new Error('Set ACADEMY_TEST_ADMIN_PIN')
const base = process.env.ACADEMY_TEST_URL || 'http://127.0.0.1:4176/'
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
const page = await context.newPage()
const errors = [], checks = []
page.on('pageerror', error => errors.push(error.message))
let token, learnerId, studentToken
const name = `QA interfaz ${Date.now()}`
async function rpc(method, args) {
  const response = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/rpc/${method}`, { method: 'POST', headers: { apikey: env.VITE_SUPABASE_ANON_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(args) })
  if (!response.ok) throw new Error(`RPC ${method} failed: ${response.status}`)
  return response.status === 204 ? null : response.json()
}
try {
  await page.goto(base)
  await page.locator('.st-access-form input').fill(pin)
  await page.locator('.st-access-form button[type=submit]').click()
  await page.locator('.st-header').waitFor({ timeout: 45000 })
  token = await page.evaluate(() => sessionStorage.getItem('academia.session.v2'))
  checks.push('Professor enters with PIN only')
  await page.goto(new URL('#/admin', base).href)
  await page.getByLabel('Nombre', { exact: true }).fill(name)
  await page.getByRole('button', { name: 'Crear alumno y código', exact: true }).click()
  const issued = page.getByLabel('Clave inicial', { exact: true })
  await issued.waitFor({ timeout: 20000 })
  const studentPin = await issued.inputValue()
  assert.match(studentPin, /^\d{12}$/)
  const learners = await rpc('academy_admin_learners', { session_token: token })
  learnerId = learners.find(l => l.name === name)?.id
  assert.ok(learnerId)
  checks.push('Create learner in UI generates numeric PIN on server')
  await page.getByRole('button', { name: 'Ya la he entregado: ocultar', exact: true }).click()
  await page.getByRole('button', { name: `Ver PIN de ${name}`, exact: true }).click()
  await issued.waitFor()
  assert.equal(await issued.inputValue(), studentPin)
  checks.push('Teacher reveals same PIN later from panel')
  const studentContext = await browser.newContext({ viewport: { width: 320, height: 740 }, reducedMotion: 'reduce' })
  const student = await studentContext.newPage()
  await student.goto(base)
  await student.locator('.st-access-form input').fill(studentPin)
  await student.locator('.st-access-form button[type=submit]').click()
  await student.locator('.st-header').waitFor({ timeout: 45000 })
  studentToken = await student.evaluate(() => sessionStorage.getItem('academia.session.v2'))
  assert.equal(await student.locator('a[href="#/admin"]').count(), 0)
  assert.equal(await student.getByText(/Modo profesor|Modo alumno/).count(), 0)
  checks.push('Learner has no teacher link or mode switch')
  await student.goto(new URL('#/admin', base).href)
  await student.getByRole('heading', { name: 'Acceso restringido' }).waitFor()
  assert.equal(await student.getByRole('button', { name: /Ver PIN/ }).count(), 0)
  checks.push('Direct admin URL denied to learner')
  await student.getByRole('link', { name: 'Ir a mi espacio' }).click()
  await student.locator('.st-header').waitFor()
  await student.evaluate(() => localStorage.setItem('academia.progreso.v1', JSON.stringify({ name: 'Forged', access: 'admin', teacher: true, lessons: {} })))
  await student.reload(); await student.locator('.st-header').waitFor()
  assert.equal(await student.locator('a[href="#/admin"]').count(), 0)
  checks.push('Forged local role cannot enable teacher panel')
  await studentContext.close()
  assert.deepEqual(errors, [])
  checks.push('No runtime errors during teacher flow')
} finally {
  if (token && !learnerId) { const list = await rpc('academy_admin_learners', { session_token: token }); learnerId = list.find(l => l.name === name)?.id }
  if (token && learnerId) await rpc('academy_admin_update', { session_token: token, learner_id: learnerId, changes: { status: 'archived' } })
  for (const t of [token, studentToken].filter(Boolean)) await rpc('academy_sign_out', { session_token: t })
  await browser.close()
  await fs.mkdir('audit-output', { recursive: true })
  await fs.writeFile('audit-output/access-ui-verification.json', JSON.stringify({ checkedAt: new Date().toISOString(), base, checks, testAccount: 'Archived after test' }, null, 2))
}
console.log(`PASS live access UI: ${checks.length} checks; test profile archived.`)
