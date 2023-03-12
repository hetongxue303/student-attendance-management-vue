import axios, { base } from '../utils/request'
import { College } from '../types/entity'
import { QueryCollege } from '../types/query'

export const getCollegeListAll = () => {
  return axios({ method: 'GET', url: `${base}/college/list/all` })
}
export const getCollegeListByPage = (params: QueryCollege) => {
  return axios({ method: 'GET', url: `${base}/college/list`, params })
}

export const addCollege = (data: College) => {
  return axios({ method: 'POST', url: `${base}/college/add`, data })
}

export const deleteCollege = (id: number) => {
  return axios({ method: 'DELETE', url: `${base}/college/delete/${id}` })
}

export const batchDeleteCollege = (data: number[]) => {
  return axios({ method: 'PUT', url: `${base}/college/delete/batch`, data })
}
export const updateCollege = (data: College) => {
  return axios({ method: 'PUT', url: `${base}/college/update`, data })
}
