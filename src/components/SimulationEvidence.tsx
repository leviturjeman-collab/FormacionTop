import { store, useStudent } from '../store'
import { useLocale } from '../i18n'
import { href, useRoute } from '../router'
import { taskKey } from '../project-workspace'

export default function SimulationEvidence({ title }: { title: string }) {
  const student = useStudent()
  const route = useRoute()
  const en = useLocale() === 'en'
  const source = 'slug' in route ? route.slug : 'lessonId' in route ? route.lessonId : route.name
  const slug = `simulation:${source}:${taskKey({ title, action: '', expect: '' })}`
  const evidence = student.lessons[slug]?.notes.intermedio?.evidence || ''
  return <details className="st-block"><summary>{en ? 'Try it with your own test data' : 'Pruébalo con tus propios datos de prueba'}</summary>
    <p>{en ? 'This simulation does not execute an external service. Follow the lesson setup in your test environment, run a normal and a failing case, and record what actually happened.' : 'Esta simulación no ejecuta un servicio externo. Sigue la preparación de la lección en tu entorno de pruebas, ejecuta un caso normal y otro de fallo y registra lo que ocurrió realmente.'}</p>
    <label>{en ? 'Environment, test input, expected/actual result and evidence link' : 'Entorno, entrada de prueba, resultado esperado/observado y enlace de evidencia'}<textarea value={evidence} onChange={e => store.setNote(slug, 'intermedio', 'evidence', e.target.value)} /></label>
    <p>{en ? 'Saved as your own observation; this does not certify the integration.' : 'Se guarda como observación propia; no certifica la integración.'}</p>
    <a href={href({ name: 'mi-proyecto' })}>{en ? 'Add the result to your project tests and artifacts' : 'Añade el resultado a las pruebas y entregables de tu proyecto'}</a>
  </details>
}
