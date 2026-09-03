# 34 · Router multi-LLM con fallback

## Qué hace

Un único webhook para tus apps que necesiten IA: recibe un `prompt`, intenta primero con Claude (Anthropic) y, si esa llamada falla — clave inválida, límite 429, caída del servicio —, la **salida de error** del nodo HTTP desvía la petición automáticamente a OpenAI como proveedor de reserva. La respuesta se normaliza a un formato común (proveedor, modelo, texto, tokens), se registra cada intento en Google Sheets (con qué proveedor respondió y por qué hubo fallback) y se contesta al llamante.

Es el patrón "no dependas de un solo proveedor" en su versión mínima y legible.

## Antes de empezar

- **Gratis**: n8n self-hosted y Google Sheets.
- **De pago**: las DOS APIs de IA (Anthropic y OpenAI), ambas por tokens. La de reserva solo cobra cuando se usa.
- Necesitas clave de los dos proveedores para probar el fallback de verdad.

## Credenciales paso a paso

### Anthropic API (Header Auth) — para los nodos que llaman a Claude

1. Entra en https://console.anthropic.com con tu cuenta, ve a **API Keys** y pulsa **Create Key**. Copia la clave (empieza por `sk-ant-`): solo se muestra una vez.
2. En n8n: **Credentials → Add credential → Header Auth**.
3. En **Name** (nombre de la cabecera) escribe exactamente `x-api-key`. En **Value** pega tu clave.
4. Guarda la credencial como "Anthropic API (x-api-key)" y selecciónala en el nodo HTTP que llama a Claude (viene marcado con id REEMPLAZAR).

El nodo ya envía la cabecera `anthropic-version` por ti; no tienes que añadir nada más.

### OpenAI API (Header Auth)

1. Entra en https://platform.openai.com → **API keys** → **Create new secret key** y copia la clave.
2. En n8n: **Credentials → Add credential → Header Auth**.
3. En **Name** escribe `Authorization` y en **Value** escribe `Bearer TU_CLAVE` (la palabra Bearer, un espacio y la clave).
4. Guarda como "OpenAI API (Authorization: Bearer)" y asígnala al nodo correspondiente.

### Google Sheets (OAuth2)

1. En n8n: **Credentials → Add credential → Google Sheets OAuth2 API**. En n8n Cloud basta con pulsar **Sign in with Google** y aceptar los permisos.
2. Si tu n8n es self-hosted: crea un proyecto en https://console.cloud.google.com, habilita la **Google Sheets API**, configura la pantalla de consentimiento y crea una credencial **ID de cliente OAuth** (aplicación web) usando la *Redirect URI* que te muestra n8n. Copia el Client ID y el Client Secret en la credencial de n8n y conéctate.
3. Crea una hoja de cálculo en https://sheets.google.com y copia su **ID de documento**: es el tramo largo de la URL entre `/d/` y `/edit`.
4. En cada nodo de Google Sheets del flujo, pega ese ID donde pone `REEMPLAZAR_ID_DOCUMENTO` y comprueba que el nombre de la pestaña coincide con el indicado en la guía (créala si no existe; los encabezados se crean solos en el primer append).

## Cómo importar

1. Descarga `34_multi_llm_fallback_router.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Consulta de IA (webhook)** — POST en `wf-34-consulta-ia` con `prompt` (y `origen` opcional).
- **Validar consulta (code)** — obligatorio `prompt`; recorta a 8 000 caracteres y monta la petición para Claude.
- **¿Consulta válida? (if)** — false → respuesta 400.
- **Llamar a Claude (principal) (httpRequest)** — con `onError: continueErrorOutput`: el fallo no rompe el flujo, sale por la segunda salida.
- **Normalizar respuesta principal (code)** — extrae el texto y los tokens del formato de Anthropic.
- **Preparar reserva (code)** — recupera el prompt original, apunta el motivo del fallo y monta la petición para OpenAI.
- **Llamar a OpenAI (reserva) (httpRequest)** — chat completions con gpt-4.1-mini.
- **Normalizar respuesta de reserva (code)** — mismo formato de salida, con `con_fallback: true`.
- **Registrar intento (googleSheets)** — fila en "Consultas" con proveedor, fallback y tokens.
- **Responder al cliente (respondToWebhook)** — respuesta unificada.
- **Responder incompleto (respondToWebhook)** — error 400.

## Pruébalo

**1. Caso normal**:
```bash
curl -X POST https://TU-N8N/webhook-test/wf-34-consulta-ia \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Resume en dos frases qué es n8n.","origen":"demo"}'
```
Espera `proveedor: anthropic` y `con_fallback: false`.

**2. Caso incompleto**: body `{}` → 400 con `faltan: ["prompt"]`.

**3. Caso duplicado**: el mismo prompt dos veces son dos llamadas pagadas. Ejercicio: cachea por hash del prompt en la hoja y devuelve la respuesta guardada.

**4. Caso extremo (probar el fallback)**: rompe a propósito la credencial de Anthropic (cambia una letra de la clave) y repite el caso normal. Espera `proveedor: openai`, `con_fallback: true` y el motivo en la columna `error_principal` del Sheets. Restaura la clave al acabar.

## Errores típicos

- **El fallo de Claude detiene el flujo en vez de ir a la reserva**: el nodo principal debe tener "On error → Continue (using error output)"; el JSON ya lo trae (`onError: continueErrorOutput`), no lo cambies.
- **Fallback también falla**: la respuesta al cliente no llega: mira las dos credenciales. Ejercicio avanzado: añade un tercer respond de error 502.
- **`con_fallback` siempre true**: la credencial de Anthropic está mal desde el principio (cabecera distinta de `x-api-key`).
- **Tokens en blanco en el registro**: algunos errores devuelven item sin usage; es normal en la fila del fallback.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de Anthropic (Claude Opus 5)**: de pago por tokens, referencia 5 USD por millón de tokens de entrada y 25 USD por millón de salida — COMPROBAR EN LA WEB OFICIAL (anthropic.com/pricing).
- **API de OpenAI (gpt-4.1-mini de reserva)**: de pago por tokens, más barato que el principal — COMPROBAR EN LA WEB OFICIAL (openai.com/api/pricing).
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Pagas por lo que uses: en operación normal solo Anthropic; OpenAI únicamente cuando hay fallback.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.
