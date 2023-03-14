import axios, { base } from '../utils/request'
import { BOCourse } from '../types/entity'
import { QueryCourse, QueryCourseMe } from '../types/query'

export const getCourseListAll = () => {
  return axios({ method: 'GET', url: `${base}/course/list/all` })
}
export const getCourseListMe = (params: QueryCourseMe) => {
  return axios({ method: 'GET', url: `${base}/course/list/me`, params })
}
export const getCourseListByPage = (params: QueryCourse) => {
  return axios({ method: 'GET', url: `${base}/course/list`, params })
}

export const addCourse = (data: BOCourse) => {
  return axios({ method: 'POST', url: `${base}/course/add`, data })
}

export const deleteCourse = (id: number) => {
  return axios({ method: 'DELETE', url: `${base}/course/delete/${id}` })
}

export const batchDeleteCourse = (data: number[]) => {
  return axios({ method: 'PUT', url: `${base}/course/delete/batch`, data })
}
export const updateCourse = (data: BOCourse) => {
  return axios({ method: 'PUT', url: `${base}/course/update`, data })
}
