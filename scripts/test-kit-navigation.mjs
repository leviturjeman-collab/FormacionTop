import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const base = process.env.ACADEMY_TEST_URL || 'http://127.0.0.1:4176/'
const live = !new URL(base).hostname.match(/^(127\.0\.0\.1|localhost)$/)
if (live && !process.env.ACADEMY_TEST_ADMIN_PIN) throw new Error('Set ACADEMY_TEST_ADMIN_PIN for the production test')
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const context = await browser.newContext({ reducedMotion: 'reduce' })
const page = await context.newPage()
const errors = []
page.on('pageerror', error => errors.push(error.message))
let signedIn = false
try {
  if (!live) {
    await context.addInitScript(() => sessionStorage.setItem('academia.session.v2', 'qa'))
    await page.route('**/rest/v1/rpc/**', route => route.fulfill({ json: { ok: true, token: 'qa', expiresAt: '2099-01-01', profile: { id: 'qa', name: 'QA', role: 'learner', level: 'intermedio', locale: 'es' }, progress: { lessons: {}, projects: [] }, state: {}, version: 0 } }))
  }
  await page.goto(new URL('#/kits', base).href)
  if (live) {
    await page.locator('.st-access-form input').fill(process.env.ACADEMY_TEST_ADMIN_PIN)
    await page.locator('.st-access-form button[type=submit]').click()
    await page.locator('.st-header').waitFor({ timeout: 60000 })
    signedIn = true
  }
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(new URL('#/kits', base).href)
    const card = page.locator('.st-kit-catalog > a').last()
    await card.waitFor({ timeout: 60000 })
    assert.equal(await page.locator('.st-kit-board').count(), 0, 'Catalog contains no hidden/default kit detail')
    const title = await card.locator('h2').innerText()
    const destination = await card.getAttribute('href')
    await card.click()
    await page.locator('.st-kit-head h1').waitFor()
    await page.waitForTimeout(200)
    assert.equal(await page.locator('.st-kit-head h1').innerText(), title)
    assert.equal(new URL(page.url()).hash, destination)
    assert.equal(await page.locator('.st-kit-catalog,.st-kit-index').count(), 0)
    assert.ok(await page.evaluate(() => window.scrollY < 2), 'Selected kit opens at the top')
    const bounds = await page.locator('.st-kit-head h1').boundingBox()
    assert.ok(bounds.y >= 0 && bounds.y + bounds.height < 900, 'Kit title is in the first screen')
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow')
    await page.reload()
    await page.locator('.st-kit-head h1').waitFor({ timeout: 60000 })
    assert.equal(await page.locator('.st-kit-head h1').innerText(), title, 'Reload keeps selected kit')
    await page.locator('.st-kit-back').click()
    await page.locator('.st-kit-catalog').waitFor()
    await page.goBack()
    await page.locator('.st-kit-head h1').waitFor()
    assert.equal(await page.locator('.st-kit-head h1').innerText(), title, 'Browser back restores exact kit')
  }
  await page.goto(new URL('#/kits/nonexistent-kit', base).href)
  await page.getByRole('heading', { name: 'Kit no encontrado' }).waitFor({ timeout: 60000 })
  assert.equal(await page.locator('.st-kit-board').count(), 0)
  assert.deepEqual(errors, [])
  console.log(`PASS kit navigation: 320/390/1440, last card opens at top, detail only, reload/back, invalid ID, no runtime errors. ${live ? 'Production' : 'Local learner session'}.`)
} finally {
  if (signedIn) await page.getByRole('button', { name: 'Salir', exact: true }).click()
  await browser.close()
}
