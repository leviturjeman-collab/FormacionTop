---
titulo: "Ollama modelos locales lentitud y memoria"
tipo: "laboratorio_troubleshooting"
nivel: "transversal"
fase: "aplicacion"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-08-13"
fuentes: ["https://github.com/ollama/ollama", "https://ollama.com/library"]
tags: ["ai-academy", "laboratorio_troubleshooting", "transversal", "aplicacion"]
entregable: "laboratorio reproducible con error y reparacion"
---
# Ollama, modelos locales, lentitud y memoria

Los modelos locales fallan de forma distinta a los modelos cloud. El problema puede ser hardware, modelo, cuantizacion, contexto, concurrencia o configuracion.

## Sintomas

- Respuesta muy lenta.
- Equipo bloqueado.
- Modelo no carga.
- Salida de baja calidad.
- JSON invalido.
- Endpoint no responde.

## Diagnostico

Comprobar modelo, tamaño, memoria disponible, proceso activo, endpoint, prompt, streaming y logs. Probar modelo mas pequeño.

## Reparacion

Elegir modelo adecuado, reducir contexto, usar schema, bajar concurrencia, cerrar procesos, documentar requisitos y crear fallback.

## Practica

Comparar dos modelos con mismo prompt. BREAK: usar modelo demasiado grande. FIX: elegir modelo por tarea y hardware.


---
