import { promises as fs } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const publicDir = path.join(root, 'public')

const forbiddenStudentPhrases = [
  'Qué te ha salido',
  'QUE TE HA SALIDO',
  'APUNTA TU RESULTADO',
  'Apunta tu resultado',
  'Pega aquí el resultado',
  'apunta lo que has decidido',
  'pon tu resultado aquí',
]

const spanishPromptHeadingsInEnglish = [
  'Prompts generales del curso',
  'Asistentes IA y modelos',
  'Apps, código y despliegue',
  'Automatización y comunicación',
  'Datos, documentos y conocimiento',
  'Contenido, imagen, vídeo y venta',
  'Aprender desde cero',
  'lote 1 de',
  'Biblioteca anterior',
  'Kit institucional',
]

function fail(message) {
  console.error(`ERROR ${message}`)
  process.exitCode = 1
}

async function main() {
  const courseEs = await fs.readFile(path.join(publicDir, 'course.json'), 'utf8')
  const courseEn = await fs.readFile(path.join(publicDir, 'course.en.json'), 'utf8')

  for (const phrase of forbiddenStudentPhrases) {
    if (courseEs.includes(phrase)) fail(`Texto rellenable prohibido en course.json: ${phrase}`)
    if (courseEn.includes(phrase)) fail(`Texto rellenable prohibido en course.en.json: ${phrase}`)
  }

  for (const phrase of spanishPromptHeadingsInEnglish) {
    if (courseEn.includes(phrase)) fail(`Cabecera española en course.en.json: ${phrase}`)
  }

  if (!process.exitCode) console.log('Validación UI alumno correcta.')
}

main()
