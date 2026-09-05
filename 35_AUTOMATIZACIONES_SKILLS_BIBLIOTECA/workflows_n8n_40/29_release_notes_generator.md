# 29 · Generador de release notes

## Qué hace

Le pasas por webhook un repositorio y dos tags (desde/hasta); el flujo pide a la API de GitHub la comparación entre ambos, extrae los mensajes de commit, y Claude redacta unas release notes en español agrupadas en Novedades / Mejoras / Correcciones, ignorando los commits internos (ci, chore, merges). El resultado se registra en Google Sheets y se deja como **borrador en Gmail** para que lo revises y publiques tú; además se devuelve en la respuesta del webhook.

## Antes de empezar

- **Gratis**: n8n self-hosted, API de GitHub, Google Sheets y Gmail.
- **De pago**: la API de Anthropic.
- Necesitas un repo con al menos dos tags (p. ej. `v1.0.0` y `v1.1.0`). Si no tienes, créalos: `git tag v1.0.0 && git push --tags`.

## Credenciales paso a paso

### Anthropic API (Header Auth) — para los nodos que llaman a Claude

1. Entra en https://console.anthropic.com con tu cuenta, ve a **API Keys** y pulsa **Create Key**. Copia la clave (empieza por `sk-ant-`): solo se muestra una vez.
2. En n8n: **Credentials → Add credential → Header Auth**.
3. En **Name** (nombre de la cabecera) escribe exactamente `x-api-key`. En **Value** pega tu clave.
4. Guarda la credencial como "Anthropic API (x-api-key)" y selecciónala en el nodo HTTP que llama a Claude (viene marcado con id REEMPLAZAR).

El nodo ya envía la cabecera `anthropic-version` por ti; no tienes que añadir nada más.

### GitHub (Header Auth) — para las llamadas HTTP a api.github.com

1. Puedes reutilizar el mismo token del paso anterior (o crear otro de solo lectura).
2. En n8n crea una credencial **Header Auth**: *Name* = `Authorization`, *Value* = `Bearer TU_TOKEN`.
3. Guárdala como "GitHub (Authorization: Bearer)" y asígnala al nodo HTTP indicado.

### Gmail (OAuth2)

1. En n8n: **Credentials → Add credential → Gmail OAuth2**. En n8n Cloud, **Sign in with Google** y listo.
2. Self-hosted: en el mismo proyecto de Google Cloud de antes, habilita la **Gmail API** y reutiliza el Client ID / Client Secret con la Redirect URI de n8n.
3. Asigna la credencial al nodo de Gmail y sustituye el destinatario `REEMPLAZAR_...@ejemplo.com` por un correo real.

### Google Sheets (OAuth2)

1. En n8n: **Credentials → Add credential → Google Sheets OAuth2 API**. En n8n Cloud basta con pulsar **Sign in with Google** y aceptar los permisos.
2. Si tu n8n es self-hosted: crea un proyecto en https://console.cloud.google.com, habilita la **Google Sheets API**, configura la pantalla de consentimiento y crea una credencial **ID de cliente OAuth** (aplicación web) usando la *Redirect URI* que te muestra n8n. Copia el Client ID y el Client Secret en la credencial de n8n y conéctate.
3. Crea una hoja de cálculo en https://sheets.google.com y copia su **ID de documento**: es el tramo largo de la URL entre `/d/` y `/edit`.
4. En cada nodo de Google Sheets del flujo, pega ese ID donde pone `REEMPLAZAR_ID_DOCUMENTO` y comprueba que el nombre de la pestaña coincide con el indicado en la guía (créala si no existe; los encabezados se crean solos en el primer append).

## Cómo importar

1. Descarga `29_release_notes_generator.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Petición de release notes (webhook)** — POST en `wf-29-release` con propietario, repo, desde_tag y hasta_tag.
- **Validar petición (code)** — los cuatro campos son obligatorios.
- **¿Petición completa? (if)** — false → respuesta 400.
- **Comparar tags en GitHub (httpRequest)** — GET /repos/.../compare/desde...hasta con Header Auth.
- **Preparar redacción (code)** — convierte hasta 100 commits en una lista limpia y monta el prompt.
- **Redactar con Claude (httpRequest)** — llamada a la API de Anthropic.
- **Extraer notas (code)** — junta los bloques de texto de la respuesta (ignora bloques de razonamiento).
- **Registrar generación (googleSheets)** — fila en "Releases" con repo, tags y notas.
- **Borrador con las notas (gmail, draft)** — borrador listo para revisar: nada se publica solo.
- **Responder notas (respondToWebhook)** — devuelve las notas en la respuesta.
- **Responder incompleto (respondToWebhook)** — error 400.

## Pruébalo

**1. Caso normal**:
```bash
curl -X POST https://TU-N8N/webhook-test/wf-29-release \
  -H "Content-Type: application/json" \
  -d '{"propietario":"TU_USUARIO","repo":"TU_REPO","desde_tag":"v1.0.0","hasta_tag":"v1.1.0"}'
```
Espera notas en Markdown, borrador en Gmail y fila en Sheets.

**2. Caso incompleto**: sin `hasta_tag` → 400.

**3. Caso duplicado**: la misma petición dos veces genera dos borradores idénticos (y doble gasto). Ejercicio: consulta la pestaña "Releases" y devuelve el resultado cacheado si el par de tags ya existe.

**4. Caso extremo**: dos tags iguales (`desde_tag == hasta_tag`): GitHub devuelve 0 commits; espera unas notas vacías o un "sin cambios". Mejora propuesta: corta antes de llamar a la IA si `total_commits` es 0.

## Errores típicos

- **404 en la comparación**: tag inexistente o repo privado sin permiso en el token. Los tags distinguen mayúsculas.
- **Notas que mencionan commits internos**: el prompt pide ignorarlos, pero si tu convención es distinta (p. ej. "wip:"), añádela a la instrucción del nodo "Preparar redacción".
- **`Bad credentials`**: el Value de la credencial Header Auth debe ser `Bearer TU_TOKEN`, con Bearer delante.
- **Solo salen 100 commits**: es el recorte del flujo (y GitHub pagina a 250). Para releases enormes, genera por rangos intermedios.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de Anthropic (Claude Opus 5)**: de pago por tokens, referencia 5 USD por millón de tokens de entrada y 25 USD por millón de salida — COMPROBAR EN LA WEB OFICIAL (anthropic.com/pricing).
- **API de GitHub**: gratis con los límites estándar de tu cuenta.
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Orientativo: 100 commits son ~2 000-3 000 tokens de entrada: unos céntimos por release — COMPROBAR EN LA WEB OFICIAL.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.

## Cobertura obligatoria
El proceso se detiene ante entrada vacía/incompleta o contexto superior al límite; no publica una aprobación ni un análisis completo de un subconjunto. Release notes pagina y contrasta número de commits únicos con total_commits; máximo2000commits/120000caracteres para redactar. PR exige diff íntegro<=20000caracteres y todo veredicto automático es revisar. Push incompleto exige escáner de repositorio sobre el rango completo. Configura error workflow y verifica estos bloqueos con fixtures antes de activar.
