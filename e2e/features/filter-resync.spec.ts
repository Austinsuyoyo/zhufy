import { test, expect } from '../fixtures/editor'

// Regression guard for the filter-readback fix: set blur on the 素材/背景 panel,
// switch to the 文字 tab (which unmounts the panel) and back — the slider must
// re-sync to the value still applied to the image, not reset to 0.
test.describe('濾鏡滑桿切頁後重新同步', () => {
  const bgReady = (page: any) =>
    page.evaluate(() => {
      const app =
        (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
      const pinia =
        app?.config?.globalProperties?.$pinia ||
        app?._instance?.appContext?.config?.globalProperties?.$pinia
      return !!pinia?._s?.get('editor')?.canvas?.backgroundImage
    })

  test('設模糊→切到文字→切回，滑桿仍顯示原值', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await expect.poll(() => bgReady(editor.page), { timeout: 8000 }).toBe(true)

    const blur = editor.page.locator('#blur-slider')
    await blur.fill('0.4')
    await editor.page.waitForTimeout(300)
    expect(await blur.inputValue()).toBe('0.4')

    // leave the panel (it unmounts) then come back (it remounts)
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(300)
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(400)

    const reblur = editor.page.locator('#blur-slider')
    await expect(reblur).toBeVisible()
    // before the fix this read '0' while the image was still blurred
    expect(await reblur.inputValue()).toBe('0.4')
  })
})
