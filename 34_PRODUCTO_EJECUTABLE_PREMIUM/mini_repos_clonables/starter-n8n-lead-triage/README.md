# Lead triage importable

Importa workflow.json en n8n. Configura las credenciales y los identificadores REEMPLAZAR antes de activar. Envía payload_correcto.json al webhook de prueba con POST JSON; verifica fila en CRM y las ramas descritas en las notas del workflow. Repite con payload_roto.json. El ID lead_id debe mantenerse igual al reintentar; añade deduplicación en el CRM antes de atender entradas reales.
