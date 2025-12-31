<template>
  <aside
    :class="[
      'md:w-80 w-full bg-white md:border-l border-t border-gray-200 flex flex-col shrink-0 z-10',
      'md:relative fixed bottom-16 md:bottom-auto left-0 right-0 top-auto md:top-auto',
      'md:h-auto h-[50vh]',
      panelClass,
    ]"
  >
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
import { computed } from 'vue'
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
</script>
