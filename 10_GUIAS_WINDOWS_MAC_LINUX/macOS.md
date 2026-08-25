---
titulo: "macOS"
tipo: "guia_sistema_operativo"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "guia_sistema_operativo", "transversal", "aplicacion"]
entregable: "guia tecnica por sistema operativo"
---
Gracias. # macOS - Guia para ejecutar la formacion

## Objetivo

Esta guia explica como ejecutar la academia en macOS. Muchos alumnos creativos, perfiles de producto, diseno o desarrollo usan Mac. macOS es excelente para trabajar con Obsidian, terminal, Git, Node.js, Python, Docker, Codex, Claude Code y proyectos web, pero tiene particularidades: usa zsh por defecto, rutas Unix, permisos de sistema, Homebrew y diferencias entre Intel y Apple Silicon.

## Terminal recomendada

La terminal por defecto de macOS usa zsh. Para la mayoria de practicas, se puede decir simplemente "abre Terminal".

Comandos basicos:

```bash
pwd
ls
cd /Users/nombre/proyecto
cat archivo.md
mkdir carpeta
```

Rutas tipicas:

```text
/Users/nombre/Documents/Formacion
/Users/nombre/Projects/mi-proyecto
```

## Homebrew

Homebrew es el gestor de paquetes mas habitual en macOS. Permite instalar herramientas de desarrollo de forma consistente.

Comprobacion:

```bash
brew --version
```

Herramientas recomendadas:

```bash
brew install git
brew install node
brew install python
```

Docker Desktop se suele instalar desde su web oficial o con Homebrew Cask si el alumno ya lo usa.

## Apple Silicon e Intel

Los Mac modernos pueden usar Apple Silicon. Algunas herramientas tienen versiones distintas o rutas diferentes. En la mayoria de casos actuales, Node.js, Python, Git y Docker funcionan bien, pero si aparece un error de arquitectura, el alumno debe revisar si esta instalando version ARM o Intel.

Regla practica:

- Usar instaladores actuales.
- Preferir versiones LTS.
- Evitar mezclar instalaciones manuales y Homebrew sin saberlo.
- Documentar `node --version`, `python --version` y `arch` si hay errores.

## Variables de entorno

En macOS, una variable temporal se define asi:

```bash
export OPENAI_API_KEY="tu_clave"
```

Esto dura la sesion actual. Para proyectos, se recomienda `.env`, gestor de secretos o variables configuradas en el entorno de despliegue. Nunca se deben subir claves a GitHub.

## Permisos

macOS puede pedir permisos para acceder a carpetas como Desktop, Documents o Downloads. Si una herramienta no puede leer archivos, puede ser un problema de permisos del sistema. Tambien puede aparecer Gatekeeper al abrir apps descargadas. El alumno debe distinguir un error de permisos del sistema de un error del proyecto.

## n8n y Docker

Para n8n self-hosted, Docker Desktop debe estar iniciado. Si el curso usa n8n cloud, no hace falta Docker. La guia de cada laboratorio debe decirlo explicitamente.

Checklist para n8n:

- Docker abierto si es self-hosted.
- Puertos disponibles.
- Variables de entorno configuradas.
- Credenciales separadas del repositorio.
- Workflows exportados y documentados.

## Problemas comunes

- Homebrew no instalado.
- Herramientas duplicadas por instalaciones distintas.
- Permisos de carpeta.
- Docker no iniciado.
- Versiones antiguas de Node.js.
- Variables definidas en otra terminal.
- Diferencias de comandos frente a PowerShell.

## Checklist macOS antes de un proyecto

- Obsidian abre la boveda.
- Terminal entra en la carpeta del proyecto.
- Git funciona.
- Node.js o Python funcionan si hacen falta.
- Docker funciona si hace falta.
- Las rutas estan en formato `/Users/...`.
- Las API keys estan fuera de Git.
- El laboratorio indica equivalencias si venia escrito para Windows.

## Como adaptar instrucciones escritas para Windows

Si una practica viene de Windows, macOS necesitara cambiar rutas y variables. Una ruta como `C:\Users\Nombre\Proyecto` no existe. Debe convertirse en algo como `/Users/nombre/Projects/proyecto`. Una variable PowerShell como `$env:OPENAI_API_KEY="valor"` debe convertirse en `export OPENAI_API_KEY="valor"`.

Tambien cambia la forma de abrir archivos o listar carpetas. En macOS se usa `ls`, `cat`, `mkdir`, `rm` y `cd`. Aun asi, la formacion debe evitar asumir que todo alumno domina terminal. Cada comando debe tener una razon visible. No se ejecuta nada "porque si"; se ejecuta para verificar instalacion, crear una carpeta, iniciar un servicio, correr tests o revisar logs.

## Codex, Claude Code y repositorios en macOS

macOS es un entorno muy comodo para agentes de codigo porque combina terminal Unix, editores modernos y buena compatibilidad con herramientas web. Para proyectos con Codex o Claude Code, el alumno debe trabajar en una carpeta clara, preferiblemente fuera de iCloud Drive si el proyecto genera muchas dependencias o cambios rapidos.

Antes de empezar:

```bash
git --version
node --version
npm --version
python3 --version
```

En macOS a veces `python` no apunta a Python 3. Es frecuente usar `python3`. Si una practica usa Python, debe indicar el comando correcto.

## n8n y servicios locales

Para n8n self-hosted, Docker Desktop debe estar abierto. Si el alumno usa Apple Silicon, debe usar versiones actuales de imagenes y herramientas. En practicas introductorias, n8n cloud reduce friccion. En practicas avanzadas, Docker permite trabajar con entornos mas parecidos a produccion.

## Que debe quedar escrito en cada proyecto macOS

Un proyecto listo para macOS debe indicar:

- Rutas tipo `/Users/nombre/...`.
- Comandos zsh/Bash.
- Si hace falta Homebrew.
- Versiones esperadas de Node, Python o Docker.
- Como definir variables con `export`.
- Donde guardar `.env`.
- Que hacer si macOS bloquea permisos de carpeta.

Si la practica solo dice "abre PowerShell" o usa rutas Windows, no esta preparada para Mac.

## Cierre pedagogico

En macOS, la clave es no asumir que el alumno domina terminal solo porque el sistema sea amigable para desarrollo. Cada laboratorio debe explicar que hace cada comando y que salida se espera. Si el alumno entiende la razon de `git status`, `node --version`, `python3 --version` o `docker ps`, podra transferir ese conocimiento a otros proyectos. Si solo copia comandos, se bloqueara en cuanto cambie una version o una ruta.

Por eso esta guia debe enlazarse desde cualquier practica que requiera ejecucion local en Mac.
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

Usar **macOS** para producir el entregable definido en la metadata: **guia tecnica por sistema operativo**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **macOS**.


## Fuentes oficiales complementarias

Estas fuentes se usan para verificar instrucciones tecnicas, compatibilidad y comportamiento de herramientas antes de convertir este archivo en clase, entrega o material comercial.

| Fuente | Uso recomendado |
|---|---|
| https://support.apple.com/guide/terminal/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://support.apple.com/guide/mac-help/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://brew.sh/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://git-scm.com/doc | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
