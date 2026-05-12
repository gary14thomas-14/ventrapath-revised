const { chromium } = require('playwright')

const FRONTEND_BASE = process.env.VENTRAPATH_FRONTEND_BASE || 'http://127.0.0.1:3000'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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

async function openInput(page) {
  await page.goto(`${FRONTEND_BASE}/input`, { waitUntil: 'domcontentloaded' })
  await waitForHeading(page, /What’s the business idea\?/i)
}

async function createProjectThroughUi(page, idea) {
  await openInput(page)
  await page.getByRole('textbox').fill(idea)
  await clickAndWait(page, page.getByRole('button', { name: /^Continue$/ }), /\/input$/, /Where will it operate\?/i)
  await page.getByRole('combobox').click()
  await page.getByRole('option', { name: 'Australia' }).click()
  await page.getByRole('button', { name: /Generate Blueprint/i }).click()
  await page.waitForURL(/\/generating$/, { timeout: 10000 })
  await page.waitForURL(/\/blueprint$/, { timeout: 90000 })
  await waitForHeading(page, /^The Business$/)
  const blueprintSections = [
    { href: '/market', heading: /^Market$/ },
    { href: '/monetisation', heading: /^Monetisation$/ },
    { href: '/execution', heading: /^Execution$/ },
    { href: '/legal', heading: /^Legal$/ },
    { href: '/website', heading: /^Website$/ },
    { href: '/risks', heading: /^Risks$/ },
  ]
  for (const section of blueprintSections) {
    await clickAndWait(page, page.locator(`a[href="${section.href}"]`).last(), new RegExp(`${escapeRegex(section.href)}$`), section.heading)
  }
  await clickAndWait(page, page.getByRole('link', { name: /Start Phase 1: Brand/i }).first(), /\/phase1\/brand$/, /^Brand$/)
  await clickAndWait(page, page.locator('a[href="/phase2/legal"]').last(), /\/phase2\/legal$/, /^Legal$/)
  await clickAndWait(page, page.locator('a[href="/phase3/finance"]').last(), /\/phase3\/finance$/, /^Finance$/)
}

async function fillPhaseState(page, phase, noteText) {
  const firstStep = page.locator('section.rounded-3xl').first()
  await firstStep.waitFor({ state: 'visible', timeout: 30000 })

  const noteBox = firstStep.locator('textarea').first()
  await noteBox.waitFor({ state: 'visible', timeout: 30000 })
  await noteBox.fill(noteText)

  const completeButton = firstStep.getByRole('button', { name: /Mark complete|Completed/i }).first()
  await completeButton.click()
  await page.waitForTimeout(250)
}

async function verifyPhaseState(page, phase, expectedNote) {
  await page.waitForURL(new RegExp(`${escapeRegex(phase.path)}$`), { timeout: 60000 })
  await waitForHeading(page, phase.heading, 60000)
  const firstStep = page.locator('section.rounded-3xl').first()
  const noteBox = firstStep.locator('textarea').first()
  await noteBox.waitFor({ state: 'visible', timeout: 30000 })
  const actualValue = await noteBox.inputValue()
  assert(actualValue === expectedNote, `${phase.path} lost note state. Expected "${expectedNote}" got "${actualValue}"`)
  const buttonLabel = await firstStep.getByRole('button', { name: /Mark complete|Completed/i }).first().textContent()
  assert(/Completed/i.test(buttonLabel || ''), `${phase.path} lost completion state`) 
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()
  const idea = `VentraPath persistence torture ${Date.now()}`

  const phases = [
    { path: '/phase3/finance', heading: /^Finance$/ },
    { path: '/phase4/protection', heading: /^Protection$/ },
    { path: '/phase5/infrastructure', heading: /^Infrastructure$/ },
    { path: '/phase6/marketing', heading: /^Marketing$/ },
    { path: '/phase7/operations', heading: /^Operations$/ },
    { path: '/phase8/sales', heading: /^Sales$/ },
    { path: '/phase9/growth', heading: /Growth/i },
  ]

  const notesByPhase = Object.fromEntries(phases.map((phase, index) => [phase.path, `Persistence note ${index + 3} :: ${Date.now()}`]))
  const summary = {
    projectCreated: false,
    phaseWrites: [],
    homeResumeChecks: [],
    reloadChecks: [],
    revisitChecks: [],
  }

  try {
    await createProjectThroughUi(page, idea)
    summary.projectCreated = true

    for (let index = 0; index < phases.length; index += 1) {
      const phase = phases[index]
      await page.waitForURL(new RegExp(`${escapeRegex(phase.path)}$`), { timeout: 60000 })
      await waitForHeading(page, phase.heading, 60000)
      await fillPhaseState(page, phase, notesByPhase[phase.path])
      summary.phaseWrites.push(phase.path)

      if (phase.path === '/phase5/infrastructure' || phase.path === '/phase7/operations') {
        await page.reload({ waitUntil: 'domcontentloaded' })
        await verifyPhaseState(page, phase, notesByPhase[phase.path])
        summary.reloadChecks.push(phase.path)
      }

      if (phase.path === '/phase6/marketing' || phase.path === '/phase8/sales') {
        await clickAndWait(page, page.getByRole('link', { name: /^Home$/ }).first(), /\/$/, /business plan you can actually act on/i)
        await page.getByText(/Current local project ready to resume/i).waitFor({ state: 'visible', timeout: 30000 })
        const expectedPath = phase.path
        await clickAndWait(page, page.getByRole('link', { name: /Resume Current Project|Resume Project/i }).first(), new RegExp(`${escapeRegex(expectedPath)}$`), phase.heading)
        await verifyPhaseState(page, phase, notesByPhase[phase.path])
        summary.homeResumeChecks.push(phase.path)
      }

      const nextPhase = phases[index + 1]
      if (nextPhase) {
        await clickAndWait(page, page.locator(`a[href="${nextPhase.path}"]`).last(), new RegExp(`${escapeRegex(nextPhase.path)}$`), nextPhase.heading)
      }
    }

    await page.reload({ waitUntil: 'domcontentloaded' })
    await verifyPhaseState(page, phases[phases.length - 1], notesByPhase[phases[phases.length - 1].path])
    summary.reloadChecks.push(phases[phases.length - 1].path)

    for (const phase of phases) {
      await page.goto(`${FRONTEND_BASE}${phase.path}`, { waitUntil: 'domcontentloaded' })
      await verifyPhaseState(page, phase, notesByPhase[phase.path])
      summary.revisitChecks.push(phase.path)
    }

    console.log(JSON.stringify({
      ok: true,
      idea,
      summary,
      notesByPhase,
    }, null, 2))
  } finally {
    await context.close()
    await browser.close()
  }
}

main().catch((error) => {
  console.error(`PHASE PERSISTENCE TORTURE FAILED: ${error.message}`)
  process.exit(1)
})
