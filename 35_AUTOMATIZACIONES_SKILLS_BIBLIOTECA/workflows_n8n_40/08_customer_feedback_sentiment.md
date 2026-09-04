# 08 · Sentimiento de feedback de clientes

## Qué hace

Recibe feedback de clientes por webhook (desde encuestas, formularios o tu app), la IA analiza sentimiento (positivo/neutro/negativo), urgencia y temas, y añade una respuesta sugerida de uso interno. Todo se registra en Google Sheets y, si el sentimiento es negativo, alerta al canal de CX en Slack para que una persona responda. La respuesta sugerida jamás se envía sola al cliente.

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
   - Pestañas: **Feedback** y **Feedback incompleto**.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Webhook feedback | Recibe el POST en `wf-08-feedback-cliente` | Nada |
| Normalizar feedback | Extrae cliente, email, canal y mensaje (recortado a 4.000 caracteres) | Nada |
| Responder recepción | Confirma la recepción | Nada |
| ¿Trae mensaje? | Rechaza feedback vacío | Nada |
| Analizar sentimiento | claude-opus-5 devuelve sentimiento, urgencia, temas y respuesta sugerida | El prompt si quieres más matices (p. ej. detectar churn) |
| Interpretar análisis | Parsea el JSON | Nada |
| Registrar feedback | Fila completa en la pestaña Feedback | El ID del documento |
| ¿Negativo? | Deja pasar solo sentimiento = negativo | Añade OR urgencia = alta si quieres más sensibilidad |
| Alertar a CX | Aviso en Slack con extracto y temas | El canal |
| Registrar incompleto | Peticiones sin mensaje | Nada |

## Pruébalo

1. **Normal**
   ```bash
   curl -X POST https://TU-N8N/webhook-test/wf-08-feedback-cliente -H "Content-Type: application/json" \
     -d '{"cliente":"Pedro","email":"pedro@mail.es","canal":"encuesta","mensaje":"El curso me encanto, aunque el aula virtual iba lenta"}'
   ```
   Debes ver: fila en Feedback (probablemente positivo con tema "aula virtual"); sin alerta en Slack.
2. **Incompleto**
   Sin `mensaje`. Debes ver: fila en **Feedback incompleto** y nada más.
3. **Duplicado**
   El mismo feedback dos veces → dos filas y, si es negativo, dos alertas. Filtra por email + mensaje en la hoja para detectar reenvíos del formulario.
4. **Extremo**
   Mensaje: "TODO FATAL, me voy a la competencia YA". Debes ver: sentimiento negativo, urgencia alta y alerta inmediata en Slack con la respuesta sugerida en la hoja.

## Errores típicos

- **Sentimiento siempre "revisar"** → la IA no devolvió JSON: revisa `ia_texto_bruto` en la ejecución y endurece el prompt.
- **Alertas de más** → feedback neutro clasificado como negativo: da ejemplos de cada clase en el prompt (few-shot).
- **Mensajes largos truncados** → el recorte a 4.000 caracteres es intencionado para controlar coste; súbelo si lo necesitas.
- **Slack silencioso** → bot sin invitar al canal o ID de canal incorrecto.

## Coste estimado

Por 100 ejecuciones: ~800 tokens de entrada + 200 de salida ≈ **~0,90 USD** con claude-opus-5. Sheets/Slack: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

El feedback es dato personal (opinión ligada a un email). Base legal habitual: interés legítimo en mejorar el servicio — infórmalo en la encuesta. Cuidado especial si el texto libre revela datos sensibles (salud, ideología): no los proceses con IA sin evaluarlo y aplica minimización.
