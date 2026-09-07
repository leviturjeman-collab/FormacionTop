const cases={}
const add=(id,es,en)=>cases[id]={es,en}
add('que-es-la-ia',[
 'A1: Ana pide el curso inicial online. A2: Luis pide el avanzado y no indica modalidad.',
 'Solicitud | Nombre | Curso | Modalidad\nA1 | Ana | Inicial | Online\nA2 | Luis | Avanzado | No indicada',
 'Cada celda procede de una frase. «No indicada» conserva un hueco sin inventar la preferencia de Luis. La tabla ordena consultas; no reserva plazas.',
 'Añade A3: «Me interesa el curso inicial presencial», sin nombre.',
 'A3 | No indicado | Inicial | Presencial. El nombre queda pendiente y las filas A1 y A2 no cambian.'
],[
 'A1: Ana asks for the introductory course online. A2: Luis asks for the advanced course with no format specified.',
 'Request | Name | Course | Format\nA1 | Ana | Introductory | Online\nA2 | Luis | Advanced | Not specified',
 'Each cell comes from a sentence. “Not specified” preserves the gap without inventing Luis’s preference. The table organises enquiries; it reserves no places.',
 'Add A3: “I am interested in the in-person introductory course”, with no name.',
 'A3 | Not specified | Introductory | In person. The name remains missing; A1 and A2 stay unchanged.'
])
add('por-que-se-inventa',[
 'Fuente: «Curso inicial. Inicio: 12 de septiembre de 2026. Modalidad online». Respuesta propuesta: «Empieza el 12, cuesta 90 y quedan cinco plazas».',
 'Inicio el 12 de septiembre de 2026 → conservar: aparece en la fuente.\nPrecio 90 → retirar: no aparece.\nCinco plazas → retirar: no aparece.\nModalidad online → se puede añadir: sí aparece.',
 'Se comprueba cada afirmación por separado. Que una frase tenga un dato correcto no convierte en correctos los demás.',
 'Una segunda fuente indica inicio el 19 de septiembre. Escribe qué harías con ambas fechas.',
 'Conservar ambas fechas con sus fuentes y pedir aclaración sobre cuál está vigente. No elegir una sin información adicional.'
],[
 'Source: “Introductory course. Starts 12 September 2026. Online”. Proposed reply: “Starts on the 12th, costs 90 and has five places left”.',
 'Starts 12 September 2026 → retain: stated in source.\nPrice 90 → remove: absent.\nFive places → remove: absent.\nOnline format → may be added: stated.',
 'Check each claim separately. One correct detail does not make the rest of the sentence correct.',
 'A second source gives 19 September as the start date. Explain what to do with both dates.',
 'Keep both dates with their sources and ask which is current. Do not choose without further information.'
])
add('la-memoria',[
 'Acuerdos: primera versión sin pagos; campos nombre, correo y curso. Existe un boceto local. Falta elegir almacenamiento y publicar.',
 'HECHO: boceto local.\nACORDADO: sin pagos; nombre, correo y curso.\nPENDIENTE: elegir almacenamiento y publicar.\nSIGUIENTE PASO: decidir dónde guardar las solicitudes.',
 'La nota separa lo realizado de lo decidido y lo pendiente. Otra conversación puede continuar leyendo esta información sin suponer que ya existe una web pública.',
 'Se acuerda usar una tabla de ensayo, pero todavía no se conecta. Actualiza la nota.',
 'ACORDADO: usar tabla de ensayo. PENDIENTE: conectar y probar la tabla; publicar. No se marca como hecho el almacenamiento.'
],[
 'Agreements: first version without payments; name, email and course fields. A local draft exists. Storage selection and publication remain pending.',
 'DONE: local draft.\nAGREED: no payments; name, email and course.\nPENDING: select storage and publish.\nNEXT: decide where to store requests.',
 'The note separates completed work, decisions and pending work. A new conversation can continue without assuming a public website exists.',
 'A practice table is selected but not connected. Update the note.',
 'AGREED: use a practice table. PENDING: connect and test the table; publish. Storage is not marked done.'
])
add('que-modelo-usar',[
 'Ensayo inventado con la misma tarea. Opción A conserva 3 de 3 datos, no inventa ninguno y tarda 12 segundos. Opción B conserva 2 de 3, añade una fecha ausente y tarda 6 segundos.',
 'Para esta tarea, A cumple mejor la revisión de datos. B es más rápida en este ensayo, pero omite un dato e inventa otro. Falta repetir con más muestras antes de decidir un uso habitual.',
 'La comparación utiliza la misma entrada y mira errores concretos. Los nombres A y B y los tiempos son del ejercicio; no clasifican productos reales.',
 'Una nueva muestra hace que A y B conserven todos los datos, sin añadidos. ¿Puedes afirmar que A siempre es mejor?',
 'No. En la segunda muestra ambas cumplen la revisión. La elección debe considerar los resultados de varias muestras y las necesidades reales.'
],[
 'Invented trial with the same task. Option A retains 3 of 3 details, invents none and takes 12 seconds. B retains 2 of 3, adds an absent date and takes 6 seconds.',
 'A meets the data check better for this task. B is faster in this trial but omits one detail and invents another. More samples are needed before deciding routine use.',
 'Both options receive the same input and concrete errors are checked. A, B and the times belong to the exercise; they do not rank real products.',
 'On another sample both options retain all details without additions. Can you claim A is always better?',
 'No. Both meet the check on the second sample. Consider several samples and actual needs before choosing.'
])
add('cuanto-cuesta',[
 'Tarifa inventada: 20 unidades fijas al mes más 0,03 por caso. Se esperan 300 casos. No incluye otros servicios ni tiempo de revisión.',
 'Parte variable: 300 × 0,03 = 9.\nTotal previsto: 20 + 9 = 29.\nCon 500 casos: 20 + 500 × 0,03 = 35.',
 'Primero se calcula lo que depende del uso y después se añade el fijo una sola vez. Son cifras de práctica, no una oferta comercial.',
 'El 10 % de los 300 casos se repite. Calcula el total con esas 30 repeticiones.',
 '300 + 30 = 330 casos. 330 × 0,03 = 9,90. Total: 20 + 9,90 = 29,90 unidades.'
],[
 'Invented tariff: 20 fixed units per month plus 0.03 per case. Expect 300 cases. Other services and review time are excluded.',
 'Variable part: 300 × 0.03 = 9.\nExpected total: 20 + 9 = 29.\nWith 500 cases: 20 + 500 × 0.03 = 35.',
 'Calculate usage-dependent cost first, then add the fixed amount once. These are practice figures, not a commercial offer.',
 'Ten percent of the 300 cases repeat. Calculate the total with those 30 repetitions.',
 '300 + 30 = 330 cases. 330 × 0.03 = 9.90. Total: 20 + 9.90 = 29.90 units.'
])
add('encargo-comprobable',[
 'Petición imprecisa: «Haz una web para el centro». Primera versión acordada: formulario local con nombre, correo y curso; sin pagos ni envío externo.',
 'Entrega: página de ensayo que pide nombre, correo y curso.\nCaso correcto: muestra una confirmación local.\nCorreo vacío o inválido: muestra el error y no confirma.\nSe comprueba con teclado y móvil.\nFuera de esta versión: pagos, servidor y envío.',
 'El encargo describe algo que puedes probar. Decir «moderna y profesional» no define qué ocurre al utilizarla.',
 'Añade a la segunda versión guardar las consultas para que las vea otra persona. ¿Qué decisión nueva hace falta?',
 'Elegir un destino compartido, quién accede y cómo comprobar el registro. La confirmación local de la primera versión no demuestra ese guardado.'
],[
 'Vague request: “Make a website for the centre”. Agreed first version: local name, email and course form; no payments or external submission.',
 'Delivery: practice page asking for name, email and course.\nValid case: local confirmation.\nEmpty or invalid email: error and no confirmation.\nCheck keyboard and mobile use.\nExcluded: payments, server and sending.',
 'The brief describes something testable. “Modern and professional” does not define what happens during use.',
 'Version two must save enquiries for another person to see. What new decision is needed?',
 'Choose shared storage, access rules and a record check. Version one’s local confirmation does not demonstrate storage.'
])
add('ingredientes-prompt',[
 'Fuente: «Soy Ana. Quiero información del curso inicial». Encargo: extraer nombre, curso y modalidad; usar null cuando falte modalidad.',
 '{"nombre":"Ana","curso":"inicial","modalidad":null}',
 'Los nombres de los tres campos vienen del encargo. Ana e inicial salen de la fuente. null significa que el dato no está indicado; no significa presencial ni online.',
 'Cambia la fuente a «Soy Luis. Quiero el curso avanzado online». Conserva los mismos tres campos.',
 '{"nombre":"Luis","curso":"avanzado","modalidad":"online"}'
],[
 'Source: “I am Ana. I want information about the introductory course”. Task: extract nombre, curso and modalidad; use null for an absent format.',
 '{"nombre":"Ana","curso":"inicial","modalidad":null}',
 'The three field names come from the task. Ana and inicial come from the source. null means unspecified, not in person or online. Keys remain as defined in the example contract.',
 'Change the source to “I am Luis. I want the advanced course online”. Keep the same three fields.',
 '{"nombre":"Luis","curso":"avanzado","modalidad":"online"}'
])
add('dar-ejemplos',[
 'Reglas del ejercicio: «Empiezo desde cero» → Inicial; «Ya programo y quiero integrar APIs» → Avanzado; «Quiero aprender» → Revisar. Nueva frase: «Nunca he utilizado estas herramientas».',
 'Propuesta: Inicial. Respaldo: «Nunca he utilizado estas herramientas» indica que empieza sin experiencia. Es una clasificación del ejercicio, no una evaluación completa de la persona.',
 'Los ejemplos muestran cómo relacionar una frase con una categoría. La frase ambigua se conserva como Revisar para no forzar una respuesta.',
 'Clasifica «Sé programar, pero nunca he usado estas herramientas».',
 'Revisar. La frase combina experiencia de programación y falta de experiencia en las herramientas. Preguntar qué quiere aprender ayuda a decidir.'
],[
 'Exercise rules: “I start from zero” → Introductory; “I already code and want to connect APIs” → Advanced; “I want to learn” → Review. New phrase: “I have never used these tools”.',
 'Proposal: Introductory. Evidence: “I have never used these tools” indicates no experience with them. This is an exercise classification, not a complete assessment of the person.',
 'Examples connect a phrase to a category. Ambiguous wording stays in Review instead of forcing an answer.',
 'Classify “I can code but have never used these tools”.',
 'Review. It combines coding experience with no tool experience. Ask what the person wants to learn.'
])
add('guardar-prompts',[
 'Quieres reutilizar una petición que convierte consultas en una tabla. Campos: nombre y curso. Si un dato no está escrito, debe indicar No indicado.',
 'Nombre: tabla-consultas. Versión: 1.\nInstrucción: «Usa solo FUENTE. Devuelve nombre y curso. Si falta un dato, escribe No indicado».\nFUENTE de prueba: «Ana pide el inicial».\nRespuesta: Ana | Inicial.\nPrueba sin nombre: «Pide el avanzado» → No indicado | Avanzado.',
 'La ficha guarda el texto que se reutiliza y dos ejemplos para comprobarlo. El nombre y la versión permiten distinguir cambios posteriores.',
 'Crea una versión 2 que añada modalidad. ¿Qué debe ocurrir con la muestra de Ana?',
 'Ana | Inicial | No indicada. Mantén la versión 1 y sus dos campos para identificar qué cambió.'
],[
 'You want to reuse a request that turns enquiries into a table. Fields: name and course. Missing details must say Not specified.',
 'Name: enquiry-table. Version: 1.\nInstruction: “Use SOURCE only. Return name and course. Write Not specified for missing details”.\nTest SOURCE: “Ana asks for the introductory course”.\nAnswer: Ana | Introductory.\nUnnamed test: “Asks for advanced” → Not specified | Advanced.',
 'The record preserves reusable wording and two checks. A name and version distinguish later changes.',
 'Make version 2 adding format. What should happen to Ana’s sample?',
 'Ana | Introductory | Not specified. Keep version 1 with its two fields to identify the change.'
])
add('corregir-rumbo',[
 'Fuente: «Ana pregunta por el curso inicial». Respuesta incorrecta: «Ana / inicial / presencial / inscrita».',
 'Conservar: Ana e inicial.\nRetirar: presencial, porque no se indica modalidad.\nCorregir inscrita por solicitud de información.\nRespuesta: Ana / Inicial / Modalidad no indicada / Solicitud de información.',
 'La corrección nombra cada error y mantiene los datos que ya eran correctos. «Hazlo mejor» no explica qué parte debe cambiar.',
 'La respuesta ahora dice «Ana / avanzado / Modalidad no indicada / Solicitud de información». Corrige solo el error.',
 'Cambiar Avanzado por Inicial. Los demás datos coinciden con la fuente y se conservan.'
],[
 'Source: “Ana asks about the introductory course”. Incorrect answer: “Ana / introductory / in person / enrolled”.',
 'Retain: Ana and introductory.\nRemove: in person, because no format is given.\nReplace enrolled with information request.\nAnswer: Ana / Introductory / Format not specified / Information request.',
 'The correction names each error and keeps correct details. “Make it better” does not explain what should change.',
 'The answer now says “Ana / Advanced / Format not specified / Information request”. Correct only the error.',
 'Replace Advanced with Introductory. The other details match the source and remain.'
])
add('que-instalar',[
 'Hoy abrirás un archivo index.html ya preparado. Más adelante ejecutarás un proyecto cuya documentación pide Node.',
 'Para hoy: navegador y acceso a index.html. Comprobación: abre el archivo y ves la página.\nPara la siguiente versión: el entorno que pide su README. Comprobación: la orden de arranque documentada funciona.',
 'Los requisitos dependen de la tarea. No hace falta instalar todo el catálogo para abrir una página de ejemplo.',
 'La orden de la siguiente versión responde que Node no se reconoce. ¿Qué paso revisas?',
 'Revisar la instalación y disponibilidad de Node requerida por ese proyecto. No modificar el HTML para resolver un programa que falta en el entorno.'
],[
 'Today you will open a prepared index.html. Later you will run a project whose documentation requires Node.',
 'Today: browser and access to index.html. Check: open it and see the page.\nNext version: the environment required by its README. Check: the documented start command works.',
 'Requirements depend on the task. Opening a sample page does not require installing the whole catalogue.',
 'The next version’s command says Node is not recognised. What do you check?',
 'Check installation and availability of the Node environment required by that project. Do not edit HTML to fix missing software.'
])
add('primera-carpeta',[
 'Carpeta aula-norte con index.html, styles.css, app.js y README.md. index.html contiene una referencia a styles.css.',
 'aula-norte/\n  index.html → contenido y referencias\n  styles.css → apariencia\n  app.js → comportamiento\n  README.md → instrucciones',
 'Los nombres conectan los archivos. Si el HTML busca styles.css, cambiar ese nombre sin actualizar la referencia puede dejar la página sin estilos.',
 'En una copia renombras styles.css a aspecto.css y no tocas el HTML. ¿Qué debes corregir?',
 'Restaurar styles.css o actualizar su referencia a aspecto.css. Recargar y comprobar que vuelve la apariencia esperada.'
],[
 'Folder aula-norte contains index.html, styles.css, app.js and README.md. index.html references styles.css.',
 'aula-norte/\n  index.html → contents and references\n  styles.css → appearance\n  app.js → behaviour\n  README.md → instructions',
 'Names connect the files. Renaming styles.css without updating its HTML reference can remove the expected styling.',
 'In a copy, rename styles.css to aspecto.css without editing HTML. What needs correcting?',
 'Restore styles.css or update its reference to aspecto.css. Reload and check that the expected appearance returns.'
])
add('ver-tu-proyecto',[
 'Ejemplo de terminal: «Servidor disponible en http://localhost:3000». El proceso sigue activo. No se ha publicado nada.',
 'Dirección para probar en ese ordenador: http://localhost:3000.\nEstado: servidor local activo.\nPublicación pública: pendiente.',
 'La dirección se toma del terminal; el puerto 3000 pertenece a este ejemplo. En tu proyecto utiliza el que aparezca realmente. Localhost se refiere al dispositivo desde el que se abre.',
 'El terminal de tu proyecto muestra el puerto 4173. ¿Qué dirección debes utilizar?',
 'http://localhost:4173 en ese ordenador. No copiar 3000 solo porque aparece en el ejemplo.'
],[
 'Example terminal: “Server available at http://localhost:3000”. The process remains active. Nothing has been published.',
 'Address for this computer: http://localhost:3000.\nStatus: active local server.\nPublic publication: pending.',
 'Read the address from the terminal; 3000 belongs to this example. Use the actual port your project displays. Localhost refers to the device opening it.',
 'Your project terminal displays port 4173. Which address should you use?',
 'http://localhost:4173 on that computer. Do not copy 3000 just because it appears in the example.'
])
add('claves-secretas',[
 'Ejemplo sin credenciales reales: API_URL=https://api.example.com. API_KEY=REEMPLAZAR_EN_EL_ENTORNO. El servicio requiere una clave privada de servidor.',
 'Documentar: nombres API_URL y API_KEY y para qué sirven.\nConfigurar: la clave privada en el entorno del servidor.\nCompartir en la guía: un marcador, nunca el valor real.\nComprobar: respuesta de acceso sin mostrar la clave.',
 'El nombre de una variable ayuda a configurar. El valor privado permite acceso y no debe convertirse en texto público del ejercicio.',
 'Alguien propone pegar la clave privada en el JavaScript que recibe el navegador. ¿Qué parte del diseño debe cambiar?',
 'La operación que requiere esa clave se realiza en el servidor. El navegador no debe recibir la credencial privada.'
],[
 'Example without real credentials: API_URL=https://api.example.com. API_KEY=REPLACE_IN_ENVIRONMENT. The service requires a private server key.',
 'Document: API_URL and API_KEY names and purposes.\nConfigure: private key in the server environment.\nShare in the guide: a placeholder, never the real value.\nCheck: access response without displaying the key.',
 'A variable name supports configuration. Its private value grants access and must not become public exercise text.',
 'Someone proposes placing the private key in JavaScript sent to the browser. What design changes?',
 'Run the operation requiring that key on the server. The browser must not receive the private credential.'
])
add('github-basico',[
 'Cambio acordado: corregir validación del correo. Se modifican app.js y pruebas.md. Además existe notas-personales.txt, que no forma parte de la entrega.',
 'Revisar diferencias: app.js y pruebas.md.\nIncluir en la versión: esos dos archivos.\nComprobar: correo vacío falla; correo válido continúa.\nDejar fuera: notas-personales.txt.',
 'Guardar una versión es registrar un conjunto concreto de cambios. Revisar la lista evita olvidar una prueba o incluir archivos ajenos a la entrega.',
 'Añades un nuevo archivo validacion.js que app.js necesita. ¿Puede faltar en la versión guardada?',
 'No. Hay que incluirlo y comprobar una copia de la versión completa. Que exista solo en tu carpeta no basta para otra persona.'
],[
 'Agreed change: fix email validation. app.js and pruebas.md change. notas-personales.txt also exists but is unrelated to delivery.',
 'Review differences: app.js and pruebas.md.\nInclude in version: those two files.\nCheck: empty email fails; valid email continues.\nExclude: notas-personales.txt.',
 'Saving a version records a specific set of changes. Checking the list avoids missing a test or including unrelated files.',
 'You add validacion.js, required by app.js. Can it be absent from the saved version?',
 'No. Include it and check a copy of the complete version. Existing only in your folder is insufficient for another person.'
])
for(const id of ['primera-web','pedir-cambios','cuando-falla','claude-code','revisar-lo-que-escribe'])add(id,[
 'Formulario de ensayo: nombre Ana, correo vacío, curso Inicial. Regla: los tres campos son necesarios. La comprobación se hace sobre la página, no sobre una descripción del chat.',
 'Intento 1, correo vacío: aviso junto al correo; ninguna confirmación; Ana e Inicial permanecen.\nIntento 2, ana@example.com: se permite continuar y aparece la confirmación de ensayo local.',
 'El primer intento comprueba el error y el segundo comprueba que corregirlo permite continuar. Conservar nombre y curso evita volver a escribir datos correctos. No se ha demostrado un envío al servidor.',
 'Repite con nombre vacío, correo ana@example.com y curso Inicial. Predice qué debe cambiar.',
 'El aviso identifica el nombre que falta y no aparece confirmación. Se conservan correo y curso. Tras escribir Ana, puede completarse el ensayo.'
],[
 'Practice form: name Ana, empty email, course Introductory. Rule: all three fields are required. Check the page itself, not a chat description.',
 'Attempt 1, empty email: notice beside email; no confirmation; Ana and Introductory remain.\nAttempt 2, ana@example.com: continuation is allowed and a local practice confirmation appears.',
 'The first attempt checks the error and the second checks that correcting it allows progress. Keeping name and course avoids retyping correct details. This does not demonstrate server submission.',
 'Repeat with empty name, ana@example.com and Introductory. Predict the change.',
 'The notice identifies the missing name and no confirmation appears. Email and course remain. Entering Ana allows the practice to finish.'
])
add('que-automatizar',[
 'Una persona recibe una consulta, comprueba si tiene curso y correo, la guarda y después decide si hay una plaza compatible. La disponibilidad la revisa coordinación.',
 'Automático propuesto: recibir → comprobar campos → guardar petición completa.\nSi falta un dato: preparar revisión.\nHumano: comprobar disponibilidad y decidir confirmación.',
 'Las comprobaciones de campos siguen reglas explícitas. Decidir plazas requiere otra información y no se deduce de recibir una consulta.',
 'Llega una petición con correo pero sin curso. Señala dónde se detiene el recorrido.',
 'Se detecta la ausencia del curso antes de registrar como completa. Se prepara la pregunta sobre el curso; no se confirma una plaza.'
],[
 'A person receives an enquiry, checks course and email, stores it, then decides whether a suitable place exists. Coordination checks availability.',
 'Proposed automatic part: receive → check fields → store complete request.\nMissing detail: prepare review.\nHuman part: check availability and decide confirmation.',
 'Field checks follow explicit rules. Place decisions need other information and do not follow from receiving an enquiry.',
 'A request contains email but no course. Where does the journey stop?',
 'The missing course is detected before recording it as complete. Prepare a course question; confirm no place.'
])
add('primer-flujo',[
 '{"id":"SOL-001","email":"ana@example.com","course":"inicial"}. Regla del ensayo: los tres campos son necesarios.',
 'Entrada: SOL-001, ana@example.com, inicial.\nComprobación: aparecen los tres datos.\nSalida válida: conserva SOL-001, ana@example.com e inicial.',
 'Las flechas transportan estos valores. Si cambia un nombre de campo o se pierde un dato, revisa el primer paso cuya salida ya no coincide.',
 'Quita email en una copia y recorre las mismas comprobaciones.',
 'Resultado de revisión: falta email. La rama válida no debe guardar esa petición como completa. Al restaurar el correo, vuelve a pasar.'
],[
 '{"id":"SOL-001","email":"ana@example.com","course":"inicial"}. Exercise rule: all three fields are required.',
 'Input: SOL-001, ana@example.com, inicial.\nCheck: all three details exist.\nValid output: retains SOL-001, ana@example.com and inicial.',
 'The arrows transport these values. If a field is renamed or lost, find the first step whose output differs.',
 'Remove email in a copy and repeat the same checks.',
 'Review result: missing email. The valid branch must not store this as a complete request. Restoring the email makes it pass again.'
])
add('conectar-apps',[
 'Origen: id=SOL-001, email=ana@example.com, course=inicial. El destino usa nombres distintos: external_id, correo y curso.',
 'Origen → Destino → Valor\nid → external_id → SOL-001\nemail → correo → ana@example.com\ncourse → curso → inicial',
 'Cambian los nombres de las casillas, no el significado de los datos. La relación se configura copiando el valor que llega, no escribiendo Ana como valor fijo para todas las peticiones.',
 'Llega id=SOL-002, email=luis@example.com, course=avanzado. Escribe la fila que debe verse en el destino.',
 'external_id=SOL-002; correo=luis@example.com; curso=avanzado. Si aparece el correo de Ana, hay un valor fijo o una referencia incorrecta.'
],[
 'Source: id=SOL-001, email=ana@example.com, course=inicial. Destination names: external_id, correo and curso.',
 'Source → Destination → Value\nid → external_id → SOL-001\nemail → correo → ana@example.com\ncourse → curso → inicial',
 'Field names change, not the meaning of the details. Configure the relationship using incoming values instead of typing Ana as a fixed value for every request.',
 'New input: id=SOL-002, email=luis@example.com, course=avanzado. Write the expected destination row.',
 'external_id=SOL-002; correo=luis@example.com; curso=avanzado. Ana’s email would indicate a fixed value or wrong reference.'
])
add('ia-dentro-del-flujo',[
 'Mensaje M1: «No puedo entrar en mi cuenta». Categorías del ejercicio: acceso, facturacion, otros. Si no hay información suficiente, necesita_revision debe ser true.',
 '{"id":"M1","categoria":"acceso","evidencia":"No puedo entrar en mi cuenta","necesita_revision":false}',
 'La categoría se relaciona con una frase concreta del mensaje. La decisión solo clasifica el texto: no cambia contraseñas ni abre una cuenta.',
 'Clasifica M2: «Os escribo por lo que hablamos».',
 '{"id":"M2","categoria":"otros","evidencia":"Os escribo por lo que hablamos","necesita_revision":true}'
],[
 'Message M1: “I cannot access my account”. Exercise categories: acceso, facturacion, otros. Set necesita_revision to true when information is insufficient.',
 '{"id":"M1","categoria":"acceso","evidencia":"I cannot access my account","necesita_revision":false}',
 'The category is supported by a specific sentence. The decision only classifies text: it changes no password and opens no account. Keys and categories follow the exercise contract.',
 'Classify M2: “I am writing about what we discussed”.',
 '{"id":"M2","categoria":"otros","evidencia":"I am writing about what we discussed","necesita_revision":true}'
])
add('que-no-se-rompa',[
 'Registro de prueba: SOL-001 se guardó. El emisor no recibió la respuesta y vuelve a enviar exactamente la misma petición. Regla: un identificador corresponde a una sola entidad.',
 'Antes del reintento: una entidad SOL-001.\nDespués del reintento: una entidad SOL-001.\nHistorial: dos intentos relacionados con el mismo identificador.',
 'Los intentos y las entidades no son lo mismo. El historial puede crecer sin crear una segunda solicitud. Una respuesta perdida obliga a consultar el destino antes de suponer que nada se guardó.',
 'Llega SOL-001 otra vez, ahora con un curso diferente. ¿Es idéntica a la anterior?',
 'No. El identificador coincide pero los datos cambian. Aplicar la regla de conflicto o revisión definida; no tratarla como una repetición idéntica.'
],[
 'Test record: SOL-001 was saved. The sender missed the response and resends the exact request. Rule: one identifier corresponds to one entity.',
 'Before retry: one SOL-001 entity.\nAfter retry: one SOL-001 entity.\nHistory: two attempts related to the same identifier.',
 'Attempts and entities are different. History may grow without creating a second request. A lost response requires checking the destination before assuming nothing was saved.',
 'SOL-001 arrives again with a different course. Is it identical?',
 'No. The identifier matches but the details differ. Apply the defined conflict or review rule instead of treating it as an identical repeat.'
])
for(const id of ['que-es-un-agente','darle-herramientas','mcp','skills'])add(id,[
 'Ficha autorizada del curso inicial: modalidad online. No contiene precio. La práctica permite leer la ficha y preparar respuestas; no matricular ni cobrar. Pregunta: «¿Cuál es la modalidad y cuánto cuesta?»',
 'Modalidad: online, según la ficha del curso inicial. Precio: no indicado en la ficha. Siguiente paso: pedir el precio a la persona responsable. Acciones realizadas en el ejemplo resuelto: consultar información; ninguna matrícula ni cobro.',
 'El objetivo, los datos disponibles y las acciones permitidas son piezas distintas. Acceder a una ficha no concede permiso para modificar inscripciones. En una ejecución real comprueba qué lectura ocurrió antes de describirla como realizada.',
 'La persona escribe «Entonces matricúlame y cobra lo que sea». ¿Qué debe hacer el asistente dentro del alcance descrito?',
 'Explicar que esta práctica no permite matricular ni cobrar y orientar hacia el procedimiento autorizado. No inventar una confirmación ni un precio.'
],[
 'Authorised introductory course record: online format. No price. The practice allows reading the record and drafting answers, not enrolment or charging. Question: “What is the format and price?”',
 'Format: online, according to the introductory record. Price: absent from the record. Next step: ask the responsible person. Actions in the worked example: consult information; no enrolment or charge.',
 'The goal, available data and permitted actions are separate. Reading a record does not grant permission to change enrolments. In an actual run, verify the reading occurred before claiming it did.',
 'The person says “Then enrol me and charge whatever it costs”. What should this assistant do within its stated scope?',
 'Explain that this practice cannot enrol or charge and point to the authorised procedure. Invent neither confirmation nor price.'
])

export function programWorkedAnswer(id,en=false){return cases[id]?.[en?'en':'es']}
