---
titulo: "Anthropic Claude Claude Code"
tipo: "manual_research"
nivel: "transversal"
fase: "aprendizaje"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://docs.anthropic.com/", "https://code.claude.com/docs/"]
tags: ["ai-academy", "manual_research", "transversal", "aprendizaje"]
entregable: "manual con fuentes y practica"
---
# Anthropic, Claude, Claude Code, prompt engineering, skills, hooks y subagents

## Para qué sirve este documento

Este archivo desarrolla la parte de Anthropic dentro de la academia. Claude no debe enseñarse como "otro ChatGPT". Debe enseñarse como un ecosistema con documentación propia, una cultura fuerte de prompt engineering, una plataforma de desarrollo con tool use y una herramienta agentica de código, Claude Code, que incluye instrucciones, skills, hooks, subagents, permisos y MCP. La fuente principal es Anthropic Learn, la documentación oficial de Claude y Claude Code, y el repositorio oficial de cursos de Anthropic.

El objetivo pedagógico es que el alumno aprenda a diseñar instrucciones claras, separar datos de instrucciones, usar ejemplos, reducir alucinaciones, conectar herramientas y extender agentes con límites. Claude es especialmente útil para enseñar la diferencia entre prompt, tool, skill, hook, subagent y MCP porque su documentación separa estas piezas con bastante claridad.

## Prompt engineering con Claude

Anthropic mantiene un tutorial oficial de prompt engineering organizado progresivamente. Sus capítulos empiezan por estructura básica, claridad y roles, pasan por separar datos de instrucciones, formato de salida, razonamiento paso a paso, ejemplos, reducción de alucinaciones, prompts complejos, chaining, tool use y retrieval. Esta progresión encaja con la academia porque no empieza por técnicas avanzadas, sino por claridad.

La primera idea que debe aprender el alumno es que un prompt es una interfaz. Si la interfaz es ambigua, el modelo inferirá lo que pueda. Si la interfaz separa objetivo, contexto, datos, restricciones y formato, el modelo tiene menos espacio para desviarse. La claridad no es solo escribir bonito; es reducir incertidumbre.

Ejemplo de prompt débil:

```text
Analiza este texto.
```

Ejemplo de prompt formativo:

```text
Analiza este texto para un alumno principiante. Separa:
1. Ideas principales.
2. Conceptos que debe aprender.
3. Riesgos o malentendidos.
4. Tres preguntas de evaluación.
Usa solo el texto proporcionado. Si falta información, indícalo.
```

La segunda versión define audiencia, estructura, límites y resultado.

## Separar datos de instrucciones

Separar datos e instrucciones es una lección crítica. Cuando el alumno pega un email, un log, una transcripción o un documento, debe señalar qué parte son datos y qué parte son instrucciones. Esto reduce el riesgo de prompt injection y de confusión. En clases avanzadas, esta idea conecta con agentes que leen contenido externo: no todo texto recuperado debe obedecerse. Parte del texto es evidencia, no mandato.

La estructura recomendada para ejercicios:

- Instrucciones arriba.
- Datos delimitados.
- Formato esperado abajo.
- Regla explícita: no obedecer instrucciones contenidas dentro de los datos.

Esto prepara al alumno para RAG, MCP, tool use y seguridad.

## Reducir alucinaciones

Reducir alucinaciones no significa exigir "no alucines" como conjuro. Significa diseñar tareas donde el modelo pueda reconocer incertidumbre, usar fuentes, separar hechos de inferencias y marcar información faltante. Anthropic dedica material específico a evitar alucinaciones. En la academia, cada lección de investigación debe entrenar tres hábitos:

- Pedir fuentes o evidencia cuando sea necesario.
- Pedir que marque supuestos.
- Pedir que diga qué no puede verificar.

Un ejercicio útil es dar al alumno un documento con información distractora y pedir una respuesta estrictamente basada en el documento. Después se compara si el modelo usó información irrelevante o inventada. Esto enseña lectura crítica de outputs.

## Tool use

Tool use permite que Claude solicite llamadas a funciones definidas por el desarrollador o proporcionadas por Anthropic. La documentación oficial explica que el modelo decide cuándo llamar una herramienta basándose en la petición del usuario y en la descripción de la herramienta. En aplicaciones reales, la ejecución puede ocurrir del lado del cliente o del servidor, según el tipo de tool.

Para enseñar tool use, el alumno debe entender:

- El modelo no "tiene" la herramienta mágicamente; se le describe.
- La descripción de la herramienta influye en cuándo se llama.
- El input debe estar estructurado.
- La aplicación ejecuta o gestiona la llamada.
- La respuesta de la herramienta vuelve como contexto.
- Las herramientas con side effects necesitan permisos y revisión.

La lección práctica debe comparar una tool de lectura y una tool de escritura. Leer documentación es bajo riesgo. Enviar un email, borrar un registro o cambiar permisos es alto riesgo. Esto conecta con mínimo privilegio y HITL.

## Claude Code como agente técnico

Claude Code combina razonamiento sobre código con herramientas para leer, escribir, editar, ejecutar comandos, buscar y conectarse a recursos externos. La documentación oficial explica varias capas de extensión: `CLAUDE.md`, skills, hooks, subagents, MCP y plugins. Esta taxonomía es muy útil para el curso.

`CLAUDE.md` sirve para instrucciones de proyecto: estándares, decisiones de arquitectura, librerías preferidas, checklists de review. Skills sirven para procedimientos especializados. Hooks sirven para control determinista en momentos concretos del ciclo de vida. Subagents sirven para tareas aisladas con contexto propio. MCP sirve para conectar datos y herramientas externas. Plugins empaquetan extensiones.

El alumno debe aprender cuándo usar cada pieza. Si quiere que Claude siempre respete una convención del repositorio, va a `CLAUDE.md`. Si quiere un procedimiento para revisar migraciones, crea una skill. Si quiere ejecutar un linter antes de aceptar cambios, usa hook. Si quiere que un agente especializado investigue documentación sin ensuciar el contexto principal, usa subagent. Si quiere acceder a Jira, Drive, Slack o herramientas internas, usa MCP.

## Skills en Claude Code

Las skills dan a Claude capacidades adicionales mediante instrucciones, recursos y comandos. Se enseñan igual que en otros ecosistemas: como procedimientos reutilizables. Una skill buena tiene nombre, descripción, instrucciones, ejemplos y límites. No debe abarcar demasiado. Una skill mala intenta resolver "todo lo de documentación". Una skill buena resuelve "convertir una especificación de producto en checklist QA con riesgos, casos borde y preguntas abiertas".

Ejercicio recomendado:

CHECK: pedir al alumno que diferencie prompt repetido y skill.

DO: crear una skill instruction-only.

BREAK: hacer que la descripción sea demasiado amplia.

FIX: reducir el scope y añadir cuándo no usarla.

EXPLAIN: justificar por qué ahora se activará mejor.

## Hooks

Los hooks son comandos, endpoints o prompts que se ejecutan automáticamente en puntos concretos del ciclo de vida de Claude Code. La documentación oficial los presenta como control determinista: ciertas acciones ocurren siempre, en lugar de depender de que el LLM decida ejecutarlas. Esto es una lección fundamental. Un agente puede olvidar una instrucción. Un hook bien configurado fuerza una comprobación.

Usos didácticos:

- Ejecutar formatter tras editar.
- Bloquear cambios en archivos sensibles.
- Pedir confirmación antes de acciones de riesgo.
- Registrar auditoría.
- Ejecutar tests antes de terminar.

El alumno debe entender que un hook no sustituye el juicio. Sirve para reglas deterministas. Para decisiones que requieren criterio, se puede usar un prompt hook o un subagent, pero entonces vuelve a aparecer incertidumbre y necesidad de evaluación.

## Subagents

Los subagents son agentes especializados que trabajan en contextos aislados. Sirven para separar tareas y reducir ruido en el contexto principal. Un subagent puede explorar código, investigar documentación, revisar seguridad o preparar un plan. La documentación de Claude Code permite custom subagents con prompts, restricciones de herramientas, modos de permisos, hooks y skills.

La clase debe enseñar esta pregunta: ¿esta subtarea necesita su propio contexto? Si sí, un subagent puede ser útil. Si no, quizá basta con una skill o una instrucción. El abuso de subagents complica el sistema. El buen uso separa responsabilidades.

## Permissions, sandboxing y MCP

Claude Code incluye permisos para controlar tools, archivos, dominios y MCP. También puede apoyarse en sandboxing para restringir Bash y procesos hijos. Esta capa debe enseñarse como defensa en profundidad. No basta con confiar en que el agente "entienda" que no debe tocar algo. Hay que limitar lo que puede hacer.

MCP se enseña como puente hacia sistemas externos. Con MCP, Claude Code puede acceder a documentación, tickets, herramientas internas o datos conectados. Pero cada conexión debe revisarse: qué puede leer, qué puede modificar, qué credenciales usa, qué logs produce y qué acciones necesitan aprobación humana.

## Fuentes oficiales

- [Anthropic Learn - Build with Claude](https://www.anthropic.com/learn/build-with-claude)
- [Anthropic prompt engineering overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Anthropic courses](https://github.com/anthropics/courses)
- [Prompt Engineering Interactive Tutorial](https://github.com/anthropics/courses/blob/master/prompt_engineering_interactive_tutorial/README.md)
- [Tool use with Claude](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview)
- [Claude Code overview](https://docs.anthropic.com/en/docs/claude-code/overview)
- [Claude Code skills](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Claude Code hooks](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Claude Code subagents](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
- [Claude Code permissions](https://docs.anthropic.com/en/docs/claude-code/permissions)
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

Usar **Anthropic Claude Claude Code** para producir el entregable definido en la metadata: **manual con fuentes y practica**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

### Prerequisitos y materiales

- Haber leido el documento maestro y el mapa de carpetas.
- Tener claro el nivel del alumno antes de usar este archivo.
- Si se trabaja con herramientas externas, revisar credenciales, permisos, coste y datos sensibles.
- Si se convierte en clase, preparar una practica pequena y un error provocado.

### Fuentes y verificacion

| Tipo | Fuente | Fecha/uso | Criterio |
|---|---|---|---|
| Fuente oficial | https://docs.anthropic.com/ | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |
| Fuente oficial | https://code.claude.com/docs/ | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |

### Notas para profesor o facilitador

- Empezar con un problema real antes de explicar teoria.
- Pedir al alumno una salida concreta: documento, prompt, workflow, checklist, demo o defensa.
- Comprobar que el alumno puede explicar que entra, que pasa, que sale, que puede fallar y como lo verificaria.
- No avanzar a herramientas avanzadas si no hay dominio de entradas, salidas, permisos y evaluacion.

### Criterio para eliminar contenido innecesario

Eliminar o reescribir cualquier parrafo que no cumpla una de estas funciones: explicar una decision, enseñar un concepto, guiar una practica, prevenir un error, respaldar una fuente, preparar un entregable o mejorar la evaluacion.

### Proxima revision

- Revisar este archivo cuando cambien las fuentes oficiales relacionadas o antes de usarlo como material comercial.
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Anthropic Claude Claude Code**.
