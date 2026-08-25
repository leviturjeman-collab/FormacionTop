---
titulo: "Fase 00 Orientacion y diagnostico"
tipo: "guia_pedagogica"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "guia_pedagogica", "transversal", "aplicacion"]
entregable: "guia de clase o ruta de aprendizaje"
---
# Fase 00 - Orientacion y diagnostico

## Objetivo de la fase

La fase cero existe para que el alumno no entre en la formacion a ciegas. Antes de aprender herramientas, prompts, agentes o automatizaciones, necesita saber quien es dentro del proceso: que sabe, que quiere conseguir, que ordenador usa, que herramientas tiene, que restricciones tiene y que tipo de proyecto puede abordar. Esta fase evita uno de los errores mas comunes en formaciones de IA: empezar por tecnologia antes de entender el punto de partida.

Una persona puede llegar a esta academia desde perfiles muy diferentes. Puede ser alguien que quiere mejorar su productividad con ChatGPT, una persona que quiere crear documentos y presentaciones, un emprendedor con ideas de automatizacion, un desarrollador que quiere trabajar con Codex, un perfil de operaciones que quiere n8n, o alguien que quiere construir agentes. Si todos empiezan exactamente igual, algunos se aburriran y otros se perderan. La fase cero sirve para ajustar ruta.

## Preguntas que debe responder el alumno

El alumno debe responder por escrito:

- Que quiero conseguir con esta formacion.
- Que tareas hago cada semana que podrian mejorarse con IA.
- Que ideas tengo y nunca llevo a cabo por falta de estructura, tiempo o tecnica.
- Que herramientas uso actualmente.
- Que nivel tecnico tengo.
- Que ordenador uso: Windows, macOS o Linux.
- Si puedo instalar programas.
- Si tengo cuentas de ChatGPT, GitHub, n8n, Claude o Google.
- Si puedo usar API keys.
- Si voy a trabajar con datos sensibles.

Estas respuestas no son burocracia. Son el mapa inicial. Si una persona no puede instalar Docker, no tiene sentido empezar por n8n self-hosted. Si no tiene Git, no puede empezar por GitHub Skills avanzadas. Si trabaja con datos sensibles, hay que introducir privacidad y aprobacion humana antes.

## Diagnostico tecnico

El diagnostico tecnico clasifica al alumno por nivel:

- Nivel A: puede usar Obsidian, navegador, documentos y prompts.
- Nivel B: puede usar cuentas externas y herramientas web.
- Nivel C: puede usar terminal, Git, Node.js o Python.
- Nivel D: puede usar Docker o servicios locales.
- Nivel E: puede trabajar con produccion, permisos, secretos, logs y rollback.

Esta clasificacion no es una etiqueta fija. Es una fotografia. Un alumno puede empezar en A y terminar en C o D. Lo importante es no pedirle cosas de Nivel D cuando todavia no domina A, B y C.

## Diagnostico de objetivos

Tambien hay que clasificar el objetivo. No todo el mundo quiere lo mismo:

- Aprender IA para entender el mundo actual.
- Aplicar IA a su trabajo.
- Crear documentos, presentaciones o contenidos.
- Automatizar tareas.
- Construir un producto.
- Mejorar codigo o proyectos tecnicos.
- Crear agentes.
- Preparar un portfolio.
- Vender servicios.
- Implantar sistemas en una empresa.

Cada objetivo tiene una ruta. Alguien que quiere aplicar IA a su trabajo necesita fase 01 y 02 con mucha fuerza. Alguien que quiere construir sistemas necesita fase 03 y 04. Alguien que quiere vender servicios necesita fase 05 y portfolio.

## Actividad principal

La actividad de esta fase es crear una nota personal de orientacion. Debe llamarse algo como `Mi_ruta_de_formacion.md` y contener:

- Perfil actual.
- Objetivo principal.
- Tres tareas que quiero mejorar.
- Tres ideas que quiero llevar a cabo.
- Sistema operativo.
- Herramientas disponibles.
- Nivel tecnico actual.
- Primer proyecto recomendado.
- Riesgos o restricciones.
- Criterio de exito para la formacion.

Esta nota se convierte en punto de comparacion. Al final de cada fase, el alumno vuelve a ella y actualiza que ha cambiado.

## Entregable

La fase termina con una ruta personal escrita y un proyecto inicial clasificado por nivel tecnico y sistema operativo.

## Criterios para pasar a la fase 01

El alumno puede pasar a la fase de aprendizaje cuando ha escrito su ruta personal, ha hecho la evaluacion diagnostica y ha elegido un primer objetivo realista. No hace falta que sepa usar todas las herramientas. Si supiera todo, no estaria empezando. Pero si necesita claridad suficiente para no perderse.

Debe poder decir: "quiero aprender esto para conseguir esto". Tambien debe poder decir que ordenador usa y que limitaciones tiene. Por ejemplo: "uso Windows, puedo usar navegador y Obsidian, pero todavia no quiero terminal"; o "uso macOS, se Git y quiero construir proyectos con Codex"; o "uso Linux y quiero n8n self-hosted mas adelante".

## Como impartir esta fase

Esta fase puede hacerse en una sesion corta. Primero se presenta la boveda. Despues se explica que la ruta no es lineal para todos. Luego el alumno completa diagnostico, sistema operativo y objetivo. Finalmente se elige un primer proyecto minimo. La conversacion debe ser practica. Si el alumno trae una idea enorme, se reduce a primera version. Si trae una tarea confusa, se convierte en workflow candidato.

## Errores frecuentes

El primer error es elegir proyecto por moda: "quiero un agente" sin saber que problema resuelve. El segundo es ocultar restricciones: no tener permisos de instalacion, no poder usar datos de empresa o no tener cuentas necesarias. El tercero es despreciar fases iniciales porque parecen faciles. La orientacion evita perder tiempo mas adelante.

## Señal de buena orientacion

Una buena orientacion deja al alumno con calma y direccion. No tiene que sentir que ya sabe todo. Tiene que sentir que entiende el mapa, que sabe que paso sigue y que su primer proyecto no le queda gigante.

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

Usar **Fase 00 Orientacion y diagnostico** para producir el entregable definido en la metadata: **guia de clase o ruta de aprendizaje**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Fase 00 Orientacion y diagnostico**.
