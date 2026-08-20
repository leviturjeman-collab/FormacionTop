---
titulo: "Ollama Modelos Locales API"
tipo: "manual_research"
nivel: "transversal"
fase: "transversal"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://github.com/ollama/ollama", "https://ollama.com/library"]
tags: ["ai-academy", "manual_research", "transversal", "transversal"]
entregable: "manual con fuentes y practica"
---
# Ollama - Modelos locales, API, library y privacidad operativa

Ollama debe ensenarse como la puerta de entrada a modelos locales. Su valor no es competir de forma simplista con modelos cloud, sino permitir que el alumno ejecute modelos en su propio ordenador o servidor, pruebe familias abiertas, controle datos, experimente con latencia, construya prototipos offline y conecte modelos locales a herramientas como n8n, scripts, APIs o agentes. La documentacion oficial de Ollama y su repositorio explican instalacion, library de modelos, API local, endpoints, streaming, chat, generate, embeddings, Modelfile y clientes como `ollama-python`.

## Modelo mental

Ollama funciona como un servidor local de modelos. El usuario descarga un modelo desde la library, lo ejecuta y puede hablar con el mediante CLI o API HTTP local. La API ofrece endpoints como generate, chat, list local models, show model information, pull, delete, embeddings y version. Muchos endpoints pueden responder en streaming como objetos JSON. Tambien se puede desactivar streaming para recibir una respuesta unica. Esto hace que Ollama encaje muy bien con workflows: un programa local, n8n o un agente puede llamar a `localhost` y obtener una respuesta.

La idea pedagogica importante es que local no significa gratis en todos los sentidos. No pagas por token a un proveedor cloud, pero pagas con hardware, memoria, CPU/GPU, tiempo, energia, mantenimiento y calidad variable. Un modelo local puede ser excelente para privacidad, pruebas y tareas especificas, pero no siempre iguala a modelos frontier en razonamiento complejo.

## Basico

En nivel basico, el alumno debe instalar Ollama, descargar un modelo pequeno, hacer una pregunta por CLI y probar la API. Debe entender que un modelo tiene nombre y tag, por ejemplo `modelo:tag`, y que si no se indica tag puede usarse `latest`. Debe aprender a listar modelos instalados y retirar modelos que no usa.

La primera practica puede ser: instalar, ejecutar un modelo ligero, pedir una respuesta, luego hacer una llamada HTTP local. La segunda: comparar dos modelos con el mismo prompt. La tercera: medir tiempo de respuesta y observar si el equipo se ralentiza. Esto ensena que elegir modelo es una decision tecnica, no una preferencia estetica.

Que no usar en basico: modelos enormes en equipos sin memoria, automatizaciones de produccion, datos sensibles sin entender almacenamiento local, APIs expuestas a red sin seguridad o prompts que requieran razonamiento critico sin evaluacion.

## Intermedio

En intermedio, Ollama se conecta a herramientas. Puede integrarse con scripts Python, n8n, agentes, interfaces locales, RAG y pipelines de datos. La API permite pedir salidas estructuradas usando formato JSON o schema, segun la documentacion. Esto es muy util para tareas como clasificar textos, extraer campos, normalizar datos o generar etiquetas. Pero el alumno debe validar siempre la salida. Aunque se pida JSON, la aplicacion debe comprobar que cumple el schema.

Embeddings son otra pieza clave. Permiten convertir documentos en vectores para busqueda semantica. Un proyecto intermedio puede crear una base de conocimiento local: documentos en una carpeta, embeddings, busqueda de fragmentos relevantes y respuesta con modelo local. Esto ensena privacidad y arquitectura RAG sin depender de proveedores cloud.

Tambien debe estudiarse la library. Ollama ofrece modelos de muchas familias, y algunos como Hermes 3 estan disponibles desde la library. El alumno debe aprender a mirar tamano, parametros, requisitos, calidad esperada y licencia o restricciones del modelo original.

## Avanzado

En avanzado, Ollama se convierte en infraestructura local. Aqui entran Modelfile, plantillas, parametros, temperatura, context window, keep alive, rendimiento, concurrencia, cuantizacion, evaluacion, monitorizacion y seguridad de red. Si se expone Ollama fuera de `localhost`, hay que tratarlo como un servicio real: autenticacion o proteccion por red, firewall, logs y limites. Un endpoint de modelo sin proteccion puede filtrar datos o consumir recursos.

El alumno avanzado debe construir un router de modelos: cloud para tareas criticas o de maxima calidad, local para privacidad, bajo coste o prototipos; modelos pequenos para clasificacion rapida; modelos grandes para razonamiento; embeddings locales para busqueda; fallback si el modelo local no cumple confianza minima. Tambien debe crear evaluaciones comparativas: precision, latencia, coste, memoria, estabilidad y formato.

## Proyectos reales

Proyectos con Ollama: asistente local de documentos, clasificador offline, generador de etiquetas para archivos, RAG privado, chatbot interno sin salida a internet, laboratorio de comparacion de modelos, extractor de datos de PDFs locales, asistente de programacion offline y servidor local para n8n.

Practica AAAA+: construir un clasificador local de tickets. Entrada: texto de ticket. Salida: JSON con categoria, prioridad, resumen y confianza. BREAK: pedir salida sin JSON, enviar un ticket ambiguo, usar un modelo demasiado pequeno y exponer el servicio fuera de localhost. FIX: anadir schema, validacion, umbral de confianza, fallback a humano y proteccion de red.

## Fuentes oficiales

- Ollama GitHub: https://github.com/ollama/ollama
- Ollama API docs: https://github.com/ollama/ollama/blob/main/docs/api.md
- Ollama Library: https://ollama.com/library
- Hermes 3 en Ollama: https://ollama.com/library/hermes3
- Ollama Python: https://github.com/ollama/ollama-python
- Ollama docs: https://docs.ollama.com/

## Criterio de evaluacion AAAA+

Un alumno domina Ollama cuando puede justificar por que usar local. La evaluacion debe comparar local contra cloud en cinco dimensiones: privacidad, coste, calidad, latencia y mantenimiento. No basta con decir "local es privado". Debe explicar donde viven los datos, que procesos tienen acceso, si el endpoint esta expuesto, que modelo se ha descargado y que limites de hardware existen. Tambien debe medir resultados: tiempo de primera respuesta, tokens por segundo si aplica, memoria usada y calidad en una muestra de tareas.

La practica avanzada consiste en montar un servicio local para una automatizacion. n8n llama a Ollama para clasificar textos, valida JSON, guarda resultados y envia a revision humana si la confianza es baja. BREAK: usar un modelo insuficiente, pedir JSON sin schema, apagar el servidor o cambiar el tag del modelo. FIX: pinnear modelo, validar salida, crear fallback y documentar requisitos de maquina.

## Siguiente paso del alumno

El siguiente paso recomendado es crear una tabla comparativa de tres modelos locales. El alumno debe probar el mismo prompt, medir tiempo, revisar calidad, anotar memoria aproximada y decidir para que tarea usaria cada uno. Esta practica evita una trampa habitual: elegir modelos por popularidad en vez de elegirlos por ajuste al caso de uso, hardware disponible y formato de salida requerido.

## Control editorial profesional

Este bloque fija el uso correcto de este archivo dentro de la boveda. Sirve para evitar contenido innecesario, mantener la informacion revisable y convertir la nota en material profesional.

### Objetivo operativo

Usar **Ollama Modelos Locales API** para producir el entregable definido en la metadata: **manual con fuentes y practica**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

### Prerequisitos y materiales

- Haber leido el documento maestro y el mapa de carpetas.
- Tener claro el nivel del alumno antes de usar este archivo.
- Si se trabaja con herramientas externas, revisar credenciales, permisos, coste y datos sensibles.
- Si se convierte en clase, preparar una practica pequena y un error provocado.

### Fuentes y verificacion

| Tipo | Fuente | Fecha/uso | Criterio |
|---|---|---|---|
| Fuente oficial | https://github.com/ollama/ollama | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |
| Fuente oficial | https://ollama.com/library | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |

### Notas para profesor o facilitador

- Empezar con un problema real antes de explicar teoria.
- Pedir al alumno una salida concreta: documento, prompt, workflow, checklist, demo o defensa.
- Comprobar que el alumno puede explicar que entra, que pasa, que sale, que puede fallar y como lo verificaria.
- No avanzar a herramientas avanzadas si no hay dominio de entradas, salidas, permisos y evaluacion.

### Criterio para eliminar contenido innecesario

Eliminar o reescribir cualquier parrafo que no cumpla una de estas funciones: explicar una decision, enseÃ±ar un concepto, guiar una practica, prevenir un error, respaldar una fuente, preparar un entregable o mejorar la evaluacion.

### Proxima revision

- Revisar este archivo cuando cambien las fuentes oficiales relacionadas o antes de usarlo como material comercial.
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Ollama Modelos Locales API**.

