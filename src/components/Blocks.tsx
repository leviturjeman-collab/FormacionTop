import { useState } from 'react'
import {
  AlertTriangle, Ban, Check, CheckCheck, ClipboardList, Code2, Coins, Copy, FileText,
  Layers, Lightbulb, ListChecks, MousePointerClick, PackageCheck, Puzzle, Quote, Rocket,
  Scale, ScrollText, Terminal as TerminalIcon, TriangleAlert, UserPlus, X, Languages, Footprints, ExternalLink,
} from 'lucide-react'
import type { Block, BlockKind, GlossaryItem } from '../types'
import { BrandMark, ToolStrip } from './Brand'
import Parts from './Parts'
import Install from './Install'

const ICONS: Record<BlockKind, typeof Lightbulb> = {
  idea: Lightbulb,
  porque: FileText,
  analogia: Quote,
  glosario: ScrollText,
  noes: Ban,
  herramientas: Puzzle,
  requisitos: PackageCheck,
  pasos: ListChecks,
  detalle: Layers,
  comandos: TerminalIcon,
  codigo: ScrollText,
  tabla: ClipboardList,
  comprobar: CheckCheck,
  riesgos: AlertTriangle,
  coste: Coins,
  decisiones: ListChecks,
  receta: Code2,
  app: MousePointerClick,
  importa: Scale,
  ejemplo: Rocket,
  seccion: Layers,
  instalar: PackageCheck,
  cuenta: UserPlus,
  palabras: Languages,
  primeros: Footprints,
}

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="st-code">
      {lang && <em>{lang}</em>}
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(code).then(
            () => {
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1600)
            },
            () => setCopied(false),
          )
        }}
      >
        <Copy size={11} />
        {copied ? 'Copiado' : 'Copiar'}
      </button>
      <pre><code>{code}</code></pre>
    </div>
  )
}

function isGlossary(item: string | GlossaryItem): item is GlossaryItem {
  return typeof item === 'object' && item !== null && 'term' in item
}

const strings = (items?: (string | GlossaryItem)[]) =>
  (items || []).filter((item): item is string => typeof item === 'string')

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="st-blocks">
      {blocks.map((block, index) => {
        if (block.kind === 'instalar') return <Install key={index} block={block} />
        const Icon = ICONS[(block.icon as BlockKind) || block.kind] || ICONS[block.kind] || Lightbulb
        return (
          <section key={`${block.kind}-${index}`} className={`st-block st-block-${block.kind}`}>
            <h3>
              {block.app ? <BrandMark icon={block.app.icon} size={16} /> : <Icon size={15} />}
              {block.title}
            </h3>

            {block.text && <p>{block.text}</p>}

            {block.kind === 'seccion' && block.parts && <Parts parts={block.parts} />}

            {block.kind === 'cuenta' && block.account && (
              <div className="st-account">
                <div className="st-account-head">
                  <a href={`https://${block.account.url}`} target="_blank" rel="noreferrer noopener">
                    {block.account.url} <ExternalLink size={11} />
                  </a>
                  <span>{block.account.free}</span>
                </div>
                <ol className="st-app-steps">
                  {block.account.steps.map((item, itemIndex) => {
                    const [paso, como] = item.split(' — ')
                    return (
                      <li key={itemIndex}>
                        <span>{itemIndex + 1}</span>
                        <div>
                          <strong>{paso}</strong>
                          <p>{como}</p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
                {block.account.warning && (
                  <p className="st-account-warning">
                    <TriangleAlert size={12} />
                    <span>{block.account.warning}</span>
                  </p>
                )}
              </div>
            )}

            {block.kind === 'palabras' && (
              <dl className="st-words">
                {(block.items || []).filter(isGlossary).map((item) => (
                  <div key={item.term}>
                    <dt>{item.term}</dt>
                    <dd>{item.meaning}</dd>
                  </div>
                ))}
              </dl>
            )}

            {block.kind === 'primeros' && (
              <ol className="st-first-steps">
                {strings(block.items).map((item, itemIndex) => (
                  <li key={itemIndex}><span>{itemIndex + 1}</span><p>{item}</p></li>
                ))}
              </ol>
            )}

            {block.kind === 'glosario' && (
              <dl className="st-glossary">
                {(block.items || []).filter(isGlossary).map((item) => (
                  <div key={item.term}>
                    <dt>{item.term}</dt>
                    <dd>{item.meaning}</dd>
                  </div>
                ))}
              </dl>
            )}

            {block.kind === 'herramientas' && <ToolStrip tools={strings(block.items)} size={15} />}

            {block.kind === 'pasos' && (
              <ol className="st-steps">
                {strings(block.items).map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <span>{itemIndex + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            )}

            {block.kind === 'comandos' && (
              <ul className="st-commands">
                {strings(block.items).map((item) => (
                  <li key={item}><code>{item}</code></li>
                ))}
              </ul>
            )}

            {['noes', 'requisitos', 'comprobar', 'riesgos', 'decisiones'].includes(block.kind) && (
              <ul className="st-plain">
                {strings(block.items).map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            )}

            {block.kind === 'codigo' && block.code && <CodeBlock code={block.code} lang={block.lang} />}

            {block.kind === 'receta' && block.code && (
              <div className="st-recipe">
                {block.install && (
                  <p className="st-recipe-install"><b>Instalar:</b> <code>{block.install}</code></p>
                )}
                <CodeBlock code={block.code} lang={block.lang} />
                {block.lines && (
                  <dl className="st-recipe-lines">
                    {block.lines.map(([fragment, meaning]) => (
                      <div key={fragment}>
                        <dt><code>{fragment}</code></dt>
                        <dd>{meaning}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {block.errors && block.errors.length > 0 && (
                  <div className="st-recipe-errors">
                    <strong>Errores que vas a ver</strong>
                    <dl>
                      {block.errors.map(([error, fix]) => (
                        <div key={error}>
                          <dt>{error}</dt>
                          <dd>{fix}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
                {block.adapt && <p className="st-recipe-adapt"><b>Para tu proyecto:</b> {block.adapt}</p>}
              </div>
            )}

            {block.kind === 'app' && (
              <ol className="st-app-steps">
                {strings(block.items).map((item, itemIndex) => {
                  const [paso, como] = item.split(' — ')
                  return (
                    <li key={itemIndex}>
                      <span>{itemIndex + 1}</span>
                      <div>
                        <strong>{paso}</strong>
                        <p>{como}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}

            {block.kind === 'importa' && (
              <div className="st-matters">
                <div className="st-matters-yes">
                  <strong><Check size={11} /> Presta atención a esto</strong>
                  <ul>{(block.matters || []).map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div className="st-matters-no">
                  <strong><X size={11} /> Puedes ignorar esto</strong>
                  <ul>{(block.ignore || []).map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </div>
            )}

            {block.kind === 'ejemplo' && (
              <ol className="st-example">
                {strings(block.items).map((item, itemIndex) => (
                  <li key={itemIndex}><span>{itemIndex + 1}</span>{item}</li>
                ))}
              </ol>
            )}

            {block.kind === 'tabla' && block.table && (
              <div className="st-table">
                <table>
                  <thead>
                    <tr>{block.table.header.map((cell, cellIndex) => <th key={cellIndex}>{cell || '—'}</th>)}</tr>
                  </thead>
                  <tbody>
                    {block.table.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {block.table!.header.map((_, cellIndex) => <td key={cellIndex}>{row[cellIndex] || '—'}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
