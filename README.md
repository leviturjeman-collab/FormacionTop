---
title: Portal web de AI Professional Academy
type: aplicacion
status: cambios_locales_pendientes_de_activacion
updated: 2026-09-05
---

# AI Professional Academy — portal web

Aplicación web de la formación (Vite + React + TypeScript). No es una landing:
es el espacio de trabajo del alumno y del profesor. El contenido se genera en
build a partir de dos fuentes:

1. **`content/`** — el contenido curado escrito a mano (JSON): lecciones del
   Programa, guías fundamentales, kits institucionales, agentes, prompts,
   proyectos, presentaciones, glosario, preguntas y fichas de herramienta.
2. **Las carpetas numeradas de la bóveda** (`00_…` a `35_…`) — material de
   consulta ampliado que el build convierte en la biblioteca de apoyo.

La documentación interna del proyecto (este README, el changelog, los planes
de QA, el backlog y las auditorías) queda **excluida del curso**: el alumno
nunca la ve como lección.

## Qué ve el alumno (el menú, sección a sección)

- **Inicio** — su situación de hoy y el siguiente paso.
- **Programa** — la ruta guiada de lecciones en orden, con tareas verificables.
  Es la columna vertebral; su avance se mide en la barra del menú.
- **Mi proyecto** — proyectos independientes con diagnóstico, entregables,
  evidencias, pruebas, revisiones atribuidas, presupuesto y métricas de impacto.
- **Prompts** — biblioteca de prompts institucionales por tema y por
  herramienta, con huecos `[ASÍ]` rellenables. Solo se generan encargos
  pertinentes a cada herramienta (nada de «storyboard con Docker»).
- **Kits institucionales** — 20 proyectos completos, cada uno con brief,
  arquitectura propia, fases paso a paso, prompts, flujo n8n importable,
  pruebas, coste, legal, precios y defensa. Un kit por archivo en
  `content/kits/`.
- **Agentes** — biblioteca de agentes listos para instalar (subagentes de
  Claude Code, GPTs personalizados, flujos-agente de n8n y agentes por API
  con código), con instalación paso a paso, credenciales y prueba. Un agente
  por archivo en `content/agentes/`.
- **Herramientas** — una ficha por herramienta con guía, lecciones, prompts y
  (donde aplica) su biblioteca de automatizaciones con credenciales y prueba.
- **Preguntas** — FAQ con enlaces individuales, valoración de utilidad y consultas privadas que el alumno envía explícitamente al docente.
- **Diccionario** — glosario de cientos de términos con enlaces a lecciones.
- **Progreso** — avance, historial, exportación, restauración con vista previa y resolución de conflictos de sincronización.
- **Guías** — las bases, empezando por «¿Dónde está cada cosa?», el mapa de
  toda la formación.

Los contadores de la interfaz (lecciones, kits, workflows, prompts…) se
calculan siempre desde el contenido real en build: no hay cifras escritas a
mano que puedan quedarse desfasadas. Este README tampoco fija números; los
mínimos exigidos viven en `scripts/validate-content.mjs`.

## Automatizaciones: una única fuente de verdad

Los workflows n8n importables viven en
`35_AUTOMATIZACIONES_SKILLS_BIBLIOTECA/workflows_n8n_40/`: 40 flujos reales
con nodos de integración (Telegram, WhatsApp Business Cloud, Gmail, Google
Sheets, Slack, GitHub, APIs de IA), cada uno con su guía `.md` de
credenciales paso a paso, prueba de cuatro casos, errores típicos, coste y
aviso legal. Además, cada kit institucional embebe su propio flujo específico
del dominio. `34_…/workflows_n8n_importables/` es solo un puntero a la
biblioteca.

## Arranque local

```bash
npm ci
npm run test:setup # prepara Chromium y Python aislado para las pruebas
npm run dev        # regenera el índice y arranca Vite en http://127.0.0.1:4173
```

## Validación y compilación

```bash
npm run index              # regenera public/course.json y los iconos de marca
npm run validate           # comprobaciones de contenido (falla el build si algo descuadra)
npm run test:automations   # valida cada workflow n8n del repo y las guías de automatización
npm run test               # todo lo anterior + TypeScript + build de producción
npm run build              # build de producción (dist/)
```

`validate-content.mjs` comprueba, entre otras cosas: que ninguna
documentación interna se sirva como lección; que cada kit esté completo y no
comparta arquitectura, legal, precios, defensa ni flujo con otro (anti
clones); que cada agente tenga archivos, instalación y prueba; que los
prompts tengan corchetes rellenables y longitud mínima; y los mínimos de
kits, agentes, workflows y guías. `validate-workflows.mjs` aplica ~36
comprobaciones a cada flujo n8n del repo (estructura, triggers, conexiones,
expresiones, credenciales, secretos, colisiones de webhooks…).

## Arquitectura del contenido

```text
content/*.json  +  carpetas numeradas (00_…35_)
        │
        ▼
scripts/build-content-index.mjs   (lee; nunca modifica las fuentes)
        │
        ├── public/course-data/{es,en}/     ──► índice y contenido por ruta, tras sesión
        ├── public/course{,.en}.json        ──► compatibilidad y validadores
        └── public/generated/workflows/*.json ──► descargas importables
```

Si se cambia un archivo fuente, `npm run index` lo recoge; no hay que tocar
componentes React.

## Privacidad

Hay cuentas y sesiones verificadas en Supabase. Progreso, proyectos, evidencias y consultas se sincronizan con el servidor; existe una copia local por cuenta para recuperación. Salir conserva el trabajo. Las exportaciones contienen información del alumno y se descargan localmente. El docente autorizado puede consultar sus alumnos y responder consultas; los alumnos no pueden acceder a otras cuentas. La caché del navegador no sustituye un backup del servidor.

La organización debe definir retención, responsables y atención a solicitudes de eliminación antes de la puesta en marcha. Nunca se insertan secretos de proveedor en `src/`: una variable `VITE_*` queda expuesta al navegador. El cliente solo usa la clave pública de Supabase; las operaciones requieren además la sesión verificada.

La implementación nueva requiere las migraciones y configuración descritas en [el runbook de acceso](supabase/SECURE_ACCESS_RUNBOOK.md). No se ha aplicado automáticamente al backend existente. Las credenciales legacy se deshabilitan al migrar y deben restablecerse; preparar primero cuentas de ensayo y recuperación.

## Publicación en Vercel

Preset `Vite` · build `npm run build` · output `dist` · install `npm install`.
El índice se genera durante el build, así que el repositorio debe incluir las
fuentes de contenido. Un push a la rama conectada dispara el deploy.

Antes de publicar, ejecutar `npm test` y ensayar las migraciones en un entorno de prueba. Verificar después en preview que `/course-data/`, los JSON legacy y `/generated/` devuelven 401 sin sesión y que revocar una cuenta corta su acceso. Las pruebas locales no certifican las rutas ni la caché del CDN real. Los flujos externos requieren credenciales, permisos y prueba de aceptación por integración; una demo local no confirma la entrega de un correo ni un cambio real en un CRM.
