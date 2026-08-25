---
titulo: "Que utilizar y que no utilizar"
tipo: "evaluacion_rubrica"
nivel: "avanzado"
fase: "profesionalizacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "evaluacion_rubrica", "avanzado", "profesionalizacion"]
entregable: "rubrica o instrumento de evaluacion"
---
# Que utilizar y que no utilizar

## Objetivo

Este documento define que herramientas usar y que herramientas evitar segun fase, nivel y tipo de proyecto. La meta es evitar dos extremos: quedarse en teoria blanda o meter herramientas demasiado avanzadas antes de tiempo.

## Utilizar en proyectos basicos

Usar:

- Obsidian.
- ChatGPT o Claude para pensamiento, redaccion y revision.
- Plantillas.
- Checklists.
- Fuentes oficiales.
- Ejemplos buenos y malos.
- Rubricas.

No usar:

- Docker.
- MCP real.
- Bases de datos.
- APIs con claves.
- Agentes autonomos.
- Deploy.
- Scripts que borren o modifiquen archivos.

Razon: el objetivo basico es entender y documentar.

## Utilizar en proyectos intermedios

Usar:

- Skills instruction-only.
- GitHub web.
- n8n cloud.
- Gemini AI Studio o API simple.
- Codex en modo lectura o cambios pequeños.
- Claude Code para explorar o planificar.
- JSON schema.
- Workflows exportables.

No usar:

- Produccion real.
- Credenciales con permisos amplios.
- Tools de escritura sin aprobacion.
- Automatizaciones largas sin logs.
- Agentes que deciden acciones sensibles.

Razon: el objetivo intermedio es aplicar y construir version minima.

## Utilizar en proyectos avanzados

Usar:

- Git.
- Terminal.
- Codex o Claude Code sobre repositorios.
- Gemini API.
- n8n avanzado.
- Function calling.
- Structured outputs.
- MCP.
- RAG.
- Evals.
- Logs.
- Tests.
- Docker cuando sea necesario.
- CI/CD si el proyecto lo justifica.

No usar:

- Acciones irreversibles sin aprobacion humana.
- API keys en codigo.
- Datos sensibles sin politica.
- Herramientas no oficiales sin evaluar.
- Automatizaciones sin rollback.
- Produccion sin responsable.

Razon: el objetivo avanzado es construir sistemas defendibles.

## Herramientas que parecen utiles pero pueden distraer

Evitar al principio:

- Multiagente complejo.
- MCP para todo.
- Docker si n8n cloud basta.
- Bases vectoriales antes de entender RAG.
- Frameworks agenticos antes de dominar tools.
- Dashboards antes de definir metricas.
- Presentaciones antes de tener contenido.

La herramienta avanzada solo entra cuando resuelve un problema real.

## Regla final

Usa la herramienta mas simple que permita cumplir el objetivo y verificar el resultado. Si una herramienta no mejora claridad, repetibilidad, seguridad o evaluacion, probablemente sobra.

## Decision por tipo de necesidad

Si necesitas pensar, usa ChatGPT, Claude u Obsidian. No necesitas n8n.

Si necesitas documentar, usa plantillas, Obsidian, docx, pptx o pdf. No necesitas APIs.

Si necesitas repetir un proceso, usa una skill. No necesitas plugin todavia.

Si necesitas compartir una capacidad instalable, usa plugin. No necesitas construir una app completa.

Si necesitas conectar datos externos, considera MCP o conectores. No copies datos manualmente para siempre.

Si necesitas ejecutar logica interna, usa function calling o scripts. No lo resuelvas con texto libre.

Si necesitas automatizar pasos entre herramientas, usa n8n. No escribas codigo si n8n basta.

Si necesitas producto web o app, usa codigo real y pruebas. No lo vendas como simple prompt.

## Herramientas prohibidas temporalmente

En fases basicas queda prohibido introducir herramientas solo por impresionar. Nada de multiagentes, Docker, Kubernetes, bases vectoriales, MCP real o CI/CD si el alumno no entiende todavia entrada, salida, contexto y revision.

En fases avanzadas queda prohibido lo contrario: presentar como profesional algo que no tiene evidencia. Si una app no se puede ejecutar, no es app. Si una skill no se puede invocar, no es skill lista. Si un workflow no se puede exportar o explicar, no esta completo.

## Criterio de uso

Antes de usar una herramienta, escribe una frase:

```text
Uso __ porque necesito __ y verificare que funciona con __.
```

Si la frase no sale, la herramienta sobra o el proyecto no esta claro.

## Aplicacion por ejemplos

Meeting follow-up: usar ChatGPT, Claude, Obsidian, plantilla y skill. No usar Docker, MCP ni API.

PR reviewer: usar Git, Codex o Claude Code, diff, rubrica y tests. No usar cambios automaticos sin revision.

n8n workflow: usar n8n cloud al principio, luego export JSON, credentials y logs. No usar self-hosting antes de entender nodes.

Gemini extractor: usar structured output y schema. No usar Deep Research si solo hace falta JSON.

Agente de produccion: usar permisos, HITL, logs, evals y rollback. No usar credenciales amplias ni acciones sin aprobacion.

Esta lista debe crecer con cada proyecto nuevo.

## Criterio para descartar herramientas

Descarta una herramienta cuando añade friccion sin mejorar aprendizaje. Descarta codigo cuando solo hace mas lenta una clase conceptual. Descarta automatizacion cuando el proceso todavia no esta claro. Descarta agentes cuando un workflow determinista basta. Descartar bien tambien es competencia profesional.

## Uso en clase

Antes de empezar una practica, el alumno debe escribir dos listas: herramientas que usara y herramientas que no usara. La segunda lista suele ser mas reveladora. Si dice que no usara MCP porque no hay sistema externo, ha entendido. Si dice que no usara codigo porque la fase es de definicion, ha entendido. Si dice que no usara datos reales porque aun no hay seguridad, ha entendido.

Esta practica entrena criterio antes de tocar herramientas. Tambien evita que una clase se convierta en una carrera por usar la tecnologia mas complicada.

## Cierre

La calidad no consiste en usar mas herramientas. Consiste en elegir bien. Un alumno de máximo nivel sabe justificar por que usa una herramienta y tambien por que decide no usar otra.

Esa justificacion debe quedar escrita en la nota del proyecto, porque despues servira para defensa, revision y mejora.

Si una herramienta entra sin justificacion, se retira. Si una herramienta queda fuera pero bloquea el objetivo, se reincorpora. La seleccion no es fija; se revisa con evidencia.
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

Usar **Que utilizar y que no utilizar** para producir el entregable definido en la metadata: **rubrica o instrumento de evaluacion**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Que utilizar y que no utilizar**.
