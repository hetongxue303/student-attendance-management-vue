import { RouteRecordRaw } from 'vue-router'
import { MenuEntity } from './entity'
import { Menu } from './element'

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
  rawMenu: MenuEntity[]
  menuItem: Menu[]
  routers: RouteRecordRaw[]
  permission: string[]
}

interface SettingsType {}
