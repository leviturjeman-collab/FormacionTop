---
titulo: "Codex Cursor ClaudeCode y diffs"
tipo: "laboratorio_troubleshooting"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://learn.chatgpt.com/", "https://developers.openai.com/", "https://docs.anthropic.com/", "https://code.claude.com/docs/", "https://cursor.com/docs"]
tags: ["ai-academy", "laboratorio_troubleshooting", "transversal", "aplicacion"]
entregable: "laboratorio reproducible con error y reparacion"
---
# Codex, Cursor, Claude Code y diffs

Los agentes de codigo fallan cuando el alcance es ambiguo o nadie revisa el diff. El alumno debe aprender a pensar como reviewer.

## Errores comunes

- Cambios fuera de alcance.
- Refactor innecesario.
- Tests no ejecutados.
- Archivos generados tocados.
- Dependencia añadida sin necesidad.
- Fix que tapa sintoma pero no causa.

## Diagnostico

Revisar diff, comandos ejecutados, tests, archivos tocados y razon de cada cambio. Si el agente no explica, pedir resumen.

## Reparacion

Dividir tarea, revertir solo cambios propios si procede, añadir test, reducir alcance y documentar riesgo residual.

## Practica

Pedir una feature pequeña y luego revisar si se tocaron archivos no relacionados. BREAK: aceptar sin mirar. FIX: checklist de PR.


---
