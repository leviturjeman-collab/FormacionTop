import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Search, ShieldCheck, Workflow } from 'lucide-react'
import { useCourse } from '../course'
import { href } from '../router'
import { Lesson } from '../types'

const OBJECTIVES = [
  ['todos', 'Todas'],
  ['leads', 'Leads y CRM'],
  ['contenido', 'Contenido'],
  ['datos', 'Documentos y datos'],
  ['soporte', 'Soporte y avisos'],
  ['calidad', 'Pruebas y seguridad'],
] as const

function objectiveFor(lesson: Lesson) {
  const text = `${lesson.title} ${lesson.search} ${lesson.folderLabel}`.toLowerCase()
  if (/lead|crm|cliente|ventas|propuesta|comercial/.test(text)) return 'leads'
  if (/contenido|vídeo|video|redes|publica|newsletter/.test(text)) return 'contenido'
  if (/rag|document|pdf|datos|base|sheet|hoja/.test(text)) return 'datos'
  if (/soporte|email|correo|slack|aviso|telegram|whatsapp/.test(text)) return 'soporte'
  if (/test|seguridad|error|monitor|log|calidad/.test(text)) return 'calidad'
  return 'leads'
}

export default function Automatizaciones() {
  const course = useCourse()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('todos')

  const workflows = useMemo(() => {
    const base = course.lessons.filter((lesson) => lesson.kind === 'workflow' || /workflows_n8n_40/i.test(lesson.sourcePath))
    const needle = query.trim().toLowerCase()
    return base.filter((lesson) => {
      const matchesObjective = active === 'todos' || objectiveFor(lesson) === active
      const matchesQuery = !needle || `${lesson.title} ${lesson.search} ${lesson.tools.join(' ')}`.toLowerCase().includes(needle)
      return matchesObjective && matchesQuery
    })
  }, [course.lessons, active, query])

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><Workflow size={12} /> Centro de automatizaciones</span>
        <h1>Haz que el trabajo repetido ocurra solo</h1>
        <p>
          Diseña el proceso antes de abrir una plataforma. Aquí puedes elegir un resultado, estudiar el flujo,
          importarlo, probarlo con datos falsos y saber qué hacer cuando falle. n8n es la herramienta principal,
          pero también comparamos Zapier, Make y otras opciones.
        </p>
      </div>

      <section className="st-automation-principles">
        <div><span>01</span><strong>Define</strong><p>Qué lo dispara, qué entra y qué tiene que salir.</p></div>
        <div><span>02</span><strong>Construye</strong><p>Conecta pasos pequeños y comprueba cada uno.</p></div>
        <div><span>03</span><strong>Frena</strong><p>Protege datos, dinero y acciones irreversibles.</p></div>
        <div><span>04</span><strong>Opera</strong><p>Registra errores y deja una forma clara de recuperarte.</p></div>
      </section>

      <div className="st-automation-actions">
        <a className="st-btn" href={href({ name: 'herramienta', toolId: 'n8n', filters: {} })}><Workflow size={14} /> Empezar con n8n</a>
        <a className="st-btn st-btn-quiet" href={href({ name: 'guia', guideId: 'primer-proyecto' })}><CheckCircle2 size={14} /> Diseñar mi primer flujo</a>
      </div>

      <div className="st-section-head">
        <div>
          <span className="st-kicker">Biblioteca práctica</span>
          <h2>Workflows importables y explicados</h2>
        </div>
        <span>{workflows.length} resultados</span>
      </div>

      <div className="st-filters st-automation-filters">
        <label className="st-piece-search"><Search size={13} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por resultado, app o error…" /></label>
        <div className="st-filter-row">
          <span>Quiero automatizar</span>
          {OBJECTIVES.map(([id, label]) => (
            <button key={id} type="button" className={`st-chip${active === id ? ' on' : ''}`} onClick={() => setActive(id)} aria-pressed={active === id}>{label}</button>
          ))}
        </div>
      </div>

      <div className="st-automation-list">
        {workflows.map((lesson) => (
          <a key={lesson.slug} href={href({ name: 'leccion', slug: lesson.slug })}>
            <span className="st-automation-number">{String(workflows.indexOf(lesson) + 1).padStart(2, '0')}</span>
            <div><strong>{lesson.title}</strong><p>{lesson.levels.basico.headline}</p><small>{lesson.kindLabel} · {objectiveFor(lesson)} · {lesson.levels.basico.minutes} min</small></div>
            <ArrowRight size={14} />
          </a>
        ))}
      </div>

      {!workflows.length && <div className="st-empty"><ShieldCheck size={24} /><h2>No hay un flujo con esos filtros</h2><p>Prueba con otra palabra o cambia el objetivo.</p></div>}
    </div>
  )
}
