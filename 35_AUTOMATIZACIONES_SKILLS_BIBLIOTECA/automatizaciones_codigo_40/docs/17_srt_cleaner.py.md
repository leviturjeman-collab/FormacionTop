# 17_srt_cleaner.py

Limpia SRT y valida tiempos sin desplazar la sincronización.

## Ejecutar

```bash
python 17_srt_cleaner.py --demo
python 17_srt_cleaner.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "srt": "1\n00:00:01,000 --> 00:00:02,000\n Hola   mundo \n"
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
