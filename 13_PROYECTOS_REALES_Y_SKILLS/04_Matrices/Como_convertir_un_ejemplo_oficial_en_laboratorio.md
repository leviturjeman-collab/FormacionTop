---
titulo: "Como convertir un ejemplo oficial en laboratorio"
tipo: "nota"
nivel: "transversal"
fase: "construccion_portfolio"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://skills.github.com/", "https://docs.github.com/"]
tags: ["ai-academy", "nota", "transversal", "construccion_portfolio"]
entregable: "artefacto asociado a Como convertir un ejemplo oficial en laboratorio"
---
# Como convertir un ejemplo oficial en laboratorio

## Objetivo

Este documento explica como transformar un ejemplo oficial de OpenAI, Anthropic o Gemini en una practica de la academia. La regla es simple: una fuente oficial da legitimidad, pero no es automaticamente una clase. Hay que convertirla en experiencia pedagogica: objetivo, contexto, pasos, error provocado, reparacion, evaluacion y entregable.

## Paso 1 - Identificar el patron

Primero se identifica que tipo de patron representa:

- Skill reusable.
- Workflow de trabajo.
- Proyecto tecnico.
- Tool/function calling.
- Structured output.
- MCP.
- Deep research.
- Documento.
- Seguridad.
- Produccion.

Ejemplo: OpenAI menciona meeting follow-up. Patron: skill reusable de conocimiento. Fase: 02. Nivel: A/B.

Ejemplo: Claude Code MCP con issue tracker. Patron: agente conectado a sistema externo. Fase: 04/05. Nivel: C/E.

Ejemplo: Gemini Deep Research. Patron: agente de investigacion larga. Fase: 04/05. Nivel: C/E.

## Paso 2 - Definir la version minima

Todo laboratorio debe empezar pequeño. Si el ejemplo oficial es grande, se reduce:

- Meeting follow-up: usar una reunion ficticia de 10 lineas.
- PR reviewer: usar un diff pequeño.
- Function calling: una funcion local simulada.
- Deep Research: una pregunta acotada y fuentes controladas.
- MCP: diseñar arquitectura antes de conectar nada real.

La version minima evita que el alumno confunda friccion tecnica con aprendizaje.

## Paso 3 - Escribir CHECK

CHECK mide si el alumno entiende el problema antes de construir.

Preguntas:

- Que tarea repetible hay aqui.
- Que entrada necesita.
- Que salida espera.
- Que herramienta conviene.
- Que riesgo tiene.
- Que parte puede fallar.
- Que sistema operativo requiere.

## Paso 4 - Escribir DO

DO es la construccion correcta. Debe tener pasos claros y resultado verificable. No basta con "usa la herramienta". Debe decir que se introduce, que se espera y como se valida.

Ejemplo para structured output:

1. Dar texto de idea.
2. Definir schema.
3. Pedir JSON.
4. Validar campos.
5. Guardar salida en Obsidian.

## Paso 5 - Escribir BREAK

BREAK crea el error que enseña. El error no debe ser aleatorio; debe revelar el concepto central.

Ejemplos:

- Skill description demasiado amplia.
- Function calling sin parametros obligatorios.
- Structured output con campo faltante.
- Grounding sin fuentes.
- MCP con permisos excesivos.
- PR review sin severidad.
- Document skill sin plantilla.

## Paso 6 - Escribir FIX

FIX debe guiar diagnostico:

- Revisar input.
- Revisar output.
- Revisar schema.
- Revisar permisos.
- Revisar fuentes.
- Revisar logs.
- Revisar coste.
- Revisar criterio de terminado.

El alumno debe arreglar con evidencia, no por intuicion.

## Paso 7 - Escribir EXPLAIN

La explicacion final convierte ejercicio en conocimiento. Debe responder:

- Que paso.
- Por que paso.
- Como lo detecte.
- Como lo arregle.
- Como lo evitaria.
- Como lo aplicaria a mi trabajo.

## Paso 8 - Clasificar por fases

Todo laboratorio oficial debe ubicarse:

- Fase 01 si enseña concepto.
- Fase 02 si aplica a trabajo.
- Fase 03 si construye artefacto.
- Fase 04 si conecta herramientas o agentes.
- Fase 05 si toca produccion, portfolio o evaluacion.

## Paso 9 - Clasificar por ordenador

Cada laboratorio debe decir:

- Windows: PowerShell o navegador.
- macOS: Terminal/zsh o navegador.
- Linux: Bash o navegador.
- Nivel tecnico: A, B, C, D o E.

## Plantilla rapida

```markdown
# Laboratorio - [nombre]

Fuente oficial:
Fase:
Nivel tecnico:
Sistema operativo:
Objetivo:
Entrada:
Salida:
CHECK:
DO:
BREAK:
FIX:
EXPLAIN:
Evaluacion:
Portfolio:
```

## Fuentes

- [OpenAI use cases](https://learn.chatgpt.com/use-cases)
- [OpenAI Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Claude Code common workflows](https://code.claude.com/docs/en/common-workflows)
- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [Gemini API Cookbook](https://github.com/google-gemini/cookbook)
- [Gemini Interactions API](https://ai.google.dev/gemini-api/docs/interactions-overview)

## Ejemplo completo

Ejemplo oficial: OpenAI recomienda meeting follow-up como buena primera skill.

Conversion a laboratorio:

Fuente: OpenAI Skills & Plugins / Build skills.

Fase: 02.

Nivel: A/B.

Objetivo: transformar notas de reunion en decisiones, responsables, proximos pasos, dudas y riesgos.

CHECK: el alumno recibe notas y debe identificar que informacion falta.

DO: crea una plantilla de follow-up y la prueba con notas reales o ficticias.

BREAK: se entrega una reunion sin responsables y con una decision ambigua.

FIX: la skill debe marcar huecos y no inventar owners.

EXPLAIN: el alumno explica como la skill mejora trabajo real y que limites tiene.

Evaluacion: otra persona puede usar el output para actuar.

Portfolio: guardar antes/despues en Obsidian.

## Segundo ejemplo completo

Ejemplo oficial: Gemini structured outputs.

Conversion a laboratorio:

Fuente: Gemini structured output.

Fase: 03.

Nivel: C.

Objetivo: convertir una idea escrita en JSON validable.

CHECK: el alumno define campos obligatorios.

DO: diseña schema y prueba una idea.

BREAK: la idea no contiene usuario ni criterio de exito.

FIX: el sistema marca campos faltantes.

EXPLAIN: el alumno explica por que JSON estructurado facilita automatizacion posterior.

## Control de calidad del laboratorio

Antes de incluir un laboratorio en una fase, hay que probarlo como alumno. Si el creador no puede completar el laboratorio sin improvisar, falta documentacion. Si el resultado no se puede evaluar, falta criterio. Si no hay error provocado, falta aprendizaje profundo. Si no hay fuente oficial, falta trazabilidad.

Un laboratorio basado en fuente oficial debe conservar enlace a la fuente, pero no debe limitarse a copiarla. La documentacion oficial enseña una capacidad. El laboratorio enseña a usarla con criterio, en contexto y con errores reales.

## Señales de que la conversion fue buena

- El alumno entiende por que existe el ejemplo oficial.
- Puede construir una version minima.
- Puede romperla de forma controlada.
- Puede repararla con evidencia.
- Puede explicar como aplicarla a su trabajo.
- Puede guardarla como pieza de portfolio.

Cuando se cumplen estas condiciones, el ejemplo oficial ya se ha convertido en formacion.

## Decision final de conversion

Un ejemplo oficial queda convertido en laboratorio cuando existe una ficha que otra persona puede ejecutar sin haber leido toda la documentacion original. La fuente oficial sigue enlazada para profundidad y actualizacion, pero el laboratorio debe contener todo lo necesario para practicar: contexto, objetivo, pasos, sistema operativo, errores, reparacion, evaluacion y entregable.

La calidad del curso dependera de esta conversion. Copiar enlaces no forma. Traducir una capacidad oficial en experiencia practica si forma. Ese es el trabajo pedagogico central.
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

Usar **Como convertir un ejemplo oficial en laboratorio** para producir el entregable definido en la metadata: **artefacto asociado a Como convertir un ejemplo oficial en laboratorio**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Como convertir un ejemplo oficial en laboratorio**.
