# 16 · Pipeline de guion de vídeo con IA

## Qué hace

Recibe una idea de vídeo por webhook (tema, duración, tono) y trabaja en dos pasos de IA encadenados: primero crea la escaleta (gancho + secciones con tiempos) y después, con esa escaleta como guía, escribe el guion completo con indicaciones de plano. El guion se registra en Sheets y queda como borrador en Gmail para que lo apruebes antes de grabar. Dos llamadas pequeñas dan mejor resultado que una gigante: eso es un pipeline.

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
   - Pestañas: **Guiones** e **Ideas incompletas**. Cambia el destinatario del borrador.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Webhook idea | Recibe el POST en `wf-16-idea-video` | Nada |
| Normalizar idea | Extrae tema, duración (por defecto 5 min) y tono | Los valores por defecto |
| Responder recepción | Confirma la recepción | Nada |
| ¿Trae tema? | Rechaza ideas sin tema | Nada |
| Crear escaleta | Primera llamada: gancho + secciones con segundos | El prompt de escaleta |
| Interpretar escaleta | Parsea el JSON de la escaleta | Nada |
| Escribir guion completo | Segunda llamada: guion completo siguiendo la escaleta | El prompt de guion (estilo, muletillas...) |
| Extraer guion | Junta escaleta y guion en un item | Nada |
| Registrar guion | Fila en Guiones, estado "pendiente de aprobación" | El ID del documento |
| Borrador de guion | Borrador en Gmail con gancho y guion completo | El destinatario |
| Registrar incompleta | Ideas sin tema | Nada |

## Pruébalo

1. **Normal**
   ```bash
   curl -X POST https://TU-N8N/webhook-test/wf-16-idea-video -H "Content-Type: application/json" \
     -d '{"tema":"3 automatizaciones n8n para tu tienda online","duracion_min":7,"tono":"energico y directo"}'
   ```
   Debes ver: fila en Guiones y borrador en Gmail con gancho + guion con [indicaciones de plano].
2. **Incompleto**
   Sin `tema`. Debes ver: fila en **Ideas incompletas**; no se gasta ni un token.
3. **Duplicado**
   El mismo tema dos veces → dos guiones diferentes. Aprovecha: compara enfoques y quédate con el mejor.
4. **Extremo**
   `duracion_min: 60`. Debes ver: el guion sale largo y puede cortarse en max_tokens (4096) — para formatos largos divide el tema en capítulos.

## Errores típicos

- **El guion ignora la escaleta** → raro, pero pasa: revisa que "Interpretar escaleta" haya parseado bien (mira ia_texto_bruto).
- **Se corta a mitad** → sube max_tokens del nodo "Escribir guion completo" (coste proporcional).
- **Suena a robot** → dale ejemplos de tu estilo real en el prompt: 2-3 frases tuyas hacen milagros.
- **Timeout HTTP** → la segunda llamada es larga: sube el timeout en Options del nodo.

## Coste estimado

Por 100 vídeos: dos llamadas por vídeo, ~1.000 tokens de entrada + 2.500 de salida en total ≈ 0,50 + 6,25 = **~6,75 USD** con claude-opus-5. Gmail/Sheets: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

El guion generado puede parecerse a contenido existente: revísalo antes de publicar y no pidas "al estilo de" un creador concreto para monetizar. Si el vídeo menciona marcas o personas, aplica las reglas habituales de derecho al honor e imagen.
