---
titulo: "Anthropic Claude Claude Code"
tipo: "manual_research"
nivel: "transversal"
fase: "transversal"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://docs.anthropic.com/", "https://code.claude.com/docs/"]
tags: ["ai-academy", "manual_research", "transversal", "transversal"]
entregable: "manual con fuentes y practica"
---
# Anthropic, Claude y Claude Code - Manual profesional

Anthropic debe ensenarse desde dos angulos: Claude como modelo conversacional y de razonamiento, y Claude Code como entorno agentico para trabajar con repositorios, terminal, herramientas y flujos de desarrollo. En una formacion profesional, Claude no es solo una alternativa a ChatGPT. Es una plataforma con documentacion fuerte en prompting, tool use, computer use, MCP, subagents, hooks, permisos, memoria y trabajo de codigo. El alumno debe entender donde Claude brilla, donde Claude Code cambia el flujo de trabajo y que limites necesita cualquier agente con acceso a herramientas.

## Modelo mental

Claude puede actuar como razonador, redactor, analista, planificador o agente con herramientas. Claude Code lleva esa capacidad al entorno de desarrollo: puede leer codigo, proponer cambios, ejecutar comandos, usar subagents, aplicar instrucciones y trabajar de forma iterativa. La clave pedagogica es no vender autonomia como magia. Un agente profesional necesita contexto, objetivo, permisos, herramientas, pruebas y revision.

Anthropic documenta patrones como prompt engineering, tool use y computer use. Tool use permite que el modelo pida ejecutar herramientas externas. Computer use permite automatizar interacciones con interfaces graficas en determinados contextos. MCP permite conectar herramientas y recursos externos mediante un protocolo comun. Subagents permiten dividir trabajo en especialistas. Hooks permiten ejecutar acciones en puntos concretos del flujo.

## Basico

En nivel basico, el alumno debe usar Claude para pensar mejor: transformar ideas en planes, criticar propuestas, resumir documentos, escribir materiales, preparar checklists y razonar sobre problemas. Debe aprender que Claude responde mejor cuando se le da contexto, objetivo y criterios. Tambien debe aprender a pedir que separe hechos, inferencias y dudas.

Una practica basica excelente es pedir a Claude que analice una idea de negocio o un proyecto. El alumno entrega objetivo, publico, restricciones y recursos disponibles. Claude devuelve plan, riesgos, preguntas y primer paso. Despues el alumno pide una version mas concreta, una version para principiantes y una version con errores probables. Asi aprende a dirigir el razonamiento.

Que no usar en basico: computer use para acciones sensibles, tools sin permisos claros, subagents antes de dominar la tarea principal, hooks que modifiquen archivos automaticamente o agentes conectados a cuentas importantes.

## Intermedio

En nivel intermedio entra Claude Code. El alumno debe aprender el flujo profesional: abrir un repositorio, pedir orientacion, localizar archivos relevantes, pedir un plan, implementar cambios pequenos, ejecutar tests y revisar diffs. Claude Code puede ser muy potente, pero la competencia real del alumno esta en formular tareas verificables y revisar el resultado. "Hazme una app" es una peticion pobre. "Implementa filtros en esta vista, respeta los patrones existentes, anade pruebas y dime los riesgos" es una peticion profesional.

Subagents se introducen cuando una tarea tiene dominios separables: uno revisa seguridad, otro frontend, otro tests, otro documentacion. No se crean subagents para todo. Un subagent debe tener objetivo claro, herramientas necesarias y criterios. Si todos los subagents tienen permisos totales y descripciones vagas, solo se multiplica la confusion.

MCP se explica como una forma de conectar Claude a herramientas externas. El alumno debe entender el limite: cada servidor MCP expone capacidades. Antes de conectarlo, hay que saber que datos lee, que acciones puede ejecutar, como autentica y que permisos concede.

## Avanzado

En avanzado, Claude Code se convierte en parte del sistema de desarrollo. Aqui se disenan instrucciones de proyecto, hooks de validacion, subagents especializados, flujos de PR, revisiones de seguridad, pruebas, documentacion y despliegue. El alumno debe aprender a convertir criterios repetidos en instrucciones persistentes. Si el agente comete el mismo error varias veces, no se grita mas fuerte en el prompt: se mejora la regla, el ejemplo, el test o la herramienta.

Computer use debe tratarse con respeto. Automatizar una interfaz puede ser util para tareas donde no hay API, pruebas end-to-end o interacciones visuales. Pero tambien es fragil: cambios de UI, permisos, sesiones, datos privados y acciones irreversibles pueden romper el flujo. El alumno avanzado debe reservarlo para casos donde aporta valor real y siempre con limites.

Hooks son utiles para ejecutar comprobaciones, formateos o pasos del flujo, pero no deben convertirse en automatismos opacos. Cada hook debe tener razon, punto de ejecucion, salida esperada y plan de fallo. Si un hook modifica archivos, debe quedar claro cuando y por que.

## Proyectos reales

Proyectos con Claude/Claude Code: revisor de codigo, migracion pequena de framework, generador de documentacion tecnica, auditor de arquitectura, subagent de tests, asistente de debugging, refactor con pruebas y sistema de documentacion de decisiones. En no-codigo: asistente de investigacion, generador de programas formativos, critico de propuestas, analista de contratos o sintetizador de reuniones.

Practica de máximo nivel: el alumno toma un repositorio sencillo y pide a Claude Code una mejora pequena. Debe escribir una tarea con criterios de aceptacion, pedir plan, permitir cambios, ejecutar tests y revisar diff. BREAK: pedir una tarea demasiado amplia, quitar un test o usar una instruccion ambigua. FIX: reducir alcance, anadir criterio observable y documentar el cambio.

## Fuentes oficiales

- Anthropic Docs: https://docs.anthropic.com/
- Claude Code common workflows: https://code.claude.com/docs/en/common-workflows
- Claude Code subagents: https://code.claude.com/docs/en/sub-agents
- Claude Code features: https://docs.anthropic.com/en/docs/claude-code/features-overview
- Prompt engineering: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering
- Tool use: https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview
- Computer use: https://docs.anthropic.com/en/docs/agents-and-tools/computer-use
- Anthropic skills repository: https://github.com/anthropics/skills

## Siguiente paso del alumno

El siguiente paso recomendado es crear una nota de proyecto con tres bloques: tarea, permisos y verificacion. En tarea escribe que quieres lograr. En permisos escribe que puede leer y modificar Claude Code. En verificacion escribe como sabras que el resultado es correcto. Esta plantilla pequena evita la mayoria de errores de alcance.

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
