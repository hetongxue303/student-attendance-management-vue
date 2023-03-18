import axios, { base } from '../utils/request'
import { QueryChoice } from '../types/query'
import { Choice, VOChoice } from '../types/entity'

export const getChoiceListAll = () => {
  return axios({ method: 'GET', url: `${base}/choice/list/all` })
}
export const getChoiceListByPage = (params: QueryChoice) => {
  return axios({ method: 'GET', url: `${base}/choice/list`, params })
}

export const addChoice = (data: Choice) => {
  return axios({ method: 'POST', url: `${base}/choice/add`, data })
}

export const deleteChoice = (id: number) => {
  return axios({ method: 'DELETE', url: `${base}/choice/delete/${id}` })
}

export const batchDeleteChoice = (data: number[]) => {
  return axios({ method: 'PUT', url: `${base}/choice/delete/batch`, data })
}
export const updateChoice = (data: Choice) => {
  return axios({ method: 'PUT', url: `${base}/choice/update`, data })
}
export const updateChoiceStatus = (data: Choice) => {
  return axios({ method: 'PUT', url: `${base}/choice/update/status`, data })
}
export const updateBatchChoiceStatus = (data: VOChoice) => {
  return axios({
    method: 'PUT',
    url: `${base}/choice/update/status/batch`,
    data
  })
}
