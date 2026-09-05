import { useState, type FormEvent } from 'react'
import { restoreRemoteSession, signInWithPin } from '../session'
import { useLocale } from '../i18n'
import { store, useStudent } from '../store'

export function RecoveryDownload() {
  const student = useStudent()
  const en = useLocale() === 'en'
  const [notice, setNotice] = useState('')
  if (!Object.keys(student.lessons).length && !student.projects.length) return null
  return <section aria-label={en ? 'Work recovery' : 'Recuperación de trabajo'}>
    <p>{en ? 'Before reloading or closing this tab, download the work still available here.' : 'Antes de recargar o cerrar esta pestaña, descarga el trabajo que sigue disponible aquí.'}</p>
    <button type="button" className="st-btn-ghost" onClick={() => {
      try {
        const url = URL.createObjectURL(new Blob([store.export()], { type: 'application/json' }))
        const link = document.createElement('a'); link.href = url; link.download = 'academia-recuperacion.json'; document.body.appendChild(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
        setNotice(en ? 'Download requested. Check that the file was saved before closing this tab.' : 'Descarga solicitada. Comprueba que el archivo se ha guardado antes de cerrar esta pestaña.')
      } catch { setNotice(en ? 'The download failed. Keep this tab open and retry.' : 'La descarga ha fallado. Mantén esta pestaña abierta y vuelve a intentarlo.') }
    }}>{en ? 'Download recovery copy' : 'Descargar copia de recuperación'}</button>
    {notice && <p role="status">{notice}</p>}
  </section>
}

export default function AccessGate({ message, canRetry = false }: { message?: string; canRetry?: boolean }) {
  const locale = useLocale(), en = locale === 'en'
  const [identifier, setIdentifier] = useState(''), [pin, setPin] = useState('')
  const minimumCredentialLength = identifier.trim().toLowerCase() === 'admin' ? 4 : 10
  const [busy, setBusy] = useState(false), [error, setError] = useState('')
  async function enter(event: FormEvent) {
    event.preventDefault()
    if (busy || !identifier.trim() || !pin) return
    if (new TextEncoder().encode(pin).length > 72) { setError(en ? 'The credential must not exceed 72 UTF-8 bytes.' : 'La clave no puede superar 72 bytes UTF-8.'); return }
    setBusy(true); setError('')
    try { await signInWithPin({ identifier: identifier.trim(), pin }) }
    catch (cause) { setError(cause instanceof Error ? cause.message : en ? 'Unable to sign in.' : 'No se ha podido iniciar sesión.') }
    finally { setBusy(false); setPin('') }
  }
  return <div className="st-access"><section className="st-access-card">
    <div className="st-access-head"><span className="st-kicker">AI Professional Academy</span><div role="group" aria-label={en ? 'Language' : 'Idioma'}>{(['es','en'] as const).map(l => <button className="st-btn-ghost" type="button" key={l} aria-pressed={locale === l} onClick={() => store.setLocale(l)}>{l.toUpperCase()}</button>)}</div></div>
    <h1>{en ? 'Sign in to your workspace' : 'Entra en tu espacio de trabajo'}</h1>
    <p>{en ? 'Use the identifier and access credential provided by your teacher. Your saved work remains available when you sign out.' : 'Usa el identificador y la clave de acceso que te ha dado tu profesor. Tu trabajo guardado se conserva al cerrar sesión.'}</p>
    <form className="st-access-form" onSubmit={enter}>
      <label><span>{en ? 'Identifier' : 'Identificador'}</span><input value={identifier} onChange={e => setIdentifier(e.target.value)} autoComplete="username" minLength={3} maxLength={120} required autoFocus /></label>
      <label><span>{en ? 'Access credential' : 'Clave de acceso'}</span><input type="password" value={pin} onChange={e => setPin(e.target.value)} autoComplete="current-password" minLength={minimumCredentialLength} maxLength={72} required /></label>
      <button type="submit" className="st-btn" disabled={busy || identifier.trim().length < 3 || pin.length < minimumCredentialLength}>{busy ? (en ? 'Checking…' : 'Comprobando…') : (en ? 'Sign in' : 'Entrar')}</button>
      {(error || message) && <p className="st-access-error" role="alert">{error || message}</p>}
    </form>
    {canRetry && <button type="button" className="st-btn-ghost" disabled={busy} onClick={() => { setBusy(true); void restoreRemoteSession().finally(() => setBusy(false)) }}>{en ? 'Check connection and session again' : 'Comprobar de nuevo conexión y sesión'}</button>}
    <RecoveryDownload />
    <p>{en ? 'If you cannot access your account, ask your teacher to restore it. Never share your credential in project evidence.' : 'Si no puedes acceder, pide al profesor que restablezca tu acceso. No incluyas tu clave en las evidencias del proyecto.'}</p>
  </section></div>
}
