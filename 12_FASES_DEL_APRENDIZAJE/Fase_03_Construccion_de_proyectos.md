---
titulo: "Fase 03 Construccion de proyectos"
tipo: "guia_pedagogica"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "guia_pedagogica", "transversal", "aplicacion"]
entregable: "guia de clase o ruta de aprendizaje"
---
# Fase 03 - Construccion de proyectos

## Objetivo de la fase

La tercera fase convierte ideas y workflows en proyectos. Aqui el alumno deja de preparar solo documentos o procesos y empieza a construir artefactos: repositorios, automatizaciones, skills, scripts, workflows n8n, prototipos con APIs, revisiones con Codex, ejercicios con Claude Code o integraciones con Gemini. Es la fase donde se aprende haciendo.

La palabra proyecto no debe usarse de forma vaga. Un proyecto tiene objetivo, usuario, alcance, entregable, requisitos, pasos, verificacion y criterio de terminado. Si falta eso, todavia es una idea. La fase tres enseña a cruzar esa frontera.

## Tipos de proyecto

El alumno puede elegir varios caminos:

- Proyecto de documento o presentacion.
- Proyecto de asistente de trabajo.
- Proyecto Codex sobre repositorio.
- Proyecto Claude Code con instrucciones, skill o subagent.
- Proyecto Gemini con API, tokens o structured output.
- Proyecto GitHub Skills o Agent Skill.
- Proyecto n8n con workflow.
- Proyecto RAG.

No todos requieren el mismo nivel tecnico. Un documento puede ser Nivel A. Un workflow n8n cloud puede ser Nivel B o C. Un proyecto con Docker puede ser Nivel D. Un agente con tools reales puede ser Nivel E.

## Herramientas clave

Archivos clave:

- [[../04_CLASES_POR_HERRAMIENTA/02_Codex/00_Resumen/README]]
- [[../04_CLASES_POR_HERRAMIENTA/03_Claude_Claude_Code/00_Resumen/README]]
- [[../04_CLASES_POR_HERRAMIENTA/04_Gemini/00_Resumen/README]]
- [[../04_CLASES_POR_HERRAMIENTA/05_GitHub_Skills_Copilot/00_Resumen/README]]
- [[../04_CLASES_POR_HERRAMIENTA/06_n8n_Automation_AI/00_Resumen/README]]
- [[../06_PROYECTOS_PARA_PORTFOLIO/README]]
- [[../08_PLANTILLAS_REUTILIZABLES/Plantilla_proyecto]]

## Estructura de un proyecto

Todo proyecto debe escribirse con esta estructura:

- Problema.
- Usuario.
- Resultado esperado.
- Sistema operativo.
- Nivel tecnico.
- Herramientas.
- Cuentas necesarias.
- API keys o secretos.
- Pasos.
- Verificacion.
- Error provocado.
- Reparacion.
- Evaluacion.
- Entregable final.

Esta estructura hace que el proyecto sea transferible. No depende de que el profesor este al lado.

## Resultado de la fase

La fase termina con un proyecto funcional, aunque pequeño, documentado y verificable. Este proyecto se convierte en base para automatizacion o produccion.

## Criterios para pasar a la fase 04

El alumno puede pasar a automatizacion y agentes cuando ya ha construido al menos un proyecto minimo y sabe explicar como funciona. Debe saber que herramienta uso, que entrada recibe, que salida produce, como se verifica y que errores aparecieron. Si no puede explicar su propio proyecto, no esta listo para convertirlo en sistema.

Tambien debe haber aprendido a no construir de golpe. Primero version minima, despues mejoras. Esta disciplina sera esencial en fase 04, porque los agentes multiplican complejidad.

## Como impartir esta fase

La fase tres se imparte mejor como taller de construccion. Cada alumno trabaja en su proyecto y recibe revisiones cortas. El profesor no debe resolverlo todo. Debe hacer preguntas que obliguen a documentar: que estas construyendo, como lo pruebas, que falla, que version minima puedes terminar hoy.

Conviene separar rutas. Quien trabaja con documentos puede construir una plantilla avanzada. Quien trabaja con codigo puede usar Codex. Quien trabaja con automatizacion puede usar n8n. Quien trabaja con educacion puede construir una GitHub Skill o una skill de agente.

## Errores frecuentes

El error mas habitual es sobredimensionar. Otro es construir sin criterio de terminado. Otro es no guardar evidencias: sin capturas, logs, diffs, exports o notas, el proyecto se vuelve dificil de defender. Tambien aparece la tentacion de saltar a produccion sin haber probado casos rotos.

## Señal de construccion real

Hay un artefacto. Puede abrirse, leerse, ejecutarse o revisarse. No es solo una idea en conversacion. Tiene documentacion y alguien mas podria entenderlo.

## Actividades recomendadas

Una actividad fuerte es la "demo de cinco minutos". El alumno debe enseñar su proyecto en cinco minutos, explicar que hace y mostrar una evidencia: archivo, workflow, diff, export, script, output o documento. Despues otra persona debe hacer una pregunta incomoda: que pasa si falla, que falta, que no esta probado o que dependencia externa existe. Esta dinamica convierte construccion en criterio.

Otra actividad es la "version cero". El alumno define que parte minima puede terminar hoy. No la version ideal, sino la primera version verificable. Esta practica entrena foco.

## Clasificacion por ordenador y sistema operativo

Antes de convertir esta nota en una practica, laboratorio, documento o proyecto para otra persona, clasificala segun el ordenador del alumno y el nivel tecnico de ejecucion. Usa estas guias:

- [[../10_GUIAS_WINDOWS_MAC_LINUX/Windows]] para alumnos que trabajen con PowerShell, rutas `C:\...`, OneDrive, Git for Windows, Node.js, Python o Docker Desktop.
- [[../10_GUIAS_WINDOWS_MAC_LINUX/macOS]] para alumnos que trabajen con Terminal/zsh, rutas `/Users/...`, Homebrew, permisos de macOS o Apple Silicon.
- [[../10_GUIAS_WINDOWS_MAC_LINUX/Linux]] para alumnos que trabajen con Bash, rutas `/home/...`, gestores `apt`, `dnf` o `pacman`, permisos, servicios y Docker Engine.
- [[../10_GUIAS_WINDOWS_MAC_LINUX/Compatibilidad_de_proyectos]] para clasificar la practica como Nivel A, B, C, D o E.
- [[../10_GUIAS_WINDOWS_MAC_LINUX/Checklist_entrega_multisistema]] para comprobar que cualquier persona pueda seguirla sin depender de explicaciones orales.

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

Usar **Fase 03 Construccion de proyectos** para producir el entregable definido en la metadata: **guia de clase o ruta de aprendizaje**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Fase 03 Construccion de proyectos**.
