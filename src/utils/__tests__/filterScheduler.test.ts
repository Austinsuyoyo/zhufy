import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { createFilterScheduler } from '../filterScheduler'

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
