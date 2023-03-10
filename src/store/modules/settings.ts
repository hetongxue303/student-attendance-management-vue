import { defineStore } from 'pinia'
import { SettingsType } from '../../types/pinia'

export const useSettingStore = defineStore('settings', {
  state: (): SettingsType => {
    return {}
  },
  getters: {},
  actions: {},
  persist: { key: 'settings' }
})
