import { test, expect } from '../fixtures/editor'

// Regression guard for the reset fix: after cropping (and applying a filter),
// 重置 must restore the original image — full canvas size, background back at
// the top-left, filters cleared, text/decor removed.
test.describe('重置還原裁切', () => {
  const getState = (page: any) =>
    page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      const c = pinia?._s?.get('editor')?.canvas
      if (!c) return null
      const bg = c.backgroundImage
      return {
        w: Math.round(c.width),
        h: Math.round(c.height),
        objs: c.getObjects().length,
        bgLeft: Math.round(bg?.left ?? 0),
        bgTop: Math.round(bg?.top ?? 0),
        bgFilters: bg?.filters?.length ?? 0,
      }
    })

  test('裁切+濾鏡後，重置還原整張圖（尺寸/位置/濾鏡/物件）', async ({ editor }) => {
    // wait for the canvas + default text to finish loading (async)
    await expect
      .poll(async () => (await getState(editor.page))?.objs ?? 0, { timeout: 8000 })
      .toBeGreaterThan(0)
    const before = await getState(editor.page)
    expect(before).not.toBeNull()

    // apply a blur filter
    await editor.sidebar.clickBackground()
    await editor.page.locator('#blur-slider').fill('0.4')
    await editor.page.waitForTimeout(300)
    expect((await getState(editor.page)).bgFilters).toBe(1)

    // crop to 60%
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
      rect.set({ scaleX: 0.6, scaleY: 0.6 })
      rect.setCoords()
      store.canvas.renderAll()
    })
    await editor.page.waitForTimeout(200)
    await editor.page.click('button:has-text("確認")')
    await editor.page.waitForTimeout(400)

    const cropped = await getState(editor.page)
    expect(cropped.w).toBeLessThan(before.w) // canvas shrank
    expect(cropped.bgLeft).toBeLessThan(0) // background shifted

    // reset
    await editor.page.click('button:has-text("重置")')
    await editor.page.click('button:has-text("確認重置")')
    await editor.page.waitForTimeout(500)

    const after = await getState(editor.page)
    expect(after.w).toBe(before.w) // full size restored
    expect(after.h).toBe(before.h)
    expect(after.bgLeft).toBe(0) // background un-shifted
    expect(after.bgTop).toBe(0)
    expect(after.bgFilters).toBe(0) // filters cleared
    expect(after.objs).toBe(0) // text/decor removed
  })
})
