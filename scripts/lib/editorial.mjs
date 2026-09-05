/** Conservative editorial rules: remove identified scaffolding, never source code or tables. */
const boilerplate = [
  /su funci[oó]n es desarrollar el tema/i,
  /la regla de esta academia es que cada archivo importante debe poder sostener una clase/i,
  /el modelo mental recomendado es pensar en cada tema como una pieza dentro de un sistema mayor/i,
  /la pregunta central es: qu[eé] cambia en el trabajo del alumno cuando domina este tema/i,
  /el alumno debe generar ideas propias.*puede convertir el tema en una checklist/i,
  /ideas posibles: una ficha de una p[aá]gina, una presentaci[oó]n de cinco diapositivas/i,
  /una versi[oó]n peque[ñn]a y funcionando de lo que explica/i,
]

export const isEditorialBoilerplate = (text = '') => boilerplate.some(pattern => pattern.test(text))

export function cleanEditorialBlocks(blocks = []) {
  return blocks.flatMap(block => {
    if (block.parts) {
      const parts = block.parts.filter(part => part.type !== 'p' || !isEditorialBoilerplate(part.text))
      return parts.length ? [{ ...block, parts }] : []
    }
    if (block.code || block.table) return [block]
    return isEditorialBoilerplate(block.text) ? [] : [block]
  })
}

export function substantiveWords(blocks = []) {
  return cleanEditorialBlocks(blocks).filter(block => block.from === 'vault' || block.kind === 'seccion').reduce((sum, block) => sum + (block.parts || []).reduce((total, part) => {
    const words = [part.text || '', ...(part.items || []), ...(part.rows || part.table?.rows || []).flat(), ...(part.header || [])].join(' ').split(/\s+/).filter(Boolean).length
    return total + words
  }, 0), 0)
}

/** Length alone does not turn a reference document into a guided exercise. */
export function classifySource(signal, realWords, assetCount = 0) {
  if (assetCount > 0) return { format: 'leccion', reason: 'executable-material' }
  const steps = (signal.steps || []).filter(step => !isEditorialBoilerplate(step.text) && /[a-z0-9]/i.test(step.text || ''))
  const sections = (signal.sections || []).filter(section => !isEditorialBoilerplate(section.text))
  const hasExpectedCase = sections.some(section => /resultado esperado|salida esperada|caso feliz|caso roto|comproba|expected|test case/i.test(section.title) && (section.text || '').length >= 80)
  const hasConcreteImplementation = (signal.code || []).some(block => (block.code || block.text || '').length >= 80) || (signal.commands || []).length > 0
  return steps.length >= 3 && hasExpectedCase && hasConcreteImplementation && realWords >= 200
    ? { format: 'leccion', reason: 'source-procedure-and-verification' }
    : { format: 'ficha', reason: 'reference-without-verified-guided-practice' }
}
