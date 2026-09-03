# 02 · Personalizador de cold email con borradores en Gmail

## Qué hace

Recibe un prospecto por webhook, valida email y empresa, y pide a la IA un cold email corto y personalizado (asunto + cuerpo). El resultado se guarda como **BORRADOR en tu Gmail** dirigido al prospecto y se registra en Google Sheets. Este flujo **nunca envía nada**: tú abres la carpeta de borradores, lo retocas y decides si lo mandas. Ese es el freno humano.

## Antes de empezar

- Una cuenta de **n8n**: n8n Cloud (de pago, con prueba gratuita) o **self-hosted gratis** (Docker en tu servidor).
- **API de Anthropic**: de pago por tokens (céntimos por ejecución en este flujo). También puedes apuntar el nodo HTTP a la API de OpenAI si lo prefieres.
- **Google Sheets/Gmail/Calendar**: gratis con tu cuenta de Google.

## Credenciales paso a paso

### Anthropic API (Header Auth) — de pago por tokens
1. Entra en [console.anthropic.com](https://console.anthropic.com) y crea una cuenta (pide añadir un método de pago o crédito inicial).
2. Menú **API Keys** → **Create Key** → copia la clave (empieza por `sk-ant-`). Solo se muestra una vez.
3. En n8n: **Credentials > New > Header Auth**.
   - **Name**: `x-api-key`
   - **Value**: tu clave `sk-ant-...`
4. Guarda la credencial con el nombre **Anthropic API** y selecciónala en el nodo HTTP que llama a la IA.

### Gmail (OAuth2) — gratis con cuenta de Google
1. En n8n: **Credentials > New > Gmail OAuth2** → **Sign in with Google**.
2. En self-hosted necesitas el mismo proyecto de Google Cloud que para Sheets, pero activando además la **Gmail API**.
3. Guarda como **Gmail (OAuth2)** y selecciónala en los nodos de Gmail.

### Google Sheets (OAuth2) — gratis con cuenta de Google
1. En n8n: **Credentials > New > Google Sheets OAuth2 API**.
2. En n8n Cloud basta con pulsar **Sign in with Google** y autorizar tu cuenta.
3. En n8n self-hosted, antes crea un proyecto en [console.cloud.google.com](https://console.cloud.google.com), activa la **Google Sheets API**, crea un **OAuth Client ID** (tipo Web) y pega la Redirect URI que te muestra n8n; después copia Client ID y Client Secret en la credencial y haz el Sign in.
4. Crea una hoja de cálculo nueva, copia el ID que hay en su URL (entre `/d/` y `/edit`) y pégalo en los nodos donde pone `REEMPLAZAR_ID_DOCUMENTO`.

## Cómo importar

1. En n8n ve a **Workflows > ⋯ > Import from File** (o *Import from Clipboard* y pega el contenido del JSON).
2. Al abrirse el lienzo verás nodos con un triángulo de aviso: son los que salen "en gris" porque les falta credencial. Abre cada uno y selecciona la credencial que creaste en el paso anterior.
3. Sustituye todos los valores `REEMPLAZAR...` (ID de la hoja, canal, chat, email...).
   - Pestañas necesarias: **Borradores enviados a Gmail** y **Prospectos incompletos**.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Webhook prospecto | Recibe el POST en `wf-02-prospecto-nuevo` | Nada |
| Normalizar prospecto | Extrae nombre, email, empresa, cargo, sector y detalle de `$json.body` | Campos extra de tu fuente de prospectos |
| Responder recepción | Confirma la recepción al sistema que llamó | Nada |
| ¿Datos obligatorios? | Exige email y empresa | Añade cargo si tu personalización lo necesita |
| Redactar email con IA | Pide a claude-opus-5 un email de máx. 120 palabras en JSON {asunto, cuerpo} | El prompt: ajusta tono y propuesta de valor |
| Interpretar borrador | Parsea el JSON; si falla, marca el asunto con REVISAR | Nada |
| Crear borrador en Gmail | Crea el borrador dirigido al prospecto (NO lo envía) | Nada — no lo cambies a "send" |
| Registrar borrador | Fila en la pestaña de borradores con estado "pendiente de revisión humana" | El ID del documento |
| Registrar incompleto | Guarda los prospectos rechazados y el motivo | Nada |

## Pruébalo

1. **Normal**
   ```bash
   curl -X POST https://TU-N8N/webhook-test/wf-02-prospecto-nuevo -H "Content-Type: application/json" \
     -d '{"nombre":"Luis","email":"luis@acme.es","empresa":"Acme","cargo":"CTO","sector":"logistica","detalle":"acaban de abrir almacen en Sevilla"}'
   ```
   Debes ver: un borrador nuevo en Gmail (carpeta Borradores) dirigido a luis@acme.es y una fila en la hoja.
2. **Incompleto**
   Sin `empresa`. Debes ver: fila en **Prospectos incompletos**, ni IA ni borrador.
3. **Duplicado**
   Envía dos veces el normal. Debes ver: dos borradores en Gmail. Antes de enviar, revisa la hoja ordenada por email para no escribir dos veces a la misma persona.
4. **Extremo**
   `detalle` con 5.000 caracteres. Debes ver: el flujo responde igual; comprueba que el email generado siga siendo corto (el prompt limita a 120 palabras).

## Errores típicos

- **El borrador aparece sin destinatario** → el campo `options.sendTo` del nodo Gmail perdió la expresión; debe ser `{{ $json.email }}`.
- **Gmail pide re-autenticación** → el token OAuth caducó (frecuente en self-hosted con app en modo "testing" de Google): pasa la app a "In production" o vuelve a hacer Sign in.
- **El email suena genérico** → llega poco contexto: rellena `detalle` y `sector`; la IA solo personaliza con lo que le das.
- **La IA devuelve texto sin JSON** → el asunto sale como "REVISAR: la IA no devolvio JSON"; revisa el prompt y reintenta.

## Coste estimado

Por 100 ejecuciones: ~1.200 tokens de entrada + ~300 de salida por prospecto con claude-opus-5 ≈ 0,12 M entrada (0,60 USD) + 0,03 M salida (0,75 USD) ≈ **1,35 USD**. Gmail y Sheets: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

El cold email B2B tiene límites legales: en España, la LSSI permite comunicaciones a empresas con ciertas condiciones, pero bajo RGPD sigues tratando datos personales (email nominativo) — documenta tu **interés legítimo**, ofrece siempre una vía de baja y no insistas a quien la pida. Que el envío final sea manual (borrador) no te exime: revisa cada borrador antes de mandarlo.
