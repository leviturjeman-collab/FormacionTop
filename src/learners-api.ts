import type { StoredLearner } from './store'

type ApiResponse<T> = {
  ok: boolean
  error?: string
} & T

export type AdminAuth = { type: 'token' | 'pin'; value: string }

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json().catch(() => ({ ok: false, error: 'Respuesta invalida del servidor.' }))
  if (!response.ok || !data.ok) throw new Error(data.error || 'No se pudo conectar con Supabase.')
  return data
}

function adminHeaders(auth: AdminAuth) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (auth.type === 'token') headers.Authorization = `Bearer ${auth.value}`
  else headers['x-admin-pin'] = auth.value
  return headers
}

export async function fetchRemoteLearners(auth: AdminAuth) {
  const response = await fetch('/api/admin/learners', { headers: adminHeaders(auth) })
  const data = await parseResponse<{ learners: StoredLearner[] }>(response)
  return data.learners
}

export async function saveRemoteLearners(auth: AdminAuth, learners: Partial<StoredLearner>[]) {
  const response = await fetch('/api/admin/learners', {
    method: 'POST',
    headers: adminHeaders(auth),
    body: JSON.stringify({ learners }),
  })
  const data = await parseResponse<{ learners: StoredLearner[] }>(response)
  return data.learners
}

export async function updateRemoteLearner(auth: AdminAuth, learner: Partial<StoredLearner> & { id: string }) {
  const response = await fetch('/api/admin/learners', {
    method: 'PATCH',
    headers: adminHeaders(auth),
    body: JSON.stringify(learner),
  })
  const data = await parseResponse<{ learners: StoredLearner[] }>(response)
  return data.learners[0]
}

export async function deleteRemoteLearner(auth: AdminAuth, id: string) {
  const response = await fetch(`/api/admin/learners?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminHeaders(auth),
  })
  await parseResponse<Record<string, never>>(response)
}

export async function unlockRemotePin(pin: string) {
  const response = await fetch('/api/auth/unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  })
  const data = await parseResponse<{
    role: 'admin' | 'learner'
    sessionToken?: string
    learner?: StoredLearner
    progress?: Record<string, unknown> | null
  }>(response)
  return data
}

export function logoutRemoteSession() {
  return fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined)
}
