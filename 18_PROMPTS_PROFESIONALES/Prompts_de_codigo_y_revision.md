---
titulo: "Prompts de codigo y revision"
tipo: "plantilla_entregable"
nivel: "transversal"
fase: "aprendizaje"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "plantilla_entregable", "transversal", "aprendizaje"]
entregable: "plantilla reutilizable"
---
# Prompts de codigo y revision

Estos prompts sirven para trabajar con Codex, Cursor o Claude Code. Deben proteger alcance, pruebas y revision.

## Entender repo

```text
Lee este proyecto y explicame su arquitectura. No edites nada todavia. Indica carpetas principales, flujo de datos, comandos de desarrollo, puntos de riesgo y donde probablemente se implementaria [feature].
```

## Implementar cambio

```text
Implementa [cambio] respetando patrones existentes. Antes de editar, identifica archivos relevantes y plan. Despues ejecuta pruebas razonables y resume diff, riesgos y verificacion.
```

## Revisar PR

```text
Revisa estos cambios como code reviewer. Prioriza bugs, regresiones, seguridad, datos, rendimiento y tests faltantes. Devuelve hallazgos con archivo, linea, severidad y razon. No hagas comentarios esteticos salvo que afecten mantenibilidad.
```

## Practica

El alumno debe pedir una mejora pequeña, revisar diff y explicar si aceptaria el cambio. BREAK: pedir cambio demasiado amplio. FIX: dividir en tareas pequeñas.


---
