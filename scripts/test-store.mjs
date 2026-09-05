import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const temp = await mkdtemp(path.join(tmpdir(), 'academy-store-'))
const files = new Map()
let blocked = false
globalThis.localStorage = { getItem: (key) => files.get(key) ?? null, setItem: (key, value) => { if (blocked) throw new Error('quota'); files.set(key, value) }, removeItem: (key) => files.delete(key) }
globalThis.window = { addEventListener() {}, setTimeout, clearTimeout }
let checks = 0
function check(value, message) { assert.ok(value, message); checks++ }
try {
  const output = path.join(temp, 'store.mjs')
  await build({ entryPoints: [path.resolve(import.meta.dirname, '../src/store.ts')], outfile: output, bundle: true, platform: 'node', format: 'esm' })
  const { store, validateStudent, mergeProgress } = await import(pathToFileURL(output).href)
  const empty = { name: '', lessons: {}, projects: [] }
  store.enter({ id: 'student-a', name: 'A', access: 'learner' }, empty)
  store.setNote('lesson', 'intermedio', 'step-id', 'real evidence')
  const first = store.createProject('First')
  store.updateProject(first, { goal: 'Save time' })
  const second = store.createProject('Second')
  store.selectProject(first)
  store.toggleTask('lesson', 'intermedio', 'stable-task-id')
  store.saveQuiz('lesson', 'intermedio', 4, 5, 'v1')
  store.saveQuiz('lesson', 'intermedio', 1, 5, 'v1')
  check(store.get().lessons.lesson.quizAttempts.intermedio.length === 2 && store.get().lessons.lesson.quiz.intermedio.correct === 4, 'Worse attempts remain in history without replacing best score')
  store.saveQuiz('lesson', 'intermedio', 2, 5, 'v2')
  check(store.get().lessons.lesson.quiz.intermedio.correct === 2 && store.get().lessons.lesson.quiz.intermedio.version === 'v2', 'Changed quiz version does not inherit the old best score')
  check(store.get().project.goal === 'Save time' && store.get().projects.length === 2, 'Multiple projects persist independently')
  store.logout()
  check(store.get().lessons.lesson === undefined, 'Logout removes active profile from memory')
  check([...files.values()].some((v) => v.includes('real evidence')), 'Logout preserves recoverable work')
  store.enter({ id: 'student-b', name: 'B', access: 'learner' }, empty)
  check(!store.get().lessons.lesson && !store.get().projects.length, 'Different learner has isolated state')
  store.logout()
  store.enter({ id: 'student-a', name: 'A', access: 'learner' }, empty)
  check(store.get().lessons.lesson.notes.intermedio['step-id'] === 'real evidence', 'Pending local work is restored')
  check(store.get().lessons.lesson.tasks.intermedio[0] === 'stable-task-id', 'Stable task checks restored')
  const exported = store.export()
  check(!JSON.parse(exported).state.access && !JSON.parse(exported).state.id, 'Export does not grant identity or access')
  store.reset(); store.import(exported, 'replace')
  check(store.get().projects.some((p) => p.id === second), 'Export/import round trip restores projects')
  store.toggleTeacher(); check(store.get().teacher === false, 'Learner cannot toggle teacher mode')
  const forged = validateStudent({ ...empty, access: 'admin', teacher: true, id: 'other' })
  check(!forged.access && !forged.id && !forged.teacher, 'Imported authorization fields discarded')
  const malformed = validateStudent({ ...empty, projects: [{ name: 'Malformed', workspace: { artifacts: 'bad', reviews: [null], tests: 1, impact: { weeklyRuns: -10 } } }] })
  check(Array.isArray(malformed.projects[0].workspace.artifacts) && malformed.projects[0].workspace.impact.weeklyRuns === 0, 'Malformed workspace cannot crash consumers')
  assert.throws(() => validateStudent({ lessons: { broken: {} } })); checks++
  const merged = mergeProgress({ notes: { a: '', b: '' } }, { notes: { a: 'A', b: '' } }, { notes: { a: '', b: 'B' } })
  check(merged.notes.a === 'A' && merged.notes.b === 'B', 'Disjoint concurrent edits are merged')
  assert.throws(() => mergeProgress({ a: '' }, { a: 'local' }, { a: 'remote' }), /simult/); checks++
  const projects = mergeProgress([{ id: 'a', goal: '' }, { id: 'b', goal: '' }], [{ id: 'a', goal: 'A' }, { id: 'b', goal: '' }], [{ id: 'a', goal: '' }, { id: 'b', goal: 'B' }])
  check(projects[0].goal === 'A' && projects[1].goal === 'B', 'Different projects merge independently by stable ID')
  check(JSON.stringify(mergeProgress(['a'], ['a', 'b'], [])) === '["b"]', 'Independent checklist additions and removals merge')
  blocked = true; store.setNote('lesson', 'intermedio', 'another', 'recover despite quota')
  check(store.export().includes('recover despite quota'), 'Quota failure preserves an emergency export')
  check(store.logout() === false && store.get().lessons.lesson.notes.intermedio.another === 'recover despite quota', 'Logout cannot discard the only in-memory copy after quota failure')
  store.enter({ id: 'student-a', name: 'A', access: 'learner' }, empty)
  check(store.get().lessons.lesson.notes.intermedio.another === 'recover despite quota', 'Re-authentication after expiry preserves an in-memory recovery copy')
  blocked = false
  let serverState = empty; let version = 0
  store.connectRemote({ load: async () => ({ state: serverState, version }), save: async (state, expected) => { if (expected !== version) return { ok: false, conflict: true, version }; serverState = state; return { ok: true, version: ++version } } })
  await store.flush()
  check(version > 0 && JSON.stringify(serverState).includes('recover despite quota'), 'Remote synchronization preserves local work')
  store.disconnectRemote()
  console.log(`PASS store: ${checks} assertions; isolation, recovery, import, conflicts and synchronization.`)
} finally { await rm(temp, { recursive: true, force: true }) }
