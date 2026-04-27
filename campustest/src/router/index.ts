import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'intro',
      component: () => import('@/views/landing/introPage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/loginForm.vue'),
    },
  ],
})

export default router
