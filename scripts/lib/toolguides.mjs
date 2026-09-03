import { AUTOMATION_PLATFORMS, REAL_AUTOMATIONS } from './automations-reales.mjs'

const MAX_TOOL_AUTOMATIONS = 25

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

/*
 * Herramientas descubiertas en la revisión editorial.
 *
 * No se muestran como fichas vacías: aunque todavía no tengan una lección
 * extensa propia, reciben una guía inicial con criterio de uso, primeros
 * pasos, vocabulario, riesgos, coste y un encargo profesional. Después se
 * pueden ampliar sin cambiar la navegación.
 */
const DISCOVERED_TOOL_META = {
  'nano-banana': { label: 'Nano Banana', url: 'ai.google.dev', kind: 'image', plain: 'Nano Banana aparece aquí como una herramienta independiente del curso para crear y editar imágenes con instrucciones y referencias. En la documentación actual se trata como la familia/capacidad de imagen de Gemini, incluyendo Gemini 2.5 Flash Image y versiones posteriores; por eso el curso obliga a comprobar el modelo exacto antes de presupuestar o entregar. Sirve para pasar de una idea visual a variantes controladas, pero hay que revisar composición, texto, identidad, derechos, marcas de agua y consumo antes de publicar.' },
  'seedance-2-5': { label: 'Seedance 2.5', url: 'seed.bytedance.com', kind: 'video', plain: 'Seedance 2.5 aparece aquí como herramienta independiente de vídeo generativo. Sirve para convertir una idea, una imagen o una secuencia de planos en vídeo con movimiento, audio y continuidad, pero hay que revisar créditos, derechos, personas identificables, coherencia entre planos, sonido y uso comercial antes de enseñar o publicar.' },
  base44: { label: 'Base44', url: 'base44.com', kind: 'apps', plain: 'Un constructor de aplicaciones que convierte una descripción en una aplicación funcional con pantallas, datos y lógica. Sirve para prototipos y productos pequeños, pero hay que revisar qué ha creado antes de usarlo con datos reales.' },
  bolt: { label: 'Bolt.new', url: 'bolt.new', kind: 'apps', plain: 'Un constructor web que trabaja desde el navegador: describes una página o aplicación y genera una primera versión que puedes ver, editar y publicar. Es útil para prototipos rápidos, siempre que guardes el código y revises cada cambio.' },
  replit: { label: 'Replit', url: 'replit.com', kind: 'apps', plain: 'Un entorno de programación en el navegador con un agente que puede crear aplicaciones a partir de una conversación. Te da una ruta rápida de idea a demo, pero la versión que entregues debe quedar respaldada en GitHub y probada fuera del chat.' },
  framer: { label: 'Framer', url: 'framer.com', kind: 'web', plain: 'Un editor visual para diseñar y publicar sitios web. Es especialmente útil para páginas de marca, portfolios y sitios de marketing donde el control visual importa más que una lógica compleja.' },
  canva: { label: 'Canva', url: 'canva.com', kind: 'content', plain: 'Un editor visual para crear piezas de comunicación, presentaciones, documentos y vídeos cortos. Su valor está en poder producir material coherente sin empezar desde un lienzo vacío.' },
  heygen: { label: 'HeyGen', url: 'heygen.com', kind: 'video', plain: 'Una plataforma de vídeo con avatares y doblaje asistido por IA. Puede convertir un guion en una pieza presentada por una persona digital, pero requiere revisar consentimiento, pronunciación, tono y uso comercial.' },
  descript: { label: 'Descript', url: 'descript.com', kind: 'video', plain: 'Un editor de audio y vídeo que permite editar una grabación trabajando sobre su transcripción. Es útil para convertir una conversación larga en clips, subtítulos o una versión corregida.' },
  gamma: { label: 'Gamma', url: 'gamma.app', kind: 'content', plain: 'Una herramienta para crear presentaciones, documentos y páginas a partir de una estructura escrita. Acelera el primer borrador, pero el criterio, los datos y la revisión final siguen siendo tuyos.' },
  pipedream: { label: 'Pipedream', url: 'pipedream.com', kind: 'automation', plain: 'Una plataforma de automatización orientada a conectar APIs y servicios con pasos visuales y código opcional. Es potente para integraciones que necesitan más control que un conector simple.' },
  notebooklm: { label: 'NotebookLM', url: 'notebooklm.google.com', kind: 'knowledge', plain: 'Un espacio para conversar con documentos que tú aportas, con respuestas apoyadas en esas fuentes. Es útil para estudiar y sintetizar material, pero hay que comprobar siempre la cita y el alcance de los documentos.' },
  airtable: { label: 'Airtable', url: 'airtable.com', kind: 'data', plain: 'Una base de datos visual que se parece a una hoja de cálculo, pero permite relaciones, vistas, permisos y automatizaciones. Es una buena pieza intermedia para proyectos que han crecido más que una hoja.' },
  notion: { label: 'Notion', url: 'notion.so', kind: 'knowledge', plain: 'Un espacio para organizar documentos, bases de datos ligeras, proyectos y conocimiento. Funciona bien como centro de trabajo, siempre que definas qué información vive allí y cómo se actualiza.' },
  'wispr-flow': { label: 'Wispr Flow', url: 'wisprflow.ai', kind: 'voice', plain: 'Wispr Flow es una aplicación de dictado con IA: hablas de forma natural y convierte tu voz en texto claro dentro de otras apps. Sirve para escribir más rápido correos, prompts, notas, mensajes y borradores, pero no es una plataforma de automatización ni un generador de contenido autónomo.' },
}

function discoveredGuide(id, meta) {
  const toolWord = meta.kind === 'video' ? 'créditos o minutos de generación' : meta.kind === 'automation' ? 'tareas o ejecuciones' : meta.kind === 'data' ? 'filas, registros o automatizaciones' : meta.kind === 'knowledge' ? 'documentos y consultas' : 'tokens, créditos o límites del plan'
  return {
    tool: id,
    plain: meta.plain,
    account: {
      url: meta.url,
      free: `Empieza con el plan de prueba o gratuito si existe y comprueba dentro de ${meta.label} qué límites tiene antes de conectar datos reales. Los precios, créditos y nombres de planes cambian; la fecha de la última comprobación debe quedar anotada en el proyecto.`,
      steps: [
        [`Entra en ${meta.url}`, 'Usa la dirección oficial y comprueba que el dominio coincide antes de crear la cuenta.'],
        ['Crea una cuenta de prueba', 'Utiliza una cuenta separada si todavía estás evaluando la herramienta.'],
        ['Mira el panel de uso', `Localiza los créditos, límites o consumos que ${meta.label} muestra antes de crear nada.`],
        ['Crea un espacio de prueba', 'Ponle un nombre que indique que contiene datos ficticios y no lo mezcles con producción.'],
        ['Haz una prueba pequeña', 'Comprueba una sola entrada, revisa el resultado y apunta qué cambiarías.'],
      ],
      warning: 'No conectes datos de clientes ni permisos de producción hasta haber probado el flujo, revisado la política de privacidad y definido cómo detenerlo.',
    },
    first: [
      `Mira dos ejemplos de ${meta.label} y escribe qué resultado producen, no solo qué aspecto tienen.`,
      'Crea una prueba con datos inventados y un resultado concreto que puedas comparar.',
      'Cambia una sola variable entre una prueba y la siguiente para saber qué ha mejorado.',
      'Guarda una copia del resultado y de la instrucción que lo produjo.',
      'Apunta qué parte harías manualmente si la herramienta dejara de estar disponible.',
    ],
    words: [
      ['Entrada', 'La información que recibe la herramienta para poder trabajar.'],
      ['Salida', 'El resultado que produce y que otra persona puede revisar.'],
      ['Plantilla', 'Una estructura preparada que evita empezar siempre desde cero.'],
      ['Historial', 'El registro de cambios, pruebas o ejecuciones anteriores.'],
      ['Producción', 'La versión que toca datos o usuarios reales.'],
      ['Límite', `La cantidad máxima de ${toolWord} que permite tu plan o tu cuenta.`],
    ],
    matters: [
      'Definir el resultado antes de abrir la herramienta.',
      'Conservar una copia exportable o reproducible del trabajo.',
      'Probar con un caso normal, uno vacío, uno repetido y uno extremo.',
      'Revisar permisos, privacidad, uso comercial y propiedad de los resultados.',
    ],
    ignore: [
      'Las opciones avanzadas que no afectan a tu primera prueba.',
      'Perseguir el diseño perfecto antes de comprobar que el resultado sirve.',
      'Conectar cinco herramientas a la vez cuando todavía no sabes cuál falla.',
    ],
    daily: [
      `Escribe primero qué debe existir al final y deja que ${meta.label} te ayude solo con los pasos que aporten algo.`,
      'Usa nombres claros y guarda una versión antes de cada cambio importante.',
      'Revisa el resultado con una lista fija, no con la impresión del momento.',
      'Separa la cuenta de pruebas de la cuenta que contiene datos reales.',
      `Mide el consumo de ${toolWord} antes de automatizar una tarea repetitiva.`,
    ],
    errors: [
      ['El resultado parece correcto, pero no sirve para mi caso', 'La instrucción era demasiado general o no incluía un ejemplo real.', 'Escribe una entrada concreta, una salida esperada y dos casos que no deben pasar.'],
      ['La herramienta ha cambiado algo que yo no quería', 'El encargo dejaba demasiado margen o no había una copia anterior.', 'Trabaja por cambios pequeños, revisa el diff o historial y acepta solo una modificación cada vez.'],
      ['El proyecto funciona en la prueba y falla con datos reales', 'Los datos reales tienen vacíos, formatos raros o permisos distintos.', 'Prueba antes con casos incompletos, repetidos y extremos, y registra cómo recuperarte.'],
    ],
    prompts: [{ name: `Diseñar un trabajo profesional con ${meta.label}`, prompt: `Quiero usar ${meta.label} para resolver un problema real y necesito que me acompañes con criterio profesional. No quiero que me entregues una idea bonita pero imposible de mantener. Quiero que primero entiendas mi situación, que después me ayudes a decidir si esta herramienta es adecuada y que solo entonces me propongas una primera versión pequeña. Mi situación es: [DESCRIBE EL PROBLEMA, QUIÉN LO TIENE, QUÉ HACE HOY Y QUÉ RESULTADO QUIERE]. Trabaja en español natural, explicando cada palabra técnica la primera vez que aparezca. Empieza haciendo una sola pregunta cada vez y espera mi respuesta. Pregunta por la entrada real, la salida exacta, el volumen, los datos personales, los permisos, el presupuesto, quién mantendrá el trabajo y qué ocurrirá si la herramienta deja de funcionar. Cuando tengas suficiente información, resume el proyecto en una ficha con problema, usuarios, entrada, salida, pasos, límites y criterio de éxito. Después compárame tres caminos: hacerlo con ${meta.label}, hacerlo con una alternativa y hacerlo manualmente durante la primera versión. Para cada camino explica tiempo, coste, dependencia, facilidad de reparación y qué datos tendrían que salir de mi equipo. Recomienda uno solo y justifica la decisión. Si recomiendo ${meta.label}, diseña una prueba de diez minutos con datos ficticios. Indica exactamente qué tengo que preparar, qué botón o zona debo buscar, qué debería ver al terminar y qué señal demostraría que algo ha fallado. No conectes cuentas reales ni envíes mensajes todavía. Luego prepara un plan de cinco pasos: preparar, construir, probar, documentar y entregar. Cada paso debe tener un resultado observable y una forma de volver atrás. Añade una lista de casos difíciles: entrada vacía, dato duplicado, texto largo, permiso caducado, servicio caído y persona que se arrepiente. Para cada caso dime qué debería hacer el sistema y qué debería hacer yo. Termina con un checklist de producción y una explicación de cómo medir el consumo de tokens, créditos, tareas, ejecuciones o límites del plan de ${meta.label}. No inventes precios ni funciones que no puedas confirmar: marca lo que tenga que comprobar en la web oficial.`, }],
    usage: { unit: toolWord, explanation: `En ${meta.label} no basta con mirar el precio del plan. Hay que saber qué unidad se descuenta en cada acción: ${toolWord}. Haz una prueba controlada, anota la lectura del panel antes y después y multiplica ese consumo por el volumen mensual. La cifra debe revisarse cuando cambie el plan o el modelo.`, examples: [`Una prueba con una sola entrada y datos ficticios.`, `El consumo antes y después de una repetición idéntica.`, `El coste aproximado de diez, cien y mil usos.`, 'Un límite mensual y una alerta antes de alcanzarlo.', 'La fecha en la que se comprobó la información.'] },
  }
}

for (const [id, meta] of Object.entries(DISCOVERED_TOOL_META)) {
  if (!TOOL_GUIDES[id]) TOOL_GUIDES[id] = discoveredGuide(id, meta)
}

/* ------------------------------------------------------------------ *
 * Biblioteca profunda generada por herramienta.
 *
 * Esta capa no rellena una ficha con el mismo texto. Define las piezas que
 * el alumno ve dentro de cada producto, los trabajos para los que conviene y
 * automatizaciones comprobables que se pueden convertir en un flujo real.
 * ------------------------------------------------------------------ */

const PROMPT_TASKS = [
  ['Definir un problema real', 'convertir una idea vaga en una ficha de problema, usuarios, entrada, salida y criterio de éxito', 'No construyas nada hasta separar lo que sé de lo que estoy suponiendo.'],
  ['Investigar y comparar opciones', 'investigar alternativas y terminar con una recomendación que pueda defender', 'Separa fuentes, hechos, inferencias y puntos que debo comprobar.'],
  ['Analizar información propia', 'analizar los datos o documentos que aporte y encontrar patrones sin inventar valores', 'Marca los campos vacíos, los duplicados y los datos que no permiten concluir nada.'],
  ['Extraer datos de documentos', 'convertir documentos desordenados en una tabla o ficha consistente', 'Conserva la referencia de origen y devuelve vacío cuando el dato no aparezca.'],
  ['Escribir una pieza profesional', 'crear un texto útil para un público concreto y con una voz definida', 'Antes de escribir, fija propósito, lector, tono, extensión y acción siguiente.'],
  ['Revisar y mejorar un texto', 'auditar un texto que ya existe y proponer cambios que se puedan justificar', 'No cambies la voz por gusto: distingue error, riesgo, falta de claridad y preferencia.'],
  ['Crear una imagen', 'diseñar una imagen que cumpla una función concreta dentro de un proyecto', 'Describe sujeto, encuadre, luz, composición, texto visible y lo que debe quedar fuera.'],
  ['Editar una imagen de referencia', 'modificar una imagen manteniendo lo que debe seguir siendo reconocible', 'Lista qué píxeles o elementos pueden cambiar y cuáles tienen que permanecer.'],
  ['Planificar un vídeo', 'pasar de una idea a un guion con planos, sonido, ritmo y entregables', 'Cada plano debe tener una intención, una duración y una forma de revisarlo.'],
  ['Crear un storyboard', 'ordenar una secuencia audiovisual antes de gastar créditos o grabar', 'Devuelve una tabla de planos y señala las transiciones difíciles de generar.'],
  ['Diseñar una web', 'definir una web que se pueda construir, probar y publicar', 'Prioriza la tarea del visitante, el móvil, la accesibilidad y el contenido real.'],
  ['Diseñar una aplicación', 'convertir un proceso en pantallas, estados, datos y reglas', 'No escondas estados de error, permisos, datos vacíos ni la forma de recuperar un cambio.'],
  ['Hacer un cambio de código', 'modificar una base de código sin romper lo que ya funciona', 'Pide primero contexto, archivos afectados, pruebas actuales y un cambio mínimo.'],
  ['Diagnosticar un error', 'encontrar la causa de un fallo y arreglarla con evidencia', 'Diferencia síntoma, causa, hipótesis y prueba; no propongas cinco cambios a la vez.'],
  ['Diseñar una interfaz', 'crear una interfaz clara para una persona que no domina la herramienta', 'Cada control debe tener una acción, un estado, una ayuda y un resultado visible.'],
  ['Preparar datos y estructura', 'diseñar campos, relaciones y reglas para que los datos no se vuelvan inservibles', 'Incluye identificador, tipos, valores vacíos, duplicados, permisos y exportación.'],
  ['Automatizar un proceso', 'diseñar un flujo que empiece con un evento y termine con un resultado comprobable', 'Incluye idempotencia, aprobación humana, reintentos, registro, parada y coste.'],
  ['Crear un agente con límites', 'decidir qué puede consultar o hacer un sistema y qué debe aprobar una persona', 'Define herramientas permitidas, datos que no puede tocar y qué ocurre ante una duda.'],
  ['Evaluar calidad', 'crear casos de prueba y una forma de comparar versiones', 'Incluye caso normal, incompleto, repetido, extremo y un umbral que bloquee la entrega.'],
  ['Documentar y entregar', 'preparar una entrega que otra persona pueda usar, revisar y mantener', 'Incluye instalación, uso, límites, coste, secretos, recuperación y responsable.'],
]

const EXTRA_PROMPT_TASKS = [
  ['Elegir herramienta antes de empezar', 'decidir si esta herramienta encaja o si conviene una alternativa más simple', 'Compara necesidad real, coste, permisos, mantenimiento y evidencia antes de elegir.'],
  ['Preparar un briefing reutilizable', 'convertir una idea en un documento breve que se pueda reutilizar en nuevos encargos', 'Incluye contexto fijo, decisiones tomadas, límites y criterios de aprobación.'],
  ['Crear una checklist de revisión', 'tener una lista corta para aprobar o rechazar la salida antes de usarla', 'La checklist debe detectar errores visibles, permisos, datos sensibles, coste y salida incompleta.'],
  ['Convertir una salida en plantilla', 'transformar un buen resultado en una plantilla que otra persona pueda repetir', 'Separa lo fijo de lo variable y deja huecos claros entre corchetes.'],
  ['Diseñar una prueba con datos ficticios', 'ensayar el proceso completo sin tocar datos reales ni publicar nada', 'Usa casos normal, incompleto, duplicado, extremo y uno que deba parar.'],
  ['Comparar dos versiones', 'decidir qué versión es mejor con criterios observables y no por intuición', 'Define criterios antes de mirar los resultados y conserva ambas evidencias.'],
  ['Preparar una demo para cliente', 'enseñar el resultado sin exponer secretos, datos reales ni promesas falsas', 'Incluye guion, recorrido feliz, fallo controlado y límites conocidos.'],
  ['Reducir coste sin perder calidad', 'identificar qué partes gastan más y cómo bajar consumo sin romper el resultado', 'Separa volumen, modelo, créditos, reintentos, tamaño de entrada y trabajo repetido.'],
  ['Crear documentación para mantenimiento', 'dejar instrucciones para arreglar o repetir el trabajo cuando tú no estés', 'Incluye responsable, credenciales, pruebas, errores frecuentes y recuperación.'],
  ['Auditar privacidad y permisos', 'revisar qué datos entran, quién los ve y qué permisos has concedido', 'Marca datos personales, secretos, retención, enlaces públicos y acciones irreversibles.'],
]

const MAX_GENERATED_TOOL_PROMPTS = 25
const NO_PROMPT_TOOLS = new Set(['wispr-flow'])

/*
 * Tipo de trabajo de cada encargo. Es lo que impide ofrecer «Crear un
 * storyboard con Docker» o «Crear una imagen con PostgreSQL»: cada
 * herramienta declara qué tipos de trabajo le pegan y solo recibe esos.
 */
const TASK_KINDS = {
  'Definir un problema real': 'generic',
  'Investigar y comparar opciones': 'generic',
  'Analizar información propia': 'analysis',
  'Extraer datos de documentos': 'data',
  'Escribir una pieza profesional': 'writing',
  'Revisar y mejorar un texto': 'writing',
  'Crear una imagen': 'image',
  'Editar una imagen de referencia': 'image',
  'Planificar un vídeo': 'video',
  'Crear un storyboard': 'video',
  'Diseñar una web': 'web',
  'Diseñar una aplicación': 'app',
  'Hacer un cambio de código': 'code',
  'Diagnosticar un error': 'tech',
  'Diseñar una interfaz': 'design',
  'Preparar datos y estructura': 'data',
  'Automatizar un proceso': 'automation',
  'Crear un agente con límites': 'automation',
  'Evaluar calidad': 'generic',
  'Documentar y entregar': 'generic',
}

const TOOL_TASK_KINDS = {
  openai: ['generic', 'analysis', 'writing', 'image', 'automation', 'code', 'tech', 'data'],
  anthropic: ['generic', 'analysis', 'writing', 'code', 'tech', 'data'],
  claude: ['generic', 'analysis', 'writing', 'code', 'tech', 'data'],
  'claude-code': ['generic', 'code', 'tech', 'data', 'automation'],
  codex: ['generic', 'code', 'tech'],
  copilot: ['generic', 'code', 'tech'],
  cursor: ['generic', 'code', 'tech', 'app'],
  vscode: ['generic', 'code', 'tech'],
  github: ['generic', 'code', 'tech', 'automation'],
  gemini: ['generic', 'analysis', 'writing', 'image', 'data', 'tech'],
  perplexity: ['generic', 'analysis', 'writing'],
  notebooklm: ['generic', 'analysis', 'data'],
  huggingface: ['generic', 'code', 'tech', 'data', 'analysis'],
  ollama: ['generic', 'code', 'tech', 'analysis'],
  replicate: ['generic', 'image', 'video', 'code', 'tech'],
  langchain: ['generic', 'code', 'tech', 'data', 'automation'],
  colab: ['generic', 'code', 'tech', 'analysis', 'data'],
  python: ['generic', 'code', 'tech', 'data', 'automation'],
  node: ['generic', 'code', 'tech', 'automation'],
  typescript: ['generic', 'code', 'tech'],
  react: ['generic', 'code', 'tech', 'web', 'app', 'design'],
  tailwind: ['generic', 'code', 'web', 'design'],
  docker: ['generic', 'code', 'tech'],
  vercel: ['generic', 'code', 'tech', 'web'],
  lovable: ['generic', 'web', 'app', 'design', 'tech'],
  v0: ['generic', 'web', 'app', 'design', 'tech'],
  bolt: ['generic', 'web', 'app', 'design', 'tech'],
  base44: ['generic', 'web', 'app', 'design', 'tech', 'data'],
  replit: ['generic', 'web', 'app', 'code', 'tech'],
  framer: ['generic', 'web', 'design'],
  figma: ['generic', 'design', 'web', 'app', 'image'],
  canva: ['generic', 'image', 'design', 'writing'],
  midjourney: ['generic', 'image'],
  'nano-banana': ['generic', 'image'],
  higgsfield: ['generic', 'video', 'image'],
  runway: ['generic', 'video', 'image'],
  'seedance-2-5': ['generic', 'video'],
  heygen: ['generic', 'video', 'writing'],
  descript: ['generic', 'video', 'writing'],
  elevenlabs: ['generic', 'video', 'writing'],
  gamma: ['generic', 'writing', 'design'],
  n8n: ['generic', 'automation', 'tech', 'data'],
  zapier: ['generic', 'automation', 'tech', 'data'],
  make: ['generic', 'automation', 'tech', 'data'],
  pipedream: ['generic', 'automation', 'tech', 'code'],
  slack: ['generic', 'automation', 'writing', 'tech'],
  gmail: ['generic', 'automation', 'writing', 'tech'],
  telegram: ['generic', 'automation', 'writing', 'tech'],
  whatsapp: ['generic', 'automation', 'writing', 'tech'],
  sheets: ['generic', 'data', 'analysis', 'automation', 'tech'],
  airtable: ['generic', 'data', 'analysis', 'automation', 'tech'],
  supabase: ['generic', 'data', 'code', 'tech', 'app'],
  postgres: ['generic', 'data', 'code', 'tech'],
  notion: ['generic', 'data', 'writing', 'analysis'],
  obsidian: ['generic', 'data', 'writing', 'analysis'],
}

function allowedTaskKindsFor(toolId) {
  return new Set(TOOL_TASK_KINDS[toolId] || ['generic', 'tech'])
}

const PROFILE_DEFAULT = {
  intro: 'Esta ficha no se queda en el nombre del producto: te enseña qué piezas hay dentro, qué decisión resuelve cada una y cómo encaja en un proyecto completo.',
  units: 'tokens, créditos, tareas o ejecuciones',
  selection: 'elige la opción más sencilla que cubra tu entrada, salida, volumen y necesidad de revisión',
  catalog: [
    ['Entrada', 'qué información recibe', 'preparar y validar la información antes de abrir la herramienta', 'no uses datos reales hasta conocer sus permisos'],
    ['Salida', 'qué entrega y cómo se guarda', 'definir el resultado antes de empezar', 'no aceptes una salida bonita que no puedas comprobar'],
    ['Plantillas', 'estructuras reutilizables para no empezar de cero', 'repetir un formato que ya has probado', 'no copies una plantilla sin entender sus dependencias'],
    ['Historial', 'versiones, ejecuciones o cambios anteriores', 'comparar una prueba con otra y volver atrás', 'no borres el historial mientras investigas un fallo'],
    ['Permisos', 'qué puede leer o modificar', 'conectar solo el mínimo necesario', 'no concedas acceso total por comodidad'],
    ['Exportación', 'cómo sacar tu trabajo si cambias de proveedor', 'guardar una copia antes de depender del servicio', 'no confundas compartir una vista con exportar los datos'],
  ],
}

const TOOL_PROFILES = {
  openai: {
    intro: 'Aquí se estudian ChatGPT y OpenAI como dos capas: la aplicación que usas en pantalla y los modelos y servicios que pueden ejecutar otros programas. El nombre visible y la disponibilidad cambian según el plan.',
    units: 'tokens, mensajes, archivos, créditos de imagen o minutos de audio',
    selection: 'ChatGPT: Instant para ir rápido, Thinking para razonar y Pro si el plan lo permite; API: GPT-5.1, GPT-5 mini/nano, Codex, Image, Sora, realtime y deep-research. GPT-5.6 Sol, Luna y Pro pueden aparecer según la cuenta; comprueba el selector y la documentación',
    catalog: [
      ['Selector de modelo', 'modos rápidos o Instant, Thinking y Pro; en API aparecen familias como GPT-5.1, GPT-5 mini/nano, Codex, GPT Image, Sora, realtime y deep-research. GPT-5.6 Sol, Luna y Pro pueden aparecer según cuenta', 'cambiar de modelo solo cuando la tarea lo necesite y comparar calidad, tiempo y coste', 'no elijas por el número más alto sin probar el resultado'],
      ['Archivos y análisis', 'subir documentos, hojas o imágenes para analizarlos', 'extraer, comparar, calcular o revisar material propio', 'no subas secretos ni datos personales sin revisar permisos'],
      ['Búsqueda e investigación', 'consultar la web y devolver fuentes cuando esté disponible', 'trabajar con información actual que necesita referencias', 'no trates una respuesta sin fuente como una comprobación'],
      ['Imágenes', 'generar o editar imágenes a partir de instrucciones y referencias', 'crear conceptos visuales, variantes y materiales de campaña', 'no publiques sin revisar texto, manos, marcas y derechos'],
      ['Voz y tiempo real', 'conversar o trabajar con audio en experiencias compatibles', 'prototipos de atención, práctica oral o asistentes', 'no grabes ni envíes audio sin consentimiento'],
      ['Proyectos y GPTs', 'guardar instrucciones, archivos y una forma de trabajo', 'mantener contexto estable para una tarea repetida', 'no confundas memoria de trabajo con una base de datos fiable'],
      ['API y herramientas', 'hacer que un programa llame a modelos, búsqueda, archivos o funciones', 'automatizar procesos y devolver una salida estructurada', 'no pongas claves API en el navegador ni en un repositorio'],
      ['Codex y código', 'usar modelos para leer, cambiar y probar código', 'trabajar por cambios pequeños con pruebas y revisión', 'no aceptes una reescritura completa sin copia y diff'],
    ],
  },
  claude: {
    intro: 'Claude se entiende mejor separando el modelo que responde de las superficies de trabajo que lo rodean: Projects, Artifacts, archivos, visión, web, Workbench, API y Claude Code. No todo aparece en todos los planes.',
    units: 'tokens de entrada y salida, archivos, mensajes y límites del plan',
    selection: 'Claude Opus 4.1 para arquitectura y análisis exigente, Claude Sonnet 4 para construir y revisar cada día y Claude Haiku para clasificación y tareas rápidas; los nombres y límites pueden cambiar, así que comprueba el selector visible y la documentación oficial',
    catalog: [
      ['Opus', 'Claude Opus 4.1: la familia de mayor capacidad para problemas difíciles y proyectos complejos', 'arquitectura, análisis profundo y decisiones con muchas restricciones', 'no lo uses para clasificar miles de entradas sencillas si otro modelo basta'],
      ['Sonnet', 'Claude Sonnet 4: la opción equilibrada para construir, escribir y revisar', 'la mayoría del trabajo de curso y prototipos', 'no presupongas que sustituye una prueba real'],
      ['Haiku', 'la familia rápida y económica para tareas cortas; comprueba el número actual en el selector', 'clasificación, extracción y borradores repetitivos', 'no le delegues una decisión de arquitectura sin revisión'],
      ['Projects', 'un espacio con instrucciones y documentos persistentes', 'mantener el contexto de un proyecto entre conversaciones', 'no lo uses como único lugar para guardar una versión entregable'],
      ['Artifacts', 'un panel para ver y tocar entregables generados', 'webs, componentes, documentos y prototipos visibles', 'no publiques sin revisar datos, permisos y dependencias'],
      ['Visión y archivos', 'leer imágenes y documentos junto a la conversación', 'revisar capturas, contratos, diseños o tablas', 'no inventes una página cuando el documento no la contiene'],
      ['Workbench y API', 'probar instrucciones y conectar Claude con programas', 'comparar versiones y preparar integraciones', 'no copies una clave a frontend o repositorio'],
      ['Claude Code', 'trabajar sobre un repositorio desde una terminal', 'cambios reales con tests, diff y control de versiones', 'no le des acceso sin una copia y una rama de trabajo'],
    ],
  },
  'nano-banana': {
    intro: 'Nano Banana es la ficha práctica de imagen generativa del curso: crear y editar imágenes con instrucciones, referencias y control institucional. En Gemini puede aparecer con modelos distintos, así que la primera decisión es anotar el modelo exacto y la fecha. Se centra en identidad visual, composición, texto, variantes, revisión, marca de agua y derechos, sin esconderlo dentro de la página general de Gemini.',
    units: 'generaciones, ediciones, resolución, créditos y límites del plan',
    selection: 'modo de generación para una imagen nueva, edición para conservar una referencia, composición para controlar sujeto y cámara, texto visible para carteles y variantes controladas para comparar cambios sin perder la versión aprobada',
    catalog: [
      ['Texto a imagen', 'crear una imagen a partir de una descripción', 'conceptos, campañas, fondos y escenas nuevas', 'no esperes texto pequeño perfecto sin revisarlo'],
      ['Imagen de referencia', 'usar una imagen para conservar sujeto, producto o estilo', 'variantes de una pieza que ya existe', 'no uses una imagen sin permiso o sin revisar su licencia'],
      ['Edición localizada', 'cambiar solo una zona y conservar el resto', 'limpiar fondos, sustituir objetos o corregir una composición', 'no pidas cinco cambios incompatibles en una sola instrucción'],
      ['Consistencia', 'mantener rasgos, ropa, producto o paleta entre imágenes', 'series, catálogos y personajes recurrentes', 'no dependas de una frase vaga para identidad exacta'],
      ['Composición y cámara', 'controlar encuadre, escala, lente, luz y profundidad', 'crear imágenes listas para una pieza concreta', 'no confundas estilo con instrucciones de encuadre'],
      ['Texto visible', 'pedir rótulos, carteles, portadas o etiquetas', 'mockups y piezas donde el texto es parte de la escena', 'si el texto importa, comprueba cada carácter y prepara una alternativa'],
      ['Variantes y selección', 'generar opciones comparables y elegir con criterio', 'explorar sin perder una versión aprobada', 'no gastes créditos sin nombrar y guardar las pruebas'],
      ['Exportación y derechos', 'sacar el archivo final y documentar su origen', 'entregar una pieza con tamaño y formato claros', 'no publiques sin revisar marcas, rostros y uso comercial'],
    ],
  },
  'seedance-2-5': {
    intro: 'Seedance 2.5 es una herramienta de vídeo generativo que debe aprenderse como una mesa de montaje: brief, plano, movimiento, duración, continuidad, audio, revisión y exportación. La ficha evita tratar el vídeo como magia; cada generación tiene coste, descarte y criterio de aprobación.',
    units: 'créditos, segundos generados, resolución, audio, variantes y límites del plan',
    selection: 'empieza con un plano corto y una referencia visual cuando exista; usa texto a vídeo solo para explorar, imagen a vídeo cuando necesites continuidad visual, y secuencia/storyboard cuando el resultado tenga varios planos conectados',
    catalog: [
      ['Texto a vídeo', 'crear un plano desde una descripción escrita', 'probar una idea visual rápida o un plano que no existe todavía', 'no lo uses para una campaña final sin referencias ni pruebas'],
      ['Imagen a vídeo', 'animar una imagen manteniendo sujeto, estilo y encuadre de partida', 'producto, retrato, local, pieza gráfica o escena aprobada', 'no esperes continuidad perfecta si la imagen base está mal compuesta'],
      ['Storyboard', 'ordenar varios planos antes de generar', 'anuncios, piezas formativas, reels, demos y vídeos institucionales', 'no generes plano a plano sin saber cómo se unirán después'],
      ['Movimiento de cámara', 'definir travelling, zoom, giro, paneo o plano estático', 'dar intención al vídeo y evitar movimiento aleatorio', 'no mezcles tres movimientos fuertes en cinco segundos'],
      ['Audio y ritmo', 'planificar voz, música, silencio, cortes y velocidad', 'cuando el vídeo debe explicar o vender algo', 'no dejes el audio para el final si condiciona la duración'],
      ['Continuidad visual', 'mantener personaje, objeto, color, luz y dirección entre planos', 'series, marca, producto y campañas', 'no cambies de referencia visual en cada generación'],
      ['Revisión de artefactos', 'detectar deformaciones, manos, texto, logos, parpadeos y cambios raros', 'antes de enseñar al cliente o publicar', 'no apruebes un vídeo por impresión general sin verlo fotograma a fotograma'],
      ['Exportación y derechos', 'guardar versión, formato, uso permitido, fuente y coste', 'entregar una pieza profesional', 'no publiques personas identificables, marcas o material de cliente sin permiso'],
    ],
  },
  n8n: {
    intro: 'n8n es el laboratorio principal de automatizaciones: cada flujo tiene un disparador, datos, decisiones, acciones, registro y una forma de detenerse. La academia enseña a construirlo y a repararlo, no solo a conectar cajas.',
    units: 'ejecuciones, tiempo de servidor, llamadas a APIs, tareas de los servicios y tokens de los modelos',
    selection: 'Webhook o evento para empezar, Edit Fields para ordenar datos, IF o Switch para decidir, HTTP Request para APIs y aprobación humana antes de acciones irreversibles',
    catalog: [
      ['Trigger', 'el evento que pone en marcha el workflow', 'un formulario, webhook, horario, correo o cambio en una app', 'no uses polling si el servicio puede avisar por webhook'],
      ['Edit Fields', 'seleccionar, renombrar y preparar campos', 'normalizar datos antes de compararlos o enviarlos', 'no pases el objeto entero cuando solo necesitas tres campos'],
      ['IF y Switch', 'separar caminos según condiciones', 'filtrar entradas, prioridades o estados', 'no escondas una regla crítica dentro de una expresión ilegible'],
      ['HTTP Request', 'llamar a una API aunque no haya nodo específico', 'conectar servicios y probar endpoints', 'no guardes claves en texto plano ni ignores códigos de error'],
      ['Modelos de IA', 'interpretar texto, imagen o documentos dentro del flujo', 'clasificar casos que una regla fija no resuelve', 'no metas IA donde una condición estable basta'],
      ['Datos y memoria', 'guardar estado, identificadores y resultados', 'evitar duplicados y continuar procesos', 'no dependas de la posición de una fila como identificador'],
      ['Aprobación humana', 'parar el flujo para que alguien confirme', 'enviar, publicar, cobrar o borrar', 'no automatices una acción irreversible sin freno'],
      ['Error y ejecuciones', 'ver qué ocurrió y recuperar un flujo', 'reintentos, alertas, trazabilidad y mantenimiento', 'no marques un workflow como listo sin probar un fallo'],
    ],
  },
  'base44': {
    intro: 'Base44 convierte una especificación en una aplicación con pantallas, datos y comportamiento. El aprendizaje está en escribir la especificación, revisar lo que genera, probar estados y conservar una ruta de salida.',
    selection: 'empieza con la versión mínima que tenga una entrada y una salida visibles, y añade datos, usuarios y automatizaciones después de probar el recorrido',
    catalog: [['Especificación', 'describir pantallas, datos y reglas', 'convertir una idea en una primera versión comprobable', 'no pidas una aplicación entera con una frase vaga'], ['Pantallas', 'lugares donde el usuario ve y cambia información', 'diseñar el recorrido principal', 'no ocultes errores ni estados vacíos'], ['Datos', 'campos y registros que sostienen la aplicación', 'guardar información que deba volver a aparecer', 'no guardes datos sensibles sin permisos claros'], ['Lógica', 'reglas que cambian lo que ocurre', 'validar, filtrar y calcular', 'no aceptes reglas sin casos de prueba'], ['Usuarios', 'identidad, acceso y permisos', 'separar lo que puede ver cada persona', 'no uses un único usuario para todo'], ['Integraciones', 'conexiones con servicios externos', 'correo, pagos, IA o automatizaciones', 'no conectes producción antes de probar'], ['Publicación', 'poner una versión accesible para otros', 'enseñar una demo o entregar el producto', 'no publiques sin revisar datos de prueba'], ['Exportación', 'guardar código, datos y documentación', 'mantener control si cambias de herramienta', 'no confundas una URL con una copia del proyecto']],
  },
  'wispr-flow': {
    intro: 'Wispr Flow no se aprende como una automatización: se aprende como una nueva forma de escribir. La página se centra en instalación, botón de dictado, edición posterior, vocabulario propio, privacidad, idiomas y cuándo conviene volver al teclado.',
    units: 'minutos dictados, palabras generadas, límites del plan y dispositivos conectados',
    selection: 'úsalo cuando el cuello de botella sea teclear o pasar una idea hablada a texto; evita usarlo para contenido sensible, reuniones sin consentimiento o tareas que necesitan formato exacto a la primera',
    catalog: [
      ['Dictado en cualquier app', 'convertir voz en texto dentro del campo donde ya estabas escribiendo', 'emails, Slack, WhatsApp, ChatGPT, documentos y notas rápidas', 'no lo trates como un chatbot: no decide por ti, escribe lo que dices mejorado'],
      ['Botón o atajo de hablar', 'activar y parar la escucha cuando tú decides', 'capturar ideas sin cambiar de ventana', 'no dejes el micrófono abierto en conversaciones privadas'],
      ['Limpieza automática', 'quitar muletillas, puntuar y ordenar frases habladas', 'pasar de una explicación oral a texto presentable', 'no aceptes nombres propios, cifras o tecnicismos sin revisar'],
      ['Vocabulario personal', 'aprender nombres, jerga y palabras que repites', 'trabajos con clientes, marcas, productos o términos técnicos', 'no metas datos sensibles solo para entrenar comodidad'],
      ['Idiomas y mezcla de idiomas', 'dictar en muchos idiomas y alternar según el contexto', 'equipos bilingües, alumnos y creadores que hablan más rápido de lo que escriben', 'no supongas que todos los idiomas puntúan igual de bien'],
      ['Privacidad y permisos', 'gestionar micrófono, datos de voz y tratamiento del texto', 'antes de usarlo con clientes, alumnos o llamadas', 'no grabes ni transcribas a personas sin base legal o permiso explícito'],
    ],
  },
}

const TASK_AUTOMATIONS = [
  ['Clasificar entradas y registrar el resultado', 'cuando llega un formulario, correo o mensaje', 'intermedia'],
  ['Enviar un aviso solo cuando requiere atención', 'cuando una condición de prioridad se cumple', 'basica'],
  ['Crear un resumen diario con fuentes', 'a una hora fija con los elementos del día', 'intermedia'],
  ['Detectar duplicados antes de crear un registro', 'cuando entra un elemento con identificador repetido', 'intermedia'],
  ['Pedir aprobación antes de enviar o publicar', 'cuando una acción cambia datos o sale al exterior', 'avanzada'],
  ['Reintentar una llamada y alertar si sigue fallando', 'cuando una API responde con error temporal', 'avanzada'],
  ['Convertir un archivo en una ficha estructurada', 'cuando aparece un documento nuevo en una carpeta', 'intermedia'],
  ['Crear tareas de seguimiento y fechas límite', 'cuando se completa una venta, reunión o solicitud', 'basica'],
  ['Sincronizar dos sistemas sin pisar cambios', 'cuando se crea o actualiza un registro', 'avanzada'],
  ['Guardar una auditoría de cada ejecución', 'cada vez que el flujo procesa un caso', 'profesional'],
  ['Parar y avisar cuando falta un dato obligatorio', 'cuando una entrada está incompleta', 'basica'],
  ['Preparar un informe semanal de consumo', 'al final de cada periodo de trabajo', 'profesional'],
  ['Crear un borrador y dejarlo para revisión humana', 'cuando llega una petición que requiere respuesta pero no envío automático', 'intermedia'],
  ['Mover adjuntos a una carpeta ordenada', 'cuando entra un correo o formulario con archivos', 'basica'],
  ['Extraer facturas y marcar excepciones', 'cuando aparece una factura nueva en una carpeta o buzón', 'avanzada'],
  ['Actualizar un CRM desde una conversación', 'cuando se cierra una llamada, reunión o chat con un cliente', 'intermedia'],
  ['Crear un ticket de soporte con prioridad', 'cuando entra una incidencia por correo, formulario o chat', 'intermedia'],
  ['Escalar un caso si no hay respuesta', 'cuando una tarea lleva demasiadas horas sin avanzar', 'basica'],
  ['Publicar contenido solo después de aprobarlo', 'cuando una pieza queda revisada por una persona', 'avanzada'],
  ['Generar variantes de contenido y elegir la mejor', 'cuando se aprueba una idea base de campaña', 'intermedia'],
  ['Vigilar una web o API y abrir incidente', 'cada pocos minutos o cuando un monitor detecta caída', 'avanzada'],
  ['Limpiar y normalizar una base de datos', 'cuando se importa un CSV, hoja o exportación externa', 'intermedia'],
  ['Enviar onboarding personalizado', 'cuando se crea un usuario, cliente o alumno nuevo', 'basica'],
  ['Preparar una reunión con contexto', 'antes de un evento del calendario', 'intermedia'],
  ['Cerrar el día con pendientes y bloqueos', 'al final de la jornada laboral', 'basica'],
  ['Rotar secretos y comprobar credenciales', 'según calendario o aviso de caducidad', 'profesional'],
]

function wordCount(text) { return String(text).trim().split(/\s+/).filter(Boolean).length }

function enrichToolPrompts(prompts, tool, profile) {
  for (const item of prompts || []) {
    if (!item?.prompt || wordCount(item.prompt) >= 500) continue
    const sections = [
      `\n\n## Antes de usarlo en ${tool.label}\nTrabaja con mi caso concreto y no rellenes huecos con imaginación. Si falta una decisión que cambia el resultado, hazme una pregunta corta antes de continuar. Traduce cualquier palabra técnica la primera vez que aparezca y separa claramente lo que sabes, lo que estás suponiendo y lo que debo comprobar en la herramienta real.`,
      `\n\n## Prueba mínima\nAntes de tocar datos reales, diseña una prueba con datos ficticios. Incluye un caso normal, uno incompleto, uno duplicado y uno extremo. Para cada caso dime qué entrada preparo, qué salida debería ver, dónde la compruebo dentro de ${tool.label} y qué hago si no coincide.`,
      `\n\n## Seguridad, coste y límites\nIndica qué datos no debo pegar, qué permisos son necesarios, qué acciones serían irreversibles y cómo detenería el trabajo si sale mal. Explica cómo medir el consumo relacionado con ${profile.units || 'el plan de la herramienta'} y marca como COMPROBAR EN LA WEB OFICIAL cualquier precio, límite o nombre de función que pueda haber cambiado.`,
      `\n\n## Entrega reutilizable\nTermina con una ficha breve para guardar en mi proyecto: objetivo, entrada, salida esperada, pasos dentro de ${tool.label}, criterio de aprobación, errores posibles, evidencia que debo conservar y siguiente acción de menos de treinta minutos. Si ${tool.label} no es la herramienta adecuada para mi caso, dilo claro y recomienda la alternativa mínima.`,
    ]
    for (const section of sections) {
      if (wordCount(item.prompt) >= 500) break
      item.prompt += section
    }
    if (wordCount(item.prompt) < 450) {
      item.prompt += `\n\nAñade un ejemplo completo con datos ficticios, escrito como si yo fuera a hacerlo ahora mismo. El ejemplo debe incluir una entrada concreta, la salida exacta que debería aparecer, el punto donde debo revisarla, una decisión que no tomarías todavía y una señal clara para parar antes de gastar dinero, publicar, enviar o conectar datos reales.`
    }
  }
  return prompts
}

function profileFor(id) {
  if (TOOL_PROFILES[id]) return TOOL_PROFILES[id]
  const kind = id.includes('video') || ['higgsfield', 'runway', 'heygen', 'descript', 'seedance-2-5'].includes(id) ? 'vídeo' : id.includes('code') || ['python', 'node', 'typescript', 'react', 'vscode', 'cursor', 'codex'].includes(id) ? 'código' : id.includes('automation') || ['zapier', 'make', 'pipedream', 'n8n'].includes(id) ? 'automatización' : id.includes('data') || ['airtable', 'supabase', 'postgres', 'sheets'].includes(id) ? 'datos' : 'contenido y producto'
  return { ...PROFILE_DEFAULT, intro: `En ${id} se trabaja con ${kind}. Esta guía separa las piezas internas, el momento adecuado para usarlas y las automatizaciones que conectan el resultado con el resto del proyecto.`, selection: `elige la función de ${kind} que produzca el resultado visible más pequeño y deja las conexiones para después de probar`, catalog: PROFILE_DEFAULT.catalog.map(([group, name, useWhen, avoidWhen]) => [group, `${name} dentro de ${id}`, useWhen, avoidWhen]) }
}

function baseGuideFor(tool) {
  const meta = DISCOVERED_TOOL_META[tool.id] || { label: tool.label, url: `${tool.id}.com`, kind: 'tool', plain: `${tool.label} es una herramienta que puede formar parte de un proyecto de aprendizaje y trabajo.` }
  return discoveredGuide(tool.id, meta)
}

function promptFor(tool, profile, task, index) {
  const [name, outcome, rule] = task
  const model = profile.selection.length > 180 ? `${profile.selection.split(';')[0]}; comprueba disponibilidad.` : profile.selection
  const inside = profile.catalog.slice(0, 3).map(([group, what]) => `${group}: ${what}`).join('; ')
  let prompt = `Actúa como una persona experta en ${tool.label} que acompaña a alguien que empieza desde cero. Este encargo trata de: ${name.toLowerCase()}. Quiero ${outcome}. No me des una respuesta genérica ni una lista de posibilidades sin decidir: trabaja con mi caso y señala lo que no puedas saber.\n\nMi contexto es el siguiente. Proyecto: [NOMBRE]. Qué hago o qué problema tengo: [DESCRIPCIÓN]. Quién lo utilizará: [PERSONA]. Qué información entra: [ENTRADA]. Qué debe existir al terminar: [SALIDA]. Volumen aproximado: [NÚMERO DE CASOS]. Presupuesto y tiempo disponible: [LÍMITES]. Herramientas que ya tengo: [LISTA]. Datos sensibles o permisos implicados: [DATOS Y PERMISOS].\n\nEmpieza haciéndome solo la primera pregunta que realmente cambie la solución. Espera mi respuesta antes de continuar. Si una palabra técnica es imprescindible, tradúcela al español sencillo la primera vez. No rellenes huecos con una suposición silenciosa. ${rule}\n\nCuando tengas la información suficiente, analiza primero si ${tool.label} es la herramienta adecuada. Explica qué parte del trabajo resuelve y qué parte no. Dentro de ${tool.label}, considera estas piezas: ${inside}. Después elige la función, modelo, modo o espacio de trabajo que usarías. Usa este criterio de selección: ${model}. Si hay dos opciones razonables, compara calidad, velocidad, coste, privacidad, posibilidad de revisar y facilidad de recuperar una versión anterior. No elijas una opción solo por ser la más potente.\n\nDevuelve el trabajo en este orden. Uno: ficha del problema con objetivo, usuario, entrada, salida y criterio de éxito. Dos: plan de preparación con los archivos, datos, permisos y decisiones que tengo que reunir. Tres: instrucciones concretas dentro de ${tool.label}, indicando qué pantalla, botón, campo, nodo o archivo debo abrir y qué valor debo poner. Cuatro: resultado esperado y señales de que algo ha fallado. Cinco: una alternativa manual o con otra herramienta y el motivo por el que la descartas o la recomiendas.\n\nDiseña una prueba antes de usar datos reales. La prueba debe tener un caso normal, un caso incompleto, un duplicado y un caso extremo. Para cada uno dime la entrada exacta, la salida que debería ver, dónde comprobarla y qué decisión tomar si no coincide. Si el resultado puede generar una imagen, vídeo, texto, código, registro, mensaje o ejecución, dime cómo guardo la versión aprobada y cómo vuelvo atrás.\n\nIncluye una sección de seguridad: datos que no debo pegar, permisos mínimos, acciones irreversibles, aprobación humana y forma de detener el proceso. Incluye también una sección de consumo: qué unidad puede descontarse en ${tool.label}, cómo medirla antes y después de una prueba, cómo estimar diez, cien y mil usos y qué dato debe comprobarse en la web oficial porque puede cambiar.\n\nTermina con una entrega que otra persona pueda repetir: nombre de la versión, archivos o enlaces que debe conservar, instrucciones de uso, límites conocidos, errores posibles, responsable y siguiente paso de menos de treinta minutos. No digas que está listo para producción hasta que la prueba tenga resultado y evidencia. Este es el encargo número ${index + 1} de mi biblioteca de trabajo y debe quedar escrito en español natural.`
  const details = `\n\nDetalle específico de ${tool.label}: separa la decisión de ${name.toLowerCase()} del trabajo posterior. Escribe el nombre visible de cada función, qué campo entra, qué campo sale y cómo se revisa un caso dudoso. Si no está disponible, marca COMPROBAR DISPONIBILIDAD y ofrece una alternativa.`
  prompt += details
  if (wordCount(prompt) > 600) prompt = prompt.replace(details, '')
  if (wordCount(prompt) < 450) prompt += `\n\nAntes de terminar, vuelve a mirar el caso concreto y añade un ejemplo rellenado con datos ficticios, una decisión que no tomarías todavía y la pregunta que tendría que responder una persona responsable antes de compartir el resultado.`
  return prompt
}

const DEFAULT_PROMPT_TASKS = ['Definir un problema real', 'Investigar y comparar opciones', 'Diagnosticar un error', 'Evaluar calidad', 'Documentar y entregar']
const TOOL_PROMPT_TASKS = {
  openai: ['Definir un problema real', 'Analizar información propia', 'Escribir una pieza profesional', 'Crear una imagen', 'Automatizar un proceso', 'Evaluar calidad', 'Documentar y entregar'],
  claude: ['Analizar información propia', 'Revisar y mejorar un texto', 'Hacer un cambio de código', 'Diagnosticar un error', 'Documentar y entregar'],
  'claude-code': ['Hacer un cambio de código', 'Diagnosticar un error', 'Evaluar calidad', 'Documentar y entregar'],
  codex: ['Hacer un cambio de código', 'Diagnosticar un error', 'Evaluar calidad', 'Documentar y entregar'],
  github: ['Hacer un cambio de código', 'Diagnosticar un error', 'Evaluar calidad', 'Documentar y entregar'],
  docker: ['Diagnosticar un error', 'Preparar datos y estructura', 'Evaluar calidad', 'Documentar y entregar'],
  'nano-banana': ['Crear una imagen', 'Editar una imagen de referencia', 'Evaluar calidad', 'Documentar y entregar'],
  higgsfield: ['Planificar un vídeo', 'Crear un storyboard', 'Evaluar calidad', 'Documentar y entregar'],
  runway: ['Planificar un vídeo', 'Crear un storyboard', 'Evaluar calidad', 'Documentar y entregar'],
  'seedance-2-5': ['Planificar un vídeo', 'Crear un storyboard', 'Evaluar calidad', 'Documentar y entregar'],
  n8n: ['Automatizar un proceso', 'Diagnosticar un error', 'Evaluar calidad', 'Documentar y entregar'],
  zapier: ['Automatizar un proceso', 'Diagnosticar un error', 'Documentar y entregar'],
  make: ['Automatizar un proceso', 'Diagnosticar un error', 'Documentar y entregar'],
  pipedream: ['Automatizar un proceso', 'Diagnosticar un error', 'Documentar y entregar'],
  'wispr-flow': [],
}

function generatedPromptsFor(tool, profile) {
  const wanted = TOOL_PROMPT_TASKS[tool.id] || DEFAULT_PROMPT_TASKS
  const tasks = wanted
    .map((name) => PROMPT_TASKS.find((task) => task[0] === name))
    .filter(Boolean)
  return tasks.map((task, index) => ({
    name: `${task[0]} con ${tool.label}`,
    prompt: promptFor(tool, profile, task, index),
    when: `Úsalo cuando quieras ${task[1]}.`,
    model: profile.selection,
  }))
}

function ensureMinimumToolPrompts(guide, tool, profile) {
  if (NO_PROMPT_TOOLS.has(tool.id)) return guide.prompts || []
  const prompts = Array.isArray(guide.prompts) ? guide.prompts : []
  const used = new Set(prompts.map((item) => String(item?.name || '').trim().toLowerCase()).filter(Boolean))
  const allowed = allowedTaskKindsFor(tool.id)
  // Solo encargos del tipo de trabajo que hace esta herramienta. Mejor 15
  // prompts pertinentes que 25 con relleno: aquí no se rellena hasta una cifra.
  const candidates = [...PROMPT_TASKS, ...EXTRA_PROMPT_TASKS]
    .filter((task) => allowed.has(TASK_KINDS[task[0]] || 'generic'))
  let index = prompts.length

  for (const task of candidates) {
    if (prompts.length >= MAX_GENERATED_TOOL_PROMPTS) break
    const name = `${task[0]} con ${tool.label}`
    if (used.has(name.toLowerCase())) continue
    prompts.push({
      name,
      prompt: promptFor(tool, profile, task, index),
      when: `Úsalo cuando quieras ${task[1]}.`,
      model: profile.selection,
    })
    used.add(name.toLowerCase())
    index += 1
  }

  return prompts
}

function automationFor(tool, profile, blueprint, index) {
  const [name, trigger, difficulty] = blueprint
  const platform = tool.id === 'n8n' ? 'n8n · workflow importable y prueba manual' : `n8n conectado con ${tool.label}`
  return {
    name: `${name} en ${tool.label}`,
    goal: `Usar ${tool.label} dentro de un flujo que pueda observarse, detenerse y reparar.`,
    difficulty,
    platform,
    trigger: `${trigger}. Define el identificador único antes de activar el flujo.`,
    steps: [
      `Recibir la entrada y guardar un registro de prueba con fecha, origen e identificador único.`,
      `Validar los campos obligatorios; si falta uno, detener el caso y avisar sin ejecutar la acción final.`,
      `Preparar los datos para ${tool.label}: nombres de campos, formato, tamaño y límites del plan.`,
      `Ejecutar la operación de ${tool.label} en una cuenta o espacio de pruebas.`,
      'Comprobar la salida con una condición observable y guardar el enlace, id o respuesta completa.',
      'Enviar el aviso o crear el registro final solo después de que la comprobación sea correcta.',
      'Registrar éxito, error, consumo, duración y responsable en una tabla de auditoría.',
      'Activar una ruta de error con reintento limitado y aviso humano; nunca repetir indefinidamente.',
    ],
    code: tool.id === 'n8n' ? `// Nodo Code de n8n: evita duplicados y deja una salida auditable\nconst item = $json;\nconst id = item.id || item.email || item.externalId;\nif (!id) throw new Error('Falta un identificador único');\nreturn [{ json: { ...item, workflowKey: String(id), receivedAt: new Date().toISOString(), needsReview: Boolean(item.needsReview) } }];` : undefined,
    test: `Ejecuta ${name.toLowerCase()} con un caso normal, uno incompleto, uno repetido y uno extremo. Comprueba que ${tool.label} recibe solo los campos necesarios, que un duplicado no crea una segunda salida y que el error aparece en el historial.`,
    failure: `Si ${tool.label} cambia el formato, se queda sin crédito o responde con error, conserva la entrada, no repitas la acción irreversible y avisa con el identificador del caso. Revisa primero credenciales, límites, datos y respuesta del servicio.`,
    credentials: `Cuenta de pruebas de ${tool.label}, credencial con permisos mínimos, cuenta de n8n y una tabla o registro de auditoría. Nunca guardes la clave dentro del código ni en un repositorio público.`,
    index,
  }
}

export function completeToolGuide(existing, tool) {
  const guide = existing || baseGuideFor(tool)
  const profile = profileFor(tool.id)
  guide.catalog = { intro: profile.intro, items: profile.catalog.map(([group, what, useWhen, avoidWhen, model]) => ({ group: 'Pieza interna', name: group, what, useWhen, avoidWhen, model })) }
  if (!Array.isArray(guide.prompts)) guide.prompts = generatedPromptsFor(tool, profile)
  guide.prompts = ensureMinimumToolPrompts(guide, tool, profile)
  guide.prompts = enrichToolPrompts(guide.prompts, tool, profile)
  // Las automatizaciones van donde tienen sentido, no en todas por plantilla:
  // las plataformas llevan el recetario general (son recetas de plataforma),
  // las conectables llevan las suyas reales, y el resto no lleva la seccion.
  // Si una guia declara automations: [] de forma explicita, se respeta.
  if (Array.isArray(guide.automations)) {
    guide.automations = guide.automations.slice(0, MAX_TOOL_AUTOMATIONS)
  } else if (AUTOMATION_PLATFORMS.has(tool.id)) {
    guide.automations = TASK_AUTOMATIONS.slice(0, MAX_TOOL_AUTOMATIONS).map((item, index) => automationFor(tool, profile, item, index))
  } else if (REAL_AUTOMATIONS[tool.id]) {
    guide.automations = REAL_AUTOMATIONS[tool.id].slice(0, MAX_TOOL_AUTOMATIONS)
  } else {
    guide.automations = []
  }
  return guide
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
