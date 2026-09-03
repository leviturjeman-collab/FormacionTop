---
titulo: "Ruta maestra de lecciones"
tipo: "indice"
nivel: "transversal"
fase: "orientacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "indice", "transversal", "orientacion"]
entregable: "mapa de navegacion"
---
# Ruta maestra de lecciones

Esta nota es el árbol maestro. No todas las lecciones tienen que producirse como clase independiente desde el día uno, pero cada punto representa una unidad que puede convertirse en documento, slide deck, vídeo, taller o evaluación.

## Nivel 0 - Fundamentos de IA

1. Qué es un LLM.
2. Qué puede y qué no puede hacer un modelo.
3. Tokens, contexto y coste.
4. Instrucciones, contexto y salida esperada.
5. Alucinaciones y verificación.
6. Privacidad, datos sensibles y límites.
7. Prompting básico.
8. Prompting estructurado.
9. Uso responsable en trabajo real.
10. De tarea aislada a flujo repetible.
11. Cuándo usar IA y cuándo no.
12. Primer proyecto: asistente personal de trabajo.

## Nivel 1 - ChatGPT y workflows

13. ChatGPT como interfaz de trabajo.
14. Chat, Work y agentes.
15. Definir objetivo, contexto y límite.
16. Convertir una tarea repetida en workflow.
17. Pedir formatos de salida.
18. Revisar y editar resultados.
19. Crear instrucciones reutilizables.
20. Usar archivos como contexto.
21. Diseñar checklist de calidad.
22. Delegar investigación.
23. Delegar síntesis.
24. Primer workflow documentado.

## Nivel 2 - Codex

25. Qué es Codex y para qué sirve.
26. Superficies: app, CLI, IDE y cloud.
27. Preparar un repositorio para Codex.
28. Escribir tareas con definición de terminado.
29. Contexto mínimo viable.
30. Plan antes de editar.
31. Leer diffs.
32. Probar cambios.
33. Revisar PRs.
34. Modernizar código.
35. Crear skills para Codex.
36. Proyecto: agente de mantenimiento técnico.

## Nivel 3 - Claude y Claude Code

37. Claude como modelo y como producto.
38. Prompt engineering oficial de Anthropic.
39. Claridad, roles y ejemplos.
40. Separar instrucciones de datos.
41. Reducir alucinaciones.
42. Tool use con Claude.
43. Claude Code.
44. `CLAUDE.md` e instrucciones.
45. Permisos.
46. Skills.
47. Hooks.
48. Subagents.
49. MCP.
50. Proyecto: subagentes para revisión de proyecto.

## Nivel 4 - Gemini

51. Gemini API e Interactions API.
52. Text generation.
53. Structured outputs.
54. Function calling.
55. Built-in tools.
56. Grounding con Google Search.
57. URL context.
58. Context caching.
59. Live API.
60. Tokens antes de ejecutar.
61. Usage después de ejecutar.
62. Agentes administrados.
63. Seguridad de agentes.
64. Proyecto: medición de coste y uso.

## Nivel 5 - GitHub Skills y Copilot agents

65. GitHub Skills como plataforma educativa.
66. Diseñar cursos cortos.
67. GitHub Actions para cursos.
68. Agent Skills.
69. Estructura `SKILL.md`.
70. Skills versus instrucciones.
71. Custom agents.
72. Herramientas permitidas.
73. MCP en GitHub Copilot.
74. Skills por repositorio.
75. Laboratorio `debugger`.
76. Laboratorio `pr-reviewer`.
77. Laboratorio `deployment-checker`.
78. Proyecto: skill profesional publicable.

## Nivel 6 - n8n base

79. Qué es n8n.
80. Workflows.
81. Nodes.
82. JSON.
83. Expressions.
84. Credenciales.
85. APIs.
86. HTTP Request.
87. Webhooks.
88. Branching.
89. Loops.
90. Error handling.
91. Executions.
92. Source control.
93. Environments.
94. Proyecto: workflow operativo sin IA.

## Nivel 7 - n8n con IA

95. Advanced AI en n8n.
96. LLM nodes.
97. AI Agent node.
98. Tools.
99. Memory.
100. RAG.
101. Vector stores.
102. Human fallback.
103. Human-in-the-loop.
104. Evaluations.
105. MCP Client.
106. MCP Server.
107. Seguridad.
108. Queue mode.
109. Self-hosting.
110. Proyecto: agente n8n controlado.

## Nivel 8 - Agentes, MCP y skills

111. Diferencia entre prompt e instruction.
112. Diferencia entre tool y skill.
113. Diferencia entre skill y agente.
114. MCP como protocolo de contexto.
115. Tools deterministicos.
116. Tools con side effects.
117. Permisos mínimos.
118. Sandboxing.
119. Aprobación humana.
120. Auditoría.
121. Logs.
122. Memory.
123. Context engineering.
124. Recuperación de información.
125. Multiagente.
126. Proyecto: agente con herramientas seguras.

## Nivel 9 - Producción

127. Qué significa producción en IA.
128. Gestión de secretos.
129. Rate limits.
130. 401, 403 y 429.
131. Costes por token.
132. Presupuesto por workflow.
133. Observabilidad.
134. Evals.
135. Test sets.
136. Regression testing.
137. Red teaming.
138. Seguridad de datos.
139. RBAC.
140. Deploy.
141. Rollback.
142. Incidentes.
143. Postmortem.
144. Documentación operativa.
145. Soporte y mantenimiento.
146. Proyecto final: sistema productivo.
147. Defensa del proyecto.
148. Auditoría final.
149. Roadmap personal.
150. Certificación interna.
---

# Desarrollo completo - Ruta maestra de lecciones

## Funcion dentro de la academia

Esta nota forma parte de la boveda de Obsidian de AI Professional Academy y debe leerse como material de estudio, no como un simple indice. Su funcion es desarrollar el tema Ruta maestra de lecciones dentro del contexto de formacion profesional de IA, automatizacion, agentes, workflows, documentacion y produccion. El objetivo es que el alumno pueda abrir este archivo, entender que papel ocupa en la formacion, estudiar el concepto con calma, practicarlo y despues convertirlo en una idea propia, un documento, una presentacion, un laboratorio o una pieza de un proyecto final.

La regla de esta academia es que cada archivo importante debe poder sostener una clase. Eso significa que no basta con enumerar conceptos. Hay que explicar para que sirve el tema, como funciona, que decisiones obliga a tomar, que errores aparecen en la practica y como se verifica que el alumno lo ha entendido. Esta nota sigue esa logica: primero situa el concepto, despues lo convierte en proceso, luego propone una practica, despues introduce errores provocados y finalmente plantea evaluacion y transferencia a trabajo real.

## Modelo mental

El modelo mental recomendado es pensar en cada tema como una pieza dentro de un sistema mayor. Un usuario formula una necesidad. Esa necesidad se convierte en producto, workflow, agente, documento, skill o automatizacion. En ese camino aparecen instrucciones, contexto, herramientas, permisos, datos, coste, revision humana y evaluacion. Si el alumno aprende solo una definicion, podra repetir palabras. Si entiende el sistema, podra disenar soluciones.

Para Ruta maestra de lecciones, la pregunta central es: que cambia en el trabajo del alumno cuando domina este tema. Si el tema es una fuente, debe aprender a usarla para no depender de opiniones genericas. Si es una leccion, debe aprender a explicar y aplicar el concepto. Si es un laboratorio, debe construir algo, romperlo y repararlo. Si es una evaluacion, debe demostrar competencia observable. Si es una plantilla, debe producir materiales consistentes. Si es un modulo, debe conectar varias lecciones en una progresion clara.

## Como se trabaja paso a paso

Primero, el alumno debe leer la nota completa y subrayar los terminos que no domina. No se avanza a una herramienta avanzada si el vocabulario basico no esta claro. Segundo, debe identificar la entrada y la salida del tema. En IA y automatizacion casi todo puede explicarse asi: que datos entran, que transformacion ocurre, que decision se toma y que resultado sale. Tercero, debe convertir la explicacion en una accion pequena. La accion puede ser escribir un prompt, revisar un diff, crear un webhook, disenar una skill, definir una tool, redactar una rubrica o dibujar una arquitectura.

Cuarto, debe aplicar una restriccion realista. Las restricciones son lo que convierten una demo en trabajo profesional: tiempo limitado, datos incompletos, permisos reducidos, coste maximo, fuentes obligatorias, formato de salida o revision humana. Quinto, debe verificar el resultado. Verificar no significa mirar si parece bonito. Significa comprobar si cumple el criterio de aceptacion: formato, fuentes, ausencia de invenciones, logs, tests, permisos, coste, seguridad y claridad.

## Ideas que el alumno puede crear a partir de esta nota

Despues de estudiar Ruta maestra de lecciones, el alumno debe generar ideas propias. Puede convertir el tema en una checklist, una plantilla, una presentacion, una automatizacion, un laboratorio, una skill, un prompt reusable o una parte de su proyecto final. La boveda esta pensada para eso: no es solo contenido para consumir, sino materia prima para producir.

Ideas posibles: una ficha de una pagina, una presentacion de cinco diapositivas, un laboratorio de 30 minutos, una rubrica de evaluacion, un ejemplo antes/despues, una tabla de errores frecuentes, una arquitectura con permisos, una plantilla para prompts, una skill para agentes o un workflow n8n. El alumno debe elegir una idea y desarrollarla con fuentes oficiales y criterio de verificacion.

## Evaluacion

La evaluacion minima consiste en demostrar comprension y aplicacion. El alumno debe entregar un artefacto relacionado con Ruta maestra de lecciones, explicar su objetivo, describir como funciona, identificar riesgos, provocar un error y repararlo. La evaluacion avanzada exige justificar decisiones: por que se uso esta herramienta y no otra, que permisos se concedieron, que fuentes se usaron, que coste tiene, que logs quedan y que evals detectarian regresiones.

Criterios de excelencia: claridad, trazabilidad a fuentes oficiales, capacidad de diagnostico, seguridad, control de coste, documentacion y transferencia. Si otra persona puede leer el entregable, reproducirlo y entender sus limites, el alumno va por buen camino.

## Enlaces internos relacionados

- [[DOCUMENTO_MAESTRO]]
- [[00_EMPIEZA_AQUI/Mapa_de_la_formacion]]
- [[00_EMPIEZA_AQUI/Ruta_150_Lecciones]]
## Fuentes oficiales recomendadas

- [ChatGPT Learn](https://learn.chatgpt.com/docs)
- [Anthropic Learn](https://www.anthropic.com/learn/build-with-claude)
- [GitHub Skills](https://skills.github.com/quickstart)
- [n8n Docs](https://docs.n8n.io/)
- [Gemini API docs](https://ai.google.dev/gemini-api/docs)

## Nota para produccion de materiales

Antes de convertir esta nota en documento final, presentacion o clase grabada, revisar las fuentes oficiales enlazadas. Las herramientas de IA cambian rapido: superficies, permisos, modelos, nombres de funciones, rutas de documentacion y capacidades pueden variar. La version de clase debe indicar fecha de revision y, cuando sea posible, conservar capturas, ejemplos o referencias concretas para que el alumno sepa que esta trabajando con informacion actual.
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

Usar **Ruta maestra de lecciones** para producir el entregable definido en la metadata: **mapa de navegacion**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Ruta maestra de lecciones**.
