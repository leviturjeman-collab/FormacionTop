import { useMemo, useState } from 'react'
import { ArrowRight, ChevronDown, HelpCircle, Search } from 'lucide-react'
import { useCourse } from '../course'
import { href } from '../router'
import type { FaqItem } from '../types'
import { useLocale } from '../i18n'

/**
 * Preguntas frecuentes.
 *
 * Las preguntas estan escritas con las palabras del alumno, no con las del
 * temario. Cada una trae una respuesta de una linea para quien solo quiere el
 * si o el no, y debajo el porque. Todo empieza cerrado: esta pantalla es para
 * resolver una duda concreta y volver, no para leerla entera.
 */

function normaliza(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function Pregunta({ item }: { item: FaqItem }) {
  const [abierta, setAbierta] = useState(false)
  const locale = useLocale()
  return (
    <article className={abierta ? 'st-faq-item on' : 'st-faq-item'}>
      <button type="button" onClick={() => setAbierta((v) => !v)} aria-expanded={abierta}>
        <span>
          <strong>{item.q}</strong>
          {item.corta && <small>{item.corta}</small>}
        </span>
        <ChevronDown size={14} className={abierta ? 'st-faq-chevron on' : 'st-faq-chevron'} />
      </button>
      {abierta && (
        <div className="st-faq-body">
          <p>{item.a}</p>
          {item.ruta && (
            <a href={item.ruta}>
              {locale === 'en' ? 'See the lesson that explains it' : 'Ver la lección que lo explica'} <ArrowRight size={12} />
            </a>
          )}
        </div>
      )}
    </article>
  )
}

export default function Preguntas() {
  const course = useCourse()
  const locale = useLocale()
  const grupos = course.preguntas || []
  const [busqueda, setBusqueda] = useState('')

  const total = useMemo(
    () => grupos.reduce((suma, grupo) => suma + grupo.preguntas.length, 0),
    [grupos],
  )

  const filtrados = useMemo(() => {
    const aguja = normaliza(busqueda.trim())
    if (!aguja) return grupos
    return grupos
      .map((grupo) => ({
        ...grupo,
        preguntas: grupo.preguntas.filter((item) =>
          normaliza(`${item.q} ${item.a} ${item.corta || ''}`).includes(aguja),
        ),
      }))
      .filter((grupo) => grupo.preguntas.length > 0)
  }, [grupos, busqueda])

  const encontradas = filtrados.reduce((suma, grupo) => suma + grupo.preguntas.length, 0)

  if (!grupos.length) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>{locale === 'en' ? 'There are no questions yet' : 'Todavía no hay preguntas'}</h2>
          <p>
            {locale === 'en' ? (
              <>Add .json files in <code>content/preguntas/</code> and rebuild the index.</>
            ) : (
              <>Añade archivos .json en <code>content/preguntas/</code> y vuelve a generar el índice.</>
            )}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">
          <HelpCircle size={12} /> {locale === 'en' ? 'Common doubts' : 'Dudas normales'}
        </span>
        <h1>{locale === 'en' ? 'Questions' : 'Preguntas'}</h1>
        <p>
          {locale === 'en' ? (
            <>{total} questions everyone asks, answered straight up. If yours isn't here, search
            for a single word: "money", "free", "terminal", "publish", "duplicates".</>
          ) : (
            <>{total} preguntas que hace todo el mundo, contestadas sin rodeos. Si la tuya no está, búscala
            por una palabra suelta: «dinero», «gratis», «terminal», «publicar», «duplicados».</>
          )}
        </p>
      </div>

      <label className="st-faq-buscar">
        <Search size={14} />
        <input
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder={locale === 'en' ? 'Type a word: cost, card, .txt, domain, GDPR...' : 'Escribe una palabra: coste, tarjeta, .txt, dominio, RGPD...'}
          aria-label={locale === 'en' ? 'Search the questions' : 'Buscar en las preguntas'}
        />
        {busqueda && (
          <button type="button" onClick={() => setBusqueda('')}>
            {locale === 'en' ? 'Clear' : 'Quitar'}
          </button>
        )}
      </label>

      {busqueda && (
        <p className="st-faq-recuento">
          {encontradas === 0
            ? (locale === 'en' ? 'No question with that word. Try a shorter one.' : 'Ninguna pregunta con esa palabra. Prueba con una más corta.')
            : (locale === 'en' ? `${encontradas} of ${total} questions mention that.` : `${encontradas} de ${total} preguntas hablan de eso.`)}
        </p>
      )}

      {filtrados.map((grupo) => (
        <section key={grupo.id} className="st-faq-grupo">
          <div className="st-section-head">
            <div>
              <span className="st-kicker">{grupo.titulo}</span>
              <h2>{grupo.intro}</h2>
            </div>
            <span>{grupo.preguntas.length} {locale === 'en' ? 'questions' : 'preguntas'}</span>
          </div>
          <div className="st-faq-lista">
            {grupo.preguntas.map((item) => (
              <Pregunta key={item.q} item={item} />
            ))}
          </div>
        </section>
      ))}

      <section className="st-faq-cierre">
        <HelpCircle size={16} />
        <div>
          <strong>{locale === 'en' ? "What if your question isn't here?" : '¿Y si tu duda no está aquí?'}</strong>
          <p>
            {locale === 'en' ? (
              <>Almost every doubt answers itself by following the right lesson. If you're stuck on a
              specific step, go back to that lesson and check the "if it gets stuck" section: it's written for
              the typical failure of that step.</>
            ) : (
              <>Casi todas las dudas se contestan solas siguiendo la lección que toca. Si te has atascado en un
              paso concreto, vuelve a esa lección y mira el apartado «si se atasca»: está escrito para el fallo
              típico de ese paso.</>
            )}
          </p>
          <a className="st-btn" href={href({ name: 'curso' })}>
            {locale === 'en' ? 'Go to the program' : 'Ir al programa'} <ArrowRight size={12} />
          </a>
        </div>
      </section>
    </div>
  )
}
