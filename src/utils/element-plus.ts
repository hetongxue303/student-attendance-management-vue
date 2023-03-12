import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { DURATION_TIME } from '../settings'

export const NotificationSuccess = (
  message: string,
  duration: number = DURATION_TIME
) => ElNotification.success({ message, duration })
export const NotificationError = (
  message: string,
  duration: number = DURATION_TIME
) => ElNotification.error({ message, duration })
export const NotificationWarning = (
  message: string,
  duration: number = DURATION_TIME
) => ElNotification.warning({ message, duration })
export const NotificationInfo = (
  message: string,
  duration: number = DURATION_TIME
) => ElNotification.info({ message, duration })
export const MessageSuccess = (
  message: string,
  duration: number = DURATION_TIME
) => ElMessage.success({ message, duration })
export const MessageError = (
  message: string,
  duration: number = DURATION_TIME
) => ElMessage.error({ message, duration })
export const MessageWarning = (
  message: string,
  duration: number = DURATION_TIME
) => ElMessage.warning({ message, duration })
export const MessageInfo = (
  message: string,
  duration: number = DURATION_TIME
) => ElMessage.info({ message, duration })

/**
 * 确认框
 * @param text 文本
 * @param tip 提示
 * @param success 成功回调
 * @param error 失败回调
 * @param confirmText 确认按钮文本
 * @param cancelText 返回按钮文本
 */
export const ConfirmBox = (
  text: string,
  tip: string,
  success: () => void,
  error?: () => void,
  confirmText = '确认',
  cancelText = '返回'
) => {
  ElMessageBox.confirm(text, tip, {
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    type: 'warning'
  })
    .then(() => success())
    .catch(() => (error ? error() : null))
}
