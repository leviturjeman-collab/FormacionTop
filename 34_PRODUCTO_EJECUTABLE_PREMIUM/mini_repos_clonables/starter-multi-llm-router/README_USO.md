# Router real con fallback

`python router.py --demo` prueba timeout del principal y respuesta fixture de reserva sin red. Para ejecución real configura ANTHROPIC_API_KEY y OPENAI_API_KEY y ejecuta `python router.py "pregunta"`. Modelos configurables con ANTHROPIC_MODEL/OPENAI_MODEL. Solo Anthropic y OpenAI están implementados; no se declara soporte de un tercer proveedor. No imprime claves. Cada resultado identifica intentos, uso, proveedor y fallback.
