/* Verifica que la pasada de lenguaje no ha roto nada: mismas claves, mismos
 * arrays, y que ningun comando, URL o fragmento entre comillas invertidas ha
 * desaparecido. Si un fichero pierde informacion, se revierte. Se borra despues. */
import { execSync } from 'node:child_process'
import fs from 'node:fs'

const cambiados = execSync('git diff --name-only -- content/lecciones', { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean)

function claves(objeto, prefijo = '') {
  const salida = []
  if (Array.isArray(objeto)) {
    salida.push(prefijo + '[]:' + objeto.length)
    for (const item of objeto) if (item && typeof item === 'object') salida.push(...claves(item, prefijo + '[]'))
  } else if (objeto && typeof objeto === 'object') {
    for (const [k, v] of Object.entries(objeto)) {
      salida.push(prefijo + '.' + k)
      if (v && typeof v === 'object') salida.push(...claves(v, prefijo + '.' + k))
    }
  }
  return salida
}

/* Fragmentos que no pueden desaparecer: comandos, URLs, codigo y nombres de boton. */
function literales(texto) {
  const out = new Set()
  for (const m of texto.matchAll(/'[^']{2,60}'/g)) {
    const s = m[0]
    if (/[/\\.{}$_-]|^'[A-Z]/.test(s.slice(1, -1)) && /docker|npm|node|git|http|localhost|\.\w{2,4}'|--|\/|\\\\|\{\{/.test(s)) out.add(s)
  }
  for (const m of texto.matchAll(/https?:\/\/[^\s"',)]+/g)) out.add(m[0])
  for (const m of texto.matchAll(/«[^»]+»/g)) out.add(m[0])
  return out
}

let ok = 0
let revertidos = 0

for (const fichero of cambiados) {
  const nuevoTexto = fs.readFileSync(fichero, 'utf8')
  const viejoTexto = execSync('git show HEAD:' + JSON.stringify(fichero), { encoding: 'utf8', maxBuffer: 1024 * 1024 * 16 })

  let problema = null
  try {
    const nuevo = JSON.parse(nuevoTexto)
    const viejo = JSON.parse(viejoTexto)

    const cv = claves(viejo).sort().join('\n')
    const cn = claves(nuevo).sort().join('\n')
    if (cv !== cn) {
      const setN = new Set(claves(nuevo))
      const perdidas = claves(viejo).filter((k) => !setN.has(k))
      problema = 'estructura distinta: ' + (perdidas.slice(0, 3).join(', ') || 'claves nuevas de mas')
    }

    if (!problema) {
      for (const campo of ['id', 'number', 'next', 'stageId', 'tool']) {
        if (JSON.stringify(viejo[campo]) !== JSON.stringify(nuevo[campo])) { problema = 'campo alterado: ' + campo; break }
      }
    }

    if (!problema) {
      const desaparecidos = [...literales(viejoTexto)].filter((l) => !nuevoTexto.includes(l))
      if (desaparecidos.length) problema = 'literales perdidos: ' + desaparecidos.slice(0, 3).join(' · ')
    }
  } catch (e) {
    problema = 'JSON invalido: ' + e.message.slice(0, 60)
  }

  if (problema) {
    execSync('git checkout HEAD -- ' + JSON.stringify(fichero))
    revertidos++
    console.log('REVERTIDO  ' + fichero + '  (' + problema + ')')
  } else {
    ok++
    console.log('ok         ' + fichero)
  }
}

console.log('\nverificados: ' + cambiados.length + ' | correctos: ' + ok + ' | revertidos: ' + revertidos)
