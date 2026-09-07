import { createApp } from 'vue'
import process from 'process'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'
import svgIcon from './components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'

import 'bootstrap'
import VueCookies from 'vue-cookies'
import 'ant-design-vue/dist/reset.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'
import './permission'

const app = createApp(App)
const pinia = createPinia()
app.config.globalProperties.$cookies = VueCookies

app.use(pinia)
app.use(router)
app.use(Antd)
app.component('svg-icon', svgIcon)
app.mount('#app')
