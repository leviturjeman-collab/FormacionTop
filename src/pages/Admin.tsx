import { useEffect, useState } from 'react'
import { adminRpc, useSession } from '../session'
import { useLocale } from '../i18n'
import { copyText } from '../clipboard'

type Learner = { id: string; login: string; name: string; level: string; goal: string; tools: string; notes: string; locale: string; status: 'active' | 'paused' | 'archived'; enabled: boolean; expiresAt?: string | null; createdAt: string }
type Ticket = { id: string; ownerName: string; subject: string; context: string; expected: string; observed: string; status: 'open'|'answered'|'closed'; replies: { reply: string; author: string; createdAt: string }[] }
const EMPTY = { login: '', name: '', level: 'basico', goal: '', tools: '', notes: '', locale: 'es', status: 'active', expiresAt: '' }

export default function Admin() {
  const session = useSession()
  const locale = useLocale()
  const tr = (es: string, en: string) => locale === 'en' ? en : es
  const [learners, setLearners] = useState<Learner[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [answers, setAnswers] = useState<Record<string, {reply: string; status: Ticket['status']}>>({})
  const [draft, setDraft] = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [issued, setIssued] = useState<{ login: string; secret: string } | null>(null)
  const authorized = session.status === 'authenticated' && session.profile?.role === 'admin'
  async function load() { setLearners(await adminRpc<Learner[]>('academy_admin_learners')) }
  async function loadSupport() { setTickets(await adminRpc<Ticket[]>('academy_support_list')) }
  async function act(operation: () => Promise<void>) {
    if (busy) return
    setBusy(true); setMessage('')
    try { await operation() } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudo completar la operación.') }
    finally { setBusy(false) }
  }
  useEffect(() => {
    // Purge the old plaintext cache; the replacement keeps records in memory.
    try { localStorage.removeItem('academia.admin.alumnos.v1') } catch { /* No cache is required. */ }
    if (authorized) void act(load)
    else { setLearners([]); setTickets([]); setAnswers({}); setIssued(null) }
  }, [authorized])

  useEffect(() => { if (issued) document.getElementById('issued-pin')?.scrollIntoView({ block: 'center', behavior: 'smooth' }) }, [issued])

  if (!authorized) return <div className="st-page"><h1>{tr('Acceso restringido', 'Restricted access')}</h1><p>{tr('La gestión de alumnos requiere una sesión de administrador verificada.', 'Student management requires a verified administrator session.')}</p></div>

  async function save() {
    await act(async () => {
      if (editing) {
        await adminRpc('academy_admin_update', { learner_id: editing, changes: draft })
        setMessage(tr('Ficha actualizada.', 'Profile updated.'))
      } else {
        const result = await adminRpc<{ pin: string }>('academy_admin_issue_learner', { learner: draft })
        setIssued({ login: draft.name, secret: result.pin })
        setMessage(tr('Alumno creado. Entrega su PIN; podrás consultarlo desde su ficha.', 'Student created. Deliver their PIN; you can view it again from their profile.'))
      }
      setDraft(EMPTY); setEditing(null); await load()
    })
  }
  async function changeStatus(learner: Learner, status: Learner['status']) {
    if (!window.confirm(tr(`${status === 'active' ? 'Reactivar' : status === 'paused' ? 'Suspender' : 'Archivar'} el acceso de ${learner.name}? Su trabajo se conservará.`, `${status === 'active' ? 'Reactivate' : status === 'paused' ? 'Suspend' : 'Archive'} access for ${learner.name}? Their work will be preserved.`))) return
    await act(async () => { await adminRpc('academy_admin_update', { learner_id: learner.id, changes: { status } }); await load(); setMessage(tr('Estado actualizado en el servidor.', 'Status updated on the server.')) })
  }
  async function resetSecret(learner: Learner) {
    if (!window.confirm(tr(`Restablecer la clave de ${learner.name}? Sus sesiones abiertas dejarán de ser válidas.`, `Reset the credential for ${learner.name}? Their current sessions will be revoked.`))) return
    await act(async () => { const result = await adminRpc<{ pin: string }>('academy_admin_issue_pin', { learner_id: learner.id }); setIssued({ login: learner.name, secret: result.pin }); await load(); setMessage(tr('Clave restablecida. Entrega la nueva clave por un canal adecuado.', 'Credential reset. Deliver it through an appropriate channel.')) })
  }
  function exportLearners() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), learners }, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = 'alumnos-sin-credenciales.json'; a.click(); URL.revokeObjectURL(url)
  }
  return <div className="st-page st-admin-page">
    <div className="st-page-title"><span className="st-kicker">{tr('Administración', 'Administration')}</span><h1>{tr('Alumnos y acceso', 'Students and access')}</h1><p>{tr('Perfiles remotos, credenciales individuales y cambios verificados por el servidor. Suspender y archivar conservan el trabajo del alumno.', 'Remote profiles, individual credentials and server-verified changes. Suspending or archiving preserves student work.')}</p></div>
    <div className="st-actions"><button type="button" className="st-btn-ghost" disabled={busy} onClick={() => void act(load)}>{tr('Actualizar alumnos', 'Refresh students')}</button><button type="button" className="st-btn-ghost" disabled={busy || !learners.length} onClick={exportLearners}>{tr('Exportar fichas sin claves', 'Export profiles without credentials')}</button></div>
    <p role="status" aria-live="polite">{busy ? tr('Comprobando operación…', 'Checking operation…') : message}</p>
    {issued && <section id="issued-pin" className="st-panel" aria-label={tr('Credencial recién creada', 'New credential')}><h2>{tr('PIN de acceso', 'Access PIN')}: {issued.login}</h2><p>{tr('Puedes consultar este PIN desde el panel del profesor. No se incluye en las exportaciones.', 'You can view this PIN from the teacher panel. It is excluded from exports.')}</p><input aria-label={tr('Clave inicial', 'Initial credential')} readOnly value={issued.secret} onFocus={(event) => event.currentTarget.select()} /><div className="st-actions"><button type="button" className="st-btn-ghost" onClick={() => void act(async () => { await copyText(issued.secret); setMessage(tr('Credencial copiada. Entrégala solo a su destinatario.', 'Credential copied. Deliver it only to its recipient.')) })}>{tr('Copiar acceso', 'Copy access')}</button><button type="button" className="st-btn-ghost" onClick={() => setIssued(null)}>{tr('Ya la he entregado: ocultar', 'Delivered: hide credential')}</button></div></section>}
    <section className="st-panel"><h2>{editing ? tr('Editar ficha', 'Edit profile') : tr('Crear alumno', 'Create student')}</h2><form onSubmit={(event) => { event.preventDefault(); void save() }}>
      <label>{tr('Nombre', 'Name')}<input value={draft.name} required maxLength={120} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
      <label>{tr('Nivel', 'Level')}<select value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })}><option value="basico">{tr('Básico', 'Basic')}</option><option value="intermedio">{tr('Intermedio', 'Intermediate')}</option><option value="avanzado">{tr('Avanzado', 'Advanced')}</option></select></label>
      <label>{tr('Idioma', 'Language')}<select value={draft.locale} onChange={(e) => setDraft({ ...draft, locale: e.target.value })}><option value="es">Español</option><option value="en">English</option></select></label>
      <label>{tr('Caducidad del acceso (UTC, opcional)', 'Access deadline (UTC, optional)')}<input type="datetime-local" value={draft.expiresAt ? draft.expiresAt.slice(0, 16) : ''} onChange={(e) => setDraft({ ...draft, expiresAt: e.target.value ? `${e.target.value}:00Z` : '' })} /></label>
      <label>{tr('Objetivo', 'Goal')}<input value={draft.goal} maxLength={4000} onChange={(e) => setDraft({ ...draft, goal: e.target.value })} /></label>
      <label>{tr('Herramientas', 'Tools')}<input value={draft.tools} maxLength={2000} onChange={(e) => setDraft({ ...draft, tools: e.target.value })} /></label>
      <label>{tr('Notas internas', 'Internal notes')}<textarea value={draft.notes} maxLength={4000} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></label>
      <div className="st-actions"><button type="submit" className="st-btn" disabled={busy || !draft.name.trim()}>{editing ? tr('Guardar ficha', 'Save profile') : tr('Crear alumno y código', 'Create student and code')}</button>{editing && <button type="button" className="st-btn-ghost" onClick={() => { setEditing(null); setDraft(EMPTY) }}>{tr('Cancelar edición', 'Cancel editing')}</button>}</div>
    </form></section>
    <section className="st-panel"><h2>{tr('Alumnos', 'Students')} ({learners.filter(learner => showArchived || learner.status !== 'archived').length})</h2><label><input type="checkbox" checked={showArchived} onChange={event => setShowArchived(event.target.checked)} />{tr('Mostrar alumnos archivados', 'Show archived students')}</label>{!learners.length && !busy && <p>{tr('No hay alumnos cargados. Crea uno o vuelve a actualizar.', 'No students loaded. Create one or refresh the list.')}</p>}
      {learners.filter(learner => showArchived || learner.status !== 'archived').map((learner) => <article key={learner.id} className="st-block"><h3>{learner.name}</h3><p>{learner.level} · {learner.status}{!learner.enabled ? tr(' · necesita restablecer clave', ' · credential reset required') : ''}{learner.expiresAt ? ` · ${tr('caduca', 'expires')} ${new Date(learner.expiresAt).toLocaleString(locale)}` : ''}</p><p>{learner.goal}</p><div className="st-actions">
        <button type="button" className="st-btn-ghost" disabled={busy} onClick={() => { setEditing(learner.id); setDraft({ login: learner.login, name: learner.name, level: learner.level, goal: learner.goal, tools: learner.tools, notes: learner.notes, locale: learner.locale, status: learner.status, expiresAt: learner.expiresAt ? new Date(learner.expiresAt).toISOString() : '' }) }}>{tr('Editar', 'Edit')} {learner.name}</button>
        <button type="button" className="st-btn-ghost" disabled={busy} onClick={() => void act(async () => { setIssued(null); const result = await adminRpc<{pin: string | null}>('academy_admin_reveal_pin', {learner_id: learner.id}); if (result.pin) setIssued({login: learner.name, secret: result.pin}); else setMessage(tr('Este acceso antiguo no tiene un PIN recuperable. Usa Restablecer clave para generar uno nuevo.', 'This older credential cannot be recovered. Reset it to issue a new PIN.')) })}>{tr('Ver PIN de', 'View PIN for')} {learner.name}</button>
        <button type="button" className="st-btn-ghost" disabled={busy} onClick={() => void resetSecret(learner)}>{tr('Restablecer clave de', 'Reset credential for')} {learner.name}</button>
        <button type="button" className="st-btn-ghost" disabled={busy} onClick={() => void changeStatus(learner, learner.status === 'active' ? 'paused' : 'active')}>{learner.status === 'active' ? tr('Suspender', 'Suspend') : tr('Reactivar', 'Reactivate')} {learner.name}</button>
        {learner.status !== 'archived' && <button type="button" className="st-btn-ghost" disabled={busy} onClick={() => void changeStatus(learner, 'archived')}>{tr('Archivar', 'Archive')} {learner.name}</button>}
      </div></article>)}
    </section>
    <section className="st-panel"><h2>{tr('Dudas de los alumnos', 'Student support')}</h2>
      <p>{tr('Carga la cola para revisar las consultas enviadas desde Preguntas frecuentes. Las respuestas quedan guardadas para el alumno.', 'Load the queue to review questions sent from FAQ. Replies are saved for the student.')}</p>
      <button type="button" className="st-btn-ghost" disabled={busy} onClick={() => void act(loadSupport)}>{tr('Cargar y actualizar consultas', 'Load and refresh requests')}</button>
      {tickets.map(ticket => <article className="st-block" key={ticket.id}><h3>{ticket.subject}</h3><p>{ticket.ownerName} · {ticket.status}</p>
        <p>{tr('Contexto', 'Context')}: {ticket.context}</p><p>{tr('Esperaba', 'Expected')}: {ticket.expected}</p><p>{tr('Ocurrió', 'Observed')}: {ticket.observed}</p>
        {ticket.replies.map((item, index) => <blockquote key={index}><p>{item.reply}</p><footer>{item.author} · {new Date(item.createdAt).toLocaleString(locale)}</footer></blockquote>)}
        <form onSubmit={event => { event.preventDefault(); const answer = answers[ticket.id]; if (!answer?.reply.trim()) return; void act(async () => { await adminRpc('academy_support_reply', {request_id: ticket.id, ...answer}); setAnswers(current => { const copy = {...current}; delete copy[ticket.id]; return copy }); await loadSupport(); setMessage(tr('Respuesta guardada para el alumno.', 'Reply saved for the student.')) }) }}>
          <label>{tr('Respuesta', 'Reply')}<textarea required maxLength={4000} value={answers[ticket.id]?.reply || ''} onChange={event => setAnswers(current => ({...current, [ticket.id]: {status: current[ticket.id]?.status || 'answered', reply: event.target.value}}))} /></label>
          <label>{tr('Estado después de responder', 'Status after reply')}<select value={answers[ticket.id]?.status || 'answered'} onChange={event => setAnswers(current => ({...current, [ticket.id]: {reply: current[ticket.id]?.reply || '', status: event.target.value as Ticket['status']}}))}><option value="answered">{tr('Respondida', 'Answered')}</option><option value="open">{tr('Abierta', 'Open')}</option><option value="closed">{tr('Cerrada', 'Closed')}</option></select></label>
          <button type="submit" className="st-btn" disabled={busy || !answers[ticket.id]?.reply.trim()}>{tr('Guardar respuesta', 'Save reply')}</button>
        </form>
      </article>)}
    </section>
  </div>
}
