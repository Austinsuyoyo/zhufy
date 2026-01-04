import { test, expect } from '../fixtures/editor'

test.describe('鍵盤快捷鍵', () => {
  const getObjectCount = (page: any) =>
    page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      return store?.canvas?.getObjects()?.length || 0
    })

  test('Delete 鍵刪除物件', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)

    const initialCount = await getObjectCount(editor.page)
    expect(initialCount).toBeGreaterThan(0)

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      if (obj) {
        obj.exitEditing?.()
        store.canvas.renderAll()
      }
    })
    await editor.page.waitForTimeout(200)

    await editor.page.keyboard.press('Delete')
    await editor.page.waitForTimeout(300)

    const newCount = await getObjectCount(editor.page)
    expect(newCount).toBe(initialCount - 1)
  })

  test('Ctrl+D 複製物件', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)

    const initialCount = await getObjectCount(editor.page)

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      if (obj) {
        obj.exitEditing?.()
        store.canvas.renderAll()
      }
    })
    await editor.page.waitForTimeout(200)

    await editor.clickCanvasCenter()
    await editor.page.waitForTimeout(300)

    await editor.page.evaluate(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'd',
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      })
      document.dispatchEvent(event)
    })
    await editor.page.waitForTimeout(1000)

    const newCount = await getObjectCount(editor.page)
    expect(newCount).toBe(initialCount + 1)
  })

  test('在輸入框中時不應觸發刪除快捷鍵', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.clickCanvasCenter()
    await editor.page.waitForTimeout(500)

    const initialCount = await getObjectCount(editor.page)

    const textarea = editor.panel.getTextarea()
    await textarea.focus()
    await textarea.fill('測試文字')
    await editor.page.keyboard.press('Delete')
    await editor.page.waitForTimeout(300)

    const newCount = await getObjectCount(editor.page)
    expect(newCount).toBe(initialCount)
  })
})
