# 07_secret_scanner.py

Detecta patrones de secretos en texto y solo devuelve referencias enmascaradas.

## Ejecutar

```bash
python 07_secret_scanner.py --demo
python 07_secret_scanner.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "text": "token=ghp_abcdefghijklmnopqrstuvwx"
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
