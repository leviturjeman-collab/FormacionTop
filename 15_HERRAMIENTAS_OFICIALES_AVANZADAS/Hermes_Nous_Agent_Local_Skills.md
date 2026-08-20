---
titulo: "Hermes Nous Agent Local Skills"
tipo: "manual_research"
nivel: "transversal"
fase: "transversal"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://hermes-agent.nousresearch.com/docs/", "https://skills.github.com/", "https://docs.github.com/"]
tags: ["ai-academy", "manual_research", "transversal", "transversal"]
entregable: "manual con fuentes y practica"
---
# Hermes / Nous Research - Agente persistente, skills, memoria y ejecucion flexible

Hermes Agent, de Nous Research, debe explicarse como una propuesta distinta a un copiloto de IDE. Su documentacion oficial lo describe como un agente auto-mejorable con bucle de aprendizaje incorporado, memoria persistente, creacion de skills desde la experiencia, mensajeria en multiples plataformas, soporte MCP, herramientas, voz, ejecucion en varios backends y capacidad de trabajar en entornos locales, Docker, SSH, serverless o infraestructura remota. Para la formacion, Hermes es interesante porque permite hablar de agentes que no solo responden, sino que acumulan procedimiento y memoria operativa.

Tambien conviene separar Hermes Agent de los modelos Hermes. Nous Research mantiene modelos como Hermes 3 y repositorios relacionados con function calling. El alumno debe entender que "Hermes" puede referirse al agente, al ecosistema de Nous o a modelos concretos. En clase se debe nombrar siempre la pieza exacta: Hermes Agent, Hermes model, Hermes Function Calling o modelo Hermes servido en Ollama/Hugging Face.

## Modelo mental

Hermes Agent se puede entender como un agente con tres memorias: conversacion actual, memoria persistente y skills. La conversacion actual es el contexto inmediato. La memoria persistente conserva informacion util a traves de sesiones. Las skills convierten experiencia en procedimientos reutilizables. Esta idea es pedagogicamente potente: un alumno debe ver que un agente profesional no mejora porque "sabe mas magicamente", sino porque se le da un sistema para guardar lo aprendido, recuperar contexto y transformar procedimientos en instrucciones ejecutables.

Otra capa importante es la ejecucion. Hermes puede vivir en distintos entornos, desde local hasta Docker, SSH, Daytona, Modal u otros backends. Esto ensena una idea avanzada: un agente no tiene que vivir necesariamente en el ordenador del usuario. Puede vivir donde tenga herramientas, permisos, capacidad de computo y persistencia.

## Basico

En nivel basico, Hermes sirve para entender que es un agente persistente. El alumno debe estudiar instalacion, configuracion, proveedores, primera conversacion, memoria y herramientas disponibles. No hace falta empezar con infraestructura compleja. Basta con comprender que un agente puede recordar preferencias, usar herramientas y crear procedimientos.

La practica basica puede ser: instalar o revisar el flujo de instalacion, configurar proveedor de modelo, iniciar una conversacion, pedir una tarea simple y observar donde se guarda el contexto. Despues, el alumno debe explicar la diferencia entre una conversacion normal con IA y un agente que tiene memoria y skills.

Que no usar en basico: ejecucion remota sin entender seguridad, mensajeria con cuentas personales importantes, tools con permisos amplios, automatizaciones programadas que actuen solas o memoria sin criterio de privacidad.

## Intermedio

En intermedio se estudian tools, MCP, messaging gateway y skills. Hermes destaca por poder vivir donde vive el usuario: Telegram, Discord, Slack, WhatsApp, Teams y otras plataformas, segun su documentacion. Esto abre proyectos reales muy potentes, pero tambien riesgos. Un agente conectado a mensajeria puede recibir instrucciones desde muchos lugares. Por eso el alumno debe definir autorizacion, permisos, logs y limites.

MCP permite ampliar capacidades conectando servidores externos. Igual que en Claude o Cursor, el alumno debe entender que MCP no es un adorno tecnico: es una puerta a herramientas. Cada herramienta debe tener descripcion, alcance, autenticacion y permisos. Las skills permiten guardar procedimientos portables. En este punto, el alumno puede crear una skill de investigacion, una skill de soporte, una skill de analisis de repositorio o una skill de gestion de tareas.

Los modelos Hermes y el proyecto Hermes Function Calling sirven para estudiar como los modelos aprenden o ejecutan uso de herramientas. No hace falta convertir al alumno en investigador, pero si debe entender que function calling no es solo "responder JSON"; es estructurar decisiones para invocar herramientas externas.

## Avanzado

En avanzado, Hermes se ensena como arquitectura de agente. Se estudia ejecucion en entornos aislados, backends, persistencia, memoria, skills auto-mejorables, subagentes o delegacion, automatizaciones programadas, seguridad y observabilidad. La pregunta ya no es "como chateo", sino "como mantengo un agente que trabaja durante semanas sin perder contexto ni romper permisos".

El alumno avanzado debe construir una politica de memoria. No todo debe recordarse. Algunas cosas caducan, otras son privadas, otras son preferencias utiles y otras son errores que conviene convertir en skill. Tambien debe construir una politica de herramientas: que puede usar siempre, que requiere confirmacion y que nunca puede tocar.

## Proyectos reales

Proyectos con Hermes: asistente persistente de operaciones, agente personal conectado a mensajeria, sistema de recordatorio e investigacion, agente que aprende procedimientos de soporte, copiloto de DevOps en VPS, agente de documentacion que mantiene una base de conocimiento o sistema de automatizaciones programadas. En todos los casos, el entregable profesional debe incluir memoria, skills, permisos, entorno de ejecucion y rollback.

Practica AAAA+: crear una skill de "resumen semanal operativo". Entrada: mensajes, tareas o notas. Proceso: agrupar temas, detectar bloqueos, proponer acciones y guardar aprendizajes reutilizables. BREAK: meter informacion privada, pedir una accion fuera de permisos o introducir instrucciones contradictorias. FIX: separar memoria privada, definir confirmaciones y mejorar la skill.

## Fuentes oficiales

- Hermes Agent docs: https://hermes-agent.nousresearch.com/docs/
- Hermes Agent GitHub: https://github.com/NousResearch/hermes-agent
- Hermes providers: https://hermes-agent.nousresearch.com/docs/integrations/providers
- Hermes Function Calling: https://github.com/NousResearch/Hermes-Function-Calling
- Hermes 3 model card: https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-8B
- Nous Research: https://nousresearch.com/

## Criterio de evaluacion AAAA+

Un alumno domina Hermes cuando entiende la diferencia entre memoria util y acumulacion peligrosa. La evaluacion debe pedir una politica de memoria: que recordar, que olvidar, que pedir permiso antes de guardar y que nunca conservar. Tambien debe pedir una skill pequena, con objetivo, pasos, ejemplos y condicion de uso. Si el agente se conecta a mensajeria, el alumno debe explicar quien puede invocarlo, desde donde, con que permisos y que acciones requieren confirmacion.

La practica avanzada consiste en disenar un agente persistente para un rol real, por ejemplo "asistente de operaciones de una academia". El alumno define canales, herramientas, memoria, skills, calendario, entorno de ejecucion, logs y limites. BREAK: pedirle al agente que actue sobre una cuenta sin autorizacion o que recuerde informacion sensible. FIX: anadir politica de aprobacion, clasificacion de datos y skill de borrado o correccion de memoria. Esa es la diferencia entre jugar con un agente y operarlo profesionalmente.

## Control editorial profesional

Este bloque fija el uso correcto de este archivo dentro de la boveda. Sirve para evitar contenido innecesario, mantener la informacion revisable y convertir la nota en material profesional.

### Objetivo operativo

Usar **Hermes Nous Agent Local Skills** para producir el entregable definido en la metadata: **manual con fuentes y practica**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

### Prerequisitos y materiales

- Haber leido el documento maestro y el mapa de carpetas.
- Tener claro el nivel del alumno antes de usar este archivo.
- Si se trabaja con herramientas externas, revisar credenciales, permisos, coste y datos sensibles.
- Si se convierte en clase, preparar una practica pequena y un error provocado.

### Fuentes y verificacion

| Tipo | Fuente | Fecha/uso | Criterio |
|---|---|---|---|
| Fuente oficial | https://hermes-agent.nousresearch.com/docs/ | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |
| Fuente oficial | https://skills.github.com/ | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |
| Fuente oficial | https://docs.github.com/ | Consultada/revisada el 2026-08-13 | Verificar antes de vender, grabar o actualizar clase |

### Notas para profesor o facilitador

- Empezar con un problema real antes de explicar teoria.
- Pedir al alumno una salida concreta: documento, prompt, workflow, checklist, demo o defensa.
- Comprobar que el alumno puede explicar que entra, que pasa, que sale, que puede fallar y como lo verificaria.
- No avanzar a herramientas avanzadas si no hay dominio de entradas, salidas, permisos y evaluacion.

### Criterio para eliminar contenido innecesario

Eliminar o reescribir cualquier parrafo que no cumpla una de estas funciones: explicar una decision, enseÃ±ar un concepto, guiar una practica, prevenir un error, respaldar una fuente, preparar un entregable o mejorar la evaluacion.

### Proxima revision

- Revisar este archivo cuando cambien las fuentes oficiales relacionadas o antes de usarlo como material comercial.
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Hermes Nous Agent Local Skills**.

