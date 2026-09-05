import { useRoute } from './router'
import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react'
import type { Course, Lesson, Stage } from './types'

export interface CourseData extends Course {
  tools: { id: string; label: string; icon: string }[]
}

export const CourseContext = createContext<CourseData | null>(null)

export function useCourse(): CourseData {
  const value = useContext(CourseContext)
  if (!value) throw new Error('useCourse fuera del proveedor del curso')
  return value
}

/** Índices para no recorrer toda la biblioteca en cada render. */
export function useIndexes() {
  const course = useCourse()
  return useMemo(() => {
    const bySlug = new Map<string, Lesson>(course.lessons.map((lesson) => [lesson.slug, lesson]))
    const stageById = new Map<string, Stage>(course.stages.map((stage) => [stage.id, stage]))
    return { bySlug, stageById }
  }, [course])
}

export function useLesson(slug: string): Lesson | null {
  const { bySlug } = useIndexes()
  return bySlug.get(slug) || null
}

export interface LoadState {
  course: CourseData | null
  error: string | null
}

type Shard = { schemaVersion: number; generatedAt: string; data: unknown }
function assertCourse(value: unknown): asserts value is CourseData {
  if (!value || typeof value !== 'object') throw new Error('El índice de contenido no es válido.')
  const c = value as Record<string, unknown>
  for (const key of ['lessons', 'stages', 'categories', 'folders', 'prompts', 'toolPages', 'curso', 'kits', 'agents', 'guides', 'projects', 'decks', 'preguntas', 'glossaryIndex', 'tools', 'levels']) {
    if (!Array.isArray(c[key])) throw new Error('El contenido no tiene el formato esperado: ' + key)
  }
  if (!c.stats || !c.kinds || !Array.isArray(c.sections)) throw new Error('El índice de contenido está incompleto.')
  for (const l of c.lessons as Lesson[]) if (!l.slug || !l.title || !l.levels?.basico || !l.levels?.intermedio || !l.levels?.avanzado) throw new Error('Hay una lección incompleta en el índice.')
}
export function useCourseLoader(locale: 'es' | 'en' = 'es'): LoadState {
  const route = useRoute()
  const needs = ['index']
  if (['prompts', 'buscar', 'mi-proyecto'].includes(route.name)) needs.push('prompts')
  if (['herramienta', 'buscar', 'kits'].includes(route.name)) needs.push('tools')
  if (['kits', 'buscar'].includes(route.name)) needs.push('kits')
  if (route.name === 'leccion' || route.name === 'presentar') needs.push('lessons/' + encodeURIComponent(route.slug))
  const key = locale + ':' + needs.join(',')
  const cache = useRef(new Map<string, Promise<Shard>>())
  const [state, setState] = useState<LoadState & { key: string }>({ course: null, error: null, key: '' })
  useEffect(() => {
    let cancelled = false
    const read = (name: string) => {
      const cacheKey = locale + ':' + name
      let promise = cache.current.get(cacheKey)
      if (!promise) {
        promise = fetch(import.meta.env.BASE_URL + 'course-data/' + locale + '/' + name + '.json', { cache: 'no-cache', credentials: 'same-origin' }).then(async response => {
          if (!response.ok) throw new Error(locale === 'en' ? 'Content unavailable. Reload or sign in again.' : 'Contenido no disponible. Recarga o vuelve a iniciar sesión.')
          const shard = await response.json() as Shard
          if (shard.schemaVersion !== 1 || typeof shard.generatedAt !== 'string' || !shard.data) throw new Error('Formato de contenido incompatible. Recarga la página.')
          return shard
        }).catch(error => { cache.current.delete(cacheKey); throw error })
        cache.current.set(cacheKey, promise)
      }
      return promise
    }
    void (async () => {
      const manifest = await read('index')
      assertCourse(manifest.data)
      const course: CourseData = { ...manifest.data }
      for (const name of needs.slice(1)) {
        if (name.startsWith('lessons/') && !course.lessons.some(l => 'lessons/' + encodeURIComponent(l.slug) === name)) continue
        const shard = await read(name)
        if (shard.generatedAt !== manifest.generatedAt) { cache.current.clear(); throw new Error(locale === 'en' ? 'The content was updated. Reload to get one consistent version.' : 'El contenido se ha actualizado. Recarga para usar la misma versión.') }
        if (name === 'prompts') { if (!Array.isArray(shard.data)) throw new Error('Invalid prompt data'); course.prompts = shard.data as CourseData['prompts'] }
        if (name === 'tools') { if (!Array.isArray(shard.data)) throw new Error('Invalid tool data'); course.toolPages = shard.data as CourseData['toolPages'] }
        if (name === 'kits') { if (!Array.isArray(shard.data)) throw new Error('Invalid kit data'); course.kits = shard.data as CourseData['kits'] }
        if (name.startsWith('lessons/')) {
          const lesson = shard.data as Lesson
          if (typeof lesson.slug !== 'string' || 'lessons/' + encodeURIComponent(lesson.slug) !== name || !lesson.levels?.basico) throw new Error('Invalid lesson data')
          course.lessons = course.lessons.map(l => l.slug === lesson.slug ? lesson : l)
        }
      }
      if (!cancelled) setState({ course, error: null, key })
    })().catch(error => { if (!cancelled) setState({ course: null, error: error instanceof Error ? error.message : String(error), key }) })
    return () => { cancelled = true }
  }, [key])
  return state.key === key ? state : { course: null, error: null }
}

/**
 * Búsqueda local sobre el índice del curso. Puntúa el título por encima del
 * cuerpo para que lo específico salga antes que lo que solo menciona el término.
 */
export function normalizeSearch(value: string): string { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() }
export function searchLessons(lessons: Lesson[], query: string, limit = Infinity): Lesson[] {
  const words = normalizeSearch(query.trim()).split(/\s+/).filter(Boolean)
  if (query.trim().length < 2) return []
  return lessons.map(lesson => {
    const title = normalizeSearch(lesson.title)
    const body = normalizeSearch([lesson.title, lesson.folderLabel, lesson.search, ...lesson.tools, ...lesson.tags].join(' '))
    if (!words.every(word => body.includes(word))) return { lesson, score: 0 }
    return { lesson, score: words.reduce((sum, word) => sum + (title.includes(word) ? 10 : 1), 0) }
  }).filter(item => item.score > 0).sort((a,b) => b.score-a.score || a.lesson.title.localeCompare(b.lesson.title)).slice(0,limit).map(item => item.lesson)
}
