---
titulo: "GUIAS WINDOWS MAC LINUX"
tipo: "guia_sistema_operativo"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "guia_sistema_operativo", "transversal", "aplicacion"]
entregable: "guia tecnica por sistema operativo"
---
# Sistemas operativos - Guia de clasificacion

Esta carpeta existe para que cualquier persona pueda usar la boveda desde su ordenador, sea Windows, macOS o Linux. La formacion ensena IA, agentes, Codex, Claude Code, GitHub Skills, n8n, Gemini, workflows y proyectos, pero cada practica necesita aterrizarse en una maquina real. Las rutas cambian, las terminales cambian, los instaladores cambian y algunas instrucciones se ejecutan de forma distinta segun el sistema operativo.

## Como usar esta carpeta

1. Identifica el sistema operativo del alumno.
2. Abre la guia correspondiente.
3. Prepara terminal, Git, Node.js, Python, editor, Obsidian y herramientas necesarias.
4. Revisa [[Compatibilidad_de_proyectos]] antes de empezar un proyecto.
5. Usa [[Checklist_entrega_multisistema]] antes de entregar una practica o proyecto.

## Guias disponibles

- [[Windows]]
- [[macOS]]
- [[Linux]]
- [[Compatibilidad_de_proyectos]]
- [[Checklist_entrega_multisistema]]
- [[Setup_terminal_Homebrew_Vercel_GitHub_Env]]

## Clasificacion rapida

| Sistema | Terminal principal | Rutas tipicas | Gestor recomendado | Riesgo habitual |
|---|---|---|---|---|
| Windows | PowerShell | `C:\Users\Nombre\Proyecto` | winget, instaladores oficiales | Problemas de rutas, permisos, OneDrive, espacios y encoding |
| macOS | Terminal, zsh | `/Users/nombre/proyecto` | Homebrew | Permisos, Gatekeeper, versiones Apple Silicon |
| Linux | Bash | `/home/nombre/proyecto` | apt, dnf, pacman | Dependencias del sistema, permisos, Docker, servicios |

## Regla pedagogica

Cada laboratorio debe indicar si requiere:

- Solo navegador.
- Obsidian.
- Terminal.
- Git.
- Node.js.
- Python.
- Docker.
- Cuenta externa.
- API key.
- n8n cloud o self-hosted.
- GitHub.
- Editor de codigo.

Si una practica no indica esto, no esta lista para entregarse a un alumno externo.

## Como clasificar una nota existente

Cuando abras cualquier archivo de la boveda, no mires solo el titulo. Pregunta que tendria que hacer una persona para llevarlo a la practica. Si solo tiene que leer, reflexionar y escribir en Obsidian, es una nota de bajo riesgo. Si tiene que abrir una web, crear una cuenta, descargar archivos, ejecutar comandos o conectar APIs, entonces necesita clasificacion por ordenador.

La clasificacion debe incluir tres capas. La primera es el sistema operativo: Windows, macOS o Linux. La segunda es el nivel tecnico: lectura, navegador, terminal, Docker o produccion. La tercera es el riesgo: datos, permisos, coste, credenciales, acciones externas o impacto en usuarios. Solo cuando esas tres capas estan claras podemos decir que una nota esta preparada para que la use otra persona.

## Diferencias que mas confunden a alumnos

La confusion mas habitual no esta en la teoria de IA, sino en detalles de ordenador. Un alumno en Windows copia un comando Bash y falla. Un alumno en macOS intenta usar una ruta `C:\...` y no existe. Un alumno en Linux ejecuta Docker sin permisos. Una persona define una API key en una terminal y despues ejecuta el proyecto desde otra. Otra guarda el proyecto en OneDrive o iCloud y aparecen conflictos de sincronizacion.

Por eso esta carpeta no es secundaria. Es una capa de accesibilidad tecnica. Si queremos que la boveda funcione para perfiles diferentes, hay que traducir las practicas al contexto real de cada maquina.

## Como debe escribirse una practica multisistema

Una practica bien escrita debe tener este bloque:

- Sistema probado por el creador.
- Sistemas compatibles.
- Terminal recomendada.
- Comandos para Windows.
- Comandos para macOS/Linux.
- Versiones minimas.
- Donde poner variables de entorno.
- Como verificar instalacion.
- Errores frecuentes por sistema.
- Que hacer si el alumno no tiene permisos.

Esto no significa triplicar todas las instrucciones. Muchas practicas son iguales en navegador. Pero si hay terminal, rutas, scripts o servicios, la diferencia debe aparecer.

## Criterio de calidad

Una persona externa debe poder responder estas preguntas antes de empezar:

- Que ordenador uso.
- Que guia debo abrir.
- Que herramientas necesito.
- Que cuentas necesito.
- Que comandos debo ejecutar.
- Que resultado espero.
- Como se si algo fallo.
- Donde busco ayuda dentro de la boveda.

Si no puede responderlas, la nota necesita mas desarrollo.

## Uso recomendado por el profesor

Antes de entregar un modulo completo, el profesor debe recorrer sus laboratorios y marcar que sistema operativo se ha probado realmente. No hace falta probar todo en todos los sistemas desde el primer dia, pero si hace falta declarar la realidad. Es mejor escribir "probado en Windows, pendiente de validar en macOS y Linux" que prometer compatibilidad total sin evidencia. Esa honestidad tambien ensena al alumno a documentar proyectos profesionales.

Cuando una practica se valide en otro sistema, se actualiza la nota. Asi la boveda se convierte en un sistema vivo de conocimiento, no en un documento congelado.

## Politica de actualizacion

Cada vez que se cree un nuevo laboratorio, proyecto o plantilla, se debe revisar esta carpeta. Si el nuevo material requiere una herramienta no cubierta, se anade aqui. Por ejemplo, si mas adelante se incorpora Supabase CLI, Vercel CLI, Playwright, Postgres local, Docker Compose avanzado o un servidor MCP concreto, esta carpeta debe explicar como se instala o se verifica en Windows, macOS y Linux.

La boveda debe crecer como un manual operativo. Eso significa que cada problema frecuente que aparezca con alumnos reales se convierte en una nota, una checklist o una advertencia. Asi la formacion mejora con la practica.
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

Usar **GUIAS WINDOWS MAC LINUX** para producir el entregable definido en la metadata: **guia tecnica por sistema operativo**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **GUIAS WINDOWS MAC LINUX**.


## Fuentes oficiales complementarias

Estas fuentes se usan para verificar instrucciones tecnicas, compatibilidad y comportamiento de herramientas antes de convertir este archivo en clase, entrega o material comercial.

| Fuente | Uso recomendado |
|---|---|
| https://learn.microsoft.com/powershell/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://support.apple.com/guide/terminal/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://documentation.ubuntu.com/server/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://docs.docker.com/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
