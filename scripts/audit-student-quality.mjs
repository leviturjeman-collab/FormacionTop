#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const OUT_DIR = path.join(ROOT, '23_AUDITORIA_PROFESIONAL')
const OUT_FILE = path.join(OUT_DIR, 'Auditoria_200_mejoras_alumno_basico.md')
const course = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/course.json'), 'utf8'))

const issues = []
const seen = new Set()

function add(area, tipo, donde, problema, solucion) {
  const key = `${area}|${tipo}|${donde}|${problema}`
  if (seen.has(key)) return
  seen.add(key)
  issues.push({ area, tipo, donde, problema, solucion })
}

function words(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean)
}

function tooLong(text, max) {
  return String(text || '').length > max
}

const mainMenu = [
  ['Inicio', 'Debe responder en 10 segundos: que hago ahora.'],
  ['Programa', 'Debe separar ruta principal de biblioteca.'],
  ['Mi proyecto', 'Debe convertir una idea vaga en pasos.'],
  ['Prompts', 'Debe mostrar pocos prompts buenos antes que muchos.'],
  ['Skills', 'Debe recomendar, no solo catalogar.'],
  ['Kits', 'Debe empezar por casos vendibles y claros.'],
  ['Herramientas', 'Debe decir que abrir primero y que ignorar.'],
  ['Preguntas', 'Debe resolver bloqueos rapidos.'],
  ['Diccionario', 'Debe explicar palabras justo antes de necesitarlas.'],
  ['Progreso', 'Debe mostrar avance accionable, no estadistica vacia.'],
  ['Guias', 'Debe ordenar por principiante antes que por catalogo.'],
  ['Superadmin', 'Debe ser privado y local, sin confundirse con seguridad real.'],
]

for (const [area, principio] of mainMenu) {
  add(area, 'criterio base', 'Pantalla completa', `La pantalla necesita comprobar: ${principio}`, 'Usar este criterio como prueba manual antes de publicar cambios.')
}

const mainLessons = (course.curso || []).filter((lesson) => !lesson.tool)
for (const stage of course.stages || []) {
  const main = mainLessons.filter((lesson) => lesson.stageId === stage.id)
  if (!main.length) {
    add('Programa', 'jerarquia', stage.title, 'Aparece como area del curso pero no tiene lecciones principales.', 'O darle 3 lecciones guiadas o etiquetarla claramente como biblioteca avanzada.')
  }
  if ((stage.lessonSlugs || []).length > 45) {
    add('Programa', 'cantidad', stage.title, `Tiene ${(stage.lessonSlugs || []).length} piezas de biblioteca; para un alumno nuevo parece obligatorio.`, 'Mostrar solo 8-12 recomendadas y mover el resto a "ver biblioteca completa".')
  }
  if (tooLong(stage.description, 150)) {
    add('Inicio', 'texto largo', stage.title, 'La descripcion del area es larga para una tarjeta de escaneo.', 'Acortarla a una frase y mover el detalle dentro del area.')
  }
}

for (const tool of course.toolPages || []) {
  const prompts = tool.guide?.prompts?.length || 0
  const automations = tool.guide?.automations?.length || 0
  const itinerary = tool.itinerary?.length || 0
  const lessons = tool.count || 0

  if (lessons > 0 && !itinerary) {
    add('Herramientas', 'sin ruta', tool.label, `Tiene ${lessons} lecciones de consulta, pero no una ruta paso a paso.`, 'Anadir una mini-ruta: abrir, probar, guardar evidencia.')
  }
  if (!lessons && prompts >= 20) {
    add('Prompts', 'exceso', tool.label, `Tiene ${prompts} prompts sin una leccion visible que explique cuando usarlos.`, 'Mostrar 5 prompts recomendados y ocultar el resto bajo "ver mas".')
  }
  if (!lessons && automations > 0) {
    add('Automatizaciones', 'contexto faltante', tool.label, 'Tiene automatizaciones pero no una explicacion previa de la herramienta.', 'Crear una ficha basica antes de ensenar flujos importables.')
  }
  if (prompts >= 25) {
    add('Prompts', 'calidad frente a cantidad', tool.label, 'El numero 25 se repite como relleno de catalogo.', 'Elegir los 7 mejores por caso real y mover el resto a consulta avanzada.')
  }
}

const jargon = [
  'MCP', 'RAG', 'embedding', 'embeddings', 'endpoint', 'webhook', 'schema',
  'payload', 'token', 'deploy', 'CI/CD', 'API', 'JSON', 'vector', 'guardrail',
  'fallback', 'idempotencia', 'latencia', 'observabilidad', 'rollback',
  'sandbox', 'retrieval', 'chunk', 'workflow', 'prompt', 'router', 'cache',
  'rate limit', 'OAuth', 'credencial',
]

for (const lesson of course.lessons || []) {
  const title = lesson.title || lesson.slug
  if (tooLong(title, 76)) {
    add('Lecciones', 'titulo movil', title, 'El titulo es dificil de escanear en una tarjeta de movil.', 'Crear un titulo corto de alumno y dejar el nombre largo como subtitulo.')
  }
  for (const level of ['basico', 'intermedio', 'avanzado']) {
    const content = lesson[level]
    if (!content) {
      add('Lecciones', 'nivel faltante', `${title} / ${level}`, 'Se anuncia un nivel que no tiene contenido.', 'No mostrarlo o completarlo antes de publicarlo.')
      continue
    }
    if ((content.objectives || []).length > 3) {
      add('Lecciones', 'objetivos', `${title} / ${level}`, `Tiene ${(content.objectives || []).length} objetivos; demasiados para empezar.`, 'Dejar 3 maximo: entender, hacer, comprobar.')
    }
    if ((content.blocks || []).length > 8) {
      add('Lecciones', 'bloques', `${title} / ${level}`, `Tiene ${(content.blocks || []).length} bloques; parece lectura larga.`, 'Compactar en 5 bloques: idea, ejemplo, paso, fallo, resumen.')
    }
    if (words(content.hook).length > 34) {
      add('Lecciones', 'entrada', `${title} / ${level}`, 'El primer parrafo tarda demasiado en decir para que sirve.', 'Empezar con: "Hoy vas a hacer X y comprobar Y".')
    }
    const text = JSON.stringify(content)
    const found = jargon.filter((item) => text.toLowerCase().includes(item.toLowerCase()))
    if (level === 'basico' && found.length >= 4) {
      add('Basico', 'tecnicismos', title, `Aparecen demasiadas palabras tecnicas al principio: ${found.slice(0, 5).join(', ')}.`, 'Anadir una caja "antes de seguir: estas 3 palabras".')
    }
    if ((content.practice?.steps || []).length > 5) {
      add('Practicas', 'pasos', `${title} / ${level}`, `La practica tiene ${content.practice.steps.length} pasos.`, 'Dividirla en dos tandas y cerrar cada una con un unico boton OK.')
    }
  }
}

for (const guide of course.guias || []) {
  if ((guide.tasks || []).length > 4) {
    add('Guias', 'tareas', guide.title || guide.id, `Tiene ${(guide.tasks || []).length} tareas en una sola guia.`, 'Reducir a 3 tareas o partir en guia 1 y guia 2.')
  }
  if (tooLong(guide.intro, 170)) {
    add('Guias', 'intro larga', guide.title || guide.id, 'La introduccion es larga antes de que el alumno haga nada.', 'Poner una frase de resultado y abrir directamente el primer ejemplo.')
  }
}

for (const family of course.prompts || []) {
  const count = family.items?.length || 0
  if (count > 12) {
    add('Prompts', 'familia saturada', family.title || family.id, `Tiene ${count} prompts en una sola familia.`, 'Mostrar primero 5 recomendados y ordenar el resto por caso de uso.')
  }
}

for (const term of course.terms || []) {
  if (words(term.meaning || term.definition).length > 38) {
    add('Diccionario', 'definicion larga', term.term || term.id, 'La definicion parece una mini-leccion.', 'Primera linea en cristiano y despues detalle opcional.')
  }
}

const manual = [
  ['Inicio', 'prioridad', 'Portada', 'Hay demasiadas salidas posibles para el alumno nuevo.', 'Dejar 3: Programa, Mi proyecto, Prompt rapido.'],
  ['Inicio', 'lenguaje', 'Portada', 'La palabra "biblioteca" puede sonar obligatoria.', 'Aclarar "esto es consulta, no deberes".'],
  ['Inicio', 'móvil', 'Area preview', 'Diez areas con porcentaje pueden parecer la ruta obligatoria.', 'Mostrar solo la ruta guiada y dejar areas como mapa secundario.'],
  ['Programa', 'estructura', 'Ruta principal', 'Los bloques 7-10 no tienen ruta principal.', 'Convertirlos en segunda fase o anadir lecciones core.'],
  ['Programa', 'claridad', 'Especializaciones', 'Herramientas y especializaciones se mezclan con programa.', 'Separarlas bajo "cuando ya tengas proyecto".'],
  ['Mi proyecto', 'ejemplos', 'Formulario', 'Faltan ejemplos reales en cada campo.', 'Usar placeholders tipo Airbnb, clinica, agencia, tienda.'],
  ['Mi proyecto', 'decision', 'Recomendaciones', 'La recomendacion de herramientas no explica por que descarta otras.', 'Mostrar "usa esto primero, esto despues, ignora esto".'],
  ['Prompts', 'copy', 'Listado', 'Un alumno no sabe cual copiar primero.', 'Marcar un prompt recomendado por familia.'],
  ['Prompts', 'uso', 'Detalle', 'Falta "donde lo pego" en lenguaje de principiante.', 'Anadir paso 1: abre ChatGPT/Claude/Codex; paso 2: pega; paso 3: cambia datos.'],
  ['Skills', 'jerarquia', 'Catalogo', '100 skills suena impresionante pero abruma.', 'Primero 10 imprescindibles, despues categorias.'],
  ['Skills', 'confusion', 'Instalacion', 'No queda claro si una skill es para ChatGPT, Codex, Cursor o Claude.', 'Mostrar compatibilidad como etiquetas visibles.'],
  ['Kits', 'enfoque', 'Ecommerce', 'Ecommerce aun pesa mucho frente a alquiler vacacional.', 'Fusionar ecommerce en comercio y subir Airbnb a caso estrella.'],
  ['Kits', 'basico', 'Capas tecnicas', 'Capas, entidades y workflows entran antes del caso real.', 'Empezar cada kit con una historia de cliente de 5 lineas.'],
  ['Herramientas', 'filtro', 'Listado', '58 herramientas sin filtro inicial abruman.', 'Anadir filtro "empieza aqui" con 8 herramientas.'],
  ['Herramientas', 'basico', 'Ficha de herramienta', 'El alumno necesita abrir cuenta antes de teoria.', 'Crear bloque "primer clic" con enlace y resultado esperado.'],
  ['Preguntas', 'atajos', 'FAQ', 'La busqueda exige saber la palabra correcta.', 'Anadir chips: pin, movil, precio, cuenta, error, publicar.'],
  ['Diccionario', 'momento', 'Listado', 'El diccionario es grande pero no contextual.', 'Mostrar terminos necesarios en cada leccion antes del listado general.'],
  ['Progreso', 'accion', 'Metricas', 'Niveles completados no dice que hacer despues.', 'Anadir tarjeta "siguiente accion".'],
  ['Progreso', 'copy', 'Tabla', 'Tareas OK es mejor que aciertos, pero aun suena administrativo.', 'Renombrar a "pasos hechos".'],
  ['Guias', 'orden', 'Indice', 'Falta orden de principiante.', 'Agrupar: empieza aqui, publica, herramientas, alquiler vacacional.'],
  ['Superadmin', 'seguridad', 'PIN local', 'PIN 5555 puede parecer seguridad real.', 'Avisar en admin: acceso local para clase, no sistema de usuarios real.'],
  ['Automatizaciones', 'basico', 'n8n', 'Se ensenan flujos antes de explicar trigger, nodo y credencial.', 'Crear intro comun de 3 conceptos con ejemplo de Airbnb.'],
  ['Agentes', 'riesgo', 'MCP/tools', 'El alumno puede confundir agente con chatbot.', 'Usar ejemplo: "chat responde, agente toca herramientas".'],
  ['Airbnb', 'producto', 'Casos', 'Alquiler vacacional debe aparecer como vertical propio.', 'Crear camino: mensajes, incidencias, calendario, resenas, limpieza.'],
  ['Calidad', 'menos es mas', 'Curso completo', 'El producto vende por profundidad pero aprende por foco.', 'Cada pantalla debe tener "haz esto primero" y "lo demas luego".'],
]
for (const item of manual) add(...item)

const selected = issues.slice(0, 200)
const byArea = selected.reduce((acc, issue) => {
  acc[issue.area] = (acc[issue.area] || 0) + 1
  return acc
}, {})

const lines = []
lines.push('# Auditoria 200: mejor calidad, menos ruido y alumno mas basico')
lines.push('')
lines.push(`Generado: ${new Date().toISOString()}`)
lines.push('')
lines.push('## Resumen')
lines.push('')
lines.push(`- Puntos detectados: ${issues.length}`)
lines.push(`- Puntos priorizados aqui: ${selected.length}`)
lines.push(`- Ruta principal: ${mainLessons.length} lecciones`)
lines.push(`- Biblioteca visible: ${course.stats?.lessons || 0} lecciones`)
lines.push(`- Herramientas: ${(course.toolPages || []).length}`)
lines.push(`- Prompts/familias: ${(course.prompts || []).length}`)
lines.push('')
lines.push('## Reparto por zona')
lines.push('')
for (const [area, count] of Object.entries(byArea).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
  lines.push(`- ${area}: ${count}`)
}
lines.push('')
lines.push('## Los 200 primeros')
lines.push('')
selected.forEach((issue, index) => {
  lines.push(`${index + 1}. **${issue.area} / ${issue.tipo}**`)
  lines.push(`   - Donde: ${issue.donde}`)
  lines.push(`   - Problema: ${issue.problema}`)
  lines.push(`   - Solucion: ${issue.solucion}`)
})
lines.push('')
lines.push('## Regla de mejora')
lines.push('')
lines.push('Cada pantalla debe contestar tres cosas antes de ensenar catalogo: que hago primero, que puedo ignorar y como se que lo he hecho bien.')

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.writeFileSync(OUT_FILE, `${lines.join('\n')}\n`)
console.log(`Auditoria escrita en ${path.relative(ROOT, OUT_FILE)}`)
console.log(`Puntos detectados: ${issues.length}`)
console.log(`Puntos priorizados: ${selected.length}`)
