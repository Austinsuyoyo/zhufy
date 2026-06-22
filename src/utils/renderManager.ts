let renderTimer: number | null = null
let pendingRender = false

export function requestRender(canvas: any) {
  if (!canvas) return

  // A frame is already scheduled — coalesce into it instead of cancelling and
  // re-scheduling. (Cancelling without re-scheduling left pendingRender stuck
  // true, permanently dropping every later render until forceRender ran.)
  if (pendingRender) return

  pendingRender = true
  renderTimer = requestAnimationFrame(() => {
    canvas.requestRenderAll()
    pendingRender = false
    renderTimer = null
  })
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
