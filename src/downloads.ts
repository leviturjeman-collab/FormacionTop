import { zipSync, strToU8 } from 'fflate'

export function downloadText(name: string, text: string, type = 'text/plain;charset=utf-8') {
  downloadBlob(name, new Blob([text], { type }))
}
export function downloadBlob(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = name
  document.body.append(a); a.click(); a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export function downloadPackage(name: string, files: { name: string; content: string }[]) {
  const entries: Record<string, Uint8Array> = {}
  for (const file of files) {
    const normalized = file.name.replaceAll('\\', '/')
    if (!normalized || normalized.startsWith('/') || normalized.split('/').some(part => part === '..') || /^[a-z]:/i.test(normalized)) throw new Error('El paquete contiene una ruta no válida.')
    if (entries[normalized]) throw new Error('El paquete contiene archivos duplicados.')
    entries[normalized] = strToU8(file.content)
  }
  const bytes = zipSync(entries)
  downloadBlob(name + '.zip', new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/zip' }))
}

/** On permission failure, give the student a usable manual-copy/download surface. */
export async function copyText(text: string): Promise<void> {
  try {
    if (!navigator.clipboard) throw new Error('Clipboard unavailable')
    await navigator.clipboard.writeText(text)
  } catch {
    const en = document.documentElement.lang === 'en'
    const dialog = document.createElement('dialog'); dialog.className = 'st-copy-fallback'
    const title = document.createElement('h2'); title.textContent = en ? 'Copy the text manually' : 'Copia el texto manualmente'
    const help = document.createElement('p'); help.textContent = en ? 'Clipboard access was denied. Select the text and copy it, or download the file.' : 'El navegador ha bloqueado el portapapeles. Selecciona el texto y cópialo, o descarga el archivo.'
    const input = document.createElement('textarea'); input.readOnly = true; input.value = text; input.setAttribute('aria-label', en ? 'Text to copy' : 'Texto para copiar')
    const save = document.createElement('button'); save.textContent = en ? 'Download text' : 'Descargar texto'; save.onclick = () => downloadText('texto-academia.txt', text)
    const close = document.createElement('button'); close.textContent = en ? 'Close' : 'Cerrar'; close.onclick = () => dialog.close()
    dialog.append(title, help, input, save, close); document.body.append(dialog)
    dialog.addEventListener('close', () => dialog.remove(), { once: true }); dialog.showModal(); input.focus(); input.select()
    throw new Error(en ? 'Copy manually or download the text.' : 'Copia manualmente o descarga el texto.')
  }
}
