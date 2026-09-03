#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const course = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/course.json'), 'utf8'))

const mainLessons = (course.curso || []).filter((lesson) => !lesson.tool)
const rows = []
const warnings = []

for (const stage of course.stages || []) {
  const main = mainLessons.filter((lesson) => lesson.stageId === stage.id)
  rows.push({
    tipo: 'bloque',
    id: stage.id,
    nombre: stage.title,
    principal: main.length,
    biblioteca: stage.lessonSlugs.length,
  })
  if (!main.length) warnings.push(`Bloque "${stage.title}" no tiene lecciones principales; aparece como biblioteca de apoyo.`)
}

for (const tool of course.toolPages || []) {
  const itinerary = tool.itinerary?.length || 0
  const prompts = tool.guide?.prompts?.length || 0
  const automations = tool.guide?.automations?.length || 0
  rows.push({
    tipo: 'herramienta',
    id: tool.id,
    nombre: tool.label,
    consulta: tool.count || 0,
    itinerario: itinerary,
    prompts,
    automatizaciones: automations,
  })
  if ((tool.count || 0) > 0 && !itinerary) {
    warnings.push(`${tool.label}: tiene ${tool.count} lecciones de consulta, pero no itinerario paso a paso.`)
  }
  if ((tool.id === 'whatsapp' || tool.id === 'telegram') && automations > 0) {
    warnings.push(`${tool.label}: las automatizaciones dependen de cuenta, token, webhook y prueba real.`)
  }
}

console.log('AUDITORIA DE FORMACION')
console.log('======================')
console.log(`Ruta principal: ${mainLessons.length} lecciones`)
console.log(`Biblioteca total: ${course.stats?.lessons || 0} lecciones`)
console.log(`Kits institucionales: ${course.stats?.kits || 0}`)
console.log(`Workflows n8n generados: ${course.stats?.workflows || 0}`)
console.log(`Prompts/familias: ${(course.prompts || []).length}`)

console.log('\nBLOQUES')
console.table(rows.filter((row) => row.tipo === 'bloque').map(({ id, nombre, principal, biblioteca }) => ({ id, nombre, principal, biblioteca })))

console.log('\nHERRAMIENTAS')
console.table(rows.filter((row) => row.tipo === 'herramienta').map(({ id, nombre, consulta, itinerario, prompts, automatizaciones }) => ({ id, nombre, consulta, itinerario, prompts, automatizaciones })))

if (warnings.length) {
  console.log('\nAVISOS')
  for (const warning of warnings) console.log(`- ${warning}`)
}
