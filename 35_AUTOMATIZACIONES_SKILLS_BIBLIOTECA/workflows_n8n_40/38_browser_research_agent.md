# 38 · Agente de investigación web

## Qué hace

Recibe un tema por webhook y lanza una investigación real: la llamada a la API de Anthropic activa la herramienta integrada de **búsqueda web** (hasta 3 búsquedas por encargo), con la que Claude se documenta y redacta un informe en español con contexto, hallazgos con su fuente y una conclusión prudente. El flujo extrae las URLs consultadas, guarda informe y fuentes en Google Sheets y deja el informe como **borrador en Gmail** para que lo revises antes de reenviarlo; también lo devuelve en la respuesta del webhook.

No necesitas contratar un buscador aparte: la búsqueda va dentro de la propia llamada a la API.

## Antes de empezar

- **Gratis**: n8n self-hosted, Google Sheets y Gmail.
- **De pago**: la API de Anthropic. Ojo doble: pagas los tokens Y un coste por búsqueda web ejecutada — COMPROBAR EN LA WEB OFICIAL (anthropic.com/pricing).
- El nodo limita a 3 búsquedas por encargo (max_uses) precisamente para acotar ese coste.

## Credenciales paso a paso

### Anthropic API (Header Auth) — para los nodos que llaman a Claude

1. Entra en https://console.anthropic.com con tu cuenta, ve a **API Keys** y pulsa **Create Key**. Copia la clave (empieza por `sk-ant-`): solo se muestra una vez.
2. En n8n: **Credentials → Add credential → Header Auth**.
3. En **Name** (nombre de la cabecera) escribe exactamente `x-api-key`. En **Value** pega tu clave.
4. Guarda la credencial como "Anthropic API (x-api-key)" y selecciónala en el nodo HTTP que llama a Claude (viene marcado con id REEMPLAZAR).

El nodo ya envía la cabecera `anthropic-version` por ti; no tienes que añadir nada más.

### Google Sheets (OAuth2)

1. En n8n: **Credentials → Add credential → Google Sheets OAuth2 API**. En n8n Cloud basta con pulsar **Sign in with Google** y aceptar los permisos.
2. Si tu n8n es self-hosted: crea un proyecto en https://console.cloud.google.com, habilita la **Google Sheets API**, configura la pantalla de consentimiento y crea una credencial **ID de cliente OAuth** (aplicación web) usando la *Redirect URI* que te muestra n8n. Copia el Client ID y el Client Secret en la credencial de n8n y conéctate.
3. Crea una hoja de cálculo en https://sheets.google.com y copia su **ID de documento**: es el tramo largo de la URL entre `/d/` y `/edit`.
4. En cada nodo de Google Sheets del flujo, pega ese ID donde pone `REEMPLAZAR_ID_DOCUMENTO` y comprueba que el nombre de la pestaña coincide con el indicado en la guía (créala si no existe; los encabezados se crean solos en el primer append).

### Gmail (OAuth2)

1. En n8n: **Credentials → Add credential → Gmail OAuth2**. En n8n Cloud, **Sign in with Google** y listo.
2. Self-hosted: en el mismo proyecto de Google Cloud de antes, habilita la **Gmail API** y reutiliza el Client ID / Client Secret con la Redirect URI de n8n.
3. Asigna la credencial al nodo de Gmail y sustituye el destinatario `REEMPLAZAR_...@ejemplo.com` por un correo real.

## Cómo importar

1. Descarga `38_browser_research_agent.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Encargo de investigación (webhook)** — POST en `wf-38-investigar` con `tema` (y `solicitante` opcional).
- **Validar encargo (code)** — obligatorio `tema`; recorta a 500 caracteres.
- **¿Encargo completo? (if)** — false → respuesta 400.
- **Preparar investigación (code)** — monta la petición con la herramienta `web_search` (máx. 3 usos) e instrucciones de citar fuentes y no inventar.
- **Investigar con Claude (httpRequest)** — una sola llamada: el modelo busca, lee y redacta.
- **Extraer informe (code)** — separa el texto del informe y recolecta las URLs de los bloques de resultados de búsqueda.
- **Registrar informe (googleSheets)** — fila en "Investigaciones" con tema, informe y nº de fuentes.
- **Borrador del informe (gmail, draft)** — borrador para revisión humana antes de compartir nada.
- **Responder informe (respondToWebhook)** — devuelve informe y nº de fuentes.
- **Responder incompleto (respondToWebhook)** — error 400.

## Pruébalo

**1. Caso normal**:
```bash
curl -X POST https://TU-N8N/webhook-test/wf-38-investigar \
  -H "Content-Type: application/json" \
  -d '{"tema":"Novedades de n8n en 2026 para equipos de formación","solicitante":"equipo-contenido"}'
```
Espera informe con fuentes (tarda 30-90 s: está buscando de verdad), borrador en Gmail y fila en Sheets.

**2. Caso incompleto**: body `{}` → 400.

**3. Caso duplicado**: el mismo tema dos veces = dos investigaciones pagadas con resultados parecidos. Ejercicio: consulta la pestaña "Investigaciones" y reutiliza informes de menos de una semana.

**4. Caso extremo**: un tema sobre el que no hay nada ("estadísticas oficiales de dragones en Albacete 2026"). Espera un informe honesto que diga que no hay fuentes fiables; si el modelo divaga, endurece la instrucción de prudencia del prompt.

## Errores típicos

- **Timeout del webhook de test**: la investigación puede superar el timeout por defecto; sube el timeout del nodo HTTP (options → timeout) o prueba con Execute workflow.
- **`total_fuentes: 0` con informe escrito**: el modelo respondió de memoria sin buscar. Refuerza en el prompt "usa la búsqueda web antes de responder".
- **Error 400 de la API mencionando tools**: tu clave no tiene acceso a la búsqueda web o el tipo de herramienta no está disponible para tu modelo; revisa la documentación del proveedor.
- **Informe cortado a mitad**: sube max_tokens (4096 por defecto) en "Preparar investigación".

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de Anthropic (Claude Opus 5)**: de pago por tokens, referencia 5 USD por millón de tokens de entrada y 25 USD por millón de salida — COMPROBAR EN LA WEB OFICIAL (anthropic.com/pricing).
- **Búsqueda web de Anthropic**: coste adicional por cada búsqueda ejecutada (hasta 3 por encargo aquí) — COMPROBAR EN LA WEB OFICIAL.
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Orientativo: un encargo con 3 búsquedas y un informe medio puede rondar 0,10-0,30 USD — COMPROBAR EN LA WEB OFICIAL.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.
