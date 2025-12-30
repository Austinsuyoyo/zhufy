import { ref, onMounted, onUnmounted, nextTick, shallowRef } from 'vue'
import * as fabric from 'fabric'

export function useCanvas(canvasId: string) {
  const canvas = shallowRef<any>(null)
  const canvasEl = ref<HTMLCanvasElement | null>(null)

  const initCanvas = async () => {
    await nextTick()
    canvasEl.value = document.getElementById(canvasId) as HTMLCanvasElement

    if (!canvasEl.value || canvas.value) return

    canvas.value = new fabric.Canvas(canvasId, {
      preserveObjectStacking: true,
      selectionColor: 'rgba(59, 130, 246, 0.3)',
      selectionBorderColor: '#2563eb',
      selectionLineWidth: 2,
      enableRetinaScaling: true,
    })

    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#ffffff',
      cornerStrokeColor: '#2563eb',
      borderColor: '#2563eb',
      cornerSize: 12,
      padding: 8,
      borderDashArray: [4, 4],
    })
  }

  onMounted(() => {
    initCanvas()
  })

  onUnmounted(() => {
    if (canvas.value) {
      canvas.value.dispose()
      canvas.value = null
    }
  })

  return { canvas, canvasEl, initCanvas }
}
