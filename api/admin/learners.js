import {
  ensureAdmin,
  json,
  learnerFromRow,
  learnersPath,
  normalizeLearner,
  readBody,
  supabaseFetch,
} from '../_supabase.js'

function errorResponse(res, error) {
  const status = error.status || 500
  json(res, status, { ok: false, error: error.message || 'No se pudo completar la operacion.' })
}

async function listLearners(res) {
  const rows = await supabaseFetch(
    learnersPath('?select=id,name,email,pin,level,goal,tools,notes,status,created_at,updated_at&order=created_at.desc'),
  )
  json(res, 200, { ok: true, learners: rows.map(learnerFromRow) })
}

async function upsertLearners(req, res) {
  const body = await readBody(req)
  const input = Array.isArray(body.learners) ? body.learners : [body]
  const payload = input.map((item) => normalizeLearner(item))
  const rows = await supabaseFetch(learnersPath('?on_conflict=email&select=*'), {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(payload),
  })
  json(res, 200, { ok: true, learners: rows.map(learnerFromRow) })
}

async function updateLearner(req, res) {
  const body = await readBody(req)
  if (!body.id) {
    json(res, 400, { ok: false, error: 'Falta el id del alumno.' })
    return
  }

  const payload = { updated_at: new Date().toISOString() }
  if (body.name !== undefined) payload.name = String(body.name).trim()
  if (body.email !== undefined) payload.email = String(body.email).trim().toLowerCase()
  if (body.level !== undefined) payload.level = body.level || 'basico'
  if (body.goal !== undefined) payload.goal = body.goal || ''
  if (body.tools !== undefined) payload.tools = body.tools || ''
  if (body.notes !== undefined) payload.notes = body.notes || ''
  if (['pendiente', 'entregado', 'activo'].includes(body.status)) payload.status = body.status
  if (body.pin !== undefined) {
    const normalized = normalizeLearner({ ...body, name: body.name || 'Alumno', email: body.email || 'alumno@example.com' })
    payload.pin = normalized.pin
    payload.pin_hash = normalized.pin_hash
  }

  const rows = await supabaseFetch(learnersPath(`?id=eq.${encodeURIComponent(body.id)}&select=*`), {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(payload),
  })
  json(res, 200, { ok: true, learners: rows.map(learnerFromRow) })
}

async function deleteLearner(req, res) {
  const id = req.query?.id
  if (!id) {
    json(res, 400, { ok: false, error: 'Falta el id del alumno.' })
    return
  }
  await supabaseFetch(learnersPath(`?id=eq.${encodeURIComponent(id)}`), { method: 'DELETE' })
  json(res, 200, { ok: true })
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    json(res, 200, { ok: true })
    return
  }
  if (!ensureAdmin(req, res)) return

  try {
    if (req.method === 'GET') return await listLearners(res)
    if (req.method === 'POST') return await upsertLearners(req, res)
    if (req.method === 'PATCH') return await updateLearner(req, res)
    if (req.method === 'DELETE') return await deleteLearner(req, res)
    json(res, 405, { ok: false, error: 'Metodo no permitido.' })
  } catch (error) {
    errorResponse(res, error)
  }
}
