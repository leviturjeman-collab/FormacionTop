# 39 · Verificador de credibilidad de fuentes

## Qué hace

Le das una URL y una afirmación ("esta página dice X") y el flujo: descarga la página, extrae señales objetivas (dominio, HTTPS, texto visible sin scripts ni estilos) y le pide a Claude un veredicto estructurado: nivel de credibilidad (alta/media/baja), puntuación 0-100, si el texto respalda o no la afirmación, razones y banderas rojas. Todo queda registrado en Google Sheets y se devuelve por el webhook.

El veredicto sirve para **priorizar qué contrastar a mano**: nunca es la verdad final. Con instrucciones de escepticismo explícitas: si el extracto no basta, el modelo debe decirlo.

## Antes de empezar

- **Gratis**: n8n self-hosted y Google Sheets.
- **De pago**: la API de Anthropic (una llamada corta por verificación).
- Algunas webs bloquean bots: el flujo tolera el fallo de descarga (neverError) y el modelo lo tendrá en cuenta como extracto vacío.

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

1. Descarga `39_source_credibility_checker.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Fuente a verificar (webhook)** — POST en `wf-39-verificar-fuente` con url y afirmacion.
- **Validar fuente (code)** — obligatorios presentes y URL con http(s)://.
- **¿Petición completa? (if)** — false → respuesta 400.
- **Descargar página (httpRequest)** — GET con timeout 15 s, neverError y respuesta como texto.
- **Analizar señales y preparar IA (code)** — limpia el HTML (fuera scripts/estilos/etiquetas), extrae 6 000 caracteres y monta el prompt escéptico.
- **Evaluar con Claude (httpRequest)** — llamada a la API de Anthropic.
- **Componer veredicto (code)** — parsea el JSON; si falla, degrada a nivel "baja" por precaución.
- **Registrar verificación (googleSheets)** — fila en "Fuentes" con veredicto y banderas rojas.
- **Responder veredicto (respondToWebhook)** — devuelve el veredicto completo.
- **Responder incompleto (respondToWebhook)** — error 400.

## Pruébalo

**1. Caso normal**:
```bash
curl -X POST https://TU-N8N/webhook-test/wf-39-verificar-fuente \
  -H "Content-Type: application/json" \
  -d '{"url":"https://es.wikipedia.org/wiki/Inteligencia_artificial","afirmacion":"El término inteligencia artificial se acuñó en 1956."}'
```
Espera nivel alta/media y `respalda_afirmacion: si` o `parcial`.

**2. Caso incompleto**: `{"url":"ftp://cosa"}` → 400 (falta afirmacion y la URL no es http/https).

**3. Caso duplicado**: la misma verificación dos veces → dos filas y doble gasto; para un histórico de fuentes puede interesarte, decide tú.

**4. Caso extremo**: una URL que no existe (`https://no-existe-99999.com`) con cualquier afirmación. La descarga falla en silencio, el extracto va vacío y el veredicto debe ser nivel baja con la bandera de "no se pudo leer la fuente". Si el modelo se inventa el contenido, refuerza el prompt.

## Errores típicos

- **Extracto vacío en webs normales**: páginas 100 % JavaScript: el GET trae HTML sin contenido. Señálalo como limitación o usa la variante del flujo 38 con búsqueda web.
- **403 al descargar**: la web bloquea bots. El flujo continúa con extracto vacío; no fuerces cabeceras de navegador falsas en producción sin revisar los términos del sitio.
- **Veredictos demasiado generosos**: ajusta el prompt: añade ejemplos de banderas rojas de tu dominio (sin autor, sin fecha, dominio recién registrado...).
- **`respuesta_no_json`**: parseo defensivo activado: revisa el prompt si es frecuente.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de Anthropic (Claude Opus 5)**: de pago por tokens, referencia 5 USD por millón de tokens de entrada y 25 USD por millón de salida — COMPROBAR EN LA WEB OFICIAL (anthropic.com/pricing).
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Orientativo: ~2 000 tokens de entrada por verificación: 0,01-0,03 USD con Opus 5 — COMPROBAR EN LA WEB OFICIAL.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.
