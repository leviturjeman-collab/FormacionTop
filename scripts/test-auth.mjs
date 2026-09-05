import { PGlite } from '@electric-sql/pglite'
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto'
import { readFile, readdir } from 'node:fs/promises'
import assert from 'node:assert/strict'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const db = new PGlite({ extensions: { pgcrypto } })
const secret = 'test-only-credential-123456'
const shortAdminCode = '4826' // synthetic fixture; never a production code
const secondSecret = 'test-second-credential-123456'
let checks = 0
function check(value, message) { assert.ok(value, message); checks++ }
async function rpc(name, args = []) {
  const params = args.map((_, i) => `$${i + 1}`).join(',')
  return (await db.query(`select public.${name}(${params}) as result`, args)).rows[0].result
}
try {
  await db.exec(`create role anon; create role authenticated; create schema auth; create schema extensions;
    create function auth.jwt() returns jsonb language sql as $$ select '{}'::jsonb $$;
    grant usage on schema public to anon,authenticated;`)
  const migrations = (await readdir(path.join(root, 'supabase/migrations'))).filter((f) => f.endsWith('.sql')).sort()
  for (const file of migrations) await db.exec(await readFile(path.join(root, 'supabase/migrations', file), 'utf8'))
  await db.exec("alter table public.learners alter column email set not null")
  await db.exec("create unique index test_learners_email_unique on public.learners(email)")
  check(migrations.length >= 5, 'All migrations ran on an empty database')
  await rpc('academy_bootstrap_admin', ['test-admin','Test admin',secret])
  await db.query(`insert into public.academy_accounts(login,display_name,role,secret_hash) values ('admin','Owner','admin',extensions.crypt($1,extensions.gen_salt('bf',4)))`, ['1234'])
  await rpc('academy_bootstrap_admin', ['short-admin','Short-code admin',shortAdminCode])
  await db.exec('set role anon')
  check((await rpc('academy_sign_in', ['admin', '1234'])).ok, 'Configured four-character administrator credential accepted')
  check(!(await rpc('academy_sign_in', ['admin', '123'])).ok, 'Three-character administrator credential rejected')
  check(!(await rpc('academy_sign_in', ['admin', '4321'])).ok, 'Administrator still requires the matching hash')
  await assert.rejects(() => db.query('select * from public.academy_accounts')); checks++
  await assert.rejects(() => rpc('is_admin_pin', ['invalid'])); checks++
  await assert.rejects(() => rpc('verify_learner_pin', ['invalid'])); checks++
  await assert.rejects(() => rpc('academy_account_for_token', ['x'.repeat(64)])); checks++
  check(!(await rpc('academy_session', ['x'.repeat(64)])).ok, 'Forged token denied')
  check((await rpc('academy_sign_in_code',[shortAdminCode])).profile.role==='admin','Four-character administrator code is accepted')
  check(!(await rpc('academy_sign_in_code',['123'])).ok,'Codes shorter than four rejected')
  const admin = await rpc('academy_sign_in', ['test-admin', secret])
  check(admin.ok && admin.profile.role === 'admin' && admin.token.length === 64, 'Administrator authenticated by server')
  check((await rpc('academy_authorize', [admin.token])).ok, 'Static-content authorization works')
  const one = await rpc('academy_admin_create', [admin.token, { login: 'student-one', name: 'Student one' }, 'student-one-credential'])
  const two = await rpc('academy_admin_create', [admin.token, { login: 'student-two', name: 'Student two' }, secondSecret])
  check(one.id !== two.id, 'Different learners have unique accounts')
  const codeAdmin=await rpc('academy_sign_in_code',[secret])
  check(codeAdmin.ok && codeAdmin.profile.role==='admin','Code-only administrator sign-in')
  const codeStudent=await rpc('academy_sign_in_code',['student-one-credential'])
  check(codeStudent.ok && codeStudent.profile.id===one.id && codeStudent.profile.role==='learner','Code-only learner sign-in')
  await assert.rejects(()=>rpc('academy_admin_learners',[codeStudent.token]));checks++
  await assert.rejects(()=>rpc('academy_bootstrap_admin',['forged-admin','Denied','forged-admin-credential']));checks++
  await assert.rejects(()=>rpc('academy_admin_create',[admin.token,{login:'duplicate-code',name:'Duplicate code'},secondSecret]));checks++
  await assert.rejects(()=>rpc('academy_admin_reset_secret',[admin.token,one.id,secondSecret]));checks++
  check(!(await rpc('academy_sign_in_code',['nonexistent-credential'])).ok,'Unknown access code denied')

  await assert.rejects(() => rpc('academy_admin_create', [admin.token, { login: 'student-one', name: 'Duplicate' }, secret])); checks++
  const student = await rpc('academy_sign_in', ['student-one', 'student-one-credential'])
  check(student.ok && student.profile.id === one.id, 'Learner identity verified')
  await assert.rejects(() => rpc('academy_admin_learners', [student.token])); checks++
  await assert.rejects(() => rpc('academy_admin_update', [student.token, two.id, { status: 'archived' }])); checks++
  const progress = { name: 'Student one', lessons: {}, projects: [], access: 'admin', id: two.id, teacher: true }
  const saved = await rpc('academy_save_progress', [student.token, progress, 0])
  check(saved.ok && saved.version === 1, 'Progress saved with version')
  const loaded = await rpc('academy_load_progress', [student.token])
  check(!('access' in loaded.state) && !('id' in loaded.state) && !('teacher' in loaded.state), 'Identity fields stripped')
  const conflict = await rpc('academy_save_progress', [student.token, progress, 0])
  check(conflict.conflict && !conflict.ok, 'Stale device cannot overwrite a newer revision')
  const secondSession = await rpc('academy_sign_in', ['student-two', secondSecret])
  check((await rpc('academy_load_progress', [secondSession.token])).version === 0, 'Second learner cannot read first learner progress')
  await assert.rejects(() => db.query('select * from public.academy_support_requests')); checks++
  await assert.rejects(() => rpc('academy_support_create', ['x'.repeat(64), {subject:'Denied'}])); checks++
  const ticket = await rpc('academy_support_create', [student.token, {subject:'Synthetic question', context:'Local only', ownerId:two.id, projectId:'project-test'}])
  check(ticket.status === 'open', 'Support request created')
  check((await rpc('academy_support_list', [secondSession.token])).length === 0, 'Other learner cannot read support request')
  check((await rpc('academy_support_list', [student.token]))[0].ownerId === one.id, 'Ticket owner comes only from session')
  await assert.rejects(() => rpc('academy_support_reply', [student.token,ticket.id,'Forged reply','answered'])); checks++
  await rpc('academy_support_reply', [admin.token,ticket.id,'First answer','answered'])
  await rpc('academy_support_reply', [admin.token,ticket.id,'Resolved','closed'])
  const answered = (await rpc('academy_support_list', [student.token]))[0]
  check(answered.reply === 'Resolved' && answered.status === 'closed' && answered.replies.length === 2, 'Administrator answers persist with history')
  check((await rpc('academy_support_list', [admin.token])).length === 1, 'Administrator can load support queue')
  await assert.rejects(() => rpc('academy_support_create', [student.token,{subject:'x'.repeat(201)}])); checks++
  await rpc('academy_admin_update', [admin.token, two.id, { expiresAt: '2020-01-01T00:00:00Z' }])
  check(!(await rpc('academy_authorize', [secondSession.token])).ok, 'Account deadline blocks even an unexpired session')
  await rpc('academy_admin_update', [admin.token, two.id, { expiresAt: null }])
  const listing = await rpc('academy_admin_learners', [admin.token])
  check(listing.length === 2 && !JSON.stringify(listing).includes(secret) && !JSON.stringify(listing).includes('hash'), 'Admin listing contains no credentials')
  await rpc('academy_admin_update', [admin.token, one.id, { status: 'paused', name: 'Updated name' }])
  check(!(await rpc('academy_session', [student.token])).ok, 'Suspend revokes existing session')
  check(!(await rpc('academy_sign_in', ['student-one', 'student-one-credential'])).ok, 'Suspended learner cannot log in')
  await rpc('academy_admin_update', [admin.token, one.id, { status: 'active' }])
  await rpc('academy_admin_reset_secret', [admin.token, one.id, 'new-test-credential-123456'])
  check(!(await rpc('academy_sign_in', ['student-one', 'student-one-credential'])).ok, 'Old credential is invalid after reset')
  const restored = await rpc('academy_sign_in', ['student-one', 'new-test-credential-123456'])
  check(restored.ok && restored.version === 1, 'Reset/reactivation preserves progress')
  check((await rpc('academy_sign_in_code',['new-test-credential-123456'])).profile.id===one.id,'Reset updates code lookup')
  check(!(await rpc('academy_sign_in_code',['student-one-credential'])).ok,'Old code lookup revoked')
  await rpc('academy_sign_out', [restored.token])
  check(!(await rpc('academy_authorize', [restored.token])).ok, 'Logout revokes content authorization')
  for (let i = 0; i < 5; i++) check(!(await rpc('academy_sign_in', ['missing-user', 'wrong-test-credential'])).ok, 'Wrong attempt denied')
  check((await rpc('academy_sign_in', ['missing-user', 'wrong-test-credential'])).error === 'rate_limited', 'Sixth attempt rate limited')
  await db.exec('reset role')
  await db.query(`update public.academy_sessions set expires_at=now()-interval '1 second' where account_id=$1`, [two.id])
  await db.exec('set role anon')
  check(!(await rpc('academy_session', [secondSession.token])).ok, 'Expired session denied')
  await db.exec('reset role')
  // Upgrade a synthetic historical profile, including the legacy plaintext
  // column and an existing remote progress record. Reapplying is intentional.
  const legacySecret = 'legacy-fixture-code'
  await db.exec("alter table public.learners add column pin text not null default ''")
  const legacy = (await db.query(`insert into public.learners(name,email,pin_hash,pin,pin_visible) values ('Legacy learner','',extensions.crypt($1,extensions.gen_salt('bf',4)),$1,$1) returning id`, [legacySecret])).rows[0].id
  await db.query(`insert into public.learner_progress(learner_id,state) values ($1,$2)`, [legacy, { name: 'Legacy learner', lessons: {}, projects: [], legacyEvidence: 'preserved' }])
  await db.exec(await readFile(path.join(root, 'supabase/migrations/20260905160000_verified_sessions_and_progress.sql'), 'utf8'))
  const legacyAccount = (await db.query('select enabled from public.academy_accounts where learner_id=$1', [legacy])).rows[0]
  check(legacyAccount.enabled === false, 'Legacy credentials require an explicit reset')
  check((await db.query('select state from public.academy_progress where account_id=$1', [legacy])).rows[0].state.legacyEvidence === 'preserved', 'Legacy remote work is retained')
  check((await db.query("select count(*)::int as n from information_schema.columns where table_schema='public' and table_name='learners' and column_name='pin'")).rows[0].n === 0, 'Legacy plaintext column removed')
  check((await db.query('select pin_visible from public.learners where id=$1', [legacy])).rows[0].pin_visible === legacySecret, 'Visible credential copy retained until code lookup exists')
  check((await db.query("select count(*)::int as n from public.app_settings where key='admin_pin_hash'")).rows[0].n === 0, 'Historical administrator credential removed')
  // Convert the retained visible code into a digest lookup, then erase the
  // reversible copy. No real credentials or production database are involved.
  await db.exec(await readFile(path.join(root,'supabase/migrations/20260905180000_single_access_code.sql'),'utf8'))
  check((await db.query('select pin_visible from public.learners where id=$1', [legacy])).rows[0].pin_visible === null, 'Visible credential copy cleared after digest conversion')
  await db.exec('set role anon')
  const recoveredLegacy=await rpc('academy_sign_in_code',[legacySecret])
  check(recoveredLegacy.ok && recoveredLegacy.profile.role==='learner' && recoveredLegacy.progress.legacyEvidence==='preserved','Historical code restored without losing work or granting admin')
  await assert.rejects(()=>rpc('academy_admin_learners',[recoveredLegacy.token]));checks++
  console.log(`PASS auth: ${checks} assertions; real PostgreSQL/WASM with pgcrypto; no remote database contacted.`)
} finally { await db.close() }
