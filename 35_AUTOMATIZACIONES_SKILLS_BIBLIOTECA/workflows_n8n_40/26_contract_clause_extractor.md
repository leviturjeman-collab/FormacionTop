# 26 · Extractor de cláusulas de contratos

## Qué hace

Recibe el texto de un contrato, le pide a Claude que localice las cláusulas típicas (duración, pagos, penalizaciones, confidencialidad, propiedad intelectual, rescisión, limitación de responsabilidad) y que puntúe el riesgo de cada una y el riesgo global. Si el riesgo global es ALTO, crea un **borrador** en Gmail dirigido al equipo legal — no envía nada solo. Todo análisis queda registrado en Google Sheets y se devuelve al llamante como JSON estructurado.

## Antes de empezar

- **Gratis**: n8n self-hosted, Google Sheets y Gmail.
- **De pago**: la API de Anthropic (contratos largos = bastantes tokens).
- Ten a mano 2-3 contratos de prueba FICTICIOS. No subas contratos reales hasta tener claro dónde acaban esos datos (API del proveedor, hoja de cálculo...).

## Credenciales paso a paso

### Anthropic API (Header Auth) — para los nodos que llaman a Claude

1. Entra en https://console.anthropic.com con tu cuenta, ve a **API Keys** y pulsa **Create Key**. Copia la clave (empieza por `sk-ant-`): solo se muestra una vez.
2. En n8n: **Credentials → Add credential → Header Auth**.
3. En **Name** (nombre de la cabecera) escribe exactamente `x-api-key`. En **Value** pega tu clave.
4. Guarda la credencial como "Anthropic API (x-api-key)" y selecciónala en el nodo HTTP que llama a Claude (viene marcado con id REEMPLAZAR).

El nodo ya envía la cabecera `anthropic-version` por ti; no tienes que añadir nada más.

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

1. Descarga `26_contract_clause_extractor.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Contrato recibido (webhook)** — POST en `wf-26-contrato` con `cliente` y `texto_contrato`.
- **Validar contrato (code)** — obligatorios presentes; recorta el contrato a 20 000 caracteres.
- **¿Contrato completo? (if)** — false → respuesta 400.
- **Preparar análisis (code)** — prompt con la lista de cláusulas a buscar y formato JSON obligatorio; prohíbe inventar cláusulas.
- **Analizar con Claude (httpRequest)** — llamada a la API de Anthropic.
- **Parsear cláusulas (code)** — extrae el JSON; si no parsea, marca riesgo alto por precaución.
- **¿Riesgo alto? (if)** — true → además del registro, crea el borrador para legal.
- **Borrador para legal (gmail, draft)** — borrador con el resumen de cláusulas: una persona decide si se envía.
- **Registrar análisis (googleSheets)** — fila en "Contratos" con riesgo y resumen (rama alta y baja).
- **Responder cláusulas (respondToWebhook)** — devuelve riesgo global y el array de cláusulas.
- **Responder incompleto (respondToWebhook)** — error 400.

## Pruébalo

**1. Caso normal**:
```bash
curl -X POST https://TU-N8N/webhook-test/wf-26-contrato \
  -H "Content-Type: application/json" \
  -d '{"cliente":"Academia Demo SL","texto_contrato":"CLÁUSULA 1. Duración: 12 meses prorrogables. CLÁUSULA 2. Penalización por cancelación anticipada: 3 mensualidades. CLÁUSULA 3. Confidencialidad durante 5 años."}'
```
Espera 2-3 cláusulas extraídas; la penalización debería salir con riesgo medio/alto.

**2. Caso incompleto**: sin `texto_contrato` → 400.

**3. Caso duplicado**: el mismo contrato dos veces = dos análisis y dos gastos. Ejercicio: usa cliente+hash del texto para saltarte repetidos.

**4. Caso extremo**: envía como `texto_contrato` un texto que NO es un contrato ("receta de tortilla"). Espera 0 cláusulas o riesgo alto con parseo defensivo; el prompt prohíbe inventar, verifica que no se saca cláusulas de la manga.

## Errores típicos

- **Siempre devuelve riesgo alto con `respuesta_no_json`**: el modelo está envolviendo el JSON en explicaciones. Es el comportamiento de seguridad del parseador; refuerza el "Responde SOLO con JSON".
- **El borrador no aparece en Gmail**: mira en la carpeta Borradores de la cuenta conectada; si no está, la credencial no tiene el scope de composición (recrea la credencial OAuth).
- **Contratos largos cortados a 20 000 caracteres**: es el límite del validador. Para contratos de 50 páginas trocea por secciones y analiza en varias llamadas.
- **413 o timeout en el webhook**: body demasiado grande para tu instancia. Sube el límite de payload de n8n o envía el contrato ya recortado.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de Anthropic (Claude Opus 5)**: de pago por tokens, referencia 5 USD por millón de tokens de entrada y 25 USD por millón de salida — COMPROBAR EN LA WEB OFICIAL (anthropic.com/pricing).
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Orientativo: un contrato de 15 000 caracteres son ~5 000 tokens de entrada; con la salida, del orden de 0,05-0,10 USD por análisis con Opus 5 — COMPROBAR EN LA WEB OFICIAL.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.

Esto NO es asesoría legal ni la sustituye: es un pre-filtro para que el equipo legal priorice. Ninguna decisión contractual debe tomarse solo con la salida de este flujo.
