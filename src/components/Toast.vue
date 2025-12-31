<template>
  <Teleport to="body">
    <TransitionGroup name="toast" tag="div" class="fixed top-4 right-4 z-[200] space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm min-w-[200px] max-w-[320px]',
          toast.type === 'success' && 'bg-green-500/95 text-white',
          toast.type === 'error' && 'bg-red-500/95 text-white',
          toast.type === 'info' && 'bg-blue-500/95 text-white',
        ]"
      >
        <Check v-if="toast.type === 'success'" class="w-5 h-5 flex-shrink-0" />
        <AlertCircle v-if="toast.type === 'error'" class="w-5 h-5 flex-shrink-0" />
        <Info v-if="toast.type === 'info'" class="w-5 h-5 flex-shrink-0" />
        <span class="text-sm font-medium">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Check, AlertCircle, Info } from 'lucide-vue-next'

interface ToastItem {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<ToastItem[]>([])
let toastId = 0

const show = (message: string, type: ToastItem['type'] = 'info', duration = 3000) => {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
