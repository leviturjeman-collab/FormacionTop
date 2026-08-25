---
titulo: "PROYECTOS REALES Y SKILLS"
tipo: "nota"
nivel: "transversal"
fase: "construccion_portfolio"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://skills.github.com/", "https://docs.github.com/"]
tags: ["ai-academy", "nota", "transversal", "construccion_portfolio"]
entregable: "artefacto asociado a PROYECTOS REALES Y SKILLS"
---
# Proyectos reales y skills oficiales

## Objetivo

Esta carpeta reorganiza la boveda alrededor de proyectos, skills y patrones reales documentados por fuentes oficiales. Hasta ahora la academia estaba ordenada por modulos, fases, laboratorios y sistema operativo. Esa estructura sigue siendo valida, pero faltaba una capa muy importante: ejemplos reales de lo que ya se esta usando o recomendando en ecosistemas oficiales de OpenAI, Anthropic y Gemini.

La palabra "real" aqui no significa que todos los ejemplos sean casos de una empresa publica concreta. Significa que no son ocurrencias inventadas para rellenar el curso. Son patrones publicados en documentacion oficial, guias de producto, repositorios oficiales, cookbooks, use cases o docs de plataforma. Esa diferencia importa. Si un alumno aprende a crear un "meeting follow-up skill", un "PR reviewer", un "document processing skill", un "Deep Research workflow", un "structured output extractor" o una automatizacion con MCP, no esta copiando humo: esta trabajando sobre patrones que las plataformas ya consideran utiles.

## Como queda reorganizada esta capa

La carpeta se divide asi:

- [[01_OpenAI/Proyectos_y_skills_OpenAI_Codex_ChatGPT]]
- [[02_Anthropic/Skills_reales_Claude_Claude_Code]]
- [[03_Gemini/Proyectos_reales_Gemini_API]]
- [[04_Matrices/Matriz_de_proyectos_por_fase]]
- [[04_Matrices/Catalogo_de_skills_eficientes]]
- [[04_Matrices/Como_convertir_un_ejemplo_oficial_en_laboratorio]]

Cada archivo tiene una funcion distinta. Los archivos por proveedor explican fuentes y proyectos. Las matrices convierten esos ejemplos en ruta educativa. El catalogo de skills sirve para decidir que skills construir primero. El archivo de conversion ayuda a transformar una idea oficial en clase practica con ``.

## Principio de reorganizacion

La academia debe dejar de decir solamente "aprende ChatGPT", "aprende Claude" o "aprende Gemini". La pregunta correcta es: que puedes construir con eso. Esta carpeta responde:

- OpenAI sirve para workflows repetibles, skills, plugins, Codex, QA, front-end, seguridad, reporting, docs y apps.
- Anthropic sirve para skills de documentos, Claude Code workflows, subagents, hooks, MCP, tool use y automatizacion de tareas tecnicas.
- Gemini sirve para Interactions API, function calling, structured outputs, grounding, URL context, code execution, Deep Research, File Search y apps multimodales.

## Uso dentro de las fases

Esta carpeta atraviesa las fases:

- Fase 01: leer ejemplos para entender posibilidades.
- Fase 02: elegir un patron que aplique al trabajo real.
- Fase 03: construir una primera version.
- Fase 04: convertirlo en skill, workflow, tool, MCP o agente.
- Fase 05: documentarlo, evaluarlo y defenderlo.

## Criterio de seleccion de proyectos

Un proyecto entra en la academia si cumple al menos tres criterios:

- Esta basado en fuente oficial o repo oficial.
- Resuelve una tarea repetible.
- Produce un entregable visible.
- Permite provocar errores utiles.
- Puede evaluarse.
- Se puede adaptar a Windows, macOS y Linux.
- Puede convertirse en portfolio.

## Proyectos oficiales que deberian entrar en el curso

Lista inicial de proyectos candidatos:

- Skill de meeting follow-up.
- Skill de weekly update.
- Skill de campaign brief.
- Skill de document review.
- Skill de presentation generation.
- Skill de PR review.
- Skill de release notes.
- Codex para Figma to code.
- Codex para security scan.
- Codex para browser game.
- Codex para docs maintenance.
- Claude docx, pptx, xlsx y pdf skills.
- Claude Code `/debug`, `/code-review`, `/run`, `/verify`.
- Claude MCP para Jira, Sentry, Statsig, PostgreSQL, Figma, Slack o Gmail.
- Gemini structured output extractor.
- Gemini function calling bridge.
- Gemini grounding with Google Search.
- Gemini URL context comparator.
- Gemini code execution analyst.
- Gemini Deep Research competitive landscape report.
- Gemini File Search RAG app.

## Fuentes oficiales principales

- [OpenAI Skills & Plugins](https://learn.chatgpt.com/docs/skills-and-plugins)
- [OpenAI Build skills](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI Codex use cases](https://learn.chatgpt.com/use-cases)
- [OpenAI reusable Codex skills](https://learn.chatgpt.com/use-cases/reusable-codex-skills)
- [OpenAI open source components](https://learn.chatgpt.com/docs/open-source)
- [Anthropic Claude Code skills](https://code.claude.com/docs/en/skills)
- [Anthropic Agent Skills API quickstart](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/quickstart)
- [Anthropic public skills repository](https://github.com/anthropics/skills)
- [Claude Code common workflows](https://code.claude.com/docs/en/common-workflows)
- [Claude Code MCP](https://code.claude.com/docs/en/mcp)
- [Gemini Interactions API](https://ai.google.dev/gemini-api/docs/interactions-overview)
- [Gemini function calling](https://ai.google.dev/gemini-api/docs/function-calling)
- [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)
- [Gemini grounding with Google Search](https://ai.google.dev/gemini-api/docs/google-search)
- [Gemini Deep Research](https://ai.google.dev/gemini-api/docs/deep-research)
- [Gemini API Cookbook](https://github.com/google-gemini/cookbook)

## Clasificacion por ordenador y sistema operativo

Antes de convertir esta nota en una practica, laboratorio, documento o proyecto para otra persona, clasificala segun el ordenador del alumno y el nivel tecnico de ejecucion. Usa estas guias:

- [[../10_GUIAS_WINDOWS_MAC_LINUX/Windows]] para alumnos que trabajen con PowerShell, rutas `C:\...`, OneDrive, Git for Windows, Node.js, Python o Docker Desktop.
- [[../10_GUIAS_WINDOWS_MAC_LINUX/macOS]] para alumnos que trabajen con Terminal/zsh, rutas `/Users/...`, Homebrew, permisos de macOS o Apple Silicon.
- [[../10_GUIAS_WINDOWS_MAC_LINUX/Linux]] para alumnos que trabajen con Bash, rutas `/home/...`, gestores `apt`, `dnf` o `pacman`, permisos, servicios y Docker Engine.
- [[../10_GUIAS_WINDOWS_MAC_LINUX/Compatibilidad_de_proyectos]] para clasificar la practica como Nivel A, B, C, D o E.
- [[../10_GUIAS_WINDOWS_MAC_LINUX/Checklist_entrega_multisistema]] para comprobar que cualquier persona pueda seguirla sin depender de explicaciones orales.

## Como usar esta carpeta para reorganizar la academia

La reorganizacion practica consiste en cambiar el punto de partida de cada clase. En lugar de abrir un modulo y preguntar "que explico hoy", se abre esta carpeta y se pregunta "que patron real va a construir hoy el alumno". Esto cambia el tono de la formacion. Una clase sobre prompting puede apoyarse en meeting follow-up. Una clase sobre structured outputs puede apoyarse en extractor de requisitos. Una clase sobre MCP puede apoyarse en el ejemplo de Claude Code con issue tracker, monitoring, base de datos, Figma, Slack o Gmail. Una clase sobre produccion puede apoyarse en security scan, verified operations o deployment checker.

La carpeta tambien permite ordenar las skills que merece la pena crear primero. No todas las skills tienen el mismo retorno. Una skill de follow-up, weekly update o document review puede ayudar a casi cualquier alumno desde la semana uno. Una skill de MCP builder o deployment checker requiere mas madurez tecnica. Por eso el catalogo separa skills de trabajo, documentos, codigo y agentes.

## Decision didactica

Cada proyecto oficial debe pasar por tres filtros antes de entrar en clase. Primero, debe resolver una tarea que el alumno pueda reconocer. Segundo, debe producir algo que pueda revisarse. Tercero, debe permitir un error provocado. Si no se puede romper, no entrena diagnostico. Por ejemplo, un structured output extractor puede romperse con una salida fuera de schema. Un PR reviewer puede romperse ignorando un bug real. Un Deep Research report puede romperse con fuentes no confiables o prompt injection en documentos.

## Resultado esperado

Al usar esta carpeta, la academia queda menos teorica y mas orientada a portfolio. El alumno no termina diciendo "he aprendido Gemini", sino "he construido un extractor con structured outputs, un workflow grounded con Search, una skill de follow-up y un reviewer de PRs". Esa diferencia es la que convierte aprendizaje en evidencia.
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

Usar **PROYECTOS REALES Y SKILLS** para producir el entregable definido en la metadata: **artefacto asociado a PROYECTOS REALES Y SKILLS**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **PROYECTOS REALES Y SKILLS**.
