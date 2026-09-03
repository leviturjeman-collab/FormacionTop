import { useMemo, useState } from 'react'
import { ArrowLeft, ExternalLink, Search, ShieldCheck, Sparkles, Star, Terminal } from 'lucide-react'

type SkillSource =
  | 'Claude'
  | 'OpenAI'
  | 'VoltAgent'
  | 'TestMu'
  | 'Trail of Bits'
  | 'Equipo oficial'
  | 'Comunidad'

type SkillItem = {
  name: string
  url: string
  why: string
  fit: string
  source: SkillSource
  repo: string
  repoUrl: string
  stars: number
}

type SkillGroup = {
  id: string
  title: string
  intro: string
  items: SkillItem[]
}

const REPOS = {
  anthropics: ['anthropics/skills', 'https://github.com/anthropics/skills', 173504],
  kdense: ['K-Dense-AI/scientific-agent-skills', 'https://github.com/K-Dense-AI/scientific-agent-skills', 42327],
  voltagent: ['VoltAgent/awesome-agent-skills', 'https://github.com/VoltAgent/awesome-agent-skills', 33696],
  openai: ['openai/skills', 'https://github.com/openai/skills', 25374],
  murat: ['muratcankoylan/Agent-Skills-for-Context-Engineering', 'https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering', 17918],
  orchestra: ['Orchestra-Research/AI-Research-SKILLs', 'https://github.com/Orchestra-Research/AI-Research-SKILLs', 12276],
  czlonkowski: ['czlonkowski/n8n-skills', 'https://github.com/czlonkowski/n8n-skills', 6175],
  bryce: ['brycewang-stanford/Auto-Empirical-Research-Skills', 'https://github.com/brycewang-stanford/Auto-Empirical-Research-Skills', 3665],
  snyk: ['snyk/agent-scan', 'https://github.com/snyk/agent-scan', 3002],
  clawsec: ['prompt-security/clawsec', 'https://github.com/prompt-security/clawsec', 1097],
  gareth: ['GarethManning/education-agent-skills', 'https://github.com/GarethManning/education-agent-skills', 726],
  ecommerceCopy: ['feichanggege/ecommerce-visual-copywriting-skill', 'https://github.com/feichanggege/ecommerce-visual-copywriting-skill', 692],
  amazon: ['nexscope-ai/Amazon-Skills', 'https://github.com/nexscope-ai/Amazon-Skills', 625],
  lambda: ['LambdaTest/agent-skills', 'https://github.com/LambdaTest/agent-skills', 365],
  medusa: ['medusajs/medusa-agent-skills', 'https://github.com/medusajs/medusa-agent-skills', 212],
  dsp: ['k-kolomeitsev/data-structure-protocol', 'https://github.com/k-kolomeitsev/data-structure-protocol', 65],
  clarity: ['frmoretto/clarity-gate', 'https://github.com/frmoretto/clarity-gate', 33],
  memory: ['awrshift/agent-memory-kit', 'https://github.com/awrshift/agent-memory-kit', 32],
} as const

const GROUPS: SkillGroup[] = [
  {
    id: 'nucleo',
    title: 'Núcleo para Claude, ChatGPT y Codex',
    intro: 'Skills de base para que el agente trabaje con método: crear skills, consultar docs, usar navegador, guardar contexto y producir entregables.',
    items: [
      skill('anthropics/skill-creator', 'https://officialskills.sh/anthropics/skills/skill-creator', 'Crear skills propios con estructura reutilizable.', 'Cuando quieres guardar tu forma exacta de trabajar.', 'Claude', REPOS.anthropics),
      skill('anthropics/template', 'https://officialskills.sh/anthropics/skills/template', 'Plantilla mínima para no improvisar cada skill.', 'Biblioteca personal o de equipo.', 'Claude', REPOS.anthropics),
      skill('anthropics/doc-coauthoring', 'https://officialskills.sh/anthropics/skills/doc-coauthoring', 'Coedición y revisión de documentos largos.', 'Trabajo editorial, institucional y formativo.', 'Claude', REPOS.anthropics),
      skill('anthropics/internal-comms', 'https://officialskills.sh/anthropics/skills/internal-comms', 'Comunicaciones internas, FAQs y briefs.', 'Equipos, soporte, alumnos y operaciones.', 'Claude', REPOS.anthropics),
      skill('openai/openai-docs', 'https://officialskills.sh/openai/skills/openai-docs', 'Consultar documentación oficial de OpenAI con menos riesgo de inventar.', 'APIs, modelos, Codex, Work y Responses.', 'OpenAI', REPOS.openai),
      skill('openai/browser', 'https://officialskills.sh/openai/skills/browser', 'Control de navegador para validar estados reales.', 'QA, formularios, demos y exploración web.', 'OpenAI', REPOS.openai),
      skill('openai/screenshot', 'https://officialskills.sh/openai/skills/screenshot', 'Capturas verificables de ventanas y regiones.', 'Auditoría visual y soporte.', 'OpenAI', REPOS.openai),
      skill('openai/notion-knowledge-capture', 'https://officialskills.sh/openai/skills/notion-knowledge-capture', 'Pasar conversaciones a una wiki útil.', 'Memoria de proyecto y documentación viva.', 'OpenAI', REPOS.openai),
      skill('openai/notion-spec-to-implementation', 'https://officialskills.sh/openai/skills/notion-spec-to-implementation', 'Convertir specs en tareas implementables.', 'Producto, ingeniería y gestión.', 'OpenAI', REPOS.openai),
      skill('openai/model-selection', 'https://officialskills.sh/openai/skills/model-selection', 'Escoger modelo y esfuerzo según tarea.', 'Coste, calidad y velocidad.', 'OpenAI', REPOS.openai),
    ],
  },
  {
    id: 'documentos',
    title: 'Documentos, datos y entregables',
    intro: 'Skills para convertir trabajos de oficina en entregables sólidos: Word, PDF, Excel, slides, notebooks, audio e imagen.',
    items: [
      skill('anthropics/docx', 'https://officialskills.sh/anthropics/skills/docx', 'Word sin perder formato, tablas ni estructura.', 'Informes, plantillas y contratos.', 'Claude', REPOS.anthropics),
      skill('anthropics/pptx', 'https://officialskills.sh/anthropics/skills/pptx', 'Crear y revisar presentaciones con criterio de slides.', 'Decks, clases y propuestas.', 'Claude', REPOS.anthropics),
      skill('anthropics/xlsx', 'https://officialskills.sh/anthropics/skills/xlsx', 'Hojas de cálculo con limpieza, fórmulas y análisis.', 'Reporting, operaciones y ventas.', 'Claude', REPOS.anthropics),
      skill('anthropics/pdf', 'https://officialskills.sh/anthropics/skills/pdf', 'Extraer, crear y revisar PDFs sin tratarlos como texto plano.', 'Contratos, formularios y entregables.', 'Claude', REPOS.anthropics),
      skill('openai/doc', 'https://officialskills.sh/openai/skills/doc', 'Documentos Word con render y verificación.', 'Entregables profesionales.', 'OpenAI', REPOS.openai),
      skill('openai/pdf', 'https://officialskills.sh/openai/skills/pdf', 'PDFs con control visual y extracción fiable.', 'Lectura, creación y formularios.', 'OpenAI', REPOS.openai),
      skill('openai/spreadsheet', 'https://officialskills.sh/openai/skills/spreadsheet', 'Spreadsheets con análisis y visualización.', 'CSV, Excel y reporting.', 'OpenAI', REPOS.openai),
      skill('openai/jupyter-notebook', 'https://officialskills.sh/openai/skills/jupyter-notebook', 'Experimentos reproducibles y notebooks limpios.', 'Datos, ciencia y demos técnicas.', 'OpenAI', REPOS.openai),
      skill('openai/imagegen', 'https://officialskills.sh/openai/skills/imagegen', 'Generación y edición de imágenes para proyectos.', 'Assets, mockups y campañas.', 'OpenAI', REPOS.openai),
      skill('openai/speech', 'https://officialskills.sh/openai/skills/speech', 'Audio hablado desde texto.', 'Clases, demos y accesibilidad.', 'OpenAI', REPOS.openai),
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend, UX y producto web',
    intro: 'Skills para que una app se sienta rápida, legible y lista para usuarios: diseño, testing visual, CI, deploy y performance.',
    items: [
      skill('anthropics/frontend-design', 'https://officialskills.sh/anthropics/skills/frontend-design', 'Dirección visual y ejecución frontend con criterio.', 'Apps, dashboards, portales y landing pages.', 'Claude', REPOS.anthropics),
      skill('anthropics/web-artifacts-builder', 'https://officialskills.sh/anthropics/skills/web-artifacts-builder', 'Artifacts web complejos con React.', 'Prototipos navegables en conversación.', 'Claude', REPOS.anthropics),
      skill('anthropics/webapp-testing', 'https://officialskills.sh/anthropics/skills/webapp-testing', 'Pruebas de apps locales con Playwright.', 'Validar lo que se ve y se clica.', 'Claude', REPOS.anthropics),
      skill('openai/playwright', 'https://officialskills.sh/openai/skills/playwright', 'Control real de navegador para formularios y pruebas.', 'QA, scraping responsable y flujos web.', 'OpenAI', REPOS.openai),
      skill('openai/gh-fix-ci', 'https://officialskills.sh/openai/skills/gh-fix-ci', 'Leer logs y arreglar checks de GitHub Actions.', 'PRs bloqueadas por CI.', 'OpenAI', REPOS.openai),
      skill('openai/gh-address-comments', 'https://officialskills.sh/openai/skills/gh-address-comments', 'Responder comentarios de review con cambios reales.', 'Pull requests activas.', 'OpenAI', REPOS.openai),
      skill('openai/cloudflare-deploy', 'https://officialskills.sh/openai/skills/cloudflare-deploy', 'Deploy en Workers, Pages y servicios Cloudflare.', 'Webs rápidas y APIs edge.', 'OpenAI', REPOS.openai),
      skill('openai/netlify-deploy', 'https://officialskills.sh/openai/skills/netlify-deploy', 'Deploys Netlify con CLI, entorno y linking.', 'Sitios y previews.', 'OpenAI', REPOS.openai),
      skill('openai/render-deploy', 'https://officialskills.sh/openai/skills/render-deploy', 'Deploys Git-backed en Render.', 'Backends y servicios web.', 'OpenAI', REPOS.openai),
      skill('openai/develop-web-game', 'https://officialskills.sh/openai/skills/develop-web-game', 'Juegos web iterados con Playwright y time-stepping.', 'Prototipos interactivos.', 'OpenAI', REPOS.openai),
    ],
  },
  {
    id: 'testing',
    title: 'Testing, QA y control de bugs',
    intro: 'Skills para comprobar comportamiento antes de publicar: web, API, móvil, CI, BDD y unit testing.',
    items: [
      skill('testmu-ai/playwright-skill', 'https://github.com/LambdaTest/agent-skills/tree/main/playwright-skill', 'E2E en TS, JS, Python, Java o C#.', 'Webs y apps interactivas.', 'TestMu', REPOS.lambda),
      skill('testmu-ai/cypress-skill', 'https://github.com/LambdaTest/agent-skills/tree/main/cypress-skill', 'E2E y component tests.', 'Frontends JS/TS.', 'TestMu', REPOS.lambda),
      skill('testmu-ai/jest-skill', 'https://github.com/LambdaTest/agent-skills/tree/main/jest-skill', 'Unit e integración con mocks.', 'React, Node y librerías.', 'TestMu', REPOS.lambda),
      skill('testmu-ai/pytest-skill', 'https://github.com/LambdaTest/agent-skills/tree/main/pytest-skill', 'pytest con fixtures y parametrización.', 'Python y backends.', 'TestMu', REPOS.lambda),
      skill('testmu-ai/api-skill', 'https://github.com/LambdaTest/agent-skills/tree/main/api-skill', 'Diseño, mocking, documentación y tests de APIs.', 'REST, GraphQL y gRPC.', 'TestMu', REPOS.lambda),
      skill('testmu-ai/cicd-pipeline-skill', 'https://github.com/LambdaTest/agent-skills/tree/main/cicd-pipeline-skill', 'Pipelines para tests en CI.', 'GitHub Actions, Jenkins y GitLab.', 'TestMu', REPOS.lambda),
      skill('testmu-ai/appium-skill', 'https://github.com/LambdaTest/agent-skills/tree/main/appium-skill', 'Automatización móvil Android/iOS.', 'Apps móviles.', 'TestMu', REPOS.lambda),
      skill('testmu-ai/flutter-testing-skill', 'https://github.com/LambdaTest/agent-skills/tree/main/flutter-testing-skill', 'Widget, integración y golden tests.', 'Flutter.', 'TestMu', REPOS.lambda),
      skill('testmu-ai/selenium-skill', 'https://github.com/LambdaTest/agent-skills/tree/main/selenium-skill', 'Selenium multi-lenguaje.', 'Suites legacy o cross-browser.', 'TestMu', REPOS.lambda),
      skill('voltagent/qa-release-gate', 'https://github.com/VoltAgent/awesome-agent-skills', 'Checklist y rutinas de QA para agentes.', 'Testing manual asistido y regresiones.', 'VoltAgent', REPOS.voltagent),
    ],
  },
  {
    id: 'seguridad',
    title: 'Seguridad, revisión y compliance',
    intro: 'Skills para detectar riesgos antes de que lleguen a producción: threat modeling, análisis estático, defaults inseguros y revisión de PR.',
    items: [
      skill('trailofbits/differential-review', 'https://officialskills.sh/trailofbits/skills/differential-review', 'Review de diff con foco en seguridad.', 'PRs sensibles.', 'Trail of Bits', REPOS.voltagent),
      skill('trailofbits/static-analysis', 'https://officialskills.sh/trailofbits/skills/static-analysis', 'CodeQL, Semgrep y SARIF.', 'Auditoría técnica.', 'Trail of Bits', REPOS.voltagent),
      skill('trailofbits/semgrep-rule-creator', 'https://officialskills.sh/trailofbits/skills/semgrep-rule-creator', 'Crear reglas Semgrep con pruebas.', 'Políticas de seguridad propias.', 'Trail of Bits', REPOS.voltagent),
      skill('trailofbits/property-based-testing', 'https://officialskills.sh/trailofbits/skills/property-based-testing', 'Pruebas por propiedades.', 'Lógica crítica y contratos.', 'Trail of Bits', REPOS.voltagent),
      skill('trailofbits/insecure-defaults', 'https://officialskills.sh/trailofbits/skills/insecure-defaults', 'Detectar defaults inseguros.', 'Config, secretos y crypto floja.', 'Trail of Bits', REPOS.voltagent),
      skill('openai/security-best-practices', 'https://officialskills.sh/openai/skills/security-best-practices', 'Revisiones de seguridad por lenguaje.', 'Antes de publicar.', 'OpenAI', REPOS.openai),
      skill('openai/security-threat-model', 'https://officialskills.sh/openai/skills/security-threat-model', 'Mapear amenazas y límites de confianza.', 'Arquitectura y producción.', 'OpenAI', REPOS.openai),
      skill('snyk/agent-scan', 'https://github.com/snyk/agent-scan', 'Escaneo de seguridad pensado para agentes.', 'Repos con dependencias, IaC y código sensible.', 'Comunidad', REPOS.snyk),
      skill('prompt-security/clawsec', 'https://github.com/prompt-security/clawsec', 'Hardening y review de Claude Code.', 'Proyectos con agentes de código.', 'Comunidad', REPOS.clawsec),
      skill('trailofbits/sharp-edges', 'https://officialskills.sh/trailofbits/skills/sharp-edges', 'APIs y patrones propensos a error.', 'Refactors y diseño de SDK.', 'Trail of Bits', REPOS.voltagent),
    ],
  },
  {
    id: 'backend',
    title: 'Backend, datos e infraestructura',
    intro: 'Skills para optimizar arquitectura real: bases de datos, edge, storage, cache, analytics e IA conectada a producto.',
    items: [
      skill('cloudflare/workers-best-practices', 'https://officialskills.sh/cloudflare/skills/workers-best-practices', 'Workers con convenciones de producción.', 'APIs y automatizaciones edge.', 'Equipo oficial', REPOS.voltagent),
      skill('cloudflare/agents-sdk', 'https://officialskills.sh/cloudflare/skills/agents-sdk', 'Agentes con estado, scheduling, RPC y MCP.', 'Agentes productivos.', 'Equipo oficial', REPOS.voltagent),
      skill('cloudflare/durable-objects', 'https://officialskills.sh/cloudflare/skills/durable-objects', 'Estado, WebSockets y coordinación.', 'Apps colaborativas y agentes.', 'Equipo oficial', REPOS.voltagent),
      skill('cloudflare/web-perf', 'https://officialskills.sh/cloudflare/skills/web-perf', 'Auditar Core Web Vitals y recursos bloqueantes.', 'Velocidad real de web.', 'Equipo oficial', REPOS.voltagent),
      skill('supabase/postgres-best-practices', 'https://officialskills.sh/supabase/skills/postgres-best-practices', 'Buenas prácticas PostgreSQL en Supabase.', 'Datos, auth y RLS.', 'Equipo oficial', REPOS.voltagent),
      skill('netlify/netlify-caching', 'https://officialskills.sh/netlify/skills/netlify-caching', 'Cache CDN y purgado.', 'Rendimiento y consistencia.', 'Equipo oficial', REPOS.voltagent),
      skill('duckdb/analytics-local', 'https://github.com/VoltAgent/awesome-agent-skills#skills-by-duckdb', 'Trabajo analítico local con DuckDB.', 'CSV, parquet y análisis rápido.', 'VoltAgent', REPOS.voltagent),
      skill('mongodb/project-data-modeling', 'https://github.com/VoltAgent/awesome-agent-skills#skills-by-mongodb', 'Patrones MongoDB para agentes.', 'Backends documentales.', 'VoltAgent', REPOS.voltagent),
      skill('redis/ops-memory-cache', 'https://github.com/VoltAgent/awesome-agent-skills#skills-by-redis', 'Caching, colas y memoria operacional.', 'Apps rápidas y agentes.', 'VoltAgent', REPOS.voltagent),
      skill('voltagent/semantic-layer', 'https://github.com/VoltAgent/awesome-agent-skills', 'Semantic layer en Snowflake, Databricks y BigQuery.', 'BI y datos empresariales.', 'VoltAgent', REPOS.voltagent),
    ],
  },
  {
    id: 'automatizacion',
    title: 'Automatización, MCP y agentes',
    intro: 'Skills para montar flujos que trabajan solos: n8n, MCP, herramientas, memoria y patrones de agentes.',
    items: [
      skill('czlonkowski/n8n-code-javascript', 'https://github.com/czlonkowski/n8n-skills/tree/main/skills/n8n-code-javascript', 'JavaScript dentro de nodos Code.', 'n8n con lógica propia.', 'Comunidad', REPOS.czlonkowski),
      skill('czlonkowski/n8n-code-python', 'https://github.com/czlonkowski/n8n-skills/tree/main/skills/n8n-code-python', 'Python dentro de n8n con límites claros.', 'Automatizaciones de datos.', 'Comunidad', REPOS.czlonkowski),
      skill('czlonkowski/n8n-expression-syntax', 'https://github.com/czlonkowski/n8n-skills/tree/main/skills/n8n-expression-syntax', 'Expresiones {{}} y variables $json/$node.', 'Flujos n8n fiables.', 'Comunidad', REPOS.czlonkowski),
      skill('czlonkowski/n8n-mcp-tools-expert', 'https://github.com/czlonkowski/n8n-skills/tree/main/skills/n8n-mcp-tools-expert', 'Selección de tools MCP y formatos.', 'Agentes con herramientas.', 'Comunidad', REPOS.czlonkowski),
      skill('czlonkowski/n8n-validation-expert', 'https://github.com/czlonkowski/n8n-skills/tree/main/skills/n8n-validation-expert', 'Errores de validación n8n.', 'Debugging de workflows.', 'Comunidad', REPOS.czlonkowski),
      skill('czlonkowski/n8n-workflow-patterns', 'https://github.com/czlonkowski/n8n-skills/tree/main/skills/n8n-workflow-patterns', 'Patrones webhook, HTTP, DB e IA.', 'Automatizaciones reutilizables.', 'Comunidad', REPOS.czlonkowski),
      skill('voltagent/create-voltagent', 'https://officialskills.sh/voltagent/skills/create-voltagent', 'Crear proyectos VoltAgent.', 'Agentes TypeScript.', 'Equipo oficial', REPOS.voltagent),
      skill('voltagent/voltagent-best-practices', 'https://officialskills.sh/voltagent/skills/voltagent-best-practices', 'Arquitectura de agentes, workflows y memoria.', 'Sistemas agentic.', 'Equipo oficial', REPOS.voltagent),
      skill('voltagent/workflow-as-code', 'https://github.com/VoltAgent/awesome-agent-skills', 'Versionar workflows y agentes como código.', 'Equipos que despliegan automatizaciones.', 'VoltAgent', REPOS.voltagent),
      skill('openai/mcp-tools', 'https://github.com/openai/skills', 'Conectar agentes a herramientas con permisos claros.', 'Automatizaciones con agentes locales.', 'OpenAI', REPOS.openai),
    ],
  },
  {
    id: 'contexto',
    title: 'Contexto, memoria y evaluación',
    intro: 'Skills para que el agente recuerde, mida, pregunte mejor y no pierda el norte en proyectos largos.',
    items: [
      skill('muratcankoylan/context-engineering', 'https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering', 'Context engineering para agentes.', 'Prompts, memoria y herramientas.', 'Comunidad', REPOS.murat),
      skill('muratcankoylan/tool-design', 'https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/tool-design', 'Diseñar herramientas que los agentes usan bien.', 'MCP, APIs y CLI.', 'Comunidad', REPOS.murat),
      skill('muratcankoylan/evaluation', 'https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/evaluation', 'Evaluaciones de sistemas agentic.', 'Calidad medible.', 'Comunidad', REPOS.murat),
      skill('muratcankoylan/memory-systems', 'https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/tree/main/skills/memory-systems', 'Memoria corta, larga y grafos.', 'Agentes persistentes.', 'Comunidad', REPOS.murat),
      skill('voltagent/awesome-agent-skills', 'https://github.com/VoltAgent/awesome-agent-skills', 'Mapa comunitario de skills y patrones.', 'Explorar nuevas piezas compatibles.', 'VoltAgent', REPOS.voltagent),
      skill('anthropics/consolidate-memory', 'https://github.com/anthropics/skills', 'Rutinas de limpieza y síntesis de memoria.', 'Repos con tareas largas.', 'Claude', REPOS.anthropics),
      skill('voltagent/agentic-harness-patterns', 'https://github.com/VoltAgent/awesome-agent-skills', 'Patrones de harness para agentes.', 'Ejecución repetible y observabilidad.', 'VoltAgent', REPOS.voltagent),
      skill('k-kolomeitsev/data-structure-protocol', 'https://github.com/k-kolomeitsev/data-structure-protocol', 'Memoria en grafo para agentes de código.', 'Contexto rápido y refactors seguros.', 'Comunidad', REPOS.dsp),
      skill('frmoretto/clarity-gate', 'https://github.com/frmoretto/clarity-gate', 'Verificación epistémica para RAG.', 'Investigación y fuentes.', 'Comunidad', REPOS.clarity),
      skill('awrshift/agent-memory-kit', 'https://github.com/awrshift/agent-memory-kit', 'Memoria persistente con hooks y síntesis diaria.', 'Trabajo multi-proyecto.', 'Comunidad', REPOS.memory),
    ],
  },
  {
    id: 'ecommerce',
    title: 'Ecommerce, marketing y crecimiento',
    intro: 'Skills para optimizar proyectos comerciales: producto, copy, catálogo, Amazon, conversión, campañas y creatividad.',
    items: [
      skill('openai/imagegen', 'https://officialskills.sh/openai/skills/imagegen', 'Visuales de producto, mockups y variantes.', 'Ecommerce, ads y contenido.', 'OpenAI', REPOS.openai),
      skill('openai/sora', 'https://officialskills.sh/openai/skills/sora', 'Vídeo corto generado o remezclado.', 'Campañas, demos y social.', 'OpenAI', REPOS.openai),
      skill('openai/speech', 'https://officialskills.sh/openai/skills/speech', 'Locuciones para demos y anuncios.', 'Contenido accesible y video marketing.', 'OpenAI', REPOS.openai),
      skill('figma/figma-implement-design', 'https://officialskills.sh/figma/skills/figma-implement-design', 'Pasar diseños de Figma a código con fidelidad.', 'Páginas de venta y producto.', 'Equipo oficial', REPOS.voltagent),
      skill('netlify/netlify-image-cdn', 'https://officialskills.sh/netlify/skills/netlify-image-cdn', 'Optimizar y transformar imágenes.', 'Catálogos, portfolios y tiendas.', 'Equipo oficial', REPOS.voltagent),
      skill('feichanggege/ecommerce-visual-copywriting-skill', 'https://github.com/feichanggege/ecommerce-visual-copywriting-skill', 'Copy visual para ecommerce.', 'Fichas de producto y creatividades.', 'Comunidad', REPOS.ecommerceCopy),
      skill('nexscope-ai/Amazon-Skills', 'https://github.com/nexscope-ai/Amazon-Skills', 'Skills para Amazon marketplace.', 'Listings, SEO y operaciones Amazon.', 'Comunidad', REPOS.amazon),
      skill('medusajs/medusa-agent-skills', 'https://github.com/medusajs/medusa-agent-skills', 'Operaciones de ecommerce sobre Medusa.', 'Tiendas headless.', 'Comunidad', REPOS.medusa),
      skill('anthropics/campaign-planning', 'https://github.com/anthropics/skills', 'Marketing operativo para agentes.', 'Campañas, calendario y copy.', 'Claude', REPOS.anthropics),
      skill('netlify/netlify-forms', 'https://officialskills.sh/netlify/skills/netlify-forms', 'Formularios HTML con antispam.', 'Captación, leads y soporte sencillo.', 'Equipo oficial', REPOS.voltagent),
    ],
  },
  {
    id: 'investigacion',
    title: 'Investigación, educación y verticales',
    intro: 'Skills para proyectos con rigor: research, formación, legal, construcción, análisis científico y aprendizaje guiado.',
    items: [
      skill('K-Dense-AI/scientific-agent-skills', 'https://github.com/K-Dense-AI/scientific-agent-skills', 'Skills de investigación científica.', 'Análisis, papers y revisión.', 'Comunidad', REPOS.kdense),
      skill('Orchestra-Research/AI-Research-SKILLs', 'https://github.com/Orchestra-Research/AI-Research-SKILLs', '77 skills para training, inference y MLOps.', 'IA avanzada e investigación.', 'Comunidad', REPOS.orchestra),
      skill('brycewang-stanford/Auto-Empirical-Research-Skills', 'https://github.com/brycewang-stanford/Auto-Empirical-Research-Skills', 'Skills para investigación empírica.', 'Datos, papers y experimentos.', 'Comunidad', REPOS.bryce),
      skill('GarethManning/progressive-hint-ladder', 'https://github.com/GarethManning/education-agent-skills/tree/main/skills/student-learning/progressive-hint-ladder', 'Pistas graduadas sin quitar pensamiento al alumno.', 'Formación y tutoría.', 'Comunidad', REPOS.gareth),
      skill('GarethManning/rubric-builder', 'https://github.com/GarethManning/education-agent-skills', 'Rúbricas para evaluar tareas.', 'Clases, cursos y academias.', 'Comunidad', REPOS.gareth),
      skill('GarethManning/lesson-planning', 'https://github.com/GarethManning/education-agent-skills', 'Planificación de clases asistida.', 'Programas formativos.', 'Comunidad', REPOS.gareth),
      skill('openai/legal-document-review', 'https://github.com/openai/skills', 'Revisión estructurada de documentos legales.', 'Documentos y flujos jurídicos.', 'OpenAI', REPOS.openai),
      skill('anthropics/legal-research', 'https://github.com/anthropics/skills', 'Investigación jurídica con cautela y fuentes.', 'Investigación jurídica y doc review.', 'Claude', REPOS.anthropics),
      skill('voltagent/domain-operations', 'https://github.com/VoltAgent/awesome-agent-skills', 'Skills para verticales operativos.', 'Construcción, inmobiliaria, salud y servicios.', 'VoltAgent', REPOS.voltagent),
      skill('trailofbits/ask-questions-if-underspecified', 'https://officialskills.sh/trailofbits/skills/ask-questions-if-underspecified', 'Forzar aclaraciones cuando falta requisito.', 'Encargos ambiguos y proyectos institucionales.', 'Trail of Bits', REPOS.voltagent),
    ],
  },
]

const INSTALL_PATHS = [
  ['Claude Code', '.claude/skills/', '~/.claude/skills/'],
  ['Codex', '.agents/skills/', '~/.agents/skills/'],
  ['Cursor', '.cursor/skills/', '~/.cursor/skills/'],
  ['GitHub Copilot', '.github/skills/', '~/.copilot/skills/'],
  ['Gemini CLI', '.gemini/skills/', '~/.gemini/skills/'],
]

function skill(
  name: string,
  url: string,
  why: string,
  fit: string,
  source: SkillSource,
  repoData: readonly [string, string, number],
): SkillItem {
  const [repo, repoUrl, stars] = repoData
  return { name, url, why, fit, source, repo, repoUrl, stars }
}

function sourceBadge(source: SkillSource) {
  if (source === 'Claude' || source === 'OpenAI' || source === 'Equipo oficial') return 'Oficial'
  if (source === 'Trail of Bits' || source === 'TestMu') return source
  return source
}

function formatStars(value: number) {
  if (value >= 100000) return `${(value / 1000).toFixed(1)}k`
  if (value >= 10000) return `${Math.round(value / 1000)}k`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  return String(value)
}

function sortByStars<T extends { item: SkillItem }>(items: T[]) {
  return [...items].sort((a, b) => b.item.stars - a.item.stars || a.item.name.localeCompare(b.item.name))
}

export default function Skills() {
  const [activeGroup, setActiveGroup] = useState(GROUPS[0].id)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const active = GROUPS.find((group) => group.id === activeGroup) || GROUPS[0]
  const all = useMemo(() => GROUPS.flatMap((group) => group.items.map((item) => ({ group, item }))), [])
  const total = all.length
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return sortByStars(active.items.map((item) => ({ group: active, item })))
    return sortByStars(all.filter(({ group, item }) =>
      `${group.title} ${item.name} ${item.why} ${item.fit} ${item.source} ${item.repo}`.toLowerCase().includes(needle),
    ))
  }, [active, all, query])

  function selectGroup(id: string) {
    setActiveGroup(id)
    setQuery('')
    setFocused(true)
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  }

  return (
    <div className={`st-page st-skill-page${focused ? ' is-focused' : ''}`}>
      <div className="st-page-title">
        <span className="st-kicker"><Sparkles size={12} /> Skills</span>
        <h1>Skills para optimizar proyectos</h1>
        <p>
          Biblioteca práctica de skills para Claude, ChatGPT, Codex, Cursor, Copilot y Gemini. Están agrupadas por uso
          real y ordenadas dentro de cada categoría por estrellas del repositorio o colección de GitHub que las aloja.
        </p>
      </div>

      <section className="st-skill-source-note">
        <ShieldCheck size={16} />
        <div>
          <strong>Ranking verificado en GitHub</strong>
          <p>Estrellas consultadas el 03 Sep 2026. Antes de instalar, revisa permisos, scripts, dependencias y el contenido de `SKILL.md`, sobre todo en repos comunitarios.</p>
        </div>
      </section>

      <section className="st-skill-stats" aria-label="Resumen de skills">
        <div><span>Selección</span><strong>{total}</strong><small>skills curadas</small></div>
        <div><span>Categorías</span><strong>{GROUPS.length}</strong><small>top por familia</small></div>
        <div><span>Ranking</span><strong>Stars</strong><small>repos GitHub</small></div>
        <div><span>Uso</span><strong>5+</strong><small>Claude, Codex, Cursor...</small></div>
      </section>

      <section className="st-skill-search">
        <label>
          <span>Buscar skill, uso, repo o plataforma</span>
          <span className="st-piece-search">
            <Search size={13} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="pdf, playwright, n8n, seguridad, memoria, ecommerce..." />
          </span>
        </label>
      </section>

      {focused && (
        <div className="st-inline-focusbar">
          <button type="button" className="st-btn-ghost" onClick={() => setFocused(false)}>
            <ArrowLeft size={12} /> Volver a todas las categorías
          </button>
          <span>{active.title}</span>
        </div>
      )}

      <section className={`st-skill-layout${focused ? ' focused' : ''}`}>
        <aside className="st-skill-groups" aria-label="Categorías de skills">
          {GROUPS.map((group, index) => (
            <button
              key={group.id}
              type="button"
              className={group.id === active.id && !query ? 'on' : ''}
              onClick={() => selectGroup(group.id)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{group.title}</strong>
              <small>{group.items.length} skills</small>
            </button>
          ))}
        </aside>

        <div className="st-skill-board">
          <header>
            <div>
              <span className="st-kicker">{query ? 'Resultados' : 'Categoría activa'}</span>
              <h2>{query ? 'Skills encontrados' : active.title}</h2>
              <p>{query ? `Buscando en los ${total} skills. Limpia la búsqueda para volver a las categorías.` : active.intro}</p>
            </div>
            <span>{filtered.length} visibles</span>
          </header>

          <div className="st-skill-grid">
            {filtered.map(({ group, item }, index) => (
              <a key={`${group.id}-${item.name}`} href={item.url} target="_blank" rel="noreferrer" className="st-skill-card">
                <span className="st-skill-rank"><Star size={11} /> #{String(index + 1).padStart(2, '0')} · {formatStars(item.stars)}</span>
                <strong>{item.name}</strong>
                <p>{item.why}</p>
                <small>{item.fit}</small>
                <span className="st-skill-repo">{item.repo}</span>
                <em>{sourceBadge(item.source)}</em>
                <ExternalLink size={13} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="st-skill-install">
        <div className="st-section-head">
          <div><span className="st-kicker"><Terminal size={12} /> Dónde se colocan</span><h2>Rutas habituales por asistente</h2></div>
          <span>Proyecto o global</span>
        </div>
        <div className="st-table">
          <table>
            <thead><tr><th>Asistente</th><th>Dentro del proyecto</th><th>Global</th></tr></thead>
            <tbody>
              {INSTALL_PATHS.map(([tool, project, global]) => (
                <tr key={tool}><td><strong>{tool}</strong></td><td><code>{project}</code></td><td><code>{global}</code></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
