# 03 · Generador de propuestas comerciales con IA

## Qué hace

Recibe una solicitud de propuesta por webhook (cliente, servicios, presupuesto orientativo, plazo), valida los campos clave y pide a la IA una propuesta completa: título, resumen ejecutivo, alcance, plazos y precio orientativo. La propuesta queda como **borrador en Gmail** dirigido al cliente y registrada en Sheets. El precio lo valida siempre una persona antes de enviar: la IA solo redacta.

## Antes de empezar

- Una cuenta de **n8n**: n8n Cloud (de pago, con prueba gratuita) o **self-hosted gratis** (Docker en tu servidor).
- **API de Anthropic**: de pago por tokens (céntimos por ejecución en este flujo). También puedes apuntar el nodo HTTP a la API de OpenAI si lo prefieres.
- **Google Sheets/Gmail/Calendar**: gratis con tu cuenta de Google.

## Credenciales paso a paso

### Anthropic API (Header Auth) — de pago por tokens
1. Entra en [console.anthropic.com](https://console.anthropic.com) y crea una cuenta (pide añadir un método de pago o crédito inicial).
2. Menú **API Keys** → **Create Key** → copia la clave (empieza por `sk-ant-`). Solo se muestra una vez.
3. En n8n: **Credentials > New > Header Auth**.
   - **Name**: `x-api-key`
   - **Value**: tu clave `sk-ant-...`
4. Guarda la credencial con el nombre **Anthropic API** y selecciónala en el nodo HTTP que llama a la IA.

### Gmail (OAuth2) — gratis con cuenta de Google
1. En n8n: **Credentials > New > Gmail OAuth2** → **Sign in with Google**.
2. En self-hosted necesitas el mismo proyecto de Google Cloud que para Sheets, pero activando además la **Gmail API**.
3. Guarda como **Gmail (OAuth2)** y selecciónala en los nodos de Gmail.

### Google Sheets (OAuth2) — gratis con cuenta de Google
1. En n8n: **Credentials > New > Google Sheets OAuth2 API**.
2. En n8n Cloud basta con pulsar **Sign in with Google** y autorizar tu cuenta.
3. En n8n self-hosted, antes crea un proyecto en [console.cloud.google.com](https://console.cloud.google.com), activa la **Google Sheets API**, crea un **OAuth Client ID** (tipo Web) y pega la Redirect URI que te muestra n8n; después copia Client ID y Client Secret en la credencial y haz el Sign in.
4. Crea una hoja de cálculo nueva, copia el ID que hay en su URL (entre `/d/` y `/edit`) y pégalo en los nodos donde pone `REEMPLAZAR_ID_DOCUMENTO`.

## Cómo importar

1. En n8n ve a **Workflows > ⋯ > Import from File** (o *Import from Clipboard* y pega el contenido del JSON).
2. Al abrirse el lienzo verás nodos con un triángulo de aviso: son los que salen "en gris" porque les falta credencial. Abre cada uno y selecciona la credencial que creaste en el paso anterior.
3. Sustituye todos los valores `REEMPLAZAR...` (ID de la hoja, canal, chat, email...).
   - Pestañas necesarias: **Propuestas** y **Solicitudes incompletas**.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Webhook solicitud | Recibe el POST en `wf-03-solicitud-propuesta` | Nada |
| Normalizar solicitud | Extrae cliente, email, servicios, presupuesto, plazo y notas del body | Campos propios de tu proceso comercial |
| Responder recepción | Confirma la recepción | Nada |
| ¿Datos obligatorios? | Exige cliente y servicios | Añade presupuesto si no quieres proponer a ciegas |
| Redactar propuesta con IA | claude-opus-5 devuelve la propuesta estructurada en JSON | El prompt: mete tu catálogo de servicios y tus condiciones tipo |
| Interpretar propuesta | Parsea el JSON con tolerancia a fallos | Nada |
| Borrador de propuesta | Crea el borrador en Gmail dirigido al cliente con la propuesta formateada | Nada — mantenlo como borrador |
| Registrar propuesta | Fila en Propuestas con estado "pendiente de revisión humana" | El ID del documento |
| Registrar incompleta | Guarda solicitudes rechazadas y motivo | Nada |

## Pruébalo

1. **Normal**
   ```bash
   curl -X POST https://TU-N8N/webhook-test/wf-03-solicitud-propuesta -H "Content-Type: application/json" \
     -d '{"cliente":"Bodegas Rioja Norte","email":"dir@bodegas.es","servicios":"formacion IA para 20 personas y 2 automatizaciones","presupuesto_orientativo":"8000","plazo":"antes de diciembre"}'
   ```
   Debes ver: borrador en Gmail con la propuesta y fila en la pestaña Propuestas.
2. **Incompleto**
   Sin `servicios`. Debes ver: fila en **Solicitudes incompletas**; no se genera nada.
3. **Duplicado**
   Dos veces la misma solicitud → dos borradores. Antes de enviar, filtra la pestaña Propuestas por cliente y quédate con la versión buena.
4. **Extremo**
   `presupuesto_orientativo: "-500"` o texto absurdo. Debes ver: la IA redacta igualmente con precio orientativo raro — por eso el precio SIEMPRE lo corrige una persona antes de enviar.

## Errores típicos

- **Propuesta con alcance inventado** → la IA rellenó huecos: añade al prompt "no inventes servicios que no estén en la solicitud" y pasa tu catálogo real.
- **El borrador sale sin secciones** → el JSON llegó incompleto; mira `ia_texto_bruto` en la ejecución para ver qué devolvió la IA.
- **Sheets falla con 403** → la cuenta autorizada no tiene permiso de edición sobre esa hoja.
- **Timeout de la IA** → propuestas largas tardan; sube el timeout del nodo HTTP en Options si tu red corta a 10 s.

## Coste estimado

Por 100 ejecuciones: ~1.500 tokens de entrada + ~1.200 de salida (propuestas largas) ≈ 0,75 + 3,00 = **~3,75 USD** con claude-opus-5. Gmail/Sheets: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Datos personales del contacto (email, nombre): base legal típica, ejecución de medidas precontractuales (art. 6.1.b RGPD) porque el propio interesado pide la propuesta. Aun así, informa del uso de IA en tu política y no incluyas en el prompt datos de terceros ajenos a la solicitud. El precio y las condiciones enviadas comprometen: revisión humana obligatoria.
