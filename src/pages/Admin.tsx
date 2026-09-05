import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Check, Clipboard, KeyRound, Lock, Mail, Plus, RefreshCw, Trash2, Upload, UserCheck } from 'lucide-react'
import { useCourse } from '../course'
import {
  ADMIN_LEARNERS_BACKUP_KEY,
  ADMIN_LEARNERS_EVENT,
  ADMIN_LEARNERS_KEY,
  generateLearnerPin,
  getAdminAuthForSession,
  readAdminLearners,
  store,
  type LearnerStatus,
  type StoredLearner,
  useStudent,
  writeAdminLearners,
} from '../store'
import { deleteRemoteLearner, fetchRemoteLearners, saveRemoteLearners, unlockRemotePin } from '../learners-api'

type AdminTab = 'estado' | 'crear' | 'alumnos' | 'pendiente'

const ADMIN_TABS: { id: AdminTab; label: string }[] = [
  { id: 'estado', label: 'Estado del curso' },
  { id: 'crear', label: 'Crear alumno' },
  { id: 'alumnos', label: 'Alumnos y PINs' },
  { id: 'pendiente', label: 'Pendiente real' },
]

type LearnerPin = StoredLearner

const STATUS_LABELS: Record<LearnerStatus, string> = {
  pendiente: 'Sin entregar',
  entregado: 'PIN entregado',
  activo: 'Alumno activo',
}

function emptyDraft(pins: LearnerPin[] = []) {
  return { name: '', email: '', pin: generateLearnerPin(pins), goal: '', tools: '', notes: '', level: 'basico' }
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function mergeLearners(primary: LearnerPin[], secondary: LearnerPin[]) {
  const merged = [...primary]
  secondary.forEach((incoming) => {
    const index = merged.findIndex(
      (item) => item.id === incoming.id || item.email.toLowerCase() === incoming.email.toLowerCase() || item.pin === incoming.pin,
    )
    if (index < 0) {
      merged.push(incoming)
      return
    }
    const stableId = merged[index].id
    const currentDate = Date.parse(merged[index].updatedAt || merged[index].createdAt || '')
    const incomingDate = Date.parse(incoming.updatedAt || incoming.createdAt || '')
    merged[index] = incomingDate > currentDate
      ? { ...merged[index], ...incoming, id: stableId }
      : { ...incoming, ...merged[index], id: stableId }
  })
  return merged
}

export default function Admin() {
  const student = useStudent()
  if (!student.adminUnlocked) return <AdminAccess />
  return <AdminPanel />
}

function AdminAccess() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setChecking(true)
    try {
      const result = await unlockRemotePin(pin)
      if (result.role === 'admin') {
        store.unlockAdmin(pin, result.sessionToken)
        return
      }
    } catch {
      // Sin respuesta del servidor no se abre el panel. El respaldo local que
      // habia aqui aceptaba cualquier PIN desde que la comprobacion dejo de
      // hacerse en el navegador.
      setError('No se ha podido comprobar el PIN. Revisa la conexión.')
      setPin('')
      return
    } finally {
      setChecking(false)
    }
    setError('PIN incorrecto.')
    setPin('')
  }

  return (
    <div className="st-page">
      <section className="st-admin-login" aria-label="Acceso privado al súper administrador">
        <div>
          <span className="st-kicker"><Lock size={12} /> Acceso privado</span>
          <h1>Súper administrador</h1>
          <p>Introduce tu PIN para abrir el panel. Los alumnos no ven el acceso directo de Súper admin en el menú.</p>
        </div>
        <form onSubmit={submit}>
          <label>
            <span>PIN de administrador</span>
            <input
              autoFocus
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(event) => {
                setError('')
                setPin(event.target.value.replace(/\D/g, '').slice(0, 4))
              }}
              placeholder="••••"
              type="password"
            />
          </label>
          {error && <p className="st-admin-field-error">{error}</p>}
          <button type="submit" className="st-btn" disabled={pin.length !== 4 || checking}>
            <KeyRound size={13} /> {checking ? 'Comprobando' : 'Entrar'}
          </button>
        </form>
      </section>
    </div>
  )
}

function AdminPanel() {
  const course = useCourse()
  const [pins, setPins] = useState<LearnerPin[]>(() => readAdminLearners())
  const [draft, setDraft] = useState(() => emptyDraft(readAdminLearners()))
  const [copied, setCopied] = useState<string | null>(null)
  const [tab, setTab] = useState<AdminTab>('estado')
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const [syncing, setSyncing] = useState(false)
  const importInputRef = useRef<HTMLInputElement>(null)

  async function syncWithSupabase() {
    const adminAuth = getAdminAuthForSession()
    if (!adminAuth) {
      setNotice('Vuelve a entrar con tu PIN de administrador para sincronizar Supabase.')
      return
    }

    setSyncing(true)
    try {
      const localLearners = readAdminLearners()
      const remoteLearners = await fetchRemoteLearners(adminAuth)
      const merged = writeAdminLearners(mergeLearners(remoteLearners, localLearners))
      setPins(merged)
      setDraft((current) => ({ ...current, pin: generateLearnerPin(merged) }))

      if (merged.length) {
        await saveRemoteLearners(adminAuth, merged)
        const refreshed = await fetchRemoteLearners(adminAuth)
        const synced = writeAdminLearners(mergeLearners(refreshed, merged))
        setPins(synced)
        setDraft((current) => ({ ...current, pin: generateLearnerPin(synced) }))
      }

      setNotice(`Supabase sincronizado. ${merged.length} alumnos guardados en la base de datos.`)
    } catch {
      setNotice('No pude sincronizar con Supabase. Revisa variables de Vercel y que la tabla learners exista.')
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    const syncLearners = () => setPins(readAdminLearners())
    const syncFromEvent = (event: Event) => {
      const detail = (event as CustomEvent<LearnerPin[]>).detail
      setPins(Array.isArray(detail) ? detail : readAdminLearners())
    }
    const syncFromStorage = (event: StorageEvent) => {
      if (event.key === ADMIN_LEARNERS_KEY || event.key === ADMIN_LEARNERS_BACKUP_KEY) syncLearners()
    }

    window.addEventListener(ADMIN_LEARNERS_EVENT, syncFromEvent)
    window.addEventListener('storage', syncFromStorage)
    return () => {
      window.removeEventListener(ADMIN_LEARNERS_EVENT, syncFromEvent)
      window.removeEventListener('storage', syncFromStorage)
    }
  }, [])

  useEffect(() => {
    syncWithSupabase()
  }, [])

  const suggestedTools = useMemo(
    () => course.toolPages.slice(0, 18).map((tool) => tool.label),
    [course.toolPages],
  )
  const mainLessons = useMemo(() => (course.curso || []).filter((lesson) => !lesson.tool), [course.curso])
  const blocksWithoutMainRoute = useMemo(
    () => course.stages.filter((stage) => !mainLessons.some((lesson) => lesson.stageId === stage.id)),
    [course.stages, mainLessons],
  )
  const learnerStats = useMemo(() => ({
    total: pins.length,
    pending: pins.filter((item) => item.status === 'pendiente').length,
    delivered: pins.filter((item) => item.status === 'entregado').length,
    active: pins.filter((item) => item.status === 'activo').length,
  }), [pins])
  const filteredPins = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return pins
    return pins.filter((item) =>
      [item.name, item.email, item.pin, item.goal, item.tools, STATUS_LABELS[item.status]]
        .join(' ')
        .toLowerCase()
        .includes(text),
    )
  }, [pins, query])
  const emailTaken = pins.some((item) => item.email.toLowerCase() === draft.email.trim().toLowerCase())
  const pinTaken = pins.some((item) => item.pin === draft.pin)
  const pinValid = /^\d{6}$/.test(draft.pin)
  const canCreate = draft.name.trim() && validEmail(draft.email) && pinValid && !emailTaken && !pinTaken

  function savePins(next: Partial<LearnerPin>[]) {
    const saved = writeAdminLearners(next)
    setPins(saved)
    return saved
  }

  async function createPin() {
    if (!canCreate) return
    const learner = {
      id: `${Date.now()}-${draft.name}`,
      name: draft.name.trim(),
      email: draft.email.trim().toLowerCase(),
      pin: draft.pin,
      level: draft.level,
      goal: draft.goal.trim(),
      tools: draft.tools.trim(),
      notes: draft.notes.trim(),
      status: 'pendiente' as LearnerStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const next = [learner, ...pins]
    const saved = savePins(next)
    setDraft(emptyDraft(saved))
    const adminAuth = getAdminAuthForSession()
    if (!adminAuth) {
      setNotice('Alumno guardado en este navegador. Vuelve a entrar con tu PIN de administrador para sincronizarlo con Supabase.')
      return
    }
    try {
      const remote = await saveRemoteLearners(adminAuth, [learner])
      const merged = savePins(mergeLearners(remote, saved))
      setDraft(emptyDraft(merged))
      setNotice('Alumno guardado en Supabase. Ese PIN ya funciona en la entrada normal.')
    } catch {
      setNotice('Alumno guardado localmente, pero Supabase no respondio. Revisa que la tabla learners exista.')
    }
  }

  function copy(value: string, id: string) {
    navigator.clipboard?.writeText(value)
    setCopied(id)
    window.setTimeout(() => setCopied(null), 1500)
  }

  function accessText(item: LearnerPin) {
    return `Acceso a la formación\nEmail: ${item.email}\nPIN: ${item.pin}`
  }

  async function cycleStatus(id: string) {
    const saved = savePins(pins.map((item) => {
      if (item.id !== id) return item
      const status: LearnerStatus = item.status === 'pendiente' ? 'entregado' : item.status === 'entregado' ? 'activo' : 'pendiente'
      return { ...item, status, updatedAt: new Date().toISOString() }
    }))
    const updated = saved.find((item) => item.id === id)
    const adminAuth = getAdminAuthForSession()
    if (!updated || !adminAuth) return
    try {
      const remote = await saveRemoteLearners(adminAuth, [updated])
      savePins(mergeLearners(remote, saved))
      setNotice('Estado sincronizado con Supabase.')
    } catch {
      setNotice('Estado guardado localmente, pero no se pudo sincronizar con Supabase.')
    }
  }

  async function deletePin(item: LearnerPin) {
    if (!window.confirm(`Borrar a ${item.name} y su PIN ${item.pin}?`)) return
    const saved = savePins(pins.filter((pin) => pin.id !== item.id))
    setDraft((current) => ({ ...current, pin: generateLearnerPin(saved) }))
    const adminAuth = getAdminAuthForSession()
    if (!adminAuth) {
      setNotice('Alumno borrado en este navegador. Vuelve a entrar con tu PIN de administrador para sincronizar Supabase.')
      return
    }
    try {
      await deleteRemoteLearner(adminAuth, item.id)
      setNotice('Alumno borrado tambien en Supabase.')
    } catch {
      setNotice('Alumno borrado localmente, pero Supabase no confirmo el borrado.')
    }
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
    setNotice('Copia JSON descargada. Guárdala por si el navegador borra datos del sitio.')
  }

  function importPins(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '[]'))
        if (!Array.isArray(parsed)) throw new Error('El archivo no contiene una lista.')
        const merged = [...pins]
        parsed.forEach((value) => {
          if (!value || typeof value !== 'object') return
          const incoming = value as Partial<LearnerPin>
          const email = incoming.email?.trim().toLowerCase()
          const index = email ? merged.findIndex((item) => item.email.toLowerCase() === email) : -1
          if (index >= 0) {
            merged[index] = { ...merged[index], ...incoming, email: email || merged[index].email }
          } else {
            merged.push(incoming as LearnerPin)
          }
        })
        const saved = savePins(merged)
        setDraft(emptyDraft(saved))
        const adminAuth = getAdminAuthForSession()
        if (adminAuth) {
          saveRemoteLearners(adminAuth, saved)
            .then((remote) => {
              const synced = savePins(mergeLearners(remote, saved))
              setDraft(emptyDraft(synced))
              setNotice(`Importados y sincronizados ${synced.length} alumnos. Sus PINs ya funcionan en la entrada normal.`)
            })
            .catch(() => setNotice('Importados localmente, pero Supabase no respondio.'))
        } else {
          setNotice(`Importados ${saved.length} alumnos en este navegador. Vuelve a entrar con tu PIN de administrador para sincronizar Supabase.`)
        }
      } catch {
        setNotice('No pude importar ese JSON. Usa el archivo exportado desde este panel.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><KeyRound size={12} /> Control local</span>
        <h1>Súper administrador</h1>
        <p>
          Panel para preparar alumnos, email, PIN de seis dígitos, objetivo y herramientas recomendadas. Esta primera versión vive en tu navegador:
          sirve para organizar, no como autenticación real de servidor.
        </p>
        <button type="button" className="st-btn-ghost" onClick={() => store.lockLearner()}>
          <Lock size={12} /> Salir del súper administrador
        </button>
      </div>

      <section className="st-admin-warning">
        <KeyRound size={15} />
        <div>
          <strong>Importante antes de usarlo con alumnos reales</strong>
          <p>Un PIN guardado en una web estática no protege datos por sí solo. Para acceso real hacen falta backend, base de datos, sesiones, permisos y registro de auditoría.</p>
        </div>
      </section>

      <section className="st-admin-storage">
        <Lock size={15} />
        <div>
          <strong>Los alumnos y PINs quedan guardados en este navegador</strong>
          <p>Se guardan en Supabase y queda una copia local de seguridad en este navegador. Si ves alumnos aquí pero no en Supabase, pulsa sincronizar.</p>
          <button type="button" className="st-btn-ghost" onClick={syncWithSupabase} disabled={syncing}>
            <RefreshCw size={13} /> {syncing ? 'Sincronizando' : 'Sincronizar Supabase'}
          </button>
          {syncing && <small>Sincronizando con Supabase...</small>}
          {notice && <small>{notice}</small>}
        </div>
      </section>

      <nav className="st-admin-tabs" aria-label="Tabs de súper administrador">
        {ADMIN_TABS.map((item) => (
          <button key={item.id} type="button" className={tab === item.id ? 'on' : ''} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>

      {tab === 'estado' && (
        <section className="st-admin-status">
          <div><span>Ruta principal</span><strong>{mainLessons.length}</strong><small>lecciones que el alumno debe seguir en orden.</small></div>
          <div><span>Biblioteca</span><strong>{course.stats.lessons}</strong><small>lecciones de consulta, no obligatorias.</small></div>
          <div><span>Herramientas</span><strong>{course.toolPages.length}</strong><small>fichas, prompts, automatizaciones y guías.</small></div>
          <div><span>Kits</span><strong>{course.stats.kits}</strong><small>proyectos institucionales listos para adaptar.</small></div>
          <div><span>Workflows</span><strong>{course.stats.workflows}</strong><small>flujos generados/importables que aún requieren credenciales.</small></div>
          <div><span>Bloques pendientes</span><strong>{blocksWithoutMainRoute.length}</strong><small>con biblioteca, pero sin ruta principal curada.</small></div>
          <div><span>Alumnos guardados</span><strong>{learnerStats.total}</strong><small>{learnerStats.pending} sin entregar · {learnerStats.delivered} con PIN · {learnerStats.active} activos.</small></div>
        </section>
      )}

      {tab === 'crear' && (
      <section className="st-admin-grid">
        <div className="st-admin-form">
          <div className="st-section-head">
            <div>
              <span className="st-kicker">Crear alumno</span>
              <h2>Ficha y PIN</h2>
            </div>
          </div>
          <label><span>Nombre del alumno</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ej. Laura Pérez" /></label>
          <label><span>Email del alumno</span><input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} placeholder="laura@email.com" /></label>
          <div className="st-admin-pin-row">
            <label><span>PIN de 6 dígitos</span><input inputMode="numeric" maxLength={6} value={draft.pin} onChange={(event) => setDraft({ ...draft, pin: event.target.value.replace(/\D/g, '').slice(0, 6) })} placeholder="123456" /></label>
            <button type="button" className="st-btn-ghost" onClick={() => setDraft({ ...draft, pin: generateLearnerPin(pins) })}><RefreshCw size={13} /> Generar</button>
          </div>
          {draft.email && !validEmail(draft.email) && <p className="st-admin-field-error">El email no tiene formato válido.</p>}
          {emailTaken && <p className="st-admin-field-error">Ese email ya está guardado en alumnos.</p>}
          {draft.pin && !pinValid && <p className="st-admin-field-error">El PIN debe tener exactamente 6 dígitos.</p>}
          {pinTaken && <p className="st-admin-field-error">Ese PIN ya existe. Genera otro.</p>}
          <label><span>Objetivo principal</span><input value={draft.goal} onChange={(event) => setDraft({ ...draft, goal: event.target.value })} placeholder="Ej. montar una automatización para clientes" /></label>
          <label><span>Nivel inicial</span><select value={draft.level} onChange={(event) => setDraft({ ...draft, level: event.target.value })}><option value="basico">Básico</option><option value="intermedio">Intermedio</option><option value="avanzado">Avanzado</option></select></label>
          <label><span>Herramientas recomendadas</span><input value={draft.tools} onChange={(event) => setDraft({ ...draft, tools: event.target.value })} placeholder="Ej. ChatGPT, n8n, Nano Banana" /></label>
          <div className="st-admin-toolchips">
            {suggestedTools.map((tool) => (
              <button key={tool} type="button" onClick={() => setDraft({ ...draft, tools: draft.tools ? `${draft.tools}, ${tool}` : tool })}>{tool}</button>
            ))}
          </div>
          <label><span>Notas internas</span><textarea rows={4} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} placeholder="Restricciones, ritmo, dudas, kit recomendado..." /></label>
          <button type="button" className="st-btn" onClick={createPin} disabled={!canCreate}><Plus size={13} /> Guardar alumno y PIN</button>
        </div>

        <aside className="st-admin-missing">
          <span className="st-kicker">Uso recomendado</span>
          <h2>Flujo de alta</h2>
          <ul>
            <li>Escribes nombre y email real del alumno.</li>
            <li>Generas o defines un PIN de seis dígitos.</li>
            <li>Guardas la ficha con nivel, objetivo y herramientas.</li>
            <li>Copias el acceso y se lo mandas al alumno.</li>
            <li>Marcas el estado como PIN entregado o alumno activo.</li>
            <li>Exportas JSON para conservar una copia fuera del navegador.</li>
          </ul>
        </aside>
      </section>
      )}

      {tab === 'alumnos' && (
      <section className="st-admin-list">
        <div className="st-section-head">
          <div>
            <span className="st-kicker">Alumnos preparados</span>
            <h2>PINs locales</h2>
          </div>
          <div className="st-admin-actions">
            <input
              ref={importInputRef}
              accept="application/json"
              type="file"
              onChange={importPins}
              hidden
            />
            <button type="button" className="st-btn-ghost" onClick={() => importInputRef.current?.click()}>
              <Upload size={13} /> Importar JSON
            </button>
            <button type="button" className="st-btn-ghost" onClick={exportPins} disabled={!pins.length}>Exportar JSON</button>
          </div>
        </div>
        <div className="st-admin-learner-summary">
          <div><strong>{learnerStats.total}</strong><span>Total</span></div>
          <div><strong>{learnerStats.pending}</strong><span>Sin entregar</span></div>
          <div><strong>{learnerStats.delivered}</strong><span>PIN entregado</span></div>
          <div><strong>{learnerStats.active}</strong><span>Activos</span></div>
        </div>
        <label className="st-admin-search">
          <Mail size={13} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, email, PIN, estado, objetivo o herramienta..." />
        </label>

        {filteredPins.length ? (
          <div className="st-admin-table">
            {filteredPins.map((item) => (
              <article key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.email} · {item.goal || 'Objetivo pendiente'} · nivel {item.level}</small>
                </div>
                <code>{item.pin}</code>
                <button type="button" className={`st-admin-state is-${item.status}`} onClick={() => cycleStatus(item.id)}>
                  <UserCheck size={12} /> {STATUS_LABELS[item.status]}
                </button>
                <span>{item.tools || 'Herramientas por definir'}</span>
                <button type="button" title="Copiar email y PIN" onClick={() => copy(accessText(item), item.id)}>{copied === item.id ? <Check size={13} /> : <Clipboard size={13} />}</button>
                <button type="button" onClick={() => deletePin(item)}><Trash2 size={13} /></button>
              </article>
            ))}
          </div>
        ) : (
          <div className="st-empty">
            <h2>{pins.length ? 'No hay coincidencias' : 'Aún no hay alumnos'}</h2>
            <p>{pins.length ? 'Cambia la búsqueda para volver a ver la lista completa.' : 'Crea el primero con nombre, email, PIN, objetivo, nivel y herramientas recomendadas.'}</p>
          </div>
        )}
      </section>
      )}

      {tab === 'pendiente' && (
      <section className="st-admin-questions">
        <span className="st-kicker">Preguntas que conviene decidir</span>
        <h2>Para la siguiente versión</h2>
        <p>Qué datos puede ver cada alumno, si el PIN caduca, si necesitas grupos/clases, qué ve el profesor, qué se exporta como certificado y dónde se guarda el progreso.</p>
        <ul>
          {blocksWithoutMainRoute.map((stage) => <li key={stage.id}>Curar ruta principal para: {stage.title}</li>)}
          <li>Separar permisos reales de alumno, profesor, administrador y súper administrador.</li>
          <li>Conectar backend antes de usar PINs como autenticación real con alumnos.</li>
          <li>Crear auditoría de ejecución para automatizaciones con WhatsApp, Telegram y n8n.</li>
        </ul>
      </section>
      )}
    </div>
  )
}
