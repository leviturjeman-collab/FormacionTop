# 40 automatizaciones con codigo

Coleccion de scripts y plantillas para procesos de ventas, soporte, finanzas, contenido, DevOps, RAG, seguridad y educacion.

| ID | Archivo | Lenguaje | Uso |
|---|---|---|---|
| 01 | `01_lead_scoring.py` | python | Clasifica leads por presupuesto, email y necesidad. |
| 02 | `02_email_summarizer.py` | python | Resume emails y extrae acciones. |
| 03 | `03_invoice_parser.py` | python | Extrae proveedor, importe y fecha de texto factura. |
| 04 | `04_ticket_router.py` | python | Enruta tickets por urgencia. |
| 05 | `05_csv_cleaner.py` | python | Limpia CSV y normaliza headers. |
| 06 | `06_json_schema_guard.py` | python | Valida payloads contra schema. |
| 07 | `07_secret_scanner.py` | python | Detecta posibles API keys. |
| 08 | `08_cost_guard.py` | python | Corta batches por presupuesto. |
| 09 | `09_multi_llm_compare.py` | python | Compara salidas de modelos. |
| 10 | `10_rag_eval.py` | python | Evalua respuestas RAG. |
| 11 | `11_webhook_server.js` | javascript | Servidor webhook minimo. |
| 12 | `12_n8n_code_node_lead.js` | javascript | Code node para n8n lead scoring. |
| 13 | `13_n8n_code_node_redact_pii.js` | javascript | Redacta PII basica. |
| 14 | `14_n8n_code_node_retry.js` | javascript | Calcula backoff. |
| 15 | `15_slugify_titles.js` | javascript | Normaliza titulos. |
| 16 | `16_video_brief.py` | python | Genera briefing de video. |
| 17 | `17_srt_cleaner.py` | python | Limpia subtitulos SRT. |
| 18 | `18_url_reader.py` | python | Convierte URL en texto con reader. |
| 19 | `19_github_issue_template.py` | python | Crea cuerpo de issue. |
| 20 | `20_release_notes.py` | python | Genera release notes desde commits ficticios. |
| 21 | `21_postmortem_template.py` | python | Genera postmortem. |
| 22 | `22_env_example_generator.py` | python | Genera .env.example. |
| 23 | `23_docker_compose_checker.py` | python | Comprueba claves basicas YAML como texto. |
| 24 | `24_playwright_smoke.spec.ts` | typescript | Test smoke Playwright. |
| 25 | `25_vercel_env_check.sh` | shell | Lista comandos de env Vercel. |
| 26 | `26_backup_command.sh` | shell | Backup Postgres ejemplo. |
| 27 | `27_qdrant_health.py` | python | Health check Qdrant. |
| 28 | `28_supabase_sql_seed.sql` | sql | Seed SQL demo. |
| 29 | `29_mcp_permissions.json` | json | Permisos MCP seguros. |
| 30 | `30_human_approval_policy.json` | json | Politica aprobacion humana. |
| 31 | `31_prompt_regression_cases.json` | json | Casos eval prompt. |
| 32 | `32_gdpr_consent_check.py` | python | Comprueba consentimiento. |
| 33 | `33_product_enricher.py` | python | Enriquece productos. |
| 34 | `34_competitor_price_diff.py` | python | Compara precios. |
| 35 | `35_student_progress.py` | python | Calcula progreso alumno. |
| 36 | `36_calendar_brief.py` | python | Brief calendario. |
| 37 | `37_slack_digest.py` | python | Digest Slack ficticio. |
| 38 | `38_browser_task_plan.py` | python | Plan de tarea navegador. |
| 39 | `39_source_checker.py` | python | Checklist credibilidad fuente. |
| 40 | `40_delivery_pack_generator.py` | python | Genera pack entrega cliente. |

## Uso

Cada script debe probarse con datos ficticios, caso roto y explicacion de reparacion.

<!-- IMPLEMENTACION_DETALLADA_2026_08_18 -->

# Implementacion detallada - Indice De 40 Automatizaciones Con Codigo

## Para que sirve

Esta automatizacion con codigo sirve para convertir una operacion concreta en una funcion repetible. Puede usarse sola, dentro de n8n, en un backend, en una CLI, en GitHub Actions o como parte de un mini repo. Su valor no esta en el numero de lineas, sino en que separa entrada, proceso, salida y errores.

## Como implementarla

1. Leer el archivo de codigo y localizar la funcion principal.
2. Crear datos ficticios de entrada.
3. Ejecutar localmente o copiar el bloque en el entorno correspondiente.
4. Confirmar que la salida tiene formato claro.
5. Probar entrada vacia o incompleta.
6. Anadir validacion si falta.
7. Documentar variables necesarias.
8. Integrar con workflow, API o test.

## Requisitos

- Runtime correspondiente: Python, Node.js, shell, SQL o Playwright.
- `.env.example` si usa credenciales.
- Dataset de prueba.
- Criterio de terminado.
- Caso roto documentado.

## Prueba local recomendada

Si es Python:

```bash
python archivo.py
```

Si es JavaScript/Node:

```bash
node archivo.js
```

Si es shell:

```bash
bash archivo.sh
```

Si es SQL, ejecutarlo en una base de prueba, nunca directamente en produccion.

## Caso feliz

Entrada completa, salida estructurada y sin secretos reales. Guardar output como evidencia.

## Caso roto

Entrada vacia, campo ausente, tipo incorrecto, variable no definida o permiso insuficiente.

## Como llevarlo a produccion

- Convertir prints en logs.
- Anadir control de errores.
- Separar secretos.
- Anadir tests.
- Medir coste si llama LLM.
- Definir rollback.
- Documentar propietario.

## Defensa

El alumno debe explicar que automatiza, que input necesita, que output devuelve, como falla y que cambio hizo para hacerlo mas seguro.

<!-- IMPLEMENTACION_AMPLIADA_PROCESO_2026_08_18 -->

## Implementacion operativa ampliada

### 1. Problema que resuelve

**Readme** resuelve un problema recurrente: convertir una tarea manual, ambigua o repetitiva en un proceso que pueda ejecutarse con el mismo criterio cada vez. En formacion, esta pieza sirve para que el alumno deje de pensar en "usar IA" como una conversacion suelta y empiece a pensar en sistemas: entrada, validacion, transformacion, salida, evidencia, revision y mejora.

En un contexto real, esta automatizacion puede ahorrar tiempo, reducir errores, acelerar respuesta a clientes o crear una base de conocimiento operativa. Pero su valor depende de que se implemente con limites. Si se conecta a datos reales sin consentimiento, si ejecuta acciones externas sin aprobacion o si no deja logs, la automatizacion no es profesional aunque funcione en demo.

### 2. Donde encaja en un proceso

El flujo recomendado es:

```text
Entrada -> Validacion -> Normalizacion -> Decision -> Accion -> Registro -> Revision humana si aplica
```

La entrada puede ser un webhook, CSV, formulario, email, ticket, issue, transcripcion, factura o documento. La validacion comprueba que no falten campos. La normalizacion convierte nombres, fechas, importes o textos a formato estable. La decision puede ser una regla, un LLM o una combinacion. La accion puede ser responder, crear tarea, actualizar CRM, enviar alerta o guardar en base de datos. El registro permite auditar. La revision humana protege acciones sensibles.

### 3. Preparacion antes de implementar

Antes de tocar herramientas, crear una ficha:

```markdown
Objetivo:
Usuario:
Entrada:
Salida esperada:
Campos obligatorios:
Datos sensibles:
Herramientas:
Credenciales:
Caso feliz:
Caso ambiguo:
Caso roto:
Rollback:
```

Esta ficha evita improvisar. Tambien ayuda a decidir si conviene hacerlo con n8n, script, API, GitHub Actions, backend, skill o proceso manual. La mejor herramienta es la minima que permite repetir, verificar y explicar.

### 4. Implementacion local

Si esta pieza es codigo, implementarla primero localmente con datos ficticios. No conectar APIs reales hasta comprobar formato.

Pasos:

1. Crear carpeta de prueba.
2. Copiar el archivo o plantilla.
3. Crear `.env.example`.
4. Crear un payload ficticio correcto.
5. Crear un payload roto.
6. Ejecutar la pieza.
7. Guardar output.
8. Anadir manejo de errores.
9. Documentar que variables necesita.
10. Preparar una version para clase.

Ejemplo de payload correcto:

```json
{"id":"demo-001","email":"demo@example.com","need":"automatizar seguimiento","consent":true}
```

Ejemplo de payload roto:

```json
{"need":"automatizar seguimiento"}
```

### 5. Integracion con n8n

Para llevarlo a n8n:

1. Crear Webhook node.
2. Pegar el payload correcto.
3. Anadir Code node o HTTP Request node.
4. Validar campos obligatorios.
5. Si falta algo, devolver `needs_review`.
6. Si esta completo, continuar a la accion.
7. Antes de enviar emails o modificar sistemas, anadir aprobacion humana.
8. Responder con JSON claro.

Salida recomendada:

```json
{
  "status":"processed",
  "category":"demo",
  "next_action":"review_or_send",
  "requires_human_approval":true,
  "evidence":"execution_id_or_log_url"
}
```

### 6. Integracion con API o backend

Si se convierte en endpoint:

- Usar `POST` para entradas que modifican estado.
- Validar JSON antes de procesar.
- No aceptar campos desconocidos sin revisar.
- Registrar `request_id`.
- Devolver errores legibles.
- Separar secretos del frontend.

Ejemplo de respuesta de error:

```json
{"ok":false,"error":"missing_required_field","field":"email","action":"send_to_review"}
```

### 7. Seguridad y permisos

Checklist minimo:

- No usar datos reales en clase.
- No guardar API keys en archivos.
- No publicar `.env`.
- Usar scopes minimos.
- Registrar acciones.
- Anadir aprobacion humana para side effects.
- Preparar rollback.
- Rotar claves si se filtran.

Side effects son acciones que cambian el mundo: enviar email, actualizar CRM, cobrar, borrar, publicar, crear tickets, modificar base de datos o contactar usuarios. Esas acciones requieren mas control que una simple clasificacion.

### 8. Pruebas necesarias

Probar minimo:

| Caso | Entrada | Resultado esperado |
|---|---|---|
| Feliz | payload completo | `processed` |
| Ambiguo | datos incompletos | `needs_review` |
| Roto | formato incorrecto | error controlado |
| Seguridad | dato sensible | redaccion o bloqueo |
| Coste | batch grande | limite o aviso |

Si usa LLM, anadir evals:

```json
{"input":"lead sin email","expected":"pedir email","fail_if":"inventa email"}
```

### 9. Produccion

Antes de produccion:

- Revisar logs.
- Medir coste.
- Probar 10 casos.
- Documentar propietario.
- Preparar alerta.
- Exportar version.
- Definir rollback.
- Crear README de entrega.

Una automatizacion profesional debe poder apagarse sin romper el negocio. Si nadie sabe desactivarla, no esta lista.

### 10. Como explicarlo al alumno

El alumno debe poder responder:

- Que automatiza.
- Que no automatiza.
- Que datos necesita.
- Que herramienta usa.
- Que riesgo evita.
- Que fallo provoco.
- Que evidencia guardo.
- Que haria en version 2.

La defensa no debe sonar teorica. Debe sonar como alguien que ha ejecutado, roto y reparado el proceso.

### 11. Variantes utiles

Variantes para ampliar:

- Version manual en checklist.
- Version n8n visual.
- Version codigo local.
- Version API.
- Version con base de datos.
- Version con LLM.
- Version con aprobacion humana.
- Version con observabilidad.

Cada variante debe mantener el mismo criterio: entrada clara, salida verificable y fallo controlado.
