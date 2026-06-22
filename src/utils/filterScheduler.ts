import { debounce } from './debounce'

export type FilterType = 'blur' | 'brightness' | 'contrast'

/**
 * Returns a `schedule(type, value)` function backed by ONE debounce timer per
 * filter type. Adjusting one slider therefore never cancels a pending update
 * for a different slider — the previous single shared debounce dropped the
 * earlier filter whenever two sliders moved within the debounce window.
 */
export function createFilterScheduler(
  apply: (type: FilterType, value: number) => void,
  wait = 150,
) {
  const debounced: Record<FilterType, (type: FilterType, value: number) => void> = {
    blur: debounce(apply, wait),
    brightness: debounce(apply, wait),
    contrast: debounce(apply, wait),
  }
  return (type: FilterType, value: number) => debounced[type](type, value)
}
