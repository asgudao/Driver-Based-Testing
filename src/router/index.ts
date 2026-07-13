import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import TestPage from '@/pages/TestPage.vue'
import ResultPage from '@/pages/ResultPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/test',
    name: 'test',
    component: TestPage,
  },
  {
    path: '/result',
    name: 'result',
    component: ResultPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
