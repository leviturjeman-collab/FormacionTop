import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { BookOpen, BookMarked, Bot, Boxes, Compass, Globe, GraduationCap, HelpCircle, Home, KeyRound, ListOrdered, LogOut, Menu, Puzzle, Search, Sparkles, TrendingUp, X } from 'lucide-react'
import type { CursoLesson, LevelId } from '../types'
import { useCourse } from '../course'
import { href, navigate, type Route } from '../router'
import { store, useStudent } from '../store'
import { LOCALES, useLocale, useT } from '../i18n'
import { signInWithPin, signOutRemoteSession, useSession } from '../session'
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

export function Sidebar({ route, open, onClose }: { route: Route; open: boolean; onClose: () => void }) {
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
    <aside id="academy-navigation" aria-label={locale === 'en' ? 'Main navigation' : 'Navegación principal'} className={`st-sidebar${open ? ' open' : ''}`}><button type="button" className="st-sidebar-close" onClick={onClose} aria-label={locale === 'en' ? 'Close menu' : 'Cerrar menú'}><X size={20} /></button>
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
        {student.access === 'admin' && (
          <a className={is('admin') ? 'active' : ''} href={href({ name: 'admin' })} onClick={onClose}>
            <KeyRound size={14} /> {t('nav.superAdmin')}
          </a>
        )}
        <a className={is('kits') ? 'active' : ''} href={href({name:'kits'})} onClick={onClose}><Boxes size={14}/>{t('nav.kits')}</a>
        <a className={is('herramientas') || is('herramienta') ? 'active' : ''} href={href({name:'herramientas'})} onClick={onClose}><Puzzle size={14}/>{t('nav.herramientas')}</a>
        <a className={is('automatizaciones') ? 'active' : ''} href={href({name:'automatizaciones'})} onClick={onClose}><Boxes size={14}/>{locale === 'en' ? 'Automations' : 'Automatizaciones'}</a>
        <a className={is('agentes') ? 'active' : ''} href={href({name:'agentes'})} onClick={onClose}><Bot size={14}/>{t('nav.agentes')}</a>
        <a className={is('prompts') ? 'active' : ''} href={href({name:'prompts'})} onClick={onClose}><Sparkles size={14}/>{t('nav.prompts')}</a>
        <a className={is('guia') ? 'active' : ''} href={href({ name: 'guia' })} onClick={onClose}>
          <Compass size={14} /> {t('nav.guias')}
        </a>
        <details className="st-nav-group" open={['preguntas','indice','progreso'].includes(route.name)}><summary>{locale === 'en' ? 'Help and progress' : 'Ayuda y progreso'}</summary>
        <a className={is('preguntas') ? 'active' : ''} href={href({ name: 'preguntas' })} onClick={onClose}>
          <HelpCircle size={14} /> {t('nav.preguntas')}
        </a>
        <a className={is('indice') ? 'active' : ''} href={href({ name: 'indice' })} onClick={onClose}>
          <ListOrdered size={14} /> {t('nav.diccionario')}
        </a>
        <a className={is('progreso') ? 'active' : ''} href={href({ name: 'progreso' })} onClick={onClose}>
          <TrendingUp size={14} /> {t('nav.progreso')}
        </a>

        </details>
      </nav>

      <details className="st-nav-group" open={['curso','area','categoria','leccion'].includes(route.name)}><summary>{t('nav.rutaPrincipal')}</summary><p className="st-side-title">{t('nav.rutaPrincipal')}</p>
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

      </details><div className="st-course-progress">
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

export function Header({ route, onMenu }: { route: Route; onMenu: () => void }) {
  const course = useCourse()
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
      case 'indice': return [t('nav.diccionario'), route.termId || route.letter?.toUpperCase() || ''].filter(Boolean)
      case 'buscar': return [locale === 'en' ? 'Search' : 'Búsqueda', route.query ? `«${route.query}»` : ''].filter(Boolean)
      case 'proyecto': return [locale === 'en' ? 'Final project' : 'Proyecto final']
      case 'deck': return [locale === 'en' ? 'Presentation' : 'Presentación']
      case 'prompts': return [t('nav.prompts')]
      case 'kits': return [t('nav.kits')]
      case 'agentes': {
        if (!route.agentId) return [t('nav.agentes')]
        const agent = (course.agents || []).find((item) => item.id === route.agentId)
        return [t('nav.agentes'), agent?.title || route.agentId]
      }
      case 'automatizaciones': return [locale === 'en' ? 'Automations' : 'Automatizaciones']
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
      <div className="st-header-trail">
        <button type="button" className="st-menu" onClick={onMenu} aria-label={locale === 'en' ? 'Open menu' : 'Abrir menú'}>
          <Menu size={15} />
        </button>
        {trail.map((part, index) => (
          <span key={index} className="st-breadcrumb">
            {index > 0 && '›'}
            {index === trail.length - 1 ? <strong>{part}</strong> : part}
          </span>
        ))}
      </div>
      <div className="st-header-actions">
        <LanguageSwitch compact />
        <a className="st-project-switch" href={href({ name: 'curso' })}>
          <BookOpen size={12} />
          {t('header.rutaGuiada')}
        </a>
        <button
          type="button"
          className="st-project-switch danger"
          onClick={() => void signOutRemoteSession()}
          title={locale === 'en' ? 'Exit this profile' : 'Salir de este perfil'}
        >
          <LogOut size={12} />
          {locale === 'en' ? 'Exit' : 'Salir'}
        </button>
      </div>
    </header>
  )
}

export function AccessGate() {
  const locale = useLocale()
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function enter(event: FormEvent) {
    event.preventDefault()
    const value = pin.trim()
    if (!value) return
    setError('')
    setBusy(true)
    try {
      await signInWithPin({ pin: value })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo comprobar el acceso.')
    } finally { setBusy(false) }
  }

  return (
    <div className="st-access">
      <section className="st-access-card">
        <div className="st-access-head">
          <span className="st-kicker"><KeyRound size={12} /> {locale === 'en' ? 'Private academy' : 'Academia privada'}</span>
          <LanguageSwitch compact />
        </div>
        <h1>{locale === 'en' ? 'Enter with your PIN' : 'Entra con tu PIN'}</h1>
        <p>{locale === 'en' ? 'Use the access code your teacher gave you.' : 'Usa la clave de acceso que te ha dado tu profesor.'}</p>
        <form onSubmit={enter} className="st-access-form">
          <label>
            <span>{locale === 'en' ? 'Access code' : 'Clave de acceso'}</span>
            <input
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              type="password"
              maxLength={72}
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

