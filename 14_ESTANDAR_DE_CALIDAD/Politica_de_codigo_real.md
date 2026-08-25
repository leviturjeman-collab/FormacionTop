---
titulo: "Politica de codigo real"
tipo: "evaluacion_rubrica"
nivel: "avanzado"
fase: "profesionalizacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "evaluacion_rubrica", "avanzado", "profesionalizacion"]
entregable: "rubrica o instrumento de evaluacion"
---
# Politica de codigo real

## Objetivo

Este documento responde claramente a la duda: no hay que utilizar codigo real para todo, pero si hay que utilizar artefactos reales para todo. La diferencia es importante. Un proyecto de comunicacion puede tener una plantilla real y una rubrica real sin codigo. Un proyecto de API necesita codigo real o al menos una llamada reproducible. Un proyecto n8n necesita workflow exportado. Un proyecto de skill necesita `SKILL.md`. Un proyecto de produccion necesita pruebas, logs o checklist verificable.

## Que cuenta como artefacto real

Cuenta como artefacto real:

- Nota de Obsidian completa.
- Plantilla reusable.
- Prompt versionado.
- Skill con `SKILL.md`.
- Workflow n8n exportado.
- JSON schema.
- API request.
- Script Python o Node.js.
- Test.
- Rubrica.
- Documento docx.
- Presentacion pptx.
- PDF.
- Captura de ejecucion.
- Log.
- Diff.
- Pull request.
- Checklist de deploy.

## Cuando NO hace falta codigo real

No hace falta codigo real cuando:

- El proyecto es de aprendizaje conceptual.
- El entregable es una guia.
- El objetivo es documentar un proceso.
- El proyecto es una skill instruction-only.
- La practica es de prompting.
- La salida es documento, presentacion o rubrica.
- La fase es basica y no requiere ejecucion tecnica.

Ejemplo: `meeting-follow-up` puede empezar sin codigo. Lo importante es que tenga plantilla, casos y evaluacion.

## Cuando SI hace falta codigo real

Hace falta codigo real o equivalente tecnico cuando:

- Se llama una API.
- Se valida JSON.
- Se procesa archivo automaticamente.
- Se usa function calling.
- Se despliega una app.
- Se construye un CLI.
- Se conecta MCP.
- Se usa RAG con datos.
- Se automatiza n8n con export.
- Se ejecutan tests.
- Se mide coste con calculos.
- Se trabaja con repositorio.

Ejemplo: un `structured output extractor` avanzado debe tener schema real y ejemplo de validacion. Un `function calling bridge` debe tener funcion simulada o real. Un workflow n8n debe exportarse.

## Niveles de codigo

### Codigo Nivel 0

No hay codigo. Hay plantilla, prompt o documento.

### Codigo Nivel 1

Hay estructura tecnica sin ejecucion compleja: JSON, schema, pseudo API, workflow dibujado.

### Codigo Nivel 2

Hay ejecucion local o web simple: script, API request, n8n cloud, validacion.

### Codigo Nivel 3

Hay proyecto reproducible: repo, tests, instrucciones por sistema operativo.

### Codigo Nivel 4

Hay produccion o simulacion fuerte: logs, CI, rollback, secretos, evals, monitoring.

## Regla para alumnos

No escribas codigo para parecer avanzado. Escribe codigo cuando haga el proyecto mas verificable, repetible o util. Si el codigo no se puede explicar, probar o mantener, baja de nivel y documenta mejor.

## Regla para la academia

Cada laboratorio tecnico debe incluir al menos uno:

- Comando real.
- Archivo real.
- JSON real.
- Script real.
- Export real.
- Diff real.
- Test real.

Cada laboratorio no tecnico debe incluir al menos uno:

- Plantilla real.
- Documento real.
- Rubrica real.
- Ejemplo realista.
- Checklist real.
- Presentacion real.

## Cierre

El estándar más alto no exige codigo en todo. Exige realidad en todo.

## Ejemplos por fase

Fase 01: normalmente no requiere codigo. Puede usar ejemplos, diagramas y pequeños JSON ilustrativos.

Fase 02: normalmente no requiere codigo. Puede usar prompts, plantillas, skills instruction-only y documentos. Si se usa codigo aqui, debe ser opcional.

Fase 03: empieza a requerir codigo o artefactos tecnicos en proyectos tecnicos. Codex, Claude Code, Gemini API, GitHub Skills o n8n deben producir algo real.

Fase 04: si hay agentes, tools, function calling, MCP o RAG, debe haber artefacto tecnico real o simulacion muy clara. No basta con diagrama.

Fase 05: si el proyecto se presenta como produccion, necesita evidencia tecnica, logs, evaluacion o checklist seria. Si no hay codigo, debe haber documento operativo real.

## Ejemplo de politica aplicada

Proyecto: "asistente de ideas".

Basico: prompt y plantilla. Sin codigo.

Intermedio: skill instruction-only que convierte ideas en proyecto. Sin codigo obligatorio.

Avanzado: structured output JSON para guardar ideas. Aqui si conviene codigo o request reproducible.

de máximo nivel: schema validado, ejemplos, errores, evaluacion, export a Obsidian y quizas dashboard. Aqui el artefacto tecnico ya aporta valor.

## Riesgos del codigo innecesario

Codigo innecesario puede distraer, romper la experiencia del alumno y convertir una idea clara en una clase confusa. Tambien puede crear falsa sensacion de profundidad. Un script sin explicacion no forma. Un workflow sin criterio no forma. El codigo debe entrar cuando mejora reproducibilidad, validacion, automatizacion o integracion.

## Riesgos de evitar codigo cuando hace falta

El riesgo contrario tambien existe. Si un curso promete APIs, agentes, RAG o automatizacion y nunca muestra artefactos reales, se queda en teoria. En avanzado, el alumno necesita tocar archivos, schemas, comandos, exports, logs o tests. Sin eso no aprende diagnostico real.

## Aplicacion por nivel B

Si un proyecto es Nivel B, normalmente no empieza con codigo. Pero puede prepararse para codigo. Primero se define workflow. Despues se convierte en plantilla. Luego en skill. Si el proceso necesita conectarse a sistemas, entonces se decide si usar n8n, API, function calling o MCP. El codigo aparece cuando aporta automatizacion o verificacion.

Ejemplo: un reporting pack empieza en ChatGPT con archivos. Luego se convierte en plantilla. Despues puede usar xlsx real. Mas adelante puede usar API o connector para traer metricas. Solo entonces tiene sentido codigo o automatizacion.

La politica evita meter codigo antes de que el proceso este claro. Tambien evita vender como avanzado un proyecto que nunca se puede ejecutar.

## Uso en clase

Antes de pedir codigo, el profesor debe preguntar: que va a demostrar este codigo. Si la respuesta es "que funciona", hay que concretar: que funciona, con que input, que output, que error detecta y como se repite. Si el codigo no demuestra nada, se aplaza.

Cuando el codigo si aplica, debe ser pequeño, legible y verificable. Es mejor un script minimo que todos entienden que una arquitectura enorme que nadie puede defender.

## Cierre

La politica final es simple: sin realidad no hay proyecto. La realidad puede ser codigo, workflow, plantilla, documento, rubrica, schema, log o presentacion, pero siempre debe existir algo que otra persona pueda revisar.
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

Usar **Politica de codigo real** para producir el entregable definido en la metadata: **rubrica o instrumento de evaluacion**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Politica de codigo real**.
