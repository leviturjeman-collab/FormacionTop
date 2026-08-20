# 40 workflows n8n para procesos reales

Inspirado por cat?logos p?blicos de workflows n8n y por la librer?a comunitaria oficial. Estos workflows son plantillas did?cticas propias para importar y adaptar.

| ID | Workflow | Categoria | Trigger | Archivo |
|---|---|---|---|---|
| 01 | 01 Lead Qualification CRM | ventas | webhook | `01_lead_qualification_crm.json` |
| 02 | 02 Cold Email Personalizer | ventas | webhook | `02_cold_email_personalizer.json` |
| 03 | 03 Proposal Generator | ventas | webhook | `03_proposal_generator.json` |
| 04 | 04 Invoice OCR Review | finanzas | webhook | `04_invoice_ocr_review.json` |
| 05 | 05 Expense Categorizer | finanzas | webhook | `05_expense_categorizer.json` |
| 06 | 06 Support Ticket Router | soporte | webhook | `06_support_ticket_router.json` |
| 07 | 07 SLA Breach Alert | soporte | webhook | `07_sla_breach_alert.json` |
| 08 | 08 Customer Feedback Sentiment | soporte | webhook | `08_customer_feedback_sentiment.json` |
| 09 | 09 Meeting Notes To Tasks | productividad | webhook | `09_meeting_notes_to_tasks.json` |
| 10 | 10 Calendar Prep Brief | productividad | webhook | `10_calendar_prep_brief.json` |
| 11 | 11 Daily Executive Digest | productividad | cron | `11_daily_executive_digest.json` |
| 12 | 12 Slack Standup Collector | productividad | cron | `12_slack_standup_collector.json` |
| 13 | 13 Content To LinkedIn Posts | contenido | webhook | `13_content_to_linkedin_posts.json` |
| 14 | 14 YouTube Transcript Summarizer | contenido | webhook | `14_youtube_transcript_summarizer.json` |
| 15 | 15 Blog SEO Brief Builder | contenido | webhook | `15_blog_seo_brief_builder.json` |
| 16 | 16 Video Script Pipeline | contenido | webhook | `16_video_script_pipeline.json` |
| 17 | 17 Ecommerce Product Enrichment | ecommerce | webhook | `17_ecommerce_product_enrichment.json` |
| 18 | 18 Abandoned Cart Followup | ecommerce | webhook | `18_abandoned_cart_followup.json` |
| 19 | 19 Review Mining Insights | ecommerce | webhook | `19_review_mining_insights.json` |
| 20 | 20 Competitor Price Watch | ecommerce | cron | `20_competitor_price_watch.json` |
| 21 | 21 RAG Document Ingestion | rag | webhook | `21_rag_document_ingestion.json` |
| 22 | 22 RAG Answer Evaluator | rag | webhook | `22_rag_answer_evaluator.json` |
| 23 | 23 Vector Refresh Scheduler | rag | cron | `23_vector_refresh_scheduler.json` |
| 24 | 24 Consent Checker GDPR | legal | webhook | `24_consent_checker_gdpr.json` |
| 25 | 25 PII Redaction Pipeline | legal | webhook | `25_pii_redaction_pipeline.json` |
| 26 | 26 Contract Clause Extractor | legal | webhook | `26_contract_clause_extractor.json` |
| 27 | 27 GitHub Issue Triage | devops | webhook | `27_github_issue_triage.json` |
| 28 | 28 PR Summary Reviewer | devops | webhook | `28_pr_summary_reviewer.json` |
| 29 | 29 Release Notes Generator | devops | webhook | `29_release_notes_generator.json` |
| 30 | 30 Secret Leak Monitor | devops | cron | `30_secret_leak_monitor.json` |
| 31 | 31 Vercel Deploy Watcher | devops | cron | `31_vercel_deploy_watcher.json` |
| 32 | 32 Database Backup Reminder | infra | cron | `32_database_backup_reminder.json` |
| 33 | 33 API Health Monitor | infra | cron | `33_api_health_monitor.json` |
| 34 | 34 Multi LLM Fallback Router | ai_ops | webhook | `34_multi_llm_fallback_router.json` |
| 35 | 35 Token Cost Guardrail | ai_ops | webhook | `35_token_cost_guardrail.json` |
| 36 | 36 Prompt Regression Eval | ai_ops | webhook | `36_prompt_regression_eval.json` |
| 37 | 37 Human Approval Gate | ai_ops | webhook | `37_human_approval_gate.json` |
| 38 | 38 Browser Research Agent | research | webhook | `38_browser_research_agent.json` |
| 39 | 39 Source Credibility Checker | research | webhook | `39_source_credibility_checker.json` |
| 40 | 40 Student Progress Coach | educacion | webhook | `40_student_progress_coach.json` |

<!-- IMPLEMENTACION_DETALLADA_2026_08_18 -->

# Implementacion detallada - Indice De 40 Workflows N8N

## Para que sirve

Esta automatizacion sirve para convertir un proceso repetible de **biblioteca** en un flujo observable. No esta pensada como magia ni como sustituto de criterio humano: su funcion es recibir una entrada, validarla, aplicar reglas o asistencia IA cuando tenga sentido, producir una salida estructurada y dejar evidencia de lo ocurrido.

En una empresa o proyecto real, este tipo de workflow ayuda a reducir trabajo manual, estandarizar decisiones, evitar olvidos y detectar casos que requieren revision humana. La clave es no automatizar todo desde el primer dia. Primero se automatiza la parte estable: recibir datos, comprobar formato, clasificar, registrar y responder. Despues se agregan integraciones externas, CRM, emails, Slack, bases de datos o modelos LLM.

## Cuando usarla

Usala cuando el proceso cumpla estas condiciones:

- Ocurre varias veces por semana.
- Tiene entradas reconocibles.
- Produce una salida que puede definirse.
- Tiene errores frecuentes que se pueden detectar.
- Se puede probar con datos ficticios.
- No requiere una decision sensible sin revision humana.

No la uses si el proceso cambia cada vez, si depende de informacion privada sin consentimiento, si no hay criterio de exito o si una ejecucion incorrecta puede causar dano financiero, legal o reputacional sin aprobacion.

## Requisitos

- n8n Cloud o n8n self-hosted.
- Conocer la diferencia entre trigger, node, input, output y execution.
- Dataset o payload ficticio.
- Variables de entorno o credenciales separadas.
- Una cuenta de destino si se conecta con CRM, email, Slack, GitHub u otra API.
- Checklist de privacidad si aparecen datos personales.

## Implementacion paso a paso en n8n

1. Importar el JSON del workflow desde esta carpeta.
2. Abrir el workflow en n8n y revisar todos los nodes antes de activarlo.
3. Configurar credenciales ficticias o de prueba.
4. Revisar el trigger: webhook, schedule, manual trigger o evento externo.
5. Abrir cada node y comprobar que entrada espera.
6. Ejecutar con payload correcto.
7. Revisar input/output node por node.
8. Ejecutar con payload roto.
9. Anadir validaciones antes de cualquier accion externa.
10. Anadir aprobacion humana si el workflow envia emails, modifica CRM, publica contenido, crea tickets o toca datos sensibles.
11. Documentar rollback.
12. Activar solo despues de probar preview/caso ficticio.

## Variables y credenciales

Crear `.env.example` o nota de credenciales con nombres, no valores reales:

```bash
N8N_WEBHOOK_URL=replace_me
CRM_API_KEY=replace_me_server_only
SLACK_BOT_TOKEN=replace_me_server_only
OPENAI_API_KEY=replace_me_server_only
DATABASE_URL=replace_me_server_only
```

Nunca guardar claves reales dentro del JSON exportado. Si el workflow se comparte con alumnos, limpiar credenciales y usar placeholders.

## Caso feliz

El caso feliz debe usar un payload completo. Por ejemplo:

```json
{"email":"demo@example.com","need":"automatizar seguimiento","source":"formulario","consent":true}
```

Resultado esperado:

- El workflow se ejecuta sin errores.
- Cada node recibe y devuelve datos comprensibles.
- La salida incluye estado, categoria y siguiente accion.
- No se ejecuta ninguna accion sensible sin control.
- Queda evidencia en executions/logs.

## Caso ambiguo

Payload ambiguo:

```json
{"message":"quiero mejorar ventas"}
```

Resultado profesional esperado: no inventar. El workflow debe marcar `needs_review`, pedir mas datos o enviar a revision humana. Si usa LLM, el prompt debe indicar que no rellene campos desconocidos.

## Caso roto

Ejemplos de ruptura controlada:

- Falta `email`.
- `consent` es `false`.
- La API key es invalida.
- El CRM devuelve `401` o `403`.
- El proveedor devuelve `429`.
- El payload cambia de estructura.
- La tool intenta ejecutar una accion no permitida.

## Reparacion

Documentar:

```markdown
Sintoma:
Causa probable:
Evidencia:
Cambio realizado:
Prevencion:
Rollback:
```

La reparacion minima suele ser anadir un node de validacion, normalizar campos, capturar errores, limitar retries, pedir aprobacion humana o separar mejor credenciales.

## Produccion

Antes de activar en produccion:

- Probar minimo 10 payloads.
- Revisar logs.
- Definir responsable humano.
- Configurar alertas.
- Medir coste si usa LLM.
- Documentar como desactivar el workflow.
- Guardar version exportada.
- Escribir fecha de revision.

## Defensa de 3 minutos

El alumno debe explicar: que problema resuelve, que datos entran, que nodes se ejecutan, que salida produce, que fallo provoco, como lo reparo, que permisos usa y que riesgo queda.

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
