import { test, expect } from '@playwright/test'

// Entry flow had no e2e guard (smoke tests go straight to /editor). The landing
// was redesigned, so guard: it loads and the CTA navigates into the editor.
test.describe('首頁進入編輯器', () => {
  test('首頁載入並可點「開始製作」進入編輯器', async ({ page }) => {
    await page.goto('/')

    const cta = page.getByRole('link', { name: '開始製作' }).first()
    await expect(cta).toBeVisible()

    await cta.click()

    await expect(page).toHaveURL(/\/editor/)
    await expect(page.getByRole('button', { name: '素材' })).toBeVisible()
  })
})
