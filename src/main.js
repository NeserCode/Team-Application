import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import installElementPlus from './plugins/element'
import Codemirror from "codemirror-editor-vue3";
import Axios from 'axios'
import "codemirror-editor-vue3/dist/style.css";
import mitt from 'mitt'


const app = createApp(App)
installElementPlus(app)
app.config.globalProperties.$axios = Axios
app.config.globalProperties.$public = new mitt()
app.use(router).use(Codemirror).mount('#app')