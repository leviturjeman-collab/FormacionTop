// Original teaching notes. Examples describe practice situations, never client results.
// Executable settings and reference answers come from each individual workbook.
const notes = {}
function add(kinds,es,en){for(const kind of kinds.split(' '))notes[kind]={es,en}}

add('text',[
 'Imagina que mañana otra persona tiene que atender estas peticiones. Necesita entender qué ha pedido cada persona y qué información sigue faltando. Una redacción bonita ayuda a leer; la utilidad está en conservar los datos y separar las preguntas pendientes.',
 'Lee una fila o una frase completa antes de resumirla. Señala el nombre, lo que pide y lo que sabemos de su situación. Si el texto dice «pregunta por un curso», escribe una consulta. No lo conviertas en «se ha matriculado»: esa segunda frase cambia lo que ocurrió.',
 'Divide el resultado en datos y propuestas. «Hay dos peticiones pendientes» es un recuento que puedes comprobar. «Podríamos responder primero a las más antiguas» es una propuesta y necesita una regla de orden acordada. No mezcles ambas cosas en una sola columna.',
 'Si una respuesta parece correcta, comprueba también lo que ha dejado fuera. Tacha cada petición en una copia de la fuente cuando la encuentres en el resultado. Al acabar no debe quedar ninguna sin revisar ni aparecer dos veces la misma petición.',
 'En tu actividad puedes repetir este procedimiento con mensajes de clientes, notas de una reunión o preguntas de alumnos. Empieza con tres textos que puedas revisar completos. Aumenta el número solo cuando sepas detectar una omisión y corregirla.'
],[
 'Imagine someone else must handle these requests tomorrow. They need to understand what each person asked and which details are still missing. Clear writing helps them read; the useful part is preserving the facts and separating unanswered questions.',
 'Read a complete row or sentence before summarising it. Identify the name, the request and what is known about its status. If the source says “asks about a course”, record an enquiry. Do not turn that into “has enrolled”: the second sentence changes what happened.',
 'Separate facts from proposals. “There are two pending requests” is a count you can check. “We could reply to the oldest ones first” is a proposal requiring an agreed ordering rule. Do not combine both in one column.',
 'Even when an answer looks correct, check what it left out. Cross off each request in a copy of the source when you find it in the result. At the end none should be unreviewed or appear twice.',
 'Use this method with customer messages, meeting notes or student questions. Start with three texts you can review completely. Increase the number only when you can spot an omission and correct it.'
])
add('automation',[
 'Piensa en una petición que pasa por varias mesas: alguien la recibe, alguien comprueba los datos y alguien la guarda. Una automatización hace ese recorrido en un orden escrito. Para aprenderlo, sigue una sola petición hasta el final antes de probar muchas juntas.',
 'Abre la entrada del paso que estás revisando. Entrada significa «lo que ha llegado aquí». Después mira la salida, que significa «lo que este paso entrega». Si Ana aparece en la entrada y Luis en la salida sin que lo hayas pedido, ya sabes en qué paso empezar a buscar el error.',
 'Distingue escribir un valor fijo de copiar el dato que llega. Escribir Ana sirve para una primera prueba; copiar el nombre de la entrada permite que la siguiente petición use Luis. Selecciona el dato recibido en el paso anterior con la opción que indica esta herramienta. Comprueba el valor que muestra antes de ejecutar.',
 'Una caja en verde indica que ese paso terminó, pero no demuestra por sí sola que otra aplicación tenga el registro. Si la práctica guarda información, abre el destino y busca el número de la petición. Si solo transforma datos dentro de la herramienta, el resultado termina ahí.',
 'Al llevarlo a tu trabajo, empieza por una tarea repetida con una regla sencilla: comprobar un dato, ordenar una petición o preparar un borrador. Escribe qué ocurre cuando falta información y quién revisa ese caso. No necesitas conectar cinco aplicaciones para demostrar que el primer paso funciona.'
],[
 'Think of a request passing across several desks: someone receives it, someone checks its details and someone stores it. An automation follows that written order. To learn it, follow one request to the end before trying many together.',
 'Open the input of the step you are checking. Input means “what arrived here”. Then inspect the output, meaning “what this step passes on”. If Ana is in the input and Luis appears in the output without being requested, you know where to start looking for the error.',
 'Distinguish typing a fixed value from copying the incoming detail. Typing Ana works for a first test; copying the incoming name lets the next request use Luis. Select the received detail from the previous step using this tool’s documented option. Inspect its displayed value before running.',
 'A green box shows that a step finished, but does not by itself prove another application holds the record. If the practice stores information, open the destination and find the request number. If it only transforms details inside the tool, the result ends there.',
 'At work, start with a repeated task and a simple rule: check a detail, organise a request or prepare a draft. Write what happens when information is missing and who checks that case. You do not need five connected applications to demonstrate the first step.'
])
add('code node docker',[
 'Un proyecto de programación es una carpeta con archivos que trabajan juntos. El editor te deja leerlos y cambiarlos; ejecutar el proyecto hace que el ordenador siga sus instrucciones. Abrir un archivo y verlo escrito no equivale a ponerlo en marcha.',
 'Antes de escribir una orden, comprueba la carpeta del terminal. El terminal es el cuadro donde introduces órdenes de texto. package.json, cuando existe en el ejemplo, explica las órdenes del proyecto. npm test ejecuta sus pruebas y npm start lo inicia solo si esos nombres están definidos allí.',
 'Lee el resultado de una prueba como una comparación: «esperaba esto y ocurrió esto otro». Si falla, guarda ese mensaje antes de editar. Cambia la parte que explica la diferencia y repite la misma prueba. No borres la comprobación para conseguir que todo aparezca en verde.',
 'Cuando el ejemplo usa una API, imagina una ventanilla a la que envías datos y que devuelve una respuesta. En el proyecto de solicitudes, 201 indica una creación; 409 indica un conflicto. Esos números no son notas del alumno: describen lo que el programa hizo con la petición.',
 'Para aplicar la práctica, elige un cambio que puedas enseñar: un mensaje más claro, una validación o un filtro. Guarda la versión anterior, explica qué debería seguir funcionando y compruébalo después del cambio. Si otras personas usarán el programa, la entrega debe explicar también cómo iniciarlo.'
],[
 'A programming project is a folder of files that work together. The editor lets you read and change them; running the project makes the computer follow their instructions. Opening a file and reading its contents does not run it.',
 'Before entering a command, check the terminal folder. A terminal is the box where you enter text commands. When present, package.json explains the project commands. npm test runs its tests and npm start starts it only when those names are defined there.',
 'Read a test result as a comparison: “this was expected and something else happened”. Save a failure message before editing. Change the part that explains the difference and repeat the same test. Do not remove the check merely to make everything green.',
 'When the example uses an API, think of a service desk that receives details and returns a reply. In the request project, 201 means a creation and 409 means a conflict. These numbers are not student grades: they describe what the program did with a request.',
 'Choose a change you can demonstrate: a clearer message, a validation check or a filter. Keep the previous version, explain what should still work and check it after editing. If someone else will use the program, the handover must also explain how to start it.'
])
add('python colab',[
 'El objetivo es convertir una lista en un resultado que puedas volver a calcular. Una fila representa una petición y el encabezado explica cada columna. Cuenta primero las filas a mano: así tendrás una referencia para detectar si el programa ha perdido o repetido alguna.',
 'El nombre del archivo forma parte de la instrucción. Si el ejemplo lee requests.csv, ese archivo tiene que estar en el lugar indicado. Tenerlo en Descargas no significa que el programa lo encuentre desde otra carpeta. Abre la muestra y comprueba sus encabezados antes de ejecutar.',
 'En un cuaderno, una celda puede usar un resultado calculado en una celda anterior. Por eso una sesión que parece funcionar puede fallar al volver a abrirla. Ejecuta en orden desde el principio y vuelve a aportar el archivo si la sesión nueva no lo conserva.',
 'Separa las filas aceptadas de las que necesitan revisión. Si una fila tiene un dato incorrecto, conserva su número y el motivo. Así puedes corregir el origen sin perder de vista qué entró en el cálculo. Un gráfico atractivo no sustituye esa comprobación.',
 'Para utilizarlo en tu trabajo, prueba primero una copia de una tabla pequeña. Escribe el nombre del archivo, las columnas necesarias y la orden que ejecutaste. Guarda la salida junto a la muestra; otra persona debe poder repetir el cálculo sin reconstruir tu sesión.'
],[
 'The aim is to turn a list into a result you can calculate again. One row represents one request and the header explains each column. First count the rows by hand, giving yourself a reference for spotting lost or repeated rows.',
 'The filename is part of the instruction. If the example reads requests.csv, that file must be in the specified location. Having it in Downloads does not make it accessible from every other folder. Open the sample and check its headers before running.',
 'In a notebook, a cell can depend on a result from an earlier cell. A session that seems to work can therefore fail when reopened. Run in order from the beginning and provide the file again if the new session does not keep it.',
 'Separate accepted rows from those needing review. If a row contains an incorrect detail, retain its number and the reason. You can then correct the source while knowing what entered the calculation. An attractive chart does not replace this check.',
 'At work, first try a copy of a small table. Record the filename, required columns and command you ran. Save the output beside the sample so someone else can repeat the calculation without reconstructing your session.'
])
add('data',[
 'Imagina que el equipo pregunta cuántas peticiones quedan por responder. La hoja debe contestar a partir de las filas guardadas. Un número escrito a mano puede quedar antiguo en cuanto cambie una petición; un recuento conectado a los datos se vuelve a calcular.',
 'Lee una fila entera de izquierda a derecha. Comprueba que el nombre, el curso y el estado pertenecen a la misma persona. Al ordenar, incluye la tabla completa: mover solo una columna puede separar los nombres de sus datos y producir una lista engañosa.',
 'Distingue filtrar de borrar. Un filtro oculta temporalmente las filas que no cumplen una condición; los registros siguen en la tabla. Quita el filtro y comprueba que reaparecen. Si el total ha bajado porque borraste filas, el resumen ya no representa la muestra original.',
 'Comprueba un cálculo cambiando una sola fila en una copia. Predice el resultado antes de tocarla. Si una petición pasa de pendiente a respondida, debe bajar en uno el grupo pendiente y subir en uno el respondido; el número total de peticiones se mantiene.',
 'Puedes usarlo para consultas de clientes, material prestado o tareas de equipo. Decide qué significa cada estado y evita que una persona escriba «cerrado» mientras otra usa «terminado» para lo mismo. Una lista de valores acordados facilita los recuentos y la revisión.'
],[
 'Imagine the team asks how many requests still need a reply. The sheet should answer using its saved rows. A manually typed number can become outdated as soon as a request changes; a count connected to the data recalculates.',
 'Read a complete row from left to right. Check that the name, course and status belong to the same person. Include the entire table when sorting: moving only one column can separate names from their details and produce a misleading list.',
 'Distinguish filtering from deleting. A filter temporarily hides rows that do not match a condition; the records remain in the table. Remove the filter and check they reappear. If the total fell because you deleted rows, the summary no longer represents the original sample.',
 'Check a calculation by changing one row in a copy. Predict the result first. If a request changes from pending to answered, the pending group should fall by one and the answered group rise by one; the total number of requests stays the same.',
 'Use this with customer enquiries, equipment loans or team tasks. Agree what each status means, avoiding one person writing “closed” while another uses “finished” for the same thing. Agreed values make counting and review easier.'
])
add('web react tailwind vscode typescript',[
 'Piensa en una persona que abre tu página por primera vez. Necesita saber para qué sirve, dónde escribir y qué ocurrió después de pulsar el botón. Una página está bien explicada cuando esa persona puede terminar el recorrido sin que tú estés a su lado.',
 'Prueba el recorrido con un solo dato de ejemplo antes de añadir más funciones. Lee el texto visible, introduce los datos y observa el mensaje final. Si hay una lista de resultados, busca allí el registro. Un botón que cambia de color no demuestra que se haya guardado nada.',
 'Haz una segunda prueba dejando vacío un campo necesario. El mensaje debe decir qué falta y permitir corregirlo. Conserva los datos que sí estaban bien para que la persona no tenga que escribirlo todo otra vez. Comprueba también qué ocurre al volver a pulsar.',
 'Usa la tecla Tab para moverte entre controles y mira dónde queda el foco, la señal del control seleccionado. En móvil, comprueba que puedes leer los títulos y pulsar las acciones sin desplazar toda la página hacia los lados. Repite con un nombre más largo.',
 'Para tu proyecto, escribe un recorrido concreto: «la persona llega, entiende la oferta, escribe una consulta y ve cómo continuar». Decide dónde se guardan los datos y comprueba ese destino. La práctica local sirve para aprender; compartir el trabajo exige revisar quién puede acceder.'
],[
 'Think of someone opening your page for the first time. They need to know its purpose, where to type and what happened after pressing the button. A page is clearly explained when that person can finish without you beside them.',
 'Test the journey with one example before adding more features. Read the visible text, enter the details and inspect the final message. If there is a results list, find the record there. A button changing colour does not prove anything was saved.',
 'Try again with a required field empty. The message should identify what is missing and allow a correction. Keep the correct details so the person does not need to retype everything. Also check what happens when they press again.',
 'Use Tab to move between controls and watch the focus indicator showing the selected control. On mobile, check that titles are readable and actions usable without moving the entire page sideways. Repeat with a longer name.',
 'For your project, write a concrete journey: “the person arrives, understands the offer, writes an enquiry and sees how to continue”. Decide where details are stored and inspect that destination. Local practice teaches the process; sharing it requires checking who can access it.'
])
add('postgres supabase',[
 'Una base de datos conserva información organizada. Piensa en una tabla como un registro de peticiones: cada fila es una petición y cada columna guarda un dato. El número que identifica la fila permite encontrarla otra vez aunque existan dos personas con el mismo nombre.',
 'Antes de ejecutar una instrucción, identifica la tabla de práctica y la operación. Leer muestra información; insertar añade una fila; actualizar cambia una existente. Comprueba el ejemplo leyendo el registro por su identificador después de escribirlo, sin depender solo del mensaje de éxito.',
 'Una regla de número único evita que dos filas representen la misma petición. Repetir un envío idéntico y enviar datos diferentes con el mismo número son situaciones distintas. La guía indica qué debe ocurrir en cada una; anota la respuesta y el número real de filas.',
 'Si la práctica incluye usuarios, comprueba qué ve cada uno desde su propia sesión. La cuenta de administración puede tener más acceso y no sirve para demostrar lo que ve un alumno. Conserva los resultados de cada sesión por separado para reconocer un permiso mal configurado.',
 'En tu actividad, empieza con una sola tabla y pocos registros inventados. Escribe quién puede leer, añadir y modificar. Antes de aumentar el número de usuarios, comprueba que puedes recuperar un registro y que las reglas también se cumplen al enviar datos incorrectos.'
],[
 'A database stores organised information. Think of a table as a request register: each row is a request and each column holds a detail. Its identifying number lets you find the row again even when two people have the same name.',
 'Before running an instruction, identify the practice table and operation. Reading shows information; inserting adds a row; updating changes an existing one. After writing, read the record by its identifier instead of relying only on a success message.',
 'A unique-number rule prevents two rows representing one request. Repeating an identical submission and sending different details with the same number are different situations. Follow the guide’s expected result for each and record both the response and actual row count.',
 'When users are part of the practice, check what each sees through their own session. An administrator may have more access and cannot demonstrate what a learner sees. Keep each session’s results separate to identify incorrectly configured permissions.',
 'At work, start with one table and a few fictional records. Write who may read, add and edit. Before increasing users, check that you can retrieve a record and that the rules still apply to incorrect submissions.'
])
add('knowledge research',[
 'El objetivo es que otra persona encuentre una respuesta y sepa de dónde sale. Una carpeta llena de documentos todavía no es una explicación. Empieza con una pregunta concreta y conserva la parte de la fuente que permite responderla.',
 'Distingue el documento original de tu resumen. Copia el título o el nombre del archivo junto a cada respuesta. Después abre esa fuente y localiza la frase, fila o apartado que la respalda. Un enlace que abre bien no demuestra que su contenido diga lo que afirma el resumen.',
 'Prueba también una pregunta que la fuente no resuelve. Por ejemplo, conocer una solicitud de curso no permite saber cuántas plazas quedan. La respuesta útil explica qué información falta y dónde habría que buscarla; no completa el hueco con una cifra que suena razonable.',
 'Si dos fuentes discrepan, conserva las dos afirmaciones con sus fechas y referencias. No elijas la primera por comodidad. Explica qué necesitas comprobar para resolver la diferencia. Cuando compares modelos o resultados, utiliza la misma muestra para que la comparación tenga sentido.',
 'En tu proyecto puedes crear una guía de bienvenida, un resumen de procedimientos o una tabla de preguntas frecuentes. Prueba tres preguntas habituales y una que quede fuera de los documentos. Guarda las respuestas revisadas para detectar si una actualización cambia información importante.'
],[
 'The aim is for someone else to find an answer and know where it comes from. A folder full of documents is not yet an explanation. Start with one concrete question and retain the part of the source that answers it.',
 'Distinguish the original document from your summary. Record the title or filename beside each answer, then open that source and locate its supporting sentence, row or section. A working link does not prove its content supports the summary.',
 'Also ask a question the source cannot answer. Knowing about a course request does not reveal how many places remain. A useful answer explains what information is missing and where to look instead of filling the gap with a plausible number.',
 'If two sources disagree, keep both statements with their dates and references. Do not select the first for convenience. Explain what needs checking to resolve the difference. When comparing models or outputs, use the same sample to make the comparison meaningful.',
 'Create a welcome guide, procedure summary or frequently asked questions table. Test three common questions and one outside the documents. Save reviewed answers to spot important changes after an update.'
])
add('communication',[
 'Piensa en alguien que recibe una respuesta y decide qué hacer a continuación. Necesita reconocer su consulta, entender la información disponible y saber si debe aportar algo más. La práctica consiste en preparar una respuesta útil y revisarla en su destino.',
 'Antes de redactar, identifica destinatario, motivo y siguiente paso. Comprueba el nombre contra la petición original. Una respuesta dirigida a otra persona puede tener una redacción perfecta y seguir estando mal. Usa los datos inventados de la muestra para aprender este control.',
 'Lee cada frase como si fueras quien la recibe. «Tenemos tu consulta» describe una recepción; «tu plaza está confirmada» promete una decisión. Solo utiliza la segunda cuando exista la confirmación correspondiente. Si falta un horario, pregunta por el horario en lugar de inventarlo.',
 'Guarda el mensaje en el lugar indicado por la práctica. En un correo puede ser un borrador; en una mensajería puede ser un texto preparado fuera del canal. Comprueba asunto, nombre y contenido. Tener el texto preparado no equivale a haberlo enviado.',
 'Para usarlo en tu actividad, prepara una respuesta para una consulta completa y otra para una consulta a la que le falta un dato. Decide quién revisa antes de enviar. Si automatizas después, comprueba que cada mensaje conserve la relación con su petición original.'
],[
 'Think of someone receiving a reply and deciding what to do next. They need to recognise their enquiry, understand available information and know whether to provide anything else. The practice prepares a useful reply and checks it in its destination.',
 'Before writing, identify the recipient, reason and next step. Check the name against the original request. A reply to the wrong person can be beautifully written and still be wrong. Use the fictional sample to learn this check.',
 'Read each sentence as the recipient would. “We received your enquiry” describes receipt; “your place is confirmed” promises a decision. Use the second only when the corresponding confirmation exists. If a time is missing, ask for it instead of inventing one.',
 'Save the message where the practice specifies. In email it may be a draft; in messaging it may be text prepared outside the channel. Check subject, name and contents. Preparing text is different from sending it.',
 'For your work, prepare one reply to a complete enquiry and another to one missing a detail. Decide who reviews before sending. If you later automate, check that each message retains its connection to the original request.'
])
add('image',[
 'Una imagen de trabajo debe ayudar a entender algo: anunciar una actividad, explicar una idea o indicar una acción. Antes de elegir colores, escribe qué debe recordar quien la vea. El ejercicio funciona cuando ese mensaje se entiende al tamaño en que se utilizará.',
 'Separa el texto obligatorio de la parte visual. Copia las frases exactas en una nota y úsalas como referencia. Si una herramienta genera una imagen con letras incorrectas, prepara la base visual y añade el texto con una herramienta que permita editarlo. No aceptes una palabra mal escrita porque la composición resulte bonita.',
 'Coloca primero el título, después la información que lo explica y al final la acción siguiente. Deja espacio alrededor del texto para que no compita con la imagen. Mira el diseño pequeño, como lo verá alguien en el móvil: si tienes que ampliarlo para leerlo, revisa el tamaño o la cantidad de texto.',
 'Al guardar una imagen fuera del editor, abre ese archivo y compáralo con el diseño. Comprueba que el título está completo, que los márgenes no se cortan y que el formato corresponde al encargo. El archivo descargado es la entrega que verá otra persona.',
 'Para tu proyecto, cambia un solo elemento del ejemplo: el nombre de la actividad o la llamada final. Conserva la jerarquía y vuelve a revisar el texto. Si necesitas otro formato, recoloca los elementos; estirar una imagen puede deformarla y no resuelve la composición.'
],[
 'A work image should help someone understand something: announce an activity, explain an idea or indicate an action. Before choosing colours, write what the viewer should remember. The exercise succeeds when that message is clear at its intended viewing size.',
 'Separate required wording from the visual part. Copy the exact sentences into a reference note. If generated lettering is wrong, prepare the visual base and add text in a tool that supports editing it. Do not accept a misspelled word because the composition looks attractive.',
 'Place the title first, supporting information next and the next action last. Leave space around text so it does not compete with the image. View the design small, as someone would on mobile: if reading requires zooming, review the size or amount of text.',
 'After saving outside the editor, open that file and compare it with the design. Check the complete title, uncropped margins and requested format. The downloaded file is the delivery another person will see.',
 'For your project, change one element: the activity name or final call to action. Keep the hierarchy and recheck the wording. For another format, reposition the elements; stretching can distort an image and does not solve the composition.'
])
add('video',[
 'Un vídeo explicativo tiene que mostrar un cambio que se pueda seguir. Escribe qué ocurre al principio, qué acción se realiza y cómo termina. Esas tres partes te ayudan a decidir qué mostrar; una sucesión de imágenes bonitas puede no explicar nada.',
 'Antes de generar o editar, escribe un guion con una línea por momento. En una columna indica qué se ve y en otra qué se escucha, si hay voz. Comprueba que ambas cuentan lo mismo. Si la voz dice «ya está guardado», la escena o la explicación deben permitir entender qué se ha guardado.',
 'Reproduce cada fragmento y luego el vídeo completo. Una escena puede funcionar sola y resultar confusa al unirse con otra. Busca cambios inesperados de nombres, objetos o texto. Comprueba que haya tiempo suficiente para leer cualquier frase importante sin pausar.',
 'Mira también los últimos segundos. El final debe cerrar la acción y la voz debe terminar su frase. Abre el archivo exportado fuera del editor y escucha con volumen normal. Guarda el guion utilizado para poder corregir el contenido sin reconstruirlo de memoria.',
 'En tu actividad, empieza con una explicación breve de una sola tarea. Puedes mostrar cómo preparar un documento o cómo encontrar una opción. No añadas una narración larga antes de tener claro el recorrido visual. Si usas imágenes de ejemplo, identifícalas como una representación.'
],[
 'An explanatory video must show a change people can follow. Write what happens at the start, what action occurs and how it ends. These three parts help decide what to show; a sequence of attractive images may explain nothing.',
 'Before generating or editing, write one script line per moment. Use one column for what is seen and another for what is heard, when voice is included. Check they tell the same story. If the voice says “it is saved”, the scene or explanation must establish what was saved.',
 'Play each clip and then the entire video. A scene can work alone and become confusing beside another. Look for unexpected changes in names, objects or wording. Allow enough time to read important text without pausing.',
 'Check the final seconds too. The ending should complete the action and the voice should finish its sentence. Open the exported file outside the editor and listen at normal volume. Keep the script so content can be corrected without reconstructing it from memory.',
 'At work, start with a brief explanation of one task, such as preparing a document or finding an option. Establish the visual journey before adding long narration. Identify illustrative scenes as representations when using them.'
])
add('audio dictation',[
 'Trabajar con voz requiere comparar el sonido con el texto. En dictado, hablas y revisas lo que se ha escrito. En narración, escribes y revisas lo que se escucha. En ambos casos, el objetivo es conservar el significado y los datos importantes.',
 'Prepara una frase corta con un nombre y una acción. Pronúnciala o genérala y revisa el resultado completo. Los nombres, números y palabras parecidas necesitan especial atención: una diferencia pequeña puede cambiar una hora, una cantidad o la persona de la que hablas.',
 'Si hay un error, conserva el primer intento y corrige una sola parte. En dictado puedes repetir el fragmento o editar el texto; en narración puedes ajustar la frase antes de generar de nuevo. Compara ambas versiones y anota cuál se entiende mejor y por qué.',
 'Escucha hasta el final y comprueba que no falta ninguna palabra necesaria. Si el resultado es texto, léelo en voz alta para detectar frases incompletas. Si es audio, abre el archivo guardado fuera de la herramienta y comprueba que puede reproducirse.',
 'En tu proyecto puedes preparar una nota de reunión o una instrucción hablada. Empieza por una tarea breve que conozcas bien. Cuenta también el tiempo de revisión y corrección: grabar o generar rápido solo resulta útil si el resultado final conserva la información.'
],[
 'Voice work requires comparing sound and text. In dictation, you speak and review the writing. In narration, you write and review the sound. Both aim to preserve meaning and important details.',
 'Prepare a short sentence with a name and an action. Speak or generate it and review the full result. Names, numbers and similar-sounding words need particular attention: a small difference can change a time, quantity or person.',
 'If something is wrong, keep the first attempt and correct one part. In dictation you can repeat a fragment or edit the text; in narration you can adjust the sentence before generating again. Compare both versions and record which is clearer and why.',
 'Listen to the end and check that no necessary word is missing. Read text aloud to detect incomplete sentences. For audio, open the saved file outside the tool and check it plays.',
 'Prepare a meeting note or spoken instruction for your project. Start with a brief task you know well. Include review and correction time: fast recording or generation is useful only when the final result preserves the information.'
])
add('slides',[
 'Una presentación ayuda a otra persona a entender una idea en orden. Cada diapositiva debe responder una pregunta. Antes de elegir un diseño, escribe el recorrido: qué problema existe, qué propones, cómo funciona, qué has comprobado y qué falta.',
 'Da a cada diapositiva un título que explique su idea. «Resultados» dice poco; «Dos peticiones siguen pendientes» cuenta algo que el público puede entender. Usa cifras de la muestra y señala cuándo un resultado es esperado y cuándo lo has observado realmente.',
 'No conviertas el documento entero en diapositivas llenas de texto. Mantén la explicación necesaria en las notas y muestra en pantalla el dato, dibujo o ejemplo que ayuda a seguirla. Si utilizas una tabla, explica qué fila debe mirar primero el público.',
 'Ensaya pasando las diapositivas en orden y explicando cada una con tus palabras. Si tienes que retroceder continuamente, revisa la secuencia. Abre también la exportación: una fuente o una tabla puede colocarse de otra manera fuera del editor.',
 'Para tu proyecto, prepara una versión que otra persona pueda recorrer sin ti. Añade contexto suficiente y deja claro qué decisión esperas al terminar: probar una idea, revisar un documento o elegir el siguiente paso. Evita cifras de ahorro que no hayas medido.'
],[
 'A presentation helps someone understand an idea in order. Each slide should answer one question. Before choosing a design, write the journey: the problem, proposal, how it works, what was checked and what remains.',
 'Give each slide a title that states its idea. “Results” says little; “Two requests are still pending” communicates something the audience can understand. Use sample figures and distinguish expected results from results actually observed.',
 'Do not turn the entire document into text-heavy slides. Keep supporting explanation in the notes and show the figure, diagram or example that helps people follow. For a table, explain which row to look at first.',
 'Rehearse the slides in order, explaining each in your own words. If you constantly go backwards, review the sequence. Open the export too: a font or table may appear differently outside the editor.',
 'Prepare a version someone can follow without you. Provide enough context and state the final decision: try an idea, review a document or choose the next step. Avoid savings figures you have not measured.'
])
add('vercel',[
 'Publicar significa poner una versión del proyecto en una dirección que se pueda abrir. Tu carpeta de trabajo, la vista previa y la web pública pueden mostrar versiones distintas. Antes de comprobar un cambio, identifica qué dirección has abierto.',
 'Lee la orden de construcción del proyecto y el lugar donde deja los archivos. Construir prepara la aplicación para publicarla. Si falla, busca el primer error relevante del registro; los mensajes posteriores pueden ser consecuencia de ese fallo inicial.',
 'Comprueba la vista previa con el recorrido de la práctica: abre la página, utiliza sus acciones y revisa el resultado. Un despliegue marcado como terminado indica que se publicó una versión, pero no demuestra que todos los formularios o conexiones funcionen.',
 'Anota qué versión has probado y conserva su dirección. Repite desde una sesión nueva para detectar si algo depende de información que solo existe en tu navegador. Si la aplicación guarda datos, comprueba también dónde quedan y quién puede verlos.',
 'En tu proyecto, publica primero un cambio pequeño que puedas reconocer. Escribe la comprobación que harás al terminar y la versión a la que podrías volver. La entrega incluye la dirección y el resultado de la prueba, no solo una captura del panel de publicación.'
],[
 'Publishing puts a project version at an address someone can open. Your working folder, preview and public site can show different versions. Identify the address you opened before checking a change.',
 'Read the project build command and its output location. Building prepares the application for publication. If it fails, find the first relevant error in the log; later messages may be consequences of that initial failure.',
 'Check the preview using the practice journey: open the page, use its actions and inspect the result. A completed deployment means a version was published, but does not prove every form or connection works.',
 'Record the version you tested and keep its address. Repeat from a new session to detect dependencies on information present only in your browser. If the application stores data, check where it goes and who can see it.',
 'Publish a small recognisable change first. Write the check you will perform afterwards and the version you could return to. The handover includes the address and test result, not just a deployment dashboard screenshot.'
])

add('replicate',[
 'Una ejecución de modelo recibe unos datos y produce un resultado. Antes de iniciarla, identifica qué modelo has elegido, qué entrada acepta y qué archivo o texto quieres obtener. Conserva esos datos para poder repetir el ensayo.',
 'No todos los modelos reciben los mismos campos. Copia los nombres de la entrada que muestra la documentación del modelo elegido. Distingue un campo obligatorio de un ajuste opcional y empieza con la muestra mínima indicada para esa versión.',
 'El identificador de ejecución permite encontrar el intento. Guarda ese identificador, el estado y la ubicación de la salida. Un estado de éxito indica que terminó la ejecución; abre la salida para comprobar que cumple el encargo.',
 'Cambia un solo parámetro y conserva ambos resultados. Escribe qué diferencia querías conseguir y cuál observas. Si cambias modelo, entrada y ajustes juntos, no podrás atribuir la diferencia a una sola causa.',
 'Para tu proyecto, conserva modelo y versión, entrada, ajustes, resultado y consumo observado cuando esté disponible. No uses una estimación de coste como si fuera una lectura real de la cuenta.'
],[
 'A model run receives inputs and produces a result. Before starting, identify the selected model, accepted input and desired file or text. Keep these details to repeat the trial.',
 'Models do not all accept the same fields. Use the input names documented for the selected model. Distinguish required fields from optional settings and begin with that version’s minimum sample.',
 'A run identifier helps locate the attempt. Save it, the status and output location. Success means the run finished; open the output to check it meets the brief.',
 'Change one parameter and keep both outputs. Write the intended difference and what you observe. Changing model, input and settings together prevents attributing the difference to one cause.',
 'For your project, retain model and version, input, settings, output and observed usage when available. Do not present estimated cost as an actual account reading.'
])
add('huggingface',[
 'La práctica compara respuestas con ejemplos cuyo resultado conoces. Prepara una lista pequeña con texto y etiqueta esperada. La etiqueta es el nombre de la categoría, como inicial o avanzado; no es una valoración de la persona.',
 'Lee la ficha del modelo antes de utilizarlo. Comprueba qué tarea admite, qué información recibe y qué condiciones tiene su uso. Un modelo disponible en un catálogo no acepta automáticamente cualquier clasificación que tú inventes.',
 'Entrega la misma muestra a las alternativas que compares. Conserva por separado la etiqueta de referencia y la predicción. Predicción es la respuesta del modelo: puede coincidir o no con la referencia.',
 'Cuenta aciertos y errores fila por fila. Si acierta dos de tres, escribe dos de tres en este ensayo. No conviertas una muestra pequeña en una promesa de exactitud general. Lee también los casos ambiguos.',
 'Al adaptarlo, incluye ejemplos distintos de los que utilizaste para preparar las instrucciones. Esa separación ayuda a comprobar si el procedimiento sirve con una entrada nueva.'
],[
 'This practice compares answers with examples whose expected result is known. Prepare a small list of text and reference labels. A label names a category such as introductory or advanced; it does not assess the person.',
 'Read the model card first. Check its supported task, input and usage conditions. A catalogue model does not automatically support every classification you invent.',
 'Use the same sample for alternatives being compared. Keep reference labels and predictions separate. A prediction is the model answer and may differ from the reference.',
 'Count matches and errors row by row. Two correct answers out of three means two out of three in this trial, not a general accuracy promise. Read ambiguous cases too.',
 'When adapting, include examples different from those used to prepare the instructions. This separation checks whether the procedure works on new input.'
])
add('langchain',[
 'El proyecto separa encontrar información de redactar una respuesta. Primero debe localizar el documento correcto. Después puede utilizar ese documento para contestar. Una respuesta fluida no arregla haber recuperado la ficha equivocada.',
 'Asigna a cada documento un identificador de curso. Comprueba una consulta conocida mirando el identificador del documento recuperado. Si preguntas por inicial y llega la ficha de avanzado, detente en esa búsqueda antes de añadir generación.',
 'Prueba una consulta que no tenga documento. El resultado debe reconocer que falta información. No reutilices el último documento encontrado para contestar a otro curso.',
 'Cuando la recuperación funcione, conserva junto a la respuesta la referencia utilizada. Abre esa fuente y compara la información. Si cambias la forma de buscar, repite las consultas conocidas y la consulta sin resultado.',
 'En tu proyecto, empieza con pocas fuentes que puedas leer completas. Anota cómo se identifican, cuándo cambian y qué se hace cuando dos documentos no coinciden.'
],[
 'The project separates finding information from writing an answer. First retrieve the right document, then use it to answer. Fluent wording does not fix retrieving the wrong record.',
 'Give each document a course identifier. Check a known query by inspecting the retrieved identifier. If an introductory query returns the advanced record, fix retrieval before adding generation.',
 'Try a query with no matching document. The result should acknowledge missing information. Do not reuse the last retrieved document to answer for another course.',
 'Once retrieval works, retain the source reference alongside the answer. Open it and compare details. After changing retrieval, repeat the known queries and the unmatched query.',
 'Start your project with a few sources you can read completely. Record their identifiers, when they change and what happens if two documents disagree.'
])
add('typescript',[
 'Un tipo describe qué forma debe tener un dato dentro del código. Por ejemplo, un curso puede admitir solo inicial o avanzado. La comprobación de tipos ayuda a detectar una asignación equivocada mientras preparas el programa.',
 'Lee primero los nombres y valores que admite el contrato del paquete. Después introduce un valor no permitido en una copia y observa el mensaje del compilador, el programa que comprueba y transforma TypeScript. Conserva el ejemplo correcto.',
 'Los datos que llegan de fuera necesitan otra comprobación al ejecutarse. Escribir que algo es un Request no transforma automáticamente un texto incorrecto en una solicitud válida. La validación debe revisar de verdad lo recibido.',
 'Compara dos intentos: un curso permitido y otro que no está en la lista. Identifica si el error aparece al comprobar el código o al procesar los datos externos. Son controles distintos y ambos tienen una función.',
 'Al aplicarlo, documenta qué valores acepta tu proyecto y cómo responde cuando falta uno. No ocultes el error forzando un tipo sin comprobar antes la información.'
],[
 'A type describes the shape a value should have in code. For example, a course may allow only inicial or avanzado. Type checking helps detect an incorrect assignment while preparing the program.',
 'Read the names and allowed values in the package contract. Then try an unsupported value in a copy and inspect the compiler message. The compiler checks and transforms TypeScript. Keep the correct example.',
 'External input needs another check while running. Declaring something to be a Request does not turn incorrect text into valid data. Validation must inspect what was actually received.',
 'Compare an allowed course and one outside the list. Identify whether the error appears during code checking or external input processing. These are separate controls with separate purposes.',
 'Document accepted values and responses to missing information. Do not hide errors by forcing a type without checking the data.'
])

export function practicalExplanation(kind,en=false){
 const value=notes[kind]
 if(!value)throw new Error(`Missing practical explanation: ${kind}`)
 return value[en?'en':'es']
}
