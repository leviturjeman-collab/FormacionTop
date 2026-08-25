---
titulo: "Skills reales Claude Claude Code"
tipo: "nota"
nivel: "transversal"
fase: "construccion_portfolio"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://docs.anthropic.com/", "https://code.claude.com/docs/", "https://skills.github.com/", "https://docs.github.com/"]
tags: ["ai-academy", "nota", "transversal", "construccion_portfolio"]
entregable: "artefacto asociado a Skills reales Claude Claude Code"
---
# Skills reales y workflows oficiales de Anthropic y Claude Code

## Objetivo

Este documento recoge skills, workflows y patrones reales documentados por Anthropic. Anthropic tiene una ventaja pedagogica clara para esta academia: su ecosistema separa muy bien skills, tool use, Claude Code, hooks, subagents, MCP y permisos. Tambien mantiene un repositorio publico de Agent Skills con ejemplos, y su API ofrece skills preconstruidas para documentos.

La fuente mas concreta es la documentacion de Agent Skills API, donde Anthropic enumera skills preconstruidas para PowerPoint, Excel, Word y PDF. Tambien esta el repositorio `anthropics/skills`, que explica que las skills son carpetas de instrucciones, scripts y recursos que Claude carga dinamicamente para mejorar rendimiento en tareas especializadas. Ademas, Claude Code incluye bundled skills y workflows como `/debug`, `/code-review`, `/run`, `/verify`, exploracion de codebases, testing, PRs, documentacion, worktrees, subagents y scripts.

## Skills reales de documentos

### PowerPoint / pptx

Uso: crear y editar presentaciones. En la academia encaja con convertir notas de Obsidian en decks. Es eficiente porque transforma conocimiento en material comunicable. Practica recomendada: tomar una fase de la formacion y convertirla en una presentacion de 8 slides. Error provocado: slides sin narrativa o demasiado texto. Evaluacion: claridad, estructura, audiencia y notas del presentador.

### Excel / xlsx

Uso: crear y analizar hojas de calculo. Encaja con medicion de tokens, costes, evaluaciones, progreso de alumnos, rubricas y dashboards. Practica recomendada: crear una hoja de seguimiento de proyectos con estado, fase, nivel tecnico, riesgos y coste estimado. Error provocado: columnas sin definicion o formulas incorrectas.

### Word / docx

Uso: crear y editar documentos profesionales. Encaja con informes, guias, propuestas comerciales, manuales, contratos pedagogicos o dosieres de proyecto. Practica recomendada: convertir una nota de Obsidian en un documento formal con portada, secciones, resumen ejecutivo y anexos.

### PDF

Uso: generar o procesar PDFs. Encaja con entregables finales, fichas de laboratorio, certificados internos, formularios y materiales cerrados. Practica recomendada: crear una ficha PDF de un laboratorio con objetivo, pasos, errores y rubrica.

## Claude Code bundled skills y workflows

Claude Code documenta bundled skills como `/doctor`, `/code-review`, `/batch`, `/debug`, `/loop`, `/claude-api`, y tambien skills orientadas a ejecutar/verificar apps como `/run`, `/verify` y `/run-skill-generator`. Esto debe entrar en la formacion tecnica porque representa skills ya usadas para trabajo real: diagnosticar, revisar codigo, ejecutar apps, verificar cambios y enseñar al agente como lanzar un proyecto.

### `/debug`

Uso educativo: diagnosticar un fallo con evidencias. Encaja con laboratorios de errores comunes. Debe pedir sintoma, reproduccion, logs, cambios recientes y causa raiz.

### `/code-review`

Uso educativo: revisar cambios buscando bugs, riesgos y tests. Encaja con proyectos Codex/GitHub. Evaluacion: findings con severidad y evidencia.

### `/run` y `/verify`

Uso educativo: lanzar app y confirmar cambios contra una app real, no solo tests. Encaja con proyectos front-end, dashboards, apps y QA.

## Claude Code common workflows

Anthropic documenta workflows para explorar codebases, encontrar codigo relevante, arreglar bugs, refactorizar, trabajar con tests, crear PRs, manejar documentacion, usar imagenes, planificar antes de editar, delegar investigacion a subagents y usar scripts/CI. Estos workflows deben convertirse en laboratorios tecnicos.

Proyecto recomendado: "Claude Code onboarding a codebase". El alumno entra en un repo desconocido y debe pedir overview, localizar piezas relevantes, proponer plan y no editar hasta entender. Error provocado: pedir cambios antes de explorar. Fix: plan before editing.

## MCP y casos reales

La documentacion de Claude Code MCP da ejemplos muy concretos:

- Implementar features desde issue trackers.
- Analizar Sentry y Statsig.
- Consultar PostgreSQL.
- Integrar diseños de Figma compartidos en Slack.
- Crear borradores de Gmail.
- Reaccionar a eventos externos como Telegram, Discord o webhooks.

Estos ejemplos son oro para fase 04. Cada uno enseña que MCP conecta herramientas externas, pero tambien introduce prompt injection, permisos y confianza.

## Proyectos prioritarios Anthropic

1. Document skills pipeline: Obsidian -> docx -> pptx -> pdf.
2. Claude Code codebase onboarding.
3. Debug skill con reproduccion y logs.
4. Code-review skill con severidad.
5. MCP issue-to-PR workflow.
6. MCP monitoring analysis con Sentry/Statsig.
7. Subagent research workflow para no contaminar contexto principal.
8. Hook de verificacion antes de cambios sensibles.

## Fuentes oficiales

- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [Anthropic Agent Skills API quickstart](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart)
- [Anthropic skills repository](https://github.com/anthropics/skills)
- [Claude Code common workflows](https://code.claude.com/docs/en/common-workflows)
- [Claude tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
- [Claude Code MCP](https://code.claude.com/docs/en/mcp)
- [Claude Code overview](https://code.claude.com/docs/en/overview)

## Clasificacion por ordenador y sistema operativo

Antes de convertir esta nota en una practica, laboratorio, documento o proyecto para otra persona, clasificala segun el ordenador del alumno y el nivel tecnico de ejecucion. Usa estas guias:

- [[../../10_GUIAS_WINDOWS_MAC_LINUX/Windows]]
- [[../../10_GUIAS_WINDOWS_MAC_LINUX/macOS]]
- [[../../10_GUIAS_WINDOWS_MAC_LINUX/Linux]]
- [[../../10_GUIAS_WINDOWS_MAC_LINUX/Compatibilidad_de_proyectos]]
- [[../../10_GUIAS_WINDOWS_MAC_LINUX/Checklist_entrega_multisistema]]

## Reorganizacion recomendada del modulo Anthropic

El modulo Anthropic debe separarse en cuatro carriles: documentos, codigo, extensibilidad y sistemas conectados. Documentos incluye docx, pptx, xlsx y pdf. Codigo incluye Claude Code common workflows: entender codebases, debug, refactor, tests, PRs y docs. Extensibilidad incluye skills, hooks y subagents. Sistemas conectados incluye MCP, tool use y permisos.

Esta separacion ayuda mucho al alumno. Si una persona quiere producir documentos, empieza por Agent Skills de documentos. Si quiere programar, entra en Claude Code workflows. Si quiere crear procedimientos reutilizables, entra en skills. Si quiere conectar herramientas externas, entra en MCP. Mezclar todo desde el principio crea ruido.

## Laboratorios nuevos que deben crearse

Laboratorio 1: `obsidian-to-docx-pptx-pdf`. Toma una nota de la boveda y la convierte en documento, presentacion y PDF. Error: formato inconsistente o falta de audiencia.

Laboratorio 2: `claude-code-debugger`. Parte de un bug reproducible. Claude debe pedir evidencia, localizar causa y proponer fix. Error: arreglar sin reproducir.

Laboratorio 3: `subagent-researcher`. Un subagent investiga documentacion mientras el contexto principal recibe solo resumen. Error: meter toda la investigacion en el contexto principal.

Laboratorio 4: `mcp-issue-to-pr-architecture`. No necesita conectar Jira real al inicio. Primero se diseña arquitectura: issue, repo, PR, permisos, logs y aprobacion.

## Criterio de exito

El alumno domina Anthropic cuando puede elegir entre `CLAUDE.md`, skill, hook, subagent y MCP sin confundirlos. Tambien debe entender que los document skills no son "extras": son una via directa para producir materiales profesionales desde la boveda.
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

Usar **Skills reales Claude Claude Code** para producir el entregable definido en la metadata: **artefacto asociado a Skills reales Claude Claude Code**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

### Prerequisitos y materiales

- Haber leido el documento maestro y el mapa de carpetas.
- Tener claro el nivel del alumno antes de usar este archivo.
- Si se trabaja con herramientas externas, revisar credenciales, permisos, coste y datos sensibles.
- Si se convierte en clase, preparar una practica pequena y un error provocado.

### Fuentes y verificacion

| Tipo | Fuente | Fecha/uso | Criterio |
|---|---|---|---|
| Fuente oficial | https://docs.anthropic.com/ | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |
| Fuente oficial | https://code.claude.com/docs/ | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |
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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Skills reales Claude Claude Code**.
