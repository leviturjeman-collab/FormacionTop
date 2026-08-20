import { FormEvent, useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Activity,
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  Clock3,
  Code2,
  Command,
  Database,
  Download,
  ExternalLink,
  FileText,
  Filter,
  GitBranch,
  GraduationCap,
  Home,
  Layers3,
  MapPinned,
  Menu,
  Network,
  MessagesSquare,
  Play,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserCheck,
  Workflow,
  X,
  Zap,
} from 'lucide-react'
import type { AcademyDocument, AcademyView, Catalog, DemoEvent, DemoLead, LearnerProfile } from './types'
import { ActivityChart, defaultProfile, Mentor, Onboarding, PersonalRoute, ResumeCard } from './v2'

type View = AcademyView

const navigation: Array<{ id: View; label: string; icon: typeof Home }> = [
  { id: 'inicio', label: 'Centro de mando', icon: Home },
  { id: 'ruta', label: 'Mi ruta', icon: MapPinned },
  { id: 'biblioteca', label: 'Biblioteca', icon: BookOpen },
  { id: 'automatizaciones', label: 'Automatizaciones', icon: Workflow },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'laboratorio', label: 'Mapas visuales', icon: Network },
  { id: 'mentor', label: 'Mentor', icon: MessagesSquare },
  { id: 'demo', label: 'Demo funcional', icon: Play },
]

const categoryLabels: Record<string, string> = {
  document: 'Documento',
  workflow: 'Workflow n8n',
  skill: 'Skill',
}

const emptyCatalog: Catalog = {
  generatedAt: '',
  stats: { documents: 0, workflows: 0, skills: 0, words: 0 },
  documents: [],
  workflows: [],
  skills: [],
}

const delay = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

function useLocalSet(key: string) {
  const [values, setValues] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(key) || '[]'))
    } catch {
      return new Set()
    }
  })

  const toggle = (value: string) => {
    setValues((current) => {
      const next = new Set(current)
      if (next.has(value)) next.delete(value)
      else {
        next.add(value)
        if (key === 'academy-completed') {
          try {
            const activity = JSON.parse(localStorage.getItem('academy-activity') || '[]')
            activity.push({ date: new Date().toISOString(), action: 'completed', id: value })
            localStorage.setItem('academy-activity', JSON.stringify(activity.slice(-180)))
          } catch { /* Activity is optional; progress still persists. */ }
        }
      }
      localStorage.setItem(key, JSON.stringify([...next]))
      return next
    })
  }

  return [values, toggle] as const
}

function App() {
  const [catalog, setCatalog] = useState<Catalog>(emptyCatalog)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('inicio')
  const [selectedDocument, setSelectedDocument] = useState<AcademyDocument | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [profile, setProfile] = useState<LearnerProfile | null>(() => {
    try { return JSON.parse(localStorage.getItem('academy-profile') || 'null') } catch { return null }
  })
  const [onboardingOpen, setOnboardingOpen] = useState(() => !localStorage.getItem('academy-profile'))
  const [completed, toggleCompleted] = useLocalSet('academy-completed')
  const [favorites, toggleFavorite] = useLocalSet('academy-favorites')

  useEffect(() => {
    fetch('/catalog.json')
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar el catálogo')
        return response.json()
      })
      .then((data: Catalog) => setCatalog(data))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
      if (event.key === 'Escape') {
        setSelectedDocument(null)
        setPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const openView = (nextView: View) => {
    setView(nextView)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const completion = catalog.stats.documents ? Math.round((completed.size / catalog.stats.documents) * 100) : 0

  const saveProfile = (nextProfile: LearnerProfile) => {
    localStorage.setItem('academy-profile', JSON.stringify(nextProfile))
    setProfile(nextProfile)
    setOnboardingOpen(false)
    openView('ruta')
  }

  return (
    <div className="app-shell">
      <Sidebar view={view} open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={openView} />
      <main className="main-stage">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir navegación">
            <Menu size={20} />
          </button>
          <div className="topbar-trail">
            <span>AI Professional Academy</span>
            <ChevronRight size={14} />
            <strong>{navigation.find((item) => item.id === view)?.label}</strong>
          </div>
          <button className="command-trigger" onClick={() => setPaletteOpen(true)}>
            <Search size={16} />
            <span>Buscar en la academia</span>
            <kbd>Ctrl K</kbd>
          </button>
        </header>

        {loading ? (
          <LoadingState />
        ) : (
          <>
            {view === 'inicio' && (
              <Dashboard
                catalog={catalog}
                completed={completed}
                completion={completion}
                onNavigate={openView}
                onOpen={setSelectedDocument}
                profile={profile}
                onConfigure={() => setOnboardingOpen(true)}
              />
            )}
            {view === 'ruta' && profile && <PersonalRoute catalog={catalog} profile={profile} completed={completed} onOpen={setSelectedDocument} onEditProfile={() => setOnboardingOpen(true)} />}
            {view === 'ruta' && !profile && <EmptyRoute onConfigure={() => setOnboardingOpen(true)} />}
            {view === 'biblioteca' && (
              <Library
                documents={catalog.documents}
                completed={completed}
                favorites={favorites}
                onOpen={setSelectedDocument}
                onToggleCompleted={toggleCompleted}
                onToggleFavorite={toggleFavorite}
              />
            )}
            {view === 'automatizaciones' && <AutomationLibrary workflows={catalog.workflows} onOpen={setSelectedDocument} />}
            {view === 'skills' && <SkillsLibrary skills={catalog.skills} onOpen={setSelectedDocument} />}
            {view === 'laboratorio' && <VisualLab onNavigate={openView} />}
            {view === 'mentor' && <Mentor catalog={catalog} onOpen={setSelectedDocument} />}
            {view === 'demo' && <FunctionalDemo />}
          </>
        )}
      </main>

      {selectedDocument && (
        <DocumentReader
          document={selectedDocument}
          completed={completed.has(selectedDocument.id)}
          favorite={favorites.has(selectedDocument.id)}
          onClose={() => setSelectedDocument(null)}
          onToggleCompleted={() => toggleCompleted(selectedDocument.id)}
          onToggleFavorite={() => toggleFavorite(selectedDocument.id)}
        />
      )}
      {paletteOpen && (
        <CommandPalette
          documents={catalog.documents}
          onClose={() => setPaletteOpen(false)}
          onOpen={(document) => {
            setSelectedDocument(document)
            setPaletteOpen(false)
          }}
          onNavigate={(nextView) => {
            openView(nextView)
            setPaletteOpen(false)
          }}
        />
      )}
      {onboardingOpen && <Onboarding initial={profile || defaultProfile} onSave={saveProfile} onClose={() => setOnboardingOpen(false)} />}
    </div>
  )
}

function Sidebar({ view, open, onClose, onNavigate }: { view: View; open: boolean; onClose: () => void; onNavigate: (view: View) => void }) {
  return (
    <>
      {open && <button className="sidebar-scrim" onClick={onClose} aria-label="Cerrar navegación" />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark">AI</div>
          <div>
            <strong>Professional</strong>
            <span>Academy / 2026</span>
          </div>
        </div>
        <nav className="side-nav" aria-label="Navegación principal">
          {navigation.map((item, index) => {
            const Icon = item.icon
            return (
              <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => onNavigate(item.id)}>
                <span className="nav-index">0{index + 1}</span>
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="sidebar-note">
          <span className="live-dot" />
          <div>
            <strong>Sistema activo</strong>
            <span>Contenido indexado localmente</span>
          </div>
        </div>
      </aside>
    </>
  )
}

function Dashboard({ catalog, completed, completion, onNavigate, onOpen, profile, onConfigure }: {
  catalog: Catalog
  completed: Set<string>
  completion: number
  onNavigate: (view: View) => void
  onOpen: (document: AcademyDocument) => void
  profile: LearnerProfile | null
  onConfigure: () => void
}) {
  const recent = catalog.documents.filter((doc) => !doc.path.endsWith('README.md')).slice(0, 3)
  return (
    <div className="page dashboard-page">
      <section className="dashboard-hero">
        <div className="hero-copy">
          <span className="eyebrow">CENTRO DE OPERACIONES · COHORTE 01</span>
          <h1>Aprende.<br /><em>Construye.</em><br />Demuestra.</h1>
          <p>Una formación que termina en sistemas funcionando, decisiones defendibles y entregables que un cliente puede utilizar.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onNavigate('biblioteca')}>Continuar formación <ArrowRight size={17} /></button>
            <button className="text-button" onClick={() => onNavigate('demo')}><Play size={16} /> Probar demo</button>
          </div>
        </div>
        <div className="hero-instrument" aria-label={`${completion}% completado`}>
          <div className="progress-orbit" style={{ '--progress': `${completion * 3.6}deg` } as React.CSSProperties}>
            <div><strong>{completion}%</strong><span>completado</span></div>
          </div>
          <div className="instrument-meta">
            <span>{completed.size} documentos terminados</span>
            <span>Objetivo: proyecto defendible</span>
          </div>
        </div>
      </section>

      <section className="metric-rail" aria-label="Resumen de contenidos">
        <Metric value={catalog.stats.documents} label="Documentos" accent="red" />
        <Metric value={catalog.stats.workflows} label="Workflows n8n" accent="cyan" />
        <Metric value={catalog.stats.skills} label="Skills aplicables" accent="yellow" />
        <Metric value={`${Math.round(catalog.stats.words / 1000)}K`} label="Palabras indexadas" accent="ink" />
      </section>

      <section className="personal-rail">
        <ResumeCard profile={profile} catalog={catalog} completed={completed} onNavigate={onNavigate} onConfigure={onConfigure} />
        <ActivityChart completed={completed} />
      </section>

      <div className="dashboard-grid">
        <section className="panel learning-panel">
          <div className="section-heading">
            <div><span className="eyebrow">RUTA RECOMENDADA</span><h2>De cero a producción</h2></div>
            <button className="icon-button" aria-label="Ver biblioteca" onClick={() => onNavigate('biblioteca')}><ArrowRight size={18} /></button>
          </div>
          <LearningTrack />
        </section>

        <section className="panel action-panel">
          <div className="section-heading"><div><span className="eyebrow">ACCESO DIRECTO</span><h2>Hoy puedes hacer</h2></div></div>
          <button onClick={() => onNavigate('automatizaciones')}><Workflow size={19} /><span><strong>Importar un workflow</strong><small>40 procesos listos para adaptar</small></span><ChevronRight size={17} /></button>
          <button onClick={() => onNavigate('skills')}><Bot size={19} /><span><strong>Activar una skill</strong><small>Instrucciones para agentes IA</small></span><ChevronRight size={17} /></button>
          <button onClick={() => onNavigate('laboratorio')}><Network size={19} /><span><strong>Estudiar una arquitectura</strong><small>Mapas y decisiones visuales</small></span><ChevronRight size={17} /></button>
        </section>
      </div>

      <section className="continue-section">
        <div className="section-heading">
          <div><span className="eyebrow">SIGUIENTE PASO</span><h2>Continúa por aquí</h2></div>
          <button className="text-button" onClick={() => onNavigate('biblioteca')}>Ver todo <ArrowRight size={15} /></button>
        </div>
        <div className="document-row">
          {recent.map((doc, index) => <DocumentCard key={doc.id} document={doc} index={index + 1} onOpen={() => onOpen(doc)} />)}
        </div>
      </section>
    </div>
  )
}

function EmptyRoute({ onConfigure }: { onConfigure: () => void }) {
  return <div className="page empty-route"><MapPinned size={44} /><span className="eyebrow">RUTA SIN CONFIGURAR</span><h1>Primero necesitamos saber qué quieres construir.</h1><p>Selecciona objetivo, nivel y horas disponibles. El portal convertirá los 466 documentos en una secuencia manejable.</p><button className="primary-button" onClick={onConfigure}>Crear mi ruta <ArrowRight size={16} /></button></div>
}

function Metric({ value, label, accent }: { value: number | string; label: string; accent: string }) {
  return <div className={`metric metric-${accent}`}><strong>{value}</strong><span>{label}</span></div>
}

function LearningTrack() {
  const stages = [
    { number: '01', title: 'Comprender', text: 'Fundamentos, prompting y herramientas.', status: 'done' },
    { number: '02', title: 'Construir', text: 'Código, APIs, RAG y automatización.', status: 'active' },
    { number: '03', title: 'Operar', text: 'Testing, observabilidad y seguridad.', status: '' },
    { number: '04', title: 'Demostrar', text: 'Portfolio, defensa y entrega a cliente.', status: '' },
  ]
  return <div className="learning-track">{stages.map((stage) => (
    <div className={`track-stage ${stage.status}`} key={stage.number}>
      <div className="stage-marker">{stage.status === 'done' ? <Check size={15} /> : stage.number}</div>
      <div><strong>{stage.title}</strong><span>{stage.text}</span></div>
    </div>
  ))}</div>
}

function Library({ documents, completed, favorites, onOpen, onToggleCompleted, onToggleFavorite }: {
  documents: AcademyDocument[]
  completed: Set<string>
  favorites: Set<string>
  onOpen: (doc: AcademyDocument) => void
  onToggleCompleted: (id: string) => void
  onToggleFavorite: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const [folder, setFolder] = useState('all')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const folders = useMemo(() => [...new Set(documents.map((doc) => doc.folder))], [documents])
  const filtered = useMemo(() => documents.filter((doc) => {
    const matchesText = `${doc.title} ${doc.path} ${doc.excerpt}`.toLowerCase().includes(query.toLowerCase())
    return matchesText && (folder === 'all' || doc.folder === folder) && (!onlyFavorites || favorites.has(doc.id))
  }), [documents, favorites, folder, onlyFavorites, query])

  return (
    <div className="page">
      <PageIntro eyebrow="466+ RECURSOS CONECTADOS" title="Biblioteca operativa" text="Busca por problema, herramienta o resultado. Cada documento conserva la explicación extensa, la práctica, los errores y la defensa." />
      <div className="library-toolbar">
        <label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar: n8n, RAG, Vercel, vídeo..." /></label>
        <label className="select-field"><Filter size={17} /><select value={folder} onChange={(event) => setFolder(event.target.value)}><option value="all">Todas las áreas</option>{folders.map((item) => <option value={item} key={item}>{item.replace(/^\d+_/, '').replaceAll('_', ' ')}</option>)}</select></label>
        <button className={`filter-button ${onlyFavorites ? 'active' : ''}`} onClick={() => setOnlyFavorites((value) => !value)}><Sparkles size={16} /> Favoritos</button>
      </div>
      <div className="result-meta"><strong>{filtered.length}</strong> resultados <span>·</span> {filtered.reduce((sum, doc) => sum + doc.minutes, 0)} min de lectura</div>
      <div className="library-list">
        {filtered.slice(0, 120).map((doc, index) => (
          <article className="library-item" key={doc.id}>
            <button className={`completion-check ${completed.has(doc.id) ? 'done' : ''}`} onClick={() => onToggleCompleted(doc.id)} aria-label="Marcar como completado">{completed.has(doc.id) && <Check size={15} />}</button>
            <button className="library-item-main" onClick={() => onOpen(doc)}>
              <span className="item-number">{String(index + 1).padStart(3, '0')}</span>
              <span className="item-copy"><span className="item-kicker">{categoryLabels[doc.type]} · {doc.category}</span><strong>{doc.title}</strong><small>{doc.excerpt}</small></span>
              <span className="item-stats"><span><Clock3 size={14} /> {doc.minutes} min</span><span>{doc.words.toLocaleString('es-ES')} palabras</span></span>
            </button>
            <button className={`favorite-button ${favorites.has(doc.id) ? 'active' : ''}`} onClick={() => onToggleFavorite(doc.id)} aria-label="Guardar favorito"><Sparkles size={17} /></button>
          </article>
        ))}
      </div>
      {filtered.length > 120 && <p className="limit-note">Mostrando los primeros 120 resultados. Utiliza la búsqueda para concretar.</p>}
    </div>
  )
}

function AutomationLibrary({ workflows, onOpen }: { workflows: AcademyDocument[]; onOpen: (doc: AcademyDocument) => void }) {
  const [query, setQuery] = useState('')
  const groups = ['Todos', 'Ventas', 'Operaciones', 'Contenido', 'IA / RAG', 'Ingeniería']
  const [group, setGroup] = useState('Todos')
  const getGroup = (workflow: AcademyDocument, index: number) => {
    const text = `${workflow.title} ${workflow.excerpt}`.toLowerCase()
    if (/lead|email|proposal|customer|cart|review/.test(text)) return 'Ventas'
    if (/rag|llm|prompt|vector|agent|source/.test(text)) return 'IA / RAG'
    if (/github|deploy|database|api|secret|health|release/.test(text)) return 'Ingeniería'
    if (/content|youtube|video|blog|seo|linkedin/.test(text)) return 'Contenido'
    return index % 4 === 0 ? 'Ventas' : 'Operaciones'
  }
  const filtered = workflows.filter((workflow, index) => workflow.title.toLowerCase().includes(query.toLowerCase()) && (group === 'Todos' || getGroup(workflow, index) === group))
  return (
    <div className="page">
      <PageIntro eyebrow="40 WORKFLOWS IMPORTABLES" title="Automatizaciones de procesos" text="No son simples ideas: cada ficha explica para qué sirve, cómo se implementa, qué credenciales necesita, cómo falla y cómo llevarla a producción." />
      <div className="automation-overview">
        <div><Workflow size={26} /><strong>n8n</strong><span>Orquestación visual</span></div>
        <div><Code2 size={26} /><strong>40</strong><span>Automatizaciones con código</span></div>
        <div><ShieldCheck size={26} /><strong>HITL</strong><span>Aprobación humana</span></div>
        <div><Activity size={26} /><strong>Logs</strong><span>Observabilidad y control</span></div>
      </div>
      <div className="catalog-controls">
        <label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar automatización..." /></label>
        <div className="segment-control">{groups.map((item) => <button className={group === item ? 'active' : ''} onClick={() => setGroup(item)} key={item}>{item}</button>)}</div>
      </div>
      <div className="workflow-grid">
        {filtered.map((workflow, index) => {
          const jsonName = workflow.path.split('/').at(-1)?.replace(/\.md$/, '.json')
          const workflowGroup = getGroup(workflow, workflows.indexOf(workflow))
          return (
            <article className="workflow-card" key={workflow.id}>
              <div className="workflow-card-top"><span>{String(index + 1).padStart(2, '0')}</span><Workflow size={20} /></div>
              <div className="workflow-tags"><span>{workflowGroup}</span><span>{index % 3 === 0 ? 'Inicial' : index % 3 === 1 ? 'Intermedio' : 'Avanzado'}</span><span>{index % 4 + 4} nodos</span></div>
              <h3>{workflow.title}</h3>
              <p>{workflow.excerpt}</p>
              <div className="node-preview"><span>WEBHOOK</span><i /><span>REGLAS</span><i /><span>SALIDA</span></div>
              <div className="card-actions">
                <button onClick={() => onOpen(workflow)}>Ver implementación <ArrowRight size={15} /></button>
                <a href={`/generated/workflows/${jsonName}`} download title="Descargar JSON"><Download size={17} /></a>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function SkillsLibrary({ skills, onOpen }: { skills: AcademyDocument[]; onOpen: (doc: AcademyDocument) => void }) {
  const [selected, setSelected] = useState(skills[0]?.id || '')
  const [copied, setCopied] = useState(false)
  const active = skills.find((skill) => skill.id === selected) || skills[0]
  const copySkill = async () => {
    if (!active) return
    await navigator.clipboard.writeText(active.content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className="page">
      <PageIntro eyebrow="40 CAPACIDADES REUTILIZABLES" title="Skills para agentes y equipos" text="Una skill convierte buenas intenciones en un procedimiento repetible: cuándo activarse, qué revisar, qué entregar y cuándo detenerse." />
      <div className="skills-workbench">
        <div className="skills-index">
          {skills.map((skill, index) => <button key={skill.id} className={active?.id === skill.id ? 'active' : ''} onClick={() => setSelected(skill.id)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{skill.title}</strong><ChevronRight size={16} /></button>)}
        </div>
        {active && (
          <section className="skill-detail">
            <div className="skill-terminal-bar"><span /><span /><span /><small>SKILL.md</small></div>
            <div className="skill-detail-body">
              <span className="eyebrow">CAPACIDAD ACTIVA</span>
              <h2>{active.title}</h2>
              <p>{active.excerpt}</p>
              <div className="skill-contract">
                <div><span>TRIGGER</span><strong>Petición o contexto compatible</strong></div>
                <div><span>PROCESO</span><strong>Checklist, validación y ejecución</strong></div>
                <div><span>SALIDA</span><strong>Entregable verificable</strong></div>
              </div>
              <div className="skill-actions"><button className="primary-button" onClick={() => onOpen(active)}>Abrir skill completa <ArrowRight size={16} /></button><button className="skill-copy" onClick={copySkill}>{copied ? <Check size={16} /> : <Terminal size={16} />}{copied ? 'Copiada' : 'Copiar SKILL.md'}</button></div>
              <div className="skill-install"><span>INSTALACIÓN MANUAL</span><code>~/.codex/skills/{active.title.toLowerCase().replaceAll(' ', '-')}/SKILL.md</code></div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function VisualLab({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [scenario, setScenario] = useState<'llm' | 'rag' | 'video' | 'ops'>('llm')
  const scenarios = {
    llm: { title: 'Router multi-LLM', subtitle: 'Elige modelo por coste, velocidad y capacidad', nodes: ['Petición', 'Router', 'Modelo A', 'Validación', 'Respuesta'], color: 'red' },
    rag: { title: 'Sistema RAG', subtitle: 'Responde con contexto recuperado y fuentes', nodes: ['Documento', 'Embeddings', 'Vector DB', 'LLM', 'Citas'], color: 'cyan' },
    video: { title: 'Fábrica de vídeo', subtitle: 'Del brief a clips publicados y medidos', nodes: ['Brief', 'Guion', 'Voz', 'Render', 'Publicación'], color: 'yellow' },
    ops: { title: 'Operación segura', subtitle: 'Automatiza con aprobación y observabilidad', nodes: ['Evento', 'Reglas', 'Aprobación', 'Acción', 'Log'], color: 'ink' },
  }
  const current = scenarios[scenario]
  return (
    <div className="page visual-page">
      <PageIntro eyebrow="EXPLICACIONES VISUALES" title="Mapas para pensar sistemas" text="Selecciona un escenario y recorre el flujo. Cada mapa convierte conceptos abstractos en componentes, responsabilidades y puntos de control." />
      <div className="visual-switcher">{Object.entries(scenarios).map(([key, item]) => <button className={scenario === key ? 'active' : ''} onClick={() => setScenario(key as typeof scenario)} key={key}>{item.title}</button>)}</div>
      <section className={`architecture-board board-${current.color}`}>
        <div className="architecture-header"><div><span className="eyebrow">ARQUITECTURA 0{Object.keys(scenarios).indexOf(scenario) + 1}</span><h2>{current.title}</h2><p>{current.subtitle}</p></div><div className="board-legend"><span><i className="legend-data" /> Datos</span><span><i className="legend-control" /> Control</span></div></div>
        <div className="architecture-flow">
          {current.nodes.map((node, index) => (
            <div className="flow-fragment" key={node}>
              <div className={`architecture-node node-${index}`}><span>{String(index + 1).padStart(2, '0')}</span>{index === 0 ? <Zap size={22} /> : index === 2 ? <Database size={22} /> : index === 3 ? <Bot size={22} /> : <GitBranch size={22} />}<strong>{node}</strong><small>{index === 0 ? 'entrada estructurada' : index === 4 ? 'resultado + evidencia' : 'transformación controlada'}</small></div>
              {index < current.nodes.length - 1 && <div className="flow-connector"><ArrowRight size={20} /><span>{index === 1 ? 'decisión' : 'datos'}</span></div>}
            </div>
          ))}
        </div>
        <div className="architecture-notes"><div><ShieldCheck size={19} /><span><strong>Punto de control</strong> Valida esquema, permisos y coste antes de ejecutar.</span></div><div><Activity size={19} /><span><strong>Evidencia</strong> Guarda entrada, decisión, salida y errores.</span></div><button onClick={() => onNavigate('demo')}>Verlo funcionar <Play size={15} /></button></div>
      </section>
      <section className="decision-matrix">
        <div className="section-heading"><div><span className="eyebrow">DECISIONES DE DISEÑO</span><h2>Qué cambia en producción</h2></div></div>
        <div className="matrix-table"><div className="matrix-row matrix-head"><span>Dimensión</span><span>Prototipo</span><span>Producción</span></div>{[
          ['Datos', 'Payload ficticio', 'Schema + consentimiento'],
          ['Credenciales', 'Variables locales', 'Secret manager + rotación'],
          ['Errores', 'Mensaje en consola', 'Retry + cola + alerta'],
          ['Calidad', 'Revisión manual', 'Evals + muestreo humano'],
          ['Coste', 'Sin límites', 'Presupuesto + corte automático'],
        ].map((row) => <div className="matrix-row" key={row[0]}>{row.map((cell) => <span key={cell}>{cell}</span>)}</div>)}</div>
      </section>
    </div>
  )
}

function FunctionalDemo() {
  const [lead, setLead] = useState<DemoLead>({ name: 'Laura Martín', email: 'laura@estudioejemplo.es', company: 'Estudio Norte', budget: '5000', need: 'Automatizar la cualificación de leads y el seguimiento comercial.', consent: true })
  const [events, setEvents] = useState<DemoEvent[]>([])
  const [running, setRunning] = useState(false)
  const [awaitingApproval, setAwaitingApproval] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [result, setResult] = useState<'won' | 'rejected' | null>(null)
  const [mode, setMode] = useState<'simulation' | 'n8n'>('simulation')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [history, setHistory] = useState<Array<{ date: string; status: string; lead: string; score: number | null }>>(() => {
    try { return JSON.parse(localStorage.getItem('academy-demo-history') || '[]') } catch { return [] }
  })

  useEffect(() => {
    if (!result) return
    const record = { date: new Date().toISOString(), status: result, lead: lead.email, score }
    setHistory((current) => {
      const next = [record, ...current].slice(0, 8)
      localStorage.setItem('academy-demo-history', JSON.stringify(next))
      return next
    })
  }, [result])

  const addEvent = (stage: string, status: DemoEvent['status'], detail: string) => setEvents((current) => [...current, { id: crypto.randomUUID(), time: new Date().toLocaleTimeString('es-ES'), stage, status, detail }])

  const runDemo = async (event: FormEvent) => {
    event.preventDefault()
    setEvents([])
    setResult(null)
    setScore(null)
    setAwaitingApproval(false)
    setRunning(true)
    addEvent('Webhook', 'done', `Lead recibido desde formulario: ${lead.email}`)
    await delay(450)
    if (!lead.name || !lead.email || !lead.need) {
      addEvent('Validación', 'blocked', 'Faltan nombre, email o necesidad. El proceso se detiene sin enviar datos.')
      setRunning(false)
      return
    }
    if (!lead.consent) {
      addEvent('Privacidad', 'blocked', 'No existe consentimiento. El lead no se almacena ni se contacta.')
      setRunning(false)
      return
    }
    addEvent('Validación', 'done', 'Schema correcto y consentimiento verificado.')
    await delay(500)
    if (mode === 'n8n') {
      if (!/^https?:\/\//i.test(webhookUrl)) {
        addEvent('Conexión n8n', 'blocked', 'Introduce una URL completa de webhook que empiece por http:// o https://.')
        setRunning(false)
        return
      }
      addEvent('Conexión n8n', 'waiting', `Enviando payload al webhook configurado.`)
      try {
        const response = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lead, source: 'ai-professional-academy', requestedAt: new Date().toISOString() }) })
        const responseText = await response.text()
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${responseText.slice(0, 120)}`)
        addEvent('Conexión n8n', 'done', `Webhook respondió HTTP ${response.status}. ${responseText.slice(0, 100) || 'Sin cuerpo de respuesta.'}`)
        addEvent('Evidencia', 'done', 'Respuesta registrada. Revisa la ejecución real en n8n antes de dar el proceso por cerrado.')
        setResult('won')
      } catch (error) {
        addEvent('Conexión n8n', 'blocked', `No se pudo completar la llamada: ${error instanceof Error ? error.message : 'error desconocido'}. Revisa CORS, URL y estado del workflow.`)
      }
      setRunning(false)
      return
    }
    const calculatedScore = Math.min(100, 25 + (Number(lead.budget) >= 3000 ? 35 : 12) + (lead.need.length > 35 ? 25 : 10) + (lead.company ? 15 : 0))
    setScore(calculatedScore)
    addEvent('Clasificación IA', 'done', `Prioridad ${calculatedScore >= 75 ? 'alta' : calculatedScore >= 55 ? 'media' : 'baja'} · score ${calculatedScore}/100 · confianza 0,91`)
    await delay(500)
    addEvent('Aprobación humana', 'waiting', 'La propuesta está preparada. Una persona debe aprobar el contacto antes de enviar.')
    setAwaitingApproval(true)
    setRunning(false)
  }

  const resolveApproval = async (approved: boolean) => {
    setAwaitingApproval(false)
    setRunning(true)
    if (!approved) {
      addEvent('Aprobación humana', 'blocked', 'Propuesta rechazada. Se crea tarea de revisión sin contactar al lead.')
      setResult('rejected')
      setRunning(false)
      return
    }
    addEvent('Aprobación humana', 'done', 'Contacto aprobado por responsable comercial.')
    await delay(500)
    addEvent('CRM', 'done', `${lead.name} creado en pipeline “Oportunidades IA” con score ${score}.`)
    await delay(500)
    addEvent('Email', 'done', `Email personalizado preparado y enviado a ${lead.email}.`)
    await delay(350)
    addEvent('Observabilidad', 'done', 'Ejecución cerrada: 6 pasos, 0 reintentos, coste simulado 0,004 €.')
    setResult('won')
    setRunning(false)
  }

  const downloadReport = () => {
    const blob = new Blob([JSON.stringify({ lead, score, result, events, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'ejecucion-demo-academy.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page demo-page">
      <PageIntro eyebrow="VERTICAL SLICE FUNCIONAL" title="Del lead al resultado" text="Esta demo ejecuta el proceso completo en el navegador. Puedes provocar errores, aprobar o rechazar la acción y exportar la evidencia de ejecución." />
      <section className="demo-mode-bar">
        <div><span className="eyebrow">MODO DE EJECUCIÓN</span><strong>{mode === 'simulation' ? 'Laboratorio seguro' : 'Webhook n8n real'}</strong></div>
        <div className="mode-toggle"><button className={mode === 'simulation' ? 'active' : ''} onClick={() => setMode('simulation')}><CircleGauge size={16} /> Simulación</button><button className={mode === 'n8n' ? 'active' : ''} onClick={() => setMode('n8n')}><Workflow size={16} /> Conectar n8n</button></div>
        <p>{mode === 'simulation' ? 'Todo ocurre en este navegador; no se envían datos.' : 'El payload se enviará a la URL indicada al pulsar ejecutar. Usa datos ficticios durante las pruebas.'}</p>
      </section>
      <div className="demo-layout">
        <form className="demo-form panel" onSubmit={runDemo}>
          <div className="demo-section-title"><span>01</span><div><strong>Entrada</strong><small>Payload del formulario</small></div></div>
          <label>Nombre<input value={lead.name} onChange={(event) => setLead({ ...lead, name: event.target.value })} /></label>
          <label>Email<input type="email" value={lead.email} onChange={(event) => setLead({ ...lead, email: event.target.value })} /></label>
          <div className="field-row"><label>Empresa<input value={lead.company} onChange={(event) => setLead({ ...lead, company: event.target.value })} /></label><label>Presupuesto (€)<input type="number" value={lead.budget} onChange={(event) => setLead({ ...lead, budget: event.target.value })} /></label></div>
          <label>Necesidad<textarea rows={4} value={lead.need} onChange={(event) => setLead({ ...lead, need: event.target.value })} /></label>
          <label className="check-label"><input type="checkbox" checked={lead.consent} onChange={(event) => setLead({ ...lead, consent: event.target.checked })} /><span><Check size={14} /></span>Consentimiento para procesar y contactar</label>
          {mode === 'n8n' && <label className="webhook-field">Webhook n8n<input type="url" value={webhookUrl} onChange={(event) => setWebhookUrl(event.target.value)} placeholder="https://n8n.tudominio.com/webhook/lead" /><small>No se guarda al recargar la página.</small></label>}
          <button className="primary-button full-button" disabled={running || awaitingApproval}>{running ? <><Activity className="spin" size={17} /> Procesando...</> : <><Play size={17} /> Ejecutar automatización</>}</button>
        </form>

        <section className="demo-console panel">
          <div className="demo-section-title"><span>02</span><div><strong>Ejecución</strong><small>Eventos y decisiones</small></div>{events.length > 0 && <button className="icon-button" onClick={downloadReport} title="Exportar evidencia"><Download size={17} /></button>}</div>
          <div className="pipeline-strip">
            {['Input', 'Validar', 'IA', 'Aprobar', 'CRM', 'Email'].map((item, index) => <div className={events.length > index ? 'done' : ''} key={item}><span>{events.length > index ? <Check size={13} /> : index + 1}</span><small>{item}</small></div>)}
          </div>
          {events.length === 0 ? <div className="console-empty"><CircleGauge size={36} /><strong>Esperando una ejecución</strong><span>Modifica los datos y pulsa ejecutar.</span></div> : <div className="event-log">{events.map((event) => <div className={`event event-${event.status}`} key={event.id}><span className="event-time">{event.time}</span><i /> <div><strong>{event.stage}</strong><p>{event.detail}</p></div></div>)}</div>}
          {awaitingApproval && <div className="approval-gate"><UserCheck size={23} /><div><strong>Decisión requerida</strong><span>Revisa el score y autoriza la acción externa.</span></div><button className="approve" onClick={() => resolveApproval(true)}><Check size={16} /> Aprobar</button><button className="reject" onClick={() => resolveApproval(false)}><X size={16} /> Rechazar</button></div>}
          {result === 'won' && <div className="result-banner"><CheckCircle2 size={23} /><div><strong>Proceso completado</strong><span>Lead guardado, contacto enviado y evidencia disponible.</span></div></div>}
        </section>
      </div>
      {history.length > 0 && <section className="evidence-history"><div className="section-heading"><div><span className="eyebrow">EVIDENCIAS LOCALES</span><h2>Últimas ejecuciones</h2></div><span>{history.length} registros</span></div><div>{history.map((item, index) => <article key={`${item.date}-${index}`}><span className={item.status}>{item.status === 'won' ? <Check size={14} /> : <X size={14} />}</span><div><strong>{item.lead}</strong><small>{new Date(item.date).toLocaleString('es-ES')}</small></div><b>{item.score === null ? 'WEBHOOK' : `${item.score}/100`}</b></article>)}</div></section>}
      <section className="production-map">
        <div><span className="eyebrow">PASO A PRODUCCIÓN</span><h2>La misma demo, conectada a herramientas reales</h2></div>
        <div className="production-steps"><span><strong>01</strong> Formulario / Webhook n8n</span><ArrowRight size={17} /><span><strong>02</strong> OpenAI / LiteLLM</span><ArrowRight size={17} /><span><strong>03</strong> Slack approval</span><ArrowRight size={17} /><span><strong>04</strong> HubSpot + Resend</span><ArrowRight size={17} /><span><strong>05</strong> Postgres + Sentry</span></div>
      </section>
    </div>
  )
}

function DocumentCard({ document, index, onOpen }: { document: AcademyDocument; index: number; onOpen: () => void }) {
  return <button className="document-card" onClick={onOpen}><span className="document-card-index">0{index}</span><FileText size={22} /><span className="card-kicker">{document.category}</span><strong>{document.title}</strong><small>{document.excerpt}</small><span className="read-meta"><Clock3 size={14} /> {document.minutes} min <ArrowRight size={15} /></span></button>
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <header className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></header>
}

function DocumentReader({ document, completed, favorite, onClose, onToggleCompleted, onToggleFavorite }: {
  document: AcademyDocument
  completed: boolean
  favorite: boolean
  onClose: () => void
  onToggleCompleted: () => void
  onToggleFavorite: () => void
}) {
  return (
    <div className="reader-overlay" role="dialog" aria-modal="true" aria-label={document.title}>
      <div className="reader-shell">
        <header className="reader-header">
          <div><span>{categoryLabels[document.type]} · {document.minutes} min</span><strong>{document.title}</strong></div>
          <div className="reader-actions"><button className={favorite ? 'active' : ''} onClick={onToggleFavorite} title="Favorito"><Sparkles size={17} /></button><button onClick={() => window.print()} title="Imprimir"><Printer size={17} /></button><button onClick={onClose} title="Cerrar"><X size={19} /></button></div>
        </header>
        <article className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{document.content}</ReactMarkdown></article>
        <footer className="reader-footer"><span>{document.path}</span><button className={completed ? 'completed' : ''} onClick={onToggleCompleted}>{completed ? <><Check size={16} /> Completado</> : 'Marcar como completado'}</button></footer>
      </div>
    </div>
  )
}

function CommandPalette({ documents, onClose, onOpen, onNavigate }: { documents: AcademyDocument[]; onClose: () => void; onOpen: (doc: AcademyDocument) => void; onNavigate: (view: View) => void }) {
  const [query, setQuery] = useState('')
  const results = documents.filter((doc) => `${doc.title} ${doc.path}`.toLowerCase().includes(query.toLowerCase())).slice(0, 7)
  return <div className="palette-overlay" onMouseDown={onClose}><div className="palette" onMouseDown={(event) => event.stopPropagation()}><div className="palette-search"><Search size={19} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Escribe un tema, herramienta o documento..." /><kbd>ESC</kbd></div>{!query && <div className="palette-shortcuts"><span>IR A</span>{navigation.map((item) => <button key={item.id} onClick={() => onNavigate(item.id)}><item.icon size={17} />{item.label}<ArrowRight size={15} /></button>)}</div>}{query && <div className="palette-results">{results.map((doc) => <button key={doc.id} onClick={() => onOpen(doc)}><FileText size={17} /><span><strong>{doc.title}</strong><small>{doc.path}</small></span><ArrowRight size={15} /></button>)}</div>}</div></div>
}

function LoadingState() {
  return <div className="loading-state"><div className="loader-mark">AI</div><strong>Indexando la academia</strong><span>Preparando documentos, workflows y skills...</span></div>
}

export default App
