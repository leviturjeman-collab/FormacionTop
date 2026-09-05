# 10_rag_eval.py

Comprueba referencias y términos de respuestas RAG; no finge verificar hechos por similitud.

## Ejecutar

```bash
python 10_rag_eval.py --demo
python 10_rag_eval.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "answer": "El horario es de 9 a 17",
  "citations": [
    "doc1"
  ],
  "sources": {
    "doc1": "Horario de 9 a 17"
  },
  "required_terms": [
    "9",
    "17"
  ]
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
