import assert from 'node:assert/strict'
import { loadEnv } from 'vite'
import fs from 'node:fs/promises'
const env = loadEnv('production', process.cwd(), '')
const base = env.VITE_SUPABASE_URL
const key = env.VITE_SUPABASE_ANON_KEY
if (!base || !key) throw new Error('Supabase configuration required')
if (!process.env.ACADEMY_TEST_ADMIN_PIN) throw new Error('Set ACADEMY_TEST_ADMIN_PIN to run the authorized live test')
const results = [], created = [], tokens = []
let admin
async function rpc(name, args = {}, deny = false) {
  const response = await fetch(`${base}/rest/v1/rpc/${name}`, { method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(args), signal: AbortSignal.timeout(20000) })
  const body = await response.text()
  if (deny) { assert.ok(!response.ok, `Denied: ${name}`); results.push(`Denied learner RPC: ${name}`); return }
  if (!response.ok) throw new Error(`${name}: ${response.status} ${body}`)
  return body ? JSON.parse(body) : null
}
function check(value, name) { assert.ok(value, name); results.push(name) }
try {
  admin = await rpc('academy_sign_in_code', { access_code: process.env.ACADEMY_TEST_ADMIN_PIN })
  check(admin.ok && admin.profile.role === 'admin', 'Professor PIN verifies server-side')
  tokens.push(admin.token)
  const invalidCode = `qa-invalid-${crypto.randomUUID()}`
  for (let attempt = 0; attempt < 5; attempt++) check(!(await rpc('academy_sign_in_code', { access_code: invalidCode })).ok, `Invalid code rejected: attempt ${attempt + 1}`)
  check((await rpc('academy_sign_in_code', { access_code: invalidCode })).error === 'rate_limited', 'Repeated invalid code is rate limited')
  await rpc('verify_learner_pin', { learner_pin: invalidCode }, true)
  await rpc('list_learners_admin', { admin_pin: invalidCode }, true)
  const adminArgs = { session_token: admin.token }
  for (const suffix of ['A', 'B']) {
    const item = await rpc('academy_admin_issue_learner', { ...adminArgs, learner: { name: `QA backend ${Date.now()} ${suffix}`, level: 'basico', locale: 'es', goal: 'Prueba técnica de permisos; perfil archivado al finalizar' } })
    created.push(item.id)
    check(/^\d{12}$/.test(item.pin), `Generated numeric PIN ${suffix}`)
    const revealed = await rpc('academy_admin_reveal_pin', { ...adminArgs, learner_id: item.id })
    check(revealed.pin === item.pin, `Teacher can recover PIN ${suffix}`)
    const login = await rpc('academy_sign_in_code', { access_code: item.pin })
    check(login.ok && login.profile.role === 'learner' && login.profile.id === item.id, `Learner ${suffix} enters own account`)
    item.session = login; tokens.push(login.token)
    if (suffix === 'A') globalThis.testA = item
    else globalThis.testB = item
  }
  const a = globalThis.testA, b = globalThis.testB
  const learnerArgs = { session_token: a.session.token }
  await rpc('academy_admin_learners', learnerArgs, true)
  await rpc('academy_admin_reveal_pin', { ...learnerArgs, learner_id: b.id }, true)
  await rpc('academy_admin_issue_pin', { ...learnerArgs, learner_id: b.id }, true)
  await rpc('academy_admin_issue_learner', { ...learnerArgs, learner: { name: 'Not authorized' } }, true)
  await rpc('academy_admin_update', { ...learnerArgs, learner_id: b.id, changes: { status: 'paused' } }, true)
  check((await rpc('academy_support_list', learnerArgs)).length === 0, 'New learner sees only own support queue')
  for (const table of ['academy_accounts', 'academy_sessions', 'academy_pin_key', 'academy_learner_pins', 'learners', 'academy_progress', 'academy_audit']) {
    const res = await fetch(`${base}/rest/v1/${table}?select=*&limit=1`, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
    const data = await res.json()
    check(!res.ok || (Array.isArray(data) && data.length === 0), `Public table access blocked: ${table}`)
  }
  const marker = `private-${Date.now()}`
  const before = await rpc('academy_load_progress', learnerArgs)
  const progress = { name: 'QA A', teacher: true, access: 'admin', lessons: {}, projects: [], project: { name: marker, goal: marker, audience: '', problem: '', outcome: '', tools: '', updatedAt: new Date().toISOString() } }
  const saved = await rpc('academy_save_progress', { ...learnerArgs, progress_state: progress, expected_version: before.version })
  check(saved.ok, 'Progress saved remotely')
  const loaded = await rpc('academy_load_progress', learnerArgs)
  check(JSON.stringify(loaded.state).includes(marker), 'Progress roundtrip preserves own work')
  const isolated = await rpc('academy_load_progress', { session_token: b.session.token })
  check(!JSON.stringify(isolated).includes(marker), 'Learner B cannot load learner A progress')
  const role = await rpc('academy_session', learnerArgs)
  check(role.profile.role === 'learner', 'Progress cannot grant admin role')
  const conflict = await rpc('academy_save_progress', { ...learnerArgs, progress_state: progress, expected_version: before.version })
  check(conflict.conflict && !conflict.ok, 'Stale saves cannot silently overwrite progress')
  const replacement = await rpc('academy_admin_issue_pin', { ...adminArgs, learner_id: a.id })
  check(replacement.pin !== a.pin, 'PIN reset issues new credential')
  check(!(await rpc('academy_session', learnerArgs)).ok, 'PIN reset revokes old session')
  check(!(await rpc('academy_sign_in_code', { access_code: a.pin })).ok, 'Old PIN rejected after reset')
  const renewed = await rpc('academy_sign_in_code', { access_code: replacement.pin }); tokens.push(renewed.token)
  check(renewed.ok, 'New PIN works')
  await rpc('academy_admin_update', { ...adminArgs, learner_id: a.id, changes: { status: 'paused' } })
  check(!(await rpc('academy_sign_in_code', { access_code: replacement.pin })).ok, 'Suspended learner cannot sign in')
  check(!(await rpc('academy_session', { session_token: renewed.token })).ok, 'Suspension revokes open access')
} finally {
  if (admin?.token) for (const id of created) await rpc('academy_admin_update', { session_token: admin.token, learner_id: id, changes: { status: 'archived' } })
  for (const token of tokens.filter(Boolean)) await rpc('academy_sign_out', { session_token: token })
  await fs.mkdir('audit-output', { recursive: true })
  await fs.writeFile('audit-output/backend-verification.json', JSON.stringify({ checkedAt: new Date().toISOString(), checks: results, testAccounts: created.length, cleanup: 'Test accounts archived; sessions revoked' }, null, 2))
}
console.log(`PASS live Supabase: ${results.length} checks. Test accounts archived; sessions revoked. No credentials logged.`)
