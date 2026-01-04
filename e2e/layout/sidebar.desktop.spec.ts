import { test, expect } from '../fixtures/editor'

test.describe('側邊欄功能 - Desktop', () => {
  test('切換到背景面板', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectPanelTitle('背景設定')
    await editor.panel.expectDesktopLayout()
  })

  test('切換到文字面板', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectPanelTitle('文字編輯')
    await editor.panel.expectDesktopLayout()
  })

  test('切換到裝飾面板', async ({ editor }) => {
    await editor.sidebar.clickDecor()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectPanelTitle('裝飾圖庫')
    await editor.panel.expectDesktopLayout()
  })

  test('切換到裁切面板', async ({ editor }) => {
    await editor.sidebar.clickCrop()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectPanelTitle('圖片裁切')
    await editor.panel.expectDesktopLayout()
  })

  test('點擊相同 tab 應切換面板顯示', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(500)
    await editor.panel.expectVisible()

    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(500)

    await editor.page.waitForFunction(
      () => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        return store?.panelVisible === false
      },
      { timeout: 5000 },
    )

    await editor.panel.expectHidden()
  })
})
