import { useMemo, useState } from 'react'
import { ArrowDownAZ, ArrowUpAZ, Search } from 'lucide-react'
import type { ComparePiece } from '../types'
import { useLocale } from '../i18n'

/** Tabla comparativa ordenable y filtrable, construida desde el material del vault. */
export default function Compare({ piece }: { piece: ComparePiece }) {
  const locale = useLocale()
  const [sort, setSort] = useState<{ column: number; asc: boolean } | null>(null)
  const [filter, setFilter] = useState('')

  const rows = useMemo(() => {
    const needle = filter.trim().toLowerCase()
    const filtered = needle
      ? piece.rows.filter((row) => row.some((cell) => cell.toLowerCase().includes(needle)))
      : piece.rows
    if (!sort) return filtered
    return [...filtered].sort((a, b) => {
      const left = (a[sort.column] || '').toLowerCase()
      const right = (b[sort.column] || '').toLowerCase()
      return sort.asc ? left.localeCompare(right, 'es') : right.localeCompare(left, 'es')
    })
  }, [piece.rows, sort, filter])

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <label className="st-piece-search">
          <Search size={14} />
          <input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder={locale === 'en' ? 'Filter' : 'Filtrar'}
            aria-label={locale === 'en' ? 'Filter the table' : 'Filtrar la tabla'}
          />
        </label>
      </header>

      <div className="st-table">
        <table>
          <thead>
            <tr>
              {piece.header.map((cell, index) => (
                <th key={index}>
                  <button
                    type="button"
                    onClick={() => setSort((current) =>
                      current?.column === index ? { column: index, asc: !current.asc } : { column: index, asc: true },
                    )}
                  >
                    {cell || '—'}
                    {sort?.column === index && (sort.asc ? <ArrowDownAZ size={13} /> : <ArrowUpAZ size={13} />)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {piece.header.map((_, cellIndex) => (
                  <td key={cellIndex}>{row[cellIndex] || '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!rows.length && (
        <p className="st-empty">
          {locale === 'en' ? `Nothing matches "${filter}".` : `Nada coincide con «${filter}».`}
        </p>
      )}
    </figure>
  )
}
