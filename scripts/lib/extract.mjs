/**
 * Extracción de señal desde un archivo Markdown del vault.
 *
 * El objetivo NO es guardar el texto para mostrarlo. Es sacar las piezas
 * reales del documento (conceptos, procedimientos, comandos, riesgos,
 * comparativas) para poder reescribirlas después en tres niveles.
 *
 * Nada de lo que sale de aquí se muestra literal al alumno: lo consume
 * levels.mjs, que redacta.
 */

const BOM = /^﻿/

/**
 * Repara texto UTF-8 que fue guardado interpretándolo como Latin-1
 * ("Módulo" convertido en "MÃ³dulo"). Afecta a parte de los archivos del
 * vault. Se corrige aquí, al leer: el vault no se modifica nunca.
 *
 * Se trabaja línea a línea y solo se acepta la reparación si no introduce
 * caracteres de reemplazo, para no estropear las líneas que ya estaban bien
 * en un archivo mezclado.
 */
const MOJIBAKE = /Ã[-¿]|Â[ -¿]|â€[]/


/**
 * Titulos legibles.
 *
 * Muchos archivos de la biblioteca se llaman como el codigo que documentan
 * (01_lead_scoring.py, 31-mcp-permission-auditor). Tal cual, en un listado
 * son ilegibles. Esto los convierte en algo que una persona puede leer sin
 * inventarse una traduccion: quita numeracion y extension, separa palabras,
 * respeta las siglas y deja la primera en mayuscula.
 */
const SIGLAS = new Set(['ai','api','cli','crm','csv','e2e','gdpr','hitl','html','http','ia','json','llm','mcp','ocr','pii','pdf','pr','qa','rag','rgpd','seo','sla','sql','ssh','ui','ux','vps','yaml'])
const TAL_CUAL = { n8n: 'n8n', github: 'GitHub', gitlab: 'GitLab', javascript: 'JavaScript', typescript: 'TypeScript', postgres: 'Postgres', supabase: 'Supabase', vercel: 'Vercel', docker: 'Docker', python: 'Python', playwright: 'Playwright', openai: 'OpenAI', claude: 'Claude', gemini: 'Gemini', slack: 'Slack', notion: 'Notion', whatsapp: 'WhatsApp', remotion: 'Remotion', langchain: 'LangChain', ollama: 'Ollama', figma: 'Figma', obsidian: 'Obsidian' }

function pareceNombreDeArchivo(valor) {
  if (/\.(py|js|mjs|ts|tsx|jsx|json|md|txt|ya?ml|sh|sql)$/i.test(valor)) return true
  if (/^[a-z0-9]+([-_][a-z0-9]+){2,}$/.test(valor)) return true
  return /^\d+[a-z]/.test(valor)
}

export function tituloLegible(valor, rutaRelativa = '') {
  let base = String(valor || '').trim()
  if (rutaRelativa && pareceNombreDeArchivo(base)) {
    // El nombre del archivo conserva los separadores que el titulo perdio.
    base = rutaRelativa.split('/').at(-1)
  }
  // .py.md deja dos extensiones pegadas: se quitan todas.
  while (/\.(py|js|mjs|ts|tsx|jsx|json|md|txt|ya?ml|sh|sql)$/i.test(base)) {
    base = base.replace(/\.(py|js|mjs|ts|tsx|jsx|json|md|txt|ya?ml|sh|sql)$/i, '')
  }
  base = base
    .replace(/^\d+[-_. ]+/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!base) return String(valor || '').trim()
  const palabras = base.split(' ').map((palabra) => {
    const suelta = palabra.toLowerCase()
    if (TAL_CUAL[suelta]) return TAL_CUAL[suelta]
    if (SIGLAS.has(suelta)) return suelta.toUpperCase()
    return palabra
  })
  const primera = palabras[0]
  if (primera && primera === primera.toLowerCase() && !TAL_CUAL[primera.toLowerCase()] && !SIGLAS.has(primera.toLowerCase())) {
    palabras[0] = primera[0].toUpperCase() + primera.slice(1)
  }
  return palabras.join(' ')
}

export function repairMojibake(text) {
  if (!MOJIBAKE.test(text)) return text
  return text
    .split('\n')
    .map((line) => {
      if (!MOJIBAKE.test(line)) return line
      const repaired = Buffer.from(line, 'latin1').toString('utf8')
      return repaired.includes('�') ? line : repaired
    })
    .join('\n')
}

export function stripFrontmatter(raw) {
  return raw.replace(BOM, '').replace(/^---\s*[\s\S]*?\n---\s*/m, '').trim()
}

export function parseFrontmatter(raw) {
  const match = raw.replace(BOM, '').match(/^---\s*\n([\s\S]*?)\n---/)
  if (!match) return {}
  const data = {}
  for (const line of match[1].split('\n')) {
    const pair = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/)
    if (!pair) continue
    let value = pair[2].trim().replace(/^["']|["']$/g, '')
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    }
    data[pair[1]] = value
  }
  return data
}

/** Quita marcas de Markdown dejando prosa legible. */
export function plain(value = '') {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/[*_~]{1,3}/g, '')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Divide en frases, ignorando abreviaturas y números de versión. */
export function sentences(value) {
  return plain(value)
    .split(/(?<=[.!?:])\s+(?=[A-ZÁÉÍÓÚÑ¿¡])/)
    .map((item) => item.trim())
    .filter((item) => item.length > 25 && item.length < 400)
}

const SHELL = /^(?:\$\s*)?(?:npm|npx|pnpm|yarn|bun|pip|pip3|python3?|node|deno|brew|apt|choco|winget|git|gh|docker|docker-compose|vercel|netlify|supabase|curl|wget|ffmpeg|whisper|export|set|setx|cd|ls|dir|mkdir|cp|mv|rm|cat|echo|chmod|ssh|psql|code|claude|codex|ollama)\b/im

/** Bloques de código con su lenguaje y si son ejecutables en terminal. */
export function codeBlocks(body) {
  const blocks = []
  const pattern = /```([a-zA-Z0-9_+-]*)\s*\r?\n([\s\S]*?)```/g
  let match
  while ((match = pattern.exec(body))) {
    const code = match[2].replace(/\s+$/, '')
    if (!code || code.length > 2400) continue
    if (/BEGIN (?:RSA|OPENSSH|PRIVATE)/i.test(code)) continue
    const lang = (match[1] || '').toLowerCase()
    const shellLang = ['bash', 'sh', 'shell', 'zsh', 'powershell', 'ps1', 'cmd', 'console', 'terminal'].includes(lang)
    blocks.push({
      lang: lang || (shellLang ? 'bash' : 'text'),
      code,
      shell: shellLang || (!lang && SHELL.test(code)),
      lines: code.split('\n').length,
    })
  }
  return blocks
}

/** Comandos sueltos, uno por línea, listos para una terminal simulada. */
export function commands(body) {
  const out = []
  for (const block of codeBlocks(body)) {
    if (!block.shell) continue
    for (const raw of block.code.split('\n')) {
      const line = raw.trim().replace(/^\$\s*/, '').replace(/^PS\s+[^>]*>\s*/, '')
      if (!line || line.startsWith('#') || line.startsWith('//')) continue
      if (line.length < 3 || line.length > 180) continue
      if (!SHELL.test(line)) continue
      if (/(?:sk-[a-zA-Z0-9]{10,}|ghp_[a-zA-Z0-9]{10,})/.test(line)) continue
      if (!out.includes(line)) out.push(line)
      if (out.length >= 12) return out
    }
  }
  return out
}

/** Árbol de secciones: cada encabezado con su texto propio. */
export function sections(body) {
  const lines = body.split('\n')
  const out = []
  let current = null
  let fence = false
  for (const line of lines) {
    if (/^\s*```/.test(line)) fence = !fence
    const heading = !fence && line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*$/)
    if (heading) {
      if (current) out.push(current)
      current = { depth: heading[1].length, title: plain(heading[2]), lines: [] }
    } else if (current) {
      current.lines.push(line)
    }
  }
  if (current) out.push(current)
  return out.map((section) => ({
    depth: section.depth,
    title: section.title,
    raw: section.lines.join('\n'),
    text: plain(section.lines.join('\n')),
  }))
}

/** Busca la sección cuyo título encaje con alguno de los patrones. */
export function findSection(list, patterns) {
  for (const pattern of patterns) {
    const hit = list.find((section) => pattern.test(section.title))
    if (hit && hit.text.length > 40) return hit
  }
  return null
}

/** Viñetas y numeraciones, limpias y sin duplicados. */
export function bullets(body, { min = 20, max = 320 } = {}) {
  const out = []
  let fence = false
  for (const line of body.split('\n')) {
    if (/^\s*```/.test(line)) { fence = !fence; continue }
    if (fence) continue
    const match = line.match(/^\s{0,6}(?:[-*+]|\d{1,2}[.)])\s+(.+)$/)
    if (!match) continue
    const value = plain(match[1])
    if (value.length < min || value.length > max) continue
    if (/^\[\[|^\w+\.md$/.test(value)) continue
    if (!out.includes(value)) out.push(value)
  }
  return out
}

/** Pasos numerados explícitos, que suelen ser el procedimiento real. */
export function numberedSteps(body) {
  const out = []
  let fence = false
  for (const line of body.split('\n')) {
    if (/^\s*```/.test(line)) { fence = !fence; continue }
    if (fence) continue
    const match = line.match(/^\s{0,4}(\d{1,2})[.)]\s+(.+)$/)
    if (!match) continue
    const value = plain(match[2])
    if (value.length < 15 || value.length > 300) continue
    out.push({ order: Number(match[1]), text: value })
  }
  return out
}

/** Tablas Markdown convertidas a cabecera + filas. */
export function tables(body) {
  const out = []
  const lines = body.split('\n')
  for (let index = 0; index < lines.length; index += 1) {
    if (!/^\s*\|.+\|\s*$/.test(lines[index])) continue
    if (!/^\s*\|[\s:|-]+\|\s*$/.test(lines[index + 1] || '')) continue
    const header = splitRow(lines[index])
    const rows = []
    let cursor = index + 2
    while (cursor < lines.length && /^\s*\|.+\|\s*$/.test(lines[cursor])) {
      const row = splitRow(lines[cursor])
      if (row.some(Boolean)) rows.push(row)
      cursor += 1
    }
    if (header.length >= 2 && rows.length >= 2) out.push({ header, rows: rows.slice(0, 10) })
    index = cursor
  }
  return out.slice(0, 3)
}

function splitRow(line) {
  return line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => plain(cell))
}

/**
 * Definiciones del tipo "**Término**: explicación" o "- Término — explicación".
 * Es la fuente del glosario que el nivel básico necesita.
 */
export function definitions(body) {
  const out = []
  const patterns = [
    /^\s{0,6}[-*+]?\s*\*\*([^*]{3,48})\*\*\s*[:：—–-]\s*(.{20,260})$/gm,
    /^\s{0,6}[-*+]\s+`([^`]{3,48})`\s*[:：—–-]\s*(.{20,260})$/gm,
  ]
  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(body))) {
      const term = plain(match[1]).replace(/[:：]$/, '')
      const meaning = plain(match[2])
      if (!term || !meaning) continue
      if (out.some((item) => item.term.toLowerCase() === term.toLowerCase())) continue
      out.push({ term, meaning })
      if (out.length >= 14) return out
    }
  }
  return out
}

/** Términos técnicos destacados en negrita o código, para el glosario. */
export function keyTerms(body) {
  const counts = new Map()
  const add = (value) => {
    const term = plain(value)
    if (term.length < 3 || term.length > 42) return
    if (/^\d+$/.test(term)) return
    counts.set(term, (counts.get(term) || 0) + 1)
  }
  for (const match of body.matchAll(/\*\*([^*\n]{3,42})\*\*/g)) add(match[1])
  for (const match of body.matchAll(/`([^`\n]{3,42})`/g)) add(match[1])
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([term]) => term)
}

/** Frases que señalan un riesgo, un límite o un error frecuente. */
const RISK = /\b(?:no\s+(?:hagas|uses|guardes|subas|compartas)|nunca|evita|cuidado|riesgo|peligro|error com[uú]n|fallo|atenci[oó]n|importante|limitaci[oó]n|l[ií]mite|no confundir|antipatr[oó]n|problema)\b/i

export function risks(body) {
  const out = []
  for (const item of [...bullets(body), ...sentences(body)]) {
    if (!RISK.test(item)) continue
    if (item.length < 30 || item.length > 300) continue
    if (out.includes(item)) continue
    out.push(item)
    if (out.length >= 8) break
  }
  return out
}

/** Enlaces internos del vault, para reconstruir las relaciones entre lecciones. */
export function wikiLinks(body) {
  const out = []
  for (const match of body.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) {
    const target = match[1].split('/').at(-1).replace(/\.md$/i, '').trim()
    if (target && !out.includes(target)) out.push(target)
  }
  return out.slice(0, 12)
}

/**
 * Punto de entrada: convierte un documento en su señal completa.
 */
export function extract(rawInput, relativePath) {
  const raw = repairMojibake(rawInput)
  const front = parseFrontmatter(raw)
  const body = stripFrontmatter(raw)
  const titleMatch = body.match(/^#\s+(.+)$/m)
  const fileTitle = relativePath.split('/').at(-1).replace(/\.md$/i, '').replace(/^\d+[-_ ]*/, '').replace(/[_-]+/g, ' ').trim()
  const words = plain(body).split(/\s+/).filter(Boolean).length
  const list = sections(body)

  return {
    front,
    body,
    title: tituloLegible(plain(titleMatch?.[1] || front.titulo || front.title || fileTitle), relativePath),
    words,
    minutes: Math.max(2, Math.ceil(words / 200)),
    sections: list,
    intro: plain(body.split(/^#{2,3}\s+/m)[0] || '').slice(0, 900),
    bullets: bullets(body),
    steps: numberedSteps(body),
    code: codeBlocks(body),
    commands: commands(body),
    tables: tables(body),
    definitions: definitions(body),
    keyTerms: keyTerms(body),
    risks: risks(body),
    links: wikiLinks(body),
    purpose: findSection(list, [/para qu[eé] sirve/i, /objetivo/i, /prop[oó]sito/i, /qu[eé] es/i, /introducci[oó]n/i])?.text.slice(0, 600) || '',
    deliverable: findSection(list, [/entregable/i, /salida esperada/i, /resultado/i, /qu[eé] entregas/i])?.text.slice(0, 400) || '',
    procedure: findSection(list, [/paso a paso/i, /procedimiento/i, /c[oó]mo (?:se )?(?:hace|hacerlo)/i, /instalaci[oó]n/i, /configuraci[oó]n/i, /ejecuci[oó]n/i])?.raw || '',
    checks: findSection(list, [/checklist/i, /verificaci[oó]n/i, /criterios/i, /r[uú]brica/i, /c[oó]mo sabes/i])?.raw || '',
  }
}
