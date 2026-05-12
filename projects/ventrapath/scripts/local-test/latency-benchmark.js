const { chromium } = require('playwright')
const { performance } = require('node:perf_hooks')

const API_BASE = process.env.VENTRAPATH_BASE || 'http://127.0.0.1:4000/api'
const FRONTEND_BASE = process.env.VENTRAPATH_FRONTEND_BASE || 'http://127.0.0.1:3000'
const USER_ID = '11111111-1111-4111-8111-111111111111'
const ROUNDS = Number(process.env.VENTRAPATH_BENCHMARK_ROUNDS || 3)

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / (values.length || 1)
}

function percentile(values, p) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1))
  return sorted[index]
}

function ms(value) {
  return Math.round(value)
}

async function request(path, method = 'GET', data) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': USER_ID,
    },
    body: data == null ? undefined : JSON.stringify(data),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok || payload.ok === false) {
    throw new Error(`HTTP ${response.status} on ${path}: ${JSON.stringify(payload)}`)
  }

  return payload.data
}

async function timeAsync(fn) {
  const started = performance.now()
  const result = await fn()
  return { durationMs: performance.now() - started, result }
}

async function benchmarkApiRound(round) {
  const idea = `VentraPath latency benchmark ${round} ${Date.now()}`
  const create = await timeAsync(() => request('/projects', 'POST', {
    name: `Benchmark ${round}`,
    idea,
    country: 'Australia',
    region: 'Western Australia',
    currencyCode: 'AUD',
    hoursPerWeek: 10,
  }))

  const project = create.result.project
  const blueprint = await timeAsync(() => request(`/projects/${project.id}/blueprint/generate`, 'POST', {}))
  const phaseDurations = {}

  for (const phaseNumber of [3, 4, 5, 6, 7, 8, 9]) {
    const phase = await timeAsync(() => request(`/projects/${project.id}/phases/${phaseNumber}/generate`, 'POST', {}))
    phaseDurations[`phase${phaseNumber}`] = ms(phase.durationMs)
  }

  return {
    round,
    projectId: project.id,
    projectName: project.name,
    idea,
    createProjectMs: ms(create.durationMs),
    blueprintGenerateMs: ms(blueprint.durationMs),
    phaseDurations,
  }
}

async function benchmarkBrowserRound(round) {
  const idea = `VentraPath browser benchmark ${round} ${Date.now()}`
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    const inputStart = performance.now()
    await page.goto(`${FRONTEND_BASE}/input`, { waitUntil: 'domcontentloaded' })
    await page.getByRole('heading', { name: /What’s the business idea\?/i }).first().waitFor({ state: 'visible', timeout: 30000 })
    await page.getByRole('textbox').fill(idea)
    await page.getByRole('button', { name: /^Continue$/ }).click()
    await page.getByRole('heading', { name: /Where will it operate\?/i }).first().waitFor({ state: 'visible', timeout: 30000 })
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'Australia' }).click()
    await page.getByRole('button', { name: /Generate Blueprint/i }).click()
    await page.waitForURL(/\/blueprint$/, { timeout: 120000 })
    await page.getByRole('heading', { name: /^The Business$/ }).first().waitFor({ state: 'visible', timeout: 30000 })
    const inputToBlueprintMs = ms(performance.now() - inputStart)

    const projectContext = await page.evaluate(() => ({
      projectId: window.localStorage.getItem('ventrapath_project_id') || window.localStorage.getItem('projectId') || '',
      projectName: window.localStorage.getItem('ventrapath_project_name') || window.localStorage.getItem('projectName') || '',
      idea: window.localStorage.getItem('ventrapath_idea') || window.localStorage.getItem('idea') || '',
      country: window.localStorage.getItem('ventrapath_country') || window.localStorage.getItem('country') || '',
      userId: window.localStorage.getItem('ventrapath_user_id') || '',
    }))

    await page.goto(`${FRONTEND_BASE}/phase9/growth`, { waitUntil: 'domcontentloaded' })
    await page.getByRole('heading', { name: /Growth/i }).first().waitFor({ state: 'visible', timeout: 60000 })
    await page.evaluate(() => {
      window.localStorage.setItem('ventrapath_last_visited_path', '/phase9/growth')
      window.localStorage.setItem('lastVisitedPath', '/phase9/growth')
    })

    const homeStart = performance.now()
    await page.goto(`${FRONTEND_BASE}/`, { waitUntil: 'domcontentloaded' })
    await page.getByRole('link', { name: /Resume Current Project|Resume Project/i }).first().waitFor({ state: 'visible', timeout: 30000 })
    const landingResumeVisibleMs = ms(performance.now() - homeStart)

    const resumeStart = performance.now()
    await page.getByRole('link', { name: /Resume Current Project|Resume Project/i }).first().click()
    await page.waitForURL(/\/phase9\/growth$/, { timeout: 60000 })
    await page.getByRole('heading', { name: /Growth/i }).first().waitFor({ state: 'visible', timeout: 30000 })
    const resumeToPhaseMs = ms(performance.now() - resumeStart)

    const reloadStart = performance.now()
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.getByRole('heading', { name: /Growth/i }).first().waitFor({ state: 'visible', timeout: 30000 })
    const phaseReloadMs = ms(performance.now() - reloadStart)

    return {
      round,
      projectId: projectContext.projectId,
      inputToBlueprintMs,
      landingResumeVisibleMs,
      resumeToPhaseMs,
      phaseReloadMs,
    }
  } finally {
    await context.close()
    await browser.close()
  }
}

async function main() {
  const apiRounds = []
  const browserRounds = []

  for (let round = 1; round <= ROUNDS; round += 1) {
    apiRounds.push(await benchmarkApiRound(round))
  }

  for (let round = 1; round <= ROUNDS; round += 1) {
    browserRounds.push(await benchmarkBrowserRound(round))
  }

  const blueprintTimes = apiRounds.map((round) => round.blueprintGenerateMs)
  const phaseStats = {}
  for (const phaseKey of ['phase3', 'phase4', 'phase5', 'phase6', 'phase7', 'phase8', 'phase9']) {
    const values = apiRounds.map((round) => round.phaseDurations[phaseKey])
    phaseStats[phaseKey] = {
      avgMs: ms(mean(values)),
      p95Ms: ms(percentile(values, 95)),
      minMs: Math.min(...values),
      maxMs: Math.max(...values),
    }
  }

  const inputToBlueprintTimes = browserRounds.map((round) => round.inputToBlueprintMs)
  const resumeTimes = browserRounds.map((round) => round.resumeToPhaseMs)
  const reloadTimes = browserRounds.map((round) => round.phaseReloadMs)
  const landingResumeTimes = browserRounds.map((round) => round.landingResumeVisibleMs)

  console.log(JSON.stringify({
    ok: true,
    rounds: ROUNDS,
    apiRounds,
    browserRounds,
    summary: {
      blueprintGenerate: {
        avgMs: ms(mean(blueprintTimes)),
        p95Ms: ms(percentile(blueprintTimes, 95)),
        minMs: Math.min(...blueprintTimes),
        maxMs: Math.max(...blueprintTimes),
      },
      phaseGeneration: phaseStats,
      browser: {
        inputToBlueprint: {
          avgMs: ms(mean(inputToBlueprintTimes)),
          p95Ms: ms(percentile(inputToBlueprintTimes, 95)),
          minMs: Math.min(...inputToBlueprintTimes),
          maxMs: Math.max(...inputToBlueprintTimes),
        },
        landingResumeVisible: {
          avgMs: ms(mean(landingResumeTimes)),
          p95Ms: ms(percentile(landingResumeTimes, 95)),
          minMs: Math.min(...landingResumeTimes),
          maxMs: Math.max(...landingResumeTimes),
        },
        resumeToPhase: {
          avgMs: ms(mean(resumeTimes)),
          p95Ms: ms(percentile(resumeTimes, 95)),
          minMs: Math.min(...resumeTimes),
          maxMs: Math.max(...resumeTimes),
        },
        phaseReload: {
          avgMs: ms(mean(reloadTimes)),
          p95Ms: ms(percentile(reloadTimes, 95)),
          minMs: Math.min(...reloadTimes),
          maxMs: Math.max(...reloadTimes),
        },
      },
      notes: [
        'inputToBlueprint includes the generating screen\'s intentional progress simulation, so it is user-visible wait rather than pure backend time.',
        'API blueprintGenerate and phaseGeneration are raw backend timings without that frontend delay.',
      ],
    },
  }, null, 2))
}

main().catch((error) => {
  console.error(`LATENCY BENCHMARK FAILED: ${error.message}`)
  process.exit(1)
})
