import { test, expect } from './fixtures/editor'
import { simulateCanvasWheelZoom, dragCanvasCorner, dragObjectCorner } from './utils/helpers'

test.describe('Canvas 操作', () => {
  test('Zoom 按鈕功能', async ({ editor }) => {
    await editor.toolbar.expectZoom('Zoom: 100%')

    await editor.toolbar.clickZoomIn()
    await editor.toolbar.expectZoom(/Zoom: 1[0-9]{2}%/)

    await editor.toolbar.clickZoomOut()
    await editor.toolbar.expectZoom('Zoom: 100%')
  })

  test('Ctrl + 滾輪縮放功能', async ({ editor }) => {
    const canvas = await editor.getCanvasBoundingBox()
    await simulateCanvasWheelZoom(editor.page, canvas, -100)
    await editor.toolbar.expectZoom(/Zoom: 1[0-9]{2}%/)
  })

  test('對象角點調整大小功能', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.clickCanvasCenter()
    await editor.page.waitForTimeout(500)

    const getObjectSize = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const obj = store?.canvas?.getActiveObject()
        if (!obj) return null
        return { width: obj.getScaledWidth(), height: obj.getScaledHeight() }
      })

    const sizeBefore = await getObjectSize()
    expect(sizeBefore).not.toBeNull()

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      if (!obj) return
      obj.set({ scaleX: (obj.scaleX || 1) * 0.9, scaleY: (obj.scaleY || 1) * 0.9 })
      obj.setCoords()
      store.canvas.renderAll()
    })

    await editor.page.waitForTimeout(300)

    const sizeAfter = await getObjectSize()
    expect(sizeAfter).not.toBeNull()
    expect(sizeAfter!.width).toBeLessThan(sizeBefore!.width)
    expect(sizeAfter!.height).toBeLessThan(sizeBefore!.height)
  })
})
