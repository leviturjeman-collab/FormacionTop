import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useLocale } from '../i18n'

/** Completion folds the instructions, without removing the task or its progress. */
export default function TaskDisclosure({ done, children, initiallyOpen = true }: { done: boolean; children: ReactNode; initiallyOpen?: boolean }) {
  const en = useLocale() === 'en'
  const [open, setOpen] = useState(initiallyOpen && !done)
  const previous = useRef(done)
  const button = useRef<HTMLButtonElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const id = useId()
  useEffect(() => {
    if (previous.current !== done) {
      if (done && body.current?.contains(document.activeElement)) button.current?.focus({ preventScroll: true })
      setOpen(!done)
      previous.current = done
    }
  }, [done])
  return <div className="st-task-detail st-task-disclosure" data-open={open}>
    <button ref={button} className="st-task-toggle" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>
      <span>{open ? (en ? 'Close steps' : 'Cerrar pasos') : (en ? 'Open steps' : 'Abrir pasos')}{done && <small> · {en ? 'Done' : 'Hecho'}</small>}</span><span aria-hidden="true">{open ? '−' : '+'}</span>
    </button>
    <div className="st-task-fold" data-open={open} aria-hidden={!open} {...(!open ? { inert: '' } : {})}>
      <div id={id} ref={body} className="st-task-fold-inner"><div className="st-task-content">{children}</div></div>
    </div>
  </div>
}
