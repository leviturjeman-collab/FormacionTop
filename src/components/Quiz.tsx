import { useMemo, useState } from 'react'
import { BadgeCheck, Check, RotateCcw, X } from 'lucide-react'
import type { LevelId, QuizQuestion } from '../types'
import { store } from '../store'
import { useLocale } from '../i18n'

/**
 * Autoevaluación.
 *
 * Regla: al fallar no se dice «incorrecto» y se pasa. Se explica por qué esa
 * opción resulta creíble y dónde se rompe. El error mal entendido se repite.
 */

/** Baraja estable: mismo orden en cada visita, pero la correcta no siempre va primera. */
function shuffle<T>(items: T[], seed: number): T[] {
  const out = [...items]
  let value = seed * 9301 + 49297
  for (let index = out.length - 1; index > 0; index -= 1) {
    value = (value * 9301 + 49297) % 233280
    const target = Math.floor((value / 233280) * (index + 1))
    ;[out[index], out[target]] = [out[target], out[index]]
  }
  return out
}

function hash(value: string) {
  let total = 0
  for (let index = 0; index < value.length; index += 1) total = (total * 31 + value.charCodeAt(index)) % 100000
  return total
}

export default function Quiz({ questions, slug, level }: { questions: QuizQuestion[]; slug: string; level: LevelId }) {
  const locale = useLocale()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [round, setRound] = useState(0)

  const prepared = useMemo(
    () =>
      questions.map((question, index) => ({
        ...question,
        options: shuffle(question.options, hash(question.prompt) + index + round),
      })),
    [questions, round],
  )

  if (!questions.length) return null

  const answeredCount = Object.keys(answers).length
  const correctCount = prepared.reduce(
    (sum, question, index) => sum + (answers[index] !== undefined && question.options[answers[index]].correct ? 1 : 0),
    0,
  )
  const finished = answeredCount === prepared.length

  const choose = (questionIndex: number, optionIndex: number) => {
    if (answers[questionIndex] !== undefined) return
    const next = { ...answers, [questionIndex]: optionIndex }
    setAnswers(next)
    if (Object.keys(next).length === prepared.length) {
      const score = prepared.reduce(
        (sum, question, index) => sum + (next[index] !== undefined && question.options[next[index]].correct ? 1 : 0),
        0,
      )
      store.saveQuiz(slug, level, score, prepared.length)
    }
  }

  const retry = () => {
    setAnswers({})
    setRound((value) => value + 1)
  }

  return (
    <section className="st-quiz" aria-label={locale === 'en' ? 'Self-check' : 'Autoevaluación'}>
      <header className="st-quiz-head">
        <div>
          <h2>{locale === 'en' ? 'Check yourself' : 'Compruébalo'}</h2>
          <p>
            {locale === 'en'
              ? "Answer without going back. Getting it wrong here is free; getting it wrong on a client's project isn't."
              : 'Responde sin volver atrás. Fallar aquí es gratis; fallar en el proyecto de un cliente, no.'}
          </p>
        </div>
        <span className="st-quiz-score" data-state={finished ? (correctCount === prepared.length ? 'perfect' : 'done') : 'pending'}>
          {answeredCount}/{prepared.length}
        </span>
      </header>

      <ol className="st-quiz-list">
        {prepared.map((question, questionIndex) => {
          const chosen = answers[questionIndex]
          const answered = chosen !== undefined
          return (
            <li key={question.prompt} className="st-quiz-item">
              <p className="st-quiz-prompt">
                <span >{questionIndex + 1}</span>
                {question.prompt}
              </p>

              <ul className="st-quiz-options">
                {question.options.map((option, optionIndex) => {
                  const isChosen = chosen === optionIndex
                  const state = !answered ? '' : option.correct ? ' correct' : isChosen ? ' wrong' : ' dim'
                  return (
                    <li key={option.text}>
                      <button
                        type="button"
                        className={`st-quiz-option${state}`}
                        onClick={() => choose(questionIndex, optionIndex)}
                        disabled={answered}
                        aria-pressed={isChosen}
                      >
                        <span className="st-quiz-mark">
                          {answered && option.correct && <Check size={14} />}
                          {answered && isChosen && !option.correct && <X size={14} />}
                          {!answered && String.fromCharCode(97 + optionIndex)}
                        </span>
                        <span className="st-quiz-text">{option.text}</span>
                      </button>
                      {answered && (isChosen || option.correct) && (
                        <p className={`st-quiz-why${option.correct ? ' good' : ' bad'}`}>{option.why}</p>
                      )}
                    </li>
                  )
                })}
              </ul>

              {answered && question.explain && (
                <p className="st-quiz-explain">
                  <BadgeCheck size={14} />
                  {question.explain}
                </p>
              )}
            </li>
          )
        })}
      </ol>

      {finished && (
        <footer className="st-quiz-footer">
          <p>
            {locale === 'en'
              ? correctCount === prepared.length
                ? "All correct. You've got this level."
                : correctCount >= prepared.length / 2
                  ? `${correctCount} of ${prepared.length}. Re-read what you got wrong: that's what still doesn't click.`
                  : `${correctCount} of ${prepared.length}. It's worth re-reading the lesson before moving on; it's not wasted time.`
              : correctCount === prepared.length
                ? 'Todas correctas. Este nivel lo tienes.'
                : correctCount >= prepared.length / 2
                  ? `${correctCount} de ${prepared.length}. Vuelve a leer los fallos: ahí está lo que todavía no encaja.`
                  : `${correctCount} de ${prepared.length}. Merece la pena releer la lección antes de seguir; no es tiempo perdido.`}
          </p>
          <button type="button" className="st-btn-ghost" onClick={retry}>
            <RotateCcw size={15} />
            {locale === 'en' ? 'Retry' : 'Repetir'}
          </button>
        </footer>
      )}
    </section>
  )
}
