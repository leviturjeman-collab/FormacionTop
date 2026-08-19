# Lecciones escritas a mano

Cualquier archivo `.json` de esta carpeta **sustituye** al contenido generado
automáticamente para una lección. Es el mecanismo para subir la calidad sin
tocar el generador.

## Cómo se enlaza con una lección

Se identifica por `sourcePath` (la ruta del archivo dentro de la carpeta de
notas de origen) o por `slug`. El primero es más estable: sobrevive a cambios
de título.

Si el archivo no encaja con ninguna lección, `npm run index` avisa por consola
y sigue. No rompe la compilación.

## Qué se puede sustituir

Solo hay que incluir lo que quieras cambiar. Lo que no aparezca se conserva del
contenido generado, nivel a nivel.

```json
{
  "sourcePath": "04_CLASES_POR_HERRAMIENTA/06_n8n_Automation_AI/01_Lecciones/Leccion_01.md",
  "title": "Tu primer workflow en n8n",
  "levels": {
    "basico": {
      "headline": "Qué es un workflow y por qué deja de ser magia en cinco minutos",
      "hook": "Una frase que enganche y sitúe el problema real.",
      "minutes": 12,
      "objectives": ["...", "...", "..."],
      "blocks": [
        { "kind": "idea", "title": "En una frase", "text": "..." },
        { "kind": "analogia", "title": "La cadena de montaje", "text": "..." },
        { "kind": "glosario", "title": "Las palabras que vas a oír",
          "items": [{ "term": "Nodo", "meaning": "..." }] },
        { "kind": "pasos", "title": "El procedimiento", "items": ["...", "..."] },
        { "kind": "comandos", "title": "Comandos", "items": ["npm install"] },
        { "kind": "codigo", "title": "Ejemplo", "lang": "json", "code": "{...}" },
        { "kind": "riesgos", "title": "Lo que falla", "items": ["..."] },
        { "kind": "tabla", "title": "Comparativa",
          "table": { "header": ["Opción", "Cuándo"], "rows": [["A", "..."]] } }
      ],
      "practice": {
        "goal": "...",
        "steps": [{ "title": "...", "where": "...", "action": "...", "expected": "..." }],
        "evidence": "Qué tiene que guardar el alumno."
      },
      "pitfalls": [{ "error": "...", "fix": "..." }],
      "checklist": ["...", "..."],
      "quiz": [
        {
          "prompt": "...",
          "options": [
            { "text": "...", "correct": true,  "why": "Por qué es correcta." },
            { "text": "...", "correct": false, "why": "Por qué se cree y dónde se rompe." },
            { "text": "...", "correct": false, "why": "..." }
          ],
          "explain": "La idea que queda después de responder."
        }
      ]
    }
  }
}
```

## Reglas del quiz

`npm run validate` falla si no se cumplen:

- exactamente **una** opción correcta por pregunta;
- mínimo **tres** opciones;
- **todas** las opciones con su `why`.

La opción incorrecta nunca debe ser absurda: tiene que ser lo que un alumno de
ese nivel creería de verdad. Y el `why` explica por qué esa creencia es
razonable y dónde falla, no se limita a decir que está mal.

## Piezas interactivas

Si incluyes `interactive` en la raíz del archivo, sustituye por completo a las
generadas. Los tipos disponibles son `flow`, `terminal`, `promptlab` y
`compare`; su forma exacta está en `src/types.ts`.
