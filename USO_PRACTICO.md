# Usar la academia con datos propios

Actualización del 7 de septiembre de 2026. Se conserva el inicio y se añaden zonas de trabajo dentro de las prácticas.

## Prompts

La biblioteca ofrece las mismas **1.404 tareas** en español e inglés. Se han retirado del recorrido las combinaciones genéricas del banco que repetían instrucciones de gobierno, costes y aprobación independientemente de la tarea. Los textos originales siguen en el repositorio.

Ahora se rellenan campos en la página, se revisa el mensaje resultante y se copia, descarga o guarda en Mi proyecto. Guardar conserva el mensaje personalizado, no la plantilla vacía. Los datos que contengan dólares, corchetes o saltos de línea se tratan como texto literal.

Hay 1.343 referencias de caso con datos y respuesta; algunas se reutilizan entre los prompts de una misma práctica. Los ocho ejemplos de trabajo diario incluyen valores para rellenar el formulario: redactar y responder correos, resumir reuniones, extraer tareas, ordenar mensajes, preparar propuestas, revisar textos y preparar reuniones. Los otros 61 prompts de la biblioteca anterior mantienen sus campos e instrucciones; no se presentan como 61 ejemplos nuevos resueltos.

Las instrucciones de cada prompt indican dónde utilizarlo y, cuando procede de una herramienta, programa, kit o automatización, enlazan con la práctica correspondiente. Se mantiene la explicación extensa en la lección; la longitud del prompt depende de la tarea.

## Herramientas, kits y automatizaciones

Los cuadernos incluyen «Prepara tu versión aquí»: nombre de la tarea, datos propios, resultado que se necesita y resultado observado después de probar. Se puede cargar el ejemplo, copiar un encargo con los datos del alumno y descargar una plantilla de texto editable. La ficha prepara instrucciones; no afirma haber realizado la tarea.

Los archivos de texto, Markdown, CSV y JSON incluidos directamente en la práctica permiten editar y descargar una copia. Para JSON se comprueba el formato antes de preparar la copia. Los archivos originales permanecen disponibles. Los formularios preparan borradores en la página: conviene descargar la copia o guardar el prompt antes de salir.

Los prompts también se pueden rellenar desde las fichas de herramientas y desde las pestañas de los kits. No se ha contratado ningún servicio de pago ni se han conectado cuentas externas.

## n8n con datos propios

Las 25 automatizaciones locales permiten modificar sus datos con campos de texto, números, listas y opciones de sí/no. Los nombres técnicos aparecen junto a etiquetas en lenguaje sencillo para poder encontrarlos después en n8n.

La copia personalizada conserva el código de Resolver. Cambia únicamente la entrada, termina en Resolver y omite la comparación con la respuesta fija del ejemplo. El original de cuatro nodos sigue disponible para comprobar el caso de referencia. La copia se genera inactiva, sin datos fijados ni la indicación de verificación del original.

Se realizaron **50 ejecuciones reales** de copias producidas por la misma función que usa el navegador, en **n8n 2.37.10**: 49 resultados correctos y una detención esperada por horas incompatibles. Se probaron las 25 entradas originales y 25 variantes. La evidencia está en `content/verification/personalization-runtime.json`, vinculada a la huella del generador. Los números vacíos o no válidos y los campos obligatorios ausentes se rechazan.

Estos flujos calculan resultados dentro de n8n. Para enviar mensajes, guardar datos o recibir eventos de otra aplicación se siguen necesitando las cuentas, permisos y conexiones descritos en cada guía. La prueba realizada no garantiza el resultado de cualquier dato futuro del alumno.

## Comprobaciones

- `npm test`: contenido, correspondencia de archivos, enlaces, permisos y sesiones, portapapeles, tipos y construcción de producción.
- `node scripts/test-practical-content.mjs`: paridad ES/EN, campos utilizados, ocho ejemplos rellenables, rutas válidas, 25 formularios de n8n y vigencia de la evidencia del generador.
- `node scripts/test-practical-editors.mjs`: texto personalizado copiado, descargado y guardado; materiales editados; formularios de n8n; recuperar una lista vacía; números incompletos; móvil y teclado, sin modificar usuarios reales.
- `node scripts/test-personalized-workflows.mjs`: las 50 ejecuciones locales descritas. Requiere el n8n de ensayo instalado en `.temp/n8n-runtime`.
- `node scripts/test-practice-labs-ui.mjs`: regresión de casos, pistas, soluciones y flujos originales en ambos idiomas.

El contenido detallado y los ejemplos no se incluyen en el índice inicial. La biblioteca completa de prompts ocupa aproximadamente 368 KB comprimida en español y 338 KB en inglés. No se presenta esta medida como una prueba de velocidad en todas las redes.

La revisión editorial de los documentos antiguos y la prueba con principiantes siguen los límites registrados en `VALIDACION_DIDACTICA.md` y `PRUEBA_CON_ALUMNOS.md`.
