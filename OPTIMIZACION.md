# Optimización de la experiencia de aprendizaje

## Cambios comprobados

- El inicio conserva su diseño.
- Cinco primeras prácticas completas: ChatGPT, Sheets, Canva, Codex y n8n, con ejemplo, instrucciones, comprobaciones y adaptación propia en español e inglés.
- Paquete ZIP por práctica: instrucciones de inicio, ayuda y archivos. Un fallo de descarga permite volver a intentarlo.
- Resultado y siguiente lección al marcar completado, tanto en Programa como en las herramientas. La marca recoge la confirmación del alumno.
- Tabla visual en el ejemplo de Sheets y demostración oficial ampliable de n8n, cargada solo al abrirla.
- Cada herramienta carga la lección seleccionada. El módulo antiguo de lecciones se descarga solo si hace falta.
- 34 páginas antiguas de módulo o navegación actualizadas en ambos idiomas. Se retiran analogías generadas que no estaban vinculadas al contenido original.

## Tamaño del contenido descargado

Datos comprimidos con gzip de la herramienta y su primera lección. No incluye el índice general, fuentes, JavaScript ni autenticación. La compresión que entregue el servidor puede ser distinta.

| Herramienta | Antes | Después | Reducción aproximada |
| --- | ---: | ---: | ---: |
| n8n | 53.8 KB | 31.2 KB | 42 % |
| Codex | 18.5 KB | 12.5 KB | 32 % |
| Canva | 18.7 KB | 13.0 KB | 30 % |
| Sheets | 32.9 KB | 23.7 KB | 28 % |
| ChatGPT | 29.7 KB | 27.0 KB | 9 % |

El archivo JavaScript de las páginas de herramientas pasa de aproximadamente 191 KB a 46 KB sin comprimir; el contenido antiguo queda en un archivo separado que no se necesita para las lecciones actuales.

## Lo que todavía necesita trabajo

- 399 referencias originales conservan su contenido y requieren una revisión editorial completa. En inglés se identifica cuándo una referencia sigue en español y se ofrece la práctica guiada actual.
- Se descartó una prueba de traducción automática porque alteraba términos y omitía partes del contenido. Sus resultados no se incorporan al curso.
- No se han realizado sesiones con alumnos reales. El protocolo y la hoja de observación están en PRUEBA_CON_ALUMNOS.md, en español e inglés.
- Las pruebas de código y de la web no demuestran que todas las conexiones funcionen en cuentas externas de alumnos.

## Cómo volver a comprobarlo

Ejecutar `npm test` y, con la web de desarrollo abierta en el puerto 4182, `npm run test:optimization`. El inventario de las 433 referencias se guarda en `audit-output/learner-content.json`.
