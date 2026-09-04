# 32 · Recordatorio de backups de base de datos

## Qué hace

Cada mañana a las 08:00 consulta en Postgres la tabla `backups_log` (donde tu script de backup apunta cada copia correcta) y calcula cuántas horas han pasado desde la última. Si son más de 26 (margen sobre un backup diario) — o si no hay ninguna — registra el aviso en Google Sheets y te manda un recordatorio por Gmail con instrucciones. Insistirá cada mañana hasta que vuelva a haber un backup reciente.

No hace el backup por ti: vigila que el que deberías tener de verdad exista.

## Antes de empezar

- **Gratis**: n8n self-hosted, Supabase/Postgres, Google Sheets y Gmail.
- **De pago**: nada.
- Crea la tabla y haz que tu script de backup inserte una fila al terminar:

```sql
CREATE TABLE backups_log (
  id serial PRIMARY KEY,
  finalizado_en timestamptz NOT NULL,
  resultado text NOT NULL
);
-- tu script, al acabar bien:
INSERT INTO backups_log (finalizado_en, resultado) VALUES (NOW(), 'ok');
```

## Credenciales paso a paso

### Postgres / Supabase

1. Crea un proyecto en https://supabase.com (tiene capa gratuita) y ve a **Settings → Database**. Si tu n8n está en la nube usa los datos del *connection pooler* (puerto 6543); en local sirve el puerto 5432.
2. En n8n: **Credentials → Add credential → Postgres** → rellena Host, Database (`postgres`), User, Password y Port, y pon **SSL** en `require`.
3. En el **SQL Editor** de Supabase ejecuta el `CREATE TABLE` que se indica más abajo antes de ejecutar el flujo.

### Google Sheets (OAuth2)

1. En n8n: **Credentials → Add credential → Google Sheets OAuth2 API**. En n8n Cloud basta con pulsar **Sign in with Google** y aceptar los permisos.
2. Si tu n8n es self-hosted: crea un proyecto en https://console.cloud.google.com, habilita la **Google Sheets API**, configura la pantalla de consentimiento y crea una credencial **ID de cliente OAuth** (aplicación web) usando la *Redirect URI* que te muestra n8n. Copia el Client ID y el Client Secret en la credencial de n8n y conéctate.
3. Crea una hoja de cálculo en https://sheets.google.com y copia su **ID de documento**: es el tramo largo de la URL entre `/d/` y `/edit`.
4. En cada nodo de Google Sheets del flujo, pega ese ID donde pone `REEMPLAZAR_ID_DOCUMENTO` y comprueba que el nombre de la pestaña coincide con el indicado en la guía (créala si no existe; los encabezados se crean solos en el primer append).

### Gmail (OAuth2)

1. En n8n: **Credentials → Add credential → Gmail OAuth2**. En n8n Cloud, **Sign in with Google** y listo.
2. Self-hosted: en el mismo proyecto de Google Cloud de antes, habilita la **Gmail API** y reutiliza el Client ID / Client Secret con la Redirect URI de n8n.
3. Asigna la credencial al nodo de Gmail y sustituye el destinatario `REEMPLAZAR_...@ejemplo.com` por un correo real.

## Cómo importar

1. Descarga `32_database_backup_reminder.json` de esta carpeta.
2. En n8n: **Workflows → Add workflow → ⋯ → Import from File** y elige el JSON.
3. Abre los nodos que salgan con aviso y selecciona en cada uno la credencial que creaste (los bloques de credenciales vienen con id `REEMPLAZAR` a propósito: nunca compartimos claves dentro del JSON).
4. Sustituye todos los valores `REEMPLAZAR_...` (correos, chat_id, ID de la hoja de cálculo...).
5. Pulsa **Execute workflow** para probarlo en modo test
6. Cuando el caso de prueba funcione, activa el flujo (interruptor **Active**). Recuerda: en test la URL del webhook es `/webhook-test/...` y en producción `/webhook/...`.

## Nodo a nodo

- **Cada día a las 08:00 (scheduleTrigger)** — cron `0 8 * * *`.
- **Consultar último backup (postgres)** — SELECT MAX(finalizado_en) de las copias con resultado ok.
- **Evaluar antigüedad (code)** — calcula horas transcurridas; sin filas = "nunca" = atrasado.
- **¿Backup atrasado? (if)** — true si supera las 26 h (edítalo en el code: LIMITE_HORAS).
- **Registrar aviso (googleSheets)** — fila en "Backups" con la antigüedad detectada.
- **Recordatorio por Gmail (gmail)** — correo al responsable con el último backup y el umbral.
- **Backup al día (noOp)** — rama tranquila.

## Pruébalo

Sin webhook: **Execute workflow** para cada caso.

**1. Caso normal (al día)**: inserta `INSERT INTO backups_log (finalizado_en, resultado) VALUES (NOW(), 'ok');` y ejecuta. Espera terminar en "Backup al día".

**2. Caso incompleto (tabla vacía)**: con la tabla recién creada y vacía, ejecuta. Espera aviso con `ultimo_backup: nunca`.

**3. Caso duplicado**: ejecuta dos veces seguidas estando atrasado. Dos correos: es intencionado (insiste hasta que se arregle), pero razona si prefieres deduplicar por día consultando la hoja.

**4. Caso extremo (backup fallido)**: inserta una fila con `resultado = 'error'` de hace una hora. El SELECT la ignora (solo cuenta `ok`): debe seguir avisando. Así se comprueba que un backup fallido no te calla la alarma.

## Errores típicos

- **`relation "backups_log" does not exist`**: falta el CREATE TABLE o estás en otra base de datos.
- **Siempre dice "nunca" aunque hay filas**: las filas no tienen `resultado = 'ok'` exacto, o la zona horaria hace que MAX venga null por permisos: prueba la query en el SQL Editor.
- **El correo llega a horas raras**: la hora del cron usa la zona horaria de n8n (Settings → Timezone), no la de tu ordenador.
- **No insiste al día siguiente**: el flujo no está Active: Execute workflow es solo manual.

## Coste estimado

- **n8n**: gratis si lo alojas tú (self-hosted); n8n Cloud es de pago por suscripción — COMPROBAR EN LA WEB OFICIAL (n8n.io/pricing).
- **Supabase/Postgres**: capa gratuita suficiente para practicar — COMPROBAR EN LA WEB OFICIAL (supabase.com/pricing).
- **Google Sheets / Gmail**: gratis con una cuenta de Google normal dentro de los límites de uso.

Sin coste de IA. Una consulta SQL al día.

## Aviso legal

Material didáctico de la formación: impórtalo, pruébalo con datos ficticios y adáptalo antes de usarlo con datos o sistemas reales. Las salidas de los modelos de IA pueden contener errores: mantén siempre revisión humana antes de cualquier acción irreversible. Revisa los términos de servicio y precios vigentes de cada proveedor (Anthropic, OpenAI, Google, Meta, Slack, GitHub, Vercel, Supabase) antes de usarlos en producción. Si el flujo trata datos personales, necesitas base legal (RGPD), información al interesado y un registro de tratamiento; consulta a tu asesor legal. El autor no se hace responsable del uso que hagas de esta plantilla.
