export const SESSION_COOKIE = '__Host-academia-session'
export function readSessionCookie(request: Request): string {
  const cookies = request.headers.get('cookie') || ''
  const found = cookies.split(';').map((v) => v.trim()).find((v) => v.startsWith(`${SESSION_COOKIE}=`))
  const token = found?.slice(SESSION_COOKIE.length + 1) || ''
  return /^[a-f0-9]{64}$/.test(token) ? token : ''
}
export function cookie(value: string, seconds: number): string {
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.max(0, Math.floor(seconds))}`
}
export async function verifyRemote(token: string): Promise<{ ok: boolean; expiresAt?: string }> {
  if (!/^[a-f0-9]{64}$/.test(token)) return { ok: false }
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Access service unavailable')
  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/academy_authorize`, {
    method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_token: token }), signal: AbortSignal.timeout(8000), cache: 'no-store',
  })
  if (!response.ok) throw new Error('Access service unavailable')
  const result = await response.json()
  return result?.ok === true && typeof result.expiresAt === 'string' && Date.parse(result.expiresAt) > Date.now() ? result : { ok: false }
}
export const privateHeaders = { 'Cache-Control': 'private, no-store, max-age=0', 'CDN-Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store', 'Vary': 'Cookie', 'X-Content-Type-Options': 'nosniff' }

export async function authorizeContent(request: Request): Promise<Response | null> {
  const token = readSessionCookie(request)
  if (!token) return Response.json({ error: 'authentication_required' }, { status: 401, headers: privateHeaders })
  try {
    const result = await verifyRemote(token)
    if (!result.ok) return Response.json({ error: 'session_expired' }, { status: 401, headers: { ...privateHeaders, 'Set-Cookie': cookie('', 0) } })
    return null
  } catch { return Response.json({ error: 'authentication_unavailable' }, { status: 503, headers: privateHeaders }) }
}
