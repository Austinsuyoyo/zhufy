import { test as base } from '@playwright/test'
import { EditorPage } from '../pages/EditorPage'

export const test = base.extend<{
  editor: EditorPage
}>({
  editor: async ({ page }, use) => {
    const editor = new EditorPage(page)
    await editor.goto()
    await use(editor)
  }
})

export { expect } from '@playwright/test'

