import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { createFilterScheduler, readBackgroundFilters } from '../filterScheduler'

// BackgroundPanel drives three sliders (blur / brightness / contrast). Moving
// two of them inside the debounce window must apply BOTH — the old single
// shared debounce dropped whichever update came first.
beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('createFilterScheduler', () => {
  test('two different filters within the debounce window both apply', () => {
    const applied: Record<string, number> = {}
    const schedule = createFilterScheduler((type, value) => {
      applied[type] = value
    }, 150)

    schedule('blur', 5)
    vi.advanceTimersByTime(50)
    schedule('brightness', 10)
    vi.advanceTimersByTime(150)

    expect(applied).toEqual({ blur: 5, brightness: 10 })
  })

  test('rapid updates to the same filter still coalesce to the last value', () => {
    const calls: number[] = []
    const schedule = createFilterScheduler((_type, value) => {
      calls.push(value)
    }, 150)

    schedule('blur', 1)
    vi.advanceTimersByTime(50)
    schedule('blur', 2)
    vi.advanceTimersByTime(50)
    schedule('blur', 3)
    vi.advanceTimersByTime(150)

    // One slider drag = one applied value (the latest), not three.
    expect(calls).toEqual([3])
  })
})

describe('readBackgroundFilters (re-sync sliders to the image)', () => {
  // Repro: set blur to 40%, switch to the text tab, switch back. The panel
  // unmounts on tab switch so its local refs reset to 0, but the fabric Blur
  // filter is still on the image. On remount the panel must read the real
  // values back (blur 0.4), or the slider lies "0%" over a blurred image.
  test('reads current blur/brightness/contrast back off the image', () => {
    const img = { filters: [{ blur: 0.4 }, { brightness: 0.2 }] }
    expect(readBackgroundFilters(img)).toEqual({ blur: 0.4, brightness: 0.2, contrast: 0 })
  })

  test('no filters → all zero', () => {
    expect(readBackgroundFilters({ filters: [] })).toEqual({ blur: 0, brightness: 0, contrast: 0 })
  })

  test('tolerates a missing or filter-less image', () => {
    expect(readBackgroundFilters(null)).toEqual({ blur: 0, brightness: 0, contrast: 0 })
    expect(readBackgroundFilters({})).toEqual({ blur: 0, brightness: 0, contrast: 0 })
  })
})
