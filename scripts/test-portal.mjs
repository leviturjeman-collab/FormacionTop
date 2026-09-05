import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createServer } from 'vite'
import { chromium } from 'playwright-core'
import { unzipSync } from 'fflate'

// Complete application against a deterministic RPC double. SQL authorization is
// exercised separately by test-auth; no test sends data to an external service.
const course = JSON.parse(await fs.readFile('public/course.json', 'utf8'))
const server = await createServer({ server: { host: '127.0.0.1', port: 0 }, define: { 'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://academy-test.invalid'), 'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('test-public-key') } })
await server.listen()
const base = server.resolvedUrls.local[0]
const executablePath = process.env.CHROME_PATH || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined)
const browser = await chromium.launch({ ...(executablePath ? { executablePath } : {}), headless: true })
let checks = 0
const check = (condition, message) => { assert.ok(condition, message); checks++ }
try {
  const context = await browser.newContext({ acceptDownloads: true })
  let saved = { lessons: {}, projects: [] }, version = 0
  const verified = () => ({ ok: true, token: 'a'.repeat(64), expiresAt: new Date(Date.now() + 3600000).toISOString(), profile: { id: 'portal-test', name: 'Portal Test', role: 'learner', level: 'intermedio', locale: 'es' }, progress: saved, version })
  await context.route('**/*', route => {
    const url = new URL(route.request().url())
    if (url.origin === new URL(base).origin) return route.continue()
    if (url.pathname.includes('/rest/v1/rpc/')) {
      const action = url.pathname.split('/').pop()
      if (action === 'academy_save_progress') { saved = route.request().postDataJSON().progress_state; version++; return route.fulfill({ json: { ok: true, version } }) }
      if (action === 'academy_load_progress') return route.fulfill({ json: { state: saved, version } })
      if (action?.includes('question')) return route.fulfill({ json: [] })
      return route.fulfill({ json: verified() })
    }
    return route.abort()
  })
  const page = await context.newPage()
  const errors = []; page.on('pageerror', error => errors.push(error.message))
  let contentRequests = 0; page.on('request', request => { if (request.url().includes('/course-data/')) contentRequests++ })
  await page.goto(base + '#/deck/' + course.decks[0].id)
  await page.locator('input[type="password"]').waitFor()
  check(contentRequests === 0, 'Guest deep link must not fetch protected content')
  await page.locator('input[type="password"]').fill('test-secret')
  await page.locator('button[type="submit"]').click()
  await page.locator('.st-deck').waitFor()
  check(!await page.getByText('Notas', { exact: true }).isVisible(), 'Learner cannot activate teacher notes')
  const visit = async hash => { await page.goto(base + hash); await page.waitForFunction(() => Boolean(document.querySelector('main h1,.st-deck h1,.st-page h1'))); await page.waitForTimeout(60); check(!await page.getByText('Algo ha fallado', { exact: true }).count(), hash + ' rendered without boundary'); }
  const routes = ['#/', '#/mi-proyecto', '#/ruta', '#/curso', '#/biblioteca', '#/herramientas', '#/kits', '#/agentes', '#/prompts', '#/preguntas', '#/indice', '#/progreso', '#/buscar?q=datos'];
  for (const route of routes) await visit(route)
  if (process.env.PORTAL_EXHAUSTIVE === '1') {
    const matrix = [
      ...course.lessons.flatMap(l => ['basico', 'intermedio', 'avanzado'].map(level => '#/leccion/' + encodeURIComponent(l.slug) + '?n=' + level)),
      ...course.toolPages.map(t => '#/herramienta/' + t.id),
      ...course.curso.map(l => '#/curso/' + l.id),
      ...course.projects.map(p => '#/proyecto/' + p.stageId),
      ...course.guides.map(g => '#/guia/' + g.id),
      ...course.agents.map(a => '#/agentes/' + a.id),
      ...course.decks.map(d => '#/deck/' + d.id),
      ...course.kits.flatMap(k => ['resumen', 'arranque', 'arquitectura', 'fases', 'prompts', 'flujo', 'pruebas', 'coste', 'entrega', 'recursos'].map(tab => '#/kits/' + k.id + '?tab=' + tab)),
    ]
    for (const [index, route] of matrix.entries()) { await visit(route); if (index % 100 === 0) console.log(`Portal matrix ${index}/${matrix.length}`) }
    console.log(`PASS exhaustive matrix: ${matrix.length} route/level/tab variants`)
  }
  await visit('#/%E0%A4%A')
  check((await page.locator('main').innerText()).includes('encontr'), 'Malformed URI has a recoverable not-found page')
  await visit('#/kits/no-existe')
  check((await page.locator('main').innerText()).includes('no está disponible'), 'Unknown kit does not silently open another kit')
  const family = course.prompts.find(f => f.prompts.length > 12)
  const prompt = family.prompts[13]
  await visit('#/prompts/' + encodeURIComponent(family.id) + '?prompt=' + encodeURIComponent(prompt.id || prompt.name))
  await page.getByRole('dialog').waitFor()
  check(await page.getByRole('dialog').getByText(prompt.name, { exact: true }).count() > 0, 'Deep prompt beyond initial page opens')
  await page.keyboard.press('Tab')
  check(await page.evaluate(() => document.activeElement.closest('[role="dialog"]') !== null), 'Modal contains keyboard focus')
  await page.keyboard.press('Escape')
  check(await page.getByRole('dialog').count() === 0, 'Escape closes modal')
  await visit('#/kits/' + course.kits[0].id + '?tab=flujo')
  check(page.url().includes('tab=flujo'), 'Kit tab has a shareable URL')
  await visit('#/kits/' + course.kits[0].id)
  const downloadButton = page.getByRole('button', { name: /Descargar.*kit|Descargar.*paquete/i }).first()
  if (await downloadButton.count()) {
    const pending = page.waitForEvent('download'); await downloadButton.click(); const download = await pending
    const archive = unzipSync(await fs.readFile(await download.path()))
    check(Object.keys(archive).some(name => name.endsWith('.json')), 'Kit ZIP contains executable resources')
  } else throw new Error('Kit package download missing')
  await context.setOffline(true)
  await context.setOffline(false)
  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of ['#/', '#/mi-proyecto', '#/curso', '#/kits', '#/prompts', '#/progreso']) {
    await visit(route)
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), 'No mobile document overflow ' + route)
  }
  if (process.env.PORTAL_SCREENSHOT_DIR) {
    await fs.mkdir(process.env.PORTAL_SCREENSHOT_DIR, { recursive: true })
    await visit('#/curso'); await page.screenshot({ path: path.join(process.env.PORTAL_SCREENSHOT_DIR, 'programa-mobile-after.png'), fullPage: true })
    await page.setViewportSize({ width: 1440, height: 1000 }); await visit('#/mi-proyecto'); await page.screenshot({ path: path.join(process.env.PORTAL_SCREENSHOT_DIR, 'proyecto-desktop-after.png'), fullPage: true })
  }
  check(errors.length === 0, 'No browser errors: ' + errors.join('; '))
  const manifestBytes = (await fs.stat('public/course-data/es/index.json')).size
  check(manifestBytes < (await fs.stat('public/course.json')).size / 2, 'Initial content is less than half of legacy full payload')
  console.log(`PASS portal: ${checks} checks; auth gate, menus, modal, ZIP and mobile. Initial index ${manifestBytes} bytes.`)
} finally { await browser.close(); await server.close() }
