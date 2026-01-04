import { test, expect } from '../fixtures/editor'

test.describe('錯誤處理', () => {
  test('圖片載入失敗', async ({ editor, page }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)

    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    const fileInput = editor.page.locator('input[type="file"][accept="image/*"]').first()
    const invalidFile = Buffer.from('invalid image data')
    await fileInput.setInputFiles({
      name: 'invalid.jpg',
      mimeType: 'image/jpeg',
      buffer: invalidFile,
    })
    await editor.page.waitForTimeout(2000)

    const canvasVisible = await editor.canvas.isVisible()
    expect(canvasVisible).toBe(true)
  })

  test('無效操作不應導致頁面崩潰', async ({ editor }) => {
    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const store = pinia?._s?.get('editor')
      try {
        store?.canvas?.remove(null as any)
        store?.canvas?.setActiveObject(null)
        store?.setActiveObject(null)
      } catch (e) {
        // ignore
      }
    })

    const canvasVisible = await editor.canvas.isVisible()
    expect(canvasVisible).toBe(true)
  })
})


