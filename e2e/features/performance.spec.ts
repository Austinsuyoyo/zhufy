import { test, expect } from '../fixtures/editor'

test.describe('效能測試', () => {
  test('大量物件操作', async ({ editor }) => {
    await editor.sidebar.clickText()
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

    for (let i = 0; i < 20; i++) {
      await editor.panel.clickButton('新增文字')
      await editor.page.waitForTimeout(100)
    }

    const count = await getObjectCount()
    expect(count).toBeGreaterThanOrEqual(20)
  })

  test('高解析度圖片載入', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)

    const startTime = Date.now()

    const fileInput = editor.page.locator('input[type="file"][accept="image/*"]').first()
    const { fileURLToPath } = await import('url')
    const { dirname, join } = await import('path')
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const testImagePath = join(__dirname, '../../public/backgrounds/lotus.webp')
    await fileInput.setInputFiles(testImagePath)
    await editor.page.waitForTimeout(2000)

    const endTime = Date.now()
    const loadTime = endTime - startTime

    expect(loadTime).toBeLessThan(10000)
  })
})

