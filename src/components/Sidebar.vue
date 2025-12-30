<template>
  <aside class="w-20 bg-white border-r border-gray-200 flex flex-col z-10 shrink-0 shadow-sm">
    <button
      @click="switchTab('bg')"
      :class="[
        'tab-btn',
        'tab-bg',
        'h-20',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-1',
        'text-gray-500',
        { active: store.activeTab === 'bg' },
      ]"
    >
      <Image class="w-6 h-6" />
      <span class="text-xs font-bold">素材</span>
    </button>
    <button
      @click="switchTab('text')"
      :class="[
        'tab-btn',
        'tab-text',
        'h-20',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-1',
        'text-gray-500',
        { active: store.activeTab === 'text' },
      ]"
    >
      <Type class="w-6 h-6" />
      <span class="text-xs font-bold">文字</span>
    </button>
    <button
      @click="switchTab('decor')"
      :class="[
        'tab-btn',
        'tab-decor',
        'h-20',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-1',
        'text-gray-500',
        { active: store.activeTab === 'decor' },
      ]"
    >
      <Sticker class="w-6 h-6" />
      <span class="text-xs font-bold">裝飾</span>
    </button>
    <button
      @click="switchTab('crop')"
      :class="[
        'tab-btn',
        'tab-crop',
        'h-20',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-1',
        'text-gray-500',
        { active: store.activeTab === 'crop' },
      ]"
    >
      <Crop class="w-6 h-6" />
      <span class="text-xs font-bold">裁切</span>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { Image, Type, Sticker, Crop } from 'lucide-vue-next'
import { useEditorStore } from '../stores/editor'

defineOptions({
  name: 'EditorSidebar',
})

const store = useEditorStore()

const switchTab = (tab: 'bg' | 'text' | 'decor' | 'crop') => {
  store.setActiveTab(tab)
}
</script>
