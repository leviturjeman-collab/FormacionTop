/**
 * Evita que vuelva a aparecer un cuaderno/caja de respuesta para alumnos.
 *
 * La web puede pedir PIN, buscar/filtrar contenido y permitir controles como
 * sliders. Lo que no debe enseñar al alumno es un campo para escribir notas,
 * resultados o evidencias dentro de la propia página.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(projectDir, 'src')

const writableInputAllowlist = new Set([
  path.join(srcDir, 'App.tsx'),
  path.join(srcDir, 'components', 'Compare.tsx'),
  path.join(srcDir, 'pages', 'Admin.tsx'),
  path.join(srcDir, 'pages', 'Buscar.tsx'),
  path.join(srcDir, 'pages', 'Indice.tsx'),
  path.join(srcDir, 'pages', 'Listados.tsx'),
  path.join(srcDir, 'pages', 'Preguntas.tsx'),
  path.join(srcDir, 'pages', 'Prompts.tsx'),
  path.join(srcDir, 'pages', 'Skills.tsx'),
])

const forbiddenText = [
  /qu[eé]\s+te\s+ha\s+salido/i,
  /apunta\s+tu\s+resultado/i,
  /pega\s+aqu[ií]\s+el\s+resultado/i,
  /escribe\s+una\s+frase:\s+qu[eé]\s+has\s+visto/i,
]

async function files(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const out = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === '_portal_antiguo') continue
      out.push(...await files(full))
    } else if (/\.(tsx?|css)$/.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

const problems = []
for (const file of await files(srcDir)) {
  const text = await fs.readFile(file, 'utf8')
  if (/<textarea\b/i.test(text) && !file.endsWith(path.join('pages', 'Admin.tsx'))) {
    problems.push(`${path.relative(projectDir, file)} contiene <textarea> fuera del admin.`)
  }

  const inputMatches = text.match(/<input\b[^>]*>/gi) || []
  const hasWritableInput = inputMatches.some((tag) => !/type=["']range["']/i.test(tag))
  if (hasWritableInput && !writableInputAllowlist.has(file)) {
    problems.push(`${path.relative(projectDir, file)} contiene input escribible fuera de búsqueda/PIN/admin.`)
  }

  for (const pattern of forbiddenText) {
    if (pattern.test(text)) problems.push(`${path.relative(projectDir, file)} contiene texto de resultado prohibido: ${pattern}`)
  }
}

const coursePath = path.join(projectDir, 'public', 'course.json')
try {
  const courseText = await fs.readFile(coursePath, 'utf8')
  for (const pattern of forbiddenText) {
    if (pattern.test(courseText)) problems.push(`public/course.json contiene texto de resultado prohibido: ${pattern}`)
  }
} catch {
  problems.push('No se pudo leer public/course.json para validar textos de alumno.')
}

if (problems.length) {
  console.error('\nCampos/textos de escritura para alumno detectados:')
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log('Validación correcta: el alumno solo escribe PIN o búsquedas/filtros.')
