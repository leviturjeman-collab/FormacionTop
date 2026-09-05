# 23_docker_compose_checker.py

Analiza YAML con PyYAML y política local; no sustituye docker compose config.

## Ejecutar

```bash
python 23_docker_compose_checker.py --demo
python 23_docker_compose_checker.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "yaml": "services:\n  app:\n    image: example/app:1.0\n    ports: [\"127.0.0.1:8000:8000\"]"
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
