import { Router } from 'vue-router'

/**
 * 设置浏览器标题
 * @param router vue路由
 */
export const setBrowserTitle = (router: Router) => {
  if (typeof router.currentRoute.value.meta.title === 'string') {
    document.title = router.currentRoute.value.meta.title as string
  }
}

/**
 * 生成范围随机数
 * @param min 最小值
 * @param max 最大值
 */
export const randomNumber = (
  min: number | undefined,
  max: number | undefined
): number | undefined => {
  if (min === undefined || max === undefined) return undefined
  return (
    Math.floor(Math.random() * ((max as number) - (min as number))) +
    (min as number)
  )
}

/**
 * 延时请求
 * @param callback 请求回调
 * @param min 最小范围
 * @param max 最大范围
 */
export const delayRequest = (
  callback: () => void,
  min?: number,
  max?: number
) => {
  setTimeout(async () => {
    callback()
  }, randomNumber(min, max))
}
