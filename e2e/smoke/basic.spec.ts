import { test, expect } from '../fixtures/editor'

test.describe('基本功能', () => {
  test('頁面應正確載入並顯示初始內容', async ({ editor, deviceType }) => {
    if (deviceType === 'desktop') {
      await expect(editor.page.locator('h1').first()).toContainText('長輩圖產生器')
    } else {
      await expect(editor.page.locator('h1').first()).toContainText('長輩圖')
    }
    await expect(editor.canvas).toBeVisible()
    await expect(editor.toolbar.getZoomText()).toBeVisible()
  })

  test('Canvas 應顯示', async ({ editor }) => {
    await expect(editor.canvas).toBeVisible()
  })
})

