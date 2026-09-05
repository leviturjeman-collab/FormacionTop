import { useMemo, useState } from 'react'
import {
  AlertTriangle, ArrowLeft, ArrowRight, Ban, Bot, Check, Clipboard, Cpu,
  Download, KeyRound, ListChecks, MessageSquare, Shield, Terminal, Workflow,
} from 'lucide-react'
import { useCourse } from '../course'
import { useLocale } from '../i18n'
import type { Locale } from '../i18n'
import { href } from '../router'
import type { AgentPlatform, ReadyAgent } from '../types'
import { BrandMark } from '../components/Brand'

/**
 * Agentes listos para usar.
 *
 * Cada agente es una configuración completa que el alumno copia e instala:
 * un subagente de Claude Code, un GPT personalizado, un flujo-agente de n8n
 * o un agente por API con su código. El contenido vive en content/agentes/.
 */

const PLATFORM_META = (locale: Locale): Record<AgentPlatform, { label: string; icon: JSX.Element; hint: string }> =>
  locale === 'en'
    ? {
        'claude-code': { label: 'Claude Code', icon: <Terminal size={13} />, hint: 'Installed as a subagent in your repository.' },
        gpt: { label: 'Custom GPT', icon: <MessageSquare size={13} />, hint: 'Created in ChatGPT with these instructions.' },
        n8n: { label: 'n8n', icon: <Workflow size={13} />, hint: 'Imported as a workflow, then connect credentials.' },
        api: { label: 'API (code)', icon: <Cpu size={13} />, hint: 'A script you run yourself, with your API key.' },
      }
    : {
        'claude-code': { label: 'Claude Code', icon: <Terminal size={13} />, hint: 'Se instala como subagente en tu repositorio.' },
        gpt: { label: 'GPT personalizado', icon: <MessageSquare size={13} />, hint: 'Se crea en ChatGPT con estas instrucciones.' },
        n8n: { label: 'n8n', icon: <Workflow size={13} />, hint: 'Se importa como workflow y se conectan credenciales.' },
        api: { label: 'API (código)', icon: <Cpu size={13} />, hint: 'Un script que ejecutas tú, con tu clave de API.' },
      }

const LEVEL_LABEL = (locale: Locale): Record<string, string> =>
  locale === 'en'
    ? { basico: 'Basic', intermedio: 'Intermediate', avanzado: 'Advanced' }
    : { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' }

function CopyButton({ text, label, ghost }: { text: string; label?: string; ghost?: boolean }) {
  const locale = useLocale()
  const [done, setDone] = useState(false)
  const defaultLabel = locale === 'en' ? 'Copy' : 'Copiar'
  return (
    <button
      type="button"
      className={ghost ? 'st-btn-ghost' : 'st-btn'}
      onClick={() => {
        navigator.clipboard?.writeText(text)
        setDone(true)
        window.setTimeout(() => setDone(false), 1600)
      }}
    >
      {done ? <Check size={12} /> : <Clipboard size={12} />} {done ? (locale === 'en' ? 'Copied' : 'Copiado') : (label ?? defaultLabel)}
    </button>
  )
}

function AgentDetail({ agent, all }: { agent: ReadyAgent; all: ReadyAgent[] }) {
  const course = useCourse()
  const locale = useLocale()
  const platformMeta = PLATFORM_META(locale)
  const levelLabel = LEVEL_LABEL(locale)
  const meta = platformMeta[agent.platform] || platformMeta.api
  const tools = (agent.tools || [])
    .map((id) => course.toolPages.find((tool) => tool.id === id))
    .filter(Boolean)
  const puesto = all.findIndex((item) => item.id === agent.id)
  const anterior = puesto > 0 ? all[puesto - 1] : null
  const siguiente = puesto >= 0 && puesto < all.length - 1 ? all[puesto + 1] : null
  const relatedKits = (agent.kits || [])
    .map((id) => (course.kits || []).find((kit) => kit.id === id))
    .filter(Boolean)

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><Bot size={12} /> {agent.kicker}</span>
        <h1>{agent.title}</h1>
        <p>{agent.what}</p>
        <div className="st-agent-meta">
          <span className="st-pill">{meta.icon} {agent.platformLabel || meta.label}</span>
          <span className="st-pill">{levelLabel[agent.level] || agent.level}</span>
          {tools.map((tool) => tool && (
            <a key={tool.id} className="st-pill" href={href({ name: 'herramienta', toolId: tool.id, filters: {} })}>
              <BrandMark icon={tool.icon} size={12} /> {tool.label}
            </a>
          ))}
        </div>
      </div>

      <div className="st-kit-columns">
        <section className="st-kit-block">
          <div className="st-section-head"><div><span className="st-kicker"><Check size={11} /> {locale === 'en' ? 'Does well' : 'Hace bien'}</span><h2>{locale === 'en' ? 'Capabilities' : 'Capacidades'}</h2></div></div>
          <ul className="st-kit-list">{agent.capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section className="st-kit-block st-kit-danger">
          <div className="st-section-head"><div><span className="st-kicker"><Ban size={11} /> {locale === 'en' ? 'Doesn’t do' : 'No hace'}</span><h2>{locale === 'en' ? 'Limits' : 'Límites'}</h2></div></div>
          <ul className="st-kit-list">{agent.limits.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      </div>

      <section className="st-kit-block">
        <div className="st-section-head"><div><span className="st-kicker">{locale === 'en' ? 'Who for' : 'Para quién'}</span><h2>{locale === 'en' ? 'When it’s worth it' : 'Cuándo compensa'}</h2></div></div>
        <p className="st-kit-plain">{agent.forWho}</p>
        <p className="st-kit-nocode"><strong>{agent.platformLabel || meta.label}.</strong> {meta.hint}</p>
      </section>

      {agent.files.map((file) => (
        <section key={file.name} className="st-kit-block">
          <div className="st-section-head">
            <div><span className="st-kicker"><Download size={11} /> {locale === 'en' ? 'Ready to copy' : 'Listo para copiar'}</span><h2>{file.name}</h2></div>
            <CopyButton text={file.content} label={locale === 'en' ? 'Copy all' : 'Copiar todo'} />
          </div>
          <pre className="st-kit-pre st-agent-file"><code>{file.content}</code></pre>
        </section>
      ))}

      {agent.flow && (
        <section className="st-kit-block">
          <div className="st-section-head">
            <div><span className="st-kicker"><Workflow size={11} /> {locale === 'en' ? 'Importable' : 'Importable'}</span><h2>{locale === 'en' ? 'The n8n flow' : 'El flujo de n8n'}</h2></div>
            <CopyButton text={JSON.stringify(agent.flow, null, 2)} label={locale === 'en' ? 'Copy the flow' : 'Copiar el flujo'} />
          </div>
          <p className="st-kit-nocode">
            {locale === 'en'
              ? <><strong>How to import it.</strong> In n8n: Workflows → Import from clipboard. Paste and confirm. The nodes appear grayed out until you connect the credentials below.</>
              : <><strong>Cómo se importa.</strong> En n8n: Workflows → Import from clipboard. Pega y acepta. Los nodos salen en gris hasta que conectes las credenciales de abajo.</>}
          </p>
          <details className="st-kit-code">
            <summary>{locale === 'en' ? 'View the full JSON' : 'Ver el JSON completo'}</summary>
            <pre><code>{JSON.stringify(agent.flow, null, 2)}</code></pre>
          </details>
        </section>
      )}

      <section className="st-kit-block">
        <div className="st-section-head"><div><span className="st-kicker"><ListChecks size={11} /> {locale === 'en' ? 'Installation' : 'Instalación'}</span><h2>{locale === 'en' ? 'Set it up step by step' : 'Móntalo paso a paso'}</h2></div></div>
        <ol className="st-kit-steps">
          {agent.setup.map((step, index) => (
            <li key={step.title}>
              <div className="st-kit-step-head">
                <span>{index + 1}</span>
                <div><strong>{step.title}</strong></div>
              </div>
              <p>{step.action}</p>
              <p className="st-kit-check"><Check size={12} /> <strong>{locale === 'en' ? 'You should see.' : 'Tienes que ver.'}</strong> {step.expect}</p>
              {step.stuck && <p className="st-kit-stuck"><AlertTriangle size={12} /> <strong>{locale === 'en' ? 'If it gets stuck.' : 'Si se atasca.'}</strong> {step.stuck}</p>}
            </li>
          ))}
        </ol>
      </section>

      {agent.credentials.length > 0 && (
        <section className="st-kit-block">
          <div className="st-section-head"><div><span className="st-kicker"><KeyRound size={11} /> {locale === 'en' ? 'Credentials' : 'Credenciales'}</span><h2>{locale === 'en' ? 'What you need to create first' : 'Lo que tienes que crear antes'}</h2></div></div>
          <div className="st-kit-table-wrap">
            <table className="st-kit-table">
              <thead><tr><th>{locale === 'en' ? 'Credential' : 'Credencial'}</th><th>{locale === 'en' ? 'Where it’s created' : 'Dónde se crea'}</th><th>{locale === 'en' ? 'How' : 'Cómo'}</th><th>{locale === 'en' ? 'Cost' : 'Coste'}</th></tr></thead>
              <tbody>
                {agent.credentials.map((cred) => (
                  <tr key={cred.name}>
                    <td><strong>{cred.name}</strong></td>
                    <td>{cred.where}</td>
                    <td>{cred.how}</td>
                    <td className="st-kit-pick">{cred.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="st-kit-block">
        <div className="st-section-head"><div><span className="st-kicker">{locale === 'en' ? 'Before you trust it' : 'Antes de fiarte'}</span><h2>{locale === 'en' ? 'Test it with these cases' : 'Pruébalo con estos casos'}</h2></div></div>
        <div className="st-kit-table-wrap">
          <table className="st-kit-table">
            <thead><tr><th>{locale === 'en' ? 'Case' : 'Caso'}</th><th>{locale === 'en' ? 'What you feed it' : 'Qué le metes'}</th><th>{locale === 'en' ? 'What it should return' : 'Qué tiene que devolver'}</th></tr></thead>
            <tbody>
              {agent.test.map((test) => (
                <tr key={test.name}>
                  <td><strong>{test.name}</strong></td>
                  <td><code className="st-kit-input">{test.input}</code></td>
                  <td>{test.expect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {(agent.examples?.length || 0) > 0 && (
        <section className="st-kit-block">
          <div className="st-section-head"><div><span className="st-kicker">{locale === 'en' ? 'Examples' : 'Ejemplos'}</span><h2>{locale === 'en' ? 'How to ask it' : 'Cómo pedírselo'}</h2></div></div>
          <div className="st-kit-prompt-list">
            {agent.examples!.map((example) => (
              <article key={example.name} className="st-kit-prompt">
                <header>
                  <div><strong>{example.name}</strong></div>
                  <div className="st-kit-prompt-actions"><CopyButton text={example.prompt} label={locale === 'en' ? 'Copy' : 'Copiar'} /></div>
                </header>
                <pre className="st-kit-pre">{example.prompt}</pre>
              </article>
            ))}
          </div>
        </section>
      )}

      {agent.risks.length > 0 && (
        <section className="st-kit-block st-kit-danger">
          <div className="st-section-head"><div><span className="st-kicker"><Shield size={11} /> {locale === 'en' ? 'Risks' : 'Riesgos'}</span><h2>{locale === 'en' ? 'Watch out for this' : 'Cuidado con esto'}</h2></div></div>
          <ul className="st-kit-list">{agent.risks.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      )}

      {relatedKits.length > 0 && (
        <section className="st-kit-block">
          <div className="st-section-head"><div><span className="st-kicker">{locale === 'en' ? 'Fits with' : 'Encaja con'}</span><h2>{locale === 'en' ? 'Kits that use this agent' : 'Kits que usan este agente'}</h2></div></div>
          <div className="st-kit-resource-list">
            {relatedKits.map((kit) => kit && (
              <a key={kit.id} href={href({ name: 'kits' })}>
                <ArrowRight size={13} />
                <span><strong>{kit.title}</strong><small>{kit.promise}</small></span>
              </a>
            ))}
          </div>
        </section>
      )}

      <nav className="st-lesson-nav">
        {anterior ? (
          <a href={href({ name: 'agentes', agentId: anterior.id })}>
            <ArrowLeft size={14} />
            <span><em>{locale === 'en' ? 'Previous' : 'Anterior'}</em><b>{anterior.title}</b></span>
          </a>
        ) : <span />}
        {siguiente && (
          <a className="next" href={href({ name: 'agentes', agentId: siguiente.id })}>
            <span><em>{locale === 'en' ? 'Next' : 'Siguiente'}</em><b>{siguiente.title}</b></span>
            <ArrowRight size={14} />
          </a>
        )}
      </nav>
    </div>
  )
}

export default function Agentes({ agentId }: { agentId?: string }) {
  const course = useCourse()
  const locale = useLocale()
  const platformMeta = PLATFORM_META(locale)
  const levelLabel = LEVEL_LABEL(locale)
  const agents = course.agents || []
  const [platform, setPlatform] = useState<AgentPlatform | 'todas'>('todas')

  const agent = agentId ? agents.find((item) => item.id === agentId) : null
  const shown = useMemo(
    () => (platform === 'todas' ? agents : agents.filter((item) => item.platform === platform)),
    [agents, platform],
  )

  if (agent) return <AgentDetail agent={agent} all={agents} />

  if (!agents.length) {
    return (
      <div className="st-page">
        <div className="st-empty">
          <h2>{locale === 'en' ? 'Agents are being prepared' : 'Los agentes se están preparando'}</h2>
          <p>
            {locale === 'en'
              ? <>Add .json files in <code>content/agentes/</code> and regenerate the index.</>
              : <>Añade archivos .json en <code>content/agentes/</code> y vuelve a generar el índice.</>}
          </p>
        </div>
      </div>
    )
  }

  const counts = (['claude-code', 'gpt', 'n8n', 'api'] as AgentPlatform[])
    .map((id) => ({ id, count: agents.filter((item) => item.platform === id).length }))
    .filter((item) => item.count > 0)

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><Bot size={12} /> {locale === 'en' ? 'Ready to install' : 'Listos para instalar'}</span>
        <h1>{locale === 'en' ? 'Agents' : 'Agentes'}</h1>
        <p>
          {locale === 'en'
            ? 'Every agent in this library is a complete configuration: the exact text or code, the installation steps, the credentials it needs, a test to verify it works and its limits. You copy, install, test and have it working.'
            : 'Cada agente de esta biblioteca es una configuración completa: el texto o el código exacto, los pasos de instalación, las credenciales que necesita, una prueba para verificar que funciona y sus límites. Copias, instalas, pruebas y lo tienes trabajando.'}
        </p>
      </div>

      <div className="st-agent-filter" role="group" aria-label={locale === 'en' ? 'Filter by platform' : 'Filtrar por plataforma'}>
        <button type="button" className={platform === 'todas' ? 'on' : ''} onClick={() => setPlatform('todas')}>
          {locale === 'en' ? 'All' : 'Todas'} · {agents.length}
        </button>
        {counts.map(({ id, count }) => (
          <button key={id} type="button" className={platform === id ? 'on' : ''} onClick={() => setPlatform(id)}>
            {platformMeta[id].icon} {platformMeta[id].label} · {count}
          </button>
        ))}
      </div>

      <div className="st-agent-grid">
        {shown.map((item) => {
          const meta = platformMeta[item.platform] || platformMeta.api
          return (
            <a key={item.id} className="st-agent-card" href={href({ name: 'agentes', agentId: item.id })}>
              <div className="st-agent-card-top">
                <span className="st-pill">{meta.icon} {item.platformLabel || meta.label}</span>
                <span className="st-pill">{levelLabel[item.level] || item.level}</span>
              </div>
              <strong>{item.title}</strong>
              <p>{item.what}</p>
              <span className="st-agent-card-foot">
                {item.setup.length} {locale === 'en' ? 'installation steps' : 'pasos de instalación'} · {item.test.length} {locale === 'en' ? 'tests' : 'pruebas'}
                <ArrowRight size={13} />
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
