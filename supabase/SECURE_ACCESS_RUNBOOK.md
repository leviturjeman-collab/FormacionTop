# Despliegue de acceso seguro y recuperación

Este procedimiento acompaña la migración `20260905160000_verified_sessions_and_progress.sql`. El cambio de código no aplica SQL remoto. No publiques la nueva interfaz antes de preparar el backend: falla de forma cerrada si sus funciones no existen.

## Preparación y validación local

1. Ejecutar `npm ci`, `node scripts/test-auth.mjs`, `node scripts/test-store.mjs`, `node scripts/test-session-server.mjs`, `node scripts/test-session-client.mjs`, `npx tsc -p tsconfig.server.json` y la suite general. Las pruebas SQL usan PostgreSQL local en WASM/PGlite con pgcrypto; no usan `.env.local` ni conectan con Supabase real.
2. Crear un entorno Supabase de ensayo sin alumnos reales. Hacer backup verificable del proyecto de destino, incluidos esquema, datos, políticas, funciones y roles; ensayar su restauración en otro entorno.
3. Revisar todas las migraciones pendientes y aplicarlas en orden dentro de una ventana de mantenimiento. La última revoca el acceso anónimo a funciones antiguas y tablas, elimina el hash administrativo predeterminado y borra copias visibles de PIN. Las cuentas legacy se importan deshabilitadas, conservando sus perfiles y progreso remoto; requieren restablecer credencial antes de entrar.
4. Si existía una columna legacy `learners.pin` con vistas dependientes, revisar esas dependencias antes de migrar. La migración no usa CASCADE para no destruirlas silenciosamente; puede bloquearse y debe corregirse el plan de transición. No omitir la revocación de las funciones antiguas.

## Crear el primer administrador

La aplicación no incluye una contraseña administrativa predeterminada. Desde una conexión administrativa del servidor, ejecutar una consulta parametrizada equivalente a:

```sql
insert into public.academy_accounts(login, display_name, role, secret_hash)
values ($1, $2, 'admin', extensions.crypt($3, extensions.gen_salt('bf', 10)));
```

- `$1`: identificador único en minúsculas de 3–120 caracteres, letras ASCII, números, punto, guion, guion bajo o arroba.
- `$2`: nombre del administrador.
- `$3`: secreto aleatorio individual, por ejemplo 32 caracteres hexadecimales generados criptográficamente; mínimo 10 caracteres, máximo 72 bytes UTF-8 por el límite de bcrypt. Guardarlo en un gestor de contraseñas, fuera del repositorio y del historial de terminal. No ejecutar un ejemplo con un secreto literal compartido.

Cada profesor con funciones administrativas debe tener una cuenta individual. El cambio de vista «profesor» no otorga privilegios. No conceder acceso SQL ni claves service-role al navegador.

Para rotar un secreto administrativo, desde servidor: actualizar `secret_hash` con la misma función y borrar sus filas de `academy_sessions` en la misma transacción. La UI permite restablecer alumnos, no administradores.

## Variables y protección del contenido

- Frontend: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` son configuración pública.
- Vercel servidor: `SUPABASE_URL` y `SUPABASE_ANON_KEY`; existe fallback a sus variantes VITE para despliegues existentes. Nunca hace falta una service-role key para middleware.
- `/api/session` verifica el token opaco y crea cookie `__Host-academia-session`, HttpOnly, Secure, SameSite=Lax, sin Domain. Solo acepta solicitudes del mismo origen. No imprime tokens ni envs.
- `middleware.ts` verifica cada petición a `/course*` y `/generated/*` contra `academy_authorize`, antes del contenido estático. Devuelve 401 si falta/caduca la sesión, 503 si el servicio no se puede verificar y desactiva caché compartida/cliente en contenido privado.
- El frontend instala esa cookie solo en build de producción. `vite dev` y `vite preview` no ejecutan las funciones de Vercel: son herramientas locales, no servidores privados de producción. Para probar la distribución completa usar entorno preview real de Vercel o su emulador con backend de ensayo.
- Proteger también los dominios de preview y distribuciones anteriores: no mantener un deployment viejo accesible con archivos públicos de curso. El middleware nuevo no puede proteger URLs de deployments antiguos.

## Prueba de aceptación en ensayo

1. Visitante sin sesión: Inicio muestra acceso, presentaciones no abren el curso, `/course.json`, manifiestos/shards y una descarga de `/generated/` devuelven 401.
2. Login de administrador: cookie con los atributos indicados; crear dos alumnos con identificadores distintos; la clave inicial solo se muestra durante entrega, no en listado/exportación/localStorage.
3. Alumno A: registrar notas, proyectos, prompts y evidencias; salir; entrar desde otro equipo; comprobar recuperación. Alumno B no recibe ningún registro de A y sus llamadas administrativas fallan.
4. Dos equipos editan campos distintos: se fusionan. Editan el mismo campo: aparece conflicto y ninguna versión se sobrescribe automáticamente. Exportar copia antes de decidir reemplazar.
5. Suspender, archivar y restablecer clave invalidan sesiones previas; la siguiente petición de contenido también se rechaza. Reactivar conserva el trabajo.
6. Simular desconexión y cuota agotada; comprobar feedback, exportación de emergencia y recuperación. El portal no debe afirmar sincronizado sin confirmación remota.
7. Login incorrecto seis veces para un identificador de ensayo: la sexta petición se limita; repetir tras la ventana de 15 minutos. Añadir límites de tráfico por IP en infraestructura para frenar peticiones distribuidas/identificadores aleatorios: el límite implementado en SQL es por identificador, no por IP.
8. Comprobar que `anon` y `authenticated` no pueden leer tablas directamente ni invocar `is_admin_pin`, `verify_learner_pin`, `list_learners_admin`, `create_learner_with_pin` o `delete_learner_admin`.
9. Revisar respuesta de caché/CDN y acceso con cookie inválida después de una respuesta autenticada. Ninguna respuesta privada debe reutilizarse para visitantes.

## Operación y recuperación

Sesiones de 8 horas, verificadas periódicamente en cliente y en cada RPC/petición protegida. El frontend usa sessionStorage para restaurar solo la pestaña actual; el token del servidor se guarda exclusivamente hasheado. El logout elimina la identidad activa y conserva la copia de trabajo por usuario, sin conservar fichas administrativas.

`academy_progress` utiliza versión CAS para impedir sobrescrituras desde equipos antiguos. Mantener backups/versiones de base de datos de acuerdo con la política de la academia; definir retención y ensayar recuperación periódica. `academy_audit` conserva IDs del actor y recurso aunque el recurso deje de existir. Evitar registrar credenciales, evidencias completas o datos de clientes en logs generales.

Las copias locales v1 no se asignan automáticamente a una cuenta: se ofrecen para descarga/importación explícita porque podrían pertenecer a otra persona del mismo navegador. Una copia JSON v2 incluye trabajo, no identidad ni sesión. Ante conflicto, exportar ambas versiones antes de resolverlo.

Para retirar los datos de un alumno de forma definitiva, usar un procedimiento administrativo controlado y un backup según retención. La interfaz archiva; no ofrece borrado irreversible con un solo clic. No retroceder a funciones antiguas de PIN como rollback: restaurar una versión segura del esquema y mantener el acceso cerrado mientras se recupera.

Referencias verificadas para implementación: [Vercel Routing Middleware API](https://vercel.com/docs/routing-middleware/api), [PGlite extensions: pgcrypto](https://pglite.dev/extensions/), [PostgreSQL pgcrypto](https://www.postgresql.org/docs/16/pgcrypto.html).

## Consultas y respuestas de soporte

La migración `20260905170000_support_requests.sql` añade consultas privadas por cuenta y respuestas con historial. Aplicarla en ensayo después de la migración de sesiones y antes de habilitar el formulario FAQ. La cola del administrador se carga explícitamente y no envía correo ni mensajes a proveedores externos. Un alumno solo puede ver sus propias consultas; únicamente el rol administrador verificado puede responder. La cola conserva respuestas anteriores y limita a 100 consultas no cerradas por cuenta. Incluir estas tablas en backup/retención y probar dos alumnos aislados y la respuesta desde Administración.
