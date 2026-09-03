# 27 · Triaje de issues de GitHub

## Qué hace

Cada vez que alguien abre una issue en tu repositorio, GitHub llama a este webhook. El flujo clasifica la issue con Claude (tipo bug/mejora/pregunta, prioridad p0-p3, etiquetas sugeridas y una primera respuesta amable) y publica un **comentario de propuesta** en la propia issue usando el nodo nativo de GitHub. No aplica etiquetas ni cierra nada: la propuesta queda a la vista y un mantenedor la confirma. Cada triaje se apunta en Google Sheets.

## Antes de empezar

- **Gratis**: n8n self-hosted, la API de GitHub y Google Sheets.
- **De pago**: la API de Anthropic (una llamada corta por issue).
- Necesitas permisos de administración en el repo para crear el webhook de GitHub.

## Credenciales paso a paso

### Anthropic API (Header Auth) — para los nodos que llaman a Claude

1. Entra en https://console.anthropic.com con tu cuenta, ve a **API Keys** y pulsa **Create Key**. Copia la clave (empieza por `sk-ant-`): solo se muestra una vez.
2. En n8n: **Credentials → Add credential → Header Auth**.
3. En **Name** (nombre de la cabecera) escribe exactamente `x-api-key`. En **Value** pega tu clave.
4. Guarda la credencial como "Anthropic API (x-api-key)" y selecciónala en el nodo HTTP que llama a Claude (viene marcado con id REEMPLAZAR).

El nodo ya envía la cabecera `anthropic-version` por ti; no tienes que añadir nada más.

### GitHub (token) — para el nodo nativo de GitHub

1. En GitHub: **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. Limita el acceso al repositorio que te interese y concede permiso **Read and write** sobre *Issues* (incluye comentar en pull requests).
3. En n8n: **Credentials → Add credential → GitHub API** → *User*: tu usuario; *Access Token*: el token.

### Google Sheets (OAuth2)

1. En n8n: **Credentials → Add credential → Google Sheets OAuth2 API**. En n8n Cloud basta con pulsar **Sign in with Google** y aceptar los permisos.
2. Si tu n8n es self-hosted: crea un proyecto en https://console.cloud.google.com, habilita la **Google Sheets API**, configura la pantalla de consentimiento y crea una credencial **ID de cliente OAuth** (aplicación web) usando la *Redirect URI* que te muestra n8n. Copia el Client ID y el Client Secret en la credencial de n8n y conéctate.
3. Crea una hoja de cálculo en https://sheets.google.com y copia su **ID de documento**: es el tramo largo de la URL entre `/d/` y `/edit`.
4. En cada nodo de Google Sheets del flujo, pega ese ID donde pone `REEMPLAZAR_ID_DOCUMENTO` y comprueba que el nombre de la pestaña coincide con el indicado en la guía (créala si no existe; los encabezados se crean solos en el primer append).

## Cómo importar

1. Descarga `27_github_issue_triage.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
   - Además, en GitHub: **repo → Settings → Webhooks → Add webhook**; *Payload URL* = la URL de producción del webhook (`https://TU-N8N/webhook/wf-27-issue-nueva`), *Content type* = `application/json`, evento: **Issues**.
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Issue de GitHub (webhook)** — recibe el evento de GitHub en `wf-27-issue-nueva`. Sin nodo de respuesta: GitHub solo necesita el 200 automático.
- **Validar issue (code)** — extrae título, cuerpo, número, repo y autor del payload; solo considera válida la acción `opened`.
- **¿Issue nueva y completa? (if)** — false → "Evento ignorado" (ediciones, cierres, payloads raros).
- **Preparar clasificación (code)** — prompt de triaje con formato JSON obligatorio.
- **Clasificar con Claude (httpRequest)** — llamada a la API de Anthropic.
- **Componer triaje (code)** — parsea el JSON y redacta el comentario en Markdown dejando claro que es una propuesta automática.
- **Registrar triaje (googleSheets)** — fila en "Triaje" con tipo, prioridad y etiquetas.
- **Comentar propuesta en la issue (github)** — crea el comentario con la credencial GitHub API.
- **Evento ignorado (noOp)** — rama de descarte.

## Pruébalo

El flujo trae un payload de ejemplo anclado: **Execute workflow** lo recorre entero (comentará en la issue nº 12 del repo que configures, así que apunta primero el pinData a un repo de pruebas).

**1. Caso normal**: crea un repo de pruebas, configura el webhook y abre una issue "La exportación a CSV falla con acentos". Espera comentario de triaje en ~10 s y fila en Sheets.

**2. Caso incompleto**: desde GitHub, edita una issue existente (acción `edited`). Espera que el flujo termine en "Evento ignorado" sin llamar a la IA.

**3. Caso duplicado**: abre dos issues con el mismo título. Cada una recibe su comentario (GitHub las trata como distintas); comprueba que no se comenta dos veces la misma.

**4. Caso extremo**: abre una issue con el cuerpo vacío y un título de una palabra ("ayuda"). Espera clasificación `pregunta`/`otro` con prioridad baja y una primera respuesta pidiendo detalles.

## Errores típicos

- **GitHub marca el webhook en rojo (timeout)**: el flujo tarda más de 10 s en responder si la IA va lenta; como el webhook responde nada más recibir (no hay responseNode), esto solo pasa si el flujo está desactivado o la URL es la de test.
- **404 del nodo GitHub al comentar**: el token fine-grained no incluye ese repo o le falta el permiso Issues: Read and write.
- **Comenta en issues que no toca**: has suscrito más eventos en el webhook de GitHub; deja solo "Issues" o filtra más acciones en "Validar issue".
- **Bucle: el comentario del bot dispara otro evento**: los comentarios son evento `issue_comment`, que NO está suscrito. No suscribas ese evento o filtra por autor.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de Anthropic (Claude Opus 5)**: de pago por tokens, referencia 5 USD por millón de tokens de entrada y 25 USD por millón de salida — COMPROBAR EN LA WEB OFICIAL (anthropic.com/pricing).
- **API de GitHub**: gratis con los límites estándar de tu cuenta.
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Orientativo: una issue normal son ~1 000 tokens en total: menos de 0,01 USD por triaje — COMPROBAR EN LA WEB OFICIAL.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.
