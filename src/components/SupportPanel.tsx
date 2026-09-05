import { useEffect, useState, type FormEvent } from 'react'
import { learnerRpc, useSession } from '../session'
import { store, useStudent } from '../store'
import { useLocale } from '../i18n'

type Ticket = { id: string; subject: string; context: string; expected: string; observed: string; status: 'open' | 'answered' | 'closed'; reply?: string; replies?: Array<{ reply: string; author: string; createdAt: string }>; createdAt: string; updatedAt: string }
export default function SupportPanel({ suggested }: { suggested?: { subject: string; context: string } }) {
  const student = useStudent()
  const session = useSession()
  const en = useLocale() === 'en'
  const draft = student.lessons['support:draft']?.notes.intermedio || {}
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const update = (key: string, value: string) => store.setNote('support:draft', 'intermedio', key, value)
  useEffect(() => {
    if (suggested) { update('subject', suggested.subject); update('context', suggested.context); setOpen(true) }
  }, [suggested])
  async function load() {
    setTickets(await learnerRpc<Ticket[]>('academy_support_list'))
  }
  async function send(event: FormEvent) {
    event.preventDefault()
    if (busy || !draft.subject?.trim() || !draft.expected?.trim() || !draft.observed?.trim()) return
    setBusy(true); setMessage('')
    try {
      await learnerRpc('academy_support_create', { request: { subject: draft.subject, context: draft.context || '', expected: draft.expected, observed: draft.observed, projectId: student.activeProjectId || '' } })
      for (const key of ['subject', 'context', 'expected', 'observed']) update(key, '')
      setMessage(en ? 'Request sent to the teaching team.' : 'Duda enviada al equipo docente.')
      try { await load() } catch { setMessage(en ? 'Request sent. Refresh the list to check replies.' : 'Duda enviada. Actualiza la lista para consultar respuestas.') }
    } catch (error) { setMessage(error instanceof Error ? error.message : (en ? 'Could not send. Your draft is kept.' : 'No se pudo enviar. Se conserva el borrador.')) }
    finally { setBusy(false) }
  }
  return <section id="support-panel" className="st-project-workspace">
    <details open={open} onToggle={event => setOpen(event.currentTarget.open)}>
      <summary><strong>{en ? 'Ask about a blocked task' : 'Consultar una tarea bloqueada'}</strong></summary>
      <p>{en ? 'Describe the step, expected outcome and actual result. Do not include passwords or private customer data. Your draft is saved; sending requires the button below and a verified session.' : 'Describe el paso, el resultado esperado y lo observado. No incluyas contraseñas ni datos privados de clientes. El borrador se guarda; el envío requiere el botón de abajo y una sesión verificada.'}</p>
      <form onSubmit={send}>
        <label>{en ? 'Question title' : 'Título de la duda'}<input aria-label={en ? 'Question title' : 'Título de la duda'} required maxLength={200} value={draft.subject || ''} onChange={e => update('subject', e.target.value)} /></label>
        <label>{en ? 'Lesson, step, project and what you tried' : 'Lección, paso, proyecto y qué has probado'}<textarea aria-label={en ? 'Lesson, step, project and what you tried' : 'Lección, paso, proyecto y qué has probado'} maxLength={4000} value={draft.context || ''} onChange={e => update('context', e.target.value)} /></label>
        <label>{en ? 'What should happen' : 'Qué debería ocurrir'}<textarea aria-label={en ? 'What should happen' : 'Qué debería ocurrir'} required maxLength={4000} value={draft.expected || ''} onChange={e => update('expected', e.target.value)} /></label>
        <label>{en ? 'What happened and the error without secrets' : 'Qué ocurrió y el error sin secretos'}<textarea aria-label={en ? 'What happened and the error without secrets' : 'Qué ocurrió y el error sin secretos'} required maxLength={4000} value={draft.observed || ''} onChange={e => update('observed', e.target.value)} /></label>
        <button type="submit" className="st-btn" disabled={busy || session.status !== 'authenticated' || !draft.subject?.trim() || !draft.expected?.trim() || !draft.observed?.trim()}>{busy ? (en ? 'Sending…' : 'Enviando…') : (en ? 'Send question to the teacher' : 'Enviar duda al profesor')}</button>
      </form>
      {session.status !== 'authenticated' && <p>{en ? 'Sign in to send. The draft stays available in your progress.' : 'Inicia sesión para enviar. El borrador queda disponible en tu progreso.'}</p>}
    </details>
    <button type="button" className="st-btn-ghost" disabled={busy || session.status !== 'authenticated'} onClick={async () => { setBusy(true); setMessage(''); try { await load(); setMessage(en ? 'Requests refreshed.' : 'Consultas actualizadas.') } catch (error) { setMessage(error instanceof Error ? error.message : 'No se pudieron cargar las consultas') } finally { setBusy(false) } }}>{en ? 'View / refresh my questions' : 'Ver / actualizar mis consultas'}</button>
    <p role="status">{message}</p>
    <ul>{tickets.map(ticket => <li key={ticket.id}><strong>{ticket.subject}</strong><p>{en ? ({ open: 'Open', answered: 'Answered', closed: 'Closed' })[ticket.status] : ({ open: 'Pendiente', answered: 'Respondida', closed: 'Cerrada' })[ticket.status]} · {new Date(ticket.createdAt).toLocaleDateString(en ? 'en-US' : 'es-ES')}</p><p>{ticket.observed}</p>{ticket.replies?.length ? ticket.replies.map((reply, index) => <blockquote key={index}><p>{reply.reply}</p><small>{reply.author} · {new Date(reply.createdAt).toLocaleDateString(en ? 'en-US' : 'es-ES')}</small></blockquote>) : ticket.reply && <blockquote>{ticket.reply}</blockquote>}</li>)}</ul>
  </section>
}
