import { useEffect, useMemo, useState } from 'react'
import { BookOpen, BookMarked, Bot, Boxes, Compass, GraduationCap, HelpCircle, Home, KeyRound, ListOrdered, Loader2, Menu, Presentation, Puzzle, Search, Sparkles, TrendingUp, X } from 'lucide-react'
import type { CursoLesson, LevelId } from './types'
import { CourseContext, useCourse, useCourseLoader } from './course'
import { href, navigate, useRoute, type Route } from './router'
import { store, useStudent } from './store'
import Inicio from './pages/Inicio'
import MiProyecto from './pages/MiProyecto'
import Leccion from './pages/Leccion'
import Buscar from './pages/Buscar'
import Indice from './pages/Indice'
import Preguntas from './pages/Preguntas'
import Progreso from './pages/Progreso'
import Presentar from './pages/Presentar'
import Proyecto from './pages/Proyecto'
import Deck from './pages/Deck'
import Prompts from './pages/Prompts'
import Kits from './pages/Kits'
import Agentes from './pages/Agentes'
import Admin from './pages/Admin'
import Guia from './pages/Guia'
import { CursoIndice, CursoLeccion } from './pages/Curso'
import { Area, Biblioteca, Carpeta, Categoria, Herramienta, Herramientas, Ruta } from './pages/Listados'

const LEVEL_SHORT: Record<LevelId, string> = { basico: 'Bás', intermedio: 'Int', avanzado: 'Avz' }

function Sidebar({ route, open, onClose }: { route: Route; open: boolean; onClose: () => void }) {
  const course = useCourse()
  const student = useStudent()
  const [query, setQuery] = useState('')
  const cursoBase = [...(course.curso || [])].filter((lesson) => !lesson.tool).sort((a, b) => a.number - b.number)
  const defaultCursoStage = cursoBase[0]?.stageId || course.stages[0]?.id || null
  const [expanded, setExpanded] = useState<string | null>(() =>
    route.name === 'area' ? route.stageId
    : route.name === 'categoria' ? course.categories.find((item) => item.id === route.categoryId)?.stageId || null
    : route.name === 'curso' && route.lessonId ? course.curso.find((lesson) => lesson.id === route.lessonId)?.stageId || null
    : route.name === 'curso' ? defaultCursoStage
    : null,
  )

  // El área de la página actual se despliega sola al navegar.
  useEffect(() => {
    if (route.name === 'area') setExpanded(route.stageId)
    if (route.name === 'curso' && !route.lessonId) setExpanded(defaultCursoStage)
    if (route.name === 'curso' && route.lessonId) {
      const lesson = course.curso.find((item) => item.id === route.lessonId)
      if (lesson) setExpanded(lesson.stageId)
    }
    if (route.name === 'categoria') {
      const stage = course.categories.find((item) => item.id === route.categoryId)?.stageId
      if (stage) setExpanded(stage)
    }
  }, [route, course.categories, course.curso, defaultCursoStage])

  const is = (name: Route['name']) => route.name === name
  const isCursoDone = (lesson: CursoLesson) => {
    const progress = student.lessons['curso:' + lesson.id]
    if (progress?.done?.includes('intermedio')) return true
    const marked = progress?.checks?.intermedio || []
    return lesson.tasks.length > 0 && marked.length >= lesson.tasks.length
  }
  const mainDone = cursoBase.filter(isCursoDone).length
  const percent = cursoBase.length ? Math.round((mainDone / cursoBase.length) * 100) : 0

  return (
    <aside className={`st-sidebar${open ? ' open' : ''}`}>
      <a className="st-brand" href={href({ name: 'inicio' })} onClick={onClose}>
        <span className="st-brand-mark" aria-hidden="true"><GraduationCap size={19} /></span>
        <div>
          <strong className="st-brand-name" aria-label="AI Professional Academy">
            <span className="st-brand-word">AI</span>{' '}
            <span className="st-brand-word">Professional</span>{' '}
            <span className="st-brand-word">Academy</span>
            <i className="st-brand-underline" aria-hidden="true" />
          </strong>
          <small>Formación aplicada</small>
        </div>
      </a>

      <form
        className="st-side-search"
        onSubmit={(event) => {
          event.preventDefault()
          navigate({ name: 'buscar', query, filters: {} })
          setQuery('')
          onClose()
        }}
      >
        <Search size={12} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar…"
          aria-label="Buscar en el curso"
        />
        <kbd>Ctrl K</kbd>
      </form>

      <nav aria-label="Navegación principal">
        <a className={is('inicio') ? 'active' : ''} href={href({ name: 'inicio' })} onClick={onClose}>
          <Home size={14} /> Inicio
        </a>
        <a className={is('curso') ? 'active' : ''} href={href({ name: 'curso' })} onClick={onClose}>
          <GraduationCap size={14} /> Programa
        </a>
        <a className={is('mi-proyecto') ? 'active' : ''} href={href({ name: 'mi-proyecto' })} onClick={onClose}>
          <BookMarked size={14} /> Mi proyecto
        </a>
        <a className={is('prompts') ? 'active' : ''} href={href({ name: 'prompts' })} onClick={onClose}>
          <Sparkles size={14} /> Prompts
        </a>
        <a className={is('kits') ? 'active' : ''} href={href({ name: 'kits' })} onClick={onClose}>
          <Boxes size={14} /> Kits institucionales
        </a>
        <a className={is('agentes') ? 'active' : ''} href={href({ name: 'agentes' })} onClick={onClose}>
          <Bot size={14} /> Agentes
        </a>
        {(student.teacher || is('admin')) && (
          <a className={is('admin') ? 'active' : ''} href={href({ name: 'admin' })} onClick={onClose}>
            <KeyRound size={14} /> Súper admin
          </a>
        )}
        <a className={is('herramientas') || is('herramienta') ? 'active' : ''} href={href({ name: 'herramientas' })} onClick={onClose}>
          <Puzzle size={14} /> Herramientas
        </a>
        <a className={is('preguntas') ? 'active' : ''} href={href({ name: 'preguntas' })} onClick={onClose}>
          <HelpCircle size={14} /> Preguntas
        </a>
        <a className={is('indice') ? 'active' : ''} href={href({ name: 'indice' })} onClick={onClose}>
          <ListOrdered size={14} /> Diccionario
        </a>
        <a className={is('progreso') ? 'active' : ''} href={href({ name: 'progreso' })} onClick={onClose}>
          <TrendingUp size={14} /> Progreso
        </a>
        <a className={is('guia') ? 'active' : ''} href={href({ name: 'guia' })} onClick={onClose}>
          <Compass size={14} /> Guías
        </a>
      </nav>

      <p className="st-side-title">Ruta principal</p>
      <div className="st-side-tree">
        {course.stages.map((stage) => {
          const isOpen = expanded === stage.id
          const stageLessons = cursoBase.filter((lesson) => lesson.stageId === stage.id)
          const stageDone = stageLessons.filter(isCursoDone).length
          const categories = stage.categoryIds
            .map((id) => course.categories.find((category) => category.id === id))
            .filter(Boolean) as typeof course.categories
          return (
            <div key={stage.id} className={`st-side-area${isOpen ? ' open' : ''}`}>
              <button type="button" onClick={() => setExpanded(isOpen ? null : stage.id)} aria-expanded={isOpen}>
                <i>{stage.number}</i>
                <span>
                  <strong>{stage.title}</strong>
                  <small>{stageLessons.length ? `${stageDone}/${stageLessons.length} lecciones` : 'Biblioteca de apoyo'}</small>
                </span>
                <i>{isOpen ? '−' : '+'}</i>
              </button>
              {isOpen && (
                <ul>
                  {stageLessons.length ? (
                    stageLessons.map((lesson) => (
                      <li key={lesson.id}>
                        <a
                          className={route.name === 'curso' && route.lessonId === lesson.id ? 'active' : ''}
                          data-done={isCursoDone(lesson) ? 'true' : undefined}
                          href={href({ name: 'curso', lessonId: lesson.id })}
                          onClick={onClose}
                        >
                          <span>{String(lesson.number).padStart(2, '0')}. {lesson.title}</span>
                          <b>{isCursoDone(lesson) ? '✓' : '→'}</b>
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="st-side-muted">Sin lecciones principales: usa esta área como biblioteca.</li>
                  )}
                  <li>
                    <a
                      className={route.name === 'area' && route.stageId === stage.id ? 'active' : ''}
                      href={href({ name: 'area', stageId: stage.id, filters: {} })}
                      onClick={onClose}
                    >
                      <span>Biblioteca del bloque</span>
                      <b>{categories.length}</b>
                    </a>
                  </li>
                </ul>
              )}
            </div>
          )
        })}
      </div>

      <div className="st-course-progress">
        <div>
          <span>Ruta principal</span>
          <strong>{mainDone}/{cursoBase.length}</strong>
        </div>
        <i><b style={{ width: `${percent}%` }} /></i>
        <div className="st-level-pick" role="group" aria-label="Nivel por defecto">
          {course.levels.map((meta) => (
            <button
              key={meta.id}
              type="button"
              className={student.preferredLevel === meta.id ? 'on' : ''}
              onClick={() => store.setPreferredLevel(meta.id)}
              title={meta.audience}
            >
              {LEVEL_SHORT[meta.id]}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

function Header({ route, onMenu }: { route: Route; onMenu: () => void }) {
  const course = useCourse()
  const { teacher } = useStudent()

  const trail = useMemo(() => {
    switch (route.name) {
      case 'inicio': return ['Inicio']
      case 'mi-proyecto': return ['Mi proyecto']
      case 'ruta': return ['Ruta']
      case 'area': {
        const stage = course.stages.find((item) => item.id === route.stageId)
        return ['Ruta', stage ? `${stage.number}. ${stage.title}` : route.stageId]
      }
      case 'categoria': {
        const category = course.categories.find((item) => item.id === route.categoryId)
        const stage = category && course.stages.find((item) => item.id === category.stageId)
        return ['Ruta', stage ? `${stage.number}. ${stage.title}` : '', category?.label || ''].filter(Boolean)
      }
      case 'leccion': {
        const lesson = course.lessons.find((item) => item.slug === route.slug)
        const category = lesson && course.categories.find((item) => item.id === lesson.categoryId)
        return [category?.label || 'Lección', lesson?.title || route.slug]
      }
      case 'biblioteca': return ['Biblioteca']
      case 'carpeta': {
        const folder = course.folders.find((item) => item.id === route.folderId)
        return ['Biblioteca', folder?.label || route.folderId]
      }
      case 'herramientas': return ['Herramientas']
      case 'herramienta': {
        const tool = course.toolPages.find((item) => item.id === route.toolId)
        return ['Herramientas', tool?.label || route.toolId]
      }
      case 'preguntas': return ['Preguntas']
      case 'indice': return ['Diccionario', route.letter?.toUpperCase() || ''].filter(Boolean)
      case 'buscar': return ['Búsqueda', route.query ? `«${route.query}»` : ''].filter(Boolean)
      case 'presentar': return ['Presentación']
      case 'proyecto': return ['Proyecto final']
      case 'deck': return ['Presentación']
      case 'prompts': return ['Prompts']
      case 'kits': return ['Kits institucionales']
      case 'agentes': {
        if (!route.agentId) return ['Agentes']
        const agent = (course.agents || []).find((item) => item.id === route.agentId)
        return ['Agentes', agent?.title || route.agentId]
      }
      case 'admin': return ['Súper administrador']
      case 'guia': return ['Guías']
      case 'curso': {
        if (!route.lessonId) return ['Programa']
        const lesson = course.curso.find((item) => item.id === route.lessonId)
        const tool = lesson?.tool ? course.toolPages.find((item) => item.id === lesson.tool) : null
        return ['Programa', tool?.label || 'Ruta principal', lesson?.title || route.lessonId]
      }
      case 'progreso': return ['Progreso']
      default: return ['Academia']
    }
  }, [route, course])

  return (
    <header className="st-header">
      <div>
        <button type="button" className="st-menu" onClick={onMenu} aria-label="Abrir menú">
          <Menu size={15} />
        </button>
        {trail.map((part, index) => (
          <span key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            {index > 0 && '›'}
            {index === trail.length - 1 ? <strong>{part}</strong> : part}
          </span>
        ))}
      </div>
      <div className="st-header-actions">
        <a className="st-project-switch" href={href({ name: 'buscar', query: '', filters: {} })}>
          <BookOpen size={12} />
          Ruta guiada · biblioteca de apoyo
        </a>
        <button
          type="button"
          className={`st-project-switch${teacher ? ' on' : ''}`}
          onClick={() => store.toggleTeacher()}
          aria-pressed={teacher}
          title="Muestra el guion de clase y el acceso a presentar. El alumno no lo ve."
        >
          <Presentation size={12} />
          {teacher ? 'Modo profesor' : 'Modo alumno'}
        </button>
      </div>
    </header>
  )
}

function Pages({ route }: { route: Route }) {
  switch (route.name) {
    case 'inicio': return <Inicio />
    case 'mi-proyecto': return <MiProyecto />
    case 'ruta': return <Ruta />
    case 'area': return <Area stageId={route.stageId} route={route} />
    case 'categoria': return <Categoria categoryId={route.categoryId} route={route} />
    case 'leccion': return <Leccion slug={route.slug} level={route.level} />
    case 'presentar': return <Presentar slug={route.slug} level={route.level} />
    case 'proyecto': return <Proyecto stageId={route.stageId} />
    case 'deck': return <Deck deckId={route.deckId} />
    case 'prompts': return <Prompts familyId={route.familyId} />
    case 'kits': return <Kits />
    case 'agentes': return <Agentes agentId={route.agentId} />
    case 'admin': return <Admin />
    case 'guia': return <Guia guideId={route.guideId} />
    case 'curso': return route.lessonId ? <CursoLeccion lessonId={route.lessonId} /> : <CursoIndice />
    case 'biblioteca': return <Biblioteca />
    case 'carpeta': return <Carpeta folderId={route.folderId} route={route} />
    case 'herramientas': return <Herramientas />
    case 'herramienta': return <Herramienta toolId={route.toolId} route={route} />
    case 'preguntas': return <Preguntas />
    case 'indice': return <Indice letter={route.letter} />
    case 'buscar': return <Buscar query={route.query} route={route} />
    case 'progreso': return <Progreso />
  }
}

function Shell() {
  const route = useRoute()
  const course = useCourse()
  const [menuOpen, setMenuOpen] = useState(false)
  const routeKey = useMemo(() => {
    switch (route.name) {
      case 'area': return `${route.name}:${route.stageId}`
      case 'categoria': return `${route.name}:${route.categoryId}:${JSON.stringify(route.filters)}`
      case 'herramienta': return `${route.name}:${route.toolId}:${JSON.stringify(route.filters)}`
      case 'leccion': return `${route.name}:${route.slug}:${route.level}`
      case 'buscar': return `${route.name}:${route.query}:${JSON.stringify(route.filters)}`
      case 'carpeta': return `${route.name}:${route.folderId}:${JSON.stringify(route.filters)}`
      case 'guia': return `${route.name}:${route.guideId || 'indice'}`
      case 'agentes': return `${route.name}:${route.agentId || 'indice'}`
      case 'curso': return `${route.name}:${route.lessonId || 'indice'}`
      default: return route.name
    }
  }, [route])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        navigate({ name: 'buscar', query: '', filters: {} })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const selector = [
      '.st-page-title',
      '.st-welcome',
      '.st-overall',
      '.st-area-head',
      '.st-section-head',
      '.st-block',
      '.st-panel',
      '.st-next-card',
      '.st-area-preview a',
      '.st-stat-row > div',
      '.st-stat-list div',
      '.st-lesson-row',
      '.st-cat-card',
      '.st-tool-card',
      '.st-program-tool-card',
      '.st-program-step',
      '.st-program-tools-grid > a',
      '.st-search-hit',
      '.st-search-overview div',
      '.st-prompt',
      '.st-prompt-family',
      '.st-task-list > li',
      '.st-practice-step',
      '.st-glossary > div',
      '.st-tool-inside',
      '.st-inside-card',
      '.st-tool-prompts',
      '.st-tool-prompt-list button',
      '.st-automation-library',
      '.st-automation-card',
      '.st-automation-list a',
      '.st-dictionary-note',
      '.st-term-list button',
      '.st-station',
      '.st-checkitems button',
      '.st-choice-grid button',
      '.st-tool-choice',
      '.st-page p',
      '.st-page li',
      '.st-page dt',
      '.st-page dd',
      '.st-page th',
      '.st-page td',
      '.st-page label',
      '.st-page input',
      '.st-page select',
      '.st-page textarea',
      '.st-page code',
      '.st-page pre',
      '.st-page a',
      '.st-page button',
    ].join(',')
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('st-inview'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('st-inview')
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' })
    elements.forEach((element, index) => {
      element.classList.add('st-reveal')
      element.style.setProperty('--st-reveal-delay', `${Math.min(index % 8, 5) * 28}ms`)
      observer.observe(element)
    })
    return () => observer.disconnect()
  }, [route])

  // Las presentaciones ocupan la pantalla entera: sin barra lateral ni cabecera.
  if (route.name === 'presentar') return <Presentar slug={route.slug} level={route.level} />
  if (route.name === 'deck') return <Deck deckId={route.deckId} />

  return (
    <div className="student-app">
      <Sidebar route={route} open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <button type="button" className="st-scrim" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}

      <div className="student-main">
        <Header route={route} onMenu={() => setMenuOpen(true)} />
        <main>
          <div key={routeKey} className="st-route-canvas" data-route={route.name}>
            <span className="st-motion-rail rail-a" aria-hidden="true" />
            <span className="st-motion-rail rail-b" aria-hidden="true" />
            <Pages route={route} />
          </div>
        </main>
      </div>

      <footer className="st-foot">
        <p>
          Ruta principal, especializaciones y biblioteca de consulta ·
          generado desde «{course.vaultName}» el {new Date(course.generatedAt).toLocaleDateString('es-ES')}
        </p>
        <p>
          Los logos pertenecen a sus respectivos titulares y se usan para identificar la herramienta que se enseña.
          Tu progreso se guarda solo en este navegador.
        </p>
      </footer>
    </div>
  )
}

export default function App() {
  const { course, error } = useCourseLoader()

  if (error) {
    return (
      <div className="st-loading">
        <span><X size={18} /></span>
        <strong>No se ha podido cargar el curso</strong>
        <small>{error}</small>
        <pre>npm run index</pre>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="st-loading">
        <strong className="st-brand-splash" aria-label="AI Professional Academy">
          <span className="st-brand-word">AI</span>{' '}
          <span className="st-brand-word">Professional</span>{' '}
          <span className="st-brand-word">Academy</span>
          <i className="st-brand-underline" aria-hidden="true" />
        </strong>
        <small><Loader2 size={11} className="spin" /> Cargando el curso…</small>
      </div>
    )
  }

  return (
    <CourseContext.Provider value={course}>
      <Shell />
    </CourseContext.Provider>
  )
}
