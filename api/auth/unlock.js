import { adminPin, cleanPin, hashPin, json, learnerFromRow, learnersPath, readBody, supabaseFetch } from '../_supabase.js'

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
    const body = await readBody(req)
    const pin = cleanPin(body.pin, 6)

    if (pin === adminPin()) {
      json(res, 200, { ok: true, role: 'admin' })
      return
    }

    if (!/^\d{6}$/.test(pin)) {
      json(res, 400, { ok: false, error: 'El PIN debe tener 6 digitos.' })
      return
    }

    const pinHash = hashPin(pin)
    const rows = await supabaseFetch(
      learnersPath(`?select=id,name,email,pin,level,goal,tools,notes,status,created_at,updated_at&or=(pin.eq.${pin},pin_hash.eq.${pinHash})&limit=1`),
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

    json(res, 200, { ok: true, role: 'learner', learner: learnerFromRow(learner) })
  } catch (error) {
    errorResponse(res, error)
  }
}
