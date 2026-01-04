import { test, expect } from '../fixtures/editor'
import { expectMobileLayout } from '../utils/device'

test.describe('基本功能 - Mobile', () => {

  test('頁面應正確載入並顯示初始內容', async ({ editor, page }) => {
    await expectMobileLayout(page)
    await expect(editor.page.locator('h1').first()).toContainText('長輩圖')
    await expect(editor.canvas).toBeVisible()
  })

  test('Canvas 應顯示', async ({ editor }) => {
    await expect(editor.canvas).toBeVisible()
  })

  test('Sidebar 應為移動端佈局', async ({ editor }) => {
    await editor.sidebar.expectMobileLayout()
  })

  test('Panel 應為移動端佈局', async ({ editor }) => {
    await editor.sidebar.clickTab('bg')
    await editor.page.waitForTimeout(300)
    await editor.panel.expectMobileLayout()
  })

  test('Panel 應可關閉', async ({ editor }) => {
    await editor.sidebar.clickTab('bg')
    await editor.page.waitForTimeout(300)
    await editor.panel.expectVisible()
    await editor.panel.closeMobile()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectHidden()
  })

  test('Zoom bar 應為移動端樣式', async ({ editor }) => {
    await editor.sidebar.clickTab('bg')
    await editor.page.waitForTimeout(300)
    await editor.panel.closeMobile()
    await editor.page.waitForTimeout(300)
    await editor.toolbar.expectMobileZoomBar()
  })
})

