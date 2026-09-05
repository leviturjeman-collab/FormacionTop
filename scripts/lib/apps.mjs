/**
 * Guías de aplicación.
 *
 * Qué se hace dentro de cada herramienta, con los nombres reales de los botones
 * y los menús, qué importa de verdad y qué es ruido. Más un ejemplo de
 * automatización real de principio a fin.
 *
 * Escrito a mano. Es lo que un documento técnico no cuenta y todo el mundo
 * necesita la primera vez que abre la aplicación.
 */

export const APPS = {
  codex: {
    label: 'Codex', icon: 'codex',
    what: 'Agente de OpenAI que trabaja con los archivos de tu proyecto y ejecuta pruebas.',
    open: 'Consulta developers.openai.com/codex/quickstart para elegir aplicación, editor o terminal.',
    steps: [['Abrir el proyecto', 'Selecciona su carpeta y pide que identifique cómo se ejecuta.'], ['Definir el cambio', 'Describe el problema y un resultado que puedas comprobar.'], ['Revisar', 'Comprueba los cambios y el resultado de las pruebas.']],
    matters: ['Conserva una versión recuperable antes de editar.', 'Publica solo después de revisar el resultado.'],
    ignore: ['Pedir cambios generales sin un criterio de éxito.'],
    example: { title: 'Corregir un formulario', steps: ['Reproduce el fallo con datos de prueba.', 'Pide a Codex una corrección y una prueba del caso.', 'Revisa el formulario y los archivos modificados.'], time: 'Depende del alcance; mide el primer caso.' },
  },
  n8n: {
    label: 'n8n',
    icon: 'n8n',
    what: 'Un editor visual de flujos. Arrastras nodos, los conectas y el flujo se ejecuta solo cuando ocurre algo.',
    open: 'En la nube (n8n.cloud) o en tu equipo con Docker. Para aprender, la versión local basta y no cuesta nada.',
    steps: [
      ['Crear el flujo', 'Botón "+" arriba a la derecha → "Start from scratch". Ponle nombre YA: "Workflow 1" multiplicado por veinte es un infierno.'],
      ['Añadir el disparador', 'Primer nodo, siempre. "Add first step" → elige: Webhook (llega una petición), Schedule (cada X tiempo) o el disparador de una app (Gmail, Sheets…).'],
      ['Conectar credenciales', 'Dentro del nodo, "Credential to connect with" → "Create new". Se guardan en n8n, no en el flujo: por eso al exportar el JSON no viajan.'],
      ['Probar con datos reales', 'Botón "Test step" en cada nodo. Ejecuta SOLO ese nodo y te enseña la salida. Es la forma de trabajar: nodo a nodo, no el flujo entero.'],
      ['Ver los datos que pasan', 'Panel de la derecha: "INPUT" y "OUTPUT". Cambia a la vista "JSON" para ver los nombres exactos de los campos, que es lo que necesitas para referenciarlos.'],
      ['Referenciar un campo', 'Arrastra el campo del panel INPUT al hueco donde lo quieres. Genera algo como {{ $json.email }}. Escribirlo a mano es la principal fuente de erratas.'],
      ['Activar', 'Interruptor "Inactive → Active" arriba a la derecha. Hasta que no lo actives, el webhook de producción no escucha.'],
    ],
    matters: [
      'La URL del webhook es distinta en Test y en Production. Copiar la de test a un formulario real es el error número uno.',
      'Cada ejecución queda en "Executions": ahí ves qué entró y qué salió en cada nodo. Es tu registro y tu depurador.',
      'Un nodo en rojo detiene el flujo. Si quieres que continúe, en Settings del nodo → "On Error" → "Continue".',
      'Las credenciales se comparten entre flujos. Cambiar una afecta a todos los que la usan.',
    ],
    ignore: [
      'Los cientos de integraciones del catálogo. Vas a usar cinco. No pierdas tiempo explorándolas.',
      'Colocar los nodos bonitos en el lienzo. No cambia nada del funcionamiento.',
      'Las plantillas de la comunidad al empezar: traen veinte nodos y no entiendes ninguno.',
    ],
    example: {
      title: 'Automatización real: formulario de web a CRM con aviso en Slack',
      steps: [
        'Webhook recibe el POST del formulario de tu web.',
        'Nodo Code valida email y consentimiento, y genera un id de evento para no duplicar.',
        'Nodo IF separa: si falta algo, va a la rama de error y lo registra en una hoja de Google.',
        'Nodo de OpenAI/Anthropic clasifica el interés en alto, medio o bajo a partir del mensaje libre.',
        'Nodo HTTP Request crea el contacto en el CRM con la clasificación.',
        'Nodo Slack avisa al comercial solo si el interés es alto: si avisa de todo, dejan de mirarlo.',
        'Nodo Google Sheets deja la traza: entrada, decisión y resultado.',
      ],
      time: 'Unas 2 horas la primera vez, 20 minutos cuando ya lo has hecho.',
    },
  },

  chatgpt: {
    label: 'ChatGPT',
    icon: 'openai',
    what: 'La interfaz de chat de OpenAI. Para trabajo repetido, lo que importa no es el chat sino los Proyectos y las instrucciones personalizadas.',
    open: 'chatgpt.com. La versión gratuita sirve para aprender; para trabajo serio hace falta plan de pago por el modelo y los límites.',
    steps: [
      ['Crear un Proyecto', 'Barra lateral → "Projects" → "+". Un proyecto guarda instrucciones y archivos que se aplican a todas sus conversaciones.'],
      ['Poner las instrucciones', 'Dentro del proyecto → "Instructions". Aquí va quién eres, en qué idioma, con qué formato. No lo repites en cada mensaje.'],
      ['Subir los archivos de contexto', 'Arrastra los documentos al proyecto. Quedan disponibles en todas sus conversaciones sin volver a subirlos.'],
      ['Guardar lo que funciona', 'Cuando un prompt te da un resultado bueno, cópialo a un archivo. La conversación se pierde entre cientos; el archivo no.'],
      ['Desactivar el entrenamiento', 'Settings → Data controls → "Improve the model for everyone" → off. Imprescindible si metes datos de clientes.'],
    ],
    matters: [
      'Las conversaciones largas empeoran: lo del principio se sale del contexto. Abre una nueva y pega lo importante.',
      'Los Proyectos son la diferencia entre usarlo como juguete y usarlo como herramienta de trabajo.',
      'Lo que pegas puede usarse para entrenar salvo que lo desactives o tengas plan Enterprise.',
    ],
    ignore: [
      'Los GPTs de la tienda. Casi todos son un prompt en una caja, y puedes escribir el tuyo mejor.',
      'Perseguir el "prompt mágico" de los vídeos. Lo que funciona es concreto y verificable, no secreto.',
    ],
    example: {
      title: 'Automatización real: respuestas a incidencias con el tono de tu empresa',
      steps: [
        'Creas un Proyecto llamado "Soporte".',
        'En Instructions: tono, longitud máxima, qué nunca prometer y cuándo escalar a una persona.',
        'Subes al proyecto: catálogo de productos, política de devoluciones y diez respuestas modelo reales.',
        'Por cada incidencia, pegas el texto del cliente y pides el borrador.',
        'Revisas y envías tú. El borrador se hace en 5 segundos; la revisión en 30.',
      ],
      time: '30 minutos de montaje. Ahorra 2-3 minutos por incidencia.',
    },
  },

  'claude-code': {
    label: 'Claude Code',
    icon: 'claude',
    what: 'Un asistente que trabaja dentro de tu proyecto desde la terminal: lee tus archivos, los modifica y ejecuta comandos.',
    open: 'Se instala con npm y se ejecuta escribiendo `claude` dentro de la carpeta del proyecto.',
    steps: [
      ['Instalar', 'npm install -g @anthropic-ai/claude-code, y después `claude` en la carpeta de tu proyecto.'],
      ['Preparar el terreno', 'Antes de nada: git status limpio y una rama nueva. Sin esto no puedes deshacer lo que haga.'],
      ['Crear CLAUDE.md', 'Un archivo en la raíz con las reglas del proyecto: cómo se ejecuta, qué no tocar, qué convenciones seguís. Lo lee en cada sesión.'],
      ['Pedir en pequeño', 'Una tarea concreta por petición. "Refactoriza el proyecto" da resultados imprevisibles; "extrae la validación del email a su propia función" no.'],
      ['Revisar el diff', 'Cuando termina, git diff. Siempre. Es el paso que separa usar la herramienta de confiar a ciegas.'],
      ['Deshacer si no convence', 'git checkout -- . descarta todo. Con git detrás, equivocarse es gratis.'],
    ],
    matters: [
      'CLAUDE.md es lo que más cambia la calidad del resultado, y casi nadie lo escribe.',
      'Acotar lo que puede tocar: trabajar en una rama y en una carpeta concreta limita el daño de un error.',
      'Los cambios grandes son difíciles de revisar. Si toca quince archivos, pídele que lo haga en tres pasos.',
    ],
    ignore: [
      'Intentar que haga el proyecto entero de una vez. Sale un montón de código que no entiendes y no puedes mantener.',
      'Discutir con él cuando se equivoca dos veces seguidas. Sal, piensa qué le falta de contexto y vuelve con eso.',
    ],
    example: {
      title: 'Automatización real: añadir pruebas a un proyecto que no tiene ninguna',
      steps: [
        'git checkout -b anadir-tests.',
        'Le pides: "lee src/validacion.py y escribe tests para los casos límite: vacío, nulo y formato incorrecto".',
        'Ejecuta los tests él mismo y arregla lo que falla.',
        'Revisas el diff: compruebas que los tests prueban algo de verdad y no solo que la función existe.',
        'Repites archivo a archivo, no todo el proyecto de golpe.',
      ],
      time: '10-15 minutos por archivo, frente a una hora a mano.',
    },
  },

  github: {
    label: 'GitHub',
    icon: 'github',
    what: 'Donde vive tu código en internet, con su historial completo y quién cambió qué.',
    open: 'github.com. Gratis para repositorios públicos y privados.',
    steps: [
      ['Crear el repositorio', 'Botón "+" arriba a la derecha → "New repository". Márcalo privado si tienes dudas: pasar a público luego es un clic.'],
      ['Conectarlo con tu carpeta', 'git init, git remote add origin <url>, git add ., git commit -m "primer commit", git push -u origin main.'],
      ['Proteger la rama principal', 'Settings → Branches → "Add rule" sobre main. Evita que un push arruine el trabajo de otro.'],
      ['Activar el escáner de secretos', 'Settings → Code security → "Secret scanning". Te avisa si subes una clave. Actívalo el primer día.'],
      ['Trabajar con Pull Requests', 'Rama → cambios → push → "Compare & pull request". Aunque trabajes solo: te obliga a revisar tu propio diff.'],
    ],
    matters: [
      'Lo que subes una vez queda en el historial aunque lo borres después. Una clave filtrada se revoca, no se borra.',
      '.gitignore antes del primer commit, no después.',
      'El README es lo primero que ve quien llega, incluido un cliente. Instalación, uso y límites.',
    ],
    ignore: [
      'Las estadísticas de contribuciones y el cuadrito verde. No miden nada útil.',
      'Configurar Actions complejas antes de tener el proyecto funcionando.',
    ],
    example: {
      title: 'Automatización real: publicar una web cada vez que cambias el código',
      steps: [
        'Subes el proyecto a GitHub.',
        'En Vercel: "Add New Project" → importas el repositorio.',
        'Vercel detecta el framework y despliega solo.',
        'A partir de ahí, cada push a main publica la nueva versión en un minuto.',
        'Cada Pull Request genera además una URL de vista previa para enseñarla antes de publicar.',
      ],
      time: '10 minutos de montaje, una vez.',
    },
  },

  docker: {
    label: 'Docker',
    icon: 'docker',
    what: 'Empaqueta un programa con todo lo que necesita para funcionar, para que se ejecute igual en cualquier ordenador.',
    open: 'Docker Desktop en Windows y Mac. En Linux, el motor directamente.',
    steps: [
      ['Comprobar que está', 'docker --version. Si no responde, Docker Desktop no está arrancado.'],
      ['Levantar servicios', 'Con un archivo docker-compose.yml en la carpeta: docker compose up -d. El -d lo deja en segundo plano.'],
      ['Ver qué corre', 'docker ps. Muestra contenedores activos, puertos y estado.'],
      ['Ver por qué falla', 'docker compose logs -f nombre_servicio. Es lo primero que se mira siempre.'],
      ['Parar', 'docker compose down. Con -v borra además los datos: cuidado con ese flag.'],
    ],
    matters: [
      'Los datos se pierden al borrar el contenedor salvo que definas un volumen.',
      'Fija las versiones de las imágenes (pg16, no latest): "latest" cambia bajo tus pies.',
      'Si el puerto está ocupado, cambia el de tu lado: "5433:5432", no el de dentro.',
    ],
    ignore: [
      'Optimizar el tamaño de la imagen mientras aprendes.',
      'Kubernetes. No lo necesitas y no lo vas a necesitar en mucho tiempo.',
    ],
    example: {
      title: 'Automatización real: entorno completo de desarrollo en un comando',
      steps: [
        'Un docker-compose.yml con Postgres + pgvector, Redis y n8n.',
        'docker compose up -d levanta los tres.',
        'Tu compañero clona el repositorio, ejecuta el mismo comando y tiene exactamente lo mismo.',
        'Al terminar el día, docker compose down y tu equipo queda limpio.',
      ],
      time: '30 minutos de montaje. Ahorra el día entero de "no me arranca".',
    },
  },

  copilot: {
    label: 'GitHub Copilot',
    icon: 'githubcopilot',
    what: 'Autocompletado de código dentro del editor. Sugiere la línea o el bloque siguiente mientras escribes.',
    open: 'Extensión en VS Code, JetBrains o Neovim. Requiere suscripción.',
    steps: [
      ['Instalar', 'VS Code → Extensiones → "GitHub Copilot" → iniciar sesión con tu cuenta.'],
      ['Aceptar o rechazar', 'Tab acepta la sugerencia, Esc la descarta. Alt+] pasa a la siguiente alternativa.'],
      ['Guiarlo con un comentario', 'Escribe // función que valida un email español y devuelve bool y deja que complete. El comentario es tu prompt.'],
      ['Usar el chat', 'Ctrl+I abre el chat en línea para pedir un cambio sobre lo seleccionado.'],
    ],
    matters: [
      'Sugiere a partir del código abierto en tu editor. Con los archivos relevantes abiertos, acierta mucho más.',
      'Inventa nombres de funciones de librerías que suenan perfectos y no existen. Compruébalo contra la documentación de tu versión.',
      'Aceptar sin leer es el hábito peligroso: no da error, solo deuda.',
    ],
    ignore: [
      'Sus sugerencias de comentarios y docstrings genéricas: describen lo obvio.',
      'Pelearte para que salga exactamente lo que quieres. Si tardas más que escribiéndolo, escríbelo.',
    ],
    example: {
      title: 'Automatización real: convertir un formato de datos a otro',
      steps: [
        'Abres el archivo de origen y el de destino en pestañas contiguas.',
        'Escribes un comentario con el mapeo: // convierte cliente_v1 a cliente_v2.',
        'Escribes la primera línea del mapeo a mano; a partir de ahí completa el resto.',
        'Revisas campo por campo: los que se llaman parecido son donde se equivoca.',
      ],
      time: 'Minutos, frente a media hora de copiar y pegar con erratas.',
    },
  },

  vercel: {
    label: 'Vercel',
    icon: 'vercel',
    what: 'Publica tu web en internet conectándose a tu repositorio. Cada cambio se despliega solo.',
    open: 'vercel.com, entrando con tu cuenta de GitHub.',
    steps: [
      ['Importar', '"Add New… → Project" → eliges el repositorio. Detecta el framework solo.'],
      ['Variables de entorno', 'Settings → Environment Variables. Aquí van las claves. No en el código, nunca.'],
      ['Desplegar', 'Automático en cada push a main. Cada rama genera además su URL de vista previa.'],
      ['Ver por qué falló', 'Pestaña Deployments → el que falló → "Building" para leer el error completo.'],
    ],
    matters: [
      'Las variables de entorno hay que definirlas por entorno: producción, preview y desarrollo son distintos.',
      'Si el build funciona en local y falla aquí, casi siempre es una variable que falta o una dependencia que tenías instalada globalmente.',
      'La URL de preview de cada Pull Request es la mejor forma de enseñar algo a un cliente antes de publicarlo.',
    ],
    ignore: [
      'Configurar dominio propio antes de que el proyecto funcione.',
      'Los planes de pago mientras estés aprendiendo: el gratuito sobra.',
    ],
    example: {
      title: 'Automatización real: enseñar avances a un cliente sin publicar nada',
      steps: [
        'Creas una rama con el cambio.',
        'Haces push y abres un Pull Request.',
        'Vercel genera una URL de vista previa automáticamente.',
        'Le mandas esa URL al cliente. La web publicada sigue intacta.',
        'Cuando aprueba, fusionas a main y se publica.',
      ],
      time: 'Cero: ocurre solo una vez conectado.',
    },
  },

  supabase: {
    label: 'Supabase',
    icon: 'supabase',
    what: 'Una base de datos PostgreSQL en la nube con autenticación, almacenamiento y API automática encima.',
    open: 'supabase.com. El plan gratuito da para proyectos reales pequeños.',
    steps: [
      ['Crear el proyecto', '"New project" → elige región cercana (afecta a la latencia) y guarda la contraseña que te da.'],
      ['Crear tablas', 'Table Editor → "New table". O mejor, SQL Editor y escribes el CREATE TABLE: queda versionable.'],
      ['Coger las claves', 'Settings → API. La anon key va en el navegador; la service_role NUNCA sale del servidor.'],
      ['Activar RLS', 'Authentication → Policies. Sin Row Level Security, cualquiera con la anon key lee toda la tabla.'],
      ['Búsqueda vectorial', 'Database → Extensions → activa "vector". Ya puedes guardar embeddings.'],
    ],
    matters: [
      'RLS desactivado es el fallo de seguridad más común de Supabase. Actívalo antes de meter un solo dato real.',
      'La service_role key salta todas las políticas. Si acaba en el navegador, has abierto la base entera.',
      'Los proyectos gratuitos se pausan por inactividad. Para una demo a cliente, entra antes.',
    ],
    ignore: [
      'Las funciones Edge mientras aprendes: se resuelve con una API normal.',
      'Optimizar índices antes de tener datos suficientes para notarlo.',
    ],
    example: {
      title: 'Automatización real: buscador semántico sobre tus documentos',
      steps: [
        'Activas la extensión vector.',
        'Creas la tabla documentos con una columna embedding VECTOR(1536).',
        'Un script trocea tus PDFs, genera los embeddings y los inserta.',
        'Creas una función SQL que recibe un vector y devuelve los N más cercanos.',
        'Tu web llama a esa función y muestra los resultados con enlace al documento.',
      ],
      time: 'Una tarde la primera vez.',
    },
  },
}

const ALIASES = {
  openai: 'chatgpt',
  anthropic: 'claude',
  node: null,
  python: null,
}

/** Devuelve la guía de la aplicación principal de la lección, si la hay. */
/**
 * La guía de una herramienta SOLO se muestra si la lección va de esa
 * herramienta. Antes se elegía por área, y eso metía la guía de Docker en una
 * lección sobre Linux y el ejemplo de n8n en cientos de lecciones distintas.
 */
export function appGuideFor(tools, stageId, title = '') {
  const enTitulo = title.toLowerCase()
  for (const tool of tools) {
    const key = tool in ALIASES ? ALIASES[tool] : tool
    if (!key || !APPS[key]) continue
    // Tiene que nombrarse en el título: es la señal de que la lección va de eso.
    if (enTitulo.includes(APPS[key].label.toLowerCase())) return APPS[key]
  }
  return null
}
