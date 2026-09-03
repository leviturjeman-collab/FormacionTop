# 14 · Resumen de transcripciones de YouTube

## Qué hace

Recibe por webhook la transcripción de un vídeo de YouTube (cópiala desde "Mostrar transcripción" del propio vídeo), la IA la resume en 5-8 frases con puntos clave, citas textuales y para quién es útil. El resumen queda en Google Sheets y se comparte en el canal interno de Slack. Ideal para que el equipo "vea" charlas de 1 hora en 1 minuto.

## Antes de empezar

- Una cuenta de **n8n**: n8n Cloud (de pago, con prueba gratuita) o **self-hosted gratis** (Docker en tu servidor).
- **API de Anthropic**: de pago por tokens (céntimos por ejecución en este flujo). También puedes apuntar el nodo HTTP a la API de OpenAI si lo prefieres.
- **Google Sheets/Gmail/Calendar**: gratis con tu cuenta de Google.
- **Slack**: gratis (un bot en tu workspace, plan free suficiente).

## Credenciales paso a paso

### Anthropic API (Header Auth) — de pago por tokens
1. Entra en [console.anthropic.com](https://console.anthropic.com) y crea una cuenta (pide añadir un método de pago o crédito inicial).
2. Menú **API Keys** → **Create Key** → copia la clave (empieza por `sk-ant-`). Solo se muestra una vez.
3. En n8n: **Credentials > New > Header Auth**.
   - **Name**: `x-api-key`
   - **Value**: tu clave `sk-ant-...`
4. Guarda la credencial con el nombre **Anthropic API** y selecciónala en el nodo HTTP que llama a la IA.

### Google Sheets (OAuth2) — gratis con cuenta de Google
1. En n8n: **Credentials > New > Google Sheets OAuth2 API**.
2. En n8n Cloud basta con pulsar **Sign in with Google** y autorizar tu cuenta.
3. En n8n self-hosted, antes crea un proyecto en [console.cloud.google.com](https://console.cloud.google.com), activa la **Google Sheets API**, crea un **OAuth Client ID** (tipo Web) y pega la Redirect URI que te muestra n8n; después copia Client ID y Client Secret en la credencial y haz el Sign in.
4. Crea una hoja de cálculo nueva, copia el ID que hay en su URL (entre `/d/` y `/edit`) y pégalo en los nodos donde pone `REEMPLAZAR_ID_DOCUMENTO`.

### Slack Bot — gratis (plan free de Slack vale)
1. Entra en [api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → *From scratch* → elige tu workspace.
2. En **OAuth & Permissions > Scopes > Bot Token Scopes** añade `chat:write` (y `channels:read` para elegir canal por lista).
3. **Install to Workspace** → copia el **Bot User OAuth Token** (`xoxb-...`).
4. En n8n: **Credentials > New > Slack API** → pega el token → guarda como **Slack Bot**.
5. En Slack, invita al bot al canal: `/invite @tu-bot`. El ID del canal sale al pulsar el nombre del canal (abajo del todo) y va donde pone `REEMPLAZAR_ID_CANAL`.

## Cómo importar

1. En n8n ve a **Workflows > ⋯ > Import from File** (o *Import from Clipboard* y pega el contenido del JSON).
2. Al abrirse el lienzo verás nodos con un triángulo de aviso: son los que salen "en gris" porque les falta credencial. Abre cada uno y selecciona la credencial que creaste en el paso anterior.
3. Sustituye todos los valores `REEMPLAZAR...` (ID de la hoja, canal, chat, email...).
   - Pestañas: **Resumenes YouTube** y **Transcripciones incompletas**.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Webhook transcripción | Recibe el POST en `wf-14-transcripcion-youtube` | Nada |
| Normalizar transcripción | Extrae video_url, título y transcripción (máx. 40.000 caracteres) | El límite: 40k ≈ 45 min de vídeo hablado |
| Responder recepción | Confirma la recepción | Nada |
| ¿Trae transcripción? | Rechaza peticiones sin transcripción | Nada |
| Resumir con IA | claude-opus-5 devuelve resumen, puntos clave, citas y "para quién" | El prompt (idioma, longitud) |
| Interpretar resumen | Parsea el JSON con tolerancia | Nada |
| Registrar resumen | Fila en Resumenes YouTube | El ID del documento |
| Compartir resumen | Mensaje en Slack con resumen y puntos clave | REEMPLAZAR_ID_CANAL |
| Registrar incompleta | Peticiones sin transcripción | Nada |

## Pruébalo

1. **Normal**
   ```bash
   curl -X POST https://TU-N8N/webhook-test/wf-14-transcripcion-youtube -H "Content-Type: application/json" \
     -d '{"video_url":"https://youtu.be/abc123","titulo":"Como usar IA en tu pyme","transcripcion":"hola a todos hoy vamos a ver tres formas de usar la IA... (pega la transcripcion real)"}'
   ```
   Debes ver: fila en la hoja y resumen en Slack.
2. **Incompleto**
   Solo `video_url`, sin transcripción. Debes ver: fila en **Transcripciones incompletas**; el flujo NO descarga la transcripción por ti.
3. **Duplicado**
   El mismo vídeo dos veces → dos resúmenes casi iguales en el canal. Filtra por video_url en la hoja para detectar repetidos.
4. **Extremo**
   Transcripción de 100.000 caracteres (vídeo de 2 h). Debes ver: se recorta a 40.000 — el resumen cubre solo la primera mitad; divide el vídeo en dos peticiones.

## Errores típicos

- **Resumen en otro idioma** → la transcripción venía en inglés: pide en el prompt "resume en español".
- **Citas inventadas** → baja la temperatura del asunto pidiendo "citas textuales copiadas literalmente"; verifica antes de difundir.
- **Coste alto** → transcripciones largas son muchos tokens: recorta a los minutos que interesan.
- **Slack corta el mensaje** → resumen + puntos superan 4.000 caracteres: reduce puntos clave a 5 (ya viene así).

## Coste estimado

Por 100 vídeos (~10.000 tokens de entrada + 500 de salida cada uno): 1 M entrada (5,00 USD) + 0,05 M salida (1,25 USD) ≈ **~6,25 USD** con claude-opus-5 — el más caro de la serie por la longitud de entrada. Sheets/Slack: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

La transcripción es contenido con derechos de autor: usa el resumen internamente o con cita y enlace al vídeo original; no republiques transcripciones completas. Si el vídeo es tuyo, sin problema.
