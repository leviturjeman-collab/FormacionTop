---
titulo: "Como llevar a cabo cualquier proyecto"
tipo: "manual_aplicacion_negocio"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "manual_aplicacion_negocio", "transversal", "aplicacion"]
entregable: "plan de aplicacion profesional"
---
# Como llevar a cabo cualquier proyecto con esta boveda

## Objetivo

Este documento convierte la boveda en un sistema operativo de trabajo. Si le pasas la boveda a una persona, este archivo debe permitirle elegir un proyecto, preparar su ordenador, entender requisitos, ejecutar pasos, romper y reparar errores, documentar decisiones y entregar un resultado defendible. No sustituye a los modulos; los conecta.

## Paso 1 - Elegir el tipo de proyecto

Antes de abrir herramientas, define el tipo:

- Documento o presentacion.
- Workflow de ChatGPT.
- Tarea tecnica con Codex.
- Skill para agente.
- Curso GitHub Skills.
- Workflow n8n.
- Agente con tools.
- Sistema RAG.
- Proyecto de produccion.

Cada tipo tiene riesgos distintos. Un documento necesita fuentes y revision. Un workflow necesita entradas y salidas. Codex necesita repo, pruebas y diff. n8n necesita datos, credenciales y ejecuciones. Un agente necesita tools, permisos, logs y evals.

## Paso 2 - Clasificar por ordenador

Abre [[../10_GUIAS_WINDOWS_MAC_LINUX/Compatibilidad_de_proyectos]] y clasifica el proyecto:

- Nivel A: solo Obsidian.
- Nivel B: navegador y cuentas.
- Nivel C: terminal y herramientas locales.
- Nivel D: Docker o self-hosting.
- Nivel E: produccion.

Despues abre la guia del sistema:

- [[../10_GUIAS_WINDOWS_MAC_LINUX/Windows]]
- [[../10_GUIAS_WINDOWS_MAC_LINUX/macOS]]
- [[../10_GUIAS_WINDOWS_MAC_LINUX/Linux]]

## Paso 3 - Preparar entorno

Antes de ejecutar, comprobar:

- Carpeta del proyecto.
- Terminal correcta.
- Git si hay repositorio.
- Node.js o Python si hay scripts.
- Docker si hay servicios.
- API keys si hay modelos o APIs.
- Cuentas externas.
- Permisos.

## Paso 4 - Definir objetivo y criterio de terminado

Todo proyecto debe tener:

- Problema.
- Usuario.
- Resultado esperado.
- Entradas.
- Salidas.
- Restricciones.
- Fuentes.
- Criterio de aceptacion.
- Riesgos.

Si esto no esta claro, no se empieza a construir.

## Paso 5 - Construir pequeno

Primero se construye la version minima:

- Prompt minimo.
- Script minimo.
- Workflow minimo.
- Skill instruction-only.
- Agente con una sola tool.
- RAG con pocas fuentes.

Despues se aumenta complejidad. Esta regla evita perder horas depurando un sistema demasiado grande.

## Paso 6 - Romper deliberadamente

Todo proyecto debe tener errores provocados:

- Falta contexto.
- API key incorrecta.
- JSON roto.
- Permiso insuficiente.
- Rate limit.
- Tool ambigua.
- Fuente contradictoria.
- Eval fallida.
- Coste excesivo.

## Paso 7 - Reparar con evidencia

No se adivina. Se revisa:

- Logs.
- Inputs.
- Outputs.
- Status codes.
- Diffs.
- Tests.
- Variables.
- Credenciales.
- Permisos.
- Tokens.
- Evals.

## Paso 8 - Documentar

El entregable debe incluir:

- Que hace.
- Como funciona.
- Como se ejecuta.
- Que necesita.
- Que falla comunmente.
- Como se verifica.
- Como se mantiene.

## Paso 9 - Defender

La persona debe poder explicar:

- Que parte es determinista.
- Que parte depende del LLM.
- Que tools usa.
- Que permisos tiene.
- Donde hay aprobacion humana.
- Que logs quedan.
- Cuanto cuesta.
- Como se evalua.
- Que haria si falla.

## Enlaces clave

- [[../DOCUMENTO_MAESTRO]]
- [[../00_EMPIEZA_AQUI/Ruta_150_Lecciones]]
- [[../10_GUIAS_WINDOWS_MAC_LINUX/README]]
- [[../10_GUIAS_WINDOWS_MAC_LINUX/Checklist_entrega_multisistema]]
- [[../07_EXAMENES_RUBRICAS_DEFENSA/Defensa_final]]
- [[../08_PLANTILLAS_REUTILIZABLES/Plantilla_proyecto]]
- [[../13_PROYECTOS_REALES_Y_SKILLS/README]]
- [[../13_PROYECTOS_REALES_Y_SKILLS/04_Matrices/Matriz_de_proyectos_por_fase]]
- [[../13_PROYECTOS_REALES_Y_SKILLS/04_Matrices/Catalogo_de_skills_eficientes]]
- [[../14_ESTANDAR_DE_CALIDAD/Politica_de_codigo_real]]
## Ejemplo completo de uso

Supongamos que una persona quiere crear un agente que lea solicitudes de clientes, proponga una respuesta y pida aprobacion antes de enviarla. Primero clasifica el proyecto. No es solo documento, porque hay workflow y posiblemente herramientas externas. Si se hace en n8n cloud, puede ser Nivel B o C. Si se hace con n8n self-hosted, Docker y credenciales reales, sube a Nivel D. Si envia emails reales a clientes, entra en Nivel E.

Despues identifica el sistema operativo. En Windows, las instrucciones deben usar PowerShell y avisar sobre OneDrive si hay archivos locales. En macOS, se usa Terminal y Homebrew si hay dependencias. En Linux, se indica distribucion y permisos si hay Docker.

Luego define arquitectura:

- Entrada: solicitud de cliente.
- Paso determinista: validar campos obligatorios.
- Paso LLM: redactar respuesta.
- Tool: consultar base de conocimiento.
- Human-in-the-loop: aprobar envio.
- Logs: solicitud, respuesta propuesta, aprobador, timestamp.
- Evals: casos de tono, precision, datos sensibles y escalado.

Despues construye minimo: primero solo redactar respuesta. Luego añade fuente. Luego añade aprobacion. Luego conecta envio. En cada etapa provoca errores: falta email, fuente contradictoria, tool sin permisos, aprobacion ausente o coste excesivo.

El entregable final no es solo el agente funcionando. Es el agente documentado: requisitos, sistema operativo, instalacion, credenciales, pruebas, errores, logs, evals y rollback.

## Criterio para "cualquier tipo de proyecto"

La boveda no promete que una persona pueda construir cualquier cosa sin aprender nada. Lo que si debe permitir es que cualquier proyecto se pueda clasificar, descomponer y ejecutar con metodo. El metodo es:

1. Definir problema.
2. Clasificar nivel tecnico.
3. Preparar ordenador.
4. Elegir herramientas.
5. Construir minimo.
6. Romper.
7. Reparar.
8. Evaluar.
9. Documentar.
10. Defender.

Con este proceso, un alumno puede abordar documentos, presentaciones, automatizaciones, agentes, skills, RAG, Codex, n8n o produccion sin depender de instrucciones sueltas.

## Resultado esperado

Al terminar, el alumno no solo tiene un artefacto. Tiene una forma de pensar. Puede mirar una idea y convertirla en requisitos, entorno, pasos, verificacion, riesgos y entrega. Esa es la competencia transferible que hace que la boveda sirva para muchos proyectos distintos, no solo para repetir los ejemplos incluidos.
---

<!-- CLASIFICACION_ORDENADOR -->

## Clasificacion por ordenador y sistema operativo

Antes de convertir esta nota en una practica, laboratorio, documento o proyecto para otra persona, clasificala segun el ordenador del alumno y el nivel tecnico de ejecucion. Usa estas guias:

- [[10_GUIAS_WINDOWS_MAC_LINUX/Windows]] para alumnos que trabajen con PowerShell, rutas `C:\...`, OneDrive, Git for Windows, Node.js, Python o Docker Desktop.
- [[10_GUIAS_WINDOWS_MAC_LINUX/macOS]] para alumnos que trabajen con Terminal/zsh, rutas `/Users/...`, Homebrew, permisos de macOS o Apple Silicon.
- [[10_GUIAS_WINDOWS_MAC_LINUX/Linux]] para alumnos que trabajen con Bash, rutas `/home/...`, gestores `apt`, `dnf` o `pacman`, permisos, servicios y Docker Engine.
- [[10_GUIAS_WINDOWS_MAC_LINUX/Compatibilidad_de_proyectos]] para clasificar la practica como Nivel A, B, C, D o E.
- [[10_GUIAS_WINDOWS_MAC_LINUX/Checklist_entrega_multisistema]] para comprobar que cualquier persona pueda seguirla sin depender de explicaciones orales.

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

Usar **Como llevar a cabo cualquier proyecto** para producir el entregable definido en la metadata: **plan de aplicacion profesional**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Como llevar a cabo cualquier proyecto**.
