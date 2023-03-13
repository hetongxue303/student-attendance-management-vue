import axios, { base } from '../utils/request'
import { QueryMenu } from '../types/query'
import { Menu } from '../types/entity'

export const getMenuListAll = () => {
  return axios({ method: 'GET', url: `${base}/menu/list/all` })
}
export const getMenuListByPage = (params: QueryMenu) => {
  return axios({ method: 'GET', url: `${base}/menu/list`, params })
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
