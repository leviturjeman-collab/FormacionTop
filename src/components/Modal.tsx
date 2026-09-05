import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** Modal shared by resource cards. Keep keyboard and assistive technology in the same surface. */
export default function Modal({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const root = document.getElementById('root')
    const wasInert = root?.inert || false
    const overflow = document.body.style.overflow
    if (root) root.inert = true
    document.body.style.overflow = 'hidden'
    const controls = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]') || [])
      .filter(node => node.getClientRects().length && !node.classList.contains('st-focus-backdrop'))
    ;(controls()[0] || ref.current)?.focus()
    const keydown = (event: KeyboardEvent) => {
      // A native top-layer dialog (manual clipboard fallback) owns its keyboard.
      // The surrounding resource modal stays open until that dialog closes.
      if (document.querySelector('dialog[open]')) return
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close.current(); return }
      if (event.key !== 'Tab') return
      const items = controls()
      const first = items[0], last = items.at(-1)
      if (!first) { event.preventDefault(); ref.current?.focus(); return }
      if (event.shiftKey && (document.activeElement === first || !ref.current?.contains(document.activeElement))) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && (document.activeElement === last || !ref.current?.contains(document.activeElement))) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keydown, true)
    return () => {
      document.removeEventListener('keydown', keydown, true)
      if (root) root.inert = wasInert
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus()
    }
  }, [])
  return createPortal(<div className="st-focus-modal" role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} ref={ref}>{children}</div>, document.body)
}
