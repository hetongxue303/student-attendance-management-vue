import { useCookies } from '@vueuse/integrations/useCookies'
import { session } from './storage'
import { AUTHORIZATION_KEY, EXPIRE_TIME_KEY } from '../settings'

const cookies = useCookies()

/**
 * 获取token
 */
export const getToken = (): string => {
  return cookies.get(AUTHORIZATION_KEY)
}

/**
 * 清除token
 */
export const removeToken = () => {
  cookies.remove(AUTHORIZATION_KEY)
}

/**
 * 设置token
 * @param token
 */
export const setToken = (token: string) => {
  cookies.set(AUTHORIZATION_KEY, token)
}

/**
 * 设置token过期时间
 * @param time
 */
export const setTokenTime = (time: number) => {
  session.set(EXPIRE_TIME_KEY, time)
}

/**
 * 获取token过期时间
 */
export const getTokenTime = (): number => {
  return session.get(EXPIRE_TIME_KEY)
}

/**
 * 清除token过期时间
 */
export const removeTokenTime = () => {
  session.remove(EXPIRE_TIME_KEY)
}
