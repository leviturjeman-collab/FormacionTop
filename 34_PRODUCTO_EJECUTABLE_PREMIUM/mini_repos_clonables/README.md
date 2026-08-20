# Mini repos clonables

| Repo | Objetivo | Archivos clave |
|---|---|---|
| [[starter-next-vercel-env/README]] | Next.js + Vercel + variables de entorno. Objetivo: desplegar una app m?nima con preview, producci?n y .env.example. | README, .env/example, docs |
| [[starter-rag-postgres/README]] | RAG m?nimo con Postgres/pgvector conceptual. Objetivo: separar documentos, chunks, preguntas y evaluaciones. | README, .env/example, docs |
| [[starter-multi-llm-router/README]] | Router multi-LLM con fallback. Objetivo: comparar respuestas y registrar fallos sin casarse con un proveedor. | README, .env/example, docs |
| [[starter-video-remotion/README]] | Video program?tico. Objetivo: transformar guion, voz y subt?tulos en pipeline de v?deo. | README, .env/example, docs |
| [[starter-playwright-e2e/README]] | Testing E2E. Objetivo: comprobar que una web carga y que un flujo cr?tico no se rompe. | README, .env/example, docs |
| [[starter-supabase-auth/README]] | Supabase Auth + tabla. Objetivo: separar anon key, service role y pol?ticas. | README, .env/example, docs |
| [[starter-mcp-permissions/README]] | MCP con permisos m?nimos. Objetivo: documentar tools permitidas y bloqueadas. | README, .env/example, docs |
| [[starter-observability/README]] | Sentry + PostHog + logs. Objetivo: ver errores, eventos y coste IA. | README, .env/example, docs |
| [[starter-docker-stack/README]] | Docker Compose con Postgres y Qdrant. Objetivo: levantar stack local de RAG. | README, .env/example, docs |
| [[starter-n8n-lead-triage/README]] | n8n lead triage. Objetivo: importar workflow, enviar payload y clasificar prioridad. | README, .env/example, docs |

<!-- DESARROLLO_EXTENSO_PREMIUM_2026_08_18 -->

# Desarrollo extenso premium - Readme

## 1. Proposito profesional

Este archivo debe tratarse como una pieza de **mini repo clonable** dentro de la formacion. Su funcion no es rellenar la boveda con contenido, sino ayudar a una persona real a producir un resultado verificable. En esta academia, una nota esta terminada cuando el alumno puede abrirla, entender el objetivo, preparar los materiales, ejecutar una practica, provocar un fallo, repararlo, guardar evidencia y defender lo aprendido con sus palabras.

El proposito concreto de esta pieza es **crear un proyecto base que el alumno pueda abrir, ejecutar, romper, reparar y convertir en portfolio**. Eso significa que el profesor no debe usarla como lectura pasiva. Debe convertirla en actividad, demostracion, evaluacion o entregable. Si el alumno solo lee y asiente, todavia no hay aprendizaje profesional. Si el alumno produce una evidencia, detecta un limite y explica una decision, entonces la pieza empieza a cumplir su funcion.

Una version premium de este archivo debe responder siempre cuatro preguntas. Primero: que problema resuelve. Segundo: que necesita el alumno antes de empezar. Tercero: que salida observable debe producir. Cuarto: como se sabe que esa salida esta bien. Estas preguntas evitan uno de los fallos mas comunes en formaciones de IA: confundir entusiasmo por herramientas con capacidad real de ejecucion.

## 2. Contexto dentro de la ruta

Esta pieza encaja en la ruta como puente entre conocimiento y operacion. Antes de usarla, el alumno debe tener claros los conceptos basicos de objetivo, contexto, entrada, salida esperada, permisos, coste y evaluacion. Si se trabaja con herramientas tecnicas, tambien debe comprender terminal, variables de entorno, estructura de carpetas y diferencia entre datos ficticios y datos reales.

Para un alumno principiante, este archivo sirve como mapa guiado. No se espera que domine todas las decisiones internas, pero si que pueda seguir los pasos y explicar que esta intentando conseguir. Para un alumno intermedio, la exigencia sube: debe adaptar la pieza a un caso propio, documentar decisiones y detectar riesgos. Para un alumno avanzado, esta pieza debe convertirse en parte de un sistema defendible con trazabilidad, pruebas, rollback y mantenimiento.

El profesor debe presentar esta nota con un problema real. Por ejemplo: un cliente envia leads incompletos, un workflow falla por una variable ausente, un agente tiene demasiados permisos, un deploy funciona en local pero no en produccion, o un alumno no sabe que herramienta elegir. El problema real da sentido a la teoria y convierte la clase en entrenamiento.

## 3. Prerrequisitos y preparacion

Antes de ejecutar la practica, confirmar estos puntos:

- El alumno sabe que resultado debe entregar.
- Las credenciales reales no se usaran en demos publicas.
- Existe un dataset ficticio o payload de prueba.
- El entorno esta identificado: Windows, macOS, Linux o navegador.
- Las variables necesarias estan documentadas en `.env.example`.
- Hay una forma de comprobar el resultado: log, captura, output, test, diff, schema, workflow exportado o rubrica.
- Hay un fallo provocado preparado de antemano.

La preparacion no debe ser excesiva. La idea es reducir friccion, no convertir cada clase en una instalacion interminable. Si una herramienta requiere demasiadas dependencias para el objetivo de la sesion, se debe usar una alternativa mas simple o mostrar la parte compleja como demo del profesor. La regla es clara: primero aprendizaje observable, despues sofisticacion tecnica.

## 4. Explicacion para principiante

Explicado de forma simple, esta pieza ensena a pasar de una intencion vaga a un resultado que se puede revisar. En IA y automatizacion, muchas personas dicen cosas como "quiero un agente", "quiero automatizar ventas" o "quiero usar varios modelos". Eso todavia no es un proyecto. Un proyecto empieza cuando definimos quien usa el sistema, que datos entran, que accion ocurre, que salida se espera, que puede fallar y quien revisa.

El alumno debe aprender que una herramienta no es una solucion por si sola. n8n, Vercel, Supabase, Playwright, LangChain, LiteLLM, Docker o cualquier repo popular son medios. El criterio profesional consiste en elegir el medio mas pequeno que produce evidencia suficiente. A veces sera un prompt con formato. A veces un CSV. A veces un workflow. A veces un script. A veces una arquitectura completa.

La pregunta que debe guiar la clase es: si otra persona abre mi entrega manana, podria entenderla, ejecutarla y detectar si esta rota. Si la respuesta es no, falta documentacion, validacion o ejemplo. Si la respuesta es si, el alumno ya esta trabajando de forma mas profesional que la mayoria de tutoriales rapidos.

## 5. Modelo mental

Usa este modelo mental para trabajar el archivo:

```text
Necesidad -> Entrada -> Proceso -> Decision -> Salida -> Evidencia -> Revision -> Mejora
```

La necesidad es el problema que justifica el trabajo. La entrada son datos, instrucciones, archivos, eventos o contexto. El proceso puede ser manual, automatizado o asistido por un modelo. La decision puede tomarla una persona, una regla o un LLM. La salida es el artefacto visible. La evidencia demuestra que no estamos adivinando. La revision detecta errores. La mejora convierte la practica en aprendizaje acumulado.

Cuando algo falle, no se debe arreglar por intuicion. El alumno debe buscar evidencia. Si es una API, mirar status code y body. Si es un workflow, mirar input/output de cada node. Si es un deploy, mirar logs y variables. Si es un modelo, mirar prompt, contexto, output y evaluacion. Si es una base de datos, mirar URL, permisos, schema y consulta.

## 6. Practica guiada

La practica recomendada tiene seis pasos.

1. Definir el usuario: quien va a usar esta pieza y para que.
2. Definir la entrada: que datos, archivos o instrucciones necesita.
3. Definir la salida: que debe producir y en que formato.
4. Ejecutar una version minima: no optimizar todavia.
5. Probar un caso roto: quitar un dato, romper un formato o limitar un permiso.
6. Documentar reparacion: sintoma, causa, evidencia, cambio y prevencion.

El profesor debe insistir en que la version minima no es una version mediocre. Es una version enfocada. Si funciona con datos ficticios, tiene salida clara y se puede explicar, ya es mejor que una demo espectacular que nadie puede mantener. La excelencia viene despues: ampliar casos, mejorar UX, anadir tests, logs, seguridad, coste y deploy.

## 7. Caso feliz

El caso feliz representa la ejecucion ideal. Todos los datos necesarios existen, las variables estan configuradas, las herramientas responden y la salida cumple el formato esperado. En clase, el caso feliz sirve para que el alumno vea el flujo completo sin atascarse en diagnostico desde el primer minuto.

El entregable del caso feliz debe incluir evidencia. Puede ser una captura, un log, un JSON, un CSV procesado, un workflow exportado, un test verde, una respuesta con citas, una tabla final o una defensa oral. La evidencia debe guardarse cerca del proyecto, no en la memoria del alumno. Si no queda evidencia, no queda aprendizaje transferible.

## 8. Caso ambiguo

El caso ambiguo es el mas parecido al mundo real. Los datos existen, pero son incompletos o interpretables. Un lead no dice presupuesto. Un ticket no indica urgencia. Un documento RAG no contiene la respuesta exacta. Un usuario pide "hazlo mejor" sin criterio. Un cliente quiere automatizar algo, pero no sabe que sistema usa.

La respuesta profesional al caso ambiguo no es inventar. Es pedir aclaracion, marcar supuestos o producir una salida condicionada. El alumno debe aprender frases como: "con la informacion disponible", "falta confirmar", "no ejecutaria esta accion sin aprobacion", "la salida es provisional" o "necesito un criterio de exito". Esta capacidad vale mucho mas que memorizar comandos.

## 9. Caso roto

El caso roto se introduce de forma deliberada. No es un accidente, es una herramienta pedagogica. El profesor puede romper una variable de entorno, eliminar un campo obligatorio, cambiar un tipo de dato, usar una API key falsa, quitar permisos, alterar un schema, provocar un 401/403/429, romper un test o pedir al agente una accion no permitida.

El alumno debe documentar:

- Sintoma: que se observa.
- Causa probable: por que podria estar pasando.
- Evidencia: que log, output o prueba lo demuestra.
- Cambio: que se modifica.
- Prevencion: como evitar que se repita.

Esta estructura entrena pensamiento operativo. Un profesional no es quien nunca rompe nada. Es quien puede limitar el dano, encontrar la causa y dejar una mejora en el sistema.

## 10. Errores comunes

Errores que debe prevenir esta pieza:

- Elegir la herramienta por moda en vez de por necesidad.
- Usar datos reales cuando bastaban datos ficticios.
- No crear `.env.example`.
- No separar claves publicas y privadas.
- No definir criterio de terminado.
- No probar caso roto.
- No guardar evidencia.
- No preparar rollback.
- No explicar costes o limites.
- No actualizar fuentes oficiales antes de vender o grabar.

Cada error debe convertirse en pregunta de revision. Por ejemplo: que dato falta, que permiso sobra, que salida no se puede verificar, que herramienta es innecesaria, que secreto esta expuesto o que parte deberia revisar una persona.

## 11. Rubrica de evaluacion

| Criterio | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| Claridad | No se entiende el objetivo | Se entiende parcialmente | Objetivo claro | Objetivo claro y transferible |
| Ejecucion | No hay entrega | Hay entrega incompleta | Funciona con caso feliz | Funciona y se puede reproducir |
| Diagnostico | No detecta fallos | Detecta sintomas | Encuentra causa con evidencia | Previene repeticion |
| Seguridad | Ignora riesgos | Menciona riesgos | Mitiga riesgos basicos | Documenta permisos y rollback |
| Defensa | Memoriza | Explica superficialmente | Justifica decisiones | Conecta con caso real y mejora |

Para aprobar, el alumno debe aspirar minimo a nivel 3 en claridad, ejecucion y diagnostico. Para considerarlo portfolio, debe acercarse a nivel 4 en evidencia, seguridad y defensa.

## 12. Entregable final

El entregable recomendado debe tener esta estructura:

```markdown
# Entrega

## Problema
## Usuario
## Entrada
## Proceso
## Salida esperada
## Herramientas utilizadas
## Herramientas descartadas
## Caso feliz
## Caso ambiguo
## Caso roto
## Diagnostico y reparacion
## Evidencia
## Riesgos y limites
## Coste estimado
## Rollback
## Defensa de 3 minutos
## Siguiente mejora
```

No todos los proyectos necesitan codigo complejo, pero todos necesitan evidencia. Una plantilla bien usada puede ser mejor que un script no explicado. Un workflow simple con logs puede ser mejor que un agente autonomo sin control. La calidad no esta en usar mas tecnologia, sino en dejar un sistema mas claro, mas seguro y mas repetible.

## 13. Defensa oral

La defensa de 3 minutos debe seguir este guion:

1. Que problema resolvi.
2. Que entrada use.
3. Que herramienta elegi y por que.
4. Que salida produjo.
5. Que fallo provoque.
6. Como lo diagnostique.
7. Como lo repare.
8. Que riesgo queda.
9. Que mejoraria en la siguiente version.

Si el alumno no puede defenderlo, todavia no lo domina. La defensa no busca teatro; busca precision. Debe sonar como alguien que entiende su sistema, no como alguien que repite una receta.

## 14. Siguiente version

La siguiente version debe elegirse con cuidado. Posibles mejoras:

- Anadir tests.
- Mejorar logs.
- Crear un dataset mas realista.
- Separar configuracion por entorno.
- Anadir aprobacion humana.
- Medir coste.
- Crear una version para otro perfil profesional.
- Convertir la entrega en caso de estudio.
- Preparar una diapositiva de arquitectura.
- Crear una demo grabable.

La mejora correcta es la que aumenta claridad, reproducibilidad, seguridad o valor para el usuario. Si una mejora solo anade complejidad, debe esperar.
