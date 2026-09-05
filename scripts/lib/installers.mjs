/**
 * Instaladores.
 *
 * Bloques de copiar y pegar que dejan la herramienta instalada y comprobada,
 * con su versión para Windows, Mac y Linux. Cada uno termina con un comando de
 * verificación: si eso responde, está listo.
 */

const win = (code) => ({ os: 'windows', label: 'Windows', shell: 'PowerShell', code })
const mac = (code) => ({ os: 'mac', label: 'Mac', shell: 'Terminal', code })
const linux = (code) => ({ os: 'linux', label: 'Linux', shell: 'bash', code })

export const INSTALLERS = {
  codex: {
    id: 'codex', title: 'Instalar Codex CLI',
    what: 'Cliente de terminal de OpenAI. Requiere Node.js; también puedes usar la aplicación de Codex.',
    tools: ['codex'], stages: ['asistentes', 'entorno'],
    variants: [win('npm install -g @openai/codex\ncodex --version\ncodex'), mac('npm install -g @openai/codex\ncodex --version\ncodex'), linux('npm install -g @openai/codex\ncodex --version\ncodex')],
    verify: 'codex --version muestra una versión y codex permite iniciar sesión.',
    fails: [['No se encuentra npm', 'Instala Node.js LTS y abre otra terminal.'], ['No aparece el modelo esperado', 'Comprueba las opciones disponibles en tu cuenta; no todos los modelos están habilitados para todos los usuarios.']],
    warning: 'Guía oficial: https://developers.openai.com/codex/quickstart',
  },
  entorno: {
    id: 'entorno',
    title: 'Dejar el ordenador listo para trabajar',
    what: 'Instala de una vez Python, Node.js, Git y VS Code. Es lo que hace falta antes de cualquier otra cosa del curso.',
    tools: ['python', 'node', 'git', 'vscode'],
    stages: ['entorno', 'fundamentos'],
    variants: [
      win(`# Copia las 6 líneas enteras y pégalas en PowerShell.
# Si te pide confirmar, acepta. Tarda unos 10 minutos.

winget install --id Python.Python.3.12 -e --accept-package-agreements
winget install --id OpenJS.NodeJS.LTS   -e --accept-package-agreements
winget install --id Git.Git             -e --accept-package-agreements
winget install --id Microsoft.VisualStudioCode -e --accept-package-agreements

# CIERRA PowerShell y ábrelo de nuevo. Si no, no encuentra lo instalado.
python --version; node --version; git --version`),

      mac(`# Copia todo y pégalo en Terminal.
# La primera línea instala Homebrew, que es el gestor de programas de Mac.

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install python@3.12 node git
brew install --cask visual-studio-code

# Comprobación
python3 --version && node --version && git --version`),

      linux(`# Copia todo y pégalo en la terminal (Ubuntu / Debian).

sudo apt update
sudo apt install -y python3 python3-pip python3-venv git curl

# Node.js LTS desde el repositorio oficial
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Comprobación
python3 --version && node --version && git --version`),
    ],
    verify: 'Las tres versiones impresas al final. Si alguna dice "no se reconoce" o "command not found", esa no se instaló.',
    fails: [
      ['winget no se reconoce', 'Tu Windows es antiguo. Instala "Instalador de aplicaciones" desde la Microsoft Store y vuelve a intentarlo.'],
      ['python abre la Microsoft Store', 'Windows trae un alias falso. Busca "Alias de ejecución de aplicaciones" en Configuración y desactiva las dos entradas de python.'],
      ['brew: command not found tras instalarlo', 'Homebrew te imprime dos líneas al terminar para añadirlo al PATH. Cópialas y ejecútalas.'],
      ['Permission denied en Linux', 'Falta sudo delante del comando.'],
    ],
  },

  ia: {
    id: 'ia',
    title: 'Instalar los asistentes de IA y configurar las claves',
    what: 'Deja instalados Claude Code y Ollama, y configura las claves de API en tu sistema para que cualquier proyecto las encuentre.',
    tools: ['claude-code', 'ollama'],
    stages: ['asistentes', 'fundamentos', 'agentes'],
    variants: [
      win(`# Requiere Node.js ya instalado (bloque anterior).

npm install -g @anthropic-ai/claude-code

# Modelos en local, sin coste ni internet una vez descargados
winget install --id Ollama.Ollama -e
ollama pull llama3.2

# Clave de API como variable de usuario permanente.
# Saca la tuya en console.anthropic.com  →  API Keys
setx ANTHROPIC_API_KEY "sk-ant-tu-clave-aqui"
setx OPENAI_API_KEY    "sk-tu-clave-aqui"

# CIERRA PowerShell y ábrelo de nuevo para que las variables existan.
claude --version; ollama --version`),

      mac(`npm install -g @anthropic-ai/claude-code

brew install ollama
ollama pull llama3.2

# Claves permanentes en tu perfil de shell
echo 'export ANTHROPIC_API_KEY="sk-ant-tu-clave-aqui"' >> ~/.zshrc
echo 'export OPENAI_API_KEY="sk-tu-clave-aqui"'        >> ~/.zshrc
source ~/.zshrc

claude --version && ollama --version`),

      linux(`npm install -g @anthropic-ai/claude-code

curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2

echo 'export ANTHROPIC_API_KEY="sk-ant-tu-clave-aqui"' >> ~/.bashrc
echo 'export OPENAI_API_KEY="sk-tu-clave-aqui"'        >> ~/.bashrc
source ~/.bashrc

claude --version && ollama --version`),
    ],
    verify: 'Que `claude --version` responda con un número, y que `ollama list` muestre llama3.2.',
    fails: [
      ['npm: permission denied al instalar global', 'En Mac y Linux, evita sudo npm. Configura un prefijo propio: npm config set prefix ~/.npm-global y añade ~/.npm-global/bin al PATH.'],
      ['La variable de entorno no aparece', 'setx y los .rc solo afectan a terminales NUEVAS. Cierra la actual y abre otra.'],
      ['authentication_error al usar la clave', 'Comprueba que no pegaste espacios ni comillas de más: echo $ANTHROPIC_API_KEY debe empezar por sk-ant-.'],
    ],
    warning: 'La clave de API es como la tarjeta de tu hotel: da acceso y se factura a tu nombre. Nunca la escribas dentro del código ni la subas a ningún sitio.',
  },

  automatizacion: {
    id: 'automatizacion',
    title: 'Levantar n8n y una base de datos en tu ordenador',
    what: 'Deja n8n funcionando en local junto a PostgreSQL con búsqueda vectorial, todo con Docker y en un solo comando.',
    tools: ['n8n'],
    stages: ['automatizacion', 'datos', 'entorno'],
    variants: [
      win(`# 1. Instala Docker Desktop y ÁBRELO (tiene que estar arrancado)
winget install --id Docker.DockerDesktop -e

# 2. Crea la carpeta del proyecto
mkdir $HOME\\ia-local; cd $HOME\\ia-local

# 3. Crea el archivo de servicios
@'
services:
  n8n:
    image: n8nio/n8n:latest
    ports: ["5678:5678"]
    environment:
      - GENERIC_TIMEZONE=Europe/Madrid
      - N8N_SECURE_COOKIE=false
    volumes: ["n8n_data:/home/node/.n8n"]
  db:
    image: pgvector/pgvector:pg16
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev_local
      POSTGRES_DB: proyecto
    volumes: ["db_data:/var/lib/postgresql/data"]
volumes:
  n8n_data:
  db_data:
'@ | Out-File -Encoding utf8 docker-compose.yml

# 4. Arranca
docker compose up -d
docker ps`),

      mac(`brew install --cask docker
open -a Docker          # arranca Docker Desktop y espera a que diga "running"

mkdir -p ~/ia-local && cd ~/ia-local

cat > docker-compose.yml <<'YAML'
services:
  n8n:
    image: n8nio/n8n:latest
    ports: ["5678:5678"]
    environment:
      - GENERIC_TIMEZONE=Europe/Madrid
      - N8N_SECURE_COOKIE=false
    volumes: ["n8n_data:/home/node/.n8n"]
  db:
    image: pgvector/pgvector:pg16
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev_local
      POSTGRES_DB: proyecto
    volumes: ["db_data:/var/lib/postgresql/data"]
volumes:
  n8n_data:
  db_data:
YAML

docker compose up -d && docker ps`),

      linux(`# Docker desde el script oficial
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER    # cierra sesión y vuelve a entrar tras esto

mkdir -p ~/ia-local && cd ~/ia-local

cat > docker-compose.yml <<'YAML'
services:
  n8n:
    image: n8nio/n8n:latest
    ports: ["5678:5678"]
    environment:
      - GENERIC_TIMEZONE=Europe/Madrid
      - N8N_SECURE_COOKIE=false
    volumes: ["n8n_data:/home/node/.n8n"]
  db:
    image: pgvector/pgvector:pg16
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev_local
      POSTGRES_DB: proyecto
    volumes: ["db_data:/var/lib/postgresql/data"]
volumes:
  n8n_data:
  db_data:
YAML

docker compose up -d && docker ps`),
    ],
    verify: 'Abre http://localhost:5678 en el navegador: tiene que salir la pantalla de bienvenida de n8n. Y `docker ps` debe listar dos contenedores.',
    fails: [
      ['Cannot connect to the Docker daemon', 'Docker Desktop no está arrancado. Ábrelo y espera al icono verde.'],
      ['port is already allocated', 'Ya tienes algo en ese puerto. Cambia el de tu lado: "5679:5678".'],
      ['n8n carga en blanco', 'Suele ser la cookie segura. La variable N8N_SECURE_COOKIE=false del archivo lo evita en local.'],
      ['Permission denied en Linux tras instalar Docker', 'Falta cerrar sesión y volver a entrar para que el grupo docker se aplique.'],
    ],
  },

  proyecto: {
    id: 'proyecto',
    title: 'Crear el proyecto de Python desde cero',
    what: 'Carpeta, entorno aislado, dependencias y estructura de archivos. Deja el proyecto listo para escribir código.',
    tools: ['python'],
    stages: ['entorno', 'fundamentos', 'datos', 'calidad'],
    variants: [
      win(`mkdir $HOME\\mi-proyecto-ia; cd $HOME\\mi-proyecto-ia

python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1        # verás (.venv) al principio de la línea

pip install anthropic openai python-dotenv pydantic requests
pip freeze > requirements.txt

# Estructura mínima
New-Item -ItemType Directory src, tests -Force
"ANTHROPIC_API_KEY=" | Out-File -Encoding utf8 .env
"ANTHROPIC_API_KEY=" | Out-File -Encoding utf8 .env.example
".venv/\`n.env\`n__pycache__/" | Out-File -Encoding utf8 .gitignore

git init; git add .; git commit -m "Proyecto inicial"`),

      mac(`mkdir -p ~/mi-proyecto-ia && cd ~/mi-proyecto-ia

python3 -m venv .venv
source .venv/bin/activate            # verás (.venv) al principio de la línea

pip install anthropic openai python-dotenv pydantic requests
pip freeze > requirements.txt

mkdir -p src tests
echo "ANTHROPIC_API_KEY=" > .env
echo "ANTHROPIC_API_KEY=" > .env.example
printf ".venv/\\n.env\\n__pycache__/\\n" > .gitignore

git init && git add . && git commit -m "Proyecto inicial"`),

      linux(`mkdir -p ~/mi-proyecto-ia && cd ~/mi-proyecto-ia

python3 -m venv .venv
source .venv/bin/activate

pip install anthropic openai python-dotenv pydantic requests
pip freeze > requirements.txt

mkdir -p src tests
echo "ANTHROPIC_API_KEY=" > .env
echo "ANTHROPIC_API_KEY=" > .env.example
printf ".venv/\\n.env\\n__pycache__/\\n" > .gitignore

git init && git add . && git commit -m "Proyecto inicial"`),
    ],
    verify: 'Que la línea de la terminal empiece por (.venv) y que `pip list` muestre anthropic y openai.',
    fails: [
      ['No se puede ejecutar Activate.ps1 en Windows', 'PowerShell bloquea scripts. Ejecuta una vez: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned'],
      ['pip install falla con "externally-managed-environment"', 'Estás instalando fuera del entorno virtual. Actívalo primero.'],
      ['El .env se subió a git', 'El .gitignore se creó después del commit. Ejecuta: git rm --cached .env y vuelve a commitear.'],
    ],
  },

  despliegue: {
    id: 'despliegue',
    title: 'Publicar el proyecto en internet',
    what: 'Sube el código a GitHub y lo publica en Vercel, con las variables de entorno configuradas.',
    tools: ['vercel', 'github', 'git'],
    stages: ['entrega', 'entorno'],
    variants: [
      win(`# 1. Autenticarse en GitHub
winget install --id GitHub.cli -e
gh auth login                       # elige HTTPS y sigue el navegador

# 2. Crear el repositorio y subirlo
gh repo create mi-proyecto-ia --private --source=. --remote=origin --push

# 3. Publicar en Vercel
npm install -g vercel
vercel login
vercel                              # preguntas del asistente: acepta lo que propone

# 4. Variables de entorno EN PRODUCCIÓN (no viajan desde tu .env)
vercel env add ANTHROPIC_API_KEY production
vercel --prod`),

      mac(`brew install gh
gh auth login

gh repo create mi-proyecto-ia --private --source=. --remote=origin --push

npm install -g vercel
vercel login
vercel

vercel env add ANTHROPIC_API_KEY production
vercel --prod`),

      linux(`sudo apt install -y gh || (curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && sudo apt update && sudo apt install -y gh)
gh auth login

gh repo create mi-proyecto-ia --private --source=. --remote=origin --push

npm install -g vercel
vercel login
vercel

vercel env add ANTHROPIC_API_KEY production
vercel --prod`),
    ],
    verify: 'Vercel te devuelve una URL terminada en .vercel.app. Ábrela: si carga, está publicado.',
    fails: [
      ['El despliegue funciona en local y falla en Vercel', 'Casi siempre falta una variable de entorno. Se definen por entorno: production, preview y development son distintos.'],
      ['gh auth login se queda colgado', 'Copia el código que muestra y pégalo en la web que te abre. Sin ese paso no continúa.'],
      ['Se subió el .env al repositorio', 'Revoca la clave inmediatamente en el panel del proveedor. Limpiar el historial viene después.'],
    ],
    warning: 'Las claves nunca viajan desde tu .env local. Se configuran aparte en el panel del servicio, y por eso el primer despliegue casi siempre falla si se olvidan.',
  },
}

/** Instaladores que corresponden a una lección, por herramientas y área. */
export function installersFor({ stageId, tools, title }) {
  const scored = Object.values(INSTALLERS).map((installer) => {
    // An area match alone must never attach another product's installer.
    if (!installer.tools.some((tool) => tools.includes(tool))) return { installer, score: 0 }
    let score = 0
    if (installer.stages.includes(stageId)) score += 3
    score += installer.tools.filter((tool) => tools.includes(tool)).length * 3
    if (new RegExp(installer.id, 'i').test(title)) score += 2
    if (/instal|setup|configur|entorno|empezar|arranque/i.test(title)) score += 2
    return { installer, score }
  })

  return scored
    .filter((item) => item.score >= 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => item.installer)
}
