/**
 * Visuales construidos con el contenido propio de cada lección.
 *
 * El diagrama de nodos se estaba usando en el 79% de las lecciones y todas
 * acababan pareciéndose. Aquí se decide qué forma visual le corresponde a cada
 * lección según lo que de verdad tiene dentro, y se limita el número de piezas
 * para que ninguna se sienta de relleno.
 */

/* ------------------------------------------------------------------ *
 * ANATOMÍA ANOTADA                                                    *
 * ------------------------------------------------------------------ */

/** Qué significa cada tipo de línea, según lo que es. */
const ANNOTATIONS = [
  [/^\s*(?:#|\/\/|--)\s*(.+)$/, 'nota', (m) => `Comentario: ${m[1].slice(0, 90)}`],
  [/^\s*(?:import|from|require|using)\b/, 'import', () => 'Trae una librería externa. Si falla aquí, es que no está instalada.'],
  [/^\s*(?:def|function|const\s+\w+\s*=\s*(?:async\s*)?\(|async def)/, 'def', () => 'Define una función: un trozo de trabajo con nombre que puedes reutilizar.'],
  [/^\s*(?:class)\b/, 'def', () => 'Define una estructura de datos o un objeto con su comportamiento.'],
  [/^\s*(?:if|elif|else|switch|case)\b/, 'decision', () => 'Una bifurcación: a partir de aquí el programa hace una cosa u otra.'],
  [/^\s*(?:for|while|foreach)\b/, 'bucle', () => 'Repite lo de dentro. Vigila que tenga fin: un bucle sin salida es una factura abierta.'],
  [/^\s*(?:try|except|catch|finally)\b/, 'error', () => 'Manejo de errores: qué pasa cuando algo falla en vez de reventar.'],
  [/^\s*(?:return|yield)\b/, 'salida', () => 'Devuelve el resultado a quien llamó.'],
  [/(?:api_key|apikey|token|secret|password|env\[)/i, 'secreto', () => 'Aquí hay un secreto. Nunca escrito a mano: siempre desde una variable de entorno.'],
  [/(?:raise|throw)\b/, 'error', () => 'Corta la ejecución a propósito. Fallar pronto y claro es mejor que seguir con datos malos.'],
  [/(?:print|console\.log|logger|logging)/, 'log', () => 'Deja rastro. Sin registro, mañana no puedes explicar qué pasó.'],
  [/^\s*"[\w-]+"\s*:/, 'campo', (m) => `Campo del objeto: ${m[0].trim().replace(/[":]/g, '')}`],
  [/^\s*[\w-]+\s*:/, 'campo', (m) => `Opción de configuración: ${m[0].trim().replace(':', '')}`],
]

/**
 * Coge un bloque de código real de la lección y lo anota línea a línea.
 * Es la pieza más específica que existe: sale del código que tú escribiste.
 */
export function anatomyFor(signal) {
  const candidates = signal.code
    .filter((block) => block.lines >= 4 && block.lines <= 40 && block.code.length < 1800)
    .sort((a, b) => b.lines - a.lines)

  const block = candidates[0]
  if (!block) return null

  const lines = block.code.split('\n')
  const notes = []

  lines.forEach((line, index) => {
    if (!line.trim()) return
    if (notes.length >= 7) return
    const hit = ANNOTATIONS.find(([pattern]) => pattern.test(line))
    if (!hit) return
    const match = line.match(hit[0])
    notes.push({ line: index + 1, kind: hit[1], text: hit[2](match) })
  })

  if (notes.length < 3) return null

  return {
    kind: 'anatomy',
    title: `Anatomía del código de esta lección`,
    caption: 'El código real, con lo que hace cada parte. Pulsa una anotación para resaltar su línea.',
    lang: block.lang,
    code: block.code,
    notes,
  }
}

/* ------------------------------------------------------------------ *
 * TUBERÍA DE DATOS                                                    *
 * ------------------------------------------------------------------ */

const STAGE_SHAPE = [
  [/^(?:recib|escuch|detect|dispar|cuando|al |entra)/i, 'entrada'],
  [/^(?:valid|comprueb|verific|revis|confirm|filtr)/i, 'filtro'],
  [/^(?:transform|convert|normaliz|extrae|extra|limpia|prepar|format|troce)/i, 'transforma'],
  [/^(?:llama|pide|consulta|genera|clasific|resum|analiz|decide)/i, 'decide'],
  [/^(?:guard|almacen|registr|escrib|inserta|actualiza|indexa)/i, 'guarda'],
  [/^(?:env[ií]|notific|avisa|publica|comparte|entrega)/i, 'envia'],
  [/^(?:aprueb|revisa|autoriza)/i, 'persona'],
  [/^(?:devuelve|responde|muestra|termina)/i, 'salida'],
]

/**
 * Tubería vertical: el dato entra por arriba y va cambiando en cada estación.
 * Es la forma correcta para un procedimiento, y no se parece a un diagrama de
 * nodos.
 */
export function pipelineFor(signal) {
  const source = signal.steps.length >= 3
    ? signal.steps.sort((a, b) => a.order - b.order).map((item) => item.text)
    : signal.bullets.filter((item) => item.length > 30 && item.length < 260)

  const usable = source.slice(0, 7)
  if (usable.length < 3) return null

  const stations = usable.map((text, index) => {
    const clean = text.replace(/^\d+[.)]\s*/, '').trim()
    const hit = STAGE_SHAPE.find(([pattern]) => pattern.test(clean))
    const [head, ...rest] = clean.split(/[.:;]\s+/)
    return {
      shape: hit ? hit[1] : 'paso',
      label: head.length > 60 ? `${head.slice(0, 59)}…` : head,
      detail: rest.join('. ').trim() || clean,
      order: index + 1,
    }
  })

  return {
    kind: 'pipeline',
    title: `Cómo avanza el trabajo en ${signal.title}`,
    caption: 'Cada estación recibe algo, lo cambia y lo pasa a la siguiente. Pulsa una estación para leerla entera.',
    stations,
  }
}

/* ------------------------------------------------------------------ *
 * SELECCIÓN Y VARIEDAD                                                *
 * ------------------------------------------------------------------ */

/**
 * Decide qué piezas lleva una lección.
 *
 * Reglas:
 *  - Como mucho tres. Más de tres es relleno y nadie las usa.
 *  - Primero lo que sale de SU contenido: workflow real, casos, anatomía,
 *    tubería, terminal.
 *  - Las piezas de área (laboratorio de prompts, calculadora, línea de tiempo)
 *    solo entran si queda hueco, y rotando según la lección para que dos
 *    lecciones seguidas de la misma categoría no lleven la misma.
 */
export function selectPieces({ own, shared, slug }) {
  // Semilla estable por lección: la misma lección elige siempre igual, pero
  // dos lecciones distintas no eligen lo mismo.
  let seed = 0
  for (let index = 0; index < slug.length; index += 1) seed = (seed * 31 + slug.charCodeAt(index)) % 9973

  const rotate = (list) =>
    list.length ? [...list.slice(seed % list.length), ...list.slice(0, seed % list.length)] : []

  // Las piezas muy específicas de la lección van primero SIEMPRE: si existen,
  // es que había material de verdad para construirlas.
  const ESPECIFICAS = ['flow', 'cases', 'anatomy', 'terminal', 'bars', 'chat', 'flashcards']
  const pool = own.filter(Boolean)
  const especificas = pool.filter((piece) => ESPECIFICAS.includes(piece.kind))
  const comunes = pool.filter((piece) => !ESPECIFICAS.includes(piece.kind))

  const chosen = [...especificas.slice(0, 2)]

  // Las comunes (tubería, árbol de archivos, checklist, comparativa) encajan en
  // casi todas las lecciones, así que se rotan para no repetir siempre el mismo
  // trío en toda una categoría.
  for (const piece of rotate(comunes)) {
    if (chosen.length >= 3) break
    chosen.push(piece)
  }

  for (const piece of rotate(shared.filter(Boolean))) {
    if (chosen.length >= 3) break
    chosen.push(piece)
  }

  return chosen
}

/* ------------------------------------------------------------------ *
 * MÁS FORMAS VISUALES                                                 *
 * ------------------------------------------------------------------ */

/** Tarjetas para memorizar, con las definiciones reales de la lección. */
export function flashcardsFor(signal) {
  const cards = signal.definitions
    .filter((item) => item.term.length > 2 && item.term.length < 44 && item.meaning.length > 40)
    .slice(0, 10)
    .map((item) => ({ term: item.term, meaning: item.meaning }))

  if (cards.length < 4) return null

  return {
    kind: 'flashcards',
    title: 'Tarjetas de repaso',
    caption: 'Lee el término, intenta explicarlo en voz alta y luego dale la vuelta a la tarjeta. Si no te sale, esa se repite.',
    cards,
  }
}

/** Árbol de archivos, sacado de las rutas que menciona la lección. */
const PATH_RE = /(?:^|\s|`)((?:[\w.-]+\/){1,4}[\w.-]+\.[a-z]{1,5}|[\w-]+\/(?:[\w.-]+\/)*)/g

export function fileTreeFor(signal) {
  const found = new Set()
  for (const match of `${signal.body}`.matchAll(PATH_RE)) {
    const value = match[1].trim()
    if (value.length < 4 || value.length > 70) continue
    if (/^https?:|^www\.|\/\//.test(value)) continue
    if (!/[a-zA-Z]/.test(value)) continue
    found.add(value.replace(/^\.\//, ''))
    if (found.size >= 18) break
  }
  if (found.size < 4) return null

  // Se reconstruye el árbol a partir de las rutas.
  const root = {}
  for (const path of found) {
    let node = root
    for (const part of path.split('/').filter(Boolean)) {
      node[part] = node[part] || {}
      node = node[part]
    }
  }

  const flatten = (node, depth = 0, prefix = '') =>
    Object.entries(node)
      .sort(([a], [b]) => a.localeCompare(b))
      .flatMap(([name, children]) => {
        const isFile = Object.keys(children).length === 0 && /\.[a-z]{1,5}$/i.test(name)
        return [
          { name, depth, isFile, path: `${prefix}${name}` },
          ...flatten(children, depth + 1, `${prefix}${name}/`),
        ]
      })

  const nodes = flatten(root).slice(0, 24)
  if (nodes.length < 4) return null

  return {
    kind: 'filetree',
    title: 'Estructura de archivos del proyecto',
    caption: 'Los archivos y carpetas que aparecen en esta lección, colocados donde van. Es el mapa de lo que vas a crear.',
    nodes,
  }
}

/** Barras comparativas, cuando una tabla trae números. */
export function barsFor(tables) {
  for (const table of tables) {
    const numericColumn = table.header.findIndex((_, index) =>
      index > 0 && table.rows.filter((row) => /\d/.test(row[index] || '')).length >= Math.max(2, table.rows.length - 1),
    )
    if (numericColumn === -1) continue

    const items = table.rows
      .map((row) => {
        const raw = (row[numericColumn] || '').replace(/\./g, '').replace(',', '.')
        const value = Number.parseFloat(raw.match(/-?\d+(?:\.\d+)?/)?.[0] ?? '')
        return { label: row[0], display: row[numericColumn], value }
      })
      .filter((item) => item.label && Number.isFinite(item.value))

    if (items.length < 3) continue
    const max = Math.max(...items.map((item) => Math.abs(item.value))) || 1

    return {
      kind: 'bars',
      title: `Comparativa: ${table.header[numericColumn] || 'valores'}`,
      caption: 'Los mismos datos de la tabla, en proporción. Ordena para ver quién destaca.',
      unit: table.header[numericColumn] || '',
      items: items.map((item) => ({ ...item, percent: Math.round((Math.abs(item.value) / max) * 100) })),
    }
  }
  return null
}

/** Checklist que el alumno va marcando, con los criterios reales de la lección. */
export function checklistFor(signal) {
  const source = signal.checks || ''
  const items = source
    .split('\n')
    .map((line) => line.match(/^\s{0,6}(?:[-*+]|\d{1,2}[.)])\s+(.+)$/))
    .filter(Boolean)
    .map((match) => match[1].replace(/^\[[ x]\]\s*/i, '').replace(/[*_`]/g, '').trim())
    .filter((item) => item.length > 12 && item.length < 220)
    .slice(0, 10)

  if (items.length < 4) return null

  return {
    kind: 'checklist',
    title: 'Comprobación antes de darlo por bueno',
    caption: 'Los criterios de esta lección. Ve marcando: lo que quede sin marcar es lo que te falta.',
    items,
  }
}

/** Conversación de ejemplo, para las lecciones de prompting. */
export function chatFor(signal, stageId) {
  if (!/prompt|instrucci|chatgpt|conversaci|mensaje|asistente/i.test(`${signal.title} ${signal.intro}`) && stageId !== 'prompting') {
    return null
  }
  const purpose = (signal.purpose || signal.intro || '').split(/(?<=[.!?])\s+/)[0]
  if (!purpose || purpose.length < 40) return null

  return {
    kind: 'chat',
    title: 'Cómo se ve la conversación',
    caption: 'La misma petición hecha de dos formas. Cambia entre las pestañas y compara lo que devuelve cada una.',
    turns: [
      { role: 'sistema', text: 'Eres un asistente que responde en español, breve y sin adornos. Si un dato no consta, dilo en lugar de suponerlo.' },
      { role: 'usuario', text: `Necesito ayuda con esto: ${purpose.slice(0, 180)}` },
      { role: 'asistente', text: 'Antes de responder necesito dos cosas: qué formato quieres para la salida y cómo vas a comprobar que la respuesta te sirve. Sin eso, cualquier respuesta parecerá buena y ninguna lo será.' },
      { role: 'usuario', text: 'Devuélvelo en 3 viñetas. Sirve si puedo decidir con ellas sin abrir el documento original.' },
      { role: 'asistente', text: 'Perfecto: ahora el encargo es comprobable. Con formato fijo y criterio de éxito, la respuesta se puede validar de un vistazo y reutilizar la próxima vez.' },
    ],
  }
}
