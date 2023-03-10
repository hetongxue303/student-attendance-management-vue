import md5 from 'js-md5'

/**
 * 前端返回后端密码加密算法
 * @param password 密码
 */
export const encryptPasswordToMD5 = (password: string): string => {
  return md5(md5(password).split('').reverse().join(''))
}
