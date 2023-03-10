import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'
import { PRIVATE_KEY, PUBLIC_KEY } from '../settings'

/**
 * 文本加密
 *
 * @param text 明文
 */
export const encrypt = (text: string): string => {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(PUBLIC_KEY)
  return encryptor.encrypt(text)
}

/**
 * 文本解密
 *
 * @param text 密文
 */
export const decrypt = (text: string): string => {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(PRIVATE_KEY)
  return encryptor.decrypt(text)
}
