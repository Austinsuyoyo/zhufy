import { debounce } from './debounce'

export type FilterType = 'blur' | 'brightness' | 'contrast'

export interface BackgroundFilterValues {
  blur: number
  brightness: number
  contrast: number
}

/**
 * Reads the current blur/brightness/contrast back off a fabric background
 * image's filter list. Each fabric filter instance carries its value on a
 * like-named property (Blur.blur, Brightness.brightness, Contrast.contrast),
 * so the panel can re-sync its sliders on remount instead of assuming 0 —
 * which would show "0%" over a still-filtered image after a tab switch.
 */
export function readBackgroundFilters(img: unknown): BackgroundFilterValues {
  const values: BackgroundFilterValues = { blur: 0, brightness: 0, contrast: 0 }
  const filters = (img as { filters?: unknown })?.filters
  if (!Array.isArray(filters)) return values
  for (const f of filters) {
    if (typeof f?.blur === 'number') values.blur = f.blur
    if (typeof f?.brightness === 'number') values.brightness = f.brightness
    if (typeof f?.contrast === 'number') values.contrast = f.contrast
  }
  return values
}

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
