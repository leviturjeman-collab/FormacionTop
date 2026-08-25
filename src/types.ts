export type LevelId = 'basico' | 'intermedio' | 'avanzado'

export interface LevelMeta {
  id: LevelId
  label: string
  promise: string
  audience: string
  icon: string
}

export interface GlossaryItem {
  term: string
  meaning: string
}

export interface TableData {
  header: string[]
  rows: string[][]
}

export type BlockKind =
  | 'idea' | 'porque' | 'analogia' | 'glosario' | 'noes' | 'herramientas'
  | 'requisitos' | 'pasos' | 'detalle' | 'comandos' | 'codigo' | 'tabla'
  | 'comprobar' | 'riesgos' | 'coste' | 'decisiones'
  | 'receta' | 'app' | 'importa' | 'ejemplo' | 'seccion' | 'instalar'
  | 'cuenta' | 'palabras' | 'primeros'

export interface Part {
  type: 'p' | 'sub' | 'ul' | 'ol' | 'code' | 'table'
  text?: string
  items?: string[]
  code?: string
  lang?: string
  header?: string[]
  rows?: string[][]
}

export interface OsVariant {
  os: string
  label: string
  shell: string
  code: string
}

export interface Block {
  kind: BlockKind
  title: string
  text?: string
  items?: (string | GlossaryItem)[]
  code?: string
  lang?: string
  table?: TableData
  /** receta: qué instalar, qué hace cada línea, errores típicos y cómo adaptarlo. */
  install?: string
  lines?: [string, string][]
  errors?: [string, string][]
  adapt?: string
  /** app: la herramienta a la que pertenece la guía. */
  app?: { label: string; icon: string }
  /** importa: lo que sí y lo que no. */
  matters?: string[]
  ignore?: string[]
  /** seccion: el contenido de la lección con su estructura real. */
  parts?: Part[]
  icon?: string
  /** instalar: una variante por sistema operativo. */
  variants?: OsVariant[]
  verify?: string
  fails?: [string, string][]
  warning?: string
  /** cuenta: cómo darse de alta en la herramienta. */
  account?: { url: string; free: string; steps: string[]; warning?: string }
}

export interface PracticeStep {
  title: string
  where: string
  action: string
  expected: string
}

export interface Practice {
  goal: string
  steps: PracticeStep[]
  evidence: string
}

export interface QuizOption {
  text: string
  correct: boolean
  why: string
}

export interface QuizQuestion {
  prompt: string
  options: QuizOption[]
  explain: string
  source?: string
}

export interface Pitfall {
  error: string
  fix: string
}

export interface LessonLevel {
  level: LevelId
  headline: string
  hook: string
  minutes: number
  objectives: string[]
  blocks: Block[]
  practice: Practice
  pitfalls: Pitfall[]
  checklist: string[]
  quiz: QuizQuestion[]
}

export interface FlowNode {
  id: string
  label: string
  role: string
  roleLabel?: string
  hint: string
  type?: string
  order: number
  x: number
  y: number
}

export interface FlowEdge {
  from: string
  to: string
  branch: number
}

export interface FlowPiece {
  kind: 'flow'
  title: string
  caption: string
  download?: string
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export interface TerminalPiece {
  kind: 'terminal'
  title: string
  caption: string
  prompt: string
  steps: { command: string; output: string; note?: string }[]
}

export interface PromptLabPiece {
  kind: 'promptlab'
  title: string
  caption: string
  weak: { label: string; prompt: string; response: string; problems: string[] }
  strong: { label: string; prompt: string; response: string; wins: string[] }
}

export interface ComparePiece {
  kind: 'compare'
  title: string
  caption: string
  header: string[]
  rows: string[][]
}

export interface CostCalcPiece {
  kind: 'costcalc'
  title: string
  caption: string
  priceDate: string
  models: { id: string; label: string; input: number; cachedInput: number; output: number }[]
  note: string
}

export interface ChunkingPiece {
  kind: 'chunking'
  title: string
  caption: string
  text: string
  note: string
}

export interface TimelinePiece {
  kind: 'timeline'
  title: string
  caption: string
  note: string
  steps: { label: string; ms: number; risk: 'bajo' | 'medio' | 'alto' | 'humano'; detail: string; fails?: string }[]
}

export interface CasesPiece {
  kind: 'cases'
  title: string
  caption: string
  cases: { id: string; label: string; hint: string; parts: Part[] }[]
}

export interface AnatomyPiece {
  kind: 'anatomy'
  title: string
  caption: string
  lang: string
  code: string
  notes: { line: number; kind: string; text: string }[]
}

export interface PipelinePiece {
  kind: 'pipeline'
  title: string
  caption: string
  stations: { shape: string; label: string; detail: string; order: number }[]
}

export interface FileTreePiece {
  kind: 'filetree'
  title: string
  caption: string
  nodes: { name: string; depth: number; isFile: boolean; path: string }[]
}

export interface ChecklistPiece {
  kind: 'checklist'
  title: string
  caption: string
  items: string[]
}

export interface BarsPiece {
  kind: 'bars'
  title: string
  caption: string
  unit: string
  items: { label: string; display: string; value: number; percent: number }[]
}

export interface FlashcardsPiece {
  kind: 'flashcards'
  title: string
  caption: string
  cards: { term: string; meaning: string }[]
}

export interface ChatPiece {
  kind: 'chat'
  title: string
  caption: string
  turns: { role: string; text: string }[]
}

export type InteractivePiece =
  | FlowPiece | TerminalPiece | PromptLabPiece | ComparePiece
  | CostCalcPiece | ChunkingPiece | TimelinePiece | CasesPiece | AnatomyPiece | PipelinePiece
  | FileTreePiece | ChecklistPiece | BarsPiece | FlashcardsPiece | ChatPiece

export interface Lesson {
  id: string
  slug: string
  title: string
  stageId: string
  categoryId: string
  categoryKey: string
  sectionId: string
  kind: string
  kindLabel: string
  folder: string
  folderLabel: string
  sourcePath: string
  sourceWords: number
  realWords: number
  /** Una ficha es material de consulta corto; una lección se estudia. */
  format: 'leccion' | 'ficha'
  tools: string[]
  tags: string[]
  search: string
  levels: Record<LevelId, LessonLevel>
  interactive: InteractivePiece[]
  related: string[]
  authored: boolean
}

export interface Category {
  id: string
  key: string
  label: string
  parentLabel: string
  stageId: string
  folder: string
  count: number
  minutes: number
  sections: string[]
  tools: string[]
  lessonSlugs: string[]
}

export interface ToolTemplate {
  name: string
  what: string
  how: string
  fill: [string, string][]
  code?: string
}

export interface ToolGuide {
  plain: string
  account: { url: string; free: string; steps: [string, string][]; warning?: string }
  first: string[]
  words: [string, string][]
  matters: string[]
  ignore: string[]
  questions?: QuizQuestion[]
  /** Atajos y botones del día a día. */
  shortcuts?: [string, string][]
  /** El 20% de la herramienta que resuelve el 80% del trabajo. */
  daily?: string[]
  /** Automatizaciones y plantillas listas para importar. */
  templates?: ToolTemplate[]
  /** Errores frecuentes, con el mensaje literal y su arreglo. */
  errors?: [string, string][]
  /** Prompts específicos de esta herramienta. */
  prompts?: { name: string; prompt: string }[]
}

export interface ToolPage {
  id: string
  label: string
  icon: string
  count: number
  /** Las 20 lecciones escritas a mano de esta herramienta, si ya las tiene. */
  itinerary?: { id: string; slot?: number; title: string; minutes: number }[]
  lessonSlugs: string[]
  stageIds: string[]
  guide?: ToolGuide | null
}

export interface GlossaryEntry {
  term: string
  meaning: string
  letter: string
  /** Del glosario escrito a mano: explicación larga, analogía y confusiones. */
  long?: string
  analogy?: string | null
  confusion?: string | null
  seeAlso?: string[]
  lessons: { slug: string; title: string }[]
}

export interface SectionMeta {
  id: string
  label: string
  hint: string
}

export interface Stage {
  id: string
  number: string
  title: string
  tagline: string
  description: string
  milestone: string
  accent: string
  categoryIds: string[]
  lessonSlugs: string[]
  coreSlugs: string[]
  minutes: number
}

export interface Folder {
  id: string
  folder: string
  label: string
  count: number
  lessonSlugs: string[]
}

/** Proyecto final de un área: código completo, paso a paso y clonable. */
export interface AreaProject {
  stageId: string
  title: string
  pitch: string
  outcome: string
  time: string
  requires: string[]
  structure: { path: string; what: string }[]
  steps: { title: string; why: string; lang: string; code: string; expected: string; trouble?: string }[]
  checks: string[]
  extend: string[]
  defend: string[]
}

/** Presentación para impartir, con notas del ponente. */
export interface Deck {
  id: string
  title: string
  subtitle: string
  minutes: number
  slides: { kind: string; title: string; text?: string; items?: string[]; code?: string; notes?: string }[]
}

/** Familia de prompts listos para copiar en ChatGPT, Claude o Gemini. */
export interface PromptFamily {
  id: string
  title: string
  intro: string
  model: string
  prompts: { name: string; when: string; prompt: string; fill: [string, string][]; expect: string; next?: string }[]
  canDo: string[]
  cantDo: string[]
  tips: string[]
}

/** Guía fundamental: teoría corta y después tareas concretas. */
export interface Guide {
  id: string
  title: string
  kicker: string
  intro: string
  minutes: number
  theory: { title: string; text: string; analogy?: string }[]
  tasks: { title: string; where: string; action: string; prompt?: string; expect: string; stuck?: string }[]
  canDo: string[]
  cantDo: string[]
  words: [string, string][]
}

/** Lección del curso curado: escrita a mano, no generada. */
export interface CursoLesson {
  id: string
  number: number
  stageId: string
  /** Herramienta a la que pertenece el itinerario, si la lección va en uno. */
  tool?: string
  /** Hueco 1-20 dentro del itinerario de esa herramienta. */
  slot?: number
  title: string
  promise: string
  minutes: number
  why: string
  theory: { title: string; text: string; analogy?: string; example?: string }[]
  tasks: { title: string; where: string; action: string; prompt?: string; expect: string; stuck?: string }[]
  /** Lo que se rompe de verdad, con el mensaje tal cual sale y su arreglo. */
  errors: { message: string; means: string; fix: string }[]
  matters: string[]
  ignore: string[]
  canDo: string[]
  cantDo: string[]
  words: [string, string][]
  next?: string
}

export interface Course {
  generatedAt: string
  vaultName: string
  levels: LevelMeta[]
  kinds: Record<string, { label: string; hint: string }>
  sections: SectionMeta[]
  stats: {
    lessons: number
    fichas: number
    stages: number
    categories: number
    folders: number
    workflows: number
    authored: number
    terms: number
    sourceWords: number
    quizQuestions: number
    blocks: number
    interactivePieces: number
  }
  stages: Stage[]
  categories: Category[]
  projects: AreaProject[]
  decks: Deck[]
  prompts: PromptFamily[]
  guides: Guide[]
  curso: CursoLesson[]
  toolPages: ToolPage[]
  glossaryIndex: GlossaryEntry[]
  folders: Folder[]
  lessons: Lesson[]
}
