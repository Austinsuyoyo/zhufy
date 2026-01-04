import { test, expect } from '../fixtures/editor'

test.describe('響應式佈局', () => {
  test('視窗大小變化', async ({ editor, page }) => {
    await editor.sidebar.expectDesktopLayout()

    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)

    await editor.sidebar.expectMobileLayout()
    await editor.panel.expectMobileLayout()

    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.waitForTimeout(500)

    await editor.sidebar.expectDesktopLayout()
    await editor.panel.expectDesktopLayout()
  })

  test('橫屏/豎屏切換', async ({ editor, page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)

    await editor.sidebar.expectMobileLayout()

    await page.setViewportSize({ width: 667, height: 375 })
    await page.waitForTimeout(500)

    const isMobile = await page.evaluate(() => window.innerWidth < 768)
    expect(isMobile).toBe(true)
  })
})


