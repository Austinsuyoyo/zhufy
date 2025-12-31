<template>
  <aside
    class="md:w-20 w-full md:h-auto h-16 bg-white md:border-r md:border-b border-gray-200 flex md:flex-col flex-row z-10 shrink-0 shadow-sm md:relative fixed bottom-0 left-0 right-0"
  >
    <button
      @click="switchTab('bg')"
      :disabled="isCropping"
      :class="[
        'tab-btn',
        'tab-bg',
        'md:h-20 h-16',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-1',
        'text-gray-500',
        'flex-1',
        'md:flex-none',
        { active: store.activeTab === 'bg' },
        { 'opacity-40 cursor-not-allowed': isCropping && store.activeTab !== 'bg' },
      ]"
    >
      <Image class="w-5 h-5 md:w-6 md:h-6" />
      <span class="text-xs font-bold">素材</span>
    </button>
    <button
      @click="switchTab('text')"
      :disabled="isCropping"
      :class="[
        'tab-btn',
        'tab-text',
        'md:h-20 h-16',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-1',
        'text-gray-500',
        'flex-1',
        'md:flex-none',
        { active: store.activeTab === 'text' },
        { 'opacity-40 cursor-not-allowed': isCropping && store.activeTab !== 'text' },
      ]"
    >
      <Type class="w-5 h-5 md:w-6 md:h-6" />
      <span class="text-xs font-bold">文字</span>
    </button>
    <button
      @click="switchTab('decor')"
      :disabled="isCropping"
      :class="[
        'tab-btn',
        'tab-decor',
        'md:h-20 h-16',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-1',
        'text-gray-500',
        'flex-1',
        'md:flex-none',
        { active: store.activeTab === 'decor' },
        { 'opacity-40 cursor-not-allowed': isCropping && store.activeTab !== 'decor' },
      ]"
    >
      <Sticker class="w-5 h-5 md:w-6 md:h-6" />
      <span class="text-xs font-bold">裝飾</span>
    </button>
    <button
      @click="switchTab('crop')"
      :class="[
        'tab-btn',
        'tab-crop',
        'md:h-20 h-16',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-1',
        'text-gray-500',
        'flex-1',
        'md:flex-none',
        { active: store.activeTab === 'crop' },
      ]"
    >
      <Crop class="w-5 h-5 md:w-6 md:h-6" />
      <span class="text-xs font-bold">裁切</span>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Image, Type, Sticker, Crop } from 'lucide-vue-next'
import { useEditorStore } from '../stores/editor'

defineOptions({
  name: 'EditorSidebar',
})

const store = useEditorStore()

const isCropping = computed(() => !!store.cropRect)

const switchTab = (tab: 'bg' | 'text' | 'decor' | 'crop') => {
  if (isCropping.value && tab !== 'crop') return
  store.setActiveTab(tab)
}
</script>
