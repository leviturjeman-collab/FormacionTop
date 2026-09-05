# 39_source_checker.py

Comprueba metadatos y coincidencia literal; no inventa una nota de credibilidad.

## Ejecutar

```bash
python 39_source_checker.py --demo
python 39_source_checker.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "url": "https://example.com/report",
  "author": "Equipo",
  "date": "2026-09-01",
  "claim": "Ventas suben",
  "text": "Informe: ventas suben"
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
