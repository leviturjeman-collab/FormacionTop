# 40_delivery_pack_generator.py

Genera contenidos de un paquete de entrega y declara pendientes; no finge haber probado el proyecto.

## Ejecutar

```bash
python 40_delivery_pack_generator.py --demo
python 40_delivery_pack_generator.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "project": "Pedidos",
  "owner": "Ana",
  "run_command": "python app.py",
  "acceptance": [
    "Pedido persiste tras reinicio"
  ]
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
