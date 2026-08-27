import { useMemo, useState } from 'react'
import { ArrowRight, BookMarked, Check, Clipboard, Lightbulb, Save, Sparkles, Workflow, Wrench } from 'lucide-react'
import { useCourse } from '../course'
import { href } from '../router'
import { store, useStudent } from '../store'
import type { Course, Lesson, PromptFamily, ToolAutomation, ToolPage } from '../types'
import { BrandMark } from '../components/Brand'

type InstitutionalKit = {
  id: string
  title: string
  kicker: string
  promise: string
  audience: string
  tools: string[]
  promptFamilies: string[]
  skillKeywords: string[]
  phases: string[]
  deliverables: string[]
}

const KITS: InstitutionalKit[] = [
  {
    id: 'operaciones-ia',
    title: 'Sistema operativo de IA para equipo',
    kicker: 'Operaciones internas',
    promise: 'Convierte formularios, correos, aprobaciones y reportes en un circuito medible con revisión humana.',
    audience: 'equipos de operaciones, soporte, ventas internas o backoffice',
    tools: ['n8n', 'openai', 'slack', 'gmail', 'sheets', 'supabase', 'postgres'],
    promptFamilies: ['definir-idea', 'organizar-proyecto', 'arreglar-errores'],
    skillKeywords: ['approval', 'delivery', 'automation', 'workflow', 'source', 'human'],
    phases: ['Mapa del proceso', 'Validación de entradas', 'Automatización con revisión humana', 'Registro, alertas y mejora'],
    deliverables: ['Mapa operativo', 'Workflow importable', 'Política de aprobación', 'Panel de evidencias'],
  },
  {
    id: 'portal-institucional',
    title: 'Portal web o app institucional',
    kicker: 'Producto digital',
    promise: 'Une idea, UX, base de datos, autenticación, despliegue y documentación en una entrega seria.',
    audience: 'academias, consultoras, departamentos internos o clientes con usuarios reales',
    tools: ['lovable', 'base44', 'v0', 'react', 'supabase', 'github', 'vercel'],
    promptFamilies: ['crear-web', 'definir-idea', 'pedir-cambios'],
    skillKeywords: ['frontend', 'delivery', 'portfolio', 'testing', 'env', 'deploy'],
    phases: ['Brief y alcance', 'Interfaz navegable', 'Datos y permisos', 'Deploy con checklist'],
    deliverables: ['Brief funcional', 'Prototipo navegable', 'README de entrega', 'Checklist de producción'],
  },
  {
    id: 'rag-documental',
    title: 'Sistema documental y RAG',
    kicker: 'Conocimiento propio',
    promise: 'Ordena documentos, prepara consultas verificables y evita que el sistema invente respuestas.',
    audience: 'equipos con documentación, expedientes, manuales, contratos o bases de conocimiento',
    tools: ['notebooklm', 'claude', 'openai', 'langchain', 'supabase', 'postgres'],
    promptFamilies: ['datos-propios', 'arreglar-errores', 'organizar-proyecto'],
    skillKeywords: ['rag', 'source', 'credibility', 'json', 'documents', 'eval'],
    phases: ['Inventario documental', 'Preparación de fuentes', 'Consulta con citas', 'Evaluación contra casos reales'],
    deliverables: ['Catálogo de fuentes', 'Prompt de consulta', 'Casos de evaluación', 'Guía de límites'],
  },
  {
    id: 'contenido-multicanal',
    title: 'Máquina de contenido y presentaciones',
    kicker: 'Comunicación y venta',
    promise: 'Transforma una idea o sesión en textos, deck, vídeo corto, piezas sociales y guion comercial.',
    audience: 'creadores, formadores, agencias, consultores o departamentos de marketing',
    tools: ['chatgpt', 'canva', 'gamma', 'higgsfield', 'runway', 'elevenlabs', 'descript'],
    promptFamilies: ['contenido-negocio', 'trabajo-diario', 'pedir-cambios'],
    skillKeywords: ['video', 'brief', 'delivery', 'portfolio', 'presentation', 'content'],
    phases: ['Idea y ángulo', 'Guion y estructura', 'Producción visual', 'Revisión y distribución'],
    deliverables: ['Calendario editorial', 'Deck', 'Guion de vídeo', 'Pack de publicación'],
  },
  {
    id: 'agentes-codigo',
    title: 'Agentes de código, QA y producción',
    kicker: 'Ingeniería asistida',
    promise: 'Combina Codex, Claude Code, GitHub, testing y despliegue para construir con control.',
    audience: 'programadores, equipos técnicos y perfiles no técnicos que necesitan supervisar entregas',
    tools: ['codex', 'claude-code', 'github', 'cursor', 'python', 'typescript', 'docker', 'vercel'],
    promptFamilies: ['pedir-cambios', 'arreglar-errores', 'organizar-proyecto'],
    skillKeywords: ['review', 'debug', 'testing', 'github', 'docker', 'release', 'security'],
    phases: ['Especificación', 'Implementación asistida', 'Revisión y pruebas', 'Release con rollback'],
    deliverables: ['Issue o plan técnico', 'Diff revisado', 'Pruebas', 'Notas de release'],
  },
  {
    id: 'crm-reporting',
    title: 'CRM, datos y reporting institucional',
    kicker: 'Datos operativos',
    promise: 'Normaliza leads, tickets o facturas y crea reporting con trazabilidad y control de coste.',
    audience: 'ventas, soporte, administración, dirección o equipos con datos dispersos',
    tools: ['airtable', 'sheets', 'n8n', 'openai', 'supabase', 'slack'],
    promptFamilies: ['datos-propios', 'contenido-negocio', 'arreglar-errores'],
    skillKeywords: ['csv', 'report', 'invoice', 'lead', 'cost', 'gdpr', 'progress'],
    phases: ['Modelo de datos', 'Limpieza y validación', 'Automatización del reporte', 'Alertas y auditoría'],
    deliverables: ['Schema de datos', 'Workflow de limpieza', 'Reporte semanal', 'Control de privacidad'],
  },
]

function toolById(course: Course, id: string) {
  return course.toolPages.find((tool) => tool.id === id)
}

function familyById(course: Course, id: string) {
  return course.prompts.find((family) => family.id === id)
}

function relevantSkills(course: Course, kit: InstitutionalKit): Lesson[] {
  const needles = [...kit.skillKeywords, ...kit.tools].map((item) => item.toLowerCase())
  const skillish = course.lessons.filter((lesson) => {
    const haystack = `${lesson.title} ${lesson.folder} ${lesson.sourcePath} ${lesson.tags.join(' ')} ${lesson.search}`.toLowerCase()
    const isSkill = /skill|workflow|automatiz|proceso|auditoria|entregable|plantilla/.test(haystack)
    return isSkill && needles.some((needle) => haystack.includes(needle))
  })
  if (skillish.length) return skillish.slice(0, 12)
  return course.lessons
    .filter((lesson) => /35_AUTOMATIZACIONES|skills|workflow/i.test(`${lesson.sourcePath} ${lesson.folder}`))
    .slice(0, 12)
}

function kitTools(course: Course, kit: InstitutionalKit): ToolPage[] {
  return kit.tools.map((id) => toolById(course, id)).filter(Boolean) as ToolPage[]
}

function kitPromptFamilies(course: Course, kit: InstitutionalKit): PromptFamily[] {
  return kit.promptFamilies.map((id) => familyById(course, id)).filter(Boolean) as PromptFamily[]
}

function kitAutomations(tools: ToolPage[]) {
  return tools.flatMap((tool) => (tool.guide?.automations || []).map((automation) => ({ tool, automation })))
}

function kitToolPrompts(tools: ToolPage[]) {
  return tools.flatMap((tool) => (tool.guide?.prompts || []).map((prompt) => ({ tool, prompt })))
}

function buildInstitutionalPrompt(kit: InstitutionalKit, tools: ToolPage[], families: PromptFamily[], automations: Array<{ tool: ToolPage; automation: ToolAutomation }>, skills: Lesson[]) {
  return `Actúa como arquitecta de sistemas de IA para proyectos institucionales. Quiero diseñar este sistema: ${kit.title}.

Contexto:
- Público o equipo: ${kit.audience}.
- Objetivo: ${kit.promise}
- Herramientas previstas: ${tools.map((tool) => tool.label).join(', ') || '[elige stack adecuado]'}.
- Familias de prompts que debo usar: ${families.map((family) => family.title).join(' · ') || '[sin seleccionar]'}.
- Automatizaciones candidatas: ${automations.slice(0, 8).map(({ automation }) => automation.name).join(' · ') || '[sin seleccionar]'}.
- Skills/procesos de apoyo: ${skills.slice(0, 8).map((skill) => skill.title).join(' · ') || '[sin seleccionar]'}.

Primero hazme las preguntas imprescindibles sobre usuarios, datos, permisos, volumen, coste, herramientas disponibles y riesgos. No inventes nada que no te haya dado.

Después devuélveme:
1. Arquitectura por capas: entrada, validación, LLM, tools, memoria/datos, revisión humana, salida, logs y alertas.
2. Backlog por fases: ${kit.phases.join(' -> ')}.
3. Qué prompts usar en cada fase y qué evidencia debe producir cada uno.
4. Qué automatizaciones construir primero, con caso feliz, caso ambiguo y caso roto.
5. Qué skills/procesos reutilizables debo escribir para que el sistema se mantenga.
6. Riesgos institucionales: privacidad, seguridad, coste, permisos, rollback, dependencia de proveedor y mantenimiento.
7. Entregables finales: ${kit.deliverables.join(', ')}.

No pases a producción sin una checklist de aprobación humana, datos ficticios de prueba, política de secretos y plan de rollback.`
}

export default function Kits() {
  const course = useCourse()
  const student = useStudent()
  const [active, setActive] = useState(KITS[0].id)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const kit = KITS.find((item) => item.id === active) || KITS[0]

  const tools = useMemo(() => kitTools(course, kit), [course, kit])
  const promptFamilies = useMemo(() => kitPromptFamilies(course, kit), [course, kit])
  const automations = useMemo(() => kitAutomations(tools), [tools])
  const toolPrompts = useMemo(() => kitToolPrompts(tools), [tools])
  const skills = useMemo(() => relevantSkills(course, kit), [course, kit])
  const masterPrompt = useMemo(() => buildInstitutionalPrompt(kit, tools, promptFamilies, automations, skills), [kit, tools, promptFamilies, automations, skills])

  function saveMasterPrompt() {
    const previous = student.project
    store.setProject({
      name: previous?.name || kit.title,
      goal: previous?.goal || kit.title,
      audience: previous?.audience || kit.audience,
      problem: previous?.problem || kit.promise,
      outcome: previous?.outcome || kit.deliverables.join(', '),
      tools: previous?.tools || tools.map((tool) => tool.label).join(', '),
      toolIds: previous?.toolIds || tools.map((tool) => tool.id),
      projectType: previous?.projectType || 'institucional',
      promptBrief: previous?.promptBrief || '',
      savedPrompts: [
        ...(previous?.savedPrompts || []),
        {
          id: `kit-${kit.id}-${Date.now()}`,
          family: 'Kit institucional',
          name: `Prompt maestro · ${kit.title}`,
          prompt: masterPrompt,
          savedAt: new Date().toISOString(),
          source: 'Kits institucionales',
        },
      ],
      updatedAt: new Date().toISOString(),
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><Sparkles size={12} /> Proyectos grandes</span>
        <h1>Kits institucionales</h1>
        <p>
          Paquetes que conectan prompts, automatizaciones, skills, herramientas y entregables para construir sistemas
          de tamaño institucional sin perder trazabilidad.
        </p>
      </div>

      <div className="st-kit-layout">
        <aside className="st-kit-index" aria-label="Kits disponibles">
          {KITS.map((item) => (
            <button key={item.id} type="button" className={item.id === kit.id ? 'on' : ''} onClick={() => setActive(item.id)}>
              <span>{item.kicker}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </aside>

        <section className="st-kit-board">
          <header className="st-kit-head">
            <span className="st-kicker">{kit.kicker}</span>
            <h2>{kit.title}</h2>
            <p>{kit.promise}</p>
            <div className="st-kit-actions">
              <button type="button" className="st-btn" onClick={() => { navigator.clipboard?.writeText(masterPrompt); setCopied(true); window.setTimeout(() => setCopied(false), 1600) }}>
                <Clipboard size={12} /> {copied ? 'Copiado' : 'Copiar prompt maestro'}
              </button>
              <button type="button" className="st-btn-ghost" onClick={saveMasterPrompt}>
                {saved ? <Check size={12} /> : <Save size={12} />} {saved ? 'Guardado' : 'Guardar en mi proyecto'}
              </button>
            </div>
          </header>

          <div className="st-kit-metrics">
            <div><span>Prompts globales</span><strong>{promptFamilies.reduce((sum, family) => sum + family.prompts.length, 0)}</strong></div>
            <div><span>Prompts herramienta</span><strong>{toolPrompts.length}</strong></div>
            <div><span>Automatizaciones</span><strong>{automations.length}</strong></div>
            <div><span>Skills/procesos</span><strong>{skills.length}</strong></div>
          </div>

          <section className="st-kit-stack">
            <div className="st-section-head">
              <div><span className="st-kicker">Stack combinado</span><h2>Herramientas que se complementan</h2></div>
              <span>{tools.length} piezas</span>
            </div>
            <div className="st-kit-tools">
              {tools.map((tool) => (
                <a key={tool.id} href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}>
                  <BrandMark icon={tool.icon} size={20} />
                  <strong>{tool.label}</strong>
                  <small>{tool.guide?.prompts?.length || 0} prompts · {tool.guide?.automations?.length || 0} flujos</small>
                </a>
              ))}
            </div>
          </section>

          <section className="st-kit-phases">
            {kit.phases.map((phase, index) => (
              <div key={phase}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{phase}</strong>
                <small>{kit.deliverables[index] || 'Evidencia revisable'}</small>
              </div>
            ))}
          </section>

          <div className="st-kit-columns">
            <section>
              <div className="st-section-head"><div><span className="st-kicker">Prompts</span><h2>Biblioteca recomendada</h2></div></div>
              <div className="st-kit-resource-list">
                {promptFamilies.map((family) => (
                  <a key={family.id} href={href({ name: 'prompts', familyId: family.id })}>
                    <Sparkles size={14} />
                    <span><strong>{family.title}</strong><small>{family.prompts.length} prompts listos</small></span>
                    <ArrowRight size={13} />
                  </a>
                ))}
                {toolPrompts.slice(0, 8).map(({ tool, prompt }) => (
                  <a key={`${tool.id}-${prompt.name}`} href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}>
                    <Wrench size={14} />
                    <span><strong>{prompt.name}</strong><small>{tool.label} · {prompt.when || 'Prompt de herramienta'}</small></span>
                    <ArrowRight size={13} />
                  </a>
                ))}
              </div>
            </section>

            <section>
              <div className="st-section-head"><div><span className="st-kicker">Automatizaciones</span><h2>Flujos candidatos</h2></div></div>
              <div className="st-kit-resource-list">
                {automations.slice(0, 10).map(({ tool, automation }) => (
                  <a key={`${tool.id}-${automation.name}`} href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}>
                    <Workflow size={14} />
                    <span><strong>{automation.name}</strong><small>{tool.label} · {automation.difficulty} · {automation.trigger}</small></span>
                    <ArrowRight size={13} />
                  </a>
                ))}
              </div>
            </section>
          </div>

          <section className="st-kit-skills">
            <div className="st-section-head">
              <div><span className="st-kicker">Skills y procesos</span><h2>Procedimientos que sostienen el sistema</h2></div>
              <span>{skills.length} sugeridos</span>
            </div>
            <div className="st-kit-skill-grid">
              {skills.map((lesson) => (
                <a key={lesson.slug} href={href({ name: 'leccion', slug: lesson.slug, level: 'intermedio' })}>
                  <BookMarked size={14} />
                  <strong>{lesson.title}</strong>
                  <small>{lesson.folderLabel}</small>
                </a>
              ))}
            </div>
          </section>

          <section className="st-kit-master">
            <Lightbulb size={15} />
            <div>
              <strong>Cómo usar este kit</strong>
              <p>Guarda el prompt maestro en Mi proyecto, responde las preguntas de contexto y después trabaja por fases. Cada prompt, workflow o skill debe producir una evidencia: brief, JSON, diff, log, test, checklist o decisión.</p>
            </div>
          </section>
        </section>
      </div>
    </div>
  )
}
