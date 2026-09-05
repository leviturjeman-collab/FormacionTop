# 20 · Vigilancia de precios de la competencia por Telegram

## Qué hace

Cada día a las 09:00 recorre las URLs de productos de la competencia que tengas en la pestaña "Competidores", descarga cada página, extrae un precio único dentro de los marcadores configurados para ese producto (formato 1.234,56 €) y lo compara con el precio anterior guardado. Si hay cambio, te avisa por Telegram con la variación en %; si no consigue leer el precio, también te avisa para que ajustes la regex. Todo queda en "Historico precios". El flujo solo vigila: cambiar tus precios es decisión tuya.

## Antes de empezar

- Una cuenta de **n8n**: n8n Cloud (de pago, con prueba gratuita) o **self-hosted gratis** (Docker en tu servidor).
- **Google Sheets/Gmail/Calendar**: gratis con tu cuenta de Google.
- **Telegram**: el bot es **GRATIS** — se crea en 1 minuto con @BotFather.
- **Scraping**: sin coste, pero respeta robots.txt y los términos de cada web; algunas tiendas bloquean bots.

## Credenciales paso a paso

### Google Sheets (OAuth2) — gratis con cuenta de Google
1. En n8n: **Credentials > New > Google Sheets OAuth2 API**.
2. En n8n Cloud basta con pulsar **Sign in with Google** y autorizar tu cuenta.
3. En n8n self-hosted, antes crea un proyecto en [console.cloud.google.com](https://console.cloud.google.com), activa la **Google Sheets API**, crea un **OAuth Client ID** (tipo Web) y pega la Redirect URI que te muestra n8n; después copia Client ID y Client Secret en la credencial y haz el Sign in.
4. Crea una hoja de cálculo nueva, copia el ID que hay en su URL (entre `/d/` y `/edit`) y pégalo en los nodos donde pone `REEMPLAZAR_ID_DOCUMENTO`.

### Telegram Bot — GRATIS
1. En Telegram abre **@BotFather** → escribe `/newbot` → dale nombre y usuario → copia el **token**.
2. En n8n: **Credentials > New > Telegram API** → pega el token → guarda como **Telegram Bot**.
3. Escribe cualquier cosa a tu bot (o añádelo a un grupo) y averigua el chat: abre `https://api.telegram.org/bot<TOKEN>/getUpdates` en el navegador y copia `chat.id`, o pregunta a **@userinfobot**.
4. Pega ese número donde pone `REEMPLAZAR_CHAT_ID`.

## Cómo importar

1. En n8n ve a **Workflows > ⋯ > Import from File** (o *Import from Clipboard* y pega el contenido del JSON).
2. Al abrirse el lienzo verás nodos con un triángulo de aviso: son los que salen "en gris" porque les falta credencial. Abre cada uno y selecciona la credencial que creaste en el paso anterior.
3. Sustituye todos los valores `REEMPLAZAR...` (ID de la hoja, canal, chat, email...).
   - Pestaña **Competidores** con columnas: competidor, producto, url_producto, precio_anterior (número o formato español), selector_inicio, selector_fin, activo (si|no). Pestaña **Historico precios**.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Cada día a las 9 | Disparador diario | La hora o frecuencia |
| Leer competidores | Lee Competidores filtrando activo = si | El ID del documento |
| Descargar página | GET a cada url_producto (respuesta como texto, timeout 15 s) | Añade un header User-Agent en Options si te bloquean |
| Extraer y comparar precio | Exige un único precio entre selector_inicio y selector_fin y lo compara (corre una vez por producto) | La expresión regular: ajústala al HTML de cada tienda |
| ¿Precio leído? | Separa lecturas correctas de fallos | Nada |
| ¿Ha cambiado? | Detecta variaciones de al menos 1 céntimo | El umbral (p. ej. solo avisar si >2%) |
| Avisar cambio de precio | Telegram con antes/ahora y variación % | REEMPLAZAR_CHAT_ID |
| Registrar histórico | Fila por producto y día en Historico precios (haya cambio o no) | Nada |
| Avisar fallo de lectura | Telegram avisando de que la regex no encontró precio | Nada |

## Pruébalo

1. **Normal**
   Añade una fila con una URL real cuyo precio conozcas y precio_anterior distinto al actual. Ejecuta. Debes ver: aviso de Telegram con la variación y fila en Historico precios. Actualiza precio_anterior con el nuevo valor para la próxima comparación.
2. **Incompleto**
   Fila con url_producto que devuelve 404 o sin precio visible en el HTML. Debes ver: aviso "no he podido leer el precio" por Telegram; nada se registra como cambio.
3. **Duplicado**
   La misma URL en dos filas → dos comprobaciones y posibles avisos dobles. Mantén una fila por producto.
4. **Extremo**
   Una página con varios precios (rebaja + original). Debes ver: rechaza como ambiguo. Configura marcadores literales únicos que rodeen solo el precio del producto correcto.

## Errores típicos

- **Siempre "fallo de lectura"** → la tienda renderiza el precio con JavaScript: el GET trae HTML sin precio. Busca el dato en el JSON embebido de la página o usa la API de la tienda si existe.
- **403 al descargar** → bloqueo anti-bot: añade User-Agent de navegador en Options > Headers, baja la frecuencia y valora si esa web permite scraping.
- **Variaciones fantasma** → precio_anterior con coma decimal ("19,90"): usa punto (19.90) en la hoja.
- **Avisos repetidos del mismo cambio** → no actualizaste precio_anterior tras el aviso; hazlo parte de tu rutina o añade un nodo que lo actualice (appendOrUpdate).

## Coste estimado

**0 € de APIs**: Telegram, Sheets y las descargas HTTP son gratis; no hay llamada de IA. Solo el coste de n8n. Con 20 competidores diarios ≈ 600 ejecuciones de nodos HTTP al mes: irrelevante para self-host, cuenta ejecuciones en n8n Cloud. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Los precios públicos no son datos personales, pero el scraping puede infringir los términos de uso de la web: revisa robots.txt, no martillees los servidores (1 vez al día basta) y no uses los datos para acuerdos de precios con competidores — la fijación coordinada de precios es ilegal (derecho de competencia).

## Selector obligatorio
En Competidores añade selector_inicio y selector_fin. Ejemplo de HTML: `<span id="precio-sku123">1.234,56 EUR</span>`; inicio `<span id="precio-sku123">` y fin `</span>`. Debe existir exactamente una apertura y un precio en ese intervalo. Sin selector o ante ambigüedad solo avisa de revisión, sin actualizar la referencia.
