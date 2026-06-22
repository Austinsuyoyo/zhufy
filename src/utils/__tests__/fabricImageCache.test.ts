import { describe, test, expect, beforeEach, vi } from 'vitest'

// Mock fabric so the cache logic can be tested without a real canvas/DOM.
vi.mock('fabric', () => ({
  Image: { fromURL: vi.fn() },
}))

import * as fabric from 'fabric'
import { loadFabricImage, clearFabricImageCache } from '../fabricImageCache'

const fromURL = fabric.Image.fromURL as unknown as ReturnType<typeof vi.fn>

const fakeImg = (url: string) => ({
  _url: url,
  clone: () => ({ _url: url, _clone: true }),
  dispose: vi.fn(),
})

beforeEach(() => {
  clearFabricImageCache()
  fromURL.mockReset()
  fromURL.mockImplementation(async (url: string) => fakeImg(url))
})

describe('loadFabricImage cache (LRU, max 10)', () => {
  test('a repeat load is a cache hit — no second fetch', async () => {
    await loadFabricImage('a')
    await loadFabricImage('a')
    expect(fromURL).toHaveBeenCalledTimes(1)
  })

  test('evicts the oldest once past the limit', async () => {
    for (let i = 0; i < 11; i++) await loadFabricImage('u' + i) // u0 falls out
    expect(fromURL).toHaveBeenCalledTimes(11)

    await loadFabricImage('u10') // most recent → still cached
    expect(fromURL).toHaveBeenCalledTimes(11)

    await loadFabricImage('u0') // evicted → refetched
    expect(fromURL).toHaveBeenCalledTimes(12)
  })

  test('a cache hit refreshes recency so it survives the next eviction', async () => {
    for (let i = 0; i < 10; i++) await loadFabricImage('u' + i) // full: u0..u9
    await loadFabricImage('u0') // hit → u0 now most-recent
    expect(fromURL).toHaveBeenCalledTimes(10)

    await loadFabricImage('u10') // evicts the now-oldest, u1
    await loadFabricImage('u0') // still cached
    expect(fromURL).toHaveBeenCalledTimes(11)

    await loadFabricImage('u1') // u1 was evicted → refetched
    expect(fromURL).toHaveBeenCalledTimes(12)
  })

  test('clear disposes cached images and forces a refetch', async () => {
    const img = await loadFabricImage('a')
    expect(img).toBeTruthy()
    clearFabricImageCache()
    await loadFabricImage('a')
    expect(fromURL).toHaveBeenCalledTimes(2)
  })
})
