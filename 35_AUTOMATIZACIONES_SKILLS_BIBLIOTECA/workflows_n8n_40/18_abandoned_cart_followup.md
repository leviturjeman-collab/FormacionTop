# 18 · Seguimiento de carrito abandonado por WhatsApp

## Qué hace

Cada hora lee la pestaña "Carritos" y busca carritos pendientes. Solo son elegibles los que tienen teléfono, consentimiento explícito (consentimiento = si) y llevan entre 1 y 48 horas abandonados. Por cada elegible, Slack pide aprobación humana; solo si alguien pulsa Approve se envía al cliente la **plantilla aprobada de WhatsApp** "recordatorio_carrito". Los descartados y los enviados quedan registrados en Sheets con su motivo.

## Antes de empezar

- Una cuenta de **n8n**: n8n Cloud (de pago, con prueba gratuita) o **self-hosted gratis** (Docker en tu servidor).
- **Google Sheets/Gmail/Calendar**: gratis con tu cuenta de Google.
- **Slack**: gratis (un bot en tu workspace, plan free suficiente).
- **WhatsApp**: requiere **cuenta Meta Business + WhatsApp Business Cloud API con número verificado**. Enviar mensajes tiene coste por conversación y, fuera de la ventana de 24 h, exige **plantillas aprobadas** por Meta.

## Credenciales paso a paso

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

### WhatsApp Business Cloud — requiere cuenta Meta Business (el API tiene coste por conversación)
1. Entra en [developers.facebook.com](https://developers.facebook.com) → **My Apps > Create App** → tipo **Business**.
2. Añade el producto **WhatsApp** a la app. Necesitas una cuenta **Meta Business verificada** y un **número de teléfono propio verificado** (el número de prueba solo sirve para 5 destinatarios de test).
3. En **WhatsApp > API Setup** copia el **Phone Number ID** (va donde pone `REEMPLAZAR_PHONE_NUMBER_ID`).
4. Crea un **token permanente**: Business Settings → **System Users** → crea uno, asígnale la app y genera un token con permisos `whatsapp_business_messaging` y `whatsapp_business_management`.
5. En n8n: **Credentials > New > WhatsApp API** → pega el token de acceso → guarda como **WhatsApp Business Cloud**.

## Cómo importar

1. En n8n ve a **Workflows > ⋯ > Import from File** (o *Import from Clipboard* y pega el contenido del JSON).
2. Al abrirse el lienzo verás nodos con un triángulo de aviso: son los que salen "en gris" porque les falta credencial. Abre cada uno y selecciona la credencial que creaste en el paso anterior.
3. Sustituye todos los valores `REEMPLAZAR...` (ID de la hoja, canal, chat, email...).
   - Pestaña **Carritos** con columnas: carrito_id, cliente, telefono, importe, abandonado_en (ISO), consentimiento (si|no), estado (pendiente|contactado). Pestañas **Carritos descartados** y **Recordatorios enviados**.
   - Crea la plantilla en Meta: WhatsApp Manager → **Message Templates > Create** → nombre `recordatorio_carrito`, idioma `es`, categoría *Marketing* → espera la aprobación de Meta ANTES de activar el flujo.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Cada hora | Disparador horario | La frecuencia |
| Leer carritos pendientes | Lee Carritos filtrando estado = pendiente | El ID del documento |
| Evaluar elegibilidad | Comprueba teléfono, consentimiento y ventana 1-48 h; anota el motivo de descarte | Los umbrales de horas |
| ¿Elegible? | Separa elegibles de descartados | Nada |
| Aprobar recordatorio | Slack sendAndWait: una aprobación por carrito | El canal; añade timeout en Options |
| Recordatorio WhatsApp | Envía la plantilla aprobada "recordatorio_carrito" | REEMPLAZAR_PHONE_NUMBER_ID y el nombre de plantilla si usaste otro |
| Registrar recordatorio | Fila en Recordatorios enviados con "aprobado_por_humano: si" | Nada |
| Registrar descartado | Fila en Carritos descartados con el motivo | Nada |

## Pruébalo

1. **Normal**
   Añade un carrito con tu teléfono de pruebas, consentimiento "si", abandonado_en de hace 2 horas, estado pendiente. Ejecuta. Debes ver: aprobación en Slack → Approve → llega la plantilla a tu WhatsApp → fila en Recordatorios enviados. Marca el carrito como "contactado" en la pestaña Carritos para que no se repita.
2. **Incompleto**
   Carrito sin teléfono. Debes ver: fila en **Carritos descartados** con motivo "sin telefono"; nadie recibe nada.
3. **Duplicado**
   No marques "contactado" y espera a la siguiente hora. Debes ver: vuelve a pedir aprobación — el estado en la hoja ES el control anti-duplicados; actualízalo siempre tras enviar.
4. **Extremo**
   Carrito con consentimiento "si" pero de hace 80 horas. Debes ver: descartado con motivo "demasiado antiguo (>48h)" — mejor un cupón por email que un WhatsApp tardío.

## Errores típicos

- **Error 132001 (template not found)** → la plantilla no existe con ese nombre/idioma exactos o aún no está aprobada: revisa WhatsApp Manager.
- **La plantilla llega sin datos del carrito** → esta versión envía la plantilla sin variables; añade components con parámetros en el nodo WhatsApp si tu plantilla los usa.
- **Nadie aprueba y se acumulan esperas** → pon Limit Wait Time en el nodo de aprobación para que caduquen solas.
- **Envíos a números de prueba fallan** → con el número de test de Meta solo puedes escribir a destinatarios registrados como testers.

## Coste estimado

Por 100 recordatorios: WhatsApp cobra por conversación de marketing (~0,03-0,08 € por mensaje en España según tarifa vigente) ≈ **3-8 €** — **COMPROBAR EN LA WEB OFICIAL de Meta**, cambia por país y por categoría. Sheets/Slack: 0 €. Sin coste de IA (no hay llamada LLM). Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Esto es marketing directo: bajo RGPD/LSSI necesitas **consentimiento previo y demostrable** para contactar por WhatsApp (por eso la columna consentimiento y su registro). WhatsApp además **exige plantillas aprobadas** para mensajes salientes fuera de la ventana de 24 h, como este. Ofrece baja fácil (responder BAJA y actualizar la hoja) y respeta las listas de exclusión.
