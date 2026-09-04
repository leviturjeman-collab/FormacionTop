# 06 · Router de tickets de soporte con confirmación WhatsApp

## Qué hace

Recibe tickets de soporte por webhook, valida que traigan mensaje y teléfono, y la IA los clasifica por área (facturación / técnico / general) y prioridad, con una respuesta sugerida interna. Todo queda en Google Sheets. Después, Slack pide aprobación humana (botón Approve) y **solo si alguien aprueba** se envía al cliente la confirmación de recepción por WhatsApp. Sin aprobación, no sale ningún mensaje.

## Antes de empezar

- Una cuenta de **n8n**: n8n Cloud (de pago, con prueba gratuita) o **self-hosted gratis** (Docker en tu servidor).
- **API de Anthropic**: de pago por tokens (céntimos por ejecución en este flujo). También puedes apuntar el nodo HTTP a la API de OpenAI si lo prefieres.
- **Google Sheets/Gmail/Calendar**: gratis con tu cuenta de Google.
- **Slack**: gratis (un bot en tu workspace, plan free suficiente).
- **WhatsApp**: requiere **cuenta Meta Business + WhatsApp Business Cloud API con número verificado**; el envío de texto libre solo funciona dentro de la ventana de 24 h desde el último mensaje del cliente.

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

### WhatsApp Business Cloud — requiere cuenta Meta Business (el API tiene coste por conversación)
1. Entra en [developers.facebook.com](https://developers.facebook.com) → **My Apps > Create App** → tipo **Business**.
2. Añade el producto **WhatsApp** a la app. Necesitas una cuenta **Meta Business verificada** y un **número de teléfono propio verificado** (el número de prueba solo sirve para 5 destinatarios de test).
3. En **WhatsApp > API Setup** copia el **Phone Number ID** (va donde pone `REEMPLAZAR_PHONE_NUMBER_ID`).
4. Crea un **token permanente**: Business Settings → **System Users** → crea uno, asígnale la app y genera un token con permisos `whatsapp_business_messaging` y `whatsapp_business_management`.
5. En n8n: **Credentials > New > WhatsApp API** → pega el token de acceso → guarda como **WhatsApp Business Cloud**.

## Cómo importar

1. En n8n ve a **Workflows > ⋯ > Import from File** (o *Import from Clipboard* y pega el contenido del JSON).
2. Al abrirse el lienzo verás nodos con un triángulo de aviso: son los que salen "en gris" porque les falta credencial. Abre cada uno y selecciona la credencial que creaste en el paso anterior.
3. Sustituye todos los valores `REEMPLAZAR...` (ID de la hoja, canal, chat, email...).
   - Pestañas: **Tickets** y **Tickets incompletos**.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Webhook ticket | Recibe el POST en `wf-06-ticket-nuevo` | Nada |
| Normalizar ticket | Extrae cliente, teléfono (solo dígitos y +), email, asunto y mensaje del body | Nada |
| Responder recepción | Confirma al sistema origen | Nada |
| ¿Ticket completo? | Exige mensaje y teléfono | Cambia teléfono por email si confirmas por correo |
| Clasificar ticket con IA | claude-opus-5 devuelve área, prioridad, resumen y respuesta sugerida | Las áreas del prompt: pon los equipos reales de tu empresa |
| Interpretar clasificación | Parsea el JSON con tolerancia a fallos | Nada |
| Registrar ticket | Fila en Tickets con estado "abierto" | El ID del documento |
| Aprobar confirmación | Mensaje en Slack con botón de aprobación (sendAndWait): el flujo espera aquí | El canal del equipo de soporte |
| Confirmar por WhatsApp | Envía la confirmación al cliente SOLO tras la aprobación | REEMPLAZAR_PHONE_NUMBER_ID |
| Registrar incompleto | Tickets rechazados con motivo | Nada |

## Pruébalo

1. **Normal**
   ```bash
   curl -X POST https://TU-N8N/webhook-test/wf-06-ticket-nuevo -H "Content-Type: application/json" \
     -d '{"cliente":"Ana Ruiz","telefono":"+34600111222","email":"ana@cliente.es","asunto":"No puedo pagar","mensaje":"Al pagar con tarjeta me da error 402"}'
   ```
   Debes ver: fila en Tickets (área facturación), mensaje en Slack con botones; al pulsar **Approve**, WhatsApp de confirmación al +34600111222 (en pruebas usa tu propio número de test).
2. **Incompleto**
   Sin `telefono`. Debes ver: fila en **Tickets incompletos**; no hay clasificación ni WhatsApp.
3. **Duplicado**
   El mismo ticket dos veces → dos aprobaciones pendientes en Slack. Aprueba solo una y deja caducar la otra: el cliente recibe una única confirmación.
4. **Extremo**
   Mensaje con 4.000 caracteres insultando. Debes ver: la IA clasifica igual (probablemente prioridad alta); la respuesta sugerida queda en la hoja para que soporte la adapte — nunca se envía sola.

## Errores típicos

- **WhatsApp devuelve error 131047 (fuera de ventana)** → han pasado más de 24 h desde el último mensaje del cliente: necesitas una plantilla aprobada (mira el flujo 18).
- **El flujo se queda "esperando" para siempre** → nadie pulsó Approve en Slack; configura un timeout en el nodo sendAndWait (Options > Limit Wait Time).
- **Recipient phone number not in allowed list** → estás con el número de prueba de Meta: añade tu teléfono a la lista de destinatarios de test.
- **El teléfono llega sin prefijo** → WhatsApp exige formato internacional (+34...): corrige el origen del dato.

## Coste estimado

Por 100 tickets: IA ≈ **1,50 USD** (claude-opus-5, ~1.500 tokens entrada + 250 salida). WhatsApp: las conversaciones de servicio iniciadas por el cliente dentro de 24 h son gratuitas en la mayoría de mercados; fuera de ventana pagas por plantilla/conversación (~0,03-0,08 € en España) — **COMPROBAR EN LA WEB OFICIAL** de Meta. Slack/Sheets: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Tratas nombre, teléfono y el contenido del ticket: base legal, ejecución de contrato/soporte solicitado. La confirmación por WhatsApp es un mensaje de servicio respondiendo al cliente; fuera de la ventana de 24 h WhatsApp **exige plantillas aprobadas por Meta**. No uses el teléfono del ticket para marketing sin consentimiento aparte.
