/**
 * Repara los flujos de n8n de la biblioteca.
 *
 * Los flujos venían de un generador que dejó cuatro cosas rotas, todas
 * comprobadas ejecutándolos en un n8n real:
 *
 *  1. `connections` declaraba SIEMPRE los dos orígenes, "Webhook" y "Schedule",
 *     aunque solo existiera uno de los dos nodos. n8n rechaza la importación
 *     entera con "Connection source does not reference an existing node".
 *  2. El nodo de validación leía `$json.email`, pero un webhook entrega
 *     `{ headers, params, query, body }`: el dato está en `$json.body.email`.
 *     Resultado: todos los casos salían por la misma rama.
 *  3. La condición era `input.email === ''`, que es falsa cuando el campo no
 *     viene (`undefined !== ''`). O sea que ni con la ruta corregida validaba.
 *  4. Los flujos disparados por hora llevaban un "Respond to Webhook" sin
 *     ninguna petición HTTP que contestar.
 *
 * Además se les añade `pinData`, que es lo que permite al alumno pulsar
 * "Execute workflow" y ver algo sin montar nada por fuera.
 *
 * Uso:  node scripts/repair-workflows.mjs [--dry]
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const seco = process.argv.includes('--dry')

const CARPETAS = [
  '35_AUTOMATIZACIONES_SKILLS_BIBLIOTECA/workflows_n8n_40',
  '34_PRODUCTO_EJECUTABLE_PREMIUM/workflows_n8n_importables',
  '27_ASSETS_EJECUTABLES_Y_DEMOS/workflows',
]

const ES_DISPARADOR = /Trigger$|webhook$|cron$/i

/** Datos de ejemplo por categoría, para que el flujo se pueda probar de vacío. */
const EJEMPLOS = {
  ventas: { lead_id: 'LEAD-2026-0148', nombre: 'Marta Solís', email: 'marta.solis@ejemplo.es', empresa: 'Construcciones Solís SL', telefono: '+34 600 111 222', interes: 'formación para 12 personas', origen: 'web' },
  soporte: { ticket_id: 'SUP-4471', email: 'cliente@ejemplo.es', asunto: 'No puedo acceder al panel', cuerpo: 'Desde ayer me sale error 500 al entrar. He probado con dos navegadores.', prioridad: 'alta', canal: 'email' },
  finanzas: { factura_id: 'F-2026-0312', proveedor: 'Suministros Delta SA', cif: 'A12345678', fecha: '2026-08-14', base: 1250, iva: 262.5, total: 1512.5, email: 'admin@ejemplo.es' },
  contenido: { titulo: 'Cómo automatizar la bandeja de entrada', texto: 'Artículo de 900 palabras sobre clasificar correos con IA y revisión humana.', canal: 'blog', idioma: 'es', email: 'redaccion@ejemplo.es' },
  productividad: { asunto: 'Resumen del día', responsable: 'Marta', email: 'marta@ejemplo.es', pendientes: 3, fecha: '2026-09-01' },
  datos: { fuente: 'manual_producto.pdf', paginas: 42, email: 'datos@ejemplo.es', coleccion: 'manuales' },
  seguridad: { repositorio: 'academia/portal', hallazgo: 'clave en texto plano', severidad: 'alta', email: 'seguridad@ejemplo.es' },
  ingenieria: { repositorio: 'academia/portal', issue: 412, titulo: 'El botón de guardar no responde', autor: 'levi', email: 'dev@ejemplo.es' },
  _defecto: { referencia: 'PRUEBA-0001', nombre: 'Caso de ejemplo', email: 'prueba@ejemplo.es', mensaje: 'Texto de prueba para ver el flujo funcionando.', fecha: '2026-09-01' },
}

/** Los campos que el flujo exige. El alumno los cambia por los suyos. */
function requeridosPara(ejemplo) {
  const claves = Object.keys(ejemplo)
  return claves.includes('email') ? ['email'] : claves.slice(0, 1)
}

function codigoValidacion({ nombreFlujo, categoria, requeridos }) {
  return `// Campos que este flujo necesita para poder trabajar.
// Cambia esta lista por los campos que de verdad te hagan falta a ti.
const REQUERIDOS = ${JSON.stringify(requeridos)};

// Un webhook no entrega los datos sueltos: entrega
// { headers, params, query, body } y lo tuyo va dentro de body.
// Si el flujo arranca por hora en vez de por webhook, no hay body y
// los datos vienen tal cual. Esta linea cubre los dos casos.
const entrada = $json.body ?? $json;

// Falta un campo si no viene, si viene nulo o si viene en blanco.
// Comparar solo con '' deja pasar los que no vienen: ese era el fallo.
const faltan = REQUERIDOS.filter((campo) => {
  const valor = entrada[campo];
  return valor === undefined || valor === null || String(valor).trim() === '';
});

return [{
  json: {
    ...entrada,
    workflow: ${JSON.stringify(nombreFlujo)},
    category: ${JSON.stringify(categoria)},
    faltan,
    status: faltan.length > 0 ? 'needs_review' : 'processed',
    checked_at: new Date().toISOString(),
  },
}];`
}

function nombreDesdeCodigo(codigo, porDefecto) {
  const m = /workflow:\s*'([^']+)'/.exec(codigo || '')
  return m ? m[1] : porDefecto
}

const informe = { revisados: 0, reparados: 0, cambios: {}, sinTocar: [] }
const apunta = (clave) => { informe.cambios[clave] = (informe.cambios[clave] || 0) + 1 }

for (const carpeta of CARPETAS) {
  const dir = path.join(raiz, carpeta)
  let ficheros = []
  try {
    ficheros = (await fs.readdir(dir)).filter((f) => f.endsWith('.json'))
  } catch {
    console.log(`  (no existe ${carpeta})`)
    continue
  }

  for (const fichero of ficheros) {
    const ruta = path.join(dir, fichero)
    const flujo = JSON.parse(await fs.readFile(ruta, 'utf8'))
    if (!Array.isArray(flujo.nodes) || !flujo.connections) continue
    informe.revisados++
    let tocado = false

    const nombres = new Set(flujo.nodes.map((n) => n.name))
    const disparador = flujo.nodes.find((n) => ES_DISPARADOR.test(n.type))
    const esWebhook = Boolean(disparador && /webhook/i.test(disparador.type))
    const categoria = flujo.meta?.category || '_defecto'
    const ejemplo = EJEMPLOS[categoria] || EJEMPLOS._defecto

    /* 1. Orígenes fantasma: la razón por la que n8n no dejaba importar. */
    for (const origen of Object.keys(flujo.connections)) {
      if (!nombres.has(origen)) {
        delete flujo.connections[origen]
        apunta('origen fantasma eliminado')
        tocado = true
      }
    }

    /* 2. El webhook, a la versión que sí espera al nodo Respond. */
    if (disparador && esWebhook) {
      if ((disparador.typeVersion || 1) < 2) { disparador.typeVersion = 2; apunta('webhook a typeVersion 2'); tocado = true }
      if (disparador.parameters?.options?.responseMode !== 'responseNode' && disparador.parameters?.responseMode !== 'responseNode') {
        disparador.parameters = { ...disparador.parameters, responseMode: 'responseNode' }
        apunta('webhook con responseMode responseNode')
        tocado = true
      }
    }

    /* 3. Los disparados por hora, con zona horaria de aquí. */
    if (disparador && /scheduleTrigger/i.test(disparador.type)) {
      if (!flujo.settings?.timezone) {
        flujo.settings = { ...(flujo.settings || {}), timezone: 'Europe/Madrid' }
        apunta('zona horaria Europe/Madrid')
        tocado = true
      }
    }

    for (const nodo of flujo.nodes) {
      /* 4. El nodo Function está retirado del panel, y su código no validaba. */
      if (nodo.type === 'n8n-nodes-base.function') {
        const nombreFlujo = nombreDesdeCodigo(nodo.parameters?.functionCode, flujo.name || fichero)
        nodo.type = 'n8n-nodes-base.code'
        nodo.typeVersion = 2
        nodo.parameters = { jsCode: codigoValidacion({ nombreFlujo, categoria, requeridos: requeridosPara(ejemplo) }) }
        apunta('Function -> Code, con validación de verdad')
        tocado = true
      }

      /* 5. Responder a un webhook que no existe no tiene sentido. */
      if (nodo.type === 'n8n-nodes-base.respondToWebhook' && !esWebhook) {
        nodo.type = 'n8n-nodes-base.noOp'
        nodo.typeVersion = 1
        nodo.parameters = {}
        nodo.name = nodo.name === 'Respond' ? 'Fin' : nodo.name
        apunta('Respond sin webhook -> noOp')
        tocado = true
      } else if (nodo.type === 'n8n-nodes-base.respondToWebhook' && !nodo.parameters?.respondWith) {
        nodo.parameters = { respondWith: 'json', responseBody: '={{ $json }}' }
        apunta('Respond vacío -> devuelve el JSON')
        tocado = true
      }
    }

    /* Si se ha renombrado Respond, las conexiones tienen que seguirle. */
    const nombresFinales = new Set(flujo.nodes.map((n) => n.name))
    for (const [origen, salida] of Object.entries(flujo.connections)) {
      for (const rama of salida.main || []) {
        for (const destino of rama) {
          if (!nombresFinales.has(destino.node) && destino.node === 'Respond') {
            destino.node = 'Fin'
            apunta('conexión hacia Respond renombrada')
            tocado = true
          }
        }
      }
      void origen
    }

    /* 6. Datos de ejemplo para poder pulsar "Execute" y ver algo. */
    if (disparador && !flujo.pinData) {
      flujo.pinData = {
        [disparador.name]: [
          esWebhook
            ? { headers: { 'content-type': 'application/json' }, params: {}, query: {}, body: ejemplo }
            : ejemplo,
        ],
      }
      apunta('datos de ejemplo (pinData)')
      tocado = true
    }

    if (tocado) {
      informe.reparados++
      if (!seco) await fs.writeFile(ruta, JSON.stringify(flujo, null, 2) + '\n', 'utf8')
    } else {
      informe.sinTocar.push(carpeta + '/' + fichero)
    }
  }
}

console.log(seco ? 'SIMULACRO, no se ha escrito nada' : 'Reparación aplicada')
console.log(`  flujos revisados : ${informe.revisados}`)
console.log(`  flujos reparados : ${informe.reparados}`)
for (const [k, v] of Object.entries(informe.cambios).sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(v).padStart(4)}  ${k}`)
}
if (informe.sinTocar.length) console.log(`  sin tocar: ${informe.sinTocar.length}`)
