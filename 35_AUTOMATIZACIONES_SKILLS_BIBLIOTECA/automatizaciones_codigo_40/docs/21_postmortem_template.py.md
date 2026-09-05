# 21_postmortem_template.py

Genera postmortem con hechos suministrados; no inventa causa.

## Ejecutar

```bash
python 21_postmortem_template.py --demo
python 21_postmortem_template.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "incident": "Servicio no disponible",
  "impact": "5 pedidos retrasados",
  "timeline": [
    "10:00 alarma",
    "10:12 recuperado"
  ],
  "actions": [
    "Probar rollback"
  ]
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
