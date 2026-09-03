import { json, progressPath, readBody, sessionFromRequest, supabaseFetch } from './_supabase.js'

function errorResponse(res, error) {
  const status = error.status || 500
  json(res, status, { ok: false, error: error.message || 'No se pudo guardar el progreso.' })
}

function ensureLearnerSession(req, res) {
  const session = sessionFromRequest(req)
  if (!session?.learnerId) {
    json(res, 401, { ok: false, error: 'Sesion de alumno no valida.' })
    return null
  }
  return session
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    json(res, 200, { ok: true })
    return
  }

  const session = ensureLearnerSession(req, res)
  if (!session) return

  try {
    if (req.method === 'GET') {
      const rows = await supabaseFetch(
        progressPath(`?learner_id=eq.${encodeURIComponent(session.learnerId)}&select=state,updated_at&limit=1`),
      )
      json(res, 200, { ok: true, progress: rows[0]?.state || null, updatedAt: rows[0]?.updated_at || null })
      return
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = await readBody(req)
      const state = body.state && typeof body.state === 'object' ? body.state : {}
      const rows = await supabaseFetch(progressPath('?on_conflict=learner_id&select=*'), {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          learner_id: session.learnerId,
          state,
          updated_at: new Date().toISOString(),
        }),
      })
      json(res, 200, { ok: true, progress: rows[0]?.state || state, updatedAt: rows[0]?.updated_at || null })
      return
    }

    json(res, 405, { ok: false, error: 'Metodo no permitido.' })
  } catch (error) {
    errorResponse(res, error)
  }
}
