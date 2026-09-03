# 33 · Monitor de salud de APIs

## Qué hace

Cada 5 minutos hace ping (GET con timeout de 10 s) a la lista de servicios que definas — tu API, tu web, tu panel — y evalúa cada respuesta. Si algo devuelve 4xx/5xx o no responde, registra la incidencia en Google Sheets y te avisa al momento por **Telegram** con el servicio, el código HTTP y la hora. Los servicios sanos pasan por la rama "Servicio OK" sin hacer ruido.

## Antes de empezar

- **Gratis**: todo — n8n self-hosted, bot de Telegram (@BotFather) y Google Sheets. Sin IA.
- Ten a mano las URLs reales de tus servicios; si tienes endpoints `/health`, mejor que la home.

## Credenciales paso a paso

### Telegram (bot GRATIS)

1. En Telegram, abre un chat con **@BotFather** → `/newbot` → elige nombre y usuario del bot. Te devuelve un token del tipo `123456789:ABC-DEF...`. Crear el bot es gratis.
2. En n8n: **Credentials → Add credential → Telegram API** → pega el token.
3. Escríbele cualquier mensaje a tu bot (por ejemplo "hola") para abrir la conversación: un bot no puede iniciarla él.
4. Consigue tu `chat_id`: visita `https://api.telegram.org/botTU_TOKEN/getUpdates` en el navegador y copia el valor de `message.chat.id` (también sirve el bot @userinfobot).
5. En el nodo de Telegram del flujo sustituye `REEMPLAZAR_CHAT_ID` por ese número.

### Google Sheets (OAuth2)

1. En n8n: **Credentials → Add credential → Google Sheets OAuth2 API**. En n8n Cloud basta con pulsar **Sign in with Google** y aceptar los permisos.
2. Si tu n8n es self-hosted: crea un proyecto en https://console.cloud.google.com, habilita la **Google Sheets API**, configura la pantalla de consentimiento y crea una credencial **ID de cliente OAuth** (aplicación web) usando la *Redirect URI* que te muestra n8n. Copia el Client ID y el Client Secret en la credencial de n8n y conéctate.
3. Crea una hoja de cálculo en https://sheets.google.com y copia su **ID de documento**: es el tramo largo de la URL entre `/d/` y `/edit`.
4. En cada nodo de Google Sheets del flujo, pega ese ID donde pone `REEMPLAZAR_ID_DOCUMENTO` y comprueba que el nombre de la pestaña coincide con el indicado en la guía (créala si no existe; los encabezados se crean solos en el primer append).

## Cómo importar

1. Descarga `33_api_health_monitor.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Cada 5 minutos (scheduleTrigger)** — intervalo de 5 minutos.
- **Definir endpoints (code)** — la lista de servicios a vigilar (nombre + url): edítala aquí.
- **Hacer ping (httpRequest)** — GET a cada URL con timeout 10 s, neverError y fullResponse para leer el statusCode.
- **Evaluar respuesta (code)** — código 0 (sin respuesta) o >= 400 = caído.
- **¿Servicio caído? (if)** — false → "Servicio OK".
- **Registrar incidencia (googleSheets)** — fila en "Incidencias" con código y hora.
- **Alerta por Telegram (telegram)** — mensaje inmediato por servicio caído.
- **Servicio OK (noOp)** — rama tranquila.

## Pruébalo

Sin webhook: **Execute workflow**.

**1. Caso normal**: pon en la lista dos URLs sanas (p. ej. `https://www.google.com`) y ejecuta. Espera todo por "Servicio OK".

**2. Caso incompleto (URL rota)**: añade `https://no-existe-seguro-12345.com` y ejecuta. Espera código 0 y alerta por Telegram.

**3. Caso duplicado**: deja la URL rota y el flujo activo dos ciclos: dos alertas. Ejercicio clásico de guardia: añade un IF que consulte la hoja y silencie repeticiones de la misma incidencia durante 1 h.

**4. Caso extremo (error de servidor)**: añade `https://httpstat.us/500` (devuelve 500 a propósito). Espera alerta con código 500. Prueba también `https://httpstat.us/200?sleep=15000`: tarda más que el timeout y debe contar como caído.

## Errores típicos

- **Alertas en cada ciclo por un servicio lento**: sube el timeout de 10 s en "Hacer ping" o vigila un endpoint /health más ligero.
- **No llega el Telegram**: chat_id equivocado o nunca has escrito a tu bot (los bots no pueden iniciar chat).
- **Todos aparecen caídos**: tu n8n no tiene salida a internet o un proxy corta las peticiones; prueba una URL desde el mismo servidor.
- **El flujo tarda mucho**: los pings van en serie item a item; con muchas URLs, reduce la lista o sube el intervalo del trigger.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **Telegram**: crear el bot y enviar mensajes es GRATIS.
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Sin coste de IA. 288 ciclos al día de puro HTTP.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.
