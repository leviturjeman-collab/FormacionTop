import { store, useStudent } from '../store'
import { useLocale } from '../i18n'
import { downloadText } from '../downloads'

export default function ProjectBudget() {
  const student = useStudent()
  const en = useLocale() === 'en'
  if (!student.project?.id) return null
  const slug = 'budget:' + student.project.id
  const values = student.lessons[slug]?.notes.intermedio || {}
  const number = (key: string) => Math.max(0, Number(values[key]) || 0)
  const set = (key: string, value: string) => store.setNote(slug, 'intermedio', key, value)
  const calls = number('calls') * (1 + number('retry') / 100)
  const api = calls * (number('input') * number('inputRate') + number('output') * number('outputRate')) / 1e6
  const total = api + number('infra') + number('review') * number('hourly') + number('maintenance') * number('hourly')
  const fields = [
    ['calls', en ? 'Monthly calls' : 'Llamadas al mes'], ['retry', en ? 'Retry allowance (%)' : 'Reintentos previstos (%)'],
    ['input', en ? 'Input tokens per call' : 'Tokens de entrada por llamada'], ['output', en ? 'Output tokens per call' : 'Tokens de salida por llamada'],
    ['inputRate', en ? 'Price per million input tokens' : 'Precio por millón de tokens de entrada'], ['outputRate', en ? 'Price per million output tokens' : 'Precio por millón de tokens de salida'],
    ['infra', en ? 'Monthly infrastructure and subscriptions' : 'Infraestructura y suscripciones al mes'], ['review', en ? 'Human review hours per month' : 'Horas de revisión humana al mes'],
    ['maintenance', en ? 'Maintenance hours per month' : 'Horas de mantenimiento al mes'], ['hourly', en ? 'Hourly cost' : 'Coste por hora'],
  ]
  return <details className="st-block st-project-workspace"><summary>{en ? 'Real project budget' : 'Presupuesto de tu proyecto real'}</summary>
    <p>{en ? 'Enter supplier prices in one currency. This estimate includes retries, human review and maintenance; it is not a supplier quote. Zero means no cost entered.' : 'Introduce las tarifas del proveedor en una misma moneda. La estimación incluye reintentos, revisión humana y mantenimiento; no es una cotización del proveedor. Cero significa coste no introducido.'}</p>
    <label>{en ? 'Currency' : 'Moneda'}<input value={values.currency || ''} placeholder="EUR / USD" onChange={e => set('currency', e.target.value)} /></label>
    <label>{en ? 'Price source and verification date' : 'Fuente de las tarifas y fecha de comprobación'}<input value={values.source || ''} onChange={e => set('source', e.target.value)} /></label>
    <div className="st-project-grid">{fields.map(([key, label]) => <label key={key}>{label}<input type="number" min="0" step="any" value={values[key] || ''} onChange={e => set(key, e.target.value)} /></label>)}</div>
    <p role="status">{en ? 'Estimated monthly cost' : 'Coste mensual estimado'}: <b>{total.toFixed(2)} {values.currency || '—'}</b> · API: {api.toFixed(2)}</p>
    <p>{en ? 'Check taxes, currency conversion, cache discounts and exceptional usage before approval.' : 'Revisa impuestos, cambio de moneda, descuentos de caché y consumos excepcionales antes de aprobarlo.'}</p>
    <label>{en ? 'Reviewer and assumptions' : 'Persona revisora y supuestos'}<textarea value={values.reviewed || ''} onChange={e => set('reviewed', e.target.value)} /></label>
    <button type="button" className="st-btn-ghost" onClick={() => downloadText('project-budget.json', JSON.stringify({ project: student.project?.name, assumptions: values, monthlyApi: api, monthlyTotal: total, exportedAt: new Date().toISOString() }, null, 2))}>{en ? 'Export budget' : 'Exportar presupuesto'}</button>
  </details>
}
