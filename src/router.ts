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
  | { name: 'ruta' }
  | { name: 'area'; stageId: string; filters: Filters }
  | { name: 'categoria'; categoryId: string; filters: Filters }
  | { name: 'leccion'; slug: string; level?: LevelId }
  | { name: 'presentar'; slug: string; level: LevelId }
  | { name: 'proyecto'; stageId: string }
  | { name: 'deck'; deckId: string }
  | { name: 'prompts'; familyId?: string }
  | { name: 'guia'; guideId?: string }
  | { name: 'curso'; lessonId?: string }
  | { name: 'biblioteca' }
  | { name: 'carpeta'; folderId: string; filters: Filters }
  | { name: 'herramientas' }
  | { name: 'herramienta'; toolId: string; filters: Filters }
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
    case 'ruta':
      return { name: 'ruta' }
    case 'area':
      return segments[1] ? { name: 'area', stageId: segments[1], filters } : { name: 'ruta' }
    case 'categoria':
      return segments[1] ? { name: 'categoria', categoryId: segments[1], filters } : { name: 'ruta' }
    case 'leccion': {
      if (!segments[1]) return { name: 'ruta' }
      const level = params.get('n') as LevelId | null
      return { name: 'leccion', slug: segments[1], level: level && LEVELS.includes(level) ? level : undefined }
    }
    case 'presentar': {
      if (!segments[1]) return { name: 'ruta' }
      const level = params.get('n') as LevelId | null
      return { name: 'presentar', slug: segments[1], level: level && LEVELS.includes(level) ? level : 'intermedio' }
    }
    case 'proyecto':
      return segments[1] ? { name: 'proyecto', stageId: segments[1] } : { name: 'ruta' }
    case 'deck':
      return segments[1] ? { name: 'deck', deckId: segments[1] } : { name: 'ruta' }
    case 'prompts':
      return { name: 'prompts', familyId: segments[1] }
    case 'guia':
      return { name: 'guia', guideId: segments[1] }
    case 'curso':
      return { name: 'curso', lessonId: segments[1] }
    case 'biblioteca':
      return { name: 'biblioteca' }
    case 'carpeta':
      return segments[1] ? { name: 'carpeta', folderId: segments[1], filters } : { name: 'biblioteca' }
    case 'herramientas':
      return { name: 'herramientas' }
    case 'herramienta':
      return segments[1] ? { name: 'herramienta', toolId: segments[1], filters } : { name: 'herramientas' }
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
    case 'ruta':
      return '#/ruta'
    case 'area':
      return `#/area/${encodeURIComponent(route.stageId)}${writeFilters(route.filters)}`
    case 'categoria':
      return `#/categoria/${encodeURIComponent(route.categoryId)}${writeFilters(route.filters)}`
    case 'leccion':
      return `#/leccion/${encodeURIComponent(route.slug)}${route.level ? `?n=${route.level}` : ''}`
    case 'presentar':
      return `#/presentar/${encodeURIComponent(route.slug)}?n=${route.level}`
    case 'proyecto':
      return `#/proyecto/${encodeURIComponent(route.stageId)}`
    case 'deck':
      return `#/deck/${encodeURIComponent(route.deckId)}`
    case 'prompts':
      return route.familyId ? `#/prompts/${encodeURIComponent(route.familyId)}` : '#/prompts'
    case 'guia':
      return route.guideId ? `#/guia/${encodeURIComponent(route.guideId)}` : '#/guia'
    case 'curso':
      return route.lessonId ? `#/curso/${encodeURIComponent(route.lessonId)}` : '#/curso'
    case 'biblioteca':
      return '#/biblioteca'
    case 'carpeta':
      return `#/carpeta/${encodeURIComponent(route.folderId)}${writeFilters(route.filters)}`
    case 'herramientas':
      return '#/herramientas'
    case 'herramienta':
      return `#/herramienta/${encodeURIComponent(route.toolId)}${writeFilters(route.filters)}`
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
