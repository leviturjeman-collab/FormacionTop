# 06_json_schema_guard.py

Valida JSON Schema Draft2020-12. Requiere jsonschema; nunca afirma validar sin motor instalado.

## Ejecutar

```bash
python 06_json_schema_guard.py --demo
python 06_json_schema_guard.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "schema": {
    "type": "object",
    "required": [
      "email"
    ],
    "properties": {
      "email": {
        "type": "string"
      }
    }
  },
  "payload": {
    "email": "demo@example.com"
  }
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
