import { test, expect } from '../../fixtures/editor'

test.describe('文字功能', () => {
  test('新增文字', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const getActiveObject = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const obj = store?.canvas?.getActiveObject()
        return obj ? { type: obj.type, text: obj.text } : null
      })

    const obj = await getActiveObject()
    expect(obj).not.toBeNull()
    expect(obj?.type).toBe('i-text')
    expect(obj?.text).toBe('請輸入文字')
  })

  test('文字選擇和編輯', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.clickCanvasCenter()
    await editor.page.waitForTimeout(500)
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
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('隨機金句')
    await editor.page.waitForTimeout(500)
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const getActiveObjectText = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const obj = store?.canvas?.getActiveObject()
        return obj?.text
      })

    const quotes = [
      '早安，平安喜樂',
      '認同請分享',
      '歲月靜好',
      '知足常樂',
      '心靜自然涼',
      '善有善報',
      '一切隨緣',
      '健康就是財富',
      '福氣滿滿',
      '感恩的心',
      '早安，美好的一天',
      '晚安，好夢相隨',
      '週末愉快',
      '聽媽媽的話',
      '簡單就是幸福',
      '莫忘初衷',
      '吃虧就是占便宜',
      '放下自在',
      '天天開心',
      '平安是福',
      '靜心修身',
      '福運旺旺',
      '笑口常開',
      '人美心更美',
      '功德無量',
      '大吉大利',
      '花開富貴',
      '吉祥如意',
      '心想事成',
      '好運連連',
    ]

    const text = await getActiveObjectText()
    expect(quotes).toContain(text)
  })

  test('文字模板應用', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('標題')
    await editor.page.waitForTimeout(500)
    await expect(editor.panel.getTextarea()).toBeVisible({ timeout: 2000 })

    const getActiveObject = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const obj = store?.canvas?.getActiveObject()
        return obj ? { fontSize: obj.fontSize, fontWeight: obj.fontWeight } : null
      })

    const obj = await getActiveObject()
    expect(obj).not.toBeNull()
    expect(obj?.fontSize).toBe(120)
    expect(obj?.fontWeight).toBe('900')
  })

  test('特殊字符輸入', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)

    await editor.panel.fillText('測試🌹\n換行符')
    await editor.page.waitForTimeout(500)

    const getActiveObjectText = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const obj = store?.canvas?.getActiveObject()
        return obj?.text
      })

    const text = await getActiveObjectText()
    expect(text).toContain('🌹')
    expect(text).toContain('換行符')
  })

  test('極長文字處理', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)

    const longText = '這是一個很長的文字'.repeat(20)
    await editor.panel.fillText(longText)
    await editor.page.waitForTimeout(500)

    const getActiveObjectText = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const obj = store?.canvas?.getActiveObject()
        return obj?.text
      })

    const text = await getActiveObjectText()
    expect(text.length).toBeGreaterThan(100)
  })

  test('文字複製（Ctrl+D）結果驗證', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      const obj = store?.canvas?.getActiveObject()
      if (obj) {
        obj.set({ left: 100, top: 100 })
        obj.exitEditing?.()
        store.canvas.renderAll()
      }
    })
    await editor.page.waitForTimeout(300)

    const getFirstObjectPos = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const objects = store?.canvas?.getObjects() || []
        const first = objects[0]
        return first ? { left: first.left, top: first.top } : null
      })

    const firstPos = await getFirstObjectPos()

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

    const getSecondObjectPos = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const objects = store?.canvas?.getObjects() || []
        const second = objects[1]
        return second ? { left: second.left, top: second.top } : null
      })

    const secondPos = await getSecondObjectPos()
    expect(secondPos).not.toBeNull()
    expect(secondPos?.left).not.toBe(firstPos?.left)
  })

  test('文字刪除後狀態', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)

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

    const activeObject = await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      return store?.activeObject
    })

    expect(activeObject).toBeNull()
  })
})
