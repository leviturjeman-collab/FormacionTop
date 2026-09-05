import { useCallback, useEffect, useState } from 'react'
import type { LevelId } from './types'
import { logoutRemoteSession, unlockRemotePin } from './learners-api'
import { saveRemoteProgress } from './progress-api'

/**
 * Estado del alumno. Se guarda en el navegador y, cuando hay sesión válida,
 * también en Supabase mediante endpoints server-side.
 */

const KEY = 'academia.progreso.v1'
export const ADMIN_LEARNERS_KEY = 'academia.admin.alumnos.v1'
export const ADMIN_LEARNERS_BACKUP_KEY = 'academia.admin.alumnos.backup.v1'
export const ADMIN_LEARNERS_EVENT = 'academia:admin-learners-updated'
const ADMIN_PIN_SESSION_KEY = 'academia.admin.pin.session.v1'
const ADMIN_TOKEN_SESSION_KEY = 'academia.admin.token.session.v1'

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
  name: string
  /** Acceso local del alumno a la academia. */
  learnerUnlocked: boolean
  learnerId?: string
  learnerName?: string
  learnerEmail?: string
  learnerSessionToken?: string
  /** Modo profesor: muestra el guion de clase y el acceso a presentar. */
  teacher: boolean
  /** Desbloqueo local del panel privado. No sustituye autenticación de servidor. */
  adminUnlocked: boolean
  preferredLevel: LevelId
  lessons: Record<string, LessonProgress>
  lastLesson?: string
  project?: ProjectProfile
  /** Idioma de la interfaz y del contenido: 'es' o 'en'. */
  locale?: 'es' | 'en'
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

/**
 * El PIN de administrador NO vive aqui. Estaba escrito a mano en este archivo,
 * asi que viajaba en el paquete publico y cualquiera podia leerlo y entrar al
 * panel privado, al modo profesor y a los solucionarios. Ahora lo comprueba
 * `/api/auth/unlock` contra la variable de entorno `ADMIN_PIN`, con limite de
 * intentos y cookie de sesion firmada. El navegador solo se cree que alguien es
 * administrador cuando el servidor lo dice.
 *
 * Los PIN de alumno tienen 6 digitos; el de administrador no sigue ese formato,
 * asi que no hay riesgo de que se genere uno igual por casualidad.
 */
let sessionAdminPin = ''
let sessionAdminToken = ''
const EMPTY: StudentState = {
  name: '',
  learnerUnlocked: false,
  teacher: false,
  adminUnlocked: false,
  preferredLevel: 'basico',
  lessons: {},
}

export type LearnerStatus = 'pendiente' | 'entregado' | 'activo'

export interface StoredLearner {
  id: string
  name: string
  email: string
  pin: string
  level: string
  goal: string
  tools: string
  notes: string
  status: LearnerStatus
  createdAt: string
  updatedAt: string
}

type StoredLearnerDraft = Partial<StoredLearner>

function parseLearnerList(raw: string | null): StoredLearnerDraft[] | null {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item) => item && typeof item === 'object') : null
  } catch {
    return null
  }
}

function storageGet(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function storageSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

function rememberAdminSession(pin: string, token = '') {
  sessionAdminPin = pin
  sessionAdminToken = token
  try {
    sessionStorage.setItem(ADMIN_PIN_SESSION_KEY, pin)
    if (token) sessionStorage.setItem(ADMIN_TOKEN_SESSION_KEY, token)
  } catch {
    /* Si sessionStorage esta bloqueado, se mantiene en memoria durante la pestana actual. */
  }
}

function forgetAdminSession() {
  sessionAdminPin = ''
  sessionAdminToken = ''
  try {
    sessionStorage.removeItem(ADMIN_PIN_SESSION_KEY)
    sessionStorage.removeItem(ADMIN_TOKEN_SESSION_KEY)
  } catch {
    /* Nada que limpiar si el almacenamiento de sesion esta bloqueado. */
  }
}

function readRememberedAdminPin() {
  try {
    return sessionStorage.getItem(ADMIN_PIN_SESSION_KEY) || ''
  } catch {
    return ''
  }
}

export function generateLearnerPin(existing: Pick<StoredLearner, 'pin'>[] = []) {
  const used = new Set(existing.map((item) => item.pin))
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const pin = String(Math.floor(100000 + Math.random() * 900000))
    if (!used.has(pin)) return pin
  }
  return String(Math.floor(100000 + Math.random() * 900000))
}

function normalizeLearner(item: StoredLearnerDraft, usedPins: Set<string>): StoredLearner {
  const createdAt = item.createdAt || new Date().toISOString()
  const rawPin = String(item.pin || '').replace(/\D/g, '').slice(0, 6)
  const pin = /^\d{6}$/.test(rawPin) && !usedPins.has(rawPin)
    ? rawPin
    : generateLearnerPin([...usedPins].map((value) => ({ pin: value })))
  usedPins.add(pin)

  return {
    id: item.id || `${Date.now()}-${item.email || item.name || pin}`,
    name: item.name || '',
    email: item.email || '',
    pin,
    level: item.level || 'basico',
    goal: item.goal || '',
    tools: item.tools || '',
    notes: item.notes || '',
    status: item.status === 'entregado' || item.status === 'activo' ? item.status : 'pendiente',
    createdAt,
    updatedAt: item.updatedAt || createdAt,
  }
}

function normalizeLearners(items: StoredLearnerDraft[]) {
  const usedPins = new Set<string>()
  return items
    .filter((item) => item && typeof item === 'object')
    .map((item) => normalizeLearner(item, usedPins))
}

export function readAdminLearners(): StoredLearner[] {
  const primaryRaw = storageGet(ADMIN_LEARNERS_KEY)
  const backupRaw = storageGet(ADMIN_LEARNERS_BACKUP_KEY)
  const primary = parseLearnerList(primaryRaw)
  const backup = parseLearnerList(backupRaw)
  const source = primary && primary.length ? primary : backup || primary || []
  const learners = normalizeLearners(source)
  const normalizedChanged = JSON.stringify(source) !== JSON.stringify(learners)

  if ((!primaryRaw && backup?.length) || (!primary && backup) || normalizedChanged) writeAdminLearners(learners)
  return learners
}

export function writeAdminLearners(items: StoredLearnerDraft[]): StoredLearner[] {
  const learners = normalizeLearners(items)
  const payload = JSON.stringify(learners)
  storageSet(ADMIN_LEARNERS_KEY, payload)
  storageSet(ADMIN_LEARNERS_BACKUP_KEY, payload)
  try {
    window.dispatchEvent(new CustomEvent(ADMIN_LEARNERS_EVENT, { detail: learners }))
  } catch {
    /* El evento solo sincroniza pestañas de esta misma sesión. */
  }
  return learners
}

function mergeRemoteProgress(progress: Record<string, unknown> | null | undefined): Partial<StudentState> {
  if (!progress || typeof progress !== 'object') return {}
  return progress as Partial<StudentState>
}

function commitLearnerSession(
  learner: Pick<StoredLearner, 'id' | 'name' | 'email'>,
  sessionToken?: string,
  progress?: Record<string, unknown> | null,
) {
  const remoteProgress = mergeRemoteProgress(progress)
  commit({
    ...state,
    ...remoteProgress,
    name: learner.name || state.name,
    learnerUnlocked: true,
    learnerId: learner.id,
    learnerName: learner.name,
    learnerEmail: learner.email,
    learnerSessionToken: sessionToken || state.learnerSessionToken,
    adminUnlocked: false,
    teacher: false,
  })
}

export function getAdminPinForSession() {
  return sessionAdminPin || readRememberedAdminPin()
}

export function getAdminAuthForSession() {
  try {
    const token = sessionAdminToken || sessionStorage.getItem(ADMIN_TOKEN_SESSION_KEY) || ''
    if (token) return { type: 'token' as const, value: token }
  } catch {
    if (sessionAdminToken) return { type: 'token' as const, value: sessionAdminToken }
  }
  const pin = getAdminPinForSession()
  return pin ? { type: 'pin' as const, value: pin } : null
}

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
let progressSyncTimer: ReturnType<typeof window.setTimeout> | null = null

function stateForRemote(next: StudentState): Partial<StudentState> {
  const {
    adminUnlocked,
    teacher,
    learnerSessionToken,
    ...remoteState
  } = next
  return {
    ...remoteState,
    adminUnlocked: false,
    teacher: false,
    learnerSessionToken: undefined,
  }
}

function queueProgressSync(next: StudentState) {
  if (!next.learnerSessionToken || !next.learnerId || next.adminUnlocked) return
  if (progressSyncTimer) window.clearTimeout(progressSyncTimer)
  progressSyncTimer = window.setTimeout(() => {
    saveRemoteProgress(next.learnerSessionToken!, stateForRemote(next)).catch(() => {
      /* El respaldo local ya quedo guardado; Supabase se reintentara en el siguiente cambio. */
    })
  }, 650)
}

function commit(next: StudentState) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* Si el almacenamiento está lleno o bloqueado, el curso sigue funcionando sin guardar. */
  }
  queueProgressSync(next)
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

  toggleTeacher() {
    if (!state.adminUnlocked) return
    commit({ ...state, teacher: !state.teacher })
  },

  /** Solo la llama `unlockLearnerOnline` cuando el servidor responde `admin`. */
  unlockAdmin(pin: string, sessionToken = '') {
    rememberAdminSession(pin.trim(), sessionToken)
    commit({
      ...state,
      learnerUnlocked: true,
      learnerId: undefined,
      learnerSessionToken: undefined,
      adminUnlocked: true,
      teacher: true,
      learnerName: 'Administrador',
      learnerEmail: undefined,
    })
    return true
  },

  lockAdmin() {
    logoutRemoteSession()
    forgetAdminSession()
    commit({ ...state, adminUnlocked: false, teacher: false })
  },

  /**
   * Respaldo sin red, contra los alumnos guardados en este navegador. Nunca
   * concede administrador: eso solo lo otorga el servidor.
   */
  unlockLearner(pin: string) {
    const clean = pin.replace(/\D/g, '').trim()
    const learners = readAdminLearners()
    const learner = learners.find((item) => item.pin === clean)
    if (!learner) return false
    if (learner.status !== 'activo') {
      writeAdminLearners(
        learners.map((item) =>
          item.id === learner.id ? { ...item, status: 'activo', updatedAt: new Date().toISOString() } : item,
        ),
      )
    }
    commitLearnerSession(learner)
    return true
  },

  async unlockLearnerOnline(pin: string) {
    const clean = pin.replace(/\D/g, '').trim()
    try {
      const result = await unlockRemotePin(clean)
      if (result.role === 'admin') return this.unlockAdmin(clean, result.sessionToken)
      if (result.learner) {
        commitLearnerSession(result.learner, result.sessionToken, result.progress)
        return true
      }
    } catch {
      // En desarrollo no hay `/api`: `vite` sirve la carpeta como estatica, asi
      // que la comprobacion real no existe y sin esto no se podria ni entrar.
      // `import.meta.env.DEV` es una constante que Vite sustituye por `false`
      // al compilar, de modo que este bloque desaparece del build publico.
      if (import.meta.env.DEV && clean === (import.meta.env.VITE_DEV_ADMIN_PIN || '5555')) {
        return this.unlockAdmin(clean)
      }
      /* Si Supabase no responde, se prueba el respaldo local del navegador. */
    }
    return this.unlockLearner(clean)
  },

  lockLearner() {
    logoutRemoteSession()
    forgetAdminSession()
    commit({
      ...state,
      learnerUnlocked: false,
      learnerId: undefined,
      learnerName: undefined,
      learnerEmail: undefined,
      learnerSessionToken: undefined,
      adminUnlocked: false,
      teacher: false,
    })
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
