import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { build } from 'esbuild'
import { chromium } from 'playwright-core'
import { cleanEditorialBlocks, classifySource, substantiveWords } from './lib/editorial.mjs'
import { extract } from './lib/extract.mjs'
import { buildLevels } from './lib/levels.mjs'
import { analyzeSections } from './lib/sections.mjs'

const root = process.cwd()
const sourceBlocks = [{ kind: 'seccion', from: 'vault', parts: [{ type: 'p', text: 'Su funcion es desarrollar el tema Ejemplo dentro de la academia.' }, { type: 'p', text: 'El importe debe ser positivo antes de escribir el registro.' }, { type: 'code', code: 'console.log(1)' }, { type: 'table', table: { rows: [['Campo', 'Valor']] } }] }]
const cleaned = cleanEditorialBlocks(sourceBlocks)
assert.equal(cleaned[0].parts.length, 3)
assert.equal(cleaned[0].parts[1].code, 'console.log(1)')
assert.equal(classifySource({ steps: [], sections: [], code: [], commands: [] }, 5000).format, 'ficha')
assert.equal(classifySource({ steps: [], sections: [] }, 10, 1).format, 'leccion')
const rubricSignal = extract(await fs.readFile('02_METODO_DE_ENSENANZA/Rubricas_y_evaluacion.md', 'utf8'), '02_METODO_DE_ENSENANZA/Rubricas_y_evaluacion.md')
rubricSignal.analysis = analyzeSections(rubricSignal.sections)
const referenceLevels = buildLevels(rubricSignal, 'calidad').levels
assert.ok(!JSON.stringify(referenceLevels).includes('Su funcion es desarrollar el tema'))
assert.equal(classifySource(rubricSignal, substantiveWords(referenceLevels.intermedio.blocks)).format, 'ficha')
const source = await fs.readFile('src/project-workspace.ts', 'utf8')
const helper = await build({ stdin: { contents: source, loader: 'ts' }, write: false, format: 'esm' })
const { taskKey, impactSummary, emptyWorkspace, assessProject, rubric } = await import('data:text/javascript;base64,' + Buffer.from(helper.outputFiles[0].text).toString('base64'))
const original = { title: 'Check duplicate', action: 'Send twice', expect: 'One row' }
assert.equal(taskKey(original), taskKey({ ...original }))
assert.notEqual(taskKey(original), taskKey({ ...original, expect: 'Two rows' }))
assert.equal(taskKey({ ...original, id: 'stable' }), 'stable')
const impact = { ...emptyWorkspace().impact, baselineMinutes: 10, afterMinutes: 4, weeklyRuns: 20, hourlyValue: 30, weeklyCost: 10 }
assert.deepEqual(impactSummary(impact), { weeklyMinutes: 120, weeklyNet: 50 })
assert.equal(impactSummary({ ...impact, afterMinutes: 15 }).weeklyMinutes, -100)
const fullAssessment = { scores: Object.fromEntries(rubric.map(item => [item.id, 2])), blockers: [], rationale: 'Evidence v1', version: 'v1', reviewer: 'Self', date: '2026-09-05' }
assert.deepEqual(assessProject(fullAssessment), { score: 100, status: 'candidate' })
assert.equal(assessProject({ ...fullAssessment, blockers: ['duplicates'] }).status, 'blocked')
assert.equal(assessProject({ ...fullAssessment, version: '' }).status, 'incomplete')

const deckFiles = (await fs.readdir('content/decks')).filter(name => name.endsWith('.json') && !name.endsWith('.en.json'))
const lessons = (await fs.readdir('content/lecciones')).filter(name => name.endsWith('.json') && !name.endsWith('.en.json'))
const course = JSON.parse(await fs.readFile('public/course.json', 'utf8'))
course.decks = await Promise.all(deckFiles.map(name => fs.readFile(path.join('content/decks', name), 'utf8').then(JSON.parse)))
course.curso = await Promise.all(lessons.map(name => fs.readFile(path.join('content/lecciones', name), 'utf8').then(JSON.parse)))
course.projects = await Promise.all((await fs.readdir('content/projects')).filter(name => name.endsWith('.json') && !name.endsWith('.en.json')).map(name => fs.readFile(path.join('content/projects', name), 'utf8').then(JSON.parse)))
for (const project of course.projects) { const translated = JSON.parse(await fs.readFile(`content/projects/${project.stageId}.en.json`, 'utf8')); assert.deepEqual(project.steps.map(t => t.id), translated.steps.map(t => t.id)); assert.ok(project.steps.every(t => t.id)) }
for (const lesson of course.curso) {
  assert.equal(new Set(lesson.tasks.map(task => task.id)).size, lesson.tasks.length, `Task IDs ${lesson.id}`)
  assert.ok(lesson.tasks.every(task => task.id), `Missing task ID ${lesson.id}`)
  const translated = JSON.parse(await fs.readFile(`content/lecciones/${lesson.id}.en.json`, 'utf8'))
  assert.deepEqual(translated.tasks.map(t => t.id), lesson.tasks.map(t => t.id), `Locale IDs ${lesson.id}`)
}
for (const stage of course.stages) { const deck = course.decks.find(d => d.id === 'programa-' + stage.id); assert.ok(deck, `Missing program deck ${stage.id}`); assert.ok(deck.lessonIds.every(id => course.curso.some(lesson => lesson.id === id))); }
assert.deepEqual(['datos', 'seguridad', 'calidad', 'entrega'].map(stage => course.curso.some(l => !l.tool && l.stageId === stage)), [true, true, true, true])

// Isolated component harness. It creates only a local test identity and never calls a real authentication or automation service.
const entry = `import React from 'react'; import {createRoot} from 'react-dom/client';
import {CourseContext} from './src/course'; import {store} from './src/store';
import MiProyecto from './src/pages/MiProyecto'; import Proyecto from './src/pages/Proyecto';
import {CursoLeccion,CursoIndice} from './src/pages/Curso'; import Progreso from './src/pages/Progreso'; import Preguntas from './src/pages/Preguntas'; import Deck from './src/pages/Deck';
store.enter({id:'pedagogy-test',name:'Test',access:'learner',locale:'es'});
if(!store.get().projects.length) store.createProject('Pilot');
window.testStore=store; const root=createRoot(document.getElementById('root'));
const course=await fetch('/course.json').then(r=>r.json());
window.show=(name='project')=>{let page=name==='faq'?React.createElement(Preguntas):name==='deck'?React.createElement(Deck,{deckId:'programa-datos'}):name==='area'?React.createElement(Proyecto,{stageId:'automatizacion'}):name==='lesson'?React.createElement(CursoLeccion,{lessonId:'datos-del-proyecto'}):name==='program'?React.createElement(CursoIndice):name==='progress'?React.createElement(Progreso):React.createElement(MiProyecto);root.render(React.createElement(CourseContext.Provider,{value:course},React.createElement(React.Fragment,{key:name},page)))};window.show();`
const bundle = await build({ stdin: { contents: entry, resolveDir: root, loader: 'tsx' }, bundle: true, write: false, format: 'esm', jsx: 'automatic', plugins: [{ name: 'test-session', setup(build) { build.onResolve({ filter: /session$/ }, args => ({ path: args.path, namespace: 'test-session' })); build.onLoad({ filter: /.*/, namespace: 'test-session' }, () => ({ contents: `export const useSession=()=>({status:'authenticated',profile:{role:'learner'}});const tickets=[];export async function learnerRpc(action,payload={}) { window.supportCalls=window.supportCalls||[];window.supportCalls.push(action);if(action==='academy_support_create'){const item={...payload.request,id:'ticket-'+tickets.length,status:'open',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};tickets.push(item);return {id:item.id,status:item.status}}return tickets;}` })); } }], define: { 'import.meta.env.BASE_URL': '"/"' } })
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined), headless: true })
try {
  const context = await browser.newContext()
  await context.route('**/*', route => {
    const pathname = new URL(route.request().url()).pathname
    return route.fulfill({ contentType: pathname === '/harness.js' ? 'text/javascript' : pathname === '/course.json' ? 'application/json' : 'text/html', body: pathname === '/harness.js' ? bundle.outputFiles[0].text : pathname === '/course.json' ? JSON.stringify(course) : '<!doctype html><html><body><div id="root"></div><script type="module" src="/harness.js"></script></body></html>' })
  })
  const page = await context.newPage()
  const errors = []; page.on('pageerror', error => { errors.push(error.message); console.error('Browser:', error.message) })
  await page.goto('http://127.0.0.1:5184')
  await page.getByRole('heading', { name: 'Construcción, evidencias e impacto' }).waitFor()
  await page.getByLabel('Título', { exact: true }).fill('Demo verificada')
  await page.getByLabel('Resultado o evidencia', { exact: true }).fill('Caso pedido-17: una fila tras dos envíos')
  await page.getByRole('button', { name: 'Guardar entregable', exact: true }).click()
  await page.reload()
  await page.getByText('Caso pedido-17: una fila tras dos envíos', { exact: true }).waitFor()
  assert.equal(await page.evaluate(() => window.testStore.get().project.workspace.artifacts.length), 1)
  await page.locator('summary').filter({ hasText: 'Registro de pruebas' }).click()
  await page.getByLabel('Resultado esperado', { exact: true }).fill('Una fila')
  await page.getByLabel('Resultado observado y evidencia', { exact: true }).fill('Una fila, ejecución 17')
  await page.getByLabel('He comprobado que cumple', { exact: true }).check()
  await page.getByRole('button', { name: 'Registrar prueba', exact: true }).click()
  await page.locator('summary').filter({ hasText: 'Feedback y nuevas revisiones' }).click()
  await page.getByLabel('Entregable', { exact: false }).selectOption({ label: 'Demo verificada' })
  await page.getByLabel('Autor de la revisión', { exact: true }).fill('Revisor de prueba')
  await page.getByLabel('Feedback y siguiente acción', { exact: true }).fill('Repetir con entrada inválida antes de entregar')
  await page.getByRole('button', { name: 'Registrar revisión', exact: true }).click()
  assert.equal(await page.evaluate(() => window.testStore.get().project.workspace.tests[0].passed), true)
  assert.equal(await page.evaluate(() => window.testStore.get().project.workspace.reviews[0].status), 'changes_requested')
  await page.locator('summary').filter({ hasText: 'Impacto y operación' }).click()
  await page.getByLabel('Minutos manuales por tarea', { exact: true }).fill('10')
  await page.getByLabel('Minutos por tarea con el sistema y revisión', { exact: true }).fill('4')
  await page.getByLabel('Tareas por semana', { exact: true }).fill('20')
  assert.equal(await page.evaluate(() => window.testStore.get().project.workspace.impact.weeklyRuns), 20)
  await page.locator('summary').filter({ hasText: 'Autoevaluación del capstone' }).click()
  await page.getByLabel('Versión evaluada', { exact: true }).fill('v1')
  await page.getByLabel('Registrado por / revisor', { exact: true }).fill('Alumno de prueba')
  await page.getByLabel('Fecha de revisión', { exact: true }).fill('2026-09-05')
  await page.getByLabel('Evidencias, decisiones y cambios necesarios', { exact: true }).fill('Casos registrados, revisión externa pendiente')
  for (const select of await page.getByLabel('Nivel observado').all()) await select.selectOption('2')
  await page.getByLabel('Efectos duplicados', { exact: true }).check()
  await page.getByText('Requiere reparación: quedan bloqueos críticos.', { exact: false }).waitFor()
  await page.getByLabel('Efectos duplicados', { exact: true }).uncheck()
  await page.getByText('Candidato a entrega; falta la aceptación de la persona responsable.', { exact: false }).waitFor()
  await page.evaluate(() => window.testStore.setLocale('en'))
  await page.getByRole('heading', { name: 'Build, evidence and impact', exact: true }).waitFor()
  await page.getByLabel('Reviewer', { exact: true }).waitFor()
  await page.evaluate(() => window.testStore.setLocale('es'))
  await page.getByRole('button', { name: 'Crear otro proyecto' }).click()
  assert.equal(await page.evaluate(() => window.testStore.get().projects.length), 2)
  assert.equal(await page.getByText('Caso pedido-17: una fila tras dos envíos', { exact: true }).count(), 0)
  await page.getByLabel('Proyecto activo').selectOption({ label: 'Pilot' })
  await page.getByText('Caso pedido-17: una fila tras dos envíos', { exact: true }).waitFor()
  await page.evaluate(() => window.show('lesson'))
  const completion = page.getByRole('button', { name: 'Marcar lección completada', exact: true })
  await completion.waitFor(); assert.equal(await completion.isDisabled(), true)
  while (await page.getByRole('button', { name: 'Marcar como hecha', exact: true }).count()) await page.getByRole('button', { name: 'Marcar como hecha', exact: true }).first().click()
  assert.equal(await completion.isDisabled(), true)
  await page.getByLabel('Resultado, enlace u observaciones').fill('Entradas y salidas comprobadas con muestra ficticia v1')
  assert.equal(await completion.isEnabled(), true)
  await completion.click()
  assert.deepEqual(await page.evaluate(() => window.testStore.get().lessons['curso:datos-del-proyecto'].done), ['intermedio'])
  await page.getByRole('button', { name: 'Quitar completado', exact: true }).click()
  assert.deepEqual(await page.evaluate(() => window.testStore.get().lessons['curso:datos-del-proyecto'].done), [])
  await page.evaluate(() => window.show('area'))
  const areaTick = page.getByRole('button', { name: /^Marcar paso 1:/ }); await areaTick.click()
  await page.evaluate(() => window.show('project'))
  await page.evaluate(() => window.show('area'))
  assert.equal(await areaTick.getAttribute('aria-pressed'), 'true')
  await page.reload(); await page.waitForFunction(() => typeof window.show === 'function'); await page.evaluate(() => window.show('area'))
  assert.equal(await areaTick.getAttribute('aria-pressed'), 'true')
  const backup = await page.evaluate(() => window.testStore.export())
  await page.evaluate(raw => { window.testStore.reset(); window.testStore.import(raw, 'replace') }, backup)
  assert.equal(await page.evaluate(() => window.testStore.get().project.workspace.artifacts.length), 1)
  await page.evaluate(() => window.show('progress'))
  await page.getByRole('heading', { name: 'Restaurar una copia' }).waitFor()
  await page.evaluate(() => window.show('deck'))
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
  const reflection = page.getByLabel('Tu respuesta, razonamiento o evidencia práctica', { exact: true })
  await reflection.fill('Un dato ficticio')
  const slideTitle = await page.locator('h1').innerText()
  await reflection.press('Space')
  assert.equal(await page.locator('h1').innerText(), slideTitle)
  await page.getByRole('button', { name: 'Siguiente', exact: true }).click()
  await page.getByRole('button', { name: 'Anterior', exact: true }).click()
  assert.ok((await reflection.inputValue()).startsWith('Un dato ficticio'))
  assert.equal(await page.getByRole('button', { name: 'Notas', exact: true }).count(), 0)
  await page.evaluate(() => window.show('faq'))
  await page.locator('.st-faq-item > button').first().click()
  await page.getByRole('button', { name: 'Sigo bloqueado', exact: true }).click()
  await page.getByLabel('Qué debería ocurrir', { exact: true }).fill('Debería crear una sola fila')
  await page.getByLabel('Qué ocurrió y el error sin secretos', { exact: true }).fill('Aparecieron dos filas para pedido-17')
  assert.equal(await page.evaluate(() => (window.supportCalls || []).filter(x => x === 'academy_support_create').length), 0)
  await page.getByRole('button', { name: 'Enviar duda al profesor', exact: true }).click()
  await page.getByText('Duda enviada al equipo docente.', { exact: true }).waitFor()
  assert.equal(await page.evaluate(() => window.supportCalls.filter(x => x === 'academy_support_create').length), 1)
  await page.getByText('Aparecieron dos filas para pedido-17', { exact: true }).waitFor()
  assert.deepEqual(errors, [])
  console.log('PASS: task IDs/locales, impact calculation, full stage coverage, rubric blocker overrides score, attributed feedback, test logs, ES/EN workspace, artifact reload, project isolation, evidence-gated completion, area progress persistence, backup restore, source-preserving editorial classification, complete program deck mapping, slide response persistence, keyboard typing isolation, learner notes gating, support explicit-send flow, zero browser errors.')
} finally { await browser.close() }
