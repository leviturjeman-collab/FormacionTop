import { useMemo, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { CostCalcPiece } from '../types'
import { useLocale } from '../i18n'

/**
 * Calculadora de coste por tokens.
 *
 * El coste de un sistema con IA es abstracto hasta que ves la cifra mensual.
 * Los precios son orientativos y están congelados en el momento de escribir
 * la lección: sirven para entender la ESTRUCTURA del gasto, no para presupuestar.
 */

const fmtEs = (value: number) =>
  value < 1
    ? `${(value * 100).toFixed(1).replace('.', ',')} céntimos`
    : `${value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`

const fmtEn = (value: number) =>
  value < 1
    ? `${(value * 100).toFixed(1)} cents`
    : `€${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function CostCalc({ piece }: { piece: CostCalcPiece }) {
  const locale = useLocale()
  const fmt = locale === 'en' ? fmtEn : fmtEs
  const [modelId, setModelId] = useState(piece.models[1]?.id || piece.models[0].id)
  const [callsPerDay, setCalls] = useState(200)
  const [inputTokens, setInput] = useState(1200)
  const [outputTokens, setOutput] = useState(400)
  const [cached, setCached] = useState(0)
  const [retryRate, setRetries] = useState(5)

  const model = piece.models.find((item) => item.id === modelId) || piece.models[0]

  const result = useMemo(() => {
    const monthlyCalls = callsPerDay * 30 * (1 + retryRate / 100)
    const cachedShare = cached / 100
    // El contexto cacheado se factura mucho más barato: es la palanca de ahorro
    // que más se ignora.
    const inputCost = ((inputTokens * (1 - cachedShare) * model.input) + (inputTokens * cachedShare * model.cachedInput)) / 1_000_000
    const outputCost = (outputTokens * model.output) / 1_000_000
    const perCall = inputCost + outputCost
    const monthly = perCall * monthlyCalls
    const wastedOnRetries = perCall * callsPerDay * 30 * (retryRate / 100)
    const savedByCache = ((inputTokens * cachedShare * (model.input - model.cachedInput)) / 1_000_000) * monthlyCalls
    return { perCall, monthly, monthlyCalls, wastedOnRetries, savedByCache }
  }, [model, callsPerDay, inputTokens, outputTokens, cached, retryRate])

  const cheapest = piece.models.reduce((best, item) => {
    const cost = ((inputTokens * ((1-cached/100) * item.input + cached/100 * item.cachedInput)) + (outputTokens * item.output)) / 1_000_000
    const bestCost = ((inputTokens * ((1-cached/100) * best.input + cached/100 * best.cachedInput)) + (outputTokens * best.output)) / 1_000_000
    return cost < bestCost ? item : best
  }, piece.models[0])

  const slider = (
    label: string,
    value: number,
    setter: (next: number) => void,
    min: number,
    max: number,
    step: number,
    suffix: string,
  ) => (
    <label className="st-calc-row">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => setter(Number(event.target.value))} />
      <b>{value.toLocaleString(locale === 'en' ? 'en-US' : 'es-ES')}{suffix}</b>
    </label>
  )

  return (
    <figure className="st-piece">
      <header className="st-piece-head">
        <div>
          <h4>{piece.title}</h4>
          <p>{piece.caption}</p>
        </div>
        <span className="st-piece-badge">{locale === 'en' ? `Prices as of ${piece.priceDate}` : `Precios de ${piece.priceDate}`}</span>
      </header>

      <div className="st-calc">
        <div className="st-calc-controls">
          <label className="st-calc-row">
            <span>{locale === 'en' ? 'Model' : 'Modelo'}</span>
            <select value={modelId} onChange={(event) => setModelId(event.target.value)}>
              {piece.models.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
            <b>{locale === 'en' ? `€${model.input} / M input` : `${model.input} € / M entrada`}</b>
          </label>

          {slider(locale === 'en' ? 'Calls per day' : 'Llamadas al día', callsPerDay, setCalls, 10, 5000, 10, '')}
          {slider(locale === 'en' ? 'Input tokens' : 'Tokens de entrada', inputTokens, setInput, 100, 20000, 100, '')}
          {slider(locale === 'en' ? 'Output tokens' : 'Tokens de salida', outputTokens, setOutput, 50, 4000, 50, '')}
          {slider(locale === 'en' ? 'Cached context' : 'Contexto cacheado', cached, setCached, 0, 90, 5, ' %')}
          {slider(locale === 'en' ? 'Retries and errors' : 'Reintentos y errores', retryRate, setRetries, 0, 40, 1, ' %')}
        </div>

        <div className="st-calc-out">
          <div className="st-calc-big">
            <strong>{fmt(result.monthly)}</strong>
            <span>
              {locale === 'en'
                ? `per month, with ${Math.round(result.monthlyCalls).toLocaleString('en-US')} calls`
                : `al mes, con ${Math.round(result.monthlyCalls).toLocaleString('es-ES')} llamadas`}
            </span>
          </div>

          <dl className="st-stat-list">
            <div><dt>{locale === 'en' ? 'Per call' : 'Por llamada'}</dt><dd>{fmt(result.perCall)}</dd></div>
            <div><dt>{locale === 'en' ? 'Per year' : 'Al año'}</dt><dd>{fmt(result.monthly * 12)}</dd></div>
            <div><dt>{locale === 'en' ? 'Lost on retries' : 'Se va en reintentos'}</dt><dd>{fmt(result.wastedOnRetries)}</dd></div>
            <div><dt>{locale === 'en' ? 'Saved with cache' : 'Ahorras con caché'}</dt><dd>{fmt(result.savedByCache)}</dd></div>
          </dl>

          {model.id !== cheapest.id && (
            <p className="st-calc-hint">
              <AlertTriangle size={11} />
              {locale === 'en' ? (
                <>With <b>{cheapest.label}</b> this same load would cost noticeably less. The question isn't which is better:
                it's whether your task really needs {model.label}.</>
              ) : (
                <>Con <b>{cheapest.label}</b> esta misma carga costaría bastante menos. La pregunta no es cuál es mejor:
                es si tu tarea necesita de verdad {model.label}.</>
              )}
            </p>
          )}
        </div>
      </div>

      <p className="st-calc-note">{piece.note}</p>
    </figure>
  )
}
