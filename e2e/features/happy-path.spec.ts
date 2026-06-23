import { test, expect } from '../fixtures/editor'
import { waitForDownload } from '../utils/helpers'

// Integration smoke: the existing specs test each step in isolation; this chains
// the whole "make a 長輩圖" journey to catch issues between steps.
test.describe('完整製圖流程', () => {
  const read = (page: any) =>
    page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const store = (
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      )?._s?.get('editor')
      const c = store?.canvas
      return {
        bg: store?.currentBgUrl ?? null,
        objs: c?.getObjects().length ?? 0,
        w: Math.round(c?.width ?? 0),
      }
    })

  test('換背景 → 加文字 → 裁切 → 下載', async ({ editor }) => {
    await expect
      .poll(async () => (await read(editor.page)).objs, { timeout: 8000 })
      .toBeGreaterThan(0)
    const start = await read(editor.page)

    // 1. change the background (thumbnail img sits under a hover overlay → force)
    await editor.sidebar.clickBackground()
    const thumb = editor.page.locator('img[alt="竹子背景"]')
    await thumb.waitFor({ state: 'visible', timeout: 5000 })
    await thumb.click({ force: true })
    await expect
      .poll(async () => (await read(editor.page)).bg ?? '', { timeout: 8000 })
      .toContain('bamboo')

    // 2. add text
    await editor.sidebar.clickText()
    await editor.panel.clickButton('新增文字')
    await expect
      .poll(async () => (await read(editor.page)).objs, { timeout: 5000 })
      .toBeGreaterThan(start.objs)

    // 3. crop to 60%
    const beforeCrop = await read(editor.page)
    await editor.sidebar.clickCrop()
    await editor.panel.clickButton('開始裁切')
    await editor.page.waitForTimeout(300)
    await editor.page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const store = (
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      )?._s?.get('editor')
      const rect = store?.cropRect
      if (!rect) return
      rect.set({ scaleX: 0.6, scaleY: 0.6 })
      rect.setCoords()
      store.canvas.renderAll()
    })
    await editor.page.waitForTimeout(200)
    await editor.page.click('button:has-text("確認")')
    await expect
      .poll(async () => (await read(editor.page)).w, { timeout: 5000 })
      .toBeLessThan(beforeCrop.w)

    // 4. download the result
    const downloadPromise = waitForDownload(editor.page)
    await editor.toolbar.clickDownload()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain('senior-greet')
  })
})
