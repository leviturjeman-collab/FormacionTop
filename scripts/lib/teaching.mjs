/**
 * Material pedagógico escrito a mano, por área.
 *
 * Esto NO sale del vault: es lo que un documento técnico nunca trae y una
 * formación necesita. Por qué importa, qué NO es, qué cuesta, qué alternativas
 * existen y cómo se rompe en producción.
 *
 * Se inyecta en las lecciones según su área, y por eso el nivel avanzado deja
 * de ser un resumen con otro título.
 */

export const TEACHING = {
  fundamentos: {
    why: 'Casi todo el mundo empieza por la herramienta y se salta esto. Luego no sabe explicar por qué el modelo se ha inventado un dato, y acaba diciendo "es que la IA falla" — que es como decir que el coche falla porque no sabes conducir. Entender el mecanismo es lo que separa a quien usa la IA de quien la sufre.',
    notWhat: [
      'No es un buscador. No consulta una base de datos de hechos antes de responder: compone la respuesta palabra a palabra.',
      'No razona como una persona, aunque lo parezca. Calcula qué continuación es más probable, y a veces esa continuación coincide con razonar bien.',
      'No aprende de tus conversaciones. Lo que le cuentas hoy no lo sabe mañana, salvo que tú lo vuelvas a poner delante.',
      'No tiene intenciones. Cuando "miente" no está engañándote: está completando un patrón sin ninguna noción de verdad.',
    ],
    cost: 'Se paga por token, y un token no es una palabra: en español, una palabra larga son dos o tres. Pagas lo que entra (todo el contexto, en cada llamada, incluido el historial que arrastras) y lo que sale. Una conversación larga se encarece sola porque cada turno reenvía todo lo anterior.',
    alternatives: [
      ['Una regla escrita a mano', 'Si el problema tiene tres casos conocidos, un if lo resuelve mejor, gratis y sin sorpresas.'],
      ['Un modelo pequeño o local', 'Para clasificar o extraer datos con formato fijo, un modelo pequeño acierta casi igual por una fracción del precio.'],
      ['Un modelo grande', 'Solo cuando la tarea exige lenguaje abierto, contexto amplio o varios pasos de razonamiento.'],
    ],
    failures: [
      ['Se inventa un dato con formato impecable', 'Porque un dato falso bien formado es tan probable como uno verdadero. Se detecta pidiendo la fuente y verificándola, no leyendo la respuesta.'],
      ['Ignora una instrucción del medio del prompt', 'La atención no reparte igual: pesa más el principio y el final. Lo crítico va arriba o abajo, nunca enterrado.'],
      ['Cambia de comportamiento sin que tú cambies nada', 'El proveedor actualizó el modelo. Sin casos de prueba guardados, te enteras por una queja.'],
    ],
  },

  prompting: {
    why: 'Un prompt no es una forma de hablar: es una especificación. La diferencia entre alguien que "usa ChatGPT" y un profesional es que el segundo escribe encargos que se pueden comprobar, guardar, versionar y reutilizar. Lo primero es una conversación; lo segundo es una pieza de trabajo.',
    notWhat: [
      'No es cuestión de ser educado. "Por favor" no mejora la respuesta; un formato de salida definido, sí.',
      'No es magia de palabras secretas. Los "prompts mágicos" que circulan funcionan porque son concretos, no porque tengan una fórmula oculta.',
      'No sustituye a validar. Pedir JSON no garantiza JSON válido: hay que comprobarlo antes de usarlo.',
      'No es eterno. Un prompt que funciona hoy puede romperse con la próxima versión del modelo.',
    ],
    cost: 'Cada ejemplo que añades al prompt se paga en todas las llamadas, para siempre. Tres ejemplos largos pueden multiplicar por cinco el coste de una tarea sencilla. El caché de prompt abarata la parte que no cambia: por eso conviene poner lo estable al principio y lo variable al final.',
    alternatives: [
      ['Prompt directo', 'Tarea simple y bien definida. Lo más barato y lo más rápido.'],
      ['Con ejemplos (few-shot)', 'Cuando el formato o el tono son difíciles de describir pero fáciles de enseñar.'],
      ['Razonamiento paso a paso', 'Solo si el problema encadena varios saltos lógicos. En tareas simples añade coste sin mejorar nada.'],
      ['Ajuste fino del modelo', 'Miles de ejemplos y un patrón muy estable. Caro, lento, y casi nunca es lo primero que hace falta.'],
    ],
    failures: [
      ['Responde bien 9 de cada 10 veces', 'Suficiente para una demo, inaceptable para un proceso automático. Ese 10% hay que capturarlo con validación y una vía de reintento o revisión.'],
      ['Se salta el formato cuando la entrada es rara', 'Los casos límite rompen el molde. Hay que probarlos a propósito, no esperar a encontrarlos.'],
      ['El texto del usuario acaba dando órdenes', 'Inyección de prompt. Se acota separando datos de instrucciones y, sobre todo, limitando qué puede hacer el sistema.'],
    ],
  },

  entorno: {
    why: 'El entorno es lo que hace que tu trabajo exista fuera de tu ordenador. Sin esto puedes construir algo que funcione y ser incapaz de entregarlo, retomarlo en tres meses o explicarle a otra persona cómo arrancarlo. Es la parte menos vistosa y la que más proyectos entierra.',
    notWhat: [
      'No es "cosa de programadores". Es la diferencia entre un trabajo que se puede repetir y uno que solo funciona hoy y aquí.',
      'No hace falta dominar la terminal entera. Con moverse, listar, crear y ejecutar se cubre casi todo.',
      'Un archivo .env no cifra nada. Solo separa los secretos del código para que no viajen con él.',
      'Instalar no es configurar. Que el programa exista no significa que tu proyecto sepa encontrarlo.',
    ],
    cost: 'Aquí el coste es tiempo, y se paga siempre: o media hora ahora dejando versiones fijadas y un archivo de ejemplo con las variables, o dos días dentro de seis meses intentando reconstruir qué tenías instalado.',
    alternatives: [
      ['Instalación directa en tu máquina', 'Lo más rápido para empezar. Se desincroniza en cuanto sois más de uno.'],
      ['Entorno virtual o gestor de versiones', 'Aísla el proyecto sin complicarte. Es el punto dulce para la mayoría de casos.'],
      ['Contenedores', 'Reproducibilidad casi total, a cambio de una capa más que aprender y mantener.'],
      ['Entorno en la nube', 'Cero instalación y funciona igual para todos, pero dependes de la conexión y se paga por uso.'],
    ],
    failures: [
      ['"En mi ordenador funciona"', 'Versiones distintas o una variable de entorno que solo existe en tu máquina. Se evita fijando versiones y documentando las variables.'],
      ['Una clave acaba en el repositorio', 'Los escáneres automáticos la encuentran en minutos. Se revoca primero y se limpia el historial después, nunca al revés.'],
      ['El proyecto arranca pero no conecta', 'Casi siempre falta una variable o apunta a un servicio que no está levantado. Por eso la comprobación mínima va en la documentación.'],
    ],
  },

  asistentes: {
    why: 'Un asistente de código multiplica tu velocidad y también tus puntos ciegos. Aprender a usarlo no va de escribir mejores peticiones: va de saber revisar, de acotar lo que puede tocar y de reconocer el momento en el que estás aceptando código que no entiendes. Ese momento llega siempre.',
    notWhat: [
      'No es un programador. No entiende tu negocio, tus datos ni las consecuencias de lo que escribe.',
      'No garantiza que la librería que usa exista. Inventa funciones con nombres perfectamente plausibles.',
      'No sustituye saber leer código. Si no puedes revisar lo que produce, no puedes usarlo con responsabilidad.',
      'No recuerda tu proyecto entre sesiones salvo que se lo vuelvas a dar.',
    ],
    cost: 'La suscripción es lo de menos. El coste real es el tiempo de revisión, que crece con el tamaño del cambio, y la deuda que genera un código aceptado sin entender: se paga entero el día que hay que modificarlo.',
    alternatives: [
      ['Autocompletado en el editor', 'Sugerencias línea a línea. Bajo riesgo, ganancia constante.'],
      ['Chat con contexto del proyecto', 'Para entender código ajeno o planificar un cambio antes de tocarlo.'],
      ['Agente que edita archivos y ejecuta', 'La mayor ganancia y el mayor riesgo. Exige control de versiones y alcance acotado.'],
      ['Hacerlo a mano', 'Cuando el código es delicado, tú eres el experto, o el error sale muy caro.'],
    ],
    failures: [
      ['Rompe algo que funcionaba en otro archivo', 'Cambió una firma o un nombre sin ver quién lo usaba. Lo cazan las pruebas y el diff, no la lectura en diagonal.'],
      ['Escribe código que pasa las pruebas pero está mal', 'Optimizó para la prueba, no para el problema. Revisa la lógica, no solo el verde.'],
      ['Te acostumbras a aceptar sin leer', 'Es el fallo más peligroso porque no da error. Se combate revisando siempre el diff, sin excepción.'],
    ],
  },

  automatizacion: {
    why: 'Automatizar no es ahorrar clics: es convertir una decisión que tomabas tú en una regla que se ejecuta sin ti. Por eso lo importante nunca es el camino que funciona, sino qué pasa cuando llega un dato raro, cuando el servicio no responde y cuando el mismo evento llega dos veces. Ahí es donde una automatización o te ahorra horas o te crea un problema con clientes.',
    notWhat: [
      'No es una simulación. Desde el primer minuto envía correos de verdad y escribe en sistemas de verdad.',
      'No se arregla solo. Un flujo sin rama de error falla en silencio y nadie se entera hasta que alguien reclama.',
      'No basta con que funcione una vez. Tiene que funcionar el martes a las tres de la mañana con un dato que no habías previsto.',
      'No sustituye el criterio en lo irreversible. Enviar, pagar, borrar y publicar merecen una persona delante.',
    ],
    cost: 'Suma la plataforma, las llamadas a modelos dentro del flujo y las llamadas a APIs de terceros. Lo que se olvida siempre: los reintentos. Un flujo que reintenta tres veces cuesta el triple los días malos, que son justo los días de mucho volumen.',
    alternatives: [
      ['Hacerlo a mano', 'Menos de cinco veces al mes: automatizar cuesta más de lo que ahorra.'],
      ['Plataforma visual tipo n8n', 'Muchas integraciones, se ve el flujo, se depura mirando. El punto dulce para la mayoría.'],
      ['Script propio programado', 'Lógica compleja o mucho volumen. Más control y más mantenimiento.'],
      ['Función en la nube por evento', 'Volumen alto e irregular, sin servidor que mantener.'],
    ],
    failures: [
      ['Se crean registros duplicados', 'El evento llegó dos veces por un reintento de red. Se evita con una clave única por evento, comprobada antes de actuar.'],
      ['La API corta a mitad del lote', 'Superaste su límite por minuto. Se procesa por tandas, con espera creciente ante el error 429.'],
      ['Un campo vacío revienta la cadena entera', 'Faltaba validar en la frontera. Se comprueba al entrar y se bifurca a una rama de error que deja rastro.'],
    ],
  },

  agentes: {
    why: 'Un agente es el punto donde la IA deja de opinar y empieza a actuar. Todo lo que aprendiste sobre respuestas incorrectas se convierte aquí en acciones incorrectas, que ya no se corrigen releyendo. Por eso la habilidad clave no es hacerlo más listo: es decidir qué le dejas tocar y dónde se para a preguntar.',
    notWhat: [
      'No es un modelo más potente. Es el mismo modelo con herramientas conectadas.',
      'No es autónomo de verdad. Sin límite de pasos y condición de parada, da vueltas hasta agotar el presupuesto.',
      'MCP no es un modelo ni un servicio: es un protocolo para conectar herramientas de forma estándar.',
      'Un system prompt no es una medida de seguridad. Es un aviso, y los avisos se saltan.',
    ],
    cost: 'Cada paso del bucle es una llamada completa con todo el contexto acumulado. Un agente de diez pasos no cuesta diez veces uno: cuesta bastante más, porque el contexto crece en cada vuelta. El techo de iteraciones no es una buena práctica, es tu tope de gasto.',
    alternatives: [
      ['Una sola llamada al modelo', 'Si la tarea se resuelve de una vez. Lo más barato y predecible.'],
      ['Cadena de pasos fija', 'Sabes la secuencia. Auditable, reproducible y mucho más barata que un agente.'],
      ['Agente con herramientas', 'Solo cuando los pasos dependen de lo que se vaya encontrando.'],
      ['Varios agentes especializados', 'Última opción. Multiplica coste y superficie de fallo; casi siempre hay algo más simple.'],
    ],
    failures: [
      ['Se queda en bucle llamando a la misma herramienta', 'Le falta condición de parada y una salida digna de "no puedo".'],
      ['Usa una herramienta cuando no debía', 'La descripción era ambigua. Esa descripción es un prompt y se escribe con el mismo cuidado.'],
      ['Obedece una instrucción escondida en una web', 'Inyección indirecta. La única defensa sólida es que la capacidad peligrosa no esté disponible.'],
    ],
  },

  datos: {
    why: 'Conectar la IA a tus documentos es lo que convierte una herramienta genérica en algo que responde sobre TU empresa. Y es donde más sistemas quedan a medias: montan la búsqueda, funciona en la demo, y nadie comprueba si la respuesta viene de verdad del documento o el modelo la ha completado de su cosecha.',
    notWhat: [
      'RAG no enseña nada al modelo. Le pone el texto delante justo antes de responder.',
      'No es lo mismo que ajuste fino. El ajuste cambia el modelo; RAG cambia lo que hay en la mesa.',
      'Más fragmentos recuperados no es mejor. Llenar el contexto de ruido empeora la respuesta.',
      'Un embedding de un dato personal sigue siendo un dato personal.',
    ],
    cost: 'Tres partidas: generar los embeddings (una vez, más cada actualización), guardar los vectores (mensual, crece con el volumen) y el contexto extra en cada consulta (el gasto continuo, y el que más se subestima). Reindexar todo cada noche parece cómodo hasta que el corpus crece.',
    alternatives: [
      ['Meter el documento entero en el prompt', 'Si cabe y son pocos documentos, es lo más simple y lo más fiable.'],
      ['Búsqueda por palabras clave', 'Si los usuarios buscan términos exactos como referencias o códigos, gana a la búsqueda semántica.'],
      ['Búsqueda híbrida', 'Palabras clave más semántica. Suele ser lo mejor en la práctica y casi nadie lo prueba.'],
      ['Ajuste fino', 'Para fijar formato o estilo, nunca para meter información que cambia.'],
    ],
    failures: [
      ['Responde con seguridad algo que no está en ningún documento', 'Faltó exigirle ceñirse a lo recuperado y admitir cuando no encuentra.'],
      ['Recupera el fragmento equivocado', 'Los trozos son demasiado grandes o cortan por mitad de una idea. Se arregla al trocear, no al generar.'],
      ['Un usuario ve información de otro', 'Los permisos se aplicaron después de recuperar. Van en la consulta, siempre.'],
    ],
  },

  calidad: {
    why: 'Con software normal, si funciona hoy funciona mañana. Con IA no: la misma entrada puede dar salidas distintas, y una actualización del proveedor cambia el comportamiento sin que tú toques nada. Por eso aquí medir no es una buena práctica opcional, es la única forma de saber si tu sistema sigue haciendo lo que crees.',
    notWhat: [
      'No es comparar textos letra a letra. Se comprueba contra criterios: formato, campos, fuente citada.',
      'Un modelo evaluando a otro no es un juez neutral. Prefiere respuestas largas y las suyas propias.',
      'Un porcentaje alto no significa que funcione. Significa que funciona con los casos que tú elegiste.',
      'Los logs no son opcionales. Sin registro no hay diagnóstico, solo conjeturas.',
    ],
    cost: 'Pasar una batería de evaluación cuesta dinero en llamadas cada vez, y hay que pasarla en cada cambio de prompt o de modelo. Sale barata comparada con un fallo en producción, pero conviene tener un conjunto pequeño para el día a día y uno grande para antes de publicar.',
    alternatives: [
      ['Revisión humana de una muestra', 'Imprescindible al principio: es lo que te dice qué medir después.'],
      ['Comprobaciones automáticas de forma', 'Formato, campos obligatorios, longitud. Baratas, rápidas y cazan mucho.'],
      ['Modelo como juez', 'Para valorar calidad abierta. Necesita rúbrica y calibrarse contra personas.'],
      ['Métricas de referencia', 'Cuando existe una respuesta correcta única. Objetivas y limitadas.'],
    ],
    failures: [
      ['La evaluación va bien y los usuarios se quejan', 'Tu conjunto de prueba no se parece a lo que la gente escribe de verdad.'],
      ['El sistema empeora y nadie se entera', 'No había regresión: cada cambio se probaba a ojo con dos ejemplos.'],
      ['El postmortem no cambia nada', 'Documentó el incidente sin acciones asignadas. Volverá a pasar, ahora con precedente.'],
    ],
  },

  seguridad: {
    why: 'Todo lo anterior se puede hacer bien y aun así acabar en un problema serio: una clave filtrada, un dato de un cliente en un servicio que lo usa para entrenar, una factura de cuatro cifras por un bucle. Esta parte no hace tu sistema mejor: hace que puedas ponerlo delante de gente real sin jugártela.',
    notWhat: [
      'No es burocracia. Cada punto de aquí corresponde a un incidente que le ha pasado a alguien.',
      'No es solo cumplir el RGPD. La ley es el mínimo, no el objetivo.',
      'No basta con "no guardamos nada". Los logs guardan, las copias guardan y el índice guarda.',
      'La seguridad no se añade al final. Las decisiones que la hacen posible se toman el primer día.',
    ],
    cost: 'Poner límites es gratis; no ponerlos puede costar una factura desbocada en una noche, una sanción, o la confianza de un cliente. Lo único que cuesta tiempo es el diseño: pensar antes qué datos entran, quién los ve y cuándo se borran.',
    alternatives: [
      ['No recoger el dato', 'La medida más eficaz que existe. Lo que no tienes no se puede filtrar.'],
      ['Anonimizar o seudonimizar', 'Cuando necesitas el dato pero no la identidad.'],
      ['Cifrar y restringir acceso', 'Cuando necesitas el dato completo. Con credencial propia por actor y permisos mínimos.'],
      ['Procesar en local', 'Datos muy sensibles que no deben salir. Más caro y más lento, y a veces la única opción válida.'],
    ],
    failures: [
      ['Una clave en el repositorio', 'Se revoca primero y se limpia después. Mientras limpias, la clave sigue viva.'],
      ['Factura disparada de madrugada', 'Un bucle sin techo. Hacen falta las tres capas: tope en el proveedor, alerta y límite en el código.'],
      ['No se puede borrar los datos de un usuario', 'Nadie guardó la relación entre persona y fragmentos indexados. Se decide el primer día o no se puede cumplir.'],
    ],
  },

  entrega: {
    why: 'Un proyecto que solo funciona contigo delante no es un entregable: es una demostración. Esta parte convierte el trabajo en algo que otra persona instala, usa, entiende y paga. Es también donde se decide si te compran una vez o te contratan de nuevo.',
    notWhat: [
      'No es escribir documentación bonita. Es que alguien lo use sin llamarte.',
      'No es enseñar la tecnología. Al cliente le interesa su problema resuelto y la prueba de que ocurrió.',
      'Un precio por horas no es un precio justo: penaliza que seas rápido.',
      'Reconocer un límite no debilita tu trabajo. Es lo que demuestra que lo has probado a fondo.',
    ],
    cost: 'Lo que casi nadie factura: el mantenimiento. Un sistema vivo consume APIs, se rompe cuando cambia un servicio de terceros y necesita vigilancia. Si no lo separas del precio de construcción, acabas dando soporte gratis o abandonando al cliente.',
    alternatives: [
      ['Precio cerrado por proyecto', 'Alcance muy claro. Todo lo que no esté escrito, te lo comes.'],
      ['Por horas', 'Alcance incierto. Penaliza tu eficiencia y desconfía el cliente.'],
      ['Por valor entregado', 'Ligado a lo que el cliente ahorra o gana. El más defendible cuando puedes medirlo.'],
      ['Construcción más cuota de mantenimiento', 'Lo más honesto para sistemas vivos: separa lo que se construye de lo que sigue funcionando.'],
    ],
    failures: [
      ['La demo falla delante del cliente', 'Dependía de internet o de credenciales en vivo. Se ensaya y se hace repetible.'],
      ['"Una cosita más" cada semana', 'No había alcance escrito. Sin él no hay cambios, hay malentendidos.'],
      ['El cliente no sabe usarlo un mes después', 'Le entregaste el sistema pero no el traspaso. Que lo instale él con tu paquete, delante de ti.'],
    ],
  },
}

export function teachingFor(stageId) {
  return TEACHING[stageId] || TEACHING.fundamentos
}
