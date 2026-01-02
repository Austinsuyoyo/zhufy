import { createRouter, createWebHistory } from 'vue-router'
import Editor from '@/components/Editor.vue'
import Landing from '@/views/Landing.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing,
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor,
    },
  ],
})

router.beforeEach((to) => {
  if (to.name === 'editor') {
    document.body.classList.add('editor-mode')
  } else {
    document.body.classList.remove('editor-mode')
  }
})

if (typeof document !== 'undefined') {
  const base = import.meta.env.BASE_URL
  const normalizedBase = base === '/' ? '' : base.replace(/\/$/, '')
  const editorPath = `${normalizedBase}/editor`
  const initialPath = window.location.pathname

  if (initialPath === editorPath || initialPath.startsWith(`${editorPath}/`)) {
    document.body.classList.add('editor-mode')
  } else {
    document.body.classList.remove('editor-mode')
  }
}

export default router
