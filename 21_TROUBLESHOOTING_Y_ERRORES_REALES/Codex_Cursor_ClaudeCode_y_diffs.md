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

## Laboratorio: aceptar un cambio con evidencia

Objetivo: comprobar una modificación pequeña sin mezclarla con trabajo ajeno. El ejercicio sirve para cualquiera de estos asistentes de programación; los nombres de sus botones pueden variar, pero el diff del repositorio conserva la evidencia.

1. Anota el estado inicial con `git status --short`. Si hay archivos modificados, identifica qué trabajo ya estaba ahí antes de pedir cambios.
2. Formula un encargo concreto: «Corrige la validación de un campo vacío y muestra un mensaje; conserva el resto del formulario». Define la entrada vacía y una entrada válida que debe seguir funcionando.
3. Revisa `git diff --stat` para detectar archivos inesperados y `git diff` para leer los cambios sin confirmar. Para cambios preparados, revisa también `git diff --cached`.
4. Ejecuta ambos casos en la aplicación. El campo vacío debe explicar cómo corregirlo y la entrada válida debe continuar el flujo.
5. Si aparece una dependencia o una modificación sin relación, pide justificarla. Retira únicamente el cambio del ejercicio que hayas identificado; no restaures masivamente archivos con trabajo previo.

Comprobación: entrega el diff revisado, resultado de ambos casos y motivo de cada archivo modificado. Si el asistente afirma que una prueba pasó pero no hay salida del comando, ejecútala o marca la prueba como pendiente. Un resumen convincente no sustituye la ejecución.
