# 24 · Comprobador de consentimiento RGPD

## Qué hace

Puerta de entrada RGPD para cualquier formulario que recoja datos personales: recibe email, finalidad y consentimiento; si falta algo responde 400; si el consentimiento no es explícito, **bloquea el procesamiento**, lo registra y avisa por Gmail al responsable (DPO); y solo cuando hay consentimiento marca el alta como procesable. Todas las decisiones quedan en Google Sheets con fecha, finalidad y origen: ese es tu registro de evidencias.

La idea didáctica: el "sí" del usuario se comprueba en la máquina, pero la evidencia y el aviso los ve una persona.

## Antes de empezar

- **Gratis**: n8n self-hosted, Google Sheets y Gmail.
- **De pago**: nada; este flujo no llama a ninguna IA (a propósito: las decisiones RGPD no se delegan en un modelo).
- Decide quién es el "responsable" que recibirá los avisos de altas bloqueadas y ten clara la finalidad que declaras en el formulario.

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

1. Descarga `24_consent_checker_gdpr.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Alta con datos personales (webhook)** — POST en `wf-24-alta-datos` con email, finalidad y consentimiento.
- **Validar solicitud (code)** — normaliza el email, interpreta el consentimiento (true / "true" / "sí") y marca `valido`.
- **¿Campos completos? (if)** — false → respuesta 400.
- **¿Hay consentimiento? (if)** — decide entre la rama de procesable y la de bloqueo.
- **Marcar como consentido (set)** — añade `estado: consentimiento_registrado` y `puede_procesarse: true`.
- **Marcar sin consentimiento (set)** — añade `estado: bloqueado_sin_consentimiento` y `puede_procesarse: false`.
- **Avisar al responsable (gmail)** — correo al DPO con el alta bloqueada (sin adjuntar más datos de los necesarios).
- **Registrar decisión (googleSheets)** — toda decisión (buena o mala) deja fila en "Consentimientos".
- **Responder decisión (respondToWebhook)** — devuelve `ok`, `estado` y el email normalizado.
- **Responder incompleto (respondToWebhook)** — error 400 con los campos que faltan.

## Pruébalo

**1. Caso normal**:
```bash
curl -X POST https://TU-N8N/webhook-test/wf-24-alta-datos \
  -H "Content-Type: application/json" \
  -d '{"email":"alumna@ejemplo.es","finalidad":"newsletter formativa","consentimiento":true,"origen":"web"}'
```
Espera `estado: consentimiento_registrado` y fila en Sheets.

**2. Caso incompleto**: sin `finalidad` → 400 con `faltan: ["finalidad"]`.

**3. Caso duplicado**: envía el caso normal dos veces. Tendrás dos filas con el mismo email: para un registro de consentimiento suele ser correcto (histórico), pero razona si tu caso necesita deduplicar.

**4. Caso extremo (sin consentimiento)**: `"consentimiento": false` → espera `estado: bloqueado_sin_consentimiento`, correo al DPO y ninguna otra acción. Prueba también `"consentimiento": "sí"` en texto: debe contar como consentimiento.

## Errores típicos

- **Todo llega como bloqueado**: el consentimiento llega como string raro ("on", "1"). Amplía la lista de valores aceptados en "Validar solicitud" según tu formulario.
- **No llega el correo al DPO**: la credencial de Gmail no tiene permiso de envío o dejaste el destinatario REEMPLAZAR. Mira la ejecución del nodo "Avisar al responsable".
- **Fila duplicada en Sheets al bloquear**: es correcto: el set de bloqueo alimenta a la vez el registro y el aviso; solo se escribe una fila. Si ves dos, has conectado algo de más.
- **Datos personales en la hoja compartida**: no compartas la pestaña "Consentimientos" a cualquiera: contiene emails. Restringe el acceso en Google Sheets.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Sin coste de IA. El coste real aquí es organizativo: mantener el registro y responder a los avisos.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.

Además del aviso general: este flujo es una ayuda técnica para recoger evidencias de consentimiento, **no** un sistema de cumplimiento RGPD completo (derechos ARCO, plazos de conservación, transferencias internacionales...). Valídalo con tu delegado de protección de datos.
