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
    'nav.superAdmin': 'Súper admin',
    'nav.rutaPrincipal': 'Ruta principal',
    'sidebar.tagline': 'Formación aplicada',
    'sidebar.buscar': 'Buscar…',
    'sidebar.rutaGuiada': 'Ruta guiada · biblioteca de apoyo',
    'sidebar.modoAlumno': 'Modo alumno',
    'sidebar.modoProfesor': 'Modo profesor',
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
    'footer.progreso': 'Tu trabajo se guarda por cuenta; consulta el estado de sincronización en Progreso.',
    'loading.noCargado': 'No se ha podido cargar el curso',
    'loading.entrarOtraVez': 'Entrar de nuevo',
    'loading.generar': 'Genera el contenido con «npm run index» y comprueba que existe public/course.json.',
    'admin.controlLocal': 'Control local',
    'admin.titulo': 'Súper administrador',
    'admin.descripcion': 'Panel para preparar alumnos, PINs, objetivo y herramientas recomendadas. Esta primera versión vive en tu navegador: sirve para organizar, no como autenticación real de servidor.',
    'admin.avisoTitulo': 'Importante antes de usarlo con alumnos reales',
    'admin.avisoTexto': 'Un PIN guardado en una web estática no protege datos por sí solo. Para acceso real hacen falta backend, base de datos, sesiones, permisos y registro de auditoría.',
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
    'nav.superAdmin': 'Super admin',
    'nav.rutaPrincipal': 'Main path',
    'sidebar.tagline': 'Applied training',
    'sidebar.buscar': 'Search…',
    'sidebar.rutaGuiada': 'Guided path · support library',
    'sidebar.modoAlumno': 'Student mode',
    'sidebar.modoProfesor': 'Teacher mode',
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
    'footer.progreso': 'Your work is saved per account; check synchronization status in Progress.',
    'loading.noCargado': "Couldn't load the course",
    'loading.entrarOtraVez': 'Enter again',
    'loading.generar': 'Generate the content with "npm run index" and check that public/course.json exists.',
    'admin.controlLocal': 'Local control',
    'admin.titulo': 'Super administrator',
    'admin.descripcion': 'Panel for preparing students, PINs, goals, and recommended tools. This first version lives in your browser: it is for organization, not real server authentication.',
    'admin.avisoTitulo': 'Important before using it with real students',
    'admin.avisoTexto': 'A PIN stored in a static website does not protect data by itself. Real access needs a backend, database, sessions, permissions, and an audit log.',
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
