<template>
  <main
    ref="workspaceRef"
    class="flex-1 bg-gray-100 relative overflow-auto flex items-center justify-center p-2 md:p-4 lg:p-8 pb-20 md:pb-4"
  >
    <div
      ref="canvasWrapperRef"
      class="relative shadow-2xl bg-white bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC440O9eaAAAAC5JREFUOE9jwb6D9z8DlpF5gIg4xYGDkIGBgYGBEXwA/w8CjBwM/w8CjBwM/w8CAD5wL89jYvngAAAAAElFTkSuQmCC')]"
    >
      <canvas id="c" class="canvas-container"></canvas>
    </div>

    <div
      v-if="store.activeTab === 'crop' && store.cropRect"
      class="absolute bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur text-slate-800 px-4 md:px-6 py-2 md:py-3 rounded-full shadow-2xl flex items-center gap-2 md:gap-4 z-50 border border-gray-200"
    >
      <span class="font-bold text-sm">裁切模式</span>
      <div class="h-4 w-px bg-gray-300"></div>
      <button
        @click="handleConfirmCrop"
        class="flex items-center gap-1 text-green-600 hover:text-green-700 font-bold transition"
      >
        <Check class="w-4 h-4" />
        確認
      </button>
      <button
        @click="handleCancelCrop"
        class="flex items-center gap-1 text-red-600 hover:text-red-700 font-bold transition"
      >
        <X class="w-4 h-4" />
        取消
      </button>
    </div>

    <div
      class="fixed bottom-8 right-[calc(20rem+2rem)] z-[60] hidden md:flex items-center justify-center gap-2 bg-white/95 backdrop-blur rounded-full shadow-lg border border-gray-200 px-3 py-1.5"
    >
      <button
        @click="handleZoomOut"
        class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-600 transition"
        title="縮小"
      >
        <Minus class="w-4 h-4" />
      </button>
      <span class="text-xs font-medium text-gray-600 min-w-[40px] text-center">
        {{ Math.round(store.zoomLevel * 100) }}%
      </span>
      <button
        @click="handleZoomIn"
        class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-600 transition"
        title="放大"
      >
        <Plus class="w-4 h-4" />
      </button>
    </div>

    <div
      v-if="!store.panelVisible && !store.cropRect"
      class="fixed bottom-20 left-2 right-2 z-[60] md:hidden flex items-center gap-2 bg-white/95 backdrop-blur rounded-full shadow-lg border border-gray-200 px-3 py-2"
    >
      <button
        @click="handleZoomOut"
        class="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-600 transition"
        title="縮小"
      >
        <Minus class="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
      <div class="flex-1 flex items-center gap-2 min-w-0">
        <input
          type="range"
          :value="store.zoomLevel"
          @input="handleZoomChange"
          min="0.1"
          max="3"
          step="0.1"
          class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 min-w-0"
          aria-label="縮放比例"
        />
        <span class="text-[10px] font-medium w-9 text-center text-gray-500 flex-shrink-0">
          {{ Math.round(store.zoomLevel * 100) }}%
        </span>
      </div>
      <button
        @click="handleZoomIn"
        class="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-600 transition"
        title="放大"
      >
        <Plus class="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Check, X, Minus, Plus } from 'lucide-vue-next'
import * as fabric from 'fabric'
import { useEditorStore } from '../stores/editor'
import { useCanvas } from '../composables/useCanvas'
import { CONFIG } from '../config/constants'
import { requestRender, forceRender } from '../utils/renderManager'
import { loadFabricImage } from '../utils/fabricImageCache'

const store = useEditorStore()
const { canvas, initCanvas: initCanvasComposable } = useCanvas('c')
const workspaceRef = ref<HTMLElement>()
const canvasWrapperRef = ref<HTMLElement>()

const adjustZoomForBackground = (currentCanvas: any) => {
  if (!currentCanvas) return

  const isMobile = window.innerWidth < 768
  const canvasWidth = currentCanvas.width
  const canvasHeight = currentCanvas.height

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
  updateZoomTransform()
}

const initCanvasData = async () => {
  if (!canvas.value) return
  const currentCanvas = canvas.value

  const firstBg = CONFIG.backgrounds[0]
  if (!firstBg) return

  try {
    const img = await loadFabricImage(firstBg.url)
    if (!img) return

    img.set({ originX: 'left', originY: 'top', selectable: false, evented: false })

    if (img.width > 1200) img.scale(1200 / img.width)
    currentCanvas.setDimensions({ width: img.width * img.scaleX, height: img.height * img.scaleY })

    currentCanvas.backgroundImage = img
    forceRender(currentCanvas)
    store.setCurrentBgUrl(firstBg.url)

    const text = new fabric.IText('平安喜樂', {
      left: currentCanvas.width / 2,
      top: currentCanvas.height / 2,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Zen Maru Gothic',
      fill: '#ff0000',
      stroke: '#ffffff',
      strokeWidth: 10,
      fontSize: 120,
      fontWeight: '900',
      paintFirst: 'stroke',
    })
    currentCanvas.add(text)
    currentCanvas.setActiveObject(text)
    requestRender(currentCanvas)

    await nextTick()
    adjustZoomForBackground(currentCanvas)
  } catch (error) {
    console.error('Failed to load background:', error)
  }
}

watch(canvas, async (newCanvas) => {
  if (newCanvas) {
    if (newCanvas.backgroundImage) {
      store.setCanvas(newCanvas)
      await nextTick()
      setupCanvasEvents()
      initCanvasData()
      setupKeyboardEvents()
    }
  }
})

onMounted(async () => {
  await initCanvasComposable()
  await nextTick()
  if (canvas.value) {
    store.setCanvas(canvas.value)
    setupCanvasEvents()
    initCanvasData()
    setupKeyboardEvents()
  }

  await nextTick()
  updateZoomTransform()

  if (workspaceRef.value) {
    workspaceRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
})

const updateZoomTransform = () => {
  if (canvasWrapperRef.value) {
    canvasWrapperRef.value.style.transform = `scale(${store.zoomLevel})`
    canvasWrapperRef.value.style.transformOrigin = 'center center'
  }
}

const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    const newZoom = Math.max(0.1, Math.min(3, store.zoomLevel + delta))
    store.setZoom(newZoom)
    updateZoomTransform()
  }
}

const handleZoomIn = () => {
  const newZoom = Math.min(3, store.zoomLevel + 0.1)
  store.setZoom(newZoom)
  updateZoomTransform()
}

const handleZoomOut = () => {
  const newZoom = Math.max(0.1, store.zoomLevel - 0.1)
  store.setZoom(newZoom)
  updateZoomTransform()
}

const handleZoomChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const newZoom = parseFloat(target.value)
  store.setZoom(newZoom)
  updateZoomTransform()
}

const handleConfirmCrop = () => {
  const rect = store.cropRect
  if (!rect || !canvas.value) return

  const r = rect as fabric.Rect
  const topLeft = r.getPositionByOrigin('left', 'top')
  const cropX = topLeft.x
  const cropY = topLeft.y
  const cropW = r.getScaledWidth()
  const cropH = r.getScaledHeight()

  canvas.value.remove(r)
  store.setCropRect(null)

  canvas.value.getObjects().forEach((obj: fabric.Object) => {
    const objTopLeft = obj.getPositionByOrigin('left', 'top')
    obj.positionByLeftTop(new fabric.Point(objTopLeft.x - cropX, objTopLeft.y - cropY))
    obj.setCoords()
  })

  if (canvas.value.backgroundImage) {
    const bg = canvas.value.backgroundImage
    const bgTopLeft = bg.getPositionByOrigin('left', 'top')
    bg.positionByLeftTop(new fabric.Point(bgTopLeft.x - cropX, bgTopLeft.y - cropY))
    bg.setCoords()
  }

  canvas.value.setDimensions({ width: cropW, height: cropH })
  canvas.value.getObjects().forEach((o: fabric.Object) => (o.selectable = true))
  if (canvas.value.backgroundImage) canvas.value.backgroundImage.selectable = false

  forceRender(canvas.value)
  store.setActiveTab('bg')
}

const handleCancelCrop = () => {
  if (!canvas.value) return

  if (store.cropRect) {
    canvas.value.remove(store.cropRect as fabric.Rect)
    store.setCropRect(null)
  }

  canvas.value.getObjects().forEach((o: fabric.Object) => (o.selectable = true))
  if (canvas.value.backgroundImage) canvas.value.backgroundImage.selectable = false

  requestRender(canvas.value)
}

let canvasEventHandlers: Record<string, (e: fabric.TEvent) => void> | null = null

const setupCanvasEvents = () => {
  if (!canvas.value) return

  if (canvasEventHandlers) {
    canvas.value.off(canvasEventHandlers)
  }

  canvasEventHandlers = {
    'selection:created': (e: fabric.TEvent) => {
      const event = e as fabric.TEvent & { selected?: fabric.Object[] }
      store.setActiveObject(event.selected?.[0] || null)
    },
    'selection:updated': (e: fabric.TEvent) => {
      const event = e as fabric.TEvent & { selected?: fabric.Object[] }
      store.setActiveObject(event.selected?.[0] || null)
    },
    'selection:cleared': () => {
      store.setActiveObject(null)
    },
    'object:moving': (e: fabric.TEvent) => {
      if (!canvas.value || !store.cropRect) return
      const obj = (e as any).target as fabric.Rect
      if (obj !== store.cropRect) return

      const canvasWidth = canvas.value.width
      const canvasHeight = canvas.value.height
      const rectWidth = obj.getScaledWidth()
      const rectHeight = obj.getScaledHeight()

      const topLeft = obj.getPositionByOrigin('left', 'top')
      let newLeft = topLeft.x
      let newTop = topLeft.y

      if (newLeft < 0) newLeft = 0
      if (newTop < 0) newTop = 0
      if (newLeft + rectWidth > canvasWidth) newLeft = canvasWidth - rectWidth
      if (newTop + rectHeight > canvasHeight) newTop = canvasHeight - rectHeight

      if (newLeft !== topLeft.x || newTop !== topLeft.y) {
        obj.positionByLeftTop(new fabric.Point(newLeft, newTop))
      }
    },
    'object:scaling': (e: fabric.TEvent) => {
      if (!canvas.value || !store.cropRect) return
      const obj = (e as any).target as fabric.Rect
      if (obj !== store.cropRect) return

      const canvasWidth = canvas.value.width
      const canvasHeight = canvas.value.height
      const baseWidth = obj.width || 1
      const baseHeight = obj.height || 1

      const topLeft = obj.getPositionByOrigin('left', 'top')
      let newLeft = topLeft.x
      let newTop = topLeft.y
      let newWidth = obj.getScaledWidth()
      let newHeight = obj.getScaledHeight()

      if (newLeft < 0) {
        const overflow = -newLeft
        newWidth -= overflow
        newLeft = 0
      }
      if (newTop < 0) {
        const overflow = -newTop
        newHeight -= overflow
        newTop = 0
      }
      if (newLeft + newWidth > canvasWidth) {
        newWidth = canvasWidth - newLeft
      }
      if (newTop + newHeight > canvasHeight) {
        newHeight = canvasHeight - newTop
      }

      if (newWidth < 10) newWidth = 10
      if (newHeight < 10) newHeight = 10

      const scaleX = newWidth / baseWidth
      const scaleY = newHeight / baseHeight

      obj.set({
        scaleX: scaleX,
        scaleY: scaleY,
      })

      obj.positionByLeftTop(new fabric.Point(newLeft, newTop))
      obj.setCoords()
    },
  }

  canvas.value.on(canvasEventHandlers)
}

const setupKeyboardEvents = () => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      const active = store.canvas?.getActiveObjects()
      if (active && active.length > 0) {
        store.canvas?.discardActiveObject()
        active.forEach((obj: fabric.Object) => store.canvas?.remove(obj))
        requestRender(store.canvas!)
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault()
      const active = store.canvas?.getActiveObject()
      if (active && store.canvas) {
        active.clone().then((cloned: fabric.Object) => {
          cloned.set({
            left: ((cloned.left as number) || 0) + 30,
            top: ((cloned.top as number) || 0) + 30,
          })
          store.canvas!.add(cloned)
          store.canvas!.setActiveObject(cloned)
          requestRender(store.canvas!)
        })
      }
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
}

onUnmounted(() => {
  if (workspaceRef.value) {
    workspaceRef.value.removeEventListener('wheel', handleWheel)
  }
  if (canvas.value && canvasEventHandlers) {
    canvas.value.off(canvasEventHandlers)
    canvasEventHandlers = null
  }
})

watch(
  () => store.zoomLevel,
  () => {
    updateZoomTransform()
  },
)
</script>
