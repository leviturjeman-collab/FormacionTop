# 04 · Extracción de facturas con revisión humana

## Qué hace

Recibe por webhook el texto de una factura (extraído por OCR o copiado del PDF), pide a la IA los campos contables (proveedor, NIF, fecha, base, IVA, total) y comprueba que base + IVA = total. Si la confianza es alta y los importes cuadran, la registra en "Facturas validadas"; si no, va a "Facturas dudosas" y se avisa por email al contable. Nada se contabiliza sin pasar por la hoja.

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
   - Pestañas: **Facturas validadas**, **Facturas dudosas** y **Facturas incompletas**. Cambia el destinatario del nodo "Pedir revisión humana" por el email real de tu contable.
4. Ejecuta primero con **Execute Workflow** (modo test) antes de pulsar **Active**.

## Nodo a nodo

| Nodo | Qué hace | Qué tocar |
|---|---|---|
| Webhook factura | Recibe el POST en `wf-04-factura-recibida` | Nada |
| Normalizar entrada | Lee `body.texto_factura` y `body.archivo`, recorta a 15.000 caracteres | El límite de recorte si tus facturas son enormes |
| Responder recepción | Confirma la recepción | Nada |
| ¿Trae texto de factura? | Rechaza peticiones sin `texto_factura` | Nada |
| Extraer campos con IA | claude-opus-5 devuelve los campos en JSON con un valor de confianza | El prompt si tus facturas tienen campos especiales (IRPF, recargo...) |
| Comprobar totales | Parsea el JSON y calcula si base + IVA = total (tolerancia 2 céntimos) | La tolerancia |
| ¿Fiable y cuadra? | Exige cuadre y confianza >= 0.8 | El umbral de confianza |
| Registrar validada | Fila completa en Facturas validadas | El ID del documento |
| Registrar dudosa | Fila en Facturas dudosas con el motivo | Nada |
| Pedir revisión humana | Email interno al contable avisando de la factura dudosa | El destinatario REEMPLAZAR@tuempresa.com |
| Registrar incompleta | Peticiones sin texto quedan registradas | Nada |

## Pruébalo

1. **Normal**
   ```bash
   curl -X POST https://TU-N8N/webhook-test/wf-04-factura-recibida -H "Content-Type: application/json" \
     -d '{"archivo":"F2026-101.pdf","texto_factura":"FACTURA F2026-101\nProveedor: Papeleria Lopez SL NIF B12345678\nFecha: 2026-08-30\nBase imponible: 100,00 EUR\nIVA 21%: 21,00 EUR\nTOTAL: 121,00 EUR"}'
   ```
   Debes ver: fila en **Facturas validadas** con confianza alta.
2. **Incompleto**
   Sin `texto_factura`. Debes ver: fila en **Facturas incompletas**; ni IA ni email.
3. **Duplicado**
   La misma factura dos veces → dos filas con el mismo numero_factura. Detecta duplicados filtrando la hoja por esa columna antes de contabilizar.
4. **Extremo**
   Cambia el total a 999,99 manteniendo base 100 e IVA 21. Debes ver: va a **Facturas dudosas** con motivo "los importes no cuadran" y llega el email al contable.

## Errores típicos

- **Todo cae en dudosas** → OCR de mala calidad: la confianza baja. Mejora el OCR de origen o baja el umbral a 0.7 sabiendo lo que haces.
- **Números con coma mal parseados** → la IA debe devolver números con punto decimal; si tu OCR mete "1.234,56", dilo en el prompt.
- **El email no llega** → revisa el destinatario y la carpeta de spam; en Gmail API el remitente eres tú mismo.
- **413 o cuerpo truncado** → facturas larguísimas: sube el recorte de 15.000 caracteres con cuidado (más tokens = más coste).

## Coste estimado

Por 100 facturas: ~2.500 tokens de entrada + ~200 de salida ≈ 0,25 M entrada (1,25 USD) + 0,02 M salida (0,50 USD) ≈ **1,75 USD**. Gmail/Sheets: 0 €. Precios orientativos a fecha de redacción: **COMPROBAR EN LA WEB OFICIAL** antes de presupuestar.

## Aviso legal

Las facturas contienen datos fiscales (NIF, nombres): trátalos solo para contabilidad (obligación legal como base) y limita el acceso a la hoja. Si el proveedor es autónomo, su NIF y nombre son datos personales. Conserva las facturas los años que exige Hacienda, pero no las dejes en logs de n8n indefinidamente: activa el borrado de ejecuciones antiguas.
