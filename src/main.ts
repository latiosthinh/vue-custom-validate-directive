import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import validate from './plugins/validate'

const app = createApp(App)

app.use(validate)

app.mount('#app')
