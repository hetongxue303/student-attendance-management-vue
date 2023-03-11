import { RouteRecordRaw } from 'vue-router'
import { Menu } from './entity'
import { MenuItemInfo } from './element'

interface AppType {
  collapse: boolean
}

interface UserType {
  authorization: string
  username: string
  avatar: string
  is_Status?: boolean
  roles: string
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
