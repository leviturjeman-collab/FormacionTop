export interface WalkthroughStep {
  id: string
  phase: string
  title: string
  where: string
  action: string
  command?: string
  expected: string
  evidenceLabel: string
  projectField: string
  downloadPath?: string
}

export interface StudentResource {
  id: string
  title: string
  moduleId: string
  kind: 'Workflow guiado' | 'Procedimiento' | 'Proyecto' | 'Guía' | 'Lección'
  duration: number
  summary: string
  studentOutcome: string
  projectApplication: string
  context: string
  steps: string[]
  deliverable: string
  checks: string[]
  walkthrough: WalkthroughStep[]
  sourcePath: string
  sourceWords: number
}

export interface StudentModule {
  id: string
  number: string
  title: string
  description: string
  milestone: string
  lessonIds: string[]
}

export interface StudentCatalog {
  generatedAt: string
  stats: { resources: number; lessons: number; modules: number }
  modules: StudentModule[]
  resources: StudentResource[]
}

export interface ProjectProfile {
  studentName: string
  projectName: string
  type: 'automation' | 'multi-llm' | 'video' | 'product' | 'service'
  audience: string
  problem: string
  outcome: string
  tools: string
}

export interface WalkthroughProgress {
  completedSteps: string[]
  evidence: Record<string, string>
}

export interface ProjectLogEntry {
  id: string
  resourceId: string
  resourceTitle: string
  stepId: string
  phase: string
  field: string
  evidence: string
  createdAt: string
}
