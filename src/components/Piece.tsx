import type { InteractivePiece } from '../types'
import FlowDiagram from './FlowDiagram'
import Terminal from './Terminal'
import PromptLab from './PromptLab'
import Compare from './Compare'
import CostCalc from './CostCalc'
import Chunking from './Chunking'
import Timeline from './Timeline'
import CaseSim from './CaseSim'
import Anatomy from './Anatomy'
import Pipeline from './Pipeline'
import { Bars, Chat, Checklist, FileTree, Flashcards } from './Visuals'
import { Canvas, DataFlow, Decision, ScreenMap, BeforeAfter } from './Diagrams'

/**
 * Pinta una pieza interactiva, sea cual sea.
 *
 * Vive aparte porque lo usan dos sitios: las lecciones generadas desde la
 * bóveda y las escritas a mano. Antes el listado estaba metido dentro de una
 * página, y por eso las lecciones escritas a mano no podían enseñar ni un
 * diagrama.
 */
export default function Piece({ piece }: { piece: InteractivePiece }) {
  switch (piece.kind) {
    case 'flow': return <FlowDiagram piece={piece} />
    case 'terminal': return <Terminal piece={piece} />
    case 'promptlab': return <PromptLab piece={piece} />
    case 'compare': return <Compare piece={piece} />
    case 'costcalc': return <CostCalc piece={piece} />
    case 'chunking': return <Chunking piece={piece} />
    case 'timeline': return <Timeline piece={piece} />
    case 'cases': return <CaseSim piece={piece} />
    case 'anatomy': return <Anatomy piece={piece} />
    case 'pipeline': return <Pipeline piece={piece} />
    case 'filetree': return <FileTree piece={piece} />
    case 'checklist': return <Checklist piece={piece} />
    case 'bars': return <Bars piece={piece} />
    case 'flashcards': return <Flashcards piece={piece} />
    case 'chat': return <Chat piece={piece} />
    case 'canvas': return <Canvas piece={piece} />
    case 'dataflow': return <DataFlow piece={piece} />
    case 'decision': return <Decision piece={piece} />
    case 'screenmap': return <ScreenMap piece={piece} />
    case 'beforeafter': return <BeforeAfter piece={piece} />
    default: return null
  }
}
