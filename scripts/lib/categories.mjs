/**
 * Capa de categorías.
 *
 * El vault ya tiene una jerarquía real de tres niveles. En vez de aplanar 465
 * lecciones en 10 áreas (que dejaba una con 105 lecciones), aquí se reconstruye:
 *
 *   Área  →  Categoría  →  Lección
 *
 * La categoría sale de las dos primeras partes de la ruta del archivo, que es
 * como tú lo tienes organizado. Además se extrae la "sección" (Resumen,
 * Lecciones, Laboratorios, Evaluación, Fuentes), que en tus carpetas de
 * herramienta se repite y funciona muy bien como filtro transversal.
 */

export function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70) || 'sin-nombre'
}

/** "06_n8n_Automation_AI" → "n8n Automation AI" */
export function readable(name) {
  const clean = name
    .replace(/^\d+[-_ ]*/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!clean) return name
  return clean.charAt(0).toUpperCase() + clean.slice(1)
}

/**
 * Secciones transversales. En tus carpetas de herramienta cada tema se divide
 * siempre igual, así que se puede filtrar por "enséñame solo los laboratorios".
 */
export const SECTIONS = [
  { id: 'resumen', label: 'Resumen', match: /^\d*_?resumen/i, hint: 'Visión general del tema' },
  { id: 'lecciones', label: 'Lecciones', match: /^\d*_?lecciones/i, hint: 'Explicación principal' },
  { id: 'laboratorios', label: 'Laboratorios', match: /^\d*_?laboratorios/i, hint: 'Práctica con las manos' },
  { id: 'evaluacion', label: 'Evaluación', match: /^\d*_?evaluaci/i, hint: 'Comprobar lo aprendido' },
  { id: 'fuentes', label: 'Fuentes', match: /^\d*_?fuentes/i, hint: 'Documentación de referencia' },
  { id: 'solucionarios', label: 'Solucionarios', match: /solucionario/i, hint: 'Respuestas y correcciones' },
  { id: 'plantillas', label: 'Plantillas', match: /plantilla|template/i, hint: 'Material reutilizable' },
  { id: 'casos', label: 'Casos', match: /caso|estudio/i, hint: 'Ejemplos reales' },
  { id: 'workflows', label: 'Workflows', match: /workflow/i, hint: 'Flujos importables' },
  { id: 'skills', label: 'Skills', match: /skill/i, hint: 'Procedimientos instalables' },
  { id: 'general', label: 'General', match: /.^/, hint: 'Material del tema' },
]

export function sectionFor(relativePath) {
  const parts = relativePath.split('/')
  // La sección es la carpeta más profunda que contiene al archivo.
  for (let index = parts.length - 2; index >= 1; index -= 1) {
    const hit = SECTIONS.find((section) => section.id !== 'general' && section.match.test(parts[index]))
    if (hit) return hit.id
  }
  return 'general'
}

/**
 * Clave de categoría: las dos primeras partes de la ruta. Si el archivo cuelga
 * directamente de una carpeta raíz, la categoría es esa carpeta.
 */
export function categoryKeyFor(relativePath) {
  const parts = relativePath.split('/')
  return parts.length >= 3 ? `${parts[0]}/${parts[1]}` : parts[0]
}

/**
 * Construye el catálogo de categorías a partir de las lecciones ya generadas.
 * Cada categoría pertenece al área donde cae la mayoría de sus lecciones, para
 * que el árbol no se cruce consigo mismo.
 */
export function buildCategories(lessons, stages) {
  const groups = new Map()

  for (const lesson of lessons) {
    const key = lesson.categoryKey
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(lesson)
  }

  const categories = []
  for (const [key, items] of groups) {
    const parts = key.split('/')
    const label = readable(parts.at(-1))
    const parentLabel = parts.length > 1 ? readable(parts[0]) : ''

    // Área por mayoría: la categoría vive donde vive la mayor parte de su contenido.
    const votes = new Map()
    for (const item of items) votes.set(item.stageId, (votes.get(item.stageId) || 0) + 1)
    const stageId = [...votes.entries()].sort((a, b) => b[1] - a[1])[0][0]

    const sections = [...new Set(items.map((item) => item.sectionId))]
    const tools = [...new Set(items.flatMap((item) => item.tools))]

    categories.push({
      id: slugify(key),
      key,
      label,
      parentLabel,
      stageId,
      folder: parts[0],
      count: items.length,
      minutes: items.reduce((sum, item) => sum + item.levels.intermedio.minutes, 0),
      sections,
      tools: tools.slice(0, 8),
      lessonSlugs: items.map((item) => item.slug),
    })
  }

  categories.sort((a, b) => a.key.localeCompare(b.key, 'es'))

  // Se marca en cada lección a qué categoría pertenece.
  const byKey = new Map(categories.map((category) => [category.key, category.id]))
  for (const lesson of lessons) lesson.categoryId = byKey.get(lesson.categoryKey)

  // Y cada área lista sus categorías, en orden.
  const stagesWithCategories = stages.map((stage) => ({
    ...stage,
    categoryIds: categories.filter((category) => category.stageId === stage.id).map((category) => category.id),
  }))

  return { categories, stages: stagesWithCategories }
}

/**
 * Índice alfabético de conceptos: término → lecciones donde se define o aparece
 * como término destacado. Es la entrada para el alumno que busca una palabra
 * suelta y no sabe en qué área cae.
 */
export function buildGlossaryIndex(entries) {
  const terms = new Map()

  for (const { slug, title, terms: list } of entries) {
    for (const item of list) {
      const term = item.term.trim()
      if (term.length < 3 || term.length > 44) continue
      if (/^\d+$/.test(term)) continue
      const key = term.toLowerCase()
      if (!terms.has(key)) {
        terms.set(key, { term, meaning: item.meaning || '', lessons: [] })
      }
      const entry = terms.get(key)
      if (!entry.meaning && item.meaning) entry.meaning = item.meaning
      if (entry.lessons.length < 8 && !entry.lessons.some((lesson) => lesson.slug === slug)) {
        entry.lessons.push({ slug, title })
      }
    }
  }

  return [...terms.values()]
    // Un termino entra en el indice si esta definido, o si aparece destacado
    // en dos lecciones o mas: eso descarta el ruido de un solo documento.
    .filter((entry) => entry.meaning || entry.lessons.length >= 2)
    .filter((entry) => !/^[^a-zA-Z0-9]/.test(entry.term))
    .sort((a, b) => a.term.localeCompare(b.term, 'es'))
    .map((entry) => ({
      ...entry,
      // Letra bajo la que se agrupa. Los términos que empiezan por número o
      // símbolo caen todos juntos en "#".
      letter: /^[a-záéíóúñ]/i.test(entry.term.normalize('NFD').replace(/[̀-ͯ]/g, ''))
        ? entry.term.normalize('NFD').replace(/[̀-ͯ]/g, '')[0].toUpperCase()
        : '#',
    }))
}
