---
titulo: "Prompts para n8n agentes y tools"
tipo: "plantilla_entregable"
nivel: "transversal"
fase: "aprendizaje"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://docs.n8n.io/"]
tags: ["ai-academy", "plantilla_entregable", "transversal", "aprendizaje"]
entregable: "plantilla reutilizable"
---
# Prompts para n8n, agentes y tools

Estos prompts ayudan a disenar workflows, agentes y herramientas. La regla principal es que una tool debe tener frontera clara.

## Diseñar workflow

```text
Diseña un workflow n8n para [proceso]. Define trigger, datos de entrada, nodes, credenciales, transformaciones, errores esperados, revision humana, salida y logs. Separa version basica, intermedia y avanzada.
```

## Diseñar agente

```text
Diseña un agente para [tarea]. Define objetivo, instrucciones, datos que puede leer, tools disponibles, cuando usar cada tool, acciones prohibidas, formato de salida, criterio de confianza y cuando escalar a humano.
```

## Diseñar tool

```text
Define una tool llamada [nombre]. Explica proposito, parametros, ejemplos correctos, ejemplos incorrectos, permisos necesarios, errores posibles y validaciones previas.
```

## Practica

El alumno crea un agente con dos tools. BREAK: descripciones solapadas. FIX: diferenciar claramente cuando usar cada una.


---
