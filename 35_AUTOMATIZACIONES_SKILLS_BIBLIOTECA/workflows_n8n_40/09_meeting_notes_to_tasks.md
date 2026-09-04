# 09 · Notas de reunión convertidas en tareas

## Qué hace

Recibe por webhook las notas de una reunión (título, notas, asistentes), la IA extrae las tareas acordadas con responsable y fecha límite, y las registra una a una en la pestaña "Tareas" de Google Sheets. Además compone un resumen y lo deja como **borrador en Gmail** para que lo revises y lo envíes tú al equipo. Si algo no quedó claro en las notas, la tarea sale como "sin asignar" en vez de inventarse un responsable.

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
   - Pestañas: **Tareas** y **Notas incompletas**. Cambia el destinatario del borrador (REEMPLAZAR@tuempresa.com).
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Webhook notas | Recibe el POST en `wf-09-notas-reunion` | Nada |
| Normalizar notas | Extrae título, notas (máx. 15.000 caracteres) y asistentes | El límite de recorte |
| Responder recepción | Confirma la recepción | Nada |
| ¿Trae notas? | Rechaza peticiones sin notas | Nada |
| Extraer tareas con IA | claude-opus-5 devuelve un array JSON {tarea, responsable, fecha_limite} | El prompt (p. ej. exigir formato de responsables con @) |
| Trocear en tareas | Convierte el array en un item por tarea, con valores seguros | Nada |
| Registrar tareas | Una fila por tarea, estado "pendiente" | El ID del documento |
| Componer resumen | Junta todas las tareas en un texto para el email | Nada |
| Borrador de resumen | Borrador en Gmail al equipo (no se envía solo) | El destinatario |
| Registrar incompleta | Notas vacías quedan registradas | Nada |

## Pruébalo

1. **Normal**
   ```bash
   curl -X POST https://TU-N8N/webhook-test/wf-09-notas-reunion -H "Content-Type: application/json" \
     -d '{"titulo":"Kickoff web","asistentes":"Ana, Luis","notas":"Ana prepara el wireframe para el viernes. Luis pide presupuesto de hosting. Revisar dominio la semana que viene."}'
   ```
   Debes ver: 3 filas en Tareas (una "sin asignar") y un borrador en Gmail con la lista.
2. **Incompleto**
   Sin `notas`. Debes ver: fila en **Notas incompletas** y ningún borrador.
3. **Duplicado**
   Las mismas notas dos veces → tareas duplicadas en la hoja. Filtra por reunión + tarea y borra las repetidas antes de repartir trabajo.
4. **Extremo**
   Notas de 15.000 caracteres de una reunión de 2 horas. Debes ver: funciona, pero revisa que no se haya perdido nada del final (el recorte corta ahí); sube el límite si te pasa.

## Errores típicos

- **Una sola tarea "REVISAR: la IA no devolvio JSON"** → la respuesta no fue un array; suele arreglarse reformulando notas muy caóticas o reintentando.
- **Responsables inventados** → pasa siempre la lista de asistentes: el prompt prohíbe inventar, pero sin lista la IA no puede asignar bien.
- **Fechas raras** → la IA convierte "el viernes" según su criterio; incluye la fecha de la reunión en las notas para anclar.
- **El borrador llega vacío** → no había tareas; se crea una fila "Sin tareas detectadas" para que lo sepas.

## Coste estimado

Por 100 reuniones: ~2.500 tokens de entrada + 400 de salida ≈ **~2,25 USD** con claude-opus-5. Gmail/Sheets: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Las notas de reunión contienen nombres de empleados y, a veces, valoraciones sobre personas: es tratamiento de datos laborales. Informa al equipo de que las notas se procesan con IA, evita juicios personales en las notas y restringe el acceso a la hoja de Tareas.
