import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { chromium } from 'playwright-core'
import { unzipSync } from 'fflate'
import fs from 'node:fs/promises'
const result = await build({ stdin: { contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import Modal from './src/components/Modal'; import {copyText,downloadPackage} from './src/downloads'; function Fixture(){const [open,setOpen]=React.useState(true); return <>{open && <Modal label="Resource" onClose={()=>setOpen(false)}><button onClick={()=>copyText('Recovery text').catch(()=>{})}>Copy</button><button>Last</button></Modal>}<button onClick={()=>downloadPackage('agent',[{name:'nested/tool.py',content:'print(1)'},{name:'workflow.json',content:'{}'}])}>Download</button></>}; createRoot(document.getElementById('root')).render(<Fixture/>);`, resolveDir: process.cwd(), loader: 'tsx' }, bundle:true, write:false, format:'iife', jsx:'automatic' })
const executablePath=process.env.CHROME_PATH || (process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined)
const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})})
try {
 const page=await browser.newPage({acceptDownloads:true}); const errors=[]; page.on('pageerror',error=>errors.push(error.message))
 await page.route('**/*',route=>route.fulfill({contentType:'text/html',body:'<html><body><div id="root"></div></body></html>'}))
 await page.goto('http://localhost:5189')
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('Denied'))},configurable:true}))
 await page.addScriptTag({content:result.outputFiles[0].text})
 await page.getByRole('button',{name:'Copy',exact:true}).click()
 await page.locator('dialog[open]').waitFor()
 await page.keyboard.press('Tab')
 assert(await page.evaluate(()=>Boolean(document.activeElement.closest('dialog[open]'))),'Native clipboard dialog owns Tab')
 await page.keyboard.press('Escape')
 await page.waitForFunction(()=>!document.querySelector('dialog[open]'))
 assert.equal(await page.locator('[role="dialog"]').count(),1,'Escape closes only clipboard dialog')
 await page.keyboard.press('Escape')
 assert.equal(await page.locator('[role="dialog"]').count(),0,'Parent modal closes on next Escape')
 assert.equal(await page.locator('#root').evaluate(node=>node.inert),false)
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Download',exact:true}).click();const download=await pending
 const zip=unzipSync(await fs.readFile(await download.path()));assert.equal(new TextDecoder().decode(zip['nested/tool.py']),'print(1)');assert(zip['workflow.json'])
 assert.deepEqual(errors,[])
 console.log('PASS UI primitives: nested clipboard keyboard, focus recovery, and nested agent ZIP files.')
}finally{await browser.close()}
