import fs from 'node:fs';
import { chromium } from 'playwright-core';
const course = JSON.parse(fs.readFileSync('public/course.json','utf8'));
const lesson=course.curso[0]||course.lessons[0],category=course.categories[0],stage=course.stages[0],tool=course.toolPages[0],deck=course.decks[0],guide=course.guides[0],agent=course.agents[0];
const routes=['#/','#/curso','#/mi-proyecto','#/prompts','#/kits','#/agentes','#/admin','#/herramientas','#/preguntas','#/indice','#/progreso','#/guia',`#/area/${stage.id}`,`#/categoria/${category.id}`,`#/curso/${lesson.id}`,`#/leccion/${lesson.slug||lesson.id}?n=basico`,`#/presentar/${lesson.slug||lesson.id}?n=intermedio`,`#/herramienta/${tool.id}`,`#/deck/${deck.id}`,`#/guia/${guide.id}`,`#/agentes/${agent.id}`,'#/buscar?q=automatizacion%20cliente%20whatsapp%20facturas%20documentos%20errores'];
const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const findings=[];let views=0;let drawerViews=0;
async function measure(p,role,width,url,surface='page') {
 const issues=await p.evaluate((surface)=>{
 const excluded=e=>e.closest('pre,table,svg,.st-quiz,.st-flow-canvas,.st-sidebar:not(.open)')&&!(innerWidth>820&&e.closest('.st-sidebar'))||(e.closest('details:not([open])')&&!e.closest('summary'));
 const visible=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'&&!excluded(e)};
 const root=surface==='drawer'?document.querySelector('.st-sidebar'):document.body;
 const targets=[...root.querySelectorAll('button,input,select,textarea,a,summary')].filter(visible).filter(e=>!(e.tagName==='A'&&e.closest('p')&&getComputedStyle(e).display==='inline')).filter(e=>{const r=e.getBoundingClientRect();return r.width<43.9||r.height<43.9}).map(e=>({kind:'target',tag:e.tagName,cls:e.className,parent:e.parentElement.className,text:(e.textContent||e.getAttribute('aria-label')||'').slice(0,60),w:Math.round(e.getBoundingClientRect().width),h:Math.round(e.getBoundingClientRect().height)}));
 const clips=[...root.querySelectorAll('*')].filter(visible).filter(e=>e.tagName!=='INPUT'&&e.tagName!=='TEXTAREA').filter(e=>{const s=getComputedStyle(e);return e.clientWidth>0&&((['hidden','clip'].includes(s.overflowX)&&e.scrollWidth>e.clientWidth+2)||(['hidden','clip'].includes(s.overflowY)&&e.scrollHeight>e.clientHeight+3))}).map(e=>({kind:'clip',tag:e.tagName,cls:e.className,parent:e.parentElement.className,text:e.textContent.slice(0,60)}));return [...targets,...clips];
 },surface);
 if(issues.length)findings.push({role,width,url,surface,issues});
}
for(const role of ['learner','admin'])for(const width of [375,768,1440]){
 const c=await b.newContext({viewport:{width,height:900},reducedMotion:'reduce'});await c.addInitScript(()=>sessionStorage.setItem('academia.session.v2','test'));const p=await c.newPage();
 await p.route('**/rest/v1/rpc/**',r=>r.fulfill({json:['academy_admin_learners','academy_support_list'].includes(r.request().url().split('/').pop())?[]:{ok:true,token:'test',expiresAt:'2099-01-01',profile:{id:'test-'+role,name:'QA',role,level:'intermedio',locale:'es'},progress:{},state:{},version:0}}));
 for(const url of routes){await p.goto('http://127.0.0.1:4176/'+url);await p.waitForTimeout(180);await p.locator('.st-loading').waitFor({state:'hidden'}).catch(async error=>{console.error({role,width,url,body:await p.locator('body').innerText()});throw error});await measure(p,role,width,url);views++}
 await p.goto('http://127.0.0.1:4176/#/');await p.locator('.st-header').waitFor();if(width<821){await p.getByRole('button',{name:'Abrir menú',exact:true}).click();await measure(p,role,width,'#/','drawer');drawerViews++;await p.locator('.st-sidebar-close').click()}await c.close();
}
await b.close();const groups={};for(const r of findings)for(const i of r.issues){const key=i.kind+' '+i.tag+' '+i.cls+' / '+i.parent;groups[key]=(groups[key]||0)+1}
fs.writeFileSync('.temp/mobile/touch-role-results.json',JSON.stringify({views,drawerViews,findings},null,2));console.log(JSON.stringify({views,drawerViews,count:findings.reduce((n,r)=>n+r.issues.length,0),groups},null,2));process.exitCode=findings.length?1:0;
