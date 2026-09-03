# 19 · Insights semanales de reseñas de clientes

## Qué hace

Cada lunes a las 08:00 lee las reseñas nuevas (procesada = no) de tu hoja, se las pasa en lote a la IA y extrae: nota media percibida, temas que gustan, temas que duelen, alertas de problemas graves y una acción recomendada. El informe queda en la pestaña "Insights" y se envía por email al equipo. Es análisis interno: no responde a ningún cliente.

## Antes de empezar

- Una cuenta de **n8n**: n8n Cloud (de pago, con prueba gratuita) o **self-hosted gratis** (Docker en tu servidor).
- **API de Anthropic**: de pago por tokens (céntimos por ejecución en este flujo). También puedes apuntar el nodo HTTP a la API de OpenAI si lo prefieres.
- **Google Sheets/Gmail/Calendar**: gratis con tu cuenta de Google.

## Credenciales paso a paso

### Google Sheets (OAuth2) — gratis con cuenta de Google
1. En n8n: **Credentials > New > Google Sheets OAuth2 API**.
2. En n8n Cloud basta con pulsar **Sign in with Google** y autorizar tu cuenta.
3. En n8n self-hosted, antes crea un proyecto en [console.cloud.google.com](https://console.cloud.google.com), activa la **Google Sheets API**, crea un **OAuth Client ID** (tipo Web) y pega la Redirect URI que te muestra n8n; después copia Client ID y Client Secret en la credencial y haz el Sign in.
4. Crea una hoja de cálculo nueva, copia el ID que hay en su URL (entre `/d/` y `/edit`) y pégalo en los nodos donde pone `REEMPLAZAR_ID_DOCUMENTO`.

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

## Cómo importar

1. En n8n ve a **Workflows > ⋯ > Import from File** (o *Import from Clipboard* y pega el contenido del JSON).
2. Al abrirse el lienzo verás nodos con un triángulo de aviso: son los que salen "en gris" porque les falta credencial. Abre cada uno y selecciona la credencial que creaste en el paso anterior.
3. Sustituye todos los valores `REEMPLAZAR...` (ID de la hoja, canal, chat, email...).
   - Pestaña **Resenas** (sin ñ) con columnas: fecha, producto, estrellas, texto, procesada (si|no). Pestaña **Insights**. Cambia el destinatario del informe. Tras revisar cada tanda, marca procesada = si.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Lunes a las 8 | Disparador semanal | Día y hora |
| Leer reseñas nuevas | Lee Resenas filtrando procesada = no | El ID del documento |
| Agrupar reseñas | Junta hasta 100 reseñas en un item (recorta cada una a 500 caracteres) | Los límites |
| ¿Hay reseñas? | Sin reseñas nuevas, fin silencioso | Nada |
| Extraer insights | claude-opus-5 devuelve los insights en JSON | El prompt (p. ej. pedir comparativa entre productos) |
| Interpretar insights | Parsea el JSON | Nada |
| Registrar insights | Fila en Insights con el informe de la semana | Nada |
| Informe al equipo | Email interno con el informe formateado | El destinatario |
| Sin reseñas nuevas | Fin silencioso | Nada |

## Pruébalo

1. **Normal**
   Añade 5 reseñas variadas con procesada = no y ejecuta. Debes ver: fila en Insights y el email con temas positivos/negativos y acción recomendada.
2. **Incompleto**
   Una reseña con texto vacío. Debes ver: se ignora (el código la filtra); el resto se analiza igual.
3. **Duplicado**
   Ejecuta dos veces sin marcar procesada = si. Debes ver: el mismo análisis dos veces — la columna procesada es tu control; márcala tras revisar.
4. **Extremo**
   Mete una reseña que diga "me dio una descarga eléctrica". Debes ver: aparece en "alertas" del informe — ese tipo de cosa exige acción inmediata, no esperar al lunes.

## Errores típicos

- **Analiza reseñas viejas** → no marcaste procesada = si en la tanda anterior.
- **El filtro no encuentra filas** → la columna se llama distinto (mayúsculas cuentan): debe ser exactamente "procesada" con valores si/no.
- **Más de 100 reseñas por semana** → solo se analizan las 100 primeras: ejecuta dos veces o sube el límite (más tokens).
- **Alertas vacías con reseñas terribles** → reseñas larguísimas recortadas a 500 caracteres pueden perder el detalle: sube el recorte.

## Coste estimado

Por 100 ejecuciones (semanas) con ~50 reseñas por tanda: ~6.000 tokens de entrada + 400 de salida por ejecución ≈ **~4,00 USD** con claude-opus-5. Gmail/Sheets: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Las reseñas públicas siguen siendo datos personales si identifican al autor: en el informe interno trabaja con temas agregados (así lo pide el prompt) y evita difundir nombres. Si extraes reseñas de plataformas de terceros, respeta sus términos de uso.
