---
titulo: "Agentes tools MCP y permisos"
tipo: "laboratorio_troubleshooting"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "laboratorio_troubleshooting", "transversal", "aplicacion"]
entregable: "laboratorio reproducible con error y reparacion"
---
# Agentes, tools, MCP y permisos

Los agentes fallan cuando tienen herramientas mal definidas o permisos demasiado amplios. Una tool debe decir claramente para que sirve y cuando no debe usarse.

## Sintomas

- El agente llama una tool incorrecta.
- Pide datos que no necesita.
- Ejecuta accion sin confirmacion.
- Mezcla herramientas solapadas.
- No sabe que hacer ante incertidumbre.

## Diagnostico

Leer instrucciones del agente, descripciones de tools, parametros, logs de llamadas y salida final. Ver si el error fue de contexto, descripcion, permisos o criterio.

## Reparacion

Reducir herramientas, mejorar nombres, añadir ejemplos, exigir confirmacion humana, limitar permisos y separar lectura de escritura.

## Practica

Crear dos tools parecidas. BREAK: el agente elige mal. FIX: diferenciar descripcion y condiciones de uso.


---
