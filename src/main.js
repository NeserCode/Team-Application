import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import installElementPlus from './plugins/element'
import Codemirror from "codemirror-editor-vue3";
import Axios from 'axios'
import "codemirror-editor-vue3/dist/style.css";
import mitt from 'mitt'
import utils from './plugins/utils'
import appConfig from "./plugins/appConfig"
import leetcode from "./plugins/leetcode"

Axios.defaults.withCredentials = true;

const app = createApp(App)
installElementPlus(app)
app.config.globalProperties.$axios = Axios
app.config.globalProperties.$utils = utils
app.config.globalProperties.$conf = appConfig
app.config.globalProperties.$leetcode = leetcode
app.config.globalProperties.$public = new mitt()

app.use(router).use(Codemirror).mount('#app')

