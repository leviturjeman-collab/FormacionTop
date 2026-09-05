# 22_env_example_generator.py

Genera plantilla de nombres de variables sin aceptar ni copiar valores secretos.

## Ejecutar

```bash
python 22_env_example_generator.py --demo
python 22_env_example_generator.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "variables": [
    "ANTHROPIC_API_KEY",
    "DATABASE_URL"
  ]
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
