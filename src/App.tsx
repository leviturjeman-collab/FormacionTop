import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { BookOpen, BookMarked, Boxes, BrainCircuit, Compass, Gamepad2, GraduationCap, HelpCircle, Home, KeyRound, ListOrdered, Lock, LogOut, Menu, Presentation, Puzzle, Search, ShieldCheck, Sparkles, TrendingUp, X } from 'lucide-react'
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
import Skills from './pages/Skills'
import Kits from './pages/Kits'
import Admin from './pages/Admin'
import Guia from './pages/Guia'
import { CursoIndice, CursoLeccion } from './pages/Curso'
import { Area, Biblioteca, Carpeta, Categoria, Herramienta, Herramientas, Ruta } from './pages/Listados'

const LEVEL_SHORT: Record<LevelId, string> = { basico: 'Bás', intermedio: 'Int', avanzado: 'Avz' }
const ROBOT_CURSOR_SRC = `${import.meta.env.BASE_URL}robot-cursor.png`
const ACCESS_GAME_FLOOR = 78
const ACCESS_ROBOT_X = 116
const ACCESS_ROBOT_SIZE = 58
const ACCESS_GRAVITY = 1220
const ACCESS_JUMP_VELOCITY = -430
const ACCESS_MAX_FALL = 680

type AccessPipe = {
  id: number
  x: number
  gapY: number
  gap: number
  width: number
  scored: boolean
}

type AccessGameView = {
  y: number
  velocity: number
  pipes: AccessPipe[]
  score: number
  best: number
  alive: boolean
  started: boolean
}

function accessGameGap(height: number) {
  return Math.max(174, Math.min(218, height * 0.36))
}

function accessPipeWidth(width: number) {
  return Math.max(62, Math.min(82, width * 0.12))
}

function randomAccessGap(height: number, gap: number) {
  const topPad = 76
  const bottomPad = ACCESS_GAME_FLOOR + 58
  const max = Math.max(topPad, height - bottomPad - gap)
  return Math.round(topPad + Math.random() * (max - topPad))
}

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
        <span><GraduationCap size={17} /></span>
        <div>
          <strong>AI Professional Academy</strong>
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
        <a className={is('skills') ? 'active' : ''} href={href({ name: 'skills' })} onClick={onClose}>
          <BrainCircuit size={14} /> Skills
        </a>
        <a className={is('kits') ? 'active' : ''} href={href({ name: 'kits' })} onClick={onClose}>
          <Boxes size={14} /> Kits institucionales
        </a>
        {student.adminUnlocked && (
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

function StudentAccessGate() {
  const route = useRoute()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const stageRef = useRef<HTMLDivElement>(null)
  const pipeIdRef = useRef(1)
  const lastTickRef = useRef<number | null>(null)
  const gameRef = useRef<AccessGameView>({
    y: 214,
    velocity: 0,
    pipes: [],
    score: 0,
    best: 0,
    alive: true,
    started: false,
  })
  const [game, setGame] = useState(gameRef.current)
  const cleanPin = pin.replace(/\D/g, '').slice(0, 6)
  const canSubmit = cleanPin.length === 4 || cleanPin.length === 6

  const resetGame = useCallback((launch = false) => {
    const rect = stageRef.current?.getBoundingClientRect()
    const width = rect?.width || 640
    const height = rect?.height || 520
    const gap = accessGameGap(height)
    const pipeWidth = accessPipeWidth(width)
    const spacing = Math.max(326, width * 0.54)
    const startX = width + Math.max(128, width * 0.22)
    const pipes = Array.from({ length: 3 }, (_, index): AccessPipe => ({
      id: pipeIdRef.current++,
      x: startX + spacing * index,
      gapY: randomAccessGap(height, gap),
      gap,
      width: pipeWidth,
      scored: false,
      }))
    const next = {
      y: Math.min(height * 0.42, height - ACCESS_GAME_FLOOR - ACCESS_ROBOT_SIZE - 18),
      velocity: launch ? ACCESS_JUMP_VELOCITY : 0,
      pipes,
      score: 0,
      best: gameRef.current.best,
      alive: true,
      started: launch,
    }
    lastTickRef.current = null
    gameRef.current = next
    setGame(next)
  }, [])

  const jump = useCallback(() => {
    const current = gameRef.current
    if (!current.alive) {
      resetGame(true)
      return
    }
    gameRef.current = { ...current, started: true, velocity: ACCESS_JUMP_VELOCITY }
    lastTickRef.current = null
    setGame(gameRef.current)
  }, [resetGame])

  useEffect(() => {
    resetGame(false)
    const onResize = () => resetGame(gameRef.current.started)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space') return
      event.preventDefault()
      jump()
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [jump, resetGame])

  useEffect(() => {
    let frame = 0
    const tick = (time: number) => {
      const rect = stageRef.current?.getBoundingClientRect()
      if (rect) {
        const last = lastTickRef.current ?? time
        const dt = Math.min(0.034, Math.max(0.001, (time - last) / 1000))
        lastTickRef.current = time
        const width = rect.width
        const height = rect.height
        const gap = accessGameGap(height)
        const pipeWidth = accessPipeWidth(width)
        const current = gameRef.current
        if (current.started && current.alive) {
          const speed = Math.min(230, 150 + current.score * 4)
          const y = current.y + current.velocity * dt
          const velocity = Math.min(ACCESS_MAX_FALL, current.velocity + ACCESS_GRAVITY * dt)
          const maxX = Math.max(...current.pipes.map((pipe) => pipe.x))
          let score = current.score
          let alive = y > 0 && y + ACCESS_ROBOT_SIZE < height - ACCESS_GAME_FLOOR
          const pipes = current.pipes.map((pipe) => {
            let nextPipe = { ...pipe, x: pipe.x - speed * dt, width: pipeWidth, gap }
            if (nextPipe.x + pipeWidth < -24) {
              nextPipe = {
                ...nextPipe,
                id: pipeIdRef.current++,
                x: maxX + Math.max(326, width * 0.54),
                gapY: randomAccessGap(height, gap),
                scored: false,
              }
            }
            if (!nextPipe.scored && nextPipe.x + pipeWidth < ACCESS_ROBOT_X) {
              score += 1
              nextPipe.scored = true
            }
            const overlapsX = ACCESS_ROBOT_X + ACCESS_ROBOT_SIZE - 9 > nextPipe.x && ACCESS_ROBOT_X + 8 < nextPipe.x + pipeWidth
            const outsideGap = y + 8 < nextPipe.gapY || y + ACCESS_ROBOT_SIZE - 8 > nextPipe.gapY + gap
            if (overlapsX && outsideGap) alive = false
            return nextPipe
          })
          const best = Math.max(current.best, score)
          gameRef.current = { y, velocity, pipes, score, best, alive, started: alive }
          setGame({ ...gameRef.current })
        } else {
          lastTickRef.current = null
        }
      }
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (store.unlockLearner(cleanPin)) {
      if (cleanPin !== '5555' && route.name === 'admin') navigate({ name: 'inicio' })
      return
    }
    setError('PIN no encontrado. Pide tu acceso al profesor.')
    setPin('')
  }

  return (
    <div className="st-access-shell">
      <section className="st-access">
        <div className="st-access-copy">
          <span className="st-kicker"><ShieldCheck size={12} /> Academia privada</span>
          <h1>Entra con tu PIN</h1>
          <p>Tu ruta se abre cuando validas el PIN que te ha dado el profesor.</p>

          <form className="st-pin-card" onSubmit={submit} aria-label="Acceso de alumno por PIN">
            <label>
              <span>PIN de alumno o administrador</span>
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
              <Lock size={14} /> Desbloquear formación
            </button>
          </form>
        </div>

        <div
          ref={stageRef}
          className={`st-flappy-stage${game.alive ? '' : ' is-crashed'}${game.started ? ' is-playing' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Juego de salto del robot"
          onPointerDown={jump}
        >
          <span className="st-flappy-sun" />
          <span className="st-flappy-grid" />
          <span className="st-flappy-cloud cloud-a" />
          <span className="st-flappy-cloud cloud-b" />
          <div className="st-flappy-trail">
            <i />
            <i />
            <i />
          </div>
          <div
            className="st-flappy-robot"
            style={{
              transform: `translate3d(0, ${game.y}px, 0) rotate(${Math.max(-24, Math.min(18, game.velocity * 0.055))}deg)`,
            }}
          >
            <img src={ROBOT_CURSOR_SRC} alt="" draggable={false} />
          </div>
          {game.pipes.map((pipe) => (
            <div
              key={pipe.id}
              className="st-flappy-pipe"
              style={{
                '--pipe-x': `${pipe.x}px`,
                '--pipe-w': `${pipe.width}px`,
                '--gap-y': `${pipe.gapY}px`,
                '--gap-h': `${pipe.gap}px`,
              } as CSSProperties}
            >
              <i className="top" />
              <i className="bottom" />
            </div>
          ))}
          <div className="st-flappy-floor">
            <span />
            <span />
          </div>
          <div className="st-flappy-hud">
            <Gamepad2 size={14} />
            <strong>{game.score}</strong>
            <small>MAX {game.best}</small>
          </div>
          {!game.started && game.alive && <div className="st-flappy-toast">ESPACIO / CLIC</div>}
          {!game.alive && <div className="st-flappy-toast danger">OTRA VEZ</div>}
        </div>
      </section>
    </div>
  )
}

function Header({ route, onMenu }: { route: Route; onMenu: () => void }) {
  const course = useCourse()
  const { adminUnlocked, learnerUnlocked, teacher } = useStudent()

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
      case 'skills': return ['Skills']
      case 'kits': return ['Kits institucionales']
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
        {adminUnlocked ? (
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
        ) : !learnerUnlocked ? (
          <a className="st-project-switch" href={href({ name: 'admin' })} title="Acceso privado con PIN">
            <KeyRound size={12} />
            Acceso privado
          </a>
        ) : null}
        {(learnerUnlocked || adminUnlocked) && (
          <button
            type="button"
            className="st-project-switch st-session-exit"
            onClick={() => store.lockLearner()}
            title={adminUnlocked ? 'Salir del súper administrador' : 'Salir del perfil de alumno'}
          >
            <LogOut size={12} />
            {adminUnlocked ? 'Salir admin' : 'Salir perfil'}
          </button>
        )}
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
    case 'kits': return <Kits />
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
          Ruta principal, especializaciones y biblioteca de consulta ·
          actualizado el {new Date(course.generatedAt).toLocaleDateString('es-ES')}
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
      <div className="st-loading st-loading-error">
        <div className="st-loading-mark" aria-hidden="true">
          <span className="st-loading-orbit orbit-a" />
          <span className="st-loading-orbit orbit-b" />
          <span className="st-loading-core"><X size={18} /></span>
        </div>
        <div className="st-loading-copy">
          <strong>No se ha podido cargar el curso</strong>
          <small>{error}</small>
        </div>
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
          <strong>Preparando la formación</strong>
          <small>Organizando ruta, kits, prompts y automatizaciones</small>
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
