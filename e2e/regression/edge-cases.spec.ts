import { test, expect } from '../fixtures/editor'

test.describe('邊界條件測試', () => {
  test('空 canvas 狀態下操作不報錯', async ({ editor }) => {
    const canvas = editor.page.locator('canvas.upper-canvas')
    await expect(canvas).toBeVisible()

    await editor.page.evaluate(() => {
      const c = (window as any).__canvas
      if (c) {
        c.discardActiveObject()
        c.requestRenderAll()
      }
    })

    await expect(canvas).toBeVisible()
  })

  test('快速連續點擊側邊欄不應報錯', async ({ editor }) => {
    for (let i = 0; i < 5; i++) {
      await editor.sidebar.clickText()
      await editor.page.waitForTimeout(50)
    }

    const canvas = editor.page.locator('canvas.upper-canvas')
    await expect(canvas).toBeVisible()
  })

  test('重複點擊同一功能不應報錯', async ({ editor }) => {
    for (let i = 0; i < 3; i++) {
      await editor.sidebar.clickBackground()
      await editor.page.waitForTimeout(100)
    }
    const canvas = editor.page.locator('canvas.upper-canvas')
    await expect(canvas).toBeVisible()
  })

  test('快速切換面板', async ({ editor }) => {
    await editor.sidebar.clickBackground()
    await editor.page.waitForTimeout(100)
    await editor.sidebar.clickText()
    await editor.page.waitForTimeout(100)
    await editor.sidebar.clickDecor()
    await editor.page.waitForTimeout(100)
    await editor.sidebar.clickCrop()
    await editor.page.waitForTimeout(100)

    const canvas = editor.page.locator('canvas.upper-canvas')
    await expect(canvas).toBeVisible()
  })
})

test.describe('錯誤處理測試', () => {
  test('無效操作不應導致頁面崩潰', async ({ editor }) => {
    await editor.page.evaluate(() => {
      const c = (window as any).__canvas
      if (c) {
        c.discardActiveObject()
        c.requestRenderAll()
      }
    })

    const canvas = editor.page.locator('canvas.upper-canvas')
    await expect(canvas).toBeVisible()
  })

  test('刪除不存在的物件不應報錯', async ({ editor }) => {
    await editor.page.evaluate(() => {
      const c = (window as any).__canvas
      if (c) {
        c.discardActiveObject()
      }
    })

    await editor.page.evaluate(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Delete',
          bubbles: true,
        }),
      )
    })
    await editor.page.waitForTimeout(300)

    const canvas = editor.page.locator('canvas.upper-canvas')
    await expect(canvas).toBeVisible()
  })
})

test.describe('多物件操作', () => {
  test('添加多個文字後畫布正常', async ({ editor }) => {
    await editor.sidebar.clickText()

    for (let i = 0; i < 3; i++) {
      await editor.page.mouse.click(300 + i * 50, 300 + i * 50)
      await editor.page.waitForTimeout(200)
    }

    const canvas = editor.page.locator('canvas.upper-canvas')
    await expect(canvas).toBeVisible()
  })

  test('混合操作後畫布正常', async ({ editor }) => {
    await editor.sidebar.clickText()
    await editor.clickCanvasCenter()
    await editor.page.waitForTimeout(300)

    await editor.sidebar.clickDecor()
    await editor.page.waitForTimeout(200)

    const canvas = editor.page.locator('canvas.upper-canvas')
    await expect(canvas).toBeVisible()
  })
})
