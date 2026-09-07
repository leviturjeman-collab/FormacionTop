// Complete fictional examples, not instructions masquerading as answers.
const cases={}
const add=(id,es,en)=>cases[id]={es,en}
add('operaciones-ia',[
 'Reunión de práctica. Peticiones P1: revisar cartel; P2: responder consulta; P3: preparar lista de material. El equipo acuerda que Ana revisa P1 el lunes, Luis P2 el martes y Marta P3 el miércoles.',
 'Petición | Responsable | Día acordado | Estado\nP1 · Revisar cartel | Ana | Lunes | Pendiente\nP2 · Responder consulta | Luis | Martes | Pendiente\nP3 · Lista de material | Marta | Miércoles | Pendiente',
 'Los nombres y días salen del acuerdo del ejemplo. Tener responsable no significa que la tarea esté hecha. La tabla conserva las tres tareas como pendientes.',
 'El equipo comunica que P2 ya está respondida. Cambia su estado y calcula cuántas tareas quedan pendientes.',
 'P2 pasa a Respondida; P1 y P3 siguen pendientes. Quedan dos tareas pendientes y se conservan las tres filas.'
],[
 'Practice meeting. Requests P1: review poster; P2: reply to enquiry; P3: prepare equipment list. The team agrees Ana handles P1 on Monday, Luis P2 on Tuesday and Marta P3 on Wednesday.',
 'Request | Responsible person | Agreed day | Status\nP1 · Review poster | Ana | Monday | Pending\nP2 · Reply to enquiry | Luis | Tuesday | Pending\nP3 · Equipment list | Marta | Wednesday | Pending',
 'Names and days come from the example agreement. Assigning someone does not complete the task. All three tasks remain pending.',
 'The team reports P2 has been answered. Change its status and calculate how many tasks remain pending.',
 'P2 becomes Answered; P1 and P3 remain pending. Two tasks are pending and all three rows remain.'
])
add('portal-app-institucional',[
 'Formulario de prueba. Nombre: Ana. Correo: vacío. Curso: Inicial. Regla del ejercicio: nombre, correo y curso son necesarios antes de guardar.',
 'Mensaje junto al correo: «Escribe tu correo para continuar». Nombre conservado: Ana. Curso conservado: Inicial. Registros nuevos: 0.',
 'Falta un dato necesario. El formulario explica cuál y conserva lo que ya estaba bien. Mostrar un aviso de éxito o crear una fila vacía sería incorrecto.',
 'Completa el correo con ana@example.com y vuelve a probar en el destino de ensayo.',
 'Se puede guardar una solicitud con Ana, ana@example.com e Inicial. Comprueba que existe una sola fila; todavía no equivale a una matrícula.'
],[
 'Test form. Name: Ana. Email: empty. Course: Introductory. Exercise rule: name, email and course are required before saving.',
 'Message beside email: “Enter your email to continue”. Preserved name: Ana. Preserved course: Introductory. New records: 0.',
 'A required detail is missing. The form identifies it and retains the correct details. Showing success or creating an empty row would be wrong.',
 'Enter ana@example.com and try again in the practice destination.',
 'One request can be saved with Ana, ana@example.com and Introductory. Verify exactly one row exists; it is not an enrolment.'
])
add('rag-documental',[
 'Documento «Horario de práctica», apartado Apertura: «El centro abre de lunes a viernes a las 09:00». Pregunta: «¿A qué hora cierra el viernes?»',
 'El documento indica que el viernes abre a las 09:00, pero no incluye la hora de cierre. Necesito el horario de cierre para responder. Fuente: Horario de práctica, Apertura.',
 'La hora de apertura no permite deducir la de cierre. La respuesta útil conserva el dato conocido y nombra exactamente lo que falta.',
 'Añade al documento: «Los viernes el centro cierra a las 14:00». Repite la pregunta.',
 'El viernes cierra a las 14:00. Fuente: Horario de práctica, frase añadida sobre el cierre del viernes.'
],[
 'Document “Practice opening hours”, Opening section: “The centre opens Monday to Friday at 09:00”. Question: “When does it close on Friday?”',
 'The document says it opens at 09:00 on Friday but does not include closing time. I need that information to answer. Source: Practice opening hours, Opening.',
 'Opening time does not establish closing time. A useful answer retains the known fact and names exactly what is missing.',
 'Add “On Fridays the centre closes at 14:00” to the document. Ask again.',
 'It closes at 14:00 on Friday. Source: Practice opening hours, the added Friday closing sentence.'
])
add('contenido-presentaciones',[
 'Procedimiento inventado: las tutorías se piden en el formulario del centro. Se escribe nombre, tema y dos horarios posibles. Secretaría confirma después por correo.',
 'Diapositiva 1 · Pide tu tutoría: abre el formulario del centro.\nDiapositiva 2 · Completa tres datos: nombre, tema y dos horarios posibles.\nDiapositiva 3 · Espera la confirmación: la petición se confirma después por correo; enviarla no reserva una hora.',
 'Cada diapositiva responde una pregunta: dónde, qué escribir y qué pasa después. Las tres proceden del mismo procedimiento.',
 'El centro cambia la confirmación: ahora se consulta en el portal, no por correo. Actualiza solo la parte afectada.',
 'La diapositiva 3 indica consultar la confirmación en el portal. Las diapositivas 1 y 2 no cambian.'
],[
 'Fictional procedure: request tutoring through the centre form. Enter name, topic and two possible times. The office confirms later by email.',
 'Slide 1 · Request tutoring: open the centre form.\nSlide 2 · Provide three details: name, topic and two possible times.\nSlide 3 · Wait for confirmation: the request is confirmed later by email; submitting does not reserve a time.',
 'Each slide answers one question: where, what to enter and what happens next. All three follow the same procedure.',
 'Confirmation now appears in the portal instead of email. Update only the affected part.',
 'Slide 3 says to check confirmation in the portal. Slides 1 and 2 stay unchanged.'
])
add('agentes-codigo-produccion',[
 'Caso de prueba: al pulsar Guardar, la aplicación recibe un resultado de éxito o de error. Solo cuando recibe éxito debe mostrar «Guardado».',
 'Caso A · Respuesta de éxito → mensaje «Guardado».\nCaso B · Respuesta de error → mensaje «No se ha podido guardar. Inténtalo de nuevo».\nCaso C · Esperando respuesta → «Guardando…»; todavía no se anuncia éxito.',
 'La confirmación depende de la respuesta, no del clic. El alumno debe provocar los tres estados en un entorno de prueba y mirar el texto que aparece.',
 'Simula una respuesta lenta. ¿Qué mensaje se debe ver mientras la aplicación espera?',
 'Se ve «Guardando…». Solo cambia a «Guardado» después de recibir éxito. Si recibe un error, muestra el aviso de fallo.'
],[
 'Test case: after Save is pressed, the app receives success or failure. It should display “Saved” only after success.',
 'Case A · Success response → “Saved”.\nCase B · Failure response → “Could not save. Try again”.\nCase C · Waiting for response → “Saving…”; no success yet.',
 'Confirmation depends on the response, not the click. The learner must trigger all three states in a test environment and inspect the text.',
 'Simulate a slow response. Which message belongs on screen while waiting?',
 '“Saving…” appears. It becomes “Saved” only after success. A failure response produces the error message.'
])
add('crm-reporting-institucional',[
 'Consultas de ejemplo: C1 Ana Pendiente; C2 Luis Respondida; C3 Marta Pendiente.',
 'Total: 3. Pendientes: 2, C1 y C3. Respondidas: 1, C2. La suma 2 + 1 coincide con las tres consultas.',
 'El resumen sale de contar los estados, no de interpretar el nombre de la persona. Los identificadores permiten volver a las filas que componen cada cifra.',
 'C3 pasa a Respondida. Calcula de nuevo sin quitar ninguna fila.',
 'Total 3; pendiente 1, C1; respondidas 2, C2 y C3.'
],[
 'Example enquiries: C1 Ana Pending; C2 Luis Answered; C3 Marta Pending.',
 'Total: 3. Pending: 2, C1 and C3. Answered: 1, C2. The sum 2 + 1 matches all three enquiries.',
 'The summary counts statuses instead of interpreting names. Identifiers connect each number to its source rows.',
 'C3 becomes Answered. Recalculate without removing rows.',
 'Total 3; pending 1, C1; answered 2, C2 and C3.'
])
add('campus-onboarding-ia',[
 'Procedimiento de práctica: para pedir material se anotan persona, artículo y cantidad. Lucía necesita dos cuadernos. La petición debe revisarla almacén antes de entregar.',
 'Persona: Lucía. Artículo: cuaderno. Cantidad: 2. Estado: pendiente de revisión de almacén. Todavía no figura como entregado.',
 'La ficha reproduce la petición y deja visible quién debe continuar. Solicitar material y recibirlo son dos momentos diferentes.',
 'Pedro pide bolígrafos, pero no indica cuántos. Prepara su ficha.',
 'Persona: Pedro. Artículo: bolígrafo. Cantidad: no indicada. Siguiente paso: preguntar cuántos necesita antes de tramitar la entrega.'
],[
 'Practice procedure: an equipment request records person, item and quantity. Lucía needs two notebooks. Stores reviews the request before delivery.',
 'Person: Lucía. Item: notebook. Quantity: 2. Status: awaiting stores review. It is not marked delivered.',
 'The record preserves the request and identifies who continues. Requesting and receiving equipment are separate events.',
 'Pedro requests pens without saying how many. Prepare his record.',
 'Person: Pedro. Item: pen. Quantity: not specified. Next step: ask how many before arranging delivery.'
])
add('atencion-cliente-multicanal',[
 'Correo: consulta A1 de Ana sobre horario. Formulario: consulta A1 de Ana, mismo asunto y mismo número. Regla: un número identifica una consulta, aunque tenga varios mensajes.',
 'Consulta A1. Persona: Ana. Asunto: horario. Mensajes relacionados: correo y formulario. Consultas únicas: 1. Mensajes recibidos: 2.',
 'Se conserva la información de ambos canales sin contar dos asuntos distintos. El número compartido es la razón para relacionarlos; coincidir solo en el nombre no sería suficiente.',
 'Llega un mensaje de Ana con número A2 sobre material. ¿Se une a A1?',
 'No. A2 es otra consulta. Hay dos consultas únicas, A1 y A2, y tres mensajes en total.'
],[
 'Email: enquiry A1 from Ana about opening hours. Form: enquiry A1 from Ana, same subject and number. Rule: one number identifies one enquiry even when it has several messages.',
 'Enquiry A1. Person: Ana. Subject: opening hours. Related messages: email and form. Unique enquiries: 1. Received messages: 2.',
 'Both channels are preserved without counting two separate issues. The shared number connects them; a matching name alone would not be sufficient.',
 'A message from Ana arrives with number A2 about equipment. Does it belong to A1?',
 'No. A2 is a separate enquiry. There are two unique enquiries and three messages in total.'
])
add('gobierno-costes-ia',[
 'Ejercicio con unidades inventadas, sin precios de proveedores: límite de uso 100 unidades al mes; consumo observado 72; nueva tarea estimada 12. Coordinación revisa antes de superar el límite.',
 'Disponible antes: 100 − 72 = 28 unidades. Estimación después de la tarea: 72 + 12 = 84. Margen estimado: 16. El consumo real se anota después de ejecutar.',
 'La estimación ayuda a decidir, pero no sustituye la lectura del consumo. El límite y las unidades pertenecen al ejercicio, no a una tarifa real.',
 'La siguiente tarea se estima en 35 unidades partiendo del consumo 72. ¿Cabe en el límite?',
 '72 + 35 = 107. Supera el límite en 7 unidades; se pide revisión antes de realizarla.'
],[
 'Exercise using fictional units, not provider prices: monthly limit 100 units; observed usage 72; new task estimated at 12. Coordination reviews before exceeding the limit.',
 'Available before: 100 − 72 = 28 units. Estimated total after task: 72 + 12 = 84. Estimated margin: 16. Record actual usage after running.',
 'An estimate supports a decision but does not replace reading usage. The limit and units belong to the exercise, not a real tariff.',
 'The next task is estimated at 35 units from usage 72. Does it fit?',
 '72 + 35 = 107. It exceeds the limit by 7 units; request review before proceeding.'
])
add('ventas-captacion',[
 'Ana escribe: «Me interesa el curso inicial. ¿Podéis darme información?». No indica horario y no hay información sobre plazas.',
 'Hola, Ana. Gracias por tu interés en el curso inicial. ¿Qué días y horarios te vendrían bien? Con esa información podremos revisar las opciones. Tu consulta todavía no confirma una plaza.',
 'La respuesta conserva curso y nombre, pide el dato que falta y no promete disponibilidad. Se prepara como borrador para revisar.',
 'Ana responde que puede los martes por la tarde. Actualiza el siguiente paso.',
 'Se anota martes por la tarde y se pide comprobar una opción compatible. No se confirma una plaza hasta tener disponibilidad.'
],[
 'Ana writes: “I am interested in the introductory course. Can you send information?” She gives no availability and there is no capacity information.',
 'Hello Ana. Thank you for your interest in the introductory course. Which days and times would suit you? We can then review the options. Your enquiry does not yet confirm a place.',
 'The reply preserves the name and course, asks for the missing detail and promises no availability. Prepare it as a draft for review.',
 'Ana replies that Tuesday afternoons suit her. Update the next step.',
 'Record Tuesday afternoons and check a compatible option. Do not confirm a place until availability is known.'
])
add('rrhh-seleccion-onboarding',[
 'Persona ya contratada: Dani. Empieza el lunes. Equipo acuerda: Eva prepara acceso al correo; Luis prepara portátil; Marta recibe a Dani. No se ha comprobado ninguno de los tres puntos.',
 'Correo → Eva → pendiente. Portátil → Luis → pendiente. Bienvenida → Marta → pendiente. Los tres responsables están asignados; falta confirmar cada preparación.',
 'La lista organiza una incorporación ya acordada. Nombrar responsables no significa que los accesos o el material estén listos.',
 'Luis confirma que el portátil está preparado. Actualiza la lista.',
 'Portátil pasa a preparado. Correo y bienvenida siguen pendientes. Un punto preparado de tres.'
],[
 'Already hired: Dani. Starts Monday. Team agreement: Eva prepares email access; Luis prepares the laptop; Marta welcomes Dani. None has been checked yet.',
 'Email → Eva → pending. Laptop → Luis → pending. Welcome → Marta → pending. Three owners are assigned; each preparation still needs confirmation.',
 'The list organises an agreed start. Assigning people does not mean access or equipment is ready.',
 'Luis confirms the laptop is ready. Update the list.',
 'Laptop becomes ready. Email and welcome remain pending. One of three items is ready.'
])
add('marketing-redes-sociales',[
 'Anuncio aprobado: «Taller de escritura, sábado, 10:00, sala 2». El cartel preparado dice «11:00, sala 2».',
 'Dato diferente: hora. En el cartel debe decir 10:00. Texto final: «Taller de escritura · Sábado · 10:00 · Sala 2».',
 'La fuente aprobada permite corregir un dato concreto. No se cambia la sala ni se añade un precio que nadie proporcionó.',
 'El anuncio aprobado se actualiza a sala 4. Revisa el cartel corregido.',
 'Texto final: «Taller de escritura · Sábado · 10:00 · Sala 4». La hora se conserva.'
],[
 'Approved announcement: “Writing workshop, Saturday, 10:00, room 2”. Prepared poster says “11:00, room 2”.',
 'Different detail: time. The poster should say 10:00. Final text: “Writing workshop · Saturday · 10:00 · Room 2”.',
 'The approved source supports correcting one detail. Do not change the room or add an unspecified price.',
 'The approved announcement changes to room 4. Review the corrected poster.',
 'Final text: “Writing workshop · Saturday · 10:00 · Room 4”. The time stays unchanged.'
])
add('finanzas-facturacion',[
 'Documento ficticio: «Factura F1. Emisor: Taller Norte. Fecha: 2026-09-01». No aparecen líneas de importe ni total. Esta práctica solo extrae lo que está escrito.',
 'Número: F1. Emisor: Taller Norte. Fecha: 2026-09-01. Total: no indicado. Siguiente paso: pedir el documento completo.',
 'Se pueden extraer los tres datos escritos. Sin un total no se puede deducir el importe. El ejercicio no valida obligaciones contables ni fiscales.',
 'Se añade al texto «Total: 60 unidades». Actualiza únicamente el dato que faltaba.',
 'Total: 60 unidades, respaldado por la frase añadida. Los demás datos se conservan.'
],[
 'Fictional document: “Invoice F1. Issuer: Taller Norte. Date: 2026-09-01”. No amounts or total appear. This practice only extracts written information.',
 'Number: F1. Issuer: Taller Norte. Date: 2026-09-01. Total: not stated. Next step: request the complete document.',
 'The three written details can be extracted. A missing total cannot be inferred. The exercise does not validate accounting or tax obligations.',
 'Add “Total: 60 units” to the text. Update only the missing detail.',
 'Total: 60 units, supported by the added sentence. Other details stay unchanged.'
])
add('legal-contratos',[
 'Texto ficticio para revisar su claridad: «El equipo entregará la guía a la persona responsable». No se ha escrito una fecha. La tarea es encontrar el dato ausente, no valorar jurídicamente el acuerdo.',
 'Frase revisada: «El equipo entregará la guía a la persona responsable». Dato pendiente: fecha de entrega. Pregunta: «¿Qué fecha debemos indicar para entregar la guía?»',
 'La revisión señala el hueco sin inventar una obligación o un plazo. La persona responsable debe proporcionar el dato.',
 'La persona responsable indica «15 de octubre». Completa la frase conservando lo demás.',
 '«El equipo entregará la guía a la persona responsable el 15 de octubre». El año sigue sin indicarse; se pregunta si hace falta concretarlo.'
],[
 'Fictional clarity-review text: “The team will deliver the guide to the responsible person”. No date is written. The task finds the missing detail, not the legal effect of the agreement.',
 'Reviewed sentence: “The team will deliver the guide to the responsible person”. Missing detail: delivery date. Question: “Which date should we specify for delivery?”',
 'The review identifies the gap without inventing an obligation or deadline. The responsible person must provide the detail.',
 'The responsible person specifies “15 October”. Complete the sentence without changing anything else.',
 '“The team will deliver the guide to the responsible person on 15 October”. The year is still unspecified; ask if it needs clarification.'
])
add('inmobiliaria-captacion',[
 'Solicitud inventada: Ana quiere visitar el inmueble P1 el martes a las 17:00. La agenda todavía no se ha consultado.',
 'Persona: Ana. Inmueble: P1. Horario solicitado: martes 17:00. Estado: pendiente de comprobar agenda. No hay visita confirmada.',
 'La preferencia de la persona no demuestra disponibilidad. La ficha conserva su petición para que alguien compruebe la agenda.',
 'La agenda muestra ocupado el martes a las 17:00 y libre a las 18:00. Prepara el siguiente mensaje.',
 '«El martes a las 17:00 está ocupado. ¿Te vendría bien a las 18:00?» La alternativa sigue siendo propuesta hasta que se acuerde.'
],[
 'Fictional request: Ana wants to view property P1 on Tuesday at 17:00. The calendar has not been checked.',
 'Person: Ana. Property: P1. Requested time: Tuesday 17:00. Status: awaiting calendar check. No viewing is confirmed.',
 'A preference does not establish availability. The record preserves the request for someone to check.',
 'The calendar shows Tuesday 17:00 occupied and 18:00 free. Prepare the next message.',
 '“Tuesday at 17:00 is occupied. Would 18:00 suit you?” The alternative remains a proposal until agreed.'
])
add('restauracion-reservas',[
 'Ejercicio: una petición pide seis plazas a las 20:00. La tabla de disponibilidad muestra cuatro plazas a las 20:00 y ocho a las 21:00.',
 'A las 20:00 faltan 2 plazas: 6 − 4 = 2. No se confirma esa hora. Se puede proponer las 21:00, donde ocho plazas permiten atender una petición de seis.',
 'La comparación se hace dentro de cada horario. No se suman plazas de horas diferentes para confirmar una misma mesa.',
 'La petición cambia a cuatro plazas a las 20:00. ¿Qué permite afirmar la tabla?',
 'La capacidad indicada es suficiente para cuatro a las 20:00. La reserva solo queda confirmada cuando se registre mediante el procedimiento del negocio.'
],[
 'Exercise: a request asks for six seats at 20:00. Availability shows four seats at 20:00 and eight at 21:00.',
 'At 20:00 there is a shortfall of 2: 6 − 4 = 2. Do not confirm that time. Offer 21:00, where eight available seats can fit six.',
 'Compare capacity within each time slot. Do not add seats at different times to confirm one party.',
 'The request changes to four seats at 20:00. What does the table support?',
 'The listed capacity fits four at 20:00. Confirmation still requires recording the booking through the business procedure.'
])
add('ecommerce-pedidos-postventa',[
 'Pedido ficticio P1 de Ana. Estado en la tabla: preparado. No hay código de envío ni fecha de entrega.',
 '«Hola, Ana. El pedido P1 figura como preparado. Todavía no tenemos en esta información la confirmación de envío ni una fecha de entrega. Vamos a comprobar el envío para poder actualizarte».',
 'La respuesta explica el estado conocido y qué falta. Preparado no significa entregado al transportista.',
 'La tabla se actualiza a enviado y añade el seguimiento SEG-01, pero no una fecha de llegada.',
 'Se informa de que P1 está enviado y su referencia es SEG-01. La fecha de llegada sigue sin determinar.'
],[
 'Fictional order P1 for Ana. Table status: prepared. No tracking code or delivery date.',
 '“Hello Ana. Order P1 is listed as prepared. This information does not yet include shipping confirmation or a delivery date. We will check shipping to update you.”',
 'The reply explains the known status and missing details. Prepared does not mean handed to the carrier.',
 'The table changes to shipped with tracking reference SEG-01, but no arrival date.',
 'Report P1 as shipped with reference SEG-01. Arrival date remains unknown.'
])
add('salud-citas-clinica',[
 'Ejercicio administrativo inventado: persona A solicita cambiar la cita C1. No indica otro horario. No se necesitan datos de salud para resolver esta práctica.',
 'Cita: C1. Acción solicitada: cambiar horario. Preferencia nueva: no indicada. Mensaje: «¿Qué días y horarios te vendrían bien para revisar una alternativa?»',
 'El siguiente paso pide la disponibilidad que falta. No cancela automáticamente la cita actual ni solicita información clínica.',
 'La persona indica jueves por la mañana. Actualiza la petición sin suponer un hueco disponible.',
 'Preferencia nueva: jueves por la mañana. Siguiente paso: consultar agenda. La cita C1 conserva su estado hasta acordar el cambio.'
],[
 'Fictional administrative exercise: person A asks to change appointment C1 without giving another time. No health information is needed.',
 'Appointment: C1. Requested action: change time. New preference: not stated. Message: “Which days and times would suit you so we can review an alternative?”',
 'The next step asks for missing availability. It does not automatically cancel the existing appointment or request clinical details.',
 'The person specifies Thursday morning. Update the request without assuming a slot exists.',
 'New preference: Thursday morning. Next step: check the calendar. C1 keeps its status until a change is agreed.'
])
add('eventos-comunidad',[
 'Taller ficticio de ocho plazas. Peticiones numeradas I01 a I10 en orden de llegada. Regla acordada para el ejercicio: atender por ese orden.',
 'Plazas propuestas: I01, I02, I03, I04, I05, I06, I07 e I08. Lista de espera: I09 e I10. Total 10 = 8 + 2.',
 'La regla de orden permite explicar cada posición. La lista es una propuesta de distribución; las confirmaciones se realizan mediante el procedimiento del centro.',
 'I03 retira su petición. Aplica la misma regla para cubrir la plaza.',
 'I09 ocupa la plaza disponible. I10 sigue en espera. Hay ocho peticiones con plaza propuesta, una en espera y una retirada.'
],[
 'Fictional eight-place workshop. Requests I01 to I10 are in arrival order. Exercise rule: process them in that order.',
 'Proposed places: I01, I02, I03, I04, I05, I06, I07 and I08. Waiting list: I09 and I10. Total 10 = 8 + 2.',
 'The ordering rule explains each position. This is a proposed allocation; confirmations follow the centre procedure.',
 'I03 withdraws. Apply the same rule to fill the place.',
 'I09 takes the available place. I10 stays waiting. Eight requests have proposed places, one is waiting and one withdrawn.'
])
add('investigacion-informes',[
 'Documento A, lista inicial del 1 de septiembre: 24 inscripciones. Documento B, revisión del 2 de septiembre: 22 inscripciones. No explica qué cambió.',
 'A: 24, lista inicial, 1 de septiembre. B: 22, revisión, 2 de septiembre. Diferencia: 2. Pendiente: comprobar si hubo retiradas, correcciones o un cambio de criterio.',
 'La fecha ayuda a describir las versiones, pero no explica por sí sola la diferencia. El informe conserva ambas cifras y la pregunta pendiente.',
 'Se añade una nota verificada: «Dos personas retiraron su inscripción el 2 de septiembre». Actualiza la explicación.',
 '24 inscripciones iniciales − 2 retiradas = 22 vigentes en la revisión. Se conserva la nota como respaldo de la diferencia.'
],[
 'Document A, initial list dated 1 September: 24 registrations. Document B, review dated 2 September: 22 registrations. No explanation of the change.',
 'A: 24, initial list, 1 September. B: 22, review, 2 September. Difference: 2. Pending: check withdrawals, corrections or a changed counting rule.',
 'Dates describe versions but do not explain the difference. Keep both figures and the unanswered question.',
 'Add a verified note: “Two people withdrew on 2 September”. Update the explanation.',
 '24 initial registrations − 2 withdrawals = 22 current registrations at review. Keep the note as support.'
])

export function kitWorkedAnswer(id,en=false){return cases[id]?.[en?'en':'es']}
