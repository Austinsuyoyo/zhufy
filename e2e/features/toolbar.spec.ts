import { test, expect } from '../fixtures/editor'
import { waitForDownload } from '../utils/helpers'

test.describe('工具欄功能', () => {
  test('下載功能', async ({ editor, browserName }) => {
    if (browserName === 'webkit') {
      await editor.toolbar.clickDownload()
      await editor.page.waitForTimeout(1000)
      const canvas = editor.page.locator('canvas.upper-canvas')
      await expect(canvas).toBeVisible()
    } else {
      const downloadPromise = waitForDownload(editor.page)
      await editor.toolbar.clickDownload()
      const download = await downloadPromise
      expect(download.suggestedFilename()).toContain('senior-greet')
    }
  })

  test('重置功能', async ({ editor }) => {
    await editor.toolbar.clickReset()
    await expect(editor.canvas).toBeVisible()
  })

  test('重置取消確認', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.panel.clickButton('新增文字')
    await editor.page.waitForTimeout(500)

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
    expect(initialCount).toBeGreaterThan(0)

    await editor.page.click('button:has-text("重置")')
    await editor.page.waitForTimeout(300)
    await editor.page.click('button:has-text("取消")')
    await editor.page.waitForTimeout(300)

    const newCount = await getObjectCount()
    expect(newCount).toBe(initialCount)
  })

  test('解析度選單開啟', async ({ editor }) => {
    const resolutionButton = editor.page.locator('button[aria-label="選擇下載解析度"]')
    await resolutionButton.click()
    await editor.page.waitForTimeout(300)

    await expect(editor.page.locator('text=1x (原始)')).toBeVisible()
    await expect(editor.page.locator('text=1.5x (高解析)')).toBeVisible()
    await expect(editor.page.locator('text=2x (超高解析)')).toBeVisible()
    await expect(editor.page.locator('text=3x (最高解析)')).toBeVisible()
  })

  test('選擇不同解析度下載', async ({ editor, browserName }) => {
    const resolutionButton = editor.page.locator('button[aria-label="選擇下載解析度"]')
    await resolutionButton.click()
    await editor.page.waitForTimeout(300)

    if (browserName === 'webkit') {
      await editor.page.click('text=2x (超高解析)')
      await editor.page.waitForTimeout(1000)
      const canvas = editor.page.locator('canvas.upper-canvas')
      await expect(canvas).toBeVisible()
    } else {
      const downloadPromise = waitForDownload(editor.page)
      await editor.page.click('text=2x (超高解析)')
      const download = await downloadPromise
      expect(download.suggestedFilename()).toContain('senior-greet')
    }
  })

  test('下載圖片格式驗證', async ({ editor, browserName }) => {
    if (browserName === 'webkit') {
      await editor.toolbar.clickDownload()
      await editor.page.waitForTimeout(1000)
      const canvas = editor.page.locator('canvas.upper-canvas')
      await expect(canvas).toBeVisible()
    } else {
      const downloadPromise = waitForDownload(editor.page)
      await editor.toolbar.clickDownload()
      const download = await downloadPromise

      const path = await download.path()
      expect(path).not.toBeNull()
      if (path) {
        const fs = await import('fs')
        const buffer = fs.readFileSync(path)
        const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47
        expect(isPng).toBe(true)
      }
    }
  })

  test('不同解析度下載', async ({ editor, browserName }) => {
    const getCanvasSize = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        const canvas = store?.canvas
        return canvas ? { width: canvas.width, height: canvas.height } : null
      })

    const originalSize = await getCanvasSize()
    expect(originalSize).not.toBeNull()

    const resolutionButton = editor.page.locator('button[aria-label="選擇下載解析度"]')
    await resolutionButton.click()
    await editor.page.waitForTimeout(300)

    if (browserName === 'webkit') {
      await editor.page.click('text=2x (超高解析)')
      await editor.page.waitForTimeout(1000)
      const canvas = editor.page.locator('canvas.upper-canvas')
      await expect(canvas).toBeVisible()
    } else {
      const downloadPromise = waitForDownload(editor.page)
      await editor.page.click('text=2x (超高解析)')
      const download = await downloadPromise
      expect(download.suggestedFilename()).toContain('senior-greet')
    }
  })
})
