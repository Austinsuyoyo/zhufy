import * as fabric from 'fabric'

const fabricImageCache = new Map<string, fabric.Image>()
const MAX_CACHE_SIZE = 10
const accessOrder: string[] = []

function evictOldest() {
  if (accessOrder.length > 0) {
    const oldest = accessOrder.shift()!
    fabricImageCache.delete(oldest)
  }
}

export async function loadFabricImage(url: string): Promise<fabric.Image> {
  if (fabricImageCache.has(url)) {
    const cached = fabricImageCache.get(url)!
    const index = accessOrder.indexOf(url)
    if (index > -1) {
      accessOrder.splice(index, 1)
    }
    accessOrder.push(url)
    return cached.clone() as unknown as fabric.Image
  }

  const img = await fabric.Image.fromURL(url, { crossOrigin: 'anonymous' })

  if (fabricImageCache.size >= MAX_CACHE_SIZE) {
    evictOldest()
  }
  fabricImageCache.set(url, img)
  accessOrder.push(url)

  return img.clone() as unknown as fabric.Image
}

export function clearFabricImageCache() {
  fabricImageCache.forEach((img) => img.dispose?.())
  fabricImageCache.clear()
  accessOrder.length = 0
}
