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
      isStatus: undefined,
      username: '',
      roles: [],
      isAdmin: false,
      realName: '',
      gender: 0
    }
  },
  getters: {
    getAuthorization: (state) => state.authorization,
    getRoles: (state) => state.roles,
    getStatus: (state) => state.isStatus,
    getUsername: (state) => state.username,
    getAvatar: (state) => state.avatar,
    getIsAdmin: (state) => state.isAdmin,
    getRealName: (state) => state.realName,
    getGender: (state) => state.gender
  },
  actions: {
    setUserInfo(data: any) {
      const permissionStore = usePermissionStore()
      const { access_token, expire_time, user } = data
      const token = `bearer ${access_token}`
      this.authorization = token
      this.isStatus = user.is_status
      this.username = user.username
      this.isAdmin = user.is_admin
      this.realName = user.real_name
      this.gender = user.gender
      this.roles = user.roles
      this.avatar = user.avatar
      setToken(token)
      setTokenTime(new Date().getTime() + expire_time)
      permissionStore.permission = user.permission
      permissionStore.rawMenu = user.menus
      permissionStore.menuItem = filterMenu(user.menus, 0)
      permissionStore.routers = filterRouter(user.menus)
      permissionStore.setRouter()
    },
    systemLogout() {
      removeToken()
      removeTokenTime()
      useTabStore().$reset()
      useAppStore().$reset()
      usePermissionStore().$reset()
      usePermissionStore().clearRouter()
      session.clear()
      local.clear()
      this.$reset()
    }
  },
  persist: { key: 'user' }
})
