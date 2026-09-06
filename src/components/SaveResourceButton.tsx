import { Bookmark, Check } from 'lucide-react'
import { store, useStudent, type SavedResource } from '../store'
import { useLocale } from '../i18n'

export default function SaveResourceButton({ resource }: { resource: Omit<SavedResource, 'savedAt'> }) {
  const student = useStudent()
  const en = useLocale() === 'en'
  const saved = student.project?.savedResources?.some(item => item.id === resource.id)
  return <button type="button" className="st-btn-ghost" aria-pressed={!!saved} onClick={() => {
    const project = student.project || { name: en ? 'My project' : 'Mi proyecto', goal: '', audience: '', problem: '', outcome: '', tools: '', updatedAt: '' }
    const resources = (project.savedResources || []).filter(item => item.id !== resource.id)
    store.setProject({ ...project, savedResources: saved ? resources : [...resources, { ...resource, locale: en ? 'en' : 'es', savedAt: new Date().toISOString() }] })
  }}>{saved ? <Check size={15} /> : <Bookmark size={15} />}{saved ? (en ? 'Saved · remove' : 'Guardado · quitar') : (en ? 'Save to my project' : 'Guardar en mi proyecto')}</button>
}
