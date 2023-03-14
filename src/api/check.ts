import axios, { base } from '../utils/request'
import { Check } from '../types/entity'
import { QueryCheck } from '../types/query'

export const getCheckListAll = () => {
  return axios({ method: 'GET', url: `${base}/check/list/all` })
}
export const getCheckListByPage = (params: QueryCheck) => {
  return axios({ method: 'GET', url: `${base}/check/list`, params })
}

export const addCheck = (data: Check) => {
  return axios({ method: 'POST', url: `${base}/check/add`, data })
}

export const deleteCheck = (id: number) => {
  return axios({ method: 'DELETE', url: `${base}/check/delete/${id}` })
}

export const batchDeleteCheck = (data: number[]) => {
  return axios({ method: 'PUT', url: `${base}/check/delete/batch`, data })
}
export const updateCheck = (data: Check) => {
  return axios({ method: 'PUT', url: `${base}/check/update`, data })
}
