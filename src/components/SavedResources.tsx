import { store, useStudent } from '../store'
import { useLocale } from '../i18n'
import SaveResourceButton from './SaveResourceButton'

export default function SavedResources() {
  const student = useStudent()
  const en = useLocale() === 'en'
  const resources = student.project?.savedResources || []
  return <section className="st-panel st-saved-resources"><h2>{en ? 'My reference library' : 'Mi biblioteca de consulta'}</h2>
    <p>{en ? 'Lessons, dictionary words and kits saved for this project.' : 'Lecciones, palabras del diccionario y kits guardados para este proyecto.'}</p>
    {!resources.length && <p>{en ? 'Open a lesson, word or kit and select Save to my project.' : 'Abre una lección, palabra o kit y pulsa Guardar en mi proyecto.'}</p>}
    {(['lesson', 'term', 'kit'] as const).map(kind => {
      const items = resources.filter(item => item.kind === kind)
      return items.length ? <div key={kind}><h3>{({ lesson: en ? 'Lessons' : 'Lecciones', term: en ? 'Dictionary' : 'Diccionario', kit: 'Kits' })[kind]}</h3><ul>{items.map(item => <li key={item.id}><a href={item.href} onClick={() => { if (item.kind === 'term' && item.locale) store.setLocale(item.locale) }}>{item.title}</a><SaveResourceButton resource={item} /></li>)}</ul></div> : null
    })}
  </section>
}
