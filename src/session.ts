import { useSyncExternalStore } from 'react'
import { academyRpc, hasSupabase } from './supabase'
import { store, type StudentState } from './store'

export type SessionProfile = { id: string; name: string; role: 'learner' | 'admin'; level: 'basico' | 'intermedio' | 'avanzado'; locale: 'es' | 'en'; goal?: string; tools?: string }
type Verified = { ok: boolean; error?: string; token?: string; expiresAt?: string; profile?: SessionProfile; progress?: unknown; version?: number }
export type SessionState = { status: 'checking' | 'authenticated' | 'anonymous' | 'error'; profile?: SessionProfile; message?: string }
const TOKEN_KEY = 'academia.session.v2'
let token = ''
let state: SessionState = { status: 'checking' }
const listeners = new Set<() => void>()
let restoring: Promise<void> | undefined
let timer: number | undefined
let sessionGeneration = 0
function emit(next: SessionState) { state = next; listeners.forEach((fn) => fn()) }
function remember(value: string) {
  token = value
  try { if (value) sessionStorage.setItem(TOKEN_KEY, value); else sessionStorage.removeItem(TOKEN_KEY) } catch { /* A memory session still works. */ }
}
async function bridgeSession(value: string) {
  if (!import.meta.env.PROD) return
  const response = await fetch('/api/session', { method: value ? 'POST' : 'DELETE', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, ...(value ? { body: JSON.stringify({ token: value }) } : {}), signal: AbortSignal.timeout(10000) })
  if (!response.ok) throw new Error('No se pudo activar el acceso protegido al contenido. Revisa la configuración del servidor.')
}
async function install(result: Verified, generation: number) {
  if (!result.ok || !result.profile || !result.expiresAt) throw new Error('El servidor no ha verificado la sesión.')
  if (generation !== sessionGeneration) throw new Error('La sesión ha cambiado. Vuelve a entrar.')
  if (result.token) remember(result.token)
  await bridgeSession(token)
  if (generation !== sessionGeneration) throw new Error('La sesión ha cambiado. Vuelve a entrar.')
  const profile = result.profile
  store.enter({ id: profile.id, name: profile.name, preferredLevel: profile.level, locale: profile.locale, access: profile.role, teacher: false,
    ...(profile.goal || profile.tools ? { project: { name: profile.goal || 'Mi proyecto', goal: profile.goal || '', audience: '', problem: '', outcome: '', tools: profile.tools || '', updatedAt: new Date().toISOString() } } : {}),
  }, result.progress, result.version || 0)
  store.connectRemote({
    load: () => academyRpc<{ state: unknown; version: number }>('academy_load_progress', { session_token: token }),
    save: (progress: StudentState, version: number) => academyRpc<{ ok: boolean; version: number; conflict?: boolean }>('academy_save_progress', { session_token: token, progress_state: progress, expected_version: version }),
  })
  emit({ status: 'authenticated', profile })
  if (timer) window.clearInterval(timer)
  timer = window.setInterval(() => { void validateSession() }, 60000)
}
async function validateSession() {
  if (!token) return
  const generation = sessionGeneration
  const checkedToken = token
  try {
    const result = await academyRpc<Verified>('academy_session', { session_token: checkedToken })
    if (generation !== sessionGeneration || token !== checkedToken) return
    if (!result.ok) {
      const closed = await signOutRemoteSession()
      if (!closed) emit({ status: 'error', message: 'Sesión caducada. Tu trabajo sigue en memoria: descarga una copia de recuperación antes de cerrar esta pestaña.' })
      return
    }
    if (result.profile) emit({ status: 'authenticated', profile: result.profile })
  } catch {
    if (generation !== sessionGeneration) return
    emit({ status: 'error', message: 'No se puede verificar la sesión. Tu trabajo local se conserva; vuelve a comprobar la conexión.' })
  }
}
export async function restoreRemoteSession(): Promise<void> {
  if (restoring) return restoring
  restoring = (async () => {
    const generation = ++sessionGeneration
    if (!hasSupabase) { emit({ status: 'anonymous', message: 'Acceso remoto pendiente de configuración.' }); return }
    try { token = sessionStorage.getItem(TOKEN_KEY) || '' } catch { token = '' }
    if (!token) { emit({ status: 'anonymous' }); return }
    try {
      const result = await academyRpc<Verified>('academy_session', { session_token: token })
      if (generation !== sessionGeneration) return
      if (!result.ok) { remember(''); emit({ status: 'anonymous' }); return }
      await install(result, generation)
    } catch (error) { if (generation === sessionGeneration) emit({ status: 'error', message: error instanceof Error ? error.message : 'No se puede verificar la sesión.' }) }
  })()
  try { await restoring } finally { restoring = undefined }
}
export async function signInWithPin({ identifier, pin }: { identifier: string; pin: string }): Promise<SessionProfile> {
  const generation = ++sessionGeneration
  const result = await academyRpc<Verified>('academy_sign_in', { login_identifier: identifier.trim().toLowerCase(), login_secret: pin })
  if (!result.ok) throw new Error(result.error === 'rate_limited' ? 'Demasiados intentos. Espera 15 minutos antes de volver a intentar.' : 'Identificador o clave incorrectos, o acceso suspendido.')
  if (!result.token || !result.profile) throw new Error('Respuesta de acceso no válida.')
  await install(result, generation)
  return result.profile
}
export async function signOutRemoteSession(): Promise<boolean> {
  ++sessionGeneration
  const oldToken = token
  await store.flush()
  if (!store.canSafelyClose()) return false
  if (timer) window.clearInterval(timer)
  timer = undefined
  store.disconnectRemote()
  remember('')
  store.logout()
  emit({ status: 'anonymous' })
  try { await bridgeSession('') } catch { /* The remote token is also revoked below. */ }
  if (oldToken) { try { await academyRpc('academy_sign_out', { session_token: oldToken }) } catch { /* Server token expires even if offline. */ } }
  return true
}
export async function adminRpc<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  if (state.status !== 'authenticated' || state.profile?.role !== 'admin' || !token) throw new Error('Esta operación requiere una sesión de administrador.')
  return academyRpc<T>(action, { ...payload, session_token: token })
}
export async function learnerRpc<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  if (state.status !== 'authenticated' || !token) throw new Error('Esta operación requiere una sesión verificada.')
  return academyRpc<T>(action, { ...payload, session_token: token })
}
export function useSession(): SessionState { return useSyncExternalStore((fn) => { listeners.add(fn); return () => listeners.delete(fn) }, () => state) }
export function getSession(): SessionState { return state }
