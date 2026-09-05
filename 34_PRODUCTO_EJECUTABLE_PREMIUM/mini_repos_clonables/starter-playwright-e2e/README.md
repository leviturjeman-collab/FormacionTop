# Prueba E2E con servidor incluido

`npm ci`, `npx playwright install chromium`, `npm test`. Playwright inicia test-server.mjs en localhost4178 y prueba guardar/recargar y rechazo de formulario vacío. El fixture conserva datos en memoria durante la prueba; no es una app de almacenamiento de producción. Sustituye webServer/baseURL para probar tu proyecto real.
