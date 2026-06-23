import { test, expect } from '@playwright/test'

// GitHub Pages 404 fallback: a deep link arrives as `/?p=/editor`; the router
// rewrites it to the real path on boot. routing.ts is unit-tested — this guards
// the actual router wiring end-to-end.
test.describe('SPA 深層連結轉址', () => {
  test('?p=%2Feditor 會被轉址進入編輯器', async ({ page }) => {
    await page.goto('/?p=%2Feditor')
    await expect(page).toHaveURL(/\/editor/)
    await expect(page.getByRole('button', { name: '素材' })).toBeVisible()
  })
})
