import { useCallback, useEffect, useState } from 'react'
import type { LevelId } from './types'

/**
 * Estado del alumno. Vive solo en su navegador: no hay servidor,
 * no hay cuentas y nada sale de la máquina.
 */

const KEY = 'academia.progreso.v1'

export interface LessonProgress {
  /** Niveles marcados como completados. */
  done: LevelId[]
  /** Aciertos del quiz por nivel, sobre el total de preguntas. */
  quiz: Partial<Record<LevelId, { correct: number; total: number }>>
  /** Elementos del checklist marcados, por nivel. */
  checks: Partial<Record<LevelId, number[]>>
  /** Cuaderno: lo que el alumno escribe en cada paso de la práctica. */
  notes: Partial<Record<LevelId, Record<string, string>>>
  updatedAt: string
}

export interface StudentState {
  id?: string
  name: string
  /** Modo profesor: muestra el guion de clase y el acceso a presentar. */
  teacher: boolean
  preferredLevel: LevelId
  lessons: Record<string, LessonProgress>
  lastLesson?: string
  project?: ProjectProfile
  /** Idioma de la interfaz y del contenido: 'es' o 'en'. */
  locale?: 'es' | 'en'
  access?: 'guest' | 'learner' | 'admin'
}

export interface ProjectProfile {
  name: string
  goal: string
  audience: string
  problem: string
  outcome: string
  tools: string
  toolIds?: string[]
  projectType?: string
  promptBrief?: string
  savedPrompts?: SavedPrompt[]
  updatedAt: string
}

export interface SavedPrompt {
  id: string
  family: string
  name: string
  prompt: string
  savedAt: string
  source?: string
}

const EMPTY: StudentState = { name: '', teacher: false, preferredLevel: 'basico', lessons: {} }

function read(): StudentState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as StudentState
    // Las lecciones guardadas antes de existir el cuaderno no traen `notes`.
    const lessons = Object.fromEntries(
      Object.entries(parsed.lessons || {}).map(([slug, value]) => [slug, { ...value, notes: value.notes || {} }]),
    )
    return { ...EMPTY, ...parsed, lessons }
  } catch {
    return EMPTY
  }
}

let state = read()
const listeners = new Set<(next: StudentState) => void>()

function commit(next: StudentState) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* Si el almacenamiento está lleno o bloqueado, el curso sigue funcionando sin guardar. */
  }
  listeners.forEach((listener) => listener(next))
}

function emptyLesson(): LessonProgress {
  return { done: [], quiz: {}, checks: {}, notes: {}, updatedAt: new Date().toISOString() }
}

export const store = {
  get: () => state,

  setName(name: string) {
    commit({ ...state, name })
  },

  setPreferredLevel(preferredLevel: LevelId) {
    commit({ ...state, preferredLevel })
  },

  setLocale(locale: 'es' | 'en') {
    commit({ ...state, locale })
  },

  enter(profile: { id?: string; name: string; preferredLevel?: LevelId; locale?: 'es' | 'en'; teacher?: boolean; access: 'learner' | 'admin'; project?: ProjectProfile }) {
    commit({
      ...state,
      id: profile.id,
      name: profile.name,
      teacher: Boolean(profile.teacher),
      preferredLevel: profile.preferredLevel || state.preferredLevel,
      locale: profile.locale || state.locale,
      access: profile.access,
      project: profile.project || state.project,
    })
  },

  logout() {
    commit({ ...EMPTY, locale: state.locale })
  },

  toggleTeacher() {
    commit({ ...state, teacher: !state.teacher })
  },

  visit(slug: string) {
    if (state.lastLesson === slug) return
    commit({ ...state, lastLesson: slug })
  },

  setProject(project: ProjectProfile) {
    commit({ ...state, project })
  },

  toggleDone(slug: string, level: LevelId) {
    const current = state.lessons[slug] || emptyLesson()
    const done = current.done.includes(level)
      ? current.done.filter((item) => item !== level)
      : [...current.done, level]
    commit({
      ...state,
      lessons: { ...state.lessons, [slug]: { ...current, done, updatedAt: new Date().toISOString() } },
    })
  },

  saveQuiz(slug: string, level: LevelId, correct: number, total: number) {
    const current = state.lessons[slug] || emptyLesson()
    const previous = current.quiz[level]
    // Se conserva siempre el mejor resultado.
    if (previous && previous.correct >= correct) return
    commit({
      ...state,
      lessons: {
        ...state.lessons,
        [slug]: {
          ...current,
          quiz: { ...current.quiz, [level]: { correct, total } },
          updatedAt: new Date().toISOString(),
        },
      },
    })
  },

  toggleCheck(slug: string, level: LevelId, index: number) {
    const current = state.lessons[slug] || emptyLesson()
    const list = current.checks[level] || []
    const next = list.includes(index) ? list.filter((item) => item !== index) : [...list, index]
    commit({
      ...state,
      lessons: {
        ...state.lessons,
        [slug]: { ...current, checks: { ...current.checks, [level]: next }, updatedAt: new Date().toISOString() },
      },
    })
  },

  /** Guarda una nota del cuaderno. `key` es el paso ('0', '1'…) o 'evidencia'. */
  setNote(slug: string, level: LevelId, key: string, text: string) {
    const current = state.lessons[slug] || emptyLesson()
    const forLevel = { ...(current.notes?.[level] || {}), [key]: text }
    commit({
      ...state,
      lessons: {
        ...state.lessons,
        [slug]: { ...current, notes: { ...current.notes, [level]: forLevel }, updatedAt: new Date().toISOString() },
      },
    })
  },

  reset() {
    commit(EMPTY)
  },

  export(): string {
    return JSON.stringify(state, null, 2)
  },
}

export function useStudent(): StudentState {
  const [value, setValue] = useState(state)
  useEffect(() => {
    listeners.add(setValue)
    return () => {
      listeners.delete(setValue)
    }
  }, [])
  return value
}

export function useLessonProgress(slug: string): LessonProgress {
  const student = useStudent()
  return student.lessons[slug] || emptyLesson()
}

/** Porcentaje completado de un conjunto de lecciones, contando los 3 niveles. */
export function useCompletion(slugs: string[]) {
  const student = useStudent()
  return useCallback(() => {
    const total = slugs.length * 3
    if (!total) return { done: 0, total: 0, percent: 0 }
    const done = slugs.reduce((sum, slug) => sum + (student.lessons[slug]?.done.length || 0), 0)
    return { done, total, percent: Math.round((done / total) * 100) }
  }, [slugs, student])()
}
