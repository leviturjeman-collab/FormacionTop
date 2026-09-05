// Standalone Node.js >=22 server. Set WEBHOOK_SECRET and PORT; binds localhost.
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
const secret=process.env.WEBHOOK_SECRET;
if(!secret || secret.length<32) throw new Error('WEBHOOK_SECRET must contain at least 32 characters');
const folder=path.resolve(process.env.EVENT_DIR || './webhook-events');
fs.mkdirSync(folder,{recursive:true});
const server=http.createServer((req,res)=>{
  const reply=(code,data)=>{res.writeHead(code,{'content-type':'application/json'});res.end(JSON.stringify(data));};
  if(req.method!=='POST' || req.url!=='/webhook') return reply(404,{error:'not_found'});
  let size=0, chunks=[], rejected=false;
  req.on('data',chunk=>{size+=chunk.length;if(size>1000000){if(!rejected)reply(413,{error:'too_large'});rejected=true;chunks=[];}else if(!rejected)chunks.push(chunk);});
  req.on('end',()=>{
    if(rejected)return;
    const body=Buffer.concat(chunks);
    const expected='sha256='+crypto.createHmac('sha256',secret).update(body).digest('hex');
    const actual=String(req.headers['x-hub-signature-256']||'');
    if(actual.length!==expected.length || !crypto.timingSafeEqual(Buffer.from(actual),Buffer.from(expected))) return reply(401,{error:'bad_signature'});
    const id=String(req.headers['x-github-delivery']||'');
    if(!/^[A-Za-z0-9_-]{8,100}$/.test(id))return reply(400,{error:'delivery_id_required'});
    let event;try{event=JSON.parse(body);}catch{return reply(400,{error:'invalid_json'});}
    if(!event || Array.isArray(event) || typeof event!=='object')return reply(400,{error:'object_required'});
    const target=path.join(folder,id+'.json');
    try{
      const fd=fs.openSync(target,'wx',0o600);
      try{fs.writeSync(fd,JSON.stringify({id,received_at:new Date().toISOString(),status:'pending',event}));fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
      reply(202,{received:true,id,status:'persisted_pending'});
    }catch(error){if(error.code==='EEXIST')reply(200,{received:true,id,duplicate:true});else reply(500,{error:'persistence_failed'});}
  });
});
server.requestTimeout=15000;
server.listen(Number(process.env.PORT||8000),'127.0.0.1');
