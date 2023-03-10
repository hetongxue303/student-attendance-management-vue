import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import pinia from './store'
import ElementPlus from './plugins/element-plus'
import directive from './directive/index'

import '@assets/styles/index.scss'
import 'virtual:windi.css'
import 'animate.css'

import 'virtual:svg-icons-register'
import SvgIcon from '@components/svg-icon/index.vue'

import '@/permission'

const app = createApp(App)

app.use(router).use(pinia).use(ElementPlus).use(directive)

app.component('SvgIcon', SvgIcon)

app.mount('#app')
