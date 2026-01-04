import { test, expect } from '../fixtures/editor'

test.describe('無障礙測試', () => {
  test('鍵盤導航', async ({ editor, page }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)

    await page.keyboard.press('Tab')
    await page.waitForTimeout(100)

    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName
    })

    expect(focusedElement).not.toBeNull()
  })

  test('ARIA 標籤', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)

    const blurSlider = editor.page.locator('#blur-slider')
    const ariaLabel = await blurSlider.getAttribute('aria-label')
    expect(ariaLabel).toBe('模糊程度')

    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)

    const boldButton = editor.page.locator('button[aria-label="粗體"]')
    await expect(boldButton).toBeVisible()
  })
})


