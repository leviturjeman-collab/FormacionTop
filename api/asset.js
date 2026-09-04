import fs from 'node:fs/promises'
import path from 'node:path'
import { ensurePrivateAccess, json } from './_supabase.js'

const CONTENT_TYPES = {
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
}

function safeAssetPath(rawPath) {
  const clean = String(rawPath || '').replace(/\\/g, '/').replace(/^\/+/, '')
  if (!clean || clean.includes('\0') || clean.split('/').includes('..')) return null
  const root = path.join(process.cwd(), 'public', 'generated')
  const target = path.resolve(root, clean)
  return target.startsWith(path.resolve(root) + path.sep) ? target : null
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    json(res, 200, { ok: true })
    return
  }
  if (req.method !== 'GET') {
    json(res, 405, { ok: false, error: 'Metodo no permitido.' })
    return
  }
  if (!ensurePrivateAccess(req, res)) return

  try {
    const target = safeAssetPath(req.query?.path)
    if (!target) {
      json(res, 400, { ok: false, error: 'Ruta de archivo no valida.' })
      return
    }
    const payload = await fs.readFile(target)
    const ext = path.extname(target).toLowerCase()
    res.statusCode = 200
    res.setHeader('Content-Type', CONTENT_TYPES[ext] || 'application/octet-stream')
    res.setHeader('Cache-Control', 'private, no-store')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.end(payload)
  } catch {
    json(res, 404, { ok: false, error: 'Archivo no encontrado.' })
  }
}
