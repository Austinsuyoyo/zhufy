import { Page } from '@playwright/test'

export type DeviceType = 'desktop' | 'mobile'

export function isMobile(viewportWidth: number): boolean {
  return viewportWidth < 768
}

export async function getDeviceType(page: Page): Promise<DeviceType> {
  const viewport = page.viewportSize()
  return viewport && viewport.width < 768 ? 'mobile' : 'desktop'
}

export async function expectMobileLayout(page: Page) {
  const viewport = page.viewportSize()
  if (!viewport || viewport.width >= 768) {
    throw new Error('Expected mobile layout but viewport width is >= 768px')
  }
}

export async function expectDesktopLayout(page: Page) {
  const viewport = page.viewportSize()
  if (!viewport || viewport.width < 768) {
    throw new Error('Expected desktop layout but viewport width is < 768px')
  }
}



