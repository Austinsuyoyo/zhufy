import { Page } from '@playwright/test'

export async function waitForDownload(page: Page, timeout = 10000) {
  return page.waitForEvent('download', { timeout })
}

export async function simulateCanvasWheelZoom(
  page: Page,
  canvas: { x: number; y: number; width: number; height: number },
  deltaY: number,
) {
  const centerX = canvas.x + canvas.width / 2
  const centerY = canvas.y + canvas.height / 2

  await page.mouse.move(centerX, centerY)
  await page.keyboard.down('Control')
  await page.mouse.wheel(0, deltaY)
  await page.keyboard.up('Control')
}

export async function dragCanvasCorner(
  page: Page,
  canvas: { x: number; y: number; width: number; height: number },
  offsetX: number,
  offsetY: number,
) {
  const cornerOffset = 15
  const cornerX = canvas.x + canvas.width - cornerOffset
  const cornerY = canvas.y + canvas.height - cornerOffset

  await page.mouse.move(cornerX, cornerY)
  await page.mouse.down()
  await page.mouse.move(cornerX + offsetX, cornerY + offsetY, { steps: 10 })
  await page.mouse.up()
}

export async function dragObjectCorner(
  page: Page,
  canvas: { x: number; y: number; width: number; height: number },
  offsetX: number,
  offsetY: number,
) {
  const cornerPos = await page.evaluate(() => {
    const app = (window as any).__VUE_APP__ || (document.querySelector('#app') as any)?.__vue_app__
    if (!app) return null
    const pinia =
      app.config?.globalProperties?.$pinia ||
      app._instance?.appContext?.config?.globalProperties?.$pinia
    if (!pinia) return null
    const store = pinia._s?.get('editor')
    if (!store || !store.canvas) return null
    const fabricCanvas = store.canvas
    const obj = fabricCanvas.getActiveObject()
    if (!obj) return null

    const canvasEl = document.getElementById('c')
    if (!canvasEl) return null
    const container = canvasEl.parentElement
    if (!container) return null
    const upperCanvas = container.querySelector('.upper-canvas') as HTMLCanvasElement
    if (!upperCanvas) return null

    const aCoords = obj.aCoords
    if (!aCoords || !aCoords.br) return null

    const br = aCoords.br
    const containerBox = container.getBoundingClientRect()
    const upperBox = upperCanvas.getBoundingClientRect()
    const zoom = store.zoomLevel || 1

    const canvasWidth = fabricCanvas.width
    const canvasHeight = fabricCanvas.height

    const scaleX = upperBox.width / canvasWidth
    const scaleY = upperBox.height / canvasHeight

    const centerX = containerBox.left + containerBox.width / 2
    const centerY = containerBox.top + containerBox.height / 2

    const relativeX = br.x * scaleX * zoom - (canvasWidth * scaleX * zoom) / 2
    const relativeY = br.y * scaleY * zoom - (canvasHeight * scaleY * zoom) / 2

    const screenX = centerX + relativeX
    const screenY = centerY + relativeY

    return { x: screenX, y: screenY }
  })

  if (!cornerPos) return

  const cornerOffset = 6
  const cornerX = cornerPos.x - cornerOffset
  const cornerY = cornerPos.y - cornerOffset

  await page.mouse.move(cornerX, cornerY)
  await page.waitForTimeout(100)
  await page.mouse.down()
  await page.mouse.move(cornerX + offsetX, cornerY + offsetY, { steps: 20 })
  await page.mouse.up()
  await page.waitForTimeout(200)
}

export async function drawCropRect(
  page: Page,
  canvas: { x: number; y: number; width: number; height: number },
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) {
  await page.mouse.move(canvas.x + startX, canvas.y + startY)
  await page.mouse.down()
  await page.mouse.move(canvas.x + endX, canvas.y + endY)
  await page.mouse.up()
}
