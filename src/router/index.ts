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
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/registerForm.vue'),
    },
    {
      path: '/student',
      name: 'student',
      component: () => import('@/views/student/studentPage.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/adminPage.vue'),
    }
  ]
})

export default router
