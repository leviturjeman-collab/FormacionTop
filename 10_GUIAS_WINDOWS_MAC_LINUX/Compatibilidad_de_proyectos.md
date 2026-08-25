---
titulo: "Compatibilidad de proyectos"
tipo: "guia_sistema_operativo"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "guia_sistema_operativo", "transversal", "aplicacion"]
entregable: "guia tecnica por sistema operativo"
---
# Compatibilidad de proyectos

## Objetivo

Este documento clasifica los proyectos de la academia por nivel de dependencia tecnica. Sirve para que cualquier persona pueda elegir un proyecto y saber que necesita en su ordenador antes de empezar. La meta no es que todos los proyectos funcionen igual en Windows, macOS y Linux, sino que cada proyecto explique sus requisitos y equivalencias.

## Clasificacion por dificultad tecnica

### Nivel A - Solo lectura y Obsidian

Requisitos:

- Obsidian o cualquier editor Markdown.
- Navegador.
- Acceso a la boveda.

Ejemplos:

- Estudiar fundamentos.
- Crear una presentacion desde notas.
- Redactar prompts.
- Crear rubricas.
- Disenar arquitectura en papel.

Compatible con Windows, macOS y Linux sin cambios importantes.

### Nivel B - Navegador y cuentas externas

Requisitos:

- Navegador.
- Cuenta de ChatGPT, GitHub, n8n cloud, Claude o Gemini, segun practica.
- API keys si se usan APIs.

Ejemplos:

- Workflow de ChatGPT.
- GitHub Skills en repositorio.
- n8n cloud basico.
- Pruebas con herramientas web.

Compatible con todos los sistemas. La diferencia esta en gestion de archivos y descarga/subida de datos.

### Nivel C - Terminal y herramientas locales

Requisitos:

- Terminal.
- Git.
- Node.js o Python.
- Editor de codigo.

Ejemplos:

- Codex CLI.
- Scripts de skills.
- Validacion de JSON.
- Proyectos web.
- Pruebas locales.

Aqui aparecen diferencias entre PowerShell y Bash. Cada practica debe mostrar comandos Windows y macOS/Linux si usa terminal.

### Nivel D - Docker, servicios y self-hosting

Requisitos:

- Docker.
- Puertos libres.
- Variables de entorno.
- Conocimiento basico de servicios.

Ejemplos:

- n8n self-hosted.
- Bases de datos locales.
- Vector stores.
- Servicios MCP locales.

Este nivel requiere mas preparacion. Windows suele usar Docker Desktop; macOS tambien; Linux puede usar Docker Engine.

### Nivel E - Produccion

Requisitos:

- GitHub.
- Hosting.
- Variables y secretos.
- Logs.
- Evals.
- Rollback.
- Control de permisos.

Ejemplos:

- Agente de produccion.
- Workflow con usuarios reales.
- Integracion con APIs sensibles.
- Deploy de app.

Este nivel no depende solo del sistema operativo. Depende de cuentas, permisos, infraestructura y responsabilidad humana.

## Plantilla de compatibilidad que debe aparecer en cada proyecto

Cada proyecto debe indicar:

- Nivel tecnico: A, B, C, D o E.
- Sistemas compatibles: Windows, macOS, Linux.
- Terminal necesaria: si/no.
- Comandos Windows.
- Comandos macOS/Linux.
- Dependencias.
- Cuentas externas.
- API keys.
- Riesgos.
- Checklist de verificacion.

## Regla de oro

Si una persona no sabe que instalar, que cuenta necesita, donde ejecutar comandos, donde poner API keys y como comprobar que funciona, el proyecto no esta listo para entregarse.

## Ejemplos de clasificacion

### Crear una presentacion desde Obsidian

Nivel A. Compatible con Windows, macOS y Linux. No requiere terminal. Requiere leer notas, seleccionar contenido, estructurar diapositivas y revisar claridad. Riesgo bajo. Debe incluir fuentes y criterio de calidad.

### Crear un workflow de ChatGPT para informes

Nivel B. Compatible con todos los sistemas. Requiere navegador y cuenta ChatGPT. Puede requerir archivos fuente. Riesgo medio si contiene datos sensibles. Debe incluir instrucciones de privacidad y revision humana.

### Usar Codex para modificar un repositorio

Nivel C. Compatible con Windows, macOS y Linux, pero requiere instrucciones por terminal. Necesita Git, entorno del proyecto y pruebas. Riesgo medio-alto porque puede modificar archivos. Debe incluir lectura de diff, tests y rollback.

### Construir n8n self-hosted con Docker

Nivel D. Compatible con todos los sistemas, pero cambia instalacion de Docker y rutas. Riesgo alto si se conectan credenciales reales. Debe incluir variables, puertos, credenciales, exports de workflow y logs.

### Agente de produccion con tools externas

Nivel E. Compatible segun infraestructura. Requiere permisos, secretos, logs, evals, aprobacion humana y rollback. No se entrega a alumnos sin checklist completa.

## Plantilla minima de cabecera para proyectos

```markdown
## Compatibilidad

- Nivel tecnico:
- Probado en:
- Compatible con:
- Terminal necesaria:
- Cuentas externas:
- API keys:
- Docker:
- Riesgos principales:
- Guia Windows:
- Guia macOS:
- Guia Linux:
```

Esta cabecera debe aparecer en cualquier proyecto que vaya a circular fuera de tu propia boveda.

## Como usar esta clasificacion en clase

Al inicio de cada proyecto, el alumno debe elegir su nivel tecnico y justificarlo. Esto evita que intente desplegar un agente de produccion cuando todavia esta en una practica de lectura. Tambien ayuda a adaptar el curso a perfiles distintos. Un perfil no tecnico puede trabajar Nivel A y B durante mas tiempo. Un perfil tecnico puede entrar antes en C y D. Nivel E siempre requiere supervision, porque implica sistemas vivos, usuarios, datos, coste o reputacion.

El profesor puede usar esta clasificacion para preparar grupos: alumnos Windows con PowerShell, alumnos macOS con Terminal, alumnos Linux con Bash. La teoria es comun; la ejecucion se adapta.

## Clasificacion como lenguaje comun

La clasificacion tambien sirve para hablar con claridad. En vez de decir "este proyecto es facil" o "este proyecto es dificil", se dice "este proyecto es Nivel C porque requiere terminal, Git y Node.js" o "este proyecto es Nivel E porque modifica datos reales y necesita rollback". Esto evita malentendidos. Un proyecto puede ser conceptualmente sencillo pero tecnicamente incomodo, o conceptualmente avanzado pero ejecutarse solo con navegador.

Usar niveles permite planificar mejor tiempos, soporte, grupos y expectativas. Tambien permite vender o presentar la formacion con honestidad: cada ruta puede indicar que autonomia tecnica requiere.
---

<!-- CLASIFICACION_ORDENADOR -->

## Clasificacion por ordenador y sistema operativo

Antes de convertir esta nota en una practica, laboratorio, documento o proyecto para otra persona, clasificala segun el ordenador del alumno y el nivel tecnico de ejecucion. Usa estas guias:

- [[10_GUIAS_WINDOWS_MAC_LINUX/Windows]] para alumnos que trabajen con PowerShell, rutas `C:\...`, OneDrive, Git for Windows, Node.js, Python o Docker Desktop.
- [[10_GUIAS_WINDOWS_MAC_LINUX/macOS]] para alumnos que trabajen con Terminal/zsh, rutas `/Users/...`, Homebrew, permisos de macOS o Apple Silicon.
- [[10_GUIAS_WINDOWS_MAC_LINUX/Linux]] para alumnos que trabajen con Bash, rutas `/home/...`, gestores `apt`, `dnf` o `pacman`, permisos, servicios y Docker Engine.
- [[10_GUIAS_WINDOWS_MAC_LINUX/Compatibilidad_de_proyectos]] para clasificar la practica como Nivel A, B, C, D o E.
- [[10_GUIAS_WINDOWS_MAC_LINUX/Checklist_entrega_multisistema]] para comprobar que cualquier persona pueda seguirla sin depender de explicaciones orales.

Regla de entrega: si esta nota requiere terminal, Git, Node.js, Python, Docker, API keys, n8n, GitHub, Codex, Claude Code, Gemini o cualquier cuenta externa, debe indicar claramente que necesita el alumno, donde ejecutarlo, que salida esperar y como detectar errores en Windows, macOS y Linux.
---

# [Nombre del entregable]

## Problema

## Usuario

## Objetivo

## Fase y nivel

## Herramientas utilizadas

## Herramientas descartadas

## Artefacto real

## Pasos de ejecucion

## Caso feliz

## Caso ambiguo

## Caso roto

## Diagnostico y reparacion

## Evaluacion

## Riesgos y limites

## Sistema operativo / entorno

## Fuentes

## Defensa de 3 minutos

## Siguiente version
`

## Preguntas que debe poder responder el alumno

- Que estoy intentando mejorar.
- Por que esta nota me ayuda.
- Que parte puedo aplicar hoy.
- Que artefacto voy a producir.
- Como sabre que funciona.
- Que puede fallar.
- Que herramienta no debo usar todavia.
- Que evidencia voy a guardar.
- Como lo explicaria a un cliente, jefe, compañero o alumno.

Si no puede responder alguna, no pasa nada. Esa pregunta se convierte en tarea.

## Criterio de clase inolvidable

Para que esta nota se convierta en una clase que impacte, necesita cinco momentos:

1. Reconocimiento: el alumno ve un problema real suyo.
2. Claridad: entiende el modelo mental.
3. Accion: produce algo pequeño.
4. Tension: algo se rompe.
5. Dominio: lo repara y lo explica.

Sin tension no hay aprendizaje profundo. Sin reparacion no hay confianza. Sin explicacion no hay transferencia.

## Criterio de proyecto inolvidable

Para que un proyecto derivado de esta nota sea memorable, debe tener:

- Nombre claro.
- Resultado visible.
- Dificultad honesta.
- Evidencia.
- Error reparado.
- Mejora respecto a la version inicial.
- Utilidad para alguien real.
- Posibilidad de enseñarse en portfolio.

## Frase de calidad extrema

Esta nota no esta terminada cuando contiene mucha informacion. Esta terminada cuando alguien puede usarla para crear algo que antes no podia crear, explicar algo que antes no podia explicar o resolver un problema que antes le bloqueaba.

## Control editorial profesional

Este bloque fija el uso correcto de este archivo dentro de la boveda. Sirve para evitar contenido innecesario, mantener la informacion revisable y convertir la nota en material profesional.

### Objetivo operativo

Usar **Compatibilidad de proyectos** para producir el entregable definido en la metadata: **guia tecnica por sistema operativo**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

### Prerequisitos y materiales

- Haber leido el documento maestro y el mapa de carpetas.
- Tener claro el nivel del alumno antes de usar este archivo.
- Si se trabaja con herramientas externas, revisar credenciales, permisos, coste y datos sensibles.
- Si se convierte en clase, preparar una practica pequena y un error provocado.

### Fuentes y verificacion

| Tipo | Fuente | Fecha/uso | Criterio |
|---|---|---|---|
| Fuente interna | Fuente interna: AI Professional Academy | Revisada el 2026-08-13 | Usar como criterio pedagogico, no como fuente factual externa |

### Notas para profesor o facilitador

- Empezar con un problema real antes de explicar teoria.
- Pedir al alumno una salida concreta: documento, prompt, workflow, checklist, demo o defensa.
- Comprobar que el alumno puede explicar que entra, que pasa, que sale, que puede fallar y como lo verificaria.
- No avanzar a herramientas avanzadas si no hay dominio de entradas, salidas, permisos y evaluacion.

### Criterio para eliminar contenido innecesario

Eliminar o reescribir cualquier parrafo que no cumpla una de estas funciones: explicar una decision, enseñar un concepto, guiar una practica, prevenir un error, respaldar una fuente, preparar un entregable o mejorar la evaluacion.

### Proxima revision

- Revisar este archivo cuando cambien las fuentes oficiales relacionadas o antes de usarlo como material comercial.
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Compatibilidad de proyectos**.


## Fuentes oficiales complementarias

Estas fuentes se usan para verificar instrucciones tecnicas, compatibilidad y comportamiento de herramientas antes de convertir este archivo en clase, entrega o material comercial.

| Fuente | Uso recomendado |
|---|---|
| https://learn.microsoft.com/powershell/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://support.apple.com/guide/terminal/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://documentation.ubuntu.com/server/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://git-scm.com/doc | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://docs.docker.com/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://docs.python.org/3/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://nodejs.org/en/learn | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
