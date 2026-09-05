import fs from 'node:fs';
import {chromium} from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[];let views=0;const runtime=[];const keyboard=[];const typography=[];
for(const role of ['learner','admin'])for(const width of [375,1440]){
const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});await context.addInitScript(()=>sessionStorage.setItem('academia.session.v2','qa'));const page=await context.newPage();page.on('pageerror',e=>runtime.push(e.message));await page.route('**/rest/v1/rpc/**',r=>r.fulfill({json:['academy_admin_learners','academy_support_list'].includes(r.request().url().split('/').pop())?[]:{ok:true,token:'qa',expiresAt:'2099-01-01',profile:{id:'qa-'+role,name:'QA',role,level:'intermedio',locale:'es'},progress:{},state:{},version:0}}));
for(const route of ['#/','#/mi-proyecto','#/prompts','#/herramienta/codex','#/indice',...(role==='admin'?['#/admin']:[])]){
await page.goto('http://127.0.0.1:4176/'+route);await page.locator('.st-header').waitFor();await page.locator('.st-loading').waitFor({state:'hidden'});await page.waitForTimeout(250);
const result=await new AxeBuilder({page}).exclude('.st-quiz').withTags(['wcag2a','wcag2aa','wcag21aa','best-practice']).analyze();views++;if(result.violations.length)results.push({role,width,route,violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,html:n.html.slice(0,300),summary:n.failureSummary}))}))});
}
await page.goto('http://127.0.0.1:4176/#/');await page.locator('.st-header').waitFor();
for(let tab=0;tab<5;tab++){await page.keyboard.press('Tab');const focus=await page.evaluate(()=>{const e=document.activeElement,s=getComputedStyle(e);return {tag:e.tagName,outline:s.outlineStyle,width:parseFloat(s.outlineWidth),label:e.getAttribute('aria-label')||e.textContent.slice(0,50)}});keyboard.push({role,width,...focus});if(focus.outline==='none'||focus.width<2)runtime.push('Invisible keyboard focus: '+JSON.stringify(focus));}
const small=await page.locator('p,li').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width>0&&getComputedStyle(e).visibility!=='hidden'&&parseFloat(getComputedStyle(e).fontSize)<10).map(e=>({text:e.textContent.slice(0,80),fontSize:getComputedStyle(e).fontSize})));typography.push({role,width,small});
await context.close();}
await browser.close();fs.writeFileSync('.temp/mobile/accessibility-results.json',JSON.stringify({views,results,runtime,keyboard,typography},null,2));const groups={};for(const r of results)for(const v of r.violations)groups[v.id]=(groups[v.id]||0)+v.nodes.length;console.log(JSON.stringify({views,violations:results.reduce((n,r)=>n+r.violations.length,0),groups,runtime,keyboardChecks:keyboard.length,smallText:typography.reduce((n,r)=>n+r.small.length,0)},null,2));process.exitCode=results.length||runtime.length?1:0;
