import { useEffect, useMemo, useState } from 'react'
import { Check, Clipboard, KeyRound, Plus, Trash2 } from 'lucide-react'
import { useCourse } from '../course'
import { useLocale, useT } from '../i18n'
import { hasSupabase, supabase } from '../supabase'

const KEY = 'academia.admin.alumnos.v1'

type LearnerPin = {
  id: string
  name: string
  pin: string
  level: string
  goal: string
  tools: string
  notes: string
  createdAt: string
  synced?: boolean
}

const EMPTY = { name: '', goal: '', tools: '', notes: '', level: 'basico' }

function readPins(): LearnerPin[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function generatePin() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export default function Admin() {
  const course = useCourse()
  const locale = useLocale()
  const t = useT()
  const [pins, setPins] = useState<LearnerPin[]>(() => readPins())
  const [draft, setDraft] = useState(EMPTY)
  const [copied, setCopied] = useState<string | null>(null)
  const [adminPin, setAdminPin] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(pins.filter((item) => !item.synced || item.pin)))
  }, [pins])

  const suggestedTools = useMemo(
    () => course.toolPages.slice(0, 18).map((tool) => tool.label),
    [course.toolPages],
  )

  async function loadRemote(pin = adminPin) {
    if (!supabase || !pin.trim()) return
    setSyncing(true)
    setSyncMessage('')
    const { data, error } = await supabase.rpc('list_learners_admin', { admin_pin: pin.trim() })
    setSyncing(false)
    if (error) {
      setSyncMessage(locale === 'en' ? 'Could not load Supabase students. Check the admin PIN and migration.' : 'No se han podido cargar los alumnos de Supabase. Revisa el PIN admin y la migración.')
      return
    }
    setPins((data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      pin: item.pin || '',
      level: item.level,
      goal: item.goal || '',
      tools: item.tools || '',
      notes: item.notes || '',
      createdAt: item.created_at,
      synced: true,
    })))
    setSyncMessage(locale === 'en' ? 'Students loaded from Supabase with visible PINs.' : 'Alumnos cargados desde Supabase con PIN visible.')
  }

  async function createPin() {
    if (!draft.name.trim()) return
    const pin = generatePin()
    if (supabase && adminPin.trim()) {
      setSyncing(true)
      const { data, error } = await supabase.rpc('create_learner_with_pin', {
        admin_pin: adminPin.trim(),
        learner_name: draft.name.trim(),
        learner_pin: pin,
        learner_level: draft.level,
        learner_goal: draft.goal.trim(),
        learner_tools: draft.tools.trim(),
        learner_notes: draft.notes.trim(),
        learner_locale: locale,
        learner_email: null,
      })
      setSyncing(false)
      if (error) {
        setSyncMessage(locale === 'en' ? 'Could not create the student in Supabase.' : 'No se ha podido crear el alumno en Supabase.')
        return
      }
      setPins((current) => [{
        id: data.id,
        name: data.name,
        pin,
        level: data.level,
        goal: data.goal || '',
        tools: data.tools || '',
        notes: data.notes || '',
        createdAt: data.created_at,
        synced: true,
      }, ...current])
      setSyncMessage(locale === 'en' ? 'Student created in Supabase. The PIN stays visible in super admin.' : 'Alumno creado en Supabase. El PIN queda visible en súper admin.')
      setDraft(EMPTY)
      return
    }
    setPins((current) => [{
      id: `${Date.now()}-${draft.name}`,
      name: draft.name.trim(),
      pin,
      level: draft.level,
      goal: draft.goal.trim(),
      tools: draft.tools.trim(),
      notes: draft.notes.trim(),
      createdAt: new Date().toISOString(),
    }, ...current])
    setDraft(EMPTY)
  }

  function copy(value: string, id: string) {
    navigator.clipboard?.writeText(value)
    setCopied(id)
    window.setTimeout(() => setCopied(null), 1500)
  }

  async function deletePin(item: LearnerPin) {
    if (item.synced && supabase && adminPin.trim()) {
      setSyncing(true)
      const { error } = await supabase.rpc('delete_learner_admin', { admin_pin: adminPin.trim(), learner_id: item.id })
      setSyncing(false)
      if (error) {
        setSyncMessage(locale === 'en' ? 'Could not delete the student in Supabase.' : 'No se ha podido borrar el alumno en Supabase.')
        return
      }
    }
    setPins((current) => current.filter((pin) => pin.id !== item.id))
  }

  function exportPins() {
    const blob = new Blob([JSON.stringify(pins, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'alumnos-pins-academia.json'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><KeyRound size={12} /> {t('admin.controlLocal')}</span>
        <h1>{t('admin.titulo')}</h1>
        <p>
          {t('admin.descripcion')}
        </p>
      </div>

      <section className="st-admin-warning">
        <KeyRound size={15} />
        <div>
          <strong>{t('admin.avisoTitulo')}</strong>
          <p>{t('admin.avisoTexto')}</p>
        </div>
      </section>

      <section className="st-admin-sync">
        <div>
          <span className="st-kicker">{hasSupabase ? (locale === 'en' ? 'Supabase connected' : 'Supabase conectado') : (locale === 'en' ? 'Local mode' : 'Modo local')}</span>
          <h2>{locale === 'en' ? 'Student database' : 'Base de datos de alumnos'}</h2>
          <p>{hasSupabase
            ? (locale === 'en' ? 'Enter your admin PIN to load, create and delete students securely through RLS-controlled functions.' : 'Mete tu PIN admin para cargar, crear y borrar alumnos con funciones controladas por RLS.')
            : (locale === 'en' ? 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use the real database.' : 'Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para usar la base de datos real.')}</p>
        </div>
        <label>
          <span>{locale === 'en' ? 'Admin PIN' : 'PIN admin'}</span>
          <input value={adminPin} onChange={(event) => setAdminPin(event.target.value)} inputMode="numeric" placeholder="5555" />
        </label>
        <button type="button" className="st-btn-ghost" disabled={!hasSupabase || !adminPin.trim() || syncing} onClick={() => loadRemote()}>
          {syncing ? (locale === 'en' ? 'Loading...' : 'Cargando...') : (locale === 'en' ? 'Load students' : 'Cargar alumnos')}
        </button>
        {syncMessage && <small>{syncMessage}</small>}
      </section>

      <section className="st-admin-grid">
        <div className="st-admin-form">
          <div className="st-section-head">
            <div>
              <span className="st-kicker">{locale === 'en' ? 'Create student' : 'Crear alumno'}</span>
              <h2>{locale === 'en' ? 'Profile and PIN' : 'Ficha y PIN'}</h2>
            </div>
          </div>
          <label><span>{locale === 'en' ? "Student's name" : 'Nombre del alumno'}</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder={locale === 'en' ? 'E.g. Laura Pérez' : 'Ej. Laura Pérez'} /></label>
          <label><span>{locale === 'en' ? 'Main goal' : 'Objetivo principal'}</span><input value={draft.goal} onChange={(event) => setDraft({ ...draft, goal: event.target.value })} placeholder={locale === 'en' ? 'E.g. build an automation for clients' : 'Ej. montar una automatización para clientes'} /></label>
          <label><span>{locale === 'en' ? 'Starting level' : 'Nivel inicial'}</span><select value={draft.level} onChange={(event) => setDraft({ ...draft, level: event.target.value })}><option value="basico">{locale === 'en' ? 'Basic' : 'Básico'}</option><option value="intermedio">{locale === 'en' ? 'Intermediate' : 'Intermedio'}</option><option value="avanzado">{locale === 'en' ? 'Advanced' : 'Avanzado'}</option></select></label>
          <label><span>{locale === 'en' ? 'Recommended tools' : 'Herramientas recomendadas'}</span><input value={draft.tools} onChange={(event) => setDraft({ ...draft, tools: event.target.value })} placeholder={locale === 'en' ? 'E.g. ChatGPT, n8n, Nano Banana' : 'Ej. ChatGPT, n8n, Nano Banana'} /></label>
          <div className="st-admin-toolchips">
            {suggestedTools.map((tool) => (
              <button key={tool} type="button" onClick={() => setDraft({ ...draft, tools: draft.tools ? `${draft.tools}, ${tool}` : tool })}>{tool}</button>
            ))}
          </div>
          <label><span>{locale === 'en' ? 'Internal notes' : 'Notas internas'}</span><textarea rows={4} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} placeholder={locale === 'en' ? 'Restrictions, pace, questions, recommended kit...' : 'Restricciones, ritmo, dudas, kit recomendado...'} /></label>
          <button type="button" className="st-btn" onClick={createPin} disabled={!draft.name.trim() || syncing}><Plus size={13} /> {locale === 'en' ? 'Create PIN' : 'Crear PIN'}</button>
        </div>

        <aside className="st-admin-missing">
          <span className="st-kicker">{locale === 'en' ? 'What is missing to make it real' : 'Lo que falta para hacerlo real'}</span>
          <h2>{locale === 'en' ? 'Next pieces' : 'Próximas piezas'}</h2>
          <ul>
            <li>{locale === 'en' ? 'Student database with synced progress.' : 'Base de datos de alumnos y progreso sincronizado.'}</li>
            <li>{locale === 'en' ? 'Real login for administrator and student.' : 'Login real para administrador y alumno.'}</li>
            <li>{locale === 'en' ? 'Role-based permissions: student, teacher, administrator.' : 'Permisos por rol: alumno, profesor, administrador.'}</li>
            <li>{locale === 'en' ? 'PIN reset and access expiration.' : 'Restablecer PIN y caducidad de accesos.'}</li>
            <li>{locale === 'en' ? 'Activity log and per-student export.' : 'Registro de actividad y exportación por alumno.'}</li>
            <li>{locale === 'en' ? 'Consent, privacy and data policy.' : 'Consentimiento, privacidad y política de datos.'}</li>
          </ul>
        </aside>
      </section>

      <section className="st-admin-list">
        <div className="st-section-head">
          <div>
            <span className="st-kicker">{locale === 'en' ? 'Students set up' : 'Alumnos preparados'}</span>
            <h2>{locale === 'en' ? 'Local PINs' : 'PINs locales'}</h2>
          </div>
          <button type="button" className="st-btn-ghost" onClick={exportPins} disabled={!pins.length}>{locale === 'en' ? 'Export JSON' : 'Exportar JSON'}</button>
        </div>

        {pins.length ? (
          <div className="st-admin-table">
            {pins.map((item) => (
              <article key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.goal || (locale === 'en' ? 'Goal pending' : 'Objetivo pendiente')} · {locale === 'en' ? 'level' : 'nivel'} {item.level}</small>
                </div>
                <code>{item.pin || (locale === 'en' ? 'No PIN' : 'Sin PIN')}</code>
                <span>{item.tools || (locale === 'en' ? 'Tools to be defined' : 'Herramientas por definir')}</span>
                <button type="button" onClick={() => item.pin && copy(item.pin, item.id)} disabled={!item.pin}>{copied === item.id ? <Check size={13} /> : <Clipboard size={13} />}</button>
                <button type="button" onClick={() => deletePin(item)} disabled={syncing}><Trash2 size={13} /></button>
              </article>
            ))}
          </div>
        ) : (
          <div className="st-empty">
            <h2>{locale === 'en' ? 'No students yet' : 'Aún no hay alumnos'}</h2>
            <p>{locale === 'en' ? 'Create the first one with name, goal, level and recommended tools.' : 'Crea el primero con nombre, objetivo, nivel y herramientas recomendadas.'}</p>
          </div>
        )}
      </section>

      <section className="st-admin-questions">
        <span className="st-kicker">{locale === 'en' ? 'Questions worth deciding' : 'Preguntas que conviene decidir'}</span>
        <h2>{locale === 'en' ? 'For the next version' : 'Para la siguiente versión'}</h2>
        <p>{locale === 'en'
          ? 'What data each student can see, whether the PIN expires, whether you need groups/classes, what the teacher sees, what gets exported as a certificate, and where progress is stored.'
          : 'Qué datos puede ver cada alumno, si el PIN caduca, si necesitas grupos/clases, qué ve el profesor, qué se exporta como certificado y dónde se guarda el progreso.'}</p>
      </section>
    </div>
  )
}
