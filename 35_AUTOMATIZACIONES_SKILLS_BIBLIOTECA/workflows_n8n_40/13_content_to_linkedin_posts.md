# 13 · Contenido convertido en posts de LinkedIn

## Qué hace

Le mandas por webhook un contenido largo (artículo, newsletter, transcripción) y la IA genera 3 posts de LinkedIn con ángulos distintos: práctico, de datos y de historia, cada uno con gancho, cuerpo y hashtags. Los 3 quedan registrados en Sheets y en un **borrador de Gmail** para que elijas y publiques a mano. Este flujo no publica en LinkedIn: el botón de publicar sigue siendo tuyo.

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

### Google Sheets (OAuth2) — gratis con cuenta de Google
1. En n8n: **Credentials > New > Google Sheets OAuth2 API**.
2. En n8n Cloud basta con pulsar **Sign in with Google** y autorizar tu cuenta.
3. En n8n self-hosted, antes crea un proyecto en [console.cloud.google.com](https://console.cloud.google.com), activa la **Google Sheets API**, crea un **OAuth Client ID** (tipo Web) y pega la Redirect URI que te muestra n8n; después copia Client ID y Client Secret en la credencial y haz el Sign in.
4. Crea una hoja de cálculo nueva, copia el ID que hay en su URL (entre `/d/` y `/edit`) y pégalo en los nodos donde pone `REEMPLAZAR_ID_DOCUMENTO`.

### Gmail (OAuth2) — gratis con cuenta de Google
1. En n8n: **Credentials > New > Gmail OAuth2** → **Sign in with Google**.
2. En self-hosted necesitas el mismo proyecto de Google Cloud que para Sheets, pero activando además la **Gmail API**.
3. Guarda como **Gmail (OAuth2)** y selecciónala en los nodos de Gmail.

## Cómo importar

1. En n8n ve a **Workflows > ⋯ > Import from File** (o *Import from Clipboard* y pega el contenido del JSON).
2. Al abrirse el lienzo verás nodos con un triángulo de aviso: son los que salen "en gris" porque les falta credencial. Abre cada uno y selecciona la credencial que creaste en el paso anterior.
3. Sustituye todos los valores `REEMPLAZAR...` (ID de la hoja, canal, chat, email...).
   - Pestañas: **Posts LinkedIn** y **Contenido incompleto**. Cambia el destinatario del borrador.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Webhook contenido | Recibe el POST en `wf-13-contenido-fuente` | Nada |
| Normalizar contenido | Extrae título, contenido (máx. 12.000 caracteres) y enlace | El límite |
| Responder recepción | Confirma la recepción | Nada |
| ¿Trae contenido? | Rechaza peticiones vacías | Nada |
| Generar 3 posts | claude-opus-5 devuelve un array de 3 posts en JSON | Los ángulos del prompt: ajústalos a tu marca |
| Trocear posts | Un item por post, hashtags con # | Nada |
| Registrar posts | Tres filas en Posts LinkedIn, estado "pendiente de aprobación" | El ID del documento |
| Componer email | Junta los 3 posts en un texto de revisión | Nada |
| Borrador para aprobar | Borrador en Gmail con los 3 posts | El destinatario |
| Registrar incompleto | Peticiones sin contenido | Nada |

## Pruébalo

1. **Normal**
   ```bash
   curl -X POST https://TU-N8N/webhook-test/wf-13-contenido-fuente -H "Content-Type: application/json" \
     -d '{"titulo":"5 automatizaciones para pymes","enlace":"https://blog.ejemplo.es/5-autos","contenido":"Las pymes pierden horas en tareas repetitivas... (pega aqui tu articulo)"}'
   ```
   Debes ver: 3 filas en Posts LinkedIn y un borrador en Gmail con los 3.
2. **Incompleto**
   Sin `contenido`. Debes ver: fila en **Contenido incompleto**, nada más.
3. **Duplicado**
   El mismo artículo dos veces → 6 posts sobre lo mismo. Filtra por titulo_fuente en la hoja y descarta la tanda que no uses.
4. **Extremo**
   Contenido de 12.000 caracteres justos. Debes ver: 3 posts normales; si el original era mayor se recortó — trocea artículos muy largos en dos envíos.

## Errores típicos

- **Solo llega 1 post** → la IA no devolvió el array de 3: reintenta; el prompt exige "exactamente 3".
- **Posts con humo** → ajusta el prompt con tu tono ("sin superlativos, con datos del contenido").
- **Hashtags duplicados con #** → la IA ya los mandó con #; el flujo añade # solo si faltan — revisa la fila.
- **Borrador sin saltos de línea** → usa emailType text (ya viene así); si lo cambias a HTML, convierte los \n en <br>.

## Coste estimado

Por 100 contenidos: ~3.000 tokens de entrada + 900 de salida ≈ **~3,75 USD** con claude-opus-5. Gmail/Sheets: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Publica solo contenido del que tengas derechos. Si el post menciona clientes o casos reales, pide permiso antes. La normativa de publicidad exige identificar colaboraciones pagadas: eso no lo detecta la IA, márcalo tú.
