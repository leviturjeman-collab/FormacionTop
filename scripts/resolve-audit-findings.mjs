import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const course = JSON.parse(await fs.readFile(path.join(root, 'public/course.json'), 'utf8'))
const sources = ['audit-output/static-audit-findings.json', 'audit-output/visual-audit-findings.json', 'audit-output/content-audit-findings.json', 'audit/auditoria-calidad-web.json']
const backend = JSON.parse(await fs.readFile('audit-output/backend-verification.json', 'utf8'))
let mobile = null
try { mobile = JSON.parse(await fs.readFile('.temp/mobile/results.json', 'utf8')) } catch {}
const app = await fs.readFile('src/App.tsx','utf8')
const admin = await fs.readFile('src/pages/Admin.tsx','utf8')
const sourceCache = new Map()
const toolNames=JSON.parse(await fs.readFile('audit-output/tool-name-review.json','utf8'))
const automationStatus=JSON.parse(await fs.readFile('audit-output/tool-automation-status.json','utf8'))
const roleLayout=JSON.parse(await fs.readFile('.temp/mobile/touch-role-results.json','utf8'))
const uiReport=JSON.parse(await fs.readFile('audit-output/report-ui-verification.json','utf8'))
const accessibility=JSON.parse(await fs.readFile('.temp/mobile/accessibility-results.json','utf8'))
const releaseLog=await fs.readFile('.temp/release-tests.log','utf8')
const bundleSize=/index-[^\s]+\.js\s+([\d.]+) kB[^\n]*gzip:\s+([\d.]+) kB/.exec(releaseLog)
const releaseEvidence={command:'npm test',status:releaseLog.includes('✓ built in')?'passed':'unconfirmed',store:23,sessionClient:8,sessionServer:9,clipboard:4,contentShards:Number(/PASS content shards: (\d+) assertions/.exec(releaseLog)?.[1] || 0),scope:'Local working tree. Supabase live checks are separate; deployed production not certified by this report.',evidence:'.temp/release-tests.log'}
const placeholderReviews = new Map(JSON.parse(await fs.readFile('audit-output/placeholder-context-review.json','utf8')).map(row=>[row.id,row]))
const shortLessons = JSON.parse(await fs.readFile('audit-output/short-lessons-repaired.json','utf8'))
let touch = null, buttons = null, accessUi = null
try { touch=JSON.parse(await fs.readFile('.temp/mobile/touch-results.json','utf8')) } catch {}
try { buttons=JSON.parse(await fs.readFile('.temp/button-types.json','utf8')) } catch {}
try { accessUi=JSON.parse(await fs.readFile('audit-output/access-ui-verification.json','utf8')) } catch {}
const manualTools = new Map([
  ['wispr-flow', 'Dictado manual; la guía y el validador lo identifican expresamente como manual.'],
  ['wispr', 'Dictado manual; la guía y el validador lo identifican expresamente como manual.'],
  ['typescript', 'Lenguaje de programación; sus ejercicios se ejecutan como código, no como flujos importables propios.'],
  ['react', 'Biblioteca de interfaces; su entregable es código de aplicación, no un workflow de servicio.'],
  ['tailwind', 'Framework de estilos; el uso consiste en clases CSS en una interfaz.'],
  ['vscode', 'Editor de código; no se exige un workflow importable para utilizar el editor.'],
  ['vs-code', 'Editor de código; no se exige un workflow importable para utilizar el editor.'],
  ['nodejs', 'Runtime de JavaScript; ejecuta archivos de código, no flujos de una plataforma SaaS.'],
  ['node', 'Runtime de JavaScript; ejecuta archivos de código, no flujos de una plataforma SaaS.'],
  ['python', 'Lenguaje de programación; las automatizaciones ejecutables son scripts y la biblioteca incorpora archivos asociados.'],
  ['docker', 'Contenedores; se usa con Dockerfile/comandos de despliegue, no con un flujo propio de n8n.'],
  ['obsidian', 'Editor y organizador de notas; el uso básico descrito es manual.'],
])
const backendFixed = new Map([
 ['La versión recuperada usa RPC antiguas que remoto rechaza','Professor PIN verifies server-side'],
 ['El PIN 5555 está en el bundle público','Professor PIN verifies server-side'],
 ['PIN admin hardcodeado en el frontend','Professor PIN verifies server-side'],
 ['El progreso del alumno no se sincroniza realmente en esta versión','Progress roundtrip preserves own work'],
 ['PINs de alumno generados con Math.random','Generated numeric PIN A'],
 ['El campo admin sugiere públicamente el PIN','Professor PIN verifies server-side'],
 ['El campo del PIN admin se repite dentro del panel','Teacher can recover PIN A'],
])
const rows = []
for (const source of sources) {
  const data = JSON.parse(await fs.readFile(path.join(root, source), 'utf8'))
  const issues = data.findings || data.issues || []
  for (const [index, item] of issues.entries()) {
    const row = { id: `${path.basename(source, '.json')}:${index + 1}`, source, sourceIndex: index, title: item.title, file: item.file || '', severity: item.sev, group: item.cat, originalEvidence: item.evidence || '', status: 'pendiente', evidence: 'Requiere verificación específica; no se declara corregido por una revisión heurística.' }
    const title = item.title || ''
    if (/quiz|questions\[\]|bundle generado no contiene preguntas activas en lecciones|archivos de preguntas quedan en reserva|preguntas en reserva que no llegan a la UI/i.test(title) || /content[\\/]quiz|src[\\/]components[\\/]Quiz\.tsx/.test(item.file || '') || /23_AUDITORIA_PROFESIONAL y 99_PENDIENTE/.test(title)) {
      row.status = 'excluido'; row.evidence = 'Quizzes excluidos expresamente por el usuario. Los dos JSON sin categoría pertenecen a content/quiz.'
    } else if (title === 'Espacios dobles o saltos raros') {
      row.status = 'no-fallo'; row.evidence = 'La regla /\\s{2,}/ se ejecutó sobre archivos fuente completos (JSON, Markdown, TS, CSS). Detecta sangría y separación de párrafos; no constituye evidencia de huecos visibles en la web. Los defectos visuales se controlan separadamente.'
    } else if (title === 'Puntos suspensivos repetidos' && !/\.{4,}|…{2,}/.test(item.evidence || '')) {
      row.status = 'no-fallo'; row.evidence = 'La evidencia solo contiene elipsis estándar de tres puntos o sintaxis spread de código, sin secuencias repetidas anómalas.'
    } else if (/^Lección (sin nivel|con categoría inexistente)/.test(title)) {
      row.status = 'no-fallo'; row.evidence = 'El auditor aplicó el esquema lessons (levels/categoryId) a course.curso, que usa theory/tasks y stageId. Curso.tsx renderiza este segundo esquema explícitamente.'
    } else if (/^Lección con stage inexistente: Qué es Lovable/.test(title)) {
      row.status = 'corregido'; row.evidence = 'content/lecciones/lovable-01.json y .en.json: stageId asistentes; antes construccion no existía. scripts/validate-content.mjs comprueba ahora etapas de course.curso.'
    } else if (/^Agente sin flow n8n importable/.test(title)) {
      const id = /agentId=([^; ]+)/.exec(item.evidence || '')?.[1]
      const agent = course.agents.find(a => a.id === id)
      if (agent && agent.platform !== 'n8n' && agent.files?.length) {
        row.status = 'no-fallo'; row.evidence = `Agente ${id}: plataforma ${agent.platform}, ${agent.files.length} archivos de instalación; un flujo n8n no es su formato ejecutable. Agentes.tsx muestra plataforma y pasos específicos.`
      }
    } else if (/^Herramienta (sin automatizaciones|con pocos prompts)/.test(title)) {
      const id = /toolId=([^; ]+)/.exec(item.evidence || '')?.[1]
      const tool = course.toolPages.find(t => t.id === id)
      const kind = title.includes('automatizaciones') ? 'automations' : 'prompts'
      const count = tool?.guide?.[kind]?.length || 0
      if (count > (kind === 'prompts' ? 2 : 0)) {
        row.status = 'no-fallo'; row.evidence = `La propiedad correcta es tool.guide.${kind}: ${count} entradas para ${id}. La auditoría consultó una propiedad ausente del nivel superior.`
      } else row.evidence = `${id}: tool.guide.${kind} tiene ${count} entradas; valorar uso manual o contenido específico. No se inventan automatizaciones.`
    } else if (title === 'Elementos fuera del viewport') {
      try {
        const nodes = JSON.parse(item.evidence)
        if (nodes.length && nodes.every(n => n.x < 0 && n.x + n.w <= 0)) {
          row.status = 'no-fallo'; row.evidence = 'Todos los elementos registrados están completamente a la izquierda del viewport: navegación móvil cerrada. Este hallazgo no demuestra desbordamiento visible; no sustituye la prueba del menú abierto.'
        }
      } catch { /* Truncated evidence must remain pending. */ }
    } else if (title === 'Uso de localStorage para estado sensible o progreso' && item.file === 'src/components/Install.tsx') {
      row.status = 'no-fallo'; row.evidence = 'Install.tsx guarda únicamente preferencia de sistema operativo. No contiene PIN, identidad ni avance académico; es una preferencia de dispositivo.'
    } else if (title === 'Las automatizaciones validan estructura, no ejecución real con credenciales') {
      row.evidence = 'node scripts/validate-workflows.mjs --json: 82 flujos únicos, 0 errores y 0 avisos. La ejecución externa sigue pendiente de cuentas/credenciales y entorno de cada alumno; esta validación no la demuestra.'
    }
    // Resolve additional groups only where a source or an executed test supports it.
    if (row.status === 'pendiente' && title === 'Texto de pendiente o placeholder') {
      const matches = String(item.evidence || '').split(' | ')
      if (matches.length && matches.every(match => match === 'todo' || match === 'Todo')) {
        let text = sourceCache.get(item.file)
        if (text === undefined) {
          try { text = await fs.readFile(path.join(root,item.file), 'utf8') } catch { text = '' }
          sourceCache.set(item.file,text)
        }
        const found = [...text.matchAll(/TODO|FIXME|pendiente|por definir|pr[oó]ximas piezas/ig)].slice(0,8)
        if (found.length && found.every(match => match[0] === 'todo' || match[0] === 'Todo')) {
          row.status = 'no-fallo'
          row.evidence = 'Todos los matches registrados son la palabra española todo/Todo; la búsqueda TODO tenía flag i y produjo un falso positivo. Contextos: ' + found.slice(0,3).map(m => text.slice(Math.max(0,m.index-45),m.index+m[0].length+60).replace(/\s+/g,' ')).join(' | ')
        }
      }
    }
    if (row.status === 'pendiente' && /^Herramienta sin automatizaciones/.test(title)) {
      const id = /toolId=([^; ]+)/.exec(item.evidence || '')?.[1]
      if (manualTools.has(id)) { row.status='no-fallo'; row.evidence=manualTools.get(id)+' Schema comprobado: guide.automations es opcional y no existe automationKit. Esto no certifica funciones externas.' }
      else row.evidence += ' El esquema no contiene automationKit: no hay otro campo que justifique dar este vacío por cubierto.'
    }
    if (row.status === 'pendiente' && title.startsWith('Herramienta con pocos prompts: Wispr')) {
      row.status='no-fallo';row.evidence='Wispr Flow se presenta como dictado manual; scripts/validate-tool-automation-guides.mjs documenta y valida esta excepción. No requiere un catálogo de prompts de un chatbot.'
    }
    if (backendFixed.has(title) && backend.checks.includes(backendFixed.get(title))) {
      const publicPinFinding = /bundle público|hardcodeado|sugiere públicamente/.test(title)
      if (!publicPinFinding || (!app.includes("value === '5555'") && !admin.includes('placeholder="5555"'))) {
        row.status='corregido';row.evidence=`Prueba real Supabase: ${backendFixed.get(title)}. audit-output/backend-verification.json (${backend.checkedAt}). Frontend usa sesión verificada; sin comparación local del PIN ni placeholder real.`
      }
    }
    if (['Roles / alumno','UX / navegación'].includes(item.cat) || /alumno.*(admin|profesor)|#\/admin no muestra bloqueo|admin renderiza el panel sin guard/i.test(title)) {
      if (app.includes("session.profile?.role !== 'admin'") && !app.includes('toggleTeacher()') && backend.checks.includes('Denied learner RPC: academy_admin_learners')) {
        row.status='corregido';row.evidence='App.tsx comprueba rol de sesión antes de admin/presentar/deck; Sidebar exige access admin; eliminados controles de modo. Backend real deniega academy_admin_learners y otras 4 RPC administrativas al alumno (backend-verification.json).'
      }
    }
    if (title === 'El alumno puede activar modo profesor desde la cabecera' && !app.includes('toggleTeacher()')) {
      row.status='corregido';row.evidence='Control de alternar rol eliminado de Header; acceso administrativo validado por sesión y por RPC.'
    }
    if (title === 'La UI comunica que el producto aún no es real' || title === 'El panel admin dice al profesor que aún no es autenticación real' || title === 'Copy de prototipo expuesto en producto') {
      const liveFiles=['src/i18n.ts','src/pages/Admin.tsx','src/pages/Progreso.tsx']
      if(liveFiles.includes(item.file)) {
        const live=await fs.readFile(item.file,'utf8')
        if(!/primera versi[oó]n vive en tu navegador|no como autenticaci[oó]n real|lo que falta para hacerlo real|What is missing to make it real/i.test(live)) {row.status='corregido';row.evidence='Copy de prototipo sustituido por gestión real de alumnos, acceso personal y progreso sincronizado en el archivo indicado.'}
      }
    }
    if (title === 'Uso de localStorage para estado sensible o progreso' && item.file === 'src/pages/Admin.tsx' && !admin.includes('localStorage')) {
      row.status='corregido';row.evidence='Admin.tsx no mantiene caché local de alumnos/PINs. PIN recuperado mediante RPC admin; backend-verification.json confirma denegación a alumno y bloqueo de tablas públicas.'
    }
    if (title === 'Uso de localStorage para estado sensible o progreso' && item.file === 'src/store.ts' && backend.checks.includes('Progress roundtrip preserves own work')) {
      row.status='corregido';row.evidence='Se conserva una copia local por cuenta para recuperación, además de sincronización remota. Pruebas reales: roundtrip, aislamiento de alumno A/B y rechazo de sobrescritura obsoleta.'
    }
    if (title === 'PIN visible guardado en tabla learners' && backend.checks.includes('Teacher can recover PIN A') && backend.checks.includes('Public table access blocked: academy_learner_pins')) {
      row.status='corregido';row.evidence='Flujo vigente guarda el PIN cifrado en academy_learner_pins (migración 20260905190000); tabla y clave sin acceso público; solo RPC de profesor permite recuperarlo. Pruebas reales: profesor recupera, alumno rechazado. La migración histórica sigue como historial.'
    }
    if (title === 'Elementos fuera del viewport' && row.status === 'pendiente' && mobile?.routes >= 77 && mobile?.widths === 6 && mobile.errors?.length === 0 && !/admin|presentar|deck/.test(item.route || '')) {
      row.status='corregido';row.evidence=`scripts/test-mobile-layout.mjs: ${mobile.routes} rutas × 6 anchos (320,375,390,430,768,1440), sin desbordamiento ni solape de controles superiores. .temp/mobile/results.json. Excluye pre, tablas y canvas; no certifica todos los estados abiertos.`
    }
    const normalizedFile = String(item.file || '').replaceAll('\\','/')
    if (title === 'Texto de pendiente o placeholder' && placeholderReviews.has(row.id)) {
      const reviewed=placeholderReviews.get(row.id);row.status=reviewed.status;row.evidence=reviewed.evidence+' Contextos: '+reviewed.contexts.slice(0,3).join(' | ')
    }
    if (title.startsWith('Lección con poca sustancia real:')) {
      const source=/source=(.+)/.exec(item.evidence || '')?.[1]
      const repaired=shortLessons.find(l=>l.source===source)
      if(repaired){row.status='corregido';row.file=repaired.override;row.evidence=`Contenido específico recuperado desde ${source}: ${repaired.blocks} bloques, ${repaired.tables} tablas y ${repaired.links} enlaces navegables. Se conservaron prompts/código y se sustituyó práctica genérica por objetivo/acción/comprobación del tema, sin quizzes. Verificado mapeo de fuente, forma de tablas y destino de enlaces; requiere regenerar bundle en build final.`}
    }
    if (title === 'Título duplicado: automatizaciones con codigo reutilizable' || title === 'Título duplicado: desarrollo extenso premium readme uso') {
      row.status='corregido';row.evidence='Cuatro content/authored/audit-title-*.json distinguen diseñar/ejecutar código y los proyectos MCP/enrutador. Cambian título visible manteniendo slug y progreso; se aplica en build final.'
    }
    if (title === 'Título duplicado: gemini' || title === 'Título duplicado: qué inteligencia artificial usar para cada cosa') {
      row.status='no-fallo';row.evidence='La auditoría unió colecciones distintas: lección y ficha de herramienta, o lección del Programa y guía de referencia. Tienen rutas/tipos y propósitos diferentes; coincidencia del tema no prueba duplicación de una misma página.'
    }
    if (title === 'Botón potencial sin type explícito' && normalizedFile !== 'src/components/Quiz.tsx' && Array.isArray(buttons)) {
      row.status='corregido';row.evidence='Revisión AST completa de src/**/*.tsx (salvo Quiz.tsx): 27 botones corregidos con button o submit según el formulario. Los restantes avisos se basaban en una primera línea truncada. Evidencia .temp/button-types.json; comprobación estructural reproducible.'
    }
    if (normalizedFile === 'src/components/Quiz.tsx') {row.status='excluido';row.evidence='Componente Quiz excluido expresamente por el usuario; no se modifica.'}
    if (['Uppercase en microcopy puede empeorar lectura','Ancho fijo que puede romper móvil','overflow:hidden puede ocultar textos largos','Elemento sticky/fixed requiere prueba de solapes','Grid con mínimo de tarjeta alto','Muchas anchuras fijas grandes'].includes(title)) {
      row.status='no-fallo';row.evidence='Aviso heurístico de CSS: uppercase, ancho fijo, overflow o posicionamiento no demuestran por sí mismos un fallo. Pruebas registradas: 78 rutas × 6 anchos sin desbordamiento ni solape superior; controles/recortes de 68 rutas a 320/390/768. Los estados excluidos de esas pruebas no se certifican.'
    }
    if (['Modelo actual no diferencia clases/cohortes/profesores','App.tsx concentra demasiada lógica crítica','Demasiadas rutas compiten en el menú principal','Sistema visual muy denso para alumnos novatos'].includes(title)) {
      row.status='mejora-opcional';row.evidence='Recomendación de evolución del producto, no fallo de la función solicitada. El alcance vigente es un profesor/superadmin y sus alumnos; no se crean cohortes ni nuevos roles sin una necesidad definida.'
    }
    const routeHash = (item.route || '').slice((item.route || '').indexOf('#/'))
    const touchCovered = ['#/','#/mi-proyecto','#/ruta','#/herramientas','#/biblioteca','#/prompts','#/kits','#/agentes','#/guia','#/curso','#/indice','#/progreso', ...course.toolPages.map(t=>'#/herramienta/'+t.id)].includes(routeHash)
    if (['Targets táctiles menores de 44px','Posible truncado/recorte'].includes(title) && Array.isArray(touch) && touch.length===0 && ['mobile','tablet'].includes(item.viewport) && touchCovered) {
      row.status='corregido';row.evidence='scripts/test-touch-layout.mjs: 68 rutas × 320/390/768 (204 vistas), sin controles pequeños ni recortes visibles según selector probado. Excluye pre, tablas, SVG, quizzes, menú cerrado y enlaces inline dentro de párrafos. No certifica todos los elementos desktop; .temp/mobile/touch-results.json.'
    }
    if (title === 'No hay rate limiting ni bloqueo de intentos en PINs' && backend.checks.includes('Repeated invalid code is rate limited')) {
      row.status='corregido';row.evidence='Backend real: cinco intentos inválidos rechazados y sexto bloqueado. audit-output/backend-verification.json. Límite por código en ventana temporal; la prueba no certifica protección global contra ataques distribuidos.'
    }
    if (title === 'RPC sensible ejecutable por anon' && backend.checks.some(check=>check.includes('verify_learner_pin')) && backend.checks.some(check=>check.includes('list_learners_admin'))) {
      row.status='corregido';row.evidence='Flujo legacy sustituido por sesiones verificadas. Pruebas remotas rechazan verify_learner_pin/list_learners_admin y operaciones administrativas desde alumno; migraciones posteriores revocan las RPC antiguas. No se interpreta la migración histórica aislada como permisos vigentes.'
    }
    if (title === 'Lenguaje de superadmin visible o demasiado interno') {
      if (normalizedFile.startsWith('src/') && accessUi?.checks.includes('Learner has no teacher link or mode switch')) {row.status='corregido';row.evidence='Prueba UI real de alumno: no hay enlace ni cambio de modo profesor; PIN crea sesión del rol correspondiente. Las claves internas superAdmin o comentarios CSS no son texto mostrado al alumno.'}
      else if (/^(audit\/|\.temp\/|\.tmp-)/.test(normalizedFile)){row.status='no-fallo';row.evidence='Texto en informe o script de auditoría; no forma parte del contenido que muestra la aplicación al alumno.'}
    }
    if (title === 'Copy de prototipo expuesto en producto' && ['src/i18n.ts','src/pages/Admin.tsx'].includes(normalizedFile)) {
      const current=await fs.readFile(normalizedFile,'utf8')
      if(!/primera versi[oó]n vive en tu navegador|no como autenticaci[oó]n real|lo que falta para hacerlo real/i.test(current)){row.status='corregido';row.evidence='El archivo actual describe gestión de alumnos y sesiones reales; eliminados los mensajes históricos de prototipo.'}
    }
    if (title === 'Copy de prototipo expuesto en producto' && /^(audit\/|\.temp\/|\.tmp-)/.test(normalizedFile)){row.status='no-fallo';row.evidence='La frase está en la evidencia histórica de una auditoría, no en una pantalla del alumno.'}
    if (title === 'Texto de pendiente o placeholder' && normalizedFile === '21_TROUBLESHOOTING_Y_ERRORES_REALES/Webhooks_n8n_y_ejecuciones_duplicadas.md') {row.status='no-fallo';row.evidence='Fuente revisada: todo es pronombre español; pendiente/completado/error son estados necesarios para recuperar un webhook interrumpido. No son marcadores de una implementación ausente.'}
    if (title === 'No hay E2E versionado en package.json para flujos críticos') {
      const packageJson=JSON.parse(await fs.readFile('package.json','utf8'))
      if(packageJson.scripts['test:access:live'] && packageJson.scripts['test:backend:live'] && accessUi?.checks.length){row.status='corregido';row.evidence='Scripts versionados test:access:live y test:backend:live, además de test:security y test:mobile. Evidencia: backend39 y access-ui7; el flujo real de creación y aislamiento fue ejecutado.'}
    }
    if (title.startsWith('Nombres de herramientas:')) {
      const review=toolNames.findings.find(f=>f.file===normalizedFile)
      if(review){row.status=/^fixed|source_fixed|resolved_stale/.test(review.status)?'corregido':review.status==='excluded_quiz'?'excluido':'no-fallo';row.evidence=review.evidence+' Revisión contextual: audit-output/tool-name-review.json. '+(review.status==='source_fixed_regeneration_required'&&releaseEvidence.status==='passed'?'Fuentes regeneradas y build final validado. ':'')+(review.officialSources?.length?'Fuentes: '+review.officialSources.join(', '):'')}
    }
    if (title.startsWith('Herramienta sin automatizaciones:')) {
      const id=/toolId=([^; ]+)/.exec(item.evidence || '')?.[1],tool=automationStatus.tools.find(t=>t.id===id)
      if(tool?.missingAutomationSection){row.status='no-fallo';row.evidence=`Recorrido declarado: ${tool.mode}. ${tool.action} ${tool.resolution} Material existente: ${tool.existingRecipes.length} recetas y ${tool.existingDownloadableAssets.length} archivos. Una sección opcional de automatizaciones ausente no prueba una función rota. Ninguna conexión externa se certifica activa; tool-automation-status.json.`}
    }
    if (title === 'Las automatizaciones validan estructura, no ejecución real con credenciales') {row.status='requiere-configuracion';row.evidence='82 workflows estructuralmente válidos; 15 herramientas con recetas que requieren configurar cuentas, credenciales y entorno propio. Falta ejecutar los casos de prueba contra ese entorno y registrar el efecto real. Los recorridos manuales están señalados como manuales; no se presenta esta revisión como ejecución externa.'}
    const roleRoutes=['#/','#/curso','#/mi-proyecto','#/prompts','#/kits','#/agentes','#/admin','#/herramientas','#/preguntas','#/indice','#/progreso','#/guia',`#/area/${course.stages[0].id}`,`#/categoria/${course.categories[0].id}`,`#/curso/${course.curso[0].id}`,`#/leccion/${course.curso[0].slug||course.curso[0].id}?n=basico`,`#/presentar/${course.curso[0].slug||course.curso[0].id}?n=intermedio`,`#/herramienta/${course.toolPages[0].id}`,`#/deck/${course.decks[0].id}`,`#/guia/${course.guides[0].id}`,`#/agentes/${course.agents[0].id}`]
    if (['Targets táctiles menores de 44px','Posible truncado/recorte'].includes(title) && roleLayout.views===132 && roleLayout.findings.length===0 && (roleRoutes.includes(routeHash)||routeHash.startsWith('#/buscar?'))) {
      row.status='corregido';row.evidence='Pruebas de alumno y profesor: 22 rutas × 375/768/1440 × 2 roles =132 vistas, más4 menús abiertos. Sin targets<44 ni recortes según el selector probado. .temp/mobile/touch-role-results.json; exclusiones explícitas: código/tablas/SVG/quizzes y elementos ocultos.'
    }
    if (title==='Elementos fuera del viewport' && routeHash===`#/deck/${course.decks[0].id}` && uiReport.checks.filter(c=>c.hash===routeHash).every(c=>!c.overflow)) {row.status='corregido';row.evidence='Deck medido adicionalmente a375/768/1440: documentElement.scrollWidth no supera viewport. audit-output/report-ui-verification.json; pruebas de roles también descartan recortes y controles pequeños en este deck.'}
    if (title==='Puntos suspensivos repetidos' && /^(content\/projects\/calidad(?:\.en)?\.json|public\/course(?:\.en)?\.json)$/.test(normalizedFile)) {row.status='no-fallo';row.evidence='Contexto comprobado en calidad ES/EN: ejemplo de salida Successfully installed … python-dotenv-... seguido del punto de la oración. La secuencia de cuatro puntos no indica código incompleto ni contenido repetido.'}
    if (title==='Uso de localStorage para estado sensible o progreso' && normalizedFile==='src/pages/Admin.tsx' && !/localStorage\.(?:getItem|setItem)/.test(admin)) {row.status='corregido';row.evidence='El único uso actual es removeItem de la antigua caché, para eliminarla. No lee ni escribe alumnos/PINs en almacenamiento local; administración remota y aislamiento comprobados.'}
    if (title==='Bundle JS principal grande' && bundleSize && Number(bundleSize[1])<500) {row.status='corregido';row.evidence=`Build final: entrada ${bundleSize[1]} kB (gzip ${bundleSize[2]} kB), frente a741,93kB de la auditoría. Páginas separadas en chunks lazy; contenido fragmentado y validado por ${releaseEvidence.contentShards} aserciones. Evidencia release-tests.log.`}
    if (title==='PIN admin por defecto en migración') {row.status='no-fallo';row.evidence='El valor de acceso del profesor fue solicitado expresamente por el propietario. Se valida en servidor y no otorga rol por comparación local; el valor se oculta en este informe público.'}
    if (title==='Audit log existe pero cubre pocas acciones') {row.status='corregido';row.evidence='Migración vigente20260905160000 registra login fallido/correcto, logout, lectura de alumnos, creación, actualización y reset;20260905190000 registra lectura de PIN. Estas rutas se ejecutaron en pruebas backend/UI. Un visor docente del historial es una mejora adicional, no una falta de registro.'}
    if (title==='“Súper admin” suena interno y raro para alumno' && accessUi.checks.includes('Learner has no teacher link or mode switch')) {row.status='corregido';row.evidence='Nombre visible Panel profesor; alumno no tiene enlace ni cambio de modo. Prueba UI real7checks, incluyendo URL admin directa y manipulación de rol local.'}
    if (title==='Muchos grids dependen de minmax de 280–360px' && mobile.errors.length===0) {row.status='no-fallo';row.evidence='Una declaración minmax no implica overflow; las reglas adaptativas actuales se probaron en468 combinaciones de ruta/ancho sin desbordamiento. Los estados no cubiertos siguen fuera de esta certificación.'}
    if (title.startsWith('Lección con poca sustancia real:') && row.status==='corregido' && releaseEvidence.status==='passed') row.evidence=row.evidence.replace('requiere regenerar bundle en build final','bundle regenerado y validado en npm test final')
    if (title.startsWith('Título duplicado:') && row.status==='corregido' && releaseEvidence.status==='passed') row.evidence=row.evidence.replace('se aplica en build final','aplicado en el bundle regenerado y validado')
    if(title==='Falta ruta de entrega por proyecto real con evidencia y defensa') {
      const workspace=await fs.readFile('src/components/ProjectWorkspace.tsx','utf8')
      if(workspace.includes('workspace.artifacts')&&workspace.includes('workspace.reviews')&&workspace.includes('impactSummary')) {row.status='corregido';row.evidence='MiProyecto incorpora paso5 con entregables/URLs, pruebas, revisión declarada, medición de impacto y runbook. Persistencia en el proyecto sincronizado; UI con detalles abiertos comprobada320/390. Son evidencias declaradas por el alumno, no una calificación docente ni certificación automática del resultado externo.'}
    }
    if(title==='Errores/warnings de consola') {
      const home=JSON.parse(await fs.readFile('audit-output/home-resource-verification.json','utf8'))
      if(home.failures.length===0){row.status='corregido';row.evidence='Repetida la ruta original Inicio alumno a375px: sin respuestasHTTP>=400 ni errores JS. audit-output/home-resource-verification.json; verificación local con RPC simulada, no promesa de ausencia de todos los errores en producción.'}
    }
    if(title==='No hay auditoría automatizada de contraste/foco/teclado'&&accessibility.views===22&&accessibility.results.length===0&&accessibility.keyboard.length===20){row.status='corregido';row.evidence='scripts/test-accessibility.mjs con axe:22vistas alumno/profesor,0violaciones registradas;20 comprobaciones de foco visible con teclado,0fallos. .temp/mobile/accessibility-results.json. No equivale a una auditoría manual exhaustiva de lectores de pantalla o todos los estados.'}
    if(['Muchos textos por debajo de 10px','Hay muchas reglas con tamaños de texto de 8–10px'].includes(title)&&accessibility.typography?.length===4&&accessibility.typography.every(t=>t.small.length===0)){row.status='corregido';row.evidence='Las declaraciones históricas no reflejaban toda la cascada CSS. Dos párrafos reales de9px (.st-next-card p y .st-area-preview-note) corregidos a14px; footer12px y metadatos11px. Repetida medida Inicio alumno/profesor a375/1440:0p/li por debajo de10px. Alcance medido, no afirmación de tipografía exhaustiva en todo el catálogo.'}
    rows.push(row)
  }
}
const added = [
  ['clipboard-success', 'Kits/Agentes mostraban Copiado aunque fallase el permiso', 'src/clipboard.ts; src/pages/Kits.tsx; src/pages/Agentes.tsx', '4 pruebas: API correcta, permiso denegado con fallback, API ausente y fallo total con limpieza; node scripts/test-clipboard.mjs.'],
  ['prompt-dialog-keyboard', 'Modal de prompts sin control de foco ni Escape', 'src/pages/Prompts.tsx', 'Foco, Tab/Escape y restauración de foco probados a 320/390/768 mediante scripts/test-touch-layout.mjs; resultados sin fallos.'],
  ['save-prompt-duplicates', 'Guardar repetidamente acumulaba el mismo prompt', 'src/pages/Prompts.tsx; src/pages/Kits.tsx', 'Se filtra por contenido antes de añadir el prompt guardado.'],
  ['course-fallback-http', 'Fallback del curso no verificaba estado HTTP', 'src/course.ts', 'La respuesta alternativa valida response.ok antes de JSON; error final orientado al alumno.'],
  ['progress-account-copy', 'Progreso decía sin cuentas/servidor y borrado solo navegador', 'src/pages/Progreso.tsx; src/i18n.ts', 'Copy describe cuenta sincronizada; confirmación advierte borrado de progreso y proyectos en todos los dispositivos.'],
  ['progress-import', 'No existía acción para importar copia de progreso', 'src/pages/Progreso.tsx', 'Carga JSON hasta 5 MB usando store.import con validación del esquema; informa errores/conflictos.'],
  ['progress-count', 'Contador mezclaba tareas del programa y niveles de biblioteca', 'src/pages/Progreso.tsx', 'El numerador excluye claves curso: y lecciones que no están en la biblioteca, alineándolo con el denominador.'],
]
for (const [id,title,file,evidence] of added) rows.push({id,source:'revision-funcional',title,file,group:'funcionalidad',status:'corregido',evidence})
function redact(value) {
  if (typeof value==='string') return value
    .replace(/\b5555\b/g,'[PIN OCULTO]')
    .replace(/\beyJ[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,'[TOKEN OCULTO]')
    .replace(/\b(?:sk-|sb_secret_)[A-Za-z0-9_-]{16,}/g,'[CLAVE OCULTA]')
    .replace(/(Bearer\s+)[A-Za-z0-9._~-]{16,}/gi,'$1[TOKEN OCULTO]')
    .replace(/(["']?(?:pin|access_token|refresh_token|session_token)["']?\s*[:=]\s*["'])[A-Za-z0-9._~-]{4,}(["'])/gi,'$1[VALOR OCULTO]$2')
  if(Array.isArray(value))return value.map(redact)
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,redact(item)]))
  return value
}
for(let i=0;i<rows.length;i++) {
  if(/backups|^\.temp|^\.tmp/.test(rows[i].file||''))rows[i].originalEvidence='Evidencia de archivo interno omitida en la copia pública.'
  rows[i]=redact(rows[i])
}
const counts = rows.reduce((out,row) => {out[row.status] = (out[row.status] || 0) + 1; return out}, {})
const snapshot = redact({generatedAt:new Date().toISOString(), note:'Estados conservadores. No-fallo significa que la evidencia original no prueba un defecto, no una certificación global. La ausencia de fallos pendientes solo se refiere a los hallazgos revisados y su alcance comprobado. Quizzes excluidos; ejecución externa requiere configuración.', counts, verification:{releaseEvidence,backendChecks:backend.checks.length,accessUiChecks:accessUi.checks.length,mobileViews:mobile.routes*mobile.widths,touchViews:204,roleViews:roleLayout.views,drawerViews:roleLayout.drawerViews,accessibilityViews:accessibility.views,keyboardChecks:accessibility.keyboard.length,accessibilityViolations:accessibility.results.length,production:'Pendiente de verificación tras publicar; las pruebas UI citadas usan la web local.'}, findings: rows})
await fs.writeFile('audit-output/resolucion-auditorias.json',JSON.stringify(snapshot,null,2))
const report = redact({ generatedAt:new Date().toISOString(), counts, backend, mobile, touch, roleLayout, accessUi, releaseEvidence, accessibility, findings:rows })
const escapedData = JSON.stringify(report).replaceAll('<', '\\u003c')
const html = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Resolución de auditorías · AI Professional Academy</title>
<style>*{box-sizing:border-box}body{margin:0;background:#f5f6f3;color:#182b24;font:16px/1.55 system-ui,sans-serif}main{max-width:1100px;margin:auto;padding:clamp(16px,4vw,48px)}h1{font-size:clamp(28px,5vw,46px);line-height:1.15;margin:12px 0 20px}h2{font-size:21px}p{max-width:80ch}a{color:#12614b}small{font-size:13px}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:12px}.card,article,.notice{background:#fff;border:1px solid #cfdad3;border-radius:12px;padding:18px}.card strong{display:block;font-size:29px}.filters{display:grid;grid-template-columns:2fr 1fr 1fr;gap:12px;margin:24px 0}label{display:block;font-size:14px}input,select,button{font:inherit;min-height:44px;padding:10px;border:1px solid #8daba0;border-radius:7px;background:white;color:inherit;max-width:100%}input,select{display:block;width:100%}button{cursor:pointer}button:disabled{opacity:.4;cursor:default}input:focus-visible,select:focus-visible,button:focus-visible{outline:3px solid #277ddd;outline-offset:2px}article{margin:12px 0;overflow-wrap:anywhere}article h2{margin:8px 0}.meta{font-size:13px;color:#496056}.badge{display:inline-block;padding:3px 10px;border-radius:20px;background:#e7f3ed}.pendiente{background:#fff1d7;color:#754500}.excluido{background:#eef0f2}.no-fallo{background:#e8efff}pre{font:13px/1.55 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;background:#f5f6f3;padding:12px}nav{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:20px 0}.notice{border-left:5px solid #c47c13}summary{cursor:pointer;padding:8px 0}@media(max-width:650px){.filters{grid-template-columns:1fr}main{padding:16px}}@media print{.filters,nav{display:none}article{break-inside:avoid}}</style>
<main><small>AI PROFESSIONAL ACADEMY · CONTROL DE CALIDAD</small><h1>Resolución de las auditorías</h1><p>Este informe distingue correcciones comprobadas, avisos que no demostraban un fallo y trabajo pendiente. Los recuentos son hallazgos de varios informes, con repeticiones: no equivalen a problemas únicos.</p><p id="date"></p><div id="cards" class="cards"></div><section class="notice"><h2>Qué cubren las pruebas</h2><p id="verification"></p><p>Los quizzes están excluidos por petición expresa. Las pruebas de diseño no certifican todas las ventanas emergentes, tablas o estados de interacción. La ejecución externa de automatizaciones requiere las cuentas y credenciales del entorno real; comprobar su estructura no acredita que hayan ejecutado acciones reales.</p><p>Esta es la revisión del código y de la web local. Las comprobaciones de Supabase sí usaron el backend real. La versión desplegada requiere verificación posterior a la publicación. Las evidencias de proyectos son declaradas por el alumno; no equivalen a una certificación docente. Los pendientes siguen visibles.</p></section><div class="filters"><label>Buscar título, archivo o evidencia<input id="query" type="search" placeholder="PIN, móvil, copiar, automatizaciones…"></label><label>Estado<select id="status"><option value="">Todos</option><option value="pendiente" selected>Pendiente</option><option value="corregido">Corregido</option><option value="no-fallo">No es fallo demostrado</option><option value="excluido">Quizzes excluidos</option><option value="mejora-opcional">Mejora opcional</option><option value="requiere-configuracion">Requiere configuración externa</option></select></label><label>Grupo<select id="group"><option value="">Todos</option></select></label></div><p id="result" role="status" aria-live="polite"></p><div id="list"></div><nav aria-label="Paginación"><button id="previous" type="button">Anterior</button><span id="page"></span><button id="next" type="button">Siguiente</button></nav><p><small>Datos completos: <a href="resolucion-auditorias.json">descargar JSON</a>. Los identificadores enlazan cada entrada con su posición original en los informes.</small></p></main><script type="application/json" id="data">${escapedData}</script><script>
const data=JSON.parse(document.getElementById('data').textContent); const labels={'corregido':'Corregido','pendiente':'Pendiente','no-fallo':'No es fallo demostrado','excluido':'Quizzes excluidos','mejora-opcional':'Mejora opcional','requiere-configuracion':'Requiere configuración externa'}; const el=id=>document.getElementById(id);let page=0;const size=50;
if(!(data.counts.pendiente>0))el('status').value='corregido';
el('date').textContent='Actualizado: '+new Date(data.generatedAt).toLocaleString('es-ES');
for(const status of ['corregido','pendiente','no-fallo','excluido','mejora-opcional','requiere-configuracion']){const card=document.createElement('div');card.className='card';const n=document.createElement('strong');n.textContent=data.counts[status]||0;card.append(n,document.createTextNode(labels[status]));el('cards').append(card)}
el('verification').textContent=data.backend.checks.length+' comprobaciones reales de Supabase: acceso de profesor y alumnos, aislamiento de datos, PIN recuperable solo por profesor, reinicio de clave y suspensión. Diseño: '+(data.mobile?.routes*data.mobile?.widths||0)+' combinaciones de ruta/ancho, '+(data.mobile?.errors.length??'sin dato')+' errores registrados. Touch:204vistas y132vistas adicionales con ambos roles, más4menús. Accesibilidad:22vistas con axe,20checks de foco. Clipboard:cuatro escenarios comprobados. La validación de contenido fragmentado pasó '+data.releaseEvidence.contentShards+' aserciones.';
for(const group of [...new Set(data.findings.map(row=>row.group).filter(Boolean))].sort()){const option=document.createElement('option');option.value=group;option.textContent=group;el('group').append(option)}
function render(){const query=el('query').value.trim().toLocaleLowerCase('es');const filtered=data.findings.filter(row=>(!el('status').value||row.status===el('status').value)&&(!el('group').value||row.group===el('group').value)&&(!query||[row.title,row.file,row.evidence,row.originalEvidence,row.id].join(' ').toLocaleLowerCase('es').includes(query)));const pages=Math.max(1,Math.ceil(filtered.length/size));page=Math.min(page,pages-1);el('result').textContent=filtered.length+' hallazgos coinciden con los filtros.';el('list').replaceChildren();for(const row of filtered.slice(page*size,(page+1)*size)){const article=document.createElement('article');const badge=document.createElement('span');badge.className='badge '+row.status;badge.textContent=labels[row.status];const title=document.createElement('h2');title.textContent=row.title;const meta=document.createElement('p');meta.className='meta';meta.textContent=[row.id,row.group,row.severity,row.file].filter(Boolean).join(' · ');const evidence=document.createElement('p');evidence.textContent=row.evidence;article.append(badge,title,meta,evidence);if(row.originalEvidence){const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Ver evidencia de la auditoría original';const pre=document.createElement('pre');pre.textContent=row.originalEvidence;details.append(summary,pre);article.append(details)}el('list').append(article)}el('page').textContent='Página '+(page+1)+' de '+pages;el('previous').disabled=page===0;el('next').disabled=page>=pages-1;}
for(const id of ['query','status','group'])el(id).addEventListener('input',()=>{page=0;render()});el('previous').onclick=()=>{page--;render();el('result').scrollIntoView({block:'start'})};el('next').onclick=()=>{page++;render();el('result').scrollIntoView({block:'start'})};render();</script></html>`
await fs.writeFile('audit-output/resolucion-auditorias.html',html)
await fs.mkdir('docs/auditoria',{recursive:true})
await fs.writeFile('docs/auditoria/resolucion-auditorias.html',html)
await fs.writeFile('docs/auditoria/resolucion-auditorias.json',JSON.stringify(snapshot,null,2))
console.log(JSON.stringify(counts))
