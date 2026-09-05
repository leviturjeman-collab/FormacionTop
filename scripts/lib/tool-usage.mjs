// Educational delivery mode, not a claim that the portal is connected to the user's accounts.
export const TECHNICAL_TOOLS = new Set(['python', 'node', 'docker', 'typescript', 'react', 'vscode', 'tailwind', 'colab', 'langchain'])
const actions = {
  openai: 'Prepara un borrador en ChatGPT; una llamada de API requiere un programa y credencial aparte.',
  anthropic: 'Trabaja en Claude y revisa la respuesta; para usar modelos desde software configura la API por separado.',
  claude: 'Adjunta el documento autorizado, pide el análisis y revisa las citas antes de compartirlo.',
  github: 'Prueba el disparador de una incidencia o cambio de código en un repositorio de prueba.',
  n8n: 'Importa un workflow, conecta sus credenciales y prueba cada nodo antes de activar el disparador.',
  python: 'Guarda el script, instala sus dependencias en un entorno y ejecútalo con datos de prueba.',
  node: 'Instala las dependencias del proyecto y ejecuta el comando documentado con variables de entorno.',
  sheets: 'Prepara una hoja de prueba y verifica qué fila lee o modifica el flujo.',
  codex: 'Abre la carpeta del proyecto, pide un cambio concreto y comprueba el diff y las pruebas.',
  gemini: 'Envía una entrada de prueba en Gemini o AI Studio y revisa la salida antes de integrarla.',
  gmail: 'Conecta una cuenta de prueba y valida los filtros antes de habilitar envío o cambios de correo.',
  'claude-code': 'Abre el proyecto con Claude Code y revisa los archivos cambiados y los comandos ejecutados.',
  copilot: 'Solicita una propuesta en el editor y comprueba sus cambios y pruebas antes de aceptarla.',
  docker: 'Revisa el archivo Compose, inicia los servicios y comprueba puertos, volúmenes y registros.',
  slack: 'Selecciona un canal de prueba y verifica el destinatario del aviso antes de activar el flujo.',
  postgres: 'Prueba la consulta con un usuario limitado y confirma filas afectadas antes de ejecutarla sobre datos reales.',
  supabase: 'Configura tablas, políticas y credenciales; verifica lecturas y escrituras con el rol que usará el alumno.',
  telegram: 'Conecta el bot y verifica el chat de destino con un mensaje de prueba.',
  ollama: 'Descarga una etiqueta de modelo compatible con tu equipo y prueba su respuesta local.',
  vercel: 'Despliega una vista previa y comprueba variables y registros antes de publicar.',
  cursor: 'Abre el repositorio, solicita un cambio y comprueba el diff y las pruebas en el editor.',
  whatsapp: 'Configura la cuenta empresarial y prueba un destinatario autorizado antes de activar envíos.',
  obsidian: 'Guarda notas enlazadas en tu vault; una nota no ejecuta por sí sola una acción externa.',
  langchain: 'Ejecuta la cadena desde tu aplicación con un proveedor configurado y registra entradas y salidas.',
  higgsfield: 'Elige modelo y referencias, genera una muestra y descarga la pieza aprobada.',
  'nano-banana': 'Abre una plataforma que ofrezca el modelo, genera o edita una imagen y revisa el archivo exportado.',
  'seedance-2-5': 'Selecciona Seedance 2.5 en la plataforma disponible, prueba un plano y descarga el vídeo aprobado.',
  base44: 'Construye la aplicación, prueba sus datos y permisos y publica cuando los recorridos funcionen.',
  bolt: 'Genera el proyecto, prueba su vista previa y configura los servicios antes de desplegar.',
  replit: 'Ejecuta el proyecto, configura sus secretos y comprueba el despliegue y sus registros.',
  framer: 'Revisa el diseño en móvil, conecta los formularios y publica después de enviar una prueba.',
  canva: 'Prepara el diseño y exporta el formato que necesita el destinatario; crear el diseño no lo publica.',
  heygen: 'Configura avatar y voz autorizados, genera una muestra y revisa pronunciación y sincronización.',
  descript: 'Importa la grabación, revisa los cortes y exporta la pieza final.',
  'wispr-flow': 'Dicta en un campo de prueba y revisa nombres, cifras y texto antes de enviarlo.',
  gamma: 'Genera el borrador de presentación, revisa cada diapositiva y exporta o comparte la versión aprobada.',
  pipedream: 'Configura el disparador y las cuentas de cada paso, prueba el evento y activa el flujo.',
  notebooklm: 'Añade fuentes autorizadas, contrasta las citas del resumen y exporta el resultado revisado.',
  airtable: 'Prepara una base de prueba y valida los registros que dispara o modifica la integración.',
  lovable: 'Construye la interfaz, configura datos y permisos y prueba los recorridos antes de publicar.',
  v0: 'Genera la interfaz, integra el código en el proyecto y verifica sus datos y acciones reales.',
  elevenlabs: 'Selecciona voz y modelo, genera una muestra y descarga el audio revisado.',
  midjourney: 'Selecciona versión, genera variantes y descarga la imagen aprobada para su uso final.',
  runway: 'Elige el modelo, genera o edita un plano y exporta el resultado revisado.',
  zapier: 'Configura disparador y acciones con cuentas de prueba y verifica el historial antes de activar.',
  make: 'Configura módulos y conexiones, ejecuta un caso de prueba y revisa el historial del escenario.',
  typescript: 'Compila el código y ejecuta sus pruebas; el tipo estático no sustituye la validación de datos.',
  react: 'Conecta los componentes con datos y acciones, ejecuta la aplicación y prueba el recorrido del usuario.',
  vscode: 'Abre la carpeta y ejecuta las tareas del proyecto; el editor por sí solo no despliega ni envía datos.',
  notion: 'Configura la base y los permisos de integración antes de probar creación o actualización de páginas.',
  huggingface: 'Selecciona un modelo y revisa licencia y requisitos; ejecútalo en tu entorno o endpoint configurado.',
  perplexity: 'Investiga la consulta, abre las fuentes y guarda las conclusiones verificadas.',
  figma: 'Diseña y prueba el prototipo; para tener una aplicación real hay que implementar sus acciones y datos.',
  colab: 'Ejecuta el notebook con datos de prueba y guarda sus salidas antes de que termine la sesión.',
  tailwind: 'Aplica los estilos dentro del proyecto y comprueba el resultado en tamaños de pantalla reales.',
  replicate: 'Selecciona modelo y versión, configura el acceso y prueba una predicción antes de integrarla.',
}

export function usageFor(id, guide) {
  const hasRecipes = Boolean(guide.automations?.length)
  return {
    mode: hasRecipes ? 'recipe_requires_configuration' : TECHNICAL_TOOLS.has(id) ? 'local_project_execution' : 'manual_product_workflow',
    action: actions[id] || guide.first?.[0] || 'Sigue la guía y comprueba el resultado antes de entregarlo.',
    integration: hasRecipes ? 'Configuración pendiente en las cuentas y servicios del alumno; no hay conexión activa desde el portal.' : 'La guía no ejecuta operaciones en cuentas externas. Una integración programática necesita configuración y pruebas propias.',
    result: hasRecipes ? 'Historial de ejecución y resultado en el servicio de destino.' : 'Archivo, cambio o entrega revisada por el alumno en la herramienta indicada.',
    source: hasRecipes ? 'scripts/lib/automations-reales.mjs o guide.automations' : 'scripts/lib/tool-usage.mjs y guía de la herramienta',
  }
}

export function addToolUsage(guide, id) {
  const usage = usageFor(id, guide)
  const en = process.env.LOCALE === 'en'
  guide.usage = usage
  guide.catalog.items.unshift({
    group: en ? 'Real-world use' : 'Uso en tareas reales',
    name: en ? 'How this produces a result' : 'Cómo se obtiene un resultado',
    what: en ? (guide.first?.[0] || 'Follow the tool guide and inspect the output before delivery.') : usage.action,
    useWhen: en ? 'Use a test case in your own workspace and keep the resulting file, changed record or execution log.' : usage.result,
    model: en ? (guide.automations?.length ? 'These are recipes to configure and test in your own accounts. Reading or copying a recipe does not activate an integration.' : 'The portal provides guidance. Perform the task in the named tool; programmatic integration requires separate configuration and testing.') : usage.integration,
    avoidWhen: en ? 'Do not treat a prompt, prototype or downloaded template as evidence of a completed external action.' : 'Un prompt, un prototipo o una plantilla descargada no demuestran que se haya realizado una acción externa.',
  })
  return guide
}
