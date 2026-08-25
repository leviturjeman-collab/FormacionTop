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
