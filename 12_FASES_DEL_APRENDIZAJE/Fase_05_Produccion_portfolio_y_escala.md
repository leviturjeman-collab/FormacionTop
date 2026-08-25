---
titulo: "Fase 05 Produccion portfolio y escala"
tipo: "guia_pedagogica"
nivel: "avanzado"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "guia_pedagogica", "avanzado", "aplicacion"]
entregable: "guia de clase o ruta de aprendizaje"
---
# Fase 05 - Produccion, portfolio y escala

## Objetivo de la fase

La quinta fase convierte proyectos en resultados presentables, mantenibles y defendibles. No todo alumno necesita desplegar un sistema a produccion real, pero todos deben entender que cambia cuando un proyecto deja de ser una demo. En produccion aparecen usuarios, datos, secretos, permisos, coste, logs, errores, mantenimiento, rollback, responsabilidad y evaluaciones.

Tambien aparece el portfolio. Un alumno que termina la formacion debe poder enseñar algo: una boveda organizada, documentos, workflows, proyectos, skills, automatizaciones, agentes o sistemas evaluados. El portfolio no es solo escaparate. Es evidencia de competencia.

## Que significa produccion

Produccion no significa "subir algo a internet" sin mas. Significa que un sistema se usa en un contexto real o casi real. Puede tocar clientes, compañeros, datos internos, dinero, reputacion o procesos. Por eso requiere controles.

Checklist de produccion:

- Secretos protegidos.
- Permisos minimos.
- Logs.
- Evals.
- Coste medido.
- Rate limits.
- Aprobacion humana.
- Rollback.
- Documentacion operativa.
- Responsable.

Si un proyecto no tiene estas piezas, puede ser demo, prototipo o laboratorio, pero no produccion.

## Portfolio

El portfolio debe organizar proyectos por tipo:

- Workflows de trabajo.
- Documentos y presentaciones.
- Skills.
- Proyectos Codex.
- Workflows n8n.
- Sistemas RAG.
- Agentes con tools.
- Evaluaciones.
- Casos de error y reparacion.

Cada pieza del portfolio debe explicar problema, solucion, herramientas, sistema operativo, nivel tecnico, riesgos y resultado. No basta con capturas bonitas. Debe mostrar pensamiento.

## Archivos clave

- [[../04_CLASES_POR_HERRAMIENTA/08_Produccion_Seguridad_Evals/00_Resumen/README]]
- [[../06_PROYECTOS_PARA_PORTFOLIO/Proyecto_05_Agente_Produccion/README]]
- [[../07_EXAMENES_RUBRICAS_DEFENSA/Defensa_final]]
- [[../07_EXAMENES_RUBRICAS_DEFENSA/Rubrica_proyectos]]
- [[../10_GUIAS_WINDOWS_MAC_LINUX/Checklist_entrega_multisistema]]
- [[../11_MANUAL_PARA_CREAR_PROYECTOS/Como_llevar_a_cabo_cualquier_proyecto]]

## Resultado de la fase

La fase termina con un proyecto defendible y un portfolio inicial. El alumno puede explicar que aprendio, que construyo, que errores reparo y que podria vender, implantar o seguir desarrollando.

## Escala

Escalar no significa añadir complejidad. Significa hacer que el sistema sea mas repetible, documentado, seguro y util para mas personas. A veces escalar es convertir un prompt en plantilla. A veces es convertir una tarea en skill. A veces es pasar de n8n cloud a self-hosted. A veces es añadir evals. A veces es formar a otras personas.

La decision de escala debe responder a necesidad real, no a entusiasmo tecnico.

## Criterio de cierre de la formacion

La formacion se considera cerrada cuando el alumno puede enseñar su portfolio y defender al menos un proyecto completo. Defender no significa vender humo. Significa explicar problema, usuario, herramientas, arquitectura, sistema operativo, requisitos, riesgos, pruebas, coste y mantenimiento.

El proyecto final puede ser tecnico o no tecnico. Un portfolio de workflows documentados puede ser excelente para un perfil de operaciones o direccion. Un agente con tools y evals puede ser adecuado para un perfil tecnico. Lo importante es que la evidencia coincida con el objetivo del alumno definido en fase 00.

## Como impartir esta fase

Esta fase debe parecerse a una revision profesional. El alumno presenta, recibe preguntas, detecta huecos y corrige. El profesor debe preguntar por fallos, no solo por funcionalidades. Que pasa si la API cae. Que pasa si cambia el formato. Que pasa si el modelo inventa. Que pasa si se filtra una clave. Que pasa si el coste se dispara.

## Errores frecuentes

El error comun es presentar solo lo que funciona. En proyectos reales importa tambien lo que falla y como se controla. Otro error es no documentar instalacion, lo que hace que el proyecto solo funcione en el ordenador del creador. Otro es no crear evals ni criterios de aceptacion.

## Señal de cierre real

Otra persona puede leer el proyecto, entenderlo, ejecutarlo o evaluarlo, y el alumno puede responder preguntas dificiles sin improvisar. Ese es el punto donde una formacion se transforma en capacidad profesional.

## Actividades recomendadas

La actividad principal es la defensa final. El alumno presenta su proyecto, muestra evidencias y responde preguntas de riesgo. No se evalua solo la funcionalidad. Se evalua claridad, seguridad, mantenibilidad, criterio y capacidad de explicar decisiones.

Otra actividad es la auditoria de portfolio. El alumno revisa cada pieza y pregunta: que demuestra esto sobre mi capacidad. Si una pieza no demuestra nada claro, se mejora o se elimina. Un portfolio fuerte no es grande; es legible, honesto y defendible.

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

Usar **Fase 05 Produccion portfolio y escala** para producir el entregable definido en la metadata: **guia de clase o ruta de aprendizaje**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Fase 05 Produccion portfolio y escala**.
