import { FormEvent, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Compass,
  FileQuestion,
  Film,
  Gauge,
  GraduationCap,
  Lightbulb,
  Network,
  Search,
  Sparkles,
  Target,
  Workflow,
  X,
} from 'lucide-react'
import type { AcademyDocument, AcademyView, Catalog, LearnerProfile, LearningGoal } from './types'

export const defaultProfile: LearnerProfile = { name: '', goal: 'automatizacion', level: 'inicio', weeklyHours: 5 }

export const goalMeta: Record<LearningGoal, { label: string; promise: string; keywords: string[]; icon: typeof Workflow; color: string }> = {
  automatizacion: { label: 'Automatizar procesos', promise: 'Diseñar, probar y operar workflows con n8n y código.', keywords: ['n8n', 'workflow', 'automatiza', 'proceso', 'webhook'], icon: Workflow, color: 'red' },
  'multi-llm': { label: 'Trabajar con varios LLM', promise: 'Elegir, enrutar y evaluar modelos por capacidad y coste.', keywords: ['llm', 'router', 'modelo', 'litellm', 'agente'], icon: Network, color: 'cyan' },
  video: { label: 'Crear vídeos con IA', promise: 'Construir un pipeline de idea, guion, voz, render y publicación.', keywords: ['video', 'remotion', 'transcript', 'voz', 'ffmpeg'], icon: Film, color: 'yellow' },
  programacion: { label: 'Programar productos IA', promise: 'Pasar de prototipos a aplicaciones probadas y desplegadas.', keywords: ['codigo', 'api', 'typescript', 'python', 'deploy'], icon: Code2, color: 'ink' },
  negocio: { label: 'Vender y entregar servicios', promise: 'Convertir capacidades IA en una oferta, proyecto y caso de éxito.', keywords: ['cliente', 'negocio', 'oferta', 'portfolio', 'entrega'], icon: Target, color: 'green' },
}

function scoreDocument(document: AcademyDocument, keywords: string[], query = '') {
  const haystack = `${document.title} ${document.path} ${document.excerpt}`.toLowerCase()
  const terms = [...keywords, ...query.toLowerCase().split(/\s+/).filter((term) => term.length > 2)]
  return terms.reduce((score, term) => score + (haystack.includes(term) ? (document.title.toLowerCase().includes(term) ? 4 : 1) : 0), 0)
}

export function Onboarding({ initial, onSave, onClose }: { initial: LearnerProfile; onSave: (profile: LearnerProfile) => void; onClose?: () => void }) {
  const [profile, setProfile] = useState(initial)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSave({ ...profile, name: profile.name.trim() || 'Profesional IA' })
  }
  return (
    <div className="onboarding-overlay" role="dialog" aria-modal="true" aria-label="Configurar ruta">
      <form className="onboarding-sheet" onSubmit={submit}>
        {onClose && <button type="button" className="onboarding-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>}
        <div className="onboarding-intro">
          <span className="eyebrow">TU SISTEMA DE APRENDIZAJE</span>
          <h2>Diseñemos una ruta que termine en algo funcionando.</h2>
          <p>El portal ordenará los documentos, prácticas y entregables según lo que quieras conseguir.</p>
        </div>
        <label className="profile-name">¿Cómo quieres que te llamemos?<input autoFocus value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} placeholder="Tu nombre" /></label>
        <fieldset>
          <legend>¿Cuál es tu objetivo principal?</legend>
          <div className="goal-grid">
            {Object.entries(goalMeta).map(([id, meta]) => {
              const Icon = meta.icon
              return <label className={`goal-option goal-${meta.color} ${profile.goal === id ? 'active' : ''}`} key={id}><input type="radio" name="goal" checked={profile.goal === id} onChange={() => setProfile({ ...profile, goal: id as LearningGoal })} /><Icon size={21} /><strong>{meta.label}</strong><span>{meta.promise}</span><i>{profile.goal === id && <Check size={13} />}</i></label>
            })}
          </div>
        </fieldset>
        <div className="onboarding-controls">
          <label>Nivel actual<select value={profile.level} onChange={(event) => setProfile({ ...profile, level: event.target.value as LearnerProfile['level'] })}><option value="inicio">Empiezo desde cero</option><option value="intermedio">Ya he creado proyectos</option><option value="avanzado">Quiero producción y negocio</option></select></label>
          <label>Horas por semana<div className="hours-control"><input type="range" min="2" max="15" value={profile.weeklyHours} onChange={(event) => setProfile({ ...profile, weeklyHours: Number(event.target.value) })} /><strong>{profile.weeklyHours} h</strong></div></label>
        </div>
        <button className="primary-button onboarding-submit">Crear mi ruta <ArrowRight size={17} /></button>
      </form>
    </div>
  )
}

export function PersonalRoute({ catalog, profile, completed, onOpen, onEditProfile }: {
  catalog: Catalog
  profile: LearnerProfile
  completed: Set<string>
  onOpen: (document: AcademyDocument) => void
  onEditProfile: () => void
}) {
  const meta = goalMeta[profile.goal]
  const route = useMemo(() => catalog.documents
    .filter((doc) => !doc.path.endsWith('README.md'))
    .map((doc) => ({ doc, score: scoreDocument(doc, meta.keywords) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.doc.words - b.doc.words)
    .slice(0, 12)
    .map((item) => item.doc), [catalog.documents, meta.keywords])
  const routeCompleted = route.filter((doc) => completed.has(doc.id)).length
  const weeks = Math.max(1, Math.ceil(route.reduce((sum, doc) => sum + doc.minutes, 0) / (profile.weeklyHours * 60)))
  const Icon = meta.icon

  return (
    <div className="page route-page">
      <header className="route-hero">
        <div><span className="eyebrow">RUTA PERSONAL · {profile.level.toUpperCase()}</span><h1>{profile.name}, este es tu camino para <em>{meta.label.toLowerCase()}.</em></h1><p>{meta.promise} La selección se genera desde el contenido real de la academia y cambia cuando actualizas tu objetivo.</p><button className="text-button" onClick={onEditProfile}><Compass size={16} /> Cambiar objetivo</button></div>
        <div className="route-ticket"><Icon size={29} /><span>PLAN ESTIMADO</span><strong>{weeks} {weeks === 1 ? 'semana' : 'semanas'}</strong><small>{profile.weeklyHours} h/semana · {route.length} hitos</small><div><i style={{width: `${route.length ? routeCompleted / route.length * 100 : 0}%`}} /></div><b>{routeCompleted}/{route.length} completados</b></div>
      </header>
      <section className="route-map">
        {route.map((doc, index) => {
          const done = completed.has(doc.id)
          const phase = index < 3 ? 'Fundamento' : index < 7 ? 'Construcción' : index < 10 ? 'Operación' : 'Evidencia'
          return <article className={`route-stop ${done ? 'done' : ''}`} key={doc.id}>
            <div className="route-spine"><span>{done ? <Check size={15} /> : String(index + 1).padStart(2, '0')}</span></div>
            <button onClick={() => onOpen(doc)}><small>{phase} · {doc.category}</small><strong>{doc.title}</strong><p>{doc.excerpt}</p><span><Clock3 size={14} /> {doc.minutes} min <ArrowRight size={15} /></span></button>
            <div className="route-output"><span>ENTREGABLE</span><strong>{index < 3 ? 'Mapa de decisión' : index < 7 ? 'Prototipo ejecutable' : index < 10 ? 'Prueba y registro' : 'Caso defendible'}</strong></div>
          </article>
        })}
      </section>
      <section className="route-finish"><GraduationCap size={28} /><div><span className="eyebrow">RESULTADO DE LA RUTA</span><h2>No terminarás con apuntes. Terminarás con una evidencia.</h2><p>Entrega un sistema funcionando, su explicación, un caso roto resuelto, métricas y una defensa de tres minutos.</p></div></section>
    </div>
  )
}

export function ActivityChart({ completed }: { completed: Set<string> }) {
  const activity = (() => {
    try { return JSON.parse(localStorage.getItem('academy-activity') || '[]') as Array<{ date: string; action: string }> } catch { return [] }
  })()
  const days = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - offset))
    const key = date.toISOString().slice(0, 10)
    return { key, label: date.toLocaleDateString('es-ES', { weekday: 'short' }).slice(0, 2), value: activity.filter((item) => item.date.startsWith(key)).length }
  })
  const max = Math.max(1, ...days.map((day) => day.value))
  return <div className="activity-chart"><div className="activity-chart-head"><div><span className="eyebrow">ACTIVIDAD · 7 DÍAS</span><strong>{completed.size} hitos acumulados</strong></div><Gauge size={21} /></div><div className="activity-bars">{days.map((day) => <div key={day.key}><span><i style={{height: `${Math.max(8, day.value / max * 100)}%`}} /></span><small>{day.label}</small></div>)}</div></div>
}

export function Mentor({ catalog, onOpen }: { catalog: Catalog; onOpen: (document: AcademyDocument) => void }) {
  const [question, setQuestion] = useState('')
  const [submitted, setSubmitted] = useState('')
  const results = useMemo(() => submitted ? catalog.documents
    .filter((doc) => !doc.path.endsWith('README.md'))
    .map((doc) => ({ doc, score: scoreDocument(doc, [], submitted) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6) : [], [catalog.documents, submitted])
  const submit = (event: FormEvent) => { event.preventDefault(); setSubmitted(question.trim()) }
  const suggestions = ['¿Cómo conecto varios LLM?', 'Quiero automatizar leads con n8n', '¿Cómo creo vídeos con IA?', '¿Cómo publico en Vercel?']
  return (
    <div className="page mentor-page">
      <header className="mentor-hero"><div className="mentor-symbol"><Sparkles size={34} /></div><span className="eyebrow">MENTOR CON FUENTES INTERNAS</span><h1>Pregunta a tu propia academia.</h1><p>No inventa respuestas ni oculta el origen: encuentra los documentos más relevantes y construye un plan de lectura verificable.</p></header>
      <form className="mentor-search" onSubmit={submit}><Search size={22} /><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ejemplo: quiero automatizar la creación y publicación de vídeos" /><button disabled={!question.trim()}>Investigar <ArrowRight size={17} /></button></form>
      {!submitted && <div className="mentor-suggestions"><span>PRUEBA UNA PREGUNTA</span>{suggestions.map((suggestion) => <button key={suggestion} onClick={() => {setQuestion(suggestion); setSubmitted(suggestion)}}>{suggestion}<ChevronRight size={15} /></button>)}</div>}
      {submitted && <div className="mentor-results">
        <section className="mentor-answer"><div className="answer-label"><Lightbulb size={19} /><span>PLAN SUGERIDO</span></div><h2>Para “{submitted}” empezaría por estas {results.length} fuentes.</h2>{results.length ? <p>Lee primero los fundamentos y después los archivos ejecutables. En cada paso produce una salida y provoca un error controlado antes de avanzar.</p> : <p>No encontré coincidencias claras. Prueba con nombres de herramientas o resultados concretos: n8n, RAG, vídeo, Vercel, agentes o clientes.</p>}<div className="answer-steps"><span><b>1</b>Comprender</span><ArrowRight size={15} /><span><b>2</b>Construir</span><ArrowRight size={15} /><span><b>3</b>Verificar</span><ArrowRight size={15} /><span><b>4</b>Defender</span></div></section>
        <section className="source-stack"><div className="source-stack-head"><span>FUENTES ENCONTRADAS</span><strong>{results.length}</strong></div>{results.map(({doc}, index) => <button key={doc.id} onClick={() => onOpen(doc)}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{doc.category} · {doc.minutes} min</small><strong>{doc.title}</strong><p>{doc.excerpt}</p></div><ArrowRight size={17} /></button>)}</section>
      </div>}
      <aside className="mentor-disclaimer"><FileQuestion size={18} /><span><strong>Cómo funciona:</strong> búsqueda ponderada sobre títulos, rutas y extractos. No envía tu pregunta ni el contenido a servicios externos.</span></aside>
    </div>
  )
}

export function ResumeCard({ profile, catalog, completed, onNavigate, onConfigure }: { profile: LearnerProfile | null; catalog: Catalog; completed: Set<string>; onNavigate: (view: AcademyView) => void; onConfigure: () => void }) {
  if (!profile) return <button className="profile-prompt" onClick={onConfigure}><Target size={23} /><span><strong>Personaliza tu formación</strong><small>Objetivo, nivel y tiempo disponible</small></span><ArrowRight size={17} /></button>
  const meta = goalMeta[profile.goal]
  const next = catalog.documents.filter((doc) => meta.keywords.some((keyword) => `${doc.title} ${doc.path}`.toLowerCase().includes(keyword)) && !completed.has(doc.id))[0]
  return <button className="resume-card" onClick={() => onNavigate('ruta')}><span className={`resume-icon resume-${meta.color}`}><meta.icon size={21} /></span><span><small>RUTA DE {profile.name.toUpperCase()}</small><strong>{next ? next.title : meta.label}</strong><i>{meta.promise}</i></span><ArrowRight size={18} /></button>
}
