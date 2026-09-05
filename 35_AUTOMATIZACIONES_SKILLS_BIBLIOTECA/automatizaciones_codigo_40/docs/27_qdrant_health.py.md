# 27_qdrant_health.py

Comprueba /collections de Qdrant local o una respuesta fixture; no presenta eco como healthcheck.

## Ejecutar

```bash
python 27_qdrant_health.py --demo
python 27_qdrant_health.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "response": {
    "status": "ok",
    "result": {
      "collections": []
    }
  }
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
