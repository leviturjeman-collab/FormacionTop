import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import vm from 'node:vm'
import ts from 'typescript'

const source = await fs.readFile(new URL('../src/clipboard.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
function environment(clipboard, copyResult = true) {
  let focused = false, removed = false, appended = false, selected = false
  const exports = {}
  const document = {
    activeElement: { focus() { focused = true } },
    getSelection: () => null,
    createElement: () => ({ style: {}, select() { selected = true }, remove() { removed = true } }),
    body: { appendChild() { appended = true } },
    execCommand: (command) => { assert.equal(command, 'copy'); return copyResult },
  }
  vm.runInNewContext(compiled, { exports, navigator: { clipboard }, document })
  return { copy: exports.copyText, state: () => ({ focused, removed, appended, selected }) }
}
let received = ''
const success = environment({ async writeText(text) { received = text } })
await success.copy('áñ test')
assert.equal(received, 'áñ test')
assert.equal(success.state().appended, false)
const denied = environment({ async writeText() { throw new Error('denied') } })
await denied.copy('fallback')
assert.deepEqual(denied.state(), { focused: true, removed: true, appended: true, selected: true })
const unsupported = environment(undefined)
await unsupported.copy('no API')
assert.equal(unsupported.state().removed, true)
const failed = environment(undefined, false)
await assert.rejects(failed.copy('no permission'), /Clipboard unavailable/)
assert.equal(failed.state().removed, true)
assert.equal(failed.state().focused, true)
console.log('Clipboard: 4 scenarios passed (native, denied fallback, absent API, total failure with cleanup).')
