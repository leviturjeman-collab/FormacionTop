---
titulo: "Prompts de validacion y critica"
tipo: "plantilla_entregable"
nivel: "transversal"
fase: "aprendizaje"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "plantilla_entregable", "transversal", "aprendizaje"]
entregable: "plantilla reutilizable"
---
# Prompts de validacion y critica

Estos prompts sirven para mejorar calidad. Un sistema de máximo nivel no termina cuando genera algo; termina cuando se revisa.

## Critica dura

```text
Revisa este entregable como evaluador exigente. Busca ambiguedades, afirmaciones sin fuente, pasos incompletos, riesgos, errores tecnicos, falta de evaluacion y oportunidades de mejora. Devuelve prioridades P0, P1, P2.
```

## Verificacion de fuentes

```text
Revisa estas afirmaciones y dime cuales necesitan fuente oficial, cuales parecen inferencias y cuales deberia eliminar o matizar. Devuelve una tabla con afirmacion, estado, fuente necesaria y riesgo.
```

## Pre-mortem

```text
Imagina que este proyecto falla en produccion. Dame 10 causas probables, señales tempranas, forma de detectarlas, reparacion y prevencion.
```

## Practica

El alumno pasa su proyecto por critica antes de entregarlo. BREAK: ignorar una alerta importante. FIX: actualizar documento, prueba o workflow.


---
