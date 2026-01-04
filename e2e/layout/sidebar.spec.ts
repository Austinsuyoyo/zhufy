import { test } from '../fixtures/editor'

test.describe('側邊欄功能', () => {
  test('切換到背景面板', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.panel.expectPanelTitle('背景設定')
  })

  test('切換到文字面板', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.panel.expectPanelTitle('文字編輯')
  })

  test('切換到裝飾面板', async ({ editor }) => {
    await editor.sidebar.clickDecor()
    await editor.panel.expectPanelTitle('裝飾圖庫')
  })

  test('切換到裁切面板', async ({ editor }) => {
    await editor.sidebar.clickCrop()
    await editor.panel.expectPanelTitle('圖片裁切')
  })
})

