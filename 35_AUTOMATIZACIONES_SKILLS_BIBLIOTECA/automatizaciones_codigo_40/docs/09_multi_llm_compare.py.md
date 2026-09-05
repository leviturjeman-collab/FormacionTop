# 09_multi_llm_compare.py

Compara resultados aportados; no presenta coincidencia textual como garantía de verdad.

## Ejecutar

```bash
python 09_multi_llm_compare.py --demo
python 09_multi_llm_compare.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "outputs": [
    {
      "model": "a",
      "text": "Respuesta A",
      "latency_ms": 40,
      "cost": 0.01
    },
    {
      "model": "b",
      "error": "timeout"
    }
  ]
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
