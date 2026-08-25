import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, BookMarked, Check, CircleHelp, Save, Workflow } from 'lucide-react'
import { href } from '../router'
import { ProjectProfile, store, useStudent } from '../store'

const EMPTY: ProjectProfile = {
  name: '',
  goal: '',
  audience: '',
  problem: '',
  outcome: '',
  tools: '',
  updatedAt: '',
}

export default function MiProyecto() {
  const student = useStudent()
  const [draft, setDraft] = useState<ProjectProfile>(student.project || EMPTY)
  const [saved, setSaved] = useState(false)
  const project = student.project

  const fields = useMemo(() => [
    { key: 'name', label: 'Cómo se llama', placeholder: 'Ej. Clasificador de solicitudes' },
    { key: 'goal', label: 'Qué quieres conseguir', placeholder: 'Ej. Ahorrar tiempo cada semana' },
    { key: 'audience', label: 'Quién lo va a utilizar', placeholder: 'Ej. Yo y mi equipo comercial' },
    { key: 'problem', label: 'Qué problema resuelve', placeholder: 'Descríbelo como se lo contarías a un compañero' },
    { key: 'outcome', label: 'Qué debe ocurrir al final', placeholder: 'Ej. Recibir, clasificar y registrar cada solicitud' },
    { key: 'tools', label: 'Herramientas que imaginas', placeholder: 'Ej. n8n, OpenAI, Gmail, Google Sheets' },
  ] as const, [])

  function update(key: keyof ProjectProfile, value: string) {
    setDraft((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  function save(event: FormEvent) {
    event.preventDefault()
    store.setProject({ ...draft, updatedAt: new Date().toISOString() })
    setSaved(true)
  }

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><BookMarked size={12} /> Espacio de trabajo</span>
        <h1>Mi proyecto</h1>
        <p>
          Aquí se reúne todo lo que vas aprendiendo. Rellena esta ficha con palabras normales y úsala para
          convertir cada lección en una decisión, una práctica o una entrega real.
        </p>
      </div>

      <div className="st-project-orientation">
        <div>
          <strong>Cómo funciona</strong>
          <p>Primero defines el problema. Después eliges herramientas, construyes una versión pequeña, la pruebas y la documentas.</p>
        </div>
        <span><CircleHelp size={14} /> No necesitas saber todavía qué tecnología usar.</span>
      </div>

      <form className="st-project-form" onSubmit={save}>
        <div className="st-section-head">
          <div>
            <span className="st-kicker">Ficha inicial</span>
            <h2>Cuéntame qué quieres construir</h2>
          </div>
          {saved && <span className="st-project-saved"><Check size={12} /> Guardado en este navegador</span>}
        </div>

        <div className="st-project-form-grid">
          {fields.map((field) => (
            <label key={field.key} className={['problem', 'outcome'].includes(field.key) ? 'wide' : ''}>
              <span>{field.label}</span>
              {['problem', 'outcome'].includes(field.key) ? (
                <textarea
                  rows={4}
                  value={draft[field.key]}
                  onChange={(event) => update(field.key, event.target.value)}
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  value={draft[field.key]}
                  onChange={(event) => update(field.key, event.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            </label>
          ))}
        </div>

        <button className="st-btn" type="submit"><Save size={14} /> Guardar ficha</button>
      </form>

      <section className="st-project-next">
        <div className="st-section-head">
          <div>
            <span className="st-kicker">Siguiente paso</span>
            <h2>{project?.name ? `Ahora trabaja en ${project.name}` : 'Empieza sin esperar a tenerlo todo claro'}</h2>
          </div>
        </div>
        <div className="st-project-next-grid">
          <a href={href({ name: 'curso' })}>
            <BookMarked size={18} />
            <span><strong>Seguir el programa</strong><small>Aprende las bases en el orden recomendado.</small></span>
            <ArrowRight size={14} />
          </a>
          <a href={href({ name: 'automatizaciones' })}>
            <Workflow size={18} />
            <span><strong>Diseñar una automatización</strong><small>Convierte una tarea repetida en un flujo verificable.</small></span>
            <ArrowRight size={14} />
          </a>
          <a href={href({ name: 'herramienta', toolId: 'higgsfield', filters: {} })}>
            <span className="st-project-tool-mark">H</span>
            <span><strong>Crear vídeo con Higgsfield</strong><small>Empieza con una imagen, un plano y un movimiento.</small></span>
            <ArrowRight size={14} />
          </a>
        </div>
      </section>

      <p className="st-project-storage">Por ahora tu ficha se guarda solo en este navegador. La estructura queda separada para poder sincronizarla con una cuenta más adelante.</p>
    </div>
  )
}
