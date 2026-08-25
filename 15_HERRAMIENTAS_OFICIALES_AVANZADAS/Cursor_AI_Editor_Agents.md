---
titulo: "Cursor AI Editor Agents"
tipo: "manual_research"
nivel: "transversal"
fase: "transversal"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://cursor.com/docs"]
tags: ["ai-academy", "manual_research", "transversal", "transversal"]
entregable: "manual con fuentes y practica"
---
# Cursor - Editor, agentes, rules, skills, MCP y cloud agents

Cursor debe ensenarse como un editor de codigo con agente, no como un chat pegado al IDE. Su documentacion lo presenta como un coding agent para entender codebases, planificar y construir features, arreglar bugs, revisar cambios y trabajar con herramientas existentes. Para el alumno, Cursor representa una forma de trabajar dentro del repositorio con contexto continuo: archivos abiertos, reglas del proyecto, agente, terminal, integraciones, cloud agents, CLI, MCP, skills y subagents.

## Modelo mental

Cursor tiene varias capas. La primera es el editor: leer, navegar, buscar y modificar codigo. La segunda es el Agent: conversar con contexto del proyecto, pedir planes, ejecutar cambios y revisar. La tercera son las Rules: instrucciones persistentes que guian al agente. La cuarta son Skills y Subagents: procedimientos y especialistas para tareas repetibles. La quinta es MCP: conexion con herramientas externas. La sexta son Cloud Agents y automatizaciones: delegar trabajo fuera del ordenador local, integrarlo con GitHub, Slack, Linear, Jira u otros sistemas.

El alumno debe entender que Cursor no elimina la necesidad de saber que se esta construyendo. Lo que cambia es el ritmo: el agente puede leer mas rapido, proponer cambios y ejecutar tareas, pero el criterio sigue siendo humano. El profesional define alcance, revisa diffs, ejecuta pruebas y no mezcla refactors gigantes con features pequenas.

## Basico

En nivel basico, Cursor sirve para entender un proyecto. El alumno abre una carpeta, pregunta donde esta una funcionalidad, pide explicacion de un archivo, localiza rutas, entiende dependencias y hace cambios pequenos. Debe practicar con tareas como cambiar texto, anadir una validacion simple, explicar un componente, encontrar donde se llama una API o crear una prueba basica.

El objetivo basico no es producir mucho codigo. Es aprender el dialogo correcto con un agente de editor. Una buena peticion incluye: que quieres cambiar, donde sospechas que esta, que no quieres tocar, como comprobarlo y que estilo debe respetar. El alumno debe mirar el diff. Si no mira el diff, no esta usando Cursor profesionalmente.

Que no usar en basico: Cloud Agents para trabajo importante, subagents sin entender el repo, MCP con cuentas reales, rules globales demasiado amplias o peticiones tipo "recrea toda la app".

## Intermedio

En intermedio entran Rules. Las rules de Cursor proporcionan instrucciones a nivel de sistema para Agent. Pueden vivir en `.cursor/rules`, ser de usuario, de equipo o usar `AGENTS.md` como alternativa markdown. Segun la documentacion oficial, las project rules se versionan con el codigo y pueden aplicarse siempre, por globs, por descripcion o manualmente. Esto es muy importante para equipos: si el proyecto tiene convenciones de componentes, APIs, tests o migraciones, se documentan como reglas.

El alumno debe aprender a escribir rules cortas, concretas y comprobables. Una rule mala dice: "haz codigo limpio". Una buena rule dice: "en `src/components`, usa exports nombrados, conserva props tipadas, anade tests si modificas logica y no cambies estilos globales". Tambien debe aprender que no todo pertenece a una rule. La documentacion oficial recomienda mantenerlas enfocadas, reutilizar ejemplos y evitar meter guias enormes o instrucciones que ya cubren linters y tests.

Skills y subagents aparecen cuando hay tareas repetidas: revisar accesibilidad, crear endpoints, migrar componentes, generar documentacion, analizar rendimiento o preparar releases. Cada skill debe tener uso claro. Cada subagent debe tener responsabilidad definida.

## Avanzado

En avanzado, Cursor se integra en un flujo profesional de equipo. Cloud Agents permiten delegar tareas en remoto, especialmente conectadas con repositorios y sistemas de trabajo. MCP permite conectar servicios externos. CLI permite operar desde terminal o CI. Integraciones con GitHub, GitLab, Jira, Linear, Slack y otros sistemas convierten el editor en una pieza de un flujo de desarrollo mas amplio.

El alumno avanzado debe disenar "guardrails de repositorio": rules, tests, linters, plantillas de PR, checklist de seguridad, prompts de revision y limites de alcance. Tambien debe aprender a dividir tareas. Un agente puede hacer una feature si el requisito esta bien definido; no deberia improvisar arquitectura critica sin revision.

## Proyectos reales

Proyectos con Cursor: construir una feature en una app existente, arreglar un bug reproducible, crear tests faltantes, documentar una API, migrar una pantalla, crear un dashboard, revisar accesibilidad, preparar una plantilla de componente o generar rules de equipo. El valor real no esta en que Cursor escriba mucho codigo, sino en que el alumno aprenda a dirigirlo como colaborador tecnico.

Practica AAAA+: abrir un proyecto, crear una rule para estilo de componentes, pedir al Agent una mejora concreta, revisar diff, ejecutar pruebas, provocar un error cambiando un selector o tipo, pedir diagnostico y documentar el arreglo. La evaluacion mide si el alumno mantuvo alcance, entendio los cambios y verifico.

## Fuentes oficiales

- Cursor Docs: https://cursor.com/docs
- Rules: https://cursor.com/docs/rules
- Skills: https://cursor.com/docs/skills
- Subagents: https://cursor.com/docs/subagents
- MCP: https://cursor.com/docs/mcp
- Cloud Agents: https://cursor.com/docs/cloud-agent
- Customizing agents: https://cursor.com/learn/customizing-agents
- Cursor Marketplace: https://cursor.com/marketplace

## Criterio de evaluacion AAAA+

Un alumno domina Cursor cuando puede dirigir al agente sin perder control del repositorio. La prueba debe exigir tres cosas: una rule util, una tarea de codigo con alcance pequeno y una revision de diff. La rule debe ser especifica, estar ubicada donde corresponde y no duplicar lo que ya hacen linters o tests. La tarea debe tener criterio de terminado. La revision debe mencionar archivos tocados, motivo del cambio, pruebas ejecutadas y riesgo residual.

Una evaluacion avanzada puede pedir al alumno que cree un flujo de equipo: rules para frontend, subagent para accesibilidad, MCP para una herramienta externa y Cloud Agent para una tarea no urgente. La nota excelente explica que partes quedan en local, que partes van a cloud, que secretos no se comparten y que humano aprueba antes de merge. Cursor se vuelve AAAA+ cuando no es una maquina de escribir codigo rapido, sino una extension gobernada del equipo tecnico.

## Siguiente paso del alumno

El siguiente paso recomendado es crear una carpeta `.cursor/rules` en un proyecto de prueba y escribir una sola regla pequena. Luego el alumno debe pedir al agente una tarea que active esa regla y comprobar si el resultado la respeta. Si la regla no cambia el comportamiento, se mejora la descripcion, el alcance o el ejemplo. Asi aprende a entrenar el entorno sin depender de prompts repetidos.

## Control editorial profesional

Este bloque fija el uso correcto de este archivo dentro de la boveda. Sirve para evitar contenido innecesario, mantener la informacion revisable y convertir la nota en material profesional.

### Objetivo operativo

Usar **Cursor AI Editor Agents** para producir el entregable definido en la metadata: **manual con fuentes y practica**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

### Prerequisitos y materiales

- Haber leido el documento maestro y el mapa de carpetas.
- Tener claro el nivel del alumno antes de usar este archivo.
- Si se trabaja con herramientas externas, revisar credenciales, permisos, coste y datos sensibles.
- Si se convierte en clase, preparar una practica pequena y un error provocado.

### Fuentes y verificacion

| Tipo | Fuente | Fecha/uso | Criterio |
|---|---|---|---|
| Fuente oficial | https://cursor.com/docs | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |

### Notas para profesor o facilitador

- Empezar con un problema real antes de explicar teoria.
- Pedir al alumno una salida concreta: documento, prompt, workflow, checklist, demo o defensa.
- Comprobar que el alumno puede explicar que entra, que pasa, que sale, que puede fallar y como lo verificaria.
- No avanzar a herramientas avanzadas si no hay dominio de entradas, salidas, permisos y evaluacion.

### Criterio para eliminar contenido innecesario

Eliminar o reescribir cualquier parrafo que no cumpla una de estas funciones: explicar una decision, enseñar un concepto, guiar una practica, prevenir un error, respaldar una fuente, preparar un entregable o mejorar la evaluacion.

### Proxima revision

- Revisar este archivo cuando cambien las fuentes oficiales relacionadas o antes de usarlo como material comercial.
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Cursor AI Editor Agents**.

