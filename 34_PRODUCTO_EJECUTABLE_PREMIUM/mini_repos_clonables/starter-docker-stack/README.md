# Stack local persistente

Copia `.env.example` a `.env` y genera dos secretos distintos. Ejecuta `docker compose config` y `docker compose up -d`. Los puertos solo escuchan localhost. Los datos sobreviven a recrear contenedores gracias a volúmenes nombrados. No uses `down -v` si quieres conservarlos.

Comprueba `docker compose ps` y Qdrant con cabecera api-key. Antes de almacenar datos reales, prueba pg_dump y restauración en otra base. El despliegue público requiere TLS, controles de red y gestión de secretos.
