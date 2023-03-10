import { RouteRecordRaw } from 'vue-router'
import Layout from '@layout/Index.vue'

export const routes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '用户登录',
      cache: false
    },
    component: () => import('@views/login.vue')
  },
  {
    path: '/',
    name: 'main',
    component: Layout,
    redirect: '/dashboard',
    meta: { cache: false },
    children: [
      {
        name: 'dashboard',
        path: '/dashboard',
        meta: {
          title: '仪表盘',
          cache: false
        },
        component: () => import('@views/dashboard/index.vue')
      },
      {
        name: '401',
        path: '/401',
        meta: {
          title: '权限不足',
          cache: false
        },
        component: () => import('@views/other/401.vue')
      },
      {
        name: '404',
        path: '/:pathMatch(.*)*',
        meta: {
          title: '页面不存在',
          cache: false
        },
        component: () => import('@views/other/404.vue')
      }
    ]
  }
]
