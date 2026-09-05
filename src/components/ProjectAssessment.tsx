import { useLocale } from '../i18n'
import { store, useStudent } from '../store'
import { assessProject, emptyWorkspace, rubric } from '../project-workspace'

export default function ProjectAssessment() {
  const { project } = useStudent()
  const english = useLocale() === 'en'
  if (!project) return null
  const workspace = { ...emptyWorkspace(), ...project.workspace }
  const assessment = workspace.assessment || { scores: {}, blockers: [], rationale: '', version: '', reviewer: '', date: '' }
  const update = (patch: Partial<typeof assessment>) => {
    const current = store.get().project
    if (current) store.setProject({ ...current, workspace: { ...emptyWorkspace(), ...current.workspace, assessment: { ...assessment, ...patch } } })
  }
  const result = assessProject(assessment)
  const statuses = english
    ? { incomplete: 'Record every criterion, version, evidence, reviewer and date.', blocked: 'Repair required: critical blockers remain.', candidate: 'Candidate for handoff; the responsible person still needs to accept it.', pilot: 'Controlled pilot only; close the requested changes.', revise: 'Revise scope and submit a new version.' }
    : { incomplete: 'Registra cada criterio, versión, evidencia, revisor y fecha.', blocked: 'Requiere reparación: quedan bloqueos críticos.', candidate: 'Candidato a entrega; falta la aceptación de la persona responsable.', pilot: 'Solo piloto controlado; cierra los cambios solicitados.', revise: 'Revisa el alcance y prepara una nueva entrega.' }
  const blockers = [
    ['secrets', 'Secreto expuesto', 'Exposed secret'], ['permission', 'Datos o acción sin permiso', 'Data or action without permission'],
    ['duplicates', 'Efectos duplicados', 'Duplicate effects'], ['shutdown', 'Apagado no probado', 'Shutdown not tested'], ['harm', 'Fallo que puede dañar al usuario', 'Failure that could harm the user'],
  ]
  return <section className="st-project-workspace">
    <details><summary><h2>{english ? 'Capstone self-assessment' : 'Autoevaluación del capstone'}</h2></summary>
    <p>{english ? 'Score only evidence from the identified version. This is a recorded self-assessment, not instructor certification. Missing evidence scores zero. A critical blocker always prevents handoff.' : 'Puntúa solo evidencia de la versión identificada. Es una autoevaluación registrada, no una certificación docente. La evidencia ausente recibe cero. Un bloqueo crítico impide la entrega aunque la suma sea alta.'}</p>
    <label>{english ? 'Tested version' : 'Versión evaluada'}<input aria-label={english ? 'Tested version' : 'Versión evaluada'} value={assessment.version} onChange={e => update({ version: e.target.value })} placeholder="v1 / commit / fecha" /></label>
    <label>{english ? 'Recorded by / reviewer' : 'Registrado por / revisor'}<input aria-label={english ? 'Recorded by / reviewer' : 'Registrado por / revisor'} value={assessment.reviewer} onChange={e => update({ reviewer: e.target.value })} /></label>
    <label>{english ? 'Review date' : 'Fecha de revisión'}<input aria-label={english ? 'Review date' : 'Fecha de revisión'} type="date" value={assessment.date} onChange={e => update({ date: e.target.value })} /></label>
    {rubric.map(item => <fieldset key={item.id}><legend>{english ? item.en : item.es} · {item.weight}%</legend><label>{english ? 'Observed level' : 'Nivel observado'}<select aria-label={english ? 'Observed level' : 'Nivel observado'} value={assessment.scores[item.id] ?? ''} onChange={e => { const scores = { ...assessment.scores }; if (e.target.value === '') delete scores[item.id]; else scores[item.id] = Number(e.target.value); update({ scores }) }}><option value="">{english ? 'Not assessed' : 'Sin evaluar'}</option>{(english ? item.english : item.levels).map((text, i) => <option key={i} value={i}>{i} · {text}</option>)}</select></label></fieldset>)}
    <fieldset><legend>{english ? 'Critical blockers still present' : 'Bloqueos críticos presentes'}</legend>{blockers.map(([id, es, en]) => <label key={id}><input type="checkbox" checked={assessment.blockers.includes(id)} onChange={e => update({ blockers: e.target.checked ? [...assessment.blockers, id] : assessment.blockers.filter(item => item !== id) })} />{english ? en : es}</label>)}</fieldset>
    <label>{english ? 'Evidence, decisions and required changes' : 'Evidencias, decisiones y cambios necesarios'}<textarea aria-label={english ? 'Evidence, decisions and required changes' : 'Evidencias, decisiones y cambios necesarios'} value={assessment.rationale} onChange={e => update({ rationale: e.target.value })} /></label>
    <p role="status"><strong>{result.score}/100.</strong> {statuses[result.status]}</p>
    <p>{english ? 'Weights sum to 100. Each criterion contributes weight × level / 2. Scores 60–79 support a controlled pilot; 80+ is a candidate only with no blockers. Record actual acceptance as attributed feedback.' : 'Los pesos suman 100. Cada criterio aporta peso × nivel / 2. De 60 a 79 permite proponer un piloto controlado; desde 80 es candidato solo sin bloqueos. Registra la aceptación real como feedback atribuido.'}</p>
  </details></section>
}
