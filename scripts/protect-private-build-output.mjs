import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const dist = path.resolve(root, 'dist')

const privateOutputs = [
  'course.json',
  'course.en.json',
  'catalog.json',
  'student-catalog.json',
  'generated',
]

function assertInsideDist(target) {
  const resolved = path.resolve(target)
  if (resolved !== dist && !resolved.startsWith(dist + path.sep)) {
    throw new Error(`Ruta fuera de dist bloqueada: ${resolved}`)
  }
  return resolved
}

for (const item of privateOutputs) {
  const target = assertInsideDist(path.join(dist, item))
  await fs.rm(target, { recursive: true, force: true })
}

console.log('Build protegido: course/course.en/catalog/student-catalog/generated no se publican como estáticos.')
