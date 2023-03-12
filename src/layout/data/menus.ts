import { MenuItemInfo } from '../../types/element-plus'

export const menus: Array<MenuItemInfo> = [
  {
    title: '仪表盘',
    icon: 'index',
    path: '/dashboard'
  },
  {
    title: '课程管理',
    icon: 'index',
    path: '/course',
    children: [
      {
        title: '我的课程',
        icon: 'index',
        path: '/course/me'
      },
      {
        title: '所有课程',
        icon: 'index',
        path: '/course/all'
      }
    ]
  },
  {
    title: '考勤管理',
    icon: 'index',
    path: '/attendance',
    children: [
      {
        title: '发布签到',
        icon: 'index',
        path: '/attendance/publish'
      },
      {
        title: '签到记录',
        icon: 'index',
        path: '/attendance/record'
      }
    ]
  },
  {
    title: '校园管理',
    icon: 'index',
    path: '/school',
    children: [
      {
        title: '班级管理',
        icon: 'index',
        path: '/school/classes'
      },
      {
        title: '专业管理',
        icon: 'index',
        path: '/school/major'
      },
      {
        title: '学院管理',
        icon: 'index',
        path: '/school/college'
      }
    ]
  },
  {
    title: '系统管理',
    icon: 'index',
    path: '/system',
    children: [
      {
        title: '用户管理',
        icon: 'index',
        path: '/system/user'
      },
      {
        title: '角色管理',
        icon: 'index',
        path: '/system/role'
      },
      {
        title: '菜单管理',
        icon: 'index',
        path: '/system/menu'
      }
    ]
  },
  {
    title: '关于系统',
    icon: 'index',
    path: '/about'
  }
]
