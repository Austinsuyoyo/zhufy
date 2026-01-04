import { test, expect } from '../fixtures/editor'

test.describe('裁切功能', () => {
  const getCanvasSize = (page: any) =>
    page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const canvas = store?.canvas
      if (!canvas) return null
      return { width: canvas.width, height: canvas.height }
    })

  const getCropRect = (page: any) =>
    page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const rect = store?.cropRect
      if (!rect) return null
      const topLeft = rect.getPositionByOrigin('left', 'top')
      return {
        left: topLeft.x,
        top: topLeft.y,
        width: rect.getScaledWidth(),
        height: rect.getScaledHeight(),
      }
    })

  const getObjectsSelectable = (page: any) =>
    page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const objects = store?.canvas?.getObjects() || []
      return objects.every((obj: any) => obj.selectable === true)
    })

  test('開始裁切並確認尺寸', async ({ editor }) => {
    await editor.sidebar.clickCrop()
    await editor.panel.clickButton('開始裁切')

    const cropRectBefore = await getCropRect(editor.page)
    expect(cropRectBefore).not.toBeNull()

    const canvasSizeBefore = await getCanvasSize(editor.page)
    expect(canvasSizeBefore).not.toBeNull()

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const rect = store?.cropRect
      if (!rect) return
      rect.set({ scaleX: 0.6, scaleY: 0.6 })
      rect.setCoords()
      store.canvas.renderAll()
    })

    await editor.page.waitForTimeout(300)

    await editor.page.click('button:has-text("確認")')
    await editor.page.waitForTimeout(300)

    const canvasSizeAfter = await getCanvasSize(editor.page)
    expect(canvasSizeAfter).not.toBeNull()
    const cropRectAfter = await getCropRect(editor.page)
    expect(cropRectAfter).toBeNull()

    const expectedWidth = cropRectBefore!.width * 0.6
    const expectedHeight = cropRectBefore!.height * 0.6
    expect(canvasSizeAfter!.width).toBeCloseTo(expectedWidth, 1)
    expect(canvasSizeAfter!.height).toBeCloseTo(expectedHeight, 1)
  })

  test('裁切區域超出左邊界應被限制', async ({ editor }) => {
    await editor.sidebar.clickCrop()
    await editor.panel.clickButton('開始裁切')
    await editor.page.waitForTimeout(300)

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const rect = store?.cropRect
      if (!rect) return
      const topLeft = rect.getPositionByOrigin('left', 'top')
      rect.positionByLeftTop({ x: -100, y: topLeft.y } as any)
      rect.setCoords()
      store.canvas.fire('object:moving', { target: rect } as any)
      store.canvas.renderAll()
    })

    await editor.page.waitForTimeout(300)

    const rectAfter = await getCropRect(editor.page)
    expect(rectAfter).not.toBeNull()
    expect(rectAfter!.left).toBe(0)
  })

  test('裁切區域超出上邊界應被限制', async ({ editor }) => {
    await editor.sidebar.clickCrop()
    await editor.panel.clickButton('開始裁切')
    await editor.page.waitForTimeout(300)

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const rect = store?.cropRect
      if (!rect) return
      const topLeft = rect.getPositionByOrigin('left', 'top')
      rect.positionByLeftTop({ x: topLeft.x, y: -100 } as any)
      rect.setCoords()
      store.canvas.fire('object:moving', { target: rect } as any)
      store.canvas.renderAll()
    })

    await editor.page.waitForTimeout(300)

    const rectAfter = await getCropRect(editor.page)
    expect(rectAfter).not.toBeNull()
    expect(rectAfter!.top).toBe(0)
  })

  test('裁切區域超出右邊界應被限制', async ({ editor }) => {
    await editor.sidebar.clickCrop()
    await editor.panel.clickButton('開始裁切')
    await editor.page.waitForTimeout(300)

    const canvasSize = await getCanvasSize(editor.page)
    expect(canvasSize).not.toBeNull()

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const rect = store?.cropRect
      const canvas = store?.canvas
      if (!rect || !canvas) return
      const topLeft = rect.getPositionByOrigin('left', 'top')
      rect.positionByLeftTop({ x: canvas.width + 100, y: topLeft.y } as any)
      rect.setCoords()
      store.canvas.fire('object:moving', { target: rect } as any)
      store.canvas.renderAll()
    })

    await editor.page.waitForTimeout(300)

    const rectAfter = await getCropRect(editor.page)
    expect(rectAfter).not.toBeNull()
    expect(rectAfter!.left + rectAfter!.width).toBeLessThanOrEqual(canvasSize!.width)
  })

  test('裁切區域超出下邊界應被限制', async ({ editor }) => {
    await editor.sidebar.clickCrop()
    await editor.panel.clickButton('開始裁切')
    await editor.page.waitForTimeout(300)

    const canvasSize = await getCanvasSize(editor.page)
    expect(canvasSize).not.toBeNull()

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const rect = store?.cropRect
      const canvas = store?.canvas
      if (!rect || !canvas) return
      const topLeft = rect.getPositionByOrigin('left', 'top')
      rect.positionByLeftTop({ x: topLeft.x, y: canvas.height + 100 } as any)
      rect.setCoords()
      store.canvas.fire('object:moving', { target: rect } as any)
      store.canvas.renderAll()
    })

    await editor.page.waitForTimeout(300)

    const rectAfter = await getCropRect(editor.page)
    expect(rectAfter).not.toBeNull()
    expect(rectAfter!.top + rectAfter!.height).toBeLessThanOrEqual(canvasSize!.height)
  })

  test('裁切區域調整大小超出邊界應被限制', async ({ editor }) => {
    await editor.sidebar.clickCrop()
    await editor.panel.clickButton('開始裁切')
    await editor.page.waitForTimeout(300)

    const canvasSize = await getCanvasSize(editor.page)
    expect(canvasSize).not.toBeNull()

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const rect = store?.cropRect
      const canvas = store?.canvas
      if (!rect || !canvas) return
      rect.positionByLeftTop({ x: 0, y: 0 } as any)
      rect.setCoords()
      store.canvas.fire('object:moving', { target: rect } as any)
      rect.set({ scaleX: 3, scaleY: 3 })
      rect.setCoords()
      store.canvas.fire('object:scaling', { target: rect } as any)
      store.canvas.renderAll()
    })

    await editor.page.waitForTimeout(300)

    const rectAfter = await getCropRect(editor.page)
    expect(rectAfter).not.toBeNull()
    expect(rectAfter!.left + rectAfter!.width).toBeLessThanOrEqual(canvasSize!.width + 5)
    expect(rectAfter!.top + rectAfter!.height).toBeLessThanOrEqual(canvasSize!.height + 5)
  })

  test('取消裁切應移除裁切框並恢復物件選取狀態', async ({ editor }) => {
    await editor.sidebar.clickCrop()
    await editor.panel.clickButton('開始裁切')
    await editor.page.waitForTimeout(300)

    const cropRectBefore = await getCropRect(editor.page)
    expect(cropRectBefore).not.toBeNull()

    await editor.page.click('button:has-text("取消")')
    await editor.page.waitForTimeout(300)

    const cropRectAfter = await getCropRect(editor.page)
    expect(cropRectAfter).toBeNull()

    const objectsSelectable = await getObjectsSelectable(editor.page)
    expect(objectsSelectable).toBe(true)
  })

  test('裁切模式中物件應不可選取', async ({ editor }) => {
    await editor.sidebar.clickCrop()
    await editor.panel.clickButton('開始裁切')
    await editor.page.waitForTimeout(300)

    const objectsSelectable = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const objects = store?.canvas?.getObjects() || []
      const nonCropObjects = objects.filter((obj: any) => obj !== store?.cropRect)
      return nonCropObjects.every((obj: any) => obj.selectable === false)
    })
    expect(objectsSelectable).toBe(true)
  })

  test('最小裁切尺寸', async ({ editor }) => {
    await editor.sidebar.clickCrop()
    await editor.panel.clickButton('開始裁切')
    await editor.page.waitForTimeout(300)

    const cropRect = await getCropRect(editor.page)
    expect(cropRect).not.toBeNull()

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const rect = store?.cropRect
      if (rect) {
        rect.set({ scaleX: 0.01, scaleY: 0.01 })
        rect.setCoords()
        store.canvas?.fire('object:scaling', { target: rect } as any)
        store.canvas?.renderAll()
      }
    })
    await editor.page.waitForTimeout(500)

    const newCropRect = await getCropRect(editor.page)
    expect(newCropRect?.width).toBeGreaterThanOrEqual(10)
    expect(newCropRect?.height).toBeGreaterThanOrEqual(10)
  })

  test('裁切後物件位置', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)

    const getObjectPos = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const objects = store?.canvas?.getObjects() || []
        const textObj = objects.find((o: any) => o.type === 'i-text')
        if (!textObj) return null
        const topLeft = textObj.getPositionByOrigin('left', 'top')
        return { left: topLeft.x, top: topLeft.y }
      })

    const beforePos = await getObjectPos()
    expect(beforePos).not.toBeNull()

    await editor.sidebar.clickCrop()
    await editor.panel.clickButton('開始裁切')
    await editor.page.waitForTimeout(300)

    const cropRect = await getCropRect(editor.page)
    const cropX = cropRect!.left
    const cropY = cropRect!.top

    await editor.page.click('button:has-text("確認")')
    await editor.page.waitForTimeout(500)

    const afterPos = await getObjectPos()
    expect(afterPos).not.toBeNull()
    expect(afterPos!.left).toBeCloseTo(beforePos!.left - cropX, 0)
    expect(afterPos!.top).toBeCloseTo(beforePos!.top - cropY, 0)
  })
})
