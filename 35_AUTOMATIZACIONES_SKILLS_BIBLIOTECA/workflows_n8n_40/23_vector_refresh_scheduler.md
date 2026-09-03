# 23 · Refresco programado de vectores

## Qué hace

Cada noche a las 03:00 busca en Postgres los trozos de documento con `embedding_estado = 'pendiente'` (los que dejó el flujo 21), pide a la API de embeddings de OpenAI el vector de cada uno, actualiza la fila con el vector y marca el trozo como `actualizado`. Al final apunta el resumen en Google Sheets y te avisa por Gmail de cuántos documentos se han refrescado.

Si no hay nada pendiente, termina en silencio por la rama "Nada pendiente": no gasta ni un token.

## Antes de empezar

- **Gratis**: n8n self-hosted, Supabase (capa gratuita), Google Sheets y Gmail.
- **De pago**: la API de OpenAI (embeddings; muy barata, pero de pago por tokens).
- Necesitas la tabla `documentos_rag` del flujo 21 con alguna fila en estado `pendiente`.
- Procesa 25 trozos por ejecución (LIMIT 25) para no pasarte de coste: súbelo cuando controles el gasto.

## Credenciales paso a paso

### OpenAI API (Header Auth)

1. Entra en https://platform.openai.com → **API keys** → **Create new secret key** y copia la clave.
2. En n8n: **Credentials → Add credential → Header Auth**.
3. En **Name** escribe `Authorization` y en **Value** escribe `Bearer TU_CLAVE` (la palabra Bearer, un espacio y la clave).
4. Guarda como "OpenAI API (Authorization: Bearer)" y asígnala al nodo correspondiente.

### Postgres / Supabase

1. Crea un proyecto en https://supabase.com (tiene capa gratuita) y ve a **Settings → Database**. Si tu n8n está en la nube usa los datos del *connection pooler* (puerto 6543); en local sirve el puerto 5432.
2. En n8n: **Credentials → Add credential → Postgres** → rellena Host, Database (`postgres`), User, Password y Port, y pon **SSL** en `require`.
3. En el **SQL Editor** de Supabase ejecuta el `CREATE TABLE` que se indica más abajo antes de ejecutar el flujo.

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

1. Descarga `23_vector_refresh_scheduler.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Cada día a las 03:00 (scheduleTrigger)** — cron `0 3 * * *`. Ajusta la zona horaria del flujo en Settings si hace falta.
- **Buscar trozos pendientes (postgres)** — SELECT de hasta 25 trozos con embedding_estado = pendiente.
- **Preparar pendientes (code)** — valida el resultado; si no hay filas emite `hay_pendientes: false`.
- **¿Hay pendientes? (if)** — false → nodo "Nada pendiente" (fin silencioso).
- **Pedir embedding a OpenAI (httpRequest)** — POST a /v1/embeddings con el modelo text-embedding-3-small, un item por trozo.
- **Actualizar vector (postgres)** — UPDATE parametrizado que guarda el vector y marca `actualizado`.
- **Resumir refresco (code)** — cuenta los documentos actualizados y junta los IDs.
- **Registrar refresco (googleSheets)** — fila en la pestaña "Refrescos".
- **Avisar por Gmail (gmail)** — correo con el total refrescado (evidencia + tranquilidad).
- **Nada pendiente (noOp)** — rama vacía cuando no hay trabajo.

## Pruébalo

Este flujo no tiene webhook: pruébalo con **Execute workflow** (ejecuta todo el pipeline una vez, sin esperar a las 03:00).

**1. Caso normal**: inserta 2 filas pendientes en Supabase (`INSERT INTO documentos_rag (titulo, trozo) VALUES ('demo','texto de prueba');` dos veces) y ejecuta. Espera: 2 UPDATE, fila en Sheets y correo con "2".

**2. Caso incompleto (sin trabajo)**: ejecuta otra vez sin filas pendientes. Espera: termina por "Nada pendiente" sin llamar a OpenAI ni enviar correo.

**3. Caso duplicado**: ejecuta dos veces seguidas con pendientes. La segunda no debe reprocesar nada porque el UPDATE cambió el estado: si reprocesa, revisa que el UPDATE se ejecutó de verdad.

**4. Caso extremo**: inserta un trozo de 50 000 caracteres. El code lo recorta a 8 000 antes de pedir el embedding; verifica en la ejecución que el campo `contenido` va recortado (los embeddings tienen límite de tokens).

## Errores típicos

- **401 en el nodo de OpenAI**: el Value de la credencial debe ser `Bearer sk-...` con la palabra Bearer delante.
- **`invalid input syntax for type vector`**: tu columna es `vector` (pgvector) y llega texto: castea en el UPDATE con `embedding = $1::vector` o deja la columna como text para practicar.
- **El cron no se dispara**: el flujo tiene que estar **Active**, y la hora se evalúa con la zona horaria configurada en n8n (Settings → Timezone).
- **Se reprocesan siempre los mismos trozos**: el UPDATE falla en silencio si el id no llega: comprueba la expresión `$('Preparar pendientes').item.json.id` en el segundo nodo Postgres.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de OpenAI**: de pago por tokens (embeddings text-embedding-3-small es de los endpoints más baratos) — COMPROBAR EN LA WEB OFICIAL (openai.com/api/pricing).
- **Supabase/Postgres**: capa gratuita suficiente para practicar — COMPROBAR EN LA WEB OFICIAL (supabase.com/pricing).
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Orientativo: text-embedding-3-small cuesta céntimos por millón de tokens; 25 trozos de 1 200 caracteres por noche es un coste despreciable — COMPROBAR EN LA WEB OFICIAL.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.
