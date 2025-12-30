import { test, expect } from './fixtures/editor'
import { waitForDownload } from './utils/helpers'

test.describe('工具欄功能', () => {
  test('下載功能', async ({ editor, browserName }) => {
    test.skip(browserName === 'webkit', 'WebKit download not supported')
    const downloadPromise = waitForDownload(editor.page)
    await editor.toolbar.clickDownload()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain('senior-greet')
  })

  test('重置功能', async ({ editor }) => {
    await editor.toolbar.clickReset()
    await expect(editor.canvas).toBeVisible()
  })
})

