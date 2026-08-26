import { useMemo, useState } from 'react'
import { BookOpen, ChevronRight, Search } from 'lucide-react'
import type { GlossaryEntry } from '../types'
import { useCourse } from '../course'
import { href } from '../router'

const LETTERS = ['#', ...'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')]

type Entry = GlossaryEntry

const EVERYDAY_TERMS: Entry[] = [
  { term: 'Localhost', letter: 'L', meaning: 'Tu propio ordenador actuando como servidor.', long: 'Cuando escribes localhost en el navegador no estás entrando en internet: estás hablando con un programa que se está ejecutando en tu ordenador. localhost:4173 significa «este ordenador, en la puerta 4173». Es la dirección que usamos para probar una web antes de publicarla.', analogy: 'Es la dirección de tu propia casa, no la de una oficina pública.', confusion: 'Con una dirección pública. Localhost solo funciona en tu máquina.', lessons: [] },
  { term: 'Portapapeles', letter: 'P', meaning: 'La memoria temporal donde queda lo que copias.', long: 'Al pulsar copiar, el sistema guarda temporalmente ese texto, imagen o archivo en el portapapeles. Al pegarlo, lo recuperas. No es una carpeta permanente: al copiar otra cosa, normalmente sustituyes lo anterior.', analogy: 'Una bandeja pequeña donde dejas algo mientras lo llevas de una mesa a otra.', confusion: 'Con guardar un archivo. Copiar no crea una copia permanente.', lessons: [] },
  { term: 'Puerto', letter: 'P', meaning: 'La puerta numérica por la que un programa recibe conexiones.', long: 'Una misma máquina puede tener muchos servicios funcionando. El puerto permite distinguirlos: localhost:3000 puede ser una web y localhost:5678 puede ser n8n. Si otro programa ya ocupa ese número, tendrás que usar otro puerto.', analogy: 'El número de una puerta dentro del mismo edificio.', confusion: 'Con una dirección web completa. El puerto es solo una parte.', lessons: [] },
  { term: 'Navegador', letter: 'N', meaning: 'El programa con el que visitas webs y aplicaciones.', long: 'Chrome, Edge, Firefox y Safari son navegadores. También pueden abrir aplicaciones que viven en tu propio ordenador, como una web de desarrollo en localhost.', analogy: 'El vehículo con el que llegas a distintas direcciones de internet.', confusion: 'Con internet. El navegador es la herramienta; internet es la red.', lessons: [] },
  { term: 'URL', letter: 'U', meaning: 'La dirección exacta de una página o servicio.', long: 'Una URL puede llevar el protocolo, el dominio, el puerto y una ruta. Por ejemplo, http://localhost:4173/herramientas tiene todas esas piezas. Si una URL está mal escrita, el navegador no sabe dónde ir.', analogy: 'La dirección postal completa de una habitación concreta.', confusion: 'Con el nombre de una web. Una URL puede apuntar también a un servicio local.', lessons: [] },
  { term: 'Build', letter: 'B', meaning: 'Preparar el proyecto para poder ejecutarlo o publicarlo.', long: 'Durante el build se revisa el código, se transforma y se empaqueta para producción. Si falla, normalmente hay un error que hay que leer antes de publicar. Que funcione en localhost no garantiza que el build vaya a salir bien.', analogy: 'Montar y embalar un producto antes de enviarlo.', confusion: 'Con publicar. El build prepara; el deploy publica.', lessons: [] },
  { term: 'Deploy o despliegue', letter: 'D', meaning: 'Publicar una versión para que otras personas puedan verla.', long: 'Desplegar significa llevar el resultado preparado desde tu ordenador a un servidor accesible. En Vercel suele ocurrir después de conectar GitHub y completar un build.', analogy: 'Abrir el local al público después de haberlo preparado en el taller.', confusion: 'Con guardar cambios en tu ordenador.', lessons: [] },
  { term: 'Token', letter: 'T', meaning: 'Un fragmento de texto que un modelo cuenta para trabajar y cobrar.', long: 'Los modelos no cuentan exactamente palabras: parten el texto en fragmentos llamados tokens. Una palabra corta puede ser un token y una palabra larga puede dividirse en varios. Se cuentan los tokens de entrada y los de salida, y cada modelo tiene límites y precios diferentes.', analogy: 'Las piezas pequeñas con las que se mide una frase en una máquina.', confusion: 'Con una clave de acceso. Token también se usa para una contraseña técnica, pero aquí hablamos de texto.', lessons: [] },
  { term: 'API', letter: 'A', meaning: 'La puerta que permite que dos programas se comuniquen.', long: 'Una aplicación puede hablar con otra mediante una API. En vez de pulsar botones, un programa envía una petición y recibe una respuesta estructurada. Las automatizaciones dependen de estas puertas.', analogy: 'Un mostrador de atención entre dos negocios.', confusion: 'Con la web visual. La API está pensada para programas.', lessons: [] },
  { term: 'Webhook', letter: 'W', meaning: 'Una URL que recibe un aviso y dispara una acción.', long: 'Un webhook es una dirección que otro servicio llama cuando sucede algo. Puede iniciar un workflow en n8n o recibir los datos de un formulario. Hay direcciones de prueba y de producción; no conviene mezclarlas.', analogy: 'Un timbre que avisa a tu proceso de que alguien ha llegado.', confusion: 'Con una URL normal. El webhook no solo muestra una página: recibe datos.', lessons: [] },
]

/**
 * Índice alfabético de conceptos.
 *
 * Se lee como un diccionario: la letra entera cabe en pantalla porque de cada
 * término solo se ve el nombre y una línea. El desarrollo (explicación,
 * analogía, con qué no confundirlo y dónde se estudia) se abre al pulsar.
 */
export default function Indice({ letter }: { letter?: string }) {
  const course = useCourse()
  const active = letter?.toUpperCase()
  const [open, setOpen] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const entries = useMemo(() => {
    const seen = new Set(course.glossaryIndex.map((item) => item.term.toLowerCase()))
    return [...course.glossaryIndex, ...EVERYDAY_TERMS.filter((item) => !seen.has(item.term.toLowerCase()))]
  }, [course.glossaryIndex])

  const groups = useMemo(() => {
    const map = new Map<string, Entry[]>()
    const needle = query.trim().toLowerCase()
    for (const entry of entries) {
      if (needle && !`${entry.term} ${entry.meaning} ${entry.long || ''}`.toLowerCase().includes(needle)) continue
      if (!map.has(entry.letter)) map.set(entry.letter, [])
      map.get(entry.letter)!.push(entry)
    }
    return map
  }, [entries, query])

  const shown = (active ? LETTERS.filter((item) => item === active) : LETTERS).filter((item) => groups.has(item))

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><BookOpen size={12} /> Diccionario de la academia</span>
        <h1>Las palabras que frenan el proyecto</h1>
        <p>
          Aquí se explica el vocabulario técnico en lenguaje normal: qué significa, con qué se confunde y
          cuándo te afecta. Busca una palabra o entra por letra; no necesitas saber cómo está organizada por dentro.
        </p>
      </div>

      <label className="st-dictionary-search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca localhost, portapapeles, tokens, API…" aria-label="Buscar una palabra" /></label>

      <div className="st-dictionary-note"><strong>{entries.length} palabras disponibles.</strong><span>Las nuevas palabras que aparecen en las guías se incorporan aquí para que no tengas que aprenderlas de memoria.</span></div>

      <nav className="st-alphabet" aria-label="Navegación alfabética">
        <a className={active ? '' : 'off'} href={href({ name: 'indice' })}>Todo</a>
        {LETTERS.map((item) => (
          <a
            key={item}
            className={groups.has(item) ? '' : 'off'}
            href={href({ name: 'indice', letter: item })}
          >
            {item}
          </a>
        ))}
      </nav>

      {shown.map((item) => (
        <section className="st-index-group" key={item}>
          <h2>{item}</h2>
          <ul className="st-index-list">
            {groups.get(item)!.map((entry) => (
              <Term
                key={entry.term}
                entry={entry}
                open={open === entry.term}
                onToggle={() => setOpen(open === entry.term ? null : entry.term)}
              />
            ))}
          </ul>
        </section>
      ))}

      {active && !groups.has(active) && !query && (
        <p className="st-empty">No hay conceptos indexados bajo la letra «{active}».</p>
      )}
      {query && !groups.size && <p className="st-empty">No encuentro «{query}». Prueba con una palabra más corta o con “local”.</p>}
    </div>
  )
}

function Term({ entry, open, onToggle }: { entry: Entry; open: boolean; onToggle: () => void }) {
  const hasDetail = Boolean(entry.long || entry.analogy || entry.confusion || entry.seeAlso?.length || entry.lessons.length)

  return (
    <li className={`st-term${open ? ' open' : ''}`}>
      <button className="st-term-head" onClick={onToggle} aria-expanded={open} disabled={!hasDetail}>
        <ChevronRight size={11} className="st-term-caret" aria-hidden />
        <span className="st-term-name">{entry.term}</span>
        <span className="st-term-short">{entry.meaning}</span>
      </button>

      {open && hasDetail && (
        <div className="st-term-body">
          {entry.long && <p className="st-term-long">{entry.long}</p>}

          {entry.analogy && (
            <p className="st-term-note st-term-analogy">
              <b>Como si dijéramos</b>
              {entry.analogy}
            </p>
          )}

          {entry.confusion && (
            <p className="st-term-note st-term-confusion">
              <b>No lo confundas</b>
              {entry.confusion}
            </p>
          )}

          {(entry.seeAlso?.length ?? 0) > 0 && (
            <div className="st-term-links">
              <span>Ver también</span>
              <div>
                {(entry.seeAlso || []).map((related) => (
                  <a key={related} href={href({ name: 'indice', letter: related[0].toUpperCase() })}>
                    {related}
                  </a>
                ))}
              </div>
            </div>
          )}

          {entry.lessons.length > 0 && (
            <div className="st-term-links">
              <span>Se explica en</span>
              <div>
                {entry.lessons.map((lesson) => (
                  <a key={lesson.slug} href={href({ name: 'leccion', slug: lesson.slug })}>
                    {lesson.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  )
}
