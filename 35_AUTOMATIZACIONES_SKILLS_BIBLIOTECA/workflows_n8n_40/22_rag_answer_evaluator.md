# 22 · Evaluador de respuestas RAG

## Qué hace

Actúa de "juez" de tu sistema RAG: recibe por webhook una pregunta, el contexto que recuperó tu buscador y la respuesta que generó tu bot, y le pide a Claude que puntúe de 0 a 10 la fidelidad al contexto y la relevancia, marcando además si hay alucinación (afirmaciones que no están en el contexto). El veredicto se guarda en Google Sheets y se devuelve al llamante.

Sirve para medir tu RAG de forma continua: cada respuesta que evalúes deja una fila con nota, y puedes ver si una nueva versión del prompt mejora o empeora.

## Antes de empezar

- **Gratis**: n8n self-hosted y Google Sheets.
- **De pago**: la API de Anthropic (se cobra por tokens; cada evaluación son 1-2 céntimos con textos normales).
- Ten pensado de dónde saldrán pregunta/contexto/respuesta: normalmente tu propio bot los reenvía aquí tras responder al usuario.

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

1. Descarga `22_rag_answer_evaluator.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Respuesta a evaluar (webhook)** — POST en `wf-22-eval-respuesta` con pregunta, respuesta y contexto en el body.
- **Validar entrada (code)** — comprueba los tres campos obligatorios, recorta el contexto a 12 000 caracteres y marca `valido`.
- **¿Entrada completa? (if)** — false → respuesta 400 con los campos que faltan.
- **Preparar petición al juez (code)** — monta el prompt de evaluación con instrucciones de responder SOLO JSON.
- **Llamar a Claude (juez) (httpRequest)** — POST a api.anthropic.com/v1/messages con la credencial Header Auth.
- **Parsear veredicto (code)** — extrae el JSON de la respuesta (con try/catch: si el modelo no devuelve JSON, lo marca como error sin romper el flujo).
- **Registrar evaluación (googleSheets)** — fila en la pestaña "Evaluaciones" con notas y comentario.
- **Responder veredicto (respondToWebhook)** — devuelve el veredicto completo al llamante.
- **Responder incompleto (respondToWebhook)** — error 400 en la rama de incompletos.

## Pruébalo

**1. Caso normal** (espera nota alta y alucinacion=false):
```bash
curl -X POST https://TU-N8N/webhook-test/wf-22-eval-respuesta \
  -H "Content-Type: application/json" \
  -d '{"pregunta":"¿Cuántas fases tiene el alta?","contexto":"El alta tiene tres fases: registro, activación y primer módulo.","respuesta":"Tres: registro, activación y acceso al primer módulo."}'
```

**2. Caso incompleto**: quita `contexto` del body → espera 400 con `faltan: ["contexto"]`.

**3. Caso duplicado**: manda dos veces la misma evaluación. Obtendrás dos filas (y pagarás dos veces los tokens). Ejercicio: añade un hash de la pregunta+respuesta y descarta repetidos consultando la hoja.

**4. Caso extremo (alucinación)**: mismo contexto pero `"respuesta":"El alta tiene cinco fases y cuesta 99 €"` → espera `alucinacion: true` y fidelidad baja. Si el juez no lo pilla, endurece las instrucciones del nodo "Preparar petición al juez".

## Errores típicos

- **401 `authentication_error` en el nodo de Claude**: la cabecera de la credencial no se llama exactamente `x-api-key` o la clave está mal copiada.
- **`respuesta_no_json` en el comentario**: el modelo respondió con texto alrededor del JSON. El parseo busca el primer `{` y el último `}`; si aun así falla, baja la temperatura del prompt (pide "SOLO JSON" al principio).
- **429 `rate_limit_error`**: estás evaluando en ráfaga. Espacia las llamadas o pide más cuota en la consola de Anthropic.
- **La fila del Sheets sale con columnas desordenadas**: el mapeo es automático (autoMapInputData): usa como encabezados los nombres de campo de la primera ejecución y no los cambies después.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de Anthropic (Claude Opus 5)**: de pago por tokens, referencia 5 USD por millón de tokens de entrada y 25 USD por millón de salida — COMPROBAR EN LA WEB OFICIAL (anthropic.com/pricing).
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Orientativo: una evaluación con ~1 500 tokens de entrada y ~200 de salida ronda 0,01-0,02 USD con Claude Opus 5. Para abaratar evaluaciones masivas puedes usar un modelo más pequeño — COMPROBAR EN LA WEB OFICIAL.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.
