import { Clock, ChevronRight } from 'lucide-react'
import type { Lesson, LevelId } from '../types'
import { useCourse } from '../course'
import { href } from '../router'
import { useStudent } from '../store'
import { ToolDots } from './Brand'

const SHORT: Record<LevelId, string> = { basico: 'B', intermedio: 'I', avanzado: 'A' }
const ALL: LevelId[] = ['basico', 'intermedio', 'avanzado']

/** Fila de lección, en el formato de lista del diseño original. */
export function LessonRow({ lesson, level, showCategory = true }: { lesson: Lesson; level: LevelId; showCategory?: boolean }) {
  const course = useCourse()
  const student = useStudent()
  const done = student.lessons[lesson.slug]?.done || []
  const esFicha = lesson.format === 'ficha'
  const content = lesson.levels[esFicha ? 'intermedio' : level]
  const category = course.categories.find((item) => item.id === lesson.categoryId)
  const section = course.sections.find((item) => item.id === lesson.sectionId)

  return (
    <a className="st-lesson-row" href={href({ name: 'leccion', slug: lesson.slug, level })}>
      <span className={`st-dot${done.length === 3 ? ' complete' : ''}`}>
        {done.length ? `${done.length}/3` : ''}
      </span>

      <div>
        <small className={esFicha ? 'es-ficha' : ''}>{esFicha ? 'Ficha' : lesson.kindLabel}</small>
        <strong>{lesson.title}</strong>
        <p>{content.headline}</p>
      </div>

      {showCategory && (
        <div className="st-lesson-cat">
          <b>{category?.label || lesson.folderLabel}</b>
          <span>{section?.label}</span>
        </div>
      )}

      <div className="st-lesson-side">
        <span><Clock size={10} /> {content.minutes} min</span>
        {!esFicha && (
          <span className="st-levels">
            {ALL.map((item) => (
              <i key={item} className={done.includes(item) ? 'on' : ''} title={item}>{SHORT[item]}</i>
            ))}
          </span>
        )}
        <ToolDots tools={lesson.tools} />
      </div>

      <ChevronRight size={14} color="#aab2ac" />
    </a>
  )
}

export default function LessonList({ lessons, level, showCategory = true }: { lessons: Lesson[]; level: LevelId; showCategory?: boolean }) {
  if (!lessons.length) {
    return <p className="st-empty">Ninguna lección coincide con estos filtros. Quita alguno para ver más.</p>
  }
  return (
    <div className="st-lesson-rows">
      {lessons.map((lesson) => (
        <LessonRow key={lesson.slug} lesson={lesson} level={level} showCategory={showCategory} />
      ))}
    </div>
  )
}
