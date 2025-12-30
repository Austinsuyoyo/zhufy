let renderTimer: number | null = null
let pendingRender = false

export function requestRender(canvas: any) {
  if (!canvas) return

  if (renderTimer) {
    cancelAnimationFrame(renderTimer)
  }

  if (!pendingRender) {
    pendingRender = true
    renderTimer = requestAnimationFrame(() => {
      canvas.requestRenderAll()
      pendingRender = false
      renderTimer = null
    })
  }
}

export function forceRender(canvas: any) {
  if (!canvas) return
  if (renderTimer) {
    cancelAnimationFrame(renderTimer)
    renderTimer = null
  }
  pendingRender = false
  canvas.requestRenderAll()
}
