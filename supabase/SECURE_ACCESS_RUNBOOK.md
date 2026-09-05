# Despliegue de acceso seguro y recuperación

Este procedimiento acompaña la migración `20260905160000_verified_sessions_and_progress.sql`. El cambio de código no aplica SQL remoto. No publiques la nueva interfaz antes de preparar el backend: falla de forma cerrada si sus funciones no existen.

## Preparación y validación local

1. Ejecutar `npm ci`, `node scripts/test-auth.mjs`, `node scripts/test-store.mjs`, `node scripts/test-session-server.mjs`, `node scripts/test-session-client.mjs`, `npx tsc -p tsconfig.server.json` y la suite general. Las pruebas SQL usan PostgreSQL local en WASM/PGlite con pgcrypto; no usan `.env.local` ni conectan con Supabase real.
2. Crear un entorno Supabase de ensayo sin alumnos reales. Hacer backup verificable del proyecto de destino, incluidos esquema, datos, políticas, funciones y roles; ensayar su restauración en otro entorno.
3. Revisar todas las migraciones pendientes y aplicarlas en orden dentro de una ventana de mantenimiento. La última revoca el acceso anónimo a funciones antiguas y tablas, elimina el hash administrativo predeterminado y borra copias visibles de PIN. Las cuentas legacy se importan deshabilitadas, conservando sus perfiles y progreso remoto; requieren restablecer credencial antes de entrar.
4. Si existía una columna legacy `learners.pin` con vistas dependientes, revisar esas dependencias antes de migrar. La migración no usa CASCADE para no destruirlas silenciosamente; puede bloquearse y debe corregirse el plan de transición. No omitir la revocación de las funciones antiguas.

## Acceso de profesor y superadmin

Profesor y superadmin son el mismo acceso operativo en servidor: una cuenta interna de rol `admin` que abre el panel de alumnos y el modo profesor. El código configurado por el propietario es `5555`; no se guarda en el frontend ni en migraciones, solo como hash/digest en base de datos.

Desde una conexión administrativa del servidor, activar o rotar ese acceso con:

```sql
select public.academy_bootstrap_admin('admin', 'Profesor / Superadmin', $1);
```

`$1` es el código recibido por canal privado. En producción actual ese valor es `5555`. La función revoca las sesiones previas de esa cuenta al rotar el código.

Los alumnos se crean desde el panel y reciben códigos propios. Un alumno que entra con su código conserva su trabajo, pero no ve el enlace de profesor/admin y sus RPC administrativas son rechazadas en servidor. El cambio de vista «profesor» solo aparece después de entrar con la cuenta `admin`. No conceder acceso SQL ni claves service-role al navegador.

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

## Acceso con un solo código (migración 180000)

El formulario usa únicamente `academy_sign_in_code(access_code)`. La búsqueda utiliza `academy_accounts.code_digest` con índice único SHA256; después se verifica bcrypt y se aplican las mismas comprobaciones de rol, estado, caducidad y sesión. No se recorren hashes bcrypt de todas las cuentas. El identificador queda como metadato interno y la RPC de dos campos permanece compatible.

Las claves de alumnos creados o restablecidos desde Administración generan el digest en la misma transacción. Un código ya asignado a cualquier cuenta se rechaza; no se comparten códigos entre profesor y alumnos. Los bcrypt anteriores no permiten reconstruir el digest: restablecer esos accesos explícitamente.

Para activar o rotar el código del administrador autorizado, usar exclusivamente conexión SQL privilegiada y parámetros, nunca insertar el valor en una migración, frontend, log o URL:

```sql
select public.academy_bootstrap_admin($1, $2, $3);
```

Los parámetros son identificador interno, nombre visible y código recibido por canal privado. Esta función está revocada a PUBLIC/anon/authenticated, solo el propietario SQL la ejecuta; rotar revoca sesiones previas. No altera una cuenta alumno cuyo identificador coincida. No hay credencial por defecto en el repositorio. La puesta en servicio debe confirmar código administrador, creación de dos alumnos, código de cada alumno y rechazo de RPC/pantalla administrativa desde alumno. El límite por IP sigue siendo responsabilidad del gateway; identificadores desconocidos aleatorios no pueden limitarse por cuenta.

## Preservar códigos de alumnos históricos al migrar

Realizar primero backup privado de base de datos. Antes de la migración 160000 (que elimina `pin_visible`), ejecutar con conexión SQL propietaria. No imprimir la tabla ni incluirla en exportaciones públicas. Si hay códigos ausentes/inválidos/duplicados, abortar antes de modificar el esquema y recuperar/restablecer esos accesos expresamente.

```sql
begin;
create schema if not exists academy_migration_private;
revoke all on schema academy_migration_private from public,anon,authenticated;
create table academy_migration_private.access_backup as
  select id,pin_visible as access_code from public.learners;
revoke all on academy_migration_private.access_backup from public,anon,authenticated;
do $$ begin
  if exists(select 1 from academy_migration_private.access_backup
    where access_code is null or length(access_code)<4 or octet_length(access_code)>72)
    then raise exception 'legacy_codes_need_recovery'; end if;
  if exists(select 1 from academy_migration_private.access_backup
    group by access_code having count(*)>1)
    then raise exception 'legacy_codes_not_unique'; end if;
end $$;
commit;
```

Después de aplicar migraciones hasta 180000, ejecutar esta operación en una sola transacción, enviando los tres parámetros del bootstrap por driver SQL (no sustitución de texto). El código administrador autorizado se proporciona privadamente. El índice único aborta la transacción si el código administrador coincide con el de un alumno. No convertir ese alumno en administrador ni cambiar silenciosamente su código.

```sql
begin;
select public.academy_bootstrap_admin($1,$2,$3);
update public.academy_accounts a set
  secret_hash=extensions.crypt(b.access_code,extensions.gen_salt('bf',10)),
  code_digest=encode(extensions.digest(b.access_code,'sha256'),'hex'),
  enabled=true
from academy_migration_private.access_backup b
where a.learner_id=b.id and a.role='learner';
update public.learners l set pin_hash=a.secret_hash,pin_visible=null
from public.academy_accounts a where a.learner_id=l.id;
do $$ begin
  if exists(select 1 from academy_migration_private.access_backup b
    left join public.academy_accounts a on a.learner_id=b.id
    where a.id is null or a.code_digest is distinct from encode(extensions.digest(b.access_code,'sha256'),'hex'))
    then raise exception 'legacy_code_restore_incomplete'; end if;
end $$;
commit;
```

Los estados pausado/archivado y fechas de caducidad siguen siendo comprobados. La tabla de progreso no se modifica. Verificar los códigos por llamadas parametrizadas sin registrar petición/token/respuesta completa; registrar solo ID/rol/resultado booleano y conteos. Confirmada recuperación y backup, borrar la tabla privada temporal con conexión propietaria. La longitud mínima requerida es cuatro caracteres; generar códigos de alumnos aleatorios largos sigue siendo la opción del panel. El código por sí mismo nunca determina un rol: la búsqueda única lleva a una cuenta y el rol proviene de esa cuenta; las RPC de administración vuelven a comprobarlo en servidor.
