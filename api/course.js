import fs from 'node:fs/promises'
import path from 'node:path'
import { ensurePrivateAccess, json } from './_supabase.js'

const ALLOWED_FILES = new Set(['course', 'course.en', 'catalog', 'student-catalog'])

function requestedCourseFile(req) {
  const rawFile = String(req.query?.file || 'course').replace(/\.json$/i, '')
  if (rawFile === 'course' && String(req.query?.locale || '').toLowerCase() === 'en') return 'course.en'
  return rawFile
}

function publicJsonPath(file) {
  const name = ALLOWED_FILES.has(file) ? `${file}.json` : 'course.json'
  return path.join(process.cwd(), 'public', name)
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
    const file = requestedCourseFile(req)
    const payload = await fs.readFile(publicJsonPath(file), 'utf8')
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'private, no-store')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.end(payload)
  } catch {
    json(res, 404, { ok: false, error: 'Contenido no encontrado.' })
  }
}
