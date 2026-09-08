# Instrucciones del propietario

- Después de modificar este proyecto, comprueba los cambios y publícalos en producción. El propietario autorizó este comportamiento de forma permanente el 8 de septiembre de 2026; no vuelvas a pedir confirmación para el despliegue habitual.
- Guarda los cambios en Git y súbelos al repositorio remoto. Utiliza `npm run deploy:production` para publicar en el proyecto Vercel ya vinculado y verifica el resultado del despliegue.
- Si una prueba necesaria falla o el despliegue queda bloqueado, resuelve el problema cuando sea posible y comunica el estado real. No presentes un cambio local como publicado.
- Para el contenido y el diseño, sigue `docs/ESTILO_EXPLICACIONES.md`: explicaciones sencillas y detalladas con ejemplos concretos como el de Marta, también en automatizaciones y prompts, sin solapamientos.

- El PIN del propietario para entrar como profesor/administrador es el valor fijo ya establecido en `scripts/test-owner-access.mjs`. No cambiarlo, rotarlo, sustituirlo por una variable distinta ni modificar su hash para otro valor. Mantener esta regla en código, migraciones, configuración y despliegues. No afecta a los PIN individuales de alumnos.
- Ejecuta `npm run test:owner:live` antes y después de publicar: debe comprobar el acceso real con ese valor fijo y el rol administrador verificado por el servidor. No elimines ni debilites esta comprobación.

- Hay dos proyectos Vercel de esta web: `formacion-top` recibe los pushes de GitHub y usa `deploy-hfe-exact-sin-relleno` como rama de producción; `formaciontop` es el proyecto vinculado a la CLI y sirve `www.aibylevi.com`. Comprueba ambos destinos al publicar. Un despliegue correcto en uno no acredita el estado del otro. Los pushes a la rama indicada deben aparecer como Production en `formacion-top`; verifica el commit publicado, no solo que exista una versión Ready.
