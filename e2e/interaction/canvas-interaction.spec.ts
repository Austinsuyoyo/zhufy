import { test, expect } from '../fixtures/editor'

test.describe('畫布互動', () => {
  test('物件拖動功能', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.clickCanvasCenter()
    await editor.page.waitForTimeout(500)

    const getObjectPosition = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const obj = store?.canvas?.getActiveObject()
        if (!obj) return null
        return { left: obj.left, top: obj.top }
      })

    const initialPosition = await getObjectPosition()
    expect(initialPosition).not.toBeNull()

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      if (!obj) return
      obj.set({ left: (obj.left || 0) + 50, top: (obj.top || 0) + 50 })
      obj.setCoords()
      store.canvas.renderAll()
    })

    await editor.page.waitForTimeout(300)

    const newPosition = await getObjectPosition()
    expect(newPosition).not.toBeNull()
    expect(newPosition!.left).toBeCloseTo(initialPosition!.left + 50, 0)
    expect(newPosition!.top).toBeCloseTo(initialPosition!.top + 50, 0)
  })

  test('點擊空白處取消選擇', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.clickCanvasCenter()
    await editor.page.waitForTimeout(500)

    const hasActiveObject = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        return !!store?.canvas?.getActiveObject()
      })

    expect(await hasActiveObject()).toBe(true)

    const canvas = await editor.getCanvasBoundingBox()
    await editor.page.mouse.click(canvas.x + 10, canvas.y + 10)
    await editor.page.waitForTimeout(300)

    expect(await hasActiveObject()).toBe(false)
  })

  test('縮放功能正常', async ({ editor }) => {
    const getZoomLevel = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        return store?.zoomLevel
      })

    const initialZoom = await getZoomLevel()

    await editor.toolbar.clickZoomIn()
    await editor.page.waitForTimeout(300)

    const zoomAfterIn = await getZoomLevel()
    expect(zoomAfterIn).toBeGreaterThan(initialZoom)

    await editor.toolbar.clickZoomOut()
    await editor.page.waitForTimeout(300)

    const zoomAfterOut = await getZoomLevel()
    expect(zoomAfterOut).toBeLessThan(zoomAfterIn)
  })

  test('選擇物件後 activeObject 應更新', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)

    const activeObject = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      return store?.activeObject?.type
    })

    expect(activeObject).toBe('i-text')
  })
})

test.describe('移動端縮放滑桿', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('移動端縮放滑桿應可見', async ({ editor }) => {
    await editor.page.waitForTimeout(500)

    const mobileZoomBar = editor.page.locator('div.fixed.bottom-20.left-2.right-2').first()
    await expect(mobileZoomBar).toBeVisible()
  })

  test('移動端縮放滑桿調整', async ({ editor }) => {
    await editor.page.waitForTimeout(500)

    const getZoomLevel = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        return store?.zoomLevel
      })

    const slider = editor.page.locator('input[type="range"]').first()
    await slider.fill('2')
    await editor.page.waitForTimeout(300)

    const zoomLevel = await getZoomLevel()
    expect(zoomLevel).toBe(2)
  })
})
