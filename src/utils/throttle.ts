export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  } as T
}

export function throttleRAF<T extends (...args: any[]) => any>(func: T): T {
  let rafId: number | null = null

  return function executedFunction(...args: Parameters<T>) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func(...args)
        rafId = null
      })
    }
  } as T
}
