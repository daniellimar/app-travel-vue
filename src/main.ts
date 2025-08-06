import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from 'pinia'

import '@/assets/css/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import Vue3Toastify, {type ToastContainerOptions} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  pauseOnHover: true,
  theme: 'colored'
} as ToastContainerOptions)

app.mount('#app')
