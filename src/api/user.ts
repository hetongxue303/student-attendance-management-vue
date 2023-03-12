import axios, { base } from '../utils/request'
import { QueryUser } from '../types/query'
import { User } from '../types/entity'

export const getUserListAll = () => {
  return axios({ method: 'GET', url: `${base}/user/list/all` })
}
export const getUserListByPage = (params: QueryUser) => {
  return axios({ method: 'GET', url: `${base}/user/list`, params })
}

export const addUser = (data: User) => {
  return axios({ method: 'POST', url: `${base}/user/add`, data })
}

export const deleteUser = (id: number) => {
  return axios({ method: 'DELETE', url: `${base}/user/delete/${id}` })
}

export const batchDeleteUser = (data: number[]) => {
  return axios({ method: 'PUT', url: `${base}/user/delete/batch`, data })
}
export const updateUser = (data: User) => {
  return axios({ method: 'PUT', url: `${base}/user/update`, data })
}
