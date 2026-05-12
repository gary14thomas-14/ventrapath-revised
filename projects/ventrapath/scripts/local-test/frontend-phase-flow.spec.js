const { test, expect } = require('@playwright/test')

const FRONTEND_BASE = process.env.VENTRAPATH_FRONTEND_BASE || 'http://127.0.0.1:3000'
const API_BASE = process.env.VENTRAPATH_BASE || 'http://127.0.0.1:4000/api'
const USER_ID = '11111111-1111-4111-8111-111111111111'

test.describe('VentraPath frontend phase flow', () => {
  test('phase 3 auto-generates, persists state, and survives phase-ladder navigation', async ({ page, request }) => {
    test.setTimeout(120000)

    const projectName = 'Frontend Phase Flow Smoke Test'
    const projectIdea = 'A guided business builder for regulated local services'
    const country = 'Australia'

    const projectResponse = await request.post(`${API_BASE}/projects`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': USER_ID,
      },
      data: {
        name: projectName,
        idea: projectIdea,
        country,
        region: 'Western Australia',
        currencyCode: 'AUD',
        hoursPerWeek: 10,
      },
    })

    expect(projectResponse.ok()).toBeTruthy()
    const projectPayload = await projectResponse.json()
    const projectId = projectPayload.data.project.id

    const blueprintResponse = await request.post(`${API_BASE}/projects/${projectId}/blueprint/generate`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': USER_ID,
      },
      data: {},
    })

    expect(blueprintResponse.ok()).toBeTruthy()

    await page.addInitScript(({ projectId: id, projectName: name, projectIdea: idea, country: storedCountry }) => {
      window.localStorage.setItem('projectId', id)
      window.localStorage.setItem('projectName', name)
      window.localStorage.setItem('idea', idea)
      window.localStorage.setItem('country', storedCountry)
    }, { projectId, projectName, projectIdea, country })

    await page.goto(`${FRONTEND_BASE}/phase3/finance`, { waitUntil: 'domcontentloaded' })

    await expect(page.getByRole('heading', { name: /Finance/i }).first()).toBeVisible({ timeout: 30000 })
    await expect(page.getByText('Phase ladder')).toBeVisible({ timeout: 30000 })

    const notes = page.locator('textarea').first()
    const noteText = `Frontend persistence note ${Date.now()}`
    await notes.fill(noteText)

    const firstCheckbox = page.locator('input[type="checkbox"]').first()
    await firstCheckbox.check()

    const savingIndicator = page.getByText(/Saving/)
    await expect(savingIndicator).toBeVisible({ timeout: 10000 })
    await expect(savingIndicator).toBeHidden({ timeout: 30000 })

    await page.getByRole('link', { name: /Protection/ }).click()
    await expect(page).toHaveURL(/\/phase4\/protection/)
    await expect(page.getByRole('heading', { name: /Protection/i }).first()).toBeVisible({ timeout: 30000 })

    await page.getByRole('link', { name: /Finance/ }).click()
    await expect(page).toHaveURL(/\/phase3\/finance/)
    await expect(page.getByRole('heading', { name: /Finance/i }).first()).toBeVisible({ timeout: 30000 })

    await expect(page.locator('textarea').first()).toHaveValue(noteText, { timeout: 30000 })
    await expect(page.locator('input[type="checkbox"]').first()).toBeChecked({ timeout: 30000 })

    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: /Finance/i }).first()).toBeVisible({ timeout: 30000 })
    await expect(page.locator('textarea').first()).toHaveValue(noteText, { timeout: 30000 })
    await expect(page.locator('input[type="checkbox"]').first()).toBeChecked({ timeout: 30000 })
  })
})
