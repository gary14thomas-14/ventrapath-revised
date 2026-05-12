const { chromium } = require('playwright')

const FRONTEND_BASE = process.env.VENTRAPATH_FRONTEND_BASE || 'http://127.0.0.1:3000'
const ACCEPTABLE_INTERNAL_STATUS = new Set([200, 201, 202, 203, 204, 301, 302, 303, 307, 308, 401, 403, 405])

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalizePath(href) {
  try {
    const url = new URL(href, FRONTEND_BASE)
    return `${url.pathname}${url.search}`
  } catch {
    return href
  }
}

async function waitForHeading(page, name, timeout = 30000) {
  await page.getByRole('heading', { name }).first().waitFor({ state: 'visible', timeout })
}

async function clickAndWait(page, locator, urlPattern, heading) {
  await locator.waitFor({ state: 'visible', timeout: 30000 })
  await locator.click()
  await page.waitForURL(urlPattern, { timeout: 60000 })
  if (heading) {
    await waitForHeading(page, heading, 30000)
  }
}

async function collectVisibleLinks(page) {
  return page.locator('a[href]').evaluateAll((anchors) => anchors
    .map((anchor) => {
      const element = anchor
      const style = window.getComputedStyle(element)
      const label = (element.textContent || element.getAttribute('aria-label') || element.getAttribute('title') || '').replace(/\s+/g, ' ').trim()
      return {
        href: element.href,
        text: label,
        visible: style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0,
      }
    })
    .filter((item) => item.visible && item.href))
}

async function validateUrl(url, kind = 'external') {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)

  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal })
    if (response.status === 405) {
      response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal })
    }
    if (kind === 'internal') {
      assert(ACCEPTABLE_INTERNAL_STATUS.has(response.status), `Bad status ${response.status} for ${url}`)
    } else {
      assert(response.status !== 404 && response.status !== 410 && response.status < 500, `Bad status ${response.status} for ${url}`)
    }
    return response.status
  } catch (error) {
    if (kind === 'external' && error && (error.name === 'AbortError' || String(error.message || error).includes('aborted'))) {
      return 'timeout'
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

async function captureLinks(page, buckets, label) {
  const links = await collectVisibleLinks(page)

  for (const link of links) {
    assert(link.href !== '#', `Placeholder link found on ${label}`)
    assert(!link.href.startsWith('javascript:'), `javascript: link found on ${label}`)

    const url = new URL(link.href, FRONTEND_BASE)
    if (url.origin === new URL(FRONTEND_BASE).origin) {
      buckets.internal.add(`${url.pathname}${url.search}`)
    } else if (url.protocol === 'http:' || url.protocol === 'https:') {
      buckets.external.add(url.toString())
    }
  }

  return links
}

async function main() {
  const idea = `VentraPath full end to end test ${Date.now()}`
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()
  const links = { internal: new Set(), external: new Set() }
  const summary = {
    landing: false,
    pricing: false,
    support: false,
    inputFlow: false,
    generation: false,
    blueprintFlow: false,
    phaseFlow: false,
    redirects: false,
    homeResume: false,
    externalLinksValidated: 0,
    internalLinksValidated: 0,
    externalLinkWarnings: [],
  }

  try {
    await page.goto(`${FRONTEND_BASE}/`, { waitUntil: 'domcontentloaded' })
    await waitForHeading(page, /business plan you can actually act on/i)
    await captureLinks(page, links, 'landing')
    summary.landing = true

    await clickAndWait(page, page.getByRole('link', { name: /Testing Guide/i }).first(), /\/support$/, /How to test this build well/i)
    await captureLinks(page, links, 'support')
    summary.support = true
    await clickAndWait(page, page.getByRole('link', { name: /View rollout notes/i }).first(), /\/pricing$/, /Tester access and rollout status/i)
    await captureLinks(page, links, 'pricing')
    summary.pricing = true

    await clickAndWait(page, page.getByRole('link', { name: /Open Product/i }).first(), /\/input$/, /What’s the business idea\?/i)
    await captureLinks(page, links, 'input-step-1')

    await page.getByRole('textbox').fill(idea)
    await clickAndWait(page, page.getByRole('button', { name: /^Continue$/ }), /\/input$/, /Where will it operate\?/i)
    await page.getByRole('button', { name: /^Back$/ }).click()
    await waitForHeading(page, /What’s the business idea\?/i)
    await page.getByRole('button', { name: /^Continue$/ }).click()
    await waitForHeading(page, /Where will it operate\?/i)
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'Australia' }).click()
    await captureLinks(page, links, 'input-step-2')
    await page.getByRole('button', { name: /Generate Blueprint/i }).click()
    await page.waitForURL(/\/generating$/, { timeout: 10000 })
    await waitForHeading(page, /Understanding Your Idea|Blueprint generation hit a snag/i, 10000)
    summary.inputFlow = true
    summary.generation = true

    await page.waitForURL(/\/blueprint$/, { timeout: 90000 })
    await waitForHeading(page, /^The Business$/)
    await page.getByText('Current project').waitFor({ state: 'visible', timeout: 30000 })
    await captureLinks(page, links, 'blueprint-business')

    const blueprintSections = [
      { href: '/market', heading: /^Market$/ },
      { href: '/monetisation', heading: /^Monetisation$/ },
      { href: '/execution', heading: /^Execution$/ },
      { href: '/legal', heading: /^Legal$/ },
      { href: '/website', heading: /^Website$/ },
      { href: '/risks', heading: /^Risks$/ },
    ]

    await clickAndWait(page, page.getByRole('link', { name: /Next: Market/i }).first(), /\/market$/, /^Market$/)
    await clickAndWait(page, page.getByRole('link', { name: /^The Business$/ }).first(), /\/blueprint$/, /^The Business$/)
    await clickAndWait(page, page.getByRole('link', { name: /Next: Market/i }).first(), /\/market$/, /^Market$/)
    await captureLinks(page, links, 'blueprint-market')

    for (const section of blueprintSections.slice(1)) {
      await clickAndWait(page, page.locator(`a[href="${section.href}"]`).last(), new RegExp(`${escapeRegex(section.href)}$`), section.heading)
      await captureLinks(page, links, `blueprint-${section.href}`)
    }
    summary.blueprintFlow = true

    await clickAndWait(page, page.getByRole('link', { name: /Start Phase 1: Brand/i }).first(), /\/phase1\/brand$/, /^Brand$/)

    const phases = [
      { path: '/phase1/brand', heading: /^Brand$/ },
      { path: '/phase2/legal', heading: /^Legal$/ },
      { path: '/phase3/finance', heading: /^Finance$/ },
      { path: '/phase4/protection', heading: /^Protection$/ },
      { path: '/phase5/infrastructure', heading: /^Infrastructure$/ },
      { path: '/phase6/marketing', heading: /^Marketing$/ },
      { path: '/phase7/operations', heading: /^Operations$/ },
      { path: '/phase8/sales', heading: /^Sales$/ },
      { path: '/phase9/growth', heading: /Growth/i },
    ]

    for (const phase of phases) {
      await page.waitForURL(new RegExp(`${escapeRegex(phase.path)}$`), { timeout: 60000 })
      await waitForHeading(page, phase.heading, 60000)
      await page.getByText('Phase ladder').waitFor({ state: 'visible', timeout: 30000 })
      await captureLinks(page, links, phase.path)

      if (phase.path === '/phase2/legal') {
        await page.getByText(/legal/i).first().waitFor({ state: 'visible', timeout: 30000 })
      }

      if (phase.path === '/phase3/finance') {
        const noteText = `Full e2e finance note ${Date.now()}`
        await page.locator('textarea').first().fill(noteText)
        await page.locator('input[type="checkbox"]').first().check()
        await page.waitForTimeout(1500)
      }

      if (phase.path === '/phase4/protection') {
        await clickAndWait(page, page.getByRole('link', { name: /^Home$/ }).first(), /\/$/, /business plan you can actually act on/i)
        await page.getByText(/Current local project ready to resume/i).waitFor({ state: 'visible', timeout: 30000 })
        await clickAndWait(page, page.getByRole('link', { name: /Resume Current Project|Resume Project/i }).first(), /\/phase4\/protection$/, /^Protection$/)
        summary.homeResume = true

        await clickAndWait(page, page.getByRole('link', { name: /^3 Finance$/ }).first(), /\/phase3\/finance$/, /^Finance$/)
        await clickAndWait(page, page.getByRole('link', { name: /^4 Protection$/ }).first(), /\/phase4\/protection$/, /^Protection$/)
      }

      if (phase.path === '/phase8/sales') {
        await clickAndWait(page, page.locator('a[href="/phase7/operations"]').last(), /\/phase7\/operations$/, /^Operations$/)
        await clickAndWait(page, page.locator('a[href="/phase8/sales"]').last(), /\/phase8\/sales$/, /^Sales$/)
      }

      const currentIndex = phases.findIndex((item) => item.path === phase.path)
      const nextPhase = phases[currentIndex + 1]
      if (nextPhase) {
        await clickAndWait(page, page.locator(`a[href="${nextPhase.path}"]`).last(), new RegExp(`${escapeRegex(nextPhase.path)}$`), nextPhase.heading)
      }
    }
    summary.phaseFlow = true

    await page.goto(`${FRONTEND_BASE}/phase3`, { waitUntil: 'domcontentloaded' })
    await page.waitForURL(/\/phase3\/finance$/, { timeout: 30000 })
    await waitForHeading(page, /^Finance$/)
    await page.goto(`${FRONTEND_BASE}/phase9`, { waitUntil: 'domcontentloaded' })
    await page.waitForURL(/\/phase9\/growth$/, { timeout: 30000 })
    await waitForHeading(page, /Growth/i)
    summary.redirects = true

    for (const internalPath of Array.from(links.internal).sort()) {
      const status = await validateUrl(`${FRONTEND_BASE}${internalPath}`, 'internal')
      assert(ACCEPTABLE_INTERNAL_STATUS.has(status), `Internal link failed: ${internalPath}`)
      summary.internalLinksValidated += 1
    }

    for (const externalUrl of Array.from(links.external).sort()) {
      const status = await validateUrl(externalUrl, 'external')
      if (status === 'timeout') {
        summary.externalLinkWarnings.push(`Timeout validating ${externalUrl}`)
        continue
      }
      assert(status !== 404 && status !== 410 && status < 500, `External link failed: ${externalUrl}`)
      summary.externalLinksValidated += 1
    }

    console.log(JSON.stringify({
      ok: true,
      idea,
      summary,
      internalLinks: Array.from(links.internal).sort(),
      externalLinksChecked: Array.from(links.external).sort(),
    }, null, 2))
  } finally {
    await context.close()
    await browser.close()
  }
}

main().catch((error) => {
  console.error(`FRONTEND FULL E2E FAILED: ${error.message}`)
  process.exit(1)
})
