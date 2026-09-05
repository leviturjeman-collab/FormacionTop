export interface ProjectWorkspace {
  assessment?: { scores: Record<string, number>; blockers: string[]; rationale: string; version: string; reviewer: string; date: string }
  diagnosis: { experience: string; weeklyHours: number; constraints: string }
  milestones: Record<string, { evidence: string; completed: boolean }>
  artifacts: Array<{ id: string; title: string; url: string; notes: string; createdAt: string }>
  reviews: Array<{ id: string; artifactId: string; reviewer: string; feedback: string; createdAt: string; status: 'changes_requested' | 'reviewed' }>
  tests: Array<{ id: string; caseName: string; expected: string; actual: string; passed: boolean; createdAt: string }>
  impact: { baselineMinutes: number; afterMinutes: number; weeklyRuns: number; weeklyCost: number; hourlyValue: number; baselineErrors: number; afterErrors: number; observations: string; reviewDate: string; owner: string; runbook: string }
}

export const emptyWorkspace = (): ProjectWorkspace => ({
  diagnosis: { experience: '', weeklyHours: 0, constraints: '' }, milestones: {}, artifacts: [], reviews: [], tests: [],
  impact: { baselineMinutes: 0, afterMinutes: 0, weeklyRuns: 0, weeklyCost: 0, hourlyValue: 0, baselineErrors: 0, afterErrors: 0, observations: '', reviewDate: '', owner: '', runbook: '' },
})

export function impactSummary(impact: ProjectWorkspace['impact']) {
  const weeklyMinutes = (impact.baselineMinutes - impact.afterMinutes) * impact.weeklyRuns
  return { weeklyMinutes, weeklyNet: weeklyMinutes / 60 * impact.hourlyValue - impact.weeklyCost }
}

/** Stable across task reordering; changed instructions deliberately require a new check. */
export function taskKey(task: { id?: string; title: string; action?: string; expected?: string; expect?: string }) {
  if (task.id) return task.id
  const text = `${task.title}|${task.action || ''}|${task.expected || task.expect || ''}`
  let hash = 2166136261
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return `task-${(hash >>> 0).toString(16)}`
}

export const milestones = [
  ['brief', 'Problema y línea base', 'Persona, frecuencia, proceso manual, alcance y criterio de éxito.'],
  ['build', 'Primera versión', 'Enlace o archivo que otra persona pueda abrir y usar.'],
  ['test', 'Pruebas y reparación', 'Casos normal, inválido, duplicado, fallo de servicio y recuperación, con resultados.'],
  ['pilot', 'Piloto con usuarios', 'Observaciones de uso con datos permitidos; errores y cambios necesarios.'],
  ['handoff', 'Entrega y defensa', 'README, demo, costes, límites, responsable y procedimiento de recuperación.'],
  ['impact', 'Revisión de impacto', 'Comparación antes/después, periodo y muestra; decisión de mantener, mejorar o retirar.'],
] as const

export const rubric = [
  { id: 'impact', weight: 20, es: 'Problema e impacto', en: 'Problem and impact', levels: ['Sin usuario o criterio observable', 'Usuario y objetivo; solo estimación', 'Muestra comparable antes/después, periodo y fuente; incluye revisión y coste'], english: ['No user or observable criterion', 'User and goal; estimate only', 'Comparable before/after sample, period and source; includes review and cost'] },
  { id: 'function', weight: 20, es: 'Funcionamiento', en: 'Functionality', levels: ['No se reproduce el caso normal', 'Demo normal reproducible con ayuda', 'Otra persona completa la tarea con la documentación'], english: ['Normal case cannot be reproduced', 'Normal demo reproduced with help', 'Another person completes the task using the documentation'] },
  { id: 'reliability', weight: 20, es: 'Fiabilidad y reparación', en: 'Reliability and repair', levels: ['No hay pruebas', 'Pruebas normales y un fallo documentado', 'Cinco familias de prueba, reparación y regresión; sin efectos duplicados'], english: ['No tests', 'Normal tests and one documented failure', 'Five test families, repair and regression; no duplicate effects'] },
  { id: 'security', weight: 20, es: 'Datos y permisos', en: 'Data and permissions', levels: ['Secretos expuestos o acceso no autorizado', 'Inventario y límites documentados', 'Bloqueo de acción no permitida comprobado en el servicio'], english: ['Exposed secrets or unauthorized access', 'Documented inventory and limits', 'Forbidden action denied at the service'] },
  { id: 'handoff', weight: 15, es: 'Entrega y operación', en: 'Handoff and operations', levels: ['Sin manual ni responsable', 'README y costes estimados', 'Instalación por otra persona, recuperación probada, dueño y revisión fechada'], english: ['No runbook or owner', 'README and estimated costs', 'Installation by another person, tested recovery, owner and dated review'] },
  { id: 'defense', weight: 5, es: 'Defensa y feedback', en: 'Defense and feedback', levels: ['No explica decisiones ni límites', 'Explica decisiones sin contrastarlas', 'Defiende con evidencia, recibe feedback y registra acciones pendientes'], english: ['Cannot explain decisions and limits', 'Explains decisions without checking them', 'Defends with evidence, receives feedback and records pending actions'] },
] as const

export function assessProject(assessment: NonNullable<ProjectWorkspace['assessment']>) {
  const score = rubric.reduce((sum, item) => sum + item.weight * Math.max(0, Math.min(2, assessment.scores[item.id] || 0)) / 2, 0)
  const recorded = rubric.every(item => Object.hasOwn(assessment.scores, item.id)) && Boolean(assessment.version.trim() && assessment.rationale.trim() && assessment.reviewer.trim() && assessment.date)
  return { score, status: !recorded ? 'incomplete' : assessment.blockers.length ? 'blocked' : score >= 80 ? 'candidate' : score >= 60 ? 'pilot' : 'revise' } as const
}
