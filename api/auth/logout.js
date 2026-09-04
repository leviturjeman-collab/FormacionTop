import { clearSessionCookie, json } from '../_supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    json(res, 405, { ok: false, error: 'Metodo no permitido.' })
    return
  }
  clearSessionCookie(res)
  json(res, 200, { ok: true })
}
