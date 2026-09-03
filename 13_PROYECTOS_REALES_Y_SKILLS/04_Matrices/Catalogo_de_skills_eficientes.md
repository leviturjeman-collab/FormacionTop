---
titulo: "Catalogo de skills eficientes"
tipo: "nota"
nivel: "transversal"
fase: "construccion_portfolio"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://skills.github.com/", "https://docs.github.com/"]
tags: ["ai-academy", "nota", "transversal", "construccion_portfolio"]
entregable: "artefacto asociado a Catalogo de skills eficientes"
---
# Catalogo de skills eficientes

## Objetivo

Este catalogo enumera skills que merecen entrar en la academia porque aparecen en fuentes oficiales, se usan para trabajo repetible o representan patrones muy eficientes. Una skill eficiente no es la mas compleja. Es la que encapsula un procedimiento frecuente, reduce variabilidad, mejora calidad y puede evaluarse.

## Skills de conocimiento y trabajo

### Meeting follow-up

Origen: OpenAI Build plugins/skills examples. Uso: convertir notas en decisiones, owners y proximos pasos. Fase: 02. Por que es eficiente: casi cualquier perfil la usa. Proyecto asociado: asistente de trabajo.

### Weekly update

Origen: OpenAI Skills & Plugins. Uso: transformar progreso y bloqueos en update. Fase: 02. Por que es eficiente: estandariza comunicacion recurrente.

### Daily brief

Origen: OpenAI Skills & Plugins. Uso: preparar resumen diario desde fuentes conectadas. Fase: 02/04. Riesgo: necesita fuentes y permisos.

### Campaign brief

Origen: OpenAI Build skills. Uso: crear brief accionable de marketing o contenido. Fase: 02. Eficiencia: transforma ideas vagas en plan.

### Documentation review

Origen: OpenAI Skills & Plugins. Uso: revisar docs y detectar huecos. Fase: 03/05. Eficiencia: mejora transferibilidad.

## Skills tecnicas

### PR reviewer

Origen: OpenAI reusable Codex skills, Claude Code code review, GitHub agent skills pattern. Uso: revisar diffs buscando bugs, riesgos, tests y seguridad. Fase: 03/05.

### Debugger

Origen: Claude Code `/debug` y workflows de debugging. Uso: pedir reproduccion, logs, causa y fix. Fase: 03/04.

### Release notes writer

Origen: OpenAI reusable Codex skills menciona release notes desde PRs. Uso: convertir PRs mergeadas en changelog. Fase: 03.

### CI repair

Origen: OpenAI Build skills referencia GitHub CI repair. Uso: diagnosticar checks fallidos. Fase: 03/05.

### Deployment checker

Origen: OpenAI run verified operations y Claude `/verify`. Uso: comprobar build, variables, logs, rollback. Fase: 05.

## Skills de documentos

### pptx

Origen: Anthropic Agent Skills API y `anthropics/skills`. Uso: crear y editar presentaciones. Fase: 02/05.

### xlsx

Origen: Anthropic Agent Skills API y `anthropics/skills`. Uso: crear y analizar hojas de calculo. Fase: 03/05.

### docx

Origen: Anthropic Agent Skills API y `anthropics/skills`. Uso: crear documentos profesionales. Fase: 02/05.

### pdf

Origen: Anthropic Agent Skills API y `anthropics/skills`. Uso: generar o procesar PDFs. Fase: 05.

## Skills agenticas

### MCP builder

Origen: Anthropic skills repo examples y Claude Code MCP. Uso: diseñar conectores MCP. Fase: 04/05.

### Subagent researcher

Origen: Claude Code common workflows y features overview. Uso: delegar investigacion sin llenar contexto principal. Fase: 04.

### Gemini Deep Research analyst

Origen: Gemini Deep Research docs. Uso: informes largos con busqueda, lectura, iteracion y fuentes. Fase: 04/05.

### Structured output extractor

Origen: Gemini structured output. Uso: convertir texto libre en JSON validable. Fase: 03/04.

### Function calling bridge

Origen: Gemini function calling y Claude tool use. Uso: conectar lenguaje natural con herramientas. Fase: 04.

## Criterio para elegir las primeras skills del curso

Orden recomendado:

1. Meeting follow-up.
2. Weekly update.
3. Documentation review.
4. Presentation generation.
5. PR reviewer.
6. Debugger.
7. Release notes.
8. Structured output extractor.
9. Function calling bridge.
10. Deployment checker.

Estas 10 cubren trabajo no tecnico, documentacion, codigo, automatizacion y produccion.

## Fuentes

- [OpenAI Skills & Plugins](https://learn.chatgpt.com/docs/skills-and-plugins)
- [OpenAI Build skills](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI reusable Codex skills](https://learn.chatgpt.com/use-cases/reusable-codex-skills)
- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [Anthropic Agent Skills API](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart)
- [Anthropic skills repository](https://github.com/anthropics/skills)
- [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)
- [Gemini function calling](https://ai.google.dev/gemini-api/docs/function-calling)
- [Gemini Deep Research](https://ai.google.dev/gemini-api/docs/deep-research)

## Como priorizar skills en la practica

Una skill debe crearse cuando el alumno ya repitio el proceso al menos una vez manualmente. Si nunca hizo un buen follow-up, no sabe que debe contener la skill. Si nunca reviso un PR, no sabra escribir criterios. Si nunca genero una presentacion clara, no podra crear una presentation skill fiable.

El orden correcto es: hacer una vez, documentar, convertir en plantilla, convertir en skill, probar, romper, corregir y compartir. Saltarse pasos produce skills fragiles. Una skill eficiente no nace por inspiracion; nace de capturar una buena forma de trabajar.

## Evaluacion de una skill

Cada skill del catalogo debe evaluarse con tres casos:

- Caso feliz: entrada clara y resultado esperado.
- Caso ambiguo: falta informacion y la skill debe pedir aclaracion o marcar huecos.
- Caso roto: fuente contradictoria, formato imposible, permisos insuficientes o datos sensibles.

Una skill esta lista cuando produce resultados consistentes, sabe decir que falta y no actua fuera de sus limites.

## Portfolio de skills

El alumno avanzado deberia terminar con un mini portfolio de cinco skills: una de comunicacion, una de documentos, una tecnica, una de automatizacion y una de produccion. Ese portfolio demuestra que sabe convertir conocimiento en procedimientos reutilizables.

## Como documentar cada skill

Cada skill del catalogo debe tener su ficha propia cuando se convierta en material final. La ficha debe incluir: nombre, fuente oficial, fase, problema que resuelve, inputs esperados, output esperado, pasos, limites, errores frecuentes, criterio de activacion, cuando no usarla y evaluacion.

La parte "cuando no usarla" es especialmente importante. Muchas skills malas se activan demasiado porque su descripcion es amplia. Una skill eficiente tiene fronteras. Por ejemplo, `meeting-follow-up` no debe escribir estrategia de negocio completa. `pr-reviewer` no debe hacer refactors sin permiso. `deployment-checker` no debe desplegar si solo debe revisar.

## Señal de una buena skill

Una buena skill reduce explicaciones repetidas. Si el profesor o el alumno siguen pegando el mismo proceso en cada chat, hay una skill esperando ser creada. Si el resultado cambia demasiado entre ejecuciones, falta plantilla o criterio. Si la skill se activa cuando no toca, falta descripcion. Si no se activa cuando deberia, falta descripcion o ejemplos.

El catalogo debe crecer con skills probadas, no con ideas sin validar.

## Decision final de catalogo

Una skill entra en el catalogo principal solo cuando ha demostrado utilidad en al menos un caso realista. Esto puede ser una reunion real anonimizada, un documento real de la academia, un PR de practica, un workflow n8n exportado o una investigacion con fuentes. La academia debe evitar coleccionar skills por entusiasmo. Muchas skills pequeñas, claras y probadas valen mas que una skill gigante que promete hacerlo todo.

La seleccion final de skills debe equilibrar impacto y aprendizaje. Las primeras skills deben dar victorias rapidas. Las avanzadas deben enseñar arquitectura, permisos y evaluacion. Asi el catalogo se convierte en ruta, no en lista.
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

Usar **Catalogo de skills eficientes** para producir el entregable definido en la metadata: **artefacto asociado a Catalogo de skills eficientes**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

### Prerequisitos y materiales

- Haber leido el documento maestro y el mapa de carpetas.
- Tener claro el nivel del alumno antes de usar este archivo.
- Si se trabaja con herramientas externas, revisar credenciales, permisos, coste y datos sensibles.
- Si se convierte en clase, preparar una practica pequena y un error provocado.

### Fuentes y verificacion

| Tipo | Fuente | Fecha/uso | Criterio |
|---|---|---|---|
| Fuente oficial | https://skills.github.com/ | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |
| Fuente oficial | https://docs.github.com/ | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |

### Notas para profesor o facilitador

- Empezar con un problema real antes de explicar teoria.
- Pedir al alumno una salida concreta: documento, prompt, workflow, checklist, demo o defensa.
- Comprobar que el alumno puede explicar que entra, que pasa, que sale, que puede fallar y como lo verificaria.
- No avanzar a herramientas avanzadas si no hay dominio de entradas, salidas, permisos y evaluacion.

### Criterio para eliminar contenido innecesario

Eliminar o reescribir cualquier parrafo que no cumpla una de estas funciones: explicar una decision, enseñar un concepto, guiar una practica, prevenir un error, respaldar una fuente, preparar un entregable o mejorar la evaluacion.

### Proxima revision

- Revisar este archivo cuando cambien las fuentes oficiales relacionadas o antes de usarlo como material comercial.
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Catalogo de skills eficientes**.
