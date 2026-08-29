import { useEffect, useMemo, useState } from 'react'
import { Check, Clipboard, KeyRound, Plus, Trash2 } from 'lucide-react'
import { useCourse } from '../course'

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
  const [pins, setPins] = useState<LearnerPin[]>(() => readPins())
  const [draft, setDraft] = useState(EMPTY)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(pins))
  }, [pins])

  const suggestedTools = useMemo(
    () => course.toolPages.slice(0, 18).map((tool) => tool.label),
    [course.toolPages],
  )

  function createPin() {
    if (!draft.name.trim()) return
    setPins((current) => [{
      id: `${Date.now()}-${draft.name}`,
      name: draft.name.trim(),
      pin: generatePin(),
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
        <span className="st-kicker"><KeyRound size={12} /> Control local</span>
        <h1>Súper administrador</h1>
        <p>
          Panel para preparar alumnos, PINs, objetivo y herramientas recomendadas. Esta primera versión vive en tu navegador:
          sirve para organizar, no como autenticación real de servidor.
        </p>
      </div>

      <section className="st-admin-warning">
        <KeyRound size={15} />
        <div>
          <strong>Importante antes de usarlo con alumnos reales</strong>
          <p>Un PIN guardado en una web estática no protege datos por sí solo. Para acceso real hacen falta backend, base de datos, sesiones, permisos y registro de auditoría.</p>
        </div>
      </section>

      <section className="st-admin-grid">
        <div className="st-admin-form">
          <div className="st-section-head">
            <div>
              <span className="st-kicker">Crear alumno</span>
              <h2>Ficha y PIN</h2>
            </div>
          </div>
          <label><span>Nombre del alumno</span><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Ej. Laura Pérez" /></label>
          <label><span>Objetivo principal</span><input value={draft.goal} onChange={(event) => setDraft({ ...draft, goal: event.target.value })} placeholder="Ej. montar una automatización para clientes" /></label>
          <label><span>Nivel inicial</span><select value={draft.level} onChange={(event) => setDraft({ ...draft, level: event.target.value })}><option value="basico">Básico</option><option value="intermedio">Intermedio</option><option value="avanzado">Avanzado</option></select></label>
          <label><span>Herramientas recomendadas</span><input value={draft.tools} onChange={(event) => setDraft({ ...draft, tools: event.target.value })} placeholder="Ej. ChatGPT, n8n, Nano Banana" /></label>
          <div className="st-admin-toolchips">
            {suggestedTools.map((tool) => (
              <button key={tool} type="button" onClick={() => setDraft({ ...draft, tools: draft.tools ? `${draft.tools}, ${tool}` : tool })}>{tool}</button>
            ))}
          </div>
          <label><span>Notas internas</span><textarea rows={4} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} placeholder="Restricciones, ritmo, dudas, kit recomendado..." /></label>
          <button type="button" className="st-btn" onClick={createPin} disabled={!draft.name.trim()}><Plus size={13} /> Crear PIN</button>
        </div>

        <aside className="st-admin-missing">
          <span className="st-kicker">Lo que falta para hacerlo real</span>
          <h2>Próximas piezas</h2>
          <ul>
            <li>Base de datos de alumnos y progreso sincronizado.</li>
            <li>Login real para administrador y alumno.</li>
            <li>Permisos por rol: alumno, profesor, administrador.</li>
            <li>Restablecer PIN y caducidad de accesos.</li>
            <li>Registro de actividad y exportación por alumno.</li>
            <li>Consentimiento, privacidad y política de datos.</li>
          </ul>
        </aside>
      </section>

      <section className="st-admin-list">
        <div className="st-section-head">
          <div>
            <span className="st-kicker">Alumnos preparados</span>
            <h2>PINs locales</h2>
          </div>
          <button type="button" className="st-btn-ghost" onClick={exportPins} disabled={!pins.length}>Exportar JSON</button>
        </div>

        {pins.length ? (
          <div className="st-admin-table">
            {pins.map((item) => (
              <article key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.goal || 'Objetivo pendiente'} · nivel {item.level}</small>
                </div>
                <code>{item.pin}</code>
                <span>{item.tools || 'Herramientas por definir'}</span>
                <button type="button" onClick={() => copy(item.pin, item.id)}>{copied === item.id ? <Check size={13} /> : <Clipboard size={13} />}</button>
                <button type="button" onClick={() => setPins((current) => current.filter((pin) => pin.id !== item.id))}><Trash2 size={13} /></button>
              </article>
            ))}
          </div>
        ) : (
          <div className="st-empty">
            <h2>Aún no hay alumnos</h2>
            <p>Crea el primero con nombre, objetivo, nivel y herramientas recomendadas.</p>
          </div>
        )}
      </section>

      <section className="st-admin-questions">
        <span className="st-kicker">Preguntas que conviene decidir</span>
        <h2>Para la siguiente versión</h2>
        <p>Qué datos puede ver cada alumno, si el PIN caduca, si necesitas grupos/clases, qué ve el profesor, qué se exporta como certificado y dónde se guarda el progreso.</p>
      </section>
    </div>
  )
}
