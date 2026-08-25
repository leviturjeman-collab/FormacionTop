---
titulo: "Mapa Comparativo Que Usar Y Cuando"
tipo: "manual_research"
nivel: "transversal"
fase: "transversal"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "manual_research", "transversal", "transversal"]
entregable: "manual con fuentes y practica"
---
# Mapa comparativo - Que usar y cuando

Este documento es la matriz de decision de la carpeta. Su objetivo es que el alumno no elija herramientas por hype, sino por encaje. En proyectos reales, la pregunta correcta no es "cual IA es mejor". La pregunta correcta es: que problema tengo, que datos entran, que salida necesito, que herramientas deben actuar, que riesgo existe, que coste acepto, que privacidad necesito y quien revisa.

## Mapa rapido

| Necesidad | Herramienta principal | Alternativas | Motivo |
|---|---|---|---|
| Pensar, escribir, estructurar contenido | ChatGPT / Claude | Gemini | Conversacion, razonamiento, documentos, borradores |
| Trabajar sobre codigo local | Codex / Claude Code / Cursor | Ollama para apoyo local | Lectura de repo, cambios, tests, diffs |
| Automatizar procesos entre apps | n8n | Zapier, Make, scripts | Workflows, triggers, nodes, credenciales |
| Investigar con fuentes | ChatGPT deep research / Gemini Deep Research / Claude con web | Busqueda manual | Fuentes, sintesis, informes |
| Ejecutar modelos sin depender de cloud | Ollama | LM Studio, servidores propios | Privacidad, coste local, experimentacion |
| Crear agente persistente con memoria | Hermes | Claude Code/Codex con instrucciones y skills | Memoria, skills, mensajeria, ejecucion flexible |
| Crear procedimientos reutilizables | Skills de OpenAI/Codex, Cursor Skills, Anthropic Skills, Hermes Skills | Plantillas Markdown | Repeticion consistente |
| Conectar herramientas externas | MCP, function calling, n8n nodes | APIs directas | Acciones y datos externos |
| Escalar automatizaciones | n8n queue mode, workers, API | Infra propia | Produccion, concurrencia, trazabilidad |
| Entornos con equipo de desarrollo | Cursor, Codex, Claude Code, GitHub | IDE tradicional | Colaboracion, revision, reglas |

## Decision por nivel

### Basico

El alumno basico debe usar pocas herramientas. Recomendacion: ChatGPT o Claude para pensar y redactar; n8n para un workflow pequeno; Cursor o Codex para leer codigo sencillo; Ollama solo para probar un modelo local. No deberia empezar con MCP, subagents, queue mode, tools con permisos reales ni agentes autonomos.

La razon es simple: antes de conectar sistemas hay que entender entradas y salidas. Un alumno que no sabe leer un JSON no deberia disenar un agente con tools. Un alumno que no sabe revisar un diff no deberia dejar que un agente modifique un repositorio grande. Un alumno que no sabe mirar ejecuciones de n8n no deberia automatizar procesos de clientes.

### Intermedio

El alumno intermedio ya puede combinar herramientas. Ejemplos: ChatGPT para disenar una clase, n8n para automatizar captacion, Gemini para structured outputs, Cursor para construir una app, Ollama para clasificar texto localmente, Claude Code para refactor con tests. Aqui empieza el verdadero poder: no usar una herramienta para todo, sino una cadena.

Una cadena intermedia podria ser: investigar con Gemini Deep Research, sintetizar en Obsidian con ChatGPT, crear un workflow n8n para publicar contenidos, usar Cursor para construir una pagina, y usar Codex para revisar errores. La evaluacion no mide si "uso muchas herramientas"; mide si cada una tiene razon.

### Avanzado

El alumno avanzado disena sistemas con gobernanza. Puede usar OpenAI para agentes, Gemini para multimodalidad, Claude Code para repositorios, Cursor para flujo de desarrollo, n8n para orquestacion, Hermes para memoria persistente y Ollama para modelos locales. Pero tambien define permisos, logs, evals, coste, fallback, privacidad y humanos en el bucle.

## Que no usar

No uses agentes para tareas que una automatizacion determinista resuelve mejor. No uses un modelo grande para una transformacion simple. No uses n8n como base de datos si necesitas consultas complejas. No uses Ollama para tareas criticas si no has medido calidad. No uses Cursor rules enormes. No uses MCP sin saber que permisos da. No uses Deep Research sin leer fuentes. No uses computer use si hay una API estable. No uses prompts para arreglar lo que deberia ser validacion de datos.

## Arquitecturas recomendadas

### Asistente de soporte

n8n recibe ticket por webhook. Un modelo clasifica. RAG recupera documentacion. El modelo genera borrador. Humano aprueba si confianza baja. n8n registra el caso. OpenAI, Claude o Gemini pueden generar la respuesta. Ollama puede usarse localmente si los datos son sensibles y la calidad es suficiente.

### Generador de propuestas

ChatGPT o Claude transforma notas comerciales en estructura. Gemini puede extraer datos de documentos o llamadas. n8n crea documento, envia a CRM y avisa al equipo. Codex o Cursor crea una herramienta interna para gestionar plantillas. Evaluacion: precision de datos, tono, completitud, aprobacion humana.

### Agente de codigo

Cursor, Codex o Claude Code lee el repositorio, aplica reglas, modifica archivos y ejecuta pruebas. GitHub gestiona PR. Un subagent puede revisar seguridad. La regla AAAA+: cambios pequenos, pruebas, diff revisado, rollback claro.

### Investigacion de mercado

Gemini Deep Research o ChatGPT con fuentes recopila informacion. Claude sintetiza riesgos y oportunidades. Obsidian guarda notas. n8n programa actualizaciones. Una presentacion se genera desde la base. Evaluacion: fuentes, fechas, contradicciones y trazabilidad.

## Checklist de eleccion

Antes de elegir herramienta, responde:

- Que problema exacto resuelve.
- Que datos entran.
- Que salida se necesita.
- Que parte debe ser determinista.
- Que parte necesita razonamiento.
- Que herramientas externas hay que tocar.
- Que permisos hacen falta.
- Que coste maximo aceptas.
- Que informacion es sensible.
- Que humano revisa.
- Como se prueba.
- Como se revierte.

## Fuentes oficiales

Consulta los archivos hermanos de esta carpeta y sus fuentes oficiales: [[OpenAI_ChatGPT_Codex]], [[n8n_Automatizacion_AI_Agents]], [[Gemini_API_Deep_Research_Agents]], [[Anthropic_Claude_Claude_Code]], [[Cursor_AI_Editor_Agents]], [[Hermes_Nous_Agent_Local_Skills]] y [[Ollama_Modelos_Locales_API]].

## Criterio de evaluacion AAAA+

Para evaluar este mapa, el alumno debe recibir tres ideas de proyecto y elegir herramientas para cada una. No se acepta una respuesta tipo "usaria ChatGPT y n8n". Debe justificar capas: entrada, datos, razonamiento, automatizacion, herramienta externa, almacenamiento, revision humana, evaluacion y despliegue. Tambien debe decir que no usaria. Esa parte es crucial: un profesional se define tanto por lo que descarta como por lo que elige.

Ejemplo de defensa: "Para un asistente interno con datos sensibles usaria Ollama o un proveedor cloud con controles empresariales; no usaria Deep Research porque no necesito fuentes web; usaria n8n para orquestar; usaria schema para salida; pondria revision humana antes de enviar respuestas; y mediria calidad con diez casos reales". Si el alumno puede razonar asi, ya no depende de recetas. Puede construir proyectos nuevos.

## Control editorial profesional

Este bloque fija el uso correcto de este archivo dentro de la boveda. Sirve para evitar contenido innecesario, mantener la informacion revisable y convertir la nota en material profesional.

### Objetivo operativo

Usar **Mapa Comparativo Que Usar Y Cuando** para producir el entregable definido en la metadata: **manual con fuentes y practica**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Mapa Comparativo Que Usar Y Cuando**.


## Fuentes oficiales complementarias

Estas fuentes se usan para verificar instrucciones tecnicas, compatibilidad y comportamiento de herramientas antes de convertir este archivo en clase, entrega o material comercial.

| Fuente | Uso recomendado |
|---|---|
| https://learn.chatgpt.com/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://docs.anthropic.com/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://ai.google.dev/gemini-api/docs | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://docs.n8n.io/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://cursor.com/docs | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://github.com/ollama/ollama | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://hermes-agent.nousresearch.com/docs/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
