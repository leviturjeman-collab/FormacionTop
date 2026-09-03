# Workflows n8n importables

Los workflows importables de la formación viven ahora en un único sitio, para
que no haya dos copias que se desincronicen:

**`35_AUTOMATIZACIONES_SKILLS_BIBLIOTECA/workflows_n8n_40/`**

Ahí están los 40 flujos reales, cada uno con su archivo `.json` importable en
n8n y su guía `.md` con las credenciales paso a paso (Telegram, WhatsApp
Business Cloud, Gmail, Google Sheets, Slack y las APIs de IA), la prueba con
cuatro casos y los errores típicos.

Además, cada kit institucional (`content/kits/` y la sección «Kits
institucionales» de la app) incluye su propio flujo importable específico del
dominio del kit.

Cómo importar cualquiera de ellos: en n8n, menú «Workflows» → «Import from
File» (o «Import from clipboard»), conecta las credenciales que pidan los
nodos en gris y ejecuta primero con el payload de prueba de su guía.
