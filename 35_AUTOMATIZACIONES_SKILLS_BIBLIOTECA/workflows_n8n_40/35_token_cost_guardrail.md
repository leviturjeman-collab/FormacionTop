# 35 · Guardarraíl de coste de tokens

## Qué hace

Centraliza el control de gasto en IA de todas tus apps: cada vez que una app tuya hace una llamada a un modelo, envía a este webhook el evento (app, modelo, tokens de entrada y salida). El flujo calcula el coste con una tabla de precios editable, lo anota en la pestaña "Consumo" de Google Sheets, relee el consumo del día y, si el acumulado supera el umbral (10 USD por defecto), avisa por Gmail al responsable con el desglose. El llamante recibe siempre el gasto acumulado del día, para que la propia app pueda frenarse si quiere.

## Antes de empezar

- **Gratis**: n8n self-hosted, Google Sheets y Gmail.
- **De pago**: nada en este flujo (mide el gasto de otros; él no llama a ninguna IA).
- Actualiza la tabla `PRECIOS` del nodo "Calcular coste" con los precios vigentes: COMPROBAR EN LA WEB OFICIAL de cada proveedor.
- Instrumenta tus apps: tras cada llamada al modelo, un POST a este webhook con el `usage` que devuelve la API.

## Credenciales paso a paso

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

1. Descarga `35_token_cost_guardrail.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Registro de uso de IA (webhook)** — POST en `wf-35-uso-ia` con app, modelo, tokens_entrada y tokens_salida.
- **Validar registro (code)** — obligatorios presentes y tokens numéricos.
- **¿Registro completo? (if)** — false → respuesta 400.
- **Calcular coste (code)** — tabla de precios USD/millón de tokens; modelos desconocidos usan el precio más caro por prudencia.
- **Anotar consumo (googleSheets)** — append en "Consumo".
- **Leer consumo del día (googleSheets)** — relee la pestaña completa.
- **Sumar gasto del día (code)** — suma las filas de hoy y compara con UMBRAL_USD_DIA (edítalo aquí).
- **¿Supera el umbral? (if)** — true → aviso; en ambos casos se responde.
- **Avisar de sobrecoste (gmail)** — correo con gasto, umbral y consejo de revisión.
- **Responder estado (respondToWebhook)** — devuelve gasto acumulado y si se superó el umbral.
- **Responder incompleto (respondToWebhook)** — error 400.

## Pruébalo

**1. Caso normal**:
```bash
curl -X POST https://TU-N8N/webhook-test/wf-35-uso-ia \
  -H "Content-Type: application/json" \
  -d '{"app":"chatbot-soporte","modelo":"claude-opus-5","tokens_entrada":1200,"tokens_salida":350}'
```
Espera `gasto_hoy_usd` pequeño y `supera_umbral: false`.

**2. Caso incompleto**: sin `tokens_salida` → 400.

**3. Caso duplicado**: reenvía el mismo evento dos veces: se suman los dos (correcto para un contador, pero si tu app reintenta POSTs, añade un id de evento y deduplica).

**4. Caso extremo (disparar la alarma)**: envía `{"app":"prueba","modelo":"claude-opus-5","tokens_entrada":900000000,"tokens_salida":100000000}`. Espera `supera_umbral: true` y el correo de sobrecoste. Borra después esa fila de la hoja para no dejar la alarma pegada.

## Errores típicos

- **El gasto del día no cuadra**: la columna `fecha` de la hoja debe quedar como texto AAAA-MM-DD; si Google la convierte a fecha con otro formato, la suma no la reconoce. Formatea la columna como texto plano.
- **Con miles de filas va lento**: el flujo relee toda la pestaña en cada evento. Rota la hoja cada mes o suma en una pestaña resumen.
- **`supera_umbral` nunca se activa**: el umbral se edita dentro del code "Sumar gasto del día" (UMBRAL_USD_DIA), no en la hoja.
- **Precios desactualizados**: la tabla PRECIOS es tuya: revísala cuando cambien tarifas — COMPROBAR EN LA WEB OFICIAL.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

El flujo en sí no gasta tokens: es el que evita que los demás gasten de más.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.
