---
titulo: "Gemini API Deep Research Agents"
tipo: "manual_research"
nivel: "transversal"
fase: "transversal"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://ai.google.dev/gemini-api/docs"]
tags: ["ai-academy", "manual_research", "transversal", "transversal"]
entregable: "manual con fuentes y practica"
---
# Gemini - API, modelos, Deep Research, tools y agentes

Gemini debe ocupar en la formacion el lugar de una plataforma multimodal y de investigacion avanzada. No se estudia solo para "comparar respuestas" con ChatGPT o Claude. Se estudia porque Google AI for Developers ofrece modelos, structured outputs, function calling, embeddings, capacidades multimodales, grounding con Google Search, Deep Research y modelos orientados a agentes. Esto permite construir productos que procesan texto, imagen, audio, video, PDFs, busqueda y herramientas externas.

La documentacion oficial de Gemini insiste en distinguir modelos, versiones, endpoints y capacidades. Esta distincion es vital. Un alumno profesional no dice "usa Gemini" sin mas. Dice que modelo, que endpoint, que modo de salida, que herramienta, que coste, que latencia, que contexto y que riesgo de deprecacion. Los modelos pueden ser stable, preview, latest o experimental. Para produccion, el alumno debe preferir versiones estables o entender muy bien el riesgo de usar preview o experimental.

## Modelo mental

Gemini funciona como una caja de razonamiento multimodal conectable a herramientas. Puede recibir texto, archivos, imagenes, video o audio, y devolver texto, estructura, decisiones o llamadas a funciones. En un proyecto serio, Gemini no deberia ser una "caja negra creativa"; deberia trabajar con contratos: schema de salida, funciones disponibles, instrucciones de uso, fuentes cuando hay investigacion y validacion posterior.

Structured outputs permiten pedir respuestas con una forma concreta, por ejemplo JSON que cumple un schema. Function calling permite que el modelo decida invocar una funcion externa con argumentos. Google Search grounding ayuda a conectar respuestas con informacion web. Embeddings sirven para busqueda semantica y RAG. Deep Research sirve para investigacion multi-paso y generacion de informes con fuentes. Estas piezas juntas permiten crear agentes y sistemas de analisis muy potentes.

## Basico

En nivel basico, el alumno debe entender modelos y prompts. Debe saber que Gemini no es "mejor o peor" de forma absoluta; es una familia con modelos pensados para diferentes tareas: velocidad, razonamiento, multimodalidad, imagen, audio, video, embeddings o agentes. Debe aprender a elegir entre una tarea de redaccion, una tarea de clasificacion, una tarea de extraccion, una tarea multimodal y una tarea de investigacion.

La primera practica debe ser simple: pedir a Gemini una explicacion, luego pedir una tabla, luego pedir un JSON, luego comprobar si el JSON es valido. La segunda practica puede usar una imagen o un documento y pedir extraccion de campos. La tercera debe pedir una respuesta con fuentes o marcar claramente cuando no hay fuente.

Que no usar en basico: function calling con acciones reales, Deep Research sin revisar fuentes, modelos preview para promesas comerciales, agentes autonomos o integraciones con datos sensibles.

## Intermedio

En nivel intermedio, el alumno trabaja con schemas, function calling y grounding. Un schema obliga a pensar la salida antes de pedirla. Por ejemplo, si quiere extraer leads de correos, debe definir campos: nombre, empresa, email, urgencia, interes, evidencia textual y confianza. Si quiere clasificar tickets, debe definir categoria, prioridad, motivo y siguiente accion. El modelo no debe inventar campos ni devolver texto libre si el workflow espera JSON.

Function calling exige disenar herramientas. Una funcion debe tener nombre claro, descripcion concreta y parametros limitados. Si la herramienta se llama `hacer_cosa`, el modelo no sabra cuando usarla. Si se llama `crear_ticket_soporte` y define `cliente`, `problema`, `prioridad` y `resumen`, la accion es mas controlable. El alumno debe practicar con funciones simuladas antes de conectarlas a sistemas reales.

Grounding y Deep Research se introducen para tareas donde la actualidad o las fuentes importan: analisis de mercado, comparativas de herramientas, investigacion legal preliminar, resumen de tendencias o preparacion de informes. El criterio profesional es no confundir "informe con fuentes" con "verdad absoluta". El alumno debe revisar fuente, fecha, autoridad, contradicciones y huecos.

## Avanzado

En avanzado, Gemini se integra en arquitecturas de producto. Un sistema puede usar embeddings para recuperar documentos, Gemini para razonar sobre el contexto, function calling para ejecutar acciones, n8n para orquestar el workflow y una base de datos para almacenar trazabilidad. Otro sistema puede usar Deep Research para recopilar fuentes, ChatGPT o Claude para transformar el informe en materiales docentes y Codex para crear una app que consuma esos datos.

El alumno avanzado debe aprender a crear evaluaciones. Para structured outputs, la evaluacion comprueba si el JSON valida, si los campos tienen sentido y si no hay informacion inventada. Para RAG, comprueba si la respuesta esta apoyada por documentos. Para research, comprueba cobertura de fuentes, fechas y contradicciones. Para agentes, comprueba que la tool llamada era la correcta y que sus argumentos eran seguros.

## Proyectos reales

Proyectos recomendados: analizador multimodal de documentos, extractor de datos de facturas o contratos, investigador de mercado con fuentes, generador de briefings, sistema RAG con embeddings, asistente de video que resume reuniones, clasificador de tickets con JSON validado y agente que decide entre varias herramientas internas.

Practica de máximo nivel: construir un extractor de oportunidades comerciales. Entrada: texto libre de una conversacion con cliente. Salida: JSON con problema, presupuesto, urgencia, decision maker, siguiente accion y nivel de confianza. BREAK: introducir texto ambiguo, fechas contradictorias y datos ausentes. FIX: exigir campo `evidencia`, permitir `desconocido` y anadir validacion de schema antes de enviar datos al CRM.

## Fuentes oficiales

- Gemini API docs: https://ai.google.dev/gemini-api/docs
- Models: https://ai.google.dev/gemini-api/docs/models
- Structured output: https://ai.google.dev/gemini-api/docs/structured-output
- Function calling: https://ai.google.dev/gemini-api/docs/function-calling
- Deep Research: https://ai.google.dev/gemini-api/docs/deep-research
- Embeddings: https://ai.google.dev/gemini-api/docs/embeddings
- Grounding with Google Search: https://ai.google.dev/gemini-api/docs/google-search
- Gemini Cookbook: https://github.com/google-gemini/cookbook

## Control editorial profesional

Este bloque fija el uso correcto de este archivo dentro de la boveda. Sirve para evitar contenido innecesario, mantener la informacion revisable y convertir la nota en material profesional.

### Objetivo operativo

Usar **Gemini API Deep Research Agents** para producir el entregable definido en la metadata: **manual con fuentes y practica**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

### Prerequisitos y materiales

- Haber leido el documento maestro y el mapa de carpetas.
- Tener claro el nivel del alumno antes de usar este archivo.
- Si se trabaja con herramientas externas, revisar credenciales, permisos, coste y datos sensibles.
- Si se convierte en clase, preparar una practica pequena y un error provocado.

### Fuentes y verificacion

| Tipo | Fuente | Fecha/uso | Criterio |
|---|---|---|---|
| Fuente oficial | https://ai.google.dev/gemini-api/docs | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |

### Notas para profesor o facilitador

- Empezar con un problema real antes de explicar teoria.
- Pedir al alumno una salida concreta: documento, prompt, workflow, checklist, demo o defensa.
- Comprobar que el alumno puede explicar que entra, que pasa, que sale, que puede fallar y como lo verificaria.
- No avanzar a herramientas avanzadas si no hay dominio de entradas, salidas, permisos y evaluacion.

### Criterio para eliminar contenido innecesario

Eliminar o reescribir cualquier parrafo que no cumpla una de estas funciones: explicar una decision, enseñar un concepto, guiar una practica, prevenir un error, respaldar una fuente, preparar un entregable o mejorar la evaluacion.

### Proxima revision

- Revisar este archivo cuando cambien las fuentes oficiales relacionadas o antes de usarlo como material comercial.
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Gemini API Deep Research Agents**.
