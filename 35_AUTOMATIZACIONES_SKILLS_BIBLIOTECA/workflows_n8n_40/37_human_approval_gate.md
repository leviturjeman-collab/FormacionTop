# 37 · Puerta de aprobación humana reutilizable

## Qué hace

Una pieza para enchufar delante de cualquier acción peligrosa de tus otros flujos: en vez de ejecutar directamente (enviar una campaña, borrar datos, publicar algo), el flujo llamante hace un POST aquí con la acción, quién la pide y el detalle. Esta puerta manda la solicitud a tu **Telegram con botones Aprobar / Rechazar** y se queda esperando la decisión. Cuando decides, registra el resultado en Google Sheets, avisa por **WhatsApp** al solicitante si dejó teléfono, y responde al flujo llamante con `aprobada` o `rechazada` para que continúe o aborte.

Así el freno humano deja de ser un copy-paste en cada flujo y pasa a ser un servicio único y auditable.

## Antes de empezar

- **Gratis**: n8n self-hosted, bot de Telegram (@BotFather) y Google Sheets.
- **De pago**: WhatsApp Business Cloud en producción (el aviso al solicitante es opcional: sin `telefono_aviso`, el flujo funciona igual).
- Importante: el flujo llamante queda **esperando** la respuesta HTTP hasta que alguien pulse el botón (o caduque el tiempo límite de aprobación configurable en el nodo de Telegram).

## Credenciales paso a paso

### Telegram (bot GRATIS)

1. En Telegram, abre un chat con **@BotFather** → `/newbot` → elige nombre y usuario del bot. Te devuelve un token del tipo `123456789:ABC-DEF...`. Crear el bot es gratis.
2. En n8n: **Credentials → Add credential → Telegram API** → pega el token.
3. Escríbele cualquier mensaje a tu bot (por ejemplo "hola") para abrir la conversación: un bot no puede iniciarla él.
4. Consigue tu `chat_id`: visita `https://api.telegram.org/botTU_TOKEN/getUpdates` en el navegador y copia el valor de `message.chat.id` (también sirve el bot @userinfobot).
5. En el nodo de Telegram del flujo sustituye `REEMPLAZAR_CHAT_ID` por ese número.

### WhatsApp Business Cloud (Meta) — de pago según uso

1. Necesitas una cuenta de **Meta Business** (https://business.facebook.com) y una app en https://developers.facebook.com → **Create App** → tipo *Business*.
2. Dentro de la app añade el producto **WhatsApp**. Meta te asigna un número de pruebas gratuito y un token temporal.
3. En el panel **API Setup / Configuración de la API** copia dos cosas: el **Access Token** y el **Phone Number ID**.
4. En n8n: **Credentials → Add credential → WhatsApp API** → pega el Access Token. Para producción crea un token permanente con un *system user* en Business Settings.
5. En el nodo de WhatsApp sustituye `REEMPLAZAR_PHONE_NUMBER_ID` por tu Phone Number ID.
6. En modo pruebas solo puedes escribir a números que hayas verificado en ese panel. Los teléfonos van en formato internacional sin "+": `34600000000`. Fuera de la ventana de 24 h desde el último mensaje del usuario, Meta exige plantillas aprobadas.

### Google Sheets (OAuth2)

1. En n8n: **Credentials → Add credential → Google Sheets OAuth2 API**. En n8n Cloud basta con pulsar **Sign in with Google** y aceptar los permisos.
2. Si tu n8n es self-hosted: crea un proyecto en https://console.cloud.google.com, habilita la **Google Sheets API**, configura la pantalla de consentimiento y crea una credencial **ID de cliente OAuth** (aplicación web) usando la *Redirect URI* que te muestra n8n. Copia el Client ID y el Client Secret en la credencial de n8n y conéctate.
3. Crea una hoja de cálculo en https://sheets.google.com y copia su **ID de documento**: es el tramo largo de la URL entre `/d/` y `/edit`.
4. En cada nodo de Google Sheets del flujo, pega ese ID donde pone `REEMPLAZAR_ID_DOCUMENTO` y comprueba que el nombre de la pestaña coincide con el indicado en la guía (créala si no existe; los encabezados se crean solos en el primer append).

## Cómo importar

1. Descarga `37_human_approval_gate.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Solicitud de aprobación (webhook)** — POST en `wf-37-solicitud-aprobacion` con accion, solicitante, detalle y telefono_aviso opcional.
- **Validar solicitud (code)** — los tres obligatorios; recorta el detalle a 1 500 caracteres.
- **¿Solicitud completa? (if)** — false → respuesta 400.
- **Pedir aprobación por Telegram (telegram, sendAndWait)** — envía la solicitud con botones y PAUSA el flujo hasta la decisión (doble confirmación activada).
- **¿Aprobada? (if)** — lee `$json.data.approved` de la respuesta de Telegram.
- **Marcar como aprobada (set)** — normaliza el resultado con la acción y el solicitante originales.
- **Marcar como rechazada (set)** — ídem para el rechazo.
- **Avisar por WhatsApp al solicitante (whatsApp)** — solo en la rama aprobada y solo si hay teléfono.
- **Registrar decisión (googleSheets)** — fila de auditoría en "Aprobaciones" (quién pidió qué y qué se decidió).
- **Responder decisión (respondToWebhook)** — devuelve la decisión al flujo llamante.
- **Responder incompleto (respondToWebhook)** — error 400.

## Pruébalo

**1. Caso normal**:
```bash
curl -X POST https://TU-N8N/webhook-test/wf-37-solicitud-aprobacion \
  -H "Content-Type: application/json" \
  -d '{"accion":"enviar_campaña","solicitante":"flujo-18","detalle":"42 correos de carrito abandonado","telefono_aviso":"34600000000"}'
```
Te llega el Telegram; pulsa **Aprobar** (dos veces, es doble confirmación). Espera respuesta `decision: aprobada`, WhatsApp al teléfono y fila en Sheets.

**2. Caso incompleto**: sin `detalle` → 400 inmediato, sin molestar a nadie por Telegram.

**3. Caso duplicado**: envía dos solicitudes iguales seguidas: te llegan dos mensajes con botones independientes y cada curl espera su propia decisión. Compórtate como aprobador: contesta las dos y compara las filas.

**4. Caso extremo (rechazo)**: repite el caso normal y pulsa **Rechazar**. Espera `decision: rechazada`, SIN WhatsApp, y fila de rechazo en la hoja. Prueba también a no contestar: el curl esperará hasta el límite de tiempo del sendAndWait.

## Errores típicos

- **El curl se queda colgado**: es el diseño: está esperando tu decisión en Telegram. Configura "Limit wait time" en el nodo de Telegram para que caduque solo.
- **Los botones no hacen nada**: tu instancia de n8n debe ser accesible desde internet (los botones apuntan a tu n8n); en local usa túnel o n8n Cloud.
- **No llega el WhatsApp tras aprobar**: número no verificado en el panel de Meta (modo pruebas) o formato con "+". Debe ser 34600000000.
- **`data.approved` no existe**: has cambiado el responseType del nodo de Telegram; para esta puerta debe ser "approval".

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **Telegram**: crear el bot y enviar mensajes es GRATIS.
- **WhatsApp Business Cloud**: el número de pruebas es gratuito; en producción Meta cobra por conversación/plantilla según país — COMPROBAR EN LA WEB OFICIAL (developers.facebook.com/docs/whatsapp/pricing).
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Sin IA: el "modelo" que decide aquí eres tú.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.
