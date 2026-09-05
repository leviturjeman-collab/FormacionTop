import { chromium } from 'playwright-core';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const course=JSON.parse(fs.readFileSync('public/course.json','utf8'));
const base=process.env.MOBILE_TEST_URL || 'http://127.0.0.1:4176/';
const urls=['#/preguntas','#/','#/mi-proyecto','#/ruta','#/herramientas','#/biblioteca','#/prompts','#/kits','#/agentes','#/guia','#/curso','#/indice','#/progreso','#/buscar?q=automatizaciones',...course.toolPages.map(x=>'#/herramienta/'+x.id), ...['stages','categories','folders','lessons'].flatMap((key)=>course[key].slice(0,2).map(x=>'#/'+({stages:'area',categories:'categoria',folders:'carpeta',lessons:'leccion'}[key])+'/'+(x.slug||x.id)))];
const errors=[];fs.mkdirSync('.temp/mobile',{recursive:true});
for(const width of [320,375,390,430,768,1440]){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}); const page=await context.newPage();
 await page.route('**/rest/v1/rpc/**',route=>route.fulfill({json:{ok:true,token:'test-session',expiresAt:'2099-01-01T00:00:00Z',profile:{id:'test-mobile',name:'Alumno prueba',role:'learner',level:'intermedio',locale:'es'},progress:{},state:{},version:0}}));
 await page.addInitScript(()=>sessionStorage.setItem('academia.session.v2','test-session'));
 await page.goto(base); await page.locator('.st-header').waitFor();
 for(const url of urls){
 await page.goto(base+url);await page.waitForTimeout(100);
 const overflow=await page.evaluate(()=>{const w=innerWidth;return [...document.querySelectorAll('main *, .st-header *, .st-foot *')].filter(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect(); if(s.display==='none'||s.visibility==='hidden'||!r.width||e.closest('pre, table, .st-flow-canvas'))return false;return r.right>w+1||r.left< -1}).slice(0,8).map(e=>({tag:e.tagName,cls:e.getAttribute('class')||'',text:e.textContent.slice(0,65),right:Math.round(e.getBoundingClientRect().right),left:Math.round(e.getBoundingClientRect().left)}))});
 if(overflow.length) errors.push({width,url,overflow});
 const overlaps=await page.evaluate(()=>{const els=[...document.querySelectorAll('.st-header button, .st-header a')].filter(e=>e.getBoundingClientRect().width>0);const pairs=[];for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){const a=els[i].getBoundingClientRect(),b=els[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)pairs.push([els[i].textContent,els[j].textContent]);}return pairs;});
 if(overlaps.length)errors.push({width,url,overlaps});
 }
 if(width<821){await page.getByRole('button',{name:'Abrir menú',exact:true}).click();await page.locator('.st-sidebar.open').waitFor();await page.screenshot({path:'.temp/mobile/drawer-'+width+'.png'});await page.locator('.st-sidebar-close').click();await page.locator('.st-sidebar.open').waitFor({state:'hidden'});}
 await page.goto(base+'#/mi-proyecto');await page.waitForTimeout(100);await page.screenshot({path:'.temp/mobile/project-'+width+'.png'});
 for(let step=0;step<3;step++){
 if(step>0) await page.locator('.st-choice-grid button').first().click();
 await page.getByRole('button',{name:'Continuar',exact:true}).click();
 if(step===2){await page.locator('.st-tool-picker').waitFor();
 const badTools=await page.locator('.st-tool-choice').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().right>innerWidth+1||e.scrollWidth>e.clientWidth+1).map(e=>e.textContent));if(badTools.length)errors.push({width,url:'wizard-tools',badTools});await page.screenshot({path:'.temp/mobile/tools-'+width+'.png',fullPage:true});await page.locator('.st-tool-choice').first().click();}
 }
 await context.close();
}
await browser.close();fs.writeFileSync('.temp/mobile/results.json',JSON.stringify({routes:urls.length,widths:6,errors},null,2));console.log(JSON.stringify({routes:urls.length,failures:errors.length,examples:errors.slice(0,12)},null,2));process.exitCode=errors.length?1:0;
