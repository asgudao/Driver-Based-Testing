import { createRouter, createWebHistory } from 'vue-router'
import MainHomePage from '@/pages/MainHomePage.vue'
import HomePage from '@/pages/HomePage.vue'
import TestPage from '@/pages/TestPage.vue'
import ResultPage from '@/pages/ResultPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import AttributeTestPage from '@/pages/AttributeTestPage.vue'
import AttributeResultPage from '@/pages/AttributeResultPage.vue'

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
  {
    path: '/attribute-test',
    name: 'attribute-test',
    component: AttributeTestPage,
  },
  {
    path: '/attribute-result',
    name: 'attribute-result',
    component: AttributeResultPage,
  },
]

const router = createRouter({
  history: createWebHistory('/Driver-Based-Testing/'),
  routes,
})

export default router
