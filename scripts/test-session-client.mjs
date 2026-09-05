import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const temp = await mkdtemp(path.join(tmpdir(), 'academy-session-client-'))
const saved = new Map()
let interval
let entered = 0, closed = 0
globalThis.sessionStorage = { getItem: (key) => saved.get(key) || null, setItem: (key, value) => saved.set(key, value), removeItem: (key) => saved.delete(key) }
globalThis.window = { setInterval: (fn) => { interval = fn; return 1 }, clearInterval() {} }
globalThis.__testStore = { enter() { entered++ }, connectRemote() {}, disconnectRemote() {}, flush: async () => {}, canSafelyClose: () => true, logout() { closed++ } }
const verified = { ok: true, token: 'a'.repeat(64), expiresAt: new Date(Date.now() + 3600000).toISOString(), profile: { id: 'user', name: 'Student', role: 'learner', level: 'intermedio', locale: 'es' }, progress: { lessons: {}, projects: [] }, version: 0 }
let calls = []
globalThis.__testRpc = async (name) => { calls.push(name); return name === 'academy_sign_out' ? null : verified }
let checks = 0
function check(value, message) { assert.ok(value, message); checks++ }
try {
  const output = path.join(temp, 'client.mjs')
  await build({ entryPoints: [path.resolve(import.meta.dirname, '../src/session.ts')], outfile: output, bundle: true, platform: 'node', format: 'esm', define: { 'import.meta.env.PROD': 'false' }, plugins: [{ name: 'session-boundaries', setup(build) {
    build.onResolve({ filter: /^\.\/(supabase|store)$/ }, (args) => ({ path: args.path, namespace: 'test' }))
    build.onLoad({ filter: /.*/, namespace: 'test' }, (args) => ({ contents: args.path === './store' ? 'export const store = globalThis.__testStore' : 'export const hasSupabase = true; export const academyRpc = (...args) => globalThis.__testRpc(...args)', loader: 'js' }))
  } }] })
  const session = await import(pathToFileURL(output).href)
  await session.restoreRemoteSession()
  check(session.getSession().status === 'anonymous' && calls.length === 0, 'No local role or state grants a session')
  await session.signInWithPin({ identifier: 'student', pin: 'example-test-secret' })
  check(session.getSession().status === 'authenticated' && entered === 1, 'Remote verified profile activates the store')
  check(saved.has('academia.session.v2'), 'Opaque session can restore the current tab')
  await assert.rejects(() => session.adminRpc('academy_admin_learners')); checks++
  let completeValidation
  globalThis.__testRpc = async (name) => name === 'academy_session' ? new Promise((resolve) => { completeValidation = resolve }) : null
  interval()
  await Promise.resolve()
  await session.signOutRemoteSession()
  completeValidation(verified)
  await new Promise((resolve) => setTimeout(resolve, 0))
  check(session.getSession().status === 'anonymous' && closed === 1, 'A late validation response cannot resurrect a logged-out session')
  check(!saved.has('academia.session.v2'), 'Logout removes the persisted token')
  globalThis.__testRpc = async () => ({ ok: false, error: 'invalid_credentials' })
  await assert.rejects(() => session.signInWithPin({ identifier: 'student', pin: 'wrong' })); checks++
  check(session.getSession().status === 'anonymous', 'Invalid login remains anonymous')
  console.log(`PASS session client: ${checks} assertions; verified login, role denial and logout race.`)
} finally { delete globalThis.__testStore; delete globalThis.__testRpc; await rm(temp, { recursive: true, force: true }) }
