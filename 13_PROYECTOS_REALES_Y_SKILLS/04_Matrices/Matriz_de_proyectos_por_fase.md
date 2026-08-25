---
titulo: "Matriz de proyectos por fase"
tipo: "nota"
nivel: "transversal"
fase: "construccion_portfolio"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://skills.github.com/", "https://docs.github.com/"]
tags: ["ai-academy", "nota", "transversal", "construccion_portfolio"]
entregable: "artefacto asociado a Matriz de proyectos por fase"
---
# Matriz de proyectos reales por fase

## Objetivo

Esta matriz convierte los ejemplos oficiales de OpenAI, Anthropic y Gemini en una ruta de proyectos por fase. La intencion es que la academia no sea una coleccion de notas, sino una progresion clara donde cada alumno sabe que proyecto construir en cada momento.

## Fase 00 - Orientacion

Proyecto: elegir ruta y sistema operativo.

Origen oficial relacionado: todos los proveedores separan capacidades por entorno, herramienta y permisos. Aqui el alumno no construye aun; clasifica.

Entregable: `Mi_ruta_de_formacion.md` con objetivo, ordenador, nivel tecnico y primer proyecto.

## Fase 01 - Aprendizaje

Proyecto: glosario aplicado.

Ejemplos oficiales usados:

- OpenAI: skills, plugins, MCP, Codex.
- Anthropic: skills, tool use, Claude Code, MCP.
- Gemini: Interactions API, function calling, grounding, structured outputs.

Entregable: diccionario con ejemplos propios de prompt, instruction, skill, tool, workflow, agent, MCP, RAG, eval.

## Fase 02 - Aplicacion a trabajo e ideas

Proyecto 1: Meeting follow-up skill.

Fuente: OpenAI Skills & Plugins y Build skills. Entregable: transformar notas en decisiones, responsables, siguientes pasos y riesgos.

Proyecto 2: Weekly update.

Fuente: OpenAI skills recomendadas para trabajo repetible. Entregable: actualizacion semanal con hechos, bloqueos, prioridades y fuentes.

Proyecto 3: Document-to-presentation pipeline.

Fuente: Anthropic pre-built Agent Skills para docx, pptx, pdf. Entregable: nota de Obsidian convertida en documento y presentacion.

## Fase 03 - Construccion de proyectos

Proyecto 1: Codex docs maintenance.

Fuente: OpenAI use cases sobre mantener documentacion actualizada y guardar workflows como skills. Entregable: cambio documentado con diff y verificacion.

Proyecto 2: Claude Code onboarding a codebase.

Fuente: Claude Code common workflows. Entregable: overview de repo, mapa de archivos, plan y primer cambio seguro.

Proyecto 3: Gemini structured extractor.

Fuente: Gemini structured outputs. Entregable: extractor JSON de ideas a requisitos.

Proyecto 4: GitHub/Agent Skill PR reviewer.

Fuente: OpenAI reusable Codex skills y Anthropic/GitHub skills patterns. Entregable: skill de review con criterios.

## Fase 04 - Automatizacion y agentes

Proyecto 1: n8n/agent con permisos.

Fuente: matriz interna n8n + patrones MCP/tool use de OpenAI, Anthropic y Gemini. Entregable: agente con tool de lectura y aprobacion humana para escritura.

Proyecto 2: Gemini function calling.

Fuente: Gemini function calling. Entregable: asistente que llama una funcion interna con schema validado.

Proyecto 3: Claude MCP issue-to-PR.

Fuente: Claude Code MCP examples. Entregable: arquitectura que lee issue tracker y prepara PR.

Proyecto 4: Deep Research workflow.

Fuente: Gemini Deep Research. Entregable: informe largo con fuentes, plan, busqueda, lectura e iteracion.

## Fase 05 - Produccion y portfolio

Proyecto 1: Security scan / vulnerability backlog.

Fuente: OpenAI use cases de security scan, PR security review y vulnerability remediation. Entregable: informe de seguridad con hallazgos, severidad y fix minimo.

Proyecto 2: Verified operations.

Fuente: OpenAI run verified operations y Claude `/verify`. Entregable: runbook con ejecucion, evidencia, logs y rollback.

Proyecto 3: Portfolio de skills.

Fuente: OpenAI/Anthropic skills. Entregable: tres skills reales documentadas: follow-up, PR review, doc pipeline.

Proyecto 4: Deep Research business/market report.

Fuente: Gemini Deep Research. Entregable: informe defendible con coste estimado y fuentes.

## Secuencia recomendada para un alumno no tecnico

1. Meeting follow-up.
2. Weekly update.
3. Document review.
4. Presentation generation.
5. Business review pack.
6. Portfolio de workflows.

## Secuencia recomendada para un alumno tecnico

1. Codex docs maintenance.
2. Claude Code codebase overview.
3. PR reviewer skill.
4. Gemini structured extractor.
5. Function calling.
6. Security scan.
7. MCP workflow.
8. Verified operations.

## Fuentes principales

- [OpenAI use cases](https://learn.chatgpt.com/use-cases)
- [OpenAI Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Anthropic skills repository](https://github.com/anthropics/skills)
- [Claude Code common workflows](https://code.claude.com/docs/en/common-workflows)
- [Gemini API Cookbook](https://github.com/google-gemini/cookbook)
- [Gemini Deep Research](https://ai.google.dev/gemini-api/docs/deep-research)

## Como usar la matriz en una cohorte real

Para una cohorte de alumnos, no conviene activar todos los proyectos. Se eligen tres rutas: no tecnica, tecnica y mixta. La ruta no tecnica usa skills de trabajo y documentos. La tecnica usa Codex, Claude Code, Gemini API y security scan. La mixta usa workflows, n8n, structured outputs y una automatizacion con aprobacion humana.

Cada alumno debe elegir un proyecto obligatorio y uno opcional por fase. Asi no se dispersa. Por ejemplo, en fase 02 todos hacen meeting follow-up, pero pueden elegir weekly update o campaign brief. En fase 03 todos hacen un proyecto minimo, pero eligen Codex, Claude o Gemini segun perfil. En fase 04 todos diseñan permisos, aunque no todos conecten MCP real.

## Como convertir la matriz en calendario

Semana 1: fase 00 y diagnostico. Semana 2: fundamentos y glosario. Semana 3: meeting follow-up y weekly update. Semana 4: document review y presentation generation. Semana 5: primer proyecto tecnico o no tecnico. Semana 6: skill o structured output. Semana 7: agent/tool/MCP architecture. Semana 8: produccion, evals y portfolio.

Esta version compacta puede expandirse a 12 o 16 semanas añadiendo mas laboratorios y revisiones.

## Como usarla para reorganizar carpetas futuras

Cuando se creen nuevos materiales, no deben guardarse solo por proveedor. Deben tener doble ubicacion mental: proveedor y fase. Por ejemplo, un laboratorio de Gemini function calling pertenece al modulo Gemini, pero pedagogicamente vive en fase 04 si llama herramientas reales. Una skill de meeting follow-up pertenece a OpenAI Skills, pero pedagogicamente vive en fase 02. Esta doble lectura evita que el curso parezca una lista de productos.

La matriz tambien ayuda a decidir que falta. Si una fase tiene muchas explicaciones y pocos entregables, se crea un proyecto. Si una fase tiene proyectos pero no evaluacion, se crea rubrica. Si una fase tiene herramientas avanzadas pero no errores provocados, se añade BREAK/FIX.

## Criterio de equilibrio

Cada fase deberia tener al menos:

- Un proyecto no tecnico.
- Un proyecto tecnico opcional.
- Un laboratorio con error provocado.
- Un entregable de portfolio.
- Una evaluacion breve.

Asi la formacion sirve a perfiles distintos sin romper la ruta comun.

## Decision final por fase

Al cerrar cada fase, el alumno debe elegir que proyecto pasa a la siguiente. No todos los ejercicios se convierten en proyecto grande. Algunos son practica. Otros son portfolio. Otros se descartan. Esta decision enseña priorizacion. Por ejemplo, una weekly update skill puede quedarse como herramienta personal, pero un PR reviewer puede convertirse en proyecto de portfolio tecnico. Un Deep Research report puede ser entregable final, pero no tiene sentido hacerlo cada semana por coste.

La matriz ayuda a elegir con criterio: valor para el alumno, dificultad tecnica, evidencia que produce, reutilizacion y riesgo. Si un proyecto tiene alto riesgo y baja evidencia, no se prioriza. Si tiene baja dificultad y alto valor, entra temprano. Si tiene alto valor y alta dificultad, se reserva para fases avanzadas.
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

Usar **Matriz de proyectos por fase** para producir el entregable definido en la metadata: **artefacto asociado a Matriz de proyectos por fase**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Matriz de proyectos por fase**.
