import { defineStore } from 'pinia'
import { TabsType } from '../../types/pinia'

export const useTabStore = defineStore('tabs', {
  state: (): TabsType => {
    return {
      tabs: [{ title: '首页', path: '/dashboard' }],
      activeName: '',
      currentTabName: '',
      isContextMenu: false
    }
  },
  getters: {
    getTabs: (state) => state.tabs,
    getActiveName: (state) => state.activeName,
    getCurrentTabName: (state) => state.currentTabName,
    getIsContextMenu: (state) => state.isContextMenu
  },
  actions: {
    addTab(tab: any) {
      if (this.tabs.some((item) => item.path === tab.path)) return
      this.tabs.push(tab)
    }
  },
  persist: { key: 'tabs' }
})
