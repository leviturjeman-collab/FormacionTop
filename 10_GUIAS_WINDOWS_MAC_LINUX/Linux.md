---
titulo: "Linux"
tipo: "guia_sistema_operativo"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "guia_sistema_operativo", "transversal", "aplicacion"]
entregable: "guia tecnica por sistema operativo"
---
# Linux - Guia para ejecutar la formacion

## Objetivo

Esta guia explica como ejecutar la academia en Linux. Linux es muy potente para desarrollo, servidores, Docker, n8n self-hosted, automatizaciones, agentes y proyectos de produccion. Tambien exige mas criterio con paquetes, permisos, servicios y distribuciones. El alumno debe saber que no todos los Linux usan el mismo gestor de paquetes.

## Terminal

La terminal habitual usa Bash, aunque puede haber zsh u otras shells.

Comandos basicos:

```bash
pwd
ls
cd /home/nombre/proyecto
cat archivo.md
mkdir carpeta
```

Rutas tipicas:

```text
/home/nombre/Formacion
/home/nombre/projects/mi-proyecto
```

## Gestores de paquetes

Depende de la distribucion:

| Distribucion | Gestor |
|---|---|
| Ubuntu/Debian | `apt` |
| Fedora | `dnf` |
| Arch | `pacman` |

Ejemplo Ubuntu/Debian:

```bash
sudo apt update
sudo apt install git nodejs npm python3 python3-venv
```

En cursos para publico general, conviene usar Ubuntu como referencia si no se especifica otra distribucion.

## Permisos

Linux separa permisos de usuario, grupos y `sudo`. El alumno debe evitar ejecutar todo como root. Si un comando necesita privilegios, debe entender por que. Para proyectos de IA, automatizacion y n8n, los errores de permisos pueden aparecer con Docker, carpetas montadas, puertos, servicios o archivos creados por otro usuario.

Regla practica:

- No usar `sudo` sin motivo.
- No guardar proyectos dentro de carpetas del sistema.
- Revisar propietario con `ls -la`.
- Usar entornos virtuales para Python.
- Documentar servicios que se inician.

## Docker y n8n

Linux es muy adecuado para n8n self-hosted. Si se usa Docker, el alumno debe tener Docker instalado y su usuario debe poder ejecutarlo. En algunos sistemas hace falta anadir el usuario al grupo `docker`.

Comprobacion:

```bash
docker --version
docker ps
```

Si `docker ps` falla por permisos, revisar instalacion y grupo. En una formacion para principiantes, conviene evitar convertir Docker en una barrera temprana: primero n8n cloud o ejercicios sin self-hosting, despues Docker.

## Variables de entorno

Igual que en macOS:

```bash
export OPENAI_API_KEY="tu_clave"
```

Para proyectos, usar `.env`, variables del servicio o gestor de secretos. Nunca subir claves a Git.

## Problemas comunes

- Paquetes con nombres distintos por distribucion.
- Versiones antiguas en repositorios del sistema.
- Permisos de Docker.
- Puertos ocupados.
- Servicios no iniciados.
- Node.js demasiado antiguo.
- Python sin `venv`.
- Firewall o red bloqueando servicios locales.

## Checklist Linux antes de un proyecto

- La boveda abre en Obsidian o editor Markdown.
- Terminal entra en la carpeta.
- Git funciona.
- Node.js o Python funcionan si hacen falta.
- Docker funciona si hace falta.
- El usuario tiene permisos adecuados.
- Las API keys estan fuera de Git.
- Los comandos del laboratorio indican distribucion o alternativa.

## Como adaptar instrucciones escritas para Windows o macOS

Linux comparte muchas instrucciones con macOS porque ambos usan shells tipo Unix, pero no son identicos. Homebrew no suele ser el camino principal en Linux. En Ubuntu o Debian se usa `apt`; en Fedora, `dnf`; en Arch, `pacman`. Si una practica dice simplemente "instala con brew", no esta lista para Linux salvo que indique alternativa.

Las rutas tambien cambian. Una ruta macOS `/Users/nombre/...` suele convertirse en `/home/nombre/...`. Una ruta Windows `C:\Users\Nombre\...` debe reescribirse por completo. Las variables de entorno se definen con `export`, igual que en macOS.

## Produccion y servidores

Linux suele aparecer en dos contextos: ordenador personal tecnico o servidor. En servidor no hay interfaz grafica, no hay Obsidian visual y puede no haber navegador. Si un proyecto se va a ejecutar en servidor, la documentacion debe explicar comandos, servicios, logs, puertos y permisos. No basta con "abre la app".

Para n8n, MCP servers, bases de datos o agentes de produccion, Linux es muy habitual. Por eso la formacion debe ensenar:

- Donde se guardan variables.
- Como se inicia un servicio.
- Como se revisan logs.
- Que usuario ejecuta el proceso.
- Que puertos se abren.
- Que firewall existe.
- Como se actualiza sin romper.

## Entornos Python y Node

En Linux conviene usar entornos virtuales para Python:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Para Node.js, algunas distribuciones tienen versiones antiguas. Si un proyecto requiere una version moderna, debe indicarlo y proponer instalacion adecuada. Un error de version no es un error de IA; es un error de entorno.

## Que debe quedar escrito en cada proyecto Linux

Un proyecto listo para Linux debe indicar:

- Distribucion de referencia.
- Comandos Bash.
- Gestor de paquetes.
- Si necesita `sudo` y por que.
- Usuario recomendado.
- Permisos de Docker si aplica.
- Puertos usados.
- Variables y secretos.
- Logs y verificacion.

Si el proyecto toca servicios o produccion y no explica permisos, no esta listo.

## Cierre pedagogico

Linux debe presentarse como entorno potente, no como castigo tecnico. Para alumnos avanzados, es el camino natural hacia servidores, automatizaciones persistentes, n8n self-hosted, bases de datos y agentes de produccion. Para alumnos principiantes, puede ser demasiado pronto. La boveda debe permitir ambas rutas: primero entender el flujo en navegador o cloud, despues llevarlo a Linux cuando el alumno ya entiende entradas, salidas, permisos y logs.

La documentacion debe ser especialmente clara con comandos que usan `sudo`, cambios de permisos, puertos y servicios. Esos pasos tienen impacto real.
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

Usar **Linux** para producir el entregable definido en la metadata: **guia tecnica por sistema operativo**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Linux**.


## Fuentes oficiales complementarias

Estas fuentes se usan para verificar instrucciones tecnicas, compatibilidad y comportamiento de herramientas antes de convertir este archivo en clase, entrega o material comercial.

| Fuente | Uso recomendado |
|---|---|
| https://documentation.ubuntu.com/server/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://docs.kernel.org/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://git-scm.com/doc | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://docs.docker.com/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
