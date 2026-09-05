# 35_student_progress.py

Calcula avance por hitos requeridos sin contar duplicados como progreso.

## Ejecutar

```bash
python 35_student_progress.py --demo
python 35_student_progress.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "required": [
    "brief",
    "demo",
    "tests"
  ],
  "completed": [
    "brief",
    "demo",
    "demo"
  ]
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
