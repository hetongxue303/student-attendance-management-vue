import { defineStore } from 'pinia'
import {
  getToken,
  removeToken,
  removeTokenTime,
  setToken,
  setTokenTime
} from '../../utils/auth'
import { UserType } from '../../types/pinia'
import { usePermissionStore } from './permission'
import { useTabStore } from './tabs'
import { useAppStore } from './app'
import { local, session } from '../../utils/storage'
import { filterMenu, filterRouter } from '../../filter/permission'

export const useUserStore = defineStore('user', {
  state: (): UserType => {
    return {
      authorization: getToken() || '',
      avatar: '',
      is_Status: undefined,
      username: '',
      roles: '',
      isAdmin: false
    }
  },
  getters: {
    getAuthorization: (state) => state.authorization,
    getRoles: (state) => state.roles,
    getStatus: (state) => state.is_Status,
    getUsername: (state) => state.username,
    getAvatar: (state) => state.avatar,
    getIsAdmin: (state) => state.isAdmin
  },
  actions: {
    setUserInfo(data: any) {
      const permissionStore = usePermissionStore()
      const { access_token, expire_time, login } = data
      const token = `bearer ${access_token}`
      setToken(token)
      setTokenTime(new Date().getTime() + expire_time)
      this.authorization = token
      this.is_Status = login.is_status
      this.username = login.username
      permissionStore.rawMenu = login.menus
      permissionStore.menuItem = filterMenu(login.menus, 0)
      permissionStore.routers = filterRouter(login.menus)
      permissionStore.setRouter()
    },
    systemLogout() {
      removeToken()
      removeTokenTime()
      usePermissionStore().$reset()
      usePermissionStore().clearRouter()
      useTabStore().$reset()
      useAppStore().$reset()
      session.clear()
      local.clear()
      this.$reset()
    }
  },
  persist: { key: 'user' }
})
