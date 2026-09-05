import { createContext, useContext, useEffect, useMemo, useState } from 'react'
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

export function useCourseLoader(locale: 'es' | 'en' = 'es'): LoadState {
  const [state, setState] = useState<LoadState>({ course: null, error: null })

  useEffect(() => {
    let cancelled = false
    const file = locale === 'en' ? 'course.en.json' : 'course.json'
    // no-cache: el curso se regenera desde el vault con frecuencia y el
    // nombre del archivo no cambia, así que se revalida siempre.
    fetch(`${import.meta.env.BASE_URL}${file}`, { cache: 'no-cache' })
      .then((response) => {
        if (!response.ok) throw new Error(locale === 'en' ? `The server responded ${response.status}` : `El servidor respondió ${response.status}`)
        return response.json()
      })
      .then((data: CourseData) => {
        if (!cancelled) setState({ course: data, error: null })
      })
      .catch((error: Error) => {
        // Si falta el curso en inglés (build incompleto), se cae al español
        // en vez de romper la app.
        if (locale === 'en') {
          fetch(`${import.meta.env.BASE_URL}course.json`, { cache: 'no-cache' })
            .then((response) => response.json())
            .then((data: CourseData) => {
              if (!cancelled) setState({ course: data, error: null })
            })
            .catch(() => {
              if (!cancelled) {
                setState({ course: null, error: locale === 'en' ? `The course could not be loaded (${error.message}).` : `No se ha podido cargar el curso (${error.message}).` })
              }
            })
          return
        }
        if (!cancelled) {
          setState({
            course: null,
            error: `No se ha podido cargar el curso (${error.message}). Genera el contenido con «npm run index» y comprueba que existe public/course.json.`,
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [locale])

  return state
}

/**
 * Búsqueda local sobre el índice del curso. Puntúa el título por encima del
 * cuerpo para que lo específico salga antes que lo que solo menciona el término.
 */
export function searchLessons(lessons: Lesson[], query: string, limit = 60): Lesson[] {
  const needle = query.trim().toLowerCase()
  if (needle.length < 2) return []
  const words = needle.split(/\s+/).filter(Boolean)

  return lessons
    .map((lesson) => {
      const title = lesson.title.toLowerCase()
      let score = 0
      for (const word of words) {
        if (title.includes(word)) score += title.startsWith(word) ? 12 : 8
        if (lesson.search.includes(word)) score += 3
        if (lesson.folderLabel.toLowerCase().includes(word)) score += 2
        if (lesson.tools.some((tool) => tool.includes(word))) score += 4
        if (lesson.tags.some((tag) => tag.toLowerCase().includes(word))) score += 2
      }
      return { lesson, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.lesson.title.localeCompare(b.lesson.title, 'es'))
    .slice(0, limit)
    .map((item) => item.lesson)
}
