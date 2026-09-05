# 33_product_enricher.py

Normaliza ficha de producto sin inventar prestaciones ni material.

## Ejecutar

```bash
python 33_product_enricher.py --demo
python 33_product_enricher.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "name": "Camiseta Azul",
  "description": "Algodón, talla M",
  "price": "19,90",
  "sku": "CAM-M"
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
