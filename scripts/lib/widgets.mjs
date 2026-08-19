/**
 * Piezas interactivas de cálculo y simulación.
 *
 * Todo pregrabado: precios congelados, textos de ejemplo y tiempos medidos de
 * ejecuciones reales típicas. No hay llamadas a ningún servicio.
 */

/**
 * Precios orientativos por millón de tokens, en euros.
 * Congelados a propósito: la lección enseña la ESTRUCTURA del coste (entrada,
 * salida, caché), no sirve como presupuesto. La fecha se muestra en pantalla.
 */
const PRICE_DATE = 'mayo de 2026'

const MODELS = [
  { id: 'pequeno', label: 'Modelo pequeño (tipo Haiku / mini)', input: 0.8, cachedInput: 0.08, output: 4 },
  { id: 'medio', label: 'Modelo medio (tipo Sonnet / GPT estándar)', input: 3, cachedInput: 0.3, output: 15 },
  { id: 'grande', label: 'Modelo grande (tipo Opus / razonamiento)', input: 15, cachedInput: 1.5, output: 75 },
]

export function costCalcFor(stageId) {
  const notes = {
    fundamentos: 'Mueve las llamadas al día y mira cómo crece la cifra anual. Lo que sorprende a todo el mundo la primera vez es cuánto pesa la salida: se paga bastante más cara que la entrada.',
    prompting: 'Sube los tokens de entrada: es lo que pasa cuando añades ejemplos al prompt. Y luego sube el caché, que es la forma de que esos ejemplos no se paguen enteros en cada llamada.',
    agentes: 'Un agente de diez pasos hace diez llamadas con el contexto acumulado. Multiplica las llamadas al día por diez y mira la cifra: eso es lo que cuesta la autonomía.',
    seguridad: 'Sube los reintentos al 30%. Eso es un día malo con una API inestable, y es dinero que se va sin producir ni un resultado útil.',
    datos: 'En RAG, los tokens de entrada suben mucho porque metes los fragmentos recuperados en cada consulta. Prueba con 8.000 de entrada y compara modelos.',
    calidad: 'Cada pasada de tu batería de evaluación cuesta esto. Por eso se tiene un conjunto pequeño para el día a día y uno grande solo antes de publicar.',
  }
  const note = notes[stageId]
  if (!note) return null

  return {
    kind: 'costcalc',
    title: 'Cuánto cuesta esto al mes',
    caption: 'Mueve los controles con datos de tu caso. Los precios son orientativos y están congelados: sirven para entender de qué depende el gasto, no para presupuestar.',
    priceDate: PRICE_DATE,
    models: MODELS,
    note,
  }
}

/** Texto de ejemplo para el simulador de troceado: un documento realista. */
const SAMPLE = `Política de devoluciones y garantía

El cliente dispone de 30 días naturales desde la recepción del pedido para solicitar la devolución de cualquier artículo, siempre que conserve el embalaje original y no muestre signos de uso. El plazo comienza el día en que el transportista registra la entrega.

Los gastos de envío de la devolución corren a cargo del cliente, salvo cuando el motivo sea un defecto de fabricación o un error en el pedido. En esos dos casos, la empresa asume el coste íntegro y envía una etiqueta prepagada por correo electrónico.

La garantía legal de los productos electrónicos es de 36 meses desde la fecha de compra. Durante los primeros 24 meses se presume que cualquier defecto existía en el momento de la entrega. A partir del mes 25, corresponde al cliente demostrarlo.

Quedan excluidos de la garantía los daños por caída, contacto con líquidos, uso distinto al descrito en el manual y las reparaciones realizadas por terceros no autorizados. La batería, por su naturaleza de consumible, tiene una garantía específica de 12 meses.

El reembolso se realiza mediante el mismo método de pago utilizado en la compra, en un plazo máximo de 14 días desde que la empresa recibe el artículo devuelto y verifica su estado.`

export function chunkingFor(stageId) {
  if (stageId !== 'datos') return null
  return {
    kind: 'chunking',
    title: 'Simulador de troceado',
    caption: 'Un documento real. Cambia el tamaño y el solapamiento, y luego pregunta algo para ver qué fragmento se recuperaría.',
    text: SAMPLE,
    note: 'Prueba a preguntar "¿cuántos meses de garantía tiene la batería?" con fragmentos de 100 caracteres: verás que la respuesta llega partida y el modelo tiene que adivinar. Después cambia a corte por párrafos.',
  }
}

/** Líneas de tiempo por área, con tiempos típicos de ejecuciones reales. */
const TIMELINES = {
  automatizacion: {
    title: 'Qué pasa cuando se dispara tu workflow',
    caption: 'Una ejecución real de principio a fin. Pulsa cada tramo para ver qué ocurre y qué pasa si falla ahí.',
    note: 'Fíjate en dónde se va el tiempo: casi siempre en las llamadas a servicios externos, no en tu lógica. Optimizar tu código cuando el 80% del tiempo es una API ajena no sirve de nada.',
    steps: [
      { label: 'Llega el webhook', ms: 40, risk: 'bajo', detail: 'El servicio externo entrega el evento. Tu flujo despierta.', fails: 'El evento se pierde salvo que el emisor reintente. Por eso importa responder rápido, aunque proceses después.' },
      { label: 'Validación de los datos', ms: 15, risk: 'bajo', detail: 'Se comprueba que vienen los campos obligatorios y con el formato esperado.', fails: 'Aquí es donde QUIERES que falle: barato, temprano y sin haber tocado nada externo.' },
      { label: 'Consulta a la base de datos', ms: 180, risk: 'medio', detail: 'Se busca si el registro ya existe, para no duplicarlo.', fails: 'Si se salta este paso, el mismo evento repetido crea dos registros. Es el fallo de idempotencia clásico.' },
      { label: 'Llamada al modelo', ms: 2400, risk: 'alto', detail: 'La parte lenta y la que cuesta dinero. Clasifica o redacta según el caso.', fails: 'Timeout o límite de peticiones. Necesita reintento con espera creciente y un plan B si no responde.' },
      { label: 'Validación de la salida', ms: 20, risk: 'medio', detail: 'Se comprueba que lo devuelto encaja con el esquema esperado antes de usarlo.', fails: 'Sin esto, un JSON mal formado revienta el nodo siguiente con un error incomprensible.' },
      { label: 'Aprobación humana', ms: 900, risk: 'humano', detail: 'Para acciones irreversibles: enviar, pagar, publicar o borrar.', fails: 'Si nadie aprueba, el flujo debe quedarse esperando, no continuar por defecto.' },
      { label: 'Acción externa', ms: 620, risk: 'alto', detail: 'Se envía el correo, se crea la factura o se escribe en el CRM.', fails: 'Ya es irreversible. Si falla a mitad, tienes un estado inconsistente: registro creado y correo sin enviar.' },
      { label: 'Registro', ms: 30, risk: 'bajo', detail: 'Qué entró, qué se decidió y qué salió.', fails: 'Sin registro, mañana no puedes explicar qué pasó. Es el paso que todo el mundo deja para el final y nunca hace.' },
    ],
  },
  calidad: {
    title: 'Anatomía de un incidente',
    caption: 'Desde que algo se rompe hasta que se aprende de ello. Pulsa cada tramo.',
    note: 'El tramo más caro casi nunca es reparar: es el tiempo que pasa hasta que alguien se entera. Ahí es donde invierten los equipos que van en serio.',
    steps: [
      { label: 'El fallo ocurre', ms: 100, risk: 'alto', detail: 'Un cambio de versión, un dato inesperado o un servicio caído.', fails: 'Nada avisa todavía. El sistema sigue funcionando mal en silencio.' },
      { label: 'Tiempo hasta detectarlo', ms: 5400, risk: 'alto', detail: 'Con alertas, minutos. Sin alertas, hasta que se queja un usuario: días.', fails: 'Este es el tramo que hay que reducir. Todo lo demás importa menos.' },
      { label: 'Diagnóstico', ms: 1800, risk: 'medio', detail: 'Se mira el registro: qué entró, qué se decidió, qué salió.', fails: 'Sin logs esto es adivinar. Con logs son diez minutos.' },
      { label: 'Reparación', ms: 900, risk: 'medio', detail: 'Se corrige la causa, no el síntoma.', fails: 'Arreglar el síntoma garantiza que vuelva a pasar con otra cara.' },
      { label: 'Prueba que lo evita', ms: 600, risk: 'bajo', detail: 'Se añade el caso al conjunto de regresión.', fails: 'Sin esto, el mismo fallo vuelve en tres meses.' },
      { label: 'Postmortem', ms: 1200, risk: 'humano', detail: 'Qué pasó, por qué, y qué acción concreta con responsable y fecha.', fails: 'Sin acciones asignadas es un diario, no una mejora.' },
    ],
  },
  agentes: {
    title: 'Un ciclo del agente, paso a paso',
    caption: 'Lo que ocurre en cada vuelta del bucle. Pulsa cada tramo para ver el coste y el riesgo.',
    note: 'Multiplica esto por el número de iteraciones. Un agente que da diez vueltas no cuesta diez veces uno: cuesta más, porque el contexto crece en cada vuelta y se vuelve a enviar entero.',
    steps: [
      { label: 'Se le da el objetivo', ms: 10, risk: 'bajo', detail: 'Cuanto más vago sea, más vueltas dará buscando qué hacer.' },
      { label: 'Decide qué herramienta usar', ms: 2100, risk: 'alto', detail: 'Elige según la descripción de cada herramienta. Una descripción ambigua produce un uso equivocado.', fails: 'Elige mal y actúa igualmente. El error no es una respuesta fea: es una acción.' },
      { label: 'Ejecuta la herramienta', ms: 540, risk: 'alto', detail: 'Aquí toca el mundo real: lee, escribe o envía.', fails: 'Si la herramienta es irreversible y no había confirmación, no hay marcha atrás.' },
      { label: 'Lee el resultado', ms: 30, risk: 'alto', detail: 'Incorpora la salida al contexto. Aquí entra también texto de terceros.', fails: 'Es el punto de entrada de la inyección indirecta: una web puede traer instrucciones dentro.' },
      { label: 'Comprueba el límite de pasos', ms: 5, risk: 'bajo', detail: 'El techo de iteraciones. Sin él, el bucle es una factura abierta.' },
      { label: 'Vuelve a empezar o termina', ms: 15, risk: 'medio', detail: 'Y necesita poder decir "no he podido" en vez de seguir intentándolo.' },
    ],
  },
  entrega: {
    title: 'De aviso a cliente satisfecho',
    caption: 'El ciclo de una entrega real. Pulsa cada tramo.',
    note: 'El tramo del traspaso es el que casi todo el mundo se salta, y es el que decide si te vuelven a llamar para el siguiente proyecto o para pedirte soporte gratis.',
    steps: [
      { label: 'Alcance por escrito', ms: 600, risk: 'humano', detail: 'Qué entra, qué no y cómo se piden cambios.', fails: 'Sin esto llega el goteo de "una cosita más" y no hay forma de decir que no sin parecer difícil.' },
      { label: 'Construcción', ms: 4800, risk: 'medio', detail: 'La parte que todo el mundo cree que es el trabajo entero.' },
      { label: 'Demo ensayada', ms: 900, risk: 'alto', detail: 'Repetible, sin depender de internet ni de credenciales en vivo.', fails: 'El día de la reunión, la API elegirá caerse. Siempre.' },
      { label: 'Documentación', ms: 1200, risk: 'medio', detail: 'Instalación, uso, límites y los tres errores más probables con su arreglo.' },
      { label: 'Traspaso', ms: 900, risk: 'humano', detail: 'Que lo instale el cliente con tu paquete, delante de ti y sin ayudarle.', fails: 'Si tiene que llamarte, faltaba algo. Mejor descubrirlo ahora que en agosto.' },
      { label: 'Mantenimiento', ms: 1500, risk: 'medio', detail: 'Un sistema vivo consume APIs y se rompe cuando cambia un tercero.', fails: 'Si no lo facturaste aparte, acabas dándolo gratis o abandonando al cliente.' },
    ],
  },
}

export function timelineFor(stageId) {
  const preset = TIMELINES[stageId]
  return preset ? { kind: 'timeline', ...preset } : null
}
