# 04_ticket_router.py

Enruta tickets con reglas deterministas; devuelve cola y prioridad sin enviar mensajes.

## Ejecutar

```bash
python 04_ticket_router.py --demo
python 04_ticket_router.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "message": "El pago está bloqueado",
  "ticket_id": "T1"
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
