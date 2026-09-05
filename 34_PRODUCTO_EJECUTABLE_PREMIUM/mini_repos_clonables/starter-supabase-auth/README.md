# Supabase: perfiles privados

Aplica schema.sql en una instancia de pruebas. Crea dos usuarios desde Supabase Auth. Configura entorno del usuario A y ejecuta `node client.mjs`; repite con B. Cada uno debe ver únicamente su perfil. Intenta insertar/update con id ajeno y verifica rechazo por RLS. Nunca uses service_role en el cliente.

El CLI implementa login de usuarios existentes. El alta y la verificación de correo se hacen mediante Supabase Auth; no hay un formulario web implícito.
