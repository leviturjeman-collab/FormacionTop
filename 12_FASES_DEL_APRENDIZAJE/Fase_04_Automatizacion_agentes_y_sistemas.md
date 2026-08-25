---
titulo: "Fase 04 Automatizacion agentes y sistemas"
tipo: "guia_pedagogica"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "guia_pedagogica", "transversal", "aplicacion"]
entregable: "guia de clase o ruta de aprendizaje"
---
# Fase 04 - Automatizacion, agentes y sistemas

## Objetivo de la fase

La cuarta fase lleva los proyectos hacia sistemas. Aqui el alumno aprende a unir workflows, tools, skills, MCP, memory, RAG, human-in-the-loop y agentes. La diferencia con fases anteriores es que ya no se trata solo de producir un documento o construir una pieza aislada. Se trata de diseñar un sistema donde diferentes partes colaboran.

Esta fase exige criterio porque los agentes pueden actuar, consumir tokens, llamar herramientas, leer datos y modificar sistemas. Por eso la automatizacion no debe enseñarse como "conecta cosas y ya". Debe enseñarse como arquitectura: que entra, que decide, que tool se llama, que permisos existen, que logs quedan, que humano aprueba y como se evalua.

## Conceptos principales

La fase incluye:

- Workflows deterministas.
- AI Agents.
- Tools.
- Skills.
- MCP.
- Memory.
- RAG.
- Human-in-the-loop.
- Logs.
- Tokens y coste.
- Evaluaciones.
- Permisos.
- Seguridad.

El alumno debe diferenciar que parte del sistema es determinista y que parte depende del modelo. Un webhook que recibe datos es determinista. Una condicion `if` puede ser determinista. Un LLM redactando respuesta no lo es. Un agente eligiendo tool tampoco. Esa diferencia marca donde hay que revisar y evaluar.

## Herramientas clave

Archivos clave:

- [[../04_CLASES_POR_HERRAMIENTA/06_n8n_Automation_AI/00_Resumen/README]]
- [[../04_CLASES_POR_HERRAMIENTA/07_Agentes_MCP_Skills/00_Resumen/README]]
- [[../01_INVESTIGACION_OFICIAL/n8n]]
- [[../01_INVESTIGACION_OFICIAL/GitHub_Skills_Copilot_Agents]]
- [[../01_INVESTIGACION_OFICIAL/Anthropic_Claude_Claude_Code]]
- [[../05_PRACTICAS_Y_EJERCICIOS/Agentes/Lab_agente_con_permisos]]
- [[../06_PROYECTOS_PARA_PORTFOLIO/Proyecto_04_Sistema_RAG/README]]

## Modelo mental

```text
Usuario -> Producto -> Workflow -> LLM -> Decision -> Tool / Skill / MCP -> Sistema externo
                                      -> Logs
                                      -> Coste
                                      -> Aprobacion humana
                                      -> Evals
```

Este modelo se repite en toda la fase. El alumno debe poder dibujarlo para cada proyecto.

## Resultado de la fase

La fase termina con una arquitectura agentica o automatizacion avanzada documentada. Puede ser n8n, Codex skills, GitHub Agent Skills, Claude Code subagents, MCP o una combinacion. Lo importante es que el alumno sepa defender decisiones.

## Criterios para pasar a la fase 05

El alumno puede pasar a produccion cuando su automatizacion o agente tiene controles basicos. Debe haber separado lectura y escritura, definido permisos, incluido logs, pensado coste, añadido aprobacion humana si hay acciones sensibles y creado alguna evaluacion. Si un agente actua sin limites, no esta listo.

La pregunta de salida es: que podria salir mal y como lo detectarias. Si el alumno responde con precision, puede avanzar. Si dice "lo iria viendo", necesita mas trabajo.

## Como impartir esta fase

Esta fase debe enseñarse con diagramas y laboratorios. Primero se dibuja arquitectura. Despues se construye version minima. Luego se rompe. Despues se añaden controles. Es importante no empezar por un agente complejo. Se empieza por workflow determinista, luego LLM, luego tool, luego aprobacion humana.

El profesor debe insistir en que no todo necesita agente. A veces una automatizacion simple es mejor. El alumno debe aprender a justificar complejidad.

## Errores frecuentes

Errores comunes: tool demasiado poderosa, falta de logs, memory con datos sensibles, RAG sin evaluacion, MCP conectado sin revisar permisos, agente con loops, coste sin limite y aprobacion humana ausente.

## Señal de madurez agentica

El alumno deja de decir "el agente hace cosas" y empieza a decir "el workflow valida datos, el LLM decide esta parte, la tool solo puede leer, la accion de escritura requiere aprobacion y los logs guardan esto". Esa precision marca madurez.

## Actividades recomendadas

Una actividad clave es el "mapa de permisos". El alumno dibuja cada tool del sistema y escribe si puede leer, escribir, borrar, publicar o enviar. Despues marca que acciones requieren aprobacion humana. Esta actividad suele revelar riesgos que no se ven en una demo.

Otra actividad es el "agente sin agente": antes de usar un AI Agent, el alumno intenta resolver el caso con workflow determinista. Si no puede, justifica por que necesita decision del modelo. Esto evita automatizaciones demasiado complejas.

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

Usar **Fase 04 Automatizacion agentes y sistemas** para producir el entregable definido en la metadata: **guia de clase o ruta de aprendizaje**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Fase 04 Automatizacion agentes y sistemas**.
