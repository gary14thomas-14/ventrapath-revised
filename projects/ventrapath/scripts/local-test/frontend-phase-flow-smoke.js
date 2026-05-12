const { chromium } = require('playwright')

const FRONTEND_BASE = process.env.VENTRAPATH_FRONTEND_BASE || 'http://127.0.0.1:3000'
const API_BASE = process.env.VENTRAPATH_BASE || 'http://127.0.0.1:4000/api'
const USER_ID = '11111111-1111-4111-8111-111111111111'

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
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

  const payload = await response.json()

  if (!response.ok || !payload.ok) {
    throw new Error(`HTTP ${response.status} on ${path}: ${JSON.stringify(payload)}`)
  }

  return payload.data
}

async function main() {
  const projectName = 'Frontend Phase Flow Smoke Test'
  const projectIdea = 'A guided business builder for regulated local services'
  const country = 'Australia'

  const project = (await request('/projects', 'POST', {
    name: projectName,
    idea: projectIdea,
    country,
    region: 'Western Australia',
    currencyCode: 'AUD',
    hoursPerWeek: 10,
  })).project

  const projectId = project.id
  await request(`/projects/${projectId}/blueprint/generate`, 'POST', {})

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.addInitScript(({ userId, projectId: id, name, idea, storedCountry }) => {
    window.localStorage.setItem('ventrapath_user_id', userId)
    window.localStorage.setItem('ventrapath_project_id', id)
    window.localStorage.setItem('ventrapath_project_name', name)
    window.localStorage.setItem('ventrapath_idea', idea)
    window.localStorage.setItem('ventrapath_country', storedCountry)
    window.localStorage.setItem('projectId', id)
    window.localStorage.setItem('projectName', name)
    window.localStorage.setItem('idea', idea)
    window.localStorage.setItem('country', storedCountry)
  }, { userId: USER_ID, projectId, name: projectName, idea: projectIdea, storedCountry: country })

  try {
    await page.goto(`${FRONTEND_BASE}/phase3/finance`, { waitUntil: 'domcontentloaded' })
    await page.getByRole('heading', { name: /Finance/i }).first().waitFor({ state: 'visible', timeout: 30000 })

    try {
      await page.getByText('Phase ladder').waitFor({ state: 'visible', timeout: 30000 })
    } catch (error) {
      const bodyText = await page.locator('body').innerText()
      throw new Error(`Phase ladder did not appear. URL=${page.url()} BODY=${bodyText.slice(0, 2000)}`)
    }

    const noteText = `Frontend persistence note ${Date.now()}`
    const notes = page.locator('textarea').first()
    await notes.fill(noteText)

    const firstCheckbox = page.locator('input[type="checkbox"]').first()
    await firstCheckbox.check()

    await page.waitForTimeout(1500)

    await page.getByRole('link', { name: /^4 Protection$/ }).click()
    await page.waitForURL(/\/phase4\/protection/)
    await page.getByRole('heading', { name: /Protection/i }).first().waitFor({ state: 'visible', timeout: 30000 })

    await page.getByRole('link', { name: /^3 Finance$/ }).click()
    await page.waitForURL(/\/phase3\/finance/)
    await page.getByRole('heading', { name: /Finance/i }).first().waitFor({ state: 'visible', timeout: 30000 })

    await page.locator('textarea').first().waitFor({ state: 'visible', timeout: 30000 })
    assert((await page.locator('textarea').first().inputValue()) === noteText, 'Finance notes should persist after ladder navigation')
    assert(await page.locator('input[type="checkbox"]').first().isChecked(), 'Finance checklist state should persist after ladder navigation')

    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.getByRole('heading', { name: /Finance/i }).first().waitFor({ state: 'visible', timeout: 30000 })
    assert((await page.locator('textarea').first().inputValue()) === noteText, 'Finance notes should persist after reload')
    assert(await page.locator('input[type="checkbox"]').first().isChecked(), 'Finance checklist state should persist after reload')

    console.log(JSON.stringify({
      ok: true,
      projectId,
      checks: {
        frontendPhase3Load: true,
        phaseLadderNavigation: true,
        notesPersistAfterNavigation: true,
        checklistPersistAfterNavigation: true,
        notesPersistAfterReload: true,
        checklistPersistAfterReload: true,
      },
    }, null, 2))
  } finally {
    await context.close()
    await browser.close()
  }
}

main().catch((error) => {
  console.error(`FRONTEND FLOW SMOKE FAILED: ${error.message}`)
  process.exit(1)
})
