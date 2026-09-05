# 20_release_notes.py

Agrupa commits aportados sin inventar cambios.

## Ejecutar

```bash
python 20_release_notes.py --demo
python 20_release_notes.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "version": "1.0",
  "commits": [
    "feat: exportar pedidos",
    "fix: conservar sesión",
    "chore: dependencias"
  ]
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
