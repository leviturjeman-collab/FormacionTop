# 10 · Briefing previo a las reuniones del día

## Qué hace

Cada mañana a las 07:00 lee tu Google Calendar, recopila las reuniones de hoy (título, hora, asistentes, descripción) y pide a la IA un briefing accionable: objetivo probable de cada reunión, qué preparar y una buena pregunta que llevar. Te lo envía por email a ti mismo y guarda el histórico en Sheets. Si no hay reuniones, no molesta.

## Antes de empezar

- Una cuenta de **n8n**: n8n Cloud (de pago, con prueba gratuita) o **self-hosted gratis** (Docker en tu servidor).
- **API de Anthropic**: de pago por tokens (céntimos por ejecución en este flujo). También puedes apuntar el nodo HTTP a la API de OpenAI si lo prefieres.
- **Google Sheets/Gmail/Calendar**: gratis con tu cuenta de Google.

## Credenciales paso a paso

### Google Calendar (OAuth2) — gratis con cuenta de Google
1. En n8n: **Credentials > New > Google Calendar OAuth2 API** → **Sign in with Google**.
2. En self-hosted, activa la **Google Calendar API** en tu proyecto de Google Cloud.
3. El nodo usa el calendario `primary` (el principal de tu cuenta); cámbialo si usas otro.

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
   - Cambia REEMPLAZAR@tuempresa.com por TU email (el briefing es para ti). Pestaña **Briefings** para el histórico.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Cada día a las 7 | Disparador diario | La hora |
| Eventos de hoy | Lee los eventos de hoy del calendario principal | El calendario si no usas "primary" |
| ¿Hay reuniones? | Si el día está vacío, termina en "Día sin reuniones" | Nada |
| Preparar contexto | Junta todos los eventos en un solo item con lo esencial | Nada |
| Redactar briefing | claude-opus-5 escribe el briefing en texto plano | El prompt: dile quién eres y qué te importa |
| Extraer texto | Se queda con el texto de la respuesta | Nada |
| Enviarme el briefing | Email a ti mismo con el briefing | El destinatario (tú) |
| Registrar briefing | Histórico en la pestaña Briefings | El ID del documento |
| Día sin reuniones | Fin silencioso | Nada |

## Pruébalo

1. **Normal**
   Crea hoy 2 eventos con asistentes y descripción y pulsa **Execute Workflow**. Debes ver: un email con el briefing de ambas reuniones y una fila en Briefings.
2. **Incompleto**
   Un evento sin descripción ni asistentes. Debes ver: el briefing lo incluye igualmente, con menos contexto ("objetivo probable" más genérico).
3. **Duplicado**
   Ejecuta dos veces. Debes ver: dos emails y dos filas iguales — el disparador diario evita esto en producción; no actives dos copias del flujo.
4. **Extremo**
   Un día con 12 reuniones. Debes ver: briefing largo pero completo; si se corta, sube max_tokens (está en 2048) en el nodo "Redactar briefing".

## Errores típicos

- **Sale con reuniones de ayer o mañana** → zona horaria: alinea la de n8n con la del calendario.
- **Calendar devuelve 403** → la credencial no tiene la Calendar API activada en Google Cloud (self-hosted) o autorizaste otra cuenta.
- **Briefing genérico** → tus eventos no tienen descripción; acostúmbrate a poner 1 línea de contexto al crearlos.
- **No llega el email** → sigue puesto REEMPLAZAR@tuempresa.com.

## Coste estimado

Por 100 ejecuciones (días): ~1.200 tokens de entrada + 800 de salida ≈ **~2,60 USD** con claude-opus-5. Calendar/Gmail/Sheets: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Los eventos contienen emails de asistentes (datos personales de terceros). El briefing es para uso propio: no lo redistribuyas, y evita meter en descripciones de calendario datos sensibles que acabarían en el prompt de la IA.
