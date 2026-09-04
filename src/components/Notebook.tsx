import { useEffect, useState } from 'react'
import { Check, NotebookPen } from 'lucide-react'
import type { LevelId } from '../types'
import { store, useLessonProgress } from '../store'
import { useLocale } from '../i18n'

/**
 * Campo del cuaderno.
 *
 * Lo que el alumno escribe aquí se guarda en su navegador y se puede exportar
 * entero desde Progreso: al final del curso tiene su propio registro de qué
 * hizo en cada práctica, que es lo que enseña a un cliente.
 */
export default function Notebook({
  slug,
  level,
  noteKey,
  label,
  placeholder,
  rows = 3,
}: {
  slug: string
  level: LevelId
  noteKey: string
  label: string
  placeholder: string
  rows?: number
}) {
  const locale = useLocale()
  const progress = useLessonProgress(slug)
  const saved = progress.notes?.[level]?.[noteKey] || ''
  const [value, setValue] = useState(saved)
  const [flash, setFlash] = useState(false)

  // Si se cambia de lección o de nivel, el campo carga lo guardado allí.
  useEffect(() => setValue(saved), [saved, slug, level, noteKey])

  // Guardado automático al dejar de escribir, sin botón que se pueda olvidar.
  useEffect(() => {
    if (value === saved) return
    const timer = window.setTimeout(() => {
      store.setNote(slug, level, noteKey, value)
      setFlash(true)
      window.setTimeout(() => setFlash(false), 1400)
    }, 700)
    return () => window.clearTimeout(timer)
  }, [value, saved, slug, level, noteKey])

  return (
    <label className="st-note">
      <span>
        <NotebookPen size={11} />
        {label}
        {flash && <b><Check size={10} /> {locale === 'en' ? 'saved' : 'guardado'}</b>}
        {!flash && value && <b>{value.trim().split(/\s+/).length} {locale === 'en' ? 'words' : 'palabras'}</b>}
      </span>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        spellCheck
      />
    </label>
  )
}
