import { useStudent } from './store'

/**
 * Idioma de la interfaz.
 *
 * El contenido del curso (lecciones, kits, agentes, prompts…) vive en dos
 * ficheros generados por build: `course.json` (es) y `course.en.json` (en).
 * Este módulo traduce solo el texto fijo de la interfaz (menú, botones,
 * cabeceras genéricas) que no viene del contenido.
 */

export type Locale = 'es' | 'en'

export const LOCALES: { id: Locale; label: string; short: string }[] = [
  { id: 'es', label: 'Español', short: 'ES' },
  { id: 'en', label: 'English', short: 'EN' },
]

const DICT = {
  es: {
    'nav.inicio': 'Inicio',
    'nav.programa': 'Programa',
    'nav.miProyecto': 'Mi proyecto',
    'nav.prompts': 'Prompts',
    'nav.kits': 'Kits institucionales',
    'nav.agentes': 'Agentes',
    'nav.herramientas': 'Herramientas',
    'nav.preguntas': 'Preguntas',
    'nav.diccionario': 'Diccionario',
    'nav.progreso': 'Progreso',
    'nav.guias': 'Guías',
    'nav.superAdmin': 'Panel profesor',
    'nav.rutaPrincipal': 'Ruta principal',
    'sidebar.tagline': 'Formación aplicada',
    'sidebar.buscar': 'Buscar…',
    'sidebar.rutaGuiada': 'Ruta guiada · biblioteca de apoyo',
    'sidebar.idioma': 'Idioma',
    'action.copiar': 'Copiar',
    'action.copiado': 'Copiado',
    'action.verTexto': 'Ver texto',
    'action.ocultar': 'Ocultar',
    'action.guardarProyecto': 'Guardar en mi proyecto',
    'action.guardado': 'Guardado',
    'action.copiarPrompt': 'Copiar prompt',
    'action.copiarFlujo': 'Copiar el flujo',
    'action.copiarCodigo': 'Copiar código',
    'action.copiarTodo': 'Copiar todo',
    'action.verJson': 'Ver el JSON completo',
    'action.irALeccion': 'Ir a la lección',
    'action.todasLasGuias': 'Todas las guías',
    'action.verMas': 'Ver más',
    'common.minutos': 'min',
    'common.pasos': 'pasos',
    'common.cargando': 'Cargando…',
    'sidebar.bibliotecaBloque': 'Biblioteca del bloque',
    'sidebar.sinLeccionesPrincipales': 'Sin lecciones principales: usa esta área como biblioteca.',
    'sidebar.lecciones': 'lecciones',
    'sidebar.bibliotecaApoyo': 'Biblioteca de apoyo',
    'header.rutaGuiada': 'Ruta guiada · biblioteca de apoyo',
    'footer.generadoDesde': 'Ruta principal, especializaciones y biblioteca de consulta · generado desde',
    'footer.el': 'el',
    'footer.logos': 'Los logos pertenecen a sus respectivos titulares y se usan para identificar la herramienta que se enseña.',
    'footer.progreso': 'Tu progreso se sincroniza con tu cuenta.',
    'loading.noCargado': 'No se ha podido cargar el curso',
    'loading.entrarOtraVez': 'Entrar de nuevo',
    'loading.generar': 'Comprueba tu conexión y vuelve a cargar la página. Si continúa, avisa a tu profesor.',
    'admin.controlLocal': 'Gestión de alumnos',
    'admin.titulo': 'Panel del profesor',
    'admin.descripcion': 'Crea alumnos, gestiona sus claves de acceso y prepara sus objetivos y herramientas recomendadas.',
    'admin.avisoTitulo': 'Claves de acceso personales',
    'admin.avisoTexto': 'Cada alumno entra con su clave personal. El acceso al panel de gestión está reservado al profesor.',
  },
  en: {
    'nav.inicio': 'Home',
    'nav.programa': 'Program',
    'nav.miProyecto': 'My project',
    'nav.prompts': 'Prompts',
    'nav.kits': 'Institutional kits',
    'nav.agentes': 'Agents',
    'nav.herramientas': 'Tools',
    'nav.preguntas': 'Questions',
    'nav.diccionario': 'Glossary',
    'nav.progreso': 'Progress',
    'nav.guias': 'Guides',
    'nav.superAdmin': 'Teacher panel',
    'nav.rutaPrincipal': 'Main path',
    'sidebar.tagline': 'Applied training',
    'sidebar.buscar': 'Search…',
    'sidebar.rutaGuiada': 'Guided path · support library',
    'sidebar.idioma': 'Language',
    'action.copiar': 'Copy',
    'action.copiado': 'Copied',
    'action.verTexto': 'View text',
    'action.ocultar': 'Hide',
    'action.guardarProyecto': 'Save to my project',
    'action.guardado': 'Saved',
    'action.copiarPrompt': 'Copy prompt',
    'action.copiarFlujo': 'Copy the flow',
    'action.copiarCodigo': 'Copy code',
    'action.copiarTodo': 'Copy all',
    'action.verJson': 'View full JSON',
    'action.irALeccion': 'Go to lesson',
    'action.todasLasGuias': 'All guides',
    'action.verMas': 'See more',
    'common.minutos': 'min',
    'common.pasos': 'steps',
    'common.cargando': 'Loading…',
    'sidebar.bibliotecaBloque': 'Block library',
    'sidebar.sinLeccionesPrincipales': 'No core lessons here: use this area as a library.',
    'sidebar.lecciones': 'lessons',
    'sidebar.bibliotecaApoyo': 'Support library',
    'header.rutaGuiada': 'Guided path · support library',
    'footer.generadoDesde': 'Main path, specializations and reference library · generated from',
    'footer.el': 'on',
    'footer.logos': 'Logos belong to their respective owners and are used to identify the tool being taught.',
    'footer.progreso': 'Your progress syncs with your account.',
    'loading.noCargado': "Couldn't load the course",
    'loading.entrarOtraVez': 'Enter again',
    'loading.generar': 'Check your connection and reload the page. If the problem persists, contact your teacher.',
    'admin.controlLocal': 'Student management',
    'admin.titulo': 'Teacher panel',
    'admin.descripcion': 'Create students, manage their access codes, and prepare their goals and recommended tools.',
    'admin.avisoTitulo': 'Personal access codes',
    'admin.avisoTexto': 'Each student signs in with a personal code. The management panel is reserved for the teacher.',
  },
} as const

export type UiKey = keyof (typeof DICT)['es']

export function translate(locale: Locale, key: UiKey): string {
  return DICT[locale]?.[key] ?? DICT.es[key] ?? key
}

export function useLocale(): Locale {
  return useStudent().locale || 'es'
}

export function useT() {
  const locale = useLocale()
  return (key: UiKey) => translate(locale, key)
}
