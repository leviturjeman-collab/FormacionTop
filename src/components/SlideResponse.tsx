import type { LevelId, QuizQuestion } from '../types'
import { store, useLessonProgress } from '../store'
import { useLocale } from '../i18n'
import Quiz from './Quiz'

export default function SlideResponse({ storageKey, level = 'intermedio', options, question }: { storageKey: string; level?: LevelId; options?: string[]; question?: QuizQuestion }) {
  const progress = useLessonProgress(storageKey)
  const notes = progress.notes[level] || {}
  const en = useLocale() === 'en'
  return <section className="st-slide-response st-project-workspace">
    {question ? <Quiz key={storageKey} questions={[question]} slug={storageKey} level={level} /> : options?.length ? <label>{en ? 'Choose a starting answer' : 'Elige una respuesta inicial'}<select value={notes.choice || ''} onChange={e => store.setNote(storageKey, level, 'choice', e.target.value)}><option value="">{en ? 'Select or write your own answer below' : 'Selecciona o escribe tu respuesta debajo'}</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label> : null}
    <label>{en ? 'Your answer, reasoning or practical evidence' : 'Tu respuesta, razonamiento o evidencia práctica'}<textarea aria-label={en ? 'Your answer, reasoning or practical evidence' : 'Tu respuesta, razonamiento o evidencia práctica'} value={notes.response || ''} onChange={e => store.setNote(storageKey, level, 'response', e.target.value)} /></label>
    <label>{en ? 'Feedback received and what you would change' : 'Feedback recibido y qué cambiarías'}<textarea aria-label={en ? 'Feedback received and what you would change' : 'Feedback recibido y qué cambiarías'} value={notes.feedback || ''} onChange={e => store.setNote(storageKey, level, 'feedback', e.target.value)} /></label>
    <p>{en ? 'Your responses stay in your progress and its export. Open questions have no automatic score; record the feedback you actually receive.' : 'Tus respuestas quedan en tu progreso y su exportación. Las preguntas abiertas no reciben nota automática; registra el feedback que realmente recibas.'}</p>
  </section>
}
