---
titulo: "OpenAI ChatGPT Codex"
tipo: "manual_research"
nivel: "transversal"
fase: "transversal"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://learn.chatgpt.com/", "https://developers.openai.com/"]
tags: ["ai-academy", "manual_research", "transversal", "transversal"]
entregable: "manual con fuentes y practica"
---
# OpenAI, ChatGPT y Codex - Manual profesional

OpenAI dentro de esta formacion se estudia como una plataforma completa, no solo como "un chat". La parte visible para muchos alumnos es ChatGPT: conversaciones, proyectos, archivos, conectores, herramientas, busqueda web, generacion de imagenes, analisis, voz y trabajo con documentos. La parte profesional aparece cuando el alumno entiende Codex, Codex CLI, Codex Cloud, skills, plugins, agentes, permisos, entornos, revisiones de codigo, tareas largas y automatizacion con herramientas. El objetivo de este archivo es que el alumno sepa convertir una necesidad real en un sistema de trabajo con OpenAI, desde una conversacion bien planteada hasta un agente que opera sobre archivos, repositorios o flujos de produccion.

## Modelo mental

La forma mas clara de entender OpenAI en un curso es separarlo en capas. La primera capa es la conversacion: el usuario da contexto, formula una tarea y recibe una respuesta. La segunda es el trabajo con archivos: el modelo interpreta documentos, imagenes, datos o codigo. La tercera son herramientas: busqueda, ejecucion de codigo, navegador, conectores, MCP, shell, apply patch o APIs externas. La cuarta son procedimientos reutilizables: skills, instrucciones, plantillas, comandos y reglas de trabajo. La quinta es produccion: permisos, seguridad, costes, evaluacion, logs y revision humana.

Cuando el alumno usa ChatGPT sin criterio, suele escribir una peticion vaga y esperar magia. Cuando usa OpenAI profesionalmente, define objetivo, contexto, restricciones, formato de salida, fuentes permitidas, criterios de aceptacion y verificacion. Esa diferencia debe repetirse en todas las clases. No se trata de "saber prompts bonitos"; se trata de gobernar una tarea.

## Basico

En nivel basico, ChatGPT sirve para pensar, estructurar, resumir, convertir ideas en borradores, explicar conceptos, crear checklists, redactar documentos y preparar materiales. El alumno debe aprender que una buena peticion contiene cinco elementos: objetivo, contexto, rol operativo, formato esperado y criterio de calidad. Por ejemplo: "quiero convertir estas notas en una clase de 45 minutos para alumnos no tecnicos; dame estructura, ejemplos y ejercicio final; no inventes datos; marca dudas".

El alumno tambien debe aprender a pedir variantes. Una respuesta no es un veredicto. Es un primer material. Un buen flujo basico es: pedir estructura, criticarla, pedir mejora, pedir version para principiantes, pedir version ejecutiva, pedir errores frecuentes y pedir una checklist de verificacion. Este flujo crea criterio sin necesidad de programar.

Que no usar en basico: no pedir que una IA controle sistemas sensibles, no usar APIs sin entender costes, no aceptar datos sin fuentes, no mezclar diez documentos sin explicar prioridad, no pedir codigo para produccion sin pruebas, no dar credenciales ni informacion privada innecesaria.

## Intermedio

El nivel intermedio introduce Codex y trabajo con proyectos. Codex es el espacio donde el modelo no solo responde, sino que colabora sobre archivos, repositorios, terminal, pruebas y cambios reales. El alumno debe aprender una secuencia profesional: leer el proyecto, localizar archivos, proponer cambios si el problema es ambiguo, editar de forma acotada, ejecutar pruebas, revisar diffs y explicar que se ha hecho. Si Codex trabaja en una tarea de codigo, el alumno debe saber mirar los resultados igual que miraria el trabajo de un desarrollador junior: que cambio, por que, que prueba lo cubre y que riesgo queda.

Codex CLI lleva ese flujo a terminal. Es util cuando el alumno quiere operar en proyectos locales, automatizar revisiones, ejecutar comandos, trabajar en ramas, generar parches, usar configuraciones y controlar permisos. Codex Cloud permite delegar trabajo en entornos remotos y tareas mas largas. En una formacion profesional conviene explicar que la nube no sustituye el criterio: facilita ejecucion, pero el alumno sigue siendo responsable de revisar cambios, secretos, dependencias y despliegues.

Las skills de OpenAI/Codex se entienden como procedimientos empaquetados. Una skill no es un prompt suelto; es una carpeta con instrucciones, recursos y, cuando hace falta, scripts o referencias. Sirve para que el agente sepa como hacer un tipo de trabajo de manera consistente: generar documentos, revisar seguridad, producir una presentacion, preparar informes, analizar datos o ejecutar un flujo interno. En nivel intermedio, el alumno puede estudiar una skill existente, identificar su objetivo, leer su `SKILL.md`, ver cuando se activa y adaptar una version pequena.

## Avanzado

El nivel avanzado consiste en disenar un entorno de trabajo con OpenAI que sea repetible y gobernable. Aqui entran permisos, sandboxing, aprobaciones, conectores, plugins, MCP, tareas programadas, agentes especializados, evaluaciones, seguridad, coste y trazabilidad. El alumno debe entender que cuanto mas capacidad se da a un agente, mas importante es limitar su radio de accion. Un agente con navegador, shell, archivos y herramientas externas puede ahorrar horas, pero tambien puede cometer errores caros si no hay fronteras.

En avanzado, cada proyecto debe tener un "contrato de agente": que puede leer, que puede modificar, que comandos puede ejecutar, que herramientas puede usar, que necesita aprobar el humano, que datos no debe tocar, que outputs son obligatorios y como se valida. Este contrato puede vivir en instrucciones, `AGENTS.md`, skill, checklist de proyecto o documento de gobernanza.

## Proyectos reales

Un proyecto real con OpenAI puede ser un generador de propuestas comerciales, un copiloto de documentacion interna, un revisor de PRs, un asistente de investigacion con fuentes, un traductor de requisitos a tickets, un sistema de soporte con retrieval o un generador de cursos en Obsidian. El flujo AAAA+ es siempre parecido: investigar fuentes, disenar estructura, crear artefactos, verificar, romper, reparar, documentar y convertirlo en plantilla.

Ejemplo de practica: el alumno crea una skill para transformar cualquier reunion en plan de accion. Debe definir entradas, formato de salida, pasos, limites, ejemplos, errores frecuentes y prueba de calidad. Luego ejecuta la skill sobre tres reuniones distintas y compara resultados. Si la skill falla, debe explicar si fallo por falta de contexto, instruccion ambigua, datos incompletos o criterio de evaluacion insuficiente.

## Errores frecuentes

El error mas comun es pedir a ChatGPT que "haga todo" sin darle un marco. Otro error es tratar Codex como si fuera un buscador de codigo, cuando en realidad su valor esta en trabajar iterativamente sobre archivos reales. Otro error es crear skills demasiado largas, con instrucciones contradictorias o sin ejemplos concretos. Tambien es peligroso usar conectores o plugins sin revisar permisos. En contexto empresarial, el alumno debe separar datos publicos, internos, confidenciales y regulados.

## Fuentes oficiales

- ChatGPT Learn: https://learn.chatgpt.com/
- Skills & Plugins: https://learn.chatgpt.com/docs/skills-and-plugins
- Build skills: https://learn.chatgpt.com/docs/build-skills
- Codex CLI: https://learn.chatgpt.com/docs/codex/cli
- OpenAI Developers: https://developers.openai.com/
- OpenAI Agents, tools, MCP y APIs: https://platform.openai.com/docs

## Control editorial profesional

Este bloque fija el uso correcto de este archivo dentro de la boveda. Sirve para evitar contenido innecesario, mantener la informacion revisable y convertir la nota en material profesional.

### Objetivo operativo

Usar **OpenAI ChatGPT Codex** para producir el entregable definido en la metadata: **manual con fuentes y practica**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

### Prerequisitos y materiales

- Haber leido el documento maestro y el mapa de carpetas.
- Tener claro el nivel del alumno antes de usar este archivo.
- Si se trabaja con herramientas externas, revisar credenciales, permisos, coste y datos sensibles.
- Si se convierte en clase, preparar una practica pequena y un error provocado.

### Fuentes y verificacion

| Tipo | Fuente | Fecha/uso | Criterio |
|---|---|---|---|
| Fuente oficial | https://learn.chatgpt.com/ | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |
| Fuente oficial | https://developers.openai.com/ | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |

### Notas para profesor o facilitador

- Empezar con un problema real antes de explicar teoria.
- Pedir al alumno una salida concreta: documento, prompt, workflow, checklist, demo o defensa.
- Comprobar que el alumno puede explicar que entra, que pasa, que sale, que puede fallar y como lo verificaria.
- No avanzar a herramientas avanzadas si no hay dominio de entradas, salidas, permisos y evaluacion.

### Criterio para eliminar contenido innecesario

Eliminar o reescribir cualquier parrafo que no cumpla una de estas funciones: explicar una decision, enseñar un concepto, guiar una practica, prevenir un error, respaldar una fuente, preparar un entregable o mejorar la evaluacion.

### Proxima revision

- Revisar este archivo cuando cambien las fuentes oficiales relacionadas o antes de usarlo como material comercial.
- Si se detecta informacion generica, convertirla en ejemplo especifico de **OpenAI ChatGPT Codex**.

