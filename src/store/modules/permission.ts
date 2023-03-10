import { defineStore } from 'pinia'
import { PermissionType } from '../../types/pinia'
import router from '../../router'

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionType => {
    return {
      rawMenu: [],
      menuItem: [],
      routers: [],
      permission: []
    }
  },
  getters: {
    getRasMenu: (state) => state.rawMenu,
    getMenuItem: (state) => state.menuItem,
    getRouters: (state) => state.routers,
    getPermission: (state) => state.permission
  },
  actions: {
    setRouter() {
      this.routers.forEach((item) => {
        if (!router.hasRoute(item.name as string)) router.addRoute('main', item)
      })
    },
    clearRouter() {
      this.routers.forEach((item) => {
        if (item.name !== '/dashboard') router.removeRoute(item.name as string)
      })
    }
  },
  persist: { key: 'permission' }
})
