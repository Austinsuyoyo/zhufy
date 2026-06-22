import { describe, test, expect, beforeEach, vi } from 'vitest'

// Manual requestAnimationFrame queue so the test controls when a frame "fires".
// id is 1-based (the index in the queue + 1), matching browser rAF handle semantics.
let rafQueue: Array<((t: number) => void) | null>

beforeEach(() => {
  // renderManager holds module-level state (pendingRender / renderTimer).
  // Reset the module registry so each test re-evaluates that state from scratch.
  vi.resetModules()

  rafQueue = []
  globalThis.requestAnimationFrame = ((cb: (t: number) => void) => {
    rafQueue.push(cb)
    return rafQueue.length
  }) as typeof requestAnimationFrame
  globalThis.cancelAnimationFrame = ((id: number) => {
    rafQueue[id - 1] = null
  }) as typeof cancelAnimationFrame
})

function flushFrame() {
  const q = rafQueue
  rafQueue = []
  for (const cb of q) cb?.(0)
}

describe('requestRender batching (renderManager)', () => {
  // Repro for the latent stall: two callers (e.g. two filter watchers) fire
  // requestRender in the SAME frame before the rAF runs. The buggy version
  // cancels the scheduled frame on the 2nd call but never reschedules.
  test('two synchronous requestRender calls in one frame still paint once', async () => {
    const { requestRender } = await import('../renderManager')
    const canvas = { requestRenderAll: vi.fn() }

    requestRender(canvas)
    requestRender(canvas)

    flushFrame()

    expect(canvas.requestRenderAll).toHaveBeenCalledTimes(1)
  })

  // The bug isn't a one-frame glitch: once stalled, pendingRender stays true
  // and every later requestRender is silently dropped until forceRender().
  test('rendering keeps working after a double-call (no permanent stall)', async () => {
    const { requestRender } = await import('../renderManager')
    const canvas = { requestRenderAll: vi.fn() }

    requestRender(canvas)
    requestRender(canvas)
    flushFrame()

    // A later, unrelated update must also reach the canvas.
    requestRender(canvas)
    flushFrame()

    expect(canvas.requestRenderAll).toHaveBeenCalledTimes(2)
  })
})
