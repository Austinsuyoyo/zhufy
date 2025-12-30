<template>
  <aside
    class="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 z-10 transition-all duration-300"
  >
    <div class="h-14 border-b border-gray-100 flex items-center px-6 bg-gray-50">
      <h2 class="text-lg font-bold text-slate-700">{{ store.panelTitles[store.activeTab] }}</h2>
    </div>
    <div class="flex-1 overflow-y-auto p-6 space-y-8">
      <BackgroundPanel v-if="store.activeTab === 'bg'" />
      <TextPanel v-if="store.activeTab === 'text'" />
      <DecorPanel v-if="store.activeTab === 'decor'" />
      <CropPanel v-if="store.activeTab === 'crop'" />
    </div>
    <div class="border-t border-gray-100 px-6 py-3">
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
import { useEditorStore } from '../stores/editor'
import BackgroundPanel from './panels/BackgroundPanel.vue'
import TextPanel from './panels/TextPanel.vue'
import DecorPanel from './panels/DecorPanel.vue'
import CropPanel from './panels/CropPanel.vue'

defineOptions({
  name: 'EditorPanel',
})

const store = useEditorStore()
</script>
