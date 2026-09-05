/**
 * Auditoría de organización y teoría del curso.
 *
 * `validate-content.mjs` comprueba que cada pieza está bien hecha por dentro.
 * Esto comprueba que encajan entre ellas: que una lección no cite otra que no
 * existe, que el programa esté encadenado, que haya versión en inglés de todo,
 * que el vocabulario de las lecciones esté en el diccionario y que kits y
 * agentes no apunten a herramientas sin página.
 *
 * Sale con código 1 si hay problemas; los avisos no rompen la compilación.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'

const curso = JSON.parse(await fs.readFile('public/course.json', 'utf8'))
// La versión inglesa es la mitad del producto: se audita igual que la española.
const cursoEn = JSON.parse(await fs.readFile('public/course.en.json', 'utf8'))
const programa = curso.curso.filter((l) => !l.tool).sort((a, b) => a.number - b.number)
const porNumero = new Map(programa.map((l) => [l.number, l]))
const problemas = []
const avisos = []

const textoDe = (l) => [
  l.promise, l.why, l.next,
  ...(l.theory || []).flatMap((b) => [b.title, b.text, b.analogy, b.example]),
  ...(l.tasks || []).flatMap((t) => [t.title, t.action, t.expect, t.stuck, t.prompt]),
  ...(l.matters || []), ...(l.ignore || []), ...(l.canDo || []), ...(l.cantDo || []),
].filter(Boolean).join(' ')

// 1. Referencias cruzadas: «la lección 31», «el bloque 08».
for (const l of programa) {
  const texto = textoDe(l)
  for (const m of texto.matchAll(/lecci[oó]n (\d{1,3})/gi)) {
    const n = Number(m[1])
    if (!porNumero.has(n)) problemas.push(`Lección ${l.number}: cita la «lección ${n}», que no existe.`)
    else if (n === l.number) avisos.push(`Lección ${l.number}: se cita a sí misma.`)
  }
  for (const m of texto.matchAll(/bloque (\d{1,2})/gi)) {
    const n = Number(m[1])
    if (n < 1 || n > 10) problemas.push(`Lección ${l.number}: cita el «bloque ${n}», y solo hay 10.`)
  }
}

// 2. Encadenado: cada lección debe llevar a la siguiente por número.
for (let i = 0; i < programa.length - 1; i++) {
  if (!programa[i].next) problemas.push(`Lección ${programa[i].number} no dice qué viene después.`)
}

// 3. Paridad ES/EN en todo el contenido escrito a mano.
for (const carpeta of ['lecciones', 'guias', 'kits', 'agentes', 'toolguides', 'prompts', 'preguntas', 'glosario', 'decks', 'projects', 'recipes']) {
  const dir = path.join('content', carpeta)
  let archivos = []
  try { archivos = await fs.readdir(dir) } catch { continue }
  const es = archivos.filter((f) => f.endsWith('.json') && !f.endsWith('.en.json'))
  const en = new Set(archivos.filter((f) => f.endsWith('.en.json')).map((f) => f.replace('.en.json', '.json')))
  const faltan = es.filter((f) => !en.has(f))
  if (faltan.length) problemas.push(`content/${carpeta}: ${faltan.length} sin versión en inglés → ${faltan.slice(0, 6).join(', ')}${faltan.length > 6 ? '…' : ''}`)
}

// 4. Vocabulario: los términos que define una lección deben estar en el diccionario.
const enDiccionario = new Set(curso.glossaryIndex.map((t) => t.term.split(' (')[0].toLowerCase().trim()))
const sinDefinir = new Set()
for (const l of programa) {
  for (const [palabra] of l.words || []) {
    const clave = palabra.split(' (')[0].toLowerCase().trim()
    if (!enDiccionario.has(clave)) sinDefinir.add(`${palabra} (lección ${l.number})`)
  }
}
if (sinDefinir.size) avisos.push(`${sinDefinir.size} términos del vocabulario de las lecciones no están en el diccionario.`)

// 5. Diccionario huérfano: términos que ninguna lección explica.
const huerfanos = curso.glossaryIndex.filter((t) => !t.lessons.length)
if (huerfanos.length) avisos.push(`${huerfanos.length} de ${curso.glossaryIndex.length} términos del diccionario no los explica ninguna lección.`)

// 6. Duración declarada frente a contenido real.
for (const l of programa) {
  const palabras = textoDe(l).split(/\s+/).length
  const minutosLeyendo = Math.round(palabras / 180)
  if (l.minutes < minutosLeyendo) {
    avisos.push(`Lección ${l.number}: dice ${l.minutes} min y solo leerla ya son ~${minutosLeyendo}.`)
  }
}

// 6b. El mismo producto no puede tener dos precios distintos en el curso.
//     Claude Pro llegó a aparecer como 20, 22 y 23 € en ocho archivos.
const PRODUCTOS = ['Claude Pro', 'Claude Max', 'ChatGPT Plus', 'ChatGPT Pro', 'Google AI Pro', 'Copilot Pro']
const preciosDe = new Map(PRODUCTOS.map((nombre) => [nombre, new Map()]))

const buscarPrecios = (donde, texto) => {
  if (typeof texto !== 'string') return
  for (const nombre of PRODUCTOS) {
    // El precio tiene que estar en la misma cláusula que el producto: sin
    // punto, punto y coma ni dos puntos por medio, y a menos de 45 caracteres.
    // Si no, «Claude Pro; ... planes altos de 115 €» se leería como el precio
    // de Pro cuando es el de Max.
    const re = new RegExp(`${nombre}[^.;:]{0,45}?(\\d+(?:,\\d+)?)\\s*€`, 'g')
    for (const m of texto.matchAll(re)) {
      const lista = preciosDe.get(nombre)
      if (!lista.has(m[1])) lista.set(m[1], donde)
    }
  }
}

for (const l of curso.curso || []) {
  buscarPrecios(`lección ${l.number}`, textoDe(l))
}
for (const g of curso.guides || []) {
  buscarPrecios(`guía «${g.title}»`, [g.intro, ...(g.theory || []).map((b) => b.text)].join(' '))
}
for (const t of curso.toolPages || []) {
  if (t.guide?.plain) buscarPrecios(`herramienta ${t.label}`, t.guide.plain)
}

const preciosEn = new Map(PRODUCTOS.map((nombre) => [nombre, new Map()]))
const buscarPreciosEn = (donde, texto) => {
  if (typeof texto !== 'string') return
  for (const nombre of PRODUCTOS) {
    const re = new RegExp(`${nombre}[^.;:]{0,45}?\\$\\s?(\\d+(?:\\.\\d+)?)`, 'g')
    for (const m of texto.matchAll(re)) {
      const lista = preciosEn.get(nombre)
      if (!lista.has(m[1])) lista.set(m[1], donde)
    }
  }
}
for (const l of cursoEn.curso || []) buscarPreciosEn(`lesson ${l.number}`, textoDe(l))
for (const g of cursoEn.guides || []) {
  buscarPreciosEn(`guide «${g.title}»`, [g.intro, ...(g.theory || []).map((b) => b.text)].join(' '))
}
for (const t of cursoEn.toolPages || []) {
  if (t.guide?.plain) buscarPreciosEn(`tool ${t.label}`, t.guide.plain)
}
for (const [nombre, lista] of preciosEn) {
  if (lista.size > 1) {
    const detalle = [...lista.entries()].map(([precio, donde]) => `$${precio} (${donde})`).join(', ')
    problemas.push(`En inglés, ${nombre} aparece con precios distintos: ${detalle}.`)
  }
}

for (const [nombre, lista] of preciosDe) {
  if (lista.size > 1) {
    const detalle = [...lista.entries()].map(([precio, donde]) => `${precio} € (${donde})`).join(', ')
    problemas.push(`${nombre} aparece con precios distintos: ${detalle}.`)
  }
}

// 6c. Las dos versiones tienen que traer las mismas piezas.
for (const clave of ['curso', 'guides', 'kits', 'agents', 'toolPages', 'prompts']) {
  const a = (curso[clave] || []).length, b = (cursoEn[clave] || []).length
  if (a !== b) problemas.push(`«${clave}»: ${a} en español y ${b} en inglés.`)
}
for (const l of curso.curso || []) {
  const en = (cursoEn.curso || []).find((x) => x.id === l.id)
  if (!en) { problemas.push(`La lección ${l.number} no existe en la versión inglesa.`); continue }
  if (en.title === l.title) avisos.push(`La lección ${l.number} «${l.title}» tiene el mismo título en los dos idiomas.`)
  if ((en.tasks || []).length !== (l.tasks || []).length) {
    problemas.push(`La lección ${l.number} tiene ${(l.tasks || []).length} tareas en español y ${(en.tasks || []).length} en inglés.`)
  }
}

// 7. Kits y agentes deben apuntar a herramientas que existen.
const herramientas = new Set(curso.toolPages.map((t) => t.id))
for (const k of curso.kits) for (const t of k.tools || []) {
  if (!herramientas.has(t)) problemas.push(`El kit «${k.id}» usa la herramienta «${t}», que no tiene página.`)
}
for (const a of curso.agents) for (const t of a.tools || []) {
  if (typeof t === 'string' && !herramientas.has(t)) avisos.push(`El agente «${a.id}» cita la herramienta «${t}», que no tiene página.`)
}

console.log(`\n=== PROBLEMAS (${problemas.length}) ===`)
problemas.forEach((p) => console.log('  ✗', p))
console.log(`\n=== AVISOS (${avisos.length}) ===`)
avisos.slice(0, 25).forEach((a) => console.log('  ·', a))
if (avisos.length > 25) console.log(`  … y ${avisos.length - 25} más`)


if (problemas.length) process.exitCode = 1
