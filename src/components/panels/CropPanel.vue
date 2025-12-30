<template>
  <div class="h-full flex flex-col items-center justify-center text-center space-y-6">
    <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
      <CropIcon class="w-10 h-10 text-blue-600" />
    </div>
    <div>
      <h3 class="text-xl font-bold text-slate-800 mb-2">裁切模式</h3>
      <p class="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
        請拖曳畫布上的虛線框選取範圍。<br />確認後，畫面將保留框選區域。
      </p>
    </div>
    <button
      v-if="!store.cropRect"
      @click="startCrop"
      class="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/50 transition transform hover:-translate-y-1"
    >
      開始裁切
    </button>
  </div>
</template>

<script setup lang="ts">
import { Crop as CropIcon } from 'lucide-vue-next'
import * as fabric from 'fabric'
import { useEditorStore } from '../../stores/editor'
import { requestRender } from '../../utils/renderManager'

const store = useEditorStore()

const startCrop = () => {
  const canvas = store.canvas
  if (!canvas || store.cropRect) return

  canvas.discardActiveObject()
  canvas.getObjects().forEach((o: fabric.Object) => (o.selectable = false))

  const pad = Math.min(canvas.width, canvas.height) * 0.1
  const rect = new fabric.Rect({
    left: pad,
    top: pad,
    width: canvas.width - pad * 2,
    height: canvas.height - pad * 2,
    originX: 'left',
    originY: 'top',
    fill: 'rgba(0,0,0,0)',
    stroke: '#ffffff',
    strokeDashArray: [10, 5],
    strokeWidth: 3,
    cornerColor: '#ffffff',
    cornerStrokeColor: '#3b82f6',
    transparentCorners: false,
    borderColor: '#ffffff',
    lockRotation: true,
  })

  canvas.add(rect)
  canvas.setActiveObject(rect)
  rect.setCoords()
  requestRender(canvas)
  store.setCropRect(rect)
}
</script>
