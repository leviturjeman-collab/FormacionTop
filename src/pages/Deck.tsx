import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, NotebookPen, X } from 'lucide-react'
import { useCourse } from '../course'
import { href } from '../router'
import { store, useStudent } from '../store'

/**
 * Presentación para impartir.
 *
 * Las diapositivas van a pantalla completa y las notas del ponente solo se ven
 * con el modo profesor activado: el alumno nunca las carga.
 * Flechas o espacio para avanzar, N para las notas, Escape para salir.
 */
export default function Deck({ deckId }: { deckId: string }) {
  const course = useCourse()
  const { teacher } = useStudent()
  const [index, setIndex] = useState(0)
  const [showNotes, setShowNotes] = useState(teacher)

  const deck = (course.decks || []).find((item) => item.id === deckId)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!deck) return
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
        event.preventDefault()
        setIndex((value) => Math.min(deck.slides.length - 1, value + 1))
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        setIndex((value) => Math.max(0, value - 1))
      }
      if (event.key.toLowerCase() === 'n') setShowNotes((value) => !value)
      if (event.key === 'Escape') window.location.hash = href({ name: 'ruta' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deck])

  if (!deck) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>Esa presentación no existe</h2>
          <a className="st-btn" href={href({ name: 'ruta' })}>Volver a la ruta</a>
        </div>
      </div>
    )
  }

  const slide = deck.slides[index]

  return (
    <div className="st-deck">
      <header className="st-deck-bar">
        <span>{deck.title} · {deck.minutes} min</span>
        <div>
          <button
            type="button"
            className={`st-btn-ghost${showNotes ? ' on' : ''}`}
            onClick={() => {
              if (!teacher) store.toggleTeacher()
              setShowNotes((value) => !value)
            }}
          >
            <NotebookPen size={13} />
            Notas
          </button>
          <b>{index + 1} / {deck.slides.length}</b>
          <a href={href({ name: 'ruta' })} aria-label="Salir de la presentación"><X size={16} /></a>
        </div>
      </header>

      <section className={`st-slide kind-${slide.kind}`}>
        {slide.kind === 'portada' && <p className="st-slide-note">{deck.subtitle}</p>}
        <h1>{slide.title}</h1>
        {slide.text && <p className="st-slide-text">{slide.text}</p>}
        {slide.items && (
          <ul>
            {slide.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                {slide.kind === 'pregunta' && <b>{String.fromCharCode(97 + itemIndex)})</b>}
                {item}
              </li>
            ))}
          </ul>
        )}
        {slide.code && <pre>{slide.code}</pre>}
      </section>

      {showNotes && slide.notes && (
        <aside className="st-deck-notes">
          <strong>Notas del ponente</strong>
          <p>{slide.notes}</p>
        </aside>
      )}

      <footer className="st-deck-nav">
        <button type="button" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0}>
          <ArrowLeft size={16} /> Anterior
        </button>
        <i><b style={{ width: `${((index + 1) / deck.slides.length) * 100}%` }} /></i>
        <button
          type="button"
          onClick={() => setIndex((value) => Math.min(deck.slides.length - 1, value + 1))}
          disabled={index === deck.slides.length - 1}
        >
          Siguiente <ArrowRight size={16} />
        </button>
      </footer>
    </div>
  )
}
