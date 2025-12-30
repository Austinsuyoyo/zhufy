import { test, expect } from './fixtures/editor'

test.describe('背景功能', () => {
  test('切換背景', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.panel.expectPanelTitle('背景設定')
    const bgImages = editor.page.locator('img[alt*="背景"]')
    const count = await bgImages.count()
    expect(count).toBeGreaterThan(0)
    await editor.panel.clickBackgroundImage(0)
  })
})

