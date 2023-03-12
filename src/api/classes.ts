import axios, { base } from '../utils/request'

export const getClassesListAll = () => {
  return axios({ method: 'GET', url: `${base}/classes/list/all` })
}
export const getClassesListByPage = (params: any) => {
  return axios({ method: 'GET', url: `${base}/classes/list`, params })
}

export const addClasses = (data: any) => {
  return axios({ method: 'POST', url: `${base}/classes/add`, data })
}

export const deleteClasses = (id: number) => {
  return axios({ method: 'DELETE', url: `${base}/classes/delete/${id}` })
}

export const batchDeleteClasses = (data: number[]) => {
  return axios({ method: 'PUT', url: `${base}/classes/delete/batch`, data })
}
export const updateClasses = (data: any) => {
  return axios({ method: 'PUT', url: `${base}/classes/update`, data })
}
