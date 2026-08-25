---
titulo: "Windows"
tipo: "guia_sistema_operativo"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "guia_sistema_operativo", "transversal", "aplicacion"]
entregable: "guia tecnica por sistema operativo"
---
# Windows - Guia para ejecutar la formacion

## Objetivo

Esta guia explica como preparar y usar la boveda en Windows. Es especialmente importante porque la boveda actual esta en Windows y en OneDrive:

`C:\Users\Leviç\OneDrive\Desktop\Formacion\Formacion`

Windows funciona perfectamente para esta academia, pero hay que cuidar rutas, permisos, sincronizacion de OneDrive, terminal, encoding y herramientas de desarrollo. Si una persona recibe esta boveda y usa Windows, debe leer este documento antes de ejecutar laboratorios con Codex, n8n, GitHub Skills, Python, Node.js o Docker.

## Terminal recomendada

La terminal recomendada es PowerShell moderno. Tambien se puede usar Windows Terminal como aplicacion contenedora. En clases, conviene decir "abre PowerShell" para no confundir al alumno. Si usa Git Bash, WSL o CMD, algunos comandos cambian.

Comandos basicos:

```powershell
pwd
Get-ChildItem
Set-Location "C:\ruta\del\proyecto"
Get-Content .\archivo.md
New-Item -ItemType Directory -Path .\carpeta
```

Equivalencias utiles:

| Accion | PowerShell | macOS/Linux |
|---|---|---|
| Ver carpeta actual | `pwd` | `pwd` |
| Listar archivos | `Get-ChildItem` | `ls` |
| Entrar en carpeta | `Set-Location ruta` | `cd ruta` |
| Leer archivo | `Get-Content archivo` | `cat archivo` |
| Variable de entorno temporal | `$env:NOMBRE="valor"` | `export NOMBRE="valor"` |

## Rutas en Windows

Windows usa barras invertidas:

```text
C:\Users\Nombre\Proyecto
```

Pero muchas herramientas modernas aceptan tambien barras normales:

```text
C:/Users/Nombre/Proyecto
```

Para evitar errores, en PowerShell usa comillas cuando la ruta tenga espacios, acentos o caracteres especiales:

```powershell
Set-Location "C:\Users\Leviç\OneDrive\Desktop\Formacion\Formacion"
```

## OneDrive

OneDrive puede bloquear o retrasar cambios si esta sincronizando. Para proyectos de codigo, bases de datos locales, `node_modules`, entornos virtuales o Docker, es mejor trabajar fuera de OneDrive si aparecen errores raros. Para Obsidian, OneDrive puede ser comodo, pero hay que vigilar conflictos de sincronizacion.

Regla practica:

- Boveda de lectura y escritura normal: OneDrive esta bien.
- Proyecto con muchas dependencias: mejor `C:\Projects\Nombre`.
- Docker, repositorios grandes o builds pesadas: evitar OneDrive.

## Herramientas recomendadas

Instalar:

- Obsidian.
- Git for Windows.
- Node.js LTS.
- Python 3.
- Visual Studio Code o editor equivalente.
- Docker Desktop si se trabaja con n8n self-hosted, bases de datos o servicios locales.
- Windows Terminal.

Comprobar instalaciones:

```powershell
git --version
node --version
npm --version
python --version
docker --version
```

## Variables de entorno y API keys

En Windows, una variable temporal en PowerShell se define asi:

```powershell
$env:OPENAI_API_KEY="tu_clave"
```

Esto dura solo la sesion actual. Para proyectos reales, se recomienda usar `.env` y documentar claramente que ese archivo no debe subirse a GitHub. Si se usa Codex, Claude Code, n8n o scripts, el alumno debe saber donde se leen las variables y como se protegen.

## Problemas comunes

- Ruta con espacios sin comillas.
- OneDrive bloqueando archivos.
- Diferencias entre PowerShell y Bash.
- Python instalado como `py` en vez de `python`.
- Execution policy bloqueando scripts.
- Encoding raro en archivos con acentos.
- Docker Desktop no iniciado.
- Variables de entorno definidas en una terminal distinta.

## Checklist Windows antes de un proyecto

- La boveda abre en Obsidian.
- El proyecto esta en una ruta clara.
- PowerShell puede entrar en la carpeta.
- Git funciona.
- Node.js o Python funcionan si hacen falta.
- Docker esta iniciado si hace falta.
- Las API keys estan en `.env` o en el gestor correspondiente.
- No se suben secretos.
- Las rutas del documento usan formato Windows o explican equivalencias.

## Como adaptar instrucciones escritas para macOS o Linux

Muchas guias tecnicas de internet usan Bash. En Windows, el alumno puede encontrarse con comandos como `export`, `ls`, `cat`, `rm -rf` o rutas `/home/...`. Hay que traducir con cuidado. `export OPENAI_API_KEY="..."` se convierte en `$env:OPENAI_API_KEY="..."`. `cat archivo` se convierte en `Get-Content archivo`. `ls` suele funcionar como alias, pero en formacion conviene usar `Get-ChildItem` para que el alumno entienda que esta en PowerShell.

No se debe copiar un comando destructivo de Bash y adaptarlo sin pensar. En especial, borrar carpetas recursivamente en Windows requiere mucha atencion. Para una formacion de alumnos, evita comandos destructivos siempre que sea posible. Si hay que limpiar dependencias, explica la carpeta exacta y pide verificar la ruta antes.

## Codex, GitHub Skills y proyectos de codigo en Windows

Para Codex o proyectos con repositorios, Windows necesita Git correctamente instalado. Si el alumno usa VS Code, puede abrir terminal integrada en PowerShell. Debe comprobar:

```powershell
git status
node --version
npm --version
python --version
```

Si usa `Codex CLI`, el proyecto debe estar en una carpeta accesible y no bloqueada por sincronizacion. Para proyectos grandes, evita rutas dentro de OneDrive. Codex, linters, tests y gestores de paquetes pueden crear muchos archivos. OneDrive puede intentar sincronizarlos y provocar lentitud o conflictos.

## n8n en Windows

Hay dos caminos. El primero es n8n cloud, recomendado para alumnos que empiezan. El segundo es n8n self-hosted con Docker Desktop. Si se usa Docker, el alumno debe abrir Docker Desktop antes de ejecutar cualquier comando. Tambien debe saber que los puertos pueden estar ocupados y que algunas rutas montadas en contenedores se escriben distinto en Windows.

Para principiantes:

- Empezar con n8n cloud.
- Exportar workflows como JSON.
- Documentar credentials sin compartir secretos.
- Pasar a Docker solo cuando entienda workflows, nodes y executions.

## Que debe quedar escrito en cada proyecto Windows

Un proyecto listo para Windows debe indicar:

- Carpeta recomendada.
- Comandos PowerShell.
- Si funciona dentro de OneDrive o si conviene moverlo.
- Como definir variables temporales.
- Donde guardar `.env`.
- Como comprobar que Git, Node, Python o Docker funcionan.
- Que errores son propios de Windows.

Si el documento solo incluye comandos Bash, no esta listo para alumnos Windows.
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

Usar **Windows** para producir el entregable definido en la metadata: **guia tecnica por sistema operativo**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Windows**.


## Fuentes oficiales complementarias

Estas fuentes se usan para verificar instrucciones tecnicas, compatibilidad y comportamiento de herramientas antes de convertir este archivo en clase, entrega o material comercial.

| Fuente | Uso recomendado |
|---|---|
| https://learn.microsoft.com/powershell/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://learn.microsoft.com/windows/terminal/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://learn.microsoft.com/windows/wsl/ | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
| https://git-scm.com/doc | Verificar comandos, permisos, errores o criterios tecnicos relacionados |
