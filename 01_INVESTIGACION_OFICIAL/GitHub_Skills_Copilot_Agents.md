---
titulo: "GitHub Skills Copilot Agents"
tipo: "manual_research"
nivel: "transversal"
fase: "aprendizaje"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://skills.github.com/", "https://docs.github.com/"]
tags: ["ai-academy", "manual_research", "transversal", "aprendizaje"]
entregable: "manual con fuentes y practica"
---
# GitHub Skills, Copilot Agent Skills y custom agents

## Para qué sirve este documento

Este archivo desarrolla todo lo que la academia necesita sobre GitHub Skills, Agent Skills para GitHub Copilot, custom agents, `SKILL.md`, herramientas, scripts, MCP y diseño de cursos. Es importante separar dos mundos que tienen nombres parecidos pero objetivos distintos. GitHub Skills es una plataforma educativa para crear cursos guiados en repositorios, normalmente apoyados por GitHub Actions. Agent Skills son carpetas de instrucciones, scripts y recursos que Copilot puede cargar cuando una tarea especializada lo requiere. Ambos conceptos son útiles para la academia, pero no se enseñan igual.

La meta pedagógica no es que el alumno memorice rutas de carpetas. La meta es que entienda cómo empaquetar conocimiento operativo para que una persona o un agente lo use de forma repetible. En un caso empaquetamos aprendizaje para humanos; en el otro empaquetamos procedimientos para agentes.

## GitHub Skills como plataforma educativa

GitHub Skills permite construir cursos basados en repositorios y GitHub Actions. La guía oficial recomienda planificar objetivos claros, construir un repositorio de curso, escribir un README, conectar pasos con workflows de Actions, probar el curso y mantenerlo. Esto encaja muy bien con la filosofía de esta academia porque obliga a diseñar aprendizaje accionable: el alumno no solo lee, sino que trabaja dentro de un repositorio.

Un curso GitHub Skills debe empezar con una pregunta: ¿qué sabrá hacer el alumno al terminar? No "aprenderá GitHub Actions", sino "creará un workflow que se ejecuta al abrir un pull request". No "aprenderá skills", sino "creará una skill `pr-reviewer` que Copilot puede usar para revisar cambios". La documentación de GitHub Skills insiste en que los cursos deben ser prácticos, enfocados y cortos. También recuerda que muchos alumnos abandonan después de 30 a 45 minutos. Esto es una regla excelente para la academia: una unidad práctica debe tener una victoria temprana y un alcance pequeño.

La estructura recomendada de un curso incluye header, start step, tres a cinco pasos de workflow, finish step y footer. Para nuestras clases, esto se puede traducir así: portada, objetivo, prerrequisitos, pasos de práctica, cierre, recap y próximos pasos. Cada paso debe reconocer lo que el alumno acaba de hacer, explicar el siguiente concepto y dar una actividad clara. La formación debe evitar pasos que no enseñan nada: si hay una tarea mecánica que no aporta aprendizaje, se automatiza.

## Agent Skills en GitHub Copilot

Las Agent Skills son carpetas de instrucciones, scripts y recursos que Copilot puede cargar cuando son relevantes. Según la documentación oficial, funcionan con varias superficies de Copilot, incluyendo cloud agent, code review, CLI, app y modos agenticos en IDEs compatibles. Una skill puede ser de proyecto o personal. Las skills de proyecto pueden vivir en `.github/skills`, `.claude/skills` o `.agents/skills`. Las personales pueden vivir en `~/.copilot/skills` o `~/.agents/skills`.

La forma mínima de una skill es un directorio con `SKILL.md`. Ese archivo debe tener YAML frontmatter con `name` y `description`, y un cuerpo Markdown con instrucciones, ejemplos y guías. También puede incluir scripts, ejemplos u otros recursos. Esta idea es muy potente para enseñar profesionalización: todo conocimiento repetible puede convertirse en procedimiento. Si un equipo revisa PRs siempre con los mismos criterios, eso puede ser una skill. Si un equipo migra Supabase con una checklist específica, eso puede ser una skill. Si un equipo despliega a Vercel y revisa logs, env vars y rollback, eso puede ser una skill.

## Qué debe contener un buen `SKILL.md`

Un `SKILL.md` útil debe tener:

- Nombre único, en minúsculas y con guiones si hace falta.
- Descripción clara de cuándo usar la skill.
- Descripción de cuándo no usarla si puede confundirse.
- Inputs esperados.
- Procedimiento paso a paso.
- Criterios de calidad.
- Errores comunes.
- Límites de seguridad.
- Ejemplo de uso.
- Si hay scripts, cómo ejecutarlos y cuándo.

La descripción es especialmente importante porque Copilot decide si una skill aplica mirando el propósito descrito. Una descripción como "ayuda con código" no sirve. Una descripción como "revisa fallos de GitHub Actions en pull requests; usar cuando el usuario pida depurar CI, checks fallidos o logs de Actions; no usar para refactors generales" sí sirve. El alumno debe practicar varias veces la escritura de descripciones.

## Skills versus custom instructions

La documentación de GitHub marca una diferencia muy útil: las custom instructions sirven para instrucciones simples que aplican a casi todas las tareas del repositorio, mientras que las skills sirven para instrucciones más detalladas que solo deben cargarse cuando son relevantes. En clase, esta distinción evita inflar el contexto del agente con reglas innecesarias.

Ejemplos de custom instructions:

- Usar TypeScript estricto.
- No introducir nuevas dependencias sin aprobación.
- Ejecutar `pnpm test` antes de terminar.
- Mantener estilo de componentes existente.

Ejemplos de skills:

- `github-actions-failure-debugging`.
- `pr-reviewer`.
- `deployment-checker`.
- `supabase-migration-reviewer`.
- `n8n-workflow-reviewer`.

Una regla clara para el alumno: si una regla aplica casi siempre, va en instrucciones. Si un procedimiento aplica solo a una tarea concreta, va en skill.

## Scripts y seguridad

Las skills pueden incluir scripts. Esto permite convertir conocimiento en ejecución real: transformar archivos, analizar logs, validar JSON, revisar workflows, generar reportes o ejecutar comprobaciones. Pero también aumenta el riesgo. La documentación oficial advierte que preaprobar herramientas como `shell` o `bash` puede permitir ejecución de comandos sin confirmación. En una formación profesional, esto debe convertirse en una lección de seguridad.

El alumno debe aprender a revisar scripts antes de permitir que un agente los ejecute. También debe aprender a limitar permisos. Una skill instruction-only es más segura que una skill con script. Una skill con script de solo lectura es más segura que una skill que modifica archivos. Una skill que requiere confirmación humana es mejor para acciones destructivas. El patrón correcto es mínimo privilegio.

## Custom agents en GitHub Copilot

Los custom agents son versiones especializadas del agente de Copilot. Se definen mediante perfiles Markdown con YAML frontmatter. Un perfil puede incluir nombre, descripción, prompt, tools permitidas y MCP servers. La diferencia con una skill es que un custom agent representa un rol especializado completo, mientras que una skill representa un procedimiento o capacidad reutilizable.

Por ejemplo, un custom agent `docs-maintainer` puede estar orientado a documentación y tener prohibido modificar código. Un custom agent `security-reviewer` puede revisar cambios buscando vulnerabilidades y malas prácticas. Un custom agent `migration-planner` puede analizar cambios de base de datos y proponer un plan. Las skills pueden complementar a esos agentes con procedimientos concretos.

La documentación oficial también menciona agentes integrados como explore, task, general-purpose, code-review, research y rubber-duck. Esto permite enseñar arquitectura multiagente: un agente principal puede usar subagentes con contextos separados para explorar, revisar, investigar o ejecutar tareas. La clase debe destacar que separar contextos reduce ruido y permite trabajar en paralelo cuando procede.

## MCP en GitHub Copilot

MCP permite conectar agentes con herramientas y datos externos. En el contexto de GitHub Copilot, puede aparecer en perfiles de custom agents y en herramientas disponibles. Para la academia, MCP se enseña como "capa de conexión", no como sinónimo de agente. Un MCP server puede dar acceso a tickets, docs, bases de datos, logs o herramientas internas. El agente decide o solicita usar una tool expuesta por MCP, pero la seguridad depende de permisos, scopes, credenciales y revisión humana.

El alumno debe aprender a preguntar siempre:

- Qué puede leer este agente.
- Qué puede escribir.
- Qué credenciales usa.
- Qué logs deja.
- Qué acciones requieren aprobación.
- Qué ocurre si se equivoca.

## Laboratorios recomendados

### `debugger`

Objetivo: crear una skill que pida reproducción, entorno, input esperado, output real, logs y cambios recientes. El error provocado es dar un bug sin pasos. El alumno debe mejorar la skill para que no proponga fixes sin evidencia.

### `pr-reviewer`

Objetivo: crear una skill de review que priorice bugs, riesgos, seguridad y tests. El error provocado es una review con comentarios de estilo que ignora un fallo real. El alumno debe aprender que una buena review de agente tiene alto signal-to-noise.

### `deployment-checker`

Objetivo: validar antes de deploy. Debe revisar variables de entorno, secrets, build, migraciones, logs, permisos, rollback y alertas.

### `n8n-workflow-reviewer`

Objetivo: analizar un workflow exportado de n8n. Debe revisar credenciales, webhooks, error handling, retries, loops, nodos de IA, herramientas, memory, HITL y seguridad.

## Fuentes oficiales

- [GitHub Skills Quickstart](https://skills.github.com/quickstart)
- [GitHub Skills Content Model](https://skills.github.com/content-model)
- [About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [Adding agent skills for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)
- [About custom agents](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents)
- [GitHub Copilot MCP](https://docs.github.com/en/copilot/concepts/context/mcp)
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

Usar **GitHub Skills Copilot Agents** para producir el entregable definido en la metadata: **manual con fuentes y practica**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **GitHub Skills Copilot Agents**.
