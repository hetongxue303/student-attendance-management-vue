import axios, { base } from '../utils/request'
import { Attendance } from '../types/entity'
import { QueryAttendance } from '../types/query'

export const getAttendanceListAll = () => {
  return axios({
    method: 'GET',
    url: `http://127.0.0.1:8181/attendance/list/all`
  })
}
export const getAttendanceListByPage = (params: QueryAttendance) => {
  return axios({ method: 'GET', url: `${base}/attendance/list`, params })
}

export const addAttendance = (data: Attendance) => {
  return axios({ method: 'POST', url: `${base}/attendance/add`, data })
}

export const deleteAttendance = (id: number) => {
  return axios({ method: 'DELETE', url: `${base}/attendance/delete/${id}` })
}

export const batchDeleteAttendance = (data: number[]) => {
  return axios({ method: 'PUT', url: `${base}/attendance/delete/batch`, data })
}
export const updateAttendance = (data: Attendance) => {
  return axios({ method: 'PUT', url: `${base}/attendance/update`, data })
}
export const updateAttendanceStatus = (data: Attendance) => {
  return axios({ method: 'PUT', url: `${base}/attendance/update/status`, data })
}
export const updateBatchAttendanceStatus = (data: number[]) => {
  return axios({
    method: 'PUT',
    url: `${base}/attendance/update/status/batch`,
    data
  })
}
