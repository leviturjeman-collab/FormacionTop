# 07 · Alerta de incumplimiento de SLA por Telegram

## Qué hace

Cada 30 minutos revisa la pestaña "Tickets" y calcula cuántas horas lleva abierto cada ticket. Si un ticket supera su SLA (alta: 4 h, media: 8 h, baja: 24 h), envía una alerta a tu chat o grupo de Telegram con la lista de tickets fuera de plazo y deja constancia en la pestaña "Alertas SLA". No toca al cliente: solo despierta al equipo.

## Antes de empezar

- Una cuenta de **n8n**: n8n Cloud (de pago, con prueba gratuita) o **self-hosted gratis** (Docker en tu servidor).
- **Telegram**: el bot es **GRATIS** — se crea en 1 minuto con @BotFather.
- **Google Sheets/Gmail/Calendar**: gratis con tu cuenta de Google.

## Credenciales paso a paso

### Telegram Bot — GRATIS
1. En Telegram abre **@BotFather** → escribe `/newbot` → dale nombre y usuario → copia el **token**.
2. En n8n: **Credentials > New > Telegram API** → pega el token → guarda como **Telegram Bot**.
3. Escribe cualquier cosa a tu bot (o añádelo a un grupo) y averigua el chat: abre `https://api.telegram.org/bot<TOKEN>/getUpdates` en el navegador y copia `chat.id`, o pregunta a **@userinfobot**.
4. Pega ese número donde pone `REEMPLAZAR_CHAT_ID`.

### Google Sheets (OAuth2) — gratis con cuenta de Google
1. En n8n: **Credentials > New > Google Sheets OAuth2 API**.
2. En n8n Cloud basta con pulsar **Sign in with Google** y autorizar tu cuenta.
3. En n8n self-hosted, antes crea un proyecto en [console.cloud.google.com](https://console.cloud.google.com), activa la **Google Sheets API**, crea un **OAuth Client ID** (tipo Web) y pega la Redirect URI que te muestra n8n; después copia Client ID y Client Secret en la credencial y haz el Sign in.
4. Crea una hoja de cálculo nueva, copia el ID que hay en su URL (entre `/d/` y `/edit`) y pégalo en los nodos donde pone `REEMPLAZAR_ID_DOCUMENTO`.

## Cómo importar

1. En n8n ve a **Workflows > ⋯ > Import from File** (o *Import from Clipboard* y pega el contenido del JSON).
2. Al abrirse el lienzo verás nodos con un triángulo de aviso: son los que salen "en gris" porque les falta credencial. Abre cada uno y selecciona la credencial que creaste en el paso anterior.
3. Sustituye todos los valores `REEMPLAZAR...` (ID de la hoja, canal, chat, email...).
   - Pestaña **Tickets** con columnas: ticket_id, asunto, prioridad (alta|media|baja), creado_en (fecha ISO, p. ej. 2026-09-03T08:00:00Z), estado. Pestaña **Alertas SLA** para el histórico.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Cada 30 minutos | Disparador programado | La frecuencia |
| Leer tickets abiertos | Lee la pestaña Tickets filtrando estado = abierto | El ID del documento |
| Evaluar SLA | Calcula horas abiertas y compara con el límite por prioridad | La tabla SLA_HORAS del código: pon tus SLA reales |
| ¿Hay incumplimientos? | Si no hay ninguno, termina en "Todo en plazo" | Nada |
| Alertar por Telegram | Mensaje con la lista de tickets fuera de plazo | REEMPLAZAR_CHAT_ID |
| Registrar alerta | Fila en Alertas SLA con el detalle en JSON | Nada |
| Todo en plazo | Fin silencioso | Nada |

## Pruébalo

1. **Normal**
   Añade un ticket con prioridad alta y `creado_en` de hace 6 horas, estado abierto. Ejecuta. Debes ver: mensaje de Telegram "1 ticket(s) fuera de plazo" y fila en Alertas SLA.
2. **Incompleto**
   Ticket sin `creado_en` o con fecha ilegible. Debes ver: se ignora sin romper el flujo (el código lo salta).
3. **Duplicado**
   No cierres el ticket y ejecuta otra vez. Debes ver: vuelve a alertar (es un recordatorio cada 30 min a propósito). Si te cansa, añade una columna "alertado" y filtra por ella.
4. **Extremo**
   30 tickets vencidos a la vez. Debes ver: un único mensaje con 30 líneas; Telegram corta mensajes de más de 4.096 caracteres — si te pasa, trocea o resume.

## Errores típicos

- **Telegram: "chat not found"** → el chat ID está mal o el bot no está en ese grupo; escribe primero al bot o añádelo al grupo.
- **No detecta ningún vencido** → las fechas de creado_en no son ISO; usa formato 2026-09-03T08:00:00Z o ajusta el parseo.
- **Alerta tickets ya cerrados** → la columna estado no se actualiza a "cerrado" en tu proceso; el filtro solo lee estado = abierto.
- **Zona horaria descuadrada** → guarda creado_en en UTC o ajusta la zona horaria de n8n.

## Coste estimado

**0 € de APIs**: Telegram y Sheets son gratis. Solo pagas n8n (Cloud desde ~24 €/mes o self-host gratis). Ojo: cada 30 min = ~1.440 ejecuciones/mes, cuenta para el límite de tu plan de n8n Cloud. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Los asuntos de tickets pueden contener datos personales de clientes: manda a Telegram lo mínimo (id, prioridad, horas) y evita volcar el contenido del ticket. Recuerda que Telegram guarda esos mensajes en sus servidores; para datos sensibles usa un canal interno corporativo.
