import { expect, test } from '@playwright/test'

test.describe('Flight Readiness Dashboard', () => {
  test('displays the initial mission summary', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', {
        name: 'Flight Readiness Dashboard',
      }),
    ).toBeVisible()

    const summary = page.getByRole('region', {
      name: 'Mission summary',
    })

    await expect(
      summary.locator('article').filter({
        hasText: 'Total missions',
      }),
    ).toContainText('3')

    await expect(
      summary.locator('article').filter({
        hasText: 'Ready',
      }),
    ).toContainText('1')

    await expect(
      summary.locator('article').filter({
        hasText: 'Blocked',
      }),
    ).toContainText('1')

    await expect(
      summary.locator('article').filter({
        hasText: 'Draft',
      }),
    ).toContainText('1')
  })

  test('creates a ready mission and updates the dashboard', async ({
    page,
  }) => {
    await page.goto('/')

    await page.getByRole('button', {
      name: 'Create mission',
    }).click()

    const form = page.getByRole('region', {
      name: 'Create flight mission',
    })

    await form.getByLabel('Flight number').fill('FX500')
    await form.getByLabel('Aircraft registration').fill('F-NEW')
    await form.getByLabel('Departure airport').fill('CDG')
    await form.getByLabel('Destination airport').fill('NCE')
    await form
      .getByLabel('Scheduled date')
      .fill('2030-07-22T09:30')

    await form.getByLabel('Documents verified').check()
    await form.getByLabel('Fuel confirmed').check()
    await form.getByLabel('Maintenance released').check()
    await form.getByLabel('Weather reviewed').check()

    await form.getByRole('button', {
      name: 'Create mission',
    }).click()

    const missionCard = page.locator('article').filter({
      has: page.getByRole('heading', {
        name: 'FX500',
      }),
    })

    await expect(missionCard).toBeVisible()
    await expect(missionCard).toContainText('Ready')
    await expect(missionCard).toContainText('CDG')
    await expect(missionCard).toContainText('NCE')
    await expect(missionCard).toContainText('4 / 4')

    const summary = page.getByRole('region', {
      name: 'Mission summary',
    })

    await expect(
      summary.locator('article').filter({
        hasText: 'Total missions',
      }),
    ).toContainText('4')

    await expect(
      summary.locator('article').filter({
        hasText: 'Ready',
      }),
    ).toContainText('2')

    await expect(
      page.getByRole('region', {
        name: 'Create flight mission',
      }),
    ).toBeHidden()
  })
})
