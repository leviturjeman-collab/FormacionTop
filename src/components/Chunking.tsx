import { useMemo, useState } from 'react'
import type { ChunkingPiece } from '../types'
import { useLocale } from '../i18n'

/**
 * Simulador de troceado para RAG.
 *
 * La calidad de un sistema RAG se decide al trocear, mucho antes de generar.
 * Aquí se ve el efecto de cambiar el tamaño y el solapamiento sobre un texto
 * real: dónde se parte una idea por la mitad y qué recupera la búsqueda.
 */
export default function Chunking({ piece }: { piece: ChunkingPiece }) {
  const locale = useLocale()
  const [size, setSize] = useState(240)
  const [overlap, setOverlap] = useState(40)
  const [mode, setMode] = useState<'caracteres' | 'parrafos'>('caracteres')
  const [query, setQuery] = useState('')

  const chunks = useMemo(() => {
    const text = piece.text.trim()

    if (mode === 'parrafos') {
      // Trocear por unidades con sentido propio: casi siempre gana.
      return text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean)
    }

    const out: string[] = []
    const step = Math.max(20, size - overlap)
    for (let start = 0; start < text.length; start += step) {
      out.push(text.slice(start, start + size))
      if (start + size >= text.length) break
    }
    return out
  }, [piece.text, size, overlap, mode])

  // Búsqueda por coincidencia de palabras: no es un embedding real, pero
  // enseña lo importante — qué fragmento se recuperaría y si contiene la
  // respuesta entera o cortada.
  const scored = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter((word) => word.length > 2)
    if (!words.length) return null
    return chunks
      .map((chunk, index) => ({
        index,
        hits: words.filter((word) => chunk.toLowerCase().includes(word)).length,
      }))
      .filter((item) => item.hits > 0)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 3)
      .map((item) => item.index)
  }, [chunks, query])

  const cut = chunks.filter((chunk) => /[a-záéíóúñ,]\s*$/i.test(chunk.trim())).length

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <span className="st-piece-badge">{locale === 'en' ? `${chunks.length} fragments` : `${chunks.length} fragmentos`}</span>
      </header>

      <div className="st-calc">
        <div className="st-calc-controls">
          <label className="st-calc-row">
            <span>{locale === 'en' ? 'Strategy' : 'Estrategia'}</span>
            <select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
              <option value="caracteres">{locale === 'en' ? 'Cut every N characters' : 'Cortar cada N caracteres'}</option>
              <option value="parrafos">{locale === 'en' ? 'Cut by paragraphs' : 'Cortar por párrafos'}</option>
            </select>
            <b>{mode === 'parrafos' ? (locale === 'en' ? 'respects meaning' : 'respeta el sentido') : (locale === 'en' ? 'blind to content' : 'ciego al contenido')}</b>
          </label>

          {mode === 'caracteres' && (
            <>
              <label className="st-calc-row">
                <span>{locale === 'en' ? 'Size' : 'Tamaño'}</span>
                <input type="range" min={80} max={900} step={20} value={size} onChange={(event) => setSize(Number(event.target.value))} />
                <b>{size} {locale === 'en' ? 'ch.' : 'car.'}</b>
              </label>
              <label className="st-calc-row">
                <span>{locale === 'en' ? 'Overlap' : 'Solapamiento'}</span>
                <input type="range" min={0} max={200} step={10} value={overlap} onChange={(event) => setOverlap(Number(event.target.value))} />
                <b>{overlap} {locale === 'en' ? 'ch.' : 'car.'}</b>
              </label>
            </>
          )}

          <label className="st-calc-row">
            <span>{locale === 'en' ? 'Question' : 'Pregunta'}</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale === 'en' ? 'type a question about the text' : 'escribe una pregunta sobre el texto'}
              style={{ flex: 1, minWidth: 0, padding: '6px 8px', border: '1px solid var(--st-line)', background: 'var(--st-surface)', fontSize: 9 }}
            />
            <b>{scored ? (locale === 'en' ? `${scored.length} retrieved` : `${scored.length} recuperados`) : '—'}</b>
          </label>

          <p className="st-calc-hint">
            {locale === 'en'
              ? (mode === 'parrafos'
                  ? 'Cutting by paragraphs respects complete ideas. This is what you should do almost always.'
                  : cut > chunks.length / 2
                    ? `${cut} of ${chunks.length} fragments cut a sentence in half. That retrieved fragment reaches the model incomplete.`
                    : 'Few mid-sentence cuts. Still, check whether an idea ends up split across two fragments.')
              : (mode === 'parrafos'
                  ? 'Cortar por párrafos respeta las ideas completas. Es lo que deberías hacer casi siempre.'
                  : cut > chunks.length / 2
                    ? `${cut} de ${chunks.length} fragmentos cortan una frase por la mitad. Ese fragmento recuperado llega al modelo incompleto.`
                    : 'Pocos cortes a mitad de frase. Aun así, comprueba si alguna idea queda repartida entre dos fragmentos.')}
          </p>
        </div>

        <div className="st-chunk-list">
          {chunks.map((chunk, index) => (
            <div key={index} className={`st-chunk${scored?.includes(index) ? ' hit' : ''}`}>
              <span>#{index + 1}{scored?.includes(index) ? (locale === 'en' ? ' · retrieved' : ' · recuperado') : ''}</span>
              <p>{chunk}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="st-calc-note">{piece.note}</p>
    </figure>
  )
}
