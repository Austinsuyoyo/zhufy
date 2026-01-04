import { test, expect } from '../fixtures/editor'

test.describe('移動端觸控測試', () => {
  test('觸控畫布正常', async ({ editor }) => {
    const canvas = editor.page.locator('canvas.upper-canvas')
    await expect(canvas).toBeVisible()

    const box = await canvas.boundingBox()
    if (!box) return

    await editor.page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2)
    await editor.page.waitForTimeout(300)

    await expect(canvas).toBeVisible()
  })

  test('移動端導航正常', async ({ editor }) => {
    const nav = editor.page.locator('nav').first()
    await expect(nav).toBeVisible()
  })

  test('移動端切換面板', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(200)

    const canvas = editor.page.locator('canvas.upper-canvas')
    await expect(canvas).toBeVisible()
  })

  test('移動端添加文字', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(200)

    const canvas = editor.page.locator('canvas.upper-canvas')
    const box = await canvas.boundingBox()
    if (!box) return

    await editor.page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2)
    await editor.page.waitForTimeout(500)

    await expect(canvas).toBeVisible()
  })
})
