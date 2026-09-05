// Sources checked on 2026-09-05. These are catalog examples, not promises of account access.
const date = '2026-09-05'
const catalogs = {
  openai: {
    url: 'https://developers.openai.com/api/docs/models',
    models: [['GPT-6 Astra', 'Razonamiento y trabajo complejo', 'Complex reasoning and work'], ['GPT-5.6 Sol', 'Trabajo profesional de varios pasos', 'Multi-step professional work'], ['GPT-5.6 Terra', 'Equilibrio entre capacidad y coste', 'Balance of capability and cost'], ['GPT-5.6 Luna', 'Tareas frecuentes de bajo coste', 'Frequent cost-sensitive tasks']],
    note: ['GPT-6 Astra tiene despliegue gradual. Comprueba que aparezca en tu selector; la existencia en API no garantiza acceso en todas las cuentas de ChatGPT o Codex.', 'GPT-6 Astra is rolling out gradually. Check your selector; an API listing does not guarantee access in every ChatGPT or Codex account.'],
  },
  claude: {
    url: 'https://platform.claude.com/docs/en/models/overview',
    models: [['Claude Fable 5.1', 'Razonamiento exigente y tareas largas', 'Demanding reasoning and long tasks'], ['Claude Opus 5', 'Código y trabajo empresarial complejo', 'Complex coding and enterprise work'], ['Claude Sonnet 5', 'Equilibrio entre velocidad y capacidad', 'Balance of speed and capability'], ['Claude Haiku 4.5', 'Respuestas rápidas y tareas sencillas', 'Fast responses and simpler tasks']],
  },
  higgsfield: {
    url: 'https://higgsfield.ai/creator-hub/help-center/ai-models',
    models: [['Seedance 2.5 / 2.0', 'Generación de vídeo', 'Video generation'], ['Kling 3.0', 'Generación de vídeo', 'Video generation'], ['Veo 3.1 / Sora 2 / WAN 2.6', 'Otros motores de vídeo del catálogo', 'Other video engines in the catalog'], ['Nano Banana / Flux 2 / Seedream 5 / GPT Image 2', 'Generación de imágenes', 'Image generation']],
    note: ['Higgsfield es la plataforma. Seedance y Kling son modelos que puedes elegir dentro; Cinema Studio y Marketing Studio son espacios de trabajo. No son nombres intercambiables.', 'Higgsfield is the platform. Seedance and Kling are selectable models; Cinema Studio and Marketing Studio are workspaces. These names are not interchangeable.'],
  },
  gemini: {
    url: 'https://ai.google.dev/gemini-api/docs/models',
    models: [['Gemini 3.1 Pro', 'Problemas complejos y código', 'Complex problems and code'], ['Gemini 3.1 Flash-Lite', 'Tareas de alto volumen y coste contenido', 'High-volume, cost-sensitive tasks']],
  },
  elevenlabs: {
    url: 'https://elevenlabs.io/docs/overview/models',
    models: [['Eleven v3', 'Voz expresiva', 'Expressive speech'], ['Eleven Multilingual v2', 'Locuciones largas y estables', 'Stable long-form narration'], ['Eleven Flash v2.5', 'Voz de baja latencia', 'Low-latency speech'], ['Scribe v2', 'Transcripción de audio', 'Audio transcription'], ['Eleven Music v2', 'Generación de música', 'Music generation']],
  },
  runway: {
    url: 'https://docs.dev.runwayml.com/guides/models/',
    models: [['Gen-4.5', 'Texto o imagen a vídeo', 'Text or image to video'], ['Gen-4 Turbo', 'Imagen a vídeo', 'Image to video'], ['Aleph 2.0', 'Edición de vídeo', 'Video editing'], ['Act Two', 'Vídeo a partir de una actuación', 'Performance-driven video']],
  },
  midjourney: {
    url: 'https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version',
    models: [['Midjourney V8.2', 'Generación de imágenes y personalización; versión predeterminada verificada', 'Image generation and personalization; verified default version'], ['Midjourney V8.1', 'Comparar generación rápida con otra versión', 'Compare fast generation with another version'], ['Niji 7', 'Ilustración y estética anime', 'Illustration and anime aesthetics']],
    note: ['Las versiones tienen controles distintos. Selecciona la versión en ajustes o con --v y consulta la compatibilidad antes de reutilizar parámetros antiguos.', 'Versions have different controls. Select the version in settings or with --v and check compatibility before reusing older parameters.'],
  },
  'nano-banana': {
    url: 'https://ai.google.dev/gemini-api/docs/image-generation',
    models: [['Nano Banana 2 Lite', 'Gemini 3.1 Flash Lite Image: rapidez y coste', 'Gemini 3.1 Flash Lite Image: speed and cost'], ['Nano Banana 2', 'Gemini 3.1 Flash Image: generación y edición general', 'Gemini 3.1 Flash Image: general generation and editing'], ['Nano Banana Pro', 'Gemini 3 Pro Image: trabajos visuales complejos', 'Gemini 3 Pro Image: complex visual work'], ['Nano Banana', 'Gemini 2.5 Flash Image: versión anterior', 'Gemini 2.5 Flash Image: earlier version']],
    note: ['Nano Banana nombra una familia de modelos de imagen de Google. Gemini y plataformas como Higgsfield pueden ofrecer acceso; revisa el nombre exacto en cada selector.', 'Nano Banana names a Google image model family. Gemini and platforms such as Higgsfield can provide access; check the exact model name in each selector.'],
  },
  'seedance-2-5': {
    url: 'https://seed.bytedance.com/en/seedance2_5',
    models: [['Seedance 2.5', 'Generación conjunta de audio y vídeo con referencias y edición', 'Joint audio-video generation with references and editing']],
    note: ['Seedance 2.5 es el modelo de ByteDance. La plataforma donde lo usas determina el acceso, coste y controles expuestos. No confundas la versión del modelo con Higgsfield o con tu suscripción.', 'Seedance 2.5 is the ByteDance model. The hosting platform determines access, cost and exposed controls. Do not confuse the model version with Higgsfield or your subscription.'],
  },
  heygen: {
    url: 'https://help.heygen.com/en/articles/14602974-avatar-v-is-now-available-on-heygen',
    models: [['Avatar V', 'Avatares humanos con referencia de vídeo', 'Human avatars with video references'], ['Avatar IV', 'Avatares desde foto y personajes virtuales', 'Photo avatars and virtual characters']],
    note: ['El modelo de avatar anima la imagen; la voz y la traducción son decisiones diferentes. Comprueba el tipo de referencia admitido y prueba sincronización y pronunciación antes de generar toda la pieza.', 'The avatar model animates the image; voice and translation are separate choices. Check accepted reference types, lip sync and pronunciation before generating the full piece.'],
  },
  cursor: {
    url: 'https://cursor.com/docs/models-and-pricing',
    models: [['Cursor Grok 4.6 / Grok 4.5', 'Modelos del grupo Cursor Models', 'Models in the Cursor Models pool'], ['Composer 2.5', 'Modelo de programación de Cursor', 'Cursor coding model'], ['Claude / OpenAI / Gemini', 'Modelos externos disponibles según el plan', 'Third-party models available by plan']],
    note: ['El selector y el plan determinan los modelos disponibles. Auto es un selector automático, no el nombre de un modelo fijo.', 'The selector and plan determine available models. Auto is automatic selection, not a fixed model name.'],
  },
  ollama: {
    url: 'https://ollama.com/library',
    models: [['gpt-oss', 'Familia de pesos abiertos para razonamiento', 'Open-weight reasoning family'], ['qwen3-coder', 'Familia orientada a código', 'Coding-oriented family']],
    note: ['Ollama ejecuta modelos; no es un modelo. Elige la etiqueta exacta y comprueba memoria, licencia y si la ejecución es local o en nube antes de usar datos privados.', 'Ollama runs models; it is not a model. Choose the exact tag and check memory, license and local versus cloud execution before using private data.'],
  },
}
const providers = { codex: 'openai', chatgpt: 'openai', openai: 'openai', claude: 'claude', anthropic: 'claude', 'claude-code': 'claude', higgsfield: 'higgsfield', gemini: 'gemini', elevenlabs: 'elevenlabs', runway: 'runway', midjourney: 'midjourney', 'nano-banana': 'nano-banana', 'seedance-2-5': 'seedance-2-5', heygen: 'heygen', cursor: 'cursor', ollama: 'ollama' }
const connected = new Set(['n8n', 'zapier', 'make', 'pipedream', 'cursor', 'copilot', 'v0', 'lovable', 'langchain', 'huggingface', 'ollama'])

export function addVerifiedModels(guide, id) {
  const en = process.env.LOCALE === 'en'
  const provider = catalogs[providers[id]]
  const group = en ? 'Models · checked 2026-09-05' : 'Modelos · revisado 05/09/2026'
  const availability = en ? 'Check the model selector, account access, price and limits before using it. Test the same real task to compare quality and cost.' : 'Comprueba el selector, el acceso de tu cuenta, el precio y los límites. Compara calidad y coste con la misma tarea real.'
  if (provider) {
    const items = provider.models.map(([name, es, english]) => ({ group, name, what: en ? english : es, useWhen: en ? english : es, avoidWhen: en ? 'Do not assume every plan or integration includes it.' : 'No supongas que está incluido en todos los planes o integraciones.', model: provider.note?.[en ? 1 : 0] || availability }))
    guide.catalog.items = [...items, ...guide.catalog.items.filter(item => item.group !== group)]
    guide.catalog.sources = [{ title: en ? 'Official model catalog' : 'Catálogo oficial de modelos', url: provider.url, checkedAt: date }]
    guide.catalog.intro = `${provider.note?.[en ? 1 : 0] || availability} ${guide.catalog.intro}`
  } else {
    const what = connected.has(id)
      ? (en ? 'This tool connects to models. The available provider, model and version depend on the integration and account.' : 'Esta herramienta conecta con modelos. El proveedor, modelo y versión disponibles dependen de la integración y de la cuenta.')
      : (en ? 'Distinguish the product version from an AI model. If this tool offers AI features, check which provider and model its documentation identifies.' : 'Distingue la versión del programa de un modelo de IA. Si ofrece funciones de IA, comprueba qué proveedor y modelo identifica su documentación.')
    guide.catalog.items.push({ group: en ? 'Model selection' : 'Elección de modelos', name: en ? 'What model does this use?' : '¿Qué modelo utiliza?', what, useWhen: en ? 'Before comparing costs or promising a capability.' : 'Antes de comparar costes o prometer una capacidad.', model: availability })
  }
  return guide
}
