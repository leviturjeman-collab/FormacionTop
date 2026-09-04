# 12 · Recolector de standup diario en Slack

## Qué hace

Dos circuitos en un flujo. 1) Cada persona envía su standup con un slash command de Slack (p. ej. /standup ayer X, hoy Y, bloqueo Z): el webhook lo recibe, valida que traiga texto y lo guarda en Sheets. 2) A las 09:30 otro disparador lee los standups del día, la IA los resume (avances por persona, bloqueos, riesgos) y publica el resumen en el canal del equipo.

## Antes de empezar

- Una cuenta de **n8n**: n8n Cloud (de pago, con prueba gratuita) o **self-hosted gratis** (Docker en tu servidor).
- **API de Anthropic**: de pago por tokens (céntimos por ejecución en este flujo). También puedes apuntar el nodo HTTP a la API de OpenAI si lo prefieres.
- **Google Sheets/Gmail/Calendar**: gratis con tu cuenta de Google.
- **Slack**: gratis (un bot en tu workspace, plan free suficiente).

## Credenciales paso a paso

### Google Sheets (OAuth2) — gratis con cuenta de Google
1. En n8n: **Credentials > New > Google Sheets OAuth2 API**.
2. En n8n Cloud basta con pulsar **Sign in with Google** y autorizar tu cuenta.
3. En n8n self-hosted, antes crea un proyecto en [console.cloud.google.com](https://console.cloud.google.com), activa la **Google Sheets API**, crea un **OAuth Client ID** (tipo Web) y pega la Redirect URI que te muestra n8n; después copia Client ID y Client Secret en la credencial y haz el Sign in.
4. Crea una hoja de cálculo nueva, copia el ID que hay en su URL (entre `/d/` y `/edit`) y pégalo en los nodos donde pone `REEMPLAZAR_ID_DOCUMENTO`.

### Anthropic API (Header Auth) — de pago por tokens
1. Entra en [console.anthropic.com](https://console.anthropic.com) y crea una cuenta (pide añadir un método de pago o crédito inicial).
2. Menú **API Keys** → **Create Key** → copia la clave (empieza por `sk-ant-`). Solo se muestra una vez.
3. En n8n: **Credentials > New > Header Auth**.
   - **Name**: `x-api-key`
   - **Value**: tu clave `sk-ant-...`
4. Guarda la credencial con el nombre **Anthropic API** y selecciónala en el nodo HTTP que llama a la IA.

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
   - Pestañas: **Standups** y **Standups incompletos**.
   - Crea el slash command: en api.slack.com/apps → tu app → **Slash Commands > Create New Command** → Command `/standup`, Request URL = la URL de **producción** del webhook (`https://TU-N8N/webhook/wf-12-standup`). Slack envía `user_name` y `text` automáticamente.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Webhook standup | Recibe el POST del slash command en `wf-12-standup` | Nada |
| Confirmar al usuario | Responde a Slack al instante (evita el timeout de 3 s del slash command) | Nada |
| ¿Trae texto? | Valida que `body.text` no venga vacío | Nada |
| Registrar standup | Fila en Standups con fecha, usuario y texto | El ID del documento |
| Registrar incompleto | Slash commands vacíos quedan registrados | Nada |
| Resumen a las 9:30 | Segundo disparador, programado | La hora |
| Leer standups | Lee toda la pestaña Standups | Nada |
| Preparar resumen | Filtra solo los de hoy y monta el contexto | Nada |
| ¿Hay standups hoy? | Sin standups no hay resumen | Nada |
| Resumir standups | claude-opus-5 resume avances, bloqueos y riesgos | El prompt |
| Publicar resumen | Mensaje en el canal del equipo | REEMPLAZAR_ID_CANAL |
| Sin standups hoy | Fin silencioso | Nada |

## Pruébalo

1. **Normal**
   Escribe en Slack: `/standup ayer cerré el informe, hoy migro la web, sin bloqueos`. Debes ver: confirmación inmediata y fila nueva en Standups. A las 9:30 (o ejecutando a mano la rama del resumen), resumen en el canal.
2. **Incompleto**
   `/standup` sin texto. Debes ver: fila en **Standups incompletos**; el resumen no la cuenta.
3. **Duplicado**
   La misma persona envía dos standups. Debes ver: dos filas; el resumen las funde en la línea de esa persona (la IA agrupa por usuario).
4. **Extremo**
   Un standup de 2.000 caracteres. Debes ver: se guarda entero; el resumen lo condensa a 1 línea por persona.

## Errores típicos

- **Slack marca timeout en el slash command** → estás usando la URL de test (solo funciona con Execute Workflow abierto): usa la URL de producción con el flujo activo.
- **El resumen sale vacío** → las fechas de la columna fecha no empiezan por la fecha de hoy en ISO; no cambies el formato de esa columna.
- **Usuario "desconocido"** → el origen no envía user_name (p. ej. probaste con curl): incluye `usuario` en el body.
- **Doble resumen** → tienes el flujo importado dos veces y ambos activos.

## Coste estimado

Por 100 días de equipo (~8 personas): resumen diario de ~1.000 tokens entrada + 300 salida ≈ **~1,25 USD** con claude-opus-5. Slack/Sheets: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Los standups son datos laborales (quién hizo qué). Informa al equipo de que se archivan en una hoja y se resumen con IA, limita el acceso a la hoja y no uses estos datos para evaluación de desempeño encubierta.
