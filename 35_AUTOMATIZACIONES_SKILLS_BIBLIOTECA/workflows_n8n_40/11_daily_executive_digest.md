# 11 · Digest diario para dirección por Telegram

## Qué hace

Cada mañana a las 08:00 lee en paralelo dos fuentes: los KPIs de tu hoja de cálculo y un RSS de noticias del sector. Las une, la IA redacta un digest de máximo 12 líneas (KPIs con variación + 3 titulares con el porqué de su relevancia) y lo envía al chat de Telegram de dirección. Cada digest queda archivado en Sheets. Si no hay datos ese día, no envía nada.

## Antes de empezar

- Una cuenta de **n8n**: n8n Cloud (de pago, con prueba gratuita) o **self-hosted gratis** (Docker en tu servidor).
- **API de Anthropic**: de pago por tokens (céntimos por ejecución en este flujo). También puedes apuntar el nodo HTTP a la API de OpenAI si lo prefieres.
- **Google Sheets/Gmail/Calendar**: gratis con tu cuenta de Google.
- **Telegram**: el bot es **GRATIS** — se crea en 1 minuto con @BotFather.

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

### Telegram Bot — GRATIS
1. En Telegram abre **@BotFather** → escribe `/newbot` → dale nombre y usuario → copia el **token**.
2. En n8n: **Credentials > New > Telegram API** → pega el token → guarda como **Telegram Bot**.
3. Escribe cualquier cosa a tu bot (o añádelo a un grupo) y averigua el chat: abre `https://api.telegram.org/bot<TOKEN>/getUpdates` en el navegador y copia `chat.id`, o pregunta a **@userinfobot**.
4. Pega ese número donde pone `REEMPLAZAR_CHAT_ID`.

## Cómo importar

1. En n8n ve a **Workflows > ⋯ > Import from File** (o *Import from Clipboard* y pega el contenido del JSON).
2. Al abrirse el lienzo verás nodos con un triángulo de aviso: son los que salen "en gris" porque les falta credencial. Abre cada uno y selecciona la credencial que creaste en el paso anterior.
3. Sustituye todos los valores `REEMPLAZAR...` (ID de la hoja, canal, chat, email...).
   - Pestaña **KPIs** con columnas: metrica, valor, variacion. Pestaña **Digests** para el histórico. Cambia la URL del RSS por la fuente de tu sector.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Cada día a las 8 | Disparador diario que lanza las dos fuentes en paralelo | La hora |
| Leer KPIs | Lee la pestaña KPIs | El ID del documento |
| Noticias del sector | Lee el RSS de noticias | La URL del feed |
| Unir fuentes | Merge en modo append: junta KPIs y noticias | Nada; conecta aquí fuentes extra |
| Preparar digest | Separa KPIs de noticias (máx. 8 titulares) y monta el contexto | El límite de titulares |
| ¿Hay datos? | Sin datos no hay digest | Nada |
| Redactar digest | claude-opus-5 escribe el digest en texto plano | El prompt: qué le importa a TU dirección |
| Extraer texto | Se queda con el texto de la respuesta | Nada |
| Enviar a dirección | Mensaje de Telegram con el digest | REEMPLAZAR_CHAT_ID |
| Registrar digest | Histórico en la pestaña Digests | Nada |

## Pruébalo

1. **Normal**
   Rellena 3 KPIs (p. ej. "MRR, 12400, +4%") y pulsa **Execute Workflow**. Debes ver: mensaje de Telegram con KPIs y titulares, y fila en Digests.
2. **Incompleto**
   Vacía la pestaña KPIs dejando el RSS. Debes ver: el digest sale solo con noticias (hay datos igualmente); si además el RSS falla, el IF corta y no llega nada.
3. **Duplicado**
   Ejecuta dos veces seguidas. Debes ver: dos mensajes casi idénticos — normal en pruebas; en producción el disparador diario solo corre una vez.
4. **Extremo**
   Pon un feed con 200 entradas. Debes ver: solo se usan las 8 primeras (recorte en "Preparar digest") y el coste no se dispara.

## Errores típicos

- **El RSS da error** → algunos feeds bloquean bots o cambian de URL: prueba la URL en el navegador y cámbiala si redirige.
- **El digest mezcla idiomas** → tu feed es en inglés: pide en el prompt que traduzca los titulares al español.
- **Telegram: "chat not found"** → REEMPLAZAR_CHAT_ID sin sustituir o el bot no está en el grupo de dirección.
- **KPIs ignorados** → las columnas no se llaman exactamente metrica/valor/variacion.

## Coste estimado

Por 100 ejecuciones (100 días): ~1.200 tokens de entrada + 400 de salida ≈ **~1,60 USD** con claude-opus-5. Telegram/Sheets/RSS: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Si los KPIs incluyen datos de clientes o empleados identificables, minimiza: a dirección le valen agregados. Los titulares del RSS son contenido de terceros: enlaza la fuente y no lo republiques fuera del uso interno.
