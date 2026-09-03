import { readFileSync } from 'node:fs'

for (const line of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1]] = match[2].replace(/^"|"$/g, '')
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local. Vercel no descarga valores sensibles; rellena .env.local a mano o prueba la API ya desplegada.')
}

const { default: learners } = await import('../api/admin/learners.js')
const { default: unlock } = await import('../api/auth/unlock.js')

function createResponse() {
  return {
    statusCode: 0,
    headers: {},
    body: '',
    setHeader(key, value) {
      this.headers[key] = value
    },
    end(value) {
      this.body = value || ''
    },
  }
}

async function call(handler, req) {
  const res = createResponse()
  await handler(req, res)
  return { status: res.statusCode, body: JSON.parse(res.body || '{}') }
}

const pin = `8${String(Date.now()).slice(-5)}`
const email = `codex-smoke-${Date.now()}@aibylevi.test`
const adminHeaders = { 'x-admin-pin': process.env.ADMIN_PIN || '5555' }

const created = await call(learners, {
  method: 'POST',
  headers: adminHeaders,
  body: {
    learners: [{ name: 'Codex Smoke', email, pin, level: 'basico', status: 'pendiente' }],
  },
})

if (created.status !== 200 || !created.body.learners?.[0]?.id) {
  throw new Error(`Create failed: ${JSON.stringify(created.body)}`)
}

const id = created.body.learners[0].id
const unlocked = await call(unlock, { method: 'POST', headers: {}, body: { pin } })

if (unlocked.status !== 200 || unlocked.body.role !== 'learner' || !unlocked.body.sessionToken) {
  throw new Error(`Unlock failed: ${JSON.stringify(unlocked.body)}`)
}

const { default: progress } = await import('../api/progress.js')
const savedProgress = await call(progress, {
  method: 'POST',
  headers: { authorization: `Bearer ${unlocked.body.sessionToken}` },
  body: { state: { name: 'Codex Smoke', lessons: { smoke: { done: ['basico'] } } } },
})

if (savedProgress.status !== 200) {
  throw new Error(`Progress failed: ${JSON.stringify(savedProgress.body)}`)
}

const deleted = await call(learners, { method: 'DELETE', headers: adminHeaders, query: { id } })

if (deleted.status !== 200) {
  throw new Error(`Delete failed: ${JSON.stringify(deleted.body)}`)
}

console.log('Supabase API smoke OK', JSON.stringify({ created: true, unlocked: true, progress: true, deleted: true }))
