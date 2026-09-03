# 17 · Enriquecimiento de fichas de producto ecommerce

## Qué hace

Recibe un producto por webhook (SKU, nombre, características en bruto) y la IA redacta la ficha completa: título SEO, descripción de 120-180 palabras, 5 bullets, meta descripción y palabras clave — usando SOLO las características que le das, sin inventar datos técnicos. La ficha queda en la pestaña "Catalogo enriquecido" y Slack avisa para que alguien la revise antes de subirla a la tienda. Nada se publica automáticamente.

## Antes de empezar

- Una cuenta de **n8n**: n8n Cloud (de pago, con prueba gratuita) o **self-hosted gratis** (Docker en tu servidor).
- **API de Anthropic**: de pago por tokens (céntimos por ejecución en este flujo). También puedes apuntar el nodo HTTP a la API de OpenAI si lo prefieres.
- **Google Sheets/Gmail/Calendar**: gratis con tu cuenta de Google.
- **Slack**: gratis (un bot en tu workspace, plan free suficiente).

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

### Slack Bot — gratis (plan free de Slack vale)
1. Entra en [api.slack.com/apps](https://api.slack.com/apps) → **Create New App** → *From scratch* → elige tu workspace.
2. En **OAuth & Permissions > Scopes > Bot Token Scopes** añade `chat:write` (y `channels:read` para elegir canal por lista).
3. **Install to Workspace** → copia el **Bot User OAuth Token** (`xoxb-...`).
4. En n8n: **Credentials > New > Slack API** → pega el token → guarda como **Slack Bot**.
5. En Slack, invita al bot al canal: `/invite @tu-bot`. El ID del canal sale al pulsar el nombre del canal (abajo del todo) y va donde pone `REEMPLAZAR_ID_CANAL`.

## Cómo importar

1. En n8n ve a **Workflows > ⋯ > Import from File** (o *Import from Clipboard* y pega el contenido del JSON).
2. Al abrirse el lienzo verás nodos con un triángulo de aviso: son los que salen "en gris" porque les falta credencial. Abre cada uno y selecciona la credencial que creaste en el paso anterior.
3. Sustituye todos los valores `REEMPLAZAR...` (ID de la hoja, canal, chat, email...).
   - Pestañas: **Catalogo enriquecido** y **Productos incompletos**.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Webhook producto | Recibe el POST en `wf-17-producto-nuevo` | Nada |
| Normalizar producto | Extrae sku, nombre, características (máx. 4.000 caracteres) y precio | Nada |
| Responder recepción | Confirma la recepción | Nada |
| ¿Producto completo? | Exige sku y nombre | Añade características como obligatorias si quieres fichas ricas |
| Enriquecer ficha con IA | claude-opus-5 devuelve la ficha en JSON | El prompt: tono de tu marca, límites de longitud |
| Interpretar ficha | Parsea el JSON | Nada |
| Registrar ficha | Fila en Catalogo enriquecido, estado "pendiente de revisión" | El ID del documento |
| Avisar para revisar | Aviso en Slack recordando comprobar datos inventados | REEMPLAZAR_ID_CANAL |
| Registrar incompleto | Productos sin sku o nombre | Nada |

## Pruébalo

1. **Normal**
   ```bash
   curl -X POST https://TU-N8N/webhook-test/wf-17-producto-nuevo -H "Content-Type: application/json" \
     -d '{"sku":"BOT-500","nombre":"Botella termica 500ml","caracteristicas":"acero inoxidable, 24h frio 12h calor, sin BPA, 3 colores","precio":"19,90"}'
   ```
   Debes ver: fila con la ficha completa y aviso en Slack.
2. **Incompleto**
   Sin `sku`. Debes ver: fila en **Productos incompletos**.
3. **Duplicado**
   El mismo SKU dos veces → dos fichas alternativas. Filtra por sku y elige; borra la descartada para no subir la equivocada.
4. **Extremo**
   `caracteristicas: "buena"`. Debes ver: ficha pobre pero SIN datos técnicos inventados (el prompt lo prohíbe) — la calidad de entrada limita la de salida.

## Errores típicos

- **La IA inventa materiales o medidas** → refuerza el prompt ("si no está en las características, no lo digas") y revisa SIEMPRE antes de publicar: es el riesgo nº 1 en ecommerce.
- **Título SEO de más de 60 caracteres** → recórtalo al revisar o pide en el prompt contarlos.
- **Caracteres raros en la hoja** → características copiadas de un PDF con símbolos: limpia el texto de entrada.
- **Slack no avisa** → bot fuera del canal.

## Coste estimado

Por 100 productos: ~700 tokens de entrada + 500 de salida ≈ **~1,60 USD** con claude-opus-5. Sheets/Slack: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Las descripciones de producto son publicidad: afirmaciones falsas (materiales, certificaciones, "el mejor del mercado") pueden ser publicidad engañosa. La revisión humana previa a publicar no es opcional. Sin datos personales en este flujo.
