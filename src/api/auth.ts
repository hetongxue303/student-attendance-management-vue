import * as qs from 'qs'
import axios, { base } from '../utils/request'

export const login = (data: any) => {
  return axios({
    method: 'POST',
    url: `${base}/login`,
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const logout = () => {
  return axios({
    method: 'GET',
    url: `${base}/logout`
  })
}

export const getCaptcha = () => {
  return axios({
    method: 'GET',
    url: `${base}/captcha-image`
  })
}
