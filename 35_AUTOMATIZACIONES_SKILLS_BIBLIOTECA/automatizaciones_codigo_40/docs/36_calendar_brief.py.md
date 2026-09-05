# 36_calendar_brief.py

Prepara agenda del día con fechas ISO; no crea eventos ni presupone acceso al calendario.

## Ejecutar

```bash
python 36_calendar_brief.py --demo
python 36_calendar_brief.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "date": "2026-09-05",
  "events": [
    {
      "title": "Revisión",
      "start": "2026-09-05T10:00:00+00:00",
      "end": "2026-09-05T11:00:00+00:00"
    }
  ]
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
