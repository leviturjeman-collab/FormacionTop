---
titulo: "Checklist entrega multisistema"
tipo: "guia_sistema_operativo"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "guia_sistema_operativo", "transversal", "aplicacion"]
entregable: "guia tecnica por sistema operativo"
---
# Checklist de entrega multisistema

Usa esta checklist antes de entregar cualquier leccion, laboratorio o proyecto a otra persona.

## Identificacion

- Nombre del archivo:
- Modulo:
- Tipo: leccion, laboratorio, proyecto, evaluacion, fuente o plantilla.
- Nivel tecnico: A, B, C, D o E.
- Sistemas compatibles: Windows, macOS, Linux.

## Requisitos

- Obsidian o editor Markdown.
- Navegador.
- Git.
- Terminal.
- Node.js.
- Python.
- Docker.
- Cuenta ChatGPT.
- Cuenta GitHub.
- Cuenta n8n.
- Cuenta Claude.
- Cuenta Google/Gemini.
- API keys.

## Instrucciones por sistema

### Windows

- Comandos en PowerShell.
- Rutas con comillas si hay espacios.
- Aviso si OneDrive puede molestar.
- Variables con `$env:NOMBRE="valor"`.

### macOS

- Comandos en Terminal/zsh.
- Rutas `/Users/nombre/...`.
- Homebrew si hace falta.
- Variables con `export NOMBRE="valor"`.

### Linux

- Comandos Bash.
- Indicar distribucion si importa.
- Avisar sobre `sudo`, permisos y Docker.
- Variables con `export NOMBRE="valor"`.

## Verificacion

- El alumno sabe donde esta la carpeta.
- El alumno sabe que comandos ejecutar.
- El alumno sabe donde poner secretos.
- El alumno sabe que salida esperar.
- El alumno sabe como detectar errores.
- Hay ``.
- Hay criterios de evaluacion.
- Hay fuentes oficiales.

## Prueba final antes de compartir

Antes de pasar la boveda, una carpeta o un proyecto a otra persona, haz una prueba como si fueras alumno nuevo. Abre el documento desde cero y comprueba si puedes responder sin preguntar:

- Que hago primero.
- Que necesito instalar.
- Que cuenta necesito.
- Que ordenador estoy usando.
- Que guia de sistema operativo debo abrir.
- Que comandos debo ejecutar.
- Que pasa si falla.
- Que debo entregar.
- Como se evalua.

Si hay un paso que depende de memoria oral del profesor, escribelo. La boveda debe reducir dependencia de explicaciones improvisadas.

## Señales de que una nota no esta lista

- Dice "ejecuta esto" sin explicar donde.
- Usa comandos Bash y PowerShell mezclados sin avisar.
- Pide API key sin decir donde ponerla.
- Usa una cuenta externa sin mencionar permisos.
- No tiene salida esperada.
- No incluye error provocado.
- No tiene evaluacion.
- No enlaza fuentes oficiales.
- No diferencia demo de produccion.

## Señales de que una nota esta bien preparada

- Se puede leer sola.
- Indica requisitos.
- Clasifica sistema operativo.
- Tiene pasos numerados.
- Incluye verificacion.
- Incluye errores y reparacion.
- Tiene criterio de terminado.
- Permite que el alumno explique lo aprendido.

## Uso en revision de calidad

Esta checklist debe usarse como control final. Si un documento parece completo pero no dice como ejecutarlo en el ordenador del alumno, todavia no esta terminado. Si una practica explica comandos pero no dice que salida esperar, tampoco esta terminada. Si un proyecto toca una API externa y no explica credenciales ni secretos, es peligroso.

La checklist no busca burocracia. Busca independencia del alumno. El objetivo es que la persona pueda avanzar sola, detectar errores, pedir ayuda con precision y defender su trabajo.

## Como pedir ayuda usando esta checklist

Si el alumno se bloquea, debe poder pedir ayuda con datos concretos. En vez de decir "no me funciona", debe decir: sistema operativo, nivel tecnico, paso exacto, comando ejecutado, salida recibida, salida esperada y que intento para repararlo. Esta forma de pedir ayuda reduce mucho el tiempo de soporte y entrena comunicacion profesional.

Plantilla de ayuda:

```text
Sistema operativo:
Proyecto o nota:
Nivel tecnico:
Paso donde falla:
Comando o accion:
Resultado esperado:
Resultado real:
Logs o captura:
Que he probado:
```

Esta plantilla puede copiarse en cualquier laboratorio avanzado.

## Decision final de publicacion

Antes de publicar, compartir o vender una practica, el responsable debe marcar una decision: lista, lista con advertencias o no lista. "Lista" significa que una persona puede seguirla sola. "Lista con advertencias" significa que funciona, pero requiere un perfil concreto o una cuenta especifica. "No lista" significa que todavia depende de explicacion oral, credenciales privadas, pasos no documentados o herramientas no verificadas.

Esta decision debe quedar escrita en la nota del proyecto o en la evaluacion correspondiente. Asi nadie confunde un borrador interno con material final para alumnos.

## Revision por otra persona

La prueba mas fiable es que otra persona intente seguir la practica sin ayuda. Esa persona debe anotar donde duda, donde falta un comando, donde no sabe que cuenta usar o donde no entiende la salida esperada. Esas dudas se convierten en mejoras del documento.

Una buena formacion no elimina todas las dificultades, pero si elimina ambiguedades innecesarias. El alumno puede esforzarse en aprender IA, agentes, workflows y automatizacion; no deberia perderse porque una ruta, una variable o un requisito no estaban escritos.

Cuando una practica supere esta revision, puede considerarse lista para integrarse en una clase, un documento entregable o una presentacion.

Esta revision debe repetirse cada vez que cambien herramientas, modelos, permisos, precios o interfaces.

En una academia viva, la compatibilidad no se revisa una sola vez. Un comando puede cambiar, una interfaz puede moverse, una API puede modificar autenticacion y una herramienta puede dejar de comportarse igual. Por eso esta checklist debe tratarse como mantenimiento preventivo. Revisarla antes de cada cohorte ahorra incidencias durante la clase.
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

Usar **Checklist entrega multisistema** para producir el entregable definido en la metadata: **guia tecnica por sistema operativo**. El archivo debe ayudar a entender, aplicar, verificar y explicar el tema sin depender de memoria externa.

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
- Si se detecta informacion generica, convertirla en ejemplo especifico de **Checklist entrega multisistema**.


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
