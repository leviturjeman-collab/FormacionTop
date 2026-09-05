# 18_url_reader.py

Extrae HTML estático o consulta HTTPS público sin redirecciones; no ejecuta JavaScript. En servidor compartido debe añadirse control de egress para evitar DNS rebinding.

## Ejecutar

```bash
python 18_url_reader.py --demo
python 18_url_reader.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "html": "<h1>Ejemplo</h1><p>Texto útil</p>"
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
