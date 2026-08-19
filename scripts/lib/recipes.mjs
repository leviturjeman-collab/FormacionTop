/**
 * Recetario de código real.
 *
 * Cada receta es código que funciona, listo para copiar y pegar, con la
 * explicación de qué hace cada parte, para qué sirve, qué error vas a ver y
 * cómo adaptarlo a tu proyecto.
 *
 * No sale del vault: está escrito a mano aquí. Se asigna a las lecciones por
 * las herramientas que mencionan y por su área.
 */

const r = (data) => data

export const RECIPES = [
  /* ---------------------------------------------------------------- */
  r({
    id: 'env-secretos',
    match: /\.env|variable de entorno|secret|credencial|clave api|api ?key/i,
    stages: ['entorno', 'seguridad', 'fundamentos'],
    tools: ['python', 'node'],
    title: 'Guardar y leer una clave de API sin filtrarla',
    what: 'Es la forma correcta de que tu programa use una clave secreta sin que esa clave esté escrita dentro del código.',
    why: 'Cualquier código acaba compartiéndose, subiéndose a GitHub o copiándose a otro ordenador. Si la clave va dentro, viaja con él. Los bots que rastrean repositorios públicos encuentran claves en cuestión de minutos.',
    lang: 'python',
    code: `# archivo: .env  (NUNCA se sube al repositorio)
ANTHROPIC_API_KEY=sk-ant-tu-clave-aqui
DATABASE_URL=postgresql://usuario:contrasena@localhost:5432/mi_proyecto

# ------------------------------------------------------------------
# archivo: .gitignore  (esto SÍ se sube)
.env
.env.local

# ------------------------------------------------------------------
# archivo: .env.example  (esto SÍ se sube: documenta sin revelar)
ANTHROPIC_API_KEY=
DATABASE_URL=

# ------------------------------------------------------------------
# archivo: config.py
import os
from dotenv import load_dotenv

load_dotenv()                                    # lee el archivo .env

API_KEY = os.environ.get("ANTHROPIC_API_KEY")
if not API_KEY:
    raise RuntimeError(
        "Falta ANTHROPIC_API_KEY. Copia .env.example a .env y rellénala."
    )`,
    lines: [
      ['.env', 'El archivo con los valores reales. Vive solo en tu máquina y no se comparte jamás.'],
      ['.gitignore', 'Le dice a git que ignore el .env. Sin esta línea, el primer commit se lleva tus claves.'],
      ['.env.example', 'La misma lista de variables pero con los valores vacíos. Sirve para que otra persona sepa qué necesita sin darle tus claves.'],
      ['load_dotenv()', 'Lee el archivo .env y mete sus valores en las variables de entorno del proceso.'],
      ['os.environ.get(...)', 'Coge el valor. Usa .get() y no os.environ[...] para poder dar un mensaje decente si falta.'],
      ['raise RuntimeError(...)', 'Falla pronto y con un mensaje que dice qué hacer. Sin esto, el error aparece cincuenta líneas más adelante como "invalid api key" y no sabes por qué.'],
    ],
    install: 'pip install python-dotenv',
    errors: [
      ['El programa dice que falta la clave y el .env existe', 'Casi siempre es que lo ejecutas desde otra carpeta. load_dotenv() busca el .env en el directorio actual, no junto al script.'],
      ['La clave funcionaba y de repente no', 'Comprueba si la subiste alguna vez sin querer. Si la detectó el proveedor, la revoca automáticamente.'],
    ],
    adapt: 'Cambia los nombres de las variables por los de tu proyecto. La regla es: si es un secreto o cambia entre tu máquina y producción, va en el .env.',
  }),

  /* ---------------------------------------------------------------- */
  r({
    id: 'llamada-modelo',
    match: /\bapi\b|llamada al modelo|anthropic|openai|claude|integraci[oó]n/i,
    stages: ['fundamentos', 'prompting', 'asistentes'],
    tools: ['anthropic', 'claude', 'openai', 'python'],
    title: 'Tu primera llamada a un modelo desde código',
    what: 'El programa mínimo que envía un texto a un modelo y recibe su respuesta.',
    why: 'Es la base de todo lo demás. Un agente, un sistema RAG y una automatización no son más que esta llamada, repetida y rodeada de lógica.',
    lang: 'python',
    code: `import os
import anthropic
from dotenv import load_dotenv

load_dotenv()
cliente = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

respuesta = cliente.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1000,
    temperature=0,
    system="Eres un asistente administrativo. Respondes en español, breve y sin adornos.",
    messages=[
        {"role": "user", "content": "Resume este email en 3 viñetas: qué piden, para cuándo y qué debo decidir yo."}
    ],
)

print(respuesta.content[0].text)
print(f"Tokens: {respuesta.usage.input_tokens} entrada, {respuesta.usage.output_tokens} salida")`,
    lines: [
      ['cliente = anthropic.Anthropic(...)', 'Crea el cliente una sola vez y reutilízalo. Crearlo en cada llamada abre una conexión nueva cada vez.'],
      ['model=', 'Qué modelo usas. Cambiarlo aquí cambia precio, velocidad y calidad. Empieza por uno medio y baja si tu tarea es simple.'],
      ['max_tokens=1000', 'El techo de lo que puede responder. Si lo pones corto, la respuesta se corta a mitad de frase. No es un objetivo, es un límite de seguridad.'],
      ['temperature=0', 'Cero significa "elige siempre lo más probable": misma entrada, misma salida. Para procesos automáticos siempre 0; para escribir, 0.7 o más.'],
      ['system=', 'Las reglas permanentes: quién es, en qué idioma responde, qué no debe hacer. No se repiten en cada mensaje.'],
      ['messages=[...]', 'La conversación. Para mantener el hilo, vas añadiendo aquí los turnos anteriores; el modelo no los recuerda por su cuenta.'],
      ['respuesta.content[0].text', 'La respuesta viene como una lista de bloques. El texto está en el primero.'],
      ['respuesta.usage', 'Lo que has gastado en esta llamada. Regístralo desde el primer día: es la única forma de saber qué te va a costar el sistema.'],
    ],
    install: 'pip install anthropic python-dotenv',
    errors: [
      ['authentication_error', 'La clave está mal o no se ha cargado. Imprime os.environ.get("ANTHROPIC_API_KEY")[:8] para ver si llega algo.'],
      ['La respuesta se corta a mitad', 'Te has quedado sin max_tokens. Súbelo, o pide explícitamente una respuesta más corta.'],
      ['rate_limit_error', 'Vas demasiado rápido. Necesitas reintentos con espera creciente (ver la receta de reintentos).'],
    ],
    adapt: 'Para OpenAI el código es casi idéntico: cambia el cliente por OpenAI(), messages.create por chat.completions.create, y system pasa a ser un mensaje más con role "system".',
  }),

  /* ---------------------------------------------------------------- */
  r({
    id: 'salida-estructurada',
    match: /json|esquema|schema|salida estructurada|formato de salida|validaci[oó]n/i,
    stages: ['prompting', 'calidad', 'automatizacion'],
    tools: ['python', 'anthropic', 'openai'],
    title: 'Obtener JSON del modelo y validarlo antes de usarlo',
    what: 'Pedir la respuesta con una forma exacta y comprobar que la cumple antes de meterla en tu programa.',
    why: 'Pedir JSON no garantiza JSON válido. Funcionará el 99% de las veces, y ese 1% es el fallo diario que nadie sabe explicar. Se valida siempre.',
    lang: 'python',
    code: `import json
from pydantic import BaseModel, ValidationError, Field

class Lead(BaseModel):
    """La forma exacta que esperamos. Si no encaja, falla aquí y no más adelante."""
    nombre: str
    email: str
    interes: str = Field(pattern="^(alto|medio|bajo)$")
    presupuesto_eur: int | None = None   # None significa "no consta"

PROMPT = """Extrae los datos del mensaje y devuelve SOLO un objeto JSON, sin texto alrededor.

Campos:
- nombre (string)
- email (string)
- interes (exactamente: "alto", "medio" o "bajo")
- presupuesto_eur (entero o null si no se menciona)

Si un dato no aparece, usa null. No inventes nada.

MENSAJE:
\\"\\"\\"{mensaje}\\"\\"\\""""

def extraer(mensaje: str) -> Lead | None:
    respuesta = cliente.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=500,
        temperature=0,
        messages=[{"role": "user", "content": PROMPT.format(mensaje=mensaje)}],
    )
    texto = respuesta.content[0].text.strip()

    # A veces envuelve el JSON en un bloque de código: se limpia.
    if texto.startswith("\\u0060\\u0060\\u0060"):
        texto = texto.split("\\n", 1)[1].rsplit("\\u0060\\u0060\\u0060", 1)[0]

    try:
        return Lead(**json.loads(texto))
    except (json.JSONDecodeError, ValidationError) as error:
        print(f"Respuesta no válida, se descarta: {error}")
        return None`,
    lines: [
      ['class Lead(BaseModel)', 'Declara la forma esperada. Pydantic comprueba tipos y reglas por ti, y da un error que dice exactamente qué campo falla.'],
      ['Field(pattern=...)', 'Restringe a tres valores concretos. Sin esto el modelo te devolverá "muy alto" algún día y romperá tu lógica.'],
      ['int | None', 'Permite que falte. Es mejor un null explícito que un cero que parece un dato real.'],
      ['"devuelve SOLO un objeto JSON"', 'Sin esta frase te añade "Aquí tienes el JSON que pides:" delante, y json.loads revienta.'],
      ['"Si un dato no aparece, usa null"', 'La instrucción que evita que se lo invente. Es la más importante del prompt.'],
      ['if texto.startswith(...)', 'Limpieza defensiva: a veces envuelve la respuesta en un bloque de código markdown aunque le digas que no.'],
      ['try / except', 'Aquí está el valor real de la receta. Si la respuesta no encaja, se descarta de forma controlada en lugar de contaminar tu base de datos.'],
      ['return None', 'Devuelve nada y deja que quien llame decida: reintentar, mandarlo a revisión humana o registrarlo como fallo.'],
    ],
    install: 'pip install pydantic anthropic',
    errors: [
      ['JSONDecodeError', 'El modelo añadió texto alrededor. Refuerza el "SOLO JSON" y mantén la limpieza defensiva.'],
      ['ValidationError en "interes"', 'Devolvió un valor fuera de la lista. Enumera los valores permitidos también en el prompt, no solo en el esquema.'],
    ],
    adapt: 'Cambia la clase Lead por los campos de tu caso. La estructura (prompt con campos + limpieza + try/except) se queda igual siempre.',
  }),

  /* ---------------------------------------------------------------- */
  r({
    id: 'reintentos',
    match: /reintent|rate limit|429|timeout|resilien|error de red|fallo temporal/i,
    stages: ['automatizacion', 'calidad', 'seguridad'],
    tools: ['python'],
    title: 'Reintentar cuando el servicio falla, sin hundirlo más',
    what: 'Vuelve a intentar la llamada esperando cada vez un poco más, y se rinde tras varios intentos.',
    why: 'Las APIs fallan por motivos temporales: saturación, límite por minuto, un pico de red. Reintentar al instante empeora el problema. Esperar cada vez más lo resuelve.',
    lang: 'python',
    code: `import time
import random
import anthropic

def llamar_con_reintentos(cliente, mensajes, intentos=4):
    """Reintenta solo los errores temporales. Los de datos no se reintentan."""
    for intento in range(intentos):
        try:
            return cliente.messages.create(
                model="claude-sonnet-4-5",
                max_tokens=1000,
                messages=mensajes,
            )

        except (anthropic.RateLimitError, anthropic.APIConnectionError) as error:
            if intento == intentos - 1:
                raise                                   # se acabaron los intentos

            espera = (2 ** intento) + random.uniform(0, 1)
            print(f"Intento {intento + 1} fallido ({type(error).__name__}). Espero {espera:.1f}s")
            time.sleep(espera)

        except anthropic.BadRequestError:
            raise                                       # tu petición está mal: reintentar no ayuda`,
    lines: [
      ['for intento in range(intentos)', 'Un número fijo de intentos. Sin techo, un servicio caído te deja el proceso colgado para siempre.'],
      ['except RateLimitError, APIConnectionError', 'Solo se reintentan los errores temporales. Es la decisión clave de toda la receta.'],
      ['if intento == intentos - 1: raise', 'En el último intento se propaga el error. Fallar es una respuesta válida; fingir que no pasó nada, no.'],
      ['2 ** intento', 'Espera exponencial: 1s, 2s, 4s, 8s. Le das tiempo real al servicio a recuperarse.'],
      ['random.uniform(0, 1)', 'El "jitter". Si mil procesos fallan a la vez y todos reintentan al segundo exacto, vuelven a tumbar el servicio. Este número aleatorio los reparte.'],
      ['except BadRequestError: raise', 'Un error en TUS datos no se arregla repitiendo. Reintentarlo son cuatro llamadas pagadas para obtener el mismo error.'],
    ],
    install: 'pip install anthropic',
    errors: [
      ['El proceso tarda muchísimo cuando hay fallos', 'Cuatro intentos con espera exponencial son ~15 segundos. Si es demasiado para tu caso, baja los intentos.'],
      ['Sigue dando 429 aunque reintente', 'No es un pico: es que superas el límite de forma sostenida. Necesitas procesar por lotes con pausas, no solo reintentar.'],
    ],
    adapt: 'Sirve para cualquier API, no solo para modelos. Cambia los tipos de excepción por los de la librería que uses.',
  }),

  /* ---------------------------------------------------------------- */
  r({
    id: 'rag-minimo',
    match: /\brag\b|embedding|vector|recuperaci[oó]n|chunk|troce|base de conocimiento/i,
    stages: ['datos'],
    tools: ['python', 'openai'],
    title: 'Un sistema RAG completo en 40 líneas',
    what: 'Trocea tus documentos, los convierte en vectores, busca los más parecidos a la pregunta y hace que el modelo responda solo con eso.',
    why: 'Es el esqueleto entero de RAG. Todo lo demás (bases vectoriales, reordenado, búsqueda híbrida) son mejoras sobre estos cuatro pasos.',
    lang: 'python',
    code: `import numpy as np
from openai import OpenAI

cliente = OpenAI()

# 1. TROCEAR --------------------------------------------------------
def trocear(texto: str, tam=500, solape=80) -> list[str]:
    """Cortar por párrafos gana casi siempre a cortar por caracteres."""
    parrafos = [p.strip() for p in texto.split("\\n\\n") if p.strip()]
    trozos, actual = [], ""
    for parrafo in parrafos:
        if len(actual) + len(parrafo) < tam:
            actual += "\\n\\n" + parrafo
        else:
            if actual:
                trozos.append(actual.strip())
            actual = actual[-solape:] + "\\n\\n" + parrafo   # arrastra el final anterior
    if actual:
        trozos.append(actual.strip())
    return trozos

# 2. INDEXAR --------------------------------------------------------
def vectorizar(textos: list[str]) -> np.ndarray:
    respuesta = cliente.embeddings.create(model="text-embedding-3-small", input=textos)
    return np.array([d.embedding for d in respuesta.data])

# 3. RECUPERAR ------------------------------------------------------
def buscar(pregunta: str, trozos: list[str], indice: np.ndarray, k=3) -> list[str]:
    v = vectorizar([pregunta])[0]
    similitud = indice @ v / (np.linalg.norm(indice, axis=1) * np.linalg.norm(v))
    return [trozos[i] for i in np.argsort(similitud)[-k:][::-1]]

# 4. RESPONDER ------------------------------------------------------
def responder(pregunta: str, fragmentos: list[str]) -> str:
    contexto = "\\n\\n---\\n\\n".join(f"[{i+1}] {f}" for i, f in enumerate(fragmentos))
    respuesta = cliente.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        messages=[{"role": "user", "content": f"""Responde SOLO con lo que aparezca en los fragmentos.
Cita el número del fragmento que usas: [1], [2]...
Si la respuesta no está, escribe exactamente: NO ESTÁ EN LA DOCUMENTACIÓN.

FRAGMENTOS:
{contexto}

PREGUNTA: {pregunta}"""}],
    )
    return respuesta.choices[0].message.content`,
    lines: [
      ['trocear()', 'Aquí se decide la calidad de todo el sistema. Si cortas una idea por la mitad, ningún modelo posterior la va a recomponer.'],
      ['split("\\n\\n")', 'Cortar por párrafos respeta unidades con sentido propio. Cortar cada N caracteres es ciego al contenido.'],
      ['actual[-solape:]', 'El solapamiento: arrastra el final del trozo anterior para que una frase a caballo entre dos aparezca entera en uno de ellos.'],
      ['embeddings.create(...)', 'Convierte cada trozo en una lista de números que representa su significado. Textos parecidos dan vectores cercanos.'],
      ['indice @ v / (norm * norm)', 'Similitud del coseno: mide el ángulo entre vectores. Es la operación que hay debajo de cualquier base vectorial.'],
      ['np.argsort(...)[-k:][::-1]', 'Coge los k más parecidos, del más al menos. Subir k mete ruido: tres suele ir mejor que diez.'],
      ['"Responde SOLO con lo que aparezca"', 'Sin esta línea el modelo completa con lo que "sabe" y RAG solo cambia el origen de las invenciones.'],
      ['"Cita el número del fragmento"', 'Convierte la respuesta en verificable en dos segundos. Es lo que te permite enseñárselo a un cliente.'],
      ['"NO ESTÁ EN LA DOCUMENTACIÓN"', 'Una salida explícita para el hueco. Ese "no está" es la respuesta más valiosa: te dice qué falta documentar.'],
    ],
    install: 'pip install openai numpy',
    errors: [
      ['Responde bien pero cita el fragmento equivocado', 'Los trozos son demasiado grandes y contienen varios temas. Redúcelos.'],
      ['Siempre dice que no está', 'Tu búsqueda no encuentra nada relevante. Imprime los fragmentos recuperados: verás que el problema está en el troceado, no en el prompt.'],
      ['Va lentísimo con muchos documentos', 'Con más de unos miles de trozos necesitas una base vectorial de verdad (pgvector, Qdrant) en vez de numpy.'],
    ],
    adapt: 'Guarda `indice` y `trozos` en disco con numpy.save y json para no recalcular los embeddings en cada arranque: cuestan dinero.',
  }),

  /* ---------------------------------------------------------------- */
  r({
    id: 'n8n-code',
    match: /\bn8n\b|nodo code|workflow|webhook|automatizaci[oó]n/i,
    stages: ['automatizacion'],
    tools: ['n8n', 'node'],
    title: 'El nodo Code de n8n que valida antes de dejar pasar',
    what: 'El código que se pega dentro de un nodo Code de n8n para comprobar los datos que llegan y cortar el flujo si no valen.',
    why: 'Es el nodo que separa un workflow que funciona de uno que un día crea una factura con el nombre vacío. Va justo después del disparador.',
    lang: 'javascript',
    code: `// Nodo Code de n8n · modo "Run Once for All Items"
const validos = [];
const rechazados = [];

for (const item of $input.all()) {
  const dato = item.json;
  const errores = [];

  // 1. Campos obligatorios
  if (!dato.email) errores.push('falta email');
  if (!dato.nombre) errores.push('falta nombre');

  // 2. Formato
  if (dato.email && !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(dato.email)) {
    errores.push('email con formato incorrecto');
  }

  // 3. Normalización: se limpia lo que sí sirve
  const limpio = {
    email: (dato.email || '').trim().toLowerCase(),
    nombre: (dato.nombre || '').trim(),
    telefono: (dato.telefono || '').replace(/\\s|-/g, '') || null,
    consentimiento: dato.consentimiento === true,
    recibido_en: new Date().toISOString(),
    id_evento: dato.id || \`\${dato.email}-\${dato.fecha || ''}\`,   // clave anti-duplicados
  };

  if (errores.length) {
    rechazados.push({ json: { ...limpio, errores, estado: 'rechazado' } });
  } else {
    validos.push({ json: { ...limpio, estado: 'ok' } });
  }
}

// Salida 1: los válidos siguen. Salida 2: los rechazados van al registro.
return [validos, rechazados];`,
    lines: [
      ['$input.all()', 'Todos los elementos que llegan al nodo. n8n trabaja siempre con listas, aunque venga uno solo.'],
      ['item.json', 'Los datos del elemento. Todo lo que llega de un webhook está aquí dentro.'],
      ['errores.push(...)', 'Se acumulan TODOS los errores en vez de parar en el primero. Así el registro dice qué falla entero, no lo primero que falló.'],
      ['.trim().toLowerCase()', 'Normalizar el email evita que "Ana@X.com " y "ana@x.com" se traten como dos personas distintas.'],
      ['consentimiento === true', 'Comparación estricta: la cadena "false" es verdadera en JavaScript. Este descuido ha enviado muchos correos sin permiso.'],
      ['id_evento', 'La clave anti-duplicados. Antes de crear nada, se comprueba si este id ya se procesó. Sin esto, un reintento de red crea dos registros.'],
      ['recibido_en', 'Marca de tiempo propia. Sirve para depurar y para saber cuánto tarda el flujo de verdad.'],
      ['return [validos, rechazados]', 'Dos salidas. Conecta la primera al flujo normal y la segunda a un nodo que registre el rechazo. Sin la segunda, los datos malos desaparecen sin dejar rastro.'],
    ],
    install: 'No necesita instalación: se pega dentro de un nodo Code en n8n.',
    errores: null,
    errors: [
      ['"Cannot read property of undefined"', 'Un campo que esperabas no viene. Por eso todos los accesos usan (dato.x || \'\'): nunca asumas que el campo existe.'],
      ['El nodo devuelve un solo elemento', 'Comprueba que está en modo "Run Once for All Items" y no "for Each Item".'],
    ],
    adapt: 'Cambia los campos por los de tu formulario. La estructura —acumular errores, normalizar, generar id de evento, dos salidas— vale para cualquier caso.',
  }),

  /* ---------------------------------------------------------------- */
  r({
    id: 'agente-herramientas',
    match: /agente|tool use|herramienta|\bmcp\b|function calling/i,
    stages: ['agentes'],
    tools: ['python', 'anthropic'],
    title: 'Un agente con una herramienta, con el freno puesto',
    what: 'El bucle completo de un agente: decide, usa una herramienta, lee el resultado y vuelve a decidir, con límite de pasos.',
    why: 'Es el patrón entero. Todo framework de agentes hace esto por debajo, y verlo sin capas te permite saber dónde poner los límites.',
    lang: 'python',
    code: `import json
import anthropic

cliente = anthropic.Anthropic()

HERRAMIENTAS = [{
    "name": "buscar_pedido",
    "description": (
        "Busca un pedido por su número. SOLO lectura, no modifica nada. "
        "Úsala cuando el usuario mencione un número de pedido. "
        "NO la uses para buscar por nombre de cliente."
    ),
    "input_schema": {
        "type": "object",
        "properties": {"numero": {"type": "string", "description": "Ej: PED-1234"}},
        "required": ["numero"],
    },
}]

def buscar_pedido(numero: str) -> dict:
    return {"numero": numero, "estado": "enviado", "fecha": "2026-05-12"}

def ejecutar(pregunta: str, max_pasos=5) -> str:
    mensajes = [{"role": "user", "content": pregunta}]

    for paso in range(max_pasos):
        respuesta = cliente.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            tools=HERRAMIENTAS,
            messages=mensajes,
        )

        if respuesta.stop_reason != "tool_use":
            return respuesta.content[0].text          # ya tiene la respuesta final

        mensajes.append({"role": "assistant", "content": respuesta.content})

        resultados = []
        for bloque in respuesta.content:
            if bloque.type != "tool_use":
                continue
            salida = buscar_pedido(**bloque.input)     # aquí se actúa de verdad
            resultados.append({
                "type": "tool_result",
                "tool_use_id": bloque.id,
                "content": json.dumps(salida, ensure_ascii=False),
            })

        mensajes.append({"role": "user", "content": resultados})

    return "No he podido resolverlo en los pasos disponibles."`,
    lines: [
      ['"description"', 'Es el prompt que el agente lee para decidir. El "SOLO lectura", el "úsala cuando" y el "NO la uses para" son lo que evita el 90% de los usos equivocados.'],
      ['"input_schema"', 'Los parámetros y cuáles son obligatorios. Sin esto, el agente se inventa campos.'],
      ['for paso in range(max_pasos)', 'El techo de iteraciones. No es una buena práctica opcional: es tu límite de gasto. Sin él, el bucle es una factura abierta.'],
      ['stop_reason != "tool_use"', 'Si no pide herramienta, ya tiene la respuesta: se sale del bucle.'],
      ['mensajes.append(assistant)', 'Hay que devolverle su propio turno. Si no, en la siguiente vuelta no recuerda que pidió la herramienta.'],
      ['salida = buscar_pedido(...)', 'El punto exacto donde el agente toca el mundo real. Si esta función enviara un email, aquí es donde iría la confirmación humana.'],
      ['tool_use_id', 'Une la respuesta con la petición concreta. Si el agente pide dos herramientas a la vez, esto es lo que evita que se crucen.'],
      ['return "No he podido resolverlo"', 'La salida digna. Un agente tiene que saber rendirse; si no, insiste hasta agotar el presupuesto.'],
    ],
    install: 'pip install anthropic',
    errors: [
      ['El agente llama a la herramienta una y otra vez', 'La herramienta devuelve algo que no responde a su pregunta. Imprime la salida: suele estar vacía o con un formato que no entiende.'],
      ['Usa la herramienta cuando no toca', 'La descripción es ambigua. Añade el "NO la uses para..." explícito.'],
    ],
    adapt: 'Para más de una herramienta, añádelas a la lista y sustituye la llamada directa por un diccionario nombre → función. Y para lo irreversible, mete una confirmación antes de ejecutar.',
  }),

  /* ---------------------------------------------------------------- */
  r({
    id: 'eval-regresion',
    match: /eval|regresi[oó]n|prueba|test|calidad|medir/i,
    stages: ['calidad'],
    tools: ['python'],
    title: 'La batería de pruebas que avisa cuando tu prompt se rompe',
    what: 'Un conjunto de casos con su respuesta esperada, que se vuelve a pasar cada vez que cambias el prompt o el modelo.',
    why: 'Un prompt en producción es código. Sin esto, te enteras de que se rompió por la queja de un cliente, tres semanas después.',
    lang: 'python',
    code: `import json

CASOS = [
    {
        "entrada": "Hola, soy Ana (ana@empresa.com). Necesitamos 200 unidades para el día 12.",
        "debe_contener": ["ana@empresa.com", "200"],
        "no_debe_contener": ["no consta"],
        "campos": ["nombre", "email", "cantidad"],
    },
    {
        "entrada": "Buenas, quería información.",         # caso pobre a propósito
        "debe_contener": ["no consta"],
        "no_debe_contener": [],
        "campos": ["nombre", "email", "cantidad"],
    },
]

def evaluar(funcion) -> float:
    aprobados = 0
    for i, caso in enumerate(CASOS, 1):
        salida = funcion(caso["entrada"])
        texto = json.dumps(salida, ensure_ascii=False).lower()
        fallos = []

        for campo in caso["campos"]:
            if campo not in salida:
                fallos.append(f"falta el campo '{campo}'")
        for esperado in caso["debe_contener"]:
            if esperado.lower() not in texto:
                fallos.append(f"no aparece '{esperado}'")
        for prohibido in caso["no_debe_contener"]:
            if prohibido.lower() in texto:
                fallos.append(f"aparece '{prohibido}' y no debería")

        if fallos:
            print(f"  ✗ Caso {i}: {', '.join(fallos)}")
        else:
            aprobados += 1
            print(f"  ✓ Caso {i}")

    nota = aprobados / len(CASOS)
    print(f"\\nResultado: {aprobados}/{len(CASOS)} ({nota:.0%})")
    return nota

if __name__ == "__main__":
    from extraer import extraer          # tu función real
    if evaluar(extraer) < 1.0:
        raise SystemExit(1)              # falla el proceso: no se despliega`,
    lines: [
      ['CASOS', 'El conjunto de prueba. Tiene que parecerse a lo que escriben los usuarios de verdad, no a ejemplos limpios inventados por ti.'],
      ['"Buenas, quería información."', 'El caso pobre a propósito. Estos son los que descubren que tu sistema se inventa datos cuando no los tiene.'],
      ['debe_contener / no_debe_contener', 'En IA no se compara letra a letra: se comprueba contra criterios. La misma información puede venir redactada de diez formas.'],
      ['"no consta" en no_debe_contener', 'Comprueba que SÍ extrajo el dato cuando estaba. La ausencia también se mide.'],
      ['for campo in caso["campos"]', 'La comprobación estructural: los campos obligatorios están. Es barata y caza muchísimo.'],
      ['print(f"  ✗ Caso {i}: ...")', 'Dice qué falló, no solo que falló. Sin esto tienes un número y ninguna pista.'],
      ['raise SystemExit(1)', 'Devuelve error al sistema. Enchufado a tu CI, impide desplegar un cambio que empeora las cosas.'],
    ],
    install: 'Solo Python. Ejecútalo con: python evaluar.py',
    errors: [
      ['Da 100% y los usuarios se quejan', 'Tus casos no se parecen a la realidad. Coge veinte mensajes reales y conviértelos en casos.'],
      ['Falla de forma intermitente', 'Tu función no usa temperature=0. Con temperatura alta la salida cambia entre ejecuciones.'],
    ],
    adapt: 'Empieza con diez casos reales. Cada vez que aparezca un fallo en producción, añádelo aquí: así el conjunto crece con la realidad y no con tu imaginación.',
  }),

  /* ---------------------------------------------------------------- */
  r({
    id: 'pii',
    match: /\bpii\b|dato personal|rgpd|gdpr|privacidad|anonimiz|redacci[oó]n/i,
    stages: ['seguridad'],
    tools: ['python'],
    title: 'Quitar datos personales antes de enviarlos a un modelo',
    what: 'Detecta emails, teléfonos, DNI y tarjetas en un texto y los sustituye por marcas antes de que salgan de tu sistema.',
    why: 'Cada texto que envías a un servicio externo sale de tu control. Lo que no mandas no se puede filtrar, y el RGPD habla de minimizar por defecto.',
    lang: 'python',
    code: `import re

PATRONES = {
    "EMAIL":    r"[\\w.+-]+@[\\w-]+\\.[\\w.]{2,}",
    "TELEFONO": r"(?:\\+34[\\s-]?)?(?:[67]\\d{2}|9\\d{2})[\\s-]?\\d{3}[\\s-]?\\d{3}",
    "DNI":      r"\\b\\d{8}[A-HJ-NP-TV-Z]\\b",
    "IBAN":     r"\\b[A-Z]{2}\\d{2}(?:[\\s]?\\d{4}){5}\\b",
    "TARJETA":  r"\\b(?:\\d{4}[\\s-]?){3}\\d{4}\\b",
}

def redactar(texto: str) -> tuple[str, dict]:
    """Devuelve el texto limpio y el mapa para poder revertirlo después."""
    mapa = {}
    limpio = texto

    for etiqueta, patron in PATRONES.items():
        for n, encontrado in enumerate(set(re.findall(patron, texto)), 1):
            marca = f"[{etiqueta}_{n}]"
            mapa[marca] = encontrado
            limpio = limpio.replace(encontrado, marca)

    return limpio, mapa

def restaurar(texto: str, mapa: dict) -> str:
    for marca, original in mapa.items():
        texto = texto.replace(marca, original)
    return texto

# Uso -------------------------------------------------------------
original = "Contacta con ana.lopez@empresa.com o al 612345678. DNI 12345678Z."
limpio, mapa = redactar(original)

respuesta = llamar_al_modelo(limpio)        # el modelo nunca ve los datos reales
final = restaurar(respuesta, mapa)          # se devuelven al final, en tu sistema`,
    lines: [
      ['PATRONES', 'Un patrón por tipo de dato. Los formatos españoles (móvil, DNI, IBAN) no los cubren las librerías internacionales.'],
      ['set(re.findall(...))', 'El set evita numerar dos veces el mismo email si aparece repetido.'],
      ['marca = f"[{etiqueta}_{n}]"', 'Se sustituye por una marca legible. El modelo entiende que ahí había un email y puede seguir razonando sobre el texto.'],
      ['mapa[marca] = encontrado', 'El mapa vive solo en tu proceso. Es lo que permite devolver los datos reales al final sin que hayan salido nunca.'],
      ['restaurar(...)', 'Se aplica sobre la respuesta, ya dentro de tu sistema. El servicio externo jamás vio el dato.'],
      ['tuple[str, dict]', 'Devolver ambos obliga a quien lo usa a decidir qué hace con el mapa. Es intencionado.'],
    ],
    install: 'Solo Python, con el módulo re de la biblioteca estándar.',
    errors: [
      ['No detecta algún teléfono', 'Los patrones cubren formatos comunes, no todos. Para datos críticos, una expresión regular no basta: hay que revisar a mano o usar una herramienta especializada.'],
      ['Rompe un texto que contenía código', 'Un número largo puede parecer una tarjeta. Comprueba el resultado antes de enviarlo si tu texto mezcla datos y código.'],
    ],
    adapt: 'Añade patrones de tu sector: número de póliza, historia clínica, referencia catastral. Y documenta qué se redacta: forma parte de tu registro de tratamiento.',
  }),

  /* ---------------------------------------------------------------- */
  r({
    id: 'docker-postgres',
    match: /docker|contenedor|base de datos|postgres|pgvector|infraestructura/i,
    stages: ['entorno'],
    tools: ['docker', 'postgres'],
    title: 'Levantar una base de datos con búsqueda vectorial en un comando',
    what: 'Un archivo que arranca PostgreSQL con la extensión pgvector, lista para guardar embeddings.',
    why: 'Evita instalar nada en tu sistema y hace que tu compañero levante exactamente lo mismo. Es la respuesta a "en mi ordenador funciona".',
    lang: 'yaml',
    code: `# archivo: docker-compose.yml
services:
  db:
    image: pgvector/pgvector:pg16
    container_name: mi_proyecto_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev_local_no_produccion
      POSTGRES_DB: mi_proyecto
    ports:
      - "5432:5432"
    volumes:
      - datos_db:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev -d mi_proyecto"]
      interval: 5s
      retries: 5

volumes:
  datos_db:

# ------------------------------------------------------------------
# archivo: init.sql   (se ejecuta solo la primera vez)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documentos (
    id         BIGSERIAL PRIMARY KEY,
    contenido  TEXT NOT NULL,
    fuente     TEXT NOT NULL,
    embedding  VECTOR(1536),
    creado_en  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON documentos USING hnsw (embedding vector_cosine_ops);`,
    lines: [
      ['image: pgvector/pgvector:pg16', 'Imagen oficial con la extensión ya dentro. La versión fijada (pg16) es lo que hace la instalación reproducible.'],
      ['POSTGRES_PASSWORD', 'Para desarrollo local. En producción esto viene de un gestor de secretos, nunca escrito en el archivo.'],
      ['ports: "5432:5432"', 'Expone el puerto a tu máquina. Si ya tienes Postgres instalado, cambia el primero: "5433:5432".'],
      ['volumes: datos_db', 'Los datos sobreviven a apagar el contenedor. Sin esto, pierdes todo al hacer docker compose down.'],
      ['init.sql montado', 'Se ejecuta solo la primera vez, con la base vacía. Si cambias el esquema después, no se vuelve a aplicar.'],
      ['healthcheck', 'Docker sabe cuándo la base está lista de verdad. Evita el error clásico de que tu aplicación arranque antes que la base.'],
      ['VECTOR(1536)', 'El tamaño del embedding. 1536 es el de text-embedding-3-small: tiene que coincidir exactamente con tu modelo.'],
      ['USING hnsw', 'El índice que hace rápida la búsqueda por similitud. Sin él, funciona igual pero recorre la tabla entera.'],
    ],
    install: 'docker compose up -d',
    errors: [
      ['port is already allocated', 'Tienes algo ocupando el 5432. Cambia el puerto de tu lado: "5433:5432".'],
      ['El init.sql no se ejecuta', 'Solo corre con el volumen vacío. Para forzarlo: docker compose down -v (esto borra los datos).'],
      ['dimension mismatch', 'El VECTOR(n) no coincide con el tamaño que devuelve tu modelo de embeddings.'],
    ],
    adapt: 'Cambia el 1536 por el tamaño de tu modelo, y añade a la tabla los campos que necesites filtrar (usuario, permisos, fecha) para poder aplicarlos en la consulta.',
  }),

  /* ---------------------------------------------------------------- */
  r({
    id: 'git-flujo',
    match: /\bgit\b|repositorio|commit|versiones|github|rama/i,
    stages: ['entorno', 'asistentes'],
    tools: ['git', 'github'],
    title: 'El flujo de git que necesitas para trabajar con un asistente',
    what: 'Los comandos que permiten probar cambios grandes sabiendo que puedes volver atrás.',
    why: 'Sin control de versiones, un asistente que toca quince archivos es un riesgo. Con él, deshacer es gratis y puedes revisar exactamente qué cambió.',
    lang: 'bash',
    code: `# Antes de dejar que el asistente toque nada
git status                      # ¿hay algo sin guardar? guárdalo primero
git checkout -b prueba-asistente

# --- el asistente hace sus cambios ---

git diff                        # QUÉ ha cambiado, línea a línea
git diff --stat                 # resumen: qué archivos y cuántas líneas

# Si te convence
git add -p                      # revisar y aceptar trozo a trozo
git commit -m "Extrae la validación del lead a su propia función"

# Si no te convence
git checkout -- .               # descarta TODOS los cambios sin guardar
git clean -fd                   # borra los archivos nuevos que creó

# Volver a la rama principal
git checkout main
git branch -D prueba-asistente  # borra la rama del experimento`,
    lines: [
      ['git status', 'Siempre lo primero. Si empiezas con cambios sin guardar, luego no sabrás cuáles son tuyos y cuáles del asistente.'],
      ['git checkout -b', 'Crea una rama para el experimento. Tu trabajo bueno se queda intacto en main pase lo que pase.'],
      ['git diff', 'El paso innegociable. Es donde revisas de verdad, línea a línea, no leyendo el resumen que te da el asistente.'],
      ['git diff --stat', 'La vista rápida: si dice que tocó veinte archivos y esperabas dos, algo se ha ido de madre.'],
      ['git add -p', 'Te enseña cada trozo y te pregunta si lo quieres. Es lento y es exactamente el ritmo al que hay que revisar código que no escribiste.'],
      ['git checkout -- .', 'El botón de deshacer. Descarta todo lo no guardado, sin preguntar.'],
      ['git clean -fd', 'El anterior no borra archivos nuevos. Este sí. Ojo: no hay vuelta atrás.'],
    ],
    install: 'git ya viene instalado en Mac y Linux. En Windows: winget install Git.Git',
    errors: [
      ['"Your local changes would be overwritten"', 'Tienes cambios sin guardar. O los guardas (git stash) o los descartas antes de cambiar de rama.'],
      ['Borré la rama y había algo bueno', 'git reflog te enseña dónde estaba y puedes recuperarla. Casi nada se pierde de verdad en git.'],
    ],
    adapt: 'Es el ciclo mínimo. Cuando el equipo crece se añaden pull requests, pero la disciplina de rama + diff + commit pequeño no cambia.',
  }),

  /* ---------------------------------------------------------------- */
  r({
    id: 'coste-limite',
    match: /coste|presupuesto|gasto|token|l[ií]mite|budget/i,
    stages: ['seguridad', 'fundamentos'],
    tools: ['python'],
    title: 'Un tope de gasto que corta antes de que llegue la factura',
    what: 'Un contador que suma lo que llevas gastado y detiene el proceso al llegar al límite.',
    why: 'Un bucle mal cerrado con una API de pago es un taxi dando vueltas toda la noche a tu nombre. La alerta llega tarde; el tope duro, no.',
    lang: 'python',
    code: `from dataclasses import dataclass, field

# Precio por millón de tokens, en euros. Ajústalo a tu modelo y fecha.
PRECIOS = {
    "claude-sonnet-4-5": {"entrada": 3.00, "salida": 15.00},
    "claude-haiku-4-5":  {"entrada": 0.80, "salida": 4.00},
}

@dataclass
class Presupuesto:
    limite_eur: float
    gastado_eur: float = 0.0
    llamadas: int = 0
    por_modelo: dict = field(default_factory=dict)

    def apuntar(self, modelo: str, entrada: int, salida: int) -> float:
        precio = PRECIOS[modelo]
        coste = (entrada * precio["entrada"] + salida * precio["salida"]) / 1_000_000

        self.gastado_eur += coste
        self.llamadas += 1
        self.por_modelo[modelo] = self.por_modelo.get(modelo, 0) + coste

        if self.gastado_eur > self.limite_eur:
            raise RuntimeError(
                f"Tope alcanzado: {self.gastado_eur:.2f} € de {self.limite_eur:.2f} € "
                f"en {self.llamadas} llamadas. Proceso detenido."
            )

        if self.gastado_eur > self.limite_eur * 0.8:
            print(f"AVISO: llevas el {self.gastado_eur / self.limite_eur:.0%} del presupuesto")

        return coste

# Uso -------------------------------------------------------------
presupuesto = Presupuesto(limite_eur=5.00)

for documento in documentos:
    respuesta = cliente.messages.create(model="claude-sonnet-4-5", ...)
    presupuesto.apuntar(
        "claude-sonnet-4-5",
        respuesta.usage.input_tokens,
        respuesta.usage.output_tokens,
    )

print(f"Total: {presupuesto.gastado_eur:.2f} € en {presupuesto.llamadas} llamadas")`,
    lines: [
      ['PRECIOS', 'Los precios cambian. Ponlos en un solo sitio y con la fecha anotada, para no tener números viejos repartidos por el código.'],
      ['(entrada * precio + salida * precio) / 1_000_000', 'Los precios se publican por millón de tokens. La salida cuesta bastante más que la entrada: por eso se cuentan por separado.'],
      ['raise RuntimeError', 'El tope duro. Corta el proceso en seco. Es preferible un trabajo a medias a una factura de tres cifras.'],
      ['limite_eur * 0.8', 'El aviso al 80%: te enteras antes de que corte, y te da margen para decidir.'],
      ['por_modelo', 'Reparte el gasto por modelo. Es lo que te dice si merece la pena mover parte del trabajo a uno más barato.'],
      ['respuesta.usage', 'Los tokens reales de esa llamada. Estimar por longitud del texto da errores del 30%: usa siempre el dato del proveedor.'],
    ],
    install: 'Solo Python.',
    errors: [
      ['KeyError con el nombre del modelo', 'Falta en el diccionario PRECIOS. Añádelo antes de usarlo: es intencionado que falle así.'],
      ['El tope salta y pierdo el trabajo hecho', 'Guarda los resultados parciales a medida que van saliendo, no al final del bucle.'],
    ],
    adapt: 'En producción esto va acompañado de un límite duro en el panel del proveedor. El código puede fallar; el límite del proveedor, no.',
  }),
]

/** Añade recetas escritas fuera del código, en content/recipes/. */
export function registerRecipes(list) {
  for (const recipe of list) {
    if (!recipe?.id || !recipe.code) continue
    // El patrón viaja como texto en el JSON y aquí se convierte en expresión.
    const match = typeof recipe.match === 'string' ? new RegExp(recipe.match, 'i') : recipe.match
    RECIPES.push({ stages: [], tools: [], ...recipe, match: match || /$^/ })
  }
}

/**
 * Elige las recetas que encajan con una lección. Como mucho dos: más de eso
 * es relleno, y lo que se busca es la que de verdad corresponde al tema.
 */
export function recipesFor({ title, text, stageId, tools }) {
  const haystack = `${title} ${text}`.slice(0, 4000)

  const scored = RECIPES.map((recipe) => {
    let score = 0
    if (recipe.match.test(haystack)) score += 5
    if (recipe.match.test(title)) score += 6
    if (recipe.stages.includes(stageId)) score += 4
    score += recipe.tools.filter((tool) => tools.includes(tool)).length * 2
    return { recipe, score }
  })
    .filter((item) => item.score >= 6)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)

  return scored.map((item) => item.recipe)
}
