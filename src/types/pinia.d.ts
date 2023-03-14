import { RouteRecordRaw } from 'vue-router'
import { Menu } from './entity'
import { MenuItemInfo } from './element-plus'

interface AppType {
  collapse: boolean
}

interface UserType {
  user_id?: number
  authorization: string
  username: string
  realName: string
  gender: number
  avatar: string
  isStatus?: boolean
  roles: string[]
  isAdmin: boolean
}

interface TabsType {
  tabs: Array<any>
  activeName: string
  currentTabName: string
  isContextMenu?: boolean
}

interface PermissionType {
  rawMenu: Menu[]
  menuItem: MenuItemInfo[]
  routers: RouteRecordRaw[]
  permission: string[]
}

interface SettingsType {}
