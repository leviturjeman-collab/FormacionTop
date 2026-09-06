import { useEffect, useState } from 'react'
import { adminRpc, learnerRpc, useSession } from '../session'
import { useLocale } from '../i18n'
import { href } from '../router'

type Person = { id: string; name: string }
type ClassRoom = { id: string; name: string; teacherId: string | null; teacherName: string | null; students: (Person & { status: string; completedLessons: number })[] }
type Data = { classes: ClassRoom[]; teachers: Person[] }
export default function Classes() {
  const session = useSession()
  const en = useLocale() === 'en'
  const admin = session.profile?.role === 'admin'
  const allowed = admin || session.profile?.isTeacher
  const [data, setData] = useState<Data>({ classes: [], teachers: [] })
  const [people, setPeople] = useState<Person[]>([])
  const [name, setName] = useState('')
  const [teacher, setTeacher] = useState('')
  const [person, setPerson] = useState('')
  const [enroll, setEnroll] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function load() {
    setData(await learnerRpc<Data>('academy_classes_list'))
    if (admin) setPeople(await adminRpc<Person[]>('academy_admin_learners'))
  }
  async function run(operation: () => Promise<void>) {
    setBusy(true); setError('')
    try { await operation() } catch (e) { setError(e instanceof Error ? e.message : String(e)) } finally { setBusy(false) }
  }
  async function change(operation: string, payload: Record<string, unknown>) { await adminRpc('academy_classes_manage', { operation, payload }); await load() }
  useEffect(() => { if (allowed) void run(load) }, [allowed, admin])
  if (!allowed) return <div className="st-page"><h1>{en ? 'Restricted access' : 'Acceso restringido'}</h1><p>{en ? 'A verified teaching account is required.' : 'Se necesita una cuenta docente verificada.'}</p></div>
  return <div className="st-page st-classes"><header className="st-page-title"><span className="st-kicker">{en ? 'Teaching' : 'Docencia'}</span><h1>{en ? 'Classes and teachers' : 'Clases y profesores'}</h1><p>{admin ? (en ? 'Assign teaching access, create classes and enroll students. Teachers see only their assigned classes.' : 'Asigna acceso docente, crea clases e incorpora alumnos. Cada profesor ve solo sus clases asignadas.') : (en ? 'These are your assigned classes. Student PINs and administration remain private.' : 'Estas son tus clases asignadas. Los PIN de alumnos y la administración permanecen privados.')}</p></header>
    <button className="st-btn-ghost" type="button" disabled={busy} onClick={() => void run(load)}>{en ? 'Refresh' : 'Actualizar'}</button><p role="status">{busy ? (en ? 'Saving and loading…' : 'Guardando y cargando…') : error}</p>
    {admin && <><section className="st-panel"><h2>{en ? 'Teaching access' : 'Acceso docente'}</h2><p>{en ? 'Create a profile and PIN in Administration, then select it here. This grants access to assigned classes, without superadministrator permissions.' : 'Crea una ficha y un PIN en Administración y selecciónala aquí. Esto permite consultar clases asignadas, sin permisos de superadministrador.'} <a href={href({ name: 'admin' })}>{en ? 'Open administration' : 'Abrir administración'}</a></p><form onSubmit={e => { e.preventDefault(); void run(async () => { await change('teacher_enable', { accountId: person }); setPerson('') }) }}><label>{en ? 'Profile' : 'Perfil'}<select required value={person} onChange={e => setPerson(e.target.value)}><option value="">{en ? 'Select profile' : 'Seleccionar perfil'}</option>{people.filter(p => !data.teachers.some(t => t.id === p.id)).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><button className="st-btn" disabled={busy || !person}>{en ? 'Grant teaching access' : 'Habilitar como profesor'}</button></form>{data.teachers.map(t => <div className="st-class-person" key={t.id}><span>{t.name}</span><button type="button" className="st-btn-ghost" disabled={busy} onClick={() => void run(() => change('teacher_disable', { accountId: t.id }))}>{en ? 'Remove teaching access' : 'Quitar acceso docente'}</button></div>)}</section>
    <section className="st-panel"><h2>{en ? 'Create class' : 'Crear clase'}</h2><form onSubmit={e => { e.preventDefault(); void run(async () => { await change('create', { name, teacherId: teacher }); setName('') }) }}><label>{en ? 'Class name' : 'Nombre de la clase'}<input required maxLength={120} value={name} onChange={e => setName(e.target.value)} /></label><label>{en ? 'Teacher' : 'Profesor'}<select value={teacher} onChange={e => setTeacher(e.target.value)}><option value="">{en ? 'Unassigned' : 'Sin asignar'}</option>{data.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label><button className="st-btn" disabled={busy || !name.trim()}>{en ? 'Create class' : 'Crear clase'}</button></form></section></>}
    {!data.classes.length && <p>{en ? 'No classes assigned yet.' : 'Todavía no hay clases asignadas.'}</p>}
    {data.classes.map(c => <section className="st-panel" key={c.id}><h2>{c.name}</h2><p>{c.teacherName || (en ? 'No assigned teacher' : 'Sin profesor asignado')} · {c.students.length} {en ? 'students' : 'alumnos'}</p>{admin && <label>{en ? 'Assign teacher' : 'Asignar profesor'}<select disabled={busy} value={c.teacherId || ''} onChange={e => void run(() => change('update', { classId: c.id, teacherId: e.target.value }))}><option value="">{en ? 'Unassigned' : 'Sin asignar'}</option>{data.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>}
    <ul className="st-class-students">{c.students.map(s => <li key={s.id}><div><strong>{s.name}</strong><p>{s.completedLessons} {en ? 'lessons marked complete' : 'lecciones marcadas como completadas'}</p></div>{admin && <button type="button" className="st-btn-ghost" disabled={busy} onClick={() => void run(() => change('unenroll', { classId: c.id, learnerId: s.id }))}>{en ? 'Remove from class' : 'Sacar de esta clase'}</button>}</li>)}</ul>
    {admin && <form onSubmit={e => { e.preventDefault(); void run(async () => { await change('enroll', { classId: c.id, learnerId: enroll[c.id] }); setEnroll(current => ({...current, [c.id]: ''})) }) }}><label>{en ? 'Add student' : 'Añadir alumno'}<select required value={enroll[c.id] || ''} onChange={e => setEnroll({...enroll, [c.id]: e.target.value})}><option value="">{en ? 'Select student' : 'Seleccionar alumno'}</option>{people.filter(p => !c.students.some(s => s.id === p.id) && !data.teachers.some(t => t.id === p.id)).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><button className="st-btn" disabled={busy || !enroll[c.id]}>{en ? 'Enroll' : 'Incorporar'}</button></form>}</section>)}
  </div>
}
