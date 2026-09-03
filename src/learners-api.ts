import type { StoredLearner } from './store'

type ApiResponse<T> = {
  ok: boolean
  error?: string
} & T

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json().catch(() => ({ ok: false, error: 'Respuesta invalida del servidor.' }))
  if (!response.ok || !data.ok) throw new Error(data.error || 'No se pudo conectar con Supabase.')
  return data
}

function adminHeaders(adminPin: string) {
  return {
    'Content-Type': 'application/json',
    'x-admin-pin': adminPin,
  }
}

export async function fetchRemoteLearners(adminPin: string) {
  const response = await fetch('/api/admin/learners', { headers: adminHeaders(adminPin) })
  const data = await parseResponse<{ learners: StoredLearner[] }>(response)
  return data.learners
}

export async function saveRemoteLearners(adminPin: string, learners: Partial<StoredLearner>[]) {
  const response = await fetch('/api/admin/learners', {
    method: 'POST',
    headers: adminHeaders(adminPin),
    body: JSON.stringify({ learners }),
  })
  const data = await parseResponse<{ learners: StoredLearner[] }>(response)
  return data.learners
}

export async function updateRemoteLearner(adminPin: string, learner: Partial<StoredLearner> & { id: string }) {
  const response = await fetch('/api/admin/learners', {
    method: 'PATCH',
    headers: adminHeaders(adminPin),
    body: JSON.stringify(learner),
  })
  const data = await parseResponse<{ learners: StoredLearner[] }>(response)
  return data.learners[0]
}

export async function deleteRemoteLearner(adminPin: string, id: string) {
  const response = await fetch(`/api/admin/learners?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminHeaders(adminPin),
  })
  await parseResponse<Record<string, never>>(response)
}

export async function unlockRemotePin(pin: string) {
  const response = await fetch('/api/auth/unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  })
  const data = await parseResponse<{ role: 'admin' | 'learner'; learner?: StoredLearner }>(response)
  return data
}
