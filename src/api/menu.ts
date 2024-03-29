import axios, { base } from '../utils/request'
import { QueryMenu, QueryMenuTree } from '../types/query'
import { Menu } from '../types/entity'

export const getMenuListAll = () => {
  return axios({ method: 'GET', url: `${base}/menu/list/all` })
}
export const getMenuListByPage = (params: QueryMenu) => {
  return axios({ method: 'GET', url: `${base}/menu/list`, params })
}
export const getMenuListByTree = (params?: QueryMenuTree) => {
  return axios({ method: 'GET', url: `${base}/menu/list/tree`, params })
}
export const getMenuTreeListByRoleId = (role_id: number) => {
  return axios({ method: 'GET', url: `${base}/menu/role_id/${role_id}` })
}

export const addMenu = (data: Menu) => {
  return axios({ method: 'POST', url: `${base}/menu/add`, data })
}

export const deleteMenu = (id: number) => {
  return axios({ method: 'DELETE', url: `${base}/menu/delete/${id}` })
}

export const batchDeleteMenu = (data: number[]) => {
  return axios({ method: 'PUT', url: `${base}/menu/delete/batch`, data })
}
export const updateMenu = (data: Menu) => {
  return axios({ method: 'PUT', url: `${base}/menu/update`, data })
}
