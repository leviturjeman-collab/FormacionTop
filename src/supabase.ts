import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase = url && anonKey
  ? createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null

export const hasSupabase = Boolean(supabase)

/** The anon key is public; every protected RPC verifies an opaque session. */
export async function academyRpc<T>(name: string, args: Record<string, unknown> = {}): Promise<T> {
  if (!supabase) throw new Error('El acceso remoto no está configurado. Contacta con el responsable de la academia.')
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 15000)
  try {
    const { data, error } = await supabase.rpc(name, args).abortSignal(controller.signal)
    if (error) {
      if (error.code === 'PGRST202' || error.code === '42883') throw new Error('El servidor necesita la migración de acceso seguro. Contacta con el administrador.')
      throw new Error(error.message === 'session_expired' ? 'La sesión ha caducado. Vuelve a entrar.' : 'No se pudo completar la operación remota. Revisa la conexión y los permisos.')
    }
    return data as T
  } finally { window.clearTimeout(timeout) }
}
