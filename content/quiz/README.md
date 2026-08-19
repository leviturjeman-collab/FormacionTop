# Preguntas por categoría

El banco base está escrito por área (`scripts/lib/quizbank.mjs`): dos preguntas
por área y nivel. Con 465 lecciones, eso significa que las lecciones de una
misma área comparten preguntas.

Esta carpeta lo arregla categoría a categoría. Cada archivo añade preguntas
específicas de una categoría, que **se anteponen** a las del área.

## Formato

Un archivo por categoría, con el id de la categoría como nombre:

```json
{
  "categoryId": "35-automatizaciones-skills-biblioteca-workflows-n8n-40",
  "basico": [
    {
      "prompt": "…",
      "options": [
        { "text": "…", "correct": true,  "why": "Por qué es correcta." },
        { "text": "…", "correct": false, "why": "Por qué se cree y dónde se rompe." },
        { "text": "…", "correct": false, "why": "…" }
      ],
      "explain": "La idea que queda después de responder."
    }
  ],
  "intermedio": [],
  "avanzado": []
}
```

El id de cada categoría se puede consultar así:

```bash
node -e "JSON.parse(require('fs').readFileSync('public/course.json','utf8')).categories.forEach(c=>console.log(c.count,c.id))"
```

## Reglas

`npm run validate` falla si no se cumplen:

- exactamente **una** opción correcta por pregunta;
- mínimo **tres** opciones;
- **todas** las opciones con su `why`.

Y la regla que no puede comprobar una máquina: la opción incorrecta nunca es
absurda. Es lo que un alumno de ese nivel creería de verdad, y el `why` explica
por qué esa creencia es razonable y dónde falla.

## Cobertura

Escritas a mano las categorías con más contenido. El resto usa el banco del
área hasta que se vayan añadiendo aquí, lote a lote.
