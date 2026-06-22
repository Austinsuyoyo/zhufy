import { describe, test, expect, vi } from 'vitest'
import { resetCanvas } from '../canvasReset'

// Minimal fabric-canvas stand-in.
function makeCanvas(objects: unknown[], bg: Record<string, unknown> | null) {
  const list = [...objects]
  return {
    backgroundImage: bg,
    dims: null as null | { width: number; height: number },
    getObjects: () => list,
    remove: (o: unknown) => {
      const i = list.indexOf(o)
      if (i >= 0) list.splice(i, 1)
    },
    discardActiveObject: vi.fn(),
    setDimensions: vi.fn(function (this: { dims: unknown }, d: unknown) {
      this.dims = d as { width: number; height: number }
    }),
  }
}

// A background carrying a crop offset + filters, like the state after the user
// cropped (bg shifted, canvas shrunk) and applied a blur.
function croppedBg() {
  return {
    width: 1000,
    height: 800,
    scaleX: 1,
    scaleY: 1,
    left: -120,
    top: -80,
    filters: [{ blur: 0.4 }],
    set(o: Record<string, number>) {
      Object.assign(this, o)
    },
    setCoords: vi.fn(),
    applyFilters: vi.fn(),
  }
}

describe('resetCanvas', () => {
  test('after a crop, restores the canvas to the full image size', () => {
    const canvas = makeCanvas([{ type: 'i-text' }], croppedBg())
    resetCanvas(canvas)
    expect(canvas.setDimensions).toHaveBeenCalledWith({ width: 1000, height: 800 })
  })

  test('moves the background back to the top-left (un-crop)', () => {
    const bg = croppedBg()
    resetCanvas(makeCanvas([], bg))
    expect(bg.left).toBe(0)
    expect(bg.top).toBe(0)
  })

  test('clears background filters (image back to original look)', () => {
    const bg = croppedBg()
    resetCanvas(makeCanvas([], bg))
    expect(bg.filters).toEqual([])
    expect(bg.applyFilters).toHaveBeenCalled()
  })

  test('removes text/decor objects', () => {
    const canvas = makeCanvas([{ type: 'i-text' }, { type: 'image' }], croppedBg())
    resetCanvas(canvas)
    expect(canvas.getObjects()).toHaveLength(0)
    expect(canvas.discardActiveObject).toHaveBeenCalled()
  })

  test('keeps the crop rect when one is passed (reset mid-crop)', () => {
    const rect = { type: 'rect' }
    const canvas = makeCanvas([{ type: 'i-text' }, rect], croppedBg())
    resetCanvas(canvas, rect)
    expect(canvas.getObjects()).toEqual([rect])
  })

  test('no-ops safely with no canvas or no background', () => {
    expect(() => resetCanvas(null)).not.toThrow()
    const bare = makeCanvas([{ type: 'i-text' }], null)
    resetCanvas(bare)
    expect(bare.getObjects()).toHaveLength(0)
    expect(bare.setDimensions).not.toHaveBeenCalled()
  })

  test('skips the filter-clear path when there are no filters', () => {
    const bg = { ...croppedBg(), filters: [] as unknown[] }
    bg.applyFilters = vi.fn()
    resetCanvas(makeCanvas([], bg))
    expect(bg.applyFilters).not.toHaveBeenCalled()
    expect(bg.left).toBe(0)
  })

  test('tolerates a background missing optional methods', () => {
    // filters present but no applyFilters/set/setCoords; canvas has no discardActiveObject
    const bg: Record<string, unknown> = {
      width: 600,
      height: 400,
      scaleX: 1,
      scaleY: 1,
      filters: [{ blur: 0.4 }],
    }
    const canvas = {
      backgroundImage: bg,
      setDimensions: vi.fn(),
      getObjects: () => [] as unknown[],
      remove: vi.fn(),
    }
    expect(() => resetCanvas(canvas)).not.toThrow()
    expect(bg.filters).toEqual([])
    expect(canvas.setDimensions).toHaveBeenCalledWith({ width: 600, height: 400 })
  })

  test('does not resize when the background size is missing/zero', () => {
    const bg = {
      width: undefined,
      height: undefined,
      scaleX: 1,
      scaleY: 1,
      filters: [] as unknown[],
      set: vi.fn(),
      setCoords: vi.fn(),
    }
    const canvas = makeCanvas([], bg)
    resetCanvas(canvas)
    expect(canvas.setDimensions).not.toHaveBeenCalled()
  })
})
