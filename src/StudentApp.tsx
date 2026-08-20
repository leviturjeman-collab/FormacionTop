import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Code2,
  Copy,
  Download,
  FileCheck2,
  FileText,
  FolderKanban,
  Home,
  Menu,
  PanelLeftClose,
  Play,
  Search,
  Settings2,
  Terminal,
  TestTube2,
  Wrench,
  X,
} from 'lucide-react'
import type { ProjectLogEntry, ProjectProfile, StudentCatalog, StudentLevel, StudentModule, StudentResource, WalkthroughProgress } from './student-types'

type View = 'home' | 'program' | 'project' | 'workshop' | 'resources' | 'lesson'

const emptyCatalog: StudentCatalog = { generatedAt: '', stats: { resources: 0, lessons: 0, modules: 0 }, modules: [], resources: [] }
const defaultProject: ProjectProfile = { studentName: '', projectName: '', type: 'automation', audience: '', problem: '', outcome: '', tools: '' }

const navItems: Array<{ id: View; label: string; icon: typeof Home }> = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'program', label: 'Programa', icon: BookOpen },
  { id: 'project', label: 'Proyecto opcional', icon: FolderKanban },
  { id: 'workshop', label: 'Taller', icon: Wrench },
  { id: 'resources', label: 'Recursos', icon: FileText },
]

const studentLevels: Array<{ id: StudentLevel; label: string; short: string }> = [
  { id: 'basic', label: 'Basic', short: 'B' },
  { id: 'medium', label: 'Medium', short: 'M' },
  { id: 'advanced', label: 'Advanced', short: 'A' },
]

const levelTrack = (resource: StudentResource, level: StudentLevel) => resource.levels?.[level] || resource.levels?.basic

const projectTypeLabels: Record<ProjectProfile['type'], string> = {
  automation: 'Automatización de procesos',
  'multi-llm': 'Sistema con varios LLM',
  video: 'Pipeline de vídeo con IA',
  product: 'Producto o aplicación IA',
  service: 'Servicio profesional de IA',
}

function readStorage<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || '') as T } catch { return fallback }
}

function StudentApp() {
  const [catalog, setCatalog] = useState<StudentCatalog>(emptyCatalog)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('home')
  const [level, setLevel] = useState<StudentLevel>(() => readStorage<StudentLevel>('academy-level-v1', 'basic'))
  const [project, setProject] = useState<ProjectProfile | null>(() => readStorage<ProjectProfile | null>('academy-project-v3', null))
  const [setupOpen, setSetupOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<StudentResource | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [walkthroughs, setWalkthroughs] = useState<Record<string, WalkthroughProgress>>(() => readStorage('academy-walkthroughs-v3', {}))
  const [projectLog, setProjectLog] = useState<ProjectLogEntry[]>(() => readStorage('academy-project-log-v3', []))

  const changeLevel = (next: StudentLevel) => {
    setLevel(next)
    localStorage.setItem('academy-level-v1', JSON.stringify(next))
  }

  useEffect(() => {
    fetch('/student-catalog.json')
      .then((response) => {
        if (!response.ok) throw new Error('No se pudo cargar el programa adaptado')
        return response.json()
      })
      .then((data: StudentCatalog) => setCatalog(data))
      .finally(() => setLoading(false))
  }, [])

  const resourcesById = useMemo(() => new Map(catalog.resources.map((resource) => [resource.id, resource])), [catalog.resources])
  const lessonIds = useMemo(() => catalog.modules.flatMap((module) => module.lessonIds), [catalog.modules])
  const isLessonComplete = (resource: StudentResource) => (walkthroughs[resource.id]?.completedSteps.length || 0) >= resource.walkthrough.length
  const completedLessons = lessonIds.filter((id) => {
    const resource = resourcesById.get(id)
    return resource ? isLessonComplete(resource) : false
  }).length
  const nextLesson = lessonIds.map((id) => resourcesById.get(id)).find((resource) => resource && !isLessonComplete(resource)) || resourcesById.get(lessonIds[0])

  const openLesson = (resource: StudentResource) => {
    setSelectedLesson(resource)
    setView('lesson')
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigate = (next: View) => {
    setView(next)
    setSelectedLesson(null)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveProject = (next: ProjectProfile) => {
    setProject(next)
    localStorage.setItem('academy-project-v3', JSON.stringify(next))
    setSetupOpen(false)
    setView('home')
  }

  const saveWalkthrough = (resourceId: string, progress: WalkthroughProgress) => {
    setWalkthroughs((current) => {
      const next = { ...current, [resourceId]: progress }
      localStorage.setItem('academy-walkthroughs-v3', JSON.stringify(next))
      return next
    })
  }

  const addProjectLog = (entry: ProjectLogEntry) => {
    setProjectLog((current) => {
      const withoutDuplicate = current.filter((item) => !(item.resourceId === entry.resourceId && item.stepId === entry.stepId))
      const next = [entry, ...withoutDuplicate].slice(0, 300)
      localStorage.setItem('academy-project-log-v3', JSON.stringify(next))
      return next
    })
  }

  if (loading) return <Loading />

  return (
    <div className="student-app">
      <StudentSidebar view={view} open={menuOpen} progress={lessonIds.length ? completedLessons / lessonIds.length : 0} level={level} onLevelChange={changeLevel} onNavigate={navigate} onClose={() => setMenuOpen(false)} />
      <main className="student-main">
        <StudentHeader project={project} view={view} onMenu={() => setMenuOpen(true)} onEditProject={() => setSetupOpen(true)} />
        {view === 'home' && <StudentHome catalog={catalog} project={project} level={level} nextLesson={nextLesson} completedLessons={completedLessons} totalLessons={lessonIds.length} walkthroughs={walkthroughs} resourcesById={resourcesById} onOpenLesson={openLesson} onNavigate={navigate} />}
        {view === 'program' && <Program catalog={catalog} level={level} resourcesById={resourcesById} walkthroughs={walkthroughs} onOpenLesson={openLesson} />}
        {view === 'project' && project && <ProjectWorkspace project={project} log={projectLog} modules={catalog.modules} resourcesById={resourcesById} walkthroughs={walkthroughs} onSave={saveProject} />}
        {view === 'project' && !project && <NoProject onSetup={() => setSetupOpen(true)} />}
        {view === 'workshop' && <Workshop project={project} onSetup={() => setSetupOpen(true)} />}
        {view === 'resources' && <ResourceLibrary catalog={catalog} level={level} onOpenLesson={openLesson} walkthroughs={walkthroughs} />}
        {view === 'lesson' && selectedLesson && <Walkthrough resource={selectedLesson} level={level} project={project} progress={walkthroughs[selectedLesson.id] || { completedSteps: [], evidence: {} }} onBack={() => navigate('program')} onSave={(progress) => saveWalkthrough(selectedLesson.id, progress)} onLog={addProjectLog} />}
      </main>
      {setupOpen && <ProjectSetup initial={project || defaultProject} onSave={saveProject} onClose={() => setSetupOpen(false)} />}
    </div>
  )
}

function StudentSidebar({ view, open, progress, level, onLevelChange, onNavigate, onClose }: { view: View; open: boolean; progress: number; level: StudentLevel; onLevelChange: (level: StudentLevel) => void; onNavigate: (view: View) => void; onClose: () => void }) {
  return <>
    {open && <button className="st-scrim" onClick={onClose} aria-label="Cerrar menú" />}
    <aside className={`st-sidebar ${open ? 'open' : ''}`}>
      <div className="st-brand"><span>AP</span><div><strong>AI Professional</strong><small>Academy</small></div></div>
      <nav>{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={view === item.id || (view === 'lesson' && item.id === 'program') ? 'active' : ''} onClick={() => onNavigate(item.id)}><Icon size={17} /><span>{item.label}</span></button> })}</nav>
      <div className="st-level-switch"><span>NIVEL</span><div>{studentLevels.map((item) => <button key={item.id} className={level === item.id ? 'active' : ''} onClick={() => onLevelChange(item.id)} title={item.label}>{item.short}</button>)}</div><small>{studentLevels.find((item) => item.id === level)?.label}</small></div>
      <div className="st-course-progress"><div><span>PROGRESO DEL PROGRAMA</span><strong>{Math.round(progress * 100)}%</strong></div><i><b style={{width: `${progress * 100}%`}} /></i><small>Las prácticas cuentan cuando completas todas sus evidencias.</small></div>
    </aside>
  </>
}

function StudentHeader({ project, view, onMenu, onEditProject }: { project: ProjectProfile | null; view: View; onMenu: () => void; onEditProject: () => void }) {
  const label = view === 'lesson' ? 'Walkthrough' : navItems.find((item) => item.id === view)?.label || 'Academia'
  return <header className="st-header"><button className="st-menu" onClick={onMenu} aria-label="Abrir menú"><Menu size={20} /></button><div><span>AI Professional Academy</span><ChevronRight size={13} /><strong>{label}</strong></div><button className="st-project-switch" onClick={onEditProject}><span>{project?.projectName || 'Proyecto opcional'}</span><Settings2 size={15} /></button></header>
}

function StudentHome({ catalog, project, level, nextLesson, completedLessons, totalLessons, walkthroughs, resourcesById, onOpenLesson, onNavigate }: {
  catalog: StudentCatalog; project: ProjectProfile | null; level: StudentLevel; nextLesson?: StudentResource; completedLessons: number; totalLessons: number; walkthroughs: Record<string, WalkthroughProgress>; resourcesById: Map<string, StudentResource>; onOpenLesson: (resource: StudentResource) => void; onNavigate: (view: View) => void
}) {
  const currentModule = catalog.modules.find((module) => module.lessonIds.some((id) => { const resource = resourcesById.get(id); return resource && (walkthroughs[id]?.completedSteps.length || 0) < resource.walkthrough.length })) || catalog.modules.at(-1)
  const nextTrack = nextLesson ? levelTrack(nextLesson, level) : null
  return <div className="st-page st-home">
    <section className="st-welcome"><div><span className="st-kicker">ESPACIO DE ESTUDIO</span><h1>{project ? `Hola, ${project.studentName}.` : 'Empieza por la formación.'}</h1><p>{project ? <>Tienes activado el proyecto <strong>{project.projectName}</strong> para {project.audience || 'un usuario concreto'}. Puedes aplicar ahí las prácticas cuando quieras.</> : 'Puedes estudiar el programa completo sin crear nada. Cuando una lección proponga una práctica, podrás guardarla como nota, plantilla, decisión o evidencia; el proyecto es solo una opción.'}</p></div><div className="st-overall"><span>{completedLessons}/{totalLessons}</span><small>lecciones terminadas</small></div></section>
    <div className="st-home-grid">
      <section className="st-next">
        <div className="st-section-head"><div><span className="st-kicker">CONTINÚA POR AQUÍ</span><h2>Próxima práctica</h2></div><span>{currentModule?.number} · {currentModule?.title}</span></div>
        {nextLesson && nextTrack && <button className="st-next-card" onClick={() => onOpenLesson(nextLesson)}><div className="st-next-type"><Play size={18} /><span>{nextTrack.label}</span></div><div><h3>{nextLesson.title}</h3><p>{nextTrack.summary}</p><div className="st-meta"><span><Clock3 size={14} /> {nextTrack.duration} min</span><span><ClipboardCheck size={14} /> {nextLesson.walkthrough.length} pasos</span><span><FileCheck2 size={14} /> {nextTrack.evidence}</span></div></div><ArrowRight size={20} /></button>}
      </section>
      <aside className="st-project-brief"><span className="st-kicker">RUTA OPCIONAL</span>{project ? <><h2>{project.projectName}</h2><dl><div><dt>Problema</dt><dd>{project.problem || 'Pendiente de concretar'}</dd></div><div><dt>Usuario</dt><dd>{project.audience || 'Pendiente de concretar'}</dd></div><div><dt>Resultado</dt><dd>{project.outcome || 'Pendiente de concretar'}</dd></div></dl><button onClick={() => onNavigate('project')}>Abrir ficha del proyecto <ArrowRight size={15} /></button></> : <><h2>Sin proyecto</h2><p>La formación funciona como curso guiado. Si más adelante quieres construir algo, activa un espacio de proyecto.</p><button onClick={() => onNavigate('project')}>Ver opción de proyecto</button></>}</aside>
    </div>
    <section className="st-modules-preview"><div className="st-section-head"><div><span className="st-kicker">PROGRAMA CURADO</span><h2>Ocho etapas, varias formas de avanzar</h2></div><button onClick={() => onNavigate('program')}>Ver programa completo <ArrowRight size={15} /></button></div><div>{catalog.modules.map((module) => { const done = module.lessonIds.filter((id) => { const r = resourcesById.get(id); return r && (walkthroughs[id]?.completedSteps.length || 0) >= r.walkthrough.length }).length; return <article key={module.id}><span>{module.number}</span><div><strong>{module.title}</strong><small>{module.milestone}</small></div><b>{done}/{module.lessonIds.length}</b></article> })}</div></section>
  </div>
}

function Program({ catalog, level, resourcesById, walkthroughs, onOpenLesson }: { catalog: StudentCatalog; level: StudentLevel; resourcesById: Map<string, StudentResource>; walkthroughs: Record<string, WalkthroughProgress>; onOpenLesson: (resource: StudentResource) => void }) {
  const [openModule, setOpenModule] = useState(catalog.modules[0]?.id || '')
  return <div className="st-page"><PageTitle eyebrow="PROGRAMA" title="Aprender con práctica opcional" text="Las lecciones convierten la bóveda en estudio guiado. Algunas terminan en una nota, plantilla, decisión, prueba o proyecto, según lo que el alumno quiera hacer." />
    <div className="st-program">{catalog.modules.map((module) => { const lessons = module.lessonIds.map((id) => resourcesById.get(id)).filter(Boolean) as StudentResource[]; const done = lessons.filter((lesson) => (walkthroughs[lesson.id]?.completedSteps.length || 0) >= lesson.walkthrough.length).length; const open = openModule === module.id; return <section className={`st-module ${open ? 'open' : ''}`} key={module.id}><button className="st-module-head" onClick={() => setOpenModule(open ? '' : module.id)}><span>{module.number}</span><div><h2>{module.title}</h2><p>{module.description}</p></div><div className="st-module-status"><strong>{done}/{lessons.length}</strong><small>{module.milestone}</small></div><ChevronDown size={18} /></button>{open && <div className="st-lesson-list">{lessons.map((lesson, index) => { const stepDone = walkthroughs[lesson.id]?.completedSteps.length || 0; const complete = stepDone >= lesson.walkthrough.length; const track = levelTrack(lesson, level); return <button key={lesson.id} onClick={() => onOpenLesson(lesson)}><span className={complete ? 'complete' : ''}>{complete ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><div><small>{lesson.kind} · {track?.label}</small><strong>{lesson.title}</strong><p>{track?.summary || lesson.summary}</p></div><div><span><Clock3 size={13} /> {track?.duration || lesson.duration} min</span><span>{stepDone}/{lesson.walkthrough.length} pasos</span></div><ChevronRight size={17} /></button>})}</div>}</section> })}</div>
  </div>
}

function Walkthrough({ resource, level, project, progress, onBack, onSave, onLog }: { resource: StudentResource; level: StudentLevel; project: ProjectProfile | null; progress: WalkthroughProgress; onBack: () => void; onSave: (progress: WalkthroughProgress) => void; onLog: (entry: ProjectLogEntry) => void }) {
  const firstIncomplete = Math.max(0, resource.walkthrough.findIndex((step) => !progress.completedSteps.includes(step.id)))
  const [currentIndex, setCurrentIndex] = useState(firstIncomplete === -1 ? resource.walkthrough.length - 1 : firstIncomplete)
  const [evidence, setEvidence] = useState(progress.evidence[resource.walkthrough[currentIndex]?.id] || '')
  const [copied, setCopied] = useState(false)
  const step = resource.walkthrough[currentIndex]
  const track = levelTrack(resource, level)
  const isDone = progress.completedSteps.includes(step.id)
  const cleanOutcome = (project?.outcome || 'producir un resultado concreto').replace(/[.!?]+$/, '')
  const projectContext = project ? `En “${project.projectName}”, que busca ${cleanOutcome} para ${project.audience || 'su usuario'},` : 'Como actividad de estudio,'

  useEffect(() => setEvidence(progress.evidence[step.id] || ''), [currentIndex, progress.evidence, step.id])

  const completeStep = () => {
    if (evidence.trim().length < 3) return
    const completedSteps = progress.completedSteps.includes(step.id) ? progress.completedSteps : [...progress.completedSteps, step.id]
    const nextProgress = { completedSteps, evidence: { ...progress.evidence, [step.id]: evidence.trim() } }
    onSave(nextProgress)
    onLog({ id: `${resource.id}-${step.id}`, resourceId: resource.id, resourceTitle: resource.title, stepId: step.id, phase: step.phase, field: step.projectField, evidence: evidence.trim(), createdAt: new Date().toISOString() })
    if (currentIndex < resource.walkthrough.length - 1) setCurrentIndex(currentIndex + 1)
  }

  const copyCommand = async () => { if (!step.command) return; await navigator.clipboard.writeText(step.command); setCopied(true); window.setTimeout(() => setCopied(false), 1500) }
  const percent = Math.round(progress.completedSteps.length / resource.walkthrough.length * 100)

  return <div className="st-walkthrough">
    <header className="st-walkthrough-head"><button onClick={onBack}><ArrowLeft size={17} /> Programa</button><div><span>{resource.kind} · {track?.label}</span><strong>{resource.title}</strong></div><div><b>{percent}%</b><i><span style={{width: `${percent}%`}} /></i></div></header>
    <div className="st-walkthrough-layout">
      <aside className="st-step-rail"><div><span className="st-kicker">PASO A PASO</span><strong>{progress.completedSteps.length}/{resource.walkthrough.length} completados</strong></div>{resource.walkthrough.map((item, index) => <button key={item.id} className={`${currentIndex === index ? 'active' : ''} ${progress.completedSteps.includes(item.id) ? 'done' : ''}`} onClick={() => setCurrentIndex(index)}><span>{progress.completedSteps.includes(item.id) ? <Check size={13} /> : index + 1}</span><div><small>{item.phase}</small><strong>{item.title}</strong></div></button>)}</aside>
      <article className="st-step-workspace">
        <div className="st-step-counter"><span>{step.phase}</span><strong>Paso {currentIndex + 1} de {resource.walkthrough.length}</strong></div>
        <h1>{step.title}</h1>
        <section className="st-apply-context"><span>{project ? 'APLICADO A TU PROYECTO' : 'ACTIVIDAD SIN PROYECTO'} · {track?.label}</span><p>{projectContext} {track?.activity || resource.projectApplication.toLowerCase()}</p></section>
        <section className="st-instruction"><div className="st-instruction-label"><span>1</span><strong>Dónde tienes que ir</strong></div><p>{step.where}</p>{step.downloadPath && <a href={step.downloadPath} download><Download size={16} /> Descargar archivo de trabajo</a>}</section>
        <section className="st-instruction"><div className="st-instruction-label"><span>2</span><strong>Qué tienes que hacer</strong></div><p>{step.action}</p>{step.command && <div className="st-command"><pre>{step.command}</pre><button onClick={copyCommand}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Copiar'}</button></div>}</section>
        <section className="st-instruction"><div className="st-instruction-label"><span>3</span><strong>Qué debe ocurrir</strong></div><div className="st-expected"><CheckCircle2 size={18} /><p>{step.expected}</p></div></section>
        <section className="st-evidence"><div><span>4</span><div><strong>{step.evidenceLabel}</strong><small>{project ? 'Este texto se añadirá a la ficha de tu proyecto.' : 'Este texto se guardará como nota de estudio local.'}</small></div></div><textarea value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Escribe o pega aquí tu nota, respuesta, decisión o resultado..." rows={5} /><div className="st-evidence-actions"><button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}>Anterior</button><span>{evidence.trim().length < 3 ? 'Añade una nota breve para continuar' : 'Nota lista'}</span><button className="primary" onClick={completeStep} disabled={evidence.trim().length < 3}>{isDone ? 'Guardar cambios' : 'Completar y continuar'} <ArrowRight size={15} /></button></div></section>
      </article>
      <aside className="st-walkthrough-aside"><span className="st-kicker">RESULTADO DE LA LECCIÓN</span><p>{track?.outcome || resource.studentOutcome}</p><dl><div><dt>Entregable</dt><dd>{track?.evidence || resource.deliverable}</dd></div><div><dt>Duración</dt><dd>{track?.duration || resource.duration} minutos</dd></div><div><dt>Fuente interna</dt><dd>{resource.sourcePath.split('/').at(-1)?.replace('.md','').replaceAll('_',' ')}</dd></div></dl><div className="st-quality"><strong>Antes de terminar</strong>{(track?.checks || resource.checks).map((check) => <span key={check}><Check size={12} />{check}</span>)}</div></aside>
    </div>
  </div>
}

function ProjectSetup({ initial, onSave, onClose }: { initial: ProjectProfile; onSave: (project: ProjectProfile) => void; onClose?: () => void }) {
  const [draft, setDraft] = useState(initial)
  const submit = (event: FormEvent) => { event.preventDefault(); onSave(draft) }
  return <div className="st-modal"><form className="st-setup" onSubmit={submit}>{onClose && <button type="button" className="st-close" onClick={onClose}><X size={19} /></button>}<div className="st-setup-intro"><span className="st-kicker">OPCIONAL</span><h1>Activa un espacio de proyecto</h1><p>Solo si quieres aplicar la formación a algo propio. Puedes cerrar esta ventana y seguir estudiando sin crear ningún proyecto.</p></div><div className="st-form-grid"><label>Tu nombre<input required value={draft.studentName} onChange={(event) => setDraft({...draft,studentName:event.target.value})} placeholder="Laura" /></label><label>Nombre del proyecto<input required value={draft.projectName} onChange={(event) => setDraft({...draft,projectName:event.target.value})} placeholder="Clasificador de solicitudes" /></label><label>Tipo de proyecto<select value={draft.type} onChange={(event) => setDraft({...draft,type:event.target.value as ProjectProfile['type']})}>{Object.entries(projectTypeLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>¿Para quién es?<input required value={draft.audience} onChange={(event) => setDraft({...draft,audience:event.target.value})} placeholder="Equipo comercial de una pyme" /></label><label className="wide">¿Qué problema concreto resuelve?<textarea required rows={3} value={draft.problem} onChange={(event) => setDraft({...draft,problem:event.target.value})} placeholder="El equipo tarda demasiado en revisar y priorizar solicitudes..." /></label><label className="wide">¿Qué resultado debe producir?<textarea required rows={3} value={draft.outcome} onChange={(event) => setDraft({...draft,outcome:event.target.value})} placeholder="Recibir una solicitud, clasificarla y crear una tarea revisable..." /></label><label className="wide">Herramientas previstas <small>Opcional; podrás cambiarlas.</small><input value={draft.tools} onChange={(event) => setDraft({...draft,tools:event.target.value})} placeholder="n8n, Supabase, OpenAI..." /></label></div><footer><span>La información se guarda únicamente en este navegador.</span><button>Crear espacio opcional <ArrowRight size={16} /></button></footer></form></div>
}

function ProjectWorkspace({ project, log, modules, resourcesById, walkthroughs, onSave }: { project: ProjectProfile; log: ProjectLogEntry[]; modules: StudentModule[]; resourcesById: Map<string, StudentResource>; walkthroughs: Record<string, WalkthroughProgress>; onSave: (project: ProjectProfile) => void }) {
  const [draft, setDraft] = useState(project)
  const save = () => onSave(draft)
  const exportProject = () => { const blob = new Blob([JSON.stringify({project:draft,evidence:log,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${draft.projectName.toLowerCase().replace(/\s+/g,'-')}-evidencias.json`; a.click(); URL.revokeObjectURL(url) }
  return <div className="st-page"><PageTitle eyebrow="MI PROYECTO" title={project.projectName} text="Esta ficha cambia mientras avanzas. Las evidencias de los walkthroughs se incorporan automáticamente al registro." /><div className="st-project-layout"><section className="st-project-editor"><h2>Brief de trabajo</h2><label>Problema<textarea rows={4} value={draft.problem} onChange={(e)=>setDraft({...draft,problem:e.target.value})} /></label><label>Usuario o destinatario<input value={draft.audience} onChange={(e)=>setDraft({...draft,audience:e.target.value})} /></label><label>Resultado esperado<textarea rows={4} value={draft.outcome} onChange={(e)=>setDraft({...draft,outcome:e.target.value})} /></label><label>Herramientas<input value={draft.tools} onChange={(e)=>setDraft({...draft,tools:e.target.value})} /></label><button onClick={save}>Guardar cambios</button></section><aside className="st-milestones"><h2>Hitos del proyecto</h2>{modules.map((module)=>{const done=module.lessonIds.filter((id)=>{const r=resourcesById.get(id);return r&&(walkthroughs[id]?.completedSteps.length||0)>=r.walkthrough.length}).length;return <div key={module.id}><span>{module.number}</span><div><strong>{module.milestone}</strong><small>{done}/{module.lessonIds.length} prácticas</small></div><i><b style={{width:`${done/module.lessonIds.length*100}%`}} /></i></div>})}</aside></div><section className="st-log"><div className="st-section-head"><div><span className="st-kicker">REGISTRO DEL PROYECTO</span><h2>Evidencias aplicadas</h2></div><button onClick={exportProject}><Download size={15}/> Exportar</button></div>{log.length ? <div>{log.map((entry)=><article key={entry.id}><span>{entry.phase}</span><div><strong>{entry.resourceTitle}</strong><p>{entry.evidence}</p><small>{new Date(entry.createdAt).toLocaleString('es-ES')}</small></div></article>)}</div>:<p className="st-empty">Las evidencias aparecerán aquí cuando completes pasos de los walkthroughs.</p>}</section></div>
}

function Workshop({ project, onSetup }: { project: ProjectProfile | null; onSetup: () => void }) {
  const [payload, setPayload] = useState('{\n  "name": "Ejemplo",\n  "email": "demo@ejemplo.es",\n  "priority": "normal"\n}')
  const [result, setResult] = useState('')
  const run = () => { try { const data=JSON.parse(payload); setResult(JSON.stringify({...data,project:project?.projectName||'Sin proyecto',status:'validated',processedAt:new Date().toISOString()},null,2)) } catch { setResult('ERROR: El payload no es JSON válido. Revisa comas, llaves y comillas.') } }
  return <div className="st-page"><PageTitle eyebrow="TALLER" title="Prueba antes de conectar" text="Un espacio pequeño para preparar entradas, comprobar transformaciones y detectar errores antes de llevarlos a una herramienta externa." />{!project && <button className="st-notice" onClick={onSetup}>Configura un proyecto para contextualizar el taller <ArrowRight size={15}/></button>}<div className="st-lab"><section><div><span>ENTRADA JSON</span><button onClick={()=>setPayload('{\n  "name": "",\n  "email": "dato-invalido"\n}')}>Cargar caso roto</button></div><textarea value={payload} onChange={(e)=>setPayload(e.target.value)} spellCheck={false}/></section><button className="st-run" onClick={run}><Play size={18}/> Ejecutar prueba</button><section><div><span>SALIDA</span><small>Transformación local</small></div><pre>{result||'Pulsa “Ejecutar prueba” para ver el resultado.'}</pre></section></div><div className="st-lab-flow"><span>1. Preparar entrada</span><ArrowRight size={16}/><span>2. Validar formato</span><ArrowRight size={16}/><span>3. Transformar</span><ArrowRight size={16}/><span>4. Guardar evidencia</span></div></div>
}

function ResourceLibrary({ catalog, level, onOpenLesson, walkthroughs }: { catalog: StudentCatalog; level: StudentLevel; onOpenLesson: (resource: StudentResource) => void; walkthroughs: Record<string, WalkthroughProgress> }) {
  const [query,setQuery]=useState(''); const [kind,setKind]=useState('Todos'); const [moduleId,setModuleId]=useState('Todos')
  const filtered=catalog.resources.filter((r)=>`${r.title} ${levelTrack(r, level)?.summary || r.summary}`.toLowerCase().includes(query.toLowerCase())&&(kind==='Todos'||r.kind===kind)&&(moduleId==='Todos'||r.moduleId===moduleId))
  return <div className="st-page"><PageTitle eyebrow={`${catalog.stats.resources} RECURSOS ADAPTADOS`} title="Material de apoyo" text="La fuente original se conserva internamente, pero aquí cada recurso se presenta como una práctica aplicable y verificable." /><div className="st-resource-filters"><label><Search size={17}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar por resultado o herramienta..."/></label><select value={kind} onChange={(e)=>setKind(e.target.value)}><option>Todos</option>{['Workflow guiado','Procedimiento','Proyecto','Guía','Lección'].map((v)=><option key={v}>{v}</option>)}</select><select value={moduleId} onChange={(e)=>setModuleId(e.target.value)}><option>Todos</option>{catalog.modules.map((m)=><option value={m.id} key={m.id}>{m.number} · {m.title}</option>)}</select></div><div className="st-resource-count">{filtered.length} resultados</div><div className="st-resource-list">{filtered.slice(0,80).map((resource)=>{const done=walkthroughs[resource.id]?.completedSteps.length||0; const track=levelTrack(resource, level);return <article key={resource.id}><div><span>{resource.kind} � {track?.label}</span><strong>{resource.title}</strong><p>{track?.summary || resource.summary}</p></div><div><small>RESULTADO</small><p>{track?.evidence || resource.deliverable}</p></div><div className="st-resource-progress"><span>{done}/{resource.walkthrough.length}</span><i><b style={{width:`${done/resource.walkthrough.length*100}%`}}/></i></div><button onClick={()=>onOpenLesson(resource)}>Abrir walkthrough <ArrowRight size={15}/></button></article>})}</div></div>
}

function PageTitle({ eyebrow,title,text }: { eyebrow:string;title:string;text:string }) { return <header className="st-page-title"><span className="st-kicker">{eyebrow}</span><h1>{title}</h1><p>{text}</p></header> }
function NoProject({onSetup}:{onSetup:()=>void}) { return <div className="st-page st-no-project"><FolderKanban size={36}/><h1>El proyecto es opcional.</h1><p>Puedes completar la formación como estudio guiado, guardando notas y evidencias. Crea una ficha solo si quieres aplicar las prácticas a un caso propio.</p><button onClick={onSetup}>Crear proyecto opcional</button></div> }
function Loading(){return <div className="st-loading"><span>AP</span><strong>Preparando el espacio de estudio</strong><small>Adaptando lecciones y walkthroughs...</small></div>}

export default StudentApp

