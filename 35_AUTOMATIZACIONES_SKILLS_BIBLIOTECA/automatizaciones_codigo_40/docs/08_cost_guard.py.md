# 08_cost_guard.py

Selecciona un lote dentro de presupuesto estimado; no ejecuta ni factura llamadas.

## Ejecutar

```bash
python 08_cost_guard.py --demo
python 08_cost_guard.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "budget": 2,
  "spent": 1,
  "items": [
    {
      "id": "a",
      "estimated_cost": 0.3
    },
    {
      "id": "b",
      "estimated_cost": 1
    }
  ]
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
