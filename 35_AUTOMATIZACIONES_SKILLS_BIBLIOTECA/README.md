# Biblioteca 40x de automatizaciones, workflows y skills

Esta carpeta anade 40 workflows n8n, 40 automatizaciones con codigo y 40 skills/procesos para usar en la formacion.

## Fuentes de inspiracion revisadas

- n8n community workflows: https://n8n.io/workflows/
- n8n workflow collections: https://github.com/zie619/n8n-workflows
- awesome n8n templates: https://github.com/enescingoz/awesome-n8n-templates
- awesome agent skills: https://github.com/heilcheng/awesome-agent-skills
- engineering agent skills: https://github.com/addyosmani/agent-skills
- GitSkills dataset research: https://arxiv.org/abs/2608.10906

## Bloques

| Bloque | Contenido |
|---|---|
| [[workflows_n8n_40/README]] | 40 workflows n8n importables + docs |
| [[automatizaciones_codigo_40/README]] | 40 scripts/plantillas de automatizacion |
| [[skills_40/README]] | 40 skills instruction-only |

## Regla

Todo debe probarse con datos ficticios, caso roto, logs/evidencia y rollback antes de llevarlo a un cliente.

<!-- IMPLEMENTACION_DETALLADA_2026_08_18 -->

# Como implementar esta biblioteca

Para usar esta biblioteca en clase, no basta con mostrar listas. El profesor debe elegir una automatizacion, abrir su documentacion, preparar un payload ficticio, ejecutar el caso feliz, provocar un caso roto y pedir al alumno una defensa.

## Orden recomendado

1. Elegir objetivo: ventas, soporte, RAG, DevOps, contenido, legal o educacion.
2. Elegir workflow n8n si el alumno necesita visualizar procesos.
3. Elegir script si el alumno necesita automatizacion reproducible con codigo.
4. Elegir skill si el alumno necesita criterio reusable para un agente.
5. Conectar los tres si el alumno esta en nivel avanzado.

## Entregable final

Un pack con workflow, script, skill, dataset, caso roto, solucionario y defensa de 3 minutos.

<!-- IMPLEMENTACION_AMPLIADA_PROCESO_2026_08_18 -->

## Implementacion operativa ampliada

### 1. Problema que resuelve

**Biblioteca Completa 40x** resuelve un problema recurrente: convertir una tarea manual, ambigua o repetitiva en un proceso que pueda ejecutarse con el mismo criterio cada vez. En formacion, esta pieza sirve para que el alumno deje de pensar en "usar IA" como una conversacion suelta y empiece a pensar en sistemas: entrada, validacion, transformacion, salida, evidencia, revision y mejora.

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
