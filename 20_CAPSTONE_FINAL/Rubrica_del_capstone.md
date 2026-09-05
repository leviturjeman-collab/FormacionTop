---
titulo: "Rúbrica del capstone: evidencia y aceptación"
tipo: "evaluacion_rubrica"
nivel: "avanzado"
fase: "construccion_portfolio"
estado: "revision_profesional_aplicada"
ultima_revision: "2026-09-05"
fuentes: ["Fuente interna: AI Professional Academy"]
tags: ["capstone", "evaluacion", "entrega"]
entregable: "paquete de evidencias y revisión atribuida"
---
# Rúbrica del capstone

Esta rúbrica se aplica a una versión identificada del proyecto, con pruebas reproducibles y evidencias. El alumno puede autoevaluarse; la valoración docente debe identificar al revisor. La academia no concede una certificación automática por completar casillas.

## Qué entregar

- Problema, usuario, frecuencia y línea base manual, con la procedencia de las mediciones.
- Versión del proyecto y demo o artefacto accesible, sin secretos ni datos personales no autorizados.
- Entradas, salidas esperadas y observadas para casos normal, inválido, duplicado, fallo de servicio y recuperación.
- Un fallo observado o provocado en una copia de prueba, causa, cambio y comprobación de regresión.
- README de instalación, manual de uso, costes y límites, responsable y procedimiento de apagado/recuperación.
- Feedback de otra persona, cambios pendientes y comparación de impacto antes/después.

## Puntuación

Cada dimensión se puntúa 0, 1 o 2. La nota ponderada es peso × puntuación / 2. Se suma sobre 100. Una evidencia no presentada recibe 0; una afirmación sin registro no cuenta como evidencia.

| Dimensión | Peso | 0 | 1 | 2 |
|---|---:|---|---|---|
| Problema e impacto | 20 | Sin usuario o criterio observable | Usuario y objetivo; solo estimación | Muestra comparable antes/después, periodo y fuente; incluye revisión y coste |
| Funcionamiento | 20 | No se reproduce el caso normal | Demo normal reproducible con ayuda | Otra persona completa la tarea con la documentación |
| Fiabilidad y reparación | 20 | No hay pruebas | Pruebas normales y un fallo documentado | Cinco familias de prueba, reparación y regresión; sin efectos duplicados |
| Datos y permisos | 20 | Secretos expuestos o acceso no autorizado | Inventario y límites documentados | Bloqueo de acción no permitida comprobado en el servicio y destino intacto |
| Entrega y operación | 15 | No hay manual ni responsable | README y costes estimados | Instalación por otra persona, apagado/recuperación probados, dueño y revisión fechada |
| Defensa y feedback | 5 | No explica decisiones ni límites | Explica decisiones pero no las contrasta | Defiende con evidencia, recibe feedback y registra acciones pendientes |

## Reglas de aceptación

- Menos de 60: requiere revisión de alcance y nueva entrega.
- De 60 a 79: puede continuar en piloto controlado; cerrar los cambios señalados antes de entrega.
- Desde 80: candidato a entrega si no hay bloqueos y la persona responsable acepta explícitamente el paquete.
- La puntuación no anula bloqueos críticos: secreto expuesto, datos sin permiso, acción no autorizada, duplicación de efectos, ausencia de apagado o fallo que puede dañar al usuario. Cualquiera deja el proyecto pendiente de reparación.
- Si no hay acceso o autorización para un piloto real, registrar «pendiente». Una demo ficticia no se presenta como implantación real.

## Protocolo de revisión

El revisor recibe versión y evidencias antes de puntuar. Repite el caso duplicado y el apagado o explica por qué no puede hacerlo. Registra puntuación por dimensión, bloqueos y siguiente acción. El alumno conserva la entrega anterior y presenta otra versión tras reparar. Una segunda revisión puede cerrar los asuntos pendientes; nunca se sobreescribe el historial para simular que el fallo no existió.

## Ejemplo de feedback accionable

«El caso normal funciona. Al repetir el evento pedido-17 aparece una segunda fila de entrega: el criterio de duplicados falla. Mantén el piloto en copia de prueba, añade un identificador único y repite los cinco casos. Adjunta las dos ejecuciones y la consulta al destino antes de solicitar nueva revisión.»
