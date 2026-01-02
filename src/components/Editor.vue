<template>
  <div class="bg-gray-50 h-screen flex flex-col overflow-hidden text-slate-800">
    <Toolbar />
    <div class="flex flex-1 overflow-hidden relative">
      <Sidebar />
      <CanvasEditor />
      <Panel />
    </div>
  </div>
</template>

<script setup lang="ts">
import Toolbar from './Toolbar.vue'
import Sidebar from './Sidebar.vue'
import CanvasEditor from './CanvasEditor.vue'
import Panel from './Panel.vue'

defineOptions({
  name: 'EditorView',
})
</script>
