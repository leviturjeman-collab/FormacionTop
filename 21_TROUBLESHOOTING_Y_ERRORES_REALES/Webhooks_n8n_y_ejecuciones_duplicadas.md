---
titulo: "Webhooks n8n y ejecuciones duplicadas"
tipo: "laboratorio_troubleshooting"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://docs.n8n.io/"]
tags: ["ai-academy", "laboratorio_troubleshooting", "transversal", "aplicacion"]
entregable: "laboratorio reproducible con error y reparacion"
---
# Webhooks, n8n y ejecuciones duplicadas

Los webhooks son puertas de entrada. Si se configuran mal, disparan workflows incorrectos, duplicados o inseguros.

## Errores comunes

- Usar URL de test en produccion.
- No validar metodo HTTP.
- No comprobar payload.
- Ejecutar dos veces por reintentos.
- No responder a tiempo.
- No guardar idempotency key.
- No diferenciar entorno dev/prod.

## Diagnostico

Revisar ejecuciones, timestamp, body, headers, status code y origen. Comparar payload correcto contra payload roto.

## Reparacion

Validar campos obligatorios, guardar ID de evento, evitar duplicados, responder rapido, registrar errores y separar webhooks de prueba y produccion.

## Practica

Enviar dos veces el mismo payload. BREAK: se crean dos registros. FIX: guardar ID y bloquear duplicado.


---
