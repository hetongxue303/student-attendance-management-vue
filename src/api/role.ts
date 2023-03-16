import axios, { base } from '../utils/request'
import { QueryRole } from '../types/query'
import { BORole, Role } from '../types/entity'

export const getRoleListAll = () => {
  return axios({ method: 'GET', url: `${base}/role/list/all` })
}
export const getRoleListByPage = (params: QueryRole) => {
  return axios({ method: 'GET', url: `${base}/role/list`, params })
}

export const addRole = (data: BORole) => {
  return axios({ method: 'POST', url: `${base}/role/add`, data })
}

export const deleteRole = (id: number) => {
  return axios({ method: 'DELETE', url: `${base}/role/delete/${id}` })
}

export const batchDeleteRole = (data: number[]) => {
  return axios({ method: 'PUT', url: `${base}/role/delete/batch`, data })
}
export const updateRole = (data: BORole) => {
  return axios({ method: 'PUT', url: `${base}/role/update`, data })
}
export const updateRoleStatus = (data: Role) => {
  return axios({ method: 'PUT', url: `${base}/role/update/status`, data })
}
