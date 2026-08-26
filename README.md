---
title: Portal web de AI Professional Academy
type: aplicacion
status: listo_para_validacion
updated: 2026-08-18
---

# Portal web de AI Professional Academy

## Mapa de la experiencia actual

La interfaz está organizada por intención, no por carpetas internas:

- `Inicio`: elige si quieres aprender, crear un proyecto, automatizar, crear vídeo, elegir una herramienta o entender una palabra.
- `Programa`: base común paso a paso y especializaciones opcionales.
- `Mi proyecto`: ficha local del problema, usuario, resultado y herramientas previstas. Queda preparada para sincronizarse con una cuenta en una fase posterior.
- `Automatizaciones`: workflows importables y explicados por resultado: leads, contenido, datos, soporte, pruebas y seguridad. n8n es la referencia principal y se compara con otras plataformas.
- `Herramientas`: páginas detalladas con primeros pasos, vocabulario, errores, checklist, coste, créditos, tareas o tokens, y conexiones con otras herramientas.
- `Guías`: explicaciones de entrada para quien parte de cero.
- `Prompts`: biblioteca central y prompts contextuales. El build verifica que cada prompt tenga al menos 500 palabras.
- `Diccionario`: términos técnicos explicados en lenguaje normal, incluidos `localhost`, `portapapeles`, `puerto`, `token`, `API`, `webhook`, `build` y `deploy`.

La organización física de la bóveda sigue siendo una fuente editorial interna. El alumno entra por objetivos y resultados; las carpetas, categorías e índice técnico quedan como consulta avanzada.

## Versión 3.0: formación aplicada al proyecto

La web ya no presenta los archivos de Obsidian como lecciones ni abre Markdown completo. Obsidian funciona únicamente como fuente editorial interna. Durante el build, `scripts/build-content-index.mjs` transforma las 466 fuentes en recursos para el alumno con propósito, aplicación al proyecto, entregable, criterios de revisión y walkthrough ejecutable.

El programa obligatorio se ha reducido a 48 lecciones curadas organizadas en ocho módulos. Los 418 materiales restantes permanecen disponibles como apoyo adaptado y buscable, sin convertir toda la bóveda en una ruta automática.

Cada alumno crea una ficha de proyecto con problema, usuario, resultado y herramientas. Las prácticas utilizan esa ficha para contextualizar la acción. Una lección no se completa por leer: exige recorrer todos los pasos y guardar una evidencia en el registro del proyecto.

### Walkthroughs

Cada recurso contiene al menos cinco pasos estructurados con:

- fase del trabajo;
- lugar exacto donde realizar la acción;
- instrucción concreta;
- comando o archivo cuando existe;
- resultado observable esperado;
- evidencia obligatoria;
- área del proyecto que actualiza.

Los 40 workflows n8n leen su JSON real durante el build. El recorrido resultante explica cómo importar el archivo, identifica los nodos por nombre, indica qué revisar en cada nodo y termina con caso correcto, caso roto y documentación. Las guías con bloques de terminal convierten los comandos en pasos ejecutables con resultado esperado.

### Espacios del alumno

- `Inicio`: próxima práctica, proyecto y progreso por módulos.
- `Programa`: 48 lecciones curadas en ocho etapas.
- `Mi proyecto`: brief editable, hitos y registro automático de evidencias.
- `Taller`: validación local de payloads antes de conectar servicios.
- `Recursos`: 466 materiales adaptados con búsqueda y filtros.
- `Walkthrough`: ejecución guiada paso a paso con bloqueo por evidencia.

### Privacidad

La ficha, el progreso y las evidencias se guardan en `localStorage`. No se envían a ningún servicio externo. La exportación del proyecto produce un JSON local con brief y evidencias.

## Versión 2.0

La segunda versión convierte el portal en un sistema personalizado. En el primer acceso se pide nombre, objetivo, nivel y horas disponibles. Con esos datos se genera una ruta de 12 hitos extraída de los documentos reales, con duración estimada, progreso y entregable por etapa.

Se han añadido cinco objetivos: automatización de procesos, trabajo multi-LLM, creación de vídeo, programación de productos IA y venta/entrega de servicios. El perfil se puede cambiar en cualquier momento desde `Mi ruta`.

El nuevo Mentor realiza búsqueda ponderada dentro de la academia. No usa un modelo externo y no envía contenido fuera del navegador. Cada respuesta muestra fuentes concretas que se pueden abrir en el lector.

La demo ofrece ahora dos modos. `Simulación` mantiene todo en el navegador y permite enseñar aprobación humana. `Conectar n8n` envía un payload ficticio al webhook indicado y registra respuesta HTTP o errores de CORS, red y workflow. La URL no se persiste. Las últimas ocho ejecuciones se guardan localmente como centro de evidencias.

Las automatizaciones tienen filtros funcionales por área, complejidad y número orientativo de nodos. Las skills pueden copiarse completas y muestran una ruta de instalación compatible con la estructura de skills de Codex.

Esta carpeta contiene la aplicación web de la formación. No es una landing page: es el espacio de trabajo del alumno y del profesor. Lee el contenido real de la bóveda, crea un catálogo navegable y añade progreso, favoritos, búsqueda, mapas visuales, descarga de workflows y una demo funcional de automatización.

## Qué incluye

- Centro de mando con progreso, métricas, ruta recomendada y accesos rápidos.
- Onboarding profesional y rutas personalizadas por objetivo.
- Actividad de aprendizaje de los últimos siete días.
- Biblioteca con los documentos Markdown de la formación, búsqueda, filtros y lector integrado.
- Catálogo de 40 workflows n8n con explicación y descarga del JSON importable.
- Catálogo de 40 skills con contrato visual de activación, proceso y salida.
- Laboratorio con arquitecturas visuales para multi-LLM, RAG, vídeo y operaciones seguras.
- Demo funcional de cualificación de leads con validación, consentimiento, clasificación, aprobación humana, CRM, email y logs.
- Persistencia local de favoritos y documentos completados mediante `localStorage`.
- Buscador global con `Ctrl+K`.
- Mentor local con resultados respaldados por documentos de la academia.
- Impresión limpia de cualquier documento.
- Generador automático del catálogo y validador de contenido.
- Diseño responsive para escritorio, tableta y móvil.
- Historial local de evidencias de la demo y conexión opcional con n8n real.

## Arranque local

```powershell
cd "C:\Users\Leviç\OneDrive\Desktop\Formacion\Formacion\36_PORTAL_WEB_FORMACION"
npm install
npm run dev
```

La aplicación se abre en `http://127.0.0.1:4173`. Cada vez que se ejecuta `npm run dev`, el script `scripts/build-content-index.mjs` vuelve a leer la bóveda y regenera `public/catalog.json`. Por tanto, los documentos nuevos aparecen sin editar componentes React.

## Validación y compilación

```powershell
npm run validate
npm run test
npm run build
npm run preview
```

`npm run validate` comprueba que existen al menos 400 documentos, 40 workflows y 40 skills; también abre cada JSON de n8n, verifica que se pueda interpretar y exige un array `nodes`. `npm run test` añade comprobación TypeScript y compilación de producción.

## Arquitectura del contenido

```text
Bóveda Markdown
      │
      ▼
build-content-index.mjs
      │
      ├── catalog.json ──► biblioteca / buscador / lector
      │
      └── workflows/*.json ──► descargas importables
                               
React App ──► progreso local / favoritos / demo / mapas
```

La aplicación no modifica los documentos fuente. El índice generado contiene su contenido para poder leerlo en el navegador, pero la fuente de verdad sigue siendo la bóveda. Si se cambia un archivo, se vuelve a ejecutar `npm run index`.

## Demo funcional

La demo reproduce un vertical slice completo sin necesitar credenciales externas. Esto permite enseñar el proceso y sus estados antes de conectar servicios de pago. El flujo es:

1. El formulario crea un payload de lead.
2. Se comprueban campos obligatorios y consentimiento.
3. Un clasificador determinista simula la salida estructurada de un LLM.
4. El flujo se detiene en una puerta de aprobación humana.
5. Al aprobar, se simulan alta en CRM, email y registro de observabilidad.
6. La evidencia se exporta como JSON.

Para provocar un caso roto, se puede borrar el email o desactivar el consentimiento. Para probar el control humano, se puede rechazar la propuesta. La demo no envía datos fuera del navegador.

## Conexión real con n8n

La versión de producción sustituye cada simulación por una integración concreta:

| Etapa | Demo local | Producción recomendada |
|---|---|---|
| Entrada | Formulario React | Webhook n8n o formulario del producto |
| Validación | Reglas JavaScript | JSON Schema en nodo Code |
| Clasificación | Función local | OpenAI, Anthropic o LiteLLM con salida JSON |
| Aprobación | Botones locales | Slack, Teams o email con callback firmado |
| CRM | Evento simulado | HubSpot, Airtable, Supabase o Postgres |
| Email | Evento simulado | Resend, Gmail o Outlook |
| Evidencia | JSON descargable | Postgres + Sentry + panel de métricas |

Nunca se deben insertar claves de API en `src/`. Para un frontend desplegado, los secretos viven en n8n o en funciones de servidor. Una variable que empieza por `VITE_` queda expuesta al navegador y solo debe contener valores públicos.

## Publicación en Vercel

```powershell
npm install -g vercel
vercel login
vercel
vercel --prod
```

Configuración de proyecto:

- Framework preset: `Vite`.
- Build command: `npm run build`.
- Output directory: `dist`.
- Install command: `npm install`.
- Node.js: versión LTS compatible con Vite.

El índice se genera durante el build, por lo que en Vercel deben subirse también los documentos que sirven como fuente o adaptar el generador para descargar el contenido desde un repositorio privado, CMS o almacenamiento. Para una academia pública, conviene publicar únicamente la selección de materiales que corresponda al alumno autenticado.

## Privacidad y publicación

El catálogo generado incluye el contenido completo de los Markdown. No se debe desplegar públicamente si la bóveda contiene notas privadas, claves, datos personales o material reservado. Antes de publicar se recomienda crear una carpeta de contenido explícitamente público o añadir una propiedad de frontmatter como `visibility: public` y filtrar el generador.

La demo utiliza datos ficticios y funciona en memoria. No debe reemplazarse por datos reales hasta disponer de política de privacidad, base jurídica, plazo de conservación, control de acceso y procedimiento de borrado.

## Sistema visual

La dirección se denomina **centro de operaciones editorial**. Combina tipografía editorial para explicar y una estructura de panel operativo para actuar. La línea roja, los números de secuencia y los nodos cuadrados son el ancla reconocible de la interfaz. La paleta evita el aspecto de dashboard genérico: papel claro, tinta negra, rojo de decisión, cian para datos y amarillo para atención.

DFII: impacto 4, ajuste al contexto 5, viabilidad 5, rendimiento 4 y riesgo de consistencia 2. Resultado: `16`, limitado al máximo operativo de `15`. La interfaz prioriza velocidad, lectura y densidad controlada. Las animaciones son escasas y respetan `prefers-reduced-motion`.

## Próximas integraciones

La aplicación queda preparada para conectar autenticación, base de datos y analítica. El orden recomendado es Supabase Auth, Postgres para progreso, n8n para ejecuciones, Sentry para errores y PostHog para comprender dónde abandonan los alumnos. Es mejor validar el piloto local antes de añadir estas dependencias.
