/**
 * Convierte los SVG de marca de public/brand en un módulo TypeScript.
 *
 * Se incrustan en el bundle para poder teñirlos con currentColor y que
 * funcionen sin ninguna petición de red. Los archivos son los logos
 * oficiales de cada producto; se usan de forma nominativa, para identificar
 * la herramienta de la que trata cada lección.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectDir = path.resolve(scriptDir, '..')
const brandDir = path.join(projectDir, 'public', 'brand')
const target = path.join(projectDir, 'src', 'brand-icons.ts')

const files = (await fs.readdir(brandDir)).filter((name) => name.endsWith('.svg')).sort()
const icons = {}

for (const name of files) {
  const raw = await fs.readFile(path.join(brandDir, name), 'utf8')
  const open = raw.match(/<svg\b([^>]*)>/i)
  if (!open) continue

  const viewBox = open[1].match(/viewBox\s*=\s*"([^"]+)"/i)?.[1] || '0 0 24 24'
  const inner = raw
    .slice(open.index + open[0].length, raw.lastIndexOf('</svg>'))
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!inner) continue

  // Un icono es monocromo si ninguna forma declara su propio color:
  // esos se pueden teñir con currentColor. El resto se deja tal cual.
  const monochrome = !/fill\s*=\s*"(?!none)/i.test(inner) && !/style\s*=\s*"[^"]*fill:/i.test(inner)
  const title = raw.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || name.replace(/\.svg$/, '')

  icons[name.replace(/\.svg$/, '')] = { viewBox, inner, monochrome, title }
}

const body = `/**
 * Generado por scripts/build-brand-icons.mjs. No editar a mano.
 * Logos oficiales de cada herramienta, incrustados para funcionar sin red.
 */

export interface BrandIcon {
  viewBox: string
  inner: string
  monochrome: boolean
  title: string
}

export const BRAND_ICONS: Record<string, BrandIcon> = ${JSON.stringify(icons, null, 2)}

export const BRAND_KEYS = Object.keys(BRAND_ICONS)
`

await fs.writeFile(target, body, 'utf8')
console.log(`Iconos de marca: ${Object.keys(icons).length} incrustados en src/brand-icons.ts`)
