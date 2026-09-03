import type { StudentState } from './store'

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => ({ ok: false, error: 'Respuesta invalida del servidor.' }))
  if (!response.ok || !data.ok) throw new Error(data.error || 'No se pudo guardar el progreso.')
  return data
}

export async function fetchRemoteProgress(sessionToken: string) {
  const response = await fetch('/api/progress', {
    headers: { Authorization: `Bearer ${sessionToken}` },
  })
  const data = await parseResponse(response)
  return data.progress as Partial<StudentState> | null
}

export async function saveRemoteProgress(sessionToken: string, state: Partial<StudentState>) {
  const response = await fetch('/api/progress', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ state }),
  })
  await parseResponse(response)
}
