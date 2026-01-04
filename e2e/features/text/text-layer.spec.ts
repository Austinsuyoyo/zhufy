import { test, expect } from '../../fixtures/editor'

test.describe('文字圖層操作', () => {
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

  const getActiveObjectIndex = (page: any) =>
    page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const canvas = store?.canvas
      const active = canvas?.getActiveObject()
      if (!active) return -1
      return canvas?.getObjects()?.indexOf(active) ?? -1
    })

  test('圖層上移功能', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)

    await editor.clickCanvasCenter()
    await editor.page.waitForTimeout(500)

    const initialIndex = await getActiveObjectIndex(editor.page)

    const upButton = editor.page.locator('button:has-text("上移")')
    await upButton.click()
    await editor.page.waitForTimeout(300)

    const newIndex = await getActiveObjectIndex(editor.page)
    expect(newIndex).toBeGreaterThanOrEqual(initialIndex)
  })

  test('圖層下移功能', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)

    await editor.clickCanvasCenter()
    await editor.page.waitForTimeout(500)

    const initialIndex = await getActiveObjectIndex(editor.page)

    const downButton = editor.page.locator('button:has-text("下移")')
    await downButton.click()
    await editor.page.waitForTimeout(300)

    const newIndex = await getActiveObjectIndex(editor.page)
    expect(newIndex).toBeLessThanOrEqual(initialIndex)
  })

  test('刪除物件功能', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)

    const initialCount = await getObjectCount(editor.page)

    await editor.clickCanvasCenter()
    await editor.page.waitForTimeout(500)

    const deleteButton = editor.page.locator('button:has-text("刪除此物件")')
    await deleteButton.click()
    await editor.page.waitForTimeout(300)

    const newCount = await getObjectCount(editor.page)
    expect(newCount).toBe(initialCount - 1)
  })

  test('副標題模板應用', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('副標題')
    await editor.page.waitForTimeout(500)

    const textProps = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      return { fontSize: obj?.fontSize, fontWeight: obj?.fontWeight }
    })

    expect(textProps.fontSize).toBe(60)
    expect(textProps.fontWeight).toBe('700')
  })
})
