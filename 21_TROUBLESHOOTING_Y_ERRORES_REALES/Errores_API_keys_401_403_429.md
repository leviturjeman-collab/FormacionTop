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
