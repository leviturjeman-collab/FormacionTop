# 01_lead_scoring.py

Puntúa leads con reglas explícitas editables; no predice probabilidad de compra.

## Ejecutar

```bash
python 01_lead_scoring.py --demo
python 01_lead_scoring.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "email": "ana@example.com",
  "budget": 1200,
  "need": "Integrar pedidos con CRM"
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
