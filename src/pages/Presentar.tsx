import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import type { LevelId } from '../types'
import { useIndexes } from '../course'
import { href } from '../router'
import { buildSlides } from '../teacher'
import { useLocale } from '../i18n'
import { taskKey } from '../project-workspace'
import SlideResponse from '../components/SlideResponse'

/**
 * Vista de presentación.
 *
 * La misma lección convertida en diapositivas para proyectar en clase.
 * Se avanza con las flechas o el espacio; se sale con Escape.
 */
export default function Presentar({ slug, level }: { slug: string; level: LevelId }) {
  const { bySlug } = useIndexes()
  const locale = useLocale()
  const lesson = bySlug.get(slug)
  const [index, setIndex] = useState(0)

  const slides = useMemo(() => (lesson ? buildSlides(lesson, level) : []), [lesson, level])

  useEffect(() => setIndex(0), [slug, level])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('input, textarea, select, button, [contenteditable]')) return
      if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'PageDown') {
        event.preventDefault()
        setIndex((value) => Math.min(slides.length - 1, value + 1))
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        setIndex((value) => Math.max(0, value - 1))
      }
      if (event.key === 'Escape') window.location.hash = href({ name: 'leccion', slug, level })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slides.length, slug, level])

  if (!lesson || !slides.length) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>{locale === 'en' ? 'There is nothing to present' : 'No hay nada que presentar'}</h2>
          <a className="st-btn" href={href({ name: 'ruta' })}>{locale === 'en' ? 'Back to the path' : 'Volver a la ruta'}</a>
        </div>
      </div>
    )
  }

  const slideIndex = Math.max(0, Math.min(index, slides.length - 1))
  const slide = slides[slideIndex]
  const question = slide.kind === 'pregunta' ? lesson.levels[level].quiz.find(item => item.prompt === slide.title) : undefined
  const responseKey = 'presentation:' + slug + ':' + taskKey({ title: slide.title })

  return (
    <div className="st-deck">
      <header className="st-deck-bar">
        <span>{lesson.title} · {locale === 'en' ? 'level' : 'nivel'} {level}</span>
        <div>
          <b>{slideIndex + 1} / {slides.length}</b>
          <a href={href({ name: 'leccion', slug, level })} aria-label={locale === 'en' ? 'Exit the presentation' : 'Salir de la presentación'}>
            <X size={16} />
          </a>
        </div>
      </header>

      <section className={`st-slide kind-${slide.kind}`}>
        <h1>{slide.title}</h1>
        {slide.text && <p className="st-slide-text">{slide.text}</p>}
        {slide.items && !question && (
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
        {slide.note && !question && <p className="st-slide-note">{slide.note}</p>}
      </section>

      {['pregunta', 'practica', 'cierre'].includes(slide.kind) && <SlideResponse key={responseKey} storageKey={responseKey} level={level} options={!question && slide.kind === 'pregunta' ? slide.items : undefined} question={question} />}
      <footer className="st-deck-nav">
        <button type="button" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={slideIndex === 0}>
          <ArrowLeft size={16} /> {locale === 'en' ? 'Previous' : 'Anterior'}
        </button>
        <i><b style={{ width: `${((slideIndex + 1) / slides.length) * 100}%` }} /></i>
        <button
          type="button"
          onClick={() => setIndex((value) => Math.min(slides.length - 1, value + 1))}
          disabled={slideIndex === slides.length - 1}
        >
          {locale === 'en' ? 'Next' : 'Siguiente'} <ArrowRight size={16} />
        </button>
      </footer>
    </div>
  )
}
