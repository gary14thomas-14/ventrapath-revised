const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '..', '..', 'backend', 'src', 'lib', 'phase-data.js')

async function validateUrl(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 12000)

  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal })
    if (response.status === 405) {
      response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal })
    }
    return response.status
  } catch (error) {
    if (error && (error.name === 'AbortError' || String(error.message || error).includes('aborted'))) {
      return 'timeout'
    }
    return `error:${error.message || error}`
  } finally {
    clearTimeout(timer)
  }
}

async function main() {
  const source = fs.readFileSync(FILE, 'utf8')
  const urls = [...new Set(source.match(/https?:\/\/[^\s'"`]+/g) || [])].sort()
  const bad = []
  const warnings = []

  for (const url of urls) {
    const status = await validateUrl(url)
    if (status === 'timeout') {
      warnings.push({ url, status })
      continue
    }
    if (typeof status === 'number' && (status === 404 || status === 410 || status >= 500)) {
      bad.push({ url, status })
    }
  }

  console.log(JSON.stringify({
    total: urls.length,
    bad,
    warnings,
  }, null, 2))

  if (bad.length > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
