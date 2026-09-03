import crypto from 'node:crypto'

const LEARNERS_TABLE = 'learners'

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
  const provided = cleanPin(req.headers['x-admin-pin'], 4)
  if (provided !== adminPin()) {
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
