<template>
  <nav
    class="h-14 md:h-16 bg-white border-b border-gray-200 text-slate-800 flex items-center justify-between px-3 md:px-6 shadow-sm z-20 shrink-0"
  >
    <div class="flex items-center gap-2 md:gap-3">
      <Sparkles class="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
      <h1 class="text-base md:text-xl font-bold tracking-wider hidden sm:block">長輩圖產生器</h1>
      <h1 class="text-base md:text-xl font-bold tracking-wider sm:hidden">長輩圖</h1>
      <a
        href="https://github.com/austinsuyoyo"
        target="_blank"
        rel="noopener noreferrer"
        class="github-link text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
        aria-label="GitHub"
      >
        <Github class="w-5 h-5" />
      </a>
    </div>
    <div class="flex items-center gap-2 md:gap-4">
      <button
        @click="showResetModal = true"
        class="flex items-center gap-1 md:gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-1.5 md:py-2 px-2 md:px-4 rounded-lg transition shadow-lg hover:shadow-orange-500/50 text-sm md:text-base"
        aria-label="重置畫布"
      >
        <RefreshCw class="w-4 h-4 md:w-5 md:h-5" />
        <span class="hidden sm:inline" aria-hidden="true">重置</span>
      </button>
      <div class="relative flex items-center">
        <button
          @click="handleDownload"
          class="flex items-center gap-1 md:gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 md:py-2 px-3 md:px-6 rounded-lg transition shadow-lg hover:shadow-blue-500/50 text-sm md:text-base"
          aria-label="下載圖片"
        >
          <Download class="w-4 h-4 md:w-5 md:h-5" />
          <span class="hidden sm:inline" aria-hidden="true">下載</span>
        </button>
        <button
          @click.stop="showResolutionMenu = !showResolutionMenu"
          class="ml-1 p-1.5 md:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          aria-label="選擇下載解析度"
          :aria-expanded="showResolutionMenu"
        >
          <ChevronDown class="w-3 h-3 md:w-4 md:h-4" />
        </button>
        <div
          v-if="showResolutionMenu"
          class="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[140px]"
        >
          <button
            v-for="res in resolutions"
            :key="res.value"
            @click="downloadWithResolution(res.value)"
            :class="[
              'w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition',
              downloadMultiplier === res.value
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'text-gray-700',
            ]"
          >
            {{ res.label }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmModal
      :visible="showResetModal"
      title="確認重置"
      message="確定要清除所有文字和裝飾嗎？背景將保留。"
      confirm-text="確認重置"
      cancel-text="取消"
      @confirm="confirmReset"
      @cancel="showResetModal = false"
    />
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Sparkles, RefreshCw, Download, ChevronDown, Github } from 'lucide-vue-next'
import * as fabric from 'fabric'
import { useEditorStore } from '../stores/editor'
import { requestRender } from '../utils/renderManager'
import ConfirmModal from './ConfirmModal.vue'

defineOptions({
  name: 'EditorToolbar',
})

const store = useEditorStore()

const showResolutionMenu = ref(false)
const downloadMultiplier = ref(1)
const showResetModal = ref(false)

const resolutions = [
  { label: '1x (原始)', value: 1 },
  { label: '1.5x (高解析)', value: 1.5 },
  { label: '2x (超高解析)', value: 2 },
  { label: '3x (最高解析)', value: 3 },
]

const confirmReset = () => {
  showResetModal.value = false
  const canvas = store.canvas
  if (!canvas) return

  const objects = canvas.getObjects()
  objects.forEach((obj: fabric.Object) => {
    if (obj.type !== 'rect' || obj !== store.cropRect) {
      canvas.remove(obj)
    }
  })
  canvas.discardActiveObject()
  requestRender(canvas)
}

const downloadWithResolution = (multiplier: number) => {
  downloadMultiplier.value = multiplier
  showResolutionMenu.value = false
  handleDownload()
}

const isIOS = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

const handleDownload = () => {
  const canvas = store.canvas
  if (!canvas) return

  const doDownload = () => {
    if (isIOS()) {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: downloadMultiplier.value,
      })
      const newWindow = window.open()
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>長按圖片保存</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #f5f5f5; font-family: system-ui; }
                img { max-width: 100%; height: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border-radius: 8px; }
                p { color: #666; margin-top: 20px; text-align: center; padding: 0 20px; }
              </style>
            </head>
            <body>
              <img src="${dataURL}" alt="長輩圖">
              <p>📱 長按圖片 → 選擇「加入照片」保存</p>
            </body>
          </html>
        `)
        newWindow.document.close()
      }
    } else {
      const canvasEl = canvas.toCanvasElement(downloadMultiplier.value)
      canvasEl.toBlob(
        (blob: Blob | null) => {
          if (!blob) return
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = `senior-greet-${Date.now()}.png`
          link.href = url
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        },
        'image/png',
        1,
      )
    }
  }

  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(doDownload)
  } else {
    setTimeout(doDownload, 0)
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('.relative')) {
    showResolutionMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.github-link svg {
  transition: transform 0.2s ease;
}

.github-link:hover svg {
  transform: scale(1.1);
}
</style>
