#!/usr/bin/env node
/**
 * validate-workflows.mjs
 *
 * Auditoria estatica de todos los flujos de n8n del portal.
 * ESM puro, sin dependencias externas. Node >= 18.
 *
 * Uso:
 *   node scripts/validate-workflows.mjs               # dedup por contenido (recomendado)
 *   node scripts/validate-workflows.mjs --all         # una entrada por archivo, sin dedup
 *   node scripts/validate-workflows.mjs --bundle      # incluye public/course.json (46 MB)
 *   node scripts/validate-workflows.mjs --json        # salida JSON para CI
 *   node scripts/validate-workflows.mjs --only=lead   # filtra por subcadena en la ruta
 *
 * Sale con codigo 1 si hay algun ERROR.
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')

const ARGS = process.argv.slice(2)
const OPT = {
  all: ARGS.includes('--all'),
  bundle: ARGS.includes('--bundle'),
  json: ARGS.includes('--json'),
  only: (ARGS.find((a) => a.startsWith('--only=')) || '').slice(7),
  // Rutas sueltas: si se pasan, se auditan SOLO esas (util para probar el
  // propio validador contra ejemplos rotos a proposito).
  targets: ARGS.filter((a) => !a.startsWith('--')),
}

/* ────────────────────────────────────────────────────────────────
   Constantes de dominio n8n
   ──────────────────────────────────────────────────────────────── */

const ALLOWED_TYPE_PREFIXES = ['n8n-nodes-base.', '@n8n/n8n-nodes-langchain.']

// Nombres cortos (lo que va detras del ultimo punto) que son disparadores.
const TRIGGER_SHORT_NAMES = new Set([
  'webhook',
  'formtrigger',
  'executeworkflowtrigger',
  'manualtrigger',
  'scheduletrigger',
  'cron',
  'errortrigger',
  'emailreadimap',
  'chattrigger',
  'start', // nodo Start heredado
])

// Nodos que nunca tienen entrada y no son disparadores: no cuentan como huerfanos.
const NO_INPUT_EXEMPT = new Set(['n8n-nodes-base.stickynote'])

// Nodos que rompen un ciclo porque introducen espera real.
const WAIT_TYPES = new Set(['n8n-nodes-base.wait', 'n8n-nodes-base.interval'])

// Nodos heredados: n8n los sigue cargando pero ya no aparecen en el panel.
const LEGACY_TYPES = new Set([
  'n8n-nodes-base.function',
  'n8n-nodes-base.functionitem',
  'n8n-nodes-base.start',
])

/* ────────────────────────────────────────────────────────────────
   Utilidades
   ──────────────────────────────────────────────────────────────── */

const rel = (p) => {
  const r = path.relative(ROOT, p).split(path.sep).join('/')
  return r.startsWith('..') ? p.split(path.sep).join('/') : r
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function looksLikeFlow(v) {
  return isPlainObject(v) && Array.isArray(v.nodes) && isPlainObject(v.connections)
}

function shortType(type) {
  if (typeof type !== 'string') return ''
  const i = type.lastIndexOf('.')
  return (i === -1 ? type : type.slice(i + 1)).toLowerCase()
}

function isTrigger(type) {
  if (typeof type !== 'string') return false
  if (/Trigger$/.test(type)) return true
  return TRIGGER_SHORT_NAMES.has(shortType(type))
}

function isWaitNode(node) {
  const t = String(node.type || '').toLowerCase()
  if (WAIT_TYPES.has(t)) return true
  // Slack / Gmail "sendAndWait" paran el flujo hasta que responde una persona.
  const op = node.parameters && node.parameters.operation
  if (typeof op === 'string' && /sendandwait/i.test(op)) return true
  return false
}

function walkJsonFiles(dir, out = [], depth = 0) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist') continue
      if (depth < 8) walkJsonFiles(p, out, depth + 1)
    } else if (e.isFile() && e.name.endsWith('.json')) {
      out.push(p)
    }
  }
  return out
}

function readJson(file) {
  const raw = fs.readFileSync(file, 'utf8')
  return JSON.parse(raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw)
}

function fingerprint(flow) {
  // Huella estable del contenido del flujo, para agrupar copias identicas.
  const stable = (v) => {
    if (Array.isArray(v)) return v.map(stable)
    if (isPlainObject(v)) {
      const o = {}
      for (const k of Object.keys(v).sort()) o[k] = stable(v[k])
      return o
    }
    return v
  }
  return crypto.createHash('sha1').update(JSON.stringify(stable(flow))).digest('hex')
}

/* ────────────────────────────────────────────────────────────────
   PASO 1: descubrimiento de flujos
   ──────────────────────────────────────────────────────────────── */

const discovered = [] // { file, pointer, origin, flow }
const parseErrors = [] // { file, message }
const sourceStats = new Map()

function note(origin, kind) {
  const s = sourceStats.get(origin) || { files: 0, flows: 0, textOnly: 0 }
  s[kind] += 1
  sourceStats.set(origin, s)
}

function addFlow(file, pointer, origin, flow) {
  discovered.push({ file, pointer, origin, flow })
  note(origin, 'flows')
}

// -- 1a. Archivos de flujo sueltos (un flujo por archivo) -------------------
function scanFlowDir(dirRel, origin) {
  const dir = path.join(ROOT, dirRel)
  if (!fs.existsSync(dir)) return
  for (const file of walkJsonFiles(dir)) {
    note(origin, 'files')
    let data
    try {
      data = readJson(file)
    } catch (err) {
      parseErrors.push({ file, message: err.message })
      continue
    }
    if (looksLikeFlow(data)) addFlow(file, '$', origin, data)
    else note(origin, 'textOnly')
  }
}

const DEFAULT_SCAN = OPT.targets.length === 0

if (DEFAULT_SCAN) {
  scanFlowDir('public/generated/workflows', 'public/generated/workflows')
  scanFlowDir('public/generated/assets', 'public/generated/assets')
  scanFlowDir('27_ASSETS_EJECUTABLES_Y_DEMOS/workflows', '27_ASSETS_EJECUTABLES_Y_DEMOS/workflows')
  scanFlowDir(
    '34_PRODUCTO_EJECUTABLE_PREMIUM/workflows_n8n_importables',
    '34_PRODUCTO_EJECUTABLE_PREMIUM/workflows_n8n_importables',
  )
  scanFlowDir(
    '35_AUTOMATIZACIONES_SKILLS_BIBLIOTECA/workflows_n8n_40',
    '35_AUTOMATIZACIONES_SKILLS_BIBLIOTECA/workflows_n8n_40',
  )
}

// -- 1b. Flujos incrustados dentro de JSON de contenido ---------------------
function scanEmbedded(dirRel, origin) {
  const dir = path.join(ROOT, dirRel)
  if (!fs.existsSync(dir)) return
  for (const file of walkJsonFiles(dir)) {
    note(origin, 'files')
    let data
    try {
      data = readJson(file)
    } catch (err) {
      parseErrors.push({ file, message: err.message })
      continue
    }
    const found = []
    deepFind(data, '$', found)
    if (found.length === 0) note(origin, 'textOnly')
    for (const { pointer, value } of found) addFlow(file, pointer, origin, value)
  }
}

function deepFind(value, pointer, out, depth = 0) {
  if (depth > 30 || value === null || typeof value !== 'object') return
  if (looksLikeFlow(value)) {
    out.push({ pointer, value })
    return // no bajamos dentro de un flujo ya encontrado
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => deepFind(v, `${pointer}[${i}]`, out, depth + 1))
    return
  }
  for (const k of Object.keys(value)) deepFind(value[k], `${pointer}.${k}`, out, depth + 1)
}

if (DEFAULT_SCAN) {
  scanEmbedded('content/kits', 'content/kits')
  scanEmbedded('content/automatizaciones', 'content/automatizaciones')
  scanEmbedded('content/toolguides', 'content/toolguides')
  scanEmbedded('content/recipes', 'content/recipes')
}

// -- 1b-bis. Rutas explicitas pasadas por linea de comandos ----------------
for (const target of OPT.targets) {
  const abs = path.resolve(process.cwd(), target)
  if (!fs.existsSync(abs)) {
    parseErrors.push({ file: abs, message: 'la ruta indicada no existe' })
    continue
  }
  const files = fs.statSync(abs).isDirectory() ? walkJsonFiles(abs) : [abs]
  for (const file of files) {
    note('rutas indicadas', 'files')
    let data
    try {
      data = readJson(file)
    } catch (err) {
      parseErrors.push({ file, message: err.message })
      continue
    }
    const found = []
    deepFind(data, '$', found)
    if (found.length === 0) note('rutas indicadas', 'textOnly')
    for (const { pointer, value } of found) addFlow(file, pointer, 'rutas indicadas', value)
  }
}

// -- 1c. Barrido de las carpetas numeradas por si queda algo suelto ---------
if (DEFAULT_SCAN) {
  const origin = 'carpetas numeradas (barrido)'
  const already = new Set(discovered.map((d) => d.file))
  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^\d{2}_/.test(entry.name)) continue
    for (const file of walkJsonFiles(path.join(ROOT, entry.name))) {
      if (already.has(file)) continue
      let raw
      try {
        raw = fs.readFileSync(file, 'utf8')
      } catch {
        continue
      }
      if (!raw.includes('"connections"') || !raw.includes('"nodes"')) continue
      note(origin, 'files')
      let data
      try {
        data = JSON.parse(raw)
      } catch (err) {
        parseErrors.push({ file, message: err.message })
        continue
      }
      const found = []
      deepFind(data, '$', found)
      for (const { pointer, value } of found) addFlow(file, pointer, origin, value)
    }
  }
}

// -- 1d. El bundle generado, solo bajo peticion ----------------------------
if (OPT.bundle && DEFAULT_SCAN) {
  const file = path.join(ROOT, 'public/course.json')
  if (fs.existsSync(file)) {
    note('public/course.json', 'files')
    try {
      const data = readJson(file)
      const found = []
      deepFind(data, '$', found)
      for (const { pointer, value } of found) addFlow(file, pointer, 'public/course.json', value)
    } catch (err) {
      parseErrors.push({ file, message: err.message })
    }
  }
}

// -- 1e. automations-reales.mjs: se comprueba que NO es JSON de n8n --------
const AUTOMATIONS_MJS = path.join(ROOT, 'scripts/lib/automations-reales.mjs')
let automationsMjsIsText = null
if (fs.existsSync(AUTOMATIONS_MJS)) {
  const raw = fs.readFileSync(AUTOMATIONS_MJS, 'utf8')
  automationsMjsIsText = !(raw.includes('"connections"') || raw.includes('connections:'))
}

/* ────────────────────────────────────────────────────────────────
   PASO 2: agrupacion (dedup por contenido)
   ──────────────────────────────────────────────────────────────── */

const groups = new Map()
for (const d of discovered) {
  const loc = `${rel(d.file)}${d.pointer === '$' ? '' : ' ' + d.pointer}`
  if (OPT.only && !loc.toLowerCase().includes(OPT.only.toLowerCase())) continue
  const key = OPT.all ? loc : fingerprint(d.flow)
  if (!groups.has(key)) groups.set(key, { flow: d.flow, locations: [] })
  groups.get(key).locations.push(loc)
}

/* ────────────────────────────────────────────────────────────────
   PASO 3: comprobaciones
   ──────────────────────────────────────────────────────────────── */

const findings = []
const webhookPaths = new Map()

function report(sev, code, ctx, node, msg) {
  findings.push({ sev, code, file: ctx.file, flow: ctx.flowName, node: node || '-', msg })
}

// (h) Patrones de secreto.
const SECRET_PATTERNS = [
  { re: /\bsk-ant-[A-Za-z0-9_-]{20,}/g, what: 'clave de Anthropic (sk-ant-)' },
  { re: /\bsk-proj-[A-Za-z0-9_-]{20,}/g, what: 'clave de OpenAI de proyecto (sk-proj-)' },
  { re: /\bsk-[A-Za-z0-9]{20,}/g, what: 'clave estilo OpenAI (sk-)' },
  { re: /\bgh[pousr]_[A-Za-z0-9]{20,}/g, what: 'token de GitHub (ghp_/gho_/ghs_/ghu_)' },
  { re: /\bgithub_pat_[A-Za-z0-9_]{20,}/g, what: 'token fino de GitHub (github_pat_)' },
  { re: /\bxox[abprse]-[A-Za-z0-9-]{10,}/g, what: 'token de Slack (xox)' },
  { re: /\bAKIA[0-9A-Z]{16}\b/g, what: 'clave de acceso de AWS (AKIA)' },
  { re: /\bAIza[0-9A-Za-z_-]{35}\b/g, what: 'clave de Google (AIza)' },
  { re: /\bhf_[A-Za-z0-9]{20,}/g, what: 'token de Hugging Face (hf_)' },
  { re: /\bglpat-[A-Za-z0-9_-]{15,}/g, what: 'token de GitLab (glpat-)' },
  {
    re: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g,
    what: 'JWT literal (eyJ...)',
  },
]

const SECRET_FIELD_RE =
  /"(api[_-]?key|apikey|access[_-]?token|auth[_-]?token|bearer|password|passwd|pwd|client[_-]?secret|private[_-]?key|secret)"\s*:\s*"([^"]{8,})"/gi

const PLACEHOLDER_RE =
  /^(=|\{\{)|(^[A-Z0-9_]{3,}$)|TU_|TUS_|YOUR_|PON_|PONE?R|REEMPLAZA|CAMBIA|CHANGE_?ME|PLACEHOLDER|EXAMPLE|EJEMPLO|DUMMY|FAKE|XXXX|\*\*\*|<[^>]+>|\.\.\.$/i

function looksPlaceholder(v) {
  const s = String(v)
  if (s.length < 8) return true
  if (PLACEHOLDER_RE.test(s)) return true
  if (/^[a-z0-9_-]+$/i.test(s) && !/\d/.test(s) && s.length < 24) return true // palabra suelta
  return false
}

function checkSecrets(ctx, node) {
  const blob = JSON.stringify(node.parameters ?? {})
  const seen = new Set()
  for (const { re, what } of SECRET_PATTERNS) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(blob))) {
      const hit = m[0]
      if (seen.has(hit)) continue
      seen.add(hit)
      report(
        'ERROR',
        'h.secreto',
        ctx,
        node.name,
        `posible ${what} escrita dentro de parameters: ${hit.slice(0, 12)}…`,
      )
    }
  }
  SECRET_FIELD_RE.lastIndex = 0
  let m
  while ((m = SECRET_FIELD_RE.exec(blob))) {
    const field = m[1]
    const value = m[2]
    if (looksPlaceholder(value)) continue
    if (seen.has(value)) continue
    report(
      'ERROR',
      'h.secreto',
      ctx,
      node.name,
      `campo "${field}" con un valor literal largo (${value.length} car.) dentro de parameters; deberia ser una credencial de n8n`,
    )
  }
}

// (i) Expresiones.
const NODE_REF_RES = [
  /\$\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
  /\$node\[\s*['"]([^'"]+)['"]\s*\]/g,
  /\$items\(\s*['"]([^'"]+)['"]/g,
]

function scanExpressionSegments(str) {
  // Devuelve { unbalanced: n, segments: [texto interno] }
  const segments = []
  let unopened = 0
  let unclosed = 0
  let i = 0
  while (i < str.length) {
    const start = str.indexOf('{{', i)
    if (start === -1) break
    let depth = 0
    let j = start + 2
    let closed = -1
    let quote = null
    while (j < str.length) {
      const c = str[j]
      if (quote) {
        if (c === '\\') {
          j += 2
          continue
        }
        if (c === quote) quote = null
        j++
        continue
      }
      if (c === "'" || c === '"' || c === '`') {
        quote = c
        j++
        continue
      }
      if (c === '{') {
        depth++
        j++
        continue
      }
      if (c === '}') {
        if (depth > 0) {
          depth--
          j++
          continue
        }
        if (str[j + 1] === '}') {
          closed = j + 2
          break
        }
        j++
        continue
      }
      j++
    }
    if (closed === -1) {
      unclosed++
      segments.push(str.slice(start + 2))
      break
    }
    segments.push(str.slice(start + 2, closed - 2))
    i = closed
  }
  // Restos de '}}' sin '{{' delante
  const opens = (str.match(/\{\{/g) || []).length
  const closes = (str.match(/\}\}/g) || []).length
  if (closes > opens) unopened = closes - opens
  return { segments, unclosed, unopened }
}

function collectStrings(value, out, trail = '') {
  if (typeof value === 'string') {
    out.push({ path: trail, value })
    return
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => collectStrings(v, out, `${trail}[${i}]`))
    return
  }
  if (isPlainObject(value)) {
    for (const k of Object.keys(value)) collectStrings(value[k], out, trail ? `${trail}.${k}` : k)
  }
}

function checkExpressions(ctx, node, nodeNames) {
  const strings = []
  collectStrings(node.parameters ?? {}, strings)
  for (const { path: field, value } of strings) {
    if (!value.includes('{{')) {
      // '}}' suelto sin apertura tambien es un fallo
      if (value.includes('}}')) {
        report(
          'ERROR',
          'i.llaves',
          ctx,
          node.name,
          `campo "${field}": hay "}}" sin "{{" que lo abra`,
        )
      }
      continue
    }
    const { segments, unclosed, unopened } = scanExpressionSegments(value)
    if (unclosed) {
      report('ERROR', 'i.llaves', ctx, node.name, `campo "${field}": hay "{{" sin cerrar con "}}"`)
    }
    if (unopened) {
      report(
        'ERROR',
        'i.llaves',
        ctx,
        node.name,
        `campo "${field}": ${unopened} cierre(s) "}}" de mas`,
      )
    }
    if (!value.startsWith('=')) {
      report(
        'AVISO',
        'i.sin-igual',
        ctx,
        node.name,
        `campo "${field}": contiene {{ }} pero el valor no empieza por "="; n8n lo tratara como texto literal, no como expresion`,
      )
    }
    for (const seg of segments) {
      for (const re of NODE_REF_RES) {
        re.lastIndex = 0
        let m
        while ((m = re.exec(seg))) {
          const ref = m[1]
          if (!nodeNames.has(ref)) {
            report(
              'ERROR',
              'i.ref-nodo',
              ctx,
              node.name,
              `campo "${field}": la expresion referencia el nodo "${ref}", que no existe en este flujo`,
            )
          }
        }
      }
    }
  }
}

// (f) Ciclos.
function findCycles(nodeNames, edges) {
  const cycles = []
  const state = new Map() // 0 sin visitar, 1 en pila, 2 cerrado
  const stack = []
  const seenKeys = new Set()

  function dfs(n) {
    state.set(n, 1)
    stack.push(n)
    for (const next of edges.get(n) || []) {
      if (!nodeNames.has(next)) continue
      const st = state.get(next) || 0
      if (st === 1) {
        const at = stack.lastIndexOf(next)
        const cycle = stack.slice(at)
        const key = [...cycle].sort().join('>')
        if (!seenKeys.has(key)) {
          seenKeys.add(key)
          cycles.push(cycle)
        }
      } else if (st === 0) {
        dfs(next)
      }
    }
    stack.pop()
    state.set(n, 2)
  }

  for (const n of nodeNames) if (!state.get(n)) dfs(n)
  return cycles
}

function validateFlow(ctx, flow) {
  const flowName = ctx.flowName

  // (a) estructura minima
  if (!Array.isArray(flow.nodes) || flow.nodes.length === 0) {
    report('ERROR', 'a.estructura', ctx, '-', '"nodes" falta, no es un array o esta vacio')
    return
  }
  if (!isPlainObject(flow.connections)) {
    report('ERROR', 'a.estructura', ctx, '-', '"connections" falta o no es un objeto')
    return
  }
  if (typeof flow.name !== 'string' || !flow.name.trim()) {
    report('AVISO', 'a.nombre', ctx, '-', 'el flujo no tiene "name"; n8n lo importara como "My workflow"')
  }

  const nodeNames = new Set()
  const byName = new Map()

  // Pre-pasada: recoger todos los nombres antes de validar, para que las
  // expresiones puedan referenciar nodos declarados mas abajo en el array.
  for (const node of flow.nodes) {
    if (isPlainObject(node) && typeof node.name === 'string' && node.name) nodeNames.add(node.name)
  }

  const seenNames = new Set()

  for (const [idx, node] of flow.nodes.entries()) {
    if (!isPlainObject(node)) {
      report('ERROR', 'b.nodo', ctx, `#${idx}`, 'el elemento de "nodes" no es un objeto')
      continue
    }
    const label = typeof node.name === 'string' && node.name ? node.name : `#${idx}`

    // (b) campos obligatorios
    if (typeof node.name !== 'string' || !node.name.trim()) {
      report('ERROR', 'b.name', ctx, label, 'falta "name" (n8n identifica los nodos por nombre)')
    }
    if (typeof node.type !== 'string' || !node.type.trim()) {
      report('ERROR', 'b.type', ctx, label, 'falta "type"')
    }
    if (typeof node.typeVersion !== 'number') {
      report('ERROR', 'b.typeVersion', ctx, label, 'falta "typeVersion" o no es un numero')
    }
    if (!Array.isArray(node.position) || node.position.length !== 2 || node.position.some((n) => typeof n !== 'number')) {
      report('AVISO', 'b.position', ctx, label, '"position" ausente o no es [x, y] numerico; el lienzo apilara los nodos')
    }
    if (!isPlainObject(node.parameters)) {
      report('AVISO', 'b.parameters', ctx, label, '"parameters" ausente o no es un objeto; n8n usara los valores por defecto')
    }

    // (c) nombres repetidos
    if (typeof node.name === 'string' && node.name) {
      if (seenNames.has(node.name)) {
        report(
          'ERROR',
          'c.duplicado',
          ctx,
          node.name,
          'nombre de nodo repetido; n8n lo renombra al importar y las expresiones que lo citan apuntaran al nodo equivocado',
        )
      }
      seenNames.add(node.name)
      byName.set(node.name, node)
    }

    // (g) prefijo de tipo
    if (typeof node.type === 'string' && node.type) {
      const ok = ALLOWED_TYPE_PREFIXES.some((p) => node.type.startsWith(p))
      if (!ok) {
        const sev = node.type.includes('.') ? 'AVISO' : 'ERROR'
        report(
          sev,
          'g.tipo',
          ctx,
          label,
          `tipo "${node.type}" fuera de los paquetes esperados (n8n-nodes-base. / @n8n/n8n-nodes-langchain.)`,
        )
      }
      if (LEGACY_TYPES.has(node.type.toLowerCase())) {
        report(
          'AVISO',
          'g.heredado',
          ctx,
          label,
          `tipo "${node.type}" es un nodo heredado: ya no aparece en el panel de n8n 1.x; usa n8n-nodes-base.code`,
        )
      }
    }

    // (h) e (i)
    if (isPlainObject(node.parameters)) {
      checkSecrets(ctx, { ...node, name: label })
      checkExpressions(ctx, { ...node, name: label }, nodeNames)
    }
  }

  // (d) origenes y destinos de connections
  const hasIncoming = new Set()
  const edges = new Map()
  for (const [source, spec] of Object.entries(flow.connections)) {
    if (!nodeNames.has(source)) {
      report(
        'ERROR',
        'd.origen',
        ctx,
        source,
        `"connections" tiene una entrada para "${source}", pero ese nodo no existe en "nodes"`,
      )
    }
    if (!isPlainObject(spec)) {
      report('ERROR', 'd.forma', ctx, source, 'la entrada de "connections" no es un objeto {main:[[...]]}')
      continue
    }
    for (const [port, outputs] of Object.entries(spec)) {
      if (!Array.isArray(outputs)) {
        report('ERROR', 'd.forma', ctx, source, `el puerto "${port}" no es un array de salidas`)
        continue
      }
      for (const [oi, list] of outputs.entries()) {
        if (list === null) continue
        if (!Array.isArray(list)) {
          report('ERROR', 'd.forma', ctx, source, `la salida ${port}[${oi}] no es un array`)
          continue
        }
        for (const link of list) {
          if (!isPlainObject(link) || typeof link.node !== 'string') {
            report('ERROR', 'd.forma', ctx, source, `una conexion de ${port}[${oi}] no tiene "node"`)
            continue
          }
          if (!nodeNames.has(link.node)) {
            report(
              'ERROR',
              'd.destino',
              ctx,
              source,
              `conecta con "${link.node}", que no existe en "nodes"`,
            )
            continue
          }
          hasIncoming.add(link.node)
          if (!edges.has(source)) edges.set(source, [])
          edges.get(source).push(link.node)
        }
      }
    }
  }

  // (e) huerfanos
  for (const name of nodeNames) {
    const node = byName.get(name)
    if (!node) continue
    const type = String(node.type || '')
    if (NO_INPUT_EXEMPT.has(type.toLowerCase())) continue
    if (isTrigger(type)) continue
    if (hasIncoming.has(name)) continue
    report(
      'AVISO',
      'e.huerfano',
      ctx,
      name,
      'nodo sin ninguna conexion de entrada y que no es disparador: nunca se ejecutara',
    )
  }
  // Un flujo sin ningun disparador no se puede lanzar.
  const triggers = [...nodeNames].filter((n) => isTrigger(String((byName.get(n) || {}).type || '')))
  if (triggers.length === 0) {
    report('ERROR', 'e.sin-disparador', ctx, '-', 'el flujo no tiene ningun nodo disparador; no hay forma de arrancarlo')
  }

  // (f) ciclos sin espera
  for (const cycle of findCycles(nodeNames, edges)) {
    const hasWait = cycle.some((n) => isWaitNode(byName.get(n) || {}))
    if (!hasWait) {
      report(
        'ERROR',
        'f.ciclo',
        ctx,
        cycle[0],
        `ciclo sin nodo de espera: ${cycle.join(' → ')} → ${cycle[0]}`,
      )
    } else {
      report(
        'AVISO',
        'f.ciclo-espera',
        ctx,
        cycle[0],
        `ciclo con espera: ${cycle.join(' → ')} → ${cycle[0]}; comprueba que tiene condicion de salida`,
      )
    }
  }

  // EXTRA: coherencia webhook / respondToWebhook (fallo real al ejecutar)
  const responders = [...nodeNames].filter(
    (n) => shortType((byName.get(n) || {}).type) === 'respondtowebhook',
  )
  if (responders.length) {
    const webhooks = [...nodeNames].filter((n) => shortType((byName.get(n) || {}).type) === 'webhook')
    if (webhooks.length === 0) {
      report(
        'ERROR',
        'x.responder',
        ctx,
        responders[0],
        'hay "Respond to Webhook" pero ningun nodo Webhook en el flujo',
      )
    }
    for (const w of webhooks) {
      const p = (byName.get(w) || {}).parameters || {}
      if (p.responseMode !== 'responseNode') {
        report(
          'AVISO',
          'x.responseMode',
          ctx,
          w,
          'el Webhook no tiene responseMode "responseNode" pero el flujo usa "Respond to Webhook": al ejecutar, n8n responde de inmediato y el nodo Respond no llega a contestar',
        )
      }
    }
  }

  // EXTRA: el nodo Function heredado no expone $json en su sandbox.
  // Solo existen items / $item() / $items(). Un "$json" suelto revienta con
  // "$json is not defined" en cuanto se ejecuta.
  for (const name of nodeNames) {
    const node = byName.get(name)
    if (!node) continue
    if (String(node.type).toLowerCase() !== 'n8n-nodes-base.function') continue
    const code = (node.parameters || {}).functionCode || ''
    if (/(^|[^.\w$])\$json\b/.test(code)) {
      report(
        'AVISO',
        'x.function-json',
        ctx,
        name,
        'el nodo Function (heredado) usa "$json" en functionCode; ese sandbox solo expone items / $item() / $items(), asi que al ejecutar lanzara "$json is not defined". Pasa el nodo a n8n-nodes-base.code',
      )
    }
  }

  // EXTRA: el Webhook entrega { headers, params, query, body }. Leer el campo
  // del formulario directamente de la raiz de $json devuelve undefined.
  {
    const webhookNames = [...nodeNames].filter((n) => shortType((byName.get(n) || {}).type) === 'webhook')
    if (webhookNames.length) {
      // Solo los sucesores DIRECTOS del Webhook: ahi el item todavia es
      // { headers, params, query, body } y leerlo sin .body es siempre un fallo.
      const reachable = new Set()
      for (const w of webhookNames) for (const nxt of edges.get(w) || []) reachable.add(nxt)
      for (const name of reachable) {
        const node = byName.get(name)
        if (!node) continue
        const st = shortType(node.type)
        if (st !== 'code' && st !== 'function' && st !== 'functionitem') continue
        const code = (node.parameters || {}).jsCode || (node.parameters || {}).functionCode || ''
        if (!/\$json|\$input/.test(code)) continue
        if (/\.body\b|\[\s*['"]body['"]\s*\]/.test(code)) continue
        report(
          'AVISO',
          'x.webhook-body',
          ctx,
          name,
          'el disparador es un Webhook (entrega { headers, params, query, body }) pero el codigo lee campos de la raiz de $json sin pasar por .body: con una peticion real esos campos saldran undefined',
        )
      }
    }
  }
  // EXTRA: rutas de webhook, para detectar colisiones entre flujos distintos
  for (const name of nodeNames) {
    const node = byName.get(name)
    if (!node) continue
    if (shortType(node.type) !== 'webhook') continue
    const wp = (node.parameters || {}).path
    if (typeof wp !== 'string' || !wp) {
      report('AVISO', 'x.webhook-path', ctx, name, 'el Webhook no define "path"; n8n generara un id aleatorio al importar')
      continue
    }
    if (!webhookPaths.has(wp)) webhookPaths.set(wp, [])
    webhookPaths.get(wp).push({ ctx, node: name })
  }

  // EXTRA: nodos que llaman a APIs sin credencial declarada
  for (const name of nodeNames) {
    const node = byName.get(name)
    if (!node) continue
    const st = shortType(node.type)
    const p = node.parameters || {}
    if (st === 'httprequest' && p.authentication && p.authentication !== 'none' && !node.credentials) {
      report(
        'AVISO',
        'x.credencial',
        ctx,
        name,
        `pide autenticacion "${p.authentication}" pero el JSON no trae "credentials": al importar habra que elegirla a mano`,
      )
    }
  }

  void flowName
}

/* ────────────────────────────────────────────────────────────────
   Ejecucion
   ──────────────────────────────────────────────────────────────── */

for (const { file, message } of parseErrors) {
  findings.push({
    sev: 'ERROR',
    code: 'a.json',
    file: rel(file),
    flow: '-',
    node: '-',
    msg: `JSON invalido: ${message}`,
  })
}

const flowsChecked = []
for (const [, group] of groups) {
  const ctx = {
    file: group.locations[0] + (group.locations.length > 1 ? ` (+${group.locations.length - 1} copias)` : ''),
    flowName: group.flow.name || '(sin nombre)',
  }
  flowsChecked.push({ ...ctx, locations: group.locations, nodes: (group.flow.nodes || []).length })
  validateFlow(ctx, group.flow)
}

// Colisiones de ruta de webhook entre flujos distintos: si un alumno importa
// dos flujos con la misma ruta, n8n solo deja activar uno.
for (const [wp, uses] of webhookPaths) {
  const distinct = [...new Set(uses.map((u) => u.ctx.flowName))]
  if (distinct.length > 1) {
    for (const u of uses) {
      report(
        'AVISO',
        'x.path-colision',
        u.ctx,
        u.node,
        `la ruta de webhook "${wp}" la usan ${distinct.length} flujos distintos (${distinct.join(', ')}); n8n solo permite activar uno`,
      )
    }
  }
}

const errors = findings.filter((f) => f.sev === 'ERROR')
const warns = findings.filter((f) => f.sev === 'AVISO')

if (OPT.json) {
  console.log(
    JSON.stringify(
      {
        root: ROOT,
        sources: Object.fromEntries(sourceStats),
        parseErrors: parseErrors.length,
        filesWithFlows: new Set(discovered.map((d) => rel(d.file))).size,
        flowInstances: discovered.length,
        uniqueFlows: groups.size,
        errors: errors.length,
        warnings: warns.length,
        findings,
      },
      null,
      2,
    ),
  )
  process.exit(errors.length ? 1 : 0)
}

const H = (s) => `\n${s}\n${'─'.repeat(s.length)}`

console.log(H('INVENTARIO'))
const originOrder = [...sourceStats.keys()]
for (const o of originOrder) {
  const s = sourceStats.get(o)
  console.log(
    `  ${o.padEnd(52)} ${String(s.files).padStart(4)} .json revisados · ${String(s.flows).padStart(3)} flujos n8n · ${String(s.textOnly).padStart(3)} sin nodes/connections`,
  )
}
if (automationsMjsIsText !== null) {
  console.log(
    `  scripts/lib/automations-reales.mjs${' '.repeat(18)} ${automationsMjsIsText ? 'texto descriptivo, NO contiene JSON de n8n' : 'CONTIENE estructuras tipo n8n: revisar'}`,
  )
}
console.log(
  `\n  Instancias de flujo encontradas: ${discovered.length}  ·  flujos unicos por contenido: ${groups.size}  ·  archivos con flujo: ${new Set(discovered.map((d) => rel(d.file))).size}`,
)
if (!OPT.bundle) console.log('  (public/course.json no escaneado; anade --bundle para incluirlo)')

console.log(H('FLUJOS COMPROBADOS'))
for (const f of flowsChecked.sort((a, b) => a.file.localeCompare(b.file))) {
  console.log(`  ${String(f.nodes).padStart(2)} nodos · ${f.flowName}`)
  console.log(`           ${f.file}`)
}

console.log(H('PROBLEMAS'))
if (findings.length === 0) {
  console.log('  Ninguno.')
} else {
  const order = { ERROR: 0, AVISO: 1 }
  const sorted = [...findings].sort(
    (a, b) => order[a.sev] - order[b.sev] || a.code.localeCompare(b.code) || a.file.localeCompare(b.file),
  )
  for (const f of sorted) {
    console.log(`  [${f.sev}] ${f.code}  ${f.file}`)
    console.log(`          flujo: ${f.flow}  ·  nodo: ${f.node}`)
    console.log(`          ${f.msg}`)
  }
}

console.log(H('RESUMEN POR TIPO DE FALLO'))
const byCode = new Map()
for (const f of findings) {
  const k = `${f.sev} ${f.code}`
  byCode.set(k, (byCode.get(k) || 0) + 1)
}
for (const [k, v] of [...byCode].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(v).padStart(4)}  ${k}`)
}

console.log(H('TOTALES'))
console.log(`  Flujos unicos comprobados : ${groups.size}`)
console.log(`  Instancias (con copias)   : ${discovered.length}`)
console.log(`  ERROR                     : ${errors.length}`)
console.log(`  AVISO                     : ${warns.length}`)
console.log('')

process.exit(errors.length ? 1 : 0)
