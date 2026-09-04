import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { BookOpen, BookMarked, Bot, Boxes, Compass, Globe, GraduationCap, HelpCircle, Home, KeyRound, ListOrdered, Loader2, LogOut, Menu, Presentation, Puzzle, Search, Sparkles, TrendingUp, X } from 'lucide-react'
import type { CursoLesson, LevelId } from './types'
import { CourseContext, useCourse, useCourseLoader } from './course'
import { href, navigate, useRoute, type Route } from './router'
import { store, useStudent } from './store'
import { LOCALES, useLocale, useT } from './i18n'
import { supabase } from './supabase'
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

/** Selector de idioma: una short list (hoy ES/EN) persistida en el navegador. */
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
  const locale = useLocale()
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

      <nav aria-label={locale === 'en' ? 'Main navigation' : 'Navegación principal'}>
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
        <a className={is('kits') ? 'active' : ''} href={href({ name: 'kits' })} onClick={onClose}>
          <Boxes size={14} /> {t('nav.kits')}
        </a>
        <a className={is('agentes') ? 'active' : ''} href={href({ name: 'agentes' })} onClick={onClose}>
          <Bot size={14} /> {t('nav.agentes')}
        </a>
        {(student.teacher || is('admin')) && (
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

      <div className="st-course-progress">
        <div>
          <span>{t('nav.rutaPrincipal')}</span>
          <strong>{mainDone}/{cursoBase.length}</strong>
        </div>
        <i><b style={{ width: `${percent}%` }} /></i>
        <div className="st-level-pick" role="group" aria-label={locale === 'en' ? 'Default level' : 'Nivel por defecto'}>
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
  const t = useT()
  const locale = useLocale()

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
        return [category?.label || (locale === 'en' ? 'Lesson' : 'Lección'), lesson?.title || route.slug]
      }
      case 'biblioteca': return [locale === 'en' ? 'Library' : 'Biblioteca']
      case 'carpeta': {
        const folder = course.folders.find((item) => item.id === route.folderId)
        return [locale === 'en' ? 'Library' : 'Biblioteca', folder?.label || route.folderId]
      }
      case 'herramientas': return [t('nav.herramientas')]
      case 'herramienta': {
        const tool = course.toolPages.find((item) => item.id === route.toolId)
        return [t('nav.herramientas'), tool?.label || route.toolId]
      }
      case 'preguntas': return [t('nav.preguntas')]
      case 'indice': return [t('nav.diccionario'), route.letter?.toUpperCase() || ''].filter(Boolean)
      case 'buscar': return [locale === 'en' ? 'Search' : 'Búsqueda', route.query ? `«${route.query}»` : ''].filter(Boolean)
      case 'presentar': return [locale === 'en' ? 'Presentation' : 'Presentación']
      case 'proyecto': return [locale === 'en' ? 'Final project' : 'Proyecto final']
      case 'deck': return [locale === 'en' ? 'Presentation' : 'Presentación']
      case 'prompts': return [t('nav.prompts')]
      case 'kits': return [t('nav.kits')]
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
      default: return [locale === 'en' ? 'Academy' : 'Academia']
    }
  }, [route, course, t])

  return (
    <header className="st-header">
      <div>
        <button type="button" className="st-menu" onClick={onMenu} aria-label={locale === 'en' ? 'Open menu' : 'Abrir menú'}>
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
        <LanguageSwitch compact />
        <a className="st-project-switch" href={href({ name: 'buscar', query: '', filters: {} })}>
          <BookOpen size={12} />
          {t('header.rutaGuiada')}
        </a>
        <button
          type="button"
          className={`st-project-switch${teacher ? ' on' : ''}`}
          onClick={() => store.toggleTeacher()}
          aria-pressed={teacher}
          title={locale === 'en' ? 'Shows the class script and presentation access. Students do not see it.' : 'Muestra el guion de clase y el acceso a presentar. El alumno no lo ve.'}
        >
          <Presentation size={12} />
          {teacher ? t('sidebar.modoProfesor') : t('sidebar.modoAlumno')}
        </button>
        <button
          type="button"
          className="st-project-switch danger"
          onClick={() => store.logout()}
          title={locale === 'en' ? 'Exit this profile' : 'Salir de este perfil'}
        >
          <LogOut size={12} />
          {locale === 'en' ? 'Exit' : 'Salir'}
        </button>
      </div>
    </header>
  )
}

function AccessGate() {
  const locale = useLocale()
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function enter(event: FormEvent) {
    event.preventDefault()
    const value = pin.trim()
    if (!value) return
    setError('')
    if (value === '5555') {
      store.enter({ name: 'Levi', teacher: true, access: 'admin', preferredLevel: 'intermedio', locale })
      return
    }
    if (!supabase) {
      setError(locale === 'en' ? 'Student PINs need Supabase configured.' : 'Los PINs de alumnos necesitan Supabase configurado.')
      return
    }
    setBusy(true)
    const { data, error: rpcError } = await supabase.rpc('verify_learner_pin', { learner_pin: value })
    setBusy(false)
    const learner = Array.isArray(data) ? data[0] : null
    if (rpcError || !learner) {
      setError(locale === 'en' ? 'That PIN is not active.' : 'Ese PIN no está activo.')
      return
    }
    store.enter({
      id: learner.id,
      name: learner.name,
      teacher: false,
      access: 'learner',
      preferredLevel: learner.level || 'basico',
      locale: learner.locale || locale,
      project: {
        name: learner.goal || '',
        goal: learner.goal || '',
        audience: '',
        problem: '',
        outcome: '',
        tools: learner.tools || '',
        updatedAt: new Date().toISOString(),
      },
    })
  }

  return (
    <div className="st-access">
      <section className="st-access-card">
        <div className="st-access-head">
          <span className="st-kicker"><KeyRound size={12} /> {locale === 'en' ? 'Private academy' : 'Academia privada'}</span>
          <LanguageSwitch compact />
        </div>
        <h1>{locale === 'en' ? 'Enter with your PIN' : 'Entra con tu PIN'}</h1>
        <p>{locale === 'en' ? 'Use the PIN your teacher gave you. Admin access uses the teacher PIN.' : 'Usa el PIN que te ha dado tu profesor. El acceso admin usa el PIN de profesor.'}</p>
        <form onSubmit={enter} className="st-access-form">
          <label>
            <span>{locale === 'en' ? 'Student or admin PIN' : 'PIN de alumno o administrador'}</span>
            <input
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 8))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="••••••"
              autoFocus
            />
          </label>
          <button type="submit" className="st-btn" disabled={busy || pin.trim().length < 4}>
            <KeyRound size={14} />
            {busy ? (locale === 'en' ? 'Checking...' : 'Comprobando...') : (locale === 'en' ? 'Unlock training' : 'Desbloquear formación')}
          </button>
          {error && <small className="st-access-error">{error}</small>}
        </form>
      </section>
    </div>
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
  const locale = useLocale()
  const t = useT()
  const student = useStudent()
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
  if (!student.access && !student.teacher) return <AccessGate />

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

export default function App() {
  const locale = useLocale()
  const t = useT()
  const { course, error } = useCourseLoader(locale)

  if (error) {
    return (
      <div className="st-loading">
        <span><X size={18} /></span>
        <strong>{t('loading.noCargado')}</strong>
        <small>{error}</small>
        <button type="button" className="st-btn" onClick={() => window.location.reload()}>
          {t('loading.entrarOtraVez')}
        </button>
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
        <small><Loader2 size={11} className="spin" /> {t('common.cargando')}</small>
      </div>
    )
  }

  return (
    <CourseContext.Provider value={course}>
      <Shell />
    </CourseContext.Provider>
  )
}
