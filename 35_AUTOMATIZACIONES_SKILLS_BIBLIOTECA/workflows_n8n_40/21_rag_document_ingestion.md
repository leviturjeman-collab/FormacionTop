# 21 · Ingesta de documentos para RAG

## Qué hace

Recibe documentos por webhook (título, contenido y origen), valida que no falte nada, trocea el texto en fragmentos de ~1200 caracteres con solape de 200 (para que luego los embeddings no corten frases a lo bruto) y guarda cada trozo en una tabla de Postgres/Supabase con estado `pendiente`. Al terminar registra la ingesta en Google Sheets y responde al llamante con cuántos trozos se han guardado.

Es la primera pieza de un sistema RAG casero: este flujo mete el conocimiento en la base de datos y el flujo 23 se encarga de vectorizarlo cada cinco minutos en lotes acotados.

## Antes de empezar

- **Gratis**: n8n self-hosted, la capa gratuita de Supabase y Google Sheets.
- **De pago**: nada obligatorio en este flujo (aquí aún no se llama a ninguna IA).
- Crea antes la tabla en el SQL Editor de Supabase:

```sql
-- Apply once before importing workflows 21 and 23. No existing rows are deleted
-- by this migration; replacing a document occurs only through an explicit ingest.
CREATE TABLE IF NOT EXISTS documentos_rag (
  id bigserial PRIMARY KEY, titulo text, origen text, idioma text, indice integer,
  trozo text, embedding text, embedding_estado text DEFAULT 'pendiente',
  creado_en timestamptz DEFAULT now()
);
ALTER TABLE documentos_rag ADD COLUMN IF NOT EXISTS source_hash text;
ALTER TABLE documentos_rag ADD COLUMN IF NOT EXISTS embedding_model text;
ALTER TABLE documentos_rag ADD COLUMN IF NOT EXISTS embedding_dimensions integer;
ALTER TABLE documentos_rag ADD COLUMN IF NOT EXISTS embedded_at timestamptz;
CREATE TABLE IF NOT EXISTS documentos_rag_version (
  origen text PRIMARY KEY, source_hash text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE OR REPLACE FUNCTION academy_ingest_document(
  p_origen text, p_titulo text, p_idioma text, p_contenido text, p_chunks jsonb
) RETURNS TABLE(titulo text, origen text, trozos_guardados bigint, changed boolean)
LANGUAGE plpgsql AS $$
DECLARE v_hash text := md5(p_contenido); v_previous text; v_count bigint;
BEGIN
  IF p_origen IS NULL OR length(trim(p_origen)) = 0 OR jsonb_typeof(p_chunks) <> 'array' OR jsonb_array_length(p_chunks) = 0 THEN
    RAISE EXCEPTION 'Non-empty source and chunks are required';
  END IF;
  -- Serialize updates for the same source; retrying an unchanged document is a no-op.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_origen, 0));
  SELECT v.source_hash INTO v_previous FROM documentos_rag_version v WHERE v.origen=p_origen;
  IF v_previous = v_hash THEN
    SELECT count(*) INTO v_count FROM documentos_rag d WHERE d.origen=p_origen;
    RETURN QUERY SELECT p_titulo,p_origen,v_count,false;
    RETURN;
  END IF;
  DELETE FROM documentos_rag d WHERE d.origen=p_origen;
  INSERT INTO documentos_rag(titulo,origen,idioma,indice,trozo,source_hash,embedding_estado)
    SELECT p_titulo,p_origen,p_idioma,(c.value->>'indice')::integer,c.value->>'trozo',v_hash,'pendiente'
    FROM jsonb_array_elements(p_chunks) c;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  INSERT INTO documentos_rag_version VALUES(p_origen,v_hash,now())
    ON CONFLICT ON CONSTRAINT documentos_rag_version_pkey
    DO UPDATE SET source_hash=excluded.source_hash,updated_at=excluded.updated_at;
  RETURN QUERY SELECT p_titulo,p_origen,v_count,true;
END $$;
```

(Si vas a usar pgvector, cambia `embedding text` por `embedding vector(1536)` tras activar la extensión.)

## Credenciales paso a paso

### Postgres / Supabase

1. Crea un proyecto en https://supabase.com (tiene capa gratuita) y ve a **Settings → Database**. Si tu n8n está en la nube usa los datos del *connection pooler* (puerto 6543); en local sirve el puerto 5432.
2. En n8n: **Credentials → Add credential → Postgres** → rellena Host, Database (`postgres`), User, Password y Port, y pon **SSL** en `require`.
3. En el **SQL Editor** de Supabase ejecuta el `CREATE TABLE` que se indica más abajo antes de ejecutar el flujo.

### Google Sheets (OAuth2)

1. En n8n: **Credentials → Add credential → Google Sheets OAuth2 API**. En n8n Cloud basta con pulsar **Sign in with Google** y aceptar los permisos.
2. Si tu n8n es self-hosted: crea un proyecto en https://console.cloud.google.com, habilita la **Google Sheets API**, configura la pantalla de consentimiento y crea una credencial **ID de cliente OAuth** (aplicación web) usando la *Redirect URI* que te muestra n8n. Copia el Client ID y el Client Secret en la credencial de n8n y conéctate.
3. Crea una hoja de cálculo en https://sheets.google.com y copia su **ID de documento**: es el tramo largo de la URL entre `/d/` y `/edit`.
4. En cada nodo de Google Sheets del flujo, pega ese ID donde pone `REEMPLAZAR_ID_DOCUMENTO` y comprueba que el nombre de la pestaña coincide con el indicado en la guía (créala si no existe; los encabezados se crean solos en el primer append).

## Cómo importar

1. Descarga `21_rag_document_ingestion.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Documento nuevo (webhook)** — recibe un POST en `wf-21-doc-nuevo` con el documento en el body. Responde a través del nodo de respuesta (responseMode: responseNode).
- **Validar documento (code)** — lee `$json.body`, comprueba los obligatorios (titulo, contenido, origen), normaliza y marca `valido` y la lista `faltan`.
- **¿Documento completo? (if)** — true → sigue la ingesta; false → rama de incompletos con respuesta 400.
- **Trocear contenido (code)** — parte el contenido en trozos de 1200 caracteres con solape de 200 y emite un documento con todos sus trozos.
- **Guardar trozos en Postgres (postgres)** — llamada parametrizada a academy_ingest_document: reemplazo atómico e idempotente por origen, con `embedding_estado = pendiente`.
- **Resumir ingesta (code)** — cuenta los trozos guardados y prepara un resumen limpio para el registro.
- **Registrar en Google Sheets (googleSheets)** — añade una fila a la pestaña "Ingestas" como evidencia de la ejecución.
- **Responder OK (respondToWebhook)** — devuelve `{ ok: true, titulo, trozos_guardados }`.
- **Responder incompleto (respondToWebhook)** — devuelve 400 con la lista de campos que faltan.

## Pruébalo

El flujo trae un ejemplo anclado (pinData): pulsa **Execute workflow** y lo verás correr sin llamar a nada externo. Después prueba con curl contra la URL de test:

**1. Caso normal** (espera 200 y trozos_guardados ≥ 1):
```bash
curl -X POST https://TU-N8N/webhook-test/wf-21-doc-nuevo \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Guía de onboarding","contenido":"El alta tiene tres fases: registro, activación y primer módulo...","origen":"notion/onboarding.md","idioma":"es"}'
```

**2. Caso incompleto** (espera 400 con `faltan: ["contenido","origen"]`):
```bash
curl -X POST https://TU-N8N/webhook-test/wf-21-doc-nuevo \
  -H "Content-Type: application/json" -d '{"titulo":"Solo título"}'
```

**3. Caso duplicado**: envía dos veces el caso normal. Verás el documento dos veces en la tabla: este flujo no deduplica a propósito. Ejercicio: añade un IF que consulte antes si ya existe ese `origen` y descarte el duplicado.

**4. Caso extremo**: envía un `contenido` de 100 000 caracteres (genera texto con cualquier lorem ipsum). Comprueba que salen ~100 trozos y que Postgres los acepta; si tu instancia va justa de memoria, baja el límite en "Validar documento".

## Errores típicos

- **`connect ETIMEDOUT` en el nodo Postgres**: host o puerto incorrectos, o SSL desactivado. Con Supabase usa el pooler (puerto 6543) y SSL `require`.
- **`relation "documentos_rag" does not exist`**: no has ejecutado el CREATE TABLE, o lo hiciste en otro esquema/proyecto.
- **El webhook responde `{}` inmediatamente**: estás llamando a `/webhook/` con el flujo sin activar. En pruebas usa `/webhook-test/` y pulsa antes Execute workflow.
- **Los campos llegan vacíos aunque los envías**: olvidaste la cabecera `Content-Type: application/json`, o lees `$json.titulo` en vez de `$json.body.titulo` si modificas el flujo.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **Supabase/Postgres**: capa gratuita suficiente para practicar — COMPROBAR EN LA WEB OFICIAL (supabase.com/pricing).
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Este flujo no consume tokens de IA: la vectorización (y su coste) vive en el flujo 23.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.
