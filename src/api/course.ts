import axios, { base } from '../utils/request'
import { Course } from '../types/entity'
import { QueryCourse } from '../types/query'

export const getCourseListAll = () => {
  return axios({ method: 'GET', url: `${base}/course/list/all` })
}
export const getCourseListByPage = (params: QueryCourse) => {
  return axios({ method: 'GET', url: `${base}/course/list`, params })
}

export const addCourse = (data: Course) => {
  return axios({ method: 'POST', url: `${base}/course/add`, data })
}

export const deleteCourse = (id: number) => {
  return axios({ method: 'DELETE', url: `${base}/course/delete/${id}` })
}

export const batchDeleteCourse = (data: number[]) => {
  return axios({ method: 'PUT', url: `${base}/course/delete/batch`, data })
}
export const updateCourse = (data: Course) => {
  return axios({ method: 'PUT', url: `${base}/course/update`, data })
}
