# 25 · Pipeline de redacción y anonimizado de PII

## Qué hace

Recibe un texto y lo anonimiza en dos pasadas. Primera pasada, determinista: expresiones regulares que tapan emails, teléfonos, DNI, IBAN y tarjetas con marcadores tipo `[EMAIL_OCULTO]`. Segunda pasada, con IA: Claude busca PII residual que las regex no ven (nombres de persona, direcciones, matrículas) y la sustituye sin tocar el resto del texto. Devuelve el texto limpio y registra en Google Sheets **solo métricas** (cuántas cosas se taparon), nunca el contenido.

El orden importa: la regex tapa lo obvio ANTES de que el texto viaje a la API, así el proveedor de IA recibe ya menos datos personales.

## Antes de empezar

- **Gratis**: n8n self-hosted y Google Sheets.
- **De pago**: la API de Anthropic (por tokens; el texto entero entra en el prompt).
- Piensa qué textos vas a anonimizar (tickets, transcripciones, valoraciones) y pruébalo SIEMPRE con datos ficticios primero.

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

## Cómo importar

1. Descarga `25_pii_redaction_pipeline.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Texto con posible PII (webhook)** — POST en `wf-25-texto-pii` con `texto` (obligatorio) e `id_caso` (opcional).
- **Validar texto (code)** — comprueba que hay texto y lo recorta a 20 000 caracteres.
- **¿Texto presente? (if)** — false → respuesta 400.
- **Redactar con regex y preparar IA (code)** — primera pasada con 5 patrones, cuenta ocurrencias por tipo y monta la petición para la segunda pasada.
- **Segunda pasada con Claude (httpRequest)** — pide a la IA solo la PII residual, con instrucciones de no cambiar nada más.
- **Combinar resultados (code)** — parsea el JSON de la IA; si falla, se queda con el texto de la pasada regex (nunca devuelve texto sin tapar lo obvio).
- **Preparar registro sin PII (set)** — selecciona SOLO métricas: id_caso, contadores, longitud y fecha.
- **Registrar métricas (googleSheets)** — fila en la pestaña "Anonimizados" sin contenido sensible.
- **Responder texto limpio (respondToWebhook)** — devuelve el texto final anonimizado.
- **Responder incompleto (respondToWebhook)** — error 400.

## Pruébalo

**1. Caso normal**:
```bash
curl -X POST https://TU-N8N/webhook-test/wf-25-texto-pii \
  -H "Content-Type: application/json" \
  -d '{"id_caso":"CASO-042","texto":"La alumna María Pérez (maria.perez@ejemplo.es, tel 612345678, DNI 12345678Z) pide factura."}'
```
Espera el email, teléfono y DNI tapados por la regex y el nombre tapado por la IA.

**2. Caso incompleto**: body `{"id_caso":"X"}` sin texto → 400.

**3. Caso duplicado**: el mismo texto dos veces produce dos filas de métricas (y dos gastos de tokens). Ejercicio: cachea por id_caso.

**4. Caso extremo**: un texto SIN ninguna PII ("El curso empieza el lunes."). Espera contadores a 0 y el texto devuelto idéntico; si la IA "tapa" cosas que no son PII, endurece el prompt de la segunda pasada.

## Errores típicos

- **La regex tapa de más (falsos positivos)**: el patrón de teléfonos es agresivo con secuencias largas de dígitos (referencias, códigos postales+número). Ajusta los patrones a tus datos.
- **`fallo_parseo_ia` en pii_ia_detectada**: la IA no devolvió JSON. El flujo degrada bien (usa el texto de la regex), pero revisa el prompt si pasa a menudo.
- **El texto llega cortado**: el límite de 20 000 caracteres del validador. Súbelo con cuidado: textos más largos = más tokens = más coste.
- **Aparece texto sensible en Sheets**: has cambiado el nodo set "Preparar registro sin PII" o mapeado columnas a mano. Ese nodo existe justo para que a la hoja solo lleguen métricas.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de Anthropic (Claude Opus 5)**: de pago por tokens, referencia 5 USD por millón de tokens de entrada y 25 USD por millón de salida — COMPROBAR EN LA WEB OFICIAL (anthropic.com/pricing).
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Orientativo: un texto de 2 000 caracteres son ~600 tokens de entrada y otros tantos de salida (la IA reescribe el texto): pocos céntimos por documento con Opus 5; para volumen alto usa un modelo más barato — COMPROBAR EN LA WEB OFICIAL.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.

El anonimizado automático nunca es perfecto: para publicar datos o cederlos a terceros necesitas revisión humana y criterio legal. Este flujo reduce riesgo, no lo elimina.
