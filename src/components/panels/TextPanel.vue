<template>
  <div class="space-y-6">
    <div class="grid grid-cols-2 gap-2">
      <button
        @click="() => addText()"
        class="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
      >
        <Plus class="w-4 h-4" />
        新增文字
      </button>
      <button
        @click="addRandomQuote"
        class="py-3 border-2 border-blue-100 text-blue-600 hover:bg-blue-50 rounded-lg font-bold transition flex items-center justify-center gap-2"
      >
        <Sparkles class="w-4 h-4" />
        隨機金句
      </button>
    </div>

    <div class="space-y-2">
      <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">預設樣式</label>
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="applyTemplate('title')"
          class="py-2 bg-red-50 border-2 border-red-200 hover:border-red-400 rounded-lg text-xs font-black text-red-700 transition"
        >
          <div class="text-[10px] font-black" style="font-size: 14px; line-height: 1.2">標題</div>
          <div class="text-[8px] text-gray-500 mt-0.5">大字粗體</div>
        </button>
        <button
          @click="applyTemplate('subtitle')"
          class="py-2 bg-gray-50 border-2 border-gray-200 hover:border-gray-400 rounded-lg text-xs font-bold text-gray-700 transition"
        >
          <div class="text-[10px] font-bold" style="font-size: 12px; line-height: 1.2">副標題</div>
          <div class="text-[8px] text-gray-500 mt-0.5">中字粗體</div>
        </button>
        <button
          @click="applyTemplate('decorative')"
          class="py-2 bg-pink-50 border-2 border-pink-200 hover:border-pink-400 rounded-lg text-xs font-normal text-pink-700 transition"
        >
          <div class="text-[10px] font-normal" style="font-size: 11px; line-height: 1.2">裝飾</div>
          <div class="text-[8px] text-gray-500 mt-0.5">中字正常</div>
        </button>
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">文字方向</label>
      <div class="grid grid-cols-2 gap-2">
        <button
          @click="setTextDirection('horizontal')"
          :class="[
            'py-2 rounded-lg text-xs font-bold transition',
            isVertical ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700',
          ]"
        >
          橫向
        </button>
        <button
          @click="setTextDirection('vertical')"
          :class="[
            'py-2 rounded-lg text-xs font-bold transition',
            isVertical ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700',
          ]"
        >
          垂直
        </button>
      </div>
    </div>

    <div
      v-if="!store.isTextSelected"
      class="text-center py-10 text-gray-500 flex flex-col items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50"
    >
      <div class="bg-white p-3 rounded-full shadow-sm">
        <MousePointerClick class="w-6 h-6 text-blue-500" />
      </div>
      <p class="text-sm font-medium">點擊畫布上的文字<br />開始編輯屬性</p>
    </div>

    <div v-if="store.isTextSelected" class="space-y-5 pt-2">
      <div class="space-y-1">
        <label
          for="text-content"
          class="text-[10px] font-bold text-gray-600 uppercase tracking-wider"
          >文字內容</label
        >
        <textarea
          id="text-content"
          :value="textValue"
          @input="handleTextChange"
          rows="2"
          aria-label="文字內容"
          class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none shadow-sm transition"
        ></textarea>
      </div>

      <div class="space-y-2">
        <label class="text-[10px] font-bold text-gray-600 uppercase tracking-wider">字型設定</label>
        <div class="flex gap-2">
          <div class="relative flex-1">
            <select
              :value="fontFamily"
              @change="handleFontFamilyChange"
              class="w-full appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm outline-none focus:border-blue-500 font-bold text-gray-700"
            >
              <option value="Zen Maru Gothic" class="font-zen">圓體 (Zen Maru)</option>
              <option value="Noto Serif TC" class="font-serif">宋體 (Serif)</option>
              <option value="Noto Sans TC" class="font-sans">黑體 (Sans)</option>
              <option value="Zhi Mang Xing" class="font-callig">書法體 (Calligraphy)</option>
            </select>
            <ChevronDown
              class="absolute right-2 top-2.5 w-4 h-4 text-gray-500 pointer-events-none"
            />
          </div>
          <button
            @click="toggleBold"
            :class="[
              'w-10 border border-gray-300 rounded-lg flex items-center justify-center font-bold transition',
              isBold ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700',
            ]"
            aria-label="粗體"
            :aria-pressed="isBold"
          >
            B
          </button>
        </div>
      </div>

      <div class="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-3">
        <label class="text-[10px] font-bold text-gray-600 uppercase tracking-wider block"
          >色彩與外觀</label
        >
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <span class="text-xs text-gray-600 font-medium">文字顏色</span>
            <label
              class="flex items-center gap-2 bg-white border border-gray-200 p-2 rounded-lg cursor-pointer hover:border-blue-400 transition"
            >
              <input
                type="color"
                :value="fillColor"
                @input="handleFillChange"
                aria-label="文字顏色"
                class="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0"
              />
              <span class="text-[10px] font-mono text-gray-600 uppercase flex-1">{{
                fillColor
              }}</span>
            </label>
          </div>
          <div class="space-y-1">
            <span class="text-xs text-gray-600 font-medium">描邊顏色</span>
            <label
              class="flex items-center gap-2 bg-white border border-gray-200 p-2 rounded-lg cursor-pointer hover:border-blue-400 transition"
            >
              <input
                type="color"
                :value="strokeColor"
                @input="handleStrokeChange"
                aria-label="描邊顏色"
                class="w-8 h-8 rounded cursor-pointer border-none bg-transparent p-0"
              />
              <span class="text-[10px] font-mono text-gray-600 uppercase flex-1">{{
                strokeColor
              }}</span>
            </label>
          </div>
        </div>

        <div class="space-y-4 pt-2">
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-bold text-gray-600">
              <label for="font-size-slider">字體大小</label>
              <span class="text-blue-600">{{ fontSize }}</span>
            </div>
            <input
              id="font-size-slider"
              v-model.number="fontSize"
              type="range"
              min="10"
              max="300"
              aria-label="字體大小"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-bold text-gray-600">
              <label for="stroke-width-slider">描邊粗細</label>
              <span class="text-blue-600">{{ strokeWidth }}</span>
            </div>
            <input
              id="stroke-width-slider"
              v-model.number="strokeWidth"
              type="range"
              min="0"
              max="10"
              aria-label="描邊粗細"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <div class="space-y-1">
            <div class="flex justify-between text-xs font-bold text-gray-600">
              <label for="angle-slider">旋轉角度</label>
              <span class="text-blue-600">{{ angle }}°</span>
            </div>
            <div class="flex gap-2">
              <input
                id="angle-slider"
                v-model.number="angle"
                type="range"
                min="0"
                max="360"
                step="15"
                aria-label="旋轉角度"
                class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div class="flex gap-1">
                <button
                  @click="setAngle(0)"
                  class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  aria-label="旋轉 0 度"
                >
                  0°
                </button>
                <button
                  @click="setAngle(90)"
                  class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  aria-label="旋轉 90 度"
                >
                  90°
                </button>
                <button
                  @click="setAngle(-90)"
                  class="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  aria-label="旋轉負 90 度"
                >
                  -90°
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-50 p-2 rounded-lg flex justify-between">
          <button
            @click="alignObject('left')"
            class="p-2 hover:bg-gray-200 rounded text-gray-600"
            aria-label="左對齊"
          >
            <AlignLeft class="w-4 h-4" />
          </button>
          <button
            @click="alignObject('center')"
            class="p-2 hover:bg-gray-200 rounded text-gray-600"
            aria-label="置中對齊"
          >
            <AlignCenter class="w-4 h-4" />
          </button>
          <button
            @click="alignObject('right')"
            class="p-2 hover:bg-gray-200 rounded text-gray-600"
            aria-label="右對齊"
          >
            <AlignRight class="w-4 h-4" />
          </button>
        </div>
        <div class="grid grid-cols-2 gap-1">
          <button
            @click="layerObject('up')"
            class="bg-gray-50 hover:bg-gray-100 rounded text-xs font-bold text-gray-600 flex items-center justify-center"
          >
            <ArrowUp class="w-3 h-3 mr-1" />
            上移
          </button>
          <button
            @click="layerObject('down')"
            class="bg-gray-50 hover:bg-gray-100 rounded text-xs font-bold text-gray-600 flex items-center justify-center"
          >
            <ArrowDown class="w-3 h-3 mr-1" />
            下移
          </button>
        </div>
      </div>

      <button
        @click="deleteActiveObject"
        class="w-full py-3 bg-white border border-red-100 hover:bg-red-50 text-red-500 rounded-lg font-bold transition flex items-center justify-center gap-2 mt-4"
      >
        <Trash2 class="w-4 h-4" />
        刪除此物件
      </button>

      <div class="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <p class="text-[10px] text-gray-500 font-medium">
          <Keyboard class="w-3 h-3 inline mr-1" />
          快捷鍵：Delete 刪除 · Ctrl+D 複製
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import {
  Plus,
  Sparkles,
  MousePointerClick,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
  Trash2,
  Keyboard,
} from 'lucide-vue-next'
import * as fabric from 'fabric'
import { useEditorStore } from '../../stores/editor'
import { CONFIG, TEXT_TEMPLATES } from '../../config/constants'
import { debounce } from '../../utils/debounce'
import { requestRender } from '../../utils/renderManager'
import { isMobile } from '../../utils/device'
import type { IText } from 'fabric'

const store = useEditorStore()

const textValue = ref('')
const fontSize = ref(60)
const strokeWidth = ref(2)
const angle = ref(0)
const fillColor = ref('#ff0000')
const strokeColor = ref('#ffffff')
const fontFamily = ref('Zen Maru Gothic')
const isBold = ref(false)

const isVertical = computed(() => {
  const obj = store.activeObject as IText | null
  return obj?.text?.includes('\n') && obj.text.split('\n').length > 1
})

const updateTextObject = debounce(() => {
  const obj = store.activeObject as IText | null
  if (!obj || !store.canvas) return

  obj.set({
    fontSize: fontSize.value,
    strokeWidth: strokeWidth.value,
    angle: angle.value,
    fill: fillColor.value,
    stroke: strokeColor.value,
    fontFamily: fontFamily.value,
    fontWeight: isBold.value ? '900' : 'normal',
  })

  requestRender(store.canvas)
}, 50)

watch([fontSize, strokeWidth, angle, fillColor, strokeColor, fontFamily, isBold], () => {
  updateTextObject()
})

watch(
  () => store.activeObject,
  (obj) => {
    if (!obj || obj.type !== 'i-text') {
      textValue.value = ''
      return
    }

    if (store.activeTab !== 'text') {
      store.setActiveTab('text')
    }

    const textObj = obj as IText
    textValue.value = textObj.text || ''
    fontSize.value = textObj.fontSize || 60
    strokeWidth.value = textObj.strokeWidth || 2
    angle.value = Math.round(textObj.angle || 0)
    fillColor.value = (textObj.fill as string) || '#ff0000'
    strokeColor.value = (textObj.stroke as string) || '#ffffff'
    fontFamily.value = textObj.fontFamily || 'Zen Maru Gothic'
    isBold.value =
      textObj.fontWeight === 'bold' || textObj.fontWeight === '900' || textObj.fontWeight === 700
  },
  { immediate: true },
)

const handleTextChange = debounce((e: Event) => {
  const value = (e.target as HTMLTextAreaElement).value
  textValue.value = value

  const obj = store.activeObject as IText | null
  if (obj && store.canvas) {
    obj.set('text', value)
    requestRender(store.canvas)
  }
}, 300)

const handleFontFamilyChange = debounce((e: Event) => {
  fontFamily.value = (e.target as HTMLSelectElement).value
}, 100)

const handleFillChange = debounce((e: Event) => {
  fillColor.value = (e.target as HTMLInputElement).value
}, 100)

const handleStrokeChange = debounce((e: Event) => {
  strokeColor.value = (e.target as HTMLInputElement).value
}, 100)

const addText = (content = '請輸入文字', options: any = {}) => {
  const canvas = store.canvas
  if (!canvas) return

  const text = new fabric.IText(content, {
    left: canvas.width / 2,
    top: canvas.height / 2,
    originX: 'center',
    originY: 'center',
    fontFamily: 'Zen Maru Gothic',
    fill: '#ff0000',
    stroke: '#ffffff',
    strokeWidth: 2,
    fontSize: 60,
    fontWeight: '900',
    paintFirst: 'stroke',
    ...options,
  })

  canvas.add(text)
  canvas.setActiveObject(text)
  requestRender(canvas)
  store.setActiveObject(text)

  if (isMobile()) {
    store.panelVisible = false
  }
}

const addRandomQuote = () => {
  const quote = CONFIG.quotes[Math.floor(Math.random() * CONFIG.quotes.length)]
  addText(quote)
}

const applyTemplate = (type: 'title' | 'subtitle' | 'decorative') => {
  let obj = store.activeObject as IText | null

  if (!obj || obj.type !== 'i-text') {
    addText('請輸入文字')
    nextTick(() => {
      obj = store.activeObject as IText | null
      if (obj) {
        const template = TEXT_TEMPLATES[type]
        Object.keys(template).forEach((key) => {
          obj!.set(key as any, (template as Record<string, unknown>)[key])
        })
        requestRender(store.canvas!)
      }
    })
    return
  }

  const template = TEXT_TEMPLATES[type]
  Object.keys(template).forEach((key) => {
    obj!.set(key as any, (template as Record<string, unknown>)[key])
  })
  requestRender(store.canvas!)
}

const setTextDirection = (direction: 'horizontal' | 'vertical') => {
  const obj = store.activeObject as IText | null
  if (!obj || !store.canvas || obj.type !== 'i-text') {
    if (!obj) {
      addText('請輸入文字')
      nextTick(() => setTextDirection(direction))
    }
    return
  }

  if (direction === 'vertical') {
    obj.set({
      text: obj.text?.split('').join('\n') || '',
      charSpacing: 0,
      lineHeight: 1.2,
    })
  } else {
    obj.set('text', obj.text?.replace(/\n/g, '') || '')
  }

  requestRender(store.canvas)
}

const setAngle = (angleValue: number) => {
  angle.value = angleValue
}

const toggleBold = () => {
  isBold.value = !isBold.value
}

const alignObject = (align: 'left' | 'center' | 'right') => {
  const obj = store.activeObject
  const canvas = store.canvas
  if (!obj || !canvas) return

  const alignments = {
    left: { left: 0, originX: 'left' },
    right: { left: canvas.width, originX: 'right' },
    center: { left: canvas.width / 2, originX: 'center' },
  }

  obj.set(alignments[align])
  obj.setCoords()
  requestRender(canvas)
}

const layerObject = (dir: 'up' | 'down') => {
  const obj = store.activeObject
  const canvas = store.canvas
  if (!obj || !canvas) return

  if (dir === 'up') {
    canvas.bringObjectForward(obj as any)
  } else {
    canvas.sendObjectBackwards(obj as any)
  }
  requestRender(canvas)
}

const deleteActiveObject = () => {
  const canvas = store.canvas
  if (!canvas) return

  const active = canvas.getActiveObjects()
  if (active.length) {
    canvas.discardActiveObject()
    active.forEach((obj: fabric.Object) => canvas.remove(obj))
    requestRender(canvas)
  }
}
</script>
