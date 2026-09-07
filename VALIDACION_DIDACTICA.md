# Validación de los casos y materiales · 7 de septiembre de 2026

El recorrido incorpora teoría en lenguaje sencillo, datos de ensayo, una respuesta resuelta, una segunda práctica con pistas y solución, y una guía para adaptarlo al proyecto del alumno. Los datos son ficticios; no representan resultados obtenidos para clientes.

## Cobertura de esta revisión

- 56 herramientas, con 10 manuales cada una, en español e inglés. Las explicaciones de conceptos se comparten cuando varias herramientas trabajan de forma parecida; no se presentan como 560 proyectos independientes.
- 38 lecciones del programa, 35 kits y 15 agentes con casos y materiales de práctica. Los 20 kits originales reciben una respuesta de arranque concreta: tablas, mensajes, reglas o cálculos, según el caso.
- Las 29 lecciones del programa sin cuaderno técnico usan ahora los mismos datos y resultados en la teoría, las tareas, los prompts y el caso descargable.
- Las 25 automatizaciones de n8n tienen tres archivos completos: ejemplo inicial, variación y prueba de dato ausente. Cada archivo explica su resultado esperado.
- El botón «Copiar flujo completo» copia JSON de n8n. Las instrucciones distinguen pegar el flujo en el lienzo, importar un archivo JSON y pegar código dentro de un nodo.

## Ejecuciones reales de n8n

Versión instalada para el ensayo: **2.37.10**, en una base de datos local separada. Se han importado 190 flujos completos y ejecutado 107 pruebas locales: **81 completadas correctamente y 26 detenidas con el error intencionado exacto**. No hubo resultados inesperados en esas ejecuciones. Las 26 pruebas incluyen 25 campos obligatorios ausentes y una hora final anterior a la inicial.

La evidencia está en `content/verification/n8n-runtime.json`. Una huella del contenido de los nodos, conexiones y ajustes relaciona cada archivo con su ejecución. El portal solo muestra la indicación de comprobado cuando esa huella coincide. La prueba automatizada verifica también que modificar el flujo elimina una indicación anterior.

No se ejecutaron conexiones a cuentas externas, envíos de correo, publicaciones ni escrituras en sistemas de alumnos. Importar un flujo con servicios externos no demuestra que sus credenciales, permisos o destinos funcionen. Esas conexiones se deben comprobar en el entorno de uso. Los diez fragmentos antiguos de proyectos se identifican como fragmentos para un flujo existente, no como automatizaciones completas.

## Comprobaciones de la web

- `npm test`: validación del contenido ES/EN, identificación de herramientas, automatizaciones, archivos, sesiones, seguridad, portapapeles, tipos de TypeScript y construcción de producción.
- `node scripts/test-detailed-practices.mjs`: 1.500 instancias de manual ES/EN; correspondencia entre casos, respuestas, prompts, descargas, enlaces de lección y 230 referencias a archivos ejecutados. Comprueba que el material detallado no se incluya en el índice inicial.
- `node scripts/test-practice-labs-ui.mjs`: programa, kit, n8n, Make, agente y automatización en ambos idiomas; soluciones cerradas al entrar, pistas desplegables, descargas reales, los tres JSON correctos en el portapapeles, lectura a 390 píxeles y ausencia de errores JavaScript.
- Auditoría de 76 enlaces de documentación: se corrigieron tres páginas desaparecidas de Airtable, Notion y Zapier. El segundo recorrido detectó 69 respuestas accesibles, cero páginas desaparecidas y siete respuestas 403. La consulta web adicional pudo leer las dos páginas de OpenAI, las dos de Midjourney y las dos de Runway. La colección de Perplexity queda sin confirmar mediante estas comprobaciones.
- Se corrigieron los requisitos de cuenta en cuatro agentes GPT y la guía de ChatGPT. Se explican los permisos del espacio institucional y la alternativa de practicar en un chat. Referencia: [GPTs en ChatGPT](https://help.openai.com/en/articles/8554407-what-are-gpts).
- Se mantiene el inicio y la carga de una sola lección al abrirla. Esta revisión no constituye una nueva medición de velocidad en todas las redes y dispositivos.

## Límites que siguen abiertos

La biblioteca antigua conserva 399 documentos de referencia que todavía no han recibido la misma revisión editorial completa; los originales en español se identifican como tales. No se consideran incluidos en una afirmación de traducción o reescritura integral.

No se ha realizado todavía la prueba con tres principiantes. El protocolo está preparado en `PRUEBA_CON_ALUMNOS.md`. Queda comprobar con alumnos reales dónde se atascan y si pueden completar los pasos sin ayuda.

No se afirma que todas las aplicaciones externas hayan sido utilizadas con cuentas reales ni que todos sus resultados estén verificados. La validez demostrada de los flujos locales corresponde a los archivos, datos y versión indicados, no a cualquier modificación o integración futura.

Para repetir el ensayo de n8n, instala esa versión en `.temp/n8n-runtime` y ejecuta `node scripts/test-n8n-runtime.mjs`. Esa prueba utiliza una base separada, no la instancia del centro; tarda varios minutos y vuelve a generar la evidencia. Después ejecuta `npm run index` para incorporarla a los archivos del portal.
