import { Page, Locator, expect } from '@playwright/test'

export class EditorPage {
  readonly page: Page
  readonly canvas: Locator
  readonly sidebar: Sidebar
  readonly toolbar: Toolbar
  readonly panel: Panel

  constructor(page: Page) {
    this.page = page
    this.canvas = page.locator('#c')
    this.sidebar = new Sidebar(page)
    this.toolbar = new Toolbar(page)
    this.panel = new Panel(page)
  }

  async goto() {
    await this.page.goto('/')
    await expect(this.canvas).toBeVisible()
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
      crop: '裁切'
    }
    await this.page.click(`button:has-text("${tabMap[tab]}")`)
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
    this.page.on('dialog', dialog => dialog.accept())
    await this.page.click('button:has-text("重置")')
  }

  async clickZoomIn() {
    await this.page.click('button[title="放大"]')
  }

  async clickZoomOut() {
    await this.page.click('button[title="縮小"]')
  }

  getZoomText() {
    return this.page.locator('text=/Zoom: \\d+%/')
  }

  async expectZoom(expected: string | RegExp) {
    await expect(this.getZoomText()).toContainText(expected)
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
    const emojis = this.page.locator('div:has-text("🌺"), div:has-text("🌹"), div:has-text("🌸")')
    await emojis.nth(index).click()
  }

  async expectEmojiCountGreaterThan(count: number) {
    const emojis = this.page.locator('div:has-text("🌺"), div:has-text("🌹"), div:has-text("🌸")')
    const emojiCount = await emojis.count()
    expect(emojiCount).toBeGreaterThan(count)
  }
}

