import { test as base } from '@playwright/test'
import { EditorPage } from '../pages/EditorPage'
import { getDeviceType, DeviceType, isMobile } from '../utils/device'

export const test = base.extend<{
  editor: EditorPage
  deviceType: DeviceType
}>({
  editor: async ({ page }, use) => {
    const editor = new EditorPage(page)
    await editor.goto()
    await use(editor)
  },
  deviceType: async ({ page, viewport }, use) => {
    const width = viewport?.width || page.viewportSize()?.width || 1920
    const deviceType: DeviceType = isMobile(width) ? 'mobile' : 'desktop'
    await use(deviceType)
  },
})

export { expect } from '@playwright/test'
