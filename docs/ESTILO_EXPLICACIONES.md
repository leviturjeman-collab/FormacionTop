# Explicaciones que se puedan seguir desde cero

Preferencia del propietario: aplicar a lecciones, automatizaciones, prompts, agentes y prácticas el estilo del ejemplo de Marta. Lenguaje sencillo, situaciones concretas y explicaciones detalladas. La longitud por sí sola no demuestra que algo esté bien explicado.

Empieza por una persona y una situación reconocible. Explica qué necesita, qué problema encuentra y cómo cambia el resultado al aplicar la idea de la lección. Identifica como ficticios los casos inventados. No presentes una historia didáctica como un resultado observado.

Desarrolla cada paso con el dato que utiliza, lo que hay que hacer, dónde se hace, lo que debería aparecer y por qué. Explica cada término técnico cuando aparece. Incluye un resultado resuelto con los datos del caso y una variación que permita entender la regla. Los nombres de botones, instrucciones y resultados deben corresponder a la herramienta de la práctica.

En los prompts, muestra la situación, los campos rellenados, la respuesta de ejemplo y la explicación de sus decisiones antes del editor. En automatizaciones, sigue un caso por sus pasos, explica las entradas y salidas y distingue preparar una acción de ejecutarla. Conserva los detalles propios de cada caso; no sustituyas toda la biblioteca por la misma introducción.

Conserva las historias y explicaciones originales al generar el programa. Los ejercicios añadidos complementan el texto: no deben reemplazarlo silenciosamente. Revisa las afirmaciones técnicas al actualizar una lección; un lenguaje cercano no justifica afirmaciones absolutas que no sean correctas.

La explicación aparece antes de la práctica. Los bloques tienen altura según su contenido y separación positiva. Comprueba títulos largos, ejemplos desplegados, tablas, código y botones en móvil y ordenador. No ocultes texto para disimular un desbordamiento.

Validación de lectura: `npm run test:reading`, contra una versión compilada servida localmente. Usa `ACADEMY_TEST_URL` para cambiar la dirección. La prueba simula el acceso, comprueba la historia de Marta, la separación de bloques y el ancho de las páginas; no verifica cuentas ni acciones externas. Las capturas y el informe se guardan en `.temp/reading`.
