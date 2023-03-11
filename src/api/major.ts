import axios, { base } from '../utils/request'

export const getMajorListAll = () => {
  return axios({ method: 'GET', url: `${base}/major/list/all` })
}
export const getMajorListByPage = (params: any) => {
  return axios({ method: 'GET', url: `${base}/major/list`, params })
}

export const addMajor = (data: any) => {
  return axios({ method: 'POST', url: `${base}/major/add`, data })
}

export const deleteMajor = (id: number) => {
  return axios({ method: 'DELETE', url: `${base}/major/delete/${id}` })
}

export const batchDeleteMajor = (data: number[]) => {
  return axios({ method: 'PUT', url: `${base}/major/delete/batch`, data })
}
export const updateMajor = (data: any) => {
  return axios({ method: 'PUT', url: `${base}/major/update`, data })
}
