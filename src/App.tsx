import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { BookOpen, BookMarked, Bot, Boxes, BrainCircuit, Compass, Globe, GraduationCap, HelpCircle, Home, KeyRound, ListOrdered, Lock, LogOut, Menu, Presentation, Puzzle, Search, ShieldCheck, Sparkles, TrendingUp, X } from 'lucide-react'
import type { CursoLesson } from './types'
import { CourseContext, useCourse, useCourseLoader } from './course'
import { href, navigate, useRoute, type Route } from './router'
import { store, useStudent } from './store'
import { LOCALES, useLocale, useT } from './i18n'
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
import Skills from './pages/Skills'
import Kits from './pages/Kits'
import Agentes from './pages/Agentes'
import Admin from './pages/Admin'
import Guia from './pages/Guia'
import { CursoIndice, CursoLeccion } from './pages/Curso'
import { Area, Biblioteca, Carpeta, Categoria, Herramienta, Herramientas, Ruta } from './pages/Listados'

function LanguageSwitch({ compact }: { compact?: boolean }) {
  const locale = useLocale()
  const t = useT()
  return (
    <div className={compact ? 'st-lang-switch compact' : 'st-lang-switch'} role="group" aria-label={t('sidebar.idioma')}>
      <Globe size={12} />
      {LOCALES.map((item) => (
        <button
          key={item.id}
          type="button"
          className={locale === item.id ? 'on' : ''}
          onClick={() => store.setLocale(item.id)}
          aria-pressed={locale === item.id}
          title={item.label}
        >
          {item.short}
        </button>
      ))}
    </div>
  )
}

function Sidebar({ route, open, onClose }: { route: Route; open: boolean; onClose: () => void }) {
  const course = useCourse()
  const student = useStudent()
  const t = useT()
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
  const sessionLabel = student.adminUnlocked
    ? student.teacher ? t('sidebar.modoProfesor') : t('sidebar.modoAlumno')
    : t('sidebar.modoAlumno')
  const sessionDetail = student.adminUnlocked
    ? t('sidebar.panelPrivado')
    : student.learnerName ? `${t('sidebar.perfil')}: ${student.learnerName}` : t('sidebar.perfilAlumnoActivo')

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
          <small>{t('sidebar.tagline')}</small>
        </div>
      </a>

      <LanguageSwitch />

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
          placeholder={t('sidebar.buscar')}
          aria-label={t('sidebar.buscar')}
        />
        <kbd>Ctrl K</kbd>
      </form>

      <nav aria-label="Navegación principal">
        <a className={is('inicio') ? 'active' : ''} href={href({ name: 'inicio' })} onClick={onClose}>
          <Home size={14} /> {t('nav.inicio')}
        </a>
        <a className={is('curso') ? 'active' : ''} href={href({ name: 'curso' })} onClick={onClose}>
          <GraduationCap size={14} /> {t('nav.programa')}
        </a>
        <a className={is('mi-proyecto') ? 'active' : ''} href={href({ name: 'mi-proyecto' })} onClick={onClose}>
          <BookMarked size={14} /> {t('nav.miProyecto')}
        </a>
        <a className={is('prompts') ? 'active' : ''} href={href({ name: 'prompts' })} onClick={onClose}>
          <Sparkles size={14} /> {t('nav.prompts')}
        </a>
        <a className={is('skills') ? 'active' : ''} href={href({ name: 'skills' })} onClick={onClose}>
          <BrainCircuit size={14} /> {t('nav.skills')}
        </a>
        <a className={is('kits') ? 'active' : ''} href={href({ name: 'kits' })} onClick={onClose}>
          <Boxes size={14} /> {t('nav.kits')}
        </a>
        <a className={is('agentes') ? 'active' : ''} href={href({ name: 'agentes' })} onClick={onClose}>
          <Bot size={14} /> {t('nav.agentes')}
        </a>
        {student.adminUnlocked && (
          <a className={is('admin') ? 'active' : ''} href={href({ name: 'admin' })} onClick={onClose}>
            <KeyRound size={14} /> {t('nav.superAdmin')}
          </a>
        )}
        <a className={is('herramientas') || is('herramienta') ? 'active' : ''} href={href({ name: 'herramientas' })} onClick={onClose}>
          <Puzzle size={14} /> {t('nav.herramientas')}
        </a>
        <a className={is('preguntas') ? 'active' : ''} href={href({ name: 'preguntas' })} onClick={onClose}>
          <HelpCircle size={14} /> {t('nav.preguntas')}
        </a>
        <a className={is('indice') ? 'active' : ''} href={href({ name: 'indice' })} onClick={onClose}>
          <ListOrdered size={14} /> {t('nav.diccionario')}
        </a>
        <a className={is('progreso') ? 'active' : ''} href={href({ name: 'progreso' })} onClick={onClose}>
          <TrendingUp size={14} /> {t('nav.progreso')}
        </a>
        <a className={is('guia') ? 'active' : ''} href={href({ name: 'guia' })} onClick={onClose}>
          <Compass size={14} /> {t('nav.guias')}
        </a>
      </nav>

      <p className="st-side-title">{t('nav.rutaPrincipal')}</p>
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
                  <small>{stageLessons.length ? `${stageDone}/${stageLessons.length} ${t('sidebar.lecciones')}` : t('sidebar.bibliotecaApoyo')}</small>
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
                    <li className="st-side-muted">{t('sidebar.sinLeccionesPrincipales')}</li>
                  )}
                  <li>
                    <a
                      className={route.name === 'area' && route.stageId === stage.id ? 'active' : ''}
                      href={href({ name: 'area', stageId: stage.id, filters: {} })}
                      onClick={onClose}
                    >
                      <span>{t('sidebar.bibliotecaBloque')}</span>
                      <b>{categories.length}</b>
                    </a>
                  </li>
                </ul>
              )}
            </div>
          )
        })}
      </div>

      <div className="st-session-panel">
        <div className="st-session-mode">
          <span>{student.adminUnlocked ? t('sidebar.sesionPrivada') : t('sidebar.sesionActiva')}</span>
          <strong>{sessionLabel}</strong>
          <small>{sessionDetail}</small>
        </div>
        {student.adminUnlocked && (
          <button
            type="button"
            className={`st-session-button${student.teacher ? ' on' : ''}`}
            onClick={() => store.toggleTeacher()}
            aria-pressed={student.teacher}
            title={t('sidebar.cambiarVistaTitle')}
          >
            <Presentation size={12} />
            {student.teacher ? t('sidebar.verComoAlumno') : t('sidebar.verComoProfesor')}
          </button>
        )}
        <button
          type="button"
          className="st-session-button danger"
          onClick={() => {
            store.lockLearner()
            onClose()
          }}
          title={student.adminUnlocked ? t('sidebar.salirAdminTitle') : t('sidebar.salirPerfilTitle')}
        >
          <LogOut size={12} />
          {student.adminUnlocked ? t('sidebar.salirAdmin') : t('sidebar.salirPerfil')}
        </button>
      </div>
    </aside>
  )
}

function StudentAccessGate() {
  const route = useRoute()
  const t = useT()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const cleanPin = pin.replace(/\D/g, '').slice(0, 6)
  const canSubmit = (cleanPin.length === 4 || cleanPin.length === 6) && !checking

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setChecking(true)
    try {
      if (await store.unlockLearnerOnline(cleanPin)) {
        if (cleanPin !== '5555' && route.name === 'admin') navigate({ name: 'inicio' })
        return
      }
      setError(t('access.pinNoEncontrado'))
      setPin('')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="st-access-shell">
      <section className="st-access">
        <div className="st-access-copy">
          <span className="st-kicker"><ShieldCheck size={12} /> {t('access.kicker')}</span>
          <h1>{t('access.title')}</h1>
          <p>{t('access.text')}</p>

          <form className="st-pin-card" onSubmit={submit} aria-label={t('access.aria')}>
            <label>
              <span>{t('access.pinLabel')}</span>
              <div className="st-pin-input-wrap">
                <KeyRound size={18} />
                <input
                  autoFocus
                  inputMode="numeric"
                  maxLength={6}
                  value={cleanPin}
                  onChange={(event) => {
                    setError('')
                    setPin(event.target.value)
                  }}
                  placeholder="••••••"
                  type="password"
                />
              </div>
            </label>
            <div className="st-pin-dots" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, index) => <i key={index} className={index < cleanPin.length ? 'on' : ''} />)}
            </div>
            {error && <p className="st-access-error">{error}</p>}
            <button type="submit" className="st-btn" disabled={!canSubmit}>
              <Lock size={14} /> {checking ? t('access.checking') : t('access.submit')}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

function Header({ route, onMenu }: { route: Route; onMenu: () => void }) {
  const course = useCourse()
  const t = useT()

  const trail = useMemo(() => {
    switch (route.name) {
      case 'inicio': return [t('nav.inicio')]
      case 'mi-proyecto': return [t('nav.miProyecto')]
      case 'ruta': return [t('nav.rutaPrincipal')]
      case 'area': {
        const stage = course.stages.find((item) => item.id === route.stageId)
        return [t('nav.rutaPrincipal'), stage ? `${stage.number}. ${stage.title}` : route.stageId]
      }
      case 'categoria': {
        const category = course.categories.find((item) => item.id === route.categoryId)
        const stage = category && course.stages.find((item) => item.id === category.stageId)
        return [t('nav.rutaPrincipal'), stage ? `${stage.number}. ${stage.title}` : '', category?.label || ''].filter(Boolean)
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
      case 'herramientas': return [t('nav.herramientas')]
      case 'herramienta': {
        const tool = course.toolPages.find((item) => item.id === route.toolId)
        return [t('nav.herramientas'), tool?.label || route.toolId]
      }
      case 'preguntas': return [t('nav.preguntas')]
      case 'indice': return [t('nav.diccionario'), route.letter?.toUpperCase() || ''].filter(Boolean)
      case 'buscar': return [t('nav.busqueda'), route.query ? `«${route.query}»` : ''].filter(Boolean)
      case 'presentar': return [t('nav.presentacion')]
      case 'proyecto': return [t('nav.proyectoFinal')]
      case 'deck': return [t('nav.presentacion')]
      case 'prompts': return [t('nav.prompts')]
      case 'skills': return [t('nav.skills')]
      case 'kits': {
        if (!route.kitId) return [t('nav.kits')]
        const kit = (course.kits || []).find((item) => item.id === route.kitId)
        return [t('nav.kits'), kit?.title || route.kitId]
      }
      case 'agentes': {
        if (!route.agentId) return [t('nav.agentes')]
        const agent = (course.agents || []).find((item) => item.id === route.agentId)
        return [t('nav.agentes'), agent?.title || route.agentId]
      }
      case 'admin': return [t('nav.superAdmin')]
      case 'guia': return [t('nav.guias')]
      case 'curso': {
        if (!route.lessonId) return [t('nav.programa')]
        const lesson = course.curso.find((item) => item.id === route.lessonId)
        const tool = lesson?.tool ? course.toolPages.find((item) => item.id === lesson.tool) : null
        return [t('nav.programa'), tool?.label || t('nav.rutaPrincipal'), lesson?.title || route.lessonId]
      }
      case 'progreso': return [t('nav.progreso')]
      default: return ['Academia']
    }
  }, [route, course, t])

  return (
    <header className="st-header">
      <div>
        <button type="button" className="st-menu" onClick={onMenu} aria-label={t('header.abrirMenu')}>
          <Menu size={15} />
        </button>
        {trail.map((part, index) => (
          <span key={index} className="st-crumb">
            {index > 0 && <i aria-hidden="true">›</i>}
            {index === trail.length - 1 ? <strong>{part}</strong> : part}
          </span>
        ))}
      </div>
      <div className="st-header-actions">
        <LanguageSwitch compact />
        <a className="st-project-switch" href={href({ name: 'buscar', query: '', filters: {} })}>
          <BookOpen size={12} />
          {t('header.rutaGuiada')}
        </a>
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
    case 'skills': return <Skills />
    case 'kits': return <Kits key={route.kitId || 'indice'} kitId={route.kitId} />
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
  const student = useStudent()
  const locale = useLocale()
  const t = useT()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const routeKey = useMemo(() => {
    switch (route.name) {
      case 'area': return `${route.name}:${route.stageId}`
      case 'categoria': return `${route.name}:${route.categoryId}:${JSON.stringify(route.filters)}`
      case 'herramienta': return `${route.name}:${route.toolId}:${JSON.stringify(route.filters)}`
      case 'leccion': return `${route.name}:${route.slug}:${route.level}`
      case 'buscar': return `${route.name}:${route.query}:${JSON.stringify(route.filters)}`
      case 'carpeta': return `${route.name}:${route.folderId}:${JSON.stringify(route.filters)}`
      case 'guia': return `${route.name}:${route.guideId || 'indice'}`
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

  useEffect(() => {
    if (route.name === 'admin' && student.learnerUnlocked && !student.adminUnlocked) {
      navigate({ name: 'inicio' })
    }
  }, [route, student.learnerUnlocked, student.adminUnlocked])

  if (!student.learnerUnlocked && !student.adminUnlocked) {
    return (
      <div className="student-app">
        <StudentAccessGate />
      </div>
    )
  }

  if (route.name === 'admin' && student.learnerUnlocked && !student.adminUnlocked) {
    return <div className="st-loading" />
  }

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
          {t('footer.generadoDesde')} «{course.vaultName}» {t('footer.el')}{' '}
          {new Date(course.generatedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES')}
        </p>
        <p>
          {t('footer.logos')} {t('footer.progreso')}
        </p>
      </footer>
    </div>
  )
}

function AuthenticatedAcademy() {
  const student = useStudent()
  const t = useT()
  const { course, error } = useCourseLoader(true, student.locale || 'es')

  if (error) {
    return (
      <div className="st-loading st-loading-error">
        <div className="st-loading-mark" aria-hidden="true">
          <span className="st-loading-orbit orbit-a" />
          <span className="st-loading-orbit orbit-b" />
          <span className="st-loading-core"><X size={18} /></span>
        </div>
        <div className="st-loading-copy">
          <strong>{t('loading.noCargado')}</strong>
          <small>{error}</small>
        </div>
        <button type="button" className="st-btn" onClick={() => store.lockLearner()}>
          <LogOut size={14} /> {t('loading.volverAEntrar')}
        </button>
        <pre>npm run index</pre>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="st-loading">
        <div className="st-loading-mark" aria-hidden="true">
          <span className="st-loading-orbit orbit-a" />
          <span className="st-loading-orbit orbit-b" />
          <span className="st-loading-core">AI</span>
        </div>
        <div className="st-loading-copy">
          <strong>{t('loading.preparando')}</strong>
          <small>{t('loading.organizando')}</small>
        </div>
        <div className="st-loading-lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    )
  }

  return (
    <CourseContext.Provider value={course}>
      <Shell />
    </CourseContext.Provider>
  )
}

export default function App() {
  const student = useStudent()

  if (!student.learnerUnlocked && !student.adminUnlocked) {
    return (
      <div className="student-app">
        <StudentAccessGate />
      </div>
    )
  }

  return <AuthenticatedAcademy />
}
