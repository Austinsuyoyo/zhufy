import { test } from '../fixtures/editor'

test.describe('側邊欄功能 - Mobile', () => {
  test('切換到背景面板', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectPanelTitle('背景設定')
    await editor.panel.expectMobileLayout()
  })

  test('切換到文字面板', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectPanelTitle('文字編輯')
    await editor.panel.expectMobileLayout()
  })

  test('切換到裝飾面板', async ({ editor }) => {
    await editor.sidebar.clickDecor()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectPanelTitle('裝飾圖庫')
    await editor.panel.expectMobileLayout()
  })

  test('切換到裁切面板', async ({ editor }) => {
    await editor.sidebar.clickCrop()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectPanelTitle('圖片裁切')
    await editor.panel.expectMobileLayout()
  })

  test('點擊相同 tab 應切換面板顯示', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectVisible()
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectHidden()
  })

  test('應可通過關閉按鈕關閉面板', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectVisible()
    await editor.panel.closeMobile()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectHidden()
  })
})
