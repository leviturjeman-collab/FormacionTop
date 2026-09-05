# 32_gdpr_consent_check.py

Bloquea salvo consentimiento booleano true; no certifica cumplimiento legal.

## Ejecutar

```bash
python 32_gdpr_consent_check.py --demo
python 32_gdpr_consent_check.py --input entrada.json
```

## Entrada de ejemplo

```json
{
  "consent": true,
  "purpose": "seguimiento solicitado",
  "email": "ana@example.com"
}
```

## Contrato

JSON con `ok`; error explicativo y código de salida 1 al fallar. `--demo` usa datos locales sin enviar mensajes ni llamar APIs. Lee el alcance del archivo: las herramientas de planificación y evaluación no ejecutan acciones externas ni certifican hechos.

## Verificación

Ejecuta el caso de ejemplo; repite con `{}` y confirma rechazo cuando falten campos. Integra solo tras comprobar los resultados con tus datos y definir quién revisa excepciones.
