import { createRouter, createWebHistory } from 'vue-router'
import MainHomePage from '@/pages/MainHomePage.vue'
import HomePage from '@/pages/HomePage.vue'
import TestPage from '@/pages/TestPage.vue'
import ResultPage from '@/pages/ResultPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'

const routes = [
  {
    path: '/',
    name: 'main-home',
    component: MainHomePage,
  },
  {
    path: '/test/intro',
    name: 'test-intro',
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
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
  },
]

const router = createRouter({
  history: createWebHistory('/Driver-Based-Testing/'),
  routes,
})

export default router
