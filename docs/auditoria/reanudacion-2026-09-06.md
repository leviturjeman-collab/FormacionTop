# Cambios retomados — 6 de septiembre de 2026

## Lecciones y navegación

- Las 56 herramientas tienen una ruta de 10 lecciones con URL propia, navegación anterior/siguiente, filtros por necesidad, comprobación y progreso. Son 560 unidades por idioma (español e inglés).
- Codex incorpora un ejercicio continuo escrito para esta ruta: crear, probar, romper, reparar y entregar un validador de huéspedes. Las otras rutas reorganizan las guías existentes y añaden un caso de práctica específico por herramienta o familia; no se presentan como 560 tutoriales independientes escritos desde cero.
- Las referencias y especializaciones anteriores se conservan como ampliaciones. Las automatizaciones y los prompts mantienen sus bibliotecas.
- Guía, lecciones, funciones, prompts, automatizaciones y ampliaciones se abren por separado. Cada palabra del diccionario tiene detalle enlazable. Los kits ya habían quedado publicados como páginas individuales.
- El menú agrupa recursos y ayuda. La ruta principal queda plegada fuera de sus pantallas. Los nuevos recorridos usan tipografía de lectura, pasos numerados y comprobaciones verdes, conservando la identidad de la academia.

## Mi proyecto

- Guardado y eliminación de lecciones de biblioteca, lecciones del programa, unidades de herramienta, términos y kits.
- Biblioteca agrupada por tipo, con enlaces para volver al recurso. El diccionario conserva el idioma del enlace guardado.
- Persistencia en el perfil existente: sincronización, exportación/importación y combinación de cambios entre dispositivos. Guardar un prompt conserva también los demás datos del proyecto.

## Clases y profesores

- Nuevas tablas de profesores, clases y matrículas, protegidas con RLS y sin acceso directo desde el navegador.
- El superadmin puede habilitar como docente un perfil existente, crear clases, asignar profesor e incorporar o retirar alumnos.
- Un docente entra con su PIN y ve exclusivamente sus clases y el número de lecciones marcadas por sus alumnos. No recibe permisos de superadmin, PINs ni notas internas.
- Retirar el permiso docente bloquea las consultas de clases en el servidor inmediatamente. No se han creado profesores reales ni se han cambiado las asignaciones existentes.
- Migración: `20260906160000_classes_and_teachers.sql`.

## Copias pausadas

- El borrador `.temp/restructuracion-pausada.patch` permanece intacto. Las funciones útiles se han implementado sobre la versión actual.
- Se revisaron los 28 archivos de `stash@{0}` del 25 de agosto. Los 69 nombres de prompts de sus ocho archivos siguen presentes. Sus diferencias de extensión de texto no representan prompts perdidos.
- Los cambios históricos de interfaz, tipos, generadores y dependencias permanecen como respaldo; aplicarlos íntegros sobrescribiría arreglos posteriores. El registro por archivo está en `paused-stash-review.json`.

## Automatizaciones externas

Sigue pendiente la ejecución contra las cuentas reales: hace falta identificar un entorno de pruebas conectado. La validación de estructura no demuestra que se haya enviado un mensaje, guardado un registro o ejecutado un servicio externo. Se solicitó ese entorno al usuario; no se han inventado credenciales ni resultados.

## Verificación

- Pruebas de almacén: enlaces seguros, conservación de idioma, exportación/importación y combinación de marcadores de dos dispositivos.
- Navegador: 320, 390 y 1440 píxeles; navegación a detalle, recarga, guardado, progreso y ausencia de desbordamiento horizontal en las pantallas verificadas.
- Contenido: las 56 herramientas tienen exactamente diez unidades con explicación, ejemplo, pasos y comprobación en ES/EN.
- Clases: prueba SQL transaccional con dos profesores y un alumno, sin conservar los datos de prueba; aislamiento, ausencia de duplicados, denegación de PIN, denegación a alumnos y revocación.
- Pruebas reproducibles: `scripts/test-learning-paths.mjs`, `scripts/test-store.mjs`, `scripts/test-classes.sql`, `scripts/test-learning-live.mjs`.

## Referencias de Codex

El acceso desde aplicación, editor o terminal se contrastó con la [guía oficial de inicio](https://learn.chatgpt.com/docs/quickstart). El planteamiento de encargos y revisión se contrastó con la [documentación oficial de prompting](https://learn.chatgpt.com/docs/prompting). El ejercicio y sus casos de prueba son material original de la academia.
