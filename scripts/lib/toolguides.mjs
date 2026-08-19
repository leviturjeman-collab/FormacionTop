/**
 * Guías completas de herramienta, para alguien que empieza de cero.
 *
 * Cada guía responde, en este orden, lo que necesita quien nunca ha programado:
 *   1. Qué es esto, sin una sola palabra técnica sin traducir.
 *   2. Cómo me creo la cuenta, paso a paso y con lo que voy a ver en pantalla.
 *   3. Qué hago dentro la primera vez.
 *   4. Qué palabras voy a leer y qué significan.
 *   5. Qué importa de verdad y qué puedo ignorar.
 *   6. El código para copiar y pegar.
 *   7. Preguntas para comprobar que lo he entendido.
 */

const q = (prompt, options, explain) => ({ prompt, options, explain })
const ok = (text, why) => ({ text, correct: true, why })
const no = (text, why) => ({ text, correct: false, why })

export const TOOL_GUIDES = {
  chatgpt: {
    tool: 'openai',
    plain:
      'Es una página web donde escribes lo que necesitas y una inteligencia artificial te responde. Funciona como un chat de WhatsApp: tú escribes abajo, la respuesta aparece arriba. No hay que instalar nada ni saber programar.',
    account: {
      url: 'chatgpt.com',
      free: 'Hay versión gratuita y sirve perfectamente para todo el principio del curso. La de pago (unos 23 € al mes) da modelos mejores y menos esperas.',
      steps: [
        ['Entra en chatgpt.com', 'Escríbelo directamente en la barra del navegador. Cuidado con las apps de imitación: la web oficial no pide descargar nada.'],
        ['Pulsa "Sign up"', 'Está arriba a la derecha. Significa "crear cuenta", frente a "Log in", que es entrar con una que ya tienes.'],
        ['Elige cómo entrar', 'Con tu correo de Google es lo más rápido y no tienes que inventar otra contraseña.'],
        ['Confirma tu correo', 'Te llega un email con un botón. Si no aparece en cinco minutos, mira en la carpeta de spam.'],
        ['Pon tu número de teléfono', 'Lo piden para evitar cuentas falsas. Te llega un SMS con un código de seis cifras.'],
        ['Ya estás dentro', 'Verás una caja de texto en el centro. Ahí es donde escribes.'],
      ],
      warning: 'Antes de escribir nada de un cliente: ve a Settings → Data controls y desactiva "Improve the model for everyone". Si no, lo que escribas puede usarse para entrenar.',
    },
    first: [
      'Escribe cualquier cosa en la caja y pulsa intro. Lo primero es perderle el miedo.',
      'Crea un Proyecto en la barra lateral: es una carpeta que recuerda instrucciones para todas sus conversaciones.',
      'Dentro del proyecto, escribe en "Instructions" quién eres y cómo quieres que te responda. Se aplicará siempre sin repetirlo.',
      'Arrastra un documento tuyo al proyecto. A partir de ahí puede responder sobre él.',
    ],
    words: [
      ['Prompt', 'Lo que tú escribes. Es simplemente el encargo, en español de toda la vida.'],
      ['Modelo', 'La "versión de cerebro" que responde. Los hay más rápidos y baratos, y más lentos y capaces.'],
      ['Contexto', 'Todo lo que la IA tiene delante en ese momento: tu mensaje y lo hablado antes. Tiene un tamaño máximo.'],
      ['Token', 'El trocito en que se parte el texto para contarlo. Una palabra larga son dos o tres. Se factura por tokens.'],
      ['Alucinación', 'Cuando se inventa un dato con toda naturalidad. No miente a propósito: rellena el hueco.'],
    ],
    matters: [
      'Las conversaciones largas empeoran. Cuando notes que se lía, abre una nueva y pega lo importante.',
      'Los Proyectos son la diferencia entre usarlo de juguete y usarlo para trabajar.',
      'Desactivar el entrenamiento antes de meter datos de clientes.',
      'Guardar en un archivo los prompts que te funcionan: la conversación se pierde entre cientos.',
    ],
    ignore: [
      'Los GPTs de la tienda: casi todos son un prompt metido en una caja.',
      'Los "prompts mágicos" de los vídeos. Lo que funciona es ser concreto, no una fórmula secreta.',
      'Cambiar de modelo a cada rato mientras aprendes.',
    ],
    questions: [
      q('Estás usando ChatGPT para redactar respuestas a clientes y les pegas el email completo con nombre y teléfono. ¿Qué deberías haber hecho antes?',
        [
          ok('Desactivar el uso de tus datos para entrenamiento en Settings → Data controls', 'Correcto, y es un ajuste de treinta segundos. Por defecto viene activado, y no basta con confiar: es un dato de un tercero que te lo confió.'),
          no('Nada, es una herramienta conocida y por tanto segura', 'Conocida no significa autorizada para tratar los datos de otra persona. Son cosas distintas.'),
          no('Avisar al cliente de que usas IA', 'Es buena práctica y no resuelve el problema: el dato ya habría salido igual.'),
        ],
        'El dato de un cliente no es tuyo. Solo lo custodias.'),
      q('Llevas una hora de conversación y empieza a contradecirse. ¿Qué haces?',
        [
          ok('Abrir una conversación nueva y pegar solo lo importante', 'Sí. Lo del principio se ha salido de su memoria de trabajo. Empezar de cero con un resumen es más rápido que pelearse.'),
          no('Repetirle que se fije en lo que dijisteis antes', 'Ya no lo tiene delante. Puedes repetírselo diez veces y seguirá sin estar.'),
          no('Cambiar a un modelo mejor', 'El límite de memoria no se arregla cambiando de modelo: solo lo mueve un poco más lejos.'),
        ],
        'La memoria de una conversación tiene borde. Cuando se llena, lo viejo se cae.'),
    ],
  },

  'claude-code': {
    tool: 'claude',
    plain:
      'Es un ayudante que trabaja dentro de la carpeta de tu proyecto. En vez de copiar y pegar código de una web, le hablas en español y él abre tus archivos, los cambia y ejecuta lo que haga falta. Se usa desde la terminal, que es esa ventana negra donde se escriben órdenes.',
    account: {
      url: 'claude.ai',
      free: 'Necesita una cuenta de Claude. Con la suscripción Pro (unos 20 € al mes) va incluido; también funciona pagando por uso con una clave de API.',
      steps: [
        ['Crea la cuenta en claude.ai', 'Con tu correo. Confirma el email que te llega.'],
        ['Instala Node.js', 'Es el programa que permite instalar Claude Code. Está en el bloque de instalación de más abajo, para copiar y pegar.'],
        ['Instala Claude Code', 'Copia y pega: npm install -g @anthropic-ai/claude-code'],
        ['Abre la terminal en tu carpeta', 'En Windows: clic derecho en la carpeta → "Abrir en Terminal". En Mac: clic derecho → Servicios → "Nuevo terminal en la carpeta".'],
        ['Escribe claude y pulsa intro', 'La primera vez te abre el navegador para que autorices tu cuenta. Después ya no lo vuelve a pedir.'],
      ],
      warning: 'Antes de dejarle tocar nada, tu proyecto tiene que estar en git. Es el botón de deshacer: sin él, un cambio que no te guste no se puede revertir.',
    },
    first: [
      'Crea un archivo llamado CLAUDE.md en la raíz del proyecto con las reglas: qué hace el proyecto, cómo se arranca y qué no debe tocar. Lo lee cada vez.',
      'Pídele algo pequeño y concreto: "lee el archivo X y explícame qué hace". Sin cambios todavía.',
      'Cuando te fíes, pídele un cambio de una sola cosa.',
      'Después de cada cambio, escribe git diff para ver exactamente qué tocó.',
    ],
    words: [
      ['Terminal', 'La ventana donde escribes órdenes en vez de hacer clic. No es más difícil que el explorador de archivos: es que no tiene botones.'],
      ['Repositorio', 'La carpeta de tu proyecto, con su historial de cambios guardado.'],
      ['git', 'El sistema que guarda ese historial. Son los puntos de guardado de un videojuego.'],
      ['diff', 'La lista de lo que cambió: qué líneas se añadieron y cuáles se quitaron.'],
      ['Rama', 'Una copia paralela donde probar sin tocar lo que funciona.'],
    ],
    matters: [
      'El archivo CLAUDE.md es lo que más cambia la calidad del resultado, y casi nadie lo escribe.',
      'Revisar el diff siempre, aunque sea aburrido. Es tu firma la que va en ese código.',
      'Pedir cambios pequeños. "Refactoriza el proyecto" da resultados imprevisibles.',
      'Trabajar en una rama: equivocarse pasa a ser gratis.',
    ],
    ignore: [
      'Intentar que haga el proyecto entero de una vez.',
      'Discutir con él cuando se equivoca dos veces seguidas. Sal, piensa qué contexto le falta y vuelve.',
      'Aprender todos los comandos de git antes de empezar. Con cinco vas sobrado.',
    ],
    questions: [
      q('Le pides un cambio y toca quince archivos. ¿Qué haces antes de darlo por bueno?',
        [
          ok('Mirar el diff archivo por archivo, con el proyecto en git para poder deshacer', 'Correcto. El diff te enseña exactamente qué cambió y git te da el botón de deshacer. Sin las dos cosas, es una apuesta.'),
          no('Ejecutar el programa: si arranca, está bien', 'Que arranque no dice nada de los otros catorce archivos. Los peores fallos no impiden arrancar.'),
          no('Preguntarle a él si su cambio está bien', 'Te dirá que sí con mucha convicción. Es justo donde menos fiable resulta.'),
        ],
        'Sin control de versiones, un ayudante potente es un riesgo, no una ayuda.'),
      q('¿Qué es lo primero que deberías crear en un proyecto nuevo antes de usarlo?',
        [
          ok('Un archivo CLAUDE.md con las reglas del proyecto', 'Sí. Es su contexto permanente: cómo se arranca, qué convenciones seguís y qué no debe tocar. Cinco minutos aquí ahorran horas después.'),
          no('Una carpeta de documentación completa', 'Está bien tenerla, pero no es lo que lee para trabajar.'),
          no('Nada especial, funciona igual', 'Funciona, sí, pero adivinando. Y adivina peor cuanto más grande es el proyecto.'),
        ],
        'Un ayudante sin contexto adivina. Con contexto, acierta.'),
    ],
  },

  n8n: {
    tool: 'n8n',
    plain:
      'Es un tablero donde montas procesos automáticos arrastrando cajitas y uniéndolas con líneas. Cada cajita hace una cosa: recibir un email, mirar si cumple una condición, escribir en una hoja de cálculo. No se programa: se conecta.',
    account: {
      url: 'n8n.io',
      free: 'Dos opciones. En la nube tiene prueba gratuita y luego se paga. En tu ordenador con Docker es gratis para siempre, y es lo que usamos en el curso.',
      steps: [
        ['Decide dónde: en tu ordenador', 'Es gratis y no depende de nadie. Necesita Docker, que se instala con el bloque de más abajo.'],
        ['Copia y pega el bloque de instalación', 'Levanta n8n y una base de datos de una vez.'],
        ['Abre localhost:5678 en el navegador', 'Es la dirección de tu propio ordenador. Ahí está n8n funcionando.'],
        ['Crea tu usuario local', 'La primera vez te pide correo y contraseña. Son solo para tu instalación: no hay que confirmarlos por email.'],
        ['Pulsa el "+" de arriba a la derecha', 'Ahí empieza tu primer flujo.'],
      ],
      warning: 'Un flujo activo actúa de verdad: envía correos reales y escribe en sistemas reales. Prueba siempre con datos inventados antes de activarlo.',
    },
    first: [
      'Crea un flujo y ponle nombre inmediatamente. "Workflow 1" repetido veinte veces es un infierno.',
      'Añade el primer nodo con "Add first step" y elige "Trigger manually" para practicar.',
      'Añade un nodo "Edit Fields (Set)" y crea un campo de prueba.',
      'Pulsa "Test step" en cada nodo: ejecuta solo ese y te enseña lo que sale. Así se trabaja: nodo a nodo.',
    ],
    words: [
      ['Nodo', 'Cada cajita del tablero. Una hace una sola cosa.'],
      ['Trigger o disparador', 'El nodo que arranca todo. Responde a "¿cuándo se ejecuta esto?".'],
      ['Webhook', 'Una dirección web que tú das a otro programa para que te avise cuando pasa algo.'],
      ['Credencial', 'El usuario y contraseña de un servicio, guardados dentro de n8n para no escribirlos cada vez.'],
      ['Ejecución', 'Cada vez que el flujo se pone en marcha. Quedan guardadas en "Executions" y ahí ves qué pasó.'],
      ['JSON', 'La forma en que viajan los datos entre nodos. Son parejas de nombre y valor, como una ficha.'],
    ],
    matters: [
      'La dirección del webhook de prueba y la de producción son distintas. Confundirlas es el error número uno.',
      'La pestaña "Executions" es tu caja negra: qué entró, qué decidió y qué salió en cada nodo.',
      'Un nodo en rojo detiene el flujo entero salvo que le digas lo contrario en sus ajustes.',
      'Las credenciales se comparten entre flujos: cambiar una afecta a todos.',
    ],
    ignore: [
      'El catálogo entero de integraciones. Vas a usar cinco.',
      'Colocar los nodos bonitos en el tablero: no cambia nada.',
      'Las plantillas de la comunidad al empezar: traen veinte nodos y no entiendes ninguno.',
    ],
    questions: [
      q('Montas un flujo que envía un email de bienvenida y lo activas para probar con tu lista real de contactos. ¿Qué pasa?',
        [
          ok('Se envían correos de verdad a esas personas, y no hay forma de deshacerlo', 'Exacto. Un flujo activo no simula: actúa. Por eso se prueba siempre con una dirección tuya y datos inventados antes de tocar la lista real.'),
          no('n8n pide confirmación antes de enviar correos reales', 'No la pide. Hace exactamente lo que le has montado.'),
          no('Se envían en modo prueba y se pueden cancelar', 'No existe ese modo. Enviado es enviado.'),
        ],
        'Un workflow no simula: actúa desde el primer minuto.'),
      q('Un nodo devuelve un campo vacío y los siguientes fallan en cadena. ¿Cuál es el arreglo correcto?',
        [
          ok('Comprobar los datos nada más entrar y desviar a una rama de error que deje registro', 'Sí. Se valida en la frontera, antes de tocar nada. Y la rama de error tiene que dejar rastro: sin registro, el fallo se repite y nadie sabe por qué.'),
          no('Poner reintentos automáticos en los nodos siguientes', 'Reintentar un dato vacío da un dato vacío. Multiplicas llamadas sin arreglar la causa.'),
          no('Ignorar el error para que el flujo continúe', 'Acabas con registros a medias en sistemas reales, que es peor que no haber ejecutado nada.'),
        ],
        'Validar pronto, fallar claro, dejar rastro.'),
    ],
  },

  github: {
    tool: 'github',
    plain:
      'Es una nube donde se guarda el código con todo su historial. Como Google Drive, pero recordando cada cambio: quién lo hizo, cuándo y qué tocó exactamente. Te permite volver atrás en el tiempo si algo se rompe.',
    account: {
      url: 'github.com',
      free: 'Gratis, y con repositorios privados ilimitados. No hace falta pagar nada para el curso entero.',
      steps: [
        ['Entra en github.com y pulsa "Sign up"', 'Te pide correo, contraseña y un nombre de usuario.'],
        ['Elige bien el nombre de usuario', 'Va a salir en la dirección de todos tus proyectos y es tu carta de presentación. Mejor tu nombre que un apodo.'],
        ['Confirma el correo', 'Te llega un código de ocho cifras.'],
        ['Activa la verificación en dos pasos', 'Settings → Password and authentication. Te lo van a exigir tarde o temprano; mejor hacerlo con calma ahora.'],
        ['Activa el escáner de secretos', 'Settings → Code security. Te avisa si subes una clave sin querer.'],
      ],
      warning: 'Lo que subes queda en el historial aunque lo borres después. Si se te escapa una contraseña, hay que anularla en su servicio: borrarla de GitHub no basta.',
    },
    first: [
      'Crea un repositorio con el botón "+" de arriba a la derecha. Márcalo privado si dudas.',
      'Copia los comandos que te enseña la propia página para conectarlo con tu carpeta.',
      'Haz tu primer commit: es una foto del estado actual con un mensaje que explica qué cambiaste.',
      'Escribe el README: es lo primero que ve cualquiera que llegue, incluido un cliente.',
    ],
    words: [
      ['Repositorio', 'La carpeta de un proyecto con su historial. Se dice "repo".'],
      ['Commit', 'Una foto guardada del proyecto, con un mensaje que explica el cambio.'],
      ['Push', 'Subir tus commits a la nube.'],
      ['Pull', 'Bajarte los cambios que hay en la nube.'],
      ['Rama', 'Una línea paralela para probar sin romper la principal.'],
      ['Pull Request', 'Proponer que tus cambios entren en la rama principal, para revisarlos antes.'],
    ],
    matters: [
      'Crear el archivo .gitignore ANTES del primer commit, con .env dentro.',
      'Mensajes de commit que digan qué cambió y por qué. "cambios" no sirve de nada dentro de seis meses.',
      'El README con instalación, uso y límites.',
      'Un repositorio privado por defecto mientras aprendes.',
    ],
    ignore: [
      'El cuadrito verde de contribuciones. No mide nada.',
      'Configurar Actions y automatizaciones antes de tener el proyecto funcionando.',
      'Los debates sobre estrategias de ramas. Con una rama principal y ramas de trabajo vas sobrado.',
    ],
    questions: [
      q('Subes sin querer un archivo con tu clave de API y lo borras en el commit siguiente. ¿Estás a salvo?',
        [
          ok('No: sigue en el historial y hay que anular la clave en el servicio que la emitió', 'Correcto. El historial guarda todo. Y hay robots rastreando repositorios públicos que la encuentran en minutos. Se anula primero y se limpia después.'),
          no('Sí, borrarla en el commit siguiente la elimina', 'Desaparece de la versión actual, pero cualquiera puede ver el commit anterior.'),
          no('Sí, si el repositorio es privado', 'Reduce el riesgo, no lo elimina: sigue estando y cualquiera con acceso la ve.'),
        ],
        'Lo que entra una vez en el historial, se queda.'),
    ],
  },

  docker: {
    tool: 'docker',
    plain:
      'Es un programa que empaqueta otros programas con todo lo que necesitan dentro, como una maleta cerrada. Así puedes ejecutar una base de datos o n8n sin instalarlos de verdad en tu ordenador, y sin que te dejen nada suelto cuando termines.',
    account: {
      url: 'docker.com',
      free: 'Gratis para uso personal y para aprender. No hace falta ni crear cuenta para lo del curso.',
      steps: [
        ['Descarga Docker Desktop', 'O usa el comando del bloque de instalación de más abajo, que hace lo mismo sin buscar en la web.'],
        ['Instálalo y ÁBRELO', 'Este paso se olvida siempre: si el programa no está abierto, ningún comando funciona.'],
        ['Espera al icono verde', 'Abajo a la izquierda del programa. Mientras esté amarillo, aún está arrancando.'],
        ['Comprueba en la terminal', 'Escribe docker --version. Si responde con un número, está listo.'],
      ],
      warning: 'Docker consume memoria mientras está abierto. Si tu ordenador va justo, ciérralo cuando no lo uses con docker compose down.',
    },
    first: [
      'Crea una carpeta para el proyecto.',
      'Dentro, crea un archivo llamado docker-compose.yml con lo que quieres levantar.',
      'Ejecuta docker compose up -d. El -d significa que se queda funcionando en segundo plano.',
      'Comprueba con docker ps qué está corriendo.',
    ],
    words: [
      ['Imagen', 'La plantilla de un programa empaquetado, como el instalador.'],
      ['Contenedor', 'Una copia de esa imagen ya en marcha.'],
      ['Volumen', 'Un almacén para que los datos sobrevivan cuando apagues el contenedor.'],
      ['Puerto', 'La puerta por la que se accede. localhost:5678 significa "mi ordenador, puerta 5678".'],
      ['docker-compose.yml', 'Un archivo de texto que describe qué levantar y cómo. Se lee de arriba abajo.'],
    ],
    matters: [
      'Los datos se pierden al borrar un contenedor salvo que hayas definido un volumen.',
      'Fijar la versión de las imágenes: pg16, no latest.',
      'Si el puerto está ocupado, cambia el de tu lado, no el de dentro.',
      'docker compose logs es lo primero que se mira cuando algo falla.',
    ],
    ignore: [
      'Optimizar el tamaño de las imágenes mientras aprendes.',
      'Kubernetes. No lo necesitas y no lo vas a necesitar en mucho tiempo.',
      'Escribir tus propios Dockerfile al principio: usa imágenes que ya existen.',
    ],
    questions: [
      q('Ejecutas docker compose down -v y al volver a levantar todo está vacío. ¿Qué ha pasado?',
        [
          ok('El -v borra los volúmenes, que es donde vivían los datos', 'Exacto. Sin -v se apagan los contenedores y los datos siguen ahí. Con -v se borra todo. Es la diferencia entre apagar y formatear.'),
          no('Docker limpia los datos automáticamente al apagar', 'No: los conserva mientras exista el volumen.'),
          no('Hay que volver a instalar Docker', 'El problema no es la instalación, es el flag que borró el almacén.'),
        ],
        'Un flag de una letra puede borrarte la base de datos. Léelos.'),
    ],
  },

  vercel: {
    tool: 'vercel',
    plain:
      'Es un servicio que coge tu proyecto y lo pone en internet con una dirección que puedes compartir. Se conecta a GitHub, y cada vez que cambias algo lo publica solo, sin que tengas que hacer nada.',
    account: {
      url: 'vercel.com',
      free: 'El plan gratuito sirve para proyectos personales y demos a clientes. No pide tarjeta.',
      steps: [
        ['Entra en vercel.com y pulsa "Sign Up"', 'Elige "Continue with GitHub": así ya quedan conectados los dos.'],
        ['Autoriza el acceso a tus repositorios', 'Puedes darle acceso solo a los que elijas, y es lo recomendable.'],
        ['Pulsa "Add New… → Project"', 'Te enseña tu lista de repositorios; elige el que quieres publicar.'],
        ['Deja la configuración por defecto', 'Detecta solo qué tipo de proyecto es. Solo toca algo si sabes por qué.'],
        ['Añade las variables de entorno', 'Settings → Environment Variables. Las claves NO viajan desde tu ordenador: hay que ponerlas aquí.'],
      ],
      warning: 'El primer despliegue falla casi siempre por una variable de entorno que falta. No es que lo hayas hecho mal: es que en tu ordenador estaba en el .env y aquí hay que declararla.',
    },
    first: [
      'Publica algo pequeño primero, aunque sea una página con tu nombre.',
      'Mira la pestaña Deployments: ahí está el historial y los errores.',
      'Crea una rama, haz un cambio y abre un Pull Request: Vercel genera una dirección de prueba solo para eso.',
      'Comparte esa dirección de prueba en vez de publicar directamente.',
    ],
    words: [
      ['Despliegue (deploy)', 'Publicar una versión en internet.'],
      ['Build', 'El proceso de preparar tu código para publicarlo. Si falla, no se publica.'],
      ['Preview', 'Una dirección temporal para enseñar un cambio antes de que sea oficial.'],
      ['Producción', 'La versión oficial, la que ve el público.'],
      ['Variable de entorno', 'Un dato de configuración (como una clave) que se guarda aparte del código.'],
    ],
    matters: [
      'Las variables se definen por entorno: producción, preview y desarrollo son tres listas distintas.',
      'La dirección de preview de cada Pull Request es la mejor forma de enseñar algo a un cliente.',
      'Si el build falla, el error completo está en Deployments → el que falló → "Building".',
    ],
    ignore: [
      'Configurar un dominio propio antes de que el proyecto funcione.',
      'Los planes de pago mientras aprendes.',
      'Las opciones avanzadas de región y funciones: los valores por defecto están bien.',
    ],
    questions: [
      q('Tu proyecto funciona en tu ordenador y al publicarlo en Vercel da error. ¿Por dónde empiezas?',
        [
          ok('Por las variables de entorno: las claves de tu .env no viajan con el código', 'Correcto, y es la causa en la gran mayoría de los casos. El .env se queda en tu ordenador a propósito; en el servidor hay que declararlas de nuevo.'),
          no('Por reinstalar las dependencias en tu ordenador', 'Tu ordenador funciona: el problema está en el otro lado.'),
          no('Por cambiar de servicio de publicación', 'El mismo fallo te seguiría a cualquier otro.'),
        ],
        'Las claves nunca viajan con el código. Ese es el diseño, no un fallo.'),
    ],
  },
}

/** Añade guías escritas fuera del código, en content/toolguides/. */
export function registerGuides(list) {
  for (const guide of list) {
    if (!guide?.id) continue
    TOOL_GUIDES[guide.id] = guide
  }
}

/** Convierte las guías en algo que la web pueda pintar. */
export function toolGuideFor(toolId) {
  const direct = TOOL_GUIDES[toolId]
  if (direct) return direct
  const alias = { openai: 'chatgpt', anthropic: 'claude-code', claude: 'claude-code', codex: 'claude-code', git: 'github' }
  return TOOL_GUIDES[alias[toolId]] || null
}

export const GUIDED_TOOLS = Object.entries(TOOL_GUIDES).map(([id, guide]) => ({ id, tool: guide.tool }))
