import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
const git = (...args) => execFileSync('git', args, {encoding:'utf8'})
const ref = 'stash@{0}'
const files = git('diff','--name-only',`${ref}^1`,ref).trim().split('\n')
const findings = []
for (const file of files) {
  const current = fs.existsSync(file) ? fs.readFileSync(file,'utf8') : ''
  const stored = git('show',`${ref}:${file}`)
  const item = {file, identical:current===stored, action:'Historical version preserved; do not overwrite the current implementation.'}
  if (file.startsWith('content/prompts/')) {
    const a = JSON.parse(stored), b=JSON.parse(current)
    const names = new Set((b.prompts||[]).map(p=>p.name))
    item.missingPromptNames=(a.prompts||[]).filter(p=>!names.has(p.name)).map(p=>p.name)
    item.storedPrompts=a.prompts?.length||0;item.currentPrompts=b.prompts?.length||0
    item.action=item.missingPromptNames.length ? 'Review missing prompt identities individually.' : 'All saved prompt names remain in the current source. Historical verbosity changes are not new capabilities.'
  }
  findings.push(item)
}
fs.writeFileSync('docs/auditoria/paused-stash-review.json',JSON.stringify({checkedAt:new Date().toISOString(),ref,subject:git('log','-1','--format=%s',ref).trim(),findings},null,2))
console.log(JSON.stringify({files:files.length,promptFiles:findings.filter(f=>f.storedPrompts!==undefined),report:'docs/auditoria/paused-stash-review.json'},null,2))
