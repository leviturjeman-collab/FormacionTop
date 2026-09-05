import assert from 'node:assert/strict'
import fs from 'node:fs/promises'

// Read-only production checks. No credentials are written to the report.
const domains = (process.env.ACADEMY_TEST_DOMAINS || 'www.aibylevi.com,aibylevi.com,formaciontop.vercel.app').split(',')
const results = await Promise.all(domains.map(async domain => {
  const base = `https://${domain.trim()}`
  const checks = await Promise.all(['/', '/course.json', '/course.en.json', '/course-data/es/index.json', '/course-data/en/tools/codex.json', '/generated/workflows/access-check.json'].map(async path => {
    const response = await fetch(base + path, { signal: AbortSignal.timeout(20000), cache: 'no-store' })
    assert.equal(response.status, path === '/' ? 200 : 401, base + path)
    const content = await response.text()
    if (path === '/') assert.match(content, /\/assets\/index-[^" ]+\.js/)
    else {
      assert.equal(JSON.parse(content).error, 'authentication_required')
      assert.match(response.headers.get('cache-control') || '', /no-store/)
    }
    return { path, status: response.status, finalUrl: response.url }
  }))
  return { domain, checks }
}))
await fs.mkdir('audit-output', { recursive: true })
await fs.writeFile('audit-output/published-content-verification.json', JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2))
console.log(`PASS published content: ${results.reduce((sum, item) => sum + item.checks.length, 0)} checks across ${domains.length} domains.`)
