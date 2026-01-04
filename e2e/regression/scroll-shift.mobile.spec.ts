import { test, expect } from '../fixtures/editor'

test.describe('手機版點擊文字不應導致畫面位移', () => {
  test('fabric textarea 實際位置不應超出視口寬度', async ({ editor, page }) => {
    const box = await editor.getCanvasBoundingBox()
    const centerX = box.x + box.width / 2
    const centerY = box.y + box.height / 2

    await page.touchscreen.tap(centerX, centerY)
    await page.waitForTimeout(50)
    await page.touchscreen.tap(centerX, centerY)
    await page.waitForTimeout(500)

    const result = await page.evaluate(() => {
      const textarea = document.querySelector('textarea[name="fabricTextarea"]') as HTMLElement
      if (!textarea) return { exists: false, computedLeft: 0, viewportWidth: window.innerWidth }
      const computed = window.getComputedStyle(textarea)
      const computedLeft = parseFloat(computed.left) || 0
      return { exists: true, computedLeft, viewportWidth: window.innerWidth }
    })

    expect(result.exists).toBe(true)
    expect(result.computedLeft).toBeLessThanOrEqual(result.viewportWidth)
  })
})

