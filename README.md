# AI Professional Academy

Curso web interactivo para formar a gente que **nunca ha programado** hasta que
construye y entrega sus propios proyectos de IA.

Se genera desde una carpeta de notas en Markdown, y sobre ese material se
construye todo lo que unas notas técnicas no traen: cómo crear cada cuenta, qué
significa cada palabra, qué código copiar, qué importa y qué no.

La carpeta de origen **no se modifica nunca**. Solo se lee.

## Arranque

```bash
npm install
```

```bash
npm run dev
```

## Qué hay dentro

| | |
|---|---|
| Lecciones | **449**, cada una en 3 niveles |
| Bloques de contenido | **24.514** |
| Preguntas de autoevaluación | **6.219** |
| Categorías con preguntas propias | **72 de 72** |
| Piezas interactivas | **1.161**, de 15 tipos |
| Herramientas con guía completa | **22 de 25** |
| Lecciones con código copiable | **449 de 449** |
| Proyectos finales clonables | **10**, uno por área |
| Presentaciones con notas del ponente | **4** |
| Workflows de n8n importables | **40** |

## Para quien empieza de cero

Cada lección que menciona una herramienta (434 de 449) abre con tres bloques
antes de cualquier cosa técnica:

1. **Cómo crear tu cuenta, paso a paso.** Con el enlace oficial, si hay plan
   gratuito y cuánto cuesta el de pago, y qué va a ver en pantalla: el nombre
   exacto del botón, dónde está y qué significa en español.
2. **Las palabras que vas a leer, en cristiano.** Prompt, token, contexto,
   commit, volumen, PATH, webhook… explicadas sin usar otra palabra técnica.
3. **Lo primero que tienes que hacer dentro.** Cuatro o cinco acciones en orden.

Y después: **qué importa y qué puedes ignorar**, en dos columnas enfrentadas.

## Los tres niveles

| | Básico | Intermedio | Avanzado |
|---|---|---|---|
| Pregunta | ¿Qué es y por qué importa? | ¿Cómo se hace? | ¿Cuándo NO, y qué se rompe? |
| Duración media | 28 min | 48 min | 54 min |
| Práctica | Aterrizarlo a un caso propio | Ejecutarlo entero con datos de prueba | Diseñarlo y romperlo a propósito |
| Se da por hecha | Sabes explicarlo sin leer | Puedes repetirlo mañana solo | Defiendes la decisión y su alternativa |

## Los 15 tipos de pieza interactiva

Se eligen según lo que tiene cada lección dentro, y rotan para que dos lecciones
seguidas de la misma categoría no lleven lo mismo.

- **Anatomía del código** — el código real con las líneas numeradas; al pasar por
  una anotación se resalta su línea.
- **Tubería de trabajo** — el dato entra arriba y baja cambiando en cada estación.
- **Simulador de casos** — caso correcto, datos incompletos y entrada rota.
- **Diagrama de workflow** — los nodos reales del JSON de n8n, descargable.
- **Árbol de archivos**, **checklist**, **barras comparativas**, **tarjetas de
  repaso**, **conversación**, **terminal simulada**, **laboratorio de prompts**,
  **calculadora de coste por tokens**, **simulador de troceado para RAG**,
  **línea de tiempo** y **comparativa ordenable**.

## Código para copiar y pegar

- **19 recetas** con el código completo, qué instalar, **qué hace cada línea**,
  los errores que va a ver con su mensaje literal y cómo adaptarlo.
- **5 instaladores** con pestaña de **Windows, Mac y Linux** (detecta el sistema
  solo): entorno, IA y claves, n8n con base de datos, proyecto de Python y
  despliegue.
- **10 proyectos finales**, uno por área, con 8-9 pasos, 8 archivos y código que
  funciona de principio a fin.

## Modo profesor

Se activa desde la cabecera y el alumno nunca lo ve:

- **Guion de clase** con reparto de tiempo por bloque, qué decir, preguntas para
  lanzar al aula y los errores que van a cometer.
- **Presentaciones** a pantalla completa con las notas del ponente (tecla `N`).
- Cualquier lección se puede proyectar como diapositivas.

## Rutas

| Ruta | Pantalla |
|---|---|
| `#/` · `#/ruta` | Portada y las diez áreas |
| `#/area/<id>?tool=n8n&section=laboratorios` | Área, con filtros combinables |
| `#/categoria/<id>` | Una de las 72 categorías |
| `#/leccion/<slug>?n=avanzado` | Lección en un nivel |
| `#/proyecto/<area>` | Proyecto final del área |
| `#/deck/<id>` · `#/presentar/<slug>` | Presentaciones |
| `#/herramientas` · `#/herramienta/<id>` | Guías de herramienta |
| `#/biblioteca` · `#/carpeta/<id>` | Material por carpetas |
| `#/indice` | Índice alfabético de conceptos |
| `#/buscar?q=rag` | Búsqueda agrupada (`Ctrl+K`) |
| `#/progreso` | Progreso, cuaderno y exportación |

## Cómo se amplía

Sin tocar el generador. Se añade un `.json` en `content/`:

| Carpeta | Qué añade |
|---|---|
| `content/toolguides/` | Guía completa de una herramienta |
| `content/quiz/` | Preguntas propias de una categoría |
| `content/projects/` | Proyecto final de un área |
| `content/decks/` | Una presentación |
| `content/recipes/` | Una receta de código |
| `content/authored/` | Una lección reescrita a mano |

`npm run validate` comprueba que cada pregunta tiene exactamente una respuesta
correcta, mínimo tres opciones y explicación en todas; que ningún enlace apunta
a una lección inexistente; y que los JSON que ofrecen los diagramas existen.

## Configuración

La ruta a la carpeta de notas está en `course.config.json`, o en la variable
`VAULT_DIR`. Si no la encuentra, el script se detiene con un mensaje que explica
cómo apuntarla: nunca genera un curso vacío en silencio.

## Privacidad

El progreso, el nivel preferido, el cuaderno y el modo profesor se guardan solo
en `localStorage`. No hay cuentas, no hay servidor y no sale nada de la máquina.

## Diseño

Barra lateral oscura fija de 224 px, acento verde `#176b4d`, fondo hueso,
esquinas de 4 px y líneas de 1 px sin sombras. Tipografía **Inter Tight** en
titulares e **Inter** en texto.

La escala tipográfica es deliberadamente compacta (etiquetas de 7 px, texto de
9-11 px). Es una decisión explícita del proyecto: no cumple los criterios
habituales de accesibilidad y se mantiene porque es el diseño pedido.
