import { test, expect } from './fixtures/editor'

test.describe('文字功能', () => {
  test('新增文字', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.panel.clickButton('新增文字')
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })
  })

  test('文字選擇和編輯', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.clickCanvasCenter()
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const hasActiveObject = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      return !!store?.canvas?.getActiveObject()
    })
    expect(hasActiveObject).toBe(true)

    await editor.panel.fillText('測試文字')
    await editor.panel.expectTextareaValue('測試文字')
  })

  test('隨機金句功能', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.panel.clickButton('隨機金句')
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })
  })

  test('文字模板應用', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.panel.clickButton('標題')
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })
  })
})
