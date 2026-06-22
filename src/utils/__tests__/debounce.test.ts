import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { debounce } from '../debounce'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('debounce', () => {
  test('fires once after the wait, with the latest args', () => {
    const fn = vi.fn()
    const d = debounce(fn, 100)

    d('a')
    d('b')
    d('c')
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })

  test('calls separated by more than the wait each fire', () => {
    const fn = vi.fn()
    const d = debounce(fn, 100)

    d(1)
    vi.advanceTimersByTime(100)
    d(2)
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(2)
  })

  test('a call within the window resets the timer', () => {
    const fn = vi.fn()
    const d = debounce(fn, 100)

    d()
    vi.advanceTimersByTime(80)
    d() // resets — needs another full 100ms
    vi.advanceTimersByTime(80)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(20)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
