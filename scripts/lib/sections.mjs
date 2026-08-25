/**
 * Análisis de las secciones de un documento.
 *
 * Los archivos siguen una plantilla muy consistente: Problema, Usuario, Salida
 * esperada, Herramientas utilizadas, Caso feliz, Caso ambiguo, Caso roto,
 * Diagnóstico y reparación, Riesgos y límites, Defensa de 3 minutos… Aquí se
 * reconoce cada una y se convierte en la pieza que le corresponde.
 *
 * Dos reglas duras:
 *   1. El contenido se muestra ENTERO y con su estructura (listas como listas,
 *      código como código, tablas como tablas). Nada de resumir a tres frases.
 *   2. Nada que hable de la organización interna del material llega al alumno.
 *      Ni la palabra "bóveda", ni nombres de carpetas, ni navegación entre
 *      archivos, ni las secciones de control editorial.
 */

import { plain } from './extract.mjs'

/* ------------------------------------------------------------------ *
 * 1. LO QUE NUNCA LLEGA AL ALUMNO                                     *
 * ------------------------------------------------------------------ */

/** Secciones que hablan del propio material, no del tema. */
const META_SECTIONS = [
  /control editorial/i,
  /prop[oó]sito profesional/i,
  /objetivo operativo/i,
  /entregables premium/i,
  /capa aaaa/i,
  /nivel de calidad/i,
  /revisi[oó]n editorial/i,
  /estado del documento/i,
  /criterio de impecabilidad/i,
  /^metadatos/i,
  /^fuentes?$/i,
  /^referencias/i,
  /^bibliograf/i,
  /^changelog/i,
  /^historial/i,
  /qu[eé] es cada carpeta/i,
  /mapa de la (?:formaci[oó]n|b[oó]veda)/i,
  /estructura de (?:la b[oó]veda|carpetas)/i,
  /c[oó]mo usar est[ae]/i,
  /documento maestro/i,
  /navegaci[oó]n/i,
  /^\s*(?:check|do|break|fix|explain)\s*$/i,
]

/** Documentos que solo sirven para navegar por el material. */
const META_DOCUMENTS = [
  /^inicio$/i,
  /^documento maestro/i,
  /^mapa de la formaci/i,
  /^qu[eé] es cada carpeta/i,
  /^estructura\b/i,
  /^[ií]ndice\b/i,
  /^readme$/i,
  /^changelog/i,
  /^decisiones\b/i,
  // El documento del ciclo CHECK → DO → BREAK → FIX → EXPLAIN queda fuera del
  // curso. Los "Checklist de …" sí se quedan: son material de trabajo.
  /^check\s*[-–—>→\s]+\s*do\b/i,
]

/** Frases que mencionan la organización interna. Se eliminan una a una. */
const META_SENTENCE = /\bb[oó]veda\b|\bvault\b|esta carpeta|este documento|este archivo|carpeta \d|\.md\b|documento maestro|navegaci[oó]n de la|dentro de la academia se organiza|estructura de carpetas|capa final de producto/i

export function isMetaSection(title) {
  return META_SECTIONS.some((pattern) => pattern.test(title))
}

export function isMetaDocument(title, relativePath) {
  if (META_DOCUMENTS.some((pattern) => pattern.test(title.trim()))) return true
  // Los índices de la carpeta de arranque son pura navegación.
  return /^00_EMPIEZA_AQUI\//.test(relativePath) && !/lecciones|ruta/i.test(title)
}

/** Quita las frases que hablan del material en vez del tema. */
export function sanitize(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => !META_SENTENCE.test(sentence))
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/* ------------------------------------------------------------------ *
 * 2. PARSEO ESTRUCTURADO                                              *
 * ------------------------------------------------------------------ */

/**
 * Convierte el markdown de una sección en partes con su forma real.
 * Devuelve: [{ type: 'p' | 'ul' | 'ol' | 'code' | 'table' | 'sub', ... }]
 */
export function parseParts(raw) {
  const parts = []
  const lines = raw.split('\n')
  let buffer = []
  let list = null
  let listType = null

  // Una frase que solo remite a otro sitio ("Igual que en macOS:") o una
  // etiqueta colgando sin su contenido no significan nada sueltas.
  const esFragmento = (text) =>
    text.length < 45
    || /^(?:igual que|lo mismo que|ver |ver[eé]|como en|idem)/i.test(text)
    || (/:$/.test(text) && text.split(/\s+/).length < 6)

  const flushText = () => {
    if (!buffer.length) return
    const text = sanitize(plain(buffer.join(' ')))
    if (text.length > 15 && !esFragmento(text)) parts.push({ type: 'p', text })
    buffer = []
  }
  const flushList = () => {
    if (!list?.length) { list = null; return }
    const items = list.map((item) => sanitize(plain(item))).filter((item) => item.length > 3)
    if (items.length) parts.push({ type: listType, items })
    list = null
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]

    // Bloque de código: se conserva tal cual, sin tocar.
    const fence = line.match(/^\s*```([a-zA-Z0-9_+-]*)/)
    if (fence) {
      flushText(); flushList()
      const code = []
      index += 1
      while (index < lines.length && !/^\s*```/.test(lines[index])) {
        code.push(lines[index])
        index += 1
      }
      const body = code.join('\n').replace(/\s+$/, '')
      if (body.trim().length > 2) parts.push({ type: 'code', lang: fence[1] || 'text', code: body })
      continue
    }

    // Tabla.
    if (/^\s*\|.+\|\s*$/.test(line) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[index + 1] || '')) {
      flushText(); flushList()
      const row = (value) => value.trim().replace(/^\||\|$/g, '').split('|').map((cell) => plain(cell))
      const header = row(line)
      const rows = []
      index += 2
      while (index < lines.length && /^\s*\|.+\|\s*$/.test(lines[index])) {
        rows.push(row(lines[index]))
        index += 1
      }
      index -= 1
      if (header.length >= 2 && rows.length) parts.push({ type: 'table', header, rows })
      continue
    }

    // Subtítulo dentro de la sección.
    const sub = line.match(/^\s{0,3}#{3,6}\s+(.+)$/)
    if (sub) {
      flushText(); flushList()
      const title = sanitize(plain(sub[1]))
      if (title) parts.push({ type: 'sub', text: title })
      continue
    }

    // Lista.
    const bullet = line.match(/^\s{0,6}([-*+]|\d{1,2}[.)])\s+(.+)$/)
    if (bullet) {
      flushText()
      const type = /^\d/.test(bullet[1]) ? 'ol' : 'ul'
      if (listType !== type) { flushList(); listType = type }
      list = list || []
      list.push(bullet[2])
      continue
    }

    if (!line.trim()) { flushText(); flushList(); continue }
    flushList()
    buffer.push(line)
  }

  flushText()
  flushList()
  return parts
}

/* ------------------------------------------------------------------ *
 * 3. CLASIFICACIÓN                                                    *
 * ------------------------------------------------------------------ */

/**
 * Cada sección conocida se convierte en la pieza que le corresponde.
 * `weight` ordena la lección: primero el problema, al final la evaluación.
 */
const SCHEMA = [
  { id: 'troubleshoot', match: /problemas? (?:comunes|frecuentes|habituales)|errores? (?:comunes|frecuentes)|soluci[oó]n de problemas/i, label: 'Si algo no funciona', icon: 'comprobar', weight: 70 },
  { id: 'problema',    match: /^problema(?! comun| frecuent| habitual)/i,                                          label: 'El problema que resuelve',      icon: 'idea',      weight: 10 },
  { id: 'usuario',     match: /^usuario|para qui[eé]n|p[uú]blico/i,                  label: 'Para quién es',                 icon: 'idea',      weight: 12 },
  { id: 'objetivo',    match: /^objetivo|prop[oó]sito|para qu[eé] sirve/i,           label: 'Objetivo',                      icon: 'idea',      weight: 14 },
  { id: 'cuando',      match: /^cu[aá]ndo (?:usar|aplicar)|when to/i,                label: 'Cuándo usarlo',                 icon: 'idea',      weight: 16 },
  { id: 'entrada',     match: /^entrada|input|datos de entrada/i,                    label: 'Qué entra',                     icon: 'detalle',   weight: 20 },
  { id: 'salida',      match: /^salida esperada|^salida|output|resultado esperado/i, label: 'Qué produce',                   icon: 'detalle',   weight: 22 },
  { id: 'entregable',  match: /^entregable/i,                                        label: 'Lo que entregas',               icon: 'detalle',   weight: 24 },
  { id: 'requisitos',  match: /^requisitos|prerrequisitos|antes de empezar/i,        label: 'Antes de empezar',              icon: 'requisitos', weight: 26 },
  { id: 'herramientas',match: /^herramientas utilizadas/i,                           label: 'Herramientas que se usan',      icon: 'herramientas', weight: 30 },
  { id: 'descartadas', match: /^herramientas descartadas/i,                          label: 'Herramientas descartadas',      icon: 'herramientas', weight: 31 },
  { id: 'arquitectura',match: /arquitectura|dise[nñ]o del sistema|componentes/i,     label: 'Cómo está montado',             icon: 'detalle',   weight: 34 },
  { id: 'pasos',       match: /paso a paso|implementaci[oó]n|procedimiento|c[oó]mo (?:se )?(?:hace|hacerlo)|instalaci[oó]n|configuraci[oó]n/i, label: 'Implementación paso a paso', icon: 'pasos', weight: 40 },
  { id: 'codigo',      match: /^c[oó]digo|snippet|ejemplo de c[oó]digo/i,            label: 'El código',                     icon: 'codigo',    weight: 42 },
  { id: 'variables',   match: /variables y credenciales|credenciales|variables de entorno/i, label: 'Variables y credenciales', icon: 'requisitos', weight: 44 },
  { id: 'diagnostico', match: /diagn[oó]stico y reparaci[oó]n|troubleshoot|depuraci[oó]n/i, label: 'Diagnóstico y reparación', icon: 'comprobar', weight: 60 },
  { id: 'riesgos',     match: /riesgos y l[ií]mites|riesgos|limitaciones/i,          label: 'Riesgos y límites',             icon: 'riesgos',   weight: 62 },
  { id: 'seguridad',   match: /seguridad|privacidad|rgpd|gdpr/i,                     label: 'Seguridad y privacidad',        icon: 'riesgos',   weight: 64 },
  { id: 'coste',       match: /coste|precio|presupuesto/i,                           label: 'Coste',                         icon: 'coste',     weight: 66 },
  { id: 'evaluacion',  match: /^evaluaci[oó]n|r[uú]brica|criterios de evaluaci/i,    label: 'Cómo se evalúa',                icon: 'comprobar', weight: 80 },
  { id: 'defensa',     match: /defensa de \d+ minutos|defensa oral|c[oó]mo defender/i, label: 'Cómo defenderlo en 3 minutos', icon: 'decisiones', weight: 82 },
  { id: 'siguiente',   match: /siguiente paso|pr[oó]ximos pasos|ampliaci[oó]n/i,     label: 'Siguiente paso',                icon: 'idea',      weight: 90 },
]

/** Los tres casos se tratan aparte: alimentan el simulador. */
const CASE_MATCH = {
  feliz: /^caso feliz|camino feliz|happy path/i,
  ambiguo: /^caso ambiguo|caso l[ií]mite|edge case/i,
  roto: /^caso roto|caso de error|caso fallido/i,
}

export function classify(title) {
  for (const [id, pattern] of Object.entries(CASE_MATCH)) {
    if (pattern.test(title)) return { id: `caso-${id}`, caseKind: id, weight: 50 }
  }
  const hit = SCHEMA.find((item) => item.match.test(title))
  if (hit) return hit
  return { id: 'otro', label: null, icon: 'detalle', weight: 46 }
}

/**
 * Analiza todas las secciones de un documento y devuelve:
 *  - `blocks`: las secciones que enseñan, clasificadas, con su contenido entero
 *  - `cases`: los tres casos, para el simulador
 */
export function analyzeSections(sections) {
  const blocks = []
  const cases = {}

  for (const section of sections) {
    if (section.depth > 3) continue
    if (isMetaSection(section.title)) continue

    const meta = classify(section.title)
    const parts = parseParts(section.raw)
    if (!parts.length) continue
    // Secciones que solo dejan una línea suelta: no aportan y ensucian.
    const util = parts.reduce((sum, part) => sum + (part.text?.length || 0) + (part.items?.join(' ').length || 0) + (part.code?.length || 0), 0)
    if (util < 90) continue

    if (meta.caseKind) {
      cases[meta.caseKind] = { title: section.title, parts }
      continue
    }

    blocks.push({
      // De donde sale: 'vault' es texto de los .md. Sirve para detectar
      // despues el relleno que se repite igual en decenas de lecciones.
      from: 'vault',
      id: meta.id,
      // El título del autor manda; la etiqueta del esquema solo se usa si el
      // suyo no aporta (por ejemplo "Objetivo" a secas).
      title: section.title.length > 4 ? section.title : meta.label || section.title,
      icon: meta.icon || 'detalle',
      weight: meta.weight,
      parts,
    })
  }

  blocks.sort((a, b) => a.weight - b.weight)
  return { blocks, cases }
}
