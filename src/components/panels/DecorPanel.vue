<template>
  <div class="space-y-6">
    <div class="space-y-3">
      <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">Emoji 表情</label>
      <div
        class="grid grid-cols-5 gap-2 text-2xl bg-gray-50 p-3 rounded-xl max-h-72 overflow-y-auto border border-gray-100"
      >
        <div
          v-for="emoji in CONFIG.emojis"
          :key="emoji"
          @click="addEmoji(emoji)"
          class="aspect-square flex items-center justify-center hover:bg-blue-100 rounded-lg transition cursor-pointer hover:scale-110 select-none"
        >
          {{ emoji }}
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">自定義貼圖</label>
      <button
        @click="fileInputRef?.click()"
        :disabled="isLoading"
        :class="[
          'w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-slate-700 font-bold transition flex items-center justify-center gap-2',
          { 'opacity-50 cursor-not-allowed': isLoading },
        ]"
      >
        <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
        <ImagePlus v-else class="w-4 h-4" />
        {{ isLoading ? '上傳中...' : '上傳 PNG / JPG' }}
      </button>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleStickerUpload"
      />
      <p class="text-xs text-center text-gray-600">建議使用透明背景 PNG 圖片</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ImagePlus, Loader2 } from 'lucide-vue-next'
import * as fabric from 'fabric'
import { useEditorStore } from '../../stores/editor'
import { CONFIG } from '../../config/constants'
import { requestRender } from '../../utils/renderManager'
import { isMobile } from '../../utils/device'

const store = useEditorStore()
const fileInputRef = ref<HTMLInputElement>()
const isLoading = ref(false)

const addEmoji = (emoji: string) => {
  const canvas = store.canvas
  if (!canvas) return

  const text = new fabric.IText(emoji, {
    left: canvas.width / 2,
    top: canvas.height / 2,
    originX: 'center',
    originY: 'center',
    fontFamily: 'Zen Maru Gothic',
    fill: '#ff0000',
    stroke: '#ffffff',
    strokeWidth: 2,
    fontSize: 80,
    fontWeight: '900',
    paintFirst: 'stroke',
  })

  canvas.add(text)
  canvas.setActiveObject(text)
  requestRender(canvas)
  store.setActiveObject(text)

  if (isMobile()) {
    store.panelVisible = false
  }
}

const handleStickerUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const canvas = store.canvas
  if (!canvas) return

  isLoading.value = true
  const reader = new FileReader()
  reader.onload = async (f) => {
    try {
      const result = f.target?.result
      if (!result) return

      const img = await fabric.Image.fromURL(result as string)
      img.scaleToWidth(150)
      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
      })

      canvas.add(img)
      canvas.setActiveObject(img)
      requestRender(canvas)
      store.setActiveObject(img)

      if (isMobile()) {
        store.panelVisible = false
      }
    } catch (error) {
      console.error('Sticker upload failed', error)
    } finally {
      isLoading.value = false
    }
  }
  reader.onerror = () => {
    isLoading.value = false
  }
  reader.readAsDataURL(file)
  ;(e.target as HTMLInputElement).value = ''
}
</script>
