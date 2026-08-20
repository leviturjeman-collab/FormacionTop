---
title: Plan de QA, piloto y publicación
type: plan_operativo
updated: 2026-08-18
---

# Plan de QA, piloto y publicación

## Puerta 1: calidad técnica

Ejecutar `npm run test`. Debe completarse el índice, validar 40 workflows, pasar TypeScript y producir `dist`. Revisar que `catalog.json` no contenga secretos ni documentos privados. Probar en escritorio a 1440×900, tableta a 768×1024 y móvil a 390×844.

Casos mínimos: abrir cada sección; buscar desde `Ctrl+K`; filtrar biblioteca; marcar completado; guardar favorito; imprimir un documento; descargar un workflow; cambiar los cuatro mapas; ejecutar la demo feliz; ejecutarla sin consentimiento; ejecutarla sin email; aprobar; rechazar; exportar evidencia; recargar y comprobar persistencia.

## Puerta 2: calidad pedagógica

Seleccionar una muestra de diez documentos y comprobar que cada uno responde: qué aprenderá el alumno, qué necesita, qué hará, qué puede fallar, qué entregará y cómo será evaluado. Las explicaciones extensas deben conservar ejemplos específicos y evitar repetición mecánica.

El buscador debe devolver resultados útiles para preguntas reales: “quiero hacer vídeos”, “quiero usar varios LLM”, “necesito automatizar leads”, “cómo instalo Vercel” y “cómo configuro variables de entorno”.

## Piloto con cinco perfiles

1. Persona sin programación: instalar, encontrar una ruta y completar una práctica.
2. Creador de contenido: localizar vídeo, transcripción, Remotion y publicación.
3. Profesional de automatización: importar un workflow y adaptar credenciales.
4. Programador: ejecutar un mini repo, pruebas y despliegue.
5. Empresa: evaluar seguridad, alcance, medición y entrega.

Cada participante debe realizar una tarea sin recibir instrucciones orales. Registrar dónde duda, qué términos no entiende, cuánto tarda y qué resultado produce. Las preguntas repetidas tres veces se convierten en mejora de navegación o contenido.

## Criterios de publicación

- Cero errores de compilación.
- Cero workflows JSON inválidos.
- Cero secretos detectados.
- Navegación completa con teclado.
- Texto legible y sin solapamientos en tres viewports.
- Demo feliz y tres casos rotos documentados.
- Aviso de privacidad y términos accesibles.
- Copia de seguridad de la versión publicada.
- Número de versión y fecha visibles.
- Proceso de rollback probado.

## Primera versión pública

La primera versión no necesita cuentas, pagos ni integración real. Puede funcionar como demo privada para validar estructura, valor y comprensión. La segunda versión añade autenticación y progreso sincronizado. La tercera añade ejecuciones reales de n8n bajo límites y permisos. La cuarta incorpora pagos, cohortes y analítica avanzada.

## Operación mensual

Ejecutar el script de revisión de repositorios, comprobar enlaces, actualizar estrellas y versiones, revisar precios y APIs oficiales, ejecutar todos los tests, inspeccionar métricas de uso y entrevistar al menos a un alumno. Publicar un changelog que distinga correcciones, contenido nuevo, cambios de herramientas y elementos retirados.

## Checklist de release

- [ ] Crear versión y changelog.
- [ ] Ejecutar `npm run test`.
- [ ] Revisar contenido público del catálogo.
- [ ] Generar build de producción.
- [ ] Probar build con `npm run preview`.
- [ ] Capturar escritorio y móvil.
- [ ] Desplegar preview en Vercel.
- [ ] Ejecutar smoke test sobre preview.
- [ ] Publicar producción.
- [ ] Guardar URL, commit y fecha.
- [ ] Verificar métricas y errores tras publicar.
- [ ] Mantener disponible el despliegue anterior para rollback.
