---
titulo: "Fase 01 Aprendizaje"
tipo: "guia_pedagogica"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "guia_pedagogica", "transversal", "aplicacion"]
entregable: "guia de clase o ruta de aprendizaje"
---
# Fase 01 - Aprendizaje

## Objetivo de la fase

La primera fase es el aprendizaje. Aqui el alumno construye los modelos mentales que necesita para no depender de recetas. Aprende que es un modelo, que son tokens, que es contexto, que diferencia hay entre prompt e instruccion, que significa verificar, que limites tiene una respuesta generada y por que una herramienta de IA no debe usarse sin criterio. Esta fase no busca que el alumno domine todas las plataformas. Busca que entienda el mapa.

El error que queremos evitar es que la persona empiece directamente con agentes, n8n avanzado o Codex sin entender conceptos basicos. Un alumno que no sabe que es contexto se frustrara con cualquier modelo. Un alumno que no entiende permisos tendra problemas con tools. Un alumno que no entiende evaluacion aceptara outputs incorrectos. Por eso el aprendizaje no es una fase decorativa; es la base que reduce errores posteriores.

## Contenidos principales

La fase incluye:

- Fundamentos de IA.
- LLMs.
- Tokens.
- Contexto.
- Prompting.
- Instrucciones.
- Verificacion.
- Alucinaciones.
- Privacidad.
- Diferencia entre workflow y agente.
- Diferencia entre prompt, instruction, skill, tool y MCP.
- Primer contacto con ChatGPT, Claude, Codex, Gemini, GitHub Skills y n8n.

No se estudia cada herramienta en profundidad todavia. Se aprende para que sirve cada una y que papel puede ocupar en proyectos.

## Orden recomendado

1. [[../04_CLASES_POR_HERRAMIENTA/00_AI_Foundations/00_Resumen/README]]
2. [[../04_CLASES_POR_HERRAMIENTA/00_AI_Foundations/01_Lecciones/Lecciones]]
3. [[../09_DICCIONARIO_DE_IA/Glosario_base]]
4. [[../01_INVESTIGACION_OFICIAL/Sintesis_de_research]]
5. [[../01_INVESTIGACION_OFICIAL/OpenAI_Academy_ChatGPT_Codex]]
6. [[../01_INVESTIGACION_OFICIAL/Anthropic_Claude_Claude_Code]]
7. [[../01_INVESTIGACION_OFICIAL/GitHub_Skills_Copilot_Agents]]
8. [[../01_INVESTIGACION_OFICIAL/n8n]]

El alumno no tiene que memorizarlo todo. Debe poder explicar con sus palabras que hace cada bloque y cuando lo usaria.

## Modelo mental

El modelo mental central es:

```text
Necesidad -> Instruccion -> Contexto -> Herramienta -> Resultado -> Revision -> Aprendizaje
```

Cuando el alumno pide algo a ChatGPT, Claude o Gemini, no esta "hablando con magia". Esta formulando una instruccion a un sistema que responde en funcion de modelo, contexto, datos, limites y herramientas. Cuando usa Codex, esta delegando trabajo sobre archivos y codigo. Cuando usa n8n, esta creando flujos de datos y acciones. Cuando usa una skill, esta empaquetando un procedimiento.

## Actividad principal

El alumno crea un documento llamado `Mi_diccionario_de_IA.md`. En el explica con sus palabras:

- Prompt.
- Instruction.
- Contexto.
- Token.
- Workflow.
- Tool.
- Skill.
- Agent.
- MCP.
- RAG.
- HITL.
- Eval.

Por cada termino debe incluir un ejemplo cotidiano y un ejemplo profesional. Esto obliga a pasar de definicion a uso.

## Resultado de la fase

La fase termina cuando el alumno puede mirar una herramienta de IA y preguntar:

- Que problema resuelve.
- Que contexto necesita.
- Que riesgos tiene.
- Que parte debo revisar.
- Que salida espero.
- Como lo convertiria en workflow.

## Criterios para pasar a la fase 02

El alumno puede pasar a aplicacion cuando demuestra que no confunde conceptos basicos. Debe distinguir prompt de instruction, workflow de agente, tool de skill y skill de MCP. No necesita definiciones academicas perfectas, pero si ejemplos correctos. Tambien debe entender que toda salida de IA necesita revision proporcional al riesgo.

Una prueba simple: pedirle que explique una tarea propia usando entrada, proceso, salida y revision. Si puede hacerlo, esta listo para aplicar al trabajo. Si solo dice "le preguntaria a ChatGPT", necesita mas fase 01.

## Como impartir esta fase

Esta fase debe alternar explicacion y micropractica. Cada concepto se trabaja en cuatro capas: 60 segundos, modelo mental, hands-on y profundidad profesional. Por ejemplo, tokens se explican rapido, luego se dibujan como coste de contexto, luego se comparan prompts cortos y largos, y finalmente se conecta con presupuesto de uso.

No conviene convertir fase 01 en teoria interminable. Cada concepto debe terminar con una accion pequeña. Si se enseña verificacion, el alumno verifica. Si se enseña contexto, mejora una instruccion. Si se enseña tool, clasifica herramientas. Aprendizaje sin accion se olvida rapido.

## Errores frecuentes

El error mas comun es memorizar palabras. Otro es creer que prompt engineering es una lista de trucos. Otro es pensar que un modelo potente elimina necesidad de criterio. Esta fase debe desmontar esas ideas con ejemplos.

## Señal de aprendizaje real

El alumno empieza a hacer mejores preguntas. Ya no pregunta solo "que prompt uso", sino "que contexto necesito", "que no debe hacer el modelo", "como verifico esto" y "que parte deberia automatizar".

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

Usar **Fase 01 Aprendizaje** para producir el entregable definido en la metadata: **guia de clase o ruta de aprendizaje**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Fase 01 Aprendizaje**.
