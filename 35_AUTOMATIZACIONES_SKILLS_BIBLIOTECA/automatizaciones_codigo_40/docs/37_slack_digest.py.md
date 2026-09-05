# 37_slack_digest.py

Agrupa mensajes aportados por persona conservando texto; no publica en Slack.

## Ejecutar

```bash
python 37_slack_digest.py --demo
python 37_slack_digest.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "messages": [
    {
      "user": "Ana",
      "text": "Terminado pedido 21"
    },
    {
      "user": "Luis",
      "text": "Bloqueo: falta acceso"
    }
  ]
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
