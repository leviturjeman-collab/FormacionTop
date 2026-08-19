import { BRAND_ICONS } from '../brand-icons'
import { useCourse } from '../course'

/**
 * Logo oficial de una herramienta.
 *
 * Los monocromos heredan el color del texto para que funcionen en claro y
 * oscuro. Los de color se dejan como los publica la marca.
 */
export function BrandMark({ icon, size = 20 }: { icon: string; size?: number }) {
  const data = BRAND_ICONS[icon]
  if (!data) return null
  return (
    <svg
      className={`st-brand-mark${data.monochrome ? ' mono' : ''}`}
      viewBox={data.viewBox}
      width={size}
      height={size}
      role="img"
      aria-label={data.title}
      fill={data.monochrome ? 'currentColor' : undefined}
      dangerouslySetInnerHTML={{ __html: data.inner }}
    />
  )
}

/** Fila de herramientas de una lección, con su logo y su nombre. */
export function ToolStrip({ tools, size = 18 }: { tools: string[]; size?: number }) {
  const course = useCourse()
  const known = tools
    .map((id) => course.tools.find((tool) => tool.id === id))
    .filter((tool): tool is { id: string; label: string; icon: string } => Boolean(tool) && Boolean(BRAND_ICONS[tool!.icon]))

  if (!known.length) return null

  return (
    <ul className="st-tool-strip">
      {known.map((tool) => (
        <li key={tool.id} title={tool.label}>
          <BrandMark icon={tool.icon} size={size} />
          <span>{tool.label}</span>
        </li>
      ))}
    </ul>
  )
}

/** Solo los logos, sin texto, para tarjetas compactas. */
export function ToolDots({ tools, size = 15 }: { tools: string[]; size?: number }) {
  const course = useCourse()
  const known = tools
    .map((id) => course.tools.find((tool) => tool.id === id))
    .filter((tool): tool is { id: string; label: string; icon: string } => Boolean(tool) && Boolean(BRAND_ICONS[tool!.icon]))
    .slice(0, 5)

  if (!known.length) return null

  return (
    <span className="st-tools" aria-label={`Herramientas: ${known.map((tool) => tool.label).join(', ')}`}>
      {known.map((tool) => (
        <span key={tool.id} title={tool.label}>
          <BrandMark icon={tool.icon} size={size} />
        </span>
      ))}
    </span>
  )
}
