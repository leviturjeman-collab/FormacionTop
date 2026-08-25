---
titulo: "n8n"
tipo: "manual_research"
nivel: "transversal"
fase: "aprendizaje"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://docs.n8n.io/"]
tags: ["ai-academy", "manual_research", "transversal", "aprendizaje"]
entregable: "manual con fuentes y practica"
---
# n8n - Automatización, workflows, AI Agents, RAG, HITL, MCP y producción

## Para qué sirve este documento

Este archivo es el manual base de n8n para la academia. Debe leerse como una formación dentro de la formación, porque n8n no es solo una herramienta visual para conectar cajas. n8n es una plataforma de automatización donde el alumno debe entender datos, eventos, nodos, credenciales, APIs, webhooks, expresiones, ejecuciones, errores, IA, tools, memory, RAG, aprobación humana, MCP, entornos, seguridad y despliegue. Si el alumno aprende solo a arrastrar nodos sin entender cómo viaja el JSON, el curso fracasa en lo importante.

La regla pedagógica principal es: ningún alumno debe construir un AI Agent complejo en n8n hasta comprender JSON, APIs, credentials, webhooks y cómo se mueven los datos entre nodes. Esta regla evita el aprendizaje superficial. Un agente conectado a herramientas puede fallar por una credencial, por un campo mal referenciado, por un webhook duplicado, por un loop, por un scope OAuth, por rate limits o por un input inesperado. Si el alumno no entiende lo básico, no sabrá depurar.

## Qué es n8n

n8n es una plataforma de workflow automation que combina automatización de procesos con capacidades de IA. En términos prácticos, permite crear flujos donde un evento dispara acciones: llega un webhook, se recibe un email, se crea una fila, se consulta una API, se transforma JSON, se llama a un modelo, se guarda información o se avisa a una persona. Su valor para la academia es que hace visible la arquitectura de una automatización. El alumno puede ver nodos, conexiones, inputs, outputs y ejecuciones.

Pero esa visibilidad no debe confundirse con simplicidad absoluta. Cada nodo tiene parámetros. Cada ejecución tiene datos. Cada API tiene autenticación. Cada integración tiene límites. Cada credencial tiene permisos. Cada workflow tiene puntos de fallo. La formación debe enseñar a mirar la ejecución, no solo el canvas.

## Workflows y nodes

Un workflow es una secuencia de pasos. Un node es una unidad de trabajo dentro de esa secuencia. Hay nodos que disparan el flujo, nodos que transforman datos, nodos que llaman servicios externos, nodos que evalúan condiciones, nodos que gestionan errores y nodos de IA. El alumno debe aprender a leer un workflow de izquierda a derecha como un sistema de entradas, transformaciones y salidas.

Un workflow bien diseñado tiene:

- Trigger claro.
- Input esperado.
- Transformaciones comprensibles.
- Credenciales correctas.
- Manejo de errores.
- Logs útiles.
- Salida verificable.
- Comentarios o documentación interna si el flujo es complejo.

Un workflow débil tiene nodos conectados sin explicación, campos mágicos, credenciales compartidas sin criterio, falta de error handling y outputs que nadie verifica. La diferencia entre ambos es la diferencia entre demo y operación.

## JSON y datos entre nodos

JSON es obligatorio antes de IA avanzada. n8n mueve datos estructurados. Cada node recibe items y produce items. El alumno debe practicar cómo leer un objeto, acceder a campos, transformar valores y entender qué ocurre cuando un campo no existe. Muchas frustraciones de n8n vienen de expresiones mal escritas o de asumir que un dato está en una ruta donde no está.

Una clase base debe usar un webhook que reciba un JSON sencillo:

```json
{
  "cliente": "Acme",
  "email": "persona@example.com",
  "pedido": 123,
  "prioridad": "alta"
}
```

Después el alumno debe:

- Ver el input del webhook.
- Transformar un campo.
- Usar una expresión.
- Pasar el dato a un HTTP Request.
- Devolver una respuesta.
- Romper el JSON.
- Diagnosticar el error.

Este laboratorio enseña más que un agente bonito porque obliga a entender el flujo real.

## Credentials, APIs y HTTP Request

Las credenciales son uno de los puntos de seguridad más importantes. Un workflow puede funcionar técnicamente y estar mal diseñado si usa credenciales con permisos excesivos. La formación debe enseñar scopes, OAuth, API keys, tokens, expiración y mínimo privilegio. No basta con "conecta tu cuenta". Hay que preguntar: qué puede hacer esa credencial, qué no debería poder hacer, quién la gestiona, cómo se rota y qué ocurre si se filtra.

El HTTP Request node es esencial porque permite llamar APIs aunque no exista un node específico. Enseñarlo bien da independencia. El alumno debe entender método, URL, headers, query params, body, auth, status codes y response. Los errores 401, 403 y 429 deben aparecer deliberadamente:

- 401: falta autenticación o es inválida.
- 403: autenticado pero sin permiso.
- 429: rate limit.

La respuesta profesional no es "no funciona". Es mirar status code, body, headers, credencial, scope, límite y retry.

## Webhooks

Los webhooks permiten que sistemas externos disparen workflows. Son una pieza central porque convierten n8n en receptor de eventos. El alumno debe entender la diferencia entre test URL y production URL, método HTTP, path, payload, respuesta y seguridad. También debe saber que un webhook puede dispararse más de una vez o recibir datos inesperados. Por eso debe validar input.

Ejercicio recomendado:

CHECK: ¿qué campos esperas recibir?

DO: crear webhook y probar con JSON válido.

BREAK: enviar JSON sin un campo obligatorio.

FIX: añadir validación o ruta de error.

EXPLAIN: explicar qué falló, dónde se vio y cómo se previene.

## Branching, loops y error handling

Los workflows reales no son líneas rectas. Tienen condiciones, bucles y errores. El alumno debe aprender a decidir cuándo ramificar, cuándo iterar y cuándo detenerse. En n8n, un error no debe aparecer solo en rojo como sorpresa final; debe estar previsto.

Buenas prácticas:

- Validar inputs antes de acciones costosas.
- Separar caminos de éxito y error.
- Guardar contexto suficiente para depurar.
- No crear loops sin límites.
- Evitar acciones destructivas sin confirmación.
- Diseñar fallback humano en tareas sensibles.

Un laboratorio útil es crear un workflow que procese una lista y falle en un item. El alumno debe decidir si el flujo debe parar, continuar, registrar el error o pedir ayuda humana.

## IA en n8n

n8n permite construir workflows de IA conectando modelos, herramientas y memoria. La documentación oficial describe componentes para integrar LLM providers como OpenAI, Anthropic y Google, añadir tools y memory, y combinar IA con automatización. Esta parte debe enseñarse después de la base.

El AI Agent node permite conectar un chat model y una o más tools. El agente decide qué tools llamar para cumplir la tarea. Esta decisión es el punto agentico: el LLM no solo genera texto, también decide una acción dentro de límites. Por eso el diseño de tools importa muchísimo. Una tool mal descrita o demasiado poderosa puede llevar a resultados peligrosos.

El alumno debe aprender a diseñar tools:

- Nombre claro.
- Descripción precisa.
- Input schema si aplica.
- Permisos mínimos.
- Salidas entendibles.
- Errores controlados.
- Aprobación humana para acciones sensibles.

## Memory y RAG

Memory permite que un agente conserve historial o estado relevante. RAG permite recuperar contexto de fuentes específicas para responder mejor. La documentación de n8n trata RAG como forma de dar al modelo acceso a recursos de contexto específico. En el curso, memory y RAG deben diferenciarse.

Memory responde a "qué pasó en esta conversación o sesión". RAG responde a "qué información externa relevante debo recuperar para contestar". Un agente de soporte puede necesitar memory para recordar el hilo de conversación y RAG para consultar documentación de producto. Mezclar ambos conceptos confunde al alumno.

Laboratorio recomendado:

- Crear una mini base de conocimiento.
- Hacer una pregunta sin RAG.
- Hacer la misma pregunta con RAG.
- Comparar evidencia.
- Añadir una fuente distractora.
- Evaluar si el agente cita o usa la fuente correcta.

## Human-in-the-loop

Human-in-the-loop es uno de los pilares de la academia. n8n soporta patrones donde una tool del AI Agent requiere aprobación humana. Cuando una herramienta requiere revisión, el workflow puede pausarse y esperar. Esto permite construir agentes útiles sin entregarles control total.

Ejemplos de acciones que deben requerir aprobación:

- Enviar email externo.
- Crear o cerrar tickets.
- Modificar datos de clientes.
- Ejecutar pagos.
- Publicar contenido.
- Borrar registros.
- Cambiar permisos.

El alumno debe aprender a separar lectura de escritura. Un agente puede leer documentación sin aprobación, pero no debería borrar datos sin aprobación. Puede preparar un borrador, pero no enviarlo. Puede proponer un cambio, pero no desplegarlo sin revisión.

## MCP en n8n

n8n incluye MCP Client Tool, lo que permite conectar agentes con herramientas externas expuestas por MCP. En la formación, MCP debe enseñarse como conector de capacidades. No es magia: expone tools, y esas tools tienen permisos, inputs, outputs y riesgos. MCP cobra sentido cuando queremos que un agente use sistemas externos de forma estandarizada.

Preguntas que debe responder el alumno antes de conectar MCP:

- Qué tools expone el servidor.
- Qué credenciales usa.
- Qué operaciones son de lectura.
- Qué operaciones escriben o modifican estado.
- Qué logs quedan.
- Qué requiere aprobación.
- Qué ocurre si el modelo llama la tool equivocada.

## Seguridad, RBAC, entornos y producción

n8n puede usarse en cloud o self-hosted. La decisión depende de control, mantenimiento, cumplimiento, coste y capacidades de infraestructura. En equipos, RBAC permite controlar roles y permisos. La formación debe presentar RBAC no como una función administrativa aislada, sino como parte del diseño de seguridad.

Para producción, el alumno debe revisar:

- Dónde están los secrets.
- Quién puede editar workflows.
- Quién puede ejecutar manualmente.
- Qué credenciales usan los workflows.
- Qué logs se guardan.
- Qué alertas existen.
- Cómo se despliega.
- Cómo se revierte.
- Qué pasa si una API externa cae.
- Qué presupuesto de tokens o ejecuciones se permite.

## CHECK -> DO -> BREAK -> FIX -> EXPLAIN

CHECK: pedir al alumno que dibuje qué datos entran y salen de cada node.

DO: construir un workflow con webhook, transformación, HTTP Request y respuesta.

BREAK: romper credencial, JSON o webhook.

FIX: diagnosticar desde execution data, status codes y node outputs.

EXPLAIN: explicar síntoma, causa, evidencia, reparación y prevención.

Solo después se añade IA:

CHECK: qué tool necesita el agente.

DO: crear AI Agent con tool limitada.

BREAK: dar permisos excesivos o descripción ambigua.

FIX: limitar tool, añadir human-in-the-loop y logs.

EXPLAIN: justificar permisos y controles.

## Fuentes oficiales

- [n8n Docs](https://docs.n8n.io/)
- [Integrate AI](https://docs.n8n.io/build/integrate-ai)
- [AI Agent node](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent)
- [Tools Agent](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/tools-agent)
- [Webhook node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook)
- [Human-in-the-loop for tools](https://docs.n8n.io/build/integrate-ai/ai-examples/human-in-the-loop-for-tools)
- [Human fallback for AI workflows](https://docs.n8n.io/build/integrate-ai/ai-examples/set-a-human-fallback-for-ai-workflows)
- [MCP Client Tool](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolmcp)
- [RBAC](https://docs.n8n.io/administer/manage-users-and-access/set-permissions-and-roles-rbac)
- [Choose how to use n8n](https://docs.n8n.io/choose-how-to-use-n8n)
---

<!-- CLASIFICACION_ORDENADOR -->

## Clasificacion por ordenador y sistema operativo

Antes de convertir esta nota en una practica, laboratorio, documento o proyecto para otra persona, clasificala segun el ordenador del alumno y el nivel tecnico de ejecucion. Usa estas guias:

- [[10_GUIAS_WINDOWS_MAC_LINUX/Windows]] para alumnos que trabajen con PowerShell, rutas `C:\...`, OneDrive, Git for Windows, Node.js, Python o Docker Desktop.
- [[10_GUIAS_WINDOWS_MAC_LINUX/macOS]] para alumnos que trabajen con Terminal/zsh, rutas `/Users/...`, Homebrew, permisos de macOS o Apple Silicon.
- [[10_GUIAS_WINDOWS_MAC_LINUX/Linux]] para alumnos que trabajen con Bash, rutas `/home/...`, gestores `apt`, `dnf` o `pacman`, permisos, servicios y Docker Engine.
- [[10_GUIAS_WINDOWS_MAC_LINUX/Compatibilidad_de_proyectos]] para clasificar la practica como Nivel A, B, C, D o E.
- [[10_GUIAS_WINDOWS_MAC_LINUX/Checklist_entrega_multisistema]] para comprobar que cualquier persona pueda seguirla sin depender de explicaciones orales.

Regla de entrega: si esta nota requiere terminal, Git, Node.js, Python, Docker, API keys, n8n, GitHub, Codex, Claude Code, Gemini o cualquier cuenta externa, debe indicar claramente que necesita el alumno, donde ejecutarlo, que salida esperar y como detectar errores en Windows, macOS y Linux.
---

<!-- CAPA_AAAA_PLUS_APLICADA -->

# Capa AAAA+ - N8n

## Proposito profesional de esta nota

Esta nota queda elevada al estandar AAAA+. Su funcion dentro de la boveda es servir como pieza profesional de research oficial, trazabilidad a fuentes primarias y conversion de documentacion real en criterio formativo. No debe leerse como una nota aislada ni como un resumen rapido. Debe poder ayudar a un alumno a entender el tema, aplicarlo a su trabajo, convertirlo en proyecto, evaluarlo y defenderlo con criterio.

Una nota AAAA+ debe responder tres preguntas: que aprende el alumno, que puede construir con esto y como sabemos que lo ha entendido. Si una persona externa abre este archivo, debe encontrar orientacion suficiente para avanzar sin depender de una explicacion oral. La nota debe ser clara, accionable, verificable y conectada con el resto de la boveda.

## Nivel basico

En nivel basico, el alumno debe poder explicar el tema con sus palabras, identificar para que sirve y reconocer cuando aparece en un proyecto real. El objetivo no es dominar todas las herramientas, sino entender el modelo mental. La actividad minima es leer la nota, extraer conceptos clave, escribir un ejemplo propio y conectar este archivo con una fase de la formacion.

Entregable basico:

- Resumen de 10 lineas.
- Tres conceptos clave.
- Un ejemplo aplicado al trabajo o a una idea propia.
- Una duda abierta.
- Una conexion con una fase de la formacion.

## Nivel intermedio

En nivel intermedio, el alumno debe aplicar esta nota a un caso realista. Ya no basta con entender: debe producir algo. Puede ser una plantilla, checklist, workflow, mini skill, mapa de decision, tabla, prompt mejorado, evaluacion, laboratorio o primer prototipo. El entregable debe tener criterio de terminado.

Entregable intermedio:

- Objetivo concreto.
- Entrada necesaria.
- Salida esperada.
- Pasos de trabajo.
- Error probable.
- Checklist de revision.
- Evidencia de resultado.

## Nivel avanzado

En nivel avanzado, esta nota debe convertirse en una pieza defendible. Si el tema es tecnico, debe incluir artefacto real: codigo, JSON, schema, workflow exportado, diff, test, API request, log o configuracion. Si el tema no es tecnico, debe incluir artefacto profesional: documento, presentacion, plantilla, rubrica, skill instruction-only, checklist o caso de portfolio.

Entregable avanzado:

- Artefacto real.
- Caso feliz.
- Caso ambiguo.
- Caso roto.
- Reparacion documentada.
- Evaluacion.
- Defensa breve.

## Que utilizar

Para trabajar esta nota, utiliza: n8n cloud para inicio, workflows exportables, JSON, webhooks, credentials, logs, error handling y HITL en avanzado.

Tambien utiliza Obsidian como lugar de trazabilidad: enlaces internos, fuentes, decisiones, versiones y reflexiones. Si se transforma en clase, debe producir material reutilizable: documento, presentacion, laboratorio, rubrica o proyecto.

## Que no utilizar

No usar fuentes genericas como base principal. No convertir snippets de marketing en verdad pedagogica. No afirmar actualidad sin revisar fuente oficial.

Regla simple: si una herramienta no mejora claridad, repetibilidad, seguridad, evaluacion o transferencia, probablemente sobra. La excelencia AAAA+ no es usar mas tecnologia; es elegir mejor y dejar evidencia.

## Politica de codigo real

Esta nota no exige codigo real por defecto. Exige artefacto real. Si el proyecto derivado es conceptual, pedagogico, documental o de decision, puede bastar con plantilla, documento, rubrica, skill instruction-only o presentacion. Si el proyecto promete ejecutar, automatizar, conectar APIs, validar datos, usar agentes, RAG, MCP, n8n avanzado o produccion, entonces debe existir artefacto tecnico verificable.

Codigo real o artefacto tecnico puede ser:

- Script Python o Node.js.
- JSON schema.
- Workflow n8n exportado.
- SKILL.md.
- API request.
- Test.
- Log.
- Diff.
- Configuracion.
- Checklist de deploy.

## CHECK -> DO -> BREAK -> FIX -> EXPLAIN

CHECK: antes de usar esta nota, el alumno debe explicar que problema resuelve y que tipo de proyecto podria salir de ella.

DO: el alumno crea un entregable minimo relacionado con la nota.

BREAK: se introduce un fallo intencional: falta de contexto, fuente debil, salida incorrecta, permisos excesivos, formato roto, evaluacion insuficiente o herramienta innecesaria.

FIX: el alumno repara usando evidencia: fuentes, logs, inputs, outputs, diffs, rubrica, checklist o revision humana.

EXPLAIN: el alumno explica que aprendio, que cambio, que error encontro y como lo aplicaria a su trabajo o portfolio.

## Criterio AAAA+

Para considerar esta nota realmente AAAA+, debe cumplir:

- Se entiende sin explicacion oral.
- Tiene una aplicacion practica.
- Puede convertirse en entregable.
- Tiene criterio de evaluacion.
- Incluye que usar y que evitar.
- Diferencia basico, intermedio y avanzado.
- Puede conectarse con una fase.
- Puede producir evidencia.
- Puede formar parte de portfolio o material de clase.

## Preguntas de defensa

- Que aporta esta nota a la formacion.
- Que puede construir el alumno con ella.
- Que herramienta conviene usar y cual conviene evitar.
- Que parte necesita evidencia real.
- Que error se puede provocar.
- Como se evalua.
- Como se convierte en portfolio.

## Enlaces de mejora

- [[14_ESTANDAR_AAAA_PLUS/README]]
- [[14_ESTANDAR_AAAA_PLUS/Escalera_de_B_a_AAAA_Plus]]
- [[14_ESTANDAR_AAAA_PLUS/Fases_basico_intermedio_avanzado]]
- [[14_ESTANDAR_AAAA_PLUS/Que_utilizar_y_que_no_utilizar]]
- [[14_ESTANDAR_AAAA_PLUS/Politica_de_codigo_real]]
- [[14_ESTANDAR_AAAA_PLUS/Rubrica_AAAA_Plus]]
---

<!-- CAPA_MASTERCLASS_AAAA_PLUS -->

# Masterclass AAAA+ - N8n

## Ambicion de esta pieza

Esta seccion convierte el archivo en una pieza de formacion premium. El objetivo no es que el alumno lea y diga "lo entiendo". El objetivo es que pueda usar esta nota como manual de accion para aprender, aplicar, construir, romper, arreglar, documentar, presentar y defender algo real dentro del dominio de n8n y automatizacion.

Si una persona abre este archivo sin conocerte, debe sentir que hay una ruta clara: primero comprende, luego practica, despues crea un artefacto, luego lo somete a fallo, lo mejora y finalmente lo convierte en evidencia. Esa es la diferencia entre una nota informativa y una nota AAAA+.

## Mapa de dominio

Dominio: n8n y automatizacion.

Este archivo trabaja principalmente sobre: workflows, nodes, JSON, webhooks, credentials, AI Agent, HITL y MCP.

El resultado esperado no es solo conocimiento. El resultado esperado es: workflow exportado, laboratorio de error handling o agente controlado.

Para que el alumno lo domine, debe conectar cuatro capas:

1. Concepto: que significa y por que importa.
2. Uso: donde aparece en trabajo real.
3. Construccion: que artefacto se puede crear.
4. Defensa: como se demuestra que funciona y que limites tiene.

## Ruta de lectura excelente

1. Leer una vez sin tocar herramientas, solo para entender el mapa.
2. Subrayar conceptos que no podria explicar a otra persona.
3. Crear una nota derivada con ejemplo propio.
4. Convertir el ejemplo en una mini practica.
5. Añadir una version basica, intermedia y avanzada.
6. Definir que herramienta se usa y que herramienta se evita.
7. Crear el artefacto real correspondiente.
8. Probar caso feliz, caso ambiguo y caso roto.
9. Documentar reparacion.
10. Convertir el resultado en portfolio, clase o material entregable.

## Version basica de esta nota

La version basica debe permitir que un alumno principiante salga con claridad. Debe poder responder:

- Que tema trata esta nota.
- Para que sirve.
- Que problema resuelve.
- Que ejemplo real podria construir.
- Que herramienta principal usaria.
- Que herramienta no necesita todavia.

Artefacto basico recomendado: resumen aplicado, mapa mental, checklist o ejemplo manual en Obsidian.

## Version intermedia de esta nota

La version intermedia debe transformar comprension en accion. El alumno debe crear algo que otra persona pueda revisar. Puede ser una plantilla, workflow, prompt pack, skill instruction-only, tabla de decision, laboratorio, schema, documento o mini prototipo.

La version intermedia debe incluir:

- Objetivo medible.
- Entrada.
- Salida.
- Pasos.
- Criterio de terminado.
- Error probable.
- Checklist de calidad.

## Version avanzada de esta nota

La version avanzada debe producir evidencia fuerte. Si el tema es tecnico, debe tener artefacto real: codigo, JSON, workflow exportado, API request, diff, test, log, configuracion o SKILL.md. Si el tema es no tecnico, debe tener artefacto profesional: documento, presentacion, rubrica, plantilla, guia, checklist o caso de portfolio.

La version avanzada debe incluir:

- Caso feliz.
- Caso ambiguo.
- Caso roto.
- Diagnostico.
- Reparacion.
- Evaluacion.
- Defensa.
- Siguiente mejora.

## Que haria que esta nota dejara a alguien impresionado

Una persona se queda impresionada cuando nota que la formacion no es una explicacion suelta, sino un sistema. Para conseguirlo, esta nota debe hacer visible:

- Que hay una progresion clara.
- Que cada concepto termina en practica.
- Que cada practica se puede romper.
- Que cada error enseña algo.
- Que cada entrega tiene criterio.
- Que cada proyecto puede convertirse en portfolio.
- Que se sabe que herramienta usar y cual evitar.
- Que no hay humo: hay artefactos, fuentes, limites y evaluacion.

## Prompt maestro para trabajar esta nota

Usa este prompt cuando quieras convertir esta nota en material accionable:

`	ext
Actua como diseñador senior de formacion profesional en IA. Convierte esta nota en una experiencia de aprendizaje AAAA+.

Necesito:
1. Explicacion para principiante.
2. Modelo mental.
3. Actividad basica.
4. Actividad intermedia.
5. Actividad avanzada.
6. Artefacto real que debe entregar el alumno.
7. Caso feliz.
8. Caso ambiguo.
9. Caso roto.
10. Rubrica de evaluacion.
11. Errores comunes.
12. Como llevarlo a portfolio.

No inventes capacidades. Si falta informacion, marca supuestos y preguntas.
`

## Checklist de excelencia

Antes de considerar esta nota terminada como material premium, comprueba:

- Tiene una idea central clara.
- Tiene aplicacion real.
- Tiene actividad basica, intermedia y avanzada.
- Tiene artefacto real.
- Tiene errores provocados.
- Tiene criterio de evaluacion.
- Tiene que usar y que evitar.
- Tiene politica de codigo real si aplica.
- Tiene defensa.
- Tiene conexion con portfolio.
- Tiene enlaces internos suficientes.
- Puede convertirse en documento, presentacion o laboratorio.

## Errores que debe enseñar esta nota

Una nota AAAA+ no solo enseña el camino correcto. Enseña tambien como se rompe el trabajo. Errores recomendados:

- Falta de contexto.
- Elegir herramienta demasiado avanzada.
- No definir salida.
- No tener criterio de terminado.
- No comprobar fuentes.
- No preparar caso roto.
- Usar codigo sin explicarlo.
- No proteger datos sensibles.
- No documentar sistema operativo.
- No tener evaluacion.

## Como convertir esta nota en clase

Estructura recomendada de clase:

1. Apertura: problema real que resuelve.
2. Concepto: explicacion clara y breve.
3. Demostracion: ejemplo guiado.
4. Practica basica: alumno replica.
5. Practica intermedia: alumno adapta.
6. Practica avanzada: alumno construye evidencia.
7. BREAK: se rompe algo.
8. FIX: se repara con evidencia.
9. Defensa: alumno explica.
10. Cierre: como entra en portfolio.

## Como convertir esta nota en proyecto

Para convertirla en proyecto, crea una nota hija con:

- Nombre del proyecto.
- Fase.
- Nivel.
- Usuario.
- Problema.
- Herramientas.
- Herramientas evitadas.
- Artefacto.
- Pasos.
- Riesgos.
- Evaluacion.
- Evidencia.
- Siguiente version.

## Rubrica rapida AAAA+

Puntua de 1 a 4:

- Claridad.
- Aplicacion real.
- Artefacto.
- Reproducibilidad.
- Error provocado.
- Reparacion.
- Evaluacion.
- Seguridad.
- Sistema operativo.
- Portfolio.

Un archivo excelente debe aspirar a 35/40 o mas. Si baja de 28, todavia es util pero no memorable. Si baja de 20, necesita reconstruccion.

## Frase de cierre para el alumno

No memorices esta nota. Usala. Si puedes convertirla en una accion, una plantilla, una skill, un workflow, un proyecto o una decision mejor tomada, entonces la nota ya cumplio su funcion. Si ademas puedes explicarla y defenderla, empieza a ser AAAA+.
---

<!-- CAPA_ULTRA_PREMIUM_AAAA_PLUS -->

# Capa ultra-premium AAAA+ - N8n

## Promesa de transformacion

Esta capa existe para que el archivo no sea simplemente bueno, sino extraordinario. La promesa es que una persona pueda leer esta nota y salir con una transformacion concreta: entender mejor, trabajar mejor, construir mejor, decidir mejor o presentar mejor. El lector ideal no debe sentir que esta consumiendo informacion; debe sentir que esta recibiendo un sistema de accion.

Perfil principal al que sirve: investigador, creador de curriculo y diseñador academico.

Artefacto premium esperado: mapa de fuentes, sintesis comparada, notas de decision y material de clase con citas.

Prueba de dominio: fuentes oficiales revisadas, decisiones justificadas y conversion a lecciones.

## Escenario real de uso

Una persona quiere automatizar una tarea: primero entiende JSON, inputs y outputs; despues crea workflow simple; luego añade error handling; finalmente controla credenciales, logs, HITL y produccion.

Este escenario debe guiar la lectura. Si el alumno no puede imaginar como usar la nota en una situacion real, falta aterrizaje. Si puede imaginarlo pero no sabe que entregar, falta artefacto. Si sabe entregar pero no sabe como evaluarlo, falta rubrica. Si sabe evaluarlo pero no sabe defenderlo, falta madurez profesional.

## Ruta de ejecucion en 7 dias

Dia 1 - Comprension:

- Leer la nota completa.
- Escribir un resumen propio.
- Marcar conceptos confusos.
- Elegir un ejemplo personal.

Dia 2 - Modelo mental:

- Dibujar el flujo del tema.
- Separar entradas, proceso, decisiones y salidas.
- Identificar que parte depende de herramienta y que parte depende de criterio humano.

Dia 3 - Version basica:

- Crear un primer artefacto manual.
- No optimizar todavia.
- Buscar claridad y utilidad minima.

Dia 4 - Version intermedia:

- Convertir el artefacto en plantilla, workflow, checklist, skill, schema, documento o laboratorio.
- Añadir criterio de terminado.

Dia 5 - Ruptura controlada:

- Provocar un fallo.
- Documentar sintoma, causa probable y evidencia.
- Evitar arreglos por intuicion.

Dia 6 - Version avanzada:

- Reparar con evidencia.
- Añadir evaluacion.
- Añadir limites, seguridad o compatibilidad si aplica.

Dia 7 - Portfolio y defensa:

- Preparar una explicacion de 3 minutos.
- Guardar antes/despues.
- Escribir siguiente mejora.
- Decidir si el proyecto queda como practica, portfolio o producto.

## Entregables premium por perfil

Para perfil no tecnico:

- Explicacion clara.
- Plantilla reusable.
- Checklist de calidad.
- Ejemplo antes/despues.
- Presentacion breve.

Para perfil tecnico:

- Artefacto reproducible.
- Archivo o configuracion real.
- Validacion o test.
- Logs, diff, schema o export.
- Riesgos y rollback si aplica.

Para perfil negocio:

- Caso de uso.
- Beneficio esperado.
- Riesgos.
- Coste o esfuerzo estimado.
- Decision recomendada.

Para perfil formador:

- Objetivo didactico.
- Actividad basica/intermedia/avanzada.
- Error provocado.
- Rubrica.
- Material exportable.

## Biblioteca de fallos de alto valor

Estos fallos son deseables en formacion porque enseñan criterio:

1. Falta de contexto: el resultado parece correcto pero no sirve.
2. Herramienta excesiva: se usa tecnologia avanzada para un problema simple.
3. Salida no verificable: no hay forma de saber si esta bien.
4. Caso feliz unico: funciona solo con input perfecto.
5. Seguridad ignorada: hay datos, permisos o secretos sin control.
6. Sin trazabilidad: no se sabe que fuente o decision produjo el resultado.
7. Sin sistema operativo: nadie sabe como ejecutarlo en su ordenador.
8. Sin defensa: el alumno hizo algo pero no puede explicarlo.

Cada fallo debe convertirse en pregunta:

- Que evidencia falta.
- Que restriccion no se definio.
- Que herramienta sobra.
- Que riesgo no se controlo.
- Que parte debe revisar un humano.

## Plantilla de entrega premium

Cuando esta nota se convierta en entregable, debe tener esta estructura:

`markdown
# [Nombre del entregable]

## Problema

## Usuario

## Objetivo

## Fase y nivel

## Herramientas utilizadas

## Herramientas descartadas

## Artefacto real

## Pasos de ejecucion

## Caso feliz

## Caso ambiguo

## Caso roto

## Diagnostico y reparacion

## Evaluacion

## Riesgos y limites

## Sistema operativo / entorno

## Fuentes

## Defensa de 3 minutos

## Siguiente version
`

## Preguntas que debe poder responder el alumno

- Que estoy intentando mejorar.
- Por que esta nota me ayuda.
- Que parte puedo aplicar hoy.
- Que artefacto voy a producir.
- Como sabre que funciona.
- Que puede fallar.
- Que herramienta no debo usar todavia.
- Que evidencia voy a guardar.
- Como lo explicaria a un cliente, jefe, compañero o alumno.

Si no puede responder alguna, no pasa nada. Esa pregunta se convierte en tarea.

## Criterio de clase inolvidable

Para que esta nota se convierta en una clase que impacte, necesita cinco momentos:

1. Reconocimiento: el alumno ve un problema real suyo.
2. Claridad: entiende el modelo mental.
3. Accion: produce algo pequeño.
4. Tension: algo se rompe.
5. Dominio: lo repara y lo explica.

Sin tension no hay aprendizaje profundo. Sin reparacion no hay confianza. Sin explicacion no hay transferencia.

## Criterio de proyecto inolvidable

Para que un proyecto derivado de esta nota sea memorable, debe tener:

- Nombre claro.
- Resultado visible.
- Dificultad honesta.
- Evidencia.
- Error reparado.
- Mejora respecto a la version inicial.
- Utilidad para alguien real.
- Posibilidad de enseñarse en portfolio.

## Frase de calidad extrema

Esta nota no esta terminada cuando contiene mucha informacion. Esta terminada cuando alguien puede usarla para crear algo que antes no podia crear, explicar algo que antes no podia explicar o resolver un problema que antes le bloqueaba.

## Control editorial profesional

Este bloque fija el uso correcto de este archivo dentro de la boveda. Sirve para evitar contenido innecesario, mantener la informacion revisable y convertir la nota en material profesional.

### Objetivo operativo

Usar **n8n** para producir el entregable definido en la metadata: **manual con fuentes y practica**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

### Prerequisitos y materiales

- Haber leido el documento maestro y el mapa de carpetas.
- Tener claro el nivel del alumno antes de usar este archivo.
- Si se trabaja con herramientas externas, revisar credenciales, permisos, coste y datos sensibles.
- Si se convierte en clase, preparar una practica pequena y un error provocado.

### Fuentes y verificacion

| Tipo | Fuente | Fecha/uso | Criterio |
|---|---|---|---|
| Fuente oficial | https://docs.n8n.io/ | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |

### Notas para profesor o facilitador

- Empezar con un problema real antes de explicar teoria.
- Pedir al alumno una salida concreta: documento, prompt, workflow, checklist, demo o defensa.
- Comprobar que el alumno puede explicar que entra, que pasa, que sale, que puede fallar y como lo verificaria.
- No avanzar a herramientas avanzadas si no hay dominio de entradas, salidas, permisos y evaluacion.

### Criterio para eliminar contenido innecesario

Eliminar o reescribir cualquier parrafo que no cumpla una de estas funciones: explicar una decision, enseñar un concepto, guiar una practica, prevenir un error, respaldar una fuente, preparar un entregable o mejorar la evaluacion.

### Proxima revision

- Revisar este archivo cuando cambien las fuentes oficiales relacionadas o antes de usarlo como material comercial.
- Si se detecta informacion generica, convertirla en ejemplo especifico de **n8n**.

