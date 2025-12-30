import { test } from './fixtures/editor'

test.describe('裝飾功能', () => {
  test('添加 Emoji', async ({ editor }) => {
    await editor.sidebar.clickDecor()
    await editor.panel.expectPanelTitle('裝飾圖庫')
    await editor.panel.expectEmojiCountGreaterThan(0)
    await editor.panel.clickEmoji(0)
  })
})

