# Verificación de recursos y fuentes

El registro `public/resource-verification.json` identifica los 70 JSON de agentes y kits ES/EN por SHA-256, fecha, archivo y pruebas estructurales efectivamente ejecutadas. No acredita ejecución en proveedores ni revisión editorial de instrucciones. El panel de cada agente/kit muestra exactamente esos límites, incluidos errores HTTP y recursos sin fuentes asociadas.

## Mantenimiento

1. Después de editar un agente o kit, ejecutar `node scripts/source-check.mjs`. Revisar fallos, diferencias de hash y contenido antes de publicar. La fecha de prueba se conserva solo si los bytes no han cambiado.
2. Ejecutar `node scripts/source-check.mjs --verify` en validación: falla si cambió el contenido, inventario o manifiesto respecto al registro. No usa red.
3. Para revisar disponibilidad documental ejecutar expresamente `node scripts/source-check.mjs --network`. Hace HEAD, timeout de 12 s por página y no sigue redirecciones. Se consultan exclusivamente las seis URLs documentales públicas de la lista explícita; no se descubren enlaces dentro de workflows, no se llaman APIs ni webhooks. Fallos de red o 403 no se reinterpretan como instrucciones incorrectas.
4. Para incorporar una fuente, revisar humanamente URL y propósito, añadirla a `content/source-manifest.json` y a la lista exacta en el script. No aceptar credenciales, parámetros ni destinos de ejecución. Las fuentes actuales son documentación general por herramienta, no citas que prueben todas las instrucciones del recurso.
5. Una redirección queda como `redirect_review`: revisar el destino antes de sustituir la URL. Un HTTP 200 solo significa accesibilidad en la fecha indicada. `instructions.status=not_reviewed` y `externalExecution=not_verified` son estados deliberados; no convertirlos automáticamente en aprobación.
6. Para validar funcionamiento, ejecutar las suites locales pertinentes, luego casos del proyecto en un entorno de pruebas con sus credenciales reales. Conservar versión SHA, entradas anonimizadas, salida esperada/observada, fecha y responsable en Mi proyecto. No incluir secretos en los entregables.

Pruebas del comprobador: `node scripts/test-source-check.mjs` verifica modo offline, límites declarados, detección de cambios y rechazo de endpoints API/parámetros. No se ha creado ninguna tarea programada. Frecuencia recomendada de mantenimiento manual: antes de cada edición del curso o cambio de proveedor; decidir responsable y calendario en la operación del centro.
