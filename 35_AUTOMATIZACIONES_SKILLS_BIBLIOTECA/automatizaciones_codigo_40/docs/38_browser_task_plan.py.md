# 38_browser_task_plan.py

Genera plan verificable de navegación; informa executed=false porque no controla navegador.

## Ejecutar

```bash
python 38_browser_task_plan.py --demo
python 38_browser_task_plan.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "url": "https://example.com",
  "goal": "Comprobar título y precio"
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
