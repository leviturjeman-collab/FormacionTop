---
titulo: "Programadores y equipos tecnicos"
tipo: "manual_aplicacion_negocio"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "manual_aplicacion_negocio", "transversal", "aplicacion"]
entregable: "plan de aplicacion profesional"
---
# Programadores y equipos tecnicos

Para programadores, la IA aporta valor en lectura de codigo, generacion de pruebas, debugging, documentacion, migraciones, revision de PR, scaffolding, refactors y exploracion de arquitectura. La diferencia profesional esta en revisar diffs, ejecutar tests y respetar patrones existentes. Codex, Claude Code y Cursor son las herramientas centrales; OpenAI, Anthropic y Gemini APIs pueden aparecer dentro de productos; n8n puede orquestar tareas; Ollama puede servir modelos locales.

## Basico

En basico, el alumno aprende a pedir explicaciones de archivos, localizar logica, entender errores y hacer cambios pequeños. Debe usar control de versiones, revisar diffs y ejecutar pruebas. No debe pedir "reescribe todo el proyecto".

## Intermedio

En intermedio, se introducen reglas de repo, `AGENTS.md`, Cursor rules, skills, prompts de PR review, tests y CI. El alumno aprende a transformar tareas ambiguas en issues tecnicos con criterios. Tambien aprende a pedir a un agente que investigue antes de editar.

## Avanzado

En avanzado, se crean flujos agenticos: subagents por dominio, hooks, MCP, analisis de seguridad, generacion de documentacion, automatizacion de releases y revisiones de arquitectura. El criterio es gobernanza: que puede tocar el agente, que pruebas pasan, que cambios requieren aprobacion.

## Proyecto recomendado

Construir un "sistema de desarrollo asistido". Entrada: issue. Proceso: plan, lectura de repo, implementacion, tests, diff, documentacion y PR. BREAK: issue ambiguo, test fallando, cambio fuera de alcance. FIX: acotar, reproducir, corregir y explicar.

## Entregables

- Plantilla de issue para agentes.
- `AGENTS.md`.
- Cursor rule.
- Skill de PR review.
- Checklist de diff.
- Informe de riesgos.

## Que evitar

Evitar aceptar codigo sin pruebas, mezclar refactor y feature, dar secretos al agente, modificar migraciones sin rollback o ignorar warnings de seguridad.


---
