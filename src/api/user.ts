import axios, { base } from '../utils/request'
import { QueryUser } from '../types/query'
import { BOUser, User } from '../types/entity'
import { useUserStore } from '../store/modules/user'
import { MessageWarning } from '../utils/element-plus'

export const getUserListAll = () => {
  return axios({ method: 'GET', url: `${base}/user/list/all` })
}
export const getTeacherListAll = () => {
  return axios({
    method: 'GET',
    url: `${base}/user/list/teacher`,
    params: { username: useUserStore().getUsername }
  })
}
export const getUserListByPage = (params: QueryUser) => {
  return axios({ method: 'GET', url: `${base}/user/list`, params })
}
export const getUserListByPageCourseById = (params: QueryUser) => {
  return axios({ method: 'GET', url: `${base}/user/list/courseById`, params })
}

export const addUser = (data: BOUser) => {
  return axios({ method: 'POST', url: `${base}/user/add`, data })
}

export const deleteUser = (id: number) => {
  return axios({ method: 'DELETE', url: `${base}/user/delete/${id}` })
}

export const batchDeleteUser = (data: number[]) => {
  return axios({ method: 'PUT', url: `${base}/user/delete/batch`, data })
}
export const updateUser = (data: BOUser) => {
  return axios({ method: 'PUT', url: `${base}/user/update`, data })
}
