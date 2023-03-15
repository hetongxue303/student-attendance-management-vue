import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import { getToken } from './auth'
import NProgress from '../plugins/nProgress'
import { useUserStore } from '../store/modules/user'

export const base: string = import.meta.env.VITE_BASIC_API

axios.create({
  baseURL: import.meta.env.VITE_BASIC_HTTP,
  timeout: 10 * 1000,
  withCredentials: true,
  timeoutErrorMessage: 'timeout',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})
axios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    NProgress.start()
    if (getToken() && config.headers) {
      // TODO 判断token是否快要过期
      config.headers.authorization = getToken()
    }
    return config
  },
  (error: AxiosError) => {
    ElNotification.error('请求异常')
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  async (response: AxiosResponse) => {
    NProgress.done()
    return response
  },
  async (error: AxiosError) => {
    const { response } = error
    if (response?.status === 500) ElMessage.error('服务器异常')
    if (response?.status === 401) {
      ElMessage.error('登录过期')
      window.location.replace('/login')
      useUserStore().systemLogout()
    }
    return Promise.reject(error)
  }
)

export default axios
