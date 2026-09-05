---
titulo: "Windows macOS Linux rutas terminal y entorno"
tipo: "laboratorio_troubleshooting"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "laboratorio_troubleshooting", "transversal", "aplicacion"]
entregable: "laboratorio reproducible con error y reparacion"
---
# Windows, macOS, Linux, rutas, terminal y entorno

Muchos errores no son de IA, son de sistema operativo. La formacion debe enseñar diferencias practicas.

## Windows

Rutas con `C:\Users\...`, PowerShell, variables `$env:NOMBRE="valor"`, permisos, OneDrive, encoding y WSL si aplica.

## macOS

Terminal zsh, rutas `/Users/...`, Homebrew, permisos de privacidad, Gatekeeper y shells.

## Linux

Bash, permisos, paquetes, servicios, Docker, systemd y rutas `/home/...`.

## Errores comunes

Comillas mal puestas, rutas con espacios, variables no persistentes, comandos copiados de otro sistema, puerto ocupado o permisos insuficientes.

## Practica

Traducir una instruccion de instalacion a Windows, macOS y Linux. BREAK: usar comando de bash en PowerShell. FIX: adaptar sintaxis.


---

## Laboratorio: ejecutar desde la carpeta correcta

Objetivo: identificar shell, carpeta y variable de entorno antes de culpar al programa. Trabaja en una carpeta de pruebas con un espacio en su nombre y usa únicamente un valor ficticio.

En PowerShell, consulta la carpeta actual con `Get-Location`, lista sus archivos con `Get-ChildItem` y define `$env:ACADEMY_DEMO="prueba"`. En bash o zsh, usa `pwd`, `ls` y `export ACADEMY_DEMO="prueba"`. Estos valores afectan a la sesión y a los procesos que se inicien desde ella; una terminal ya abierta en otro lugar puede no recibirlos.

1. Crea una carpeta llamada «Prueba academia» desde el explorador. Abre una terminal dentro y comprueba la ubicación con el comando correspondiente.
2. Ejecuta el proyecto siguiendo su README desde esa carpeta. Si dice que no encuentra un archivo, compara la ruta indicada con el listado; no instales dependencias todavía.
3. Cierra la terminal y abre otra. Comprueba que entiendes qué configuración era de sesión y cuál se guarda de forma persistente.
4. Si una ruta contiene espacios, pásala entre comillas. En PowerShell usa `Set-Location -LiteralPath "ruta completa"`; en bash o zsh usa `cd "ruta completa"`.

Comprobación: entrega sistema operativo, shell, ruta de trabajo y salida del comando de ubicación. Si hay permiso denegado, verifica primero propiedad y destino del archivo; no ejecutes toda la instalación como administrador como solución automática. Si el error es de sintaxis, confirma que el comando pertenece a tu shell antes de cambiar el proyecto.
