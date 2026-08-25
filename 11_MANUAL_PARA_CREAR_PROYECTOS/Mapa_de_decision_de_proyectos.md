---
titulo: "Mapa de decision de proyectos"
tipo: "manual_aplicacion_negocio"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "manual_aplicacion_negocio", "transversal", "aplicacion"]
entregable: "plan de aplicacion profesional"
---
# Mapa de decision de proyectos

## Pregunta 1 - Que quieres producir

Si quieres producir conocimiento, usa documentos, presentaciones y Obsidian.

Si quieres producir una automatizacion, usa ChatGPT workflows o n8n.

Si quieres producir software o cambios tecnicos, usa Codex o Claude Code.

Si quieres producir capacidades reutilizables para agentes, usa skills.

Si quieres conectar herramientas externas, estudia tools y MCP.

Si quieres tocar datos reales, entra en produccion, seguridad y evals.

## Pregunta 2 - Que nivel tecnico requiere

- Solo leer y escribir: Nivel A.
- Usar web y cuentas: Nivel B.
- Terminal y codigo: Nivel C.
- Docker o servicios: Nivel D.
- Usuarios reales o sistemas vivos: Nivel E.

## Pregunta 3 - Que sistema operativo usa el alumno

- Windows: PowerShell, rutas `C:\...`, cuidado con OneDrive.
- macOS: Terminal/zsh, rutas `/Users/...`, Homebrew.
- Linux: Bash, rutas `/home/...`, gestor segun distribucion.

## Pregunta 4 - Que riesgos existen

- Datos sensibles.
- Credenciales.
- Acciones irreversibles.
- Coste por tokens.
- Rate limits.
- Dependencia de fuentes actuales.
- Permisos excesivos.
- Falta de evaluacion.

## Pregunta 5 - Como se prueba

Un proyecto se prueba con:

- Caso feliz.
- Caso roto.
- Caso limite.
- Logs.
- Explicacion del alumno.
- Rubrica.

## Mapa rapido de herramientas

| Necesidad | Herramienta probable | Nivel |
|---|---|---|
| Escribir o sintetizar | ChatGPT, Claude, Obsidian | A/B |
| Crear documento o presentacion | Obsidian, plantillas, ChatGPT | A/B |
| Cambiar codigo | Codex, Claude Code, Git | C |
| Crear skill | Codex skills, GitHub Agent Skills, Claude Code skills | C |
| Automatizar apps | n8n cloud | B/C |
| Automatizar con servicios locales | n8n self-hosted, Docker | D |
| Conectar herramientas externas | MCP, APIs, tools | C/D/E |
| Consultar conocimiento | RAG, vector store, docs | C/D |
| Tocar datos reales | Produccion, permisos, HITL, evals | E |

## Como decidir si esta listo

Un proyecto esta listo para otra persona cuando:

- Sabe que sistema operativo usa.
- Tiene requisitos escritos.
- Tiene pasos de instalacion.
- Tiene practica minima.
- Tiene error provocado.
- Tiene reparacion.
- Tiene fuentes.
- Tiene evaluacion.
- Tiene criterio de terminado.

Si falta alguno, vuelve a [[../10_GUIAS_WINDOWS_MAC_LINUX/Checklist_entrega_multisistema]].

## Uso rapido

Este mapa debe usarse antes de invertir tiempo en construir. Si la decision inicial es mala, todo el proyecto se complica. Por ejemplo, si una tarea solo necesita una plantilla en Obsidian, no hace falta montar Docker. Si una accion modifica datos reales, no puede quedarse en Nivel B. Si una tool puede enviar mensajes, necesita aprobacion humana. Decidir bien al principio ahorra errores despues.

La pregunta final siempre es: que necesita saber una persona para hacerlo sin que yo este al lado. Si la respuesta no esta escrita, falta documentacion.

## Errores de decision frecuentes

El primer error es elegir una herramienta demasiado compleja. Si una necesidad se resuelve con una plantilla, no hace falta un agente. Si se resuelve con un workflow determinista, no hace falta que un LLM decida. Si se resuelve con n8n cloud, no hace falta self-hosting. La complejidad debe ganarse.

El segundo error es ignorar permisos. Una herramienta que solo lee tiene un riesgo; una herramienta que escribe, envia, borra o publica tiene otro. El tercer error es no medir coste. Un agente que funciona pero consume tokens sin limite no esta listo. El cuarto error es no crear evaluaciones. Sin evals, no sabemos si una mejora rompio comportamiento anterior.

Este mapa existe para frenar esos errores antes de que aparezcan.

## Decision final

Despues de responder todas las preguntas, el alumno debe escribir una frase de decision:

```text
Este proyecto se hara como Nivel __, usando __, en sistema operativo __, porque __. Sus riesgos principales son __ y se verificara con __.
```

Esa frase parece simple, pero obliga a ordenar pensamiento. Si el alumno no puede completarla, todavia no entiende el proyecto. Si puede completarla, ya tiene una base para plan, presentacion, defensa y ejecucion.

El mapa no sustituye el trabajo. Lo encuadra. Esa es su funcion dentro de la boveda.

## Revision por pares

Antes de ejecutar un proyecto grande, otra persona deberia leer la decision final y comprobar si tiene sentido. Si el proyecto se clasifica como Nivel B pero requiere Docker, esta mal clasificado. Si se clasifica como Nivel C pero envia emails reales, probablemente es Nivel E. Si no menciona sistema operativo, faltan instrucciones.

Esta revision temprana evita redisenar tarde. Tambien ayuda a que los alumnos aprendan a presentar proyectos con precision: no solo dicen que quieren hacer, sino con que herramientas, en que entorno, con que riesgos y con que verificacion.

El resultado de usar este mapa debe ser una decision clara y defendible.

Tambien debe quedar guardada en Obsidian para que pueda revisarse, mejorarse y reutilizarse.

El valor de este mapa aumenta cuando se usa de forma repetida. Cada nuevo proyecto deja ejemplos, dudas y decisiones que mejoran la siguiente version. Con el tiempo, el alumno aprende a reconocer patrones: cuando basta una plantilla, cuando conviene automatizar, cuando hace falta un agente y cuando hay que frenar por seguridad.
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

Usar **Mapa de decision de proyectos** para producir el entregable definido en la metadata: **plan de aplicacion profesional**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Mapa de decision de proyectos**.
