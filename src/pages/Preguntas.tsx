import { useMemo, useState } from 'react'
import { ArrowRight, ChevronDown, HelpCircle, Search } from 'lucide-react'
import { useCourse } from '../course'
import { href } from '../router'
import type { FaqItem } from '../types'

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
              Ver la lección que lo explica <ArrowRight size={12} />
            </a>
          )}
        </div>
      )}
    </article>
  )
}

export default function Preguntas() {
  const course = useCourse()
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
          <h2>Todavía no hay preguntas</h2>
          <p>
            Añade archivos .json en <code>content/preguntas/</code> y vuelve a generar el índice.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker">
          <HelpCircle size={12} /> Dudas normales
        </span>
        <h1>Preguntas</h1>
        <p>
          {total} preguntas que hace todo el mundo, contestadas sin rodeos. Si la tuya no está, búscala
          por una palabra suelta: «dinero», «gratis», «terminal», «publicar», «duplicados».
        </p>
      </div>

      <label className="st-faq-buscar">
        <Search size={14} />
        <input
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Escribe una palabra: coste, tarjeta, .txt, dominio, RGPD..."
          aria-label="Buscar en las preguntas"
        />
        {busqueda && (
          <button type="button" onClick={() => setBusqueda('')}>
            Quitar
          </button>
        )}
      </label>

      {busqueda && (
        <p className="st-faq-recuento">
          {encontradas === 0
            ? 'Ninguna pregunta con esa palabra. Prueba con una más corta.'
            : `${encontradas} de ${total} preguntas hablan de eso.`}
        </p>
      )}

      {filtrados.map((grupo) => (
        <section key={grupo.id} className="st-faq-grupo">
          <div className="st-section-head">
            <div>
              <span className="st-kicker">{grupo.titulo}</span>
              <h2>{grupo.intro}</h2>
            </div>
            <span>{grupo.preguntas.length} preguntas</span>
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
          <strong>¿Y si tu duda no está aquí?</strong>
          <p>
            Casi todas las dudas se contestan solas siguiendo la lección que toca. Si te has atascado en un
            paso concreto, vuelve a esa lección y mira el apartado «si se atasca»: está escrito para el fallo
            típico de ese paso.
          </p>
          <a className="st-btn" href={href({ name: 'curso' })}>
            Ir al programa <ArrowRight size={12} />
          </a>
        </div>
      </section>
    </div>
  )
}
