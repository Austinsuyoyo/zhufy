import { Page, Locator, expect } from '@playwright/test'
import { getDeviceType, DeviceType } from '../utils/device'

export class EditorPage {
  readonly page: Page
  readonly canvas: Locator
  readonly sidebar: Sidebar
  readonly toolbar: Toolbar
  readonly panel: Panel
  private _deviceType: DeviceType | null = null

  constructor(page: Page) {
    this.page = page
    this.canvas = page.locator('#c')
    this.sidebar = new Sidebar(page)
    this.toolbar = new Toolbar(page)
    this.panel = new Panel(page)
  }

  async goto() {
    await this.page.goto('/editor')
    await expect(this.canvas).toBeVisible()
    this._deviceType = await getDeviceType(this.page)
  }

  async getDeviceType(): Promise<DeviceType> {
    if (!this._deviceType) {
      this._deviceType = await getDeviceType(this.page)
    }
    return this._deviceType
  }

  isMobile(): Promise<boolean> {
    return this.getDeviceType().then((type) => type === 'mobile')
  }

  isDesktop(): Promise<boolean> {
    return this.getDeviceType().then((type) => type === 'desktop')
  }

  async getCanvasBoundingBox() {
    const box = await this.canvas.boundingBox()
    expect(box).not.toBeNull()
    return box!
  }

  async clickCanvas(offsetX: number, offsetY: number) {
    const box = await this.getCanvasBoundingBox()
    await this.page.mouse.click(box.x + offsetX, box.y + offsetY)
  }

  async clickCanvasCenter() {
    const box = await this.getCanvasBoundingBox()
    await this.clickCanvas(box.width / 2, box.height / 2)
  }
}

class Sidebar {
  constructor(private page: Page) {}

  async clickTab(tab: 'bg' | 'text' | 'decor' | 'crop') {
    const tabMap = {
      bg: '素材',
      text: '文字',
      decor: '裝飾',
      crop: '裁切',
    }
    await this.page.click(`button:has-text("${tabMap[tab]}")`)
  }

  async expectTabActive(tab: 'bg' | 'text' | 'decor' | 'crop') {
    const tabMap = {
      bg: '素材',
      text: '文字',
      decor: '裝飾',
      crop: '裁切',
    }
    const button = this.page.locator(`button:has-text("${tabMap[tab]}")`)
    await expect(button).toHaveClass(/active/)
  }

  async expectMobileLayout() {
    const sidebar = this.page.locator('aside').first()
    await expect(sidebar).toHaveClass(/fixed/)
    await expect(sidebar).toHaveClass(/bottom-0/)
  }

  async expectDesktopLayout() {
    const sidebar = this.page.locator('aside').first()
    await expect(sidebar).toHaveClass(/md:relative/)
  }

  async clickBackground() {
    await this.clickTab('bg')
  }

  async clickText() {
    await this.clickTab('text')
  }

  async clickDecor() {
    await this.clickTab('decor')
  }

  async clickCrop() {
    await this.clickTab('crop')
  }
}

class Toolbar {
  constructor(private page: Page) {}

  async clickDownload() {
    await this.page.click('button:has-text("下載")')
  }

  async clickReset() {
    await this.page.click('button:has-text("重置")')
    const confirmBtn = this.page.locator('button:has-text("確認重置")')
    await confirmBtn.waitFor({ state: 'visible' })
    await confirmBtn.click()
  }

  async clickZoomIn() {
    await this.page.click('button[title="放大"]')
  }

  async clickZoomOut() {
    await this.page.click('button[title="縮小"]')
  }

  getZoomText() {
    const desktopZoom = this.page
      .locator('div.fixed.bottom-8')
      .filter({ has: this.page.locator('button[title="放大"]') })
      .locator('span.text-xs')
    const mobileZoom = this.page
      .locator('div.fixed.bottom-20')
      .filter({ has: this.page.locator('button[title="放大"]') })
      .locator('span.text-\\[10px\\]')
    return desktopZoom.or(mobileZoom).first()
  }

  async expectZoom(expected: string | RegExp) {
    await expect(this.getZoomText()).toContainText(expected)
  }

  async expectMobileZoomBar() {
    const zoomBar = this.page
      .locator('div.fixed.bottom-20.left-2.right-2')
      .filter({ has: this.page.locator('button[title="放大"]') })
    const isMobile = await this.page.evaluate(() => window.innerWidth < 768)
    if (isMobile) {
      await expect(zoomBar).toBeVisible()
    } else {
      await expect(zoomBar).not.toBeVisible()
    }
  }

  async expectDesktopZoomBar() {
    const zoomBar = this.page.locator(
      'div.fixed.bottom-8.right-\\[calc\\(20rem\\+2rem\\)\\].hidden.md\\:flex',
    )
    await expect(zoomBar).toBeVisible()
  }
}

class Panel {
  constructor(private page: Page) {}

  async expectPanelTitle(title: string) {
    await expect(this.page.locator(`h2:has-text("${title}")`)).toBeVisible()
  }

  async clickButton(buttonText: string) {
    await this.page.click(`button:has-text("${buttonText}")`)
  }

  getTextarea() {
    return this.page.locator('textarea[id="text-content"]')
  }

  async fillText(content: string) {
    const textarea = this.getTextarea()
    await textarea.fill(content)
  }

  async expectTextareaValue(value: string) {
    await expect(this.getTextarea()).toHaveValue(value)
  }

  async clickBackgroundImage(index = 0) {
    const images = this.page.locator('img[alt*="背景"]')
    await images.nth(index).click({ force: true })
  }

  async clickEmoji(index = 0) {
    const emojis = this.page
      .locator('div.grid.grid-cols-5')
      .locator('div')
      .filter({
        hasText:
          /[🌺🌹🌸🌻🍀🙏❤️✨☕🍵🍎🍊🧘🕊️🌈🦋🌞🌝🌟🎉👍🤝💪💡📅🧧🏮💰💎🎀👴👵👨‍👩‍👧‍👦🐶🐱🕊️🐸🐢🐟🦄]/,
      })
    await emojis.nth(index).click()
  }

  async expectEmojiCountGreaterThan(count: number) {
    const emojis = this.page
      .locator('div.grid.grid-cols-5')
      .locator('div')
      .filter({
        hasText:
          /[🌺🌹🌸🌻🍀🙏❤️✨☕🍵🍎🍊🧘🕊️🌈🦋🌞🌝🌟🎉👍🤝💪💡📅🧧🏮💰💎🎀👴👵👨‍👩‍👧‍👦🐶🐱🕊️🐸🐢🐟🦄]/,
      })
    const emojiCount = await emojis.count()
    expect(emojiCount).toBeGreaterThan(count)
  }

  async expectVisible() {
    const panel = this.page.locator('aside').nth(1)
    await expect(panel).toBeVisible()
  }

  async expectHidden() {
    const panel = this.page.locator('aside').nth(1)
    const isMobile = await this.page.evaluate(() => window.innerWidth < 768)
    if (isMobile) {
      await expect(panel).not.toBeVisible()
    } else {
      const classes = await panel.getAttribute('class')
      if (classes) {
        expect(classes).toContain('hidden')
        expect(classes).toContain('md:block')
      } else {
        throw new Error('Panel classes not found')
      }
    }
  }

  async closeMobile() {
    const closeButton = this.page.locator('button[aria-label="關閉面板"]')
    if (await closeButton.isVisible()) {
      await closeButton.click()
    }
  }

  async expectMobileLayout() {
    const panel = this.page.locator('aside').nth(1)
    await expect(panel).toHaveClass(/fixed/)
    await expect(panel).toHaveClass(/bottom-16/)
  }

  async expectDesktopLayout() {
    const panel = this.page.locator('aside').nth(1)
    await expect(panel).toHaveClass(/md:relative/)
  }
}
