import { useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, Bot, BookOpen, Boxes, GraduationCap, ListOrdered, Puzzle, Search, Sparkles } from 'lucide-react'
import { useCourse } from '../course'
import { href, navigate, type Route } from '../router'
import { useLocale } from '../i18n'

/**
 * Búsqueda en todo lo que ve el alumno.
 *
 * Antes buscaba sobre las lecciones generadas desde el vault, que ya no se
 * publican. Ahora recorre las seis cosas que existen de verdad —lecciones del
 * programa, guías, kits, herramientas, prompts, agentes y el diccionario— y
 * devuelve cada resultado con su tipo, para que el alumno sepa a dónde va antes
 * de pulsar.
 */

type Tipo = 'leccion' | 'guia' | 'kit' | 'herramienta' | 'prompt' | 'agente' | 'termino'

interface Resultado {
  clave: string
  tipo: Tipo
  titulo: string
  detalle: string
  enlace: string
  peso: number
}

const ETIQUETAS: Record<Tipo, { es: string; en: string; icono: typeof Search }> = {
  leccion: { es: 'Lección', en: 'Lesson', icono: GraduationCap },
  guia: { es: 'Guía', en: 'Guide', icono: BookOpen },
  kit: { es: 'Kit', en: 'Kit', icono: Boxes },
  herramienta: { es: 'Herramienta', en: 'Tool', icono: Puzzle },
  prompt: { es: 'Prompt', en: 'Prompt', icono: Sparkles },
  agente: { es: 'Agente', en: 'Agent', icono: Bot },
  termino: { es: 'Diccionario', en: 'Glossary', icono: ListOrdered },
}

const ORDEN: Tipo[] = ['leccion', 'guia', 'kit', 'herramienta', 'agente', 'prompt', 'termino']

const sinTildes = (valor: string) =>
  valor.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Corta un texto largo alrededor de la primera palabra buscada. */
function recorte(texto: string, aguja: string, largo = 130) {
  const limpio = texto.replace(/\s+/g, ' ').trim()
  const donde = sinTildes(limpio).indexOf(aguja)
  if (donde < 0) return limpio.slice(0, largo) + (limpio.length > largo ? '…' : '')
  const desde = Math.max(0, donde - 40)
  return (desde ? '…' : '') + limpio.slice(desde, desde + largo) + (desde + largo < limpio.length ? '…' : '')
}

export default function Buscar({ query, route }: { query: string; route: Route }) {
  const course = useCourse()
  const locale = useLocale()
  const es = locale !== 'en'
  const [texto, setTexto] = useState(query)
  const [tipoActivo, setTipoActivo] = useState<Tipo | 'todo'>('todo')

  const consulta = query.trim()

  const resultados = useMemo<Resultado[]>(() => {
    const palabras = sinTildes(consulta).split(/\s+/).filter((palabra) => palabra.length > 1)
    if (!palabras.length) return []

    const encontrados: Resultado[] = []

    // Puntúa: en el título vale mucho más que en el cuerpo, y hace falta que
    // aparezcan todas las palabras para no devolver ruido.
    const mirar = (
      clave: string, tipo: Tipo, titulo: string, cuerpo: string, detalle: string, enlace: string,
    ) => {
      const tituloPlano = sinTildes(titulo)
      const cuerpoPlano = sinTildes(cuerpo)
      let peso = 0
      for (const palabra of palabras) {
        if (tituloPlano.includes(palabra)) peso += tituloPlano.startsWith(palabra) ? 14 : 9
        else if (cuerpoPlano.includes(palabra)) peso += 2
        else return
      }
      encontrados.push({ clave, tipo, titulo, detalle: detalle || recorte(cuerpo, palabras[0]), enlace, peso })
    }

    for (const leccion of course.curso || []) {
      const cuerpo = [
        leccion.promise, leccion.why,
        ...(leccion.theory || []).map((bloque) => `${bloque.title} ${bloque.text}`),
        ...(leccion.tasks || []).map((tarea) => `${tarea.title} ${tarea.action}`),
        ...(leccion.words || []).map(([palabra, sentido]) => `${palabra} ${sentido}`),
      ].join(' ')
      mirar(`leccion:${leccion.id}`, 'leccion', leccion.title, cuerpo,
        `${leccion.minutes} min · ${leccion.promise}`,
        href({ name: 'curso', lessonId: leccion.id }))
    }

    for (const guia of course.guides || []) {
      const cuerpo = [guia.intro, ...(guia.theory || []).map((bloque) => `${bloque.title} ${bloque.text}`)].join(' ')
      mirar(`guia:${guia.id}`, 'guia', guia.title, cuerpo, guia.intro, href({ name: 'guia', guideId: guia.id }))
    }

    for (const kit of course.kits || []) {
      const cuerpo = [kit.promise, kit.plain, ...(kit.fits || [])].join(' ')
      mirar(`kit:${kit.id}`, 'kit', kit.title, cuerpo, kit.promise, href({ name: 'kits', kitId: kit.id }))
    }

    for (const tool of course.toolPages || []) {
      const cuerpo = tool.guide?.plain || ''
      mirar(`tool:${tool.id}`, 'herramienta', tool.label, cuerpo, cuerpo,
        href({ name: 'herramienta', toolId: tool.id, filters: {} }))
    }

    for (const agente of course.agents || []) {
      const cuerpo = [agente.what, agente.forWho].filter(Boolean).join(' ')
      mirar(`agente:${agente.id}`, 'agente', agente.title, cuerpo, agente.what,
        href({ name: 'agentes', agentId: agente.id }))
    }

    for (const familia of course.prompts || []) {
      for (const prompt of familia.prompts) {
        mirar(`prompt:${prompt.id}`, 'prompt', prompt.name, `${prompt.when} ${prompt.prompt}`,
          prompt.when, href({ name: 'prompts', familyId: familia.id }))
      }
    }

    for (const termino of course.glossaryIndex || []) {
      mirar(`termino:${termino.term}`, 'termino', termino.term, `${termino.meaning} ${termino.long || ''}`,
        termino.meaning, href({ name: 'indice', letter: termino.letter }))
    }

    return encontrados.sort((a, b) =>
      b.peso - a.peso ||
      ORDEN.indexOf(a.tipo) - ORDEN.indexOf(b.tipo) ||
      a.titulo.localeCompare(b.titulo, 'es'),
    )
  }, [consulta, course])

  const porTipo = useMemo(() => {
    const cuenta = new Map<Tipo, number>()
    for (const item of resultados) cuenta.set(item.tipo, (cuenta.get(item.tipo) || 0) + 1)
    return ORDEN.filter((tipo) => cuenta.has(tipo)).map((tipo) => ({ tipo, total: cuenta.get(tipo) || 0 }))
  }, [resultados])

  const visibles = tipoActivo === 'todo' ? resultados : resultados.filter((item) => item.tipo === tipoActivo)

  function buscar(event: FormEvent) {
    event.preventDefault()
    setTipoActivo('todo')
    navigate({ name: 'buscar', query: texto.trim(), filters: 'filters' in route ? route.filters : {} })
  }

  return (
    <div className="st-page">
      <div className="st-page-title">
        <span className="st-kicker"><Search size={12} /> {es ? 'Búsqueda' : 'Search'}</span>
        <h1>{es ? 'Buscar en el curso' : 'Search the course'}</h1>
        <p>
          {es
            ? 'Busca en las lecciones del programa, las guías, los kits, las herramientas, los agentes, los prompts y el diccionario. Cada resultado dice de qué tipo es antes de que entres.'
            : 'Search the program lessons, guides, kits, tools, agents, prompts and glossary. Every result tells you what it is before you open it.'}
        </p>
      </div>

      <form className="st-buscar-form" onSubmit={buscar}>
        <Search size={14} />
        <input
          autoFocus
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder={es ? 'claves, n8n, coste, rag, aprobación…' : 'keys, n8n, cost, rag, approval…'}
          aria-label={es ? 'Buscar' : 'Search'}
        />
        <button type="submit" className="st-btn">{es ? 'Buscar' : 'Search'}</button>
      </form>

      {!consulta && (
        <div className="st-empty">
          <h2>{es ? 'Escribe lo que buscas' : 'Type what you need'}</h2>
          <p>{es ? 'Con una palabra basta.' : 'One word is enough.'}</p>
        </div>
      )}

      {consulta && !resultados.length && (
        <div className="st-empty">
          <h2>{es ? `Sin resultados para «${consulta}»` : `No results for “${consulta}”`}</h2>
          <p>
            {es
              ? 'Prueba con una palabra más corta o más general. Si buscas una palabra técnica, mira en el diccionario.'
              : 'Try a shorter or more general word. For technical terms, check the glossary.'}
          </p>
          <a className="st-btn" href={href({ name: 'indice' })}>{es ? 'Ir al diccionario' : 'Go to the glossary'}</a>
        </div>
      )}

      {resultados.length > 0 && (
        <>
          <div className="st-buscar-tipos" role="group" aria-label={es ? 'Filtrar por tipo' : 'Filter by type'}>
            <button
              type="button"
              className={tipoActivo === 'todo' ? 'on' : ''}
              onClick={() => setTipoActivo('todo')}
            >
              {es ? 'Todo' : 'All'} <b>{resultados.length}</b>
            </button>
            {porTipo.map(({ tipo, total }) => (
              <button
                key={tipo}
                type="button"
                className={tipoActivo === tipo ? 'on' : ''}
                onClick={() => setTipoActivo(tipo)}
              >
                {es ? ETIQUETAS[tipo].es : ETIQUETAS[tipo].en} <b>{total}</b>
              </button>
            ))}
          </div>

          <div className="st-buscar-lista">
            {visibles.slice(0, 60).map((item) => {
              const Icono = ETIQUETAS[item.tipo].icono
              return (
                <a key={item.clave} className="st-buscar-hit" href={item.enlace}>
                  <span className="st-buscar-hit-icono"><Icono size={15} /></span>
                  <span className="st-buscar-hit-texto">
                    <em>{es ? ETIQUETAS[item.tipo].es : ETIQUETAS[item.tipo].en}</em>
                    <strong>{item.titulo}</strong>
                    <small>{item.detalle}</small>
                  </span>
                  <ArrowRight size={14} />
                </a>
              )
            })}
          </div>

          {visibles.length > 60 && (
            <p className="st-buscar-mas">
              {es
                ? `Se muestran 60 de ${visibles.length}. Afina la búsqueda para ver el resto.`
                : `Showing 60 of ${visibles.length}. Refine your search to see the rest.`}
            </p>
          )}
        </>
      )}
    </div>
  )
}
