import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useRoute } from 'vue-router'
import './assets/tailwind.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Axios from 'axios'
import mitt from 'mitt'
import utils from './plugins/utils'
import appConfig from "./plugins/appConfig"
import leetcode from "./plugins/leetcode"

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

Axios.defaults.withCredentials = true;

const app = createApp(App)
const mitter = new mitt()

app.config.unwrapInjectedRef = true

app.config.globalProperties.$axios = Axios
app.config.globalProperties.$utils = utils
app.config.globalProperties.$conf = appConfig
app.config.globalProperties.$leetcode = leetcode
app.config.globalProperties.$public = mitter
app.config.globalProperties.$router = router
app.config.globalProperties.$route = useRoute()

app.provide('$axios', Axios)
app.provide('$utils', utils)
app.provide('$conf', appConfig)
app.provide('$leetcode', leetcode)
app.provide('$public', mitter)
app.provide('$router', router)
app.provide('$route', useRoute())

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// Router meta 信息替换
router.beforeEach((to, from, next) => { if (to.meta.title) document.title = to.meta.title; next() })

app.use(router).use(ElementPlus).mount('#app')

