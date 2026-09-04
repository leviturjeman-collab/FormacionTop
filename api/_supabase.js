import crypto from 'node:crypto'

const LEARNERS_TABLE = 'learners'
const WINDOW_MS = 60 * 1000
const MAX_UNLOCK_ATTEMPTS = 12
const unlockAttempts = new Map()

export function cleanPin(value, length = 6) {
  return String(value || '').replace(/\D/g, '').slice(0, length)
}

export function adminPin() {
  return process.env.ADMIN_PIN || '5555'
}

export function hashPin(pin) {
  const pepper = process.env.PIN_PEPPER || process.env.SUPABASE_SERVICE_ROLE_KEY || 'local-dev'
  return crypto.createHash('sha256').update(`${pepper}:${pin}`).digest('hex')
}

function sessionSecret() {
  return process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'local-dev'
}

function safeEqualString(left, right) {
  const a = Buffer.from(String(left || ''))
  const b = Buffer.from(String(right || ''))
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  return String(Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket?.remoteAddress || 'unknown')
    .split(',')[0]
    .trim()
}

export function checkUnlockRateLimit(req) {
  const key = clientIp(req)
  const now = Date.now()
  const current = unlockAttempts.get(key)
  if (!current || current.resetAt <= now) {
    unlockAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  current.count += 1
  return current.count <= MAX_UNLOCK_ATTEMPTS
}

function base64url(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

export function signSession(payload) {
  const body = base64url({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  })
  const signature = crypto.createHmac('sha256', sessionSecret()).update(body).digest('base64url')
  return `${body}.${signature}`
}

export function verifySessionToken(token) {
  try {
    const [body, signature] = String(token || '').split('.')
    if (!body || !signature) return null
    const expected = crypto.createHmac('sha256', sessionSecret()).update(body).digest('base64url')
    if (signature.length !== expected.length) return null
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

function cookieValue(req, name) {
  const raw = req.headers.cookie || ''
  const match = String(raw).split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : ''
}

export function setSessionCookie(res, token) {
  const maxAge = 60 * 60 * 24 * 30
  res.setHeader(
    'Set-Cookie',
    `academy_session=${encodeURIComponent(token)}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`,
  )
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'academy_session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax')
}

export function sessionFromRequest(req) {
  const header = req.headers.authorization || req.headers.Authorization || ''
  const token = String(header).startsWith('Bearer ')
    ? String(header).slice(7)
    : req.headers['x-session-token'] || cookieValue(req, 'academy_session')
  return verifySessionToken(token)
}

export function ensurePrivateAccess(req, res) {
  const session = sessionFromRequest(req)
  if (session?.role === 'admin' || session?.learnerId) return session
  const provided = cleanPin(req.headers['x-admin-pin'], 4)
  if (safeEqualString(provided, adminPin())) return { role: 'admin' }
  json(res, 401, { ok: false, error: 'Acceso privado. Entra con tu PIN.' })
  return null
}

export function normalizeLearner(input) {
  const now = new Date().toISOString()
  const pin = cleanPin(input?.pin)
  if (!input?.name?.trim()) throw new Error('El nombre es obligatorio.')
  if (!input?.email?.trim()) throw new Error('El email es obligatorio.')
  if (!/^\d{6}$/.test(pin)) throw new Error('El PIN debe tener exactamente 6 digitos.')

  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    pin,
    pin_hash: hashPin(pin),
    level: input.level || 'basico',
    goal: input.goal || '',
    tools: input.tools || '',
    notes: input.notes || '',
    status: ['pendiente', 'entregado', 'activo'].includes(input.status) ? input.status : 'pendiente',
    updated_at: now,
  }
}

export function learnerFromRow(row) {
  return {
    id: row.id,
    name: row.name || '',
    email: row.email || '',
    pin: row.pin || '',
    level: row.level || 'basico',
    goal: row.goal || '',
    tools: row.tools || '',
    notes: row.notes || '',
    status: row.status || 'pendiente',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function json(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.end(JSON.stringify(payload))
}

export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}')

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

export function ensureAdmin(req, res) {
  const session = sessionFromRequest(req)
  if (session?.role === 'admin') return true

  const provided = cleanPin(req.headers['x-admin-pin'], 4)
  if (!safeEqualString(provided, adminPin())) {
    json(res, 401, { ok: false, error: 'Admin PIN incorrecto.' })
    return false
  }
  return true
}

export async function supabaseFetch(path, options = {}) {
  const baseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!baseUrl || !serviceKey) {
    const error = new Error('Supabase no esta configurado en variables de entorno.')
    error.status = 503
    throw error
  }

  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) {
    const error = new Error(data?.message || data?.hint || 'Error de Supabase.')
    error.status = response.status
    error.data = data
    throw error
  }
  return data
}

export function learnersPath(query = '') {
  return `${LEARNERS_TABLE}${query}`
}

export function progressPath(query = '') {
  return `learner_progress${query}`
}
