# 03_invoice_parser.py

Extrae campos de texto etiquetado Proveedor/Fecha/Total; no hace OCR ni interpreta facturas arbitrarias.

## Ejecutar

```bash
python 03_invoice_parser.py --demo
python 03_invoice_parser.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "text": "Proveedor: Taller Uno\nFecha: 2026-09-05\nTotal: 1.234,56 EUR"
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
