import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/home',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (home.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Home.vue')
  },
  {
    path: '/code',
    name: 'Code',
    component: () => import('../views/Code.vue')
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting.vue')
  },
  {
    path: '/sign',
    name: 'SignPage',
    component: () => import('../views/SignPage.vue')
  },
  {
    path: '/userArea',
    name: 'UserArea',
    component: () => import('../views/UserArea.vue')
  },
  {
    path: '/oganization',
    name: 'Oganization',
    component: () => import('../views/Oganization.vue')
  },
  {
    path: '/manage',
    name: 'ManagePage',
    component: () => import('../views/ManagePage.vue')
  }
  , { path: '/', redirect: '/home' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
