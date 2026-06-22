import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/views/Landing.vue'
import { resolveSpaRedirect, isEditorPath } from '@/utils/routing'

// Lazy-loaded: the editor pulls in Fabric.js (~95 KB gzip). Keeping it out of
// the entry chunk means the landing page no longer downloads Fabric up front.
const Editor = () => import('@/components/Editor.vue')

if (typeof window !== 'undefined') {
  const target = resolveSpaRedirect(window.location.search, import.meta.env.BASE_URL)
  if (target) window.history.replaceState(null, '', target)
}

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
  if (isEditorPath(window.location.pathname, import.meta.env.BASE_URL)) {
    document.body.classList.add('editor-mode')
  } else {
    document.body.classList.remove('editor-mode')
  }
}

export default router
