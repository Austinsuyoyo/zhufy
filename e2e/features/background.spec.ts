import { test, expect } from '../fixtures/editor'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test.describe('背景功能', () => {
  test('切換背景', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)
    await editor.panel.expectPanelTitle('背景設定')
    const bgImages = editor.page.locator('img[alt*="背景"]')
    const count = await bgImages.count()
    expect(count).toBeGreaterThan(0)

    const getCurrentBgUrl = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        return store?.currentBgUrl
      })

    await editor.panel.clickBackgroundImage(1)
    await editor.page.waitForTimeout(1000)
    const bgUrl = await getCurrentBgUrl()
    expect(bgUrl).toContain('sunrise.webp')
  })

  test('隨機背景功能', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)

    const getCurrentBgUrl = () =>
      editor.page.evaluate(() => {
        const app =
          (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
        const pinia =
          app?.config?.globalProperties?.$pinia ||
          app?._instance?.appContext?.config?.globalProperties?.$pinia
        const store = pinia?._s?.get('editor')
        return store?.currentBgUrl
      })

    const initialBg = await getCurrentBgUrl()
    let newBg = initialBg
    let attempts = 0
    while (newBg === initialBg && attempts < 5) {
      await editor.panel.clickButton('隨機更換')
      await editor.page.waitForTimeout(1500)
      newBg = await getCurrentBgUrl()
      attempts++
    }
    expect(newBg).not.toBeNull()
    expect(newBg).not.toBe(initialBg)
  })

  test('上傳自定義背景', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)

    const fileInput = editor.page.locator('input[type="file"][accept="image/*"]').first()
    const testImagePath = join(__dirname, '../../public/backgrounds/lotus.webp')
    await fileInput.setInputFiles(testImagePath)
    await editor.page.waitForTimeout(1500)
  })

  test('模糊濾鏡', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)

    const blurSlider = editor.page.locator('#blur-slider')
    await expect(blurSlider).toBeVisible()
    await blurSlider.fill('0.5')
    await editor.page.waitForTimeout(500)

    const blurLabel = editor.page.locator('text=50%').first()
    await expect(blurLabel).toBeVisible()
  })

  test('亮度濾鏡', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)

    const brightnessSlider = editor.page.locator('#brightness-slider')
    await expect(brightnessSlider).toBeVisible()
    await brightnessSlider.fill('0.25')
    await editor.page.waitForTimeout(500)

    const brightnessLabel = editor.page.locator('text=+25%').first()
    await expect(brightnessLabel).toBeVisible()
  })

  test('對比濾鏡', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)

    const contrastSlider = editor.page.locator('#contrast-slider')
    await expect(contrastSlider).toBeVisible()
    await contrastSlider.fill('0.25')
    await editor.page.waitForTimeout(500)

    const contrastLabel = editor.page.locator('text=+25%').first()
    await expect(contrastLabel).toBeVisible()
  })

  test('濾鏡重置', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)

    const blurSlider = editor.page.locator('#blur-slider')
    await blurSlider.fill('0.5')
    await editor.page.waitForTimeout(500)

    await blurSlider.fill('0')
    await editor.page.waitForTimeout(500)

    const blurValue = await blurSlider.inputValue()
    expect(parseFloat(blurValue)).toBe(0)
  })

  test('濾鏡組合', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(300)

    const blurSlider = editor.page.locator('#blur-slider')
    const brightnessSlider = editor.page.locator('#brightness-slider')

    await blurSlider.fill('0.3')
    await editor.page.waitForTimeout(500)
    await brightnessSlider.fill('0.2')
    await editor.page.waitForTimeout(500)

    const blurLabel = editor.page.locator('text=30%').first()
    const brightnessLabel = editor.page.locator('text=+20%').first()
    await expect(blurLabel).toBeVisible()
    await expect(brightnessLabel).toBeVisible()
  })
})
