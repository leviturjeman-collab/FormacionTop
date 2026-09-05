# 05_csv_cleaner.py

Normaliza cabeceras/celdas y rechaza columnas inconsistentes sin perder registros.

## Ejecutar

```bash
python 05_csv_cleaner.py --demo
python 05_csv_cleaner.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "csv": " Nombre , EMAIL \n Ana , ANA@EXAMPLE.COM \n"
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
