from pathlib import Path
import json,re
course=json.loads(Path('public/course.json').read_text(encoding='utf8'))
issues=json.loads(Path('audit-output/content-audit-findings.json').read_text(encoding='utf8'))['issues']
by_stem={Path(l['sourcePath']).stem.lower():l for l in course['lessons']}
# Goals and verification are specific to the purpose of each source; reference
# pages keep their actual links/tables rather than receive unrelated recipes.
tasks={
'Herramientas_del_itinerario.md':('Elegir una herramienta para una tarea concreta','Elige un bloque de la tabla, escribe la tarea que necesitas resolver y justifica una herramienta de ese bloque. Abre su ficha en Herramientas antes de instalarla.','La herramienta elegida corresponde al tipo de tarea y puedes explicar qué resultado producirás.'),
'17_ROADMAPS_30_60_90_DIAS/README.md':('Planificar la próxima semana con un roadmap','Abre el roadmap de 30, 60 o 90 días que corresponda a tu experiencia. Elige una entrega de su primera semana y reserva dos sesiones para producirla y comprobarla.','Tu plan tiene una entrega observable y una fecha; no es solo una lista de temas para leer.'),
'Prompts_de_documentacion_y_cursos.md':('Convertir una nota en una clase practicable','Copia el prompt de presentación, sustituye número de diapositivas y nota de origen, y revisa que la clase incluya una práctica. Aplica después la rúbrica a la entrega de esa práctica.','Cada criterio de la rúbrica puede comprobarse en la entrega; una clase sin ejercicio vuelve a revisión.'),
'Prompts_de_investigacion.md':('Crear una nota de investigación verificable','Sustituye tema y objetivo en el prompt base. Abre las fuentes de la respuesta y conserva la fecha, enlace y afirmación que respalda cada una. Separa una fuente secundaria de una primaria.','Ninguna conclusión importante depende de un enlace que no has abierto o de una afirmación sin fuente.'),
'Prompts_de_ventas_y_consultoria.md':('Preparar una propuesta con alcance verificable','Usa un negocio ficticio en Discovery y responde sus preguntas. Pasa esas respuestas al prompt de propuesta y elimina promesas sin medición o sin un responsable.','La propuesta separa entregables, fuera de alcance y responsabilidades del cliente; el precio no se presenta como resultado garantizado.'),
'18_PROMPTS_PROFESIONALES/README.md':('Guardar un prompt reutilizable y su resultado','Abre una de las familias enlazadas, elige un prompt, completa sus campos con un caso ficticio y guarda tanto el encargo final como la respuesta obtenida.','La copia guardada incluye contexto suficiente para reutilizarla y una nota de qué cambiarías en la próxima ejecución.'),
'20_CAPSTONE_FINAL/README.md':('Definir la evidencia del proyecto final','Abre Proyecto Sistema Completo de IA y la rúbrica. Selecciona el problema del proyecto, escribe el entregable que lo demuestra y ensaya una explicación de dos minutos con el guion de defensa.','Tu evidencia permite comprobar el resultado y explicar al menos una limitación sin depender de una promesa comercial.'),
'Agentes_tools_MCP_y_permisos.md':('Distinguir herramientas por su permiso y propósito','En un entorno de prueba, compara una herramienta de consulta con otra que modifica registros. Describe cuándo debe usarse cada una y qué confirmación exige la segunda antes de ejecutar.','Una solicitud de consulta no produce escrituras; una acción ambigua se detiene y pide aclaración.'),
'Codex_Cursor_ClaudeCode_y_diffs.md':('Aceptar un cambio de código con pruebas','Sigue el laboratorio de revisión del diff con un campo vacío y una entrada válida. Conserva el estado inicial para distinguir trabajo previo de cambios del ejercicio.','El diff solo contiene cambios justificados y las dos entradas tienen el comportamiento esperado.'),
'Errores_API_keys_401_403_429.md':('Diagnosticar una respuesta de API sin revelar secretos','Sigue el laboratorio con respuestas simuladas 401, 403 y 429. Registra la hipótesis y una reparación diferente para cada caso. No provoques tráfico excesivo.','El registro no contiene claves, los reintentos tienen límite y el mensaje del proveedor justifica la reparación.'),
'Ollama_modelos_locales_lentitud_y_memoria.md':('Separar un problema de memoria de uno de entrada','Con un modelo que tu equipo ya pueda ejecutar, usa un mensaje corto y mide el tiempo de respuesta. Repite con más contexto y anota memoria disponible y procesos activos. Si no carga, reduce tamaño o contexto antes de repetir.','La comparación registra condiciones y resultado; no concluyes que el modelo falla solo porque una ejecución fue lenta.'),
'21_TROUBLESHOOTING_Y_ERRORES_REALES/README.md':('Elegir el diagnóstico adecuado para un fallo','Selecciona un error de tu proyecto y abre la ficha enlazada que corresponde: credenciales, JSON, webhooks, herramientas, diff o entorno. Reproduce solo con datos ficticios.','El informe contiene entrada, salida, causa comprobada, reparación y una repetición que confirma el resultado.'),
'Webhooks_n8n_y_ejecuciones_duplicadas.md':('Probar que un evento repetido no duplica la operación','Sigue el laboratorio con prueba-001, un caso sin event_id y prueba-002. Repite prueba-001 de forma concurrente dentro de la tabla de pruebas.','Existe una operación por evento válido, el caso incompleto se rechaza y el duplicado no produce otro efecto.'),
'Windows_macOS_Linux_rutas_terminal_y_entorno.md':('Ejecutar un proyecto desde el shell y la carpeta correctos','Sigue el laboratorio con la carpeta Prueba academia y la variable ficticia ACADEMY_DEMO. Cierra y abre la terminal para comprobar qué era configuración de sesión.','Puedes identificar shell, carpeta y entorno sin imprimir secretos ni elevar permisos para ocultar un error de sintaxis.'),
'Fuentes_oficiales_por_herramienta.md':('Documentar una fuente oficial antes de actualizar una guía','Abre la documentación oficial de la herramienta de tu proyecto. Localiza la función que estás usando y registra URL, fecha de consulta y una afirmación concreta comprobada.','El enlace apunta a documentación del proveedor y la afirmación coincide con lo que muestra esa página.'),
'Protocolo_actualizacion_modulo.md':('Actualizar un módulo con trazabilidad','Elige una instrucción de un módulo, conserva su versión actual, contrástala con su fuente y ejecuta la práctica. Registra el cambio y revisa el resultado desde el perfil de alumno.','El changelog explica qué cambió y por qué; una persona puede repetir la práctica con las instrucciones nuevas.'),
'30_ONBOARDING_DEL_ALUMNO/README.md':('Preparar el primer día del alumno','Abre la ruta que corresponde a tu experiencia y la checklist de setup. Elige una primera tarea pequeña, identifica la herramienta necesaria y comprueba que puedes abrirla.','La primera sesión termina con el entorno preparado y una tarea definida, no con una lista de instalaciones sin propósito.'),
'34_PRODUCTO_EJECUTABLE_PREMIUM/workflows_n8n_importables/README.md':('Importar un flujo y verificarlo en pruebas','Abre Kits institucionales, elige un kit y consulta su pestaña Flujo importable. Completa las credenciales en tu entorno, usa la entrada de prueba de la guía y revisa la salida esperada antes de activar envíos reales.','Los campos de prueba están sustituidos, la salida coincide con la guía y cualquier efecto externo sigue desactivado hasta validar el caso.'),
}
def clean(text):
 text=re.sub(r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]',lambda m:m.group(2) or m.group(1).replace('_',' '),text)
 return re.sub(r'\*\*([^*]+)\*\*',r'\1',text)
def parse(source,text):
 text=text.lstrip('\ufeff')
 text=re.sub(r'^---\s*\n.*?\n---\s*\n','',text, count=1, flags=re.S)
 text=text.split('## Control editorial profesional')[0]
 lines=text.splitlines(); blocks=[];parts=[];heading=source.stem.replace('_',' ');i=0;links=[]
 def flush():
  nonlocal parts
  if parts: blocks.append({'kind':'seccion','title':heading,'parts':parts});parts=[]
 for target,alias in re.findall(r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]',text):
  found=by_stem.get(Path(target).stem.lower())
  if found:links.append({'label':alias or found['title'],'href':'#/leccion/'+found['slug']})
 while i<len(lines):
  line=lines[i].strip()
  if not line or line=='---':i+=1;continue
  if line.startswith('#'):
   flush();heading=re.sub(r'^#+\s*','',line);i+=1;continue
  if line.startswith('```'):
   lang=line[3:];code=[];i+=1
   while i<len(lines) and not lines[i].strip().startswith('```'):code.append(lines[i]);i+=1
   parts.append({'type':'code','lang':lang or 'text','code':'\n'.join(code)});i+=1;continue
  if line.startswith('|') and i+1<len(lines) and re.match(r'^\s*\|?\s*:?-{3,}',lines[i+1]):
   header=[clean(v.strip()) for v in line.strip('|').split('|')];i+=2;rows=[]
   while i<len(lines) and lines[i].strip().startswith('|'):rows.append([clean(v.strip()) for v in lines[i].strip().strip('|').split('|')]);i+=1
   parts.append({'type':'table','header':header,'rows':rows});continue
  if re.match(r'^[-*]\s',line) or re.match(r'^\d+[.)]\s',line):
   ordered=bool(re.match(r'^\d',line));items=[]
   while i<len(lines) and (re.match(r'^\s*[-*]\s',lines[i]) or re.match(r'^\s*\d+[.)]\s',lines[i])):
    value=re.sub(r'^\s*(?:[-*]|\d+[.)])\s+','',lines[i]).strip()
    if value.startswith('http'):links.append({'label':value,'href':value})
    elif not value.startswith('[['):items.append(clean(value))
    i+=1
   if items:parts.append({'type':'ol' if ordered else 'ul','items':items})
   continue
  paras=[line];i+=1
  while i<len(lines) and lines[i].strip() and not re.match(r'^(?:#|```|\||[-*]\s|\d+[.)]\s)',lines[i].strip()):paras.append(lines[i].strip());i+=1
  parts.append({'type':'p','text':clean(' '.join(paras))})
 flush()
 if links:blocks.append({'kind':'seccion','title':'Abrir el material de referencia','parts':[{'type':'links','links':list({l['href']:l for l in links}.values())}]})
 return blocks
output=[]
for issue in issues:
 if not issue['title'].startswith('Lección con poca'):continue
 source=issue['evidence'].split('source=')[1];p=Path(source);lesson=next(l for l in course['lessons'] if l['sourcePath']==source)
 blocks=parse(p,p.read_text(encoding='utf8'))
 if source.endswith('workflows_n8n_importables/README.md'):blocks.append({'kind':'seccion','title':'Abrir flujos completos','parts':[{'type':'links','links':[{'label':'Kits institucionales: flujo, prueba y entrega','href':'#/kits'},{'label':'Herramientas: n8n','href':'#/herramienta/n8n'}]}]})
 goal,action,expected=tasks.get(source,tasks.get(p.name))
 practice={'goal':goal,'steps':[{'title':goal,'where':'En el material de esta ficha y tu proyecto de prueba','action':action,'expected':expected}],'evidence':expected}
 levels={level:{'blocks':blocks,'practice':practice,'objectives':[goal],'checklist':[expected]} for level in ['basico','intermedio','avanzado']}
 override={'sourcePath':source,'levels':levels,'interactive':[]}
 dest=Path('content/authored')/('audit-content-'+lesson['slug']+'.json');dest.write_text(json.dumps(override,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 output.append({'source':source,'override':str(dest).replace('\\','/'),'blocks':len(blocks),'links':sum(len(part.get('links',[])) for block in blocks for part in block.get('parts',[])),'tables':sum(part['type']=='table' for block in blocks for part in block.get('parts',[]))})
Path('audit-output/short-lessons-repaired.json').write_text(json.dumps(output,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'repaired':len(output),'tables':sum(x['tables'] for x in output),'links':sum(x['links'] for x in output)}))
