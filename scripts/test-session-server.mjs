import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const temp = await mkdtemp(path.join(tmpdir(), 'academy-session-'))
let checks = 0
function check(value, message) { assert.ok(value, message); checks++ }
const token = 'a'.repeat(64)
const oldFetch = globalThis.fetch
const oldUrl = process.env.SUPABASE_URL, oldKey = process.env.SUPABASE_ANON_KEY
try {
  const out = path.join(temp, 'session.mjs'), apiOut = path.join(temp, 'api.mjs')
  await build({ entryPoints: [path.resolve(import.meta.dirname, '../server/session.ts')], outfile: out, bundle: true, platform: 'node', format: 'esm' })
  await build({ entryPoints: [path.resolve(import.meta.dirname, '../api/session.ts')], outfile: apiOut, bundle: true, platform: 'node', format: 'esm' })
  const { authorizeContent, SESSION_COOKIE } = await import(pathToFileURL(out).href)
  const { default: webHandler } = await import(pathToFileURL(apiOut).href)
  const bridge = webHandler.fetch
  process.env.SUPABASE_URL = 'https://test.invalid'; process.env.SUPABASE_ANON_KEY = 'test-public-key'
  let calls = 0
  globalThis.fetch = async () => { calls++; return Response.json({ ok: true, expiresAt: new Date(Date.now() + 3600000).toISOString() }) }
  check((await authorizeContent(new Request('https://academy.invalid/course.json'))).status === 401 && calls === 0, 'Anonymous static content denied without remote request')
  check(await authorizeContent(new Request('https://academy.invalid/generated/file.json', { headers: { Cookie: `${SESSION_COOKIE}=${token}` } })) === null, 'Verified session allowed')
  const request = (origin, body, method = 'POST') => new Request('https://academy.invalid/api/session', { method, headers: { Origin: origin, 'Content-Type': 'application/json' }, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) })
  check((await bridge(request('https://attacker.invalid', { token }))).status === 403, 'Cross-origin cookie setting denied')
  const response = await bridge(request('https://academy.invalid', { token }))
  const setCookie = response.headers.get('set-cookie') || ''
  check(response.status === 204 && ['HttpOnly', 'Secure', 'SameSite=Lax', 'Path=/'].every((v) => setCookie.includes(v)), 'Secure host-only cookie issued only after remote verification')
  check(response.headers.get('cache-control').includes('no-store'), 'Session responses not cacheable')
  check((await bridge(request('https://academy.invalid', {}, 'DELETE'))).headers.get('set-cookie').includes('Max-Age=0'), 'Logout clears cookie')
  globalThis.fetch = async () => Response.json({ ok: false })
  check((await authorizeContent(new Request('https://academy.invalid/course.en.json', { headers: { Cookie: `${SESSION_COOKIE}=${token}` } }))).status === 401, 'Revoked session denied')
  globalThis.fetch = async () => { throw new Error('offline') }
  check((await authorizeContent(new Request('https://academy.invalid/course.json', { headers: { Cookie: `${SESSION_COOKIE}=${token}` } }))).status === 503, 'Verification outage fails closed')
  check((await bridge(request('https://academy.invalid', { token: 'bad' }))).status === 400, 'Malformed token denied')
  console.log(`PASS session server: ${checks} assertions; mocked remote, no production deployment claimed.`)
} finally {
  globalThis.fetch = oldFetch
  if (oldUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = oldUrl
  if (oldKey === undefined) delete process.env.SUPABASE_ANON_KEY; else process.env.SUPABASE_ANON_KEY = oldKey
  await rm(temp, { recursive: true, force: true })
}
