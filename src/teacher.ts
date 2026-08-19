import type { Lesson, LessonLevel, LevelId } from './types'

/**
 * Guion de clase.
 *
 * Convierte una lección en algo que se puede impartir: cuánto dura cada parte,
 * qué decir al entrar en cada bloque, qué preguntar al aula y qué van a
 * equivocarse. Se deriva de la propia lección, así que no hay que mantener dos
 * contenidos en paralelo.
 */

export interface Beat {
  minutes: number
  title: string
  say: string
  ask?: string
}

export interface Script {
  minutes: number
  opener: string
  beats: Beat[]
  mistakes: { error: string; fix: string }[]
  closer: string
}

/** Qué decir al abrir cada tipo de bloque. */
const SAY: Record<string, string> = {
  idea: 'Léelo en voz alta y para. Pregunta si alguien lo diría con otras palabras antes de seguir.',
  porque: 'Aquí es donde se gana o se pierde a la clase. Cuenta un caso tuyo real de treinta segundos antes de leer el texto.',
  analogia: 'La analogía funciona si la dicen ellos. Da la primera frase y deja que la terminen.',
  glosario: 'No lo leas entero: es material de consulta. Señala solo los dos términos que van a usar hoy.',
  noes: 'Este bloque es el que evita las preguntas raras del final. Dedícale tiempo aunque parezca obvio.',
  herramientas: 'Enseña los logos y pregunta cuáles han usado ya. Te dice el nivel real del aula en diez segundos.',
  requisitos: 'Comprueba en voz alta que todos lo tienen ANTES de empezar la práctica. Si no, pierdes media clase.',
  pasos: 'Recórrelos sin ejecutar nada. Primero el mapa, después el terreno.',
  detalle: 'Es la parte densa. Si vas justo de tiempo, esto es lo que se salta y se deja como lectura.',
  comandos: 'Ejecútalos tú en pantalla mientras lo explicas. Que vean el error también, no solo el acierto.',
  codigo: 'No leas el código línea a línea. Señala la parte que importa y explica por qué está ahí.',
  tabla: 'Tapa la última columna y que la rellenen ellos antes de enseñarla.',
  comprobar: 'Repite esto en cada práctica hasta que lo hagan solos.',
  riesgos: 'Cuenta el incidente real detrás de cada uno. Se acuerdan de la anécdota, no de la advertencia.',
  coste: 'Pon una cifra en la pizarra. El coste abstracto no lo interioriza nadie.',
  decisiones: 'Lanza estas preguntas al aula y no respondas tú. El silencio incómodo es parte del ejercicio.',
}

/** Preguntas para abrir cada nivel, antes de entrar en materia. */
const OPENERS: Record<LevelId, string> = {
  basico: '¿Quién ha tenido que hacer esto a mano alguna vez? Que lo cuente en dos frases. Empezamos por ahí, no por la teoría.',
  intermedio: 'Hoy salimos con algo funcionando. Si al final de la clase no tenéis una salida que enseñar, no ha valido.',
  avanzado: 'Hoy no vamos a hacer que funcione: vamos a romperlo. Quien traiga el fallo más interesante, gana.',
}

const CLOSERS: Record<LevelId, string> = {
  basico: 'Cerrad con la frase: "esto lo usaría para ___". Si alguien no puede completarla, no ha calado y hay que repasar.',
  intermedio: 'Que cada uno enseñe su resultado en treinta segundos. Ver el de otro es la mitad del aprendizaje.',
  avanzado: 'Pide que defiendan una decisión en dos minutos y rebátela tú. Eso es exactamente la defensa del proyecto.',
}

export function buildScript(lesson: Lesson, level: LevelId): Script {
  const content: LessonLevel = lesson.levels[level]

  // El tiempo se reparte proporcional al peso de cada bloque, dejando
  // margen para la práctica y el cierre.
  const teachingMinutes = Math.max(10, Math.round(content.minutes * 0.55))
  const perBlock = Math.max(1, Math.round(teachingMinutes / Math.max(1, content.blocks.length)))

  const beats: Beat[] = content.blocks.map((block) => ({
    minutes: perBlock,
    title: block.title,
    say: SAY[block.kind] || 'Explica la idea y comprueba con una pregunta rápida antes de pasar al siguiente punto.',
  }))

  // Las preguntas del quiz sirven como preguntas de aula: ya están escritas
  // con distractores creíbles, que es lo difícil.
  content.quiz.slice(0, 3).forEach((question, index) => {
    const target = beats[Math.min(beats.length - 1, (index + 1) * 2)]
    if (target && !target.ask) target.ask = question.prompt
  })

  beats.push({
    minutes: Math.max(5, Math.round(content.minutes * 0.35)),
    title: `Práctica: ${content.practice.goal}`,
    say: `${content.practice.steps.length} pasos. Ve pasando por las mesas: el atasco típico es el paso ${Math.min(2, content.practice.steps.length)}.`,
    ask: '¿Alguien ha obtenido algo distinto a lo esperado? Enséñalo, que es lo interesante.',
  })

  return {
    minutes: content.minutes,
    opener: OPENERS[level],
    beats,
    mistakes: content.pitfalls,
    closer: CLOSERS[level],
  }
}

/* ------------------------------------------------------------------ *
 * DIAPOSITIVAS                                                        *
 * ------------------------------------------------------------------ */

export interface Slide {
  kind: 'portada' | 'objetivos' | 'bloque' | 'practica' | 'pregunta' | 'cierre'
  title: string
  text?: string
  items?: string[]
  code?: string
  note?: string
}

/** Convierte la lección en diapositivas para proyectar. */
export function buildSlides(lesson: Lesson, level: LevelId): Slide[] {
  const content = lesson.levels[level]
  const slides: Slide[] = []

  slides.push({
    kind: 'portada',
    title: lesson.title,
    text: content.headline,
    note: content.hook,
  })

  slides.push({
    kind: 'objetivos',
    title: 'Al terminar sabrás',
    items: content.objectives,
  })

  for (const block of content.blocks) {
    if (block.kind === 'codigo' && block.code) {
      slides.push({ kind: 'bloque', title: block.title, code: block.code })
      continue
    }
    if (block.kind === 'tabla' && block.table) {
      slides.push({
        kind: 'bloque',
        title: block.title,
        items: block.table.rows.map((row) => row.filter(Boolean).join(' — ')),
      })
      continue
    }
    // En una proyección, un párrafo de 500 caracteres no se lee: se resume.
    const short = (value: string, max: number) =>
      value.length <= max ? value : `${value.slice(0, value.lastIndexOf(' ', max))}…`

    const items = (block.items || [])
      .map((item) => (typeof item === 'string' ? item : `${item.term}: ${item.meaning}`))
      .map((item) => short(item, 150))
      .slice(0, 6)

    slides.push({
      kind: 'bloque',
      title: short(block.title, 90),
      text: block.text ? short(block.text, 320) : undefined,
      items: items.length ? items : undefined,
    })
  }

  slides.push({
    kind: 'practica',
    title: content.practice.goal,
    items: content.practice.steps.map((step) => step.title),
    note: content.practice.evidence,
  })

  for (const question of content.quiz.slice(0, 3)) {
    slides.push({
      kind: 'pregunta',
      title: question.prompt,
      items: question.options.map((option) =>
        option.text.length > 170 ? `${option.text.slice(0, option.text.lastIndexOf(' ', 170))}…` : option.text,
      ),
      note: question.explain,
    })
  }

  slides.push({
    kind: 'cierre',
    title: 'Antes de darlo por hecho',
    items: content.checklist,
  })

  return slides
}
