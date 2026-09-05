# 28 · Resumen y revisión de pull requests

## Qué hace

Cuando se abre (o se marca lista para revisar) una pull request, el flujo descarga su diff real desde la API de GitHub, se lo pasa a Claude con la descripción, y publica en la PR un comentario con: resumen de los cambios, riesgos detectados, preguntas para el autor y una sugerencia (aprobar/revisar). La decisión de aprobar sigue siendo 100 % humana: el flujo solo comenta. Cada revisión queda en Google Sheets.

## Antes de empezar

- **Gratis**: n8n self-hosted, API de GitHub y Google Sheets.
- **De pago**: la API de Anthropic (los diffs consumen tokens; el flujo los recorta a 20 000 caracteres).
- Necesitas admin en el repo para el webhook y un token con lectura de PRs + escritura de issues.

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

### GitHub (Header Auth) — para las llamadas HTTP a api.github.com

1. Puedes reutilizar el mismo token del paso anterior (o crear otro de solo lectura).
2. En n8n crea una credencial **Header Auth**: *Name* = `Authorization`, *Value* = `Bearer TU_TOKEN`.
3. Guárdala como "GitHub (Authorization: Bearer)" y asígnala al nodo HTTP indicado.

### Google Sheets (OAuth2)

1. En n8n: **Credentials → Add credential → Google Sheets OAuth2 API**. En n8n Cloud basta con pulsar **Sign in with Google** y aceptar los permisos.
2. Si tu n8n es self-hosted: crea un proyecto en https://console.cloud.google.com, habilita la **Google Sheets API**, configura la pantalla de consentimiento y crea una credencial **ID de cliente OAuth** (aplicación web) usando la *Redirect URI* que te muestra n8n. Copia el Client ID y el Client Secret en la credencial de n8n y conéctate.
3. Crea una hoja de cálculo en https://sheets.google.com y copia su **ID de documento**: es el tramo largo de la URL entre `/d/` y `/edit`.
4. En cada nodo de Google Sheets del flujo, pega ese ID donde pone `REEMPLAZAR_ID_DOCUMENTO` y comprueba que el nombre de la pestaña coincide con el indicado en la guía (créala si no existe; los encabezados se crean solos en el primer append).

## Cómo importar

1. Descarga `28_pr_summary_reviewer.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
   - En GitHub: **repo → Settings → Webhooks → Add webhook** con la URL `https://TU-N8N/webhook/wf-28-pr-abierta`, content type `application/json` y el evento **Pull requests**.
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **PR de GitHub (webhook)** — recibe el evento en `wf-28-pr-abierta` (sin responseNode: fire-and-forget).
- **Validar evento de PR (code)** — acepta solo `opened`, `ready_for_review` y `synchronize`; extrae número, repo y autor.
- **¿PR procesable? (if)** — false → "Evento ignorado".
- **Descargar diff de la PR (httpRequest)** — GET a api.github.com con cabecera `Accept: application/vnd.github.v3.diff` y credencial Header Auth; guarda el diff como texto.
- **Preparar revisión (code)** — monta el prompt con título + descripción + diff recortado; pide JSON.
- **Revisar con Claude (httpRequest)** — llamada a la API de Anthropic.
- **Componer comentario (code)** — convierte el JSON en un comentario Markdown con resumen, riesgos y preguntas.
- **Registrar revisión (googleSheets)** — fila en "Revisiones" con el veredicto.
- **Comentar en la PR (github)** — publica el comentario (las PRs aceptan comentarios de issue).
- **Evento ignorado (noOp)** — rama de descarte.

## Pruébalo

**1. Caso normal**: en un repo de pruebas, abre una PR con un cambio pequeño y descriptivo. Espera comentario con resumen y riesgos en la PR y fila en Sheets.

**2. Caso incompleto**: cierra la PR (acción `closed`). Espera "Evento ignorado", sin gasto de IA.

**3. Caso duplicado**: empuja un commit nuevo a la PR (acción `synchronize`). Habrá un segundo comentario actualizado: decide si te vale o si prefieres quitar `synchronize` de las acciones aceptadas para comentar solo al abrir.

**4. Caso extremo**: una PR gigante (renombra una carpeta con cientos de ficheros). El diff se recorta a 20 000 caracteres y el prompt obliga a decir que está truncado: comprueba que el comentario lo avisa.

## Errores típicos

- **404 al descargar el diff**: el repo es privado y el token de la credencial Header Auth no lo cubre; revisa el fine-grained token.
- **`Sorry, your request was rejected` / bloqueo de user-agent**: GitHub exige cabecera User-Agent: el nodo ya la envía (`n8n-workflow-28`), no la borres.
- **El comentario sale con el JSON crudo**: el parseo falló y cayó al modo degradado. Suele ser el modelo envolviendo el JSON en ``` — el parseador lo tolera, pero revisa el prompt si se repite.
- **Se comenta dos veces la misma PR**: tienes el webhook dado de alta dos veces en GitHub (o el flujo importado dos veces y ambos activos).

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de Anthropic (Claude Opus 5)**: de pago por tokens, referencia 5 USD por millón de tokens de entrada y 25 USD por millón de salida — COMPROBAR EN LA WEB OFICIAL (anthropic.com/pricing).
- **API de GitHub**: gratis con los límites estándar de tu cuenta.
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Orientativo: con diffs de 20 000 caracteres (~6 000 tokens), del orden de 0,05 USD por PR con Opus 5 — COMPROBAR EN LA WEB OFICIAL.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.

## Cobertura obligatoria
El proceso se detiene ante entrada vacía/incompleta o contexto superior al límite; no publica una aprobación ni un análisis completo de un subconjunto. Release notes pagina y contrasta número de commits únicos con total_commits; máximo2000commits/120000caracteres para redactar. PR exige diff íntegro<=20000caracteres y todo veredicto automático es revisar. Push incompleto exige escáner de repositorio sobre el rango completo. Configura error workflow y verifica estos bloqueos con fixtures antes de activar.
