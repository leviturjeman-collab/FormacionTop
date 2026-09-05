# 19_github_issue_template.py

Genera una issue revisable; no la publica.

## Ejecutar

```bash
python 19_github_issue_template.py --demo
python 19_github_issue_template.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "title": "Guardar pedido",
  "problem": "Se pierde al recargar",
  "expected": "Pedido persistido",
  "steps": [
    "Crear pedido",
    "Recargar"
  ]
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
