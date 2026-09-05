import { cookie, privateHeaders, verifyRemote } from '../server/session'

async function handler(request: Request): Promise<Response> {
  const origin = request.headers.get('origin')
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: 'invalid_origin' }, { status: 403, headers: privateHeaders })
  if (request.method === 'DELETE') return new Response(null, { status: 204, headers: { ...privateHeaders, 'Set-Cookie': cookie('', 0) } })
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { ...privateHeaders, Allow: 'POST, DELETE' } })
  if (!request.headers.get('content-type')?.startsWith('application/json')) return Response.json({ error: 'invalid_type' }, { status: 415, headers: privateHeaders })
  try {
    const body = await request.text()
    if (body.length > 256) return Response.json({ error: 'invalid_request' }, { status: 400, headers: privateHeaders })
    let parsed: unknown
    try { parsed = JSON.parse(body) } catch { return Response.json({ error: 'invalid_request' }, { status: 400, headers: privateHeaders }) }
    const token = parsed && typeof parsed === 'object' && 'token' in parsed ? parsed.token : undefined
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return Response.json({ error: 'invalid_request' }, { status: 400, headers: privateHeaders })
    const result = await verifyRemote(token)
    if (!result.ok || !result.expiresAt) return Response.json({ error: 'invalid_session' }, { status: 401, headers: privateHeaders })
    const seconds = Math.min(8 * 3600, (Date.parse(result.expiresAt) - Date.now()) / 1000)
    if (!Number.isFinite(seconds) || seconds <= 0) return Response.json({ error: 'invalid_session' }, { status: 401, headers: privateHeaders })
    return new Response(null, { status: 204, headers: { ...privateHeaders, 'Set-Cookie': cookie(token, seconds) } })
  } catch { return Response.json({ error: 'authentication_unavailable' }, { status: 503, headers: privateHeaders }) }
}

// Vercel's Fetch Web Standard export (not the legacy Node req/res handler).
export default { fetch: handler }
