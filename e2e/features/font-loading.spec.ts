import { test, expect } from '@playwright/test'

// Guards the font lazy-load perf optimization: the landing must NOT pull the
// CJK Google Fonts (it renders in the system font — loading them tanked its
// Lighthouse score), while the editor must inject the stylesheet for the text tool.
test.describe('字型只在編輯器載入', () => {
  // preconnect + stylesheet both point at fonts.* — match either for "any request"
  const anyFontLink = (page: any) => page.locator('link[href*="fonts.g"]')
  // the actual font stylesheet carries the family list
  const fontSheet = (page: any) => page.locator('link[href*="fonts.googleapis.com/css2"]')

  test('首頁不載入 CJK Google Fonts', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)
    expect(await anyFontLink(page).count()).toBe(0)
  })

  test('編輯器會注入 CJK 字型(含 Zen Maru Gothic)', async ({ page }) => {
    await page.goto('/editor')
    await expect.poll(() => fontSheet(page).count(), { timeout: 8000 }).toBeGreaterThan(0)
    const href = await fontSheet(page).first().getAttribute('href')
    expect(href).toContain('Zen+Maru+Gothic')
  })
})
