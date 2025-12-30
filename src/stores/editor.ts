import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import type { FabricObject } from 'fabric'

export type TabType = 'bg' | 'text' | 'decor' | 'crop'

export const useEditorStore = defineStore('editor', () => {
  const canvas = shallowRef<any>(null)
  const activeTab = ref<TabType>('bg')
  const activeObject = shallowRef<FabricObject | null>(null)
  const zoomLevel = ref(1)
  const cropRect = shallowRef<FabricObject | null>(null)
  const currentBgUrl = ref<string | null>(null)

  const isTextSelected = computed(() => {
    return activeObject.value?.type === 'i-text'
  })

  const panelTitles = {
    bg: '背景設定',
    text: '文字編輯',
    decor: '裝飾圖庫',
    crop: '圖片裁切',
  }

  function setCanvas(c: any) {
    canvas.value = c
  }

  function setActiveTab(tab: TabType) {
    activeTab.value = tab
  }

  function setActiveObject(obj: FabricObject | null) {
    activeObject.value = obj
  }

  function setZoom(level: number) {
    zoomLevel.value = Math.max(0.1, Math.min(3, level))
  }

  function setCropRect(rect: FabricObject | null) {
    cropRect.value = rect
  }

  function setCurrentBgUrl(url: string | null) {
    currentBgUrl.value = url
  }

  return {
    canvas,
    activeTab,
    activeObject,
    zoomLevel,
    cropRect,
    currentBgUrl,
    isTextSelected,
    panelTitles,
    setCanvas,
    setActiveTab,
    setActiveObject,
    setZoom,
    setCropRect,
    setCurrentBgUrl,
  }
})
