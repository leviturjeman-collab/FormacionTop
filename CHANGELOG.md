# Changelog del portal

> Las entradas anteriores a la 5.0.0 describen versiones retiradas del portal
> (Mentor, Taller, Recursos, catálogo de 48/466…). Se conservan como historia;
> el estado actual es el de la entrada más reciente y el README.

## 5.0.0 - 2026-09-03

### Coherencia y organización

- La documentación interna del proyecto (README, changelog, planes de QA,
  backlog, auditorías) queda excluida del curso: ya no aparece como lección.
- Todos los contadores de la interfaz se calculan desde el contenido real;
  `npm run validate` falla si algo descuadra (kits incompletos o clonados,
  agentes sin prueba, mínimos de workflows y guías, familias duplicadas).
- Una única fuente de verdad para los workflows n8n:
  `35_…/workflows_n8n_40/`; retiradas las copias vacías de `34_` y `27_`.
- Eliminado el portal antiguo (`src/_portal_antiguo/`) y el catálogo huérfano
  `student-catalog.json`, origen de las cifras desfasadas («150 lecciones»,
  «12 agentes»). La página Progreso ya no muestra el bloque de quiz vacío.

### Contenido nuevo

- 20 kits institucionales reales (uno por archivo en `content/kits/`), cada
  uno con arquitectura, fases, prompts, flujo n8n, pruebas, legal, precios y
  defensa propios. Desaparece la clonación de kits en build.
- Los 40 workflows n8n reconstruidos con nodos de integración reales
  (Telegram, WhatsApp Business Cloud, Gmail, Google Sheets, Slack, GitHub,
  APIs de IA) y guías de credenciales paso a paso.
- Nueva sección «Agentes»: biblioteca de agentes listos para instalar
  (Claude Code, GPTs personalizados, n8n y API con código).
- Nueva guía «¿Dónde está cada cosa?»: el mapa de toda la formación, primera
  de la sección Guías (ahora con orden pedagógico).

### Prompts

- La biblioteca solo genera encargos pertinentes a cada herramienta: se
  eliminan las plantillas absurdas («Crear un storyboard con Docker») y el
  relleno hasta cifras fijas.
- Fusionados los temas duplicados («… · Programa» / «… · Biblioteca
  anterior») en una única familia por tema.

### Visual

- Marca «AI Professional Academy» sin caja, con entrada animada palabra a
  palabra, tinta en movimiento, subrayado que se dibuja y destello periódico.
- Transiciones de sección más visibles y duraderas (~1,6-2 s), manteniendo el
  estilo minimalista y respetando `prefers-reduced-motion`.
- Revisión de espaciados y solapes en escritorio y móvil.

## 3.0.0 - 2026-08-18

### Cambio de producto

- Obsidian pasa a ser fuente interna y deja de mostrarse como curso.
- Capa pedagógica generada para los 466 recursos.
- Programa curado de 48 lecciones en ocho módulos.
- Interfaz rehecha como espacio de estudio sobrio.

### Walkthrough aplicado

- Paso actual, fase, ubicación exacta, acción y resultado esperado.
- Evidencia obligatoria para completar cada paso.
- Registro automático en la ficha del proyecto.
- Comandos copiables en guías técnicas.
- Descarga del JSON de trabajo en workflows n8n.
- Recorrido nodo por nodo generado desde los 40 JSON reales.
- Caso correcto, caso roto y reparación en cada workflow.

### Proyecto del alumno

- Ficha con problema, usuario, resultado, tipo y herramientas.
- Hitos calculados desde el progreso real.
- Registro cronológico de evidencias.
- Exportación local del proyecto completo.
- Taller para validar payloads antes de conectar servicios.

### Validación

- Test que exige 466 recursos adaptados y 48 lecciones.
- Test que impide exponer Markdown crudo en la capa del alumno.
- Test de integridad para todos los walkthroughs.

## 2.0.0 - 2026-08-18

### Aprendizaje personalizado

- Onboarding con nombre, objetivo, nivel y horas por semana.
- Cinco perfiles de objetivo con selección visual.
- Ruta personalizada de 12 hitos calculada desde el catálogo real.
- Duración estimada, entregables y progreso de la ruta.
- Registro local de actividad durante siete días.

### Investigación y contenidos

- Mentor local que encuentra fuentes sin enviar información a terceros.
- Plan de trabajo comprender, construir, verificar y defender.
- Dos nuevas secciones principales: `Mi ruta` y `Mentor`.
- Menú y buscador global actualizados para las nuevas áreas.

### Automatizaciones y skills

- Filtros de automatizaciones conectados a categorías reales.
- Etiquetas de nivel y número orientativo de nodos.
- Copia completa de cualquier skill al portapapeles.
- Ruta de instalación visible para `SKILL.md`.

### Demo funcional

- Selector entre simulación segura y webhook n8n.
- Envío HTTP real de payload cuando el usuario activa el modo n8n.
- Errores explicados para URL, HTTP, CORS y disponibilidad.
- Historial de ocho ejecuciones con estado, fecha y score.
- La URL del webhook permanece solo en memoria.

### Interfaz

- Nueva ruta viva como ancla visual del producto.
- Componentes responsive para onboarding, mentor, ruta y evidencias.
- Mejoras de densidad, jerarquía y controles en móvil.

## 1.0.0 - 2026-08-18

- Primera aplicación React/Vite.
- Catálogo de 466 documentos, 40 workflows y 40 skills.
- Biblioteca, progreso, favoritos, lector Markdown y buscador global.
- Mapas visuales y demo local con aprobación humana.
