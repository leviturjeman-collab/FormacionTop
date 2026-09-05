import http from 'node:http';
const tasks=[];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
http.createServer((req,res)=>{
 if(req.method==='POST'&&req.url==='/tasks'){
  let body='';req.on('data',c=>{body+=c;if(body.length>10000)req.destroy();});
  req.on('end',()=>{const title=new URLSearchParams(body).get('title')?.trim();if(!title){res.writeHead(400);res.end('Título requerido');return;}tasks.push(title);res.writeHead(303,{Location:'/'});res.end();});return;
 }
 res.writeHead(200,{'content-type':'text/html; charset=utf-8'});
 res.end('<!doctype html><html lang="es"><head><title>Mis tareas</title></head><body><h1>Tareas</h1><form method="POST" action="/tasks"><label>Título<input name="title" required></label><button>Guardar</button></form><ul>'+tasks.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul></body></html>');
}).listen(4178,'127.0.0.1');
