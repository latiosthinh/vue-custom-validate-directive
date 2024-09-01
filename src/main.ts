import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import validate from './plugins/validate'

const app = createApp(App)

app.use(router)
app.use(validate)

app.mount('#app')
