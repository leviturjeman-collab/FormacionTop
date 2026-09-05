# 16_video_brief.py

Produce un briefing temporal editable, no genera un vídeo.

## Ejecutar

```bash
python 16_video_brief.py --demo
python 16_video_brief.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "topic": "Ahorrar tiempo con pedidos",
  "audience": "comerciantes",
  "duration_seconds": 30
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
