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

## CHECK -> DO -> BREAK -> FIX -> EXPLAIN

CHECK: clasificar una necesidad como `CLAUDE.md`, skill, hook, subagent o MCP.

DO: diseñar una extensión mínima.

BREAK: usar la pieza equivocada, por ejemplo poner un proceso largo en instrucciones globales o usar un hook para una decisión subjetiva.

FIX: mover la lógica al sitio correcto.

EXPLAIN: justificar la arquitectura.

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

<!-- CAPA_AAAA_PLUS_APLICADA -->

# Capa AAAA+ - Anthropic Claude Claude Code

## Proposito profesional de esta nota

Esta nota queda elevada al estandar AAAA+. Su funcion dentro de la boveda es servir como pieza profesional de research oficial, trazabilidad a fuentes primarias y conversion de documentacion real en criterio formativo. No debe leerse como una nota aislada ni como un resumen rapido. Debe poder ayudar a un alumno a entender el tema, aplicarlo a su trabajo, convertirlo en proyecto, evaluarlo y defenderlo con criterio.

Una nota AAAA+ debe responder tres preguntas: que aprende el alumno, que puede construir con esto y como sabemos que lo ha entendido. Si una persona externa abre este archivo, debe encontrar orientacion suficiente para avanzar sin depender de una explicacion oral. La nota debe ser clara, accionable, verificable y conectada con el resto de la boveda.

## Nivel basico

En nivel basico, el alumno debe poder explicar el tema con sus palabras, identificar para que sirve y reconocer cuando aparece en un proyecto real. El objetivo no es dominar todas las herramientas, sino entender el modelo mental. La actividad minima es leer la nota, extraer conceptos clave, escribir un ejemplo propio y conectar este archivo con una fase de la formacion.

Entregable basico:

- Resumen de 10 lineas.
- Tres conceptos clave.
- Un ejemplo aplicado al trabajo o a una idea propia.
- Una duda abierta.
- Una conexion con una fase de la formacion.

## Nivel intermedio

En nivel intermedio, el alumno debe aplicar esta nota a un caso realista. Ya no basta con entender: debe producir algo. Puede ser una plantilla, checklist, workflow, mini skill, mapa de decision, tabla, prompt mejorado, evaluacion, laboratorio o primer prototipo. El entregable debe tener criterio de terminado.

Entregable intermedio:

- Objetivo concreto.
- Entrada necesaria.
- Salida esperada.
- Pasos de trabajo.
- Error probable.
- Checklist de revision.
- Evidencia de resultado.

## Nivel avanzado

En nivel avanzado, esta nota debe convertirse en una pieza defendible. Si el tema es tecnico, debe incluir artefacto real: codigo, JSON, schema, workflow exportado, diff, test, API request, log o configuracion. Si el tema no es tecnico, debe incluir artefacto profesional: documento, presentacion, plantilla, rubrica, skill instruction-only, checklist o caso de portfolio.

Entregable avanzado:

- Artefacto real.
- Caso feliz.
- Caso ambiguo.
- Caso roto.
- Reparacion documentada.
- Evaluacion.
- Defensa breve.

## Que utilizar

Para trabajar esta nota, utiliza: Claude, Claude Code, skills, hooks, subagents, tool use, permisos y MCP cuando proceda.

Tambien utiliza Obsidian como lugar de trazabilidad: enlaces internos, fuentes, decisiones, versiones y reflexiones. Si se transforma en clase, debe producir material reutilizable: documento, presentacion, laboratorio, rubrica o proyecto.

## Que no utilizar

No usar fuentes genericas como base principal. No convertir snippets de marketing en verdad pedagogica. No afirmar actualidad sin revisar fuente oficial.

Regla simple: si una herramienta no mejora claridad, repetibilidad, seguridad, evaluacion o transferencia, probablemente sobra. La excelencia AAAA+ no es usar mas tecnologia; es elegir mejor y dejar evidencia.

## Politica de codigo real

Esta nota no exige codigo real por defecto. Exige artefacto real. Si el proyecto derivado es conceptual, pedagogico, documental o de decision, puede bastar con plantilla, documento, rubrica, skill instruction-only o presentacion. Si el proyecto promete ejecutar, automatizar, conectar APIs, validar datos, usar agentes, RAG, MCP, n8n avanzado o produccion, entonces debe existir artefacto tecnico verificable.

Codigo real o artefacto tecnico puede ser:

- Script Python o Node.js.
- JSON schema.
- Workflow n8n exportado.
- SKILL.md.
- API request.
- Test.
- Log.
- Diff.
- Configuracion.
- Checklist de deploy.

## CHECK -> DO -> BREAK -> FIX -> EXPLAIN

CHECK: antes de usar esta nota, el alumno debe explicar que problema resuelve y que tipo de proyecto podria salir de ella.

DO: el alumno crea un entregable minimo relacionado con la nota.

BREAK: se introduce un fallo intencional: falta de contexto, fuente debil, salida incorrecta, permisos excesivos, formato roto, evaluacion insuficiente o herramienta innecesaria.

FIX: el alumno repara usando evidencia: fuentes, logs, inputs, outputs, diffs, rubrica, checklist o revision humana.

EXPLAIN: el alumno explica que aprendio, que cambio, que error encontro y como lo aplicaria a su trabajo o portfolio.

## Criterio AAAA+

Para considerar esta nota realmente AAAA+, debe cumplir:

- Se entiende sin explicacion oral.
- Tiene una aplicacion practica.
- Puede convertirse en entregable.
- Tiene criterio de evaluacion.
- Incluye que usar y que evitar.
- Diferencia basico, intermedio y avanzado.
- Puede conectarse con una fase.
- Puede producir evidencia.
- Puede formar parte de portfolio o material de clase.

## Preguntas de defensa

- Que aporta esta nota a la formacion.
- Que puede construir el alumno con ella.
- Que herramienta conviene usar y cual conviene evitar.
- Que parte necesita evidencia real.
- Que error se puede provocar.
- Como se evalua.
- Como se convierte en portfolio.

## Enlaces de mejora

- [[14_ESTANDAR_AAAA_PLUS/README]]
- [[14_ESTANDAR_AAAA_PLUS/Escalera_de_B_a_AAAA_Plus]]
- [[14_ESTANDAR_AAAA_PLUS/Fases_basico_intermedio_avanzado]]
- [[14_ESTANDAR_AAAA_PLUS/Que_utilizar_y_que_no_utilizar]]
- [[14_ESTANDAR_AAAA_PLUS/Politica_de_codigo_real]]
- [[14_ESTANDAR_AAAA_PLUS/Rubrica_AAAA_Plus]]
---

<!-- CAPA_MASTERCLASS_AAAA_PLUS -->

# Masterclass AAAA+ - Anthropic Claude Claude Code

## Ambicion de esta pieza

Esta seccion convierte el archivo en una pieza de formacion premium. El objetivo no es que el alumno lea y diga "lo entiendo". El objetivo es que pueda usar esta nota como manual de accion para aprender, aplicar, construir, romper, arreglar, documentar, presentar y defender algo real dentro del dominio de Claude y Claude Code.

Si una persona abre este archivo sin conocerte, debe sentir que hay una ruta clara: primero comprende, luego practica, despues crea un artefacto, luego lo somete a fallo, lo mejora y finalmente lo convierte en evidencia. Esa es la diferencia entre una nota informativa y una nota AAAA+.

## Mapa de dominio

Dominio: Claude y Claude Code.

Este archivo trabaja principalmente sobre: prompt engineering, tool use, skills, hooks, subagents y MCP.

El resultado esperado no es solo conocimiento. El resultado esperado es: skill, hook, subagent o workflow Claude Code documentado.

Para que el alumno lo domine, debe conectar cuatro capas:

1. Concepto: que significa y por que importa.
2. Uso: donde aparece en trabajo real.
3. Construccion: que artefacto se puede crear.
4. Defensa: como se demuestra que funciona y que limites tiene.

## Ruta de lectura excelente

1. Leer una vez sin tocar herramientas, solo para entender el mapa.
2. Subrayar conceptos que no podria explicar a otra persona.
3. Crear una nota derivada con ejemplo propio.
4. Convertir el ejemplo en una mini practica.
5. Añadir una version basica, intermedia y avanzada.
6. Definir que herramienta se usa y que herramienta se evita.
7. Crear el artefacto real correspondiente.
8. Probar caso feliz, caso ambiguo y caso roto.
9. Documentar reparacion.
10. Convertir el resultado en portfolio, clase o material entregable.

## Version basica de esta nota

La version basica debe permitir que un alumno principiante salga con claridad. Debe poder responder:

- Que tema trata esta nota.
- Para que sirve.
- Que problema resuelve.
- Que ejemplo real podria construir.
- Que herramienta principal usaria.
- Que herramienta no necesita todavia.

Artefacto basico recomendado: resumen aplicado, mapa mental, checklist o ejemplo manual en Obsidian.

## Version intermedia de esta nota

La version intermedia debe transformar comprension en accion. El alumno debe crear algo que otra persona pueda revisar. Puede ser una plantilla, workflow, prompt pack, skill instruction-only, tabla de decision, laboratorio, schema, documento o mini prototipo.

La version intermedia debe incluir:

- Objetivo medible.
- Entrada.
- Salida.
- Pasos.
- Criterio de terminado.
- Error probable.
- Checklist de calidad.

## Version avanzada de esta nota

La version avanzada debe producir evidencia fuerte. Si el tema es tecnico, debe tener artefacto real: codigo, JSON, workflow exportado, API request, diff, test, log, configuracion o SKILL.md. Si el tema es no tecnico, debe tener artefacto profesional: documento, presentacion, rubrica, plantilla, guia, checklist o caso de portfolio.

La version avanzada debe incluir:

- Caso feliz.
- Caso ambiguo.
- Caso roto.
- Diagnostico.
- Reparacion.
- Evaluacion.
- Defensa.
- Siguiente mejora.

## Que haria que esta nota dejara a alguien impresionado

Una persona se queda impresionada cuando nota que la formacion no es una explicacion suelta, sino un sistema. Para conseguirlo, esta nota debe hacer visible:

- Que hay una progresion clara.
- Que cada concepto termina en practica.
- Que cada practica se puede romper.
- Que cada error enseña algo.
- Que cada entrega tiene criterio.
- Que cada proyecto puede convertirse en portfolio.
- Que se sabe que herramienta usar y cual evitar.
- Que no hay humo: hay artefactos, fuentes, limites y evaluacion.

## Prompt maestro para trabajar esta nota

Usa este prompt cuando quieras convertir esta nota en material accionable:

`	ext
Actua como diseñador senior de formacion profesional en IA. Convierte esta nota en una experiencia de aprendizaje AAAA+.

Necesito:
1. Explicacion para principiante.
2. Modelo mental.
3. Actividad basica.
4. Actividad intermedia.
5. Actividad avanzada.
6. Artefacto real que debe entregar el alumno.
7. Caso feliz.
8. Caso ambiguo.
9. Caso roto.
10. Rubrica de evaluacion.
11. Errores comunes.
12. Como llevarlo a portfolio.

No inventes capacidades. Si falta informacion, marca supuestos y preguntas.
`

## Checklist de excelencia

Antes de considerar esta nota terminada como material premium, comprueba:

- Tiene una idea central clara.
- Tiene aplicacion real.
- Tiene actividad basica, intermedia y avanzada.
- Tiene artefacto real.
- Tiene errores provocados.
- Tiene criterio de evaluacion.
- Tiene que usar y que evitar.
- Tiene politica de codigo real si aplica.
- Tiene defensa.
- Tiene conexion con portfolio.
- Tiene enlaces internos suficientes.
- Puede convertirse en documento, presentacion o laboratorio.

## Errores que debe enseñar esta nota

Una nota AAAA+ no solo enseña el camino correcto. Enseña tambien como se rompe el trabajo. Errores recomendados:

- Falta de contexto.
- Elegir herramienta demasiado avanzada.
- No definir salida.
- No tener criterio de terminado.
- No comprobar fuentes.
- No preparar caso roto.
- Usar codigo sin explicarlo.
- No proteger datos sensibles.
- No documentar sistema operativo.
- No tener evaluacion.

## Como convertir esta nota en clase

Estructura recomendada de clase:

1. Apertura: problema real que resuelve.
2. Concepto: explicacion clara y breve.
3. Demostracion: ejemplo guiado.
4. Practica basica: alumno replica.
5. Practica intermedia: alumno adapta.
6. Practica avanzada: alumno construye evidencia.
7. BREAK: se rompe algo.
8. FIX: se repara con evidencia.
9. Defensa: alumno explica.
10. Cierre: como entra en portfolio.

## Como convertir esta nota en proyecto

Para convertirla en proyecto, crea una nota hija con:

- Nombre del proyecto.
- Fase.
- Nivel.
- Usuario.
- Problema.
- Herramientas.
- Herramientas evitadas.
- Artefacto.
- Pasos.
- Riesgos.
- Evaluacion.
- Evidencia.
- Siguiente version.

## Rubrica rapida AAAA+

Puntua de 1 a 4:

- Claridad.
- Aplicacion real.
- Artefacto.
- Reproducibilidad.
- Error provocado.
- Reparacion.
- Evaluacion.
- Seguridad.
- Sistema operativo.
- Portfolio.

Un archivo excelente debe aspirar a 35/40 o mas. Si baja de 28, todavia es util pero no memorable. Si baja de 20, necesita reconstruccion.

## Frase de cierre para el alumno

No memorices esta nota. Usala. Si puedes convertirla en una accion, una plantilla, una skill, un workflow, un proyecto o una decision mejor tomada, entonces la nota ya cumplio su funcion. Si ademas puedes explicarla y defenderla, empieza a ser AAAA+.
---

<!-- CAPA_ULTRA_PREMIUM_AAAA_PLUS -->

# Capa ultra-premium AAAA+ - Anthropic Claude Claude Code

## Promesa de transformacion

Esta capa existe para que el archivo no sea simplemente bueno, sino extraordinario. La promesa es que una persona pueda leer esta nota y salir con una transformacion concreta: entender mejor, trabajar mejor, construir mejor, decidir mejor o presentar mejor. El lector ideal no debe sentir que esta consumiendo informacion; debe sentir que esta recibiendo un sistema de accion.

Perfil principal al que sirve: investigador, creador de curriculo y diseñador academico.

Artefacto premium esperado: mapa de fuentes, sintesis comparada, notas de decision y material de clase con citas.

Prueba de dominio: fuentes oficiales revisadas, decisiones justificadas y conversion a lecciones.

## Escenario real de uso

Una persona quiere usar Claude o Claude Code con criterio: aprende prompting, separa datos e instrucciones, crea skills, decide hooks o subagents y conecta MCP solo si aporta valor real.

Este escenario debe guiar la lectura. Si el alumno no puede imaginar como usar la nota en una situacion real, falta aterrizaje. Si puede imaginarlo pero no sabe que entregar, falta artefacto. Si sabe entregar pero no sabe como evaluarlo, falta rubrica. Si sabe evaluarlo pero no sabe defenderlo, falta madurez profesional.

## Ruta de ejecucion en 7 dias

Dia 1 - Comprension:

- Leer la nota completa.
- Escribir un resumen propio.
- Marcar conceptos confusos.
- Elegir un ejemplo personal.

Dia 2 - Modelo mental:

- Dibujar el flujo del tema.
- Separar entradas, proceso, decisiones y salidas.
- Identificar que parte depende de herramienta y que parte depende de criterio humano.

Dia 3 - Version basica:

- Crear un primer artefacto manual.
- No optimizar todavia.
- Buscar claridad y utilidad minima.

Dia 4 - Version intermedia:

- Convertir el artefacto en plantilla, workflow, checklist, skill, schema, documento o laboratorio.
- Añadir criterio de terminado.

Dia 5 - Ruptura controlada:

- Provocar un fallo.
- Documentar sintoma, causa probable y evidencia.
- Evitar arreglos por intuicion.

Dia 6 - Version avanzada:

- Reparar con evidencia.
- Añadir evaluacion.
- Añadir limites, seguridad o compatibilidad si aplica.

Dia 7 - Portfolio y defensa:

- Preparar una explicacion de 3 minutos.
- Guardar antes/despues.
- Escribir siguiente mejora.
- Decidir si el proyecto queda como practica, portfolio o producto.

## Entregables premium por perfil

Para perfil no tecnico:

- Explicacion clara.
- Plantilla reusable.
- Checklist de calidad.
- Ejemplo antes/despues.
- Presentacion breve.

Para perfil tecnico:

- Artefacto reproducible.
- Archivo o configuracion real.
- Validacion o test.
- Logs, diff, schema o export.
- Riesgos y rollback si aplica.

Para perfil negocio:

- Caso de uso.
- Beneficio esperado.
- Riesgos.
- Coste o esfuerzo estimado.
- Decision recomendada.

Para perfil formador:

- Objetivo didactico.
- Actividad basica/intermedia/avanzada.
- Error provocado.
- Rubrica.
- Material exportable.

## Biblioteca de fallos de alto valor

Estos fallos son deseables en formacion porque enseñan criterio:

1. Falta de contexto: el resultado parece correcto pero no sirve.
2. Herramienta excesiva: se usa tecnologia avanzada para un problema simple.
3. Salida no verificable: no hay forma de saber si esta bien.
4. Caso feliz unico: funciona solo con input perfecto.
5. Seguridad ignorada: hay datos, permisos o secretos sin control.
6. Sin trazabilidad: no se sabe que fuente o decision produjo el resultado.
7. Sin sistema operativo: nadie sabe como ejecutarlo en su ordenador.
8. Sin defensa: el alumno hizo algo pero no puede explicarlo.

Cada fallo debe convertirse en pregunta:

- Que evidencia falta.
- Que restriccion no se definio.
- Que herramienta sobra.
- Que riesgo no se controlo.
- Que parte debe revisar un humano.

## Plantilla de entrega premium

Cuando esta nota se convierta en entregable, debe tener esta estructura:

`markdown
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

Eliminar o reescribir cualquier parrafo que no cumpla una de estas funciones: explicar una decision, enseÃ±ar un concepto, guiar una practica, prevenir un error, respaldar una fuente, preparar un entregable o mejorar la evaluacion.

### Proxima revision

- Revisar este archivo cuando cambien las fuentes oficiales relacionadas o antes de usarlo como material comercial.
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Anthropic Claude Claude Code**.

