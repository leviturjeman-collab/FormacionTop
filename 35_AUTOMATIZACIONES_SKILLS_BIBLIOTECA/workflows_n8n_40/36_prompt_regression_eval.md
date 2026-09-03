# 36 · Evaluación de regresión de prompts

## Qué hace

Tu suite de tests para prompts: cada lunes a las 07:00 ejecuta una batería de casos (prompt + palabras que DEBEN aparecer en la respuesta) contra la API de Anthropic, puntúa cada caso, calcula la tasa de éxito y la registra en Google Sheets. Si la tasa cae por debajo del umbral (80 %), te avisa por Gmail con los casos fallidos: señal de que un cambio de prompt, de modelo o de formato ha roto algo que antes funcionaba.

Es la versión mínima de un "eval": suficiente para pillar regresiones gordas antes que tus usuarios.

## Antes de empezar

- **Gratis**: n8n self-hosted, Google Sheets y Gmail.
- **De pago**: la API de Anthropic (3 casos por semana es coste ridículo; crece con tu batería).
- Piensa 3-10 casos reales de tu producto: cuanto más se parezcan a lo que hacen tus usuarios, mejor detectan regresiones.

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

### Gmail (OAuth2)

1. En n8n: **Credentials → Add credential → Gmail OAuth2**. En n8n Cloud, **Sign in with Google** y listo.
2. Self-hosted: en el mismo proyecto de Google Cloud de antes, habilita la **Gmail API** y reutiliza el Client ID / Client Secret con la Redirect URI de n8n.
3. Asigna la credencial al nodo de Gmail y sustituye el destinatario `REEMPLAZAR_...@ejemplo.com` por un correo real.

## Cómo importar

1. Descarga `36_prompt_regression_eval.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Cada lunes a las 07:00 (scheduleTrigger)** — cron `0 7 * * 1`.
- **Casos de prueba (code)** — la batería: id, prompt y lista `esperado`. Edita aquí tus casos.
- **Ejecutar caso con Claude (httpRequest)** — una llamada por caso.
- **Puntuar caso (code)** — pasa/no pasa según las palabras esperadas (comparación en minúsculas).
- **Agregar resultados (code)** — tasa de éxito, umbral (UMBRAL_PCT) y lista de fallidos.
- **Registrar ejecución (googleSheets)** — fila histórica en "Evals": verás la tendencia semana a semana.
- **¿Hay regresión? (if)** — true si la tasa queda por debajo del umbral.
- **Avisar de regresión (gmail)** — correo con los casos fallidos y qué palabra faltó.
- **Sin regresión (noOp)** — rama tranquila.

## Pruébalo

Sin webhook: **Execute workflow**.

**1. Caso normal**: ejecuta con los 3 casos de ejemplo. Espera tasa 100 % y fila en "Evals".

**2. Caso incompleto (caso imposible)**: añade un caso con `esperado: ['xyzzy123']` y ejecuta. Espera tasa 66-75 %, `hay_regresion: true` y correo con ese caso.

**3. Caso duplicado**: ejecuta dos veces seguidas: dos filas en "Evals" con fecha distinta. Es el histórico deseado, no un bug.

**4. Caso extremo (batería vacía)**: comenta todos los casos (deja el array vacío) y ejecuta. Espera tasa 0 con 0 casos y regresión avisada: mejor una alarma falsa que un eval que "aprueba" sin evaluar nada.

## Errores típicos

- **Falla el caso formato-json**: el modelo devuelve el JSON con espacios distintos. La comprobación busca `"ok"` y `true` como subcadenas: si cambias el caso, mantén comprobaciones robustas.
- **Falsos fallos por mayúsculas o tildes**: todo se compara en minúsculas, pero las tildes cuentan: "María" espera `maría`.
- **429 de la API con baterías grandes**: los casos se ejecutan uno tras otro; si aun así te limitan, añade un nodo wait entre llamadas.
- **No llega el correo**: solo se envía cuando hay regresión; fuerza el caso 2 para probar el canal.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **API de Anthropic (Claude Opus 5)**: de pago por tokens, referencia 5 USD por millón de tokens de entrada y 25 USD por millón de salida — COMPROBAR EN LA WEB OFICIAL (anthropic.com/pricing).
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Orientativo: 3 casos cortos a la semana < 0,01 USD. Una batería de 50 casos sigue costando céntimos — COMPROBAR EN LA WEB OFICIAL.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.
