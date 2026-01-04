import { test, expect } from '../../fixtures/editor'

test.describe('文字進階功能', () => {
  test.beforeEach(async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.clickCanvasCenter()
    await editor.page.waitForTimeout(500)
  })

  test('文字方向切換為垂直', async ({ editor }) => {
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const verticalButton = editor.page.locator('button:has-text("垂直")')
    await verticalButton.click()
    await editor.page.waitForTimeout(300)

    const text = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      return obj?.text
    })
    expect(text).toContain('\n')
  })

  test('文字方向切換為橫向', async ({ editor }) => {
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const verticalButton = editor.page.locator('button:has-text("垂直")')
    await verticalButton.click()
    await editor.page.waitForTimeout(300)

    const horizontalButton = editor.page.locator('button:has-text("橫向")')
    await horizontalButton.click()
    await editor.page.waitForTimeout(300)

    const text = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      return obj?.text
    })
    expect(text).not.toContain('\n')
  })

  test('旋轉角度調整', async ({ editor }) => {
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const angleSlider = editor.page.locator('#angle-slider')
    await angleSlider.fill('90')
    await editor.page.waitForTimeout(300)

    const angle = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      return obj?.angle
    })
    expect(angle).toBe(90)
  })

  test('快速旋轉按鈕 90°', async ({ editor }) => {
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const angle90Button = editor.page.locator('button[aria-label="旋轉 90 度"]')
    await angle90Button.click()
    await editor.page.waitForTimeout(300)

    const angle = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      return obj?.angle
    })
    expect(angle).toBe(90)
  })

  test('左對齊功能', async ({ editor }) => {
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const leftAlignButton = editor.page.locator('button[aria-label="左對齊"]')
    await leftAlignButton.click()
    await editor.page.waitForTimeout(300)

    const position = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      return { left: obj?.left, originX: obj?.originX }
    })
    expect(position.left).toBe(0)
    expect(position.originX).toBe('left')
  })

  test('置中對齊功能', async ({ editor }) => {
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const centerAlignButton = editor.page.locator('button[aria-label="置中對齊"]')
    await centerAlignButton.click()
    await editor.page.waitForTimeout(300)

    const position = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const canvas = store?.canvas
      const obj = canvas?.getActiveObject()
      return { left: obj?.left, originX: obj?.originX, canvasWidth: canvas?.width }
    })
    expect(position.left).toBe(position.canvasWidth / 2)
    expect(position.originX).toBe('center')
  })

  test('右對齊功能', async ({ editor }) => {
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const rightAlignButton = editor.page.locator('button[aria-label="右對齊"]')
    await rightAlignButton.click()
    await editor.page.waitForTimeout(300)

    const position = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const canvas = store?.canvas
      const obj = canvas?.getActiveObject()
      return { left: obj?.left, originX: obj?.originX, canvasWidth: canvas?.width }
    })
    expect(position.left).toBe(position.canvasWidth)
    expect(position.originX).toBe('right')
  })
})


