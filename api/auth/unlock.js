import {
  adminPin,
  checkUnlockRateLimit,
  cleanPin,
  hashPin,
  json,
  learnerFromRow,
  learnersPath,
  progressPath,
  readBody,
  setSessionCookie,
  signSession,
  supabaseFetch,
} from '../_supabase.js'

function errorResponse(res, error) {
  const status = error.status || 500
  json(res, status, { ok: false, error: error.message || 'No se pudo comprobar el PIN.' })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    json(res, 405, { ok: false, error: 'Metodo no permitido.' })
    return
  }

  try {
    if (!checkUnlockRateLimit(req)) {
      json(res, 429, { ok: false, error: 'Demasiados intentos seguidos. Espera un minuto y vuelve a probar.' })
      return
    }

    const body = await readBody(req)
    const pin = cleanPin(body.pin, 6)

    if (pin === adminPin()) {
      const sessionToken = signSession({ role: 'admin' })
      setSessionCookie(res, sessionToken)
      json(res, 200, { ok: true, role: 'admin', sessionToken })
      return
    }

    if (!/^\d{6}$/.test(pin)) {
      json(res, 400, { ok: false, error: 'El PIN debe tener 6 digitos.' })
      return
    }

    const pinHash = hashPin(pin)
    const rows = await supabaseFetch(
      learnersPath(`?select=id,name,email,level,goal,tools,notes,status,created_at,updated_at&or=(pin.eq.${pin},pin_hash.eq.${pinHash})&limit=1`),
    )
    const learner = rows[0]
    if (!learner) {
      json(res, 404, { ok: false, error: 'PIN no encontrado.' })
      return
    }

    if (learner.status !== 'activo') {
      await supabaseFetch(learnersPath(`?id=eq.${encodeURIComponent(learner.id)}`), {
        method: 'PATCH',
        body: JSON.stringify({ status: 'activo', updated_at: new Date().toISOString() }),
      })
      learner.status = 'activo'
    }

    const progress = await supabaseFetch(progressPath(`?learner_id=eq.${encodeURIComponent(learner.id)}&select=state,updated_at&limit=1`))

    const sessionToken = signSession({ role: 'learner', learnerId: learner.id })
    setSessionCookie(res, sessionToken)

    json(res, 200, {
      ok: true,
      role: 'learner',
      sessionToken,
      learner: learnerFromRow(learner),
      progress: progress[0]?.state || null,
    })
  } catch (error) {
    errorResponse(res, error)
  }
}
