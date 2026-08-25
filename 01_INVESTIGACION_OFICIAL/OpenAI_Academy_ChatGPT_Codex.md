---
titulo: "OpenAI Academy ChatGPT Codex"
tipo: "manual_research"
nivel: "transversal"
fase: "aprendizaje"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://learn.chatgpt.com/", "https://developers.openai.com/"]
tags: ["ai-academy", "manual_research", "transversal", "aprendizaje"]
entregable: "manual con fuentes y practica"
---
# OpenAI, ChatGPT, Codex, skills y workflows

## Para qué sirve este documento

Este archivo es el manual base para todo lo relacionado con ChatGPT, Codex, prompting, Work, skills, plugins y workflows dentro de la academia. Está escrito para que un alumno pueda leerlo sin tener que ir primero a la documentación oficial, pero también para que tú puedas convertirlo después en clases, presentaciones, documentos de trabajo y ejercicios. La fuente principal es la documentación oficial de ChatGPT Learn y OpenAI Academy. Cuando este contenido se use para una edición real del curso, conviene revisar de nuevo las páginas oficiales porque ChatGPT, Codex, skills, plugins y modelos cambian con frecuencia.

La idea central es que ChatGPT y Codex no se enseñan como "herramientas para pedir cosas", sino como superficies de trabajo. ChatGPT sirve para pensar, escribir, investigar, transformar información, crear documentos, analizar archivos y diseñar procesos. Codex sirve para trabajar sobre repositorios, leer código, editar archivos, ejecutar comandos, revisar diffs y delegar tareas técnicas. Skills y plugins permiten convertir una forma de trabajar en una capacidad reutilizable. Por tanto, la formación debe llevar al alumno desde una petición suelta hasta un sistema de trabajo repetible.

## ChatGPT como superficie de trabajo

ChatGPT debe enseñarse primero desde el uso profesional cotidiano. Un alumno no necesita empezar sabiendo programar ni entendiendo modelos. Necesita entender qué resultado quiere, qué contexto cambia la respuesta y qué límites protegen el trabajo. La documentación oficial de prompting de ChatGPT propone una estructura sencilla para tareas importantes: objetivo, contexto, salida y límites. Esa estructura debe convertirse en una plantilla permanente del curso.

Un prompt débil dice: "Hazme un resumen". Un prompt formativo dice: "Convierte estas notas en una actualización breve para el equipo del proyecto. Pon primero decisiones y próximos pasos. Mantén fechas y presupuesto sin cambiar. Si falta información, señálala en vez de inventarla". La diferencia no es estética. La segunda versión contiene objetivo, audiencia, formato, límites y criterio de calidad. El alumno debe aprender que la IA no adivina prioridades: las infiere a partir de lo que le damos. Cuanto más sensible sea el trabajo, más explícito debe ser el criterio.

ChatGPT también debe enseñarse como un espacio de iteración. El primer prompt no tiene que ser perfecto. Un profesional revisa el resultado, detecta qué falta y da instrucciones de seguimiento. Esto evita el error típico de abandonar una conversación porque la primera respuesta no salió bien. El alumno debe practicar seguimientos concretos: "hazlo más directo", "mantén la evidencia pero sube la recomendación", "separa hechos de supuestos", "convierte esto en tabla", "marca lo que no puedes verificar".

## Contexto, archivos y fuentes conectadas

Un punto esencial es que el contexto no es relleno. El contexto es aquello que cambia el resultado. Si una tarea depende de un PDF, una hoja de cálculo, una captura, una decisión previa o una conversación en una herramienta conectada, el alumno debe nombrar esa fuente y explicar qué debe extraerse de ella. En ChatGPT, los proyectos y chats pueden agrupar archivos, fuentes y conversaciones relacionadas. En entornos de trabajo, los plugins o conectores pueden permitir acceder a herramientas como Drive, Slack, GitHub u otras fuentes, siempre según plan, permisos y configuración de workspace.

La regla didáctica debe ser: no pegues contexto por volumen; aporta contexto por relevancia. En una práctica, se puede entregar al alumno un documento largo y pedirle que decida qué fragmentos son necesarios. Esto entrena criterio. También conviene enseñar la diferencia entre usar solo fuentes suministradas y pedir búsqueda web. Si la respuesta depende de información actual, el alumno debe pedir búsqueda y fuentes. Si la tarea depende de material interno, debe pedir usar solo ese material y marcar huecos.

## Límites y revisión humana

ChatGPT no debe actuar sin límites cuando el resultado puede afectar a personas, dinero, reputación, datos o sistemas. La documentación oficial insiste en boundaries: cosas que no deben cambiar, acciones que no deben ejecutarse, información que debe verificarse o decisiones que deben quedar como borrador. En el curso esto debe convertirse en una práctica recurrente.

Ejemplos de límites:

- No cambiar fechas aprobadas.
- No inventar datos ausentes.
- No enviar emails, solo preparar borradores.
- No usar fuentes externas.
- No modificar código sin mostrar diff.
- No recomendar fuera de presupuesto.
- No usar datos personales innecesarios.

La revisión humana no es un trámite. Es parte del diseño del workflow. El alumno debe aprender a pedir checks finales: "confirma que cada acción tiene responsable y fecha", "marca afirmaciones no verificadas", "señala riesgos", "lista supuestos". Después debe revisar por sí mismo. En la formación, cada entrega generada con IA debería pasar por una checklist mínima.

## Codex como agente técnico

Codex debe enseñarse después de que el alumno entienda prompting, contexto y verificación. Codex trabaja sobre código y repositorios, por lo que tiene un riesgo distinto: puede leer archivos, editar, ejecutar comandos, cambiar dependencias o proponer PRs. La formación debe insistir en que Codex no es un autocompletador grande; es un colaborador técnico que necesita tareas bien delimitadas y revisión.

Según la documentación de Codex CLI, el flujo básico es abrir un proyecto, ejecutar Codex, describir una tarea y dejar que inspeccione archivos, haga cambios y use herramientas locales. El alumno debe aprender comandos y hábitos: `/init` para crear instrucciones tipo `AGENTS.md`, `/status` para ver configuración, `/permissions` para controlar lo permitido, `/model` para elegir modelo y esfuerzo, y `/review` para revisar cambios. No hace falta memorizar comandos al principio; sí hace falta entender el bucle profesional: explorar, planificar, editar, probar, revisar.

La primera tarea buena para Codex no es "mejora este proyecto". Es "explícame la estructura del proyecto y dime dónde cambiarías X sin modificar archivos". Después: "haz un cambio enfocado, ejecuta los tests relevantes y dime qué verificaste". Después: "revisa este diff buscando bugs, riesgos y tests que faltan". Esta progresión reduce el riesgo de que el alumno delegue demasiado pronto.

## Codex CLI, IDE y cloud

Codex CLI se enseña para trabajo local. Es útil cuando el alumno trabaja desde terminal, quiere usar herramientas ya instaladas, necesita ver comandos y diffs, o quiere automatizar con `codex exec` en flujos repetibles. Codex IDE se entiende como trabajo al lado del editor. Codex cloud se enseña para tareas largas, paralelas o delegadas en entornos aislados. La documentación oficial de Codex cloud destaca varios conceptos que deben convertirse en clase: conectar GitHub, crear entornos, configurar dependencias, tools, variables y secretos, iniciar tareas, revisar resumen y diff, y abrir PR cuando el resultado esté listo.

La diferencia pedagógica es importante. En local, el alumno ve el entorno real de su máquina y puede intervenir rápido. En cloud, el alumno aprende reproducibilidad: si una tarea necesita Node, Python, variables, secretos, base de datos o setup, el entorno debe declararlo. Esto conecta directamente con producción. Un agente cloud que no puede reproducir el proyecto no es fiable.

## Skills en ChatGPT y Codex

Skills son una de las piezas más importantes de esta academia. La documentación oficial las define como forma de dar a ChatGPT y Codex capacidades y experiencia específicas para tareas repetibles. Una skill empaqueta instrucciones, recursos y opcionalmente scripts. La estructura habitual es una carpeta con `SKILL.md` y, si hace falta, subcarpetas como `scripts`, `references` o `assets`. El `SKILL.md` incluye metadatos como `name` y `description`, más instrucciones en Markdown.

La idea que debe aprender el alumno es que una skill no es un prompt guardado sin más. Una skill es un procedimiento. Sirve cuando quieres que el agente siga un proceso consistente cada vez que aparece una tarea. Por ejemplo: revisar un PR, preparar un informe semanal, convertir notas en presentación, validar un workflow n8n, revisar migraciones Supabase, depurar CI o crear documentación de producto.

La descripción de una skill es crítica porque permite invocación implícita. ChatGPT o Codex pueden elegir la skill cuando la tarea coincide con su descripción. Si la descripción es vaga, la skill se activará mal o no se activará. Por eso una buena descripción debe decir cuándo usarla, cuándo no usarla y qué resultado produce. También debe evitar abarcar demasiadas cosas.

## Plugins

Un plugin es un paquete instalable que puede incluir skills, conectores o ambas cosas. Los conectores se apoyan en MCP servers u otros mecanismos para conectar con herramientas externas. En la formación, la distinción debe ser clara:

- Usa una skill cuando necesitas instrucciones reutilizables para una tarea enfocada.
- Usa un plugin cuando quieres distribuir capacidades instalables, conectar servicios o compartir workflows con otras personas.
- Usa MCP cuando necesitas conectar el agente con herramientas, datos o sistemas externos de forma estructurada.

Esta distinción ayuda al alumno a no llamar "agente" a todo. Un prompt no es una skill. Una skill no es un tool. Un plugin no es necesariamente un agente. MCP no es una base de datos. Un workflow no es siempre agentico. Aprender estas diferencias es parte del valor de la academia.

## Lección práctica: crear una skill

Una clase completa puede funcionar así:

CHECK: preguntar al alumno qué tarea repite todas las semanas y qué pasos sigue.

DO: convertir esa tarea en una skill instruction-only. La skill debe tener nombre, descripción, objetivo, inputs esperados, pasos, formato de salida y criterios de calidad.

BREAK: dar una descripción demasiado genérica, por ejemplo "ayuda con documentos". El agente no sabrá cuándo usarla.

FIX: reescribirla como "prepara un resumen ejecutivo de una reunión a partir de notas, decisiones y tareas; usar cuando el usuario pida follow-up, acta o resumen de reunión; no usar para informes financieros ni documentación técnica".

EXPLAIN: el alumno debe explicar por qué la descripción activa mejor la skill, qué límites incluye y cómo probaría que funciona.

## Fuentes oficiales

- [ChatGPT Learn](https://learn.chatgpt.com/docs)
- [Prompting](https://learn.chatgpt.com/docs/prompting)
- [Skills & Plugins](https://learn.chatgpt.com/docs/skills-and-plugins)
- [Codex CLI](https://learn.chatgpt.com/docs/codex/cli)
- [Codex cloud](https://learn.chatgpt.com/docs/cloud)
- [Build skills](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI Academy](https://academy.openai.com/)
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

Usar **OpenAI Academy ChatGPT Codex** para producir el entregable definido en la metadata: **manual con fuentes y practica**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **OpenAI Academy ChatGPT Codex**.
