---
titulo: "Fases basico intermedio avanzado"
tipo: "evaluacion_rubrica"
nivel: "basico"
fase: "profesionalizacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "evaluacion_rubrica", "basico", "profesionalizacion"]
entregable: "rubrica o instrumento de evaluacion"
---
# Fases divididas en basico, intermedio y avanzado

## Objetivo

Este documento divide cada fase de la formacion en tres niveles: basico, intermedio y avanzado. Esto permite adaptar el curso a perfiles distintos sin romper la ruta principal. Un alumno no tecnico puede avanzar mucho en basico e intermedio antes de tocar codigo. Un alumno tecnico puede pasar antes a avanzado, pero no debe saltarse criterio, documentacion ni evaluacion.

## Fase 00 - Orientacion y diagnostico

### Basico

El alumno entiende que quiere conseguir, que ordenador usa y que limitaciones tiene. Entregable: nota personal con objetivo, sistema operativo y primer proyecto.

Usar: Obsidian, documento maestro, evaluacion diagnostica.

No usar: APIs, Docker, agentes complejos, automatizaciones.

### Intermedio

El alumno clasifica su proyecto como Nivel A, B, C, D o E. Tambien identifica riesgos: datos sensibles, permisos, herramientas externas, coste o falta de instalacion.

Usar: matriz de compatibilidad, mapa de decision.

No usar: herramientas avanzadas sin justificar.

### Avanzado

El alumno crea roadmap personal de 6 fases y elige un proyecto final candidato.

Usar: matriz de proyectos por fase, catalogo de skills.

No usar: produccion real.

## Fase 01 - Aprendizaje

### Basico

Aprende vocabulario: prompt, contexto, token, workflow, tool, skill, agente, MCP, RAG, eval.

Usar: glosario, AI Foundations, ejemplos simples.

No usar: codigo real salvo demostraciones muy pequeñas.

### Intermedio

Explica diferencias y aplica conceptos a tareas propias.

Usar: ejercicios de comparacion, prompts mejorados, mini workflows.

No usar: agentes autonomos.

### Avanzado

Clasifica arquitecturas: que parte es determinista, que parte usa LLM, que requiere tool o skill.

Usar: diagramas, casos reales, fuentes oficiales.

No usar: herramientas conectadas con permisos reales todavia.

## Fase 02 - Aplicacion a trabajo e ideas

### Basico

Convierte tareas reales en prompts y checklists.

Usar: ChatGPT, Claude, Obsidian, plantillas.

No usar: codigo real obligatorio.

### Intermedio

Convierte tareas en workflows repetibles y primeras skills instruction-only.

Usar: skill creator, plantillas, ejemplos oficiales como meeting follow-up o weekly update.

No usar: scripts peligrosos, APIs con datos sensibles.

### Avanzado

Convierte una idea en proyecto con alcance, riesgo, entregable y evaluacion.

Usar: manual de proyectos, matriz de máximo nivel, rubricas.

No usar: produccion.

## Fase 03 - Construccion de proyectos

### Basico

Construye un artefacto simple: documento, presentacion, prompt pack, workflow manual o skill sin codigo.

Usar: Obsidian, skills, docs oficiales.

No usar: deploy, MCP real, datos vivos.

### Intermedio

Construye version tecnica minima: Codex, Claude Code, Gemini structured output, n8n cloud o GitHub Skill.

Usar: codigo real cuando el proyecto sea tecnico.

No usar: permisos amplios, credenciales compartidas, cambios sin diff.

### Avanzado

Añade tests, validacion, export, logs, schema, workflow JSON o repo reproducible.

Usar: Git, terminal, scripts, n8n exports, API requests, tests.

No usar: acciones irreversibles sin aprobacion.

## Fase 04 - Automatizacion, agentes y sistemas

### Basico

Dibuja arquitectura y separa workflow determinista de decision LLM.

Usar: diagramas, Obsidian, pseudo flujo.

No usar: agentes con permisos reales.

### Intermedio

Construye automatizacion controlada con una tool limitada.

Usar: n8n, function calling, structured outputs, skills.

No usar: tools de escritura sin human-in-the-loop.

### Avanzado

Integra MCP, RAG, memory, evals, logs y coste.

Usar: codigo real, workflows exportables, tests, API calls, MCP si procede.

No usar: credenciales amplias, datos sensibles sin politica, agentes sin limite.

## Fase 05 - Produccion, portfolio y escala

### Basico

Organiza portfolio y documenta proyectos.

Usar: Obsidian, docs, presentaciones, rubricas.

No usar: deploy real si no hace falta.

### Intermedio

Prepara evaluaciones, checklist multisistema, defensa y version exportable.

Usar: rubricas, docx/pptx/pdf, logs o evidencias.

No usar: claims sin evidencia.

### Avanzado

Prepara produccion o simulacion de produccion: secretos, permisos, evals, rollback, observabilidad, coste.

Usar: codigo real si hay sistema tecnico, GitHub, CI, deployment checklist, monitoring.

No usar: sistemas vivos sin responsable.

## Regla de progresion

Un alumno puede estar avanzado en documentacion y basico en codigo. Eso esta bien. El nivel se mide por competencia en ese tipo de proyecto, no por ego tecnico.

## Como evaluar el nivel real del alumno

No se evalua por herramienta usada. Se evalua por autonomia y criterio. Un alumno basico necesita pasos muy guiados. Un alumno intermedio adapta pasos a su contexto. Un alumno avanzado detecta riesgos, decide herramientas y defiende tradeoffs.

Ejemplo: dos alumnos usan n8n. El primero conecta nodos siguiendo un tutorial pero no entiende JSON ni credenciales. Aunque use n8n, sigue en basico. El segundo diseña entradas, salidas, errores, logs y permisos. Ese alumno esta en intermedio o avanzado. La herramienta no define nivel; la comprension si.

## Como diseñar materiales para tres niveles

Cada leccion importante deberia tener tres caminos:

- Camino basico: lectura guiada y ejercicio manual.
- Camino intermedio: aplicacion a un caso propio.
- Camino avanzado: artefacto tecnico, evaluacion o automatizacion.

Esto permite que una misma clase sirva para perfiles distintos. Por ejemplo, en una leccion de skills:

- Basico: leer que es una skill y analizar ejemplos.
- Intermedio: crear una skill instruction-only.
- Avanzado: añadir recursos, scripts, evaluacion y distribucion.

## Regla de no salto

No se salta a avanzado si falta base. Un alumno puede usar codigo, pero si no entiende fuentes, permisos o evaluacion, el proyecto no es avanzado. Puede ser tecnico, pero no maduro. La academia debe premiar madurez, no solo complejidad.

## Resultado esperado

Al final, cada fase tendra actividades basicas, intermedias y avanzadas. Esto permite convertir una formacion unica en varias rutas: ruta no tecnica, ruta tecnica, ruta negocio, ruta automatizacion y ruta portfolio.

## Aplicacion al diseño de cohortes

En una cohorte real, cada semana puede tener tres niveles. Todos escuchan el mismo modelo mental, pero el entregable cambia. En fase 02, el basico entrega plantilla; el intermedio entrega workflow; el avanzado entrega skill. En fase 03, el basico entrega documento; el intermedio entrega prototipo; el avanzado entrega repo, workflow o API request. Asi nadie queda fuera y nadie se queda corto.

Esto tambien permite vender rutas: ruta aplicada, ruta tecnica y ruta avanzada. Todas comparten base, pero no obligan a todos a usar el mismo nivel de codigo.

## Regla de certificacion

Para certificar una fase, el alumno debe entregar al menos un artefacto en su nivel. Basico no es menos digno: simplemente tiene menos complejidad tecnica. Avanzado exige mas evidencia. La certificacion debe reflejar nivel real, no solo asistencia.
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

Usar **Fases basico intermedio avanzado** para producir el entregable definido en la metadata: **rubrica o instrumento de evaluacion**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Fases basico intermedio avanzado**.
