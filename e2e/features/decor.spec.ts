import { test, expect } from '../fixtures/editor'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test.describe('裝飾功能', () => {
  test('添加 Emoji', async ({ editor }) => {
    await editor.sidebar.clickDecor()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectPanelTitle('裝飾圖庫')
    await editor.panel.expectEmojiCountGreaterThan(0)

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      if (store?.canvas) {
        store.canvas.discardActiveObject()
        store.setActiveObject(null)
      }
    })

    const getActiveObject = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const obj = store?.canvas?.getActiveObject()
        return obj ? { text: obj.text } : null
      })

    await editor.panel.clickEmoji(1)
    await editor.page.waitForTimeout(500)
    const obj = await getActiveObject()
    expect(obj).not.toBeNull()
    expect(obj?.text).toBe('🌹')
  })

  test('Emoji 點擊後應有選中物件', async ({ editor }) => {
    await editor.sidebar.clickDecor()
    await editor.page.waitForTimeout(300)

    await editor.panel.clickEmoji(0)
    await editor.page.waitForTimeout(500)

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
  })

  test('上傳自定義貼圖', async ({ editor }) => {
    await editor.sidebar.clickDecor()
    await editor.page.waitForTimeout(300)

    const getObjectCount = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        return store?.canvas?.getObjects()?.length || 0
      })

    const initialCount = await getObjectCount()

    const fileInput = editor.page.locator('input[type="file"][accept="image/*"]').first()
    const testImagePath = join(__dirname, '../../public/backgrounds/lotus.webp')
    await fileInput.setInputFiles(testImagePath)
    await editor.page.waitForTimeout(2000)

    const newCount = await getObjectCount()
    expect(newCount).toBeGreaterThan(initialCount)
  })

  test('Emoji 添加後應被選中', async ({ editor }) => {
    await editor.sidebar.clickDecor()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickEmoji(0)
    await editor.page.waitForTimeout(500)

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
  })

  test('添加多個 Emoji', async ({ editor }) => {
    await editor.sidebar.clickDecor()
    await editor.page.waitForTimeout(300)

    const getObjectCount = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        return store?.canvas?.getObjects()?.length || 0
      })

    const initialCount = await getObjectCount()

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      if (store?.canvas) {
        store.canvas.discardActiveObject()
        store.setActiveObject(null)
      }
    })

    await editor.panel.clickEmoji(0)
    await editor.page.waitForTimeout(300)
    await editor.panel.clickEmoji(1)
    await editor.page.waitForTimeout(300)
    await editor.panel.clickEmoji(2)
    await editor.page.waitForTimeout(300)

    const newCount = await getObjectCount()
    expect(newCount).toBe(initialCount + 3)
  })

  test('Emoji 位置', async ({ editor }) => {
    await editor.sidebar.clickDecor()
    await editor.page.waitForTimeout(300)

    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      if (store?.canvas) {
        store.canvas.discardActiveObject()
        store.setActiveObject(null)
      }
    })

    await editor.panel.clickEmoji(0)
    await editor.page.waitForTimeout(500)

    const getEmojiPosition = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const canvas = store?.canvas
        const obj = canvas?.getActiveObject()
        if (!obj || !canvas) return null
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        return {
          left: obj.left,
          top: obj.top,
          centerX,
          centerY,
        }
      })

    const pos = await getEmojiPosition()
    expect(pos).not.toBeNull()
    expect(Math.abs(pos!.left - pos!.centerX)).toBeLessThan(50)
    expect(Math.abs(pos!.top - pos!.centerY)).toBeLessThan(50)
  })
})
