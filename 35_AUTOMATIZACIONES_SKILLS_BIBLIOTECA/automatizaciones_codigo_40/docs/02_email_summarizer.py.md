# Email summarizer: resumen y acciones desde Python

## Qué vas a construir

Un script que recibe un email en JSON y devuelve cuatro cosas que se pueden comprobar: un resumen breve, las acciones detectadas, el número de acciones y una señal para revisión humana. El código real está en `../02_email_summarizer.py` y la lección lo muestra completo para que puedas copiarlo y descargarlo.

La primera versión funciona sin API ni instalación externa. Esto es importante: puedes aprender el recorrido entero y comprobar los errores antes de conectar un modelo o datos reales. Después podrás sustituir únicamente la función que crea el resumen, sin cambiar el formato de entrada ni el contrato de salida.

## Qué entra

El programa acepta un objeto JSON. `body` es obligatorio; `id`, `sender` y `subject` son opcionales y tienen valores por defecto.

```json
{
  "id": "demo-001",
  "sender": "ana@ejemplo.com",
  "subject": "Entrega del proyecto",
  "body": "La primera version esta lista. Accion: confirmar la fecha de entrega."
}
```

No pegues emails reales de clientes en una prueba de clase. Usa textos ficticios y comprueba qué información queda guardada en la salida.

## Qué sale

Cuando la entrada es válida, el resultado tiene `status: "processed"`, un `summary`, una lista `actions` y `needs_human_review`. Cuando falta `body` o el JSON no es un objeto, el programa devuelve `status: "needs_review"` y explica el problema sin romper el proceso.

La revisión humana se activa cuando no se detecta ninguna acción. El script no inventa tareas para completar una salida vacía. Esa decisión es más importante que conseguir que todos los emails parezcan procesados.

## Ejecutarlo en local

Desde la carpeta que contiene el archivo:

```bash
python 02_email_summarizer.py --demo
```

Para probar tu propio caso:

```bash
echo '{"subject":"Reunión", "body":"Acción: confirmar asistentes antes del jueves."}' | python 02_email_summarizer.py
```

En PowerShell puedes usar:

```powershell
'{"subject":"Reunión", "body":"Acción: confirmar asistentes antes del jueves."}' | python 02_email_summarizer.py
```

## Pruebas obligatorias

Haz estas cuatro pruebas y guarda la salida:

| Caso | Entrada | Resultado esperado |
|---|---|---|
| Normal | `subject` y `body` con una acción | `processed` y una acción en `actions` |
| Sin acción | `body` informativo | `processed` y `needs_human_review: true` |
| Sin body | falta `body` | `needs_review` y `invalid_input` |
| JSON incorrecto | comillas o llaves rotas | `invalid_json` y código de salida 1 |

## Llevarlo a n8n

Importa `email_summarizer.json` desde la biblioteca de workflows. El flujo tiene un Webhook, un nodo Code y una respuesta JSON. El nodo Code replica la misma validación y extracción de acciones del script, así que la versión visual y la versión Python tienen el mismo contrato.

En el Webhook usa método `POST` y envía `Content-Type: application/json`. Primero prueba con el payload ficticio. Solo después conecta Gmail, Outlook u otra fuente. Antes de enviar respuestas, crear tareas o modificar un CRM, añade una aprobación humana y registra el identificador de ejecución.

## Límites y siguiente versión

Esta versión extrae acciones mediante reglas sencillas. No interpreta bien ironías, peticiones implícitas ni varios idiomas. Para una segunda versión puedes llamar a un modelo con una clave guardada en una variable de entorno, exigir una salida JSON validada y comparar el resultado con diez emails de prueba. No cambies el esquema de salida sin actualizar también el workflow y sus pruebas.

## Entrega de la lección

Guarda el archivo Python, el JSON de n8n y las cuatro salidas de prueba. Tu explicación debe responder: qué campo es obligatorio, qué ocurre cuando falta, cómo se detecta una acción, cuándo interviene una persona y qué cambiarías antes de usar emails reales.
