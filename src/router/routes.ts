import { RouteRecordRaw } from 'vue-router'
import Layout from '@layout/Index.vue'

export const routes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/login',
    meta: { title: '用户登录' },
    component: () => import('@views/login.vue')
  },
  {
    path: '/',
    name: 'main',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        name: '401',
        path: '/401',
        meta: { title: '权限不足' },
        component: () => import('@views/other/401.vue')
      },
      {
        name: '404',
        path: '/:pathMatch(.*)*',
        meta: { title: '页面不存在' },
        component: () => import('@views/other/404.vue')
      },

      /* 动态路由 */
      {
        name: 'dashboard',
        path: '/dashboard',
        meta: { title: '仪表盘' },
        component: () => import('@views/dashboard/index.vue')
      },
      {
        name: 'my-course',
        path: '/course/me',
        meta: { title: '我的课程' },
        component: () => import('@views/course/me/index.vue')
      },
      {
        name: 'choice',
        path: '/course/choice',
        meta: { title: '选课处理' },
        component: () => import('@views/course/choice/index.vue')
      },
      {
        name: 'all-course',
        path: '/course/all',
        meta: { title: '所有课程' },
        component: () => import('@views/course/all/index.vue')
      },
      {
        name: 'publish',
        path: '/attendance/publish',
        meta: { title: '发布签到' },
        component: () => import('@views/attendance/publish/index.vue')
      },
      {
        name: 'record',
        path: '/attendance/record',
        meta: { title: '签到记录' },
        component: () => import('@views/attendance/record/index.vue')
      },
      {
        name: 'classes',
        path: '/school/classes',
        meta: { title: '班级管理' },
        component: () => import('@views/school/classes/index.vue')
      },
      {
        name: 'major',
        path: '/school/major',
        meta: { title: '专业管理' },
        component: () => import('@views/school/major/index.vue')
      },
      {
        name: 'college',
        path: '/school/college',
        meta: { title: '学院管理' },
        component: () => import('@views/school/college/index.vue')
      },
      {
        name: 'user',
        path: '/system/user',
        meta: { title: '用户管理' },
        component: () => import('@views/system/user/index.vue')
      },
      {
        name: 'role',
        path: '/system/role',
        meta: { title: '角色管理' },
        component: () => import('@views/system/role/index.vue')
      },
      {
        name: 'menu',
        path: '/system/menu',
        meta: { title: '菜单管理' },
        component: () => import('@views/system/menu/index.vue')
      },
      {
        name: 'about',
        path: '/about',
        meta: { title: '关于系统' },
        component: () => import('@views/about/index.vue')
      }
    ]
  }
]
