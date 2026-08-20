export type DocumentType = 'document' | 'workflow' | 'skill'

export interface AcademyDocument {
  id: string
  title: string
  path: string
  folder: string
  category: string
  excerpt: string
  words: number
  minutes: number
  content: string
  type: DocumentType
}

export interface Catalog {
  generatedAt: string
  stats: { documents: number; workflows: number; skills: number; words: number }
  documents: AcademyDocument[]
  workflows: AcademyDocument[]
  skills: AcademyDocument[]
}

export interface DemoLead {
  name: string
  email: string
  company: string
  budget: string
  need: string
  consent: boolean
}

export interface DemoEvent {
  id: string
  time: string
  stage: string
  status: 'done' | 'waiting' | 'blocked'
  detail: string
}

export type AcademyView = 'inicio' | 'ruta' | 'biblioteca' | 'automatizaciones' | 'skills' | 'laboratorio' | 'mentor' | 'demo'

export type LearningGoal = 'automatizacion' | 'multi-llm' | 'video' | 'programacion' | 'negocio'

export interface LearnerProfile {
  name: string
  goal: LearningGoal
  level: 'inicio' | 'intermedio' | 'avanzado'
  weeklyHours: number
}
