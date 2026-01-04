import { test, expect } from '../../fixtures/editor'

test.describe('文字屬性', () => {
  test.beforeEach(async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.clickCanvasCenter()
    await editor.page.waitForTimeout(500)
  })

  test('變更字型', async ({ editor }) => {
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const fontSelect = editor.page.locator('select').first()
    await fontSelect.selectOption('Noto Serif TC')
    await editor.page.waitForTimeout(300)

    const fontValue = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      return obj?.fontFamily
    })
    expect(fontValue).toBe('Noto Serif TC')
  })

  test('粗體切換', async ({ editor }) => {
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const getBoldState = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const obj = store?.canvas?.getActiveObject()
        return obj?.fontWeight
      })

    const before = await getBoldState()
    expect(before).toBe('900')

    const boldButton = editor.page.locator('button[aria-label="粗體"]')
    await boldButton.click()
    await editor.page.waitForTimeout(300)

    const after = await getBoldState()
    expect(after).toBe('normal')

    await boldButton.click()
    await editor.page.waitForTimeout(300)

    const afterSecond = await getBoldState()
    expect(afterSecond).toBe('900')
  })

  test('變更文字顏色', async ({ editor }) => {
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const colorInput = editor.page.locator('input[aria-label="文字顏色"]')
    await colorInput.fill('#00ff00')
    await editor.page.waitForTimeout(300)

    const fillColor = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      return obj?.fill
    })
    expect(fillColor).toBe('#00ff00')
  })

  test('變更描邊顏色', async ({ editor }) => {
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const strokeInput = editor.page.locator('input[aria-label="描邊顏色"]')
    await strokeInput.fill('#0000ff')
    await editor.page.waitForTimeout(300)

    const strokeColor = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      return obj?.stroke
    })
    expect(strokeColor).toBe('#0000ff')
  })

  test('調整字體大小', async ({ editor }) => {
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const sizeSlider = editor.page.locator('#font-size-slider')
    await sizeSlider.fill('150')
    await editor.page.waitForTimeout(300)

    const fontSize = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      return obj?.fontSize
    })
    expect(fontSize).toBe(150)
  })

  test('調整描邊粗細', async ({ editor }) => {
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const strokeSlider = editor.page.locator('#stroke-width-slider')
    await strokeSlider.fill('8')
    await editor.page.waitForTimeout(300)

    const strokeWidth = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      return obj?.strokeWidth
    })
    expect(strokeWidth).toBe(8)
  })
})


