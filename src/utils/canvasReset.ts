/**
 * Resets the editor canvas back to its original look:
 * - removes every object (text / decorations), except an optional rect to keep
 *   (the live crop selection, when reset is hit mid-crop),
 * - restores the background to the top-left and the canvas to the full image
 *   size, undoing any crop (crop only shifts the bg + shrinks the canvas; the
 *   bg keeps its intrinsic size and scale, so the original size is derivable),
 * - clears background filters (blur / brightness / contrast).
 *
 * The background photo itself is kept — only crop and filters are undone.
 */
export function resetCanvas(canvas: any, keep: unknown = null): void {
  if (!canvas) return

  for (const obj of [...canvas.getObjects()]) {
    if (obj === keep) continue
    canvas.remove(obj)
  }
  canvas.discardActiveObject?.()

  const bg = canvas.backgroundImage
  if (!bg) return

  if (Array.isArray(bg.filters) && bg.filters.length) {
    bg.filters = []
    bg.applyFilters?.()
  }

  bg.set?.({ left: 0, top: 0 })
  bg.setCoords?.()

  const width = (bg.width ?? 0) * (bg.scaleX ?? 1)
  const height = (bg.height ?? 0) * (bg.scaleY ?? 1)
  if (width && height) canvas.setDimensions({ width, height })
}
