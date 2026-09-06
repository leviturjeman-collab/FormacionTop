import { Sidebar, Header, AccessGate } from './components/AcademyChrome'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { CourseContext, useCourse, useCourseLoader } from './course'
import { href, navigate, useRoute, type Route } from './router'
import { store, useStudent, usePersistence } from './store'
import { useLocale, useT } from './i18n'
import { restoreRemoteSession, useSession } from './session'
const Inicio = lazy(() => import('./pages/Inicio'))
const MiProyecto = lazy(() => import('./pages/MiProyecto'))
const Leccion = lazy(() => import('./pages/Leccion'))
const Buscar = lazy(() => import('./pages/Buscar'))
const Indice = lazy(() => import('./pages/Indice'))
const Preguntas = lazy(() => import('./pages/Preguntas'))
const Progreso = lazy(() => import('./pages/Progreso'))
const Proyecto = lazy(() => import('./pages/Proyecto'))
const Deck = lazy(() => import('./pages/Deck'))
const Prompts = lazy(() => import('./pages/Prompts'))
const Kits = lazy(() => import('./pages/Kits'))
const Agentes = lazy(() => import('./pages/Agentes'))
const Automatizaciones = lazy(() => import('./pages/Automatizaciones'))
const Admin = lazy(() => import('./pages/Admin'))
const Guia = lazy(() => import('./pages/Guia'))
const CursoIndice = lazy(() => import('./pages/Curso').then(module => ({ default: module.CursoIndice })))
const CursoLeccion = lazy(() => import('./pages/Curso').then(module => ({ default: module.CursoLeccion })))
const Area = lazy(() => import('./pages/Listados').then(module => ({ default: module.Area })))
const Biblioteca = lazy(() => import('./pages/Listados').then(module => ({ default: module.Biblioteca })))
const Carpeta = lazy(() => import('./pages/Listados').then(module => ({ default: module.Carpeta })))
const Categoria = lazy(() => import('./pages/Listados').then(module => ({ default: module.Categoria })))
const Herramienta = lazy(() => import('./pages/Listados').then(module => ({ default: module.Herramienta })))
const Herramientas = lazy(() => import('./pages/Listados').then(module => ({ default: module.Herramientas })))
const Ruta = lazy(() => import('./pages/Listados').then(module => ({ default: module.Ruta })))

function Pages({ route }: { route: Route }) {
  const session = useSession()
  if (['admin', 'deck'].includes(route.name) && session.profile?.role !== 'admin') return <RestrictedAccess />
  switch (route.name) {
    case 'inicio': return <Inicio />
    case 'mi-proyecto': return <MiProyecto />
    case 'ruta': return <Ruta />
    case 'area': return <Area stageId={route.stageId} route={route} />
    case 'categoria': return <Categoria categoryId={route.categoryId} route={route} />
    case 'leccion': return <Leccion slug={route.slug} level={route.level} />
    case 'proyecto': return <Proyecto stageId={route.stageId} />
    case 'deck': return <Deck deckId={route.deckId} />
    case 'prompts': return <Prompts familyId={route.familyId} />
    case 'kits': return <Kits key={route.kitId || 'catalog'} kitId={route.kitId} />
    case 'agentes': return <Agentes agentId={route.agentId} />
    case 'automatizaciones': return <Automatizaciones key={route.automationId || 'catalog'} toolId={route.toolId} automationId={route.automationId} />
    case 'admin': return <Admin />
    case 'guia': return <Guia guideId={route.guideId} />
    case 'curso': return route.lessonId ? <CursoLeccion lessonId={route.lessonId} /> : <CursoIndice />
    case 'biblioteca': return <Biblioteca />
    case 'carpeta': return <Carpeta folderId={route.folderId} route={route} />
    case 'herramientas': return <Herramientas />
    case 'herramienta': return <Herramienta toolId={route.toolId} route={route} />
    case 'preguntas': return <Preguntas />
    case 'indice': return <Indice key={route.termId || route.letter} letter={route.letter} termId={route.termId} />
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
    if (!menuOpen) return
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    const sidebar = document.getElementById('academy-navigation')
    const controls = () => Array.from(sidebar?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,summary') || []).filter(el => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden')
    document.body.style.overflow = 'hidden'
    controls()[0]?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setMenuOpen(false) }
      if (event.key === 'Tab') {
        const items = controls(), first = items[0], last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); previous?.focus() }
  }, [menuOpen])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  const routeKey = useMemo(() => {
    switch (route.name) {
      case 'area': return `${route.name}:${route.stageId}`
      case 'categoria': return `${route.name}:${route.categoryId}:${JSON.stringify(route.filters)}`
      case 'herramienta': return `${route.name}:${route.toolId}:${route.tab}:${route.lessonId}:${JSON.stringify(route.filters)}`
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

  if (['admin', 'deck'].includes(route.name) && student.access !== 'admin') return <div className="student-app"><div className="st-page"><RestrictedAccess /></div></div>

  // Las presentaciones ocupan la pantalla entera: sin barra lateral ni cabecera.
  if (route.name === 'deck') return <Deck deckId={route.deckId} />
  if (!student.access) return <AccessGate />

  return (
    <div className="student-app">
      <Sidebar route={route} open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <button type="button" className="st-scrim" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}

      <div className="student-main">
        <Header route={route} onMenu={() => setMenuOpen(true)} />
        <PersistenceNotice />
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

function AuthenticatedApp() {
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
      <Suspense fallback={<div className="st-loading" role="status">{t('common.cargando')}</div>}><Shell /></Suspense>
    </CourseContext.Provider>
  )
}

function RestrictedAccess() {
  const locale = useLocale()
  return <section className="st-page"><h1>{locale === 'en' ? 'Restricted access' : 'Acceso restringido'}</h1><p>{locale === 'en' ? 'This page is reserved for your teacher.' : 'Esta página está reservada al profesor.'}</p><a className="st-btn" href={href({ name: 'inicio' })}>{locale === 'en' ? 'Go to my space' : 'Ir a mi espacio'}</a></section>
}

function downloadRecovery() {
  const url = URL.createObjectURL(new Blob([store.export()], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url; link.download = 'academia-recuperacion.json'; link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function PersistenceNotice() {
  const persistence = usePersistence()
  const locale = useLocale()
  const [error, setError] = useState('')
  if (persistence.status === 'saved' || persistence.status === 'saving') return null
  return <section className="st-persistence" role="status" aria-live="polite">
    <p>{persistence.message}</p>{error && <p role="alert">{error}</p>}
    <div className="st-actions">
      <button type="button" className="st-btn-ghost" onClick={downloadRecovery}>{locale === 'en' ? 'Download recovery copy' : 'Descargar copia de recuperación'}</button>
      {persistence.conflict ? <button type="button" className="st-btn-ghost" onClick={() => {
        if (window.confirm(locale === 'en' ? 'Load the server version? Your current version will be kept in a recovery copy.' : '¿Cargar la versión del servidor? La versión actual se conservará en una copia de recuperación.')) void store.resolveRemoteConflict('use-remote').catch(error => setError(String(error)))
      }}>{locale === 'en' ? 'Recover server version' : 'Recuperar versión del servidor'}</button> : <button type="button" className="st-btn-ghost" onClick={() => store.retrySave()}>{locale === 'en' ? 'Retry saving' : 'Reintentar guardado'}</button>}
    </div>
  </section>
}

export default function App() {
  const session = useSession()
  const locale = useLocale()
  useEffect(() => { void restoreRemoteSession() }, [])
  if (session.status === 'checking') return <div className="st-loading" role="status">{locale === 'en' ? 'Checking access…' : 'Comprobando acceso…'}</div>
  if (session.status === 'error') return <div className="st-access"><section className="st-access-card"><p role="alert">{session.message}</p><button type="button" className="st-btn" onClick={() => void restoreRemoteSession()}>{locale === 'en' ? 'Retry' : 'Reintentar'}</button><button type="button" className="st-btn-ghost" onClick={downloadRecovery}>{locale === 'en' ? 'Download recovery copy' : 'Descargar copia de recuperación'}</button></section></div>
  return session.status === 'authenticated' ? <AuthenticatedApp /> : <AccessGate />
}
