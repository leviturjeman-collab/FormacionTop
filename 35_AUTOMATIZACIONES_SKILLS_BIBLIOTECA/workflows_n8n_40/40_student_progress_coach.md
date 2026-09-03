# 40 · Coach de progreso de alumnos

## Qué hace

Cada lunes a las 09:00 lee tu hoja de alumnos en Google Sheets, detecta a los rezagados (progreso < 50 % o 7+ días sin actividad), y redacta con Claude un mensaje de ánimo personalizado y corto para cada uno mencionando su módulo actual. Antes de enviar NADA, el tutor recibe por **Gmail** la lista completa de mensajes propuestos con botones Aprobar / Rechazar (el flujo queda en pausa). Solo si aprueba, cada alumno recibe su mensaje por **WhatsApp** y los envíos quedan registrados en la pestaña "Envios".

Automatiza el trabajo pesado (detectar y redactar) y deja la decisión de contactar a una persona.

## Antes de empezar

- **Gratis**: n8n self-hosted, Google Sheets y Gmail.
- **De pago**: la API de Anthropic (un mensaje corto por alumno rezagado) y WhatsApp Business Cloud en producción (número de pruebas gratis).
- Prepara la hoja: pestaña **Alumnos** con columnas exactas `nombre`, `telefono`, `modulo_actual`, `progreso_pct`, `dias_sin_actividad` (teléfonos en formato 34600000000). Y una pestaña **Envios** vacía para el registro.
- Los alumnos deben haber aceptado recibir mensajes de WhatsApp del curso (consentimiento; mira el flujo 24).

## Credenciales paso a paso

### Google Sheets (OAuth2)

1. En n8n: **Credentials → Add credential → Google Sheets OAuth2 API**. En n8n Cloud basta con pulsar **Sign in with Google** y aceptar los permisos.
2. Si tu n8n es self-hosted: crea un proyecto en https://console.cloud.google.com, habilita la **Google Sheets API**, configura la pantalla de consentimiento y crea una credencial **ID de cliente OAuth** (aplicación web) usando la *Redirect URI* que te muestra n8n. Copia el Client ID y el Client Secret en la credencial de n8n y conéctate.
3. Crea una hoja de cálculo en https://sheets.google.com y copia su **ID de documento**: es el tramo largo de la URL entre `/d/` y `/edit`.
4. En cada nodo de Google Sheets del flujo, pega ese ID donde pone `REEMPLAZAR_ID_DOCUMENTO` y comprueba que el nombre de la pestaña coincide con el indicado en la guía (créala si no existe; los encabezados se crean solos en el primer append).

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

### WhatsApp Business Cloud (Meta) — de pago según uso

1. Necesitas una cuenta de **Meta Business** (https://business.facebook.com) y una app en https://developers.facebook.com → **Create App** → tipo *Business*.
2. Dentro de la app añade el producto **WhatsApp**. Meta te asigna un número de pruebas gratuito y un token temporal.
3. En el panel **API Setup / Configuración de la API** copia dos cosas: el **Access Token** y el **Phone Number ID**.
4. En n8n: **Credentials → Add credential → WhatsApp API** → pega el Access Token. Para producción crea un token permanente con un *system user* en Business Settings.
5. En el nodo de WhatsApp sustituye `REEMPLAZAR_PHONE_NUMBER_ID` por tu Phone Number ID.
6. En modo pruebas solo puedes escribir a números que hayas verificado en ese panel. Los teléfonos van en formato internacional sin "+": `34600000000`. Fuera de la ventana de 24 h desde el último mensaje del usuario, Meta exige plantillas aprobadas.

## Cómo importar

1. Descarga `40_student_progress_coach.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Cada lunes a las 09:00 (scheduleTrigger)** — cron `0 9 * * 1`.
- **Leer hoja de alumnos (googleSheets)** — lee la pestaña "Alumnos", una fila por alumno.
- **Evaluar progreso (code)** — marca ficha completa y si necesita apoyo; a los que sí, les prepara ya la petición de IA.
- **¿Ficha completa y necesita apoyo? (if)** — doble condición; el resto va a "Alumnos omitidos" (fichas incompletas o alumnos al día).
- **Redactar ánimo con Claude (httpRequest)** — un mensaje de máx. 300 caracteres por alumno, en tuteo y sin presión.
- **Componer mensajes y resumen (code)** — empareja respuesta ↔ alumno y arma el resumen para el tutor.
- **Aprobación del tutor (gmail, sendAndWait)** — correo con TODOS los mensajes propuestos y botones; el flujo espera.
- **¿Aprobado por el tutor? (if)** — lee `data.approved`; rechazo → "Envío descartado".
- **Expandir mensajes (code)** — vuelve a un item por alumno para el envío.
- **Registrar envíos (googleSheets)** — primero la evidencia en "Envios"...
- **Enviar WhatsApp al alumno (whatsApp)** — ...y después el mensaje real a cada teléfono.
- **Alumnos omitidos (noOp)** — rama de descartados.
- **Envío descartado (noOp)** — rama de rechazo del tutor.

## Pruébalo

Sin webhook: rellena la hoja y usa **Execute workflow**. Usa TU propio número como teléfono de los alumnos de prueba.

**1. Caso normal**: dos alumnos, uno con `progreso_pct: 30` y `dias_sin_actividad: 10`, otro con `progreso_pct: 90` y `dias_sin_actividad: 1`. Ejecuta: te llega UN correo con UN mensaje propuesto; aprueba y espera el WhatsApp y la fila en "Envios".

**2. Caso incompleto**: añade una fila sin teléfono. Debe irse a "Alumnos omitidos" sin gastar IA ni aparecer en el correo del tutor.

**3. Caso duplicado**: ejecuta dos veces y aprueba las dos: el alumno rezagado recibe dos mensajes. Ejercicio importante: consulta "Envios" y salta a quien ya recibió mensaje esta semana.

**4. Caso extremo (rechazo)**: repite el caso normal y pulsa **Rechazar** en el correo. Espera "Envío descartado": ni WhatsApp ni filas nuevas en "Envios".

## Errores típicos

- **El correo de aprobación no llega**: destinatario REEMPLAZAR sin cambiar, o el flujo ni llegó ahí porque ningún alumno necesita apoyo (mira la ejecución).
- **WhatsApp falla con `Recipient phone number not in allowed list`**: en modo pruebas de Meta solo puedes escribir a números verificados: añade el tuyo en el panel de la app.
- **Mensajes con nombre equivocado**: el emparejamiento usa itemMatching: no reordenes los nodos entre "Evaluar progreso" y "Componer mensajes y resumen".
- **Columnas no reconocidas**: los nombres de columna deben ser exactos y en minúsculas (`progreso_pct`, no `Progreso %`).

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de Anthropic (Claude Opus 5)**: de pago por tokens, referencia 5 USD por millón de tokens de entrada y 25 USD por millón de salida — COMPROBAR EN LA WEB OFICIAL (anthropic.com/pricing).
- **WhatsApp Business Cloud**: el número de pruebas es gratuito; en producción Meta cobra por conversación/plantilla según país — COMPROBAR EN LA WEB OFICIAL (developers.facebook.com/docs/whatsapp/pricing).
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Orientativo: 10 alumnos rezagados/semana ≈ 10 llamadas cortas (< 0,05 USD) + el coste de conversación de WhatsApp según país — COMPROBAR EN LA WEB OFICIAL.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.

Estás contactando a personas con sus datos (nombre, teléfono, progreso): necesitas su consentimiento previo para este canal y debes ofrecer una forma clara de dejar de recibir mensajes.
