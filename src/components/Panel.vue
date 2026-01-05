<template>
  <aside
    ref="panelRef"
    :class="[
      'md:w-80 w-full bg-white md:border-l border-t border-gray-200 flex flex-col shrink-0 z-10',
      'md:relative fixed bottom-16 md:bottom-auto left-0 right-0 top-auto md:top-auto',
      'md:h-auto h-[50vh]',
      panelClass,
    ]"
  >
    <!-- Swipe down handle (mobile only) - touch events only -->
    <div
      class="md:hidden flex justify-center py-3 cursor-grab active:cursor-grabbing"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
    </div>
    <div class="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-gray-50">
      <h2 class="text-lg font-bold text-slate-700">{{ store.panelTitles[activeTab] }}</h2>
      <button
        @click="store.panelVisible = false"
        class="md:hidden w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition"
        aria-label="關閉面板"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
    <div class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8">
      <BackgroundPanel v-if="activeTab === 'bg'" />
      <TextPanel v-if="activeTab === 'text'" />
      <DecorPanel v-if="activeTab === 'decor'" />
      <CropPanel v-if="activeTab === 'crop'" />
    </div>
    <div class="border-t border-gray-100 px-6 py-3 hidden md:block">
      <p class="text-xs text-gray-400 text-center">
        © 2025
        <a
          href="https://github.com/austinsuyoyo"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-600 transition-colors"
        >
          austinsuyoyo
        </a>
        . All rights reserved.
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { X } from 'lucide-vue-next'
import { useEditorStore } from '../stores/editor'
import BackgroundPanel from './panels/BackgroundPanel.vue'
import TextPanel from './panels/TextPanel.vue'
import DecorPanel from './panels/DecorPanel.vue'
import CropPanel from './panels/CropPanel.vue'

defineOptions({
  name: 'EditorPanel',
})

const store = useEditorStore()
const { panelVisible, activeTab } = storeToRefs(store)

const panelClass = computed(() => {
  return panelVisible.value ? 'block' : 'hidden md:block'
})

// Swipe to close gesture handling
const panelRef = ref<HTMLElement | null>(null)
const touchStartY = ref(0)
const touchCurrentY = ref(0)
const isSwiping = ref(false)

const SWIPE_THRESHOLD = 80 // Minimum distance to trigger close

const onTouchStart = (e: TouchEvent) => {
  // Only enable swipe on mobile
  if (window.innerWidth >= 768) return
  
  const touch = e.touches[0]
  if (!touch) return
  
  touchStartY.value = touch.clientY
  touchCurrentY.value = touch.clientY
  isSwiping.value = true
}

const onTouchMove = (e: TouchEvent) => {
  if (!isSwiping.value) return
  
  const touch = e.touches[0]
  if (!touch) return
  
  touchCurrentY.value = touch.clientY
  const deltaY = touchCurrentY.value - touchStartY.value
  
  // Only allow downward swipe and apply transform
  if (deltaY > 0 && panelRef.value) {
    panelRef.value.style.transform = `translateY(${Math.min(deltaY, 150)}px)`
    panelRef.value.style.transition = 'none'
  }
}

const onTouchEnd = () => {
  if (!isSwiping.value) return
  
  const deltaY = touchCurrentY.value - touchStartY.value
  
  if (panelRef.value) {
    panelRef.value.style.transition = 'transform 0.2s ease-out'
    panelRef.value.style.transform = 'translateY(0)'
  }
  
  // Close panel if swipe distance exceeds threshold
  if (deltaY > SWIPE_THRESHOLD) {
    store.panelVisible = false
  }
  
  isSwiping.value = false
}
</script>
