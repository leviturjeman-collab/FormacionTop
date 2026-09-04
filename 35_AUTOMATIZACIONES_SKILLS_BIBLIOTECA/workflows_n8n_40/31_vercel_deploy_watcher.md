# 31 · Vigilante de deploys de Vercel

## Qué hace

Cada 15 minutos consulta la API de Vercel (`/v6/deployments`), busca deploys en estado ERROR de la última media hora y, si encuentra alguno, registra la incidencia en Google Sheets y avisa al canal de Slack con los proyectos afectados. Si la propia API falla (token caducado, sin permisos), lo detecta y manda un aviso distinto para que arregles la credencial: un vigilante que no puede vigilar también es una incidencia.

## Antes de empezar

- **Gratis**: n8n self-hosted, la API de Vercel (dentro de tu plan), Slack y Google Sheets.
- **De pago**: nada obligatorio; Vercel y Slack tienen planes gratuitos suficientes.
- Ten al menos un proyecto desplegado en Vercel para que la lista no venga vacía.

## Credenciales paso a paso

### Vercel (token)

1. En https://vercel.com: avatar → **Account Settings → Tokens → Create**. Copia el token.
2. En n8n crea una credencial **Header Auth**: *Name* = `Authorization`, *Value* = `Bearer TU_TOKEN`. Guárdala como "Vercel (Authorization: Bearer)".
3. Si tus deploys están en un equipo (no en tu cuenta personal), añade `?teamId=TU_TEAM_ID` a la URL del nodo HTTP.

### Slack (bot)

1. Ve a https://api.slack.com/apps → **Create New App** → *From scratch* → elige tu workspace.
2. En **OAuth & Permissions → Scopes → Bot Token Scopes** añade `chat:write` (y `channels:read`).
3. Pulsa **Install to Workspace** y copia el **Bot User OAuth Token** (empieza por `xoxb-`).
4. En n8n: **Credentials → Add credential → Slack API** → pega el token.
5. En Slack, entra en el canal del flujo y escribe `/invite @tu-bot`. Ajusta el nombre del canal en el nodo si no usas el de ejemplo.

### Google Sheets (OAuth2)

1. En n8n: **Credentials → Add credential → Google Sheets OAuth2 API**. En n8n Cloud basta con pulsar **Sign in with Google** y aceptar los permisos.
2. Si tu n8n es self-hosted: crea un proyecto en https://console.cloud.google.com, habilita la **Google Sheets API**, configura la pantalla de consentimiento y crea una credencial **ID de cliente OAuth** (aplicación web) usando la *Redirect URI* que te muestra n8n. Copia el Client ID y el Client Secret en la credencial de n8n y conéctate.
3. Crea una hoja de cálculo en https://sheets.google.com y copia su **ID de documento**: es el tramo largo de la URL entre `/d/` y `/edit`.
4. En cada nodo de Google Sheets del flujo, pega ese ID donde pone `REEMPLAZAR_ID_DOCUMENTO` y comprueba que el nombre de la pestaña coincide con el indicado en la guía (créala si no existe; los encabezados se crean solos en el primer append).

## Cómo importar

1. Descarga `31_vercel_deploy_watcher.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Cada 15 minutos (scheduleTrigger)** — intervalo de 15 minutos; ajústalo a tu ritmo de deploys.
- **Consultar deploys de Vercel (httpRequest)** — GET con Header Auth y `limit=20`; con neverError para poder inspeccionar fallos de la API.
- **Evaluar deploys (code)** — filtra deploys ERROR de los últimos 30 minutos y marca `api_ok` si la respuesta tiene la forma esperada.
- **¿Respuesta de API válida? (if)** — false → aviso de configuración en Slack (token caducado, etc.).
- **¿Hay deploys fallidos? (if)** — false → "Todo en verde".
- **Registrar incidencia (googleSheets)** — fila en "Deploys" con los proyectos afectados.
- **Alertar en Slack (slack)** — mensaje al canal #deploys con el detalle.
- **Todo en verde (noOp)** — rama tranquila.
- **Avisar fallo de configuración (slack)** — mensaje distinto cuando la API no responde bien.

## Pruébalo

Sin webhook: usa **Execute workflow** para cada caso.

**1. Caso normal (sin fallos)**: con tus deploys en verde, ejecuta. Espera terminar en "Todo en verde" sin mensajes.

**2. Caso incompleto (API rota)**: cambia temporalmente el token de la credencial por uno inválido y ejecuta. Espera el mensaje "no pudo leer la API" en Slack. Restaura el token.

**3. Caso duplicado**: fuerza un deploy roto (por ejemplo, un `build` que haga `exit 1`) y deja el flujo activo dos ciclos. Verás la misma incidencia dos veces mientras siga dentro de la ventana de 30 minutos: ejercicio, deduplica consultando la hoja por URL del deploy.

**4. Caso extremo (deploy roto real)**: rompe el build de un proyecto de pruebas y espera al siguiente ciclo (o ejecuta a mano). Espera fila en Sheets + alerta con el nombre del proyecto.

## Errores típicos

- **403 `forbidden` de Vercel**: token mal copiado o sin acceso al scope del equipo: añade `?teamId=...` a la URL si el proyecto es de un equipo.
- **Slack no publica (`channel_not_found`)**: el bot no está en el canal: `/invite @tu-bot` en #deploys, o cambia el canal del nodo.
- **Nunca detecta nada aunque hay fallos**: los deploys fallidos son más viejos que la ventana de 30 minutos, o tu proyecto reporta el estado en `readyState`; el code ya mira ambos campos.
- **Se dispara cada 15 min en pruebas**: desactiva el flujo mientras experimentas y usa Execute workflow a mano.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de Vercel**: consultar deploys no cuesta nada extra; entra en tu plan de Vercel.
- **Slack**: publicar mensajes con un bot es gratis en cualquier plan.
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Sin coste de IA. 96 consultas al día a la API de Vercel entran de sobra en los límites normales.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.
