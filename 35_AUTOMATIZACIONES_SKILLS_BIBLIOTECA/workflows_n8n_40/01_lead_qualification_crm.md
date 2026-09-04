# 01 · Cualificación de leads con IA y CRM

## Qué hace

Recibe cada lead nuevo por webhook (desde tu formulario web), valida que traiga nombre y email, lo puntúa de 0 a 100 con la IA de Anthropic y lo clasifica en caliente / tibio / frio. Todos los leads quedan registrados en Google Sheets (tu mini CRM) y, solo si el lead es caliente, avisa al canal de ventas en Slack. Nadie escribe al lead automáticamente: la decisión de contactar es siempre humana.

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
   - En tu hoja crea las pestañas **CRM Leads** y **Leads incompletos** (los encabezados los crea n8n al primer append si activas esa opción, o cópialos de la tabla de abajo).
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Webhook lead nuevo | Recibe el POST del formulario en la ruta `wf-01-lead-nuevo` | Nada; conecta tu formulario a la URL de producción |
| Normalizar lead | Saca los campos de `$json.body`, limpia espacios y pone el email en minúsculas | Añade aquí campos extra de tu formulario |
| Responder al formulario | Devuelve el lead normalizado como confirmación | Nada |
| ¿Datos obligatorios? | Comprueba que email y nombre no estén vacíos | Añade más condiciones si tu negocio exige más campos |
| Cualificar con IA | Llama a la API de Anthropic (claude-opus-5) pidiendo puntuación, segmento y motivo en JSON | La credencial Anthropic API y, si quieres, el prompt |
| Interpretar respuesta IA | Parsea el JSON de la IA con tolerancia a fallos | Nada |
| Registrar en CRM | Añade una fila a la pestaña CRM Leads | El ID del documento |
| ¿Lead caliente? | Deja pasar solo segmento = caliente | El umbral (p. ej. puntuación >= 70) |
| Avisar a ventas | Mensaje en Slack con puntuación y siguiente acción sugerida | El canal (REEMPLAZAR_ID_CANAL) |
| Registrar incompleto | Guarda en Leads incompletos lo que llegó y por qué se rechazó | Nada |

## Pruébalo

1. **Normal**
   ```bash
   curl -X POST https://TU-N8N/webhook-test/wf-01-lead-nuevo -H "Content-Type: application/json" \
     -d '{"nombre":"Marta Solís","email":"marta@ejemplo.es","empresa":"Solís SL","interes":"formacion para 12 personas"}'
   ```
   Debes ver: fila nueva en **CRM Leads** con puntuación y segmento; si sale caliente, mensaje en Slack.
2. **Incompleto**
   Mismo curl pero sin `email`. Debes ver: fila en **Leads incompletos** con el motivo, y ninguna llamada a la IA.
3. **Duplicado**
   Envía dos veces el caso normal. Debes ver: dos filas en CRM Leads (este flujo no deduplica); localízalas filtrando por email y decide tú. Si quieres deduplicar, añade un IF que consulte la hoja antes de registrar.
4. **Extremo**
   Envía `interes` con 3.000 caracteres y emojis. Debes ver: el flujo funciona igual; comprueba que la celda de la hoja no rompa nada y que la puntuación siga siendo un número 0-100.

## Errores típicos

- **401 en "Cualificar con IA"** → la credencial Header Auth no se llama `x-api-key` o la clave está mal copiada. Rehaz la credencial.
- **La IA devuelve texto y no JSON** → el nodo "Interpretar respuesta IA" lo marca como `segmento: revisar`; endurece el prompt ("Responde SOLO con JSON").
- **"The resource you are requesting could not be found" en Sheets** → el ID del documento sigue siendo REEMPLAZAR_ID_DOCUMENTO o la pestaña no se llama exactamente `CRM Leads`.
- **Slack no publica** → el bot no está invitado al canal (`/invite @tu-bot`) o falta el scope `chat:write`.
- **El webhook responde 404** → estás usando la URL de producción sin haber activado el flujo; en pruebas usa la URL `webhook-test` con Execute Workflow abierto.

## Coste estimado

Por 100 ejecuciones: la llamada a claude-opus-5 usa ~1.500 tokens de entrada y ~200 de salida por lead → unos 0,15 M de entrada (0,75 USD) + 0,02 M de salida (0,50 USD) ≈ **1,25 USD**. Sheets y Slack: 0 €. n8n Cloud desde ~24 €/mes o self-host gratis. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Tratas datos personales (nombre, email, teléfono): bajo RGPD necesitas base legal — normalmente el **consentimiento** marcado en el propio formulario — e informar en tu política de privacidad de que usas un proveedor de IA como encargado de tratamiento. No envíes a la IA más datos de los necesarios y atiende las solicitudes de supresión borrando también las filas de la hoja.
