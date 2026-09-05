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

## Laboratorio: un evento, una sola operación

Objetivo: demostrar que reenviar un evento no duplica el trabajo. Crea un flujo de prueba cuyo único efecto sea escribir en una tabla de pruebas. Mantén desactivados correos, pagos y mensajes externos.

Usa este cuerpo como entrada: `{ "event_id": "prueba-001", "email": "alumno@example.com", "importe": 25 }`.

1. Define qué campo identifica un evento de forma estable. El identificador debe venir del emisor; no generes uno nuevo en cada reintento.
2. Valida que event_id exista antes de escribir. Envía también un caso sin ese campo: debe devolver un error controlado y no crear registros.
3. Guarda event_id con una restricción única. Dos ramas separadas de «buscar y después insertar» pueden ejecutarse a la vez; la base de datos debe impedir físicamente el duplicado.
4. Envía prueba-001 dos veces seguidas y después dos veces de manera concurrente. Verifica una sola operación y una respuesta documentada para el duplicado.
5. Prueba prueba-002: debe producir otra operación. Si se bloquea, la clave de deduplicación es demasiado amplia.

Comprobación: entrega el recuento antes/después y los registros de ambas solicitudes. Explica qué ocurriría si el proceso fallara después de reservar el evento pero antes de terminar: registra estados pendiente/completado/error y permite recuperar un pendiente sin ejecutar dos veces la acción final. No marques un trabajo como completado antes de comprobar su resultado.
