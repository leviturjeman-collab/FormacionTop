---
titulo: "Errores API keys 401 403 429"
tipo: "laboratorio_troubleshooting"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["ai-academy", "laboratorio_troubleshooting", "transversal", "aplicacion"]
entregable: "laboratorio reproducible con error y reparacion"
---
# Errores API keys, 401, 403 y 429

Los errores de API son inevitables. El alumno debe aprender a leerlos sin pánico.

## 401

Suele indicar autenticacion invalida o ausente. Revisar: variable de entorno, key copiada, comillas, prefijo, cuenta correcta y si la herramienta realmente esta leyendo la variable.

## 403

Suele indicar autenticacion valida pero permiso insuficiente. Revisar scopes, rol, organizacion, proyecto, plan, region o recurso bloqueado.

## 429

Suele indicar limite de rate o cuota. Revisar frecuencia, concurrencia, plan, reintentos, batch, backoff y coste.

## Practica

Configurar una llamada de prueba y romperla tres veces: key vacia, permiso incorrecto y exceso de llamadas. Documentar sintoma, evidencia y solucion.

## Prevencion

Usar nombres claros de variables, no pegar secretos en notas, separar dev/prod, limitar permisos y registrar errores sin exponer claves.


---

## Laboratorio: diagnosticar sin exponer la clave

Objetivo: distinguir una credencial rechazada, un permiso insuficiente y un límite de uso antes de cambiar la configuración. Usa el entorno de pruebas del proyecto y datos ficticios. No provoques una ráfaga de solicitudes para fabricar un 429: utiliza una respuesta simulada.

1. Guarda una solicitud que ya funcione, quitando Authorization, cookies y cualquier dato personal del registro que entregarás.
2. Prepara tres respuestas de prueba: estado 401 con mensaje de credencial inválida; estado 403 con recurso denegado; estado 429 con aviso de límite. El mensaje concreto depende del proveedor: conserva el cuerpo para decidir la causa.
3. Para 401, comprueba que el proceso recibe la variable esperada sin imprimir su valor. Reinicia el proceso si cambiaste su entorno y vuelve a enviar una sola solicitud.
4. Para 403, compara el recurso solicitado con los permisos de esa cuenta. Usa un recurso permitido; no amplíes todos los permisos para ocultar el fallo.
5. Para 429, respeta el tiempo de espera indicado por el servicio, si lo incluye, y limita los reintentos. Si el mensaje señala cuota agotada, repetir no recupera cuota: pausa el proceso y revisa el consumo.

Comprobación: entrega una tabla con estado, mensaje sin secretos, hipótesis, cambio y resultado. El tratamiento del 429 debe terminar tras un número acotado de intentos; los demás errores no deben entrar en un bucle. Si sigue fallando, conserva el identificador de solicitud y la hora para soporte, sin adjuntar la clave.
