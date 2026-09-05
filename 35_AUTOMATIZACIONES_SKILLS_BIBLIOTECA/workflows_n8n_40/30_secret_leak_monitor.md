# 30 · Monitor de fugas de secretos

## Qué hace

Escucha los push de tu repositorio (webhook de GitHub), descarga el diff del commit y lo escanea con patrones de secretos conocidos: claves de Anthropic (`sk-ant-`), estilo OpenAI (`sk-`), tokens de GitHub (`ghp_`...), claves AWS (`AKIA`), tokens de Slack (`xox`), claves privadas PEM y cadenas de conexión con contraseña. Si encuentra algo, lo registra en Google Sheets (guardando solo un prefijo enmascarado, nunca el secreto entero) y te manda una **alerta inmediata por Telegram** con el repo, la rama, el commit y el tipo de hallazgo.

Regla de oro que enseña este flujo: si un secreto ha tocado un commit, se revoca. Borrar el commit no lo des-filtra.

## Antes de empezar

- **Gratis**: n8n self-hosted, API de GitHub, bot de Telegram (via @BotFather) y Google Sheets.
- **De pago**: nada — este monitor no usa IA, usa regex deterministas (más rápidas y sin falsos "criterios").
- Necesitas admin en el repo para crear el webhook de push.

## Credenciales paso a paso

### GitHub (Header Auth) — para las llamadas HTTP a api.github.com

1. Puedes reutilizar el mismo token del paso anterior (o crear otro de solo lectura).
2. En n8n crea una credencial **Header Auth**: *Name* = `Authorization`, *Value* = `Bearer TU_TOKEN`.
3. Guárdala como "GitHub (Authorization: Bearer)" y asígnala al nodo HTTP indicado.

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

1. Descarga `30_secret_leak_monitor.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
   - En GitHub: **repo → Settings → Webhooks → Add webhook** con la URL `https://TU-N8N/webhook/wf-30-push-codigo`, content type `application/json`, evento **Push**.
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Push de GitHub (webhook)** — recibe cada push en `wf-30-push-codigo`.
- **Validar push (code)** — extrae repo, sha, rama y autor; descarta pushes sin commit (p. ej. borrado de ramas).
- **¿Push válido? (if)** — false → "Push ignorado".
- **Descargar diff del push (httpRequest)** — GET del commit con `Accept: application/vnd.github.diff` (texto plano).
- **Escanear secretos (code)** — 7 patrones de secretos; guarda cada hallazgo como tipo + prefijo de 8 caracteres enmascarado.
- **¿Hay hallazgos? (if)** — false → "Sin hallazgos" y fin silencioso.
- **Registrar hallazgo (googleSheets)** — fila en la pestaña "Hallazgos" (evidencia y trazabilidad).
- **Alerta por Telegram (telegram)** — mensaje inmediato con instrucciones: revocar la clave ya.
- **Sin hallazgos (noOp)** — rama tranquila.
- **Push ignorado (noOp)** — rama de payloads no procesables.

## Pruébalo

Usa SIEMPRE un repo de pruebas y secretos FALSOS con el formato correcto.

**1. Caso normal (con fuga)**: haz commit de un fichero con la línea `api_key = "sk-ant-api03-FALSA1234567890abcdefghij"` y push. Espera alerta en Telegram y fila en Sheets con `sk-ant-a…`.

**2. Caso incompleto**: borra una rama remota (`git push origin :rama`). El push llega con sha a ceros → espera "Push ignorado".

**3. Caso duplicado**: haz push de dos commits seguidos con el mismo secreto falso. Cada push analiza solo su commit head: verás dos alertas. Ejercicio: deduplica por prefijo consultando la hoja.

**4. Caso extremo**: un diff enorme (añade un fichero de 5 MB de texto). GitHub trunca los diffs gigantes; comprueba que el flujo no casca y considera escanear fichero a fichero con la API de contents.

## Errores típicos

- **No llega la alerta de Telegram**: no has hablado antes con tu bot, o el chat_id es de otro chat. Reenvía "hola" al bot y revisa getUpdates.
- **404 al bajar el diff**: token sin acceso al repo (privado) o sha inexistente (push forzado). Revisa la credencial Header Auth.
- **Falsos positivos con `sk-`**: cadenas tipo `sk-test-...` de ejemplo también disparan. Bien: mejor un falso positivo que una fuga. Ajusta el patrón si te molesta.
- **El secreto completo aparece en Sheets**: has tocado el nodo "Escanear secretos": el `slice(0, 8)` está justo para que eso no ocurra. Restáuralo.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de GitHub**: gratis con los límites estándar de tu cuenta.
- **Telegram**: crear el bot y enviar mensajes es GRATIS.
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Coste cero por ejecución (sin IA). El coste de NO tenerlo es el que duele.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.

## Cobertura obligatoria
El proceso se detiene ante entrada vacía/incompleta o contexto superior al límite; no publica una aprobación ni un análisis completo de un subconjunto. Release notes pagina y contrasta número de commits únicos con total_commits; máximo2000commits/120000caracteres para redactar. PR exige diff íntegro<=20000caracteres y todo veredicto automático es revisar. Push incompleto exige escáner de repositorio sobre el rango completo. Configura error workflow y verifica estos bloqueos con fixtures antes de activar.
