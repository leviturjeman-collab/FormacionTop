# 05 · Categorizador de gastos con IA

## Qué hace

Cada día a las 07:00 lee la pestaña "Gastos" de tu hoja, junta los que aún no tienen categoría y se los pasa en un solo lote a la IA, que asigna a cada uno una categoría contable (software, marketing, viajes...) con un nivel de confianza. El resultado se escribe en "Gastos categorizados" y Slack avisa a finanzas de cuántos hay para revisar. La IA propone; el cierre contable lo decide una persona.

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
   - Pestaña **Gastos** con columnas: id, fecha, concepto, importe, categoria (vacía = pendiente). Pestaña **Gastos categorizados** para el resultado.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Cada día a las 7 | Disparador programado diario | La hora, o cámbialo a semanal |
| Leer gastos | Lee todas las filas de la pestaña Gastos | El ID del documento |
| Agrupar pendientes | Filtra los que no tienen categoría y los junta en un solo item | Nada |
| ¿Hay pendientes? | Si no hay nada que categorizar, termina en "Nada pendiente" | Nada |
| Categorizar con IA | Envía el lote a claude-opus-5 y pide un array JSON {id, categoria, confianza} | La lista de categorías del prompt: pon las de TU plan contable |
| Interpretar categorías | Cruza la respuesta con los gastos originales por id | Nada |
| Registrar categorizados | Una fila por gasto en Gastos categorizados | Nada |
| Componer aviso | Cuenta cuántos quedaron dudosos (confianza < 0.7) | El umbral |
| Resumen a finanzas | Mensaje en Slack con el total y los pendientes de revisar | El canal |
| Nada pendiente | Fin silencioso cuando no hay gastos nuevos | Nada |

## Pruébalo

1. **Normal**
   Pon en la pestaña Gastos 3 filas con concepto ("Figma mensual", "Comida con cliente", "AVE Madrid-Sevilla") y categoría vacía. Pulsa **Execute Workflow**. Debes ver: 3 filas nuevas en Gastos categorizados (software, dietas, viajes) y el aviso en Slack.
2. **Incompleto**
   Añade una fila con concepto vacío. Debes ver: esa fila se ignora (no llega a la IA) y no aparece en el resultado.
3. **Duplicado**
   Ejecuta dos veces seguidas sin marcar categorías en la pestaña Gastos. Debes ver: los mismos gastos categorizados dos veces en la hoja de salida — copia la categoría a la pestaña Gastos (o borra la fila) tras revisar, para que no se reprocesen.
4. **Extremo**
   Mete 200 gastos pendientes. Debes ver: una sola llamada a la IA con todo el lote; si el resultado viene incompleto, los que falten salen como "revisar" con confianza 0.

## Errores típicos

- **Todos salen "revisar"** → la IA no devolvió el array JSON o los id no coinciden: comprueba que la columna id tenga valores únicos.
- **No se ejecuta a las 7** → la zona horaria de n8n no es la tuya: ajústala en Settings del workflow o de la instancia.
- **Filas vacías en la salida** → la pestaña Gastos tiene filas fantasma al final; bórralas.
- **El aviso de Slack no llega** → bot fuera del canal: `/invite @tu-bot`.

## Coste estimado

Por 100 ejecuciones (lotes de ~20 gastos): ~1.500 tokens de entrada + ~600 de salida por lote ≈ **~2,25 USD** con claude-opus-5. Sheets/Slack: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Los gastos pueden revelar datos personales (dietas con nombres, viajes de empleados): minimiza lo que mandas a la IA (concepto e importe bastan) y evita poner nombres de personas en el concepto. Como siempre con proveedores de IA, cúbrelo en tu registro de actividades de tratamiento.
