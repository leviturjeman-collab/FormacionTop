import { useEffect, useState } from 'react'
import type { LevelId } from './types'

/**
 * Rutas por hash. Cada pantalla tiene URL propia, y los filtros viajan en la
 * query para que un listado filtrado se pueda enlazar y compartir tal cual.
 */

export interface Filters {
  tool?: string
  section?: string
  kind?: string
  stage?: string
  done?: 'si' | 'no'
}

export type Route =
  | { name: 'inicio' }
  | { name: 'mi-proyecto' }
  | { name: 'proyecto'; stageId: string }
  | { name: 'deck'; deckId: string }
  | { name: 'prompts'; familyId?: string }
  | { name: 'skills' }
  | { name: 'kits'; kitId?: string }
  | { name: 'agentes'; agentId?: string }
  | { name: 'admin' }
  | { name: 'guia'; guideId?: string }
  | { name: 'curso'; lessonId?: string }
  | { name: 'biblioteca' }
  | { name: 'herramientas' }
  | { name: 'herramienta'; toolId: string; filters: Filters; panel?: string }
  | { name: 'preguntas' }
  | { name: 'indice'; letter?: string }
  | { name: 'buscar'; query: string; filters: Filters }
  | { name: 'progreso' }

const LEVELS: LevelId[] = ['basico', 'intermedio', 'avanzado']
const FILTER_KEYS: (keyof Filters)[] = ['tool', 'section', 'kind', 'stage', 'done']

function readFilters(params: URLSearchParams): Filters {
  const filters: Filters = {}
  for (const key of FILTER_KEYS) {
    const value = params.get(key)
    if (value) filters[key] = value as never
  }
  return filters
}

function writeFilters(filters: Filters): string {
  const params = new URLSearchParams()
  for (const key of FILTER_KEYS) {
    const value = filters[key]
    if (value) params.set(key, value)
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '')
  const [pathPart, queryPart] = clean.split('?')
  const params = new URLSearchParams(queryPart || '')
  const segments = pathPart.split('/').filter(Boolean).map(decodeURIComponent)
  const filters = readFilters(params)

  switch (segments[0]) {
    case undefined:
    case '':
      return { name: 'inicio' }
    case 'mi-proyecto':
      return { name: 'mi-proyecto' }
    case 'automatizaciones':
      return { name: 'herramienta', toolId: 'n8n', filters: {} }
    // Rutas del material del vault, que ya no se publica. Se conservan aquí
    // para que un enlace antiguo no acabe en una pantalla vacía: llevan al
    // programa en vez de dar error.
    case 'ruta':
    case 'area':
    case 'categoria':
    case 'leccion':
    case 'presentar':
    case 'carpeta':
      return { name: 'curso' }
    case 'proyecto':
      return segments[1] ? { name: 'proyecto', stageId: segments[1] } : { name: 'curso' }
    case 'deck':
      return segments[1] ? { name: 'deck', deckId: segments[1] } : { name: 'curso' }
    case 'prompts':
      return { name: 'prompts', familyId: segments[1] }
    case 'skills':
      return { name: 'skills' }
    case 'kits':
    case 'institucional':
      return { name: 'kits', kitId: segments[1] }
    case 'agentes':
      return { name: 'agentes', agentId: segments[1] }
    case 'admin':
    case 'super-admin':
      return { name: 'admin' }
    case 'guia':
      return { name: 'guia', guideId: segments[1] }
    case 'curso':
      return { name: 'curso', lessonId: segments[1] }
    case 'biblioteca':
      return { name: 'biblioteca' }
    case 'herramientas':
      return { name: 'herramientas' }
    case 'herramienta':
      return segments[1]
        ? { name: 'herramienta', toolId: segments[1], filters, panel: params.get('p') || undefined }
        : { name: 'herramientas' }
    case 'preguntas':
      return { name: 'preguntas' }
    case 'indice':
      return { name: 'indice', letter: segments[1] }
    case 'buscar':
      return { name: 'buscar', query: params.get('q') || '', filters }
    case 'progreso':
      return { name: 'progreso' }
    default:
      return { name: 'inicio' }
  }
}

export function href(route: Route): string {
  switch (route.name) {
    case 'inicio':
      return '#/'
    case 'mi-proyecto':
      return '#/mi-proyecto'
    case 'proyecto':
      return `#/proyecto/${encodeURIComponent(route.stageId)}`
    case 'deck':
      return `#/deck/${encodeURIComponent(route.deckId)}`
    case 'prompts':
      return route.familyId ? `#/prompts/${encodeURIComponent(route.familyId)}` : '#/prompts'
    case 'skills':
      return '#/skills'
    case 'kits':
      return route.kitId ? `#/kits/${encodeURIComponent(route.kitId)}` : '#/kits'
    case 'agentes':
      return route.agentId ? `#/agentes/${encodeURIComponent(route.agentId)}` : '#/agentes'
    case 'admin':
      return '#/admin'
    case 'guia':
      return route.guideId ? `#/guia/${encodeURIComponent(route.guideId)}` : '#/guia'
    case 'curso':
      return route.lessonId ? `#/curso/${encodeURIComponent(route.lessonId)}` : '#/curso'
    case 'biblioteca':
      return '#/biblioteca'
    case 'herramientas':
      return '#/herramientas'
    case 'herramienta': {
      // La seccion abierta viaja en la query: cada apartado de una herramienta
      // tiene su propio enlace y su propia pantalla.
      const query = writeFilters(route.filters)
      const panel = route.panel ? `${query ? '&' : '?'}p=${encodeURIComponent(route.panel)}` : ''
      return `#/herramienta/${encodeURIComponent(route.toolId)}${query}${panel}`
    }
    case 'preguntas':
      return '#/preguntas'
    case 'indice':
      return route.letter ? `#/indice/${encodeURIComponent(route.letter)}` : '#/indice'
    case 'buscar': {
      const rest = writeFilters(route.filters).replace(/^\?/, '')
      return `#/buscar?q=${encodeURIComponent(route.query)}${rest ? `&${rest}` : ''}`
    }
    case 'progreso':
      return '#/progreso'
  }
}

export function navigate(route: Route) {
  window.location.hash = href(route)
}

/** Activa o desactiva un filtro sobre la ruta actual, sin salir de ella. */
export function toggleFilter(route: Route, key: keyof Filters, value: string): Route {
  if (!('filters' in route)) return route
  const current = route.filters[key]
  const filters = { ...route.filters }
  if (current === value) delete filters[key]
  else filters[key] = value as never
  return { ...route, filters }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))

  useEffect(() => {
    const onChange = () => {
      const next = parseHash(window.location.hash)
      setRoute(next)
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}
