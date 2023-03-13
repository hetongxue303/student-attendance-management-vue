import axios, { base } from '../utils/request'
import { QueryClasses } from '../types/query'
import { Classes } from '../types/entity'

export const getClassesListAll = () => {
  return axios({ method: 'GET', url: `${base}/classes/list/all` })
}
export const getClassesListByPage = (params: QueryClasses) => {
  return axios({ method: 'GET', url: `${base}/classes/list`, params })
}

export const getClassesListByMajorID = (major_id: number) => {
  return axios({ method: 'GET', url: `${base}/classes/major_id/${major_id}` })
}

export const addClasses = (data: Classes) => {
  return axios({ method: 'POST', url: `${base}/classes/add`, data })
}

export const deleteClasses = (id: number) => {
  return axios({ method: 'DELETE', url: `${base}/classes/delete/${id}` })
}

export const batchDeleteClasses = (data: number[]) => {
  return axios({ method: 'PUT', url: `${base}/classes/delete/batch`, data })
}
export const updateClasses = (data: Classes) => {
  return axios({ method: 'PUT', url: `${base}/classes/update`, data })
}
