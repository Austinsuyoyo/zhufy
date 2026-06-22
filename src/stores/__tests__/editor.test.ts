import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEditorStore } from '../editor'

beforeEach(() => setActivePinia(createPinia()))
afterEach(() => {
  delete (globalThis as { window?: unknown }).window
})

describe('editor store', () => {
  test('setZoom clamps to [0.1, 3]', () => {
    const s = useEditorStore()
    s.setZoom(0.01)
    expect(s.zoomLevel).toBe(0.1)
    s.setZoom(99)
    expect(s.zoomLevel).toBe(3)
    s.setZoom(1.5)
    expect(s.zoomLevel).toBe(1.5)
  })

  test('setActiveTab: switching opens the panel, re-tapping the same tab toggles it', () => {
    const s = useEditorStore()
    s.panelVisible = false

    s.setActiveTab('text')
    expect(s.activeTab).toBe('text')
    expect(s.panelVisible).toBe(true)

    s.setActiveTab('text') // same tab → collapse
    expect(s.panelVisible).toBe(false)

    s.setActiveTab('text') // same tab → expand again
    expect(s.panelVisible).toBe(true)

    s.setActiveTab('decor') // different tab → switch + stay open
    expect(s.activeTab).toBe('decor')
    expect(s.panelVisible).toBe(true)
  })

  test('isTextSelected only when the active object is i-text', () => {
    const s = useEditorStore()
    expect(s.isTextSelected).toBe(false)

    s.setActiveObject({ type: 'i-text' } as never)
    expect(s.isTextSelected).toBe(true)

    s.setActiveObject({ type: 'rect' } as never)
    expect(s.isTextSelected).toBe(false)

    s.setActiveObject(null)
    expect(s.isTextSelected).toBe(false)
  })

  test('panelVisible defaults open on desktop widths (window-init branch)', () => {
    ;(globalThis as { window?: unknown }).window = { innerWidth: 1024 }
    setActivePinia(createPinia())
    expect(useEditorStore().panelVisible).toBe(true)
  })

  test('setCanvas / setCropRect / setCurrentBgUrl update their refs', () => {
    const s = useEditorStore()
    const canvas = {} as never
    s.setCanvas(canvas)
    expect(s.canvas).toBe(canvas)

    const rect = {} as never
    s.setCropRect(rect)
    expect(s.cropRect).toBe(rect)

    s.setCurrentBgUrl('lotus.webp')
    expect(s.currentBgUrl).toBe('lotus.webp')
    s.setCurrentBgUrl(null)
    expect(s.currentBgUrl).toBe(null)
  })
})
