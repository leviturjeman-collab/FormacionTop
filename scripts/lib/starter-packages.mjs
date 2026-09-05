import fs from 'node:fs/promises'
import path from 'node:path'
import { zipSync } from 'fflate'

export async function buildStarterPackages(vault, generated, lessons) {
  const root = path.join(vault, '34_PRODUCTO_EJECUTABLE_PREMIUM/mini_repos_clonables')
  const destination = path.join(generated, 'starters')
  await fs.mkdir(destination, { recursive: true })
  const ignored = new Set(['node_modules', '.git', '.next', 'dist', 'out', 'test-results', 'playwright-report', '__pycache__', '.venv', 'venv'])
  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith('starter-')) continue
    const files = {}
    async function walk(dir, prefix = '') {
      for (const item of await fs.readdir(dir, { withFileTypes: true })) {
        if (ignored.has(item.name) || item.isSymbolicLink() || (/^\.env/.test(item.name) && item.name !== '.env.example') || /\.(db|sqlite|sqlite3|pyc|mp4|log)$/.test(item.name)) continue
        const name = prefix + item.name
        if (item.isDirectory()) await walk(path.join(dir, item.name), name + '/')
        else if (item.isFile()) files[name] = await fs.readFile(path.join(dir, item.name))
      }
    }
    await walk(path.join(root, entry.name))
    if (!Object.keys(files).length) throw Error('Empty starter ' + entry.name)
    await fs.writeFile(path.join(destination, entry.name + '.zip'), zipSync(files))
    for (const lesson of lessons) if (lesson.sourcePath.includes('/mini_repos_clonables/' + entry.name + '/')) lesson.downloadPackage = '/generated/starters/' + entry.name + '.zip'
  }
}
