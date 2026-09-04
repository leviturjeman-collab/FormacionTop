# 15 · Brief SEO para artículos de blog

## Qué hace

Recibe una keyword por webhook (con público y objetivo opcionales) y la IA construye un brief SEO completo: título sugerido, intención de búsqueda, estructura de H2, preguntas frecuentes, palabras relacionadas, meta descripción y extensión recomendada. El brief se registra en Sheets y queda como borrador en Gmail listo para pasarlo al redactor tras tu revisión. Ojo: la IA no consulta volúmenes de búsqueda reales — valida las keywords en tu herramienta SEO.

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
   - Pestañas: **Briefs SEO** y **Peticiones incompletas**. Cambia el destinatario del borrador.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Webhook keyword | Recibe el POST en `wf-15-keyword-seo` | Nada |
| Normalizar petición | Extrae keyword, público y objetivo con valores por defecto | Los valores por defecto |
| Responder recepción | Confirma la recepción | Nada |
| ¿Trae keyword? | Rechaza peticiones sin keyword | Nada |
| Generar brief con IA | claude-opus-5 devuelve el brief estructurado en JSON | El prompt: añade tu guía de estilo |
| Interpretar brief | Parsea el JSON | Nada |
| Registrar brief | Fila en Briefs SEO, estado "pendiente de revisión" | El ID del documento |
| Borrador para redactor | Borrador en Gmail con el brief formateado | El destinatario |
| Registrar incompleta | Peticiones sin keyword | Nada |

## Pruébalo

1. **Normal**
   ```bash
   curl -X POST https://TU-N8N/webhook-test/wf-15-keyword-seo -H "Content-Type: application/json" \
     -d '{"keyword":"automatizar facturas pyme","publico":"gerentes de pymes","objetivo":"captar leads"}'
   ```
   Debes ver: fila en Briefs SEO y borrador en Gmail con H2, FAQs y meta descripción.
2. **Incompleto**
   Sin `keyword`. Debes ver: fila en **Peticiones incompletas**.
3. **Duplicado**
   La misma keyword dos veces → dos briefs distintos (la IA varía). Compara y quédate con el mejor; borra el otro de la hoja.
4. **Extremo**
   Keyword de 200 caracteres tipo frase entera. Debes ver: funciona, pero el brief pierde foco — usa keywords de 2-6 palabras.

## Errores típicos

- **Meta descripción de más de 155 caracteres** → la IA a veces se pasa: el redactor la recorta; o añade al prompt "cuenta los caracteres".
- **Brief con datos de volumen** → si aparecen números de búsquedas, son inventados: el prompt lo prohíbe, pero verifica siempre.
- **H2 repetidos entre briefs** → keywords muy parecidas dan estructuras parecidas: fusiona artículos en vez de canibalizarte.
- **El borrador no llega al redactor** → los borradores se quedan en TU cuenta de Gmail: envíalo tú tras revisar.

## Coste estimado

Por 100 briefs: ~500 tokens de entrada + 800 de salida ≈ **~2,25 USD** con claude-opus-5. Gmail/Sheets: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Sin datos personales en juego (keywords y contenido). Único aviso: no copies briefs ni estructuras de competidores con scraping no autorizado, y revisa que el contenido final no plagie fuentes.
