---
titulo: "JSON outputs estructurados y schemas"
tipo: "laboratorio_troubleshooting"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "laboratorio_troubleshooting", "transversal", "aplicacion"]
entregable: "laboratorio reproducible con error y reparacion"
---
# JSON, outputs estructurados y schemas

Muchos workflows fallan porque el modelo devuelve texto cuando el sistema espera datos. JSON no es decoracion; es contrato.

## Sintomas

- El workflow no puede leer campos.
- Aparece `undefined`.
- El parser falla.
- Faltan propiedades.
- El modelo devuelve explicaciones junto al JSON.
- El tipo no coincide: numero como texto, lista como string.

## Diagnostico

Mirar la respuesta cruda. Validar con schema. Revisar prompt. Comprobar si el modelo admite structured outputs o si solo se pidio "responde en JSON".

## Reparacion

Definir schema, permitir `null` o `desconocido`, pedir evidencia por campo, validar antes de usar, añadir fallback y no enviar datos rotos a sistemas finales.

## Practica

Crear un extractor de leads. BREAK: campo email ausente y presupuesto ambiguo. FIX: schema con campos opcionales y confianza.


---
