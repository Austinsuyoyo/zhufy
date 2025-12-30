<template>
  <div class="space-y-6">
    <div class="space-y-3">
      <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">精選背景</label>
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="bg in CONFIG.backgrounds"
          :key="bg.url"
          @click="loadBackground(bg.url)"
          class="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-blue-400 transition relative group shadow-sm"
        >
          <img
            :src="bg.url"
            :alt="getBackgroundAlt(bg.url)"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div
            class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>
        </div>
      </div>
      <button
        @click="setRandomBg"
        class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2 text-sm font-bold"
      >
        <Shuffle class="w-4 h-4" />
        隨機更換
      </button>
    </div>

    <div class="space-y-3">
      <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">自定義背景</label>
      <button
        @click="fileInputRef?.click()"
        class="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-slate-700 font-bold transition flex items-center justify-center gap-2"
      >
        <Upload class="w-4 h-4" />
        上傳圖片
      </button>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileUpload"
      />
    </div>

    <div class="space-y-4 border-t border-gray-100 pt-6">
      <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">照片濾鏡</label>

      <div class="space-y-1">
        <div class="flex justify-between text-xs font-bold text-gray-600">
          <label for="blur-slider">模糊 (Blur)</label>
          <span class="text-blue-600">{{ blurValue }}</span>
        </div>
        <input
          id="blur-slider"
          v-model.number="blurValue"
          type="range"
          min="0"
          max="1"
          step="0.05"
          aria-label="模糊程度"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <div class="space-y-1">
        <div class="flex justify-between text-xs font-bold text-gray-600">
          <label for="brightness-slider">亮度 (Brightness)</label>
          <span class="text-blue-600">{{ brightnessValue }}</span>
        </div>
        <input
          id="brightness-slider"
          v-model.number="brightnessValue"
          type="range"
          min="-0.5"
          max="0.5"
          step="0.05"
          aria-label="亮度"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <div class="space-y-1">
        <div class="flex justify-between text-xs font-bold text-gray-600">
          <label for="contrast-slider">對比 (Contrast)</label>
          <span class="text-blue-600">{{ contrastValue }}</span>
        </div>
        <input
          id="contrast-slider"
          v-model.number="contrastValue"
          type="range"
          min="-0.5"
          max="0.5"
          step="0.05"
          aria-label="對比度"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Shuffle, Upload } from 'lucide-vue-next'
import * as fabric from 'fabric'
import { useEditorStore } from '../../stores/editor'
import { CONFIG } from '../../config/constants'
import { debounce } from '../../utils/debounce'
import { requestRender } from '../../utils/renderManager'
import { loadFabricImage } from '../../utils/fabricImageCache'

const store = useEditorStore()
const fileInputRef = ref<HTMLInputElement>()

const blurValue = ref(0)
const brightnessValue = ref(0)
const contrastValue = ref(0)

const getBackgroundAlt = (url: string) => {
  const name = url.split('/').pop()?.replace('.jpg', '') || ''
  const nameMap: Record<string, string> = {
    lotus: '蓮花背景',
    sunrise: '日出背景',
    sakura: '櫻花背景',
    lanterns: '燈籠背景',
    bamboo: '竹子背景',
  }
  return nameMap[name] || `背景圖片：${name}`
}

const applyFilter = debounce((type: 'blur' | 'brightness' | 'contrast', value: number) => {
  const img = store.canvas?.backgroundImage as fabric.Image
  if (!img || !img.filters) return

  const val = parseFloat(value.toString())

  const filterMap: Record<string, any> = {
    blur: fabric.filters.Blur,
    brightness: fabric.filters.Brightness,
    contrast: fabric.filters.Contrast,
  }

  const FilterClass = filterMap[type]

  const existing = img.filters.find((f: any) => f instanceof FilterClass)

  if (val === 0) {
    img.filters = img.filters.filter((f: any) => !(f instanceof FilterClass))
  } else {
    if (existing) {
      ;(existing as any)[type] = val
    } else {
      if (FilterClass) {
        img.filters.push(new FilterClass({ [type]: val }))
      }
    }
  }

  img.applyFilters()
  requestRender(store.canvas!)
}, 150)

watch(blurValue, (val) => applyFilter('blur', val))
watch(brightnessValue, (val) => applyFilter('brightness', val))
watch(contrastValue, (val) => applyFilter('contrast', val))

const adjustZoomForBackground = (canvas: any) => {
  if (!canvas) return

  const isMobile = window.innerWidth < 768
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height

  let availableWidth = window.innerWidth
  let availableHeight = window.innerHeight

  if (isMobile) {
    availableHeight -= 64
  } else {
    availableWidth -= 320
    availableHeight -= 32
  }

  const scaleX = availableWidth / canvasWidth
  const scaleY = availableHeight / canvasHeight
  const newZoom = Math.min(scaleX, scaleY, 1) * 0.9

  store.setZoom(Math.max(0.1, newZoom))
}

const loadBackground = async (url: string) => {
  const canvas = store.canvas
  if (!canvas) return

  try {
    let img: fabric.Image
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      img = await fabric.Image.fromURL(url, { crossOrigin: 'anonymous' })
    } else {
      img = await loadFabricImage(url)
    }
    if (!img) return

    img.set({ originX: 'left', originY: 'top', selectable: false, evented: false })

    if (img.width > 1200) img.scale(1200 / img.width)
    canvas.setDimensions({ width: img.width * img.scaleX, height: img.height * img.scaleY })

    canvas.backgroundImage = img
    requestRender(canvas)
    store.setCurrentBgUrl(url)

    await nextTick()
    adjustZoomForBackground(canvas)
  } catch (error) {
    console.error('Failed to load background:', error)
  }
}

const setRandomBg = () => {
  const bg = CONFIG.backgrounds[Math.floor(Math.random() * CONFIG.backgrounds.length)]
  if (bg) {
    loadBackground(bg.url)
  }
}

const handleFileUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    const url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (f) => {
        if (f.target?.result) {
          resolve(f.target.result as string)
        } else {
          reject(new Error('Failed to read file'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    await loadBackground(url)
  } catch (error) {
    console.error('Failed to upload file:', error)
  } finally {
    ;(e.target as HTMLInputElement).value = ''
  }
}
</script>
