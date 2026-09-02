#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const course = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/course.json'), 'utf8'))

const PLATFORM_TOOLS = new Set(['n8n', 'zapier', 'make', 'pipedream'])
const MUST_STAY_MANUAL = new Set(['wispr-flow'])
const MIN_PLATFORM_AUTOMATIONS = 25
const MAX_TOOL_AUTOMATIONS = 25
const REQUIRED_FIELDS = ['name', 'goal', 'difficulty', 'platform', 'trigger', 'test', 'failure', 'credentials']
const DIFFICULTIES = new Set(['basica', 'intermedia', 'avanzada', 'profesional'])
const problems = []
const rows = []

function problem(tool, message) {
  problems.push(`${tool.id} (${tool.label}): ${message}`)
}

for (const tool of course.toolPages || []) {
  const guide = tool.guide
  if (!guide) continue
  const automations = Array.isArray(guide.automations) ? guide.automations : []
  const prompts = Array.isArray(guide.prompts) ? guide.prompts : []
  rows.push({ id: tool.id, label: tool.label, prompts: prompts.length, automations: automations.length })

  if (PLATFORM_TOOLS.has(tool.id) && automations.length < MIN_PLATFORM_AUTOMATIONS) {
    problem(tool, `tiene ${automations.length} automatizaciones; mínimo esperado ${MIN_PLATFORM_AUTOMATIONS}`)
  }

  if (automations.length > MAX_TOOL_AUTOMATIONS) {
    problem(tool, `tiene ${automations.length} automatizaciones; máximo esperado ${MAX_TOOL_AUTOMATIONS}`)
  }

  if (MUST_STAY_MANUAL.has(tool.id) && automations.length !== 0) {
    problem(tool, `debe tener 0 automatizaciones porque no ejecuta workflows, tiene ${automations.length}`)
  }

  if (MUST_STAY_MANUAL.has(tool.id) && prompts.length !== 0) {
    problem(tool, `debe tener 0 prompts porque su uso es dictado y revisión, tiene ${prompts.length}`)
  }

  const names = new Set()
  automations.forEach((automation, index) => {
    const where = `automatización ${index + 1}`
    for (const field of REQUIRED_FIELDS) {
      if (!String(automation[field] || '').trim()) problem(tool, `${where} no tiene "${field}"`)
    }
    if (!DIFFICULTIES.has(automation.difficulty)) problem(tool, `${where} tiene dificultad inválida "${automation.difficulty}"`)
    if (!Array.isArray(automation.steps) || automation.steps.length < 3) {
      problem(tool, `${where} debe tener al menos 3 pasos verificables`)
    }
    if (automation.steps?.some((step) => String(step || '').trim().length < 12)) {
      problem(tool, `${where} tiene pasos demasiado cortos para poder seguirlos`)
    }
    const name = String(automation.name || '').trim().toLowerCase()
    if (names.has(name)) problem(tool, `${where} repite el nombre "${automation.name}"`)
    if (name) names.add(name)
  })
}

console.log('AUTOMATIZACIONES DE HERRAMIENTAS')
console.log('──────────────────────────────────')
for (const row of rows.filter((row) => row.automations || row.prompts || MUST_STAY_MANUAL.has(row.id))) {
  console.log(`${row.label.padEnd(18)} ${String(row.prompts).padStart(2)} prompts · ${String(row.automations).padStart(2)} automatizaciones`)
}

if (problems.length) {
  console.log('\nPROBLEMAS')
  console.log('─────────')
  for (const item of problems) console.log(`  ERROR ${item}`)
  process.exit(1)
}

console.log('\nValidación correcta: cada automatización declarada tiene objetivo, disparador, pasos, prueba, fallo y credenciales; Wispr Flow queda manual.')
