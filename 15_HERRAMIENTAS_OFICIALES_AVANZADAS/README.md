---
titulo: "HERRAMIENTAS OFICIALES AVANZADAS"
tipo: "manual_research"
nivel: "transversal"
fase: "transversal"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "manual_research", "transversal", "transversal"]
entregable: "manual con fuentes y practica"
---
# Herramientas oficiales avanzadas - Guia de uso

Esta carpeta concentra las herramientas que el alumno debe entender cuando quiere pasar de "uso ChatGPT" a "soy capaz de disenar sistemas de IA, automatizaciones, agentes y proyectos reales". La idea no es aprender todas las herramientas por moda. La idea es saber elegir: que herramienta conviene para pensar, cual para programar, cual para automatizar procesos, cual para ejecutar modelos locales, cual para investigar con fuentes, cual para trabajar dentro de un repositorio y cual para construir agentes reutilizables.

La carpeta nace para resolver una confusion normal: cuando aparecen OpenAI, Anthropic, Gemini, n8n, Cursor, Hermes y Ollama a la vez, el alumno puede sentir que todo hace lo mismo. No es asi. Algunas herramientas son modelos o APIs. Otras son entornos de trabajo. Otras son capas de automatizacion. Otras son sistemas para empaquetar procedimientos. Otras permiten ejecutar modelos en local. Si la formacion no separa esas capas, el alumno acaba copiando tutoriales sin criterio. Si las separa bien, puede mirar cualquier proyecto y decir: aqui necesito un modelo, aqui necesito una tool, aqui necesito un workflow, aqui necesito un agente, aqui necesito revision humana y aqui necesito un entorno de despliegue.

## Como esta dividida

- [[OpenAI_ChatGPT_Codex]]: ChatGPT, Codex, Codex CLI, Codex Cloud, skills, plugins, conectores, agentes y flujo profesional de trabajo con OpenAI.
- [[n8n_Automatizacion_AI_Agents]]: automatizacion visual, workflows, nodes, webhooks, credenciales, AI Agent, tools, memoria, RAG, API, RBAC y produccion.
- [[Gemini_API_Deep_Research_Agents]]: modelos Gemini, structured outputs, function calling, grounding, Deep Research, embeddings, multimodalidad y agentes.
- [[Anthropic_Claude_Claude_Code]]: Claude, Claude Code, prompt engineering, subagents, hooks, tool use, MCP, permisos y computer use.
- [[Cursor_AI_Editor_Agents]]: editor con agente, rules, skills, subagents, MCP, cloud agents, CLI y trabajo dentro de repositorios.
- [[Hermes_Nous_Agent_Local_Skills]]: Hermes Agent de Nous Research, memoria persistente, skills, mensajeria, MCP, proveedores, ejecucion en distintos entornos y aprendizaje operativo.
- [[Ollama_Modelos_Locales_API]]: ejecucion local de modelos, API local, library, Modelfile, structured outputs, embeddings, OpenAI compatibility y uso con n8n/agentes.
- [[Mapa_Comparativo_Que_Usar_Y_Cuando]]: matriz de decision para elegir herramienta por tipo de proyecto.

## Regla de lectura

El alumno no debe leer esta carpeta como una enciclopedia pasiva. Debe leerla como un mapa de decisiones. Cada archivo responde a cinco preguntas:

1. Que es la herramienta.
2. Para que sirve en proyectos reales.
3. Que nivel necesita el alumno antes de usarla.
4. Que no debe usar todavia.
5. Como se convierte en una practica, un documento, una presentacion o un proyecto.

## Niveles

### Basico

El nivel basico no significa superficial. Significa que el alumno aprende el vocabulario, abre la herramienta, ejecuta una tarea pequena y entiende que esta pasando. En OpenAI, por ejemplo, el nivel basico es saber usar ChatGPT con instrucciones claras, pedir formatos utiles y revisar resultados. En n8n es crear un workflow pequeno con un trigger, uno o dos nodes y una salida verificable. En Ollama es instalar, descargar un modelo y hacer una llamada local. En Cursor es abrir un repositorio, pedir explicacion del codigo y revisar cambios pequenos. El alumno todavia no deberia mezclar diez herramientas.

### Intermedio

El nivel intermedio aparece cuando el alumno empieza a conectar sistemas. Aqui se introducen webhooks, APIs, credenciales, outputs estructurados, tools, repositorios, reglas de agente, evaluacion basica y control de errores. En este nivel el alumno debe aprender a leer logs, inputs, outputs, status codes y diffs. Tambien debe aprender a no aceptar la primera respuesta del modelo como verdad. El trabajo intermedio consiste en construir procesos repetibles: un flujo de captacion de leads, un asistente de investigacion, un generador de informes, un revisor de codigo, una base RAG sencilla o una automatizacion de contenido.

### Avanzado

El nivel avanzado consiste en disenar sistemas que sobreviven al contacto con la realidad. Aqui aparecen permisos, seguridad, human-in-the-loop, coste, versionado, despliegue, cola de ejecucion, observabilidad, multiagentes, skills reutilizables, MCP, modelos locales, fallback entre proveedores y evaluaciones. En avanzado, el alumno deja de preguntar "como hago que funcione" y empieza a preguntar "como se rompe, como lo detecto, como lo reparo y como lo mantengo".

## Que usar segun el proyecto

Si el proyecto es de productividad personal, empieza por ChatGPT, OpenAI o Claude. Si el proyecto toca codigo, usa Codex, Claude Code o Cursor. Si el proyecto automatiza procesos entre aplicaciones, usa n8n. Si el proyecto necesita investigacion con fuentes, usa Deep Research, web search, Gemini Deep Research o una combinacion con verificacion humana. Si el proyecto necesita privacidad o experimentacion local, usa Ollama. Si el proyecto busca agentes persistentes, memoria y mensajeria en multiples canales, estudia Hermes. Si el proyecto requiere datos estructurados, usa structured outputs o schemas. Si requiere acciones externas, usa tools, function calling, MCP o nodes de n8n.

## Que no usar todavia

No uses agentes autonomos si el alumno no sabe revisar outputs. No uses MCP si todavia no entiende APIs, permisos y tools. No uses queue mode en n8n si aun no entiende workflows basicos. No uses modelos locales para produccion si no sabes medir rendimiento, memoria, latencia y calidad. No uses Cursor rules o skills gigantes si la instruccion todavia no esta clara. No uses una API de pago sin limites de coste. No uses "auto" como criterio profesional. Un sistema profesional necesita fronteras.

## Practica central

La practica recomendada de esta carpeta es construir un "sistema operativo de proyecto": una carpeta de Obsidian con objetivo, fuentes, decision de herramientas, arquitectura, prompts, workflows, agente, logs, evaluacion, riesgos y version final. El alumno elige una idea real, como un asistente de atencion al cliente, un generador de propuestas, un analizador de tickets, un sistema de investigacion de mercado o un copiloto de contenidos. Despues decide que herramienta usa para cada parte y justifica por que.

## Checklist AAAA+

- La herramienta se explica con fuentes oficiales.
- El alumno sabe que problema resuelve.
- El alumno sabe cuando no usarla.
- Hay separacion entre basico, intermedio y avanzado.
- Hay practica real.
- Hay errores provocados.
- Hay verificacion.
- Hay criterio de seguridad.
- Hay salida aplicable a trabajo.
- Hay enlaces internos para continuar aprendiendo.

## Fuentes oficiales base

- OpenAI / ChatGPT Learn: https://learn.chatgpt.com/
- OpenAI Developers: https://developers.openai.com/
- n8n Docs: https://docs.n8n.io/
- Google AI for Developers / Gemini API: https://ai.google.dev/gemini-api/docs
- Anthropic Docs: https://docs.anthropic.com/
- Claude Code Docs: https://code.claude.com/docs/
- Cursor Docs: https://cursor.com/docs
- Hermes Agent Docs: https://hermes-agent.nousresearch.com/docs/
- Nous Research GitHub: https://github.com/NousResearch
- Ollama GitHub: https://github.com/ollama/ollama
- Ollama Library: https://ollama.com/library

## Control editorial profesional

Este bloque fija el uso correcto de este archivo dentro de la boveda. Sirve para evitar contenido innecesario, mantener la informacion revisable y convertir la nota en material profesional.

### Objetivo operativo

Usar **HERRAMIENTAS OFICIALES AVANZADAS** para producir el entregable definido en la metadata: **manual con fuentes y practica**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

### Prerequisitos y materiales

- Haber leido el documento maestro y el mapa de carpetas.
- Tener claro el nivel del alumno antes de usar este archivo.
- Si se trabaja con herramientas externas, revisar credenciales, permisos, coste y datos sensibles.
- Si se convierte en clase, preparar una practica pequena y un error provocado.

### Fuentes y verificacion

| Tipo | Fuente | Fecha/uso | Criterio |
|---|---|---|---|
| Fuente interna | Fuente interna: AI Professional Academy | Revisada el 2026-08-13 | Usar como criterio pedagogico, no como fuente factual externa |

### Notas para profesor o facilitador

- Empezar con un problema real antes de explicar teoria.
- Pedir al alumno una salida concreta: documento, prompt, workflow, checklist, demo o defensa.
- Comprobar que el alumno puede explicar que entra, que pasa, que sale, que puede fallar y como lo verificaria.
- No avanzar a herramientas avanzadas si no hay dominio de entradas, salidas, permisos y evaluacion.

### Criterio para eliminar contenido innecesario

Eliminar o reescribir cualquier parrafo que no cumpla una de estas funciones: explicar una decision, enseñar un concepto, guiar una practica, prevenir un error, respaldar una fuente, preparar un entregable o mejorar la evaluacion.

### Proxima revision

- Revisar este archivo cuando cambien las fuentes oficiales relacionadas o antes de usarlo como material comercial.
- Si se detecta informacion generica, convertirla en ejemplo especifico de **HERRAMIENTAS OFICIALES AVANZADAS**.

