import type { KeyboardEvent } from 'react'

export function tabKeys(event: KeyboardEvent<HTMLButtonElement>) {
  if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return
  const items = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button[role="tab"]') || [])
  if (!items.length) return
  const index = items.indexOf(event.currentTarget)
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length
  event.preventDefault(); items[next].click(); items[next].focus()
}
