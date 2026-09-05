# 34_competitor_price_diff.py

Compara precios numéricos/formato español; porcentaje null si referencia cero.

## Ejecutar

```bash
python 34_competitor_price_diff.py --demo
python 34_competitor_price_diff.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "previous": "1.234,56",
  "current": "1.234,56",
  "currency": "EUR"
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
