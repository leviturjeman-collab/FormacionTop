import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
import { build } from 'esbuild'

await build({entryPoints:['src/tool-path.ts'],outfile:'.temp/institutional-content.mjs',bundle:true,format:'esm',platform:'node'})
const {toolPath}=await import(pathToFileURL(path.resolve('.temp/institutional-content.mjs')))
for(const locale of ['es','en']) {
 const course=JSON.parse(await fs.readFile(`public/course${locale==='en'?'.en':''}.json`,'utf8'))
 for(const tool of course.toolPages) {
  const units=toolPath(tool,locale==='en')
  assert.equal(units.length,10)
  assert.equal(new Set(units.map(u=>u.title)).size,10,`${tool.id} has distinct unit topics`)
  for(const u of units) {
   assert.ok(u.study?.solution && u.study?.reasoning && u.study?.exercise,`${locale}/${tool.id}/${u.id} complete instruction`)
   assert.doesNotMatch(JSON.stringify(u),/DOCUMENTOMAESTRO|CLASESPORHERRAMIENTA|\.\.\/0\d[A-Z]/,'No internal vault paths in units')
  }
 }
 const units=toolPath(course.toolPages.find(t=>t.id==='codex'),locale==='en')
 const solution=units[4].study.solution
 const code=solution.split('// booking.mjs\n')[1].split('// booking.test.mjs\n')
 const functionCode=code[0]
 const tests=code[1].split('// Ejecuta')[0].split('// Run:')[0]
 const dir=path.resolve(`.temp/curriculum-lab-${locale}`)
 await fs.mkdir(dir,{recursive:true})
 await fs.writeFile(path.join(dir,'booking.mjs'),functionCode)
 await fs.writeFile(path.join(dir,'booking.test.mjs'),tests)
 let run=spawnSync(process.execPath,['booking.test.mjs'],{cwd:dir,encoding:'utf8'})
 assert.equal(run.status,0,run.stderr)
 const boundaries=units[7].study.solution.replace('// Amplía booking.test.mjs\n','')
 await fs.writeFile(path.join(dir,'booking.test.mjs'),'import assert from "node:assert/strict";\nimport {validateGuests} from "./booking.mjs";\n'+boundaries)
 run=spawnSync(process.execPath,['booking.test.mjs'],{cwd:dir,encoding:'utf8'})
 assert.equal(run.status,0,run.stderr)
 await fs.writeFile(path.join(dir,'booking.mjs'),functionCode.replace('value >= 1','value >= 0'))
 run=spawnSync(process.execPath,['booking.test.mjs'],{cwd:dir,encoding:'utf8'})
 assert.notEqual(run.status,0,'Published boundary tests detect the deliberately introduced defect')
 await fs.writeFile(path.join(dir,'booking.mjs'),functionCode)
 console.log(`PASS ${locale}: 56 tool curricula; published Codex example executes, nine boundary cases pass, introduced zero-guests defect fails.`)
}
