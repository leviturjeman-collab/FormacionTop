import { useSyncExternalStore } from 'react'
import type { LevelId } from './types'
import { emptyWorkspace, type ProjectWorkspace } from './project-workspace'

export interface LessonProgress {
  done: LevelId[]
  quiz: Partial<Record<LevelId, { correct: number; total: number; version?: string }>>
  quizAttempts?: Partial<Record<LevelId, Array<{ correct: number; total: number; at: string; version?: string }>>>
  checks: Partial<Record<LevelId, number[]>>
  tasks?: Partial<Record<LevelId, string[]>>
  notes: Partial<Record<LevelId, Record<string, string>>>
  updatedAt: string
}
export interface StudentState {
  id?: string; name: string; teacher: boolean; preferredLevel: LevelId
  lessons: Record<string, LessonProgress>; lastLesson?: string
  project?: ProjectProfile; projects: ProjectProfile[]; activeProjectId?: string
  locale?: 'es' | 'en'; access?: 'guest' | 'learner' | 'admin'
}
export interface ProjectProfile {
  id?: string; name: string; goal: string; audience: string; problem: string; outcome: string; tools: string
  toolIds?: string[]; projectType?: string; promptBrief?: string; savedPrompts?: SavedPrompt[]
  workspace?: ProjectWorkspace; updatedAt: string
}
export interface SavedPrompt { id: string; family: string; name: string; prompt: string; savedAt: string; source?: string }
export type PersistenceState = { status: 'saved' | 'saving' | 'error' | 'offline'; message: string; remote: boolean; conflict?: boolean }
class ProgressConflictError extends Error {}
type Remote = { load: () => Promise<{ state: unknown; version: number }>; save: (state: StudentState, version: number) => Promise<{ ok: boolean; version: number; conflict?: boolean }> }
type Envelope = { schemaVersion: 2; revision: number; state: StudentState; remoteVersion: number; remoteBase?: StudentState; pending?: boolean }
const LEGACY_KEY = 'academia.progreso.v1'
const PREFIX = 'academia.progreso.v2.'
const LEVELS: LevelId[] = ['basico', 'intermedio', 'avanzado']
const fresh = (): StudentState => ({ name: '', teacher: false, preferredLevel: 'basico', lessons: {}, projects: [] })
const stamp = () => new Date().toISOString()
const record = (v: unknown): v is Record<string, unknown> => Boolean(v && typeof v === 'object' && !Array.isArray(v))
const text = (v: unknown, fallback = '') => typeof v === 'string' ? v : fallback
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T

function validateWorkspace(raw: Record<string, unknown>): ProjectWorkspace {
  const result = emptyWorkspace()
  const number = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0
  if (record(raw.diagnosis)) result.diagnosis = { experience: text(raw.diagnosis.experience), weeklyHours: number(raw.diagnosis.weeklyHours), constraints: text(raw.diagnosis.constraints) }
  if (record(raw.milestones)) result.milestones = Object.fromEntries(Object.entries(raw.milestones).filter(([key, v]) => !['__proto__', 'constructor', 'prototype'].includes(key) && record(v)).map(([key, v]) => [key, { evidence: text((v as Record<string, unknown>).evidence), completed: (v as Record<string, unknown>).completed === true }]))
  if (Array.isArray(raw.artifacts)) result.artifacts = raw.artifacts.filter(record).map((v) => ({ id: text(v.id, crypto.randomUUID()), title: text(v.title), url: /^https?:\/\//i.test(text(v.url)) ? text(v.url) : '', notes: text(v.notes), createdAt: text(v.createdAt) }))
  if (Array.isArray(raw.reviews)) result.reviews = raw.reviews.filter(record).map((v) => ({ id: text(v.id, crypto.randomUUID()), artifactId: text(v.artifactId), reviewer: text(v.reviewer), feedback: text(v.feedback), createdAt: text(v.createdAt), status: v.status === 'reviewed' ? 'reviewed' : 'changes_requested' }))
  if (Array.isArray(raw.tests)) result.tests = raw.tests.filter(record).map((v) => ({ id: text(v.id, crypto.randomUUID()), caseName: text(v.caseName), expected: text(v.expected), actual: text(v.actual), passed: v.passed === true, createdAt: text(v.createdAt) }))
  if (record(raw.impact)) {
    for (const key of ['baselineMinutes', 'afterMinutes', 'weeklyRuns', 'weeklyCost', 'hourlyValue', 'baselineErrors', 'afterErrors'] as const) result.impact[key] = number(raw.impact[key])
    for (const key of ['observations', 'reviewDate', 'owner', 'runbook'] as const) result.impact[key] = text(raw.impact[key])
  }
  if (record(raw.assessment)) result.assessment = {
    scores: record(raw.assessment.scores) ? Object.fromEntries(Object.entries(raw.assessment.scores).filter(([, value]) => value === 0 || value === 1 || value === 2)) as Record<string, number> : {},
    blockers: Array.isArray(raw.assessment.blockers) ? raw.assessment.blockers.filter((v): v is string => typeof v === 'string') : [],
    rationale: text(raw.assessment.rationale), version: text(raw.assessment.version), reviewer: text(raw.assessment.reviewer), date: text(raw.assessment.date),
  }
  return result
}

/** Validate at the trust boundary; role and identity are never imported. */
export function validateStudent(raw: unknown): StudentState {
  if (!record(raw)) throw new Error('La copia no contiene un estado válido.')
  if (raw.schemaVersion !== undefined && raw.schemaVersion !== 2) throw new Error('Versión de copia no compatible.')
  const value = raw.schemaVersion === 2 ? raw.state : raw
  if (!record(value) || !record(value.lessons)) throw new Error('La copia no contiene lecciones válidas.')
  const next = fresh()
  next.name = text(value.name); next.locale = value.locale === 'en' ? 'en' : 'es'
  next.preferredLevel = LEVELS.includes(value.preferredLevel as LevelId) ? value.preferredLevel as LevelId : 'basico'
  next.lastLesson = typeof value.lastLesson === 'string' ? value.lastLesson : undefined
  for (const [slug, item] of Object.entries(value.lessons)) {
    if (slug === '__proto__' || slug === 'constructor' || !record(item) || !Array.isArray(item.done)) throw new Error('Hay progreso con formato incompatible.')
    const progress: LessonProgress = { done: [...new Set(item.done.filter((v): v is LevelId => LEVELS.includes(v as LevelId)))], quiz: {}, quizAttempts: {}, checks: {}, tasks: {}, notes: {}, updatedAt: text(item.updatedAt, stamp()) }
    for (const level of LEVELS) {
      const checks = record(item.checks) ? item.checks[level] : undefined
      if (Array.isArray(checks)) progress.checks[level] = [...new Set(checks.filter((v): v is number => Number.isInteger(v) && Number(v) >= 0))]
      const tasks = record(item.tasks) ? item.tasks[level] : undefined
      if (Array.isArray(tasks)) progress.tasks![level] = [...new Set(tasks.filter((v): v is string => typeof v === 'string'))]
      const notes = record(item.notes) ? item.notes[level] : undefined
      if (record(notes)) progress.notes[level] = Object.fromEntries(Object.entries(notes).filter(([, v]) => typeof v === 'string')) as Record<string, string>
      const quiz = record(item.quiz) ? item.quiz[level] : undefined
      if (record(quiz) && Number.isInteger(quiz.correct) && Number.isInteger(quiz.total) && Number(quiz.total) > 0 && Number(quiz.correct) >= 0 && Number(quiz.correct) <= Number(quiz.total)) progress.quiz[level] = { correct: Number(quiz.correct), total: Number(quiz.total), version: text(quiz.version) }
      const attempts = record(item.quizAttempts) ? item.quizAttempts[level] : undefined
      if (Array.isArray(attempts)) progress.quizAttempts![level] = attempts.filter((v) => record(v) && Number.isInteger(v.correct) && Number.isInteger(v.total) && Number(v.total) > 0 && Number(v.correct) >= 0 && Number(v.correct) <= Number(v.total)).slice(-100).map((v) => ({ correct: Number(v.correct), total: Number(v.total), at: text(v.at), version: text(v.version) }))
    }
    next.lessons[slug] = progress
  }
  const candidates = Array.isArray(value.projects) ? value.projects : value.project ? [value.project] : []
  for (const candidate of candidates) {
    if (!record(candidate)) throw new Error('Hay un proyecto incompatible.')
    const p: ProjectProfile = { id: text(candidate.id, crypto.randomUUID()), name: text(candidate.name), goal: text(candidate.goal), audience: text(candidate.audience), problem: text(candidate.problem), outcome: text(candidate.outcome), tools: text(candidate.tools), updatedAt: text(candidate.updatedAt, stamp()) }
    if (Array.isArray(candidate.toolIds)) p.toolIds = candidate.toolIds.filter((v): v is string => typeof v === 'string')
    p.projectType = text(candidate.projectType); p.promptBrief = text(candidate.promptBrief)
    p.savedPrompts = Array.isArray(candidate.savedPrompts) ? candidate.savedPrompts.filter((v) => record(v) && typeof v.prompt === 'string' && typeof v.name === 'string').map((v) => ({ id: text(v.id, crypto.randomUUID()), family: text(v.family), name: text(v.name), prompt: text(v.prompt), savedAt: text(v.savedAt, stamp()), source: text(v.source) })) : []
    if (record(candidate.workspace)) p.workspace = validateWorkspace(candidate.workspace)
    if (!next.projects.some((item) => item.id === p.id)) next.projects.push(p)
  }
  next.activeProjectId = next.projects.some((p) => p.id === value.activeProjectId) ? String(value.activeProjectId) : next.projects[0]?.id
  next.project = next.projects.find((p) => p.id === next.activeProjectId)
  return next
}

/** Three-way merge preserves disjoint edits and refuses overlapping changes. */
export function mergeProgress(base: unknown, local: unknown, remote: unknown, path = ''): unknown {
  if (same(local, base)) return remote
  if (same(remote, base) || same(local, remote)) return local
  if (Array.isArray(local) && Array.isArray(remote) && (Array.isArray(base) || base === undefined)) {
    const before = Array.isArray(base) ? base : []
    if ([...before, ...local, ...remote].every((v) => record(v) && typeof v.id === 'string')) {
      const keyed = (items: unknown[]) => Object.fromEntries(items.map((v) => [(v as { id: string }).id, v]))
      return Object.values(mergeProgress(keyed(before), keyed(local), keyed(remote), path) as Record<string, unknown>)
    }
    if ([...before, ...local, ...remote].every((v) => typeof v === 'string' || typeof v === 'number')) {
      // Checklist sets: preserve independent additions/removals on both devices.
      return [...new Set([...before, ...local, ...remote])].filter((v) => before.includes(v) ? local.includes(v) && remote.includes(v) : local.includes(v) || remote.includes(v))
    }
  }
  if (record(local) && record(remote) && (record(base) || base === undefined)) {
    const out: Record<string, unknown> = {}
    for (const key of new Set([...Object.keys(local), ...Object.keys(remote), ...Object.keys(record(base) ? base : {})])) {
      if (['__proto__', 'constructor', 'prototype'].includes(key)) continue
      // updatedAt is metadata, not learner evidence.
      if (key === 'updatedAt') { out[key] = [text(local[key]), text(remote[key])].sort().at(-1); continue }
      const merged = mergeProgress(record(base) ? base[key] : undefined, local[key], remote[key], `${path}/${key}`)
      if (merged !== undefined) out[key] = merged
    }
    return out
  }
  throw new ProgressConflictError(`Hay cambios simultáneos en ${path || 'el trabajo'}. Exporta tu copia antes de recargar o importar la otra versión.`)
}

let state = fresh()
let identity: Pick<StudentState, 'id' | 'access' | 'name'> | undefined
let persistence: PersistenceState = { status: 'saved', message: 'Guardado local', remote: false }
let localRevision = 0
let remoteVersion = 0
let remoteBase = fresh()
let localBase = fresh()
let remote: Remote | undefined
let dirty = false
let timer: number | undefined
let inFlight: Promise<void> | undefined
let epoch = 0
const volatileRecovery = new Map<string, Envelope>()
const listeners = new Set<() => void>()
const persistenceListeners = new Set<() => void>()
const currentKey = () => PREFIX + (identity?.id || 'guest')
function notify() { listeners.forEach((fn) => fn()) }
function status(next: PersistenceState) { persistence = next; persistenceListeners.forEach((fn) => fn()) }
function clean(s: StudentState): StudentState { const { id: _id, access: _access, teacher: _teacher, project: _project, ...rest } = s; return { ...rest, teacher: false } }
function attach(s: StudentState) { return { ...s, ...identity, teacher: state.teacher && identity?.access === 'admin' } }
function readEnvelope(key: string): Envelope | undefined {
  const raw = localStorage.getItem(key)
  if (!raw) return undefined
  const parsed = JSON.parse(raw)
  return { schemaVersion: 2, revision: Number(parsed.revision) || 0, state: validateStudent(parsed), remoteVersion: Number(parsed.remoteVersion) || 0, remoteBase: parsed.remoteBase ? validateStudent(parsed.remoteBase) : undefined, pending: Boolean(parsed.pending) }
}
function writeLocal() {
  try {
    const latest = readEnvelope(currentKey())
    if (latest && latest.revision > localRevision) state = attach(validateStudent(mergeProgress(clean(localBase), clean(state), latest.state)))
    if (remote) dirty = dirty || !same(clean(state), clean(remoteBase))
    localRevision = Math.max(localRevision, latest?.revision || 0) + 1
    const saved = clean(state)
    localStorage.setItem(currentKey(), JSON.stringify({ schemaVersion: 2, revision: localRevision, state: saved, remoteVersion, remoteBase: clean(remoteBase), pending: dirty } satisfies Envelope))
    localBase = clone(saved)
    return true
  } catch (error) {
    status({ status: 'error', message: error instanceof Error ? `No se ha guardado: ${error.message}` : 'No se puede guardar. Exporta una copia de tu trabajo.', remote: Boolean(remote), conflict: error instanceof ProgressConflictError })
    return false
  }
}
function commit(next: StudentState) {
  state = next; dirty = true
  const saved = writeLocal(); notify()
  if (!saved) return
  status({ status: remote ? 'saving' : 'saved', message: remote ? 'Cambios guardados localmente; sincronizando…' : 'Guardado en este navegador', remote: Boolean(remote) })
  if (remote) { if (timer) window.clearTimeout(timer); timer = window.setTimeout(() => { void flush() }, 700) }
}
async function flush(): Promise<void> {
  if (inFlight) { await inFlight; if (dirty && remote && persistence.status !== 'error' && persistence.status !== 'offline') await flush(); return }
  if (!remote || !dirty) return
  const api = remote; const generation = epoch; const snapshot = clean(clone(state))
  inFlight = (async () => {
    try {
      let result = await api.save(snapshot, remoteVersion)
      if (generation !== epoch) return
      if (result.conflict) {
        const latest = await api.load()
        if (generation !== epoch) return
        const merged = validateStudent(mergeProgress(clean(remoteBase), snapshot, validateStudent(latest.state)))
        result = await api.save(merged, latest.version)
        if (generation !== epoch) return
        if (!result.ok) throw new ProgressConflictError('Otro equipo sigue editando. Exporta tu copia y vuelve a sincronizar.')
        state = attach(validateStudent(mergeProgress(snapshot, clean(state), merged))); remoteBase = merged
      } else {
        if (!result.ok) throw new Error('No se ha confirmado el guardado remoto.')
        remoteBase = snapshot
      }
      remoteVersion = result.version
      dirty = !same(clean(state), clean(remoteBase))
      if (writeLocal()) status({ status: dirty ? 'saving' : 'saved', message: dirty ? 'Quedan cambios por sincronizar' : 'Guardado y sincronizado', remote: true })
      notify()
    } catch (error) {
      status({ status: navigator.onLine === false ? 'offline' : 'error', message: `${error instanceof Error ? error.message : 'No se pudo sincronizar.'} Tu copia local se conserva.`, remote: true, conflict: error instanceof ProgressConflictError })
    }
  })()
  try { await inFlight } finally { inFlight = undefined }
  if (dirty && remote && persistence.status === 'saving') await flush()
}
function emptyLesson(): LessonProgress { return { done: [], quiz: {}, checks: {}, tasks: {}, notes: {}, updatedAt: stamp() } }
function changeLesson(slug: string, transform: (p: LessonProgress) => LessonProgress) { const current = state.lessons[slug] || emptyLesson(); commit({ ...state, lessons: { ...state.lessons, [slug]: { ...transform(current), updatedAt: stamp() } } }) }

export const store = {
  get: () => state,
  setName(name: string) { commit({ ...state, name }) },
  setPreferredLevel(preferredLevel: LevelId) { commit({ ...state, preferredLevel }) },
  setLocale(locale: 'es' | 'en') { commit({ ...state, locale }) },
  enter(profile: { id?: string; name: string; preferredLevel?: LevelId; locale?: 'es' | 'en'; teacher?: boolean; access: 'learner' | 'admin'; project?: ProjectProfile }, server?: unknown, version = 0) {
    // A re-login after expiry must not discard edits that could not reach
    // either disk or server. Keep them partitioned in this tab until durable.
    if (identity?.id && !same(clean(state), clean(localBase)) && !same(clean(state), clean(remoteBase))) volatileRecovery.set(identity.id, { schemaVersion: 2, state: clean(clone(state)), revision: localRevision, remoteVersion, remoteBase: clean(clone(remoteBase)), pending: true })
    epoch++; remote = undefined; dirty = false; localRevision = 0
    identity = { id: profile.id, name: profile.name, access: profile.access }
    let persisted: Envelope | undefined
    try { persisted = readEnvelope(currentKey()) } catch { status({ status: 'error', message: 'La copia local no es válida. Se conserva para recuperación; se cargará la copia remota.', remote: false }) }
    const cached = (profile.id ? volatileRecovery.get(profile.id) : undefined) || persisted
    let incoming = fresh()
    if (record(server) && record(server.lessons)) incoming = validateStudent(server)
    remoteBase = clone(incoming); remoteVersion = version
    state = cached?.pending ? cached.state : incoming
    if (!server && cached) state = cached.state
    if (cached?.pending && cached.remoteBase) {
      try { state = validateStudent(mergeProgress(cached.remoteBase, cached.state, incoming)) }
      catch (error) { status({ status: 'error', message: String(error), remote: true, conflict: error instanceof ProgressConflictError }); remoteBase = cached.remoteBase; remoteVersion = cached.remoteVersion }
      dirty = !same(state, incoming)
    }
    localRevision = persisted?.revision || 0; localBase = clone(persisted?.state || fresh())
    const hasWork = Object.keys(state.lessons).length > 0 || state.projects.length > 0
    state = { ...state, ...identity, name: profile.name, teacher: false, preferredLevel: hasWork ? state.preferredLevel : profile.preferredLevel || 'basico', locale: hasWork ? state.locale : profile.locale || state.locale || 'es' }
    if (!state.projects.length && profile.project) this.setProject(profile.project)
    if (writeLocal() && profile.id) volatileRecovery.delete(profile.id)
    notify()
  },
  connectRemote(api: Remote) { remote = api; dirty = dirty || !same(clean(state), clean(remoteBase)); status({ ...persistence, remote: true }); if (dirty) void flush(); else status({ status: 'saved', message: 'Guardado y sincronizado', remote: true }) },
  disconnectRemote() { epoch++; remote = undefined; if (timer) window.clearTimeout(timer); timer = undefined },
  canSafelyClose(): boolean {
    const safe = same(clean(state), clean(localBase)) || same(clean(state), clean(remoteBase))
    if (!safe) status({ status: 'error', message: 'No se puede salir todavía: hay trabajo solo en memoria. Descarga una copia en Progreso y vuelve a guardar antes de salir.', remote: Boolean(remote) })
    return safe
  },
  logout() { if (!this.canSafelyClose()) return false; this.disconnectRemote(); identity = undefined; state = fresh(); localBase = fresh(); localRevision = 0; dirty = false; notify(); status({ status: 'saved', message: 'Sesión cerrada. Tu trabajo se conserva en tu perfil.', remote: false }); try { localStorage.removeItem('academia.admin.alumnos.v1') } catch { /* No new administrative cache is written. */ } return true },
  toggleTeacher() { if (identity?.access === 'admin') { state = { ...state, teacher: !state.teacher }; notify() } },
  visit(slug: string) { if (state.lastLesson !== slug) commit({ ...state, lastLesson: slug }) },
  createProject(name = 'Nuevo proyecto'): string { const id = crypto.randomUUID(); const project: ProjectProfile = { id, name, goal: '', audience: '', problem: '', outcome: '', tools: '', updatedAt: stamp(), savedPrompts: [] }; commit({ ...state, projects: [...state.projects, project], activeProjectId: id, project }); return id },
  selectProject(id: string) { const project = state.projects.find((p) => p.id === id); if (project) commit({ ...state, activeProjectId: id, project }) },
  updateProject(id: string, patch: Partial<ProjectProfile>) { const project = state.projects.find((p) => p.id === id); if (!project) return; const updated = { ...project, ...patch, id, updatedAt: stamp() }; commit({ ...state, projects: state.projects.map((p) => p.id === id ? updated : p), project: state.activeProjectId === id ? updated : state.project }) },
  setProject(project: ProjectProfile) { const id = project.id || state.activeProjectId || crypto.randomUUID(); const updated = { ...project, id, updatedAt: stamp() }; const exists = state.projects.some((p) => p.id === id); commit({ ...state, projects: exists ? state.projects.map((p) => p.id === id ? updated : p) : [...state.projects, updated], activeProjectId: id, project: updated }) },
  toggleDone(slug: string, level: LevelId) { changeLesson(slug, (p) => ({ ...p, done: p.done.includes(level) ? p.done.filter((v) => v !== level) : [...p.done, level] })) },
  saveQuiz(slug: string, level: LevelId, correct: number, total: number, version = '') {
    if (!Number.isInteger(correct) || !Number.isInteger(total) || total <= 0 || correct < 0 || correct > total) return
    changeLesson(slug, (p) => {
      const previous = p.quiz[level]
      const best = previous?.total === total && (previous.version || '') === version && previous.correct >= correct ? previous : { correct, total, version }
      return { ...p, quiz: { ...p.quiz, [level]: best }, quizAttempts: { ...p.quizAttempts, [level]: [...(p.quizAttempts?.[level] || []), { correct, total, at: stamp(), version }].slice(-100) } }
    })
  },
  toggleCheck(slug: string, level: LevelId, index: number) { changeLesson(slug, (p) => { const list = p.checks[level] || []; return { ...p, checks: { ...p.checks, [level]: list.includes(index) ? list.filter((v) => v !== index) : [...list, index] } } }) },
  toggleTask(slug: string, level: LevelId, id: string) { changeLesson(slug, (p) => { const list = p.tasks?.[level] || []; return { ...p, tasks: { ...p.tasks, [level]: list.includes(id) ? list.filter((v) => v !== id) : [...list, id] } } }) },
  setNote(slug: string, level: LevelId, key: string, value: string) { changeLesson(slug, (p) => ({ ...p, notes: { ...p.notes, [level]: { ...p.notes[level], [key]: value } } })) },
  reset() { commit({ ...fresh(), ...identity, locale: state.locale }) },
  export(): string { return JSON.stringify({ schemaVersion: 2, exportedAt: stamp(), state: clean(state) }, null, 2) },
  import(raw: string, mode: 'merge' | 'replace' = 'merge'): { lessons: number; projects: number } {
    if (raw.length > 5_000_000) throw new Error('La copia supera el límite de 5 MB.')
    const incoming = validateStudent(JSON.parse(raw))
    let next = incoming
    if (mode === 'merge') {
      const projects = [...state.projects]
      for (const p of incoming.projects) { const existing = projects.find((v) => v.id === p.id); if (!existing) projects.push(p); else if (!same(existing, p)) projects.push({ ...p, id: crypto.randomUUID(), name: `${p.name} (copia importada)` }) }
      const lessons = { ...state.lessons }
      for (const [slug, p] of Object.entries(incoming.lessons)) { if (lessons[slug] && !same(lessons[slug], p)) throw new Error(`La lección ${slug} tiene versiones distintas. Exporta tu copia y elige reemplazar si deseas restaurar la importada.`); lessons[slug] = p }
      next = { ...state, projects, lessons }
    }
    next.project = next.projects.find((p) => p.id === next.activeProjectId) || next.projects[0]; next.activeProjectId = next.project?.id
    commit(attach(next)); return { lessons: Object.keys(incoming.lessons).length, projects: incoming.projects.length }
  },
  exportLegacy(): string | null { try { return localStorage.getItem(LEGACY_KEY) } catch { return null } },
  retrySave() { if (writeLocal()) { status({ status: 'saving', message: 'Reintentando guardar', remote: Boolean(remote) }); void flush() } },
  async resolveRemoteConflict(strategy: 'keep-local' | 'use-remote'): Promise<void> {
    if (!remote) throw new Error('No hay conexión con una sesión remota.')
    if (inFlight) await inFlight
    const generation = epoch
    const latest = await remote.load()
    if (generation !== epoch) throw new Error('La sesión ha cambiado.')
    const serverState = validateStudent(latest.state)
    // Keep both versions before an explicit overwrite. If backup is blocked,
    // abort and ask the user to export rather than destroying either version.
    try { localStorage.setItem(`${currentKey()}.recovery.${Date.now()}`, JSON.stringify({ schemaVersion: 2, state: clean(state), serverState, remoteVersion: latest.version })) }
    catch { throw new Error('No se pudo guardar la copia de recuperación. Descarga tus versiones antes de resolver el conflicto.') }
    remoteBase = serverState; remoteVersion = latest.version
    if (strategy === 'use-remote') state = attach(serverState)
    dirty = !same(clean(state), clean(remoteBase))
    if (!writeLocal()) return
    notify(); status({ status: dirty ? 'saving' : 'saved', message: dirty ? 'Guardando la versión elegida…' : 'Versión del servidor recuperada; copia anterior conservada.', remote: true })
    await flush()
  },
  flush,
}

if (typeof window !== 'undefined') {
  try { const guest = readEnvelope(PREFIX + 'guest'); if (guest) { state = guest.state; localRevision = guest.revision; localBase = clone(state) } } catch { /* Preserve the original raw copy for explicit recovery. */ }
  window.addEventListener('storage', (event) => {
    if (event.key !== currentKey()) return
    try {
      const latest = readEnvelope(currentKey()); if (!latest || latest.revision <= localRevision) return
      state = attach(validateStudent(mergeProgress(clean(localBase), clean(state), latest.state))); localBase = clone(latest.state); localRevision = latest.revision; dirty = dirty || latest.pending === true || !same(clean(state), clean(remoteBase)); notify()
      if (remote && dirty) { status({ status: 'saving', message: 'Sincronizando cambios de otra pestaña…', remote: true }); void flush() }
    } catch (error) { status({ status: 'error', message: String(error), remote: Boolean(remote), conflict: error instanceof ProgressConflictError }) }
  })
  window.addEventListener('online', () => { if (dirty) store.retrySave() })
  window.addEventListener('beforeunload', (event) => { if (dirty && persistence.status === 'error') { event.preventDefault(); event.returnValue = '' } })
}
export function useStudent(): StudentState { return useSyncExternalStore((fn) => { listeners.add(fn); return () => listeners.delete(fn) }, () => state) }
export function usePersistence(): PersistenceState { return useSyncExternalStore((fn) => { persistenceListeners.add(fn); return () => persistenceListeners.delete(fn) }, () => persistence) }
export function useLessonProgress(slug: string): LessonProgress { return useStudent().lessons[slug] || emptyLesson() }
export function useCompletion(slugs: string[]) { const student = useStudent(); const total = slugs.length * 3; const done = slugs.reduce((sum, slug) => sum + (student.lessons[slug]?.done.length || 0), 0); return { done, total, percent: total ? Math.round(done / total * 100) : 0 } }
