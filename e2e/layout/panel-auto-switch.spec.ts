import { test, expect } from '../fixtures/editor'

test.describe('面板自動切換', () => {
  test('activeTab 狀態應與面板標題對應', async ({ editor }) => {
    const getActiveTab = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        return store?.activeTab
      })

    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)
    expect(await getActiveTab()).toBe('bg')

    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    expect(await getActiveTab()).toBe('text')

    await editor.sidebar.clickDecor()
    await editor.page.waitForTimeout(300)
    expect(await getActiveTab()).toBe('decor')

    await editor.sidebar.clickCrop()
    await editor.page.waitForTimeout(300)
    expect(await getActiveTab()).toBe('crop')
  })

  test('新增文字後應顯示 textarea', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)

    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })
  })

  test('隨機金句後應顯示 textarea', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('隨機金句')
    await editor.page.waitForTimeout(500)

    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })
  })

  test('點擊畫布中心選擇文字後應顯示 textarea', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.clickCanvasCenter()
    await editor.page.waitForTimeout(500)

    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })
  })
})
