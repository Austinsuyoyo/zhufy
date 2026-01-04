import { test, expect } from '../fixtures/editor'
import { expectDesktopLayout } from '../utils/device'

test.describe('基本功能 - Desktop', () => {

  test('頁面應正確載入並顯示初始內容', async ({ editor, page }) => {
    await expectDesktopLayout(page)
    await expect(editor.page.locator('h1').first()).toContainText('長輩圖產生器')
    await expect(editor.canvas).toBeVisible()
    await expect(editor.toolbar.getZoomText()).toBeVisible()
  })

  test('Canvas 應顯示', async ({ editor }) => {
    await expect(editor.canvas).toBeVisible()
  })

  test('Sidebar 應為桌面佈局', async ({ editor }) => {
    await editor.sidebar.expectDesktopLayout()
  })

  test('Panel 應為桌面佈局', async ({ editor }) => {
    await editor.sidebar.clickTab('bg')
    await editor.page.waitForTimeout(300)
    await editor.panel.expectDesktopLayout()
  })

  test('Zoom bar 應為桌面樣式', async ({ editor }) => {
    await editor.toolbar.expectDesktopZoomBar()
  })
})

